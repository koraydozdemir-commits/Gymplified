-- Batch 5: friend leaderboard, friend profiles and activity feed.
--
-- Friends never read each other's raw app state. user_app_state keeps its existing owner-only RLS;
-- these SECURITY DEFINER functions read it on the caller's behalf and return only aggregates for the
-- caller and their accepted friends, honouring each person's privacy settings (state -> 'privacy').
-- A privacy flag counts as shared unless it is explicitly false, matching the app's defaults.

-- True when two different users have an accepted friend request in either direction.
CREATE OR REPLACE FUNCTION public.gymplified_are_friends(p_a uuid, p_b uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $function$
  SELECT p_a IS NOT NULL AND p_b IS NOT NULL AND p_a <> p_b AND EXISTS (
    SELECT 1 FROM public.friend_requests fr
     WHERE fr.status = 'accepted'
       AND ((fr.requester_id = p_a AND fr.receiver_id = p_b)
         OR (fr.requester_id = p_b AND fr.receiver_id = p_a))
  );
$function$;

-- The caller plus their accepted friends.
CREATE OR REPLACE FUNCTION public.gymplified_friend_circle()
RETURNS TABLE(member_id uuid)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $function$
  SELECT auth.uid() WHERE auth.uid() IS NOT NULL
  UNION
  SELECT CASE WHEN fr.requester_id = auth.uid() THEN fr.receiver_id ELSE fr.requester_id END
    FROM public.friend_requests fr
   WHERE fr.status = 'accepted'
     AND auth.uid() IS NOT NULL
     AND (fr.requester_id = auth.uid() OR fr.receiver_id = auth.uid());
$function$;

-- Whether a privacy flag is shared (anything but an explicit false).
CREATE OR REPLACE FUNCTION public.gymplified_shares(p_state jsonb, p_key text)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
SET search_path = pg_catalog, public
AS $function$
  SELECT COALESCE(p_state -> 'privacy' -> p_key, 'true'::jsonb) IS DISTINCT FROM 'false'::jsonb;
$function$;

-- A JSON array field of the state, or an empty array.
CREATE OR REPLACE FUNCTION public.gymplified_state_array(p_state jsonb, p_key text)
RETURNS jsonb
LANGUAGE sql
IMMUTABLE
SET search_path = pg_catalog, public
AS $function$
  SELECT CASE WHEN jsonb_typeof(p_state -> p_key) = 'array' THEN p_state -> p_key ELSE '[]'::jsonb END;
$function$;

-- A JSON number as numeric, clamped to [0, p_max]; anything else is 0.
CREATE OR REPLACE FUNCTION public.gymplified_num(p_value jsonb, p_max numeric)
RETURNS numeric
LANGUAGE sql
IMMUTABLE
SET search_path = pg_catalog, public
AS $function$
  SELECT CASE WHEN jsonb_typeof(p_value) = 'number' THEN LEAST(GREATEST((p_value #>> '{}')::numeric, 0), p_max) ELSE 0 END;
$function$;

-- The client sends its local Monday so friends in one time zone share a week. It must be a Monday
-- close to the server's date, so a client cannot ask for arbitrary history.
CREATE OR REPLACE FUNCTION public.gymplified_check_week_start(p_week_start date)
RETURNS void
LANGUAGE plpgsql
IMMUTABLE
SET search_path = pg_catalog, public
AS $function$
BEGIN
  IF p_week_start IS NULL OR EXTRACT(ISODOW FROM p_week_start) <> 1 THEN
    RAISE EXCEPTION 'Week start must be a Monday';
  END IF;
END;
$function$;

-- E1/E3: weekly friends-only leaderboard. Metrics a person does not share come back as NULL.
-- People in private mode are left out, except the caller's own row.
CREATE OR REPLACE FUNCTION public.gymplified_friend_leaderboard(p_week_start date)
RETURNS TABLE(
  user_id uuid, username text, display_name text, avatar_url text, is_self boolean, is_private boolean,
  workouts integer, volume_kg numeric, week_xp integer, streak integer, level integer
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $function$
DECLARE
  v_me uuid := auth.uid();
  v_from text;
  v_to text;
BEGIN
  IF v_me IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;
  PERFORM public.gymplified_check_week_start(p_week_start);
  IF p_week_start < current_date - 9 OR p_week_start > current_date + 1 THEN
    RAISE EXCEPTION 'Week start is outside the current week';
  END IF;
  v_from := p_week_start::text;
  v_to := (p_week_start + 7)::text;

  RETURN QUERY
  WITH circle AS (
    SELECT c.member_id, COALESCE(s.state, '{}'::jsonb) AS state
      FROM public.gymplified_friend_circle() c
      LEFT JOIN public.user_app_state s ON s.user_id = c.member_id
  ), week AS (
    SELECT c.member_id,
           count(*)::integer AS n,
           sum(public.gymplified_num(e.value -> 'vol', 100000000)) AS vol
      FROM circle c,
           jsonb_array_elements(public.gymplified_state_array(c.state, 'sessions')) e
     WHERE jsonb_typeof(e.value) = 'object'
       AND (e.value ->> 'date') >= v_from AND (e.value ->> 'date') < v_to
     GROUP BY c.member_id
  )
  SELECT c.member_id,
         p.username::text,
         p.display_name::text,
         p.avatar_url::text,
         c.member_id = v_me,
         NOT public.gymplified_shares(c.state, 'leaderboard'),
         CASE WHEN public.gymplified_shares(c.state, 'workouts') THEN COALESCE(w.n, 0) END,
         CASE WHEN public.gymplified_shares(c.state, 'volume') THEN round(COALESCE(w.vol, 0), 1) END,
         CASE WHEN public.gymplified_shares(c.state, 'level') THEN
           CASE WHEN c.state -> 'game' -> 'weekXp' ->> 'week' = v_from
                THEN public.gymplified_num(c.state -> 'game' -> 'weekXp' -> 'xp', 100000)::integer ELSE 0 END END,
         -- A streak last confirmed more than two days ago has lapsed.
         CASE WHEN public.gymplified_shares(c.state, 'streak') THEN
           CASE WHEN (c.state -> 'game' -> 'streakNow' ->> 'day') >= (current_date - 2)::text
                THEN public.gymplified_num(c.state -> 'game' -> 'streakNow' -> 'n', 100000)::integer ELSE 0 END END,
         CASE WHEN public.gymplified_shares(c.state, 'level') THEN
           floor(sqrt(public.gymplified_num(c.state -> 'game' -> 'xp', 1000000000) / 50))::integer + 1 END
    FROM circle c
    JOIN public.profiles p ON p.id = c.member_id
    LEFT JOIN week w ON w.member_id = c.member_id
   WHERE c.member_id = v_me OR public.gymplified_shares(c.state, 'leaderboard');
END;
$function$;

-- E4: a friend's profile card. Only for the caller or an accepted friend.
CREATE OR REPLACE FUNCTION public.gymplified_friend_profile(p_friend uuid, p_week_start date)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $function$
DECLARE
  v_me uuid := auth.uid();
  v_state jsonb;
  v_profile record;
  v_from text;
  v_to text;
  v_result jsonb;
BEGIN
  IF v_me IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;
  PERFORM public.gymplified_check_week_start(p_week_start);
  IF p_friend IS NULL OR (p_friend <> v_me AND NOT public.gymplified_are_friends(v_me, p_friend)) THEN
    RAISE EXCEPTION 'You can only view the profiles of your friends';
  END IF;
  SELECT id, username, display_name, avatar_url INTO v_profile FROM public.profiles WHERE id = p_friend;
  IF NOT FOUND THEN RAISE EXCEPTION 'Profile not found'; END IF;
  SELECT state INTO v_state FROM public.user_app_state WHERE user_id = p_friend;
  v_state := COALESCE(v_state, '{}'::jsonb);
  v_from := p_week_start::text;
  v_to := (p_week_start + 7)::text;

  v_result := jsonb_build_object(
    'id', v_profile.id, 'username', v_profile.username,
    'display_name', v_profile.display_name, 'avatar_url', v_profile.avatar_url,
    'is_self', p_friend = v_me);

  IF public.gymplified_shares(v_state, 'level') THEN
    v_result := v_result || jsonb_build_object(
      'level', floor(sqrt(public.gymplified_num(v_state -> 'game' -> 'xp', 1000000000) / 50))::integer + 1,
      'badges', COALESCE((
        SELECT jsonb_agg(b.value ORDER BY b.ord)
          FROM jsonb_array_elements(public.gymplified_state_array(v_state -> 'game', 'badges')) WITH ORDINALITY b(value, ord)
         WHERE jsonb_typeof(b.value) = 'string' AND (b.value #>> '{}') ~ '^[a-z0-9]{1,20}$' AND b.ord <= 100), '[]'::jsonb));
  END IF;
  IF public.gymplified_shares(v_state, 'streak') THEN
    v_result := v_result || jsonb_build_object('streak',
      CASE WHEN (v_state -> 'game' -> 'streakNow' ->> 'day') >= (current_date - 2)::text
           THEN public.gymplified_num(v_state -> 'game' -> 'streakNow' -> 'n', 100000)::integer ELSE 0 END);
  END IF;
  IF public.gymplified_shares(v_state, 'workouts') THEN
    v_result := v_result || jsonb_build_object(
      'workouts_total', jsonb_array_length(public.gymplified_state_array(v_state, 'sessions')),
      'workouts_week', (SELECT count(*) FROM jsonb_array_elements(public.gymplified_state_array(v_state, 'sessions')) e
                         WHERE jsonb_typeof(e.value) = 'object' AND (e.value ->> 'date') >= v_from AND (e.value ->> 'date') < v_to));
  END IF;
  IF public.gymplified_shares(v_state, 'volume') THEN
    v_result := v_result || jsonb_build_object('volume_week_kg', (
      SELECT round(COALESCE(sum(public.gymplified_num(e.value -> 'vol', 100000000)), 0), 1)
        FROM jsonb_array_elements(public.gymplified_state_array(v_state, 'sessions')) e
       WHERE jsonb_typeof(e.value) = 'object' AND (e.value ->> 'date') >= v_from AND (e.value ->> 'date') < v_to));
  END IF;
  IF public.gymplified_shares(v_state, 'prs') THEN
    v_result := v_result || jsonb_build_object('recent_prs', COALESCE((
      SELECT jsonb_agg(x.pr ORDER BY x.day DESC)
        FROM (SELECT jsonb_build_object(
                       'name', left(e.value ->> 'name', 80),
                       'weight_kg', public.gymplified_num(e.value -> 'weight', 2000),
                       'reps', public.gymplified_num(e.value -> 'reps', 1000)::integer,
                       'date', e.value ->> 'date') AS pr,
                     e.value ->> 'date' AS day
                FROM jsonb_array_elements(public.gymplified_state_array(v_state, 'prs')) e
               WHERE jsonb_typeof(e.value) = 'object' AND (e.value ->> 'date') ~ '^\d{4}-\d{2}-\d{2}$'
               ORDER BY e.value ->> 'date' DESC
               LIMIT 5) x), '[]'::jsonb));
  END IF;
  RETURN v_result;
END;
$function$;

-- E5: reactions on friends' activity. Only these two reactions exist, so there is nothing to moderate.
CREATE TABLE IF NOT EXISTS public.friend_activity_reactions (
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_key text NOT NULL CHECK (activity_key ~ '^(session|pr):[A-Za-z0-9_-]{1,120}$'),
  reactor_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reaction text NOT NULL CHECK (reaction IN ('fire', 'muscle')),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (owner_id, activity_key, reactor_id, reaction),
  CHECK (owner_id <> reactor_id)
);
CREATE INDEX IF NOT EXISTS friend_activity_reactions_reactor_idx ON public.friend_activity_reactions (reactor_id, created_at);
-- No policies: the table is reachable only through the functions below.
ALTER TABLE public.friend_activity_reactions ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.friend_activity_reactions FROM PUBLIC, anon, authenticated;

-- E5: activity feed for the caller and their friends since p_since (at most 31 days back).
CREATE OR REPLACE FUNCTION public.gymplified_friend_feed(p_since date)
RETURNS TABLE(
  activity_key text, owner_id uuid, username text, display_name text, avatar_url text, is_self boolean,
  kind text, detail jsonb, occurred_on text, fire_count integer, muscle_count integer, my_fire boolean, my_muscle boolean
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $function$
DECLARE
  v_me uuid := auth.uid();
BEGIN
  IF v_me IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;
  IF p_since IS NULL OR p_since < current_date - 31 OR p_since > current_date + 1 THEN
    RAISE EXCEPTION 'The feed covers at most the last 31 days';
  END IF;

  RETURN QUERY
  WITH circle AS (
    SELECT c.member_id, COALESCE(s.state, '{}'::jsonb) AS state
      FROM public.gymplified_friend_circle() c
      LEFT JOIN public.user_app_state s ON s.user_id = c.member_id
  ), events AS (
    SELECT 'session:' || (e.value ->> 'id') AS key, c.member_id, 'workout'::text AS kind,
           jsonb_build_object(
             'mins', public.gymplified_num(e.value -> 'mins', 1440)::integer,
             'exercises', public.gymplified_num(e.value -> 'ex', 100)::integer,
             'sets', public.gymplified_num(e.value -> 'sets', 10000)::integer,
             'volume_kg', CASE WHEN public.gymplified_shares(c.state, 'volume')
                               THEN round(public.gymplified_num(e.value -> 'vol', 100000000), 1) END
           ) AS detail,
           e.value ->> 'date' AS day,
           COALESCE(NULLIF(e.value ->> 'finishedAt', ''), e.value ->> 'date') AS sort_key
      FROM circle c, jsonb_array_elements(public.gymplified_state_array(c.state, 'sessions')) e
     WHERE public.gymplified_shares(c.state, 'workouts')
       AND jsonb_typeof(e.value) = 'object'
       AND (e.value ->> 'id') ~ '^[A-Za-z0-9_-]{1,120}$'
       AND (e.value ->> 'date') ~ '^\d{4}-\d{2}-\d{2}$'
       AND (e.value ->> 'date') >= p_since::text
    UNION ALL
    SELECT 'pr:' || (e.value ->> 'id'), c.member_id, 'pr',
           jsonb_build_object(
             'name', left(e.value ->> 'name', 80),
             'weight_kg', public.gymplified_num(e.value -> 'weight', 2000),
             'reps', public.gymplified_num(e.value -> 'reps', 1000)::integer),
           e.value ->> 'date',
           (e.value ->> 'date') || 'T23:59'
      FROM circle c, jsonb_array_elements(public.gymplified_state_array(c.state, 'prs')) e
     WHERE public.gymplified_shares(c.state, 'prs')
       AND jsonb_typeof(e.value) = 'object'
       AND (e.value ->> 'id') ~ '^[A-Za-z0-9_-]{1,120}$'
       AND (e.value ->> 'date') ~ '^\d{4}-\d{2}-\d{2}$'
       AND (e.value ->> 'date') >= p_since::text
  ), latest AS (
    SELECT * FROM events ORDER BY sort_key DESC LIMIT 60
  )
  SELECT l.key, l.member_id, p.username::text, p.display_name::text, p.avatar_url::text, l.member_id = v_me,
         l.kind, l.detail, l.day,
         (SELECT count(*)::integer FROM public.friend_activity_reactions r WHERE r.owner_id = l.member_id AND r.activity_key = l.key AND r.reaction = 'fire'),
         (SELECT count(*)::integer FROM public.friend_activity_reactions r WHERE r.owner_id = l.member_id AND r.activity_key = l.key AND r.reaction = 'muscle'),
         EXISTS (SELECT 1 FROM public.friend_activity_reactions r WHERE r.owner_id = l.member_id AND r.activity_key = l.key AND r.reaction = 'fire' AND r.reactor_id = v_me),
         EXISTS (SELECT 1 FROM public.friend_activity_reactions r WHERE r.owner_id = l.member_id AND r.activity_key = l.key AND r.reaction = 'muscle' AND r.reactor_id = v_me)
    FROM latest l
    JOIN public.profiles p ON p.id = l.member_id
   ORDER BY l.sort_key DESC;
END;
$function$;

-- E5: add or remove the caller's reaction. Friends only, on activity the owner shares, rate-limited.
CREATE OR REPLACE FUNCTION public.gymplified_toggle_reaction(p_owner uuid, p_activity_key text, p_reaction text)
RETURNS boolean
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $function$
DECLARE
  v_me uuid := auth.uid();
  v_state jsonb;
  v_kind text;
  v_id text;
  v_field text;
BEGIN
  IF v_me IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;
  IF p_reaction IS NULL OR p_reaction NOT IN ('fire', 'muscle') THEN RAISE EXCEPTION 'Unknown reaction'; END IF;
  IF p_activity_key IS NULL OR p_activity_key !~ '^(session|pr):[A-Za-z0-9_-]{1,120}$' THEN RAISE EXCEPTION 'Unknown activity'; END IF;
  IF NOT public.gymplified_are_friends(v_me, p_owner) THEN RAISE EXCEPTION 'You can only react to your friends'' activity'; END IF;

  DELETE FROM public.friend_activity_reactions
   WHERE owner_id = p_owner AND activity_key = p_activity_key AND reactor_id = v_me AND reaction = p_reaction;
  IF FOUND THEN RETURN false; END IF;

  IF (SELECT count(*) FROM public.friend_activity_reactions WHERE reactor_id = v_me AND created_at > now() - interval '1 minute') >= 30 THEN
    RAISE EXCEPTION 'Too many reactions. Try again in a minute';
  END IF;

  v_kind := split_part(p_activity_key, ':', 1);
  v_id := substr(p_activity_key, length(v_kind) + 2);
  v_field := CASE v_kind WHEN 'session' THEN 'sessions' ELSE 'prs' END;
  SELECT state INTO v_state FROM public.user_app_state WHERE user_id = p_owner;
  IF NOT public.gymplified_shares(COALESCE(v_state, '{}'::jsonb), CASE v_kind WHEN 'session' THEN 'workouts' ELSE 'prs' END)
     OR NOT EXISTS (SELECT 1 FROM jsonb_array_elements(public.gymplified_state_array(COALESCE(v_state, '{}'::jsonb), v_field)) e
                     WHERE e.value ->> 'id' = v_id) THEN
    RAISE EXCEPTION 'This activity is not available';
  END IF;

  INSERT INTO public.friend_activity_reactions (owner_id, activity_key, reactor_id, reaction)
  VALUES (p_owner, p_activity_key, v_me, p_reaction)
  ON CONFLICT DO NOTHING;
  RETURN true;
END;
$function$;

REVOKE ALL ON FUNCTION public.gymplified_are_friends(uuid, uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.gymplified_friend_circle() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.gymplified_shares(jsonb, text) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.gymplified_state_array(jsonb, text) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.gymplified_num(jsonb, numeric) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.gymplified_check_week_start(date) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.gymplified_friend_leaderboard(date) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.gymplified_friend_profile(uuid, date) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.gymplified_friend_feed(date) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.gymplified_toggle_reaction(uuid, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.gymplified_friend_leaderboard(date) TO authenticated;
GRANT EXECUTE ON FUNCTION public.gymplified_friend_profile(uuid, date) TO authenticated;
GRANT EXECUTE ON FUNCTION public.gymplified_friend_feed(date) TO authenticated;
GRANT EXECUTE ON FUNCTION public.gymplified_toggle_reaction(uuid, text, text) TO authenticated;

NOTIFY pgrst, 'reload schema';
