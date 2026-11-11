// Stripe webhook for Gymplified Deluxe. Deploy with JWT verification OFF (Stripe cannot send a Supabase JWT);
// every request is authenticated by its Stripe-Signature instead.
// Secrets: STRIPE_WEBHOOK_SECRET (whsec_…). Events to send: checkout.session.completed,
// checkout.session.async_payment_succeeded, charge.refunded, charge.dispute.created.
import { createClient } from 'npm:@supabase/supabase-js@2.57.4';
import { verifyStripeWebhook, entitlementFromCheckoutSession, disputedPaymentIntent } from '../_shared/stripe.js';

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });
  const raw = await req.text();
  let event;
  try {
    event = await verifyStripeWebhook(raw, req.headers.get('stripe-signature'), Deno.env.get('STRIPE_WEBHOOK_SECRET'));
  } catch (error) {
    return new Response('Invalid signature', { status: 400 });
  }
  const admin = createClient(Deno.env.get('SUPABASE_URL'), Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS') || '{}').default, { auth: { persistSession: false, autoRefreshToken: false } });
  try {
    if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
      const grant = entitlementFromCheckoutSession(event.data && event.data.object);
      if (grant) {
        const { error } = await admin.rpc('gymplified_grant_deluxe', { p_user: grant.userId, p_source: 'stripe_checkout', p_payment_intent: grant.paymentIntent, p_checkout_session: grant.checkoutSession, p_amount: grant.amount, p_currency: grant.currency });
        if (error) throw error;
      }
    } else if (event.type === 'charge.refunded') {
      const charge = event.data && event.data.object;
      // Only a full refund removes Deluxe; partial refunds (goodwill credits) keep it.
      if (charge && charge.refunded && typeof charge.payment_intent === 'string') {
        const { error } = await admin.rpc('gymplified_revoke_deluxe_by_payment', { p_payment_intent: charge.payment_intent });
        if (error) throw error;
      }
    } else if (event.type === 'charge.dispute.created') {
      // A chargeback takes the money back, so it removes Deluxe like a full refund. If the dispute is won,
      // an admin can give Deluxe back from admin-users.html (the paid record is kept).
      const paymentIntent = disputedPaymentIntent(event.data && event.data.object);
      if (paymentIntent) {
        const { error } = await admin.rpc('gymplified_revoke_deluxe_by_payment', { p_payment_intent: paymentIntent });
        if (error) throw error;
      }
    }
    return new Response(JSON.stringify({ received: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('gymplified-stripe-webhook:', error);
    // A non-2xx makes Stripe retry, and the grant is idempotent.
    return new Response('Temporary failure', { status: 500 });
  }
});
