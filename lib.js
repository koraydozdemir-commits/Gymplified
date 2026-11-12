// Gymplified pure logic. No DOM, no storage, no globals other than GymLib, so every function here
// is unit-tested in Node (tests/gymplified-lib.test.mjs) and reused by the app.
(function (root) {
  'use strict';

  const num = (value, min, max, fallback) => {
    const n = Number(value);
    return Number.isFinite(n) ? Math.max(min, Math.min(max, n)) : fallback;
  };
  const text = (value, max) => String(value == null ? '' : value).replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max);
  const isDay = value => {
    const s = String(value || '');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
    const d = new Date(s + 'T12:00:00Z');
    return Number.isFinite(d.getTime()) && d.toISOString().slice(0, 10) === s;
  };
  const dayOf = date => new Date(date.getTime() - date.getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
  const addDays = (key, n) => { const d = new Date(key + 'T12:00:00'); d.setDate(d.getDate() + n); return dayOf(d); };
  const round = (n, dp) => { const f = 10 ** dp; return Math.round(n * f) / f; };

  // ---- B11: plate calculator -------------------------------------------------------------
  const DEFAULT_PLATES_KG = [25, 20, 15, 10, 5, 2.5, 1.25];
  const DEFAULT_PLATES_LB = [45, 35, 25, 10, 5, 2.5];
  // Works in whatever unit the caller passes (kg or lb). Greedy from the heaviest plate, which is
  // exact for standard plate sets. `remainder` is what cannot be loaded per side.
  function platesPerSide(target, bar, plates) {
    const total = num(target, 0, 2000, 0), barWeight = num(bar, 0, 100, 20);
    const sizes = [...new Set((Array.isArray(plates) ? plates : []).map(Number).filter(p => Number.isFinite(p) && p > 0))].sort((a, b) => b - a);
    if (total < barWeight) return { ok: false, perSide: [], remainder: 0, loaded: barWeight, belowBar: true };
    let left = round((total - barWeight) / 2, 3);
    const perSide = [];
    for (const size of sizes) {
      const count = Math.floor((left + 1e-9) / size);
      if (count > 0) { perSide.push({ plate: size, count }); left = round(left - count * size, 3); }
    }
    const loaded = round(total - left * 2, 3);
    return { ok: left < 1e-6, perSide, remainder: left, loaded, belowBar: false };
  }

  // ---- B17: warm-up sets from a working weight ---------------------------------------------
  function warmupSets(workKg, stepKg) {
    const work = num(workKg, 0, 1000, 0), step = num(stepKg, 0.25, 25, 2.5);
    if (work <= 0) return [];
    const snap = kg => Math.max(0, Math.round(kg / step) * step);
    const plan = [[0.5, 8], [0.7, 5], [0.9, 2]];
    const sets = [];
    plan.forEach(([fraction, reps]) => {
      const kg = round(snap(work * fraction), 3);
      if (kg > 0 && kg < work && !sets.some(s => s.kg === kg)) sets.push({ kg, reps, type: 'warmup' });
    });
    return sets;
  }

  // ---- B12: progressive overload, transparent rule -----------------------------------------
  // When every working set last time reached the top of the rep range, add one step of weight.
  // Otherwise keep the weight and aim for one more rep on the weakest set.
  function overloadSuggestion(previousSets, options) {
    const opts = options || {};
    const step = num(opts.stepKg, 0.25, 25, 2.5), top = Math.round(num(opts.topReps, 1, 100, 8));
    const working = (Array.isArray(previousSets) ? previousSets : [])
      .filter(s => s && s.type !== 'warmup' && Number(s.kg) > 0 && Number(s.reps) > 0)
      .map(s => ({ kg: Number(s.kg), reps: Math.round(Number(s.reps)) }));
    if (!working.length) return null;
    const kg = Math.max(...working.map(s => s.kg));
    const atTop = working.filter(s => s.kg === kg);
    const minReps = Math.min(...atTop.map(s => s.reps));
    if (minReps >= top) return { action: 'weight', kg: round(kg + step, 3), reps: top, fromKg: kg, why: 'every set reached ' + top + ' reps' };
    return { action: 'reps', kg, reps: minReps + 1, fromKg: kg, why: 'aim for ' + top + ' reps on every set before adding weight' };
  }

  // ---- B20: quick add, "bench 60x8x3" → name + weight × reps × sets --------------------------
  function parseQuickAdd(input) {
    const m = /^\s*(.+?)\s+(\d+(?:[.,]\d+)?)\s*(kg|lb|lbs)?\s*[x×*]\s*(\d{1,3})(?:\s*[x×*]\s*(\d{1,2}))?\s*$/i.exec(String(input || ''));
    if (!m) return null;
    const weight = Number(m[2].replace(',', '.')), reps = Number(m[4]), sets = m[5] ? Number(m[5]) : 1;
    if (!(weight >= 0 && weight <= 1000) || !(reps >= 1 && reps <= 1000) || !(sets >= 1 && sets <= 20)) return null;
    const unit = m[3] ? (m[3].toLowerCase().startsWith('lb') ? 'lb' : 'kg') : '';
    return { name: m[1].trim().slice(0, 80), weight, reps, sets, unit };
  }

  // Gym shorthand for quick add. Anything else goes through the normal exercise search.
  const QUICK_ALIASES = { bench: 'Flat Bench Press', 'bench press': 'Flat Bench Press', squat: 'Barbell Back Squat', squats: 'Barbell Back Squat', deadlift: 'Conventional Deadlift', deadlifts: 'Conventional Deadlift', dl: 'Conventional Deadlift', ohp: 'Overhead Press', press: 'Overhead Press', row: 'Barbell Row', rows: 'Barbell Row', rdl: 'Romanian Deadlift', curl: 'Barbell Curl', curls: 'Barbell Curl', pullup: 'Pull-Up', pullups: 'Pull-Up', 'pull up': 'Pull-Up', 'pull ups': 'Pull-Up', dips: 'Dips', pulldown: 'Lat Pulldown' };
  function quickAlias(name) { const k = String(name || '').trim().toLowerCase(); return Object.prototype.hasOwnProperty.call(QUICK_ALIASES, k) ? QUICK_ALIASES[k] : ''; }

  // ---- B8: reorder -------------------------------------------------------------------------
  function moveItem(list, from, to) {
    const copy = list.slice();
    if (from < 0 || from >= copy.length || to < 0 || to >= copy.length || from === to) return copy;
    const [item] = copy.splice(from, 1);
    copy.splice(to, 0, item);
    return copy;
  }

  // ---- B7: supersets -----------------------------------------------------------------------
  // Exercises with the same non-empty `group` that sit next to each other form one superset.
  function groupBounds(workouts, index) {
    const w = workouts[index];
    if (!w || !w.group) return { start: index, end: index };
    let start = index, end = index;
    while (start > 0 && workouts[start - 1] && workouts[start - 1].group === w.group) start--;
    while (end < workouts.length - 1 && workouts[end + 1] && workouts[end + 1].group === w.group) end++;
    return { start, end };
  }
  // Rest starts only after the last exercise of a superset; a single exercise always rests.
  function restDueAfterSet(workouts, index) {
    const b = groupBounds(workouts, index);
    return b.start === b.end || index === b.end;
  }
  // A group needs at least two neighbours; lone leftovers (after a delete or reorder) are cleared.
  function normaliseGroups(workouts) {
    workouts.forEach((w, i) => {
      if (!w || !w.group) return;
      const b = groupBounds(workouts, i);
      if (b.start === b.end) w.group = '';
    });
    return workouts;
  }

  // ---- B14: totals of a finished session after it was edited --------------------------------
  function sessionTotals(session) {
    let vol = 0, sets = 0, reps = 0;
    const names = [];
    (session.exercises || []).forEach(ex => {
      const done = (ex.sets || []).filter(s => s && (Number(s.reps) > 0 || Number(s.duration) > 0 || Number(s.distance) > 0));
      if (done.length) names.push(String(ex.name || 'Exercise'));
      done.forEach(s => {
        sets++; reps += Number(s.reps) || 0;
        if (s.type !== 'warmup') vol += (Number(s.kg) || 0) * (Number(s.reps) || 0);
      });
    });
    return { vol: round(vol, 1), sets, reps, ex: names.length, names };
  }

  // ---- G4: training calendar ----------------------------------------------------------------
  // Returns whole weeks (oldest first) ending with the week that contains `today`.
  function calendarWeeks(sessions, today, weeks, weekStart) {
    const perDay = {};
    (sessions || []).forEach(s => {
      if (!s || !isDay(s.date)) return;
      const d = perDay[s.date] || (perDay[s.date] = { count: 0, vol: 0, sets: 0 });
      d.count++; d.vol += Number(s.vol) || 0; d.sets += Number(s.sets) || 0;
    });
    const maxVol = Math.max(0, ...Object.values(perDay).map(d => d.vol));
    const first = new Date(today + 'T12:00:00');
    const offset = (first.getDay() - (weekStart === 'sun' ? 0 : 1) + 7) % 7;
    const startOfThisWeek = addDays(today, -offset);
    const out = [];
    for (let w = weeks - 1; w >= 0; w--) {
      const row = [];
      for (let d = 0; d < 7; d++) {
        const key = addDays(startOfThisWeek, -7 * w + d), info = perDay[key];
        let level = 0;
        if (info) level = maxVol > 0 ? Math.max(1, Math.min(4, Math.ceil(info.vol / maxVol * 4))) : 1;
        row.push({ day: key, level, count: info ? info.count : 0, vol: info ? round(info.vol, 1) : 0, sets: info ? info.sets : 0, future: key > today });
      }
      out.push(row);
    }
    return out;
  }

  // ---- G9: monthly report --------------------------------------------------------------------
  function monthReport(sessions, monthKey) {
    const prevKey = (() => { const [y, m] = monthKey.split('-').map(Number); const d = new Date(Date.UTC(y, m - 2, 1)); return d.toISOString().slice(0, 7); })();
    const sum = key => {
      const list = (sessions || []).filter(s => s && String(s.date || '').slice(0, 7) === key);
      const muscles = {}, exercises = {};
      let vol = 0, sets = 0, mins = 0, prs = 0;
      list.forEach(s => {
        vol += Number(s.vol) || 0; sets += Number(s.sets) || 0; mins += Number(s.mins) || 0; prs += Array.isArray(s.prs) ? s.prs.length : 0;
        (s.exercises || []).forEach(ex => {
          const n = (ex.sets || []).length;
          const muscle = String(ex.muscle || '').trim();
          if (muscle) muscles[muscle] = (muscles[muscle] || 0) + n;
          exercises[ex.name] = (exercises[ex.name] || 0) + n;
        });
      });
      const top = map => Object.entries(map).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 3).map(([name, count]) => ({ name, sets: count }));
      return { workouts: list.length, days: new Set(list.map(s => s.date)).size, vol: round(vol, 1), sets, mins, prs, topMuscles: top(muscles), topExercises: top(exercises) };
    };
    const cur = sum(monthKey), prev = sum(prevKey);
    const delta = (a, b) => (b > 0 ? Math.round((a - b) / b * 100) : null);
    return { month: monthKey, previousMonth: prevKey, current: cur, previous: prev, change: { workouts: delta(cur.workouts, prev.workouts), vol: delta(cur.vol, prev.vol), mins: delta(cur.mins, prev.mins) } };
  }

  // ---- G7: days since each muscle group was trained ------------------------------------------
  function muscleRecency(sessions, today) {
    const last = {};
    (sessions || []).forEach(s => {
      if (!s || !isDay(s.date)) return;
      (s.exercises || []).forEach(ex => {
        const m = String(ex.muscle || '').trim().toLowerCase();
        if (m && (!last[m] || s.date > last[m])) last[m] = s.date;
      });
    });
    return Object.entries(last)
      .map(([muscle, day]) => ({ muscle, day, days: Math.max(0, Math.round((new Date(today + 'T12:00:00') - new Date(day + 'T12:00:00')) / 864e5)) }))
      .sort((a, b) => a.days - b.days || a.muscle.localeCompare(b.muscle));
  }

  // ---- F12: bodyweight trend -----------------------------------------------------------------
  // entries: { 'YYYY-MM-DD': kg }. Trend is the mean of the entries in the trailing `window` days.
  function weightTrend(entries, window) {
    const span = Math.round(num(window, 1, 60, 7));
    const days = Object.keys(entries || {}).filter(isDay).sort();
    return days.map(day => {
      const from = addDays(day, -(span - 1));
      const inWindow = days.filter(d => d >= from && d <= day).map(d => Number(entries[d]));
      return { day, kg: Number(entries[day]), trend: round(inWindow.reduce((a, b) => a + b, 0) / inWindow.length, 2) };
    });
  }

  // ---- K8: storage guard ---------------------------------------------------------------------
  // localStorage stores UTF-16, so a character costs two bytes against the ~5 MB origin limit.
  function storageUse(chars, quotaBytes) {
    const quota = num(quotaBytes, 1, Number.MAX_SAFE_INTEGER, 5 * 1024 * 1024), bytes = Math.max(0, Number(chars) || 0) * 2;
    const pct = Math.min(100, Math.round(bytes / quota * 100));
    return { bytes, quota, pct, warn: pct >= 80, critical: pct >= 95 };
  }

  // ---- State added by this release: always cleaned before it is saved or synced ---------------
  const MEASURE_FIELDS = ['chest', 'waist', 'hips', 'arm', 'thigh', 'calf', 'shoulders', 'neck'];
  const DEFAULT_SUPPLEMENTS = ['Creatine', 'Protein shake', 'Vitamin D'];
  function sanitizeExtras(raw) {
    const src = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
    const dayMap = (value, max, clean) => {
      const out = {};
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        Object.keys(value).filter(isDay).sort().slice(-max).forEach(k => { const v = clean(value[k]); if (v != null) out[k] = v; });
      }
      return out;
    };
    const bodyLog = dayMap(src.bodyLog, 1500, v => { const n = Number(v); return Number.isFinite(n) && n >= 20 && n <= 400 ? round(n, 2) : null; });
    const measures = dayMap(src.measures, 400, v => {
      if (!v || typeof v !== 'object' || Array.isArray(v)) return null;
      const row = {};
      MEASURE_FIELDS.forEach(f => { const n = Number(v[f]); if (Number.isFinite(n) && n >= 5 && n <= 300) row[f] = round(n, 1); });
      return Object.keys(row).length ? row : null;
    });
    const supplements = [...new Set((Array.isArray(src.supplements) ? src.supplements : DEFAULT_SUPPLEMENTS).map(x => text(x, 30)).filter(Boolean))].slice(0, 12);
    const suppLog = dayMap(src.suppLog, 120, v => {
      const list = [...new Set((Array.isArray(v) ? v : []).map(x => text(x, 30)).filter(x => supplements.includes(x)))];
      return list.length ? list : null;
    });
    const goalKg = (() => { const n = Number(src.goalKg); return Number.isFinite(n) && n >= 20 && n <= 400 ? round(n, 2) : 0; })();
    return { bodyLog, measures, supplements, suppLog, goalKg };
  }
  function sanitizeGear(raw) {
    const src = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
    const plates = [...new Set((Array.isArray(src.plates) ? src.plates : []).map(Number).filter(p => Number.isFinite(p) && p > 0 && p <= 100).map(p => round(p, 2)))].sort((a, b) => b - a).slice(0, 12);
    const bar = Number(src.bar);
    return { unit: src.unit === 'lb' ? 'lb' : 'kg', bar: Number.isFinite(bar) && bar >= 0 && bar <= 100 ? round(bar, 2) : 0, plates };
  }

  // ---- B31: starter routines (generic examples, original wording) ----------------------------
  const STARTER_ROUTINES = [
    { name: 'Full body A', tag: 'Full body', note: '3 days a week, alternate A and B', exercises: [['Barbell Back Squat', 3, 8], ['Flat Bench Press', 3, 8], ['Barbell Row', 3, 8], ['Plank', 3, 30]] },
    { name: 'Full body B', tag: 'Full body', note: '3 days a week, alternate A and B', exercises: [['Conventional Deadlift', 2, 5], ['Overhead Press', 3, 8], ['Lat Pulldown', 3, 10], ['Hanging Leg Raise', 3, 10]] },
    { name: 'Push', tag: 'Push/Pull/Legs', note: 'Chest, shoulders, triceps', exercises: [['Flat Bench Press', 4, 8], ['Overhead Press', 3, 8], ['Incline Dumbbell Press', 3, 10], ['Lateral Raise', 3, 12], ['Cable Triceps Pushdown', 3, 12]] },
    { name: 'Pull', tag: 'Push/Pull/Legs', note: 'Back and biceps', exercises: [['Conventional Deadlift', 3, 5], ['Pull-Up', 3, 8], ['Barbell Row', 3, 8], ['Face Pull', 3, 12], ['Barbell Curl', 3, 10]] },
    { name: 'Legs', tag: 'Push/Pull/Legs', note: 'Quads, hamstrings, glutes, calves', exercises: [['Barbell Back Squat', 4, 8], ['Romanian Deadlift', 3, 8], ['Leg Press', 3, 10], ['Seated Leg Curl', 3, 12], ['Standing Calf Raise', 3, 12]] },
    { name: 'Upper', tag: 'Upper/Lower', note: '4 days a week: upper, lower, rest, upper, lower', exercises: [['Flat Bench Press', 4, 6], ['Barbell Row', 4, 6], ['Overhead Press', 3, 8], ['Lat Pulldown', 3, 10], ['Barbell Curl', 2, 12], ['Cable Triceps Pushdown', 2, 12]] },
    { name: 'Lower', tag: 'Upper/Lower', note: '4 days a week: upper, lower, rest, upper, lower', exercises: [['Barbell Back Squat', 4, 6], ['Romanian Deadlift', 3, 8], ['Leg Press', 3, 10], ['Seated Leg Curl', 3, 10], ['Standing Calf Raise', 3, 12]] },
    { name: '5×5 A', tag: '5×5', note: 'Alternate A and B, add a little weight when all 5 sets of 5 are done', exercises: [['Barbell Back Squat', 5, 5], ['Flat Bench Press', 5, 5], ['Barbell Row', 5, 5]] },
    { name: '5×5 B', tag: '5×5', note: 'Alternate A and B, add a little weight when all 5 sets of 5 are done', exercises: [['Barbell Back Squat', 5, 5], ['Overhead Press', 5, 5], ['Conventional Deadlift', 1, 5]] }
  ];

  // =================== Deluxe: analytics, coach, lift lab and programme logic ===================
  // Everything below is pure and works in kilograms; the app converts for display.
  const dayDiff = (from, to) => Math.round((new Date(to + 'T12:00:00') - new Date(from + 'T12:00:00')) / 864e5);
  const weekStartOf = (day, weekStart) => addDays(day, -((new Date(day + 'T12:00:00').getDay() - (weekStart === 'sun' ? 0 : 1) + 7) % 7));
  const mean = list => (list.length ? list.reduce((a, b) => a + b, 0) / list.length : 0);
  const pctChange = (now, before) => (before > 0 ? round((now - before) / before * 100, 1) : null);
  const validSessions = sessions => (sessions || []).filter(s => s && isDay(s.date) && Array.isArray(s.exercises));
  const workingSets = ex => (ex && Array.isArray(ex.sets) ? ex.sets : []).filter(s => s && s.type !== 'warmup' && Number(s.kg) > 0 && Number(s.reps) > 0);
  // Sets that count towards set totals: bodyweight work (0 kg) is real training, warm-ups are not.
  const countedSets = ex => (ex && Array.isArray(ex.sets) ? ex.sets : []).filter(s => s && s.type !== 'warmup' && Number(s.reps) > 0);
  const sessionVolume = s => (s.exercises || []).reduce((n, ex) => n + workingSets(ex).reduce((v, x) => v + Number(x.kg) * Number(x.reps), 0), 0);

  // Epley estimate, the same formula the rest of the app uses.
  function e1rm(kg, reps) {
    const w = Number(kg), r = Math.max(1, Math.round(Number(reps) || 1));
    if (!Number.isFinite(w) || w <= 0) return 0;
    return round(r === 1 ? w : w * (1 + r / 30), 3);
  }

  // Whole weeks, oldest first, ending with the week that contains `today`. `avg` is the trailing
  // four-week mean, worked out from weeks before the visible range too, so the line starts honest.
  function weeklySeries(sessions, today, weeks, weekStart) {
    const count = Math.round(num(weeks, 1, 260, 12)), lead = 3, thisWeek = weekStartOf(today, weekStart), buckets = {};
    validSessions(sessions).forEach(s => {
      const key = weekStartOf(s.date, weekStart), b = buckets[key] || (buckets[key] = { vol: 0, workouts: 0, sets: 0, mins: 0 });
      b.vol += sessionVolume(s); b.workouts++; b.mins += Number(s.mins) || 0;
      b.sets += (s.exercises || []).reduce((n, ex) => n + countedSets(ex).length, 0);
    });
    const all = [];
    for (let i = count + lead - 1; i >= 0; i--) {
      const week = addDays(thisWeek, -7 * i), b = buckets[week] || { vol: 0, workouts: 0, sets: 0, mins: 0 };
      all.push({ week, vol: round(b.vol, 1), workouts: b.workouts, sets: b.sets, mins: b.mins });
    }
    return all.map((w, i) => Object.assign(w, { avg: round(mean(all.slice(Math.max(0, i - 3), i + 1).map(x => x.vol)), 1) })).slice(lead);
  }

  // The newer half of a series against the older half.
  function periodChange(series) {
    const half = Math.floor((series || []).length / 2);
    if (!half) return null;
    const older = series.slice(series.length - 2 * half, series.length - half), newer = series.slice(series.length - half);
    const pair = key => { const now = round(newer.reduce((n, w) => n + w[key], 0), 1), before = round(older.reduce((n, w) => n + w[key], 0), 1); return { now, before, pct: pctChange(now, before) }; };
    const out = { weeks: half, vol: pair('vol'), workouts: pair('workouts'), sets: pair('sets'), mins: pair('mins') };
    const perSession = list => { const n = list.reduce((a, w) => a + w.workouts, 0); return n ? round(list.reduce((a, w) => a + w.mins, 0) / n, 0) : 0; };
    out.length = { now: perSession(newer), before: perSession(older), pct: pctChange(perSession(newer), perSession(older)) };
    return out;
  }

  // Workouts per weekday, Monday first.
  function weekdayPattern(sessions, since) {
    const counts = [0, 0, 0, 0, 0, 0, 0];
    validSessions(sessions).forEach(s => { if (!since || s.date >= since) counts[(new Date(s.date + 'T12:00:00').getDay() + 6) % 7]++; });
    const total = counts.reduce((a, b) => a + b, 0), top = Math.max(...counts);
    return { counts, total, best: total ? counts.indexOf(top) : null };
  }

  // How many recent weeks reached the weekly goal. Weeks before the first workout are not counted.
  function consistency(sessions, today, weeks, weeklyGoal, weekStart) {
    const list = validSessions(sessions), goal = Math.round(num(weeklyGoal, 1, 14, 3));
    if (!list.length) return { weeks: 0, hit: 0, pct: 0, goal };
    const first = weekStartOf(list.reduce((a, s) => (s.date < a ? s.date : a), list[0].date), weekStart);
    const series = weeklySeries(list, today, weeks, weekStart).filter(w => w.week >= first);
    // The current week only counts once it has reached the goal; it is not a miss while still in progress.
    const done = series.filter((w, i) => i < series.length - 1 || w.workouts >= goal), hit = done.filter(w => w.workouts >= goal).length;
    return { weeks: done.length, hit, pct: done.length ? Math.round(hit / done.length * 100) : 0, goal };
  }

  // One point per training day for an exercise, oldest first.
  function exerciseHistory(sessions, name) {
    const key = String(name || '').trim().toLowerCase(), byDay = {};
    if (!key) return [];
    validSessions(sessions).forEach(s => s.exercises.forEach(ex => {
      if (String(ex.name || '').trim().toLowerCase() !== key) return;
      const sets = workingSets(ex); if (!sets.length) return;
      const d = byDay[s.date] || (byDay[s.date] = { date: s.date, e1rm: 0, kg: 0, reps: 0, vol: 0, sets: 0 });
      sets.forEach(x => { const est = e1rm(x.kg, x.reps); d.vol += Number(x.kg) * Number(x.reps); d.sets++; if (est > d.e1rm) { d.e1rm = est; d.kg = Number(x.kg); d.reps = Math.round(Number(x.reps)); } });
    }));
    return Object.values(byDay).map(d => Object.assign(d, { vol: round(d.vol, 1) })).sort((a, b) => a.date.localeCompare(b.date));
  }

  // Exercises by how often they were trained, most frequent first.
  function exerciseNames(sessions) {
    const seen = {};
    validSessions(sessions).forEach(s => { const today = new Set(); s.exercises.forEach(ex => { const n = String(ex.name || '').trim(); if (n && workingSets(ex).length && !today.has(n.toLowerCase())) { today.add(n.toLowerCase()); (seen[n.toLowerCase()] = seen[n.toLowerCase()] || { name: n, sessions: 0 }).sessions++; } }); });
    return Object.values(seen).sort((a, b) => b.sessions - a.sessions || a.name.localeCompare(b.name));
  }

  // Best weight actually lifted for at least `reps` reps, next to what the best estimate predicts.
  const REP_TARGETS = [1, 3, 5, 8, 10, 12];
  function repMaxes(sessions, name, targets) {
    const key = String(name || '').trim().toLowerCase(), list = (targets || REP_TARGETS).map(reps => ({ reps, kg: 0, date: '', predicted: 0 }));
    let best = 0;
    validSessions(sessions).forEach(s => s.exercises.forEach(ex => {
      if (String(ex.name || '').trim().toLowerCase() !== key) return;
      workingSets(ex).forEach(x => {
        best = Math.max(best, e1rm(x.kg, x.reps));
        list.forEach(t => { if (Number(x.reps) >= t.reps && Number(x.kg) > t.kg) { t.kg = Number(x.kg); t.date = s.date; } });
      });
    }));
    list.forEach(t => { t.predicted = best ? round(t.reps === 1 ? best : best / (1 + t.reps / 30), 1) : 0; });
    return { best, rows: list };
  }

  // Straight-line fit through the recent estimates. Says how fast a lift is moving and, when it is
  // rising, roughly when it reaches `targetKg`. Needs four training days across three weeks.
  function projection(history, today, targetKg, windowDays) {
    const from = addDays(today, -Math.round(num(windowDays, 28, 730, 84)));
    const pts = (history || []).filter(p => p && p.date >= from && p.date <= today && p.e1rm > 0);
    if (pts.length < 4 || dayDiff(pts[0].date, pts[pts.length - 1].date) < 21) return null;
    const xs = pts.map(p => dayDiff(pts[0].date, p.date)), ys = pts.map(p => p.e1rm), mx = mean(xs), my = mean(ys);
    const sxx = xs.reduce((n, x) => n + (x - mx) ** 2, 0), sxy = xs.reduce((n, x, i) => n + (x - mx) * (ys[i] - my), 0);
    if (!(sxx > 0)) return null;
    const slope = sxy / sxx, now = my + slope * (dayDiff(pts[0].date, today) - mx), perWeek = round(slope * 7, 2);
    const out = { perWeek, now: round(now, 1), points: pts.length, target: null, weeks: null, day: '' };
    const target = Number(targetKg);
    if (perWeek > 0 && target > now) {
      const days = Math.ceil((target - now) / slope);
      if (days <= 365) { out.target = target; out.weeks = Math.max(1, Math.round(days / 7)); out.day = addDays(today, days); }
    }
    return out;
  }

  // Which lifts are moving and which have stalled: the best of the latest three training days
  // against the best of the days before them, inside the window.
  function liftTrends(sessions, today, windowDays) {
    const from = addDays(today, -Math.round(num(windowDays, 28, 365, 84)));
    return exerciseNames(sessions).map(x => {
      const h = exerciseHistory(sessions, x.name).filter(p => p.date >= from && p.date <= today);
      if (h.length < 5) return null;
      const recent = Math.max(...h.slice(-3).map(p => p.e1rm)), earlier = Math.max(...h.slice(0, -3).map(p => p.e1rm));
      const change = pctChange(recent, earlier);
      const status = change >= 2 ? 'rising' : change < -5 ? 'falling' : change <= 0.5 ? 'plateau' : 'steady';
      return { name: x.name, days: h.length, best: recent, change, status };
    }).filter(Boolean).sort((a, b) => b.change - a.change || a.name.localeCompare(b.name));
  }

  const MUSCLE_GROUP_OF = { chest: 'Chest', lats: 'Back', traps: 'Back', back: 'Back', shoulders: 'Shoulders', biceps: 'Arms', triceps: 'Arms', forearms: 'Arms', arms: 'Arms', quadriceps: 'Legs', hamstrings: 'Legs', glutes: 'Legs', calves: 'Legs', legs: 'Legs', abs: 'Core', core: 'Core' };
  const MUSCLE_GROUPS = ['Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core'];
  const PUSH = ['chest', 'shoulders', 'triceps'], PULL = ['lats', 'traps', 'back', 'biceps', 'forearms'];

  // Working sets per muscle group over the last `days` days, plus the push / pull / legs split.
  function muscleBalance(sessions, today, days) {
    const span = Math.round(num(days, 7, 365, 28)), from = addDays(today, -(span - 1));
    const sets = {}, split = { push: 0, pull: 0, legs: 0 };
    MUSCLE_GROUPS.forEach(g => { sets[g] = 0; });
    let total = 0, other = 0;
    validSessions(sessions).forEach(s => {
      if (s.date < from || s.date > today) return;
      s.exercises.forEach(ex => {
        const n = countedSets(ex).length, m = String(ex.muscle || '').trim().toLowerCase(), g = MUSCLE_GROUP_OF[m];
        if (!n) return;
        total += n;
        if (!g) { other += n; return; }
        sets[g] += n;
        if (PUSH.includes(m)) split.push += n; else if (PULL.includes(m)) split.pull += n; else if (g === 'Legs') split.legs += n;
      });
    });
    const groups = MUSCLE_GROUPS.map(group => ({ group, sets: sets[group], perWeek: round(sets[group] / (span / 7), 1) }));
    return { days: span, total, other, groups, split, missing: groups.filter(g => !g.sets).map(g => g.group) };
  }

  // How many weeks in a row volume has gone up, ending with the last finished week. A rise has to be
  // more than 2%: a couple of extra kilos on one lift is not a climbing workload.
  function risingWeeks(series) {
    const done = (series || []).slice(0, -1);
    let n = 0;
    for (let i = done.length - 1; i > 0 && done[i - 1].vol > 0 && done[i].vol > done[i - 1].vol * 1.02; i--) n++;
    return n;
  }

  const WEEKDAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Plain-language observations from the log. They describe what was recorded; they never prescribe.
  function coachInsights(sessions, today, options) {
    const o = options || {}, list = validSessions(sessions), out = [];
    const add = (id, tone, title, detail) => out.push({ id, tone, title, detail });
    if (list.length < 3) {
      add('start', 'info', 'Your coach is warming up', 'Finish ' + (3 - list.length) + ' more workout' + (3 - list.length === 1 ? '' : 's') + ' and this page starts spotting trends, stalled lifts and gaps in your training.');
      return out;
    }
    // The week in progress is left out of comparisons, so a Monday never reads as a drop.
    const series = weeklySeries(list, today, 9, o.weekStart), change = periodChange(series.slice(0, -1)), trends = liftTrends(list, today, 84);
    const climb = risingWeeks(series);
    if (climb >= 4) add('deload', 'warn', 'Volume has climbed ' + climb + ' weeks in a row', 'That is solid progress. Many lifters plan a lighter week after a long run of increases, so the next block starts fresh.');
    else if (change && change.vol.pct !== null) {
      if (change.vol.pct >= 10) add('volume', 'good', 'Training volume is up ' + Math.round(change.vol.pct) + '%', 'The last 4 weeks carried more total work than the 4 before. Keep the increases gradual.');
      else if (change.vol.pct <= -10) add('volume', 'warn', 'Training volume is down ' + Math.abs(Math.round(change.vol.pct)) + '%', 'The last 4 weeks carried less total work than the 4 before. Fine if that was the plan, worth a look if it was not.');
      else add('volume', 'info', 'Training volume is steady', 'The last 4 weeks are within 10% of the 4 before them.');
    }
    trends.filter(t => t.status === 'rising').slice(0, 2).forEach(t => add('rising:' + t.name, 'good', t.name + ' is moving: +' + t.change + '%', 'Your estimated max is up over your last ' + t.days + ' training days on this lift. Whatever you are doing here is working.'));
    trends.filter(t => t.status === 'plateau').slice(-2).forEach(t => add('plateau:' + t.name, 'warn', t.name + ' has levelled off', 'No new best in your last 3 sessions on this lift. Common ways through: a different rep range, one more set, or a lighter week before pushing again.'));
    trends.filter(t => t.status === 'falling').slice(-1).forEach(t => add('falling:' + t.name, 'warn', t.name + ' has dipped ' + Math.abs(t.change) + '%', 'Recent sessions sit below your earlier best. Sleep, food and time between sessions are the usual suspects.'));
    const bal = muscleBalance(list, today, 28), big = Math.max(bal.split.push, bal.split.pull), small = Math.min(bal.split.push, bal.split.pull);
    if (bal.split.push + bal.split.pull >= 20 && big >= small * 1.5) {
      const more = bal.split.push > bal.split.pull ? 'Push' : 'Pull', less = more === 'Push' ? 'pull' : 'push';
      add('split', 'warn', more + ' work outweighs ' + less + ' work', small ? more + ' sets outnumber ' + less + ' sets ' + round(big / small, 1) + ' to 1 over the last 4 weeks.' : 'No ' + less + ' sets were logged in the last 4 weeks.');
    }
    if (bal.total >= 20 && bal.missing.length) add('missing', 'info', 'Not logged lately: ' + bal.missing.join(', '), 'No working sets for ' + (bal.missing.length === 1 ? 'this group' : 'these groups') + ' in the last 4 weeks. Skip this if it is on purpose.');
    const cons = consistency(list, today, 12, o.weeklyGoal, o.weekStart);
    if (cons.weeks >= 3) add('consistency', cons.pct >= 75 ? 'good' : 'info', 'Weekly goal hit ' + cons.hit + ' of the last ' + cons.weeks + ' weeks', cons.pct >= 75 ? 'That is ' + cons.pct + '% of weeks. Consistency like this is what moves the numbers.' : 'Your goal is ' + cons.goal + ' workouts a week. If that feels like a stretch right now, a goal you can hit builds the habit faster.');
    const days = weekdayPattern(list, addDays(today, -83));
    if (days.total >= 8 && days.best !== null) add('weekday', 'info', WEEKDAY_NAMES[days.best] + ' is your strongest habit', days.counts[days.best] + ' of your last ' + days.total + ' workouts landed on a ' + WEEKDAY_NAMES[days.best] + '.');
    return out;
  }

  // ---- Deluxe planner: ready-made programmes and week-by-week progression ----------------------
  const D = ['Day 1 · Monday', 'Day 2 · Tuesday', 'Day 3 · Wednesday', 'Day 4 · Thursday', 'Day 5 · Friday', 'Day 6 · Saturday', 'Day 7 · Sunday'];
  const PUSH_DAY = [['Flat Bench Press', 4, 8], ['Overhead Press', 3, 8], ['Incline Dumbbell Press', 3, 10], ['Lateral Raise', 3, 12], ['Cable Triceps Pushdown', 3, 12]];
  const PULL_DAY = [['Conventional Deadlift', 3, 5], ['Pull-Up', 3, 8], ['Barbell Row', 3, 8], ['Face Pull', 3, 12], ['Barbell Curl', 3, 10]];
  const LEG_DAY = [['Barbell Back Squat', 4, 8], ['Romanian Deadlift', 3, 8], ['Leg Press', 3, 10], ['Seated Leg Curl', 3, 12], ['Standing Calf Raise', 3, 12]];
  const UPPER_DAY = [['Flat Bench Press', 4, 6], ['Barbell Row', 4, 6], ['Overhead Press', 3, 8], ['Lat Pulldown', 3, 10], ['Barbell Curl', 2, 12], ['Cable Triceps Pushdown', 2, 12]];
  const LOWER_DAY = [['Barbell Back Squat', 4, 6], ['Romanian Deadlift', 3, 8], ['Leg Press', 3, 10], ['Seated Leg Curl', 3, 10], ['Standing Calf Raise', 3, 12]];
  const FULL_A = [['Barbell Back Squat', 3, 8], ['Flat Bench Press', 3, 8], ['Barbell Row', 3, 8], ['Plank', 3, 30]];
  const FULL_B = [['Conventional Deadlift', 2, 5], ['Overhead Press', 3, 8], ['Lat Pulldown', 3, 10], ['Hanging Leg Raise', 3, 10]];
  const PLAN_TEMPLATES = [
    { id: 'full3', name: 'Full body', days: 3, weeks: 8, mode: 'weight', blurb: 'Three sessions a week that hit everything. The simplest way to build a base.', plan: [[D[0], FULL_A], [D[2], FULL_B], [D[4], FULL_A]] },
    { id: 'upperlower4', name: 'Upper / Lower', days: 4, weeks: 8, mode: 'weight', blurb: 'Each half of the body twice a week, with room to recover in between.', plan: [[D[0], UPPER_DAY], [D[1], LOWER_DAY], [D[3], UPPER_DAY], [D[4], LOWER_DAY]] },
    { id: 'ppl3', name: 'Push / Pull / Legs', days: 3, weeks: 8, mode: 'reps', blurb: 'One focused day each for pushing, pulling and legs.', plan: [[D[0], PUSH_DAY], [D[2], PULL_DAY], [D[4], LEG_DAY]] },
    { id: 'ppl6', name: 'Push / Pull / Legs ×2', days: 6, weeks: 6, mode: 'reps', blurb: 'The six-day classic: every muscle group twice a week.', plan: [[D[0], PUSH_DAY], [D[1], PULL_DAY], [D[2], LEG_DAY], [D[3], PUSH_DAY], [D[4], PULL_DAY], [D[5], LEG_DAY]] },
    { id: 'strength5x5', name: 'Strength 5×5', days: 3, weeks: 12, mode: 'weight', blurb: 'Few lifts, heavy sets of five, a little more weight every week.', plan: [[D[0], [['Barbell Back Squat', 5, 5], ['Flat Bench Press', 5, 5], ['Barbell Row', 5, 5]]], [D[2], [['Barbell Back Squat', 5, 5], ['Overhead Press', 5, 5], ['Conventional Deadlift', 1, 5]]], [D[4], [['Barbell Back Squat', 5, 5], ['Flat Bench Press', 5, 5], ['Barbell Row', 5, 5]]]] }
  ];
  const PLAN_MODES = ['none', 'weight', 'reps'];

  function sanitizePlanProgram(raw) {
    const src = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
    const weeks = Math.round(num(src.weeks, 0, 16, 0));
    // `adaptive` is on unless explicitly switched off, so plans saved before it existed adapt too.
    return { weeks: weeks >= 2 ? weeks : 0, start: isDay(src.start) ? src.start : '', mode: PLAN_MODES.includes(src.mode) ? src.mode : 'none', stepKg: round(num(src.stepKg, 0, 20, 2.5), 3), deload: !!src.deload, adaptive: src.adaptive !== false };
  }

  // Where `today` falls in a programme. null when the plan has no schedule.
  function planWeek(program, today) {
    const p = sanitizePlanProgram(program);
    if (!p.weeks || !p.start || !isDay(today)) return null;
    const index = Math.floor(dayDiff(p.start, today) / 7);
    if (index < 0) return { week: 0, of: p.weeks, index: 0, upcoming: true, finished: false, deload: false, weekStart: p.start };
    const finished = index >= p.weeks, at = Math.min(index, p.weeks - 1);
    return { week: at + 1, of: p.weeks, index: at, upcoming: false, finished, deload: p.deload && p.weeks >= 4 && at === p.weeks - 1, weekStart: addDays(p.start, 7 * at) };
  }

  // The target for one exercise in a given week. A deload week drops to about 60% of the sets at 90% of the weight.
  function progressedTarget(exercise, program, weekIndex, roundKg) {
    const p = sanitizePlanProgram(program), i = Math.max(0, Math.round(Number(weekIndex) || 0)), unit = Number(roundKg) > 0 ? Number(roundKg) : 0.5;
    const base = { sets: Math.round(num(exercise && exercise.sets, 1, 20, 3)), reps: Math.round(num(exercise && exercise.reps, 1, 100, 8)), kg: num(exercise && exercise.kg, 0, 1000, 0) };
    if (!p.weeks) return base;
    const snap = kg => round(Math.round(kg / unit) * unit, 3);
    if (p.deload && p.weeks >= 4 && i >= p.weeks - 1) return { sets: Math.max(1, Math.ceil(base.sets * 0.6)), reps: base.reps, kg: base.kg > 0 ? snap(base.kg * 0.9) : 0 };
    const step = Math.min(i, p.weeks - 1);
    if (p.mode === 'weight' && base.kg > 0) return { sets: base.sets, reps: base.reps, kg: Math.min(1000, round(base.kg + p.stepKg * step, 3)) };
    if (p.mode === 'reps') return { sets: base.sets, reps: Math.min(100, base.reps + Math.min(step, 4)), kg: base.kg };
    return base;
  }

  // Planned days against the workouts that were logged from this plan.
  function planAdherence(plan, sessions, today) {
    const days = (plan && Array.isArray(plan.days) ? plan.days : []).filter(d => d && (d.exercises || []).length), wk = planWeek(plan && plan.program, today);
    const name = String(plan && plan.name || ''), start = wk ? sanitizePlanProgram(plan.program).start : '';
    const mine = validSessions(sessions).filter(s => s.plan && s.plan.name === name && (!start || s.date >= start) && s.date <= today);
    const weekFrom = wk ? wk.weekStart : addDays(today, -6);
    const thisWeek = days.map(d => ({ day: d.day, done: mine.some(s => s.plan.day === d.day && s.date >= weekFrom) }));
    if (!wk || wk.upcoming) return { done: mine.length, expected: 0, pct: null, thisWeek };
    // The week in progress only counts the days already trained, so the score never dips mid-week.
    const expected = wk.finished ? days.length * wk.of : days.length * wk.index + thisWeek.filter(d => d.done).length, done = Math.min(mine.length, expected);
    return { done, expected, pct: expected ? Math.round(done / expected * 100) : null, thisWeek };
  }


  // ---- DX10: adaptive programme targets ----------------------------------------------------------
  // A programme's calendar says what each week should be. Adaptive targets check that against what was
  // actually lifted the last time this exercise came up in the same plan, so a missed session is repeated
  // instead of piling more weight on top, and two misses in a row step back about 10% to build up again.
  const lowerName = value => String(value || '').trim().toLowerCase();
  // Newest first: [{ date, target: { sets, reps, kg }, sets: [...] }] for one exercise in one plan.
  // Only sessions that recorded the planned target for the exercise count.
  function planExerciseResults(sessions, planName, exerciseName, limit) {
    const plan = String(planName || ''), key = lowerName(exerciseName), max = Math.round(num(limit, 1, 20, 3));
    if (!plan || !key) return [];
    return validSessions(sessions).filter(s => s.plan && s.plan.name === plan)
      .sort((a, b) => b.date.localeCompare(a.date))
      .map(s => {
        const ex = s.exercises.find(e => e && lowerName(e.name) === key && e.target && typeof e.target === 'object');
        return ex ? { date: s.date, target: { sets: Math.round(num(ex.target.sets, 1, 20, 3)), reps: Math.round(num(ex.target.reps, 1, 100, 8)), kg: num(ex.target.kg, 0, 1000, 0) }, sets: Array.isArray(ex.sets) ? ex.sets : [] } : null;
      })
      .filter(Boolean).slice(0, max);
  }
  // How many working sets reached the target weight and reps.
  function targetSetsHit(result) {
    if (!result || !result.target) return 0;
    const t = result.target;
    return (result.sets || []).filter(s => s && s.type !== 'warmup' && Number(s.kg) >= t.kg - 0.01 && Number(s.reps) >= t.reps).length;
  }
  // scheduled: this week's target from progressedTarget. results: from planExerciseResults.
  // options: { mode, stepKg, roundKg, deload, today }.
  // Returns the target plus a structured reason the app turns into a sentence:
  //   schedule — nothing to compare with, so the calendar target stands
  //   progress — every planned set was hit last time; at most one step above what was lifted
  //   hold     — last time fell short, so repeat that target
  //   reset    — two sessions in a row fell short of the same target, so drop about 10% and rebuild
  //   deload   — the planned lighter week
  function adaptiveTarget(scheduled, results, options) {
    const opts = options || {}, unit = Number(opts.roundKg) > 0 ? Number(opts.roundKg) : 0.5, snap = kg => round(Math.round(kg / unit) * unit, 3);
    const base = { sets: Math.round(num(scheduled && scheduled.sets, 1, 20, 3)), reps: Math.round(num(scheduled && scheduled.reps, 1, 100, 8)), kg: num(scheduled && scheduled.kg, 0, 1000, 0) };
    const list = Array.isArray(results) ? results.filter(r => r && r.target) : [];
    const last = list[0], stale = last && isDay(opts.today) && dayDiff(last.date, opts.today) > 42;
    if (opts.deload) return Object.assign({}, base, { action: 'deload', reason: { code: 'deload' } });
    if (!last || stale) return Object.assign({}, base, { action: 'schedule', reason: { code: stale ? 'break' : 'schedule' } });
    const t = last.target, hit = targetSetsHit(last), why = { hit, of: t.sets, reps: t.reps, kg: t.kg, date: last.date };
    if (hit >= t.sets) {
      // One step beyond what was lifted, never past the calendar target.
      const stepKg = opts.mode === 'weight' && t.kg > 0 ? num(opts.stepKg, 0, 20, 2.5) : 0, stepReps = opts.mode === 'reps' ? 1 : 0;
      return { sets: base.sets, reps: Math.min(base.reps, t.reps + stepReps), kg: Math.min(base.kg, round(t.kg + stepKg, 3)), action: 'progress', reason: Object.assign({ code: 'progress' }, why) };
    }
    const prev = list[1], sameTarget = prev && prev.target.kg === t.kg && prev.target.reps === t.reps;
    if (prev && sameTarget && targetSetsHit(prev) < prev.target.sets && t.kg > 0) {
      return { sets: base.sets, reps: t.reps, kg: snap(t.kg * 0.9), action: 'reset', reason: Object.assign({ code: 'reset' }, why) };
    }
    // Repeat what fell short, unless the plan itself now asks for less.
    return { sets: base.sets, reps: Math.min(base.reps, t.reps), kg: Math.min(base.kg, t.kg), action: 'hold', reason: Object.assign({ code: 'hold' }, why) };
  }

  // ---- DX11: adaptive calorie targets ------------------------------------------------------------
  // Maintenance is estimated from what was eaten and what the scale did: a kilogram of body weight is
  // taken as about 7,700 kcal, so intake minus the energy in the weight change is what the body used.
  const KCAL_PER_KG = 7700;
  // Least-squares slope of weight against day number, in kg per day.
  function weightSlope(points) {
    const n = points.length; if (n < 2) return 0;
    const mx = points.reduce((a, p) => a + p.x, 0) / n, my = points.reduce((a, p) => a + p.y, 0) / n;
    const sxx = points.reduce((a, p) => a + (p.x - mx) ** 2, 0); if (!sxx) return 0;
    return points.reduce((a, p) => a + (p.x - mx) * (p.y - my), 0) / sxx;
  }
  // intake: { 'YYYY-MM-DD': kcal } for finished days. weights: { 'YYYY-MM-DD': kg }.
  // Today is left out because its food log is still open. Very low days are treated as unfinished logs.
  function energyBalance(intake, weights, today, options) {
    const opts = options || {}, span = Math.round(num(opts.days, 14, 90, 28)), minKcal = num(opts.minDayKcal, 0, 3000, 800);
    const needFood = Math.round(num(opts.minFoodDays, 7, 60, 14)), needWeighIns = Math.round(num(opts.minWeighIns, 2, 30, 4)), needSpan = Math.round(num(opts.minSpanDays, 7, 60, 14));
    if (!isDay(today)) return { ready: false, foodDays: 0, weighIns: 0, spanDays: 0, needFoodDays: needFood, needWeighIns: needWeighIns, needSpanDays: needSpan };
    const from = addDays(today, -span);
    const foodDays = Object.keys(intake || {}).filter(d => isDay(d) && d >= from && d < today && Number(intake[d]) >= minKcal).sort();
    const weighDays = Object.keys(weights || {}).filter(d => isDay(d) && d >= from && d <= today && Number(weights[d]) >= 20 && Number(weights[d]) <= 400).sort();
    const spanDays = weighDays.length ? dayDiff(weighDays[0], weighDays[weighDays.length - 1]) : 0;
    const out = { ready: false, from, foodDays: foodDays.length, weighIns: weighDays.length, spanDays, needFoodDays: needFood, needWeighIns: needWeighIns, needSpanDays: needSpan };
    if (foodDays.length < needFood || weighDays.length < needWeighIns || spanDays < needSpan) return out;
    const avgIntake = foodDays.reduce((a, d) => a + Number(intake[d]), 0) / foodDays.length;
    const slope = weightSlope(weighDays.map(d => ({ x: dayDiff(from, d), y: Number(weights[d]) })));
    const maintenance = avgIntake - slope * KCAL_PER_KG;
    if (!(maintenance >= 1000 && maintenance <= 6000)) return Object.assign(out, { implausible: true, avgIntake: Math.round(avgIntake), kgPerWeek: round(slope * 7, 2) });
    const confidence = foodDays.length >= 21 && weighDays.length >= 8 ? 'high' : 'medium';
    return Object.assign(out, { ready: true, avgIntake: Math.round(avgIntake), kgPerWeek: round(slope * 7, 2), maintenance: Math.round(maintenance / 10) * 10, confidence });
  }
  const CALORIE_GOALS = ['lose', 'maintain', 'gain'];
  // ratePct: body weight per week, as a percentage. Losing is capped at 1% a week and never more than a
  // 25% deficit or below 1,200 kcal; gaining is capped at 0.5% a week.
  function calorieTarget(maintenance, goal, ratePct, bodyKg) {
    const m = num(maintenance, 1000, 6000, 2000), g = CALORIE_GOALS.includes(goal) ? goal : 'maintain', body = num(bodyKg, 0, 400, 0);
    const rate = g === 'lose' ? num(ratePct, 0, 1, 0.5) : g === 'gain' ? num(ratePct, 0, 0.5, 0.25) : 0;
    let perDay = body > 0 ? rate / 100 * body * KCAL_PER_KG / 7 : 0;
    if (g === 'lose') perDay = -Math.min(perDay, m * 0.25);
    let kcal = Math.round((m + perDay) / 10) * 10;
    if (g === 'lose') kcal = Math.max(1200, kcal);
    return { goal: g, kcal, perDay: kcal - m, kgPerWeek: round((kcal - m) * 7 / KCAL_PER_KG, 2) };
  }
  // Protein from body weight (more while losing), fat at a quarter of energy with a floor, carbs fill the rest.
  function macroTargets(kcal, bodyKg, goal) {
    const k = num(kcal, 800, 8000, 2000), body = num(bodyKg, 0, 400, 0);
    const protein = Math.min(300, body > 0 ? Math.round(body * (goal === 'lose' ? 2 : 1.8)) : Math.round(k * 0.25 / 4));
    const fat = Math.max(body > 0 ? Math.round(body * 0.6) : 0, Math.round(k * 0.25 / 9));
    return { protein, fat, carbs: Math.max(0, Math.round((k - protein * 4 - fat * 9) / 4)) };
  }

  // ---- DX12: one Deluxe tip at a time --------------------------------------------------------------
  // candidates: [{ id, priority }] that apply right now.
  // memory: { dismissed: { id: true }, current: { id, at }, seen: { id: at } }.
  // A tip stays for a day once shown, then nothing new appears until the cooldown has passed, and a tip
  // that was shown in the last two weeks waits its turn behind the others.
  function pickNudge(candidates, memory, now, cooldownMs) {
    const m = memory && typeof memory === 'object' ? memory : {}, dismissed = m.dismissed || {}, seen = m.seen || {}, at = Number(now) || 0;
    const cool = Number.isFinite(Number(cooldownMs)) ? Number(cooldownMs) : 3 * 864e5;
    const open = (Array.isArray(candidates) ? candidates : []).filter(c => c && c.id && !dismissed[c.id]);
    const current = m.current && typeof m.current === 'object' ? m.current : null, since = current ? at - (Number(current.at) || 0) : Infinity;
    if (current && since < 864e5) return open.find(c => c.id === current.id) || null;
    if (current && since < cool) return null;
    return open.filter(c => !(at - (Number(seen[c.id]) || 0) < 14 * 864e5)).sort((a, b) => (Number(b.priority) || 0) - (Number(a.priority) || 0))[0] || null;
  }

  // ---- DX13: friend challenges ---------------------------------------------------------------------
  const CHALLENGE_METRICS = ['workouts', 'volume'];
  // members: [{ user_id, progress, is_private }]. Highest first; ties share a rank; hidden progress goes last.
  function rankChallenge(members, target) {
    const goal = num(target, 0, 1e9, 0), list = Array.isArray(members) ? members : [];
    const shown = list.filter(m => m && m.progress !== null && m.progress !== undefined).sort((a, b) => Number(b.progress) - Number(a.progress));
    let rank = 0, prev = null;
    return shown.map((m, i) => { const p = Number(m.progress) || 0; if (p !== prev) { rank = i + 1; prev = p; } return Object.assign({}, m, { rank, pct: goal > 0 ? Math.min(100, Math.round(p / goal * 100)) : 0, done: goal > 0 && p >= goal }); })
      .concat(list.filter(m => m && (m.progress === null || m.progress === undefined)).map(m => Object.assign({}, m, { rank: null, pct: 0, done: false })));
  }

  root.GymLib = Object.freeze({
    DEFAULT_PLATES_KG, DEFAULT_PLATES_LB, MEASURE_FIELDS, DEFAULT_SUPPLEMENTS, STARTER_ROUTINES,
    platesPerSide, warmupSets, overloadSuggestion, parseQuickAdd, quickAlias, QUICK_ALIASES, moveItem, groupBounds, restDueAfterSet, normaliseGroups,
    sessionTotals, calendarWeeks, monthReport, muscleRecency, weightTrend, storageUse, sanitizeExtras, sanitizeGear, isDay, addDays,
    MUSCLE_GROUPS, REP_TARGETS, PLAN_TEMPLATES, WEEKDAY_NAMES, e1rm, sessionVolume, weeklySeries, periodChange, weekdayPattern, consistency, exerciseHistory, exerciseNames,
    repMaxes, projection, liftTrends, muscleBalance, risingWeeks, coachInsights, sanitizePlanProgram, planWeek, progressedTarget, planAdherence,
    planExerciseResults, targetSetsHit, adaptiveTarget, KCAL_PER_KG, CALORIE_GOALS, energyBalance, calorieTarget, macroTargets, pickNudge, CHALLENGE_METRICS, rankChallenge
  });
})(typeof globalThis !== 'undefined' ? globalThis : this);
