// Gymplified release 13 features. Loaded after app.js, so it can use the app's state and helpers.
// Pure logic lives in lib.js (GymLib); this file is the UI around it.
// Markup here never uses inline handlers or inline styles. Buttons name an action with data-plus
// (clicks), data-plus-change, data-plus-input or data-plus-submit, and only PLUS_ACTIONS can run.

const plusNum = v => Number(v);
let plusDialogState = null;

// ---------- small helpers ----------
function unitPerKg() { return weightUnit() === 'lb' ? 1 / KG_PER_LB : 1; }
function fmtDayLong(key) { const d = new Date(key + 'T12:00:00'); return Number.isFinite(d.getTime()) ? d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : key; }
function fmtMonth(key) { const d = new Date(key + '-15T12:00:00'); return d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' }); }
function plural(n, word) { return n + ' ' + word + (n === 1 ? '' : 's'); }
function extras() { if (!state.extras || typeof state.extras !== 'object') state.extras = GymLib.sanitizeExtras({}); return state.extras; }
function saveQuiet() { persistLocalState(); queueCloudStateSave(); }
function openPlusDialog(title, bodyHtml, kind) {
  const dialog = $('plusDialog'); if (!dialog) return;
  $('plusDialogTitle').textContent = title; $('plusDialogBody').innerHTML = bodyHtml; dialog.dataset.kind = kind || '';
  if (!dialog.open) { try { dialog.showModal(); } catch (e) { return; } }
  $('plusDialogTitle').focus({ preventScroll: true });
}
function closePlusDialog() { const dialog = $('plusDialog'); if (dialog && dialog.open) dialog.close(); plusDialogState = null; }
async function shareOrCopy(title, text, copiedMessage) {
  try { if (navigator.share) { await navigator.share({ title, text }); return; } } catch (e) { if (e && e.name === 'AbortError') return; }
  try { await navigator.clipboard.writeText(text); showToast(copiedMessage || 'Copied'); } catch (e) { showToast('Sharing is not available in this browser'); }
}

// ================= Workout: card tools (B7, B8, B9, B10, B11, B12, B17) =================
const overloadDismissed = new Set();
function previousExerciseNote(name) {
  const key = String(name || '').trim().toLowerCase();
  for (const session of state.sessions || []) {
    const ex = (session.exercises || []).find(x => String(x.name || '').trim().toLowerCase() === key);
    if (ex) return ex.notes ? { note: ex.notes, date: session.date } : null;
  }
  return null;
}
function overloadFor(w) {
  // A programme target that already adapted to last session (w.plan.adapt) says the same thing, so only one shows.
  if (state.settings.overload === false || overloadDismissed.has(w.id) || w.setList.some(x => x.done) || (w.plan && w.plan.adapt)) return null;
  const previous = previousExercisePerformance(w.name); if (!previous) return null;
  const stepKg = displayToKg(weightStep());
  return GymLib.overloadSuggestion(previous.sets, { stepKg, topReps: state.settings.overloadReps || 8 });
}
function supersetLabelMarkup(w, i) {
  if (!w.group) return '';
  const b = GymLib.groupBounds(state.workouts, i);
  if (b.start === b.end) return '';
  return '<div class="superset-tag"><span aria-hidden="true">🔗 </span>Superset · ' + (i - b.start + 1) + ' of ' + (b.end - b.start + 1) + (i < b.end ? ' · no rest, go straight to the next exercise' : ' · rest after this one') + '</div>';
}
function exerciseCardExtras(w, i) {
  const last = state.workouts.length - 1, next = state.workouts[i + 1], linked = !!(w.group && next && next.group === w.group);
  const name = esc(w.name), at = ' data-i="' + i + '"';
  const suggestion = overloadFor(w), prevNote = previousExerciseNote(w.name);
  const hasWarmup = w.setList.some(x => setTypeOf(x) === 'warmup');
  let html = '<div class="ex-tools" role="group" aria-label="Tools for ' + name + '">' +
    '<button type="button" class="btn" data-plus="moveExercise" data-dir="-1"' + at + (i === 0 ? ' disabled' : '') + ' aria-label="Move ' + name + ' up">↑</button>' +
    '<button type="button" class="btn" data-plus="moveExercise" data-dir="1"' + at + (i === last ? ' disabled' : '') + ' aria-label="Move ' + name + ' down">↓</button>' +
    (next ? '<button type="button" class="btn" data-plus="toggleSuperset"' + at + ' aria-pressed="' + linked + '">' + (linked ? '⛓ Unlink superset' : '🔗 Superset with next') + '</button>' : '') +
    '<button type="button" class="btn" data-plus="openPlates"' + at + ' aria-label="Plate calculator for ' + name + '">🏋 Plates</button>' +
    (hasWarmup ? '' : '<button type="button" class="btn" data-plus="addWarmups"' + at + ' aria-label="Add warm-up sets for ' + name + '">＋ Warm-up sets</button>') +
    '</div>';
  if (suggestion) {
    html += '<div class="overload-hint" role="note"><span><strong>Next step:</strong> ' + esc(fmtWeight(suggestion.kg, 2)) + ' × ' + suggestion.reps +
      ' <span class="sub">(' + (suggestion.action === 'weight' ? 'last time ' + esc(suggestion.why) + ', so add weight' : esc(suggestion.why)) + ')</span></span>' +
      '<span class="row-wrap"><button type="button" class="btn" data-plus="applyOverload"' + at + '>Use it</button><button type="button" class="btn" data-plus="dismissOverload"' + at + ' aria-label="Hide this suggestion for ' + name + '">Hide</button></span></div>';
  }
  html += '<details class="ex-note"' + (w.note ? ' open' : '') + '><summary>Note' + (w.note ? ' ✎' : '') + '</summary>' +
    (prevNote ? '<p class="sub">Last time (' + esc(prevNote.date) + '): ' + esc(prevNote.note) + '</p>' : '') +
    '<label class="sr" for="exNote-' + i + '">Note for ' + name + '</label><textarea id="exNote-' + i + '" rows="2" maxlength="300" placeholder="Seat height, grip, how it felt…" data-plus-change="setExerciseNote"' + at + '>' + esc(w.note || '') + '</textarea></details>';
  return html;
}
function setRowExtras(w, i, j, x, n) {
  if (!state.settings.showRpe) return '';
  const cur = Number(x.rpe) || 0, options = [0, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10];
  return '<label class="set-rpe">Effort (RPE) <select data-plus-change="setRpe" data-i="' + i + '" data-j="' + j + '" aria-label="' + esc(w.name) + ' set ' + n + ' effort, RPE">' +
    options.map(v => '<option value="' + v + '"' + (v === cur ? ' selected' : '') + '>' + (v ? v : '–') + '</option>').join('') + '</select></label>';
}
function sessionNoteMarkup() {
  return '<label class="session-note" for="sessionNoteInput">Workout note <input type="text" id="sessionNoteInput" maxlength="300" value="' + esc(state.session && state.session.note || '') + '" placeholder="How did it go? Saved with this workout." data-plus-change="setSessionNote"></label>';
}
function refocusTool(action, i, dir) {
  const el = document.querySelector('#trainingLogList [data-plus="' + action + '"][data-i="' + i + '"]' + (dir ? '[data-dir="' + dir + '"]' : ''));
  if (el && !el.disabled) el.focus({ preventScroll: true });
  else { const other = document.querySelector('#trainingLogList [data-plus="' + action + '"][data-i="' + i + '"]:not([disabled])'); if (other) other.focus({ preventScroll: true }); }
}
function moveExercise(i, dir) {
  const to = i + (dir < 0 ? -1 : 1); if (!state.workouts[i] || !state.workouts[to]) return;
  state.workouts = GymLib.normaliseGroups(GymLib.moveItem(state.workouts, i, to));
  activeStepRow = null; refreshTraining(); refocusTool('moveExercise', to, String(dir < 0 ? -1 : 1));
  showToast(state.workouts[to].name + ' moved ' + (dir < 0 ? 'up' : 'down'));
}
function toggleSuperset(i) {
  const w = state.workouts[i], next = state.workouts[i + 1]; if (!w || !next) return;
  if (w.group && next.group === w.group) {
    // Split here: everything after this exercise leaves the group (lone leftovers are cleared).
    const end = GymLib.groupBounds(state.workouts, i).end, fresh = newRecordId('ss');
    for (let k = i + 1; k <= end; k++) state.workouts[k].group = fresh;
    GymLib.normaliseGroups(state.workouts); refreshTraining(); refocusTool('toggleSuperset', i); showToast('Superset unlinked');
    return;
  }
  const a = GymLib.groupBounds(state.workouts, i), b = GymLib.groupBounds(state.workouts, i + 1);
  if ((a.end - a.start + 1) + (b.end - b.start + 1) > 4) return showToast('A superset can hold up to 4 exercises');
  const gid = w.group || newRecordId('ss');
  for (let k = a.start; k <= b.end; k++) state.workouts[k].group = gid;
  refreshTraining(); refocusTool('toggleSuperset', i);
  showToast('Superset: rest starts after ' + state.workouts[b.end].name);
}
function addWarmups(i) {
  const w = state.workouts[i]; if (!w) return;
  const working = w.setList.find(x => setTypeOf(x) !== 'warmup' && Number(x.kg) > 0);
  if (!working) return showToast('Enter your working weight first, then add warm-up sets');
  const sets = GymLib.warmupSets(kgToDisplay(working.kg, 2), weightStep()).map(s => ({ kg: Math.round(displayToKg(s.kg) * 1000) / 1000, reps: s.reps, type: 'warmup', done: false, auto: false }));
  if (!sets.length) return showToast('That weight is too light to need warm-up sets');
  if (w.setList.length + sets.length > 50) return showToast('An exercise can have up to 50 sets');
  w.setList = sets.concat(w.setList); syncW(w); activeStepRow = null; refreshTraining();
  showToast(plural(sets.length, 'warm-up set') + ' added. They don’t count towards volume.');
}
function applyOverload(i) {
  const w = state.workouts[i], s = w && overloadFor(w); if (!s) return;
  w.setList.forEach(x => { if (x.done || setTypeOf(x) === 'warmup') return; x.kg = s.kg; x.reps = s.reps; x.auto = false; });
  overloadDismissed.add(w.id); syncW(w); refreshTraining(); showToast('Set to ' + fmtWeight(s.kg, 2) + ' × ' + s.reps);
}
function dismissOverload(i) { const w = state.workouts[i]; if (!w) return; overloadDismissed.add(w.id); refreshTraining(); }
function setExerciseNote(el) {
  const w = state.workouts[plusNum(el.dataset.i)]; if (!w) return;
  w.note = safeStateText(el.value, '', 300); saveQuiet();
}
function setSessionNote(el) { if (!state.session) return; state.session.note = safeStateText(el.value, '', 300); saveQuiet(); }
function setRpe(el) {
  const w = state.workouts[plusNum(el.dataset.i)], x = w && w.setList[plusNum(el.dataset.j)]; if (!x) return;
  const v = Number(el.value); x.rpe = v >= 6 && v <= 10 ? v : 0; saveQuiet();
}

// ---------- B11: plate calculator ----------
function gearForUnit() {
  const unit = weightUnit(), g = state.settings.gear || {};
  if (g.unit === unit && g.plates && g.plates.length) return { unit, bar: g.bar, plates: g.plates };
  return { unit, bar: unit === 'lb' ? 45 : 20, plates: unit === 'lb' ? GymLib.DEFAULT_PLATES_LB.slice() : GymLib.DEFAULT_PLATES_KG.slice() };
}
function plateResultMarkup(target, gear) {
  const r = GymLib.platesPerSide(target, gear.bar, gear.plates), u = gear.unit;
  if (r.belowBar) return '<p class="sub">That is lighter than the ' + gear.bar + ' ' + u + ' bar. Use a lighter bar or dumbbells.</p>';
  if (!r.perSide.length) return '<p><strong>Just the bar</strong> (' + gear.bar + ' ' + u + ').</p>';
  const chips = r.perSide.map(p => Array.from({ length: p.count }, () => '<span class="plate-chip plate-' + String(p.plate).replace('.', '-') + '">' + p.plate + '</span>').join('')).join('');
  return '<p class="plate-line"><strong>Each side:</strong> ' + r.perSide.map(p => (p.count > 1 ? p.count + ' × ' : '') + p.plate + ' ' + u).join(' + ') + '</p>' +
    '<div class="plate-row" aria-hidden="true"><span class="plate-bar"></span>' + chips + '</div>' +
    (r.ok ? '' : '<p class="sub">Closest you can load is ' + r.loaded + ' ' + u + ' (' + (Math.round(r.remainder * 2 * 100) / 100) + ' ' + u + ' short with these plates).</p>');
}
function plateDialogBody() {
  const s = plusDialogState, gear = s.gear, all = gear.unit === 'lb' ? GymLib.DEFAULT_PLATES_LB : GymLib.DEFAULT_PLATES_KG;
  return '<p>Shows what to put on each side of the bar.</p>' +
    '<div class="plus-form-row"><label for="plateTarget">Total weight (' + gear.unit + ')<input type="number" id="plateTarget" inputmode="decimal" min="0" step="0.5" value="' + s.target + '" data-plus-input="plateInput"></label>' +
    '<label for="plateBar">Bar (' + gear.unit + ')<input type="number" id="plateBar" inputmode="decimal" min="0" max="100" step="0.5" value="' + gear.bar + '" data-plus-input="plateInput"></label></div>' +
    '<fieldset class="plate-set"><legend>Plates your gym has</legend>' + all.map(p => '<label class="rest-check"><input type="checkbox" value="' + p + '"' + (gear.plates.includes(p) ? ' checked' : '') + ' data-plus-change="plateInput"> ' + p + '</label>').join('') + '</fieldset>' +
    '<div id="plateResult" role="status" aria-live="polite">' + plateResultMarkup(s.target, gear) + '</div>';
}
function openPlates(i) {
  const w = state.workouts[i]; if (!w) return;
  const pick = w.setList.find(x => !x.done && setTypeOf(x) !== 'warmup' && Number(x.kg) > 0) || w.setList.find(x => Number(x.kg) > 0);
  plusDialogState = { kind: 'plates', gear: gearForUnit(), target: pick ? kgToDisplay(pick.kg, 2) : 0 };
  openPlusDialog('Plate calculator · ' + w.name, plateDialogBody(), 'plates');
}
function plateInput() {
  const s = plusDialogState; if (!s || s.kind !== 'plates') return;
  s.target = Math.max(0, Number($('plateTarget').value) || 0);
  s.gear.bar = Math.max(0, Math.min(100, Number($('plateBar').value) || 0));
  s.gear.plates = [...document.querySelectorAll('#plusDialogBody .plate-set input:checked')].map(c => Number(c.value));
  $('plateResult').innerHTML = plateResultMarkup(s.target, s.gear);
  state.settings.gear = GymLib.sanitizeGear({ unit: s.gear.unit, bar: s.gear.bar, plates: s.gear.plates }); saveQuiet();
}

// ---------- B20: quick add ("bench 60x8x3" + Enter) ----------
function quickAddFromSearch(value) {
  const parsed = GymLib.parseQuickAdd(value); if (!parsed) return false;
  const alias = GymLib.quickAlias(parsed.name), all = allEx();
  const match = (alias && all.find(x => x.name === alias)) || all.find(x => x.name.toLowerCase() === parsed.name.toLowerCase()) || searchExercises(all, parsed.name, isFavEx, recentExerciseRanks())[0];
  if (!match) { showToast('No exercise matches “' + parsed.name + '”. Try a different name.'); return true; }
  const unit = parsed.unit || weightUnit(), kg = Math.min(1000, Math.round(parsed.weight * (unit === 'lb' ? KG_PER_LB : 1) * 1000) / 1000);
  const setList = Array.from({ length: parsed.sets }, () => ({ kg, reps: parsed.reps, type: 'normal', done: false, auto: false }));
  state.workouts.push(syncW({ name: match.name, muscle: cap(match.pm), setList }));
  $('exSearch').value = ''; refreshTraining(); renderPicker();
  showToast(match.name + ' added: ' + parsed.sets + ' × ' + parsed.reps + ' at ' + fmtWeight(kg, 2));
  return true;
}

// ================= Workout history: repeat and edit (B13, B14) =================
function historyToolsMarkup(session, i) {
  const notes = (session.exercises || []).filter(ex => ex.notes).map(ex => '<li><strong>' + esc(ex.name) + ':</strong> ' + esc(ex.notes) + '</li>').join('');
  return (session.notes ? '<p class="history-note"><strong>Note:</strong> ' + esc(session.notes) + '</p>' : '') + (notes ? '<ul class="history-notes">' + notes + '</ul>' : '') +
    ((session.exercises || []).length ? '<div class="row-wrap history-tools"><button type="button" class="btn btn-primary" data-plus="repeatSession" data-i="' + i + '">↻ Repeat this workout</button><button type="button" class="btn" data-plus="editSession" data-i="' + i + '">✎ Edit sets</button></div>' : '');
}
function repeatSession(i) {
  const session = state.sessions[i]; if (!session || !(session.exercises || []).length) return;
  if (state.workouts.length && !confirm('Replace today’s workout with the one from ' + session.date + '?')) return;
  (state.workouts || []).forEach(x => markRecordDeleted('workouts', x));
  state.workouts = session.exercises.map(ex => syncW({ name: ex.name, muscle: ex.muscle || '', setList: (ex.sets || []).slice(0, 50).map(s => ({ kg: Number(s.kg) || 0, reps: Math.max(1, Math.round(Number(s.reps)) || 1), type: setTypeOf(s), done: false, auto: true })) })).filter(w => w.setList.length);
  saveState(); showToast('Workout from ' + session.date + ' loaded. Values are suggestions until you tick a set.');
  const list = $('trainingLogList'); if (list) list.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' });
}
function sessionEditBody() {
  const d = plusDialogState.draft, u = weightUnit();
  return '<p>Fix a mistake or add what you forgot. Totals update when you save.</p>' +
    d.exercises.map((ex, e) => '<fieldset class="edit-ex"><legend>' + esc(ex.name) + '</legend>' +
      ex.sets.map((s, k) => '<div class="edit-set"><span class="sub">Set ' + (k + 1) + (s.type === 'warmup' ? ' (W)' : '') + '</span>' +
        '<input type="number" inputmode="decimal" min="0" step="0.5" value="' + kgToDisplay(s.kg, 2) + '" aria-label="' + esc(ex.name) + ' set ' + (k + 1) + ' weight in ' + weightUnitName() + '" data-plus-change="editSessionField" data-field="kg" data-e="' + e + '" data-k="' + k + '"><span class="sub">' + u + ' ×</span>' +
        '<input type="number" inputmode="numeric" min="1" step="1" value="' + (Number(s.reps) || 0) + '" aria-label="' + esc(ex.name) + ' set ' + (k + 1) + ' reps" data-plus-change="editSessionField" data-field="reps" data-e="' + e + '" data-k="' + k + '">' +
        '<button type="button" class="btn btn-icon-only" data-plus="editSessionRemoveSet" data-e="' + e + '" data-k="' + k + '" aria-label="Remove set ' + (k + 1) + ' of ' + esc(ex.name) + '">−</button></div>').join('') +
      '<div class="row-wrap"><button type="button" class="btn" data-plus="editSessionAddSet" data-e="' + e + '">+ Set</button><button type="button" class="btn" data-plus="editSessionRemoveEx" data-e="' + e + '">Remove exercise</button></div></fieldset>').join('') +
    '<div class="plus-form-row"><label for="editSessionNewEx">Add an exercise<input type="text" id="editSessionNewEx" list="editSessionExList" maxlength="80" placeholder="Start typing a name"></label><button type="button" class="btn" data-plus="editSessionAddEx">Add</button></div>' +
    '<datalist id="editSessionExList">' + allEx().map(x => '<option value="' + esc(x.name) + '">').join('') + '</datalist>' +
    '<div class="app-dialog-actions"><button type="button" class="btn" data-plus="closeDialog">Cancel</button><button type="button" class="btn btn-primary" data-plus="editSessionSave">Save changes</button></div>';
}
function editSession(i) {
  const session = state.sessions[i]; if (!session) return;
  plusDialogState = { kind: 'session', index: i, id: session.id, draft: { exercises: JSON.parse(JSON.stringify(session.exercises || [])) } };
  openPlusDialog('Edit workout · ' + session.date, sessionEditBody(), 'session');
}
function redrawSessionEdit() { $('plusDialogBody').innerHTML = sessionEditBody(); }
function editSessionField(el) {
  const s = plusDialogState; if (!s || s.kind !== 'session') return;
  const set = s.draft.exercises[plusNum(el.dataset.e)]?.sets[plusNum(el.dataset.k)]; if (!set) return;
  const n = Number(el.value); if (!Number.isFinite(n) || n < 0) return;
  if (el.dataset.field === 'kg') set.kg = Math.min(1000, Math.round(displayToKg(n) * 1000) / 1000); else set.reps = Math.max(1, Math.min(1000, Math.round(n)));
}
function editSessionAddSet(e) { const ex = plusDialogState.draft.exercises[e]; if (!ex || ex.sets.length >= 50) return; const l = ex.sets[ex.sets.length - 1] || { kg: 0, reps: 10 }; ex.sets.push({ id: newRecordId('session-set'), kg: l.kg, reps: l.reps, type: 'normal', duration: 0, distance: 0, notes: '', order: ex.sets.length + 1 }); redrawSessionEdit(); }
function editSessionRemoveSet(e, k) { const ex = plusDialogState.draft.exercises[e]; if (!ex) return; ex.sets.splice(k, 1); redrawSessionEdit(); }
function editSessionRemoveEx(e) { plusDialogState.draft.exercises.splice(e, 1); redrawSessionEdit(); }
function editSessionAddEx() {
  const field = $('editSessionNewEx'), name = field.value.trim(); if (!name) return showToast('Type an exercise name first');
  const d = plusDialogState.draft; if (d.exercises.length >= 100) return;
  const match = allEx().find(x => x.name.toLowerCase() === name.toLowerCase()) || searchExercises(allEx(), name, isFavEx, recentExerciseRanks())[0];
  if (!match) return showToast('No exercise matches “' + name + '”');
  d.exercises.push({ id: newRecordId('session-ex'), name: match.name, muscle: cap(match.pm), notes: '', sets: [{ id: newRecordId('session-set'), kg: 0, reps: 10, type: 'normal', duration: 0, distance: 0, notes: '', order: 1 }] });
  redrawSessionEdit();
}
function editSessionSave() {
  const s = plusDialogState; if (!s || s.kind !== 'session') return;
  const session = state.sessions.find(x => x.id === s.id); if (!session) return closePlusDialog();
  const exercises = s.draft.exercises.filter(ex => ex.sets.length);
  if (!exercises.length) return showToast('A workout needs at least one set. Delete is not available here.');
  session.exercises = exercises; Object.assign(session, GymLib.sessionTotals(session));
  if (state.lastSummary && state.lastSummary.id === session.id) state.lastSummary = null;
  closePlusDialog(); saveState(); showToast('Workout updated');
}

// ================= Routines: tags, editor, starter pack (B28, B29, B31) =================
let routineTagFilter = '';
function renderRoutinesPlus(host) {
  state.routines = (Array.isArray(state.routines) ? state.routines : []).filter(r => r && typeof r === 'object').map((r, i) => ({ id: String(r.id || 'legacy-routine-' + i), name: String(r.name || 'Saved routine'), tag: String(r.tag || ''), createdAt: String(r.createdAt || ''), exercises: Array.isArray(r.exercises) ? r.exercises : [] }));
  const routines = state.routines, tags = [...new Set(routines.map(r => r.tag).filter(Boolean))].sort();
  if (routineTagFilter && !tags.includes(routineTagFilter)) routineTagFilter = '';
  const shown = routines.map((r, i) => ({ r, i })).filter(x => !routineTagFilter || x.r.tag === routineTagFilter);
  const chips = tags.length ? '<div class="row-wrap routine-tags" role="group" aria-label="Filter routines by tag">' + [''].concat(tags).map(t => '<button type="button" class="btn chip" data-plus="filterRoutines" data-arg="' + esc(t) + '" aria-pressed="' + (routineTagFilter === t) + '">' + (t ? esc(t) : 'All') + '</button>').join('') + '</div>' : '';
  const list = shown.length ? '<ul class="routine-list">' + shown.map(({ r, i }) => '<li class="routine-item"><div><strong>' + esc(r.name) + '</strong>' + (r.tag ? ' <span class="badge">' + esc(r.tag) + '</span>' : '') + '<br><small class="sub">' + esc(r.exercises.slice(0, 4).map(e => e.name).join(', ')) + (r.exercises.length > 4 ? ' +' + (r.exercises.length - 4) + ' more' : '') + '</small></div>' +
    '<div class="row-wrap"><button type="button" class="btn btn-primary" data-action="loadSavedRoutine" data-i="' + i + '">Load</button><button type="button" class="btn" data-plus="editRoutine" data-i="' + i + '" aria-label="Edit ' + esc(r.name) + '">Edit</button><button type="button" class="btn btn-icon-only" aria-label="Delete ' + esc(r.name) + '" data-action="deleteSavedRoutine" data-i="' + i + '">×</button></div></li>').join('') + '</ul>'
    : '<p class="sub">Save your favourite workout combinations here so you can reuse them anytime.</p>';
  const starters = '<details class="starter-pack"><summary>Starter routines</summary><p class="sub">Generic examples to get going. They are not personal advice: adjust exercises, sets and weights to suit you.</p><ul class="routine-list">' +
    GymLib.STARTER_ROUTINES.map((r, i) => '<li class="routine-item"><div><strong>' + esc(r.name) + '</strong> <span class="badge">' + esc(r.tag) + '</span><br><small class="sub">' + esc(r.exercises.map(e => e[0] + ' ' + e[1] + '×' + e[2]).join(' · ')) + '</small><br><small class="sub">' + esc(r.note) + '</small></div><div class="row-wrap"><button type="button" class="btn" data-plus="loadStarter" data-i="' + i + '" aria-label="Load ' + esc(r.name) + ' into today’s workout">Load</button></div></li>').join('') + '</ul></details>';
  host.innerHTML = (routines.length ? '<div class="sub-h">Saved routines</div>' : '') + chips + list + starters;
}
function filterRoutines(tag) { routineTagFilter = tag || ''; renderRoutineLibrary(); const b = document.querySelector('.routine-tags [aria-pressed="true"]'); if (b) b.focus({ preventScroll: true }); }
function loadStarter(i) {
  const r = GymLib.STARTER_ROUTINES[i]; if (!r) return;
  if (state.workouts.length && !confirm('Replace your current workout with “' + r.name + '”?')) return;
  (state.workouts || []).forEach(x => markRecordDeleted('workouts', x));
  state.workouts = r.exercises.map(([name, sets, reps]) => {
    const ex = allEx().find(x => x.name === name), suggested = suggestedSetsFor(name);
    // Weights come from your own history when there is any; otherwise they start empty for you to fill in.
    const setList = Array.from({ length: sets }, (_, k) => ({ kg: suggested.fromHistory ? (suggested.sets[Math.min(k, suggested.sets.length - 1)].kg || 0) : 0, reps, type: 'normal', done: false, auto: true }));
    return syncW({ name, muscle: ex ? cap(ex.pm) : '', setList });
  });
  saveState(); showToast(r.name + ' loaded. Set your own weights.');
}
function routineEditBody() {
  const d = plusDialogState.draft;
  return '<div class="plus-form-row"><label for="routineName">Name<input type="text" id="routineName" maxlength="40" value="' + esc(d.name) + '" data-plus-change="routineField" data-field="name"></label>' +
    '<label for="routineTag">Tag (optional)<input type="text" id="routineTag" maxlength="24" list="routineTagList" value="' + esc(d.tag) + '" placeholder="Push, Pull, Legs…" data-plus-change="routineField" data-field="tag"></label></div>' +
    '<datalist id="routineTagList">' + ['Push', 'Pull', 'Legs', 'Upper', 'Lower', 'Full body'].map(t => '<option value="' + t + '">').join('') + '</datalist>' +
    '<ol class="routine-edit-list">' + d.exercises.map((ex, e) => '<li><strong>' + esc(ex.name) + '</strong><div class="edit-set">' +
      '<label>Sets<input type="number" inputmode="numeric" min="1" max="20" value="' + ex.setList.length + '" data-plus-change="routineSets" data-e="' + e + '" aria-label="Sets of ' + esc(ex.name) + '"></label>' +
      '<label>Reps<input type="number" inputmode="numeric" min="1" max="100" value="' + (Number(ex.setList[0] && ex.setList[0].reps) || 10) + '" data-plus-change="routineReps" data-e="' + e + '" aria-label="Reps of ' + esc(ex.name) + '"></label>' +
      '<button type="button" class="btn" data-plus="routineMove" data-e="' + e + '" data-dir="-1"' + (e === 0 ? ' disabled' : '') + ' aria-label="Move ' + esc(ex.name) + ' up">↑</button>' +
      '<button type="button" class="btn" data-plus="routineMove" data-e="' + e + '" data-dir="1"' + (e === d.exercises.length - 1 ? ' disabled' : '') + ' aria-label="Move ' + esc(ex.name) + ' down">↓</button>' +
      '<button type="button" class="btn btn-icon-only" data-plus="routineRemoveEx" data-e="' + e + '" aria-label="Remove ' + esc(ex.name) + '">×</button></div></li>').join('') + '</ol>' +
    '<div class="app-dialog-actions"><button type="button" class="btn" data-plus="closeDialog">Cancel</button><button type="button" class="btn btn-primary" data-plus="routineSave">Save routine</button></div>';
}
function editRoutine(i) { const r = state.routines[i]; if (!r) return; plusDialogState = { kind: 'routine', id: r.id, draft: JSON.parse(JSON.stringify({ name: r.name, tag: r.tag || '', exercises: r.exercises })) }; plusDialogState.draft.exercises.forEach(ex => { if (!Array.isArray(ex.setList) || !ex.setList.length) ex.setList = [{ kg: 0, reps: 10, done: false }]; }); openPlusDialog('Edit routine', routineEditBody(), 'routine'); }
function routineField(el) { const d = plusDialogState && plusDialogState.draft; if (!d) return; d[el.dataset.field === 'tag' ? 'tag' : 'name'] = el.value.trim().slice(0, el.dataset.field === 'tag' ? 24 : 40); }
function routineSets(el) { const ex = plusDialogState.draft.exercises[plusNum(el.dataset.e)]; if (!ex) return; const n = Math.max(1, Math.min(20, Math.round(Number(el.value)) || 1)), last = ex.setList[ex.setList.length - 1]; while (ex.setList.length < n) ex.setList.push({ id: newRecordId('routine-set'), kg: Number(last.kg) || 0, reps: Number(last.reps) || 10, done: false }); ex.setList.length = n; el.value = n; }
function routineReps(el) { const ex = plusDialogState.draft.exercises[plusNum(el.dataset.e)]; if (!ex) return; const n = Math.max(1, Math.min(100, Math.round(Number(el.value)) || 1)); ex.setList.forEach(s => { s.reps = n; }); el.value = n; }
function routineMove(e, dir) { const d = plusDialogState.draft; d.exercises = GymLib.moveItem(d.exercises, e, e + dir); $('plusDialogBody').innerHTML = routineEditBody(); const b = document.querySelector('#plusDialogBody [data-plus="routineMove"][data-e="' + (e + dir) + '"][data-dir="' + dir + '"]:not([disabled])') || document.querySelector('#plusDialogBody [data-plus="routineMove"][data-e="' + (e + dir) + '"]:not([disabled])'); if (b) b.focus(); }
function routineRemoveEx(e) { plusDialogState.draft.exercises.splice(e, 1); $('plusDialogBody').innerHTML = routineEditBody(); }
function routineSave() {
  const s = plusDialogState; if (!s || s.kind !== 'routine') return;
  const r = state.routines.find(x => x.id === s.id); if (!r) return closePlusDialog();
  if (!s.draft.name) return showToast('Give the routine a name');
  if (!s.draft.exercises.length) return showToast('A routine needs at least one exercise');
  r.name = s.draft.name; r.tag = s.draft.tag; r.exercises = s.draft.exercises;
  closePlusDialog(); saveState(); showToast('Routine saved');
}

// ================= Progress screen (G4, G7, G9, F12, G10) =================
let reportMonth = '';
function calendarMarkup(weeks, compact) {
  const start = state.settings.weekStart === 'sun' ? 0 : 1, names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const rows = GymLib.calendarWeeks(state.sessions, dayKey(), weeks, state.settings.weekStart);
  const head = '<div class="cal-head" aria-hidden="true">' + Array.from({ length: 7 }, (_, d) => '<span>' + names[(start + d) % 7].charAt(0) + '</span>').join('') + '</div>';
  const body = rows.map(row => '<div class="cal-week">' + row.map(c => c.future ? '<span class="cal-day cal-future" aria-hidden="true"></span>'
    : '<button type="button" class="cal-day cal-l' + c.level + (c.day === dayKey() ? ' cal-today' : '') + '" data-plus="openCalendarDay" data-day="' + c.day + '" aria-label="' + esc(fmtDayLong(c.day)) + ': ' + (c.count ? plural(c.count, 'workout') + ', ' + volumeNumber(c.vol) + ' ' + weightUnitName() : 'no workout') + '">' + (c.count ? '<span aria-hidden="true">' + (compact ? '•' : new Date(c.day + 'T12:00:00').getDate()) + '</span>' : (compact ? '' : '<span aria-hidden="true" class="cal-num">' + new Date(c.day + 'T12:00:00').getDate() + '</span>')) + '</button>').join('') + '</div>').join('');
  return '<div class="cal-grid' + (compact ? ' cal-compact' : '') + '">' + head + body + '</div>';
}
function renderProgressCalendar() {
  const host = $('progressCalendar'); if (!host) return;
  const weeks = 16, rows = GymLib.calendarWeeks(state.sessions, dayKey(), weeks, state.settings.weekStart), flat = rows.flat();
  const total = flat.reduce((n, c) => n + c.count, 0), activeWeeks = rows.filter(r => r.some(c => c.count)).length;
  host.innerHTML = '<div class="section-title"><span>Training calendar</span><span class="sub">Last ' + weeks + ' weeks</span></div>' +
    '<p class="sub">' + (total ? plural(total, 'workout') + ' across ' + plural(activeWeeks, 'week') + '. Darker days had more volume. Tap a day to see it.' : 'Finish a workout and it shows up here. Tap any day to look back.') + '</p>' +
    calendarMarkup(weeks, false) +
    '<div class="cal-legend" aria-hidden="true"><span>Less</span><i class="cal-day cal-l1"></i><i class="cal-day cal-l2"></i><i class="cal-day cal-l3"></i><i class="cal-day cal-l4"></i><span>More volume</span></div>';
}
function renderDashCalendar() {
  const host = $('dashCalendar'); if (!host) return;
  if (!(state.sessions || []).length) { host.hidden = true; return; }
  host.hidden = false;
  host.innerHTML = '<div class="section-title"><span>Last 5 weeks</span><button type="button" class="btn" data-action="showScreen" data-arg="progress">Open progress</button></div>' + calendarMarkup(5, true);
}
function openCalendarDay(day) {
  if (!GymLib.isDay(day)) return;
  const sessions = (state.sessions || []).map((s, i) => ({ s, i })).filter(x => x.s.date === day);
  const body = sessions.length ? sessions.map(({ s, i }) => '<div class="cal-session"><p><strong>' + (s.mins || 0) + ' min</strong> · ' + fmtVolume(s.vol || 0) + ' · ' + plural(s.sets || 0, 'set') + (s.prs && s.prs.length ? ' · 🏆 ' + plural(s.prs.length, 'record') : '') + '</p>' +
    (s.notes ? '<p class="sub">' + esc(s.notes) + '</p>' : '') +
    '<ul>' + (s.exercises || []).map(ex => '<li>' + esc(ex.name) + ' <span class="sub">' + (ex.sets || []).filter(x => x.type !== 'warmup').map(x => esc(kgToDisplay(x.kg, 1)) + '×' + esc(Number(x.reps) || 0)).join(', ') + '</span></li>').join('') + '</ul>' +
    '<div class="row-wrap"><button type="button" class="btn btn-primary" data-plus="repeatFromCalendar" data-i="' + i + '">↻ Repeat this workout</button></div></div>').join('')
    : '<p>No workout on this day. Rest days are part of training too.</p>';
  openPlusDialog(fmtDayLong(day), body, 'day');
}
function repeatFromCalendar(i) { closePlusDialog(); goToTraining(); repeatSession(i); }
function monthsWithData() {
  const set = new Set((state.sessions || []).map(s => String(s.date || '').slice(0, 7)).filter(k => /^\d{4}-\d{2}$/.test(k)));
  set.add(dayKey().slice(0, 7));
  return [...set].sort().reverse().slice(0, 24);
}
function monthReportText(r) {
  const c = r.current, lines = ['My Gymplified ' + fmtMonth(r.month) + ':', plural(c.workouts, 'workout') + ' on ' + plural(c.days, 'day'), fmtVolume(c.vol) + ' lifted across ' + plural(c.sets, 'set'), Math.round(c.mins / 60 * 10) / 10 + ' hours trained'];
  if (c.prs) lines.push(plural(c.prs, 'personal record'));
  if (c.topExercises.length) lines.push('Most trained: ' + c.topExercises.map(x => x.name).join(', '));
  return lines.join('\n');
}
function renderProgressMonth() {
  const host = $('progressMonth'); if (!host) return;
  const months = monthsWithData(); if (!months.includes(reportMonth)) reportMonth = months[0];
  const r = GymLib.monthReport(state.sessions, reportMonth), c = r.current;
  const delta = (v, label) => v == null ? '<small class="sub">no ' + label + ' to compare</small>' : '<small class="' + (v >= 0 ? 'delta-up' : 'delta-down') + '">' + (v >= 0 ? '▲ ' : '▼ ') + Math.abs(v) + '% vs ' + esc(fmtMonth(r.previousMonth)) + '</small>';
  const top = (list, empty) => list.length ? '<ol class="top-list">' + list.map(x => '<li>' + esc(x.name) + ' <span class="sub">' + plural(x.sets, 'set') + '</span></li>').join('') + '</ol>' : '<p class="sub">' + empty + '</p>';
  host.innerHTML = '<div class="section-title"><span>Monthly report</span><span class="row-wrap"><label class="sr" for="reportMonthSelect">Month</label><select id="reportMonthSelect" data-plus-change="setReportMonth">' + months.map(m => '<option value="' + m + '"' + (m === reportMonth ? ' selected' : '') + '>' + esc(fmtMonth(m)) + '</option>').join('') + '</select><button type="button" class="btn" data-plus="shareMonthReport">Share</button></span></div>' +
    (c.workouts ? '<div class="stat-row"><div class="stat"><b>' + c.workouts + '</b><span>workouts</span>' + delta(r.change.workouts, 'earlier month') + '</div><div class="stat"><b>' + volumeNumber(c.vol) + '</b><span>' + weightUnit() + ' volume</span>' + delta(r.change.vol, 'earlier month') + '</div><div class="stat"><b>' + (Math.round(c.mins / 60 * 10) / 10) + '</b><span>hours</span>' + delta(r.change.mins, 'earlier month') + '</div><div class="stat"><b>' + c.prs + '</b><span>records</span></div></div>' +
      '<div class="grid-2 report-lists"><div><div class="sub-h">Most trained muscles</div>' + top(c.topMuscles, 'No muscle data for this month.') + '</div><div><div class="sub-h">Most trained exercises</div>' + top(c.topExercises, 'No exercise details for this month.') + '</div></div>'
      : '<p class="sub">No workouts logged in ' + esc(fmtMonth(reportMonth)) + ' yet. Your report builds itself as you train.</p>');
}
function setReportMonth(el) { if (/^\d{4}-\d{2}$/.test(el.value)) { reportMonth = el.value; renderProgressMonth(); const s = $('reportMonthSelect'); if (s) s.focus(); } }
function shareMonthReport() { shareOrCopy('My Gymplified month', monthReportText(GymLib.monthReport(state.sessions, reportMonth)), 'Monthly report copied'); }
function sparklineMarkup(points, label) {
  if (points.length < 2) return '';
  const w = 280, h = 64, pad = 4, vals = points.flatMap(p => [p.kg, p.trend]), min = Math.min(...vals), max = Math.max(...vals), span = max - min || 1;
  const x = i => pad + i * (w - 2 * pad) / (points.length - 1), y = v => h - pad - (v - min) / span * (h - 2 * pad);
  const path = key => points.map((p, i) => (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(p[key]).toFixed(1)).join(' ');
  return '<svg class="spark" viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + esc(label) + '"><path class="spark-raw" d="' + path('kg') + '"/><path class="spark-trend" d="' + path('trend') + '"/></svg>';
}
function renderProgressWeight() {
  const host = $('progressWeight'); if (!host) return;
  const x = extras(), trend = GymLib.weightTrend(x.bodyLog, 7), last = trend[trend.length - 1], u = weightUnit();
  const first = trend[0], change = last && first && trend.length > 1 ? last.trend - first.trend : 0;
  const goalLine = x.goalKg && last ? (Math.abs(last.trend - x.goalKg) < 0.25 ? 'You are at your goal weight.' : fmtWeight(Math.abs(last.trend - x.goalKg), 1) + ' ' + (last.trend > x.goalKg ? 'above' : 'below') + ' your goal of ' + fmtWeight(x.goalKg, 1) + '.') : '';
  host.innerHTML = '<div class="section-title"><span>Bodyweight</span><span class="sub">7-day average</span></div>' +
    (last ? '<div class="metric-num">' + kgToDisplay(last.trend, 1) + ' <span class="metric-unit">' + u + ' average</span></div><p class="sub">Latest entry ' + esc(fmtWeight(last.kg, 1)) + ' on ' + esc(last.day) + (trend.length > 1 ? ' · ' + (change >= 0 ? '+' : '−') + kgToDisplay(Math.abs(change), 1) + ' ' + u + ' since ' + esc(first.day) : '') + '. ' + esc(goalLine) + '</p>' + sparklineMarkup(trend.slice(-60), 'Bodyweight over ' + trend.slice(-60).length + ' entries. Thin line: each weigh-in. Thick line: 7-day average.')
      : '<p class="sub">Weigh in a few times a week. The average smooths out daily ups and downs so you see the real direction.</p>') +
    '<form class="plus-form-row" data-plus-submit="saveBodyWeight"><label for="bodyWeightInput">Weight (' + u + ')<input type="number" id="bodyWeightInput" inputmode="decimal" min="1" step="0.1" required></label><label for="bodyWeightDate">Date<input type="date" id="bodyWeightDate" value="' + dayKey() + '" max="' + dayKey() + '" required></label><button class="btn btn-primary" type="submit">Save</button></form>' +
    '<form class="plus-form-row" data-plus-submit="saveGoalWeight"><label for="goalWeightInput">Goal weight (' + u + ', optional)<input type="number" id="goalWeightInput" inputmode="decimal" min="0" step="0.1" value="' + (x.goalKg ? kgToDisplay(x.goalKg, 1) : '') + '"></label><button class="btn" type="submit">Set goal</button></form>' +
    (trend.length ? '<details class="weight-entries"><summary>Entries (' + trend.length + ')</summary><ul class="plain-list">' + trend.slice().reverse().slice(0, 30).map(p => '<li><span>' + esc(p.day) + ' · ' + esc(fmtWeight(p.kg, 1)) + '</span><button type="button" class="btn btn-icon-only" data-plus="deleteBodyWeight" data-day="' + p.day + '" aria-label="Delete weigh-in from ' + esc(p.day) + '">×</button></li>').join('') + '</ul></details>' : '');
}
function saveBodyWeight(el, e) {
  e.preventDefault();
  const kg = displayToKg(Number($('bodyWeightInput').value)), day = $('bodyWeightDate').value;
  if (!(kg >= 20 && kg <= 400)) return showToast('Enter a weight between ' + kgToDisplay(20, 0) + ' and ' + kgToDisplay(400, 0) + ' ' + weightUnit());
  if (!GymLib.isDay(day) || day > dayKey()) return showToast('Choose today or an earlier date');
  const x = extras(); x.bodyLog[day] = Math.round(kg * 100) / 100;
  const latest = Object.keys(x.bodyLog).sort().pop(); if (latest === day && state.profile) state.profile.weightKg = x.bodyLog[day];
  saveState(); showToast('Weigh-in saved');
}
function saveGoalWeight(el, e) {
  e.preventDefault(); const raw = $('goalWeightInput').value, kg = displayToKg(Number(raw));
  if (raw !== '' && !(kg >= 20 && kg <= 400)) return showToast('Enter a realistic goal weight');
  extras().goalKg = raw === '' ? 0 : Math.round(kg * 100) / 100; saveState(); showToast(raw === '' ? 'Goal weight cleared' : 'Goal weight saved');
}
function deleteBodyWeight(day) {
  const x = extras(), kg = x.bodyLog[day]; if (kg == null) return; delete x.bodyLog[day]; saveState();
  offerUndo('Weigh-in deleted', () => { extras().bodyLog[day] = kg; });
}
function renderProgressRecovery() {
  const host = $('progressRecovery'); if (!host) return;
  const list = GymLib.muscleRecency(state.sessions, dayKey());
  host.innerHTML = '<div class="section-title"><span>Last trained</span></div>' + (list.length
    ? '<ul class="plain-list recency-list">' + list.slice(0, 14).map(m => '<li><span>' + esc(cap(m.muscle)) + '</span><span class="' + (m.days >= 7 ? 'recency-due' : 'sub') + '">' + (m.days === 0 ? 'today' : m.days === 1 ? 'yesterday' : m.days + ' days ago') + (m.days >= 7 ? ' · due' : '') + '</span></li>').join('') + '</ul><p class="sub">A simple reminder of what you haven’t trained lately. It is not medical or recovery advice.</p>'
    : '<p class="sub">After your first finished workout you’ll see how long it has been since you trained each muscle group.</p>');
}
const MEASURE_LABELS = { chest: 'Chest', waist: 'Waist', hips: 'Hips', arm: 'Upper arm', thigh: 'Thigh', calf: 'Calf', shoulders: 'Shoulders', neck: 'Neck' };
function lengthUnit() { return state.settings.heightUnit === 'ftin' ? 'in' : 'cm'; }
function cmToLen(cm) { return lengthUnit() === 'in' ? Math.round(cm / CM_PER_IN * 10) / 10 : Math.round(cm * 10) / 10; }
function lenToCm(v) { return lengthUnit() === 'in' ? v * CM_PER_IN : v; }
function renderProgressMeasures() {
  const host = $('progressMeasures'); if (!host) return;
  const m = extras().measures, days = Object.keys(m).sort(), latest = days.length ? m[days[days.length - 1]] : {}, first = days.length ? m[days[0]] : {}, u = lengthUnit();
  const today = m[dayKey()] || {};
  host.innerHTML = '<div class="section-title"><span>Body measurements</span><span class="sub">' + (days.length ? 'Last saved ' + esc(days[days.length - 1]) : 'Optional') + '</span></div>' +
    '<p class="sub">Measure in the same place each time, about once a month. Only numbers are stored, and only the fields you fill in.</p>' +
    '<form data-plus-submit="saveMeasures"><div class="measure-grid">' + GymLib.MEASURE_FIELDS.map(f => {
      const now = latest[f], was = first[f], diff = now != null && was != null && days.length > 1 ? now - was : null;
      return '<label for="measure-' + f + '">' + MEASURE_LABELS[f] + ' (' + u + ')<input type="number" id="measure-' + f + '" inputmode="decimal" min="0" step="0.1" value="' + (today[f] != null ? cmToLen(today[f]) : '') + '" placeholder="' + (now != null ? cmToLen(now) : '') + '">' +
        '<small class="sub">' + (diff == null ? (now != null ? 'Last: ' + cmToLen(now) + ' ' + u : 'Not recorded') : (diff >= 0 ? '+' : '−') + cmToLen(Math.abs(diff)) + ' ' + u + ' since ' + esc(days[0])) + '</small></label>';
    }).join('') + '</div><div class="row-wrap"><button class="btn btn-primary" type="submit">Save today’s measurements</button></div></form>';
}
function saveMeasures(el, e) {
  e.preventDefault(); const row = {};
  GymLib.MEASURE_FIELDS.forEach(f => { const raw = $('measure-' + f).value; if (raw === '') return; const cm = lenToCm(Number(raw)); if (cm >= 5 && cm <= 300) row[f] = Math.round(cm * 10) / 10; });
  const x = extras();
  if (!Object.keys(row).length) { if (x.measures[dayKey()]) { delete x.measures[dayKey()]; saveState(); showToast('Today’s measurements cleared'); } else showToast('Fill in at least one measurement'); return; }
  x.measures[dayKey()] = row; saveState(); showToast('Measurements saved');
}
function renderProgress() { renderProgressCalendar(); renderProgressMonth(); renderProgressWeight(); renderProgressRecovery(); renderProgressMeasures(); }

// ================= Nutrition: supplement checklist (F11) =================
function renderSupplements() {
  const host = $('supplementPanel'); if (!host) return;
  const x = extras(), taken = x.suppLog[dayKey()] || [];
  host.innerHTML = '<div class="section-title"><span>Daily supplements</span><span class="sub">' + taken.length + ' of ' + x.supplements.length + ' taken today</span></div>' +
    (x.supplements.length ? '<ul class="plain-list supp-list">' + x.supplements.map((name, i) => '<li><label class="rest-check"><input type="checkbox" data-plus-change="toggleSupplement" data-i="' + i + '"' + (taken.includes(name) ? ' checked' : '') + '> ' + esc(name) + '</label><button type="button" class="btn btn-icon-only" data-plus="removeSupplement" data-i="' + i + '" aria-label="Remove ' + esc(name) + ' from the list">×</button></li>').join('') + '</ul>' : '<p class="sub">Your list is empty. Add what you take each day.</p>') +
    (x.supplements.length < 12 ? '<form class="plus-form-row" data-plus-submit="addSupplement"><label for="supplementName">Add to the list<input type="text" id="supplementName" maxlength="30" placeholder="e.g. Omega-3" required></label><button class="btn" type="submit">Add</button></form>' : '') +
    '<p class="sub">A simple tick list that resets each day. It is a reminder, not a recommendation to take anything.</p>';
}
function toggleSupplement(el) {
  const x = extras(), name = x.supplements[plusNum(el.dataset.i)]; if (!name) return;
  const set = new Set(x.suppLog[dayKey()] || []); if (el.checked) set.add(name); else set.delete(name);
  if (set.size) x.suppLog[dayKey()] = [...set]; else delete x.suppLog[dayKey()];
  saveQuiet(); renderSupplements(); const again = document.querySelector('#supplementPanel input[data-i="' + el.dataset.i + '"]'); if (again) again.focus({ preventScroll: true });
}
function addSupplement(el, e) {
  e.preventDefault(); const x = extras(), name = safeStateText($('supplementName').value, '', 30); if (!name) return;
  if (x.supplements.some(s => s.toLowerCase() === name.toLowerCase())) return showToast(name + ' is already on your list');
  x.supplements.push(name); saveQuiet(); renderSupplements(); $('supplementName')?.focus();
}
function removeSupplement(i) {
  const x = extras(), name = x.supplements[i]; if (!name) return;
  x.supplements.splice(i, 1); Object.keys(x.suppLog).forEach(d => { x.suppLog[d] = x.suppLog[d].filter(n => n !== name); if (!x.suppLog[d].length) delete x.suppLog[d]; });
  saveQuiet(); renderSupplements(); showToast(name + ' removed');
}

// ================= Account: sync status, security, invite link (J5, J7, E8) =================
const SYNC_LABELS = { local: 'Saved on this device', syncing: 'Syncing…', synced: 'All changes synced', offline: 'Offline. Changes are saved here and will sync later', error: 'Sync problem. Your device copy is safe' };
function syncStatusText() {
  if (!currentUser) return 'Not signed in. Your data lives only on this device.';
  const when = cloudSyncStatus === 'synced' && cloudSyncedAt ? ' · ' + new Date(cloudSyncedAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) : '';
  return (SYNC_LABELS[cloudSyncStatus] || SYNC_LABELS.local) + when;
}
function renderSyncStatus() {
  const line = $('syncStatusLine'); if (line) { line.textContent = syncStatusText(); line.dataset.status = cloudSyncStatus; }
  const dot = $('accountButton'); if (dot) dot.dataset.sync = currentUser ? cloudSyncStatus : '';
}
function syncNow() {
  if (!sb || !currentUser) return showToast('Sign in to sync');
  if (navigator.onLine === false) return showToast('You’re offline. Changes will sync when you reconnect.');
  if (cloudSyncUserId === currentUser.id) { cloudSavePending = true; setSyncStatus('syncing'); flushCloudStateSave(); } else syncUserAppState();
  showToast('Syncing…');
}
let securityRenderedFor = null;
function renderAccountSecurity() {
  const host = $('accountSecurity'); if (!host) return;
  const uid = currentUser ? currentUser.id : null;
  host.hidden = !uid; if (!uid) { securityRenderedFor = null; host.innerHTML = ''; return; }
  // Built once per sign-in so typing in the forms is never interrupted by a re-render.
  if (securityRenderedFor !== uid) {
    securityRenderedFor = uid;
    host.innerHTML = '<div class="section-title"><span>Sync &amp; security</span></div>' +
      '<div class="row-wrap sync-row"><span id="syncStatusLine" class="sync-status" role="status"></span><button type="button" class="btn" data-plus="syncNow">Sync now</button></div>' +
      '<details class="security-box"><summary>Change password</summary><form data-plus-submit="changePassword"><div class="field"><label for="newPassword">New password</label><input id="newPassword" type="password" minlength="8" maxlength="72" autocomplete="new-password" required></div><div class="field"><label for="newPasswordAgain">New password again</label><input id="newPasswordAgain" type="password" minlength="8" maxlength="72" autocomplete="new-password" required></div><button class="btn btn-primary" type="submit">Update password</button> <span class="account-hint" id="passwordStatus" role="status"></span></form></details>' +
      '<details class="security-box"><summary>Change email address</summary><form data-plus-submit="changeEmail"><p class="sub">We send a confirmation link to the new address. Your email only changes after you open it.</p><div class="field"><label for="newEmail">New email address</label><input id="newEmail" type="email" maxlength="254" autocomplete="email" required></div><button class="btn btn-primary" type="submit">Send confirmation</button> <span class="account-hint" id="emailStatus" role="status"></span></form></details>' +
      '<div class="row-wrap"><button type="button" class="btn" data-plus="signOutEverywhere">Sign out on all devices</button></div>';
  }
  renderSyncStatus();
}
async function changePassword(el, e) {
  e.preventDefault(); const a = $('newPassword').value, b = $('newPasswordAgain').value, out = $('passwordStatus');
  if (a.length < 8) { out.textContent = 'Use at least 8 characters.'; return; }
  if (a !== b) { out.textContent = 'The two passwords do not match.'; return; }
  out.textContent = 'Updating…';
  try { const r = await sb.auth.updateUser({ password: a }); if (r.error) throw r.error; el.reset(); out.textContent = 'Password updated.'; showToast('Password updated'); }
  catch (error) { out.textContent = (error && error.message) || 'Could not update the password. Try signing in again first.'; }
}
async function changeEmail(el, e) {
  e.preventDefault(); const email = $('newEmail').value.trim(), out = $('emailStatus');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { out.textContent = 'Enter a valid email address.'; return; }
  out.textContent = 'Sending…';
  try { const r = await sb.auth.updateUser({ email }, { emailRedirectTo: location.origin + location.pathname }); if (r.error) throw r.error; el.reset(); out.textContent = 'Check ' + email + ' for a confirmation link.'; }
  catch (error) { out.textContent = (error && error.message) || 'Could not start the email change.'; }
}
async function signOutEverywhere() {
  if (!sb || !currentUser) return;
  if (!confirm('Sign out of Gymplified on every device, including this one?')) return;
  try { const r = await sb.auth.signOut({ scope: 'global' }); if (r.error) throw r.error; showToast('Signed out on all devices'); }
  catch (error) { showToast('Could not sign out everywhere. Check your connection and try again.'); }
}
const INVITE_KEY = 'gymplified_pending_invite';
function inviteUsername(value) { const v = String(value || '').trim(); return /^[A-Za-z0-9_]{3,20}$/.test(v) ? v : ''; }
function renderInvite() {
  const row = $('inviteRow'); if (!row) return;
  row.hidden = !(currentUser && currentProfile && inviteUsername(currentProfile.username));
}
function shareInvite() {
  const name = currentProfile && inviteUsername(currentProfile.username); if (!name) return showToast('Set a username on the Account screen first');
  const url = location.origin + location.pathname + '?friend=' + encodeURIComponent(name);
  shareOrCopy('Add me on Gymplified', 'Add me on Gymplified: ' + url, 'Invite link copied');
}
function captureInvite() {
  let name = '';
  try { const params = new URLSearchParams(location.search); name = inviteUsername(params.get('friend')); if (params.has('friend')) { params.delete('friend'); history.replaceState(null, '', location.pathname + (params.toString() ? '?' + params : '') + location.hash); } } catch (e) {}
  if (name) { try { sessionStorage.setItem(INVITE_KEY, name); } catch (e) {} }
}
// 'pending' until the account has had time to load; a signed-out visitor is prompted once, and the
// request screen opens as soon as they are signed in.
let inviteHandled = false, invitePrompted = false;
const inviteSeenAt = Date.now();
function handlePendingInvite() {
  if (inviteHandled) return;
  let name = '';
  try { name = inviteUsername(sessionStorage.getItem(INVITE_KEY)); } catch (e) {}
  if (!name) { inviteHandled = true; return; }
  if (!currentUser) {
    if (!invitePrompted && Date.now() - inviteSeenAt > 2500) { invitePrompted = true; showToast('Create a free account or log in to add ' + name + ' as a friend'); openAccount('signup'); }
    return;
  }
  if (!currentProfile) return;
  inviteHandled = true; try { sessionStorage.removeItem(INVITE_KEY); } catch (e) {}
  if (currentProfile.username === name) return;
  showScreen('friends'); const field = $('friendSearch'); if (field) { field.value = name; searchFriends(name); }
  showToast('Send ' + name + ' a friend request below');
}

// ================= App health: offline, updates, storage (K6, K7, K8) =================
function renderConnectivity() { const b = $('offlineBanner'); if (b) b.hidden = navigator.onLine !== false; }
let waitingWorker = null, updateDismissed = false, reloadingForUpdate = false;
function showUpdateBanner(worker) { waitingWorker = worker; const b = $('updateBanner'); if (b && !updateDismissed) b.hidden = false; }
function watchForAppUpdate(reg) {
  if (!reg) return;
  if (reg.waiting && navigator.serviceWorker.controller) showUpdateBanner(reg.waiting);
  reg.addEventListener('updatefound', () => {
    const worker = reg.installing; if (!worker) return;
    worker.addEventListener('statechange', () => { if (worker.state === 'installed' && navigator.serviceWorker.controller) showUpdateBanner(worker); });
  });
}
function applyUpdate() {
  if (!waitingWorker) return location.reload();
  flushDraftSave(); reloadingForUpdate = true;
  navigator.serviceWorker.addEventListener('controllerchange', () => { if (reloadingForUpdate) { reloadingForUpdate = false; location.reload(); } });
  waitingWorker.postMessage({ type: 'SKIP_WAITING' });
}
function dismissUpdate() { updateDismissed = true; const b = $('updateBanner'); if (b) b.hidden = true; }
let storageWarned = false;
function localStorageChars() { let n = 0; try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); n += k.length + (localStorage.getItem(k) || '').length; } } catch (e) {} return n; }
function renderStorageStatus() {
  const out = $('storageStatus'); if (!out) return;
  const use = GymLib.storageUse(localStorageChars()), mb = n => (n / 1048576).toFixed(1);
  out.textContent = 'Device storage: about ' + use.pct + '% used (' + mb(use.bytes) + ' of ~' + mb(use.quota) + ' MB).' + (use.critical ? ' Almost full: export a backup now, then remove old data or sign in so your history is kept in your account.' : use.warn ? ' Getting full: export a backup soon.' : '');
  out.classList.toggle('storage-warn', use.warn);
  if (use.warn && !storageWarned) { storageWarned = true; showToast('This device’s storage for Gymplified is ' + use.pct + '% full. Export a backup in Settings → Data.'); }
}

