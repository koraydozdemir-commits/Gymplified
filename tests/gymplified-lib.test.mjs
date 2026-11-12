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

// ===== Deluxe: analytics, coach, lift lab and programme logic =====
const TODAY = '2026-11-12'; // a Thursday; its week starts on Monday 2026-11-09
const lift = (name, muscle, kg, reps, n = 3) => ({ name, muscle, sets: [{ kg: kg / 2, reps: 10, type: 'warmup' }].concat(Array.from({ length: n }, () => ({ kg, reps }))) });
// Twelve weeks, Monday / Wednesday / Friday. Squat climbs every week; bench stops climbing after week 5.
const sampleLog = L => {
  const out = [];
  for (let w = 0; w < 12; w++) [0, 2, 4].forEach((offset, d) => {
    const date = L.addDays('2026-08-24', w * 7 + offset);
    if (date > TODAY) return;
    out.push({ date, mins: 60, prs: w ? [{}] : [], exercises: d === 0 ? [lift('Flat Bench Press', 'Chest', 60 + Math.min(w, 5) * 2.5, 8), lift('Plank', 'Abs', 0, 30)] : d === 1 ? [lift('Barbell Row', 'Lats', 50, 8)] : [lift('Barbell Back Squat', 'Quadriceps', 80 + w * 2.5, 5)] });
  });
  return out;
};

test('Deluxe analytics: weekly series, period comparison, rhythm and consistency', async () => {
  const L = await loadLib(), log = sampleLog(L);
  assert.equal(L.e1rm(100, 1), 100); assert.equal(L.e1rm(100, 5), 116.667); assert.equal(L.e1rm(0, 5), 0); assert.equal(L.e1rm('x', 5), 0);
  const series = plain(L.weeklySeries(log, TODAY, 4, 'mon'));
  assert.deepEqual(series.map(w => w.week), ['2026-10-19', '2026-10-26', '2026-11-02', '2026-11-09']);
  assert.equal(series[0].workouts, 3); assert.equal(series[3].workouts, 2, 'the week in progress has Monday and Wednesday only');
  // week of 19 Oct is w=8: bench 72.5×8×3 + row 50×8×3 + squat 100×5×3; warm-ups and the 0 kg plank add no volume
  assert.equal(series[0].vol, 72.5 * 24 + 50 * 24 + 100 * 15);
  assert.equal(series[0].sets, 12, 'bodyweight sets count as sets, warm-ups do not');
  assert.equal(series[1].avg, 4421.3, 'the mean of 4365, 4402.5, 4440 and 4477.5: the average reaches back before the visible range');
  assert.equal(L.weeklySeries(log, TODAY, 2, 'sun')[1].week, '2026-11-08');
  assert.equal(L.weeklySeries([], TODAY, 3).length, 3); assert.equal(L.weeklySeries(null, TODAY, 3)[0].vol, 0);
  const change = L.periodChange(L.weeklySeries(log, TODAY, 8, 'mon'));
  assert.equal(change.weeks, 4); assert.equal(change.workouts.before, 12); assert.equal(change.workouts.now, 11); assert.equal(change.length.now, 60);
  assert.ok(change.vol.pct > -10 && change.vol.pct < 10);
  assert.equal(L.periodChange([]), null);
  assert.equal(L.periodChange([{ vol: 0, workouts: 0, sets: 0, mins: 0 }, { vol: 5, workouts: 1, sets: 1, mins: 9 }]).vol.pct, null, 'nothing to compare with is "new", not infinity');
  const days = L.weekdayPattern(log);
  assert.deepEqual(plain(days.counts), [12, 0, 12, 0, 11, 0, 0]); assert.equal(days.best, 0); assert.equal(L.weekdayPattern([]).best, null);
  assert.deepEqual(plain(L.consistency(log, TODAY, 12, 3, 'mon')), { weeks: 11, hit: 11, pct: 100, goal: 3 }, 'the unfinished week is not a miss');
  assert.equal(L.consistency(log, TODAY, 12, 4, 'mon').pct, 0);
  assert.equal(L.consistency(log.slice(-4), TODAY, 12, 3, 'mon').weeks, 1, 'weeks before the first workout are not counted against a new user');
  assert.deepEqual(plain(L.consistency([], TODAY, 12, 3)), { weeks: 0, hit: 0, pct: 0, goal: 3 });
});

