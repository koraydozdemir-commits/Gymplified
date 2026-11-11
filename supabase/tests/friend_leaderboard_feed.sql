-- Local test for 20261111090000_gymplified_friend_leaderboard_feed_and_reactions.sql.
-- Runs against a throwaway Postgres 16 with stand-ins for the parts of Supabase it relies on.
-- Usage: psql -v ON_ERROR_STOP=1 -f supabase/tests/friend_leaderboard_feed.sql  (on an EMPTY database)
\set QUIET on
\pset format unaligned
\pset tuples_only on

-- ---------- Supabase stand-ins ----------
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN CREATE ROLE anon NOLOGIN; END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN CREATE ROLE authenticated NOLOGIN; END IF;
END $$;
CREATE SCHEMA auth;
CREATE TABLE auth.users (id uuid PRIMARY KEY);
CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE
  AS $$ SELECT nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
GRANT USAGE ON SCHEMA auth TO anon, authenticated;
GRANT EXECUTE ON FUNCTION auth.uid() TO anon, authenticated;
CREATE TABLE public.profiles (id uuid PRIMARY KEY REFERENCES auth.users(id), username text UNIQUE, display_name text, avatar_url text, created_at timestamptz DEFAULT now(), updated_at timestamptz);
CREATE TABLE public.friend_requests (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), requester_id uuid REFERENCES auth.users(id), receiver_id uuid REFERENCES auth.users(id), status text NOT NULL DEFAULT 'pending', created_at timestamptz DEFAULT now(), accepted_at timestamptz);
CREATE TABLE public.user_app_state (user_id uuid PRIMARY KEY REFERENCES auth.users(id), state jsonb, updated_at timestamptz);
ALTER TABLE public.user_app_state ENABLE ROW LEVEL SECURITY;
CREATE POLICY own_state ON public.user_app_state FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
GRANT SELECT, INSERT, UPDATE ON public.user_app_state TO authenticated;
GRANT SELECT ON public.profiles, public.friend_requests TO authenticated;

\ir ../migrations/20261111090000_gymplified_friend_leaderboard_feed_and_reactions.sql

-- ---------- fixtures ----------
-- a = caller, b = friend sharing everything, c = friend in private mode, f = friend hiding volume and PRs,
-- d = stranger, e = pending request only.
CREATE TEMP TABLE ids AS SELECT * FROM (VALUES
  ('a', '00000000-0000-0000-0000-00000000000a'::uuid), ('b', '00000000-0000-0000-0000-00000000000b'::uuid),
  ('c', '00000000-0000-0000-0000-00000000000c'::uuid), ('d', '00000000-0000-0000-0000-00000000000d'::uuid),
  ('e', '00000000-0000-0000-0000-00000000000e'::uuid), ('f', '00000000-0000-0000-0000-00000000000f'::uuid)) v(k, id);
GRANT SELECT ON ids TO authenticated;
INSERT INTO auth.users SELECT id FROM ids;
INSERT INTO public.profiles (id, username, display_name) SELECT id, 'user_' || k, 'User ' || upper(k) FROM ids;
INSERT INTO public.friend_requests (requester_id, receiver_id, status)
SELECT (SELECT id FROM ids WHERE k = 'a'), (SELECT id FROM ids WHERE k = x), s
  FROM (VALUES ('b', 'accepted'), ('c', 'accepted'), ('e', 'pending')) v(x, s);
INSERT INTO public.friend_requests (requester_id, receiver_id, status)
SELECT (SELECT id FROM ids WHERE k = 'f'), (SELECT id FROM ids WHERE k = 'a'), 'accepted';
CREATE TEMP TABLE wk AS SELECT date_trunc('week', current_date)::date AS mon;
GRANT SELECT ON wk TO authenticated;
CREATE FUNCTION pg_temp.st(p_sessions jsonb, p_privacy jsonb, p_xp int, p_week_xp jsonb, p_streak jsonb, p_prs jsonb, p_badges jsonb)
RETURNS jsonb LANGUAGE sql AS $$
  SELECT jsonb_build_object('sessions', p_sessions, 'privacy', p_privacy, 'prs', p_prs,
         'game', jsonb_build_object('xp', p_xp, 'weekXp', p_week_xp, 'streakNow', p_streak, 'badges', p_badges)) $$;
