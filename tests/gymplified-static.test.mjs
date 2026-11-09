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