test('Deluxe lift lab: history, rep maxes and an honest projection', async () => {
  const L = await loadLib(), log = sampleLog(L);
  const squat = L.exerciseHistory(log, 'barbell back squat');
  assert.equal(squat.length, 11); assert.equal(squat[0].date, '2026-08-28'); assert.equal(squat[0].e1rm, L.e1rm(80, 5)); assert.equal(squat[0].sets, 3); assert.equal(squat[0].vol, 1200);
  assert.deepEqual(plain(L.exerciseHistory(log, 'Nope')), []); assert.deepEqual(plain(L.exerciseHistory(log, '')), []);
  assert.deepEqual(plain(L.exerciseNames(log).map(x => x.name)), ['Barbell Row', 'Flat Bench Press', 'Barbell Back Squat'], 'most trained first; a 0 kg plank has no strength curve');
  const maxes = L.repMaxes(log, 'Flat Bench Press');
  assert.equal(maxes.best, L.e1rm(72.5, 8));
  assert.deepEqual(plain(maxes.rows.map(r => [r.reps, r.kg])), [[1, 72.5], [3, 72.5], [5, 72.5], [8, 72.5], [10, 0], [12, 0]], 'a set of 8 proves 5 reps, not 10');
  assert.equal(maxes.rows[3].predicted, 72.5); assert.ok(maxes.rows[0].predicted > maxes.rows[5].predicted);
  // Squat adds 2.5 kg × (1 + 5/30) a week.
  const proj = L.projection(squat, TODAY, 130);
  assert.ok(Math.abs(proj.perWeek - 2.92) < 0.02); assert.equal(proj.target, 130); assert.ok(proj.weeks >= 1 && proj.weeks <= 4); assert.ok(proj.day > TODAY);
  assert.equal(L.projection(squat, TODAY, 500).day, '', 'more than a year away is not promised');
  assert.equal(L.projection(squat.slice(0, 3), TODAY, 130), null, 'needs four training days');
  assert.equal(L.projection(squat.slice(-4).map((p, i) => Object.assign({}, p, { date: L.addDays(TODAY, i - 3) })), TODAY, 130), null, 'needs three weeks of spread');
  const flat = L.projection(L.exerciseHistory(log, 'Barbell Row'), TODAY, 80);
  assert.equal(flat.perWeek, 0); assert.equal(flat.day, '', 'a flat lift gets no date');
});

