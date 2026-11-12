# Turning on Deluxe payments (Stripe)

Everything except the Stripe account itself is already built. This is the checklist for the day the
Stripe account is open. Sections 1 to 4 are done in the sandbox. Section 6 is the switch to real payments.

## What is already in place

| Piece | Where | State |
| --- | --- | --- |
| Entitlement table, grant/revoke functions, RLS | `supabase/migrations/20261111120000_gymplified_deluxe_entitlements.sql` | Applied |
| Admin give/remove switch | `supabase/migrations/20261111130000_gymplified_admin_deluxe_toggle.sql`, `admin-users.html` | Applied |
| Checkout, status and restore | `supabase/functions/gymplified-deluxe` | Deployed; refuses checkout until the keys below exist |
| Webhook (grant on payment, revoke on full refund or chargeback) | `supabase/functions/gymplified-stripe-webhook` | Deployed (version 5, includes chargeback handling) |
| Buy / restore / return-from-checkout flow | `app.js` (Deluxe section) | Live; shows "not on sale yet" until `salesOpen` is true |

The app never decides who owns Deluxe. Only the webhook (service role) can grant it, and it only
grants for a Checkout Session that is paid, tagged `gymplified_deluxe`, and names the buyer's account id.

## 1. Create the product

1. Stripe Dashboard → Product catalogue → Add product: **Gymplified Deluxe**.
2. Price: **one-time**, €9.99. Copy the price id (`price_…`).
3. Decide on tax. If you will collect VAT, finish Stripe Tax setup first, then set `STRIPE_AUTOMATIC_TAX=1` in step 2. Leave it unset otherwise.

## 2. Add the secrets

Supabase Dashboard → Edge Functions → Secrets:

| Secret | Value |
| --- | --- |
| `STRIPE_SECRET_KEY` | Restricted key is best: write access to Checkout Sessions, read access to PaymentIntents and Charges |
| `STRIPE_PRICE_DELUXE` | The `price_…` id from step 1 |
| `STRIPE_WEBHOOK_SECRET` | The `whsec_…` value from step 3 |
| `DELUXE_SITE_URL` (optional) | Defaults to `https://gymplified.com` |
| `DELUXE_REQUIRE_TERMS` (optional) | `1` to make buyers tick the terms box. Needs a terms URL in Stripe → Settings → Public details |
| `DELUXE_CHECKOUT_NOTE` (optional) | Short approved text shown above the pay button (for the EU withdrawal notice) |

Never put any of these in the repository or in `app.js`. The browser only ever holds the Supabase publishable key.

## 3. Register the webhook

1. Stripe Dashboard → Developers → Webhooks → Add endpoint.
2. URL: `https://ouwvujtsrnotnwtbvqhc.supabase.co/functions/v1/gymplified-stripe-webhook`
3. Events: `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `charge.refunded`, `charge.dispute.created`.
4. Copy the signing secret into `STRIPE_WEBHOOK_SECRET`.
5. Redeploy `gymplified-stripe-webhook` with **JWT verification off** (Stripe cannot send a Supabase token; the Stripe signature is checked instead).

## 4. Test it

Use a test-mode key and a throwaway Gymplified account with a verified email.

- [ ] Deluxe screen shows the Buy button (no "not on sale yet").
- [ ] Pay with `4242 4242 4242 4242`: you return to the app and Deluxe unlocks within a few seconds.
- [ ] A row appears in `deluxe_entitlements` with `source = stripe_checkout` and the payment intent.
- [ ] Sign in on a second browser: Deluxe is unlocked there too.
- [ ] "Restore purchase" on an account that already paid reports success.
- [ ] Pay with `4000 0000 0000 0002` (declined): nothing unlocks.
- [ ] Cancel on the Stripe page: the app says the purchase was cancelled.
- [ ] Refund the test payment in full: Deluxe locks again. A partial refund keeps it.
- [ ] Pay with `4000 0000 0000 0259` (creates a dispute): Deluxe locks.
- [ ] Send a webhook with a wrong signature (Stripe CLI or curl): the function answers 400 and nothing changes.
- [ ] Stripe → Webhooks shows every delivery as 200.

## 5. Before live mode

Done in code (12 November 2026):

- [x] Terms section 9 covers the Deluxe purchase: price, Stripe/Link as merchant of record, a 14-day
      full refund for any reason, statutory rights kept, what happens on refund, chargeback or deletion.
      The 14-day refund means no "waive your withdrawal right" checkbox is needed at checkout.
- [x] Privacy policy lists Stripe, the purchase records Gymplified keeps, Open Food Facts and friend sharing.
- [x] The Deluxe screen states the refund window and links to the purchase terms.

Still needed from the owner (Stripe Dashboard, live account):

- [ ] **Support email** (`gymplifiedsupport@gmail.com`) in Settings → Business details. With Managed Payments, Stripe sends refund and
      support escalations here and may refund on its own if you do not answer within 48 hours.
- [ ] Business name and statement descriptor in Settings → Public details.
- [ ] Terms URL `https://gymplified.com/terms.html` and privacy URL `https://gymplified.com/privacy.html`
      in Settings → Public details, then switch on **Legal policies** in Settings → Checkout so the checkout
      page links to them.
