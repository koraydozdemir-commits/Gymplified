-- Read only the authenticated user's own cloud snapshot for safe account migration choices.
CREATE OR REPLACE FUNCTION public.gymplified_get_user_app_state()
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = pg_catalog, public
AS $function$
  SELECT state
    FROM public.user_app_state
   WHERE user_id = auth.uid()
   LIMIT 1;
$function$;

REVOKE ALL ON FUNCTION public.gymplified_get_user_app_state() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.gymplified_get_user_app_state() TO authenticated;

NOTIFY pgrst, 'reload schema';