test('Deluxe coach: lift trends, muscle balance and plain-language insights', async () => {
  const L = await loadLib(), log = sampleLog(L);
  const trends = Object.fromEntries(L.liftTrends(log, TODAY).map(t => [t.name, t.status]));
  assert.deepEqual(trends, { 'Barbell Back Squat': 'rising', 'Flat Bench Press': 'plateau', 'Barbell Row': 'plateau' });
  assert.deepEqual(plain(L.liftTrends(log.slice(-6), TODAY)), [], 'five training days are needed before a lift is judged');
  const bal = L.muscleBalance(log, TODAY, 28);
  assert.deepEqual(plain(bal.groups.map(g => [g.group, g.sets])), [['Chest', 12], ['Back', 12], ['Shoulders', 0], ['Arms', 0], ['Legs', 12], ['Core', 12]]);
  assert.deepEqual(plain(bal.split), { push: 12, pull: 12, legs: 12 }); assert.deepEqual(plain(bal.missing), ['Shoulders', 'Arms']);
  assert.equal(L.muscleBalance([{ date: TODAY, exercises: [lift('Mystery', 'wings', 10, 5)] }], TODAY, 28).other, 3);
  assert.deepEqual(plain(L.MUSCLE_GROUPS), ['Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core']);
  const notes = L.coachInsights(log, TODAY, { weekStart: 'mon', weeklyGoal: 3 }), ids = notes.map(n => n.id);
  for (const id of ['volume', 'rising:Barbell Back Squat', 'plateau:Flat Bench Press', 'missing', 'consistency', 'weekday']) assert.ok(ids.includes(id), id);
  assert.equal(notes.find(n => n.id === 'volume').title, 'Training volume is steady', 'a week in progress is not reported as a drop');
  for (const n of notes) { assert.ok(['good', 'warn', 'info'].includes(n.tone)); assert.ok(n.title && n.detail); assert.doesNotMatch(n.title + n.detail, /you must|you should|injur|doctor/i, 'observations, not prescriptions'); }
  const few = L.coachInsights(log.slice(0, 2), TODAY, {});
  assert.equal(few.length, 1); assert.equal(few[0].id, 'start'); assert.match(few[0].detail, /Finish 1 more workout /);
  assert.equal(L.coachInsights(null, TODAY).length, 1);
  // Four straight weeks of rising volume earns the lighter-week note instead of a plain trend line.
  const climbing = []; for (let w = 0; w < 6; w++) climbing.push({ date: L.addDays('2026-10-05', w * 7), mins: 40, exercises: [lift('Leg Press', 'Quadriceps', 100 + w * 20, 10)] });
  assert.equal(L.risingWeeks(L.weeklySeries(climbing, TODAY, 9, 'mon')), 4);
  assert.ok(L.coachInsights(climbing, TODAY, {}).some(n => n.id === 'deload'));
  const lopsided = []; for (let i = 0; i < 9; i++) lopsided.push({ date: L.addDays(TODAY, -i * 2), mins: 30, exercises: [lift('Flat Bench Press', 'Chest', 60, 8)] });
  assert.match(L.coachInsights(lopsided, TODAY, {}).find(n => n.id === 'split').detail, /No pull sets were logged/);
});

