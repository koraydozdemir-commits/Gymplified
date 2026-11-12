-- Local test for 20261112090000_gymplified_deluxe_growth.sql (founders, friend badges, friend challenges).
-- Runs against a throwaway Postgres 16 with stand-ins for the parts of Supabase it relies on.
-- Usage: psql -v ON_ERROR_STOP=1 -f supabase/tests/deluxe_growth.sql  (on an EMPTY database)
\set QUIET on
\pset format unaligned
\pset tuples_only on

-- ---------- Supabase stand-ins ----------
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN CREATE ROLE anon NOLOGIN; END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN CREATE ROLE authenticated NOLOGIN; END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') THEN CREATE ROLE service_role NOLOGIN; END IF;
END $$;
CREATE SCHEMA auth;
CREATE TABLE auth.users (id uuid PRIMARY KEY);
CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE
  AS $$ SELECT nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
GRANT USAGE ON SCHEMA auth TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION auth.uid() TO anon, authenticated, service_role;
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
CREATE TABLE public.profiles (id uuid PRIMARY KEY REFERENCES auth.users(id), username text UNIQUE, display_name text, avatar_url text);
CREATE TABLE public.friend_requests (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), requester_id uuid REFERENCES auth.users(id), receiver_id uuid REFERENCES auth.users(id), status text NOT NULL DEFAULT 'pending');
CREATE TABLE public.user_app_state (user_id uuid PRIMARY KEY REFERENCES auth.users(id), state jsonb);
ALTER TABLE public.user_app_state ENABLE ROW LEVEL SECURITY;
CREATE POLICY own_state ON public.user_app_state FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
GRANT SELECT, INSERT, UPDATE ON public.user_app_state TO authenticated;
GRANT SELECT ON public.profiles, public.friend_requests TO authenticated;

\ir ../migrations/20261111090000_gymplified_friend_leaderboard_feed_and_reactions.sql
\ir ../migrations/20261111120000_gymplified_deluxe_entitlements.sql
\ir ../migrations/20261111130000_gymplified_admin_deluxe_toggle.sql
\ir ../migrations/20261112090000_gymplified_deluxe_growth.sql

-- ---------- fixtures ----------
-- a = Deluxe founder, friends with b, c and f. b = free, friends with a. c = Deluxe (bought after the
-- deadline), friends with a and b, badge hidden. d = stranger. f = friend of a only, hides volume.
CREATE TEMP TABLE ids AS SELECT * FROM (VALUES
  ('a', '00000000-0000-0000-0000-00000000000a'::uuid), ('b', '00000000-0000-0000-0000-00000000000b'::uuid),
  ('c', '00000000-0000-0000-0000-00000000000c'::uuid), ('d', '00000000-0000-0000-0000-00000000000d'::uuid),
  ('f', '00000000-0000-0000-0000-00000000000f'::uuid)) v(k, id);
GRANT SELECT ON ids TO authenticated, service_role;
CREATE FUNCTION pg_temp.u(p_k text) RETURNS uuid LANGUAGE sql STABLE AS $$ SELECT id FROM ids WHERE k = p_k $$;
INSERT INTO auth.users SELECT id FROM ids;
INSERT INTO public.profiles (id, username, display_name) SELECT id, 'user_' || k, 'User ' || upper(k) FROM ids;
INSERT INTO public.friend_requests (requester_id, receiver_id, status) VALUES
  (pg_temp.u('a'), pg_temp.u('b'), 'accepted'), (pg_temp.u('a'), pg_temp.u('c'), 'accepted'),
  (pg_temp.u('c'), pg_temp.u('b'), 'accepted'), (pg_temp.u('f'), pg_temp.u('a'), 'accepted'),
  (pg_temp.u('a'), pg_temp.u('d'), 'pending');
INSERT INTO public.user_app_state (user_id, state) VALUES
  (pg_temp.u('a'), jsonb_build_object('sessions', jsonb_build_array(
     jsonb_build_object('date', current_date::text, 'vol', 1000), jsonb_build_object('date', (current_date - 1)::text, 'vol', 500),
     jsonb_build_object('date', (current_date - 30)::text, 'vol', 9999)))),
  (pg_temp.u('b'), jsonb_build_object('sessions', jsonb_build_array(jsonb_build_object('date', current_date::text, 'vol', 2000)))),
  (pg_temp.u('c'), jsonb_build_object('deluxe', jsonb_build_object('profileFlair', false), 'sessions', '[]'::jsonb)),
  (pg_temp.u('f'), jsonb_build_object('privacy', jsonb_build_object('volume', false), 'sessions', jsonb_build_array(jsonb_build_object('date', current_date::text, 'vol', 700))));

