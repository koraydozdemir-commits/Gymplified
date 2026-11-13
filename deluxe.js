// Gymplified Deluxe tools. Loaded after app.js and plus.js, so it can use the app's state and helpers.
// The numbers come from pure functions in lib.js (GymLib); this file turns them into the Deluxe tools
// and into the previews shown before purchase (built from the person's own log once it is big enough).
// Markup here never uses inline handlers or inline styles. Controls name an action with data-dx
// (clicks) or data-dx-change, and only DELUXE_ACTIONS can run.

const DX_TABS = [
  { id: 'analytics', label: 'Analytics', feature: 'Advanced analytics' },
  { id: 'coach', label: 'Coach', feature: 'Smart training insights' },
  { id: 'lab', label: 'Lift lab', feature: 'Performance lab' },
  { id: 'planner', label: 'Planner', feature: 'Workout planner' },
  { id: 'nutrition', label: 'Nutrition', feature: 'Nutrition coach' },
  { id: 'data', label: 'Reports', feature: 'Complete data tools' },
  { id: 'style', label: 'Style', feature: 'Deluxe customisation' }
];
const DX_RANGES = [8, 12, 26, 52];
// Signature themes. `base` picks which of the app's light/dark component rules apply underneath.
const DX_SKINS = [
  { id: '', name: 'Classic', base: '', note: 'Your Settings theme and accent' },
  { id: 'obsidian', name: 'Obsidian', base: 'dark', note: 'True black and gold, easy on OLED screens' },
  { id: 'aurora', name: 'Aurora', base: 'dark', note: 'Deep navy with a mint glow' },
  { id: 'ember', name: 'Ember', base: 'dark', note: 'Warm charcoal and molten orange' },
  { id: 'glacier', name: 'Glacier', base: 'light', note: 'Crisp, cool and bright' }
];
const DX_CONFETTI = [
  { id: 'classic', name: 'Classic', sample: '🎉 ✨ 💪 🔥' },
  { id: 'gold', name: 'Gold rush', sample: '🥇 ✨ 🏆 ⭐' },
  { id: 'power', name: 'Power', sample: '⚡ 💥 🔥 💪' }
];
let dxTab = 'analytics', dxRange = 12, dxLift = '';