- [x] Operator identity on `terms.html` and `privacy.html`: trading name Gymplified, Ireland,
      gymplifiedsupport@gmail.com, Irish governing law, Irish Data Protection Commission named.
- [ ] Optional but recommended: add a postal address to both pages. Irish and EU rules expect an online
      trader to publish a geographic address; a business-registered or PO box address avoids using a home one.

**If Managed Payments is off** (`STRIPE_MANAGED_PAYMENTS=0`), Gymplified becomes the seller. Terms
section 9 ("Who sells it") and the privacy policy's Stripe paragraph then describe the wrong setup and
must be rewritten before taking money, and VAT becomes your responsibility.

## 6. Going live (real money)

The sandbox and the live account are separate worlds: products, prices, webhooks and keys do not carry
over. Nothing in the code changes; only the three Supabase secrets do. Until step 5 below, the site keeps
running on the sandbox.

1. **Activate the Stripe account.** Dashboard → leave the sandbox (account picker, top left) → complete
   the business profile, bank account and identity checks until the account can accept payments.
2. **Managed Payments.** The sandbox has it on (Stripe is the merchant of record and handles VAT, receipts
   and the checkout text). Check Settings → Managed Payments in the live account:
   - On: leave `STRIPE_MANAGED_PAYMENTS` unset.
   - Not available or off: set `STRIPE_MANAGED_PAYMENTS=0`. You are then the seller, so decide on VAT
     (`STRIPE_AUTOMATIC_TAX=1` after Stripe Tax is set up) and finish the wording in section 5.
3. **Create the live product.** Product catalogue → Add product, matching the sandbox one exactly:
   name **Gymplified Deluxe**, one-time **€9.99**, tax code `txcd_10103000`. Copy the live `price_…` id.
4. **Create the live webhook.** Developers → Webhooks → Add destination, same URL and the same four
   events as section 3. Copy its `whsec_…` signing secret.
5. **Create a live restricted key.** Developers → API keys → Create restricted key (`rk_live_…`):
   Checkout Sessions **write**, PaymentIntents **read**, Charges **read**. "Restore purchase" uses
   PaymentIntent search, which needs the PaymentIntents read permission.
6. **Swap the secrets** in Supabase → Edge Functions → Secrets, all three in one sitting:
   `STRIPE_SECRET_KEY`, `STRIPE_PRICE_DELUXE`, `STRIPE_WEBHOOK_SECRET`. Secrets apply to new requests
   straight away; no redeploy is needed. A live key with a sandbox price (or the reverse) makes checkout
   fail with "payment setup" until all three match.
7. **Disable the sandbox webhook** (sandbox → Developers → Webhooks). It shares the URL but is signed
   with the old secret, so every sandbox event would otherwise show as a failed delivery.
8. **Clean up test purchases.** Sandbox purchases left Deluxe unlocked on the test accounts. Remove
   them in `admin-users.html` unless those accounts should keep Deluxe for free.
9. **One real purchase.** The "Test mode" badge on the Deluxe screen must be gone. Buy Deluxe with a
   real card on a fresh account, confirm it unlocks, confirm the live webhook delivery shows 200, then
   refund it from the Dashboard and confirm Deluxe locks again.

To go back to the sandbox, put the three sandbox values back.

## If something goes wrong

- **Paid but still locked:** Stripe → Webhooks → check the delivery. A failed delivery can be resent. The buyer can also tap "Restore purchase", which looks the payment up directly.
- **Need to give or remove Deluxe by hand:** `admin-users.html` → open the member → Gymplified Deluxe. Removing it does not refund them.
- **Turn sales off quickly:** delete `STRIPE_PRICE_DELUXE`. Checkout is refused at once; existing owners keep Deluxe.
