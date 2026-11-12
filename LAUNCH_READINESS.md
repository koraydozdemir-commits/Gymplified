# Gymplified launch readiness

Last updated: 8 November 2026

This is the working release plan. A checklist item is only marked complete when it has been implemented and tested; store approval is not implied.

## In the app already
- [x] Workout logging, exercise library, sets, rest timer and workout sessions
- [x] Personal records and exercise progression history
- [x] Nutrition logging, calorie and macro totals, saved foods
- [x] Hydration tracking and goals
- [x] XP, daily quests, streaks and achievement badges
- [x] Friends and profile basics
- [x] CSV import/export and JSON backup/restore
- [x] Email verification UX and support tickets
- [x] Installable PWA shell and offline app-shell caching

## Added in this release
- [x] Save, load and delete named workout templates
- [x] Seven-day training recap with previous-week comparison and native share / clipboard fallback
- [x] Self-service account deletion through an authenticated Edge Function
- [x] Account deletion removes owned avatar objects and the account's analytics rows before deleting the Auth user
- [x] Initial privacy policy and terms pages (drafts requiring operator/legal review)
- [x] iPhone safe-area spacing for bottom navigation
- [x] Retry cloud progress save when the device comes back online
- [x] Service-worker cache version bump

## Before public beta
- [ ] Confirm Supabase Email Confirm is enabled
- [ ] Enable leaked-password protection
- [ ] Configure production SMTP and test verification / recovery emails
- [ ] Test account deletion with a dedicated test account, including avatar cleanup and cascading database rows
- [ ] Test cloud sync conflicts and offline recovery across two devices
- [ ] Add automated browser tests for sign-in, workout logging, templates, nutrition, CSV import/export and account deletion
- [ ] Complete the privacy policy with the operator's legal identity, contact details, retention schedule and provider/transfer details
- [ ] Complete terms and age / parental-consent policy with legal review
- [ ] Confirm analytics disclosure and retention meet applicable privacy requirements
- [ ] Add a support email/contact route that works when a user cannot sign in

## Native store preparation
- [ ] Choose a native delivery approach (Capacitor or a proper native client); do not assume the current PWA wrapper alone will pass App Review
- [ ] Create iOS and Android app projects, bundle identifiers, signing and release pipelines
- [ ] Produce compliant app icons, splash screens, screenshots and store descriptions
- [ ] Add store-required privacy disclosures, age ratings and health declarations
- [ ] Implement and test native push notifications with explicit opt-in and a real delivery backend
- [ ] Add Apple HealthKit and Android Health Connect only after permission scopes, data handling and user controls are designed
- [ ] Test on physical iPhone and Android devices, including small screens, offline mode, account recovery and deletion
- [ ] Run TestFlight and Google Play closed testing before production submission

## Later growth features
- [ ] Weekly/monthly progress reports beyond the seven-day dashboard recap
- [ ] Optional workout and hydration reminders
- [ ] Friend challenges and shared milestones
- [ ] Personalised workout suggestions with transparent, editable recommendations
- [ ] Premium tier only after the free core experience is stable

## Known external dependencies
- Apple Developer Program membership and App Store Connect access
- Google Play Console developer account
- Production SMTP provider and verified sender domain
- Push notification credentials / backend
- Privacy/legal review and confirmed operator contact details
- Health platform developer entitlements and device testing

## Important implementation notes
- Browser notifications are not treated as reliable scheduled background reminders. Native push needs platform permissions, a push service and backend delivery.
- HealthKit and Health Connect require native platform integrations and explicit health-data permissions; they are not safely simulated in a web page.
- The current product is a PWA. A store submission requires a deliberate native packaging/client strategy and platform-specific review/testing.
- Account deletion is deployed as `gymplified-delete-account` with JWT verification. It has not yet been exercised against a real disposable test account.
- The privacy and terms pages are starter drafts, not legal advice or a claim of regulatory compliance.

 
## Security hardening pass — 8 November 2026

Implemented in the app and database:
- [x] Keep privacy/terms navigation caches separate from the offline Gymplified app shell
- [x] Validate/normalize local state, cloud snapshots and JSON backup imports before rendering
- [x] Show visible local-save and cloud-sync failure messages
- [x] Merge independent records across devices using stable IDs, deletion tombstones and reset generations
- [x] Archive full daily workout, food and water records at rollover
- [x] Enforce avatar file size/type in Supabase Storage and use versioned avatar paths
- [x] Make analytics opt-in and anonymous; reuse the app's single Supabase client
- [x] Remove third-party Google Fonts requests
- [x] Add admin noindex directives, targeted accessibility improvements and stable navigation selectors
- [x] Add initial Node static tests and a GitHub Actions validation workflow
- [x] Add the applied Supabase migrations to source control

