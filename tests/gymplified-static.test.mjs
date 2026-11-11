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
  assert.match(html, /cloudOnly=true/);
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

test('JSON restore refuses histories above the explicit session limit', async () => {
  const html = await read('index.html');
  assert.match(html, /raw\.sessions\.length>5000/);
  assert.match(html, /more than 5,000 workout sessions/);
});

// ---- Batch 1: fix-first (A1–A5, C2, I3, I4) ----
const appScript = (html) => [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(m => m[1]).join('\n');
const count = (text, pattern) => (text.match(pattern) || []).length;
// Pull named top-level function declarations out of the app script so pure helpers can be executed.
function extractFunctions(source, names) {
  return names.map(name => {
    const start = source.indexOf('function ' + name + '(');
    assert.ok(start >= 0, 'missing function ' + name);
    let depth = 0, i = source.indexOf('{', start);
    for (; i < source.length; i++) {
      if (source[i] === '{') depth++;
      else if (source[i] === '}' && --depth === 0) break;
    }
    return source.slice(start, i + 1);
  }).join('\n');
}

test('A1: each Deluxe UI function is defined exactly once', async () => {
  const js = appScript(await read('index.html'));
  for (const name of ['updateDeluxeUI', 'toggleDeluxeDemo', 'openDeluxeDemo', 'previewDeluxeFeature', 'closeDeluxeModal', 'renderDeluxeUI', 'deluxeEnabled']) {
    assert.equal(count(js, new RegExp('function ' + name + '\\(', 'g')), 1, name + ' must have a single definition');
  }
  assert.doesNotMatch(js, /function deluxeDemoEnabled/);
});

test('A2: custom water limit and its message come from one constant', async () => {
  const html = await read('index.html');
  const js = appScript(html);
  assert.match(js, /const WATER_ENTRY_MAX_ML = 5000;/);
  assert.doesNotMatch(html, /6000 ml/);
  assert.doesNotMatch(html, /max="5000" placeholder="ml"/);
  const names = ['waterUnit', 'waterUnitLabel', 'waterMlToDisplay', 'waterDisplayToMl', 'formatWaterAmount', 'waterEntryMaxDisplay', 'waterEntryMinDisplay', 'waterEntryRangeText', 'parseWaterEntryMl'];
  const api = new Function('state', 'const WATER_ENTRY_MAX_ML=5000,ML_PER_US_FL_OZ=29.5735295625;' + extractFunctions(js, names) + ';return {parseWaterEntryMl,waterEntryRangeText,formatWaterAmount};');
  const ml = api({ settings: { waterUnit: 'ml' } });
  assert.equal(ml.parseWaterEntryMl('5000'), 5000);
  assert.equal(ml.parseWaterEntryMl('5001'), 0);
  assert.equal(ml.parseWaterEntryMl('0'), 0);
  assert.equal(ml.parseWaterEntryMl('abc'), 0);
  assert.match(ml.waterEntryRangeText(), /^1–5[,.\s]?000 ml$/);
  const oz = api({ settings: { waterUnit: 'floz' } });
  assert.equal(oz.parseWaterEntryMl('8'), 237);
  assert.equal(oz.parseWaterEntryMl('169'), 4998);
  assert.equal(oz.parseWaterEntryMl('170'), 0);
  assert.equal(oz.waterEntryRangeText(), '0.1–169 fl oz');
  assert.equal(oz.formatWaterAmount(250), '8.5 fl oz');
});

test('A3: dead Gym Machines code is gone and every machine is in the exercise library', async () => {
  const html = await read('index.html');
  for (const dead of ['GYM_MACHINES', 'renderMachines', 'selectMachine', 'addSelectedMachineToLog', 'selectedMachine', 'machine-card', 'machine-grid', 'machineList']) {
    assert.ok(!html.includes(dead), dead + ' should be removed');
  }
  const LIB = new Function(html.match(/const LIB=\{[\s\S]*?\};/)[0] + ';return LIB')();
  const names = Object.values(LIB).flatMap(group => group.split(';').map(entry => entry.split(':')[0]));
  assert.equal(new Set(names).size, names.length, 'library names must be unique');
  // Former machine tab entry -> library exercise that replaces it.
  const machines = {
    'Leg Press Machine': 'Leg Press', 'Lat Pulldown Machine': 'Lat Pulldown', 'Pec Deck Fly Machine': 'Pec Deck Fly',
    'Seated Cable Row': 'Cable Row', 'Seated Shoulder Press Machine': 'Shoulder Press Machine',
    'Leg Extension Machine': 'Leg Extension', 'Seated Hamstring Curl': 'Seated Leg Curl',
    'Cable Triceps Pushdown': 'Cable Triceps Pushdown', 'Cable Biceps Curl Machine': 'Cable Biceps Curl',
    'Standing Calf Raise Machine': 'Standing Calf Raise', 'Abdominal Crunch Machine': 'Ab Crunch Machine'
  };
  assert.equal(Object.keys(machines).length, 11);
  for (const [machine, exercise] of Object.entries(machines)) assert.ok(names.includes(exercise), machine + ' needs library entry ' + exercise);
});

test('A4: the local Deluxe demo unlock only works behind the ?demo=1 developer flag', async () => {
  const html = await read('index.html');
  const js = appScript(html);
  assert.doesNotMatch(html, /onclick="toggleDeluxeDemo\(\)"/);
  assert.match(html, /id="deluxeDemoControls"[^>]*\shidden>/);
  assert.match(js, /TODO\(H3\)/);
  const build = (search, stored) => new Function('location', 'localStorage', "const DELUXE_DEMO_KEY='gymplified_deluxe_demo';" + extractFunctions(js, ['deluxeDemoAllowed', 'deluxeEnabled']) + ';return deluxeEnabled();')({ search }, { getItem: () => stored });
  assert.equal(build('', '1'), false, 'console-set flag must not unlock production');
  assert.equal(build('?demo=0', '1'), false);
  assert.equal(build('?demo=1', null), false);
  assert.equal(build('?demo=1', '1'), true);
});

test('A5: dashboard markup has no hard-coded targets and renders goals from state', async () => {
  const html = await read('index.html');
  const markup = html.slice(0, html.indexOf('<script src="https://cdn.jsdelivr.net'));
  assert.doesNotMatch(markup, />2500</);
  assert.doesNotMatch(markup, />2\.50</);
  assert.doesNotMatch(markup, /2,500 kcal remaining/);
  const js = appScript(html);
  assert.doesNotMatch(js, /state\.water\s*\/\s*2\.5\b/);
  assert.match(js, /function renderWaterSummary/);
});

test('C2: water unit, goal and presets are sanitized and wired without inline handlers', async () => {
  const html = await read('index.html');
  const js = appScript(html);
  assert.match(js, /\['ml','floz'\]\.includes\(settings\.waterUnit\)/);
  assert.match(js, /lastWaterMl:Math\.round\(safeStateNumber\(raw\.lastWaterMl,0,WATER_ENTRY_MAX_ML,0\)\)/);
  assert.match(js, /\.slice\(0,WATER_PRESET_MAX\)/);
  assert.match(html, /id="waterSettings"/);
  for (const fn of ['setWaterUnit', 'saveWaterGoal', 'addWaterPreset', 'removeWaterPreset', 'moveWaterPreset', 'initWaterControls']) assert.match(js, new RegExp('function ' + fn + '\\('));
  const waterUi = js.slice(js.indexOf('function renderWaterButtons'), js.indexOf('function renderExtras'));
  assert.doesNotMatch(waterUi, /\son[a-z]+=/, 'water UI must use listeners, not inline handlers');
  assert.match(waterUi, /esc\(formatWaterAmount/);
  // Ratchet: the inline handler count may only go down (strict CSP work is tracked in K3).
  assert.ok(count(html, / on[a-z]+=\\?["']/g) <= 136, 'do not add inline event handlers');
});

function luminance(hex) {
  const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255).map(v => v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

test('I3: focus ring is defined for every control and has 3:1 contrast in both themes', async () => {
  const html = await read('index.html');
  const css = html.match(/<style>([\s\S]*?)<\/style>/)[1];
  assert.match(css, /html :is\(a,button,input,select,textarea,summary,label,\[tabindex\],\[role=button\]\):focus-visible\{outline:3px solid var\(--focus-ring\)!important/);
  const vars = block => Object.fromEntries([...block.matchAll(/(--[a-z-]+):\s*(#[0-9a-fA-F]{6})\b/g)].map(m => [m[1], m[2]]));
  const dark = { ...vars(css.match(/:root \{([\s\S]*?)\}/)[1]), ...vars(css.match(/:root\{(--focus-ring[^}]*)\}/)[1]) };
  const light = { ...dark, ...vars(css.match(/html\[data-theme="light"\] \{([\s\S]*?)\}/)[1]), ...vars(css.match(/html\[data-theme=light\]\{(--focus-ring[^}]*)\}/)[1]) };
  for (const [theme, v] of [['dark', dark], ['light', light]]) {
    for (const surface of ['--bg', '--panel', '--panel-hover']) {
      const ratio = contrast(v['--focus-ring'], v[surface]);
      assert.ok(ratio >= 3, theme + ' focus ring vs ' + surface + ' is ' + ratio.toFixed(2) + ':1');
    }
    assert.ok(contrast(v['--focus-ring'], v['--focus-halo']) >= 3, theme + ' focus ring vs halo');
  }
});

test('I4: controls meet the 44px minimum touch target', async () => {
  const html = await read('index.html');
  const css = html.match(/<style>([\s\S]*?)<\/style>/)[1];
  assert.match(css, /\.btn,\.check-btn,nav button\{min-height:44px\}/);
  assert.match(css, /\.btn-icon-only,\.check-btn\{min-width:44px\}/);
  assert.match(css, /\.setrow\{grid-template-columns:34px minmax\(0,1fr\) minmax\(0,1fr\) 44px 44px\}/);
  // No button may shrink itself below 44px with an inline size.
  for (const [tag] of html.matchAll(/<button\b[^>]*>/g)) {
    for (const [, px] of tag.matchAll(/(?:^|[;"\s])(?:min-)?(?:height|width):\s*(\d+)px/g)) assert.ok(Number(px) >= 44, 'undersized inline button: ' + tag.slice(0, 120));
  }
});

test('service worker cache name was bumped with the index.html change', async () => {
  const sw = await read('sw.js');
  const version = Number(sw.match(/const CACHE_NAME = 'gymplified-shell-v(\d+)'/)[1]);
  assert.ok(version >= 12);
});

test('dark theme accent tint stays dark enough for body text on every accent', async () => {
  const html = await read('index.html');
  const css = html.match(/<style>([\s\S]*?)<\/style>/)[1];
  assert.match(css, /html:not\(\[data-theme=light\]\)\{--brand-light:color-mix\(in srgb,var\(--brand\) 18%,var\(--panel\)\)\}/);
  const root = css.match(/:root \{([\s\S]*?)\}/)[1];
  const pick = (block, name) => block.match(new RegExp(name + ':\\s*(#[0-9a-fA-F]{6})'))[1];
  const panel = pick(root, '--panel'), ink = pick(root, '--ink'), muted = pick(root, '--muted');
  const channels = hex => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
  const mix = (a, b, share) => '#' + channels(a).map((v, i) => Math.round(v * share + channels(b)[i] * (1 - share)).toString(16).padStart(2, '0')).join('');
  const accents = [...css.matchAll(/html\[data-color="([a-z]+)"\] \{ --brand: (#[0-9a-fA-F]{6});/g)];
  assert.equal(accents.length, 7);
  for (const [, name, brand] of accents) {
    const tint = mix(brand, panel, 0.18);
    assert.ok(contrast(ink, tint) >= 7, name + ' tint vs text ' + contrast(ink, tint).toFixed(2));
    assert.ok(contrast(muted, tint) >= 4.5, name + ' tint vs muted text ' + contrast(muted, tint).toFixed(2));
  }
});
