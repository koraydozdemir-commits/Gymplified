-- Temporary Deluxe: an admin can give Deluxe for a number of days instead of forever.
-- An entitlement is active while it is not revoked AND (it has no expiry OR the expiry is in the future).
-- Expiry is evaluated on every read, so nothing has to run on a schedule and an expired row simply stops counting.
-- A real payment always makes Deluxe permanent (the grant function clears expires_at).
ALTER TABLE public.deluxe_entitlements ADD COLUMN IF NOT EXISTS expires_at timestamptz;

CREATE OR REPLACE FUNCTION public.gymplified_my_entitlement()
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $function$
  SELECT jsonb_build_object(
    'deluxe', e.user_id IS NOT NULL,
    'granted_at', e.granted_at,
    'expires_at', e.expires_at)
  FROM (SELECT 1) AS one
  LEFT JOIN public.deluxe_entitlements e
    ON e.user_id = auth.uid() AND e.revoked_at IS NULL AND (e.expires_at IS NULL OR e.expires_at > now());
$function$;

-- Stripe grant: unchanged except that a payment turns a temporary grant into a permanent one.
CREATE OR REPLACE FUNCTION public.gymplified_grant_deluxe(
  p_user uuid, p_source text, p_payment_intent text, p_checkout_session text, p_amount integer, p_currency text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $function$
BEGIN
  IF p_user IS NULL OR NOT EXISTS (SELECT 1 FROM auth.users WHERE id = p_user) THEN
    RAISE EXCEPTION 'Unknown account';
  END IF;
  INSERT INTO public.deluxe_entitlements (user_id, source, stripe_payment_intent, stripe_checkout_session, amount_total, currency)
  VALUES (p_user, p_source, p_payment_intent, p_checkout_session, p_amount, lower(p_currency))
  ON CONFLICT (user_id) DO UPDATE
     SET revoked_at = NULL,
         expires_at = NULL,
         source = EXCLUDED.source,
         stripe_payment_intent = COALESCE(EXCLUDED.stripe_payment_intent, public.deluxe_entitlements.stripe_payment_intent),
         stripe_checkout_session = COALESCE(EXCLUDED.stripe_checkout_session, public.deluxe_entitlements.stripe_checkout_session),
         amount_total = COALESCE(EXCLUDED.amount_total, public.deluxe_entitlements.amount_total),
         currency = COALESCE(EXCLUDED.currency, public.deluxe_entitlements.currency),
         granted_at = CASE WHEN public.deluxe_entitlements.revoked_at IS NULL
                            AND (public.deluxe_entitlements.expires_at IS NULL OR public.deluxe_entitlements.expires_at > now())
                           THEN public.deluxe_entitlements.granted_at ELSE now() END;
END;
$function$;

-- Admin switch. p_days NULL = permanent, otherwise Deluxe lasts that many days from now (1 to 3650).
-- The old three-argument version is dropped so a three-argument call cannot be ambiguous.
DROP FUNCTION IF EXISTS public.gymplified_admin_set_deluxe(uuid, boolean, uuid);
CREATE OR REPLACE FUNCTION public.gymplified_admin_set_deluxe(p_user uuid, p_on boolean, p_admin uuid, p_days integer DEFAULT NULL)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $function$
DECLARE
  result public.deluxe_entitlements;
  new_expiry timestamptz;
BEGIN
  IF p_user IS NULL OR NOT EXISTS (SELECT 1 FROM auth.users WHERE id = p_user) THEN
    RAISE EXCEPTION 'Unknown account';
  END IF;
  IF p_admin IS NULL OR NOT EXISTS (SELECT 1 FROM auth.users WHERE id = p_admin) THEN
    RAISE EXCEPTION 'Unknown admin';
  END IF;
  IF p_days IS NOT NULL AND (p_days < 1 OR p_days > 3650) THEN
    RAISE EXCEPTION 'Days must be between 1 and 3650';
  END IF;
  new_expiry := CASE WHEN p_days IS NULL THEN NULL ELSE now() + make_interval(days => p_days) END;
  IF p_on THEN
    -- A customer who paid and still owns Deluxe is never touched: a gift cannot shorten a purchase.
    IF NOT EXISTS (SELECT 1 FROM public.deluxe_entitlements
                    WHERE user_id = p_user AND stripe_payment_intent IS NOT NULL AND revoked_at IS NULL
                      AND (expires_at IS NULL OR expires_at > now())) THEN
      -- A new row is an admin grant. Re-activating an existing row keeps its original source and payment
      -- details, so a purchase record is never overwritten.
      INSERT INTO public.deluxe_entitlements (user_id, source, changed_by, changed_at, expires_at)
      VALUES (p_user, 'admin', p_admin, now(), new_expiry)
      ON CONFLICT (user_id) DO UPDATE
         SET granted_at = CASE WHEN public.deluxe_entitlements.revoked_at IS NULL
                                AND (public.deluxe_entitlements.expires_at IS NULL OR public.deluxe_entitlements.expires_at > now())
                               THEN public.deluxe_entitlements.granted_at ELSE now() END,
             revoked_at = NULL,
             expires_at = new_expiry,
             changed_by = p_admin,
             changed_at = now();
    END IF;
  ELSE
    UPDATE public.deluxe_entitlements
       SET revoked_at = COALESCE(revoked_at, now()), changed_by = p_admin, changed_at = now()
     WHERE user_id = p_user;
  END IF;
  SELECT * INTO result FROM public.deluxe_entitlements WHERE user_id = p_user;
  RETURN jsonb_build_object(
    'deluxe', result.user_id IS NOT NULL AND result.revoked_at IS NULL AND (result.expires_at IS NULL OR result.expires_at > now()),
    'source', result.source,
    'granted_at', result.granted_at,
    'revoked_at', result.revoked_at,
    'expires_at', result.expires_at,
    'paid', result.stripe_payment_intent IS NOT NULL);
END;
$function$;

REVOKE ALL ON FUNCTION public.gymplified_my_entitlement() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.gymplified_my_entitlement() TO authenticated;
REVOKE ALL ON FUNCTION public.gymplified_grant_deluxe(uuid, text, text, text, integer, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.gymplified_grant_deluxe(uuid, text, text, text, integer, text) TO service_role;
REVOKE ALL ON FUNCTION public.gymplified_admin_set_deluxe(uuid, boolean, uuid, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.gymplified_admin_set_deluxe(uuid, boolean, uuid, integer) TO service_role;
NOTIFY pgrst, 'reload schema';
