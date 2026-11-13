// Gymplified Deluxe: status, checkout and restore for the signed-in user.
// Secrets (Supabase > Edge Functions > Secrets): STRIPE_SECRET_KEY, STRIPE_PRICE_DELUXE.
// Optional: DELUXE_SITE_URL (default https://gymplified.com), DELUXE_REQUIRE_TERMS=1 (needs a terms URL in
// Stripe's public settings), DELUXE_CHECKOUT_NOTE (owner-approved text shown above the pay button),
// STRIPE_PRICE_DELUXE_SALE (the flash-sale price id; the sale itself is switched on in public.deluxe_settings),
// STRIPE_AUTOMATIC_TAX=1 (only after Stripe Tax is set up), STRIPE_MANAGED_PAYMENTS=0 (only if Managed
// Payments is turned off in Stripe; while it is on, Stripe handles VAT, receipts and checkout text itself).
import { createClient } from 'npm:@supabase/supabase-js@2.57.4';
import { deluxeCheckoutParams, formEncode, activeFlashSale, saleSessionExpiry, DELUXE_PRODUCT_TAG } from '../_shared/stripe.js';

const ALLOWED_ORIGINS = ['https://gymplified.com', 'https://www.gymplified.com'];
function cors(origin) {
  return { 'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0], 'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Vary': 'Origin' };
}
function json(body, status, origin) { return new Response(JSON.stringify(body), { status, headers: { ...cors(origin), 'Content-Type': 'application/json' } }); }

// Which Stripe mode the configured key belongs to, so the app can show a "test mode" badge.
function stripeMode(key) { return /^(sk|rk)_live_/.test(key || '') ? 'live' : /^(sk|rk)_test_/.test(key || '') ? 'test' : null; }
// Stripe's own messages go to the logs only; the app gets a short code and a plain sentence.
function stripeErrorCode(message) {
  const m = String(message || '').toLowerCase();
  if (m.includes('permission') || m.includes('restricted key')) return 'stripe_permission';
  if (m.includes('tax code') || m.includes('no such price') || m.includes('managed payments') || m.includes('unsupported parameter')) return 'stripe_setup';
  if (m.includes('api key') || m.includes('invalid api')) return 'stripe_key';
  return 'stripe_error';
}
class StripeError extends Error { constructor(message) { super(message); this.code = stripeErrorCode(message); } }

async function stripe(path, { method = 'GET', params = null, query = null } = {}) {
  const key = Deno.env.get('STRIPE_SECRET_KEY');
  const url = 'https://api.stripe.com/v1/' + path + (query ? '?' + formEncode(query).toString() : '');
  const res = await fetch(url, { method, headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/x-www-form-urlencoded' }, body: params ? formEncode(params).toString() : undefined });
  const data = await res.json();
  if (!res.ok) throw new StripeError((data && data.error && data.error.message) || 'Stripe request failed');
  return data;
}

Deno.serve(async (req) => {
  const origin = req.headers.get('origin') || '';
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors(origin) });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405, origin);
  if (origin && !ALLOWED_ORIGINS.includes(origin)) return json({ error: 'Origin not allowed' }, 403, origin);
  try {
    const token = (req.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '');
    if (!token) return json({ error: 'Sign in required', code: 'signed_out' }, 401, origin);
    const url = Deno.env.get('SUPABASE_URL');
    // Newer projects expose keys as JSON maps instead of the legacy single-key variables.
    const anon = Deno.env.get('SUPABASE_ANON_KEY') || JSON.parse(Deno.env.get('SUPABASE_PUBLISHABLE_KEYS') || '{}').default;
    const service = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS') || '{}').default;
    if (!url || !anon || !service) return json({ error: 'Server configuration is incomplete', code: 'server_config' }, 500, origin);
    const userClient = createClient(url, anon, { auth: { persistSession: false, autoRefreshToken: false }, global: { headers: { Authorization: 'Bearer ' + token } } });
    const { data: auth, error: authError } = await userClient.auth.getUser(token);
    if (authError || !auth.user) return json({ error: 'Your session is invalid. Please sign in again.', code: 'session' }, 401, origin);
    const user = auth.user, admin = createClient(url, service, { auth: { persistSession: false, autoRefreshToken: false } });
    const salesOpen = !!(Deno.env.get('STRIPE_SECRET_KEY') && Deno.env.get('STRIPE_PRICE_DELUXE'));
    // founder / founder_until come from the deluxe_growth migration and expires_at from temporary grants;
    // a database without them simply omits the fields.
    const entitlement = async () => { const { data, error } = await userClient.rpc('gymplified_my_entitlement'); if (error) throw error; const d = data || {}; return { deluxe: !!d.deluxe, expiresAt: d.expires_at || null, founder: !!d.founder, founderUntil: d.founder_until || null }; };
    const owned = async () => (await entitlement()).deluxe;
    // A temporary gift from an admin does not stop the member buying Deluxe for good.
    const ownedForGood = async () => { const e = await entitlement(); return e.deluxe && !e.expiresAt; };
    // Flash sale: on only while the secret price id exists AND deluxe_settings has a future end time. A database
    // without the sale columns, or any read error, simply means no sale; the normal price is never affected.
    const currentSale = async () => {
      if (!salesOpen) return null;
      const { data, error } = await admin.from('deluxe_settings').select('sale_ends_at, sale_price_cents').eq('id', 1).maybeSingle();
      if (error || !data) return null;
      return activeFlashSale({ priceId: Deno.env.get('STRIPE_PRICE_DELUXE_SALE'), endsAt: data.sale_ends_at, priceCents: data.sale_price_cents });
    };
    const body = await req.json().catch(() => ({}));
    const action = String(body.action || 'status');

    if (action === 'status') {
      const e = await entitlement(), sale = await currentSale(), until = typeof e.founderUntil === 'string' && !Number.isNaN(Date.parse(e.founderUntil)) ? e.founderUntil : null;
      return json({ deluxe: e.deluxe, expiresAt: e.deluxe ? e.expiresAt : null, founder: !!(e.deluxe && e.founder), founderUntil: salesOpen ? until : null, salesOpen, sale: sale ? { endsAt: sale.endsAt, priceCents: sale.priceCents, percentOff: sale.percentOff } : null, mode: salesOpen ? stripeMode(Deno.env.get('STRIPE_SECRET_KEY')) : null }, 200, origin);
    }

    if (action === 'checkout') {
      if (!salesOpen) return json({ error: 'Deluxe is not on sale yet.', code: 'not_on_sale' }, 409, origin);
      if (await ownedForGood()) return json({ deluxe: true, alreadyOwned: true }, 200, origin);
      if (!user.email_confirmed_at) return json({ error: 'Please verify your email address before buying Deluxe.', code: 'email_unverified' }, 403, origin);
      const sale = await currentSale();
      const session = await stripe('checkout/sessions', { method: 'POST', params: deluxeCheckoutParams({
        priceId: sale ? sale.priceId : Deno.env.get('STRIPE_PRICE_DELUXE'),
        expiresAt: sale ? saleSessionExpiry(Date.parse(sale.endsAt)) : null,
        userId: user.id, email: user.email,
        siteUrl: Deno.env.get('DELUXE_SITE_URL') || 'https://gymplified.com',
        termsRequired: Deno.env.get('DELUXE_REQUIRE_TERMS') === '1',
        submitNote: Deno.env.get('DELUXE_CHECKOUT_NOTE') || '',
        automaticTax: Deno.env.get('STRIPE_AUTOMATIC_TAX') === '1',
        // Managed Payments is on unless STRIPE_MANAGED_PAYMENTS=0 (match the Stripe account setting).
        managedPayments: Deno.env.get('STRIPE_MANAGED_PAYMENTS') !== '0'
      }) });
      return json({ url: session.url }, 200, origin);
    }

    if (action === 'restore') {
      if (await ownedForGood()) return json({ deluxe: true }, 200, origin);
      if (!salesOpen) return json({ deluxe: await owned() }, 200, origin);
      // Finds a paid, not fully refunded Deluxe payment made by this account, in case the webhook was missed.
      const found = await stripe('payment_intents/search', { query: { query: "metadata['user_id']:'" + user.id + "' AND metadata['product']:'" + DELUXE_PRODUCT_TAG + "' AND status:'succeeded'", limit: 10, expand: ['data.latest_charge'] } });
      const paid = (found.data || []).find(pi => pi.amount_received > 0 && !(pi.latest_charge && pi.latest_charge.refunded));
      if (!paid) return json({ deluxe: await owned() }, 200, origin);
      const { error } = await admin.rpc('gymplified_grant_deluxe', { p_user: user.id, p_source: 'stripe_restore', p_payment_intent: paid.id, p_checkout_session: null, p_amount: paid.amount_received, p_currency: paid.currency });
      if (error) throw error;
      return json({ deluxe: true, restored: true }, 200, origin);
    }
    return json({ error: 'Unknown action', code: 'bad_request' }, 400, origin);
  } catch (error) {
    console.error('gymplified-deluxe:', error);
    const code = error instanceof StripeError ? error.code : 'server_error';
    return json({ error: 'Something went wrong. Please try again.', code }, code === 'server_error' ? 500 : 502, origin);
  }
});
