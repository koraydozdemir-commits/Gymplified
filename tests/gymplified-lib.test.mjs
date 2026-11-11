import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const read = path => readFile(new URL(path, root), 'utf8');
const count = (text, re) => (text.match(re) || []).length;
const loadLib = async () => { const box = {}; vm.createContext(box); vm.runInContext(await read('lib.js'), box); return box.GymLib; };
const plain = value => JSON.parse(JSON.stringify(value));

test('B11: plate calculator loads each side from the heaviest plate and reports what cannot be loaded', async () => {
  const L = await loadLib();
  assert.deepEqual(plain(L.platesPerSide(100, 20, L.DEFAULT_PLATES_KG).perSide), [{ plate: 25, count: 1 }, { plate: 15, count: 1 }]);
  assert.deepEqual(plain(L.platesPerSide(142.5, 20, L.DEFAULT_PLATES_KG).perSide), [{ plate: 25, count: 2 }, { plate: 10, count: 1 }, { plate: 1.25, count: 1 }]);
  assert.deepEqual(plain(L.platesPerSide(225, 45, L.DEFAULT_PLATES_LB).perSide), [{ plate: 45, count: 2 }]);
  assert.equal(L.platesPerSide(20, 20, L.DEFAULT_PLATES_KG).perSide.length, 0, 'just the bar');
  assert.equal(L.platesPerSide(15, 20, L.DEFAULT_PLATES_KG).belowBar, true);
  const odd = L.platesPerSide(101, 20, L.DEFAULT_PLATES_KG);
  assert.equal(odd.ok, false); assert.equal(odd.loaded, 100); assert.equal(odd.remainder, 0.5);
  const few = L.platesPerSide(100, 20, [20, 5]);
  assert.deepEqual(plain(few.perSide), [{ plate: 20, count: 2 }]); assert.equal(few.ok, true);
  assert.equal(L.platesPerSide(100, 20, []).ok, false, 'no plates means nothing can be loaded');
});

test('B17: warm-up sets step up to, and never reach, the working weight', async () => {
  const L = await loadLib();
  assert.deepEqual(plain(L.warmupSets(100, 2.5)), [{ kg: 50, reps: 8, type: 'warmup' }, { kg: 70, reps: 5, type: 'warmup' }, { kg: 90, reps: 2, type: 'warmup' }]);
  assert.ok(L.warmupSets(225, 5).every(s => s.kg % 5 === 0 && s.kg < 225), 'pounds snap to 5 lb');
  assert.deepEqual(plain(L.warmupSets(0, 2.5)), []);
  assert.ok(L.warmupSets(5, 2.5).every(s => s.kg > 0 && s.kg < 5));
  assert.equal(new Set(L.warmupSets(10, 2.5).map(s => s.kg)).size, L.warmupSets(10, 2.5).length, 'no duplicate weights');
});

test('B12: overload adds weight only when every working set reached the top of the range', async () => {
  const L = await loadLib();
  const hit = L.overloadSuggestion([{ kg: 60, reps: 8 }, { kg: 60, reps: 8 }, { kg: 60, reps: 9 }], { stepKg: 2.5, topReps: 8 });
  assert.equal(hit.action, 'weight'); assert.equal(hit.kg, 62.5); assert.equal(hit.reps, 8);
  const miss = L.overloadSuggestion([{ kg: 60, reps: 8 }, { kg: 60, reps: 8 }, { kg: 60, reps: 7 }], { stepKg: 2.5, topReps: 8 });
  assert.equal(miss.action, 'reps'); assert.equal(miss.kg, 60); assert.equal(miss.reps, 8);
  const warm = L.overloadSuggestion([{ kg: 100, reps: 12, type: 'warmup' }, { kg: 60, reps: 5 }], { topReps: 8 });
  assert.equal(warm.kg, 60, 'warm-ups are ignored'); assert.equal(warm.reps, 6);
  assert.equal(L.overloadSuggestion([{ kg: 0, reps: 10 }], {}), null, 'bodyweight-only history gives no weight advice');
  assert.equal(L.overloadSuggestion([], {}), null);
});

