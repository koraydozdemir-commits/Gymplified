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

  root.GymLib = Object.freeze({
    DEFAULT_PLATES_KG, DEFAULT_PLATES_LB, MEASURE_FIELDS, DEFAULT_SUPPLEMENTS, STARTER_ROUTINES,
    platesPerSide, warmupSets, overloadSuggestion, parseQuickAdd, quickAlias, QUICK_ALIASES, moveItem, groupBounds, restDueAfterSet, normaliseGroups,
    sessionTotals, calendarWeeks, monthReport, muscleRecency, weightTrend, storageUse, sanitizeExtras, sanitizeGear, isDay, addDays
  });
})(typeof globalThis !== 'undefined' ? globalThis : this);