CREATE FUNCTION pg_temp.expect_error(p_sql text, p_like text) RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  EXECUTE p_sql;
  RAISE EXCEPTION 'expected an error for: %', p_sql;
EXCEPTION WHEN OTHERS THEN
  IF SQLERRM LIKE 'expected an error%' OR SQLERRM NOT ILIKE p_like THEN RAISE EXCEPTION 'unexpected result for %: %', p_sql, SQLERRM; END IF;
END $$;
CREATE FUNCTION pg_temp.as_user(p_k text) RETURNS void LANGUAGE sql AS $$ SELECT set_config('request.jwt.claim.sub', (SELECT id::text FROM ids WHERE k = p_k), false) $$;

-- ---------- 1. founders ----------
SET ROLE service_role;
SELECT public.gymplified_grant_deluxe(pg_temp.u('a'), 'stripe_checkout', 'pi_A1', NULL, 999, 'eur');
SELECT public.gymplified_grant_deluxe(pg_temp.u('c'), 'stripe_checkout', 'pi_C1', NULL, 999, 'eur');
RESET ROLE;
UPDATE public.deluxe_entitlements SET granted_at = now() - interval '10 days' WHERE user_id = pg_temp.u('a');
SET ROLE authenticated;
SELECT pg_temp.as_user('a');
DO $$ BEGIN
  ASSERT NOT (public.gymplified_my_entitlement() ->> 'founder')::boolean, 'nobody is a founder until a deadline is set';
  ASSERT public.gymplified_my_entitlement() -> 'founder_until' = 'null'::jsonb, 'no founder offer without a deadline';
END $$;
SELECT pg_temp.expect_error($q$UPDATE public.deluxe_settings SET founder_until = now()$q$, '%permission denied%');
SELECT pg_temp.expect_error($q$SELECT public.gymplified_is_founder(auth.uid())$q$, '%permission denied%');
RESET ROLE;
UPDATE public.deluxe_settings SET founder_until = now() - interval '1 day' WHERE id = 1;
SET ROLE authenticated;
DO $$ BEGIN
  ASSERT (public.gymplified_my_entitlement() ->> 'founder')::boolean, 'a bought before the deadline';
  ASSERT public.gymplified_my_entitlement() -> 'founder_until' = 'null'::jsonb, 'a passed deadline is not advertised';
  ASSERT (public.gymplified_my_entitlement() ->> 'deluxe')::boolean, 'the original fields are still there';
END $$;
SELECT pg_temp.as_user('c');
DO $$ BEGIN ASSERT NOT (public.gymplified_my_entitlement() ->> 'founder')::boolean, 'c bought after the deadline'; END $$;
RESET ROLE;
UPDATE public.deluxe_settings SET founder_until = now() + interval '20 days' WHERE id = 1;
SET ROLE authenticated;
DO $$ BEGIN ASSERT public.gymplified_my_entitlement() ->> 'founder_until' IS NOT NULL, 'an open deadline is shown to buyers'; END $$;
RESET ROLE;
UPDATE public.deluxe_settings SET founder_until = now() - interval '1 day' WHERE id = 1;

-- ---------- 2. friend badges ----------
SET ROLE authenticated;
SELECT pg_temp.as_user('b');
DO $$ DECLARE r text; BEGIN
  SELECT string_agg(p.username || ':' || x.badge, ',' ORDER BY p.username) INTO r FROM public.gymplified_friend_badges() x JOIN public.profiles p ON p.id = x.user_id;
  ASSERT r = 'user_a:founder', 'b sees a as a founder; c hid the badge; b has none: ' || COALESCE(r, '<none>');
END $$;
SELECT pg_temp.as_user('d');
DO $$ BEGIN ASSERT NOT EXISTS (SELECT 1 FROM public.gymplified_friend_badges()), 'strangers and pending requests see nothing'; END $$;
RESET ROLE;
SET ROLE anon;
SELECT pg_temp.expect_error($q$SELECT * FROM public.gymplified_friend_badges()$q$, '%permission denied%');
RESET ROLE;