// ---------- small helpers ----------
const dxToday = () => dayKey();
const dxWeekStart = () => (weekStartsSunday() ? 'sun' : 'mon');
const dxInt = n => Math.round(Number(n) || 0).toLocaleString();
const dxShortDay = key => { const d = new Date(key + 'T12:00:00'); return Number.isFinite(d.getTime()) ? d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' }) : key; };
const dxLongDay = key => { const d = new Date(key + 'T12:00:00'); return Number.isFinite(d.getTime()) ? d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : key; };
const dxCompact = n => { const v = Math.abs(n); return v >= 1e6 ? (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M' : v >= 1e5 ? Math.round(n / 1e3) + 'k' : v >= 1e3 ? (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'k' : String(Math.round(n)); };
const dxNiceMax = v => { if (!(v > 0)) return 1; const p = 10 ** Math.floor(Math.log10(v)), m = v / p; return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 2.5 ? 2.5 : m <= 5 ? 5 : 10) * p; };
function dxSessions() { return (Array.isArray(state.sessions) ? state.sessions : []).filter(s => s && Array.isArray(s.exercises)); }
function dxBodyKg() { const log = (state.extras && state.extras.bodyLog) || {}, days = Object.keys(log).sort(); return days.length ? Number(log[days[days.length - 1]]) || 0 : 0; }
function dxContext() { return { sessions: dxSessions(), today: dxToday(), weekStart: dxWeekStart(), weeklyGoal: state.weeklyGoal, bodyKg: dxBodyKg(), sample: false }; }
function dxDelta(pct, quiet) {
  if (pct === null || pct === undefined || !Number.isFinite(pct)) return '<span class="dx-delta flat">new</span>';
  const r = Math.round(pct), dir = r > 0 ? 'up' : r < 0 ? 'down' : 'flat';
  return '<span class="dx-delta ' + (quiet ? 'flat' : dir) + '"><span aria-hidden="true">' + (r > 0 ? '▲' : r < 0 ? '▼' : '●') + ' ' + Math.abs(r) + '%</span><span class="sr">' + (r > 0 ? 'up ' : r < 0 ? 'down ' : 'no change, ') + Math.abs(r) + ' percent on the period before</span></span>';
}
function dxTile(label, value, extra) { return '<div class="dx-tile"><div class="eyebrow">' + esc(label) + '</div><div class="dx-tile-num">' + value + '</div><div class="dx-tile-sub">' + (extra || '') + '</div></div>'; }
function dxEmpty(title, text) { return '<div class="dx-empty"><strong>' + esc(title) + '</strong><p class="sub">' + esc(text) + '</p></div>'; }
function dxTable(caption, head, rows) {
  return '<details class="dx-details"><summary>Show as a table</summary><div class="dx-scroll"><table class="deluxe-table"><caption class="sr">' + esc(caption) + '</caption><thead><tr>' + head.map(h => '<th scope="col">' + esc(h) + '</th>').join('') + '</tr></thead><tbody>' +
    rows.map(r => '<tr>' + r.map(c => '<td>' + esc(c) + '</td>').join('') + '</tr>').join('') + '</tbody></table></div></details>';
}

// ---------- charts (inline SVG, sized by viewBox, coloured by CSS) ----------
// Phones get a narrower drawing so axis text stays readable once the chart is scaled to the screen.
const dxNarrow = () => window.innerWidth < 600;
function dxVolumeChart(series, today) {
  const narrow = dxNarrow(), W = narrow ? 360 : 640, H = narrow ? 220 : 240, L = narrow ? 36 : 46, R = 10, T = 14, B = 28, iw = W - L - R, ih = H - T - B, n = series.length;
  const disp = kg => kgToDisplay(kg, 0), max = dxNiceMax(Math.max(1, ...series.map(w => Math.max(disp(w.vol), disp(w.avg)))));
  const band = iw / n, bw = Math.max(3, Math.min(34, band * 0.66)), cx = i => L + band * (i + 0.5), y = v => T + ih - v / max * ih;
  const nowWeek = GymLib.weeklySeries([], today, 1, dxWeekStart())[0].week, every = Math.max(1, Math.ceil(n / (narrow ? 4 : 6)));
  let grid = '', bars = '', labels = '';
  [0, 0.5, 1].forEach(f => { const gy = y(max * f); grid += '<line class="dx-grid" x1="' + L + '" x2="' + (W - R) + '" y1="' + gy.toFixed(1) + '" y2="' + gy.toFixed(1) + '"/><text class="dx-axis" x="' + (L - 6) + '" y="' + (gy + 4).toFixed(1) + '" text-anchor="end">' + dxCompact(max * f) + '</text>'; });
  series.forEach((w, i) => {
    const v = disp(w.vol), h = v > 0 ? Math.max(2, v / max * ih) : 0, tip = 'Week of ' + dxShortDay(w.week) + ': ' + fmtVolume(w.vol) + ' · ' + plural(w.workouts, 'workout') + ' · 4-week average ' + fmtVolume(w.avg) + (w.week === nowWeek ? ' · in progress' : '');
    bars += '<g class="dx-pt" data-tip="' + esc(tip) + '"><rect class="dx-hit" x="' + (L + band * i).toFixed(1) + '" y="' + T + '" width="' + band.toFixed(1) + '" height="' + ih + '"/>' +
      '<rect class="dx-bar' + (w.week === nowWeek ? ' dx-bar-now' : '') + '" x="' + (cx(i) - bw / 2).toFixed(1) + '" y="' + (T + ih - h).toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + h.toFixed(1) + '" rx="3"/></g>';
    if (i % every === 0) labels += '<text class="dx-axis" x="' + cx(i).toFixed(1) + '" y="' + (H - 8) + '" text-anchor="middle">' + esc(dxShortDay(w.week)) + '</text>';
  });
  const line = series.map((w, i) => (i ? 'L' : 'M') + cx(i).toFixed(1) + ' ' + y(disp(w.avg)).toFixed(1)).join(' ');
  const total = series.reduce((a, w) => a + w.vol, 0);
  return '<svg class="dx-chart" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Weekly training volume for the last ' + n + ' weeks, ' + esc(fmtVolume(total)) + ' in total, with a 4-week average line. The table below has every value.">' + grid + bars + '<path class="dx-line" d="' + line + '"/>' + labels + '</svg>';
}
function dxLineChart(history, proj, today) {
  const narrow = dxNarrow(), W = narrow ? 360 : 640, H = narrow ? 230 : 250, L = narrow ? 36 : 46, R = 14, T = 16, B = 28, iw = W - L - R, ih = H - T - B;
  const first = history[0].date, showProj = !!(proj && proj.day && proj.weeks <= 26), last = showProj ? proj.day : (today > history[history.length - 1].date ? today : history[history.length - 1].date);
  const span = Math.max(1, (new Date(last + 'T12:00:00') - new Date(first + 'T12:00:00')) / 864e5), days = d => (new Date(d + 'T12:00:00') - new Date(first + 'T12:00:00')) / 864e5;
  const disp = kg => kgToDisplay(kg, 1), vals = history.map(p => disp(p.e1rm)).concat(showProj ? [disp(proj.target)] : []);
  let lo = Math.min(...vals), hi = Math.max(...vals); const pad = Math.max(1, (hi - lo) * 0.12); lo = Math.max(0, lo - pad); hi += pad;
  const x = d => L + days(d) / span * iw, y = v => T + ih - (v - lo) / (hi - lo) * ih;
  let grid = '', dots = '', best = 0;
  [0, 0.5, 1].forEach(f => { const v = lo + (hi - lo) * f, gy = y(v); grid += '<line class="dx-grid" x1="' + L + '" x2="' + (W - R) + '" y1="' + gy.toFixed(1) + '" y2="' + gy.toFixed(1) + '"/><text class="dx-axis" x="' + (L - 6) + '" y="' + (gy + 4).toFixed(1) + '" text-anchor="end">' + Math.round(v) + '</text>'; });
  const path = history.map((p, i) => (i ? 'L' : 'M') + x(p.date).toFixed(1) + ' ' + y(disp(p.e1rm)).toFixed(1)).join(' ');
  const dense = history.length > 70;
  history.forEach(p => {
    const record = p.e1rm > best; if (record) best = p.e1rm;
    if (dense && !record) return;
    const tip = dxLongDay(p.date) + ': ' + fmtWeight(p.kg, 2) + ' × ' + p.reps + ' · estimated max ' + fmtWeight(p.e1rm) + (record ? ' · new best' : '');
    dots += '<g class="dx-pt" data-tip="' + esc(tip) + '"><circle class="dx-hit" cx="' + x(p.date).toFixed(1) + '" cy="' + y(disp(p.e1rm)).toFixed(1) + '" r="12"/><circle class="dx-dot' + (record ? ' dx-dot-pr' : '') + '" cx="' + x(p.date).toFixed(1) + '" cy="' + y(disp(p.e1rm)).toFixed(1) + '" r="' + (record ? 4.5 : 3) + '"/></g>';
  });
  const forecast = showProj ? '<path class="dx-forecast" d="M' + x(today).toFixed(1) + ' ' + y(disp(proj.now)).toFixed(1) + ' L' + x(proj.day).toFixed(1) + ' ' + y(disp(proj.target)).toFixed(1) + '"/><circle class="dx-goal" cx="' + x(proj.day).toFixed(1) + '" cy="' + y(disp(proj.target)).toFixed(1) + '" r="5"/>' : '';
  const labels = [first, last].map((d, i) => '<text class="dx-axis" x="' + (i ? W - R : L) + '" y="' + (H - 8) + '" text-anchor="' + (i ? 'end' : 'start') + '">' + esc(dxLongDay(d)) + '</text>').join('');
  return '<svg class="dx-chart" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Estimated one-rep max over ' + history.length + ' training days, from ' + esc(fmtWeight(history[0].e1rm)) + ' to ' + esc(fmtWeight(history[history.length - 1].e1rm)) + '. Gold dots are new bests' + (showProj ? ', and the dashed line is the projection' : '') + '.">' + grid + '<path class="dx-line dx-line-main" d="' + path + '"/>' + forecast + dots + labels + '</svg>';
}
function dxRadar(groups) {
  const S = 280, c = S / 2, rad = 86, n = groups.length, max = Math.max(1, ...groups.map(g => g.sets));
  const pt = (i, f) => { const a = -Math.PI / 2 + i * 2 * Math.PI / n; return [c + Math.cos(a) * rad * f, c + Math.sin(a) * rad * f]; };
  const poly = f => groups.map((g, i) => pt(i, typeof f === 'function' ? f(g) : f).map(v => v.toFixed(1)).join(',')).join(' ');
  const rings = [1 / 3, 2 / 3, 1].map(f => '<polygon class="dx-ring" points="' + poly(f) + '"/>').join('');
  const spokes = groups.map((g, i) => { const [x, y] = pt(i, 1); return '<line class="dx-ring" x1="' + c + '" y1="' + c + '" x2="' + x.toFixed(1) + '" y2="' + y.toFixed(1) + '"/>'; }).join('');
  const labels = groups.map((g, i) => { const [x, y] = pt(i, 1.24); return '<text class="dx-axis dx-radar-label" x="' + x.toFixed(1) + '" y="' + (y + 4).toFixed(1) + '" text-anchor="' + (Math.abs(x - c) < 8 ? 'middle' : x > c ? 'start' : 'end') + '">' + esc(g.group) + '</text>'; }).join('');
  return '<svg class="dx-radar" viewBox="0 0 ' + S + ' ' + S + '" role="img" aria-label="Muscle balance: ' + esc(groups.map(g => g.group + ' ' + g.sets + ' sets').join(', ')) + '.">' + rings + spokes + '<polygon class="dx-area" points="' + poly(g => Math.max(0.04, g.sets / max)) + '"/>' + labels + '</svg>';
}

// ---------- Advanced analytics ----------
// Where the work went in the chosen range: the top lifts by volume, with their share of the total.
function dxVolumeSplitMarkup(ctx, from) {
  const split = GymLib.volumeByExercise(ctx.sessions, from, ctx.today, 6);
  if (!split.total) return '<p class="sub">No working sets in this period yet.</p>';
  const top = Math.max(1, ...split.rows.map(l => l.vol));
  return split.rows.map(l => '<div class="dx-row"><div class="meta-row"><strong>' + esc(l.name) + '</strong><span>' + esc(fmtVolume(l.vol)) + ' · ' + Math.round(l.share) + '%</span></div><div class="progress-bar"><i data-w="' + (l.vol / top * 100) + '"></i></div></div>').join('') +
    (split.other ? '<p class="sub">' + esc(plural(split.other.count, 'other exercise')) + ' make up the remaining ' + Math.round(split.other.share) + '%.</p>' : '');
}
// All-time records, from the whole log rather than the chosen range.
function dxHighlightsMarkup(ctx) {
  const h = GymLib.trainingHighlights(ctx.sessions, ctx.today, ctx.weekStart, ctx.weeklyGoal);
  const item = (icon, value, label) => '<li><span class="dx-hl-icon" aria-hidden="true">' + icon + '</span><strong>' + esc(value) + '</strong><span class="sub">' + esc(label) + '</span></li>';
  return '<ul class="dx-highlights">' +
    (h.bestWeek ? item('🏔️', fmtVolume(h.bestWeek.vol), 'Biggest week · week of ' + dxLongDay(h.bestWeek.week) + ' · ' + plural(h.bestWeek.workouts, 'workout')) : '') +
    (h.bestSession ? item('💥', fmtVolume(h.bestSession.vol), 'Biggest session · ' + dxLongDay(h.bestSession.date)) : '') +
    (h.longestSession ? item('⏱️', h.longestSession.mins + ' min', 'Longest session · ' + dxLongDay(h.longestSession.date)) : '') +
    (h.bestMonth ? item('📅', plural(h.bestMonth.workouts, 'workout'), 'Busiest month · ' + fmtMonth(h.bestMonth.month)) : '') +
    item('🔥', plural(h.streak.best, 'week'), 'Longest weekly-goal streak at ' + h.streak.goal + ' a week' + (h.streak.current ? ' · ' + (h.streak.current === h.streak.best ? 'still going' : 'now on ' + h.streak.current) : '')) +
    item('🏋️', fmtVolume(h.volume), 'Lifted in total · ' + plural(h.workouts, 'workout') + ' since ' + dxLongDay(h.firstDate)) + '</ul>';
}
function dxAnalyticsMarkup(ctx, range) {
  if (!ctx.sessions.length) return dxEmpty('Your analytics start with your first finished workout', 'Volume trends, training rhythm and consistency are all built from the workouts you log.');
  const all = GymLib.weeklySeries(ctx.sessions, ctx.today, range * 2, ctx.weekStart), series = all.slice(-range), change = GymLib.periodChange(all);
  const from = series[0].week, inRange = ctx.sessions.filter(s => s.date >= from && s.date <= ctx.today), prs = inRange.reduce((n, s) => n + (Array.isArray(s.prs) ? s.prs.length : 0), 0);
  const days = GymLib.weekdayPattern(ctx.sessions, from), cons = GymLib.consistency(ctx.sessions, ctx.today, 12, ctx.weeklyGoal, ctx.weekStart);
  const recent = GymLib.weeklySeries(ctx.sessions, ctx.today, 12, ctx.weekStart), goal = cons.goal, dayMax = Math.max(1, ...days.counts);
  const controls = ctx.sample ? '' : '<div class="row-wrap dx-range" role="group" aria-label="Time range">' + DX_RANGES.map(r => '<button type="button" class="btn range-btn" data-dx="setRange" data-arg="' + r + '" aria-pressed="' + (r === range) + '">' + (r === 52 ? '1 year' : r + ' weeks') + '</button>').join('') + '</div>';
  return controls +
    '<div class="dx-tiles">' +
      dxTile('Volume', esc(fmtVolume(change.vol.now)), dxDelta(change.vol.pct) + ' <span>vs the ' + range + ' weeks before</span>') +
      dxTile('Workouts', dxInt(change.workouts.now), dxDelta(change.workouts.pct) + ' <span>' + (change.workouts.now / range).toFixed(1) + ' a week</span>') +
      dxTile('Average session', change.length.now ? change.length.now + ' min' : '—', dxDelta(change.length.pct, true) + ' <span>' + dxInt(change.sets.now) + ' working sets</span>') +
      dxTile('Personal bests', dxInt(prs), '<span>set in this period</span>') +
    '</div>' +
    '<div class="panel dx-block"><div class="section-title"><span>Weekly volume</span><span class="dx-legend"><i class="dx-key dx-key-bar" aria-hidden="true"></i>Week <i class="dx-key dx-key-line" aria-hidden="true"></i>4-week average</span></div>' +
      dxVolumeChart(series, ctx.today) + '<p class="dx-readout" data-default="Hover or tap a bar for that week’s numbers." aria-hidden="true">Hover or tap a bar for that week’s numbers.</p>' +
      dxTable('Weekly training volume', ['Week of', 'Volume', 'Workouts', 'Sets', '4-week average'], series.map(w => [dxLongDay(w.week), fmtVolume(w.vol), String(w.workouts), String(w.sets), fmtVolume(w.avg)])) + '</div>' +
    '<div class="dx-two">' +
      '<div class="panel dx-block"><div class="section-title"><span>Where your volume goes</span><span class="sub">' + (range === 52 ? 'LAST YEAR' : 'LAST ' + range + ' WEEKS') + '</span></div>' + dxVolumeSplitMarkup(ctx, from) + '</div>' +
      '<div class="panel dx-block"><div class="section-title"><span>All-time highlights</span><span class="sub">YOUR WHOLE LOG</span></div>' + dxHighlightsMarkup(ctx) + '</div>' +
    '</div>' +
    '<div class="dx-two">' +
      '<div class="panel dx-block"><div class="section-title"><span>Your training rhythm</span></div><div class="dx-days" role="img" aria-label="Workouts by weekday: ' + esc(days.counts.map((c, i) => GymLib.WEEKDAY_NAMES[i] + ' ' + c).join(', ')) + '.">' +
        days.counts.map((c, i) => '<div class="dx-day' + (i === days.best ? ' is-best' : '') + '"><span class="dx-day-num">' + c + '</span><span class="dx-day-col"><i data-h="' + (c / dayMax * 100) + '"></i></span><span class="dx-day-name">' + GymLib.WEEKDAY_NAMES[i].slice(0, 3) + '</span></div>').join('') + '</div>' +
        '<p class="sub">' + (days.best === null ? 'No workouts in this period yet.' : esc(GymLib.WEEKDAY_NAMES[days.best]) + ' is your most-trained day in this period.') + '</p></div>' +
      '<div class="panel dx-block"><div class="section-title"><span>Consistency</span><span class="sub">GOAL: ' + goal + ' A WEEK</span></div><div class="dx-score"><span class="dx-score-num">' + (cons.weeks ? cons.pct + '%' : '—') + '</span><span class="sub">' + (cons.weeks ? 'of the last ' + plural(cons.weeks, 'finished week') + ' reached your goal' : 'Finish your first full week to see this') + '</span></div>' +
        '<div class="dx-weeks" role="img" aria-label="Last 12 weeks: ' + esc(recent.map(w => w.workouts + ' workouts').join(', ')) + '.">' + recent.map((w, i) => '<span class="dx-week' + (w.workouts >= goal ? ' is-hit' : i === recent.length - 1 ? ' is-now' : w.workouts ? ' is-part' : '') + '" title="Week of ' + esc(dxShortDay(w.week)) + ': ' + esc(plural(w.workouts, 'workout')) + '">' + w.workouts + '</span>').join('') + '</div>' +
        '<p class="sub">Each box is a week, oldest first. Filled boxes reached your goal.</p></div>' +
    '</div>';
}

// ---------- Smart training insights ("Coach") ----------
const DX_TONE = { good: ['▲', 'Going well'], warn: ['◆', 'Worth a look'], info: ['●', 'Good to know'] };
const DX_STATUS = { rising: 'Rising', steady: 'Steady', plateau: 'Levelled off', falling: 'Dipped' };
function dxSetChip(perWeek) {
  const status = GymLib.setRangeStatus(perWeek);
  return status === 'low' ? '<span class="dx-chip is-low">Light</span>' : status === 'in' ? '<span class="dx-chip is-in">✓ ' + GymLib.WEEKLY_SET_MIN + '+ a week</span>' : '';
}
function dxCoachMarkup(ctx) {
  const insights = GymLib.coachInsights(ctx.sessions, ctx.today, { weekStart: ctx.weekStart, weeklyGoal: ctx.weeklyGoal });
  // An own-log preview shows the first two notes and says how many more there are.
  const shown = ctx.mine ? insights.slice(0, 2) : insights, more = insights.length - shown.length;
  const cards = '<div class="dx-insights">' + shown.map(x => '<article class="dx-insight is-' + x.tone + '"><span class="dx-insight-tag"><span aria-hidden="true">' + DX_TONE[x.tone][0] + ' </span>' + DX_TONE[x.tone][1] + '</span><h3>' + esc(x.title) + '</h3><p>' + esc(x.detail) + '</p></article>').join('') + '</div>' +
    (more > 0 ? '<p class="dx-locked"><span aria-hidden="true">🔒 </span>' + esc(plural(more, 'more note')) + ' about your training unlock with Deluxe.</p>' : '');
  if (ctx.sessions.length < 3) return cards;
  const bal = GymLib.muscleBalance(ctx.sessions, ctx.today, 28), trends = GymLib.liftTrends(ctx.sessions, ctx.today, 84), splitTotal = bal.split.push + bal.split.pull + bal.split.legs, top = Math.max(1, ...bal.groups.map(g => g.sets));
  const split = splitTotal ? '<div class="dx-split" role="img" aria-label="Push ' + bal.split.push + ' sets, pull ' + bal.split.pull + ' sets, legs ' + bal.split.legs + ' sets.">' + ['push', 'pull', 'legs'].map(k => '<span class="dx-split-' + k + '" data-w="' + (bal.split[k] / splitTotal * 100) + '"></span>').join('') + '</div>' +
    '<div class="dx-split-key">' + ['push', 'pull', 'legs'].map(k => '<span><i class="dx-key dx-split-' + k + '" aria-hidden="true"></i>' + cap(k) + ' ' + Math.round(bal.split[k] / splitTotal * 100) + '%</span>').join('') + '</div>' : '';
  return cards +
    '<div class="dx-two">' +
      '<div class="panel dx-block"><div class="section-title"><span>Muscle balance</span><span class="sub">LAST 4 WEEKS</span></div>' + (bal.total ? dxRadar(bal.groups) + split : '<p class="sub">No working sets logged in the last 4 weeks.</p>') + '</div>' +
      '<div class="panel dx-block"><div class="section-title"><span>Sets per week</span><span class="sub">BY MUSCLE GROUP</span></div>' + bal.groups.map(g => '<div class="dx-row"><div class="meta-row"><strong>' + esc(g.group) + dxSetChip(g.perWeek) + '</strong><span>' + g.perWeek + ' a week · ' + g.sets + ' total</span></div><div class="progress-bar"><i data-w="' + (g.sets / top * 100) + '"></i></div></div>').join('') +
        '<p class="sub">' + GymLib.WEEKLY_SET_MIN + ' or more working sets a week per muscle group is a common target for growth, and under ' + GymLib.WEEKLY_SET_LIGHT + ' is light. A general guide, not a prescription.</p>' +
        (bal.other ? '<p class="sub">' + plural(bal.other, 'set') + ' from exercises without a muscle group are not shown.</p>' : '') + '</div>' +
    '</div>' +
    '<div class="panel dx-block"><div class="section-title"><span>Lift momentum</span><span class="sub">LAST 12 WEEKS</span></div>' + (trends.length
      ? '<ul class="plain-list dx-lifts">' + trends.map(t => '<li><span class="dx-lift-name">' + esc(t.name) + '</span><span class="dx-chip is-' + t.status + '">' + DX_STATUS[t.status] + '</span><span class="dx-lift-num">' + (t.change > 0 ? '+' : '') + t.change + '%</span><span class="sub">est. max ' + esc(fmtWeight(t.best)) + '</span></li>').join('') + '</ul>'
      : '<p class="sub">Train a lift on five different days and it shows up here with its trend.</p>') + '</div>' +
    '<p class="sub dx-foot">These notes describe what you logged. They are not medical, injury or coaching advice.</p>';
}

// ---------- Performance lab ("Lift lab") ----------
function dxMilestoneKg(bestKg) { const lb = weightUnit() === 'lb', step = lb ? 10 : 5, shown = kgToDisplay(bestKg, 1), next = (Math.floor(shown / step + 1e-9) + 1) * step; return displayToKg(next); }
// Strength goals: one target per lift, kept in state.deluxe.goals and judged by GymLib.goalProgress.
const DX_GOAL_STATUS = { done: '✓ Reached', ontrack: 'On track', behind: 'Behind pace', overdue: 'Past its date', open: 'In progress' };
function dxGoals() { state.deluxe = state.deluxe || {}; if (!Array.isArray(state.deluxe.goals)) state.deluxe.goals = []; return state.deluxe.goals; }
function dxGoalFor(name) { const key = String(name || '').trim().toLowerCase(); return dxGoals().find(goal => goal.name.toLowerCase() === key) || null; }
function dxCurrentLift(ctx) { const names = GymLib.exerciseNames(ctx.sessions); return names.find(n => n.name === dxLift) || names[0] || null; }
function dxGoalSentence(p) {
  if (p.done) return 'Reached on ' + dxLongDay(p.reachedOn) + '. Raise the target whenever you are ready for the next one.';
  const bits = [];
  if (p.eta) bits.push('At your current pace of +' + fmtWeight(p.perWeek, 2) + ' a week, you get there around ' + dxLongDay(p.eta) + '.');
  else if (p.perWeek === null) bits.push('Log this lift on four days across three weeks and a finish date appears here.');
  else if (p.perWeek <= 0) bits.push('This lift has been flat lately, so there is no finish date yet.');
  else bits.push('At the current pace there is no finish date within a year yet.');
  if (p.by && p.daysLeft < 0) bits.push('Your date of ' + dxLongDay(p.by) + ' has passed. Move it, or keep going.');
  else if (p.by && p.needPerWeek !== null) bits.push('To make ' + dxLongDay(p.by) + ' you need about +' + fmtWeight(p.needPerWeek, 2) + ' a week.');
  else if (p.by) bits.push('Your date is today.');
  return bits.join(' ');
}
function dxGoalBar(p) { return '<div class="progress-bar dx-goal-bar' + (p.done ? ' is-done' : '') + '" role="img" aria-label="' + p.pct + ' percent of the way to the goal"><i data-w="' + p.pct + '"></i></div>'; }
function dxGoalMarkup(ctx, lift, history, best, milestone) {
  // Previews show a worked example: the next milestone as the target, counted from the first logged day.
  const goal = ctx.sample ? { name: lift.name, targetKg: milestone, startKg: history[0].e1rm, createdAt: history[0].date, by: '' } : dxGoalFor(lift.name);
  const p = goal ? GymLib.goalProgress(goal, history, ctx.today) : null, unit = weightUnit();
  const head = p
    ? '<div class="dx-goal-head"><span class="dx-goal-num">' + esc(fmtWeight(p.current)) + ' <small>of ' + esc(fmtWeight(p.target)) + ' estimated max</small></span><span class="sub">' + p.pct + '%' + (p.done ? '' : ' · ' + esc(fmtWeight(p.remaining)) + ' to go') + '</span></div>' + dxGoalBar(p) + '<p class="dx-goal-note">' + esc(dxGoalSentence(p)) + '</p>'
    : '<p class="sub">Pick a number for this lift. The lab tracks every session against it and tells you honestly when you will get there.</p>';
  const form = ctx.sample ? '' : '<div class="dx-goal-form"><div class="field"><label for="dxGoalTarget">Target estimated max (' + unit + ')</label><input id="dxGoalTarget" type="number" inputmode="decimal" min="1" max="' + kgToDisplay(1000, 0) + '" step="0.5" value="' + kgToDisplay(goal ? goal.targetKg : milestone, 1) + '"></div>' +
    '<div class="field"><label for="dxGoalBy">Reach it by (optional)</label><input id="dxGoalBy" type="date" min="' + GymLib.addDays(ctx.today, 1) + '" value="' + esc(goal && goal.by > ctx.today ? goal.by : '') + '"></div>' +
    '<div class="row-wrap"><button type="button" class="btn btn-primary" data-dx="saveGoal">' + (goal ? 'Update goal' : 'Set goal') + '</button>' + (goal ? '<button type="button" class="btn" data-dx="removeGoal">Remove</button>' : '') + '</div></div>';
  return '<div class="panel dx-block"><div class="section-title"><span>Strength goal</span>' + (p ? '<span class="dx-chip is-' + p.status + '">' + DX_GOAL_STATUS[p.status] + '</span>' : ctx.sample ? '' : '<span class="sub">NOT SET</span>') + '</div>' + head + form + '</div>';
}
// Every goal at a glance. Shown once there is a goal on a lift other than the one on screen.
function dxGoalListMarkup(ctx, lift) {
  const goals = dxGoals(); if (ctx.sample || !goals.some(goal => goal.name.toLowerCase() !== lift.name.toLowerCase())) return '';
  return '<div class="panel dx-block"><div class="section-title"><span>Your goals</span><span class="sub">' + goals.length + ' OF ' + GymLib.GOAL_LIMIT + '</span></div><ul class="dx-goals">' + goals.map((goal, i) => {
    const p = GymLib.goalProgress(goal, GymLib.exerciseHistory(ctx.sessions, goal.name), ctx.today), here = goal.name.toLowerCase() === lift.name.toLowerCase();
    return '<li><button type="button" class="dx-goal-item" data-dx="openGoal" data-arg="' + i + '" aria-current="' + here + '"><strong>' + esc(goal.name) + '</strong><span class="dx-chip is-' + p.status + '">' + DX_GOAL_STATUS[p.status] + '</span>' +
      '<span class="sub">' + esc(fmtWeight(p.current)) + ' of ' + esc(fmtWeight(p.target)) + (goal.by && !p.done ? ' · by ' + esc(dxLongDay(goal.by)) : '') + '</span>' + dxGoalBar(p) + '</button></li>';
  }).join('') + '</ul></div>';
}
function saveGoal() {
  const ctx = dxContext(), lift = dxCurrentLift(ctx), input = $('dxGoalTarget'), byInput = $('dxGoalBy'); if (!lift || !input) return;
  const shown = Number(input.value), targetKg = Math.round(displayToKg(shown) * 100) / 100, by = (byInput && byInput.value) || '', best = GymLib.repMaxes(ctx.sessions, lift.name).best;
  if (!(shown > 0) || targetKg > 1000) { showToast('Enter the weight you are aiming for'); input.focus(); return; }
  if (by && (!GymLib.isDay(by) || by <= ctx.today)) { showToast('Pick a date after today, or leave it empty'); byInput.focus(); return; }
  const goals = dxGoals(), old = dxGoalFor(lift.name);
  // A target at or below the best is only allowed while it is the goal that was already reached.
  if (targetKg <= best && !(old && old.targetKg === targetKg)) { showToast('Aim above your current best of ' + fmtWeight(best)); input.focus(); return; }
  if (!old && goals.length >= GymLib.GOAL_LIMIT) return showToast('You can keep up to ' + GymLib.GOAL_LIMIT + ' goals. Remove one first.');
  if (old) {
    const reached = GymLib.goalProgress(old, GymLib.exerciseHistory(ctx.sessions, lift.name), ctx.today).done;
    // Raising a reached goal starts a fresh climb from today's best.
    if (reached && targetKg > old.targetKg) { old.startKg = Math.round(best * 100) / 100; old.createdAt = ctx.today; }
    old.targetKg = targetKg; old.by = by;
  } else goals.push({ id: newRecordId('goal'), name: lift.name, targetKg, startKg: Math.round(best * 100) / 100, createdAt: ctx.today, by });
  saveState(); renderDeluxeTools(deluxeEnabled());
  showToast((old ? 'Goal updated: ' : 'Goal set: ') + lift.name + ' to ' + fmtWeight(targetKg));
}
function dxDropGoal(goal, message) {
  const goals = dxGoals(), i = goals.indexOf(goal); if (i < 0) return;
  goals.splice(i, 1); saveState(); renderDeluxeTools(deluxeEnabled());
  showToast(message, { actionLabel: 'Undo', onAction: () => { if (!dxGoalFor(goal.name)) { dxGoals().splice(Math.min(i, dxGoals().length), 0, goal); saveState(); renderDeluxeTools(deluxeEnabled()); } } });
}
function removeGoal() { const lift = dxCurrentLift(dxContext()), goal = lift && dxGoalFor(lift.name); if (goal) dxDropGoal(goal, 'Goal removed'); }
function openGoal(i) {
  const goal = dxGoals()[i]; if (!goal) return;
  if (!GymLib.exerciseHistory(dxSessions(), goal.name).length) return dxDropGoal(goal, 'No sessions left for ' + goal.name + ', so its goal was removed');
  dxLift = GymLib.exerciseNames(dxSessions()).find(n => n.name.toLowerCase() === goal.name.toLowerCase()).name; renderDeluxeTools(deluxeEnabled());
  $('dxLiftSelect')?.focus();
}
function dxTrainingWeightsMarkup(best) {
  const lb = weightUnit() === 'lb', rows = GymLib.trainingWeights(best, lb ? 5 * KG_PER_LB : 2.5);
  return '<div class="panel dx-block"><div class="section-title"><span>Training weights</span><span class="sub">FROM YOUR BEST</span></div><div class="dx-scroll"><table class="deluxe-table"><caption class="sr">Working weights at each intensity</caption><thead><tr><th scope="col">Intensity</th><th scope="col">Weight</th><th scope="col">About</th><th scope="col">Good for</th></tr></thead><tbody>' +
    rows.map(r => '<tr><th scope="row">' + r.pct + '%</th><td>' + esc(fmtWeight(r.kg, 1)) + '</td><td>' + esc(plural(r.reps, 'rep')) + '</td><td>' + esc(r.use) + '</td></tr>').join('') +
    '</tbody></table></div><p class="sub">Percentages of your best estimated max, rounded to the nearest ' + (lb ? '5 lb' : '2.5 kg') + '. The rep counts are the most the formula predicts at that weight, so stop a rep or two short on most sets.</p></div>';
}
function dxLabMarkup(ctx, liftName) {
  const names = GymLib.exerciseNames(ctx.sessions);
  if (!names.length) return dxEmpty('The lab opens with your first logged lift', 'Every exercise you finish gets its own strength curve, rep-max table and projection.');
  const lift = names.find(n => n.name === liftName) || names[0], history = GymLib.exerciseHistory(ctx.sessions, lift.name), maxes = GymLib.repMaxes(ctx.sessions, lift.name);
  const best = maxes.best, first = history[0].e1rm, pace = GymLib.projection(history, ctx.today, 0, 84), gain = best - first;
  // The next round number above both the best set and where the trend line already sits.
  const target = dxMilestoneKg(Math.max(best, pace ? pace.now : 0)), proj = pace ? GymLib.projection(history, ctx.today, target, 84) : null;
  const picker = ctx.sample ? '<p class="dx-sample-lift"><strong>' + esc(lift.name) + '</strong></p>' : '<div class="field dx-pick"><label for="dxLiftSelect">Exercise</label><select id="dxLiftSelect" data-dx-change="setLift">' + names.map(n => '<option value="' + esc(n.name) + '"' + (n.name === lift.name ? ' selected' : '') + '>' + esc(n.name) + ' (' + n.sessions + ')</option>').join('') + '</select></div>';
  let outlook;
  if (!proj) outlook = 'Log this lift on four days across three weeks and the lab projects where it is heading.';
  else if (proj.day && proj.weeks <= 26) outlook = 'At your current pace of +' + fmtWeight(proj.perWeek, 2) + ' a week, you reach ' + fmtWeight(proj.target, 0) + ' around ' + dxLongDay(proj.day) + ' (about ' + plural(proj.weeks, 'week') + ').';
  else if (proj.perWeek > 0) outlook = 'Creeping up at +' + fmtWeight(proj.perWeek, 2) + ' a week. ' + fmtWeight(target, 0) + ' is more than six months out at this pace, so this lift may be ready for a change.';
  else outlook = 'This lift has been flat or slipping over the last 12 weeks (' + fmtWeight(proj.perWeek, 2) + ' a week). The Coach tab has ideas for getting it moving.';
  return picker +
    '<div class="dx-tiles">' +
      dxTile('Best estimated max', esc(fmtWeight(best)), '<span>across ' + plural(history.length, 'training day') + '</span>') +
      dxTile('Since your first log', (gain >= 0 ? '+' : '') + esc(fmtWeight(gain)), first > 0 ? dxDelta(gain / first * 100) : '') +
      dxTile('Next milestone', esc(fmtWeight(target, 0)), '<span>' + esc(fmtWeight(Math.max(0, target - best))) + ' to go</span>') +
      (ctx.bodyKg > 0 ? dxTile('Relative strength', (best / ctx.bodyKg).toFixed(2) + '×', '<span>your body weight (' + esc(fmtWeight(ctx.bodyKg)) + ')</span>') : dxTile('Relative strength', '—', '<span>Log your body weight in Progress</span>')) +
    '</div>' +
    dxGoalMarkup(ctx, lift, history, best, target) + dxGoalListMarkup(ctx, lift) +
    '<div class="panel dx-block"><div class="section-title"><span>Strength curve</span><span class="dx-legend"><i class="dx-key dx-key-pr" aria-hidden="true"></i>New best' + (proj && proj.day && proj.weeks <= 26 ? ' <i class="dx-key dx-key-dash" aria-hidden="true"></i>Projection' : '') + '</span></div>' +
      (history.length > 1 ? dxLineChart(history, proj, ctx.today) + '<p class="dx-readout" data-default="Hover or tap a point for the set behind it." aria-hidden="true">Hover or tap a point for the set behind it.</p>' : '<p class="sub">One training day so far. The curve appears after the next one.</p>') +
      '<p class="dx-outlook"><span aria-hidden="true">🎯 </span>' + esc(outlook) + '</p>' +
      dxTable('Training days for ' + lift.name, ['Date', 'Best set', 'Estimated max', 'Working sets', 'Volume'], history.slice().reverse().slice(0, 40).map(p => [dxLongDay(p.date), fmtWeight(p.kg, 2) + ' × ' + p.reps, fmtWeight(p.e1rm), String(p.sets), fmtVolume(p.vol)])) + '</div>' +
    dxTrainingWeightsMarkup(best) +
    '<div class="panel dx-block"><div class="section-title"><span>Rep-max table</span><span class="sub">LIFTED vs PREDICTED</span></div><div class="dx-scroll"><table class="deluxe-table"><thead><tr><th scope="col">Reps</th><th scope="col">Heaviest lifted</th><th scope="col">When</th><th scope="col">Predicted from your best</th></tr></thead><tbody>' +
      maxes.rows.map(r => '<tr><th scope="row">' + r.reps + '</th><td>' + (r.kg ? esc(fmtWeight(r.kg, 2)) : '<span class="sub">not yet</span>') + '</td><td>' + (r.date ? esc(dxLongDay(r.date)) : '—') + '</td><td>' + esc(fmtWeight(r.predicted)) + '</td></tr>').join('') +
      '</tbody></table></div><p class="sub">“Heaviest lifted” counts any set of at least that many reps. Predictions use the Epley formula on your best set. Treat them as a guide and build up to heavy singles gradually.</p></div>';
}

// ---------- Workout planner ----------
function dxPlanSummary(program) {
  const p = GymLib.sanitizePlanProgram(program);
  const adapts = p.adaptive ? ' · adapts to each session' : '';
  if (!p.weeks) return 'Open-ended plan' + adapts;
  return p.weeks + '-week programme · ' + (p.mode === 'weight' ? '+' + fmtWeight(p.stepKg, 2) + ' each week' : p.mode === 'reps' ? '+1 rep each week' : 'same targets each week') + (p.deload && p.weeks >= 4 ? ' · lighter final week' : '') + adapts;
}
// One saved plan as a card. Also used, without buttons, in the planner preview.
function dxPlanCard(plan, i, sessions, today, preview) {
  const wk = GymLib.planWeek(plan.program, today), adh = GymLib.planAdherence(plan, sessions, today), count = plan.days.reduce((n, d) => n + d.exercises.length, 0);
  let status = '';
  if (wk) {
    status = '<div class="dx-plan-week"><div class="meta-row"><strong>' + (wk.finished ? 'Programme complete 🎉' : wk.upcoming ? 'Starts ' + esc(dxLongDay(wk.weekStart)) : 'Week ' + wk.week + ' of ' + wk.of + (wk.deload ? ' · lighter week' : '')) + '</strong><span>' + (adh.pct === null ? '' : adh.done + ' of ' + adh.expected + ' planned workouts done') + '</span></div>' +
      '<div class="progress-bar"><i data-w="' + (wk.finished ? 100 : wk.upcoming ? 0 : (wk.week - 1) / wk.of * 100 + (adh.thisWeek.length ? adh.thisWeek.filter(d => d.done).length / adh.thisWeek.length / wk.of * 100 : 0)) + '"></i></div></div>';
  }
  const strip = adh.thisWeek.length ? '<ul class="dx-plan-days" aria-label="This week">' + adh.thisWeek.map(d => '<li class="' + (d.done ? 'is-done' : '') + '"><span aria-hidden="true">' + (d.done ? '✓' : '○') + '</span> ' + esc(String(d.day).split('·').pop().trim()) + '<span class="sr">' + (d.done ? ', done' : ', to do') + '</span></li>').join('') + '</ul>' : '';
  const buttons = preview ? '' : '<div class="st-70 row-wrap"><button class="btn btn-primary" data-action="loadDeluxePlan" data-i="' + i + '">Load a day</button><button type="button" class="btn" data-plan-edit="' + i + '">Edit</button>' +
    (wk ? '<button type="button" class="btn" data-dx="restartPlan" data-i="' + i + '">' + (wk.finished ? 'Run it again' : 'Restart from this week') + '</button>' : '') + '<button class="btn" data-action="deleteDeluxePlan" data-i="' + i + '">Delete</button></div>';
  return '<div class="deluxe-plan-row dx-plan"><div class="st-57"><strong>' + esc(plan.name) + '</strong><span class="sub">' + plural(plan.days.length, 'day') + ' · ' + plural(count, 'exercise') + '</span></div><p class="sub dx-plan-sum">' + esc(dxPlanSummary(plan.program)) + '</p>' + status + strip + buttons + '</div>';
}
function dxTemplateCards(preview) {
  return '<div class="dx-templates">' + GymLib.PLAN_TEMPLATES.map(t => '<article class="dx-template"><div class="dx-template-head"><strong>' + esc(t.name) + '</strong><span class="deluxe-pill">' + t.days + ' DAYS</span></div><p>' + esc(t.blurb) + '</p><p class="sub">' + t.weeks + ' weeks · ' + (t.mode === 'weight' ? 'adds weight weekly' : 'adds reps weekly') + ' · lighter final week</p>' +
    (preview ? '' : '<button type="button" class="btn" data-dx="useTemplate" data-arg="' + t.id + '" aria-label="Use the ' + esc(t.name) + ' template">Use this template</button>') + '</article>').join('') + '</div>';
}
// Starting weights come from the user's own last session on each lift; unknown lifts start empty.
function dxStartKg(name) { const prev = previousExercisePerformance(name); return prev ? Math.max(0, ...(prev.sets || []).filter(s => s.type !== 'warmup').map(s => Number(s.kg) || 0)) : 0; }
function useTemplate(id) {
  const t = GymLib.PLAN_TEMPLATES.find(x => x.id === id); if (!t) return;
  deluxePlanDraft = t.plan.map(([day, list]) => ({ day, exercises: list.map(([name, sets, reps]) => ({ name, sets, reps, kg: dxStartKg(name) })) }));
  deluxeEditingPlanId = null;
  $('deluxePlanName').value = t.name; $('deluxePlanWeeks').value = String(t.weeks); $('deluxePlanMode').value = t.mode; $('deluxePlanDeload').checked = true;
  if ($('deluxePlanAdaptive')) $('deluxePlanAdaptive').checked = true;
  $('deluxePlanStep').value = weightUnit() === 'lb' ? 5 : 2.5;
  syncPlanProgramFields(); renderDeluxePlanDraft();
  const known = deluxePlanDraft.reduce((n, d) => n + d.exercises.filter(e => e.kg > 0).length, 0);
  showToast(t.name + ' loaded' + (known ? ' with your last weights on ' + plural(known, 'lift') : '') + '. Adjust anything, then save.');
  $('deluxePlanName').focus();
}
function syncPlanProgramFields() {
  const weeks = Number($('deluxePlanWeeks')?.value) || 0, mode = $('deluxePlanMode')?.value || 'none';
  if ($('deluxePlanMode')) $('deluxePlanMode').disabled = !weeks;
  if ($('deluxePlanStepField')) $('deluxePlanStepField').hidden = !(weeks && mode === 'weight');
  if ($('deluxePlanDeloadRow')) $('deluxePlanDeloadRow').hidden = weeks < 4;
}
// Reads the programme settings from the planner form. A plan keeps its start date while it is edited.
function readPlanProgram(existing) {
  const weeks = Number($('deluxePlanWeeks').value) || 0, old = GymLib.sanitizePlanProgram(existing);
  return GymLib.sanitizePlanProgram({ weeks, mode: weeks ? $('deluxePlanMode').value : 'none', stepKg: displayToKg(Number($('deluxePlanStep').value) || 0), deload: weeks >= 4 && $('deluxePlanDeload').checked, adaptive: !$('deluxePlanAdaptive') || $('deluxePlanAdaptive').checked,
    start: weeks ? (old.weeks && old.start ? old.start : GymLib.weeklySeries([], dxToday(), 1, dxWeekStart())[0].week) : '' });
}
function fillPlanProgram(program) {
  const p = GymLib.sanitizePlanProgram(program);
  $('deluxePlanWeeks').value = [0, 4, 6, 8, 12].includes(p.weeks) ? String(p.weeks) : '0'; $('deluxePlanMode').value = p.mode; $('deluxePlanDeload').checked = p.deload;
  $('deluxePlanStep').value = kgToDisplay(p.stepKg || 2.5, 2); if ($('deluxePlanAdaptive')) $('deluxePlanAdaptive').checked = p.adaptive; syncPlanProgramFields();
}
function restartPlan(i) {
  const plan = state.deluxe && state.deluxe.plans && state.deluxe.plans[i]; if (!plan) return;
  const p = GymLib.sanitizePlanProgram(plan.program); if (!p.weeks) return;
  const before = p.start; p.start = GymLib.weeklySeries([], dxToday(), 1, dxWeekStart())[0].week; plan.program = p; saveState(); renderDeluxePlanLibrary();
  showToast(plan.name + ' now starts this week', { actionLabel: 'Undo', onAction: () => { plan.program = Object.assign({}, p, { start: before }); saveState(); renderDeluxePlanLibrary(); } });
}
function renderPlannerExtras() {
  const host = $('deluxeTemplates'); if (host && !host.childElementCount) host.innerHTML = dxTemplateCards(false);
  if ($('deluxePlanStep') && !$('deluxePlanStep').value) $('deluxePlanStep').value = weightUnit() === 'lb' ? 5 : 2.5;
  syncPlanProgramFields();
}

// Adaptive targets: the calendar target checked against the last time this exercise came up in the plan.
function dxAdaptiveWhy(res) {
  const r = res.reason || {}, at = r.kg > 0 ? ' at ' + fmtWeight(r.kg, 2) : '';
  if (r.code === 'progress') return res.kg > r.kg || res.reps > r.reps ? 'All ' + r.of + ' sets of ' + r.reps + at + ' done last time, so today moves up.' : 'All ' + r.of + ' sets done last time. Same target today to lock it in.';
  if (r.code === 'hold') return 'Last time ' + r.hit + ' of ' + r.of + ' sets reached ' + r.reps + ' reps' + at + '. Repeat it today before moving on.';
  if (r.code === 'reset') return 'Two sessions short of ' + r.of + ' × ' + r.reps + at + ', so about 10% lighter today to build back up.';
  if (r.code === 'deload') return 'Lighter week: fewer sets at about 90% of the weight.';
  if (r.code === 'break') return 'First time back in over six weeks, so today follows the plan.';
  return '';
}
function dxAdaptiveTarget(plan, name, scheduled, deload) {
  const p = GymLib.sanitizePlanProgram(plan && plan.program);
  const res = GymLib.adaptiveTarget(scheduled, GymLib.planExerciseResults(dxSessions(), plan && plan.name, name, 3), { mode: p.mode, stepKg: p.stepKg, roundKg: weightUnit() === 'lb' ? KG_PER_LB : 0.5, deload: !!deload, today: dxToday() });
  return { sets: res.sets, reps: res.reps, kg: res.kg, adapt: res.action === 'schedule' ? '' : res.action, why: dxAdaptiveWhy(res) };
}

// ---------- Nutrition coach ----------
// Maintenance calories from the food log and the weight trend (GymLib.energyBalance), then a target and
// macros for the chosen goal. Nothing changes until the person taps "Use these targets".
const DX_RATES = { lose: [0.25, 0.5, 0.75, 1], gain: [0.25, 0.5] };
const DX_GOAL_LABELS = { lose: 'Lose weight', maintain: 'Keep my weight', gain: 'Gain weight' };
function dxIntakeMap(today) {
  const out = {}, daily = state.dailyHistory || {}, hist = state.history || {};
  for (let i = 1; i <= 60; i++) { const k = GymLib.addDays(today, -i), d = daily[k], h = hist[k], cal = Number(d && d.cal) || Number(h && h.cal) || 0; if (cal > 0) out[k] = cal; }
  return out;
}
function dxWeightMap() { const log = (state.extras && state.extras.bodyLog) || {}, out = {}; Object.keys(log).forEach(k => { const v = Number(log[k]); if (v > 0) out[k] = v; }); return out; }
function dxLatestWeight(weights) { const days = Object.keys(weights).sort(); return days.length ? Number(weights[days[days.length - 1]]) : 0; }
function dxNutritionContext() {
  const today = dxToday(), weights = dxWeightMap();
  return { today, intake: dxIntakeMap(today), weights, bodyKg: dxLatestWeight(weights) || Number(state.profile && state.profile.weightKg) || 0, calTarget: Number(state.calTarget) || 0, sample: false };
}
// Four weeks of a believable log: about 2,300 kcal a day while drifting down roughly 0.4 kg a week.
function dxNutritionSample() {
  const today = dxToday(), intake = {}, weights = {};
  for (let i = 1; i <= 28; i++) { const k = GymLib.addDays(today, -i); if (i % 9 !== 4) intake[k] = 2300 + ((i * 37) % 9 - 4) * 45; if (i % 3 === 0) weights[k] = Math.round((80 + i * 0.057 + ((i * 13) % 5 - 2) * 0.12) * 10) / 10; }
  weights[today] = 80;
  return { today, intake, weights, bodyKg: 80, calTarget: 2500, sample: true };
}
function dxNutritionPrefs(ctx) {
  if (ctx.sample) return { goal: 'lose', rate: 0.5 };
  const n = (state.deluxe && state.deluxe.nutrition) || {}, goal = GymLib.CALORIE_GOALS.includes(n.goal) ? n.goal : 'maintain', rates = DX_RATES[goal] || [];
  return { goal, rate: rates.includes(Number(n.rate)) ? Number(n.rate) : rates.includes(0.5) ? 0.5 : rates[0] || 0 };
}
function dxNutritionPlan(ctx) {
  const e = GymLib.energyBalance(ctx.intake, ctx.weights, ctx.today);
  if (!e.ready) return { e };
  const pref = dxNutritionPrefs(ctx), t = GymLib.calorieTarget(e.maintenance, pref.goal, pref.rate, ctx.bodyKg);
  return { e, pref, t, m: GymLib.macroTargets(t.kcal, ctx.bodyKg, pref.goal) };
}
function dxMeter(label, have, need, extra) {
  const done = have >= need;
  return '<div class="dx-row"><div class="meta-row"><strong>' + esc(label) + '</strong><span>' + (done ? '✓ ' : '') + Math.min(have, need) + ' of ' + need + (extra ? ' · ' + esc(extra) : '') + '</span></div><div class="progress-bar"><i data-w="' + Math.min(100, have / need * 100) + '"></i></div></div>';
}
function dxSignedWeight(kg) { return (kg > 0 ? '+' : kg < 0 ? '−' : '') + fmtWeight(Math.abs(kg), 2); }
function dxNutritionMarkup(ctx) {
  const { e, pref, t, m } = dxNutritionPlan(ctx), off = ctx.sample ? ' disabled' : '';
  const how = '<p class="sub dx-foot">How it works: over the last four weeks, what you ate minus the energy in your weight change (about 7,700 kcal per kg) is what your body used. Days under 800 kcal count as unfinished logs. This is an estimate for healthy adults, not medical or dietary advice. If you are under 18, pregnant or managing a health condition, talk to a professional first.</p>';
  if (!e.ready) {
    const links = ctx.sample ? '' : '<div class="row-wrap st-3"><button type="button" class="btn" data-action="showScreen" data-arg="nutrition">Log food</button><button type="button" class="btn" data-action="showScreen" data-arg="progress">Log your weight</button></div>';
    return '<div class="panel dx-block"><div class="section-title"><span>Building your estimate</span><span class="sub">LAST 4 WEEKS</span></div>' +
      (e.implausible ? '<p class="account-message">The food log and the scale do not agree yet (they suggest about ' + esc(dxInt(e.avgIntake)) + ' kcal a day with ' + esc(dxSignedWeight(e.kgPerWeek)) + ' a week). Check that whole days are logged and weigh in at the same time of day.</p>'
        : '<p class="sub">Your real maintenance calories appear once there is enough to go on. Log your food on most days and weigh in a couple of times a week.</p>') +
      dxMeter('Days with food logged', e.foodDays, e.needFoodDays) + dxMeter('Weigh-ins', e.weighIns, e.needWeighIns, e.spanDays >= e.needSpanDays ? '' : 'spread over ' + e.needSpanDays + '+ days') + links + '</div>' + how;
  }
  const trend = e.kgPerWeek === 0 ? 'holding steady' : e.kgPerWeek < 0 ? 'losing' : 'gaining', rates = DX_RATES[pref.goal] || [];
  const goals = GymLib.CALORIE_GOALS.map(g => '<label class="dx-option"><input type="radio" name="dxCalGoal" value="' + g + '"' + (g === pref.goal ? ' checked' : '') + (ctx.sample ? off : ' data-dx-change="setNutritionGoal"') + '><span><strong>' + DX_GOAL_LABELS[g] + '</strong></span></label>').join('');
  const pace = rates.length ? '<div class="field dx-pick"><label for="dxCalRate">Pace</label><select id="dxCalRate"' + (ctx.sample ? off : ' data-dx-change="setNutritionRate"') + '>' + rates.map(r => '<option value="' + r + '"' + (r === pref.rate ? ' selected' : '') + '>' + r + '% of body weight a week' + (ctx.bodyKg > 0 ? ' (about ' + esc(fmtWeight(ctx.bodyKg * r / 100, 2)) + ')' : '') + '</option>').join('') + '</select></div>' : '';
  const same = !ctx.sample && Math.round(ctx.calTarget) === t.kcal && state.nutritionTargets && Number(state.nutritionTargets.protein) === m.protein && Number(state.nutritionTargets.carbs) === m.carbs && Number(state.nutritionTargets.fat) === m.fat;
  const action = ctx.sample ? '' : same ? '<p class="sub st-3" role="status">✓ These are your current targets.</p>' : '<div class="row-wrap st-3"><button type="button" class="btn btn-primary" data-dx="applyNutritionTargets">Use these targets</button></div>';
  return '<div class="dx-tiles">' +
      dxTile('Maintenance', esc(dxInt(e.maintenance)) + ' kcal', '<span class="dx-chip is-' + (e.confidence === 'high' ? 'rising' : 'steady') + '">' + (e.confidence === 'high' ? 'Solid estimate' : 'Early estimate') + '</span> <span>a day</span>') +
      dxTile('Average eaten', esc(dxInt(e.avgIntake)) + ' kcal', '<span>on ' + esc(plural(e.foodDays, 'logged day')) + '</span>') +
      dxTile('Weight trend', esc(dxSignedWeight(e.kgPerWeek)), '<span>a week · ' + trend + '</span>') +
      dxTile('Current target', esc(dxInt(ctx.calTarget)) + ' kcal', '<span>' + (ctx.calTarget ? (ctx.calTarget > e.maintenance ? dxInt(ctx.calTarget - e.maintenance) + ' above' : ctx.calTarget < e.maintenance ? dxInt(e.maintenance - ctx.calTarget) + ' below' : 'right at') + ' maintenance' : 'not set') + '</span>') +
    '</div>' +
    '<div class="dx-two">' +
      '<div class="panel dx-block"><div class="section-title"><span>Your goal</span></div><fieldset class="dx-confetti"><legend class="sr">Weight goal</legend>' + goals + '</fieldset>' + pace + '</div>' +
      '<div class="panel dx-block"><div class="section-title"><span>Daily target</span><span class="sub">RECOMMENDED</span></div>' +
        '<p class="dx-kcal"><strong>' + esc(dxInt(t.kcal)) + '</strong> kcal a day</p>' +
        '<p class="sub">' + (t.perDay ? esc(dxInt(Math.abs(t.perDay))) + ' kcal ' + (t.perDay < 0 ? 'below' : 'above') + ' maintenance, for about ' + esc(dxSignedWeight(t.kgPerWeek)) + ' a week.' : 'Matches your maintenance, to keep your weight steady.') + (pref.goal === 'lose' && t.kcal === 1200 ? ' Held at 1,200 kcal, the lowest target Gymplified suggests.' : '') + '</p>' +
        '<div class="stat-row dx-macros"><div class="stat"><b>' + m.protein + ' g</b><span>protein</span></div><div class="stat"><b>' + m.carbs + ' g</b><span>carbs</span></div><div class="stat"><b>' + m.fat + ' g</b><span>fat</span></div></div>' + action + '</div>' +
    '</div>' + how;
}
function setNutritionGoal(el) { if (!GymLib.CALORIE_GOALS.includes(el.value)) return; state.deluxe = state.deluxe || {}; const rates = DX_RATES[el.value] || []; state.deluxe.nutrition = { goal: el.value, rate: rates.includes(0.5) ? 0.5 : rates[0] || 0 }; saveState(); renderDeluxeTools(deluxeEnabled()); }
function setNutritionRate(el) { const n = Number(el.value), pref = dxNutritionPrefs({ sample: false }); if (!(DX_RATES[pref.goal] || []).includes(n)) return; state.deluxe.nutrition = { goal: pref.goal, rate: n }; saveState(); renderDeluxeTools(deluxeEnabled()); }
function applyNutritionTargets() {
  const plan = dxNutritionPlan(dxNutritionContext()); if (!plan.t) return showToast('Keep logging food and weigh-ins: your estimate is not ready yet');
  const before = { cal: state.calTarget, macros: Object.assign({}, state.nutritionTargets) };
  state.calTarget = plan.t.kcal; state.nutritionTargets = { protein: plan.m.protein, carbs: plan.m.carbs, fat: plan.m.fat };
  saveState(); renderDeluxeTools(deluxeEnabled());
  showToast('Daily target set to ' + dxInt(plan.t.kcal) + ' kcal with matching macros', { actionLabel: 'Undo', onAction: () => { state.calTarget = before.cal; state.nutritionTargets = before.macros; saveState(); renderDeluxeTools(deluxeEnabled()); } });
}

// ---------- Complete data tools ("Reports") ----------
function dxTopLifts(sessions, today, limit) {
  return GymLib.exerciseNames(sessions).slice(0, 12).map(n => { const h = GymLib.exerciseHistory(sessions, n.name); return { name: n.name, days: h.length, best: Math.max(...h.map(p => p.e1rm)), first: h[0].e1rm, last: h[h.length - 1].date }; }).sort((a, b) => b.best - a.best).slice(0, limit);
}
function dxCardStats(ctx) {
  const series = GymLib.weeklySeries(ctx.sessions, ctx.today, 8, ctx.weekStart), from = series[4].week, recent = ctx.sessions.filter(s => s.date >= from && s.date <= ctx.today);
  return { series, workouts: recent.length, vol: recent.reduce((n, s) => n + GymLib.sessionVolume(s), 0), prs: recent.reduce((n, s) => n + (Array.isArray(s.prs) ? s.prs.length : 0), 0), lifts: dxTopLifts(ctx.sessions, ctx.today, 3), from };
}
// The share card is drawn on a canvas so it can be saved or shared as an image. Its colours are fixed
// (it is a picture, not part of the themed interface).
function dxDrawCard(canvas, ctx) {
  const W = 1080, H = 1350, g = canvas.getContext('2d'); if (!g) return false;
  canvas.width = W; canvas.height = H;
  const box = (x, y, w, h, r) => { g.beginPath(); if (g.roundRect) g.roundRect(x, y, w, h, r); else g.rect(x, y, w, h); g.fill(); };
  const st = dxCardStats(ctx), font = (weight, size) => weight + ' ' + size + 'px system-ui, -apple-system, "Segoe UI", sans-serif';
  const bg = g.createLinearGradient(0, 0, W, H); bg.addColorStop(0, '#1b1610'); bg.addColorStop(1, '#0b0a08'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
  const glow = g.createRadialGradient(W * 0.85, 120, 0, W * 0.85, 120, 620); glow.addColorStop(0, 'rgba(214,177,94,.32)'); glow.addColorStop(1, 'rgba(214,177,94,0)'); g.fillStyle = glow; g.fillRect(0, 0, W, H);
  g.fillStyle = '#d6b15e'; g.font = font(800, 30); g.textBaseline = 'alphabetic'; g.fillText('G Y M P L I F I E D', 80, 120);
  g.fillStyle = '#faf6ef'; g.font = font(800, 84); g.fillText('My last 4 weeks', 80, 240);
  g.fillStyle = '#b8ad9d'; g.font = font(500, 34); g.fillText(dxShortDay(st.from) + ' – ' + dxShortDay(ctx.today), 80, 296);
  [['WORKOUTS', dxInt(st.workouts)], ['VOLUME', dxCompact(kgToDisplay(st.vol, 0)) + ' ' + weightUnit()], ['NEW BESTS', dxInt(st.prs)]].forEach(([label, value], i) => {
    const x = 80 + i * 313; g.fillStyle = 'rgba(250,246,239,.06)'; box(x, 356, 293, 200, 24);
    g.fillStyle = '#d6b15e'; g.font = font(700, 24); g.fillText(label, x + 28, 412); g.fillStyle = '#faf6ef'; g.font = font(800, 68); g.fillText(value, x + 28, 506, 240);
  });
  g.fillStyle = '#b8ad9d'; g.font = font(700, 26); g.fillText('WEEKLY VOLUME · 8 WEEKS', 80, 640);
  const max = Math.max(1, ...st.series.map(w => w.vol)), bw = 92, gap = (920 - bw * 8) / 7;
  st.series.forEach((w, i) => { const h = Math.max(8, w.vol / max * 220), x = 80 + i * (bw + gap); g.fillStyle = i >= 4 ? '#d6b15e' : 'rgba(214,177,94,.35)'; box(x, 900 - h, bw, h, 12); });
  g.fillStyle = '#b8ad9d'; g.font = font(700, 26); g.fillText('TOP LIFTS · ESTIMATED MAX', 80, 990);
  st.lifts.forEach((l, i) => { const y = 1050 + i * 66; g.fillStyle = '#faf6ef'; g.font = font(600, 38); g.textAlign = 'left'; g.fillText(l.name, 80, y, 640); g.fillStyle = '#d6b15e'; g.font = font(800, 38); g.textAlign = 'right'; g.fillText(fmtWeight(l.best), W - 80, y); g.textAlign = 'left'; });
  if (!st.lifts.length) { g.fillStyle = '#b8ad9d'; g.font = font(500, 34); g.fillText('Finish a workout to fill this in.', 80, 1050); }
  g.fillStyle = 'rgba(250,246,239,.45)'; g.font = font(500, 26); g.fillText('gymplified.com', 80, H - 60);
  return true;
}
function dxCardBlob() { return new Promise(resolve => { const c = document.createElement('canvas'); if (!dxDrawCard(c, dxContext()) || !c.toBlob) return resolve(null); c.toBlob(resolve, 'image/png'); }); }
async function downloadShareCard() {
  const blob = await dxCardBlob(); if (!blob) return showToast('This browser cannot create the image');
  const url = URL.createObjectURL(blob), a = document.createElement('a'); a.href = url; a.download = 'gymplified-progress-' + dxToday() + '.png'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1500);
  dxStatus('Progress card saved as an image.');
}
async function shareShareCard() {
  const blob = await dxCardBlob(); if (!blob) return showToast('This browser cannot create the image');
  const file = typeof File === 'function' ? new File([blob], 'gymplified-progress.png', { type: 'image/png' }) : null;
  try { if (file && navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], title: 'My Gymplified progress' }); return; } } catch (e) { if (e && e.name === 'AbortError') return; }
  downloadShareCard();
}
function dxStatus(text) { const el = $('dxDataStatus'); if (el) el.textContent = text; }
// A self-contained report page: open it in any browser, print it, or save it as a PDF.
function dxReportHtml(ctx) {
  const range = 12, all = GymLib.weeklySeries(ctx.sessions, ctx.today, range * 2, ctx.weekStart), series = all.slice(-range), change = GymLib.periodChange(all);
  const bal = GymLib.muscleBalance(ctx.sessions, ctx.today, 28), lifts = dxTopLifts(ctx.sessions, ctx.today, 10), cons = GymLib.consistency(ctx.sessions, ctx.today, 12, ctx.weeklyGoal, ctx.weekStart);
  const insights = GymLib.coachInsights(ctx.sessions, ctx.today, { weekStart: ctx.weekStart, weeklyGoal: ctx.weeklyGoal }), totalVol = ctx.sessions.reduce((n, s) => n + GymLib.sessionVolume(s), 0);
  const months = {}; ctx.sessions.forEach(s => { const k = String(s.date).slice(0, 7), m = months[k] || (months[k] = { n: 0, vol: 0, mins: 0, prs: 0 }); m.n++; m.vol += GymLib.sessionVolume(s); m.mins += Number(s.mins) || 0; m.prs += Array.isArray(s.prs) ? s.prs.length : 0; });
  const pct = v => (v === null ? 'new' : (v > 0 ? '+' : '') + Math.round(v) + '%'), max = Math.max(1, ...series.map(w => w.vol)), top = Math.max(1, ...bal.groups.map(g => g.sets));
  const css = 'body{font:15px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif;color:#1f1a14;background:#faf6ef;margin:0;padding:32px}main{max-width:820px;margin:0 auto;background:#fff;border:1px solid #e7ddcf;border-radius:16px;padding:40px}' +
    'h1{font-size:30px;margin:6px 0 2px;letter-spacing:-.02em}h2{font-size:17px;margin:34px 0 12px;padding-bottom:6px;border-bottom:2px solid #c9a24e}.mark{color:#7c5a12;font-weight:800;letter-spacing:.16em;font-size:12px}.muted{color:#5f5446}' +
    '.tiles{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:20px}.tile{border:1px solid #e7ddcf;border-radius:12px;padding:14px}.tile b{display:block;font-size:24px;letter-spacing:-.03em}.tile span{font-size:12px;color:#5f5446}' +
    '.bars{display:flex;align-items:flex-end;gap:6px;height:150px;border-bottom:1px solid #e7ddcf}.bars div{flex:1;background:#c9a24e;border-radius:4px 4px 0 0;min-height:2px}.h0{height:0}' + Array.from({ length: 20 }, (_, i) => '.h' + (i + 1) + '{height:' + (i + 1) * 5 + '%}.w' + (i + 1) + '{width:' + (i + 1) * 5 + '%}').join('') +
    '.axis{display:flex;justify-content:space-between;font-size:12px;color:#5f5446;margin-top:4px}table{width:100%;border-collapse:collapse;font-size:14px}th,td{text-align:left;padding:8px 6px;border-bottom:1px solid #eee4d6}th{font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:#5f5446}' +
    '.meter{background:#f4ede2;border-radius:99px;height:8px;overflow:hidden;min-width:200px}.meter i{display:block;height:8px;background:#c9a24e}li{margin:6px 0}footer{margin-top:34px;font-size:12px;color:#5f5446}@media print{body{background:#fff;padding:0}main{border:0;padding:0}h2{break-after:avoid}table,.tiles,.bars{break-inside:avoid}}@media(max-width:600px){body{padding:12px}main{padding:20px}.tiles{grid-template-columns:repeat(2,1fr)}}';
  const step = v => Math.max(0, Math.min(20, Math.round(v * 20)));
  return '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Gymplified training report · ' + esc(dxLongDay(ctx.today)) + '</title><style>' + css + '</style></head><body><main>' +
    '<div class="mark">GYMPLIFIED DELUXE</div><h1>Training report</h1><div class="muted">Generated ' + esc(dxLongDay(ctx.today)) + ' · ' + esc(plural(ctx.sessions.length, 'workout')) + ' on record · ' + esc(fmtVolume(totalVol)) + ' lifted in total</div>' +
    '<div class="tiles"><div class="tile"><span>Volume · 12 weeks</span><b>' + esc(fmtVolume(change.vol.now)) + '</b><span>' + pct(change.vol.pct) + ' vs previous 12</span></div><div class="tile"><span>Workouts · 12 weeks</span><b>' + change.workouts.now + '</b><span>' + pct(change.workouts.pct) + ' vs previous 12</span></div>' +
      '<div class="tile"><span>Average session</span><b>' + (change.length.now || 0) + ' min</b><span>' + change.sets.now + ' working sets</span></div><div class="tile"><span>Weekly goal</span><b>' + (cons.weeks ? cons.pct + '%' : '—') + '</b><span>' + cons.hit + ' of ' + cons.weeks + ' weeks at ' + cons.goal + '+</span></div></div>' +
    '<h2>Weekly volume</h2><div class="bars">' + series.map(w => '<div class="h' + step(w.vol / max) + '" title="' + esc(dxShortDay(w.week) + ': ' + fmtVolume(w.vol)) + '"></div>').join('') + '</div><div class="axis"><span>' + esc(dxShortDay(series[0].week)) + '</span><span>' + esc(dxShortDay(series[series.length - 1].week)) + '</span></div>' +
    '<h2>Strongest lifts</h2>' + (lifts.length ? '<table><thead><tr><th>Exercise</th><th>Estimated max</th><th>Since first log</th><th>Training days</th><th>Last trained</th></tr></thead><tbody>' + lifts.map(l => '<tr><td>' + esc(l.name) + '</td><td>' + esc(fmtWeight(l.best)) + '</td><td>' + (l.best - l.first >= 0 ? '+' : '') + esc(fmtWeight(l.best - l.first)) + '</td><td>' + l.days + '</td><td>' + esc(dxLongDay(l.last)) + '</td></tr>').join('') + '</tbody></table>' : '<p class="muted">No lifts logged yet.</p>') +
    '<h2>Muscle balance · last 4 weeks</h2><table><tbody>' + bal.groups.map(g => '<tr><td>' + esc(g.group) + '</td><td>' + g.sets + ' sets</td><td><div class="meter"><i class="w' + step(g.sets / top) + '"></i></div></td></tr>').join('') + '</tbody></table>' +
    '<h2>What the log says</h2><ul>' + insights.map(x => '<li><strong>' + esc(x.title) + '.</strong> ' + esc(x.detail) + '</li>').join('') + '</ul>' +
    '<h2>Month by month</h2><table><thead><tr><th>Month</th><th>Workouts</th><th>Volume</th><th>Time</th><th>New bests</th></tr></thead><tbody>' + Object.keys(months).sort().reverse().slice(0, 24).map(k => '<tr><td>' + esc(fmtMonth(k)) + '</td><td>' + months[k].n + '</td><td>' + esc(fmtVolume(months[k].vol)) + '</td><td>' + Math.round(months[k].mins / 60 * 10) / 10 + ' h</td><td>' + months[k].prs + '</td></tr>').join('') + '</tbody></table>' +
    '<footer>Made with Gymplified Deluxe. Estimated maxes use the Epley formula. This report describes logged training and is not medical or coaching advice.</footer></main></body></html>';
}
function exportDeluxeReport() {
  const ctx = dxContext(); if (!ctx.sessions.length) return showToast('Complete a workout before generating your report');
  deluxeDownload('gymplified-training-report-' + dxToday() + '.html', dxReportHtml(ctx), 'text/html;charset=utf-8');
  dxStatus('Report downloaded. Open it in your browser and use Print to save it as a PDF.');
}
function exportDeluxeCSV() {
  const rows = [['Workout date', 'Exercise', 'Muscle group', 'Set number', 'Set type', 'Weight ' + weightUnit(), 'Reps', 'Effort (RPE)', 'Volume ' + weightUnit(), 'Estimated 1RM ' + weightUnit()]];
  dxSessions().slice().sort((a, b) => String(a.date).localeCompare(String(b.date))).forEach(s => (s.exercises || []).forEach(e => (e.sets || []).forEach((set, i) => rows.push([s.date, e.name, e.muscle || '', i + 1, set.type || 'normal', kgToDisplay(set.kg, 2), set.reps, Number(set.rpe) || '', set.type === 'warmup' ? 0 : kgToDisplay((Number(set.kg) || 0) * (Number(set.reps) || 0), 1), kgToDisplay(calculate1RM(set.kg, set.reps), 1)]))));
  if (rows.length === 1) return showToast('No completed workout sets to export yet');
  deluxeDownload('gymplified-sets-' + dxToday() + '.csv', '﻿' + rows.map(row => row.map(csvCell).join(',')).join('\r\n'), 'text/csv;charset=utf-8');
  dxStatus('Set-by-set spreadsheet exported · ' + plural(rows.length - 1, 'set') + '.');
}
function exportDeluxeLifts() {
  const ctx = dxContext(), rows = [['Exercise', 'Training days', 'Best estimated 1RM ' + weightUnit(), 'First estimated 1RM ' + weightUnit(), 'Change ' + weightUnit(), 'Last trained'].concat(GymLib.REP_TARGETS.map(r => 'Best ' + r + '-rep weight ' + weightUnit()))];
  GymLib.exerciseNames(ctx.sessions).forEach(n => { const h = GymLib.exerciseHistory(ctx.sessions, n.name), m = GymLib.repMaxes(ctx.sessions, n.name); rows.push([n.name, h.length, kgToDisplay(m.best, 1), kgToDisplay(h[0].e1rm, 1), kgToDisplay(m.best - h[0].e1rm, 1), h[h.length - 1].date].concat(m.rows.map(r => (r.kg ? kgToDisplay(r.kg, 2) : '')))); });
  if (rows.length === 1) return showToast('No lifts to export yet');
  deluxeDownload('gymplified-lifts-' + dxToday() + '.csv', '﻿' + rows.map(row => row.map(csvCell).join(',')).join('\r\n'), 'text/csv;charset=utf-8');
  dxStatus('Lift summary exported · ' + plural(rows.length - 1, 'exercise') + '.');
}
function dxDataMarkup(ctx) {
  const act = (action, label, primary) => (ctx.sample ? '' : '<button type="button" class="btn' + (primary ? ' btn-primary' : '') + '" data-dx="' + action + '">' + label + '</button>');
  return '<div class="dx-two dx-data">' +
    '<div class="panel dx-block"><div class="section-title"><span>Progress card</span><span class="sub">LAST 4 WEEKS</span></div><canvas class="dx-card" data-dx-card width="1080" height="1350" role="img" aria-label="A shareable picture of your last 4 weeks: workouts, volume, new bests, an 8-week volume chart and your top three lifts."></canvas>' +
      '<div class="row-wrap st-3">' + act('shareShareCard', 'Share card', true) + act('downloadShareCard', 'Save image') + '</div></div>' +
    '<div><div class="panel dx-block"><div class="section-title"><span>Training report</span></div><p class="sub">A designed, print-ready report: 12-week summary, volume chart, strongest lifts, muscle balance, coach notes and a month-by-month table. Open it in any browser and print it to save a PDF.</p><div class="row-wrap st-3">' + act('exportDeluxeReport', 'Download report', true) + '</div></div>' +
      '<div class="panel dx-block"><div class="section-title"><span>Spreadsheets</span></div><p class="sub">Analysis-ready files for Excel, Numbers or Google Sheets: every set with type, effort, volume and estimated max, or one row per lift with your rep maxes.</p><div class="row-wrap st-3">' + act('exportDeluxeCSV', 'Every set (.csv)') + act('exportDeluxeLifts', 'Lift summary (.csv)') + '</div>' +
      '<p class="sub st-3">Your full backup and restore stay free in Settings.</p></div>' +
      (ctx.sample ? '' : '<p class="sub" id="dxDataStatus" role="status" aria-live="polite"></p>') + '</div></div>';
}

