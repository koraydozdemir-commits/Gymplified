-- Local test for 20261111120000_gymplified_deluxe_entitlements.sql and 20261111130000_gymplified_admin_deluxe_toggle.sql on an EMPTY Postgres 16 database.
-- Usage: psql -v ON_ERROR_STOP=1 -f supabase/tests/deluxe_entitlements.sql
\set QUIET on
\pset tuples_only on
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN CREATE ROLE anon NOLOGIN; END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN CREATE ROLE authenticated NOLOGIN; END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') THEN CREATE ROLE service_role NOLOGIN; END IF;
END $$;
CREATE SCHEMA auth;
CREATE TABLE auth.users (id uuid PRIMARY KEY);
CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$ SELECT nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
GRANT USAGE ON SCHEMA auth TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION auth.uid() TO anon, authenticated, service_role;
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
\ir ../migrations/20261111120000_gymplified_deluxe_entitlements.sql
\ir ../migrations/20261111130000_gymplified_admin_deluxe_toggle.sql
INSERT INTO auth.users VALUES ('00000000-0000-0000-0000-00000000000a'), ('00000000-0000-0000-0000-00000000000b'), ('00000000-0000-0000-0000-0000000000ad');
CREATE FUNCTION pg_temp.expect_error(p_sql text, p_like text) RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  EXECUTE p_sql;
  RAISE EXCEPTION 'expected an error for: %', p_sql;
EXCEPTION WHEN OTHERS THEN
  IF SQLERRM LIKE 'expected an error%' OR SQLERRM NOT ILIKE p_like THEN RAISE EXCEPTION 'unexpected result for %: %', p_sql, SQLERRM; END IF;
END $$;

-- a signed-in user cannot grant themselves Deluxe, in any way
SET ROLE authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-00000000000a', false);
DO $$ BEGIN ASSERT NOT (public.gymplified_my_entitlement() ->> 'deluxe')::boolean, 'nobody owns Deluxe yet'; END $$;
SELECT pg_temp.expect_error($q$SELECT public.gymplified_grant_deluxe('00000000-0000-0000-0000-00000000000a', 'admin', NULL, NULL, 999, 'eur')$q$, '%permission denied%');
SELECT pg_temp.expect_error($q$INSERT INTO public.deluxe_entitlements (user_id, source) VALUES ('00000000-0000-0000-0000-00000000000a', 'admin')$q$, '%permission denied%');
SELECT pg_temp.expect_error($q$SELECT public.gymplified_revoke_deluxe_by_payment('pi_123')$q$, '%permission denied%');
RESET ROLE;
SET ROLE anon;
SELECT pg_temp.expect_error($q$SELECT public.gymplified_my_entitlement()$q$, '%permission denied%');
RESET ROLE;

-- the payment functions (service role) grant, re-grant idempotently and revoke on refund
SET ROLE service_role;
SELECT public.gymplified_grant_deluxe('00000000-0000-0000-0000-00000000000a', 'stripe_checkout', 'pi_ABC123', 'cs_test_1', 999, 'EUR');
SELECT public.gymplified_grant_deluxe('00000000-0000-0000-0000-00000000000a', 'stripe_checkout', 'pi_ABC123', 'cs_test_1', 999, 'eur');
SELECT pg_temp.expect_error($q$SELECT public.gymplified_grant_deluxe('00000000-0000-0000-0000-0000000000ff', 'stripe_checkout', 'pi_X', NULL, 999, 'eur')$q$, '%Unknown account%');
SELECT pg_temp.expect_error($q$SELECT public.gymplified_grant_deluxe('00000000-0000-0000-0000-00000000000b', 'stripe_checkout', 'not a pi', NULL, 999, 'eur')$q$, '%check constraint%');
RESET ROLE;
SET ROLE authenticated;
DO $$ BEGIN ASSERT (public.gymplified_my_entitlement() ->> 'deluxe')::boolean, 'a owns Deluxe'; END $$;
DO $$ BEGIN ASSERT (SELECT count(*) FROM public.deluxe_entitlements) = 1, 'a sees only their own row'; END $$;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-00000000000b', false);
DO $$ BEGIN ASSERT NOT (public.gymplified_my_entitlement() ->> 'deluxe')::boolean, 'b does not'; ASSERT (SELECT count(*) FROM public.deluxe_entitlements) = 0, 'b cannot see a''s row'; END $$;
RESET ROLE;
SET ROLE service_role;
DO $$ BEGIN ASSERT public.gymplified_revoke_deluxe_by_payment('pi_ABC123') = 1, 'refund revokes'; ASSERT public.gymplified_revoke_deluxe_by_payment('pi_ABC123') = 0, 'second refund event is a no-op'; END $$;
RESET ROLE;
SET ROLE authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-00000000000a', false);
DO $$ BEGIN ASSERT NOT (public.gymplified_my_entitlement() ->> 'deluxe')::boolean, 'revoked after a full refund'; END $$;
RESET ROLE;
SET ROLE service_role;
SELECT public.gymplified_grant_deluxe('00000000-0000-0000-0000-00000000000a', 'stripe_restore', 'pi_NEW999', NULL, 999, 'eur');
RESET ROLE;
SET ROLE authenticated;
DO $$ BEGIN ASSERT (public.gymplified_my_entitlement() ->> 'deluxe')::boolean, 'a new payment restores it'; END $$;
RESET ROLE;