-- ---------- 3. challenges ----------
SET ROLE authenticated;
SELECT pg_temp.as_user('b');
SELECT pg_temp.expect_error(format($q$SELECT public.gymplified_create_challenge('Week sprint', 'workouts', 3, current_date, current_date + 6, ARRAY[%L]::uuid[])$q$, pg_temp.u('a')), '%part of Gymplified Deluxe%');
SELECT pg_temp.as_user('a');
SELECT pg_temp.expect_error(format($q$SELECT public.gymplified_create_challenge('Sprint', 'workouts', 3, current_date, current_date + 6, ARRAY[%L]::uuid[])$q$, pg_temp.u('d')), '%only invite your friends%');
SELECT pg_temp.expect_error(format($q$SELECT public.gymplified_create_challenge('Sprint', 'workouts', 3, current_date, current_date + 90, ARRAY[%L]::uuid[])$q$, pg_temp.u('b')), '%up to nine weeks%');
SELECT pg_temp.expect_error(format($q$SELECT public.gymplified_create_challenge('Sprint', 'steps', 3, current_date, current_date + 6, ARRAY[%L]::uuid[])$q$, pg_temp.u('b')), '%Unknown challenge type%');
SELECT pg_temp.expect_error(format($q$SELECT public.gymplified_create_challenge('Sprint', 'workouts', 500, current_date, current_date + 6, ARRAY[%L]::uuid[])$q$, pg_temp.u('b')), '%realistic target%');
SELECT pg_temp.expect_error($q$SELECT public.gymplified_create_challenge('Sprint', 'workouts', 3, current_date, current_date + 6, ARRAY[]::uuid[])$q$, '%between 1 and 20%');
SELECT pg_temp.expect_error(format($q$SELECT public.gymplified_create_challenge('   ', 'workouts', 3, current_date, current_date + 6, ARRAY[%L]::uuid[])$q$, pg_temp.u('b')), '%name of up to 60%');
SELECT pg_temp.expect_error($q$INSERT INTO public.friend_challenges (creator_id, title, metric, target, starts_on, ends_on) VALUES (auth.uid(), 'x', 'workouts', 1, current_date, current_date)$q$, '%permission denied%');
CREATE TEMP TABLE ch (k text, id uuid);
GRANT SELECT, INSERT ON ch TO authenticated;
INSERT INTO ch SELECT 'w', public.gymplified_create_challenge(E'Week\tsprint', 'workouts', 3, current_date - 1, current_date + 6, ARRAY[pg_temp.u('b'), pg_temp.u('f'), pg_temp.u('a')]);
INSERT INTO ch SELECT 'v', public.gymplified_create_challenge('Volume month', 'volume', 10000, current_date, current_date + 30, ARRAY[pg_temp.u('b'), pg_temp.u('c'), pg_temp.u('f')]);
DO $$ DECLARE r record; BEGIN
  SELECT * INTO r FROM public.gymplified_my_challenges() x WHERE x.id = (SELECT id FROM ch WHERE k = 'w');
  ASSERT r.title = 'Week sprint' AND r.is_creator AND r.joined, 'control characters are cleaned and the creator has joined';
  ASSERT jsonb_array_length(r.members) = 3 AND r.others = 0, 'a sees every member: all are friends';
  ASSERT (SELECT (m ->> 'progress')::numeric FROM jsonb_array_elements(r.members) m WHERE (m ->> 'is_self')::boolean) = 2, 'a has two workouts in range';
  ASSERT (SELECT m -> 'progress' FROM jsonb_array_elements(r.members) m WHERE m ->> 'username' = 'user_b') = 'null'::jsonb, 'invited but not joined has no progress';