Still required before launch:
- [ ] Replace the transitional CSP with a strict policy after removing inline event handlers and inline scripts/styles
- [ ] Add verified Subresource Integrity for the pinned Supabase SDK
- [ ] Produce the approved 192px/512px PNG and maskable PWA icon variants
- [ ] Confirm Email Confirm and production SMTP in Supabase Auth; enable leaked-password protection
- [ ] Run account deletion on a disposable real account and verify all related records and storage objects are removed
- [ ] Run browser-level offline, storage-quota and two-device conflict/deletion tests
- [ ] Complete the privacy policy and terms with the operator's legal details and EU/UK legal review
- [ ] Plan the separate single-file app/module and targeted-render refactor

See [SECURITY_REVIEW.md](SECURITY_REVIEW.md) for implementation notes and limits. Static checks do not count as a substitute for real-device or account-level tests.

## Data-integrity repair pass — 9 November 2026
- [x] Isolate local progress snapshots by account and bind every cloud write to the authenticated owner.
- [x] Prevent completed workout sets from being counted again in a later session.
- [x] Preserve cardio metadata and notes during CSV import, local persistence and cloud sanitization.
- [x] Remove silent 200-session history truncation; warn at the explicit 5,000-session safety limit.
- [x] Improve duplicate detection, reject ambiguous CSV dates and validate/convert explicit units.
- [x] Make support ticket creation atomic with its first message.
- [x] Replace the Deluxe plan day browser prompt with an in-app picker.
- [ ] Test account switching and cloud sync with two disposable accounts and two devices.
- [ ] Test concurrent edits to the same record; these still use last-write-wins semantics.
- [ ] Enable leaked-password protection and verify production SMTP/email confirmation in Supabase Auth.
- [ ] Complete strict CSP/SRI work, approved PWA icon variants and EU/UK legal review.

## Deluxe growth release — 12 November 2026

Implemented and covered by tests (unit, static, real-Postgres and a headless-browser run):
- [x] Adaptive programme targets: a planned target moves up one step after a fully hit session, repeats after a miss, and drops about 10% after two misses at the same target. Each exercise card says why. On by default per plan; switch off in the planner. Finished sessions now record each planned target.
- [x] Nutrition coach (new Deluxe tab): maintenance calories from the last four weeks of food logs and weigh-ins, a target for losing (up to 1% a week, never below 1,200 kcal or a 25% deficit), keeping or gaining (up to 0.5% a week) weight, and matching macros applied in one tap with Undo.
- [x] Previews built from the user's own log once they have six finished workouts (analytics, coach, lift lab, reports); the nutrition preview says when the user's own estimate is ready.
- [x] Deluxe tips: one dismissible dashboard tip at a time (new PR, stalled lift, routine limit reached, a month logged, maintenance estimate ready), never during a workout, shown only while Deluxe is on sale, with a 3-day cooldown and a 14-day pause per tip. Settings → Notifications turns them off. One extra line under a workout summary with a PR.
- [x] Deluxe and Founding member badges next to friends on the leaderboard, feed and challenges (only when the owner shows the badge).
- [x] Friend challenges: Deluxe owners start a workout-count or volume challenge (up to 9 weeks, up to 20 friends, 5 running at a time); anyone invited joins free. Members only see names and numbers for themselves and their own friends, and each person's privacy settings apply.
- [x] Founding member offer: purchases before a server-side deadline keep a Founding member badge while the purchase is active.
- [x] Nothing free moved behind the paywall. The free routine limit (5) is unchanged.

To deploy:
- [ ] Apply `supabase/migrations/20261112150000_gymplified_deluxe_growth.sql` (test locally first: `psql -v ON_ERROR_STOP=1 -f supabase/tests/deluxe_growth.sql` on an empty Postgres 16 database). Until it is applied, the app hides challenges and badges and shows no founder offer; everything else works.
- [ ] Redeploy the `gymplified-deluxe` Edge Function so its status answer includes founder details.
- [ ] Optional founder offer: `UPDATE public.deluxe_settings SET founder_until = '<date> 23:59:59+00' WHERE id = 1;` The Deluxe screen shows the offer only while that date is in the future and sales are open. Leave it NULL for no offer. Note that a purchase recovered with Restore purchase is dated when it was restored, not when it was paid.
- [ ] Review the updated privacy (friend challenges, badges) and terms (founding members) wording.