// ================= Settings toggles =================
function syncPlusSettings() {
  const s = state.settings, set = (id, fn) => { const el = $(id); if (el && document.activeElement !== el) fn(el); };
  set('overloadToggle', el => { el.checked = s.overload !== false; });
  set('overloadRepsInput', el => { el.value = s.overloadReps || 8; el.disabled = s.overload === false; });
  set('rpeToggle', el => { el.checked = !!s.showRpe; });
}
function setOverload(el) { state.settings.overload = !!el.checked; saveState(); }
function setOverloadReps(el) { const n = Math.round(Number(el.value)); if (!(n >= 3 && n <= 30)) { showToast('Choose between 3 and 30 reps'); el.value = state.settings.overloadReps || 8; return; } state.settings.overloadReps = n; saveState(); showToast('Weight goes up once every set reaches ' + n + ' reps'); }
function setShowRpe(el) { state.settings.showRpe = !!el.checked; saveState(); showToast(el.checked ? 'Effort rating shown on each set' : 'Effort rating hidden'); }

// ================= Rendering hook (called from renderAll) =================
function renderPlus() {
  renderConnectivity(); renderDashCalendar(); renderAccountSecurity(); renderInvite(); syncPlusSettings();
  handlePendingInvite();
}

// ================= Action allowlist =================
const PLUS_ACTIONS = Object.freeze({
  closeDialog: () => closePlusDialog(), applyUpdate: () => applyUpdate(), dismissUpdate: () => dismissUpdate(),
  moveExercise: el => moveExercise(plusNum(el.dataset.i), plusNum(el.dataset.dir)), toggleSuperset: el => toggleSuperset(plusNum(el.dataset.i)),
  openPlates: el => openPlates(plusNum(el.dataset.i)), plateInput: () => plateInput(), addWarmups: el => addWarmups(plusNum(el.dataset.i)),
  applyOverload: el => applyOverload(plusNum(el.dataset.i)), dismissOverload: el => dismissOverload(plusNum(el.dataset.i)),
  setExerciseNote: el => setExerciseNote(el), setSessionNote: el => setSessionNote(el), setRpe: el => setRpe(el),
  repeatSession: el => repeatSession(plusNum(el.dataset.i)), repeatFromCalendar: el => repeatFromCalendar(plusNum(el.dataset.i)), editSession: el => editSession(plusNum(el.dataset.i)),
  editSessionField: el => editSessionField(el), editSessionAddSet: el => editSessionAddSet(plusNum(el.dataset.e)), editSessionRemoveSet: el => editSessionRemoveSet(plusNum(el.dataset.e), plusNum(el.dataset.k)),
  editSessionRemoveEx: el => editSessionRemoveEx(plusNum(el.dataset.e)), editSessionAddEx: () => editSessionAddEx(), editSessionSave: () => editSessionSave(),
  filterRoutines: el => filterRoutines(el.dataset.arg), loadStarter: el => loadStarter(plusNum(el.dataset.i)), editRoutine: el => editRoutine(plusNum(el.dataset.i)),
  routineField: el => routineField(el), routineSets: el => routineSets(el), routineReps: el => routineReps(el), routineMove: el => routineMove(plusNum(el.dataset.e), plusNum(el.dataset.dir)),
  routineRemoveEx: el => routineRemoveEx(plusNum(el.dataset.e)), routineSave: () => routineSave(),
  openCalendarDay: el => openCalendarDay(el.dataset.day), setReportMonth: el => setReportMonth(el), shareMonthReport: () => shareMonthReport(),
  saveBodyWeight: (el, e) => saveBodyWeight(el, e), saveGoalWeight: (el, e) => saveGoalWeight(el, e), deleteBodyWeight: el => deleteBodyWeight(el.dataset.day), saveMeasures: (el, e) => saveMeasures(el, e),
  toggleSupplement: el => toggleSupplement(el), addSupplement: (el, e) => addSupplement(el, e), removeSupplement: el => removeSupplement(plusNum(el.dataset.i)),
  syncNow: () => syncNow(), changePassword: (el, e) => changePassword(el, e), changeEmail: (el, e) => changeEmail(el, e), signOutEverywhere: () => signOutEverywhere(), shareInvite: () => shareInvite(),
  setOverload: el => setOverload(el), setOverloadReps: el => setOverloadReps(el), setShowRpe: el => setShowRpe(el)
});
function bindPlusActions() {
  [['click', 'data-plus'], ['change', 'data-plus-change'], ['input', 'data-plus-input'], ['submit', 'data-plus-submit']].forEach(([type, attr]) => {
    document.addEventListener(type, e => {
      const el = e.target && e.target.closest ? e.target.closest('[' + attr + ']') : null; if (!el) return;
      const name = el.getAttribute(attr), run = Object.prototype.hasOwnProperty.call(PLUS_ACTIONS, name) ? PLUS_ACTIONS[name] : null;
      if (!run) { console.warn('Unknown action:', name); return; }
      run(el, e);
    });
  });
  $('exSearch')?.addEventListener('keydown', e => { if (e.key === 'Enter' && quickAddFromSearch(e.target.value)) e.preventDefault(); });
  // The account can finish loading after the first render; keep the account-dependent parts in step.
  setInterval(() => { renderAccountSecurity(); renderInvite(); handlePendingInvite(); }, 2000);
}
captureInvite();
bindPlusActions();
renderAll();