// ---------- Deluxe customisation ("Style") ----------
function dxSkin() { const id = state.deluxe && state.deluxe.skin; return DX_SKINS.find(s => s.id && s.id === id) || null; }
function dxStyleMarkup(preview) {
  const current = (state.deluxe && state.deluxe.skin) || '', confettiNow = (state.deluxe && state.deluxe.confetti) || 'classic', high = state.settings.contrast === 'high';
  const skins = DX_SKINS.map(s => '<label class="dx-skin dx-skin-' + (s.id || 'classic') + '"><input type="radio" name="dxSkin" value="' + s.id + '"' + (preview ? ' disabled' : ' data-dx-change="setSkin"') + (!preview && s.id === current ? ' checked' : preview && s.id === 'obsidian' ? ' checked' : '') + '><span class="dx-skin-swatch" aria-hidden="true"><i></i><i></i><i></i></span><strong>' + s.name + '</strong><span class="sub">' + s.note + '</span></label>').join('');
  return '<div class="panel dx-block"><div class="section-title"><span>Signature themes</span><span class="sub">DELUXE ONLY</span></div><fieldset class="dx-skins"><legend class="sr">Choose a signature theme</legend>' + skins + '</fieldset>' +
      (high && !preview ? '<p class="sub" role="note">High contrast is on in Settings, so the app keeps its high-contrast colours. Your choice is saved for when you turn it off.</p>' : '<p class="sub">Themes restyle the whole app on every device you sign in to. Every theme meets the same contrast standard as the built-in ones.</p>') + '</div>' +
    '<div class="dx-two"><div class="panel dx-block"><div class="section-title"><span>Celebrations</span></div><fieldset class="dx-confetti"><legend class="sub">What rains down when you finish a workout</legend>' +
      DX_CONFETTI.map(c => '<label class="dx-option"><input type="radio" name="dxConfetti" value="' + c.id + '"' + (preview ? ' disabled' : ' data-dx-change="setConfetti"') + (c.id === confettiNow ? ' checked' : '') + '><span><strong>' + c.name + '</strong> <span aria-hidden="true">' + c.sample + '</span></span></label>').join('') + '</fieldset></div>' +
    '<div class="panel dx-block"><div class="section-title"><span>Profile flair</span></div><label class="st-40"><input type="checkbox"' + (preview ? ' disabled checked' : ' data-dx-change="setFlair"' + (state.deluxe && state.deluxe.profileFlair !== false ? ' checked' : '')) + '> Show the <span class="deluxe-pill">DELUXE</span> badge on my profile</label><p class="sub st-3">Accent colours, light and dark mode, text size and fonts stay free in Settings.</p></div></div>';
}
function setSkin(el) {
  const skin = DX_SKINS.find(s => s.id === el.value); if (!skin) return;
  state.deluxe = state.deluxe || {}; state.deluxe.skin = skin.id; saveState();
  showToast(skin.id ? skin.name + ' theme on' : 'Back to your classic theme');
}
function setConfetti(el) { if (!DX_CONFETTI.some(c => c.id === el.value)) return; state.deluxe = state.deluxe || {}; state.deluxe.confetti = el.value; saveState(); showToast('Celebration style saved'); }
function setFlair(el) { state.deluxe = state.deluxe || {}; state.deluxe.profileFlair = !!el.checked; saveState(); showToast(el.checked ? 'Deluxe badge shown on your profile' : 'Deluxe badge hidden'); }
// Until the server has answered, an owner's saved answer keeps their theme on screen, so the app does not
// flash the default colours on every launch. This is cosmetic only: the tools still wait for the server.
function dxSkinAllowed() {
  if (deluxeEnabled()) return true;
  const cached = !deluxeAccess.checked && currentUser ? readDeluxeCache(currentUser.id) : null;
  return !!(cached && cached.deluxe);
}
// Called from applySettings. A signature theme only applies while Deluxe is active and high contrast is off.
function applyDeluxeSkin(root) {
  const skin = dxSkinAllowed() && state.settings.contrast !== 'high' ? dxSkin() : null;
  if (skin) { root.setAttribute('data-skin', skin.id); root.setAttribute('data-theme', skin.base); } else root.removeAttribute('data-skin');
}

