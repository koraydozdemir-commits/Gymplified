-- Deluxe growth: founding members, Deluxe badges for friends, and friend challenges.
--
-- 1. Founding members. Anyone whose paid Deluxe purchase started before the founder deadline keeps a
--    "Founding member" badge. The deadline lives in one server-side setting; until an operator sets it,
--    nobody is a founder and the app shows no founder offer. Set it with, for example:
--      UPDATE public.deluxe_settings SET founder_until = '2026-12-31 23:59:59+00' WHERE id = 1;
-- 2. Friend badges. Friends see a DELUXE (or FOUNDING MEMBER) badge only while the purchase is active and
--    the owner has left "Show the Deluxe badge on my profile" switched on.
-- 3. Friend challenges. Deluxe owners create a challenge for a date range and invite accepted friends;
--    anyone invited can join, free or Deluxe. Progress is computed here from each member's own logged
--    sessions and honours their privacy settings. A member only ever sees named progress for themselves
--    and their own accepted friends; anyone else in the challenge is counted, never named.
-- Tables are reachable only through the SECURITY DEFINER functions below (RLS on, no policies).

-- ---------- 1. founding members ----------
CREATE TABLE IF NOT EXISTS public.deluxe_settings (
  id smallint PRIMARY KEY CHECK (id = 1),
  founder_until timestamptz
);
INSERT INTO public.deluxe_settings (id, founder_until) VALUES (1, NULL) ON CONFLICT (id) DO NOTHING;
ALTER TABLE public.deluxe_settings ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.deluxe_settings FROM PUBLIC, anon, authenticated;

-- A paid purchase (not an admin grant) that started before the founder deadline.
CREATE OR REPLACE FUNCTION public.gymplified_is_founder(p_user uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.deluxe_entitlements e, public.deluxe_settings s
     WHERE e.user_id = p_user AND e.revoked_at IS NULL AND s.id = 1
       AND s.founder_until IS NOT NULL AND e.granted_at < s.founder_until
       AND e.source IN ('stripe_checkout', 'stripe_restore'));
$function$;

-- Same shape as before, plus founder status and the open founder deadline (null when there is none).
CREATE OR REPLACE FUNCTION public.gymplified_my_entitlement()
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $function$
  SELECT jsonb_build_object(
    'deluxe', EXISTS (SELECT 1 FROM public.deluxe_entitlements e WHERE e.user_id = auth.uid() AND e.revoked_at IS NULL),
    'granted_at', (SELECT e.granted_at FROM public.deluxe_entitlements e WHERE e.user_id = auth.uid() AND e.revoked_at IS NULL),
    'founder', public.gymplified_is_founder(auth.uid()),
    'founder_until', (SELECT s.founder_until FROM public.deluxe_settings s WHERE s.id = 1 AND s.founder_until > now()));
$function$;

-- ---------- 2. Deluxe badges among friends ----------
CREATE OR REPLACE FUNCTION public.gymplified_friend_badges()
RETURNS TABLE(user_id uuid, badge text)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $function$
DECLARE
  v_me uuid := auth.uid();
BEGIN
  IF v_me IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;
  RETURN QUERY
  SELECT c.member_id, CASE WHEN public.gymplified_is_founder(c.member_id) THEN 'founder' ELSE 'deluxe' END
    FROM public.gymplified_friend_circle() c
    JOIN public.deluxe_entitlements e ON e.user_id = c.member_id AND e.revoked_at IS NULL
    LEFT JOIN public.user_app_state s ON s.user_id = c.member_id
   WHERE COALESCE(s.state -> 'deluxe' -> 'profileFlair', 'true'::jsonb) IS DISTINCT FROM 'false'::jsonb;
END;
$function$;

