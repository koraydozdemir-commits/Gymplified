import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const read = (path) => readFile(new URL(path, root), 'utf8');

test('inline application scripts and standalone scripts parse', async () => {
  const html = await read('index.html');
  const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)]
    .map(match => match[1]).filter(source => source.trim());
  assert.ok(scripts.length >= 1, 'expected the app script');
  for (const source of scripts) assert.doesNotThrow(() => new Function(source));
  const sw = await read('sw.js');
  const analytics = await read('analytics.js');
  assert.doesNotThrow(() => new Function(sw));
  assert.doesNotThrow(() => new Function(analytics));
});

test('service worker does not cache legal pages over the app shell', async () => {
  const sw = await read('sw.js');
  assert.match(sw, /await cache\.put\(request,\s*response\.clone\(\)\)/);
  assert.match(sw, /if \(appEntry\) await cache\.put\('\.\/index\.html'/);
  assert.doesNotMatch(sw, /cache\.put\('\.\/index\.html',\s*copy\)/);
  assert.match(sw, /'\.\/analytics\.js'/);
  assert.match(sw, /SUPABASE_SDK/);
});

test('manifest JSON references existing icon assets', async () => {
  const manifest = JSON.parse(await read('manifest.webmanifest'));
  assert.ok(Array.isArray(manifest.icons) && manifest.icons.length >= 2);
  for (const icon of manifest.icons) await access(new URL(icon.src, root));
});

test('analytics is opt-in, anonymous and reuses the app Supabase client', async () => {
  const analytics = await read('analytics.js');
  assert.match(analytics, /gymplified_analytics_consent/);
  assert.match(analytics, /getConsent\(\) !== 'granted'/);
  assert.match(analytics, /user_id:\s*null/);
  assert.match(analytics, /getGymplifiedSupabaseClient/);
  assert.doesNotMatch(analytics, /createClient\s*\(/);
});

test('restore validates before saving and the state sanitizer is present', async () => {
  const html = await read('index.html');
  assert.match(html, /function sanitizeStateSnapshot/);
  assert.match(html, /function validateBackupData/);
  assert.match(html, /validateBackupData\(JSON\.parse\(reader\.result\)\)/);
  assert.doesNotMatch(html, /localStorage\.setItem\(STORAGE_KEY,\s*JSON\.stringify\(o\)\)/);
  assert.match(html, /Could not save on this device/);
  assert.match(html, /Cloud sync failed/);
});

test('stored data render paths escape text and encode generated JS arguments', async () => {
  const html = await read('index.html');
  assert.match(html, /Number\(pr\.weight\)/);
  assert.match(html, /Number\(pr\.reps\)/);
  assert.match(html, /esc\(pr\.date/);
  assert.match(html, /esc\(meal\)/);
  assert.match(html, /esc\(x\.eq\).*esc\(x\.pm\)/);
  assert.match(html, /jsArg\(x\.id\)/);
  assert.match(html, /function avatarMarkup/);
  assert.match(html, /url\.origin==='https:\/\/ouwvujtsrnotnwtbvqhc\.supabase\.co'/);
});

test('cloud sync uses the authenticated merge RPC and reset generations', async () => {
  const html = await read('index.html');
  assert.match(html, /gymplified_merge_user_app_state/);
  assert.match(html, /stateRevision=0/);
  assert.match(html, /resetAt:safeStateNumber/);
  assert.match(html, /markRecordDeleted\('waterEntries'/);
});

test('admin routes are not indexable', async () => {
  for (const path of ['admin.html','admin-users.html','admin-support.html']) {
    const html = await read(path);
    assert.match(html, /name="robots" content="noindex,nofollow,noarchive"/);
  }
  assert.match(await read('robots.txt'), /Disallow: \/admin-users\.html/);
});

test('keyboard controls, stable navigation and live regions exist', async () => {
  const html = await read('index.html');
  assert.match(html, /class="ex-preview-button"/);
  assert.match(html, /<button type="button" class="machine-card/);
  assert.match(html, /id="toastContainer" role="status"/);
  assert.match(html, /id="liveStats" role="status"/);
  assert.match(html, /id="timerOut" role="timer"/);
  assert.doesNotMatch(html, /querySelectorAll\('nav button'\)\s*\[\s*[23]\s*\]/);
  assert.match(html, /data-screen="training"/);
});

test('SEO metadata and privacy-safe font configuration exist', async () => {
  const html = await read('index.html');
  assert.match(html, /name="description"/);
  assert.match(html, /rel="canonical"/);
  assert.match(html, /property="og:title"/);
  assert.doesNotMatch(html, /fonts\.googleapis\.com/);
});

test('account sync is isolated by authenticated owner', async () => {
  const html = await read('index.html');
  const migration = await read('supabase/migrations/20261109173342_gymplified_owner_bound_sync_and_atomic_support_tickets.sql');
  assert.match(html, /ACCOUNT_OWNER_KEY/);
  assert.match(html, /prepareLocalAccountState/);
  assert.match(html, /releaseLocalAccountState/);
  assert.match(html, /cloudSyncUserId!==currentUser\.id/);
  assert.match(html, /snapshot\.accountOwnerId=id/);
  assert.match(migration, /p_state ->> 'accountOwnerId' IS DISTINCT FROM v_user_id::text/);
});

test('completed workouts cannot count the same checked sets twice', async () => {
  const html = await read('index.html');
  assert.match(html, /state\.lastSession=state\.workouts\.map/);
  assert.match(html, /state\.workouts\.forEach\(w=>\{w\.done=false;\(w\.setList\|\|\[\]\)\.forEach\(x=>\{x\.done=false;/);
  assert.doesNotMatch(html, /state\.sessions=state\.sessions\.slice\(0,200\)/);
});

test('session history retains imported cardio metadata and allows 5,000 records', async () => {
  const html = await read('index.html');
  assert.match(html, /sessions:list\(raw\.sessions,5000\)/);
  assert.match(html, /duration:safeStateNumber\(s\.duration,0,86400,0\)/);
  assert.match(html, /distance:safeStateNumber\(s\.distance,0,1000,0\)/);
  assert.match(html, /notes:safeStateText\(s\.notes,'',500\)/);
  assert.match(html, /length>=5000/);
});

test('CSV import avoids ambiguous dates and compares complete workout identity', async () => {
  const html = await read('index.html');
  assert.match(html, /Ambiguous date/);
  assert.match(html, /sourceWorkoutId/);
  assert.match(html, /Number\(s\.duration\)\|\|0/);
  assert.match(html, /weightUnitKeys/);
  assert.match(html, /length\+fresh\.length>5000/);
});

test('support ticket and first message are created in one transaction', async () => {
  const html = await read('index.html');
  const migration = await read('supabase/migrations/20261109173342_gymplified_owner_bound_sync_and_atomic_support_tickets.sql');
  assert.match(html, /gymplified_create_support_ticket/);
  assert.match(migration, /CREATE OR REPLACE FUNCTION public\.gymplified_create_support_ticket/);
  assert.match(migration, /SECURITY INVOKER/);
  assert.match(migration, /INSERT INTO public\.support_tickets/);
  assert.match(migration, /INSERT INTO public\.support_ticket_messages/);
});

test('gold accent uses gold text rather than the old blue default', async () => {
  const html = await read('index.html');
  assert.match(html, /:root\{--brand-text:#e8b84b/);
  assert.match(html, /data-color=gold\]\{--brand-text:#92400e/);
});

test('Deluxe day loading uses an in-app picker and tombstones replaced workouts', async () => {
  const html = await read('index.html');
  assert.match(html, /id="deluxePlanDayDialog"/);
  assert.match(html, /function confirmLoadDeluxePlan\(\)/);
  assert.match(html, /markRecordDeleted\('workouts',x\)/);
  assert.doesNotMatch(html, /const day=prompt\('Which day should be loaded/);
});

test('CSV importer requires explicit units for ambiguous weights and converts supported units', async () => {
  const html = await read('index.html');
  assert.match(html, /Weight units are unclear/);
  assert.match(html, /0\.45359237/);
  assert.match(html, /distance\*=1\.609344/);
  assert.match(html, /duration\*=60/);
});

test('unowned legacy local data requires an explicit account migration choice', async () => {
  const html = await read('index.html');
  assert.match(html, /function hasLocalProgress/);
  assert.match(html, /id="legacyLocalDataDialog"/);
  assert.match(html, /resolveLegacyLocalData\(true\)/);
  assert.match(html, /resolveLegacyLocalData\(false\)/);
  assert.match(html, /downloadLegacyLocalBackup/);
  assert.match(html, /ACCOUNT_STATE_PREFIX\+'unassigned'/);
});

test('CSV importer rejects contradictory or missing weight and distance units', async () => {
  const html = await read('index.html');
  assert.match(html, /Weight column and weight unit disagree/);
  assert.match(html, /Distance units are unclear/);
  assert.match(html, /Distance column and distance unit disagree/);
});

test('choosing cloud-only progress reads the account snapshot without merging local data', async () => {
  const html = await read('index.html');
  const migration = await read('supabase/migrations/20261109173834_gymplified_read_own_cloud_state_for_safe_account_switch.sql');
  assert.match(html, /syncUserAppState\(cloudOnly=false\)/);
  assert.match(html, /sb\.rpc\('gymplified_get_user_app_state'\)/);
  assert.match(html, /syncUserAppState\(!merge\)/);
  assert.match(migration, /SECURITY INVOKER/);
  assert.match(migration, /WHERE user_id = auth\.uid\(\)/);
});

test('switching to an account without a local cache reads cloud state instead of merging defaults', async () => {
  const html = await read('index.html');
  assert.match(html, /let owner='',cloudOnly=false/);
  assert.match(html, /if\(!cached\)cloudOnly=true/);
  assert.match(html, /syncUserAppState\(syncMode==='cloud'\)/);
  assert.match(html, /sb\.rpc\('gymplified_get_user_app_state'\)/);
});

test('unassigned recovery data remains available after switching accounts', async () => {
  const html = await read('index.html');
  assert.match(html, /ACCOUNT_STATE_PREFIX\+'unassigned'/);
  assert.match(html, /else if\(unassigned\)/);
  assert.match(html, /pendingLegacyAccountId=userId;return true/);
});

test('workout history displays preserved cardio and notes fields', async () => {
  const html = await read('index.html');
  assert.match(html, /function sessionSetSummary/);
  assert.match(html, /Number\(set\.duration\)>0/);
  assert.match(html, /Number\(set\.distance\)>0/);
  assert.match(html, /esc\(set\.notes\)/);
  assert.match(html, /row\.sets\.map\(sessionSetSummary\)/);
});