// ---------- the tool area: tabs and panels ----------
function dxPanelHtml(tab, ctx) {
  if (tab === 'analytics') return dxAnalyticsMarkup(ctx, dxRange);
  if (tab === 'coach') return dxCoachMarkup(ctx);
  if (tab === 'lab') return dxLabMarkup(ctx, dxLift);
  if (tab === 'data') return dxDataMarkup(ctx);
  if (tab === 'nutrition') return dxNutritionMarkup(dxNutritionContext());
  if (tab === 'style') return dxStyleMarkup(false);
  return '';
}
function dxDrawCards(root, ctx) { root.querySelectorAll('canvas[data-dx-card]').forEach(c => { try { dxDrawCard(c, ctx); } catch (e) { console.warn('Progress card could not be drawn:', e && e.message); } }); }
// Rebuilding a panel must not throw keyboard users back to the top of the page.
function dxKeepFocus(root, rebuild) {
  const a = document.activeElement, inside = a && root.contains(a);
  const key = inside ? (a.id ? '#' + a.id : a.name && a.value !== undefined && a.type === 'radio' ? 'input[name="' + a.name + '"][value="' + a.value + '"]' : a.dataset.dx ? '[data-dx="' + a.dataset.dx + '"]' + (a.dataset.arg ? '[data-arg="' + a.dataset.arg + '"]' : '') : a.dataset.dxChange ? '[data-dx-change="' + a.dataset.dxChange + '"]' : '') : '';
  rebuild();
  if (key) { const next = root.querySelector(key); if (next) next.focus({ preventScroll: true }); }
}
function renderDeluxeTools(enabled) {
  const tools = $('deluxeTools'); if (!tools || !enabled || activeScreenId() !== 'deluxe') return;
  const tabs = $('dxTabs');
  if (tabs && !tabs.childElementCount) tabs.innerHTML = DX_TABS.map(t => '<button type="button" role="tab" class="lb-tab" id="dxTab-' + t.id + '" data-dx="setTab" data-arg="' + t.id + '" aria-controls="dxPanel-' + t.id + '"></button>').join('');
  DX_TABS.forEach(t => {
    const btn = $('dxTab-' + t.id), panel = $('dxPanel-' + t.id), on = t.id === dxTab;
    if (btn) { btn.textContent = t.label; btn.setAttribute('aria-selected', String(on)); btn.tabIndex = on ? 0 : -1; }
    if (panel) panel.hidden = !on;
  });
  if (dxTab === 'planner') { renderPlannerExerciseList(); renderPlannerExtras(); renderDeluxePlanLibrary(); return; }
  const host = $('dxPanel-' + dxTab), ctx = dxContext(); if (!host) return;
  dxKeepFocus(host, () => { host.innerHTML = dxPanelHtml(dxTab, ctx); });
  dxDrawCards(host, ctx);
}
function setDeluxeTab(id, focus) {
  if (!DX_TABS.some(t => t.id === id)) return;
  dxTab = id; renderDeluxeTools(deluxeEnabled());
  if (focus) $('dxTab-' + id)?.focus();
}
function openDeluxeFeature(name) {
  const tab = DX_TABS.find(t => t.feature === name); if (!tab) return false;
  setDeluxeTab(tab.id, false);
  $('deluxeTools')?.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' }); $('dxTab-' + tab.id)?.focus({ preventScroll: true });
  return true;
}