-- ---------- 3. friend challenges ----------
CREATE TABLE IF NOT EXISTS public.friend_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 60 AND title !~ '[[:cntrl:]]'),
  metric text NOT NULL CHECK (metric IN ('workouts', 'volume')),
  target numeric NOT NULL CHECK (target > 0 AND target <= 100000000),
  starts_on date NOT NULL,
  ends_on date NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (ends_on >= starts_on AND ends_on - starts_on <= 62)
);
CREATE INDEX IF NOT EXISTS friend_challenges_creator_idx ON public.friend_challenges (creator_id, ends_on);
CREATE TABLE IF NOT EXISTS public.friend_challenge_members (
  challenge_id uuid NOT NULL REFERENCES public.friend_challenges(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invited_at timestamptz NOT NULL DEFAULT now(),
  joined_at timestamptz,
  PRIMARY KEY (challenge_id, user_id)
);
CREATE INDEX IF NOT EXISTS friend_challenge_members_user_idx ON public.friend_challenge_members (user_id);
ALTER TABLE public.friend_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friend_challenge_members ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.friend_challenges FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.friend_challenge_members FROM PUBLIC, anon, authenticated;

-- Create a challenge (Deluxe owners only). Invitees must all be accepted friends of the creator.
CREATE OR REPLACE FUNCTION public.gymplified_create_challenge(
  p_title text, p_metric text, p_target numeric, p_starts date, p_ends date, p_invitees uuid[])
RETURNS uuid
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $function$
DECLARE
  v_me uuid := auth.uid();
  v_id uuid;
  v_title text := btrim(regexp_replace(COALESCE(p_title, ''), '[[:cntrl:]]', ' ', 'g'));
  v_invitees uuid[] := ARRAY(SELECT DISTINCT x FROM unnest(COALESCE(p_invitees, ARRAY[]::uuid[])) x WHERE x IS NOT NULL AND x <> auth.uid());
BEGIN
  IF v_me IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.deluxe_entitlements e WHERE e.user_id = v_me AND e.revoked_at IS NULL) THEN
    RAISE EXCEPTION 'Creating challenges is part of Gymplified Deluxe';
  END IF;
  IF char_length(v_title) < 1 OR char_length(v_title) > 60 THEN RAISE EXCEPTION 'Give the challenge a name of up to 60 characters'; END IF;
  IF p_metric IS NULL OR p_metric NOT IN ('workouts', 'volume') THEN RAISE EXCEPTION 'Unknown challenge type'; END IF;
  IF p_target IS NULL OR p_target <= 0 OR (p_metric = 'workouts' AND p_target > 100) OR p_target > 100000000 THEN RAISE EXCEPTION 'Choose a realistic target'; END IF;
  IF p_starts IS NULL OR p_ends IS NULL OR p_starts < current_date - 1 OR p_starts > current_date + 31 OR p_ends < p_starts OR p_ends - p_starts > 62 THEN
    RAISE EXCEPTION 'A challenge starts within the next month and lasts up to nine weeks';
  END IF;
  IF cardinality(v_invitees) < 1 OR cardinality(v_invitees) > 20 THEN RAISE EXCEPTION 'Invite between 1 and 20 friends'; END IF;
  IF EXISTS (SELECT 1 FROM unnest(v_invitees) x WHERE NOT public.gymplified_are_friends(v_me, x)) THEN
    RAISE EXCEPTION 'You can only invite your friends';
  END IF;
  IF (SELECT count(*) FROM public.friend_challenges c WHERE c.creator_id = v_me AND c.ends_on >= current_date) >= 5 THEN
    RAISE EXCEPTION 'You can run up to 5 challenges at a time';
  END IF;
  INSERT INTO public.friend_challenges (creator_id, title, metric, target, starts_on, ends_on)
  VALUES (v_me, v_title, p_metric, round(p_target, 1), p_starts, p_ends) RETURNING id INTO v_id;
  INSERT INTO public.friend_challenge_members (challenge_id, user_id, joined_at) VALUES (v_id, v_me, now());
  INSERT INTO public.friend_challenge_members (challenge_id, user_id) SELECT v_id, x FROM unnest(v_invitees) x;
  RETURN v_id;
END;
$function$;

-- Join (p_join = true) or decline / leave (false). The creator cannot leave; they delete instead.
CREATE OR REPLACE FUNCTION public.gymplified_respond_challenge(p_challenge uuid, p_join boolean)
RETURNS boolean
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $function$
DECLARE
  v_me uuid := auth.uid();
  v_creator uuid;
BEGIN
  IF v_me IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;
  SELECT c.creator_id INTO v_creator FROM public.friend_challenges c
    JOIN public.friend_challenge_members m ON m.challenge_id = c.id AND m.user_id = v_me
   WHERE c.id = p_challenge;
  IF NOT FOUND THEN RAISE EXCEPTION 'Challenge not found'; END IF;
  IF COALESCE(p_join, false) THEN
    UPDATE public.friend_challenge_members SET joined_at = COALESCE(joined_at, now()) WHERE challenge_id = p_challenge AND user_id = v_me;
    RETURN true;
  END IF;
  IF v_creator = v_me THEN RAISE EXCEPTION 'You started this challenge, so delete it instead'; END IF;
  DELETE FROM public.friend_challenge_members WHERE challenge_id = p_challenge AND user_id = v_me;
  RETURN false;
END;
$function$;

CREATE OR REPLACE FUNCTION public.gymplified_delete_challenge(p_challenge uuid)
RETURNS void
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $function$
DECLARE
  v_me uuid := auth.uid();
BEGIN
  IF v_me IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;
  DELETE FROM public.friend_challenges WHERE id = p_challenge AND creator_id = v_me;
  IF NOT FOUND THEN RAISE EXCEPTION 'Only the person who started a challenge can delete it'; END IF;