test('Deluxe planner: templates, week-by-week targets, deload and adherence', async () => {
  const L = await loadLib(), js = await read('app.js');
  const lib = js.slice(js.indexOf('const LIB={'), js.indexOf('const EXERCISE_DONE_LINES'));
  assert.ok(L.PLAN_TEMPLATES.length >= 5);
  for (const t of L.PLAN_TEMPLATES) {
    assert.equal(t.plan.length, t.days); assert.ok(t.weeks >= 4 && t.weeks <= 16); assert.ok(['weight', 'reps'].includes(t.mode));
    for (const [day, list] of t.plan) {
      assert.match(day, /^Day [1-7] · (Mon|Tues|Wednes|Thurs|Fri|Satur|Sun)day$/, 'day labels match the planner, so "today\'s plan" finds them');
      for (const [name, sets, reps] of list) { assert.ok(lib.includes(name + ':'), name + ' is in the exercise library'); assert.ok(sets >= 1 && sets <= 20 && reps >= 1 && reps <= 100); }
    }
  }
  assert.deepEqual(plain(L.sanitizePlanProgram(null)), { weeks: 0, start: '', mode: 'none', stepKg: 2.5, deload: false, adaptive: true });
  assert.deepEqual(plain(L.sanitizePlanProgram({ weeks: 99, start: '2026-02-30', mode: 'magic', stepKg: -4, deload: 1 })), { weeks: 16, start: '', mode: 'none', stepKg: 0, deload: true, adaptive: true });
  assert.equal(L.sanitizePlanProgram({ adaptive: false }).adaptive, false, 'adaptive targets can be switched off per plan');
  assert.equal(L.sanitizePlanProgram({ weeks: 1 }).weeks, 0);
  const program = { weeks: 8, start: '2026-10-05', mode: 'weight', stepKg: 2.5, deload: true }, ex = { sets: 4, reps: 8, kg: 60 };
  assert.deepEqual(plain(L.planWeek(program, TODAY)), { week: 6, of: 8, index: 5, upcoming: false, finished: false, deload: false, weekStart: '2026-11-09' });
  assert.equal(L.planWeek(program, '2026-11-25').deload, true); assert.equal(L.planWeek(program, '2026-12-01').finished, true); assert.equal(L.planWeek(program, '2026-10-01').upcoming, true);
  assert.equal(L.planWeek({ weeks: 0 }, TODAY), null); assert.equal(L.planWeek(null, TODAY), null);
  assert.deepEqual(plain(L.progressedTarget(ex, program, 0)), { sets: 4, reps: 8, kg: 60 });
  assert.deepEqual(plain(L.progressedTarget(ex, program, 5)), { sets: 4, reps: 8, kg: 72.5 });
  assert.deepEqual(plain(L.progressedTarget(ex, program, 7)), { sets: 3, reps: 8, kg: 54 }, 'the final week is lighter: 60% of the sets at 90% of the starting weight');
  assert.deepEqual(plain(L.progressedTarget(ex, Object.assign({}, program, { deload: false }), 7)), { sets: 4, reps: 8, kg: 77.5 });
  assert.deepEqual(plain(L.progressedTarget(ex, Object.assign({}, program, { mode: 'reps' }), 6)), { sets: 4, reps: 12, kg: 60 }, 'reps stop climbing after four extra');
  assert.deepEqual(plain(L.progressedTarget({ sets: 3, reps: 10, kg: 0 }, program, 4)), { sets: 3, reps: 10, kg: 0 }, 'an empty weight stays empty');
  assert.deepEqual(plain(L.progressedTarget(ex, null, 5)), { sets: 4, reps: 8, kg: 60 }, 'open-ended plans never move');
  assert.equal(L.progressedTarget({ sets: 3, reps: 5, kg: 100 }, program, 7, 0.45359237).kg, 89.811, 'pound users deload to a whole pound');
  const plan = { name: 'P', program, days: [{ day: 'Day 1 · Monday', exercises: [ex] }, { day: 'Day 3 · Wednesday', exercises: [ex] }, { day: 'Day 7 · Sunday', exercises: [] }] };
  const done = (date, day, name = 'P') => ({ date, exercises: [], plan: { name, day } });
  const sessions = [done('2026-10-05', 'Day 1 · Monday'), done('2026-10-07', 'Day 3 · Wednesday'), done('2026-10-12', 'Day 1 · Monday'), done('2026-11-09', 'Day 1 · Monday'), done('2026-11-10', 'Day 1 · Monday', 'Other'), done('2026-09-01', 'Day 1 · Monday')];
  const adh = L.planAdherence(plan, sessions, TODAY);
  assert.deepEqual(plain(adh.thisWeek), [{ day: 'Day 1 · Monday', done: true }, { day: 'Day 3 · Wednesday', done: false }], 'empty days are not expected');
  assert.equal(adh.done, 4); assert.equal(adh.expected, 11, 'five finished weeks of two days, plus the day already trained this week'); assert.equal(adh.pct, 36);
  assert.equal(L.planAdherence({ name: 'P', days: plan.days }, sessions, TODAY).pct, null, 'open-ended plans have no score');
});