test('B20: quick add understands "name weight x reps x sets" and rejects everything else', async () => {
  const L = await loadLib();
  assert.deepEqual(plain(L.parseQuickAdd('bench 60x8x3')), { name: 'bench', weight: 60, reps: 8, sets: 3, unit: '' });
  assert.deepEqual(plain(L.parseQuickAdd('Romanian deadlift 82,5 kg × 10')), { name: 'Romanian deadlift', weight: 82.5, reps: 10, sets: 1, unit: 'kg' });
  assert.equal(L.parseQuickAdd('squat 225lbs x 5 x 5').unit, 'lb');
  const lib = (await read('app.js')); const libBlock = lib.slice(lib.indexOf('const LIB={'), lib.indexOf('const EXERCISE_DONE_LINES'));
  assert.equal(L.quickAlias(' Bench '), 'Flat Bench Press'); assert.equal(L.quickAlias('constructor'), '', 'inherited keys are not aliases');
  for (const target of Object.values(L.QUICK_ALIASES)) assert.ok(libBlock.includes(target + ':'), target + ' exists in the library');
  for (const bad of ['bench', 'bench 60', 'lat pulldown', '60x8', 'bench 60x0', 'bench 60x8x99', 'bench 5000x5', '']) assert.equal(L.parseQuickAdd(bad), null, bad);
});

test('B7/B8: supersets rest only after the last exercise; reordering never leaves a lone member', async () => {
  const L = await loadLib();
  const w = [{ group: '' }, { group: 'a' }, { group: 'a' }, { group: 'a' }, { group: '' }];
  assert.deepEqual([0, 1, 2, 3, 4].map(i => L.restDueAfterSet(w, i)), [true, false, false, true, true]);
  assert.deepEqual(plain(L.groupBounds(w, 2)), { start: 1, end: 3 });
  const moved = L.moveItem([{ n: 1, group: 'a' }, { n: 2, group: 'a' }, { n: 3, group: '' }], 0, 2);
  assert.deepEqual(moved.map(x => x.n), [2, 3, 1]);
  L.normaliseGroups(moved);
  assert.deepEqual(moved.map(x => x.group), ['', '', ''], 'a split pair is no longer a superset');
  const same = [1, 2, 3]; assert.deepEqual(L.moveItem(same, 0, 5), [1, 2, 3]); assert.notEqual(L.moveItem(same, 0, 1), same, 'never mutates');
});

test('B14: editing a finished workout recalculates volume, sets, reps and exercises', async () => {
  const L = await loadLib();
  const t = L.sessionTotals({ exercises: [
    { name: 'Squat', sets: [{ kg: 40, reps: 5, type: 'warmup' }, { kg: 100, reps: 5 }, { kg: 100, reps: 5 }] },
    { name: 'Plank', sets: [{ kg: 0, reps: 0, duration: 60 }] },
    { name: 'Empty', sets: [] }
  ] });
  assert.deepEqual(plain(t), { vol: 1000, sets: 4, reps: 15, ex: 2, names: ['Squat', 'Plank'] });
});

test('G4: the calendar is whole weeks ending this week, respects the week start and scales by volume', async () => {
  const L = await loadLib();
  const sessions = [{ date: '2026-11-11', vol: 4000, sets: 12 }, { date: '2026-11-09', vol: 1000, sets: 5 }, { date: '2026-11-09', vol: 500, sets: 3 }, { date: 'nonsense', vol: 9 }];
  const mon = L.calendarWeeks(sessions, '2026-11-11', 4, 'mon');
  assert.equal(mon.length, 4); assert.ok(mon.every(r => r.length === 7));
  assert.equal(mon[3][0].day, '2026-11-09'); assert.equal(mon[3][6].day, '2026-11-15'); assert.equal(mon[0][0].day, '2026-10-19');
  assert.equal(mon[3][2].level, 4); assert.equal(mon[3][0].level, 2); assert.equal(mon[3][0].count, 2); assert.equal(mon[3][1].level, 0);
  assert.equal(mon[3][3].future, true); assert.equal(mon[3][2].future, false);
  assert.equal(L.calendarWeeks(sessions, '2026-11-11', 1, 'sun')[0][0].day, '2026-11-08');
  assert.equal(L.calendarWeeks([{ date: '2026-11-11', vol: 0 }], '2026-11-11', 1, 'mon')[0][2].level, 1, 'a bodyweight workout still shows');
});

