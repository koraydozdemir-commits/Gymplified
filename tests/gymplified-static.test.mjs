import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const readRaw = (path) => readFile(new URL(path, root), 'utf8');
// K2: index.html is a thin shell that loads app.css and app.js. Most checks read the app as one document,
// so `read('index.html')` puts the two files back where the shell references them.
const read = async (path) => {
  const text = await readRaw(path);
  if (path !== 'index.html') return text;
  const [css, js] = await Promise.all([readRaw('app.css'), readRaw('app.js')]);
  return text
    .replace('<link rel="stylesheet" href="./app.css">', () => '<style>\n' + css + '</style>')
    .replace('<script src="./app.js"></script>', () => '<script>\n' + js + '</script>');
};

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
  assert.match(html, /data-id="'\+esc\(x\.id\)\+'"/, 'friend ids in generated markup are escaped attribute values');
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
  assert.match(html, /data-action="resolveLegacyLocalData" data-arg="true"/);
  assert.match(html, /data-action="resolveLegacyLocalData" data-arg="false"/);
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
const INLINE_HANDLER_BUDGET = 0;
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
  const build = (search, stored, access = { deluxe: false, userId: '' }, user = null) => new Function('location', 'localStorage', 'deluxeAccess', 'currentUser', "const DELUXE_DEMO_KEY='gymplified_deluxe_demo';" + extractFunctions(js, ['deluxeDemoAllowed', 'deluxeDemoOn', 'deluxeOwned', 'deluxeEnabled']) + ';return deluxeEnabled();')({ search }, { getItem: () => stored }, access, user);
  assert.equal(build('', '1'), false, 'console-set flag must not unlock production');
  assert.equal(build('?demo=0', '1'), false);
  assert.equal(build('?demo=1', null), false);
  assert.equal(build('?demo=1', '1'), true);
  // Batch 9: the server entitlement unlocks Deluxe, but only for the account it was fetched for
  assert.equal(build('', null, { deluxe: true, userId: 'u1' }, { id: 'u1' }), true);
  assert.equal(build('', null, { deluxe: true, userId: 'u1' }, { id: 'u2' }), false, 'another account after switching');
  assert.equal(build('', null, { deluxe: true, userId: 'u1' }, null), false, 'signed out');
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
  assert.ok(count(html, / on[a-z]+=\\?["']/g) <= INLINE_HANDLER_BUDGET, 'do not add inline event handlers');
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
  assert.match(css, /\.setrow\{grid-template-columns:44px minmax\(0,1fr\) minmax\(0,1fr\) 44px 44px\}/);
  // No button may shrink itself below 44px with an inline size.
  for (const [tag] of html.matchAll(/<button\b[^>]*>/g)) {
    for (const [, px] of tag.matchAll(/(?:^|[;"\s])(?:min-)?(?:height|width):\s*(\d+)px/g)) assert.ok(Number(px) >= 44, 'undersized inline button: ' + tag.slice(0, 120));
  }
});

test('service worker cache name was bumped with the index.html change', async () => {
  const sw = await read('sw.js');
  const version = Number(sw.match(/const CACHE_NAME = 'gymplified-shell-v(\d+)'/)[1]);
  assert.ok(version >= 24);
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

// ---- Batch 2: workout flow (B1–B6, B21, B22, G1, G3) ----
const batch2 = (js) => js.slice(js.indexOf('// ===== Batch 2: workout flow'), js.indexOf('// ===== Gymplified accounts + real friend connections ====='));
function extractConst(source, name) {
  const start = source.indexOf('const ' + name + '=');
  assert.ok(start >= 0, 'missing const ' + name);
  return source.slice(start, source.indexOf(';\n', start) + 1);
}

test('B21/B22: exercise search forgives typos and synonyms and ranks favourites and recents', async () => {
  const html = await read('index.html');
  const js = appScript(html);
  const names = ['exNormalize', 'exStem', 'exEditDistance', 'exTokenScore', 'exIndexFor', 'exMatchScore', 'searchExercises'];
  const search = new Function(
    html.match(/const MC=\{[^}]*\};/)[0] + "const slug=n=>n.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');const mkEx=(n,eq,pm,sec,c)=>({id:(c?'c-':'')+slug(n),name:n,eq,pm,sec,custom:!!c});" +
    html.match(/const LIB=\{[\s\S]*?\};/)[0] + html.match(/const EX=\[\];.*\n/)[0] +
    extractConst(js, 'EX_SYNONYMS') + 'const exSearchIndex=new Map();' + extractFunctions(js, names) +
    ';return (q,fav=[],recent=[])=>searchExercises(EX,q,id=>fav.includes(id),new Map(recent.map((n,i)=>[n,i]))).map(x=>x.name);')();
  assert.equal(search('lat pull-down')[0], 'Lat Pulldown');
  assert.equal(search('lat pulldown')[0], 'Lat Pulldown');
  assert.equal(search('RDL')[0], 'Romanian Deadlift');
  assert.equal(search('romanian deadlift')[0], 'Romanian Deadlift');
  assert.equal(search('pullup')[0], 'Pull-Up');
  assert.equal(search('leg pres')[0], 'Leg Press');
  assert.ok(search('benhc pres').slice(0, 8).includes('Flat Bench Press'), 'typo should still find bench press');
  assert.ok(search('skullcrusher').includes('Skull Crushers'));
  assert.equal(search('db curl')[0], 'Dumbbell Curl');
  assert.ok(search('db curl').includes('Hammer Curl'), 'equipment words match non-name fields too');
  assert.deepEqual(search('zzzz'), []);
  // exact match beats favourites/recents; among equal matches favourites and recents rise
  assert.equal(search('leg press', ['leg-press-single-leg'], [])[0], 'Leg Press');
  const plain = search('bench press'), boosted = search('bench press', ['incline-bench-press'], []);
  assert.notEqual(plain[0], 'Incline Bench Press');
  assert.equal(boosted[0], 'Incline Bench Press');
  assert.equal(search('bench press', [], ['decline bench press'])[0], 'Decline Bench Press');
  assert.match(js, /section\('★ Favourites'\)/);
  assert.match(js, /section\('Recent'\)/);
  // favourites are an id map so removal survives the server-side union merge of arrays
  assert.match(js, /state\.exFav\[k\]=raw\.exFav\[k\]\?1:0/);
});

test('B4/G3: warm-up sets are excluded from volume and PR detection', async () => {
  const js = appScript(await read('index.html'));
  const names = ['setCountsForVolume', 'setTypeOf', 'calculate1RM', 'bestPreviousSet', 'exerciseRecordE1RM', 'detectSessionPRs'];
  const make = state => new Function('state', "const SET_TYPES=['normal','warmup','drop','failure'];" + extractFunctions(js, names) + ';return {setCountsForVolume,detectSessionPRs};')(state);
  const history = { prs: [], sessions: [{ exercises: [{ name: 'Leg Press', sets: [{ kg: 100, reps: 10, type: 'normal' }, { kg: 300, reps: 10, type: 'warmup' }] }] }] };
  const api = make(history);
  assert.equal(api.setCountsForVolume({ done: true, type: 'warmup' }), false);
  assert.equal(api.setCountsForVolume({ done: true, type: 'drop' }), true);
  assert.equal(api.setCountsForVolume({ done: false, type: 'normal' }), false);
  // heavier working set is a PR; the historical warm-up at 300 kg is not a record to beat
  assert.deepEqual(api.detectSessionPRs([{ name: 'leg press', sets: [{ kg: 110, reps: 10, type: 'normal' }] }]), [{ name: 'leg press', kg: 110, reps: 10 }]);
  // a heavy warm-up today is not a PR, equal performance is not a PR, first-ever exercise is not a PR
  assert.deepEqual(api.detectSessionPRs([{ name: 'Leg Press', sets: [{ kg: 200, reps: 10, type: 'warmup' }, { kg: 100, reps: 10, type: 'normal' }] }]), []);
  assert.deepEqual(api.detectSessionPRs([{ name: 'New Lift', sets: [{ kg: 50, reps: 5, type: 'normal' }] }]), []);
  assert.match(js, /const vol=w=>w\.setList\.filter\(setCountsForVolume\)/);
  assert.match(js, /if\(setCountsForVolume\(x\)\)v\+=x\.kg\*x\.reps/);
  assert.match(js, /type:SET_TYPES\.includes\(x\.type\)\?x\.type:'normal',auto:!!x\.auto&&!x\.done/);
  assert.match(js, /type:SET_TYPES\.includes\(s\.type\)\?s\.type:'normal'/);
});

test('B1/B2: rest timer auto-starts, persists, and alerts with vibration, beep and optional notification', async () => {
  const html = await read('index.html');
  const js = appScript(html);
  assert.match(js, /if\(restSetting\(\)>0\)startRest\(restSetting\(\)\)/);
  assert.match(js, /localStorage\.setItem\(REST_TIMER_KEY/);
  assert.match(js, /function restoreRestTimer/);
  assert.match(js, /navigator\.vibrate&&navigator\.vibrate\(\[200,100,200\]\)/);
  assert.match(js, /if\(state\.settings\.restBeep!==false\)restBeep\(\)/);
  assert.match(js, /if\(state\.settings\.restNotify&&document\.hidden\)restNotification\(\)/);
  assert.match(js, /Notification\.requestPermission\(\)/);
  assert.match(html, /id="restBar" role="group" aria-label="Rest timer" hidden/);
  assert.match(html, /id="restBarTime" role="timer"/);
  for (const value of ['0', '60', '90', '120', 'custom']) assert.match(html, new RegExp('<option value="' + value + '">'));
  assert.match(js, /restSeconds: 90/);
  assert.match(js, /state\.settings\.restSeconds=Math\.round\(safeStateNumber\(settings\.restSeconds,0,REST_SECONDS_MAX,REST_DEFAULT_SECONDS\)\)/);
  const css = html.match(/<style>([\s\S]*?)<\/style>/)[1];
  assert.match(css, /\.rest-bar\{position:fixed/);
  assert.match(await read('sw.js'), /addEventListener\('notificationclick'/);
  const timer = new Function('state', 'const REST_SECONDS_MAX=600,REST_DEFAULT_SECONDS=90;' + extractFunctions(js, ['restSetting', 'formatClockSeconds']) + ';return {restSetting,formatClockSeconds};');
  assert.equal(timer({ settings: {} }).restSetting(), 90);
  assert.equal(timer({ settings: { restSeconds: 0 } }).restSetting(), 0);
  assert.equal(timer({ settings: { restSeconds: 9999 } }).restSetting(), 600);
  assert.equal(timer({ settings: {} }).formatClockSeconds(95), '1:35');
});

test('B3/B5/B6/G1: prefill, crash recovery, header chip and dashboard hero are wired', async () => {
  const html = await read('index.html');
  const js = appScript(html);
  assert.match(js, /function suggestedSetsFor/);
  assert.match(js, /const suggested=suggestedSetsFor\(x\.name\)/);
  assert.match(js, /addEventListener\('pagehide',flushDraftSave\)/);
  assert.match(js, /resumeBannerOpen=!!state\.session/);
  assert.match(html, /id="resumeBanner"[^>]*hidden/);
  assert.match(html, /id="sessionChip"[^>]*hidden/);
  assert.match(html, /id="workoutHero"/);
  for (const action of ['start', 'resume', 'summary']) assert.match(js, new RegExp('data-hero-action="' + action + '"'));
  assert.match(js, /xpStart:safeStateNumber\(raw\.session\.xpStart/);
  for (const field of ['duration', 'total volume', 'sets', 'reps', 'XP earned', 'PRs hit', 'Muscles worked']) assert.ok(js.includes(field), 'summary shows ' + field);
  assert.match(js, /data-summary-action="share"/);
  assert.match(js, /navigator\.clipboard\.writeText\(text\)/);
  const block = batch2(js);
  assert.ok(block.length > 5000);
  assert.doesNotMatch(block, /\son[a-z]+=/, 'Batch 2 UI must use listeners, not inline handlers');
  assert.match(block, /behavior:reducedMotion\(\)\?'auto':'smooth'/);
});

// ---- Batch 3: units, week start, profile, onboarding, settings sections, backup reminders ----
const UNIT_CONSTS = 'const KG_PER_LB=0.45359237,KM_PER_MI=1.609344,CM_PER_IN=2.54,BACKUP_REMINDER_DAYS=30;';

test('C1/C3: weight, distance and height are converted for display only', async () => {
  const html = await read('index.html');
  const js = appScript(html);
  const names = ['weightUnit', 'kgToDisplay', 'displayToKg', 'fmtWeight', 'volumeNumber', 'fmtVolume', 'distanceUnit', 'fmtDistance', 'heightUnit', 'cmToFeetInches', 'feetInchesToCm', 'fmtHeight', 'calculate1RM'];
  const api = settings => new Function('state', UNIT_CONSTS + extractFunctions(js, names) + ';return {kgToDisplay,displayToKg,fmtWeight,fmtVolume,fmtDistance,fmtHeight,feetInchesToCm,calculate1RM};')({ settings });
  const kg = api({}), lb = api({ weightUnit: 'lb', distanceUnit: 'mi', heightUnit: 'ftin' });
  assert.equal(kg.fmtWeight(60), '60 kg');
  assert.equal(kg.kgToDisplay(62.5, 2), 62.5);
  assert.equal(lb.fmtWeight(100), '220.5 lb');
  // a typed lb value survives storage in kg at 0.001 precision
  for (const typed of [45, 135, 225, 315, 2.5, 182.5]) assert.equal(lb.kgToDisplay(Math.round(lb.displayToKg(typed) * 1000) / 1000, 2), typed);
  assert.equal(lb.fmtWeight(lb.calculate1RM(Math.round(lb.displayToKg(135) * 1000) / 1000, 10)), '180 lb');
  assert.equal(kg.fmtDistance(5), '5.00 km');
  assert.equal(lb.fmtDistance(1.609344), '1.00 mi');
  assert.equal(kg.fmtHeight(180), '180 cm');
  assert.equal(lb.fmtHeight(180.34), '5 ft 11 in');
  assert.ok(Math.abs(lb.feetInchesToCm(5, 11) - 180.34) < 0.001);
  // no hard-coded kg left in rendered UI strings (canonical CSV backup and the importer keep kg)
  const ui = js.split('\n').filter(line => !/Weight \(kg\)|weight kg|kgs\|kilogram|Rename the column|1,000 kg/.test(line)).join('\n');
  assert.doesNotMatch(ui, /' kg\b|kg volume|\}kg\b| KG\b/);
  assert.match(js, /Math\.round\(displayToKg\(n\)\*1000\)\/1000/);
  assert.match(js, /\['kg','lb'\]\.includes\(settings\.weightUnit\)/);
  assert.match(js, /\['km','mi'\]\.includes\(settings\.distanceUnit\)/);
  assert.match(js, /\['cm','ftin'\]\.includes\(settings\.heightUnit\)/);
  assert.equal(count(html, /data-weight-unit>/g), 2, 'PR form and Deluxe planner labels follow the weight unit (A9/H6)');
});

test('C4: week start day drives streak weeks, recap and weekly charts', async () => {
  const js = appScript(await read('index.html'));
  const api = settings => new Function('state', extractFunctions(js, ['weekStartsSunday', 'daysSinceWeekStart']) + ';return daysSinceWeekStart;')({ settings });
  const wednesday = new Date(2026, 10, 11), sunday = new Date(2026, 10, 8), monday = new Date(2026, 10, 9);
  assert.equal(api({})(wednesday), 2);
  assert.equal(api({})(sunday), 6);
  assert.equal(api({})(monday), 0);
  assert.equal(api({ weekStart: 'sun' })(wednesday), 3);
  assert.equal(api({ weekStart: 'sun' })(sunday), 0);
  // The friends leaderboard deliberately uses Monday weeks so friends compare the same week (E1).
  const personalWeeks = js.replace(/function leaderboardWeekKey\([^\n]*\n/, '').replace(/function msToLeaderboardReset\([^\n]*\n/, '');
  assert.doesNotMatch(personalWeeks, /getDay\(\)\+6\)%7\)?;return dayKey/);
  assert.equal(count(js, /daysSinceWeekStart\(/g) >= 5, true);
  assert.match(js, /\['mon','sun'\]\.includes\(settings\.weekStart\)/);
  assert.match(js, /x\.date>=startKey&&x\.date<=todayKey/);
});

test('C5: calorie suggestion is an optional estimate from the profile', async () => {
  const html = await read('index.html');
  const js = appScript(html);
  const suggest = new Function(extractConst(js, 'ACTIVITY_LEVELS') + extractConst(js, 'GOAL_OPTIONS') + extractFunctions(js, ['suggestCalories']) + ';return suggestCalories;')();
  const base = { weightKg: 80, heightCm: 180, age: 30, sex: 'male', activity: 'moderate', goal: 'maintain' };
  // Mifflin-St Jeor: 10*80 + 6.25*180 - 5*30 + 5 = 1780; x1.55 = 2759 -> 2750
  assert.equal(suggest(base), 2750);
  assert.equal(suggest({ ...base, sex: 'female' }), 2500);
  assert.ok(suggest({ ...base, goal: 'cut' }) < 2750 && suggest({ ...base, goal: 'bulk' }) > 2750);
  assert.equal(suggest({ ...base, weightKg: 0 }), 0);
  assert.equal(suggest({ ...base, activity: '' }), 0);
  assert.equal(suggest({ weightKg: 20, heightCm: 50, age: 100, sex: 'female', activity: 'sedentary', goal: 'cut' }), 1200, 'never suggests below 1,200 kcal');
  assert.match(js, /Estimate only/);
  assert.match(js, /state\.profile=\{heightCm:profileRange\(rawProfile\.heightCm,50,260\)/);
  assert.equal(count(js, /function saveProfile\(/g), 1, 'account saveProfile must not be shadowed');
  assert.match(js, /function saveBodyProfile\(/);
});

test('C6/J2: onboarding is skippable and backup reminders follow the 30-day rule', async () => {
  const html = await read('index.html');
  const js = appScript(html);
  assert.match(html, /id="onboardingPanel"[^>]*hidden/);
  assert.match(js, /function onboardingNeeded\(\)\{return !state\.onboarded&&!hasLocalProgress\(state\);\}/);
  assert.match(js, /data-onboarding-action="skip"/);
  assert.match(js, /state\.onboarded=!!raw\.onboarded/);
  const make = (sessions, store) => new Function('state', 'localStorage', UNIT_CONSTS + extractConst(js, 'BACKUP_AT_KEY').replace(/;$/, ';') + extractFunctions(js, ['readLocalNumber', 'lastBackupAt', 'backupAgeDays', 'backupReminderDue', 'backupStatusText']) + ';return {backupReminderDue,backupStatusText,backupAgeDays};')({ sessions }, { getItem: k => store[k] ?? null });
  const now = Date.UTC(2026, 10, 11), day = 864e5, three = [{}, {}, {}];
  assert.equal(make([], {}).backupReminderDue(now), false, 'no nag for a brand new user');
  assert.equal(make(three, {}).backupReminderDue(now), true, 'history without any backup');
  assert.equal(make(three, { gymplified_last_backup_at: String(now - 29 * day) }).backupReminderDue(now), false);
  assert.equal(make(three, { gymplified_last_backup_at: String(now - 30 * day) }).backupReminderDue(now), true);
  assert.equal(make(three, { gymplified_last_backup_at: String(now - 40 * day), gymplified_backup_snooze_until: String(now + day) }).backupReminderDue(now), false);
  assert.match(js, /markBackupDone\(\);showToast\('Backup exported'\)/);
  assert.match(html, /data-backup-action="export"/);
});

test('J1: settings are grouped into sections with jump links', async () => {
  const html = await read('index.html');
  const sections = ['appearance', 'accessibility', 'units', 'training', 'nutrition', 'notifications', 'privacy', 'data', 'account', 'help'];
  let last = -1;
  for (const key of sections) {
    assert.match(html, new RegExp('<a href="#set-' + key + '" data-settings-jump="set-' + key + '">'));
    const at = html.indexOf('<section class="settings-section" id="set-' + key + '"');
    assert.ok(at > last, key + ' section exists in order');
    last = at;
    assert.match(html, new RegExp('<h2 id="set-' + key + '-h" tabindex="-1">'));
  }
  for (const id of ['themeSelect', 'scaleSelect', 'gSpacing', 'weightUnitSelect', 'distanceUnitSelect', 'heightUnitSelect', 'waterUnitSelect', 'weekStartSelect', 'gWeek', 'restAutoSelect', 'gCal', 'profilePanel', 'waterSettings', 'restNotifyToggle', 'privacyPreferences', 'importFile', 'gymplifiedCsvInput', 'supportPanel']) {
    assert.equal(count(html, new RegExp('id="' + id + '"', 'g')), 1, id + ' appears exactly once');
  }
  const settings = html.slice(html.indexOf('<section id="settings"'), html.indexOf('<!-- GYMPLIFIED DELUXE -->'));
  // every unit selector must be wired to a handler after the move into Units
  for (const id of ['weightUnitSelect', 'distanceUnitSelect', 'heightUnitSelect', 'weekStartSelect']) assert.match(appScript(html), new RegExp(id + ":'"));
  assert.match(appScript(html), /id==='waterUnitSelect'\)setWaterUnit\(e\.target\.value\)/);
  assert.ok(settings.includes('id="restSettings"') && settings.includes('data-action="deleteGymplifiedAccount"') && settings.includes('data-action="resetAllData"'));
  assert.match(appScript(html), /behavior:reducedMotion\(\)\?'auto':'smooth',block:'start'\}\);\n const heading=section\.querySelector\('h2'\)/);
});

test('page markup inside <main> has balanced container tags', async () => {
  const html = await read('index.html');
  const main = html.slice(html.indexOf('<main'), html.indexOf('</main>')).replace(/<style>[\s\S]*?<\/style>/g, '');
  for (const tag of ['div', 'section', 'details', 'form', 'nav', 'label', 'select', 'button', 'article']) {
    assert.equal(count(main, new RegExp('<' + tag + '\\b', 'g')), count(main, new RegExp('</' + tag + '>', 'g')), '<' + tag + '> open/close tags must match');
  }
  // every screen is a direct child of <main>, so one screen can never swallow the next
  const screens = [...main.matchAll(/\n( *)<section id="([a-z]+)" class="screen/g)];
  assert.equal(screens.length, 7);
  assert.equal(new Set(screens.map(m => m[1].length)).size, 1);
});

// ---- Batch 4: gamification (D1–D9) ----
const STREAK_CONSTS = 'const STREAK_FREEZE_MAX=2,STREAK_FREEZE_EVERY=7,STREAK_NUDGE_HOUR=18,XP_LOG_MAX=60;';
function streakApi(js) {
  return new Function(STREAK_CONSTS + extractFunctions(js, ['dayKey', 'shiftDay', 'computeDailyStreak', 'planFreezeUse']) + ';return {shiftDay,computeDailyStreak,planFreezeUse};')();
}

test('D1/D2: daily streak counts active days and freezes bridge missed days', async () => {
  const js = appScript(await read('index.html'));
  const { shiftDay, computeDailyStreak, planFreezeUse } = streakApi(js);
  const today = '2026-11-11', back = n => shiftDay(today, -n);
  assert.equal(shiftDay('2026-03-01', -1), '2026-02-28');
  assert.equal(shiftDay('2026-12-31', 1), '2027-01-01');
  const days = (...ns) => { const set = new Set(ns.map(back)); return k => set.has(k); };
  const none = () => false;
  assert.equal(computeDailyStreak(none, none, today, false), 0);
  assert.equal(computeDailyStreak(none, none, today, true), 1);
  // today not logged yet does not break yesterday's streak
  assert.equal(computeDailyStreak(days(1, 2, 3), none, today, false), 3);
  assert.equal(computeDailyStreak(days(1, 2, 3), none, today, true), 4);
  assert.equal(computeDailyStreak(days(2, 3), none, today, true), 1, 'a missed day breaks the streak');
  // a frozen day bridges the gap but is not counted
  assert.equal(computeDailyStreak(days(2, 3), days(1), today, true), 3);
  assert.equal(computeDailyStreak(none, days(1, 2), today, false), 0, 'frozen days alone are not a streak');
  // freeze use: one missed day with one freeze
  assert.deepEqual(planFreezeUse(days(2, 3, 4), none, today, 1), [back(1)]);
  assert.deepEqual(planFreezeUse(days(2, 3, 4), none, today, 0), [], 'no freeze, nothing covered');
  assert.deepEqual(planFreezeUse(days(3, 4), none, today, 2), [back(1), back(2)]);
  assert.deepEqual(planFreezeUse(days(3, 4), none, today, 1), [], 'two missed days need two freezes');
  assert.deepEqual(planFreezeUse(days(4, 5), none, today, 2), [], 'three missed days are never covered');
  assert.deepEqual(planFreezeUse(days(1, 2), none, today, 2), [], 'nothing missed');
  assert.deepEqual(planFreezeUse(none, none, today, 2), [], 'no streak to protect');
  assert.deepEqual(planFreezeUse(days(2), days(1), today, 2), [], 'already frozen');
  assert.match(js, /if\(tier<g\.freezeTier\)g\.freezeTier=tier;\n else if\(tier>g\.freezeTier\)\{g\.freezeTier=tier;if\(g\.streakFreezes<STREAK_FREEZE_MAX\)/);
  assert.match(js, /streakFreezes:Math\.round\(safeStateNumber\(rawGame\.streakFreezes,0,STREAK_FREEZE_MAX,0\)\)/);
});

test('D4/D5: streak nudge is in-app only and celebrations use a dialog that never interrupts a workout', async () => {
  const html = await read('index.html');
  const js = appScript(html);
  assert.match(html, /id="streakNudge"[^>]*hidden/);
  assert.match(js, /now\.getHours\(\)>=STREAK_NUDGE_HOUR&&!todayIsActive\(\)&&dailyStreak\(\)>0/);
  assert.match(html, /<dialog id="celebrationDialog" class="app-dialog celebration-dialog" aria-labelledby="celebrationTitle"/);
  assert.match(js, /!celebrationQueue\.length\|\|state\.session\|\|dialog\.open\|\|document\.querySelector\('dialog\[open\]'\)/);
  assert.match(js, /dialog\.showModal\(\)/);
  assert.match(js, /function confetti\(\)\{if\(reducedMotion\(\)\)return;/);
});

test('D6: badge gallery has progress for every badge and keeps the original ids', async () => {
  const js = appScript(await read('index.html'));
  const block = js.slice(js.indexOf('const BADGES=['), js.indexOf('function badgeProgress'));
  const ids = [...block.matchAll(/\{id:'([a-z0-9]+)',icon:'[^']+',name:'[^']+',desc:'[^']+',target:(\d+),value:/g)];
  assert.ok(ids.length >= 30, 'expected a much larger badge set, got ' + ids.length);
  assert.equal(count(block, /\{id:'/g), ids.length, 'every badge has icon, name, desc, target and value');
  assert.equal(new Set(ids.map(m => m[1])).size, ids.length, 'badge ids are unique');
  for (const legacy of ['first', 'pr', 'w2', 'w4', 'w8', 'w12', 'h2o', 'l5', 'fr', 'ws']) assert.ok(ids.some(m => m[1] === legacy), 'kept badge ' + legacy);
  for (const added of ['vol10', 'vol50', 'vol100', 'ws50', 'ws100', 'ws250', 'pr10', 'pr5m', 'h2o7', 'h2o30', 'h2o100', 'food30', 'early', 'night', 'explore']) assert.ok(ids.some(m => m[1] === added), 'added badge ' + added);
  assert.match(js, /role="progressbar" aria-label="'\+esc\(b\.name\)\+' progress"/);
  assert.match(js, /'✓ Unlocked':'🔒 Locked · '/, 'locked state is text, not colour alone');
});

test('D7: weekly quests rotate, daily and weekly claims are date-stamped and stale claims are dropped', async () => {
  const js = appScript(await read('index.html'));
  const api = new Function(extractFunctions(js, ['pickWeeklyQuests', 'formatCountdown']) + ';return {pickWeeklyQuests,formatCountdown};')();
  const pool = ['a', 'b', 'c', 'd', 'e'];
  const w1 = api.pickWeeklyQuests(pool, '2026-11-09', 2), w2 = api.pickWeeklyQuests(pool, '2026-11-16', 2);
  assert.equal(w1.length, 2);
  assert.notEqual(w1[0], w1[1]);
  assert.notDeepEqual(w1, w2, 'quests change from week to week');
  assert.deepEqual(api.pickWeeklyQuests(pool, '2026-11-09', 2), w1, 'stable within a week');
  assert.equal(api.pickWeeklyQuests(['only'], '2026-11-09', 2).length, 1);
  assert.equal(api.formatCountdown(3 * 864e5 + 5 * 36e5), '3d 5h');
  assert.equal(api.formatCountdown(6 * 36e5 + 12 * 6e4), '6h 12m');
  assert.equal(api.formatCountdown(59e3), '0m');
  assert.match(js, /function questKey\(scope,id\)\{return scope\+'_'\+\(scope==='w'\?wkKey\(new Date\(\)\):dayKey\(\)\)\+'_'\+id;\}/);
  assert.match(js, /return !m\|\|m\[1\]>=claimCutoff;/);
  assert.match(js, /resets in '\+formatCountdown\(msToMidnight\(\)\)/);
  assert.match(js, /resets in '\+formatCountdown\(msToWeekEnd\(\)\)/);
});

test('D8/D9: level titles, XP log and daily XP limits', async () => {
  const js = appScript(await read('index.html'));
  const levelTitle = new Function(extractConst(js, 'LEVEL_TITLES') + extractFunctions(js, ['levelTitle']) + ';return levelTitle;')();
  assert.equal(levelTitle(1), 'Rookie');
  assert.equal(levelTitle(5), 'Lifter');
  assert.equal(levelTitle(7), 'Lifter');
  assert.equal(levelTitle(99), 'Legend');
  const caps = new Function(extractConst(js, 'XP_DAILY_CAPS') + extractFunctions(js, ['xpAllowance']) + ';return (state,normalizeGame,kind)=>xpAllowance.call(null,kind);');
  assert.match(js, /const XP_DAILY_CAPS=\{ex:15,meal:8,pr:5,session:3\}/);
  assert.match(js, /if\(w\.done&&!w\.xp\)\{w\.xp=1;if\(xpAllowance\('ex'\)\)/);
  assert.match(js, /if\(!f\.xp\)\{f\.xp=1;if\(xpAllowance\('meal'\)\)/);
  assert.match(js, /if\(!p\.xp\)\{p\.xp=1;if\(xpAllowance\('pr'\)\)/);
  assert.match(js, /if\(xpAllowance\('session'\)\)gainXP\(40,'Workout complete'\)/);
  assert.match(js, /function xpLogAdd\(n,why\)/);
  assert.match(js, /History is kept on this device/);
  assert.ok(caps);
});

// ---- Batch 5: friends leaderboard, privacy, friend profiles, activity feed (E1–E5) ----
const FRIENDS_MIGRATION = 'supabase/migrations/20261111090000_gymplified_friend_leaderboard_feed_and_reactions.sql';

test('E3: friend data is served only by locked-down aggregate functions', async () => {
  const sql = await read(FRIENDS_MIGRATION);
  const functions = [...sql.matchAll(/CREATE OR REPLACE FUNCTION public\.(\w+)\(/g)].map(m => m[1]);
  for (const name of ['gymplified_friend_leaderboard', 'gymplified_friend_profile', 'gymplified_friend_feed', 'gymplified_toggle_reaction']) {
    assert.ok(functions.includes(name), name + ' exists');
    const body = sql.slice(sql.indexOf('FUNCTION public.' + name + '('), sql.indexOf('$function$;', sql.indexOf('FUNCTION public.' + name + '(')));
    assert.match(body, /SECURITY DEFINER\nSET search_path = pg_catalog, public/, name + ' pins search_path');
    assert.match(body, /IF v_me IS NULL THEN RAISE EXCEPTION 'Authentication required'/, name + ' requires sign-in');
    assert.match(sql, new RegExp('REVOKE ALL ON FUNCTION public\\.' + name + '\\([^)]*\\) FROM PUBLIC, anon;'));
    assert.match(sql, new RegExp('GRANT EXECUTE ON FUNCTION public\\.' + name + '\\([^)]*\\) TO authenticated;'));
  }
  // helpers that bypass RLS are not callable by app users at all
  assert.match(sql, /REVOKE ALL ON FUNCTION public\.gymplified_are_friends\(uuid, uuid\) FROM PUBLIC, anon, authenticated;/);
  assert.match(sql, /REVOKE ALL ON FUNCTION public\.gymplified_friend_circle\(\) FROM PUBLIC, anon, authenticated;/);
  assert.doesNotMatch(sql, /GRANT [A-Z, ]+ ON (TABLE )?public\.(user_app_state|friend_activity_reactions)/);
  // reactions: only fire/muscle, no free text, RLS on with no policies
  assert.match(sql, /reaction text NOT NULL CHECK \(reaction IN \('fire', 'muscle'\)\)/);
  assert.match(sql, /ALTER TABLE public\.friend_activity_reactions ENABLE ROW LEVEL SECURITY;/);
  assert.doesNotMatch(sql, /CREATE POLICY/);
  assert.match(sql, /REVOKE ALL ON TABLE public\.friend_activity_reactions FROM PUBLIC, anon, authenticated;/);
  assert.match(sql, />= 30 THEN\n    RAISE EXCEPTION 'Too many reactions/);
  // friends are accepted requests only; private mode leaves the leaderboard
  assert.match(sql, /WHERE fr\.status = 'accepted'/);
  assert.match(sql, /WHERE c\.member_id = v_me OR public\.gymplified_shares\(c\.state, 'leaderboard'\);/);
  // a real-Postgres test for this migration ships alongside it
  const harness = await read('supabase/tests/friend_leaderboard_feed.sql');
  assert.match(harness, /\\ir \.\.\/migrations\/20261111090000_gymplified_friend_leaderboard_feed_and_reactions\.sql/);
  assert.match(harness, /tests passed/);
  // the app never reads app state tables or reactions directly
  const html = await read('index.html');
  assert.doesNotMatch(html, /sb\.from\('(user_app_state|friend_activity_reactions)'\)/);
});

test('E1: leaderboard ranks highest first, shares tied ranks and puts hidden metrics last', async () => {
  const js = appScript(await read('index.html'));
  const api = new Function(extractFunctions(js, ['dayKey', 'rankLeaderboard', 'leaderboardWeekKey', 'msToLeaderboardReset']) + ';return {rankLeaderboard,leaderboardWeekKey,msToLeaderboardReset};')();
  const rows = [{ username: 'c', workouts: 2 }, { username: 'a', workouts: 5 }, { username: 'h', workouts: null }, { username: 'b', workouts: 5 }, { username: 'z', workouts: 0 }];
  const ranked = api.rankLeaderboard(rows, 'workouts');
  assert.deepEqual(ranked.map(r => [r.username, r.rank]), [['a', 1], ['b', 1], ['c', 3], ['z', 4], ['h', null]]);
  assert.equal(rows[0].rank, undefined, 'input rows are not mutated');
  for (const day of ['2026-11-09', '2026-11-11', '2026-11-15']) assert.equal(api.leaderboardWeekKey(new Date(day + 'T08:00:00')), '2026-11-09', day + ' is in the week of Monday 9 November');
  assert.equal(api.leaderboardWeekKey(new Date('2026-11-16T00:30:00')), '2026-11-16');
  const left = api.msToLeaderboardReset(new Date('2026-11-15T23:00:00'));
  assert.equal(Math.round(left / 36e5), 1, 'resets at local Monday midnight');
  assert.match(js, /gymplified_friend_leaderboard',\{p_week_start:leaderboardWeekKey\(\)\}/);
  for (const tab of ['workouts', 'volume', 'xp', 'streak']) assert.match(js, new RegExp("\\{key:'" + tab + "'"));
  assert.match(js, /role="tablist" aria-label="Rank by"/);
});

test('E2/E4/E5: privacy settings, weekly XP and streak for the server, and safe rendering', async () => {
  const html = await read('index.html');
  const js = appScript(html);
  assert.match(js, /const DEFAULT_PRIVACY = \{ leaderboard: true, workouts: true, volume: true, streak: true, level: true, prs: true \};/);
  assert.match(js, /state\.privacy=\{\};Object\.keys\(DEFAULT_PRIVACY\)\.forEach\(k=>\{state\.privacy\[k\]=rawPrivacy\[k\]!==false;\}\);/);
  assert.match(js, /weekXp:rawGame\.weekXp&&typeof rawGame\.weekXp==='object'&&safeStateDay\(rawGame\.weekXp\.week,''\)/);
  assert.match(js, /streakNow:rawGame\.streakNow&&typeof rawGame\.streakNow==='object'&&safeStateDay\(rawGame\.streakNow\.day,''\)/);
  assert.match(js, /const week=leaderboardWeekKey\(\);if\(!g\.weekXp\|\|g\.weekXp\.week!==week\)g\.weekXp=\{week,xp:0\};/);
  assert.match(js, /g\.streakNow=\{day:today,n:streak\}/);
  assert.match(html, /id="friendPrivacy"/);
  assert.match(html, /<dialog id="friendProfileDialog" class="app-dialog friend-profile-dialog" aria-labelledby="friendProfileTitle">/);
  const block = js.slice(js.indexOf('// ===== Batch 5:'), js.indexOf('// ===== Gymplified accounts + real friend connections ====='));
  assert.ok(block.length > 4000);
  assert.doesNotMatch(block, /\son[a-z]+=/, 'Batch 5 UI uses listeners, not inline handlers');
  // every server string is escaped before it reaches innerHTML
  for (const field of ['personName(r)', 'r.username', 'feedText(item)', 'x.name', 'b.name', 'leaderboardError', 'feedError']) {
    assert.ok(block.includes('esc(' + field), field + ' is escaped');
  }
  assert.match(block, /'<button type="button" class="btn feed-react/);
  assert.match(block, /\$\('friendProfileTitle'\)\.textContent=personName\(p\)/, 'profile title is set as text');
  assert.match(js, /value:\(\)=>Math\.max\(state\.friends\.length,acceptedFriendCount\)/, 'first-friend badge counts accepted friends');
});

// ---- Batch 6: nutrition and hydration (F1–F9) ----
const SLUG = "const slug=n=>n.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');";

test('F4: built-in food table is larger, consistent and has serving presets', async () => {
  const js = appScript(await read('index.html'));
  const foods = new Function(SLUG + js.slice(js.indexOf('const FOOD_TABLE=`'), js.indexOf('`;', js.indexOf('const FOOD_TABLE=`')) + 2) + extractFunctions(js, ['parseFoodTable']) + ';return parseFoodTable(FOOD_TABLE);')();
  assert.ok(foods.length >= 100, 'expected at least 100 foods, got ' + foods.length);
  assert.equal(new Set(foods.map(f => f.id)).size, foods.length, 'food ids are unique');
  for (const f of foods) {
    for (const k of ['cal', 'protein', 'carbs', 'fat']) assert.ok(Number.isFinite(f[k]) && f[k] >= 0, f.name + ' ' + k);
    assert.ok(f.protein + f.carbs + f.fat <= 100.5, f.name + ' macros exceed 100 g per 100 g');
    for (const s of f.servings) assert.ok(s.label && s.grams > 0 && s.grams <= 3000, f.name + ' serving ' + s.label);
    // energy matches macros within 20%, except where fibre or alcohol explain the gap
    const est = f.protein * 4 + f.carbs * 4 + f.fat * 9;
    if (f.cal > 50 && !['Lager', 'Red wine'].includes(f.name)) assert.ok(Math.abs(est - f.cal) / f.cal <= 0.2, f.name + ': ' + f.cal + ' kcal vs ' + Math.round(est) + ' from macros');
  }
  assert.ok(foods.filter(f => f.servings.length).length >= foods.length * 0.9, 'most foods have serving presets');
  assert.ok(foods.some(f => f.unit === 'ml' && f.name.startsWith('Milk')), 'drinks are measured in ml');
  assert.match(js, /data-food-id="'\+esc\(f\.id\)\+'"/);
  assert.doesNotMatch(js, /const BASE_FOODS=/);
});

test('F1: barcode lookup sends only the barcode and validates Open Food Facts data', async () => {
  const html = await read('index.html');
  const js = appScript(html);
  assert.match(html, /connect-src 'self' https:\/\/ouwvujtsrnotnwtbvqhc\.supabase\.co wss:\/\/ouwvujtsrnotnwtbvqhc\.supabase\.co https:\/\/world\.openfoodfacts\.org;/);
  assert.match(js, /fetch\(OFF_PRODUCT_URL\+encodeURIComponent\(code\)\+'\.json\?fields=product_name,brands,nutriments,serving_quantity'/);
  assert.match(js, /new BarcodeDetector\(\{formats:\['ean_13','ean_8','upc_a','upc_e'\]\}\)/);
  assert.match(js, /scanStream\.getTracks\(\)\.forEach\(t=>t\.stop\(\)\)/, 'camera is released');
  assert.match(html, /Only the barcode number is sent to Open Food Facts/);
  assert.match(await read('privacy.html'), /TODO\(owner\/legal\): The barcode scanner/);
  const api = new Function(extractFunctions(js, ['validBarcode', 'offProductToFood']) + ';return {validBarcode,offProductToFood};')();
  assert.equal(api.validBarcode('5000159484695'), true);
  assert.equal(api.validBarcode('1234567'), false);
  assert.equal(api.validBarcode('12345678901234567'), false);
  assert.equal(api.validBarcode('5000a59484695'), false);
  const product = (nutriments, extra = {}) => ({ status: 1, product: Object.assign({ product_name: 'Oat Bar', brands: 'Acme, Other', serving_quantity: 35, nutriments }, extra) });
  const good = api.offProductToFood(product({ 'energy-kcal_100g': 420, proteins_100g: 9.5, carbohydrates_100g: 60, fat_100g: 15 }), '5000159484695');
  assert.deepEqual(good, { name: 'Oat Bar (Acme)', cal: 420, protein: 9.5, carbs: 60, fat: 15, barcode: '5000159484695', servingG: 35, servingLabel: '1 serving' });
  assert.equal(api.offProductToFood(product({ energy_100g: 1674, proteins_100g: 3, carbohydrates_100g: 70, fat_100g: 1 }), '40000000').cal, 400, 'kJ converts to kcal');
  assert.equal(api.offProductToFood(product({ 'energy-kcal_100g': 420, proteins_100g: 9.5, fat_100g: 15 }), '40000000'), null, 'missing carbs');
  assert.equal(api.offProductToFood(product({ 'energy-kcal_100g': 1420, proteins_100g: 9.5, carbohydrates_100g: 60, fat_100g: 15 }), '40000000'), null, 'impossible energy');
  assert.equal(api.offProductToFood({ status: 0, status_verbose: 'product not found' }, '40000000'), null);
  assert.equal(api.offProductToFood(null, '40000000'), null);
  assert.equal(api.offProductToFood(product({ 'energy-kcal_100g': 50, proteins_100g: 1, carbohydrates_100g: 10, fat_100g: 0 }, { product_name: 'Acme crisps', serving_quantity: 'x' }), '40000000').name, 'Acme crisps', 'brand not repeated');
});

test('F2/F3/F5: meals, copy from yesterday and recipes', async () => {
  const js = appScript(await read('index.html'));
  const copy = new Function("const FOOD_MEALS=['Breakfast','Lunch','Dinner','Snacks'];" + extractFunctions(js, ['copyFoodEntries']) + ';return copyFoodEntries;')();
  const yesterday = [{ id: 'a', name: 'Oats', grams: 40, portion: '1 serving', meal: 'Breakfast', cal: 156, protein: 6.8, carbs: 26.5, fat: 2.8, xp: 1 }, { id: 'b', name: 'Salmon', grams: 125, meal: 'Dinner', cal: 260, protein: 25.5, carbs: 0, fat: 16.8 }, { id: 'c', name: 'Odd', meal: 'Brunch', cal: 10 }];
  let n = 0;
  const all = copy(yesterday, '', () => 'new-' + (++n), '2026-11-11', 5);
  assert.equal(all.length, 3);
  assert.deepEqual(all[0], { id: 'new-1', name: 'Oats', grams: 40, portion: '1 serving', meal: 'Breakfast', day: '2026-11-11', createdAt: 5, cal: 156, protein: 6.8, carbs: 26.5, fat: 2.8 });
  assert.equal(all[2].meal, 'Snacks', 'unknown meals fall back to snacks');
  assert.ok(all.every(x => !('xp' in x)), 'copies earn XP as new entries, under the daily limit');
  assert.deepEqual(copy(yesterday, 'Dinner', () => 'x', '2026-11-11', 5).map(x => x.name), ['Salmon']);
  const build = new Function(extractFunctions(js, ['buildRecipe']) + ';return buildRecipe;')();
  const r = build([{ grams: 100, cal: 200, protein: 10, carbs: 20, fat: 5 }, { grams: 300, cal: 300, protein: 30, carbs: 30, fat: 10 }], 2);
  assert.deepEqual(r, { cal: 125, protein: 10, carbs: 12.5, fat: 3.8, servingG: 200, totalG: 400 });
  assert.equal(build([{ grams: 0, cal: 100 }], 1), null);
  assert.match(js, /FOOD_MEALS\.map\(meal=>/, 'every meal is shown with a subtotal');
  assert.match(js, /data-food-action="save-recipe"/);
  assert.match(js, /kind:x\.kind==='recipe'\?'recipe':'food',barcode:/);
  assert.match(js, /portion:safeStateText\(x\.portion,'',60\)/);
  assert.match(js, /grams:Number\(r\.grams\)\|\|0,portion:r\.portion\|\|''\}\)\);\}\}\);/, 'rewards keeps portion details on recents');
});

test('F6/F7: macro percentages and weekly nutrition summary', async () => {
  const js = appScript(await read('index.html'));
  const api = new Function(extractFunctions(js, ['macroGramsFromPercent', 'macroPercent', 'weeklyNutritionSummary']) + ';return {macroGramsFromPercent,macroPercent,weeklyNutritionSummary};')();
  assert.deepEqual(api.macroGramsFromPercent(2500, 30, 45, 25), { protein: 188, carbs: 281, fat: 69 });
  assert.equal(api.macroPercent(150, 4, 2500), 24);
  assert.equal(api.macroPercent(70, 9, 0), 0);
  const days = [{ cal: 2000, protein: 130 }, { cal: 0, protein: 0 }, { cal: 1500, protein: 90 }];
  assert.deepEqual(api.weeklyNutritionSummary(days, 120), { daysSoFar: 3, logged: 2, avgCal: 1750, avgProtein: 110, proteinHit: 1 });
  assert.equal(api.weeklyNutritionSummary(days, 0).proteinHit, null);
  assert.deepEqual(api.weeklyNutritionSummary([], 120), { daysSoFar: 0, logged: 0, avgCal: 0, avgProtein: 0, proteinHit: 0 });
  assert.match(js, /An estimate from a standard formula, not advice/);
});

test('F8/F9: hydration nudge timing, water history and per-entry undo', async () => {
  const html = await read('index.html');
  const js = appScript(html);
  const nudge = new Function(extractFunctions(js, ['hydrationNudgeHours']) + ';return hydrationNudgeHours;')();
  const at = h => { const d = new Date(2026, 10, 11, h, 0, 0); return d; };
  assert.equal(nudge(at(14), at(11).getTime(), 1, 2.5, 0), 3);
  assert.equal(nudge(at(14), at(13).getTime(), 1, 2.5, 0), null, 'drank an hour ago');
  assert.equal(nudge(at(14), 0, 0, 2.5, 0), 5, 'nothing yet today, counted from 9:00');
  assert.equal(nudge(at(8), 0, 0, 2.5, 0), null, 'not before 9:00');
  assert.equal(nudge(at(21), 0, 0, 2.5, 0), null, 'not after 21:00');
  assert.equal(nudge(at(14), at(11).getTime(), 2.5, 2.5, 0), null, 'goal reached');
  assert.equal(nudge(at(14), at(11).getTime(), 1, 2.5, at(13).getTime()), null, 'dismissed recently');
  assert.equal(nudge(at(14), at(9).getTime(), 1, 2.5, at(10).getTime()), 5, 'dismissal lapses after two hours');
  assert.match(html, /id="hydrationNudge"[^>]*hidden/);
  assert.match(js, /function removeWaterEntry\(id\)\{\n const entry=\(state\.waterEntries\|\|\[\]\)\.find\(x=>x\.id===id\);if\(!entry\)return;\n markRecordDeleted\('waterEntries',entry\);/);
  assert.match(js, /data-water-range="30"/);
  const block = js.slice(js.indexOf('// ===== Batch 6:'), js.indexOf('// ===== Gymplified accounts + real friend connections ====='));
  assert.ok(block.length > 10000);
  assert.doesNotMatch(block, /\son[a-z]+=/, 'Batch 6 UI uses listeners, not inline handlers');
  const css = html.match(/<style>([\s\S]*?)<\/style>/)[1];
  assert.match(css, /\.food-entry-actions button\{min-height:44px;/);
  assert.match(css, /html\[data-motion=reduced\] \.water-bar\{transition:none\}@media\(prefers-reduced-motion:reduce\)\{\.water-bar\{transition:none\}\}/);
});

// ---- Batch 7: accessibility and contrast (I1, I2, I5–I10) ----
// Resolves the CSS custom properties for one theme x accent x contrast combination, following specificity
// and source order for the simple `:root` / `html[...]` rules that define colour tokens.
function colourTokens(css, theme, color, contrast) {
  const attrs = { 'data-theme': theme, 'data-color': color, 'data-contrast': contrast };
  const winners = {};
  let order = 0;
  for (const [, selectors, body] of css.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    for (const raw of selectors.split(',')) {
      const sel = raw.trim().replace(/^@media[^{]*$/, '');
      if (!/^(:root|html)(\[[^\]]+\]|:not\(\[[^\]]+\]\))*$/.test(sel)) continue;
      let ok = true, spec = sel === ':root' ? 10 : 1;
      for (const [, neg, key, val] of sel.matchAll(/(:not\()?\[([a-z-]+)=?"?([^"\]]*)"?\]\)?/g)) {
        spec += 10;
        const match = attrs[key] === val;
        if (neg ? match : !match) ok = false;
      }
      if (!ok) continue;
      order++;
      for (const [, name, value] of body.matchAll(/(--[a-z-]+)\s*:\s*([^;]+)/g)) {
        const prev = winners[name];
        if (!prev || spec > prev.spec || (spec === prev.spec && order >= prev.order)) winners[name] = { value: value.trim(), spec, order };
      }
    }
  }
  const resolve = name => {
    const v = winners[name] && winners[name].value;
    if (!v) return null;
    if (/^#[0-9a-f]{6}$/i.test(v)) return v.toLowerCase();
    const mix = /^color-mix\(in srgb,var\((--[a-z-]+)\) (\d+)%,var\((--[a-z-]+)\)\)$/.exec(v);
    if (mix) {
      const a = resolve(mix[1]), b = resolve(mix[3]), share = Number(mix[2]) / 100;
      const ch = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
      return '#' + ch(a).map((x, i) => Math.round(x * share + ch(b)[i] * (1 - share)).toString(16).padStart(2, '0')).join('');
    }
    return null;
  };
  return resolve;
}

test('I1: colour tokens meet WCAG AA in every theme, accent and contrast mode', async () => {
  const html = await read('index.html');
  const css = html.match(/<style>([\s\S]*?)<\/style>/)[1];
  const failures = [];
  const check = (t, fg, bg, need, label) => {
    const a = t(fg), b = t(bg);
    assert.ok(a && b, label + ': could not resolve ' + fg + ' or ' + bg);
    const r = contrast(a, b);
    if (r + 0.005 < need) failures.push(label + ' ' + fg + ' ' + a + ' on ' + bg + ' ' + b + ' = ' + r.toFixed(2));
  };
  for (const theme of ['dark', 'light']) for (const color of ['gold', 'blue', 'emerald', 'slate', 'crimson', 'amber', 'violet']) for (const mode of ['normal', 'high']) {
    const t = colourTokens(css, theme, color, mode), label = theme + '/' + color + '/' + mode;
    for (const surface of ['--bg', '--panel', '--panel-hover', '--brand-light']) {
      check(t, '--ink', surface, 4.5, label);
      check(t, '--muted', surface, 4.5, label);
      check(t, '--brand-text', surface, 4.5, label);
    }
    for (const surface of ['--bg', '--panel', '--panel-hover']) check(t, '--danger', surface, 4.5, label);
    for (const surface of ['--bg', '--panel', '--brand-light']) check(t, '--success', surface, 4.5, label);
    check(t, '--brand-ink', '--brand', 4.5, label + ' button text');
    for (const surface of ['--bg', '--panel']) check(t, '--field-line', surface, 3, label + ' form field edge');
    check(t, '--deluxe-text', '--panel', 4.5, label);
    check(t, '--deluxe-line', '--panel', 3, label);
    for (const surface of ['--bg', '--panel', '--panel-hover']) check(t, '--focus-ring', surface, 3, label + ' focus ring');
  }
  assert.deepEqual(failures, []);
  // the resolver really sees the theme overrides
  assert.equal(colourTokens(css, 'light', 'gold', 'normal')('--muted'), '#526072');
  assert.equal(colourTokens(css, 'light', 'gold', 'high')('--muted'), '#334155');
  assert.equal(colourTokens(css, 'dark', 'blue', 'normal')('--brand-text'), '#60a5fa');
  assert.equal(colourTokens(css, 'light', 'blue', 'normal')('--brand-text'), '#1d4ed8');
  assert.ok(await read('tests/browser/contrast-audit.cjs'), 'full-page browser audit ships with the repo');
});

test('I2: no hard-coded text or border colours outside the accent swatches and decorative gradients', async () => {
  const html = await read('index.html');
  const inline = [...html.matchAll(/style="([^"]*)"/g)].map(m => m[1]).filter(st => /#[0-9a-f]{3,6}\b/i.test(st));
  for (const st of inline) assert.match(st, /^background: (#[0-9a-f]{6}|linear-gradient\([^)]*\));$/i, 'only accent swatches may use inline colours: ' + st);
  const js = appScript(html);
  assert.doesNotMatch(js, /\.style\.(color|borderColor|background)\s*=\s*[^;]*#[0-9a-f]{3,6}/i);
  const deluxe = html.slice(html.indexOf('<section id="deluxe" class="screen">'));
  assert.doesNotMatch(deluxe.slice(0, deluxe.indexOf('</style>')).replace(/linear-gradient\([^)]*\)/g, ''), /#b99342|#d6b15e/);
  assert.match(html, /\.set-estimate\{color:var\(--brand-text\)!important\}/);
});

test('I5/I6/I7: landmarks, screen announcements, labelled widgets and dialogs', async () => {
  const html = await read('index.html');
  const js = appScript(html);
  assert.match(html, /<a class="skip" href="#main">Skip to main content<\/a>/);
  assert.match(html, /<main id="main" tabindex="-1">/);
  assert.match(html, /<nav aria-label="Main">/);
  assert.match(html, /<header class="topbar">/);
  assert.match(js, /markNav\(\); scrollTo\(0,0\); announceScreen\(screenId,true\);/);
  assert.match(js, /document\.title=\(SCREEN_TITLES\[id\]\|\|'Gymplified'\)\+' · Gymplified'/);
  // every labelled non-interactive element has a role, so the label is announced
  for (const [tag] of html.matchAll(/<(?:span|div|i|b|p|strong|small)\b[^>]*\baria-label=[^>]*>/g)) assert.match(tag, /\brole=/, 'aria-label without a role: ' + tag.slice(0, 100));
  assert.match(js, /bar\('nutritionCalBar',state\.cal,state\.calTarget\|\|2500,'Calories eaten today'\)/);
  assert.match(js, /bar\(key\+'Track',Number\(val\)\|\|0,target,label\+' towards target'\)/);
  // the Deluxe preview is a native dialog again (its markup had been lost, so the buttons threw)
  assert.match(html, /<dialog id="deluxeModal" class="app-dialog deluxe-dialog" aria-labelledby="deluxeModalTitle"/);
  assert.match(js, /const dialog=\$\('deluxeModal'\);if\(dialog&&!dialog\.open\)dialog\.showModal\(\);/);
  assert.doesNotMatch(js, /\$\('deluxeModal'\)\.classList/);
  for (const [, tag] of html.matchAll(/(<dialog [^>]*>)/g)) assert.match(tag, /aria-labelledby="[^"]+"/, 'dialog without a name: ' + tag);
  assert.match(js, /document\.addEventListener\('close',e=>\{\n if\(!\(e\.target instanceof HTMLDialogElement\)\)return;/, 'focus returns after any dialog closes');
  const css = html.match(/<style>([\s\S]*?)<\/style>/)[1];
  assert.match(css, /\.app-dialog\{margin:auto;/, 'dialogs are centred despite the global margin reset');
});

test('I8/I9/I10: motion settings, non-colour cues and narrow-screen layout', async () => {
  const html = await read('index.html');
  const js = appScript(html);
  const css = html.match(/<style>([\s\S]*?)<\/style>/)[1];
  for (const [call] of js.matchAll(/scrollIntoView\(\{behavior:[^}]*\}\)/g)) assert.match(call, /behavior:(reducedMotion\(\)\?'auto':'smooth'|smooth)/, 'smooth scrolling must check the motion settings: ' + call);
  assert.doesNotMatch(js, /behavior:'smooth'/);
  assert.match(css, /@media\(prefers-reduced-motion:reduce\)\{\*,\*::before,\*::after\{scroll-behavior:auto!important;animation-duration:\.01ms!important;transition-duration:\.01ms!important\}\}/);
  assert.match(css, /html\[data-motion="reduced"\] \*, html\[data-motion="reduced"\] \*::before, html\[data-motion="reduced"\] \*::after \{\s*animation: none !important;\s*transition: none !important;/);
  assert.match(css, /\.lb-tab\[aria-selected=true\]::before,\.range-btn\[aria-pressed=true\]::before\{content:"✓ "\}/);
  assert.match(js, /\(hit\?'<span class="water-hit" aria-hidden="true">✓<\/span>':''\)/);
  assert.match(js, /status\.textContent=owned\?'✓ DELUXE UNLOCKED':demo\?'✓ DEMO UNLOCKED':/);
  // bottom navigation: seven columns, short labels on phones (it was six, pushing Settings off-screen)
  assert.doesNotMatch(css, /nav\{grid-template-columns:repeat\(6,/);
  assert.match(css, / nav\{grid-template-columns:repeat\(7,minmax\(0,1fr\)\);gap:2px\}/);
  assert.equal(count(html, /<span class="nav-text nav-long">/g), 7);
  assert.equal(count(html, /<span class="nav-text nav-short">/g), 7);
  assert.match(css, /@media\(max-width:480px\)\{\.top-label-long\{display:none\}\.top-label-short\{display:inline\}/);
  assert.match(css, /\.pick-grid\{display:grid;grid-template-columns:minmax\(0,1\.2fr\) minmax\(0,\.8fr\)/);
});

// ---- Batch 8: exercise library, custom exercises, detail sheet, swaps, form tips (B23–B27) ----
async function libraryApi() {
  const html = await read('index.html');
  const js = appScript(html);
  const lib = new Function(html.match(/const MC=\{[^}]*\};/)[0] + SLUG + "const mkEx=(n,eq,pm,sec,c)=>({id:(c?'c-':'')+slug(n),name:n,eq,pm,sec,custom:!!c});" +
    html.match(/const LIB=\{[\s\S]*?\};/)[0] + html.match(/const EX=\[\];.*\n/)[0] + ';return {MC,LIB,EX,slug};')();
  return { html, js, ...lib };
}

test('B23: library has 300 unique exercises with valid muscles, including bands and the requested machines', async () => {
  const { EX, MC, LIB } = await libraryApi();
  assert.ok(EX.length >= 300, 'expected at least 300 exercises, got ' + EX.length);
  assert.equal(new Set(EX.map(x => x.name.toLowerCase())).size, EX.length, 'names are unique');
  assert.equal(new Set(EX.map(x => x.id)).size, EX.length, 'ids are unique');
  const muscles = Object.values(MC);
  for (const x of EX) {
    assert.ok(muscles.includes(x.pm), x.name + ' primary muscle');
    for (const m of x.sec) assert.ok(muscles.includes(m) && m !== x.pm, x.name + ' supporting muscle ' + m);
  }
  assert.ok(LIB.Band && LIB.Band.split(';').length >= 15, 'resistance band exercises');
  for (const name of ['Leg Extension', 'Seated Leg Curl', 'Lying Leg Curl', 'Hack Squat Machine', 'Pec Deck Fly', 'Assisted Pull-Up Machine', 'Cable Crossover', 'Smith Machine Squat', 'Hip Abductor', 'Hip Adductor', 'Leg Press Calf Raise', 'Seated Calf Raise', 'Glute Drive Machine', 'Back Extension', 'Preacher Curl Machine', 'Kettlebell Press', 'Nordic Hamstring Curl', 'EZ-Bar Curl'])
    assert.ok(EX.some(x => x.name === name), 'library includes ' + name);
});

test('B27: form tips are short, attached to real exercises and labelled as general guidance', async () => {
  const { js, EX } = await libraryApi();
  const tips = new Function(js.slice(js.indexOf('const FORM_TIPS={'), js.indexOf('};', js.indexOf('const FORM_TIPS={')) + 2) + ';return FORM_TIPS;')();
  const ids = new Set(EX.map(x => x.id));
  assert.ok(Object.keys(tips).length >= 30);
  for (const [id, tip] of Object.entries(tips)) {
    assert.ok(ids.has(id), 'tip for unknown exercise ' + id);
    assert.ok(tip.length <= 200, id + ' tip is short');
    assert.ok(tip.split(/(?<=\.)\s/).length <= 2, id + ' tip is at most two sentences');
  }
  for (const major of ['barbell-back-squat', 'conventional-deadlift', 'flat-bench-press', 'overhead-press', 'barbell-row', 'pull-up', 'romanian-deadlift', 'hip-thrust']) assert.ok(tips[major], 'tip for ' + major);
  assert.match(js, /General guidance, not personal coaching\./);
});

test('B26: alternatives train the same main muscle and prefer different equipment', async () => {
  const { js, EX } = await libraryApi();
  const suggest = new Function(extractFunctions(js, ['suggestAlternatives']) + ';return suggestAlternatives;')();
  const legPress = EX.find(x => x.name === 'Leg Press');
  const alts = suggest(legPress, EX, 5);
  assert.equal(alts.length, 5);
  assert.ok(alts.every(a => a.pm === legPress.pm && a.id !== legPress.id), 'same main muscle, never itself');
  assert.ok(alts.filter(a => a.eq !== legPress.eq).length >= 3, 'mostly different equipment');
  const bench = EX.find(x => x.name === 'Flat Bench Press');
  const b = suggest(bench, EX, 5);
  assert.ok(b.every(a => a.pm === 'chest'));
  assert.ok(b[0].sec.includes('triceps') && b[0].sec.includes('shoulders'), 'best match shares supporting muscles: ' + b[0].name);
  assert.deepEqual(suggest(null, EX), []);
  assert.match(js, /if\(w\.setList\.some\(s=>s\.done\)\)return showToast\('Sets are already ticked/, 'swapping never discards ticked sets');
});

test('B24: renaming or merging a custom exercise moves its history everywhere', async () => {
  const { js } = await libraryApi();
  const rename = new Function(extractFunctions(js, ['renameExerciseEverywhere']) + ';return renameExerciseEverywhere;')();
  const state = {
    workouts: [{ name: 'my press', muscle: 'Chest' }, { name: 'Squat', muscle: 'Quads' }],
    lastSession: [{ name: 'My Press' }], prs: [{ name: 'My Press', weight: 50 }],
    sessions: [{ names: ['My Press', 'Squat'], prs: [{ name: 'My Press' }], exercises: [{ name: 'My Press' }, { name: 'Squat' }] }],
    routines: [{ exercises: [{ name: 'My Press' }] }],
    deluxe: { plans: [{ days: [{ exercises: [{ name: 'My Press' }] }] }] },
    dailyHistory: { '2026-11-10': { workouts: [{ name: 'My Press', muscle: 'Chest' }] } },
    lastSummary: { names: ['My Press'], prs: [{ name: 'My Press' }] },
    lastKg: { 'My Press': 50 }
  };
  const n = rename(state, 'My Press', 'Chest Press Machine', 'Chest');
  assert.equal(n, 9, 'nine named records (name lists are updated too but not counted)');
  const all = JSON.stringify(state);
  assert.ok(!/my press/i.test(all.replace(/"lastKg":\{[^}]*\}/, '')), 'no references left: ' + all);
  assert.equal(state.lastKg['Chest Press Machine'], 50);
  assert.equal(state.workouts[1].name, 'Squat');
  assert.equal(rename(state, '', 'x'), 0);
  assert.match(js, /markRecordDeleted\('customEx',state\.customEx\[i\]\);state\.customEx\.splice\(i,1\);/, 'merge and delete leave a tombstone for sync');
  assert.match(js, /type:\['weights','bodyweight','timed'\]\.includes\(x\.type\)\?x\.type:'weights',custom:true\}\)\);/);
  assert.match(js, /already exists'\+\(clash\.custom\?'':' in the library — use Merge instead'\)/);
});

test('B25: exercise sheet with muscle map, records, last five sessions and an accessible sparkline', async () => {
  const { html, js } = await libraryApi();
  assert.match(html, /<dialog id="exerciseSheet" class="app-dialog exercise-sheet" aria-labelledby="exerciseSheetTitle">/);
  const pts = new Function(extractFunctions(js, ['sparklinePoints']) + ';return sparklinePoints;')();
  assert.equal(pts([10, 20, 15], 100, 50, 0), '0.0,50.0 50.0,0.0 100.0,25.0');
  assert.equal(pts([5], 100, 50, 0), '50.0,25.0', 'a single point sits in the middle');
  assert.equal(pts([7, 7], 100, 50, 0), '0.0,25.0 100.0,25.0', 'a flat line is centred and does not divide by zero');
  assert.equal(pts([], 100, 50), '');
  assert.match(js, /<svg viewBox="0 0 '\+w\+' '\+h\+'" role="img" aria-label="'\+esc\(summary\)\+'">/);
  assert.match(js, /rows\.slice\(0,5\)\.map/);
  assert.match(js, /function viewExerciseHistory\(name\)\{openExerciseSheet\(name\);\}/, 'history buttons open the sheet');
  assert.match(js, /data-ex-card-action="details"/);
  assert.match(js, /dialog\.addEventListener\('close',\(\)=>\{if\(!dialog\.open\)sheetState=null;\}\);/, 'a late close event cannot wipe a reopened sheet');
  const block = js.slice(js.indexOf('// ===== Batch 8:'), js.indexOf('// ===== Gymplified accounts + real friend connections ====='));
  assert.ok(block.length > 8000);
  assert.doesNotMatch(block, /\son[a-z]+=/, 'Batch 8 UI uses listeners, not inline handlers');
  for (const field of ['esc(x.eq)', 'esc(x.pm)', 'esc(a.name)', 'esc(e.name)', 'esc(tip)', 'esc(summary)']) assert.ok(block.includes(field), field + ' is escaped');
});

// ===== Batch 9: Deluxe entitlement, Stripe payment, free tier, planner =====
const stripeHelpers = () => import(new URL('supabase/functions/_shared/stripe.js', root).href);
const signStripe = async (payload, secret, t) => {
  const { createHmac } = await import('node:crypto');
  return 't=' + t + ',v1=' + createHmac('sha256', secret).update(t + '.' + payload).digest('hex');
};

test('H3: Stripe webhook signatures are verified with a timestamp tolerance', async () => {
  const { verifyStripeWebhook } = await stripeHelpers();
  const secret = 'whsec_test', body = '{"id":"evt_1","type":"checkout.session.completed"}', now = 1_800_000_000;
  const ok = (b, h, k, t) => verifyStripeWebhook(b, h, k, { nowSeconds: t }).then(() => true, () => false);
  const good = await signStripe(body, secret, now);
  assert.deepEqual(await verifyStripeWebhook(body, good, secret, { nowSeconds: now + 10 }), { id: 'evt_1', type: 'checkout.session.completed' });
  assert.equal(await ok(body + ' ', good, secret, now), false, 'a changed body fails');
  assert.equal(await ok(body, good, 'whsec_other', now), false, 'a different secret fails');
  assert.equal(await ok(body, good, secret, now + 301), false, 'old signatures are rejected');
  assert.equal(await ok(body, good.replace('v1=', 'v0='), secret, now), false, 'v0 signatures are ignored');
  assert.equal(await ok(body, '', secret, now), false);
  assert.equal(await ok(body, good, '', now), false, 'a missing secret never verifies');
  assert.equal(await ok(body, good + ',v1=' + '0'.repeat(64), secret, now), true, 'any matching v1 (secret rotation) is accepted');
});

test('H1/H3: checkout parameters and paid-session checks bind the purchase to one account', async () => {
  const { formEncode, entitlementFromCheckoutSession, deluxeCheckoutParams, DELUXE_PRODUCT_TAG } = await stripeHelpers();
  const user = '0f8fad5b-d9cb-469f-a165-70867728950e';
  const params = formEncode(deluxeCheckoutParams({ priceId: 'price_123', userId: user, email: 'a@b.co', siteUrl: 'https://gymplified.com' }));
  assert.equal(params.get('mode'), 'payment', 'one-time payment, not a subscription');
  assert.equal(params.get('line_items[0][price]'), 'price_123');
  assert.equal(params.get('client_reference_id'), user);
  assert.equal(params.get('metadata[user_id]'), user);
  assert.equal(params.get('payment_intent_data[metadata][product]'), DELUXE_PRODUCT_TAG);
  assert.equal(params.get('payment_intent_data[metadata][user_id]'), user);
  assert.equal(params.get('success_url'), 'https://gymplified.com/?deluxe=success&session_id={CHECKOUT_SESSION_ID}');
  assert.equal(params.get('automatic_tax[enabled]'), null, 'tax collection is an owner decision and stays off unless configured');
  assert.equal(params.get('consent_collection[terms_of_service]'), null);
  const withTerms = formEncode(deluxeCheckoutParams({ priceId: 'p', userId: user, siteUrl: 'https://gymplified.com', termsRequired: true, automaticTax: true }));
  assert.equal(withTerms.get('consent_collection[terms_of_service]'), 'required');
  assert.equal(withTerms.get('automatic_tax[enabled]'), 'true');
  const paid = { object: 'checkout.session', id: 'cs_test_1', mode: 'payment', payment_status: 'paid', client_reference_id: user, payment_intent: 'pi_1', amount_total: 999, currency: 'eur', metadata: { product: DELUXE_PRODUCT_TAG, user_id: user } };
  assert.equal(entitlementFromCheckoutSession(paid).userId, user);
  assert.equal(entitlementFromCheckoutSession({ ...paid, payment_status: 'unpaid' }), null, 'unpaid sessions grant nothing');
  assert.equal(entitlementFromCheckoutSession({ ...paid, mode: 'subscription' }), null);
  assert.equal(entitlementFromCheckoutSession({ ...paid, metadata: { product: 'other', user_id: user } }), null, 'other products grant nothing');
  assert.equal(entitlementFromCheckoutSession({ ...paid, client_reference_id: '1f8fad5b-d9cb-469f-a165-70867728950e' }), null, 'mismatched account ids grant nothing');
  assert.equal(entitlementFromCheckoutSession({ ...paid, client_reference_id: 'not-a-uuid', metadata: { product: DELUXE_PRODUCT_TAG, user_id: 'not-a-uuid' } }), null);
});

test('H2/H4: entitlement lives on the server, is granted only by the service role and is never trusted from the client', async () => {
  const sql = await read('supabase/migrations/20261111120000_gymplified_deluxe_entitlements.sql');
  assert.match(sql, /alter table public\.deluxe_entitlements enable row level security/i);
  assert.match(sql, /revoke all on (table )?public\.deluxe_entitlements from public, anon, authenticated/i);
  assert.match(sql, /grant execute on function public\.gymplified_grant_deluxe\([^)]*\) to service_role/i);
  assert.doesNotMatch(sql, /grant execute on function public\.gymplified_grant_deluxe\([^)]*\) to [^;]*authenticated/i);
  assert.match(sql, /grant execute on function public\.gymplified_revoke_deluxe_by_payment\(text\) to service_role/i);
  for (const f of sql.matchAll(/create or replace function[\s\S]*?\$\$;/gi)) assert.match(f[0], /security definer[\s\S]*set search_path = pg_catalog, public/i);
  const webhook = await read('supabase/functions/gymplified-stripe-webhook/index.ts');
  assert.match(webhook, /verifyStripeWebhook\(/);
  assert.match(webhook, /charge\.refunded/);
  const fn = await read('supabase/functions/gymplified-deluxe/index.ts');
  assert.match(fn, /auth\.getUser\(/, 'checkout and restore need a signed-in user');
  assert.doesNotMatch(fn, /Access-Control-Allow-Origin['"]?\s*:\s*['"]\*/, 'no wildcard CORS');
  const html = await read('index.html'), js = appScript(html);
  const sanitize = new Function('state', 'currentUser', 'localStorage', 'location', extractFunctions(js, ['deluxeDemoAllowed', 'deluxeDemoOn', 'deluxeOwned', 'deluxeEnabled']) + ';return {deluxeEnabled,deluxeOwned};');
  assert.match(js, /\/\/ TODO\(owner\/legal\): add the approved EU\/UK withdrawal-right and refund wording/);
  assert.match(await read('terms.html'), /TODO\(owner\/legal\): before Gymplified Deluxe goes on sale/);
  assert.ok(sanitize, 'entitlement helpers extract');
  // The browser never stores a "paid" flag in synced state.
  assert.doesNotMatch(extractFunctions(js, ['sanitizeStateSnapshot']), /deluxeOwned|entitlement/);
});

test('H5/H6: free routine limit, plan for today, planned-vs-completed and safe plan fields', async () => {
  const html = await read('index.html'), js = appScript(html);
  assert.match(js, /const FREE_ROUTINE_LIMIT=5;/);
  const canSave = (enabled, n) => new Function('deluxeEnabled', 'state', 'FREE_ROUTINE_LIMIT', extractFunctions(js, ['canSaveRoutine']) + ';return canSaveRoutine();')(() => enabled, { routines: Array(n).fill({}) }, 5);
  assert.equal(canSave(false, 4), true);
  assert.equal(canSave(false, 5), false, 'free accounts stop at five routines');
  assert.equal(canSave(true, 50), true, 'Deluxe is unlimited (up to the storage cap)');
  const forDate = new Function(extractFunctions(js, ['planDayForDate']) + ';return planDayForDate;')();
  const plans = [{ name: 'A', days: [{ day: 'Day 1 · Monday', exercises: [{ name: 'Squat' }] }, { day: 'Day 2 · Wednesday', exercises: [] }] }];
  assert.equal(forDate(plans, '2026-11-09T12:00:00').day.day, 'Day 1 · Monday');
  assert.equal(forDate(plans, '2026-11-11T12:00:00'), null, 'an empty day is not offered');
  assert.equal(forDate([], '2026-11-09T12:00:00'), null);
  const outcome = new Function('setTypeOf', extractFunctions(js, ['planOutcome']) + ';return planOutcome;')(s => s.type || 'normal');
  const ws = [
    { plan: { sets: 2, reps: 8, name: 'A', day: 'Mon' }, setList: [{ done: true, reps: 8 }, { done: true, reps: 10 }, { done: true, reps: 12, type: 'warmup' }] },
    { plan: { sets: 3, reps: 5, name: 'A', day: 'Mon' }, setList: [{ done: true, reps: 5 }, { done: true, reps: 4 }, { done: true, reps: 5 }] },
    { setList: [{ done: true, reps: 5 }] }];
  assert.deepEqual(outcome(ws), { planned: 2, completed: 1, name: 'A', day: 'Mon' });
  assert.equal(outcome([{ setList: [] }]), null);
  assert.match(js, /plan:cleanPlanTarget\(x\.plan\)/);
  assert.match(js, /plan:cleanPlanOutcome\(raw\.lastSummary\.plan\)/);
  assert.match(js, /const cleanPlanTarget=p=>[^;]*safeStateText\(p\.name,'',50\)/);
  assert.match(html, /id="deluxePlanExercise"[^>]*list="deluxeExerciseList"/);
  const block = js.slice(js.indexOf('// ===== Batch 9: Deluxe entitlement'), js.indexOf('// ===== Gymplified accounts + real friend connections ====='));
  assert.ok(block.length > 1000);
  assert.doesNotMatch(block, /onclick=/, 'Batch 9 code uses listeners, not inline handlers');
  assert.match(block, /data-plan-action/);
});

test('H1: a new account with no cloud copy starts from a fully shaped state', async () => {
  const js = appScript(await read('index.html'));
  assert.doesNotMatch(js, /state=JSON\.parse\(JSON\.stringify\(cleanState\)\)/, 'bare template has no game data and crashed the next save');
  assert.match(js, /function blankAccountState\(\)\{return sanitizeStateSnapshot\(/);
});

test('K2: index.html is a thin shell; styles and app code live in app.css and app.js and are cached for offline', async () => {
  const shell = await readRaw('index.html');
  assert.ok(shell.length < 120000, 'the shell stays small');
  assert.equal(count(shell, /<link rel="stylesheet" href="\.\/app\.css">/g), 1);
  assert.match(shell, /<script src="https:\/\/cdn\.jsdelivr\.net\/npm\/@supabase\/supabase-js@2\.57\.4\/dist\/umd\/supabase\.min\.js"><\/script>\n<script src="\.\/app\.js"><\/script>/, 'app.js loads right after the SDK, in the same place the inline script ran');
  assert.doesNotMatch(shell, /<style[\s>]/, 'no inline style blocks');
  assert.doesNotMatch(shell, /<script>(?!<\/script>)/, 'no inline script blocks');
  const css = await readRaw('app.css'), js = await readRaw('app.js');
  assert.doesNotMatch(css, /<\/?style/);
  assert.doesNotMatch(js, /<\/?script/i);
  assert.doesNotThrow(() => new Function(js));
  const sw = await readRaw('sw.js');
  assert.match(sw, /'\.\/app\.css',\n  '\.\/app\.js',/);
  assert.match(sw, /if \(\/\\\/app\\\.\(js\|css\)\$\/\.test\(url\.pathname\)\)[\s\S]*?await fetch\(request\)[\s\S]*?cache\.match\(request, \{ignoreSearch:true\}\)/, 'app code is network-first with an offline fallback');
});

test('Deluxe admin toggle: service-role only, keeps paid records, and the admin page uses listeners and escaping', async () => {
  const sql = await read('supabase/migrations/20261111130000_gymplified_admin_deluxe_toggle.sql');
  assert.match(sql, /SECURITY DEFINER\s+SET search_path = pg_catalog, public/);
  assert.match(sql, /REVOKE ALL ON FUNCTION public\.gymplified_admin_set_deluxe\(uuid, boolean, uuid\) FROM PUBLIC, anon, authenticated;/);
  assert.match(sql, /GRANT EXECUTE ON FUNCTION public\.gymplified_admin_set_deluxe\(uuid, boolean, uuid\) TO service_role;/);
  assert.doesNotMatch(sql, /DO UPDATE[\s\S]*source\s*=\s*EXCLUDED\.source[\s\S]*END IF/, 'an admin re-grant never overwrites how Deluxe was bought');
  const fn = await read('supabase/functions/gymplified-admin-users/index.ts');
  const allowlist = fn.indexOf('rpc("get_admin_analytics"'), setDeluxe = fn.indexOf('action === "set_deluxe"');
  assert.ok(allowlist > 0 && setDeluxe > allowlist, 'the admin allowlist is checked before any action');
  assert.match(fn, /p_admin: authData\.user\.id/, 'the acting admin is recorded from the verified token, not the request body');
  assert.match(fn, /typeof body\.on !== "boolean"/);
  const page = await read('admin-users.html');
  assert.match(page, /\$\('deluxeAdminBtn'\)\.addEventListener\('click',toggleDeluxe\)/);
  assert.doesNotMatch(page, /id="deluxeAdminBtn"[^>]*onclick/);
  assert.match(page, /This member does not have Deluxe\./);
  assert.match(page, /this does not refund them/);
});

test('K3: no inline event handlers, an explicit action allowlist, and no unsafe-inline scripts', async () => {
  const shell = await readRaw('index.html'), js = await readRaw('app.js');
  assert.equal(count(shell + js, /\son[a-z]+\s*=\s*\\?["']/gi), 0, 'no inline on* handlers in markup or generated HTML');
  const csp = shell.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/)[1];
  const scriptSrc = csp.match(/script-src ([^;]+)/)[1];
  assert.doesNotMatch(scriptSrc, /unsafe-inline|unsafe-eval/, 'scripts run only from files');
  assert.doesNotMatch(shell, /<script(?![^>]*\ssrc=)[^>]*>/, 'no inline script blocks');
  assert.doesNotMatch(js, /\beval\(|new Function\(|setTimeout\(\s*['"`]|setInterval\(\s*['"`]|javascript:/, 'nothing a strict CSP would block');
  // Every action named in markup is on the allowlist, and nothing else is.
  const used = new Set([...(shell + js).matchAll(/data-(?:action|change|input|submit)="([A-Za-z]+)"/g)].map(m => m[1]));
  const block = js.slice(js.indexOf('const UI_ACTIONS=Object.freeze({'), js.indexOf('function bindUiActions'));
  const defined = new Set([...block.matchAll(/(?:^|[,{ ])([A-Za-z]+):(?:\(|el)/gm)].map(m => m[1]));
  assert.ok(used.size >= 70);
  assert.deepEqual([...used].filter(x => !defined.has(x)), [], 'every action in markup is allowlisted');
  assert.deepEqual([...defined].filter(x => !used.has(x)), [], 'no unused allowlist entries');
  assert.match(js, /Object\.prototype\.hasOwnProperty\.call\(UI_ACTIONS,/, 'lookups cannot reach inherited properties');
  assert.match(js, /\$\('legacyLocalDataDialog'\)\?\.addEventListener\('cancel',e=>e\.preventDefault\(\)\)/);
  // Ids in generated markup are escaped attribute values, not JavaScript strings.
  assert.doesNotMatch(js, /data-id="'\+jsArg\(/);
  assert.match(js, /data-action="removeFriend" data-id="'\+esc\(x\.id\)\+'"/);
  assert.doesNotMatch(js, /getAttribute\('on[a-z]+'\)/, 'no code reads old handler attributes');
  assert.match(js, /document\.querySelectorAll\('\.color-dot'\)\.forEach\(d=>\{const on=d\.dataset\.arg===c;/);
  assert.match(js, /data-action="goToTraining"/, 'the dashboard "Open Training Log" button works (its old inline handler had broken quoting)');
});

test('K3: no inline styles anywhere, so the CSP allows styles only from files', async () => {
  const shell = await readRaw('index.html'), js = await readRaw('app.js'), css = await readRaw('app.css'), svg = await readRaw('assets/muscle-map-template.svg');
  const csp = shell.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/)[1];
  assert.match(csp, /style-src 'self';/);
  assert.doesNotMatch(csp, /unsafe-inline|unsafe-hashes/);
  assert.equal(count(shell, /\sstyle\s*=/g), 0, 'no style attributes in the page');
  assert.equal(count(js, /\sstyle=\\?["']/g), 0, 'no style attributes in generated markup');
  assert.doesNotMatch(js, /createElement(NS)?\([^)]*'style'\)|setAttribute\('style'|insertAdjacentHTML\([^)]*<style/, 'no style elements created at run time');
  assert.equal(count(svg, /\sstyle="/g) + count(svg, /<style/g), 0, 'the muscle map uses presentation attributes, not styles');
  // Every class the conversion created exists in app.css, and every rule is used.
  const used = new Set([...(shell + js).matchAll(/\b(st-\d+)\b/g)].map(m => m[1]));
  const defined = new Set([...css.matchAll(/\.(st-\d+)\.\1\{/g)].map(m => m[1]));
  assert.ok(used.size >= 60);
  assert.deepEqual([...used].filter(c => !defined.has(c)), []);
  assert.deepEqual([...defined].filter(c => !used.has(c)), []);
  // No element ends up with two class attributes (the second would be ignored).
  for (const m of js.matchAll(/<[a-z][^<>]*?\sclass=\\?"[^"]*"[^<>]*?\sclass=/gi)) assert.fail('duplicate class attribute: ' + m[0].slice(0, 120));
  // Computed sizes go through the CSSOM, clamped to 0–100%.
  assert.match(js, /function applyComputedSizes\(root\)\{/);
  assert.match(js, /Math\.max\(0,Math\.min\(100,n\)\)\+'%'/);
  assert.match(js, /new MutationObserver\(list=>list\.forEach\(m=>m\.addedNodes\.forEach/);
  assert.match(css, /#layer2 path\.active\{fill:#d9531e!important;fill-opacity:\.9!important;stroke:#a8390f!important/, 'primary muscles keep the orange that rendered before');
});

test('K3 follow-up: functions run by delegated actions never rely on event.currentTarget', async () => {
  const js = await readRaw('app.js');
  const block = js.slice(js.indexOf('const UI_ACTIONS=Object.freeze({'), js.indexOf('function bindUiActions'));
  const names = [...block.matchAll(/=>\s*([A-Za-z]+)\(/g)].map(m => m[1]).filter(n => /^function |^async function /m.test(js) && js.includes('function ' + n + '('));
  const bodies = extractFunctions(js, [...new Set(names)].filter(n => js.includes('function ' + n + '(')));
  assert.doesNotMatch(bodies, /currentTarget/, 'delegated handlers see the document as currentTarget');
  assert.match(js, /const form=event\.target&&event\.target\.closest\?event\.target\.closest\('form'\):null;if\(!form\|\|!form\.email\)return;/);
});