INSERT INTO public.user_app_state (user_id, state)
SELECT (SELECT id FROM ids WHERE k = 'a'), pg_temp.st(
  jsonb_build_array(jsonb_build_object('id', 'sa1', 'date', (SELECT mon FROM wk)::text, 'vol', 1000, 'mins', 50, 'ex', 4, 'sets', 12),
                    jsonb_build_object('id', 'sa-old', 'date', ((SELECT mon FROM wk) - 3)::text, 'vol', 99999)),
  '{}'::jsonb, 1250, jsonb_build_object('week', (SELECT mon FROM wk)::text, 'xp', 140),
  jsonb_build_object('day', current_date::text, 'n', 4), '[]'::jsonb, '["first","ws"]'::jsonb);
INSERT INTO public.user_app_state (user_id, state)
SELECT (SELECT id FROM ids WHERE k = 'b'), pg_temp.st(
  jsonb_build_array(jsonb_build_object('id', 'sb1', 'date', (SELECT mon FROM wk)::text, 'vol', 2500.25, 'mins', 60, 'ex', 5, 'sets', 15, 'finishedAt', (SELECT mon FROM wk)::text || 'T19:00:00Z'),
                    jsonb_build_object('id', 'sb2', 'date', (SELECT mon FROM wk)::text, 'vol', 'not a number')),
  '{"leaderboard":true}'::jsonb, 5000, jsonb_build_object('week', ((SELECT mon FROM wk) - 7)::text, 'xp', 900),
  jsonb_build_object('day', (current_date - 5)::text, 'n', 30),
  jsonb_build_array(jsonb_build_object('id', 'pb1', 'name', 'Bench', 'weight', 100, 'reps', 3, 'date', (SELECT mon FROM wk)::text),
                    jsonb_build_object('id', 'pb-bad', 'name', '<img src=x>', 'weight', 1, 'reps', 1, 'date', 'yesterday')),
  '["first","pr","<script>",42]'::jsonb);
INSERT INTO public.user_app_state (user_id, state)
SELECT (SELECT id FROM ids WHERE k = 'c'), pg_temp.st(
  jsonb_build_array(jsonb_build_object('id', 'sc1', 'date', (SELECT mon FROM wk)::text, 'vol', 777)),
  '{"leaderboard":false}'::jsonb, 50, NULL, NULL, '[]'::jsonb, '[]'::jsonb);
INSERT INTO public.user_app_state (user_id, state)
SELECT (SELECT id FROM ids WHERE k = 'f'), pg_temp.st(
  jsonb_build_array(jsonb_build_object('id', 'sf1', 'date', (SELECT mon FROM wk)::text, 'vol', 3000, 'mins', 40)),
  '{"volume":false,"prs":false}'::jsonb, 0, NULL, NULL,
  jsonb_build_array(jsonb_build_object('id', 'pf1', 'name', 'Squat', 'weight', 140, 'reps', 1, 'date', (SELECT mon FROM wk)::text)), '[]'::jsonb);
INSERT INTO public.user_app_state (user_id, state)
SELECT (SELECT id FROM ids WHERE k = 'd'), pg_temp.st(
  jsonb_build_array(jsonb_build_object('id', 'sd1', 'date', (SELECT mon FROM wk)::text, 'vol', 5)), '{}'::jsonb, 10, NULL, NULL,
  jsonb_build_array(jsonb_build_object('id', 'pd1', 'name', 'Row', 'weight', 50, 'reps', 5, 'date', (SELECT mon FROM wk)::text)), '[]'::jsonb);

-- ---------- tests, run as user a ----------
SET ROLE authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-00000000000a', false);
CREATE FUNCTION pg_temp.expect_error(p_sql text, p_like text) RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  EXECUTE p_sql;
  RAISE EXCEPTION 'expected an error for: %', p_sql;
EXCEPTION WHEN OTHERS THEN
  IF SQLERRM LIKE 'expected an error%' OR SQLERRM NOT ILIKE p_like THEN RAISE EXCEPTION 'unexpected result for %: %', p_sql, SQLERRM; END IF;
END $$;