-- admin toggle: only the service role (behind the admin allowlist check) can call it
SET ROLE authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-0000000000ad', false);
SELECT pg_temp.expect_error($q$SELECT public.gymplified_admin_set_deluxe('00000000-0000-0000-0000-00000000000b', true, '00000000-0000-0000-0000-0000000000ad')$q$, '%permission denied%');
RESET ROLE;
SET ROLE anon;
SELECT pg_temp.expect_error($q$SELECT public.gymplified_admin_set_deluxe('00000000-0000-0000-0000-00000000000b', true, '00000000-0000-0000-0000-0000000000ad')$q$, '%permission denied%');
RESET ROLE;
SET ROLE service_role;
DO $$ DECLARE r jsonb; BEGIN
  r := public.gymplified_admin_set_deluxe('00000000-0000-0000-0000-00000000000b', false, '00000000-0000-0000-0000-0000000000ad');
  ASSERT NOT (r ->> 'deluxe')::boolean, 'removing Deluxe from someone without it is a harmless no-op';
  r := public.gymplified_admin_set_deluxe('00000000-0000-0000-0000-00000000000b', true, '00000000-0000-0000-0000-0000000000ad');
  ASSERT (r ->> 'deluxe')::boolean AND r ->> 'source' = 'admin' AND NOT (r ->> 'paid')::boolean, 'admin grant';
  r := public.gymplified_admin_set_deluxe('00000000-0000-0000-0000-00000000000b', true, '00000000-0000-0000-0000-0000000000ad');
  ASSERT (r ->> 'deluxe')::boolean, 'granting twice is idempotent';
  r := public.gymplified_admin_set_deluxe('00000000-0000-0000-0000-00000000000b', false, '00000000-0000-0000-0000-0000000000ad');
  ASSERT NOT (r ->> 'deluxe')::boolean AND r ->> 'revoked_at' IS NOT NULL, 'admin removal';
  -- a paying customer's record keeps its source and payment details through an admin off/on
  r := public.gymplified_admin_set_deluxe('00000000-0000-0000-0000-00000000000a', false, '00000000-0000-0000-0000-0000000000ad');
  ASSERT NOT (r ->> 'deluxe')::boolean, 'admin can remove a paid entitlement';
  r := public.gymplified_admin_set_deluxe('00000000-0000-0000-0000-00000000000a', true, '00000000-0000-0000-0000-0000000000ad');
  ASSERT (r ->> 'deluxe')::boolean AND r ->> 'source' = 'stripe_restore' AND (r ->> 'paid')::boolean, 'paid record is not overwritten';
END $$;
SELECT pg_temp.expect_error($q$SELECT public.gymplified_admin_set_deluxe('00000000-0000-0000-0000-0000000000ff', true, '00000000-0000-0000-0000-0000000000ad')$q$, '%Unknown account%');
SELECT pg_temp.expect_error($q$SELECT public.gymplified_admin_set_deluxe('00000000-0000-0000-0000-00000000000b', true, NULL)$q$, '%Unknown admin%');
RESET ROLE;
DO $$ BEGIN ASSERT (SELECT changed_by FROM public.deluxe_entitlements WHERE user_id = '00000000-0000-0000-0000-00000000000b') = '00000000-0000-0000-0000-0000000000ad', 'the admin who made the change is recorded'; END $$;
SET ROLE authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-00000000000b', false);
DO $$ BEGIN ASSERT NOT (public.gymplified_my_entitlement() ->> 'deluxe')::boolean, 'b sees the admin removal'; END $$;
RESET ROLE;
\echo deluxe entitlement tests passed