test('G9/G7: monthly report compares with the month before; muscle recency counts days', async () => {
  const L = await loadLib();
  const s = [
    { date: '2026-11-03', vol: 3000, sets: 10, mins: 60, prs: [{}], exercises: [{ name: 'Squat', muscle: 'Quadriceps', sets: [{}, {}, {}] }, { name: 'Curl', muscle: 'Biceps', sets: [{}] }] },
    { date: '2026-11-10', vol: 3000, sets: 10, mins: 60, prs: [], exercises: [{ name: 'Squat', muscle: 'Quadriceps', sets: [{}, {}] }] },
    { date: '2026-10-20', vol: 4000, sets: 8, mins: 30, exercises: [{ name: 'Bench', muscle: 'Chest', sets: [{}] }] }
  ];
  const r = L.monthReport(s, '2026-11');
  assert.equal(r.previousMonth, '2026-10'); assert.equal(r.current.workouts, 2); assert.equal(r.current.vol, 6000); assert.equal(r.current.prs, 1);
  assert.deepEqual(plain(r.change), { workouts: 100, vol: 50, mins: 300 });
  assert.deepEqual(plain(r.current.topExercises[0]), { name: 'Squat', sets: 5 });
  assert.equal(L.monthReport(s, '2026-01').previousMonth, '2025-12');
  assert.equal(L.monthReport(s, '2026-10').change.vol, null, 'nothing to compare with');
  const rec = L.muscleRecency(s, '2026-11-11');
  assert.deepEqual(plain(rec.map(x => [x.muscle, x.days])), [['quadriceps', 1], ['biceps', 8], ['chest', 22]]);
});

test('F12: bodyweight trend is the average of the trailing seven days', async () => {
  const L = await loadLib();
  const t = L.weightTrend({ '2026-11-01': 80, '2026-11-02': 81, '2026-11-08': 79, '2026-11-09': 78, bad: 5 }, 7);
  assert.deepEqual(plain(t.map(p => p.trend)), [80, 80.5, 80, 78.5]);
  assert.deepEqual(plain(L.weightTrend({}, 7)), []);
});

test('K8: storage guard warns at 80% and treats a character as two bytes', async () => {
  const L = await loadLib();
  assert.equal(L.storageUse(1024 * 1024).pct, 40); assert.equal(L.storageUse(1024 * 1024).warn, false);
  assert.equal(L.storageUse(2.1 * 1024 * 1024).warn, true); assert.equal(L.storageUse(2.4 * 1024 * 1024).critical, true);
  assert.equal(L.storageUse(99 * 1024 * 1024).pct, 100);
});

test('new synced state is cleaned: body log, measurements, supplements and gear', async () => {
  const L = await loadLib();
  const x = L.sanitizeExtras({
    bodyLog: { '2026-11-01': 80.456, '2026-13-40': 80, '2026-11-02': 5, '2026-11-03': '<b>' },
    measures: { '2026-11-01': { waist: 82.44, chest: 9999, evil: '<script>' }, '2026-11-02': 'x' },
    supplements: ['Creatine', 'creatine ', '<img src=x>', '', 'A'.repeat(99)],
    suppLog: { '2026-11-01': ['Creatine', 'Not on list'], '2026-11-02': [] }, goalKg: 7000
  });
  assert.deepEqual(plain(x.bodyLog), { '2026-11-01': 80.46 });
  assert.deepEqual(plain(x.measures), { '2026-11-01': { waist: 82.4 } });
  assert.equal(x.supplements.length, 4); assert.ok(x.supplements.every(n => n.length <= 30));
  assert.deepEqual(plain(x.suppLog), { '2026-11-01': ['Creatine'] }); assert.equal(x.goalKg, 0);
  assert.deepEqual(plain(L.sanitizeExtras(null).supplements), plain(L.DEFAULT_SUPPLEMENTS));
  assert.deepEqual(plain(L.sanitizeExtras([]).bodyLog), {});
  assert.deepEqual(plain(L.sanitizeGear({ unit: 'lb', bar: 45, plates: [45, 45, -1, 'x', 500, 2.5] })), { unit: 'lb', bar: 45, plates: [45, 2.5] });
  assert.deepEqual(plain(L.sanitizeGear('nope')), { unit: 'kg', bar: 0, plates: [] });
});

test('B31: starter routines only use exercises that exist in the library and are labelled as generic', async () => {
  const L = await loadLib(), js = await read('app.js'), plus = await read('plus.js');
  const lib = js.slice(js.indexOf('const LIB={'), js.indexOf('const EXERCISE_DONE_LINES'));
  for (const r of L.STARTER_ROUTINES) for (const [name, sets, reps] of r.exercises) {
    assert.ok(lib.includes(name + ':'), name + ' is in the exercise library');
    assert.ok(sets >= 1 && sets <= 20 && reps >= 1 && reps <= 100);
  }
  assert.ok(L.STARTER_ROUTINES.length >= 8);
  assert.match(plus, /Generic examples to get going\. They are not personal advice/);
  assert.match(plus, /kg: suggested\.fromHistory \?[^:]+: 0, reps/, 'starter weights come from the user’s own history or start empty');
});