test('DX10: adaptive programme targets follow what was lifted, not just the calendar', async () => {
  const L = await loadLib();
  const set = (kg, reps, type) => ({ kg, reps, type: type || 'normal' });
  const session = (date, target, sets, plan = 'P', name = 'Bench') => ({ date, plan: { name: plan, day: 'Day 1 · Monday' }, exercises: [{ name, target, sets }] });
  const t60 = { sets: 3, reps: 8, kg: 60 };
  const hit = session('2026-11-02', t60, [set(30, 8, 'warmup'), set(60, 8), set(60, 9), set(60, 8)]);
  const short = (date) => session(date, t60, [set(60, 8), set(60, 6), set(60, 5)]);
  const results = list => L.planExerciseResults(list, 'P', 'bench');
  assert.equal(L.targetSetsHit(results([hit])[0]), 3, 'warm-ups do not count');
  assert.equal(results([hit, session('2026-11-03', t60, [], 'Other')]).length, 1, 'only the same plan counts');
  assert.equal(results([{ date: '2026-11-02', plan: { name: 'P' }, exercises: [{ name: 'Bench', sets: [set(60, 8)] }] }]).length, 0, 'sessions without a recorded target are ignored');
  const opts = { mode: 'weight', stepKg: 2.5, today: TODAY };
  const scheduled = { sets: 3, reps: 8, kg: 70 };
  const progress = L.adaptiveTarget(scheduled, results([hit]), opts);
  assert.equal(progress.action, 'progress'); assert.equal(progress.kg, 62.5, 'one step above what was lifted, not a jump to the calendar target');
  assert.deepEqual(plain(progress.reason), { code: 'progress', hit: 3, of: 3, reps: 8, kg: 60, date: '2026-11-02' });
  assert.equal(L.adaptiveTarget({ sets: 3, reps: 8, kg: 61 }, results([hit]), opts).kg, 61, 'never past the calendar target');
  const hold = L.adaptiveTarget(scheduled, results([short('2026-11-09')]), opts);
  assert.equal(hold.action, 'hold'); assert.equal(hold.kg, 60); assert.equal(hold.reason.hit, 1);
  const reset = L.adaptiveTarget(scheduled, results([short('2026-11-09'), short('2026-11-02')]), opts);
  assert.equal(reset.action, 'reset'); assert.equal(reset.kg, 54, 'two misses at the same target drop about 10%');
  assert.equal(L.adaptiveTarget(scheduled, results([short('2026-11-09'), hit]), opts).action, 'hold', 'one miss after a hit is only a hold');
  assert.equal(L.adaptiveTarget(scheduled, [], opts).action, 'schedule');
  assert.equal(L.adaptiveTarget(scheduled, results([session('2026-08-01', t60, [set(60, 8), set(60, 8), set(60, 8)])]), opts).reason.code, 'break', 'old results do not steer a comeback');
  assert.equal(L.adaptiveTarget(scheduled, results([short('2026-11-09')]), Object.assign({ deload: true }, opts)).action, 'deload');
  const reps = L.adaptiveTarget({ sets: 3, reps: 12, kg: 0 }, results([session('2026-11-09', { sets: 3, reps: 9, kg: 0 }, [set(0, 9), set(0, 9), set(0, 10)])]), { mode: 'reps', today: TODAY });
  assert.deepEqual([reps.action, reps.reps, reps.kg], ['progress', 10, 0], 'rep programmes add one rep at a time');
});

