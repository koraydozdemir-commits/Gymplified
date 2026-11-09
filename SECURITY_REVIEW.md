# Gymplified security, privacy and reliability review

Updated: 8 November 2026

## Implemented

- Service worker: navigation responses are cached under their own request URL. Privacy and terms pages cannot overwrite the offline app shell. The shell pre-caches the app, analytics script, manifest and local assets. The pinned Supabase SDK is cached opportunistically; its absence does not block installation.
- State validation: local state, cloud snapshots and imported backups are normalized through an allow-list. Import rejects oversized/malformed payloads and never writes the raw JSON object directly to storage.
- Stored-XSS protections: PR metrics are numeric, dates and meal labels are escaped, exercise metadata is normalized, and generated inline JavaScript arguments use JSON string encoding. Profile images are accepted for display only from the Gymplified avatar bucket. Admin and support output paths were reviewed; user text is escaped or assigned via textContent.
- Local saves: quota/blocked-storage errors now generate a visible toast. Special-case exercise save paths use the same persistence helper.
- Cloud progress: authenticated Postgres RPC merges record collections by stable IDs inside a single upsert. Independent workout, set, food, PR, session, routine and water records are preserved across overlapping snapshots. Deletion tombstones stop stale devices restoring individual records. A reset-generation marker makes a deliberate reset/backup restore replace older state and prevents an older offline device from resurrecting pre-reset data. Changes to the same record scalar fields still resolve to the most recently committed database snapshot.
- Day rollover: a detailed daily archive retains workouts, foods, water events and nutrition totals by date for up to 365 days instead of only retaining a short summary.
- Avatars: uploads use unique versioned paths, check file signatures as well as the browser MIME, and remove obsolete avatar versions after the profile URL is updated. The bucket enforces a 3 MB limit and JPEG/PNG/WebP-only MIME types; storage policies validate the authenticated user's folder and file extension.
- Analytics: opt-in only, anonymous session identifier, user_id is always null, the preference can be revoked in Settings, and analytics.js reuses the app's existing Supabase client.
- Fonts: removed the Google Fonts @import; the app uses local system font fallbacks and no longer sends the font request to Google.
- Admin discovery: all admin HTML routes are noindex,nofollow,noarchive; robots.txt also disallows the routes. Database authorization remains the actual access control.
- Accessibility: exercise preview rows and machine cards are keyboard-operable buttons. Toasts, live stats, session status and the rest timer have status/role semantics. Navigation shortcuts and helper selectors use stable screen identifiers rather than button positions.
- Account UX: account deletion and progress reset use styled dialogs rather than prompt()/confirm() for those destructive actions.
- SEO: the home page has a concise title, description, canonical URL and Open Graph metadata. Draft legal pages are marked noindex pending review.
- Tests: added Node static validation and a GitHub Actions workflow for script syntax, service-worker cache behavior, restore validation, analytics consent, admin noindex and PWA manifest checks.
- Database migrations: the two applied Supabase migrations are now represented in supabase/migrations/ for source control.

## Remaining launch blockers / items needing a real device or dashboard

1. Strict CSP and SRI are not complete. The current CSP is a transitional meta policy: it still allows unsafe-inline because the single-file UI uses inline scripts, inline styles and many inline event handlers. A strict CSP requires converting handlers to addEventListener, externalizing styles/scripts, then removing unsafe-inline. The Supabase CDN URL is version-pinned, but an SRI digest was not added because the exact served bytes could not be retrieved and independently hashed in this environment. Do not insert a guessed hash.
2. Supabase Auth dashboard settings: the live security advisor still reports leaked-password protection disabled. Recheck email confirmation and configure production SMTP in the Supabase Auth dashboard before public launch.
3. Account deletion: the gymplified-delete-account Edge Function is deployed and the app confirmation UI is updated, but deletion has not been run end-to-end on a disposable real account. Verify the function removes the auth user, profile, state, tickets/messages and avatar objects before launch.
4. Privacy and terms: both pages remain legal drafts and are currently noindex. They need the controller's legal identity/contact address, retention periods, lawful bases, processor/subprocessor and transfer details, age policy and appropriate EU/UK legal review before being made indexable.
5. PWA icon variants: the manifest declares the existing approved 180px PNG and 384px JPEG assets. Dedicated 192px and 512px PNG exports and a maskable PNG are still needed; those were not fabricated from unknown artwork.
6. Automated runtime testing: the new CI checks are static. Still run browser tests for offline install/navigation, iPad Safari, quota-exceeded storage, two-device concurrent edits/deletes, reset generation, avatar cleanup and account deletion.
7. Maintainability: the main app remains a large single HTML file with global functions, inline CSS/handlers and full UI rerenders. saveState() still invokes rewards/rendering; a component/module split and targeted render updates remain a separate refactor. The patch avoids combining that structural rewrite with security/data migrations.
8. Font trade-off: external Google Fonts requests were removed; the old custom font files were not self-hosted, so the app currently uses system font fallbacks.

## Merge semantics

Records with IDs merge as independent entries. When both devices edit the same record, nested fields merge and scalar conflicts resolve to the last database update. The system now handles reset generations and record tombstones, but it is not a full operation-based sync protocol with per-field conflict resolution.

## Data-integrity repair pass — 9 November 2026

Implemented in the app and live Supabase project:
- [x] Bind cloud progress RPC writes to the authenticated user ID in the state payload; the database rejects a payload whose owner marker does not match `auth.uid()`.
- [x] Keep separate local snapshots per signed-in account, restore the matching account snapshot on account switches, clear the active local state on sign-out, and block cloud saves until the account's initial sync completes.
- [x] For pre-fix local data without an owner marker, require an explicit merge-vs-cloud choice, offer a recovery download, and read the selected account's cloud snapshot without merging defaults when no matching local cache exists.
- [x] Clear completed-set flags after a workout is recorded, preventing the same checked sets from being counted in the next session.
- [x] Remove the silent 200-session truncation. History is retained up to an explicit 5,000-session limit; the app warns and blocks a further completion rather than silently discarding older records.
- [x] Preserve imported duration, distance, set order and notes through state sanitization and cloud synchronization.
- [x] Improve CSV duplicate identity using workout name, source workout ID, timing, duration and complete set metadata.
- [x] Reject ambiguous day/month CSV dates instead of guessing; convert explicit pounds, miles and minutes; require explicit units for generic weight columns.
- [x] Create support tickets and their first message inside one authenticated database transaction.
- [x] Replace the Deluxe day-selection browser prompt with an accessible in-app dialog and tombstone the replaced active workout records.
- [x] Fix the default gold theme's text accent and clear the deleted account's local cache after account deletion.
- [x] Add regression checks for the new data-integrity paths. The latest static-validation workflow passed.

Still not fully resolved / requires external or runtime work:
- [ ] Same-record edits made concurrently on two devices remain last-write-wins. The sync is not a full operation-based or per-field conflict-resolution protocol.
- [ ] Strict CSP and verified SRI still require a broader inline-handler/style refactor and an independently verified CDN digest.
- [ ] Enable leaked-password protection and confirm email verification / production SMTP in the Supabase Auth dashboard.
- [ ] Run end-to-end sign-in, account switching, account deletion, two-device conflict, offline and iPad Safari tests with disposable accounts/devices.
- [ ] Produce approved 192px, 512px and maskable PNG icon exports; existing approved artwork was not replaced or fabricated.
- [ ] Complete legal review of the privacy policy and terms.