DO $$
DECLARE r record; n int; p jsonb; mon date := (SELECT mon FROM wk);
BEGIN
  -- E3: RLS still hides friends' raw state, and the reactions table is closed to direct access.
  SELECT count(*) INTO n FROM public.user_app_state;
  ASSERT n = 1, 'only the caller''s own state row is readable, got ' || n;

  -- E1: leaderboard has the caller and sharing friends, not private, pending or strangers.
  SELECT count(*) INTO n FROM public.gymplified_friend_leaderboard(mon);
  ASSERT n = 3, 'leaderboard should have a, b and f, got ' || n;
  ASSERT NOT EXISTS (SELECT 1 FROM public.gymplified_friend_leaderboard(mon) WHERE username IN ('user_c', 'user_d', 'user_e')), 'c, d and e must be absent';

  SELECT * INTO r FROM public.gymplified_friend_leaderboard(mon) WHERE username = 'user_a';
  ASSERT r.is_self AND r.workouts = 1 AND r.volume_kg = 1000 AND r.week_xp = 140 AND r.streak = 4 AND r.level = 6,
    'own row: ' || row_to_json(r)::text;
  SELECT * INTO r FROM public.gymplified_friend_leaderboard(mon) WHERE username = 'user_b';
  ASSERT NOT r.is_self AND r.workouts = 2 AND r.volume_kg = 2500.3 AND r.week_xp = 0 AND r.streak = 0 AND r.level = 11,
    'b: non-numeric volume counts 0, last week''s XP and a lapsed streak are 0: ' || row_to_json(r)::text;
  SELECT * INTO r FROM public.gymplified_friend_leaderboard(mon) WHERE username = 'user_f';
  ASSERT r.workouts = 1 AND r.volume_kg IS NULL AND r.level = 1, 'f hides volume: ' || row_to_json(r)::text;

  -- E4: friend profile respects privacy and friendship.
  p := public.gymplified_friend_profile('00000000-0000-0000-0000-00000000000b', mon);
  ASSERT p -> 'badges' = '["first","pr"]'::jsonb, 'badge ids are filtered: ' || (p -> 'badges')::text;
  ASSERT jsonb_array_length(p -> 'recent_prs') = 1 AND p -> 'recent_prs' -> 0 ->> 'name' = 'Bench', 'PRs with bad dates are dropped: ' || (p -> 'recent_prs')::text;
  ASSERT (p ->> 'workouts_week')::int = 2 AND (p ->> 'streak')::int = 0, 'b profile counts: ' || p::text;
  p := public.gymplified_friend_profile('00000000-0000-0000-0000-00000000000f', mon);
  ASSERT NOT (p ? 'volume_week_kg') AND NOT (p ? 'recent_prs') AND (p ? 'workouts_week'), 'f hides volume and PRs: ' || p::text;
  p := public.gymplified_friend_profile('00000000-0000-0000-0000-00000000000a', mon);
  ASSERT (p ->> 'is_self')::boolean, 'own profile works';

  -- E5: feed has the circle's shared activity only.
  SELECT count(*) INTO n FROM public.gymplified_friend_feed(current_date - 14);
  ASSERT NOT EXISTS (SELECT 1 FROM public.gymplified_friend_feed(current_date - 14) WHERE username IN ('user_d', 'user_e')), 'no strangers in the feed';
  ASSERT EXISTS (SELECT 1 FROM public.gymplified_friend_feed(current_date - 14) WHERE activity_key = 'pr:pb1' AND kind = 'pr'), 'b''s PR is in the feed';
  ASSERT NOT EXISTS (SELECT 1 FROM public.gymplified_friend_feed(current_date - 14) WHERE activity_key = 'pr:pf1'), 'f hides PRs';
  ASSERT (SELECT detail -> 'volume_kg' FROM public.gymplified_friend_feed(current_date - 14) WHERE activity_key = 'session:sf1') = 'null'::jsonb, 'f hides workout volume';
  ASSERT EXISTS (SELECT 1 FROM public.gymplified_friend_feed(current_date - 14) WHERE activity_key = 'session:sc1'), 'private mode only leaves the leaderboard';
  -- PRs sort at the end of their day, so a PR shows above the workout that produced it; then newest workouts first.
  ASSERT (SELECT array_agg(activity_key) FROM (SELECT activity_key FROM public.gymplified_friend_feed(current_date - 14) LIMIT 2) x) = ARRAY['pr:pb1', 'session:sb1'],
    'order: ' || (SELECT string_agg(activity_key, ',') FROM public.gymplified_friend_feed(current_date - 14));

  -- E5: reactions toggle, are counted, and are friends-only on real shared activity.
  ASSERT public.gymplified_toggle_reaction('00000000-0000-0000-0000-00000000000b', 'session:sb1', 'fire'), 'first toggle adds';
  ASSERT public.gymplified_toggle_reaction('00000000-0000-0000-0000-00000000000b', 'session:sb1', 'muscle'), 'second reaction adds';
  SELECT * INTO r FROM public.gymplified_friend_feed(current_date - 14) WHERE activity_key = 'session:sb1';
  ASSERT r.fire_count = 1 AND r.muscle_count = 1 AND r.my_fire AND r.my_muscle, 'counts: ' || row_to_json(r)::text;
  ASSERT NOT public.gymplified_toggle_reaction('00000000-0000-0000-0000-00000000000b', 'session:sb1', 'fire'), 'second toggle removes';
  SELECT * INTO r FROM public.gymplified_friend_feed(current_date - 14) WHERE activity_key = 'session:sb1';
  ASSERT r.fire_count = 0 AND NOT r.my_fire, 'removed';
