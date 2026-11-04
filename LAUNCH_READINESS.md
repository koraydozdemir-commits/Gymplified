# Gymplified launch readiness

Last updated: 4 November 2026

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