test('DX11: maintenance calories come from intake and the weight trend, with safe targets and macros', async () => {
  const L = await loadLib();
  const intake = {}, weights = {};
  for (let i = 1; i <= 28; i++) { const d = L.addDays(TODAY, -i); intake[d] = 2400; if (i % 3 === 0) weights[d] = 80 + i * (0.5 / 7); }
  intake[L.addDays(TODAY, -2)] = 300; // an unfinished log
  intake[TODAY] = 900; // today is still open
  const e = L.energyBalance(intake, weights, TODAY);
  assert.equal(e.ready, true); assert.equal(e.foodDays, 27, 'very low days and today are left out');
  assert.equal(e.kgPerWeek, -0.5, 'losing half a kilo a week');
  assert.equal(e.maintenance, 2950, '2,400 kcal eaten plus 550 kcal a day from the loss');
  assert.equal(e.confidence, 'high');
  const thin = L.energyBalance({ [L.addDays(TODAY, -1)]: 2000 }, { [TODAY]: 80 }, TODAY);
  assert.equal(thin.ready, false); assert.equal(thin.needFoodDays, 14); assert.equal(thin.needWeighIns, 4);
  const odd = {}; for (let i = 1; i <= 20; i++) odd[L.addDays(TODAY, -i)] = 900;
  assert.equal(L.energyBalance(odd, { [L.addDays(TODAY, -20)]: 80, [L.addDays(TODAY, -14)]: 82, [L.addDays(TODAY, -7)]: 84, [TODAY]: 86 }, TODAY).implausible, true, 'impossible numbers are not offered');
  assert.equal(L.energyBalance(intake, weights, 'nope').ready, false);
  assert.deepEqual(plain(L.calorieTarget(2950, 'lose', 0.5, 80)), { goal: 'lose', kcal: 2510, perDay: -440, kgPerWeek: -0.4 });
  assert.equal(L.calorieTarget(1500, 'lose', 1, 120).kcal, 1200, 'never below 1,200 kcal');
  assert.equal(L.calorieTarget(2000, 'lose', 1, 150).kcal, 1500, 'never more than a 25% deficit');
  assert.equal(L.calorieTarget(2500, 'gain', 5, 80).kcal, 2940, 'gaining is capped at 0.5% a week');
  assert.equal(L.calorieTarget(2500, 'maintain', 1, 80).kcal, 2500);
  assert.equal(L.calorieTarget(2500, 'nonsense', 1, 80).goal, 'maintain');
  assert.deepEqual(plain(L.macroTargets(2500, 80, 'lose')), { protein: 160, fat: 69, carbs: 310 });
  assert.deepEqual(plain(L.macroTargets(2000, 0, 'maintain')), { protein: 125, fat: 56, carbs: 249 }, 'without a body weight protein is a quarter of energy');
});

test('DX12/DX13: one tip at a time with a cooldown, and challenge standings', async () => {
  const L = await loadLib(), day = 864e5, now = 100 * day;
  const tips = [{ id: 'pr', priority: 3 }, { id: 'routine', priority: 5 }];
  assert.equal(L.pickNudge(tips, {}, now).id, 'routine', 'highest priority first');
  assert.equal(L.pickNudge(tips, { dismissed: { routine: true } }, now).id, 'pr');
  assert.equal(L.pickNudge(tips, { current: { id: 'pr', at: now - day / 2 } }, now).id, 'pr', 'a shown tip stays for the day');
  assert.equal(L.pickNudge(tips, { current: { id: 'pr', at: now - 2 * day } }, now), null, 'then a cooldown');
  assert.equal(L.pickNudge(tips, { current: { id: 'pr', at: now - 4 * day } }, now).id, 'routine');
  assert.equal(L.pickNudge(tips, { current: { id: 'routine', at: now - 4 * day }, seen: { routine: now - 4 * day } }, now).id, 'pr', 'a recently seen tip waits two weeks');
  assert.equal(L.pickNudge(tips, { seen: { routine: now - 3 * day, pr: now - 5 * day } }, now), null);
  assert.equal(L.pickNudge(tips, { seen: { routine: now - 15 * day } }, now).id, 'routine');
  assert.equal(L.pickNudge([], {}, now), null);
  const ranked = L.rankChallenge([{ user_id: 'a', progress: 4 }, { user_id: 'b', progress: 6 }, { user_id: 'c', progress: null }, { user_id: 'd', progress: 6 }], 5);
  assert.deepEqual(ranked.map(r => [r.user_id, r.rank, r.pct, r.done]), [['b', 1, 100, true], ['d', 1, 100, true], ['a', 3, 80, false], ['c', null, 0, false]]);
  assert.deepEqual(plain(L.CHALLENGE_METRICS), ['workouts', 'volume']);
});