END $$;
-- a free friend joins, and only sees friends by name
SELECT pg_temp.as_user('b');
DO $$ BEGIN ASSERT NOT (SELECT x.joined FROM public.gymplified_my_challenges() x WHERE x.id = (SELECT id FROM ch WHERE k = 'w')), 'b is invited'; END $$;
DO $$ BEGIN ASSERT public.gymplified_respond_challenge((SELECT id FROM ch WHERE k = 'w'), true), 'free accounts can join'; END $$;
DO $$ DECLARE r record; BEGIN
  SELECT * INTO r FROM public.gymplified_my_challenges() x WHERE x.id = (SELECT id FROM ch WHERE k = 'w');
  ASSERT r.joined AND NOT r.is_creator, 'b joined';
  ASSERT jsonb_array_length(r.members) = 2 AND r.others = 1, 'b is not friends with f, so f is counted, not named';
  ASSERT NOT EXISTS (SELECT 1 FROM jsonb_array_elements(r.members) m WHERE m ->> 'username' = 'user_f'), 'f stays anonymous to b';
  ASSERT (SELECT (m ->> 'progress')::numeric FROM jsonb_array_elements(r.members) m WHERE (m ->> 'is_self')::boolean) = 1, 'b has one workout';
END $$;
SELECT pg_temp.expect_error(format($q$SELECT public.gymplified_delete_challenge(%L)$q$, (SELECT id FROM ch WHERE k = 'w')), '%Only the person who started%');
-- volume honours privacy
SELECT pg_temp.as_user('f');
SELECT public.gymplified_respond_challenge((SELECT id FROM ch WHERE k = 'v'), true);
SELECT pg_temp.as_user('a');
DO $$ DECLARE r record; BEGIN
  SELECT * INTO r FROM public.gymplified_my_challenges() x WHERE x.id = (SELECT id FROM ch WHERE k = 'v');
  ASSERT (SELECT m -> 'progress' FROM jsonb_array_elements(r.members) m WHERE m ->> 'username' = 'user_f') = 'null'::jsonb, 'f hides volume';
  ASSERT (SELECT (m ->> 'progress')::numeric FROM jsonb_array_elements(r.members) m WHERE (m ->> 'is_self')::boolean) = 1000, 'only sessions from the start date count (yesterday and last month do not)';
END $$;
-- strangers see nothing; declining removes you; the creator cannot leave
SELECT pg_temp.as_user('d');
DO $$ BEGIN ASSERT NOT EXISTS (SELECT 1 FROM public.gymplified_my_challenges()), 'd was never invited'; END $$;
SELECT pg_temp.expect_error(format($q$SELECT public.gymplified_respond_challenge(%L, true)$q$, (SELECT id FROM ch WHERE k = 'w')), '%Challenge not found%');
SELECT pg_temp.as_user('c');
DO $$ BEGIN ASSERT NOT public.gymplified_respond_challenge((SELECT id FROM ch WHERE k = 'v'), false), 'c declines'; ASSERT NOT EXISTS (SELECT 1 FROM public.gymplified_my_challenges()), 'and it is gone for c'; END $$;
SELECT pg_temp.as_user('a');
SELECT pg_temp.expect_error(format($q$SELECT public.gymplified_respond_challenge(%L, false)$q$, (SELECT id FROM ch WHERE k = 'w')), '%delete it instead%');
-- at most five running challenges per creator
INSERT INTO ch SELECT 'x', public.gymplified_create_challenge('C3', 'workouts', 2, current_date, current_date + 3, ARRAY[pg_temp.u('b')]);
INSERT INTO ch SELECT 'x', public.gymplified_create_challenge('C4', 'workouts', 2, current_date, current_date + 3, ARRAY[pg_temp.u('b')]);
INSERT INTO ch SELECT 'x', public.gymplified_create_challenge('C5', 'workouts', 2, current_date, current_date + 3, ARRAY[pg_temp.u('b')]);
SELECT pg_temp.expect_error(format($q$SELECT public.gymplified_create_challenge('C6', 'workouts', 2, current_date, current_date + 3, ARRAY[%L]::uuid[])$q$, pg_temp.u('b')), '%up to 5 challenges%');
SELECT public.gymplified_delete_challenge((SELECT id FROM ch WHERE k = 'w'));
DO $$ BEGIN ASSERT (SELECT count(*) FROM public.gymplified_my_challenges()) = 4, 'deleted'; END $$;
RESET ROLE;
SET ROLE anon;
SELECT pg_temp.expect_error($q$SELECT * FROM public.gymplified_my_challenges()$q$, '%permission denied%');
RESET ROLE;

\echo 'deluxe growth tests passed'
