-- Batch 9 (A4/H3): Deluxe is a server-side entitlement, never a client flag.
-- Rows are written only by the Stripe webhook and the restore action (service role, via the functions below).
-- Signed-in users can only ask whether they own Deluxe; nobody can grant it from the browser.
CREATE TABLE IF NOT EXISTS public.deluxe_entitlements (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  source text NOT NULL CHECK (source IN ('stripe_checkout', 'stripe_restore', 'admin')),
  stripe_payment_intent text UNIQUE CHECK (stripe_payment_intent IS NULL OR stripe_payment_intent ~ '^pi_[A-Za-z0-9]+$'),
  stripe_checkout_session text CHECK (stripe_checkout_session IS NULL OR stripe_checkout_session ~ '^cs_[A-Za-z0-9_]+$'),
  amount_total integer CHECK (amount_total IS NULL OR amount_total >= 0),
  currency text CHECK (currency IS NULL OR currency ~ '^[a-z]{3}$'),
  granted_at timestamptz NOT NULL DEFAULT now(),
  revoked_at timestamptz
);
ALTER TABLE public.deluxe_entitlements ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.deluxe_entitlements FROM PUBLIC, anon, authenticated;
-- Users may read their own row (useful for support and future admin tools); they can never write.
DROP POLICY IF EXISTS "Users read their own Deluxe entitlement" ON public.deluxe_entitlements;
CREATE POLICY "Users read their own Deluxe entitlement" ON public.deluxe_entitlements
  FOR SELECT TO authenticated USING (user_id = auth.uid());
GRANT SELECT ON TABLE public.deluxe_entitlements TO authenticated;

-- Does the signed-in user own Deluxe?
CREATE OR REPLACE FUNCTION public.gymplified_my_entitlement()
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $function$
  SELECT jsonb_build_object(
    'deluxe', EXISTS (SELECT 1 FROM public.deluxe_entitlements e WHERE e.user_id = auth.uid() AND e.revoked_at IS NULL),
    'granted_at', (SELECT e.granted_at FROM public.deluxe_entitlements e WHERE e.user_id = auth.uid() AND e.revoked_at IS NULL));
$function$;

-- Grant (idempotent). A later payment re-activates a revoked entitlement.
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
         source = EXCLUDED.source,
         stripe_payment_intent = COALESCE(EXCLUDED.stripe_payment_intent, public.deluxe_entitlements.stripe_payment_intent),
         stripe_checkout_session = COALESCE(EXCLUDED.stripe_checkout_session, public.deluxe_entitlements.stripe_checkout_session),
         amount_total = COALESCE(EXCLUDED.amount_total, public.deluxe_entitlements.amount_total),
         currency = COALESCE(EXCLUDED.currency, public.deluxe_entitlements.currency),
         granted_at = CASE WHEN public.deluxe_entitlements.revoked_at IS NULL THEN public.deluxe_entitlements.granted_at ELSE now() END;
END;
$function$;

-- A full refund of the Deluxe payment removes the entitlement.
CREATE OR REPLACE FUNCTION public.gymplified_revoke_deluxe_by_payment(p_payment_intent text)
RETURNS integer
LANGUAGE sql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $function$
  WITH changed AS (
    UPDATE public.deluxe_entitlements SET revoked_at = now()
     WHERE stripe_payment_intent = p_payment_intent AND revoked_at IS NULL
    RETURNING 1)
  SELECT count(*)::integer FROM changed;
$function$;

REVOKE ALL ON FUNCTION public.gymplified_my_entitlement() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.gymplified_my_entitlement() TO authenticated;
REVOKE ALL ON FUNCTION public.gymplified_grant_deluxe(uuid, text, text, text, integer, text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.gymplified_revoke_deluxe_by_payment(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.gymplified_grant_deluxe(uuid, text, text, text, integer, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.gymplified_revoke_deluxe_by_payment(text) TO service_role;

NOTIFY pgrst, 'reload schema';