END;
$function$;

-- The caller's challenges (invited or joined) that are running or ended in the last 14 days.
-- members: the caller and their accepted friends in the challenge, with progress when that person
-- shares the metric (otherwise null). others: how many further members the caller is not friends with.
CREATE OR REPLACE FUNCTION public.gymplified_my_challenges()
RETURNS TABLE(
  id uuid, title text, metric text, target numeric, starts_on date, ends_on date,
  creator_id uuid, is_creator boolean, joined boolean, members jsonb, others integer
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
  RETURN QUERY
  WITH mine AS (
    SELECT c.*, m.joined_at IS NOT NULL AS i_joined
      FROM public.friend_challenges c
      JOIN public.friend_challenge_members m ON m.challenge_id = c.id AND m.user_id = v_me
     WHERE c.ends_on >= current_date - 14
  ), roster AS (
    SELECT mi.id AS challenge_id, m.user_id, m.joined_at IS NOT NULL AS has_joined,
           (m.user_id = v_me OR public.gymplified_are_friends(v_me, m.user_id)) AS visible
      FROM mine mi JOIN public.friend_challenge_members m ON m.challenge_id = mi.id
  ), scored AS (
    SELECT r.challenge_id, r.user_id, r.has_joined, r.visible, p.username, p.display_name, p.avatar_url,
           CASE
             WHEN NOT r.has_joined THEN NULL
             WHEN mi.metric = 'workouts' AND public.gymplified_shares(COALESCE(s.state, '{}'::jsonb), 'workouts') THEN
               (SELECT count(*)::numeric FROM jsonb_array_elements(public.gymplified_state_array(COALESCE(s.state, '{}'::jsonb), 'sessions')) e
                 WHERE jsonb_typeof(e.value) = 'object' AND (e.value ->> 'date') >= mi.starts_on::text AND (e.value ->> 'date') <= mi.ends_on::text)
             WHEN mi.metric = 'volume' AND public.gymplified_shares(COALESCE(s.state, '{}'::jsonb), 'volume') THEN
               (SELECT round(COALESCE(sum(public.gymplified_num(e.value -> 'vol', 100000000)), 0), 1) FROM jsonb_array_elements(public.gymplified_state_array(COALESCE(s.state, '{}'::jsonb), 'sessions')) e
                 WHERE jsonb_typeof(e.value) = 'object' AND (e.value ->> 'date') >= mi.starts_on::text AND (e.value ->> 'date') <= mi.ends_on::text)
           END AS progress
      FROM roster r
      JOIN mine mi ON mi.id = r.challenge_id
      JOIN public.profiles p ON p.id = r.user_id
      LEFT JOIN public.user_app_state s ON s.user_id = r.user_id
     WHERE r.visible
  )
  SELECT mi.id, mi.title, mi.metric, mi.target, mi.starts_on, mi.ends_on, mi.creator_id, mi.creator_id = v_me, mi.i_joined,
         COALESCE((SELECT jsonb_agg(jsonb_build_object(
                     'user_id', sc.user_id, 'username', sc.username, 'display_name', sc.display_name, 'avatar_url', sc.avatar_url,
                     'is_self', sc.user_id = v_me, 'joined', sc.has_joined, 'progress', sc.progress) ORDER BY sc.progress DESC NULLS LAST)
                     FROM scored sc WHERE sc.challenge_id = mi.id), '[]'::jsonb),
         (SELECT count(*)::integer FROM roster r WHERE r.challenge_id = mi.id AND NOT r.visible)
    FROM mine mi
   ORDER BY mi.ends_on < current_date, mi.ends_on, mi.created_at;
END;
$function$;

-- ---------- permissions ----------
REVOKE ALL ON FUNCTION public.gymplified_is_founder(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.gymplified_my_entitlement() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.gymplified_my_entitlement() TO authenticated;
REVOKE ALL ON FUNCTION public.gymplified_friend_badges() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.gymplified_friend_badges() TO authenticated;
REVOKE ALL ON FUNCTION public.gymplified_create_challenge(text, text, numeric, date, date, uuid[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.gymplified_create_challenge(text, text, numeric, date, date, uuid[]) TO authenticated;
REVOKE ALL ON FUNCTION public.gymplified_respond_challenge(uuid, boolean) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.gymplified_respond_challenge(uuid, boolean) TO authenticated;
REVOKE ALL ON FUNCTION public.gymplified_delete_challenge(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.gymplified_delete_challenge(uuid) TO authenticated;
REVOKE ALL ON FUNCTION public.gymplified_my_challenges() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.gymplified_my_challenges() TO authenticated;

NOTIFY pgrst, 'reload schema';
