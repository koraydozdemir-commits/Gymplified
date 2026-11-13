-- Gymplified Deluxe flash sale.
-- The sale is off while sale_ends_at is NULL or in the past. The checkout function also needs the
-- STRIPE_PRICE_DELUXE_SALE secret (a one-time Stripe price whose amount equals sale_price_cents).
-- Start:  UPDATE public.deluxe_settings SET sale_price_cents = 499, sale_ends_at = '<date> <time>+00' WHERE id = 1;
-- Stop:   UPDATE public.deluxe_settings SET sale_ends_at = NULL WHERE id = 1;
-- deluxe_settings is not readable by app roles; only the Edge Function (service role) reads it.

ALTER TABLE public.deluxe_settings
  ADD COLUMN IF NOT EXISTS sale_ends_at timestamptz,
  ADD COLUMN IF NOT EXISTS sale_price_cents integer;

ALTER TABLE public.deluxe_settings DROP CONSTRAINT IF EXISTS deluxe_settings_sale_price_check;
ALTER TABLE public.deluxe_settings
  ADD CONSTRAINT deluxe_settings_sale_price_check
  CHECK (sale_price_cents IS NULL OR sale_price_cents BETWEEN 50 AND 998);
