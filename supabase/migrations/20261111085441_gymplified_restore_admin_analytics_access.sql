-- Restore admin access (applied to the live project on 2026-11-11).
-- public.get_admin_analytics ran as the caller and called private.get_admin_analytics, but signed-in
-- users have no USAGE on schema private, so the check failed for every account with
-- "permission denied for schema private". admin.html, admin-users.html and admin-support.html all rely
-- on this check (the gymplified-admin-users Edge Function calls it too).
-- The public wrapper now runs as its owner instead of opening the private schema to all users.
-- private.get_admin_analytics still requires the caller's email to be in private.analytics_admins.
-- Supabase's advisor flags this function as "SECURITY DEFINER executable by signed-in users"; that is
-- intended here. Do not switch it back to SECURITY INVOKER or the admin pages stop working.
CREATE OR REPLACE FUNCTION public.get_admin_analytics(days_back integer DEFAULT 30)
RETURNS jsonb
LANGUAGE sql
SECURITY DEFINER
SET search_path TO ''
AS $function$
  select private.get_admin_analytics(days_back);
$function$;

REVOKE ALL ON FUNCTION public.get_admin_analytics(integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_admin_analytics(integer) TO authenticated;

NOTIFY pgrst, 'reload schema';