test('app wiring: new workout fields survive the sanitizer and the session summary', async () => {
  const js = await read('app.js');
  assert.match(js, /rpe:safeStateNumber\(x\.rpe,0,10,0\)/); assert.match(js, /rpe:safeStateNumber\(s\.rpe,0,10,0\)/);
  assert.match(js, /note:safeStateText\(x\.note,'',300\),group:safeRecordId\(x\.group,''\)/);
  assert.match(js, /tag:safeStateText\(x\.tag,'',24\)/);
  assert.match(js, /note:safeStateText\(raw\.session\.note,'',1000\)/);
  assert.match(js, /state\.settings\.gear=GymLib\.sanitizeGear\(settings\.gear\);\n state\.extras=GymLib\.sanitizeExtras\(raw\.extras\);/);
  assert.match(js, /names,notes:safeStateText\(state\.session\.note,'',1000\)\}/);
  assert.match(js, /notes:safeStateText\(w\.note,'',300\),sets:/);
  assert.match(js, /rpe:Number\(x\.rpe\)>=1&&Number\(x\.rpe\)<=10\?Number\(x\.rpe\):0/, 'ensureSets keeps the effort rating');
});

test('K1: a save rebuilds only the visible screen; hidden screens are rebuilt when opened', async () => {
  const js = await read('app.js');
  assert.match(js, /const SCREEN_RENDERERS=\{prs:\(\)=>renderPRs\(\),training:\(\)=>renderTrainingLog\(\),nutrition:\(\)=>\{renderNutrition\(\);/);
  assert.match(js, /Object\.keys\(SCREEN_RENDERERS\)\.forEach\(id=>\{if\(id===visible\)renderScreen\(id\);else staleScreens\.add\(id\);\}\);/);
  assert.match(js, /if\(visible!=='training'\)renderSessionChrome\(\);/, 'the header chip and dashboard hero stay live on every screen');
  assert.match(js, /classList\.add\('active'\);\n  if\(staleScreens\.has\(screenId\)\)renderScreen\(screenId\);/);
  const body = js.slice(js.indexOf('function renderAll() {'), js.indexOf('// --- PR ACTIONS ---'));
  assert.doesNotMatch(body, /\n  renderPRs\(\);|\n  renderTrainingLog\(\);|\n  renderNutrition\(\);/);
});

test('K4: the Supabase SDK is self-hosted, pinned and the page loads no third-party script', async () => {
  const shell = await read('index.html'), sw = await read('sw.js');
  const csp = shell.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/)[1];
  assert.match(csp, /script-src 'self';/);
  assert.doesNotMatch(shell, /<script[^>]+src="https?:/);
  const sdk = await readFile(new URL('sdk/supabase-2.57.4.js', root));
  // sha256 of dist/umd/supabase.js in the @supabase/supabase-js@2.57.4 npm package.
  assert.equal(createHash('sha256').update(sdk).digest('hex'), '7e94b62086deecef8c0ba3b38f514e2a1944ff6c81d92fb3ff967828c406c38f');
  assert.match(await read('sdk/SUPABASE-LICENSE'), /MIT License/);
  assert.match(sw, /const SUPABASE_SDK = '\.\/sdk\/supabase-2\.57\.4\.js';/);
  assert.doesNotMatch(sw, /jsdelivr/);
});

test('K6/K7: offline banner, and updates wait for the user instead of reloading mid-workout', async () => {
  const shell = await read('index.html'), sw = await read('sw.js'), plus = await read('plus.js'), js = await read('app.js');
  assert.match(shell, /id="offlineBanner" role="status" hidden/); assert.match(shell, /id="updateBanner" role="status" hidden/);
  assert.match(sw, /if \(!self\.registration\.active\) await self\.skipWaiting\(\);/);
  assert.match(sw, /event\.data\.type === 'SKIP_WAITING'\) self\.skipWaiting\(\)/);
  assert.equal(count(sw, /skipWaiting\(\)/g), 2);
  assert.match(plus, /worker\.state === 'installed' && navigator\.serviceWorker\.controller\) showUpdateBanner\(worker\)/);
  assert.match(plus, /flushDraftSave\(\); reloadingForUpdate = true;/, 'typed sets are saved before the refresh');
  assert.match(js, /watchForAppUpdate\(reg\)/);
  assert.match(js, /window\.addEventListener\('offline',function\(\)\{setSyncStatus\('offline'\)/);
});

test('plus.js follows the K3 rules: allowlisted actions, no inline handlers, styles or HTML from user text', async () => {
  const shell = await read('index.html'), plus = await read('plus.js'), lib = await read('lib.js');
  assert.doesNotThrow(() => new Function(plus)); assert.doesNotThrow(() => new Function(lib));
  assert.equal(count(plus + lib, /\son[a-z]+\s*=\s*\\?["']/gi), 0, 'no inline handlers');
  assert.equal(count(plus + lib, /\sstyle=\\?["']/g), 0, 'no inline styles');
  assert.doesNotMatch(plus + lib, /\beval\(|new Function\(|javascript:|\.style\./);
  const used = new Set([...(shell + plus).matchAll(/data-plus(?:-change|-input|-submit)?="([A-Za-z]+)"/g)].map(m => m[1]));
  const block = plus.slice(plus.indexOf('const PLUS_ACTIONS = Object.freeze({'), plus.indexOf('function bindPlusActions'));
  const defined = new Set([...block.matchAll(/(?:^|[,{ ])([A-Za-z]+): (?:\(|el)/gm)].map(m => m[1]));
  assert.ok(used.size >= 40);
  assert.deepEqual([...used].filter(x => !defined.has(x)), [], 'every action in markup is allowlisted');
  assert.deepEqual([...defined].filter(x => !used.has(x)), [], 'no unused allowlist entries');
  assert.match(plus, /Object\.prototype\.hasOwnProperty\.call\(PLUS_ACTIONS, name\)/);
  // User-entered text is always escaped where it is written into markup.
  for (const field of ['w.note', 'session.notes', 'ex.notes', 'r.name', 'r.tag', 'prevNote.note', 's.notes', 'd.name', 'd.tag']) assert.ok(plus.includes('esc(' + field), field + ' is escaped');
  const supp = plus.slice(plus.indexOf('function renderSupplements'), plus.indexOf('function toggleSupplement'));
  assert.ok(count(supp, /esc\(name\)/g) >= 2 && !/[^(]name \+ '/.test(supp.replace(/esc\(name\)/g, '')), 'supplement names go through esc()');
  assert.match(plus, /\/\^\[A-Za-z0-9_\]\{3,20\}\$\/\.test\(v\)/, 'invite usernames are validated before use');
  assert.match(plus, /history\.replaceState\(null, ''/, 'the invite parameter is removed from the address bar');
});

test('J5/J7: sync status is visible and account security uses the signed-in session', async () => {
  const js = await read('app.js'), plus = await read('plus.js');
  assert.ok(count(js, /setSyncStatus\('synced'\)/g) >= 2); assert.match(js, /setSyncStatus\(navigator\.onLine===false\?'offline':'error'\)/);
  assert.match(plus, /sb\.auth\.updateUser\(\{ password: a \}\)/); assert.match(plus, /sb\.auth\.signOut\(\{ scope: 'global' \}\)/);
  assert.match(plus, /minlength="8" maxlength="72" autocomplete="new-password"/);
  assert.doesNotMatch(plus, /console\.(log|warn|error)\([^)]*(password|email)/i, 'credentials are never logged');
});

test('Stripe: a chargeback removes Deluxe for exactly the disputed payment', async () => {
  const { disputedPaymentIntent } = await import(new URL('supabase/functions/_shared/stripe.js', root));
  assert.equal(disputedPaymentIntent({ object: 'dispute', payment_intent: 'pi_3Abc123XYZ' }), 'pi_3Abc123XYZ');
  assert.equal(disputedPaymentIntent({ object: 'dispute', payment_intent: { id: 'pi_3Abc123XYZ' } }), 'pi_3Abc123XYZ');
  for (const bad of [null, {}, { object: 'charge', payment_intent: 'pi_3Abc123XYZ' }, { object: 'dispute' }, { object: 'dispute', payment_intent: "x' OR 1=1" }]) assert.equal(disputedPaymentIntent(bad), null);
  const hook = await read('supabase/functions/gymplified-stripe-webhook/index.ts');
  assert.match(hook, /event\.type === 'charge\.dispute\.created'[\s\S]*?gymplified_revoke_deluxe_by_payment/);
  assert.ok(hook.indexOf('verifyStripeWebhook(raw') < hook.indexOf('createClient(Deno.env'), 'the signature is checked before anything touches the database');
  const guide = await read('STRIPE_SETUP.md');
  for (const name of ['STRIPE_SECRET_KEY', 'STRIPE_PRICE_DELUXE', 'STRIPE_WEBHOOK_SECRET', 'charge.dispute.created', 'charge.refunded', 'checkout.session.completed']) assert.ok(guide.includes(name), name + ' is in the go-live guide');
  assert.doesNotMatch(guide, /sk_live_[A-Za-z0-9]{8,}|sk_test_[A-Za-z0-9]{8,}|whsec_[A-Za-z0-9]{8,}/, 'no real keys in the repo');
});