// ---------- before purchase: sample previews and the personal summary ----------
// A believable half-year log, so every tool can be shown working before anyone pays.
function dxSampleSessions(today) {
  const start = GymLib.addDays(GymLib.weeklySeries([], today, 1, 'mon')[0].week, -25 * 7), out = [];
  const days = [
    [0, [['Flat Bench Press', 'Chest', 62.5, 2.5, 8, 14], ['Overhead Press', 'Shoulders', 37.5, 1.25, 8, 26], ['Incline Dumbbell Press', 'Chest', 22, 1, 10, 26], ['Cable Triceps Pushdown', 'Triceps', 25, 1.25, 12, 26]]],
    [2, [['Conventional Deadlift', 'Hamstrings', 100, 5, 5, 26], ['Barbell Row', 'Lats', 55, 2.5, 8, 26], ['Lat Pulldown', 'Lats', 50, 1.25, 10, 16], ['Barbell Curl', 'Biceps', 25, 0.5, 10, 26]]],
    [4, [['Barbell Back Squat', 'Quadriceps', 80, 2.5, 8, 26], ['Romanian Deadlift', 'Hamstrings', 70, 2.5, 8, 26], ['Standing Calf Raise', 'Calves', 60, 2.5, 12, 26], ['Hanging Leg Raise', 'Abs', 0, 0, 12, 0]]]
  ];
  const best = {};
  for (let w = 0; w < 26; w++) days.forEach(([offset, list], d) => {
    const date = GymLib.addDays(start, w * 7 + offset);
    if (date > today || (w * 3 + d) % 11 === 5 || (w < 9 && d === 1 && w % 3 === 0)) return;
    const prs = [], exercises = list.map(([name, muscle, base, step, reps, cap]) => {
      const kg = base + Math.floor(Math.min(w, cap) / 2) * step, r = reps - (w % 3 === 2 ? 1 : 0);
      if (kg && !(best[name] >= kg)) { if (best[name]) prs.push({ name, kg, reps: r }); best[name] = kg; }
      return { name, muscle, sets: (kg ? [{ kg: kg * 0.5, reps: 8, type: 'warmup' }] : []).concat([{ kg, reps: r }, { kg, reps: r }, { kg, reps: Math.max(1, r - 1) }]) };
    });
    out.push({ date, mins: 52 + (w * 7 + d * 5) % 19, exercises, prs, plan: { name: 'Push / Pull / Legs', day: GymLib.PLAN_TEMPLATES[2].plan[d][0] } });
  });
  return out;
}
function dxSampleContext() { const today = dxToday(); return { sessions: dxSampleSessions(today), today, weekStart: 'mon', weeklyGoal: 3, bodyKg: 78, sample: true }; }
// With six or more finished workouts, the training previews are built from the person's own log.
const DX_MINE_MIN = 6, DX_OWN_PREVIEWS = ['Advanced analytics', 'Smart training insights', 'Performance lab', 'Complete data tools'];
function dxPreviewContext() { return dxSessions().length >= DX_MINE_MIN ? Object.assign(dxContext(), { sample: true, mine: true }) : dxSampleContext(); }
function dxNutritionPreview() {
  const mine = dxNutritionContext(), e = GymLib.energyBalance(mine.intake, mine.weights, mine.today);
  const teaser = e.ready ? '<p class="dx-locked"><span aria-hidden="true">🔒 </span>Your own estimate is ready, built from ' + esc(plural(e.foodDays, 'day')) + ' of food and ' + esc(plural(e.weighIns, 'weigh-in')) + '. It appears here the moment you unlock.</p>' : '';
  return teaser + dxNutritionMarkup(dxNutritionSample());
}
function dxPreviewHtml(name, ctx) {
  if (name === 'Advanced analytics') return dxAnalyticsMarkup(ctx, 12);
  if (name === 'Smart training insights') return dxCoachMarkup(ctx);
  if (name === 'Performance lab') return dxLabMarkup(ctx, ctx.mine ? (dxTopLifts(ctx.sessions, ctx.today, 1)[0] || {}).name : 'Barbell Back Squat');
  if (name === 'Nutrition coach') return dxNutritionPreview();
  if (name === 'Friend challenges') return typeof challengePreviewMarkup === 'function' ? challengePreviewMarkup() : '';
  if (name === 'Complete data tools') return dxDataMarkup(ctx);
  if (name === 'Deluxe customisation') return dxStyleMarkup(true);
  if (name === 'Workout planner') {
    const sample = dxSampleContext(), t = GymLib.PLAN_TEMPLATES[2], plan = { name: t.name, program: { weeks: 8, start: GymLib.addDays(GymLib.weeklySeries([], sample.today, 1, 'mon')[0].week, -35), mode: 'reps', deload: true }, days: t.plan.map(([day, list]) => ({ day, exercises: list.map(([n, sets, reps]) => ({ name: n, sets, reps, kg: 0 })) })) };
    return '<div class="sub-h">A programme in progress</div>' + dxPlanCard(plan, 0, sample.sessions, sample.today, true) +
      '<div class="plan-line"><span>📋 Planned 3 × 8 · ' + esc(fmtWeight(62.5, 2)) + '</span><small class="plan-why is-progress">All 3 sets of 8 at ' + esc(fmtWeight(60, 2)) + ' done last time, so today moves up.</small></div>' +
      '<div class="plan-line"><span>📋 Planned 3 × 10 · ' + esc(fmtWeight(40, 2)) + '</span><small class="plan-why is-hold">Last time 1 of 3 sets reached 10 reps at ' + esc(fmtWeight(40, 2)) + '. Repeat it today before moving on.</small></div>' +
      '<div class="sub-h">Ready-made programmes</div>' + dxTemplateCards(true);
  }
  return '';
}
function renderDeluxePreview(name) {
  const host = $('deluxeModalPreview'), note = $('deluxeModalSample'); if (!host) return;
  const ctx = dxPreviewContext(), html = dxPreviewHtml(name, ctx), own = !!ctx.mine && DX_OWN_PREVIEWS.includes(name);
  host.innerHTML = html; host.hidden = !html;
  if (note) { note.hidden = !html; note.textContent = own ? 'Built from your own log. Unlock to explore every number, every lift and every week.' : 'Sample data. Yours appears here the moment you unlock.'; note.classList.toggle('is-own', own); }
  if (html) dxDrawCards(host, own ? ctx : dxSampleContext());
}
// "Your log is ready": what Deluxe would show this person right now, counted from their own data.
function renderFounderLine(enabled) {
  const el = $('deluxeFounder'); if (!el) return;
  const until = deluxeAccess.founderUntil, open = until && Date.parse(until) > Date.now();
  if (deluxeOwned() && deluxeAccess.founder) { el.hidden = false; el.innerHTML = '<span class="deluxe-pill is-founder">FOUNDING MEMBER</span> You backed Gymplified early. The badge is yours for good. Thank you!'; return; }
  if (!enabled && open && deluxeAccess.salesOpen) { el.hidden = false; el.innerHTML = '<strong>Founding member offer.</strong> Unlock Deluxe by ' + esc(dxLongDay(dayKey(new Date(until)))) + ' and keep a <span class="deluxe-pill is-founder">FOUNDING MEMBER</span> badge on your profile and your friends’ leaderboards, for good.'; return; }
  el.hidden = true; el.textContent = '';
}
// Flash sale: the price, the struck-through list price, the buy buttons and a countdown banner. Everything
// shown comes from the server's status answer; when the end time passes the page quietly returns to the list price.
let dxSaleTimer = null;
function dxSaleCountdown(msLeft) {
  const mins = Math.max(0, Math.ceil(msLeft / 60000)), days = Math.floor(mins / 1440), hours = Math.floor((mins % 1440) / 60);
  return days ? days + 'd ' + hours + 'h left' : hours ? hours + 'h ' + (mins % 60) + 'm left' : mins + 'm left';
}
function renderDeluxeSalePrice(canBuy) {
  const sale = deluxeSaleActive() ? deluxeAccess.sale : null, label = deluxePriceLabel();
  const banner = $('deluxeSale'), was = $('deluxePriceWas'), amount = $('deluxePriceAmount');
  if (amount) amount.textContent = label;
  if (was) was.hidden = !(sale && canBuy);
  ['deluxeBuyBtn', 'deluxeModalBuy'].forEach(id => { const b = $(id); if (b) b.textContent = 'Unlock Deluxe · ' + label; });
  clearTimeout(dxSaleTimer); dxSaleTimer = null;
  if (!banner) return;
  if (!(sale && canBuy)) { banner.hidden = true; banner.textContent = ''; return; }
  const end = Date.parse(sale.endsAt), until = new Date(end).toLocaleString(undefined, { weekday: 'short', hour: 'numeric', minute: '2-digit' });
  banner.hidden = false;
  banner.innerHTML = '<strong>Flash sale: ' + sale.percentOff + '% off.</strong> Ends ' + esc(until) + '. <span class="deluxe-sale-left" aria-hidden="true">' + esc(dxSaleCountdown(end - Date.now())) + '</span>';
  // Re-render each minute, and exactly at the end so an expired sale never lingers on screen.
  dxSaleTimer = setTimeout(renderDeluxeUI, Math.min(60000, Math.max(1000, end - Date.now() + 500)));
}
function renderDeluxeSales(enabled) {
  const sales = $('deluxeSales'), ready = $('deluxeReady');
  renderFounderLine(enabled);
  if (sales) sales.hidden = !!enabled;
  if (!ready || enabled) return;
  const sessions = dxSessions();
  if (sessions.length < 3) { ready.hidden = true; return; }
  const today = dxToday(), n = dxNutritionContext(), energy = GymLib.energyBalance(n.intake, n.weights, n.today), lifts = GymLib.exerciseNames(sessions).length, notes = GymLib.coachInsights(sessions, today, { weekStart: dxWeekStart(), weeklyGoal: state.weeklyGoal }).length, tracked = GymLib.liftTrends(sessions, today, 84).length;
  ready.hidden = false;
  ready.innerHTML = '<strong>Your log is ready for it.</strong> <span>' + esc(plural(sessions.length, 'workout')) + ' and ' + esc(plural(lifts, 'lift')) + ' on record: enough for ' + esc(plural(notes, 'coach note')) + (tracked ? ', ' + esc(plural(tracked, 'lift trend')) : '') + ', a strength curve for every exercise' + (energy.ready ? ' and your real maintenance calories' : '') + ', the moment you unlock.</span>';
}

