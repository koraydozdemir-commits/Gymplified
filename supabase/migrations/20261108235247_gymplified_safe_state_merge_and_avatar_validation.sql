-- Atomic per-user progress merging and server-side avatar bucket validation.
CREATE OR REPLACE FUNCTION public.gymplified_merge_jsonb(
  p_left jsonb,
  p_right jsonb,
  p_key text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
IMMUTABLE
SET search_path = pg_catalog, public
AS $function$
DECLARE
  v_result jsonb;
  v_key text;
  v_item jsonb;
  v_index integer;
BEGIN
  IF p_left IS NULL OR p_left = 'null'::jsonb THEN RETURN p_right; END IF;
  IF p_right IS NULL OR p_right = 'null'::jsonb THEN RETURN p_right; END IF;

  IF jsonb_typeof(p_left) = 'object' AND jsonb_typeof(p_right) = 'object' THEN
    v_result := p_left;
    FOR v_key IN SELECT key FROM jsonb_object_keys(p_right) AS keys(key)
    LOOP
      v_result := jsonb_set(
        v_result, ARRAY[v_key],
        public.gymplified_merge_jsonb(v_result -> v_key, p_right -> v_key, v_key),
        true
      );
    END LOOP;
    RETURN v_result;
  ELSIF jsonb_typeof(p_left) = 'array' AND jsonb_typeof(p_right) = 'array' THEN
    IF p_key IN ('recent', 'presets', 'waterLog') THEN RETURN p_right; END IF;
    v_result := p_left;
    FOR v_item IN SELECT value FROM jsonb_array_elements(p_right) AS incoming(value)
    LOOP
      IF jsonb_typeof(v_item) = 'object' AND v_item ? 'id' THEN
        SELECT (ordinality - 1)::integer INTO v_index
          FROM jsonb_array_elements(v_result) WITH ORDINALITY AS existing(value, ordinality)
         WHERE existing.value ->> 'id' = v_item ->> 'id'
         LIMIT 1;
        IF v_index IS NULL THEN
          v_result := v_result || jsonb_build_array(v_item);
        ELSE
          v_result := jsonb_set(v_result, ARRAY[v_index::text],
            public.gymplified_merge_jsonb(v_result -> v_index, v_item, NULL), false);
        END IF;
      ELSIF NOT (v_result @> jsonb_build_array(v_item)) THEN
        v_result := v_result || jsonb_build_array(v_item);
      END IF;
    END LOOP;
    RETURN v_result;
  END IF;
  RETURN p_right;
END;
$function$;

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
  IF octet_length(p_state::text) > 10485760 THEN
    RAISE EXCEPTION 'App state exceeds the 10 MB limit';
  END IF;

  INSERT INTO public.user_app_state (user_id, state, updated_at)
  VALUES (v_user_id, p_state, now())
  ON CONFLICT (user_id) DO UPDATE
     SET state = public.gymplified_merge_jsonb(public.user_app_state.state, EXCLUDED.state),
         updated_at = now()
  RETURNING state INTO v_state;

  v_deleted := COALESCE(v_state -> 'deletedRecordIds', '[]'::jsonb);
  FOREACH v_field IN ARRAY ARRAY['workouts','foods','prs','sessions','routines','customEx','customFoods']
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

REVOKE ALL ON FUNCTION public.gymplified_merge_jsonb(jsonb, jsonb, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.gymplified_merge_jsonb(jsonb, jsonb, text) TO authenticated;
REVOKE ALL ON FUNCTION public.gymplified_merge_user_app_state(jsonb) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.gymplified_merge_user_app_state(jsonb) TO authenticated;

UPDATE storage.buckets
   SET file_size_limit = 3145728,
       allowed_mime_types = ARRAY['image/jpeg','image/png','image/webp']
 WHERE id = 'avatars';

DROP POLICY IF EXISTS "Users upload their own avatar" ON storage.objects;
CREATE POLICY "Users upload their own validated avatar"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
    AND lower(name) ~ '\.(jpe?g|png|webp)$'
  );

DROP POLICY IF EXISTS "Users update their own avatar" ON storage.objects;
CREATE POLICY "Users update their own validated avatar"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'avatars' AND owner_id = (SELECT auth.uid())::text)
  WITH CHECK (
    bucket_id = 'avatars'
    AND owner_id = (SELECT auth.uid())::text
    AND lower(name) ~ '\.(jpe?g|png|webp)$'
  );

NOTIFY pgrst, 'reload schema';
