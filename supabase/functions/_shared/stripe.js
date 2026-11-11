// Small Stripe helpers shared by the Gymplified Edge Functions. Plain JavaScript (no SDK) so the same
// file runs in Supabase's Deno runtime and in the Node test suite.

const encoder = new TextEncoder();

// Stripe-Signature: t=<seconds>,v1=<hex>[,v1=<hex>][,v0=…][,secret=…] — only t and v1 are trusted.
export function parseSignatureHeader(header) {
  const out = { timestamp: null, signatures: [] };
  for (const part of String(header || '').split(',')) {
    const i = part.indexOf('=');
    if (i < 0) continue;
    const key = part.slice(0, i).trim(), value = part.slice(i + 1).trim();
    if (key === 't' && /^\d+$/.test(value)) out.timestamp = Number(value);
    else if (key === 'v1' && /^[0-9a-f]{64}$/i.test(value)) out.signatures.push(value.toLowerCase());
  }
  return out;
}

export async function hmacSha256Hex(secret, message) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(message));
  return [...new Uint8Array(sig)].map(b => b.toString(16).padStart(2, '0')).join('');
}

export function timingSafeEqualHex(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

// Verifies a webhook body exactly as received. Returns the parsed event or throws.
export async function verifyStripeWebhook(rawBody, header, secret, { toleranceSeconds = 300, nowSeconds = Math.floor(Date.now() / 1000) } = {}) {
  if (!secret) throw new Error('Webhook secret is not configured');
  const { timestamp, signatures } = parseSignatureHeader(header);
  if (timestamp === null || !signatures.length) throw new Error('Missing Stripe signature');
  const expected = await hmacSha256Hex(secret, timestamp + '.' + rawBody);
  if (!signatures.some(sig => timingSafeEqualHex(sig, expected))) throw new Error('Invalid Stripe signature');
  if (!(toleranceSeconds > 0) || Math.abs(nowSeconds - timestamp) > toleranceSeconds) throw new Error('Stripe signature is too old');
  return JSON.parse(rawBody);
}

// Stripe's form encoding: nested objects become a[b][c]=v, arrays become a[0][b]=v.
export function formEncode(value, prefix = '', out = new URLSearchParams()) {
  if (value === undefined || value === null) return out;
  if (Array.isArray(value)) value.forEach((v, i) => formEncode(v, prefix + '[' + i + ']', out));
  else if (typeof value === 'object') Object.keys(value).forEach(k => formEncode(value[k], prefix ? prefix + '[' + k + ']' : k, out));
  else out.append(prefix, String(value));
  return out;
}

export const DELUXE_PRODUCT_TAG = 'gymplified_deluxe';
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// A completed Checkout Session unlocks Deluxe only when it is ours, paid, and names a valid account.
export function entitlementFromCheckoutSession(session) {
  if (!session || session.object !== 'checkout.session' || session.mode !== 'payment') return null;
  if (session.payment_status !== 'paid') return null;
  const meta = session.metadata || {};
  if (meta.product !== DELUXE_PRODUCT_TAG) return null;
  const userId = String(session.client_reference_id || meta.user_id || '');
  if (!UUID.test(userId) || (meta.user_id && meta.user_id !== userId)) return null;
  const pi = typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent && session.payment_intent.id;
  return { userId, paymentIntent: pi || null, checkoutSession: session.id || null, amount: Number(session.amount_total) || 0, currency: String(session.currency || '').toLowerCase() };
}

// The parameters for a one-time Deluxe Checkout Session.
export function deluxeCheckoutParams({ priceId, userId, email, siteUrl, termsRequired = false, submitNote = '', automaticTax = false }) {
  const params = {
    mode: 'payment',
    line_items: [{ price: priceId, quantity: 1 }],
    client_reference_id: userId,
    customer_creation: 'always',
    success_url: siteUrl + '/?deluxe=success&session_id={CHECKOUT_SESSION_ID}',
    cancel_url: siteUrl + '/?deluxe=cancel',
    metadata: { product: DELUXE_PRODUCT_TAG, user_id: userId },
    payment_intent_data: { metadata: { product: DELUXE_PRODUCT_TAG, user_id: userId } },
    invoice_creation: { enabled: true }
  };
  if (email) { params.customer_email = email; params.payment_intent_data.receipt_email = email; }
  if (termsRequired) params.consent_collection = { terms_of_service: 'required' };
  if (submitNote) params.custom_text = { submit: { message: String(submitNote).slice(0, 1200) } };
  if (automaticTax) params.automatic_tax = { enabled: true };
  return params;
}