// ---------- actions ----------
const DELUXE_ACTIONS = Object.freeze({
  setTab: el => setDeluxeTab(el.dataset.arg, true),
  setRange: el => { const n = Number(el.dataset.arg); if (DX_RANGES.includes(n)) { dxRange = n; renderDeluxeTools(deluxeEnabled()); } },
  setLift: el => { dxLift = el.value; renderDeluxeTools(deluxeEnabled()); },
  saveGoal: () => saveGoal(), removeGoal: () => removeGoal(), openGoal: el => openGoal(Number(el.dataset.arg)),
  useTemplate: el => useTemplate(el.dataset.arg), restartPlan: el => restartPlan(Number(el.dataset.i)), syncPlanProgramFields: () => syncPlanProgramFields(),
  shareShareCard: () => shareShareCard(), downloadShareCard: () => downloadShareCard(), exportDeluxeReport: () => exportDeluxeReport(), exportDeluxeCSV: () => exportDeluxeCSV(), exportDeluxeLifts: () => exportDeluxeLifts(),
  setSkin: el => setSkin(el), setConfetti: el => setConfetti(el), setFlair: el => setFlair(el),
  setNutritionGoal: el => setNutritionGoal(el), setNutritionRate: el => setNutritionRate(el), applyNutritionTargets: () => applyNutritionTargets()
});
function bindDeluxeActions() {
  [['click', 'data-dx'], ['change', 'data-dx-change']].forEach(([type, attr]) => {
    document.addEventListener(type, e => {
      const el = e.target && e.target.closest ? e.target.closest('[' + attr + ']') : null; if (!el) return;
      const name = el.getAttribute(attr), run = Object.prototype.hasOwnProperty.call(DELUXE_ACTIONS, name) ? DELUXE_ACTIONS[name] : null;
      if (!run) { console.warn('Unknown Deluxe action:', name); return; }
      run(el, e);
    });
  });
  // Arrow keys move between the tool tabs, as in any tab list.
  $('dxTabs')?.addEventListener('keydown', e => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
    const i = DX_TABS.findIndex(t => t.id === dxTab), n = DX_TABS.length, to = e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : (i + (e.key === 'ArrowRight' ? 1 : -1) + n) % n;
    e.preventDefault(); setDeluxeTab(DX_TABS[to].id, true);
  });
  // Chart read-out: the numbers behind the bar or point under the pointer.
  const readout = e => {
    const pt = e.target && e.target.closest ? e.target.closest('.dx-pt') : null, block = pt && pt.closest('.dx-block'), out = block && block.querySelector('.dx-readout');
    if (out) out.textContent = pt.dataset.tip || out.dataset.default || '';
  };
  document.addEventListener('pointerover', readout); document.addEventListener('click', readout);
}
bindDeluxeActions();
// app.js rendered once before this file loaded; bring the theme and the Deluxe screen up to date.
applySettings();
renderDeluxeUI();