END $$;

-- errors
SELECT pg_temp.expect_error($q$SELECT * FROM public.gymplified_friend_leaderboard((SELECT mon FROM wk) + 1)$q$, '%Monday%');
SELECT pg_temp.expect_error($q$SELECT * FROM public.gymplified_friend_leaderboard((SELECT mon FROM wk) - 14)$q$, '%current week%');
SELECT pg_temp.expect_error($q$SELECT * FROM public.gymplified_friend_feed(current_date - 60)$q$, '%31 days%');
SELECT pg_temp.expect_error($q$SELECT public.gymplified_friend_profile('00000000-0000-0000-0000-00000000000d', (SELECT mon FROM wk))$q$, '%friends%');
SELECT pg_temp.expect_error($q$SELECT public.gymplified_friend_profile('00000000-0000-0000-0000-00000000000e', (SELECT mon FROM wk))$q$, '%friends%');
SELECT pg_temp.expect_error($q$SELECT public.gymplified_toggle_reaction('00000000-0000-0000-0000-00000000000d', 'session:sd1', 'fire')$q$, '%friends%');
SELECT pg_temp.expect_error($q$SELECT public.gymplified_toggle_reaction('00000000-0000-0000-0000-00000000000a', 'session:sa1', 'fire')$q$, '%friends%');
SELECT pg_temp.expect_error($q$SELECT public.gymplified_toggle_reaction('00000000-0000-0000-0000-00000000000b', 'session:nope', 'fire')$q$, '%not available%');
SELECT pg_temp.expect_error($q$SELECT public.gymplified_toggle_reaction('00000000-0000-0000-0000-00000000000f', 'pr:pf1', 'fire')$q$, '%not available%');
SELECT pg_temp.expect_error($q$SELECT public.gymplified_toggle_reaction('00000000-0000-0000-0000-00000000000b', 'session:sb1', 'heart')$q$, '%Unknown reaction%');
SELECT pg_temp.expect_error($q$SELECT public.gymplified_toggle_reaction('00000000-0000-0000-0000-00000000000b', 'session:sb1''; drop table x; --', 'fire')$q$, '%Unknown activity%');
SELECT pg_temp.expect_error($q$SELECT * FROM public.friend_activity_reactions$q$, '%permission denied%');
SELECT pg_temp.expect_error($q$INSERT INTO public.friend_activity_reactions (owner_id, activity_key, reactor_id, reaction) VALUES ('00000000-0000-0000-0000-00000000000b', 'session:sb1', '00000000-0000-0000-0000-00000000000a', 'fire')$q$, '%permission denied%');
SELECT pg_temp.expect_error($q$SELECT * FROM public.gymplified_friend_circle()$q$, '%permission denied%');
SELECT pg_temp.expect_error($q$SELECT public.gymplified_are_friends('00000000-0000-0000-0000-00000000000b', '00000000-0000-0000-0000-00000000000c')$q$, '%permission denied%');

-- rate limit: 30 new reactions a minute
RESET ROLE;
INSERT INTO public.friend_activity_reactions (owner_id, activity_key, reactor_id, reaction)
SELECT '00000000-0000-0000-0000-00000000000b', 'session:spam' || g, '00000000-0000-0000-0000-00000000000a', 'fire' FROM generate_series(1, 30) g;
SET ROLE authenticated;
SELECT pg_temp.expect_error($q$SELECT public.gymplified_toggle_reaction('00000000-0000-0000-0000-00000000000b', 'pr:pb1', 'fire')$q$, '%Too many%');

-- signed out and anon
SELECT set_config('request.jwt.claim.sub', '', false);
SELECT pg_temp.expect_error($q$SELECT * FROM public.gymplified_friend_leaderboard((SELECT mon FROM wk))$q$, '%Authentication required%');
RESET ROLE;
SET ROLE anon;
SELECT pg_temp.expect_error($q$SELECT * FROM public.gymplified_friend_leaderboard(date_trunc('week', current_date)::date)$q$, '%permission denied%');
RESET ROLE;
\echo friend leaderboard, profile, feed and reaction tests passed
