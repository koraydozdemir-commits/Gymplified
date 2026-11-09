-- Bind every cloud progress write to the authenticated owner and create support tickets atomically.
CREATE OR REPLACE FUNCTION public.gymplified_merge_user_app_state(p_state jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = pg_catalog, public
AS $function$
DECLARE
  v_user_id uuid := auth.uid();
  v_state jsonb;
  v_field text;
  v_deleted jsonb;
  v_items jsonb;
BEGIN
  IF v_user_id IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;
  IF p_state IS NULL OR jsonb_typeof(p_state) <> 'object' THEN
    RAISE EXCEPTION 'App state must be a JSON object';
  END IF;
  IF p_state ->> 'accountOwnerId' IS DISTINCT FROM v_user_id::text THEN
    RAISE EXCEPTION 'App state owner does not match the authenticated account';
  END IF;
  IF octet_length(p_state::text) > 10485760 THEN
    RAISE EXCEPTION 'App state exceeds the 10 MB limit';
  END IF;

  INSERT INTO public.user_app_state (user_id, state, updated_at)
  VALUES (v_user_id, p_state, now())
  ON CONFLICT (user_id) DO UPDATE
     SET state = public.gymplified_merge_jsonb(public.user_app_state.state, EXCLUDED.state),
         updated_at = now()
  RETURNING state INTO v_state;

  IF v_state ->> 'accountOwnerId' IS DISTINCT FROM v_user_id::text THEN
    RAISE EXCEPTION 'Stored app state owner does not match the authenticated account';
  END IF;

  v_deleted := COALESCE(v_state -> 'deletedRecordIds', '[]'::jsonb);
  FOREACH v_field IN ARRAY ARRAY['workouts','foods','prs','sessions','routines','customEx','customFoods','waterEntries']
  LOOP
    IF jsonb_typeof(v_state -> v_field) = 'array' THEN
      SELECT COALESCE(jsonb_agg(entry.value), '[]'::jsonb)
        INTO v_items
        FROM jsonb_array_elements(v_state -> v_field) AS entry(value)
       WHERE entry.value ->> 'id' IS NULL
          OR NOT (v_deleted @> jsonb_build_array(v_field || ':' || (entry.value ->> 'id')));
      v_state := jsonb_set(v_state, ARRAY[v_field], v_items, true);
    END IF;
  END LOOP;
  UPDATE public.user_app_state SET state = v_state, updated_at = now() WHERE user_id = v_user_id;
  RETURN v_state;
END;
$function$;

REVOKE ALL ON FUNCTION public.gymplified_merge_user_app_state(jsonb) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.gymplified_merge_user_app_state(jsonb) TO authenticated;

CREATE OR REPLACE FUNCTION public.gymplified_create_support_ticket(
  p_subject text,
  p_category text,
  p_message text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = pg_catalog, public
AS $function$
DECLARE
  v_user_id uuid := auth.uid();
  v_ticket_id uuid;
BEGIN
  IF v_user_id IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;
  IF char_length(btrim(COALESCE(p_subject, ''))) < 4 OR char_length(btrim(p_subject)) > 120 THEN
    RAISE EXCEPTION 'Subject must be between 4 and 120 characters';
  END IF;
  IF p_category NOT IN ('account','bug','workout_tracking','nutrition','feature_request','other') THEN
    RAISE EXCEPTION 'Invalid support category';
  END IF;
  IF char_length(btrim(COALESCE(p_message, ''))) < 10 OR char_length(p_message) > 5000 THEN
    RAISE EXCEPTION 'Message must be between 10 and 5,000 characters';
  END IF;

  INSERT INTO public.support_tickets (user_id, email, subject, category)
  VALUES (v_user_id, COALESCE(auth.jwt() ->> 'email', ''), btrim(p_subject), p_category)
  RETURNING id INTO v_ticket_id;

  INSERT INTO public.support_ticket_messages (ticket_id, user_id, author_role, message)
  VALUES (v_ticket_id, v_user_id, 'user', btrim(p_message));

  RETURN v_ticket_id;
END;
$function$;

REVOKE ALL ON FUNCTION public.gymplified_create_support_ticket(text, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.gymplified_create_support_ticket(text, text, text) TO authenticated;

NOTIFY pgrst, 'reload schema';
