-- Batch 10 prep: admins can give or remove Deluxe by hand while Stripe is not connected
-- (and later for support cases). Only the service role can call this; the gymplified-admin-users
-- edge function checks the admin allowlist before calling it, and records which admin made the change.
ALTER TABLE public.deluxe_entitlements
  ADD COLUMN IF NOT EXISTS changed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS changed_at timestamptz;

CREATE OR REPLACE FUNCTION public.gymplified_admin_set_deluxe(p_user uuid, p_on boolean, p_admin uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $function$
DECLARE
  result public.deluxe_entitlements;
BEGIN
  IF p_user IS NULL OR NOT EXISTS (SELECT 1 FROM auth.users WHERE id = p_user) THEN
    RAISE EXCEPTION 'Unknown account';
  END IF;
  IF p_admin IS NULL OR NOT EXISTS (SELECT 1 FROM auth.users WHERE id = p_admin) THEN
    RAISE EXCEPTION 'Unknown admin';
  END IF;
  IF p_on THEN
    -- A new row is an admin grant. Re-activating an existing row keeps its original source and payment
    -- details, so a paying customer's purchase record is never overwritten.
    INSERT INTO public.deluxe_entitlements (user_id, source, changed_by, changed_at)
    VALUES (p_user, 'admin', p_admin, now())
    ON CONFLICT (user_id) DO UPDATE
       SET granted_at = CASE WHEN public.deluxe_entitlements.revoked_at IS NULL THEN public.deluxe_entitlements.granted_at ELSE now() END,
           revoked_at = NULL,
           changed_by = p_admin,
           changed_at = now();
  ELSE
    UPDATE public.deluxe_entitlements
       SET revoked_at = COALESCE(revoked_at, now()), changed_by = p_admin, changed_at = now()
     WHERE user_id = p_user;
  END IF;
  SELECT * INTO result FROM public.deluxe_entitlements WHERE user_id = p_user;
  RETURN jsonb_build_object(
    'deluxe', result.user_id IS NOT NULL AND result.revoked_at IS NULL,
    'source', result.source,
    'granted_at', result.granted_at,
    'revoked_at', result.revoked_at,
    'paid', result.stripe_payment_intent IS NOT NULL);
END;
$function$;

REVOKE ALL ON FUNCTION public.gymplified_admin_set_deluxe(uuid, boolean, uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.gymplified_admin_set_deluxe(uuid, boolean, uuid) TO service_role;
NOTIFY pgrst, 'reload schema';
