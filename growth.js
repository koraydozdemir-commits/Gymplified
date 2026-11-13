// Gymplified Deluxe growth features. Loaded last, after app.js, plus.js and deluxe.js.
//  - Deluxe tips: one short, dismissible tip at a moment where Deluxe would help (never during a workout,
//    at most one every few days, and only while Deluxe is on sale). Settings → Notifications turns them off.
//  - Friend badges: a DELUXE or FOUNDING MEMBER badge next to friends who show it.
//  - Friend challenges: Deluxe owners start them; anyone invited can join for free.
// Server rules live in supabase/migrations/20261112150000_gymplified_deluxe_growth.sql. Pure logic is in lib.js.
// Markup here never uses inline handlers or inline styles. Controls name an action with data-gx (clicks),
// data-gx-change or data-gx-submit, and only GROWTH_ACTIONS can run.

// ---------- Deluxe tips ----------
const TIP_MEMORY_KEY = 'gymplified_deluxe_tips';
// Device-local convenience (like the backup reminder): which tips were shown or hidden on this device.
function readTipMemory() {
  try { const m = JSON.parse(localStorage.getItem(TIP_MEMORY_KEY) || '{}'); return m && typeof m === 'object' && !Array.isArray(m) ? m : {}; } catch (e) { return {}; }
}
function writeTipMemory(m) {
  const clean = { dismissed: {}, seen: {}, current: null, boost: '' };
  Object.keys(m.dismissed || {}).slice(0, 20).forEach(k => { if (/^[a-z]{1,20}$/.test(k)) clean.dismissed[k] = true; });
  Object.keys(m.seen || {}).slice(0, 20).forEach(k => { if (/^[a-z]{1,20}$/.test(k) && Number(m.seen[k]) > 0) clean.seen[k] = Number(m.seen[k]); });
  if (m.current && /^[a-z]{1,20}$/.test(m.current.id) && Number(m.current.at) > 0) clean.current = { id: m.current.id, at: Number(m.current.at) };
  if (/^[a-z]{1,20}$/.test(m.boost || '')) clean.boost = m.boost;
  try { localStorage.setItem(TIP_MEMORY_KEY, JSON.stringify(clean)); } catch (e) { /* private mode: tips simply repeat less predictably */ }
}
function deluxeTipsAllowed() {
  return !deluxeEnabled() && !!deluxeAccess.salesOpen && state.settings.deluxeTips !== false && !state.session;
}
function finishedSessions() { return (Array.isArray(state.sessions) ? state.sessions : []).filter(s => s && Array.isArray(s.exercises) && GymLib.isDay(s.date)); }
// Every tip that applies right now. Each one names the Deluxe preview it opens.
function deluxeTipCandidates(memory) {
  const sessions = finishedSessions(), today = dayKey(), out = [];
  if ((state.routines || []).length >= FREE_ROUTINE_LIMIT) {
    out.push({ id: 'routines', priority: memory.boost === 'routines' ? 10 : 3, feature: 'Workout planner', title: 'All ' + FREE_ROUTINE_LIMIT + ' routine slots in use', text: 'Free accounts keep ' + FREE_ROUTINE_LIMIT + ' routines. Deluxe keeps as many as you like, plus programmes that adapt to every session.' });
  }
  const latest = sessions.slice().sort((a, b) => b.date.localeCompare(a.date))[0];
  if (latest && Array.isArray(latest.prs) && latest.prs.length && latest.date >= GymLib.addDays(today, -2)) {
    out.push({ id: 'pr', priority: 4, feature: 'Performance lab', title: 'New best on ' + latest.prs[0].name, text: 'See its strength curve and when you are on pace to reach the next milestone.' });
  }
  if (sessions.length >= 8) {
    const stalled = GymLib.liftTrends(sessions, today, 84).find(t => t.status === 'plateau');
    if (stalled) out.push({ id: 'stalled', priority: 5, feature: 'Smart training insights', title: stalled.name + ' has levelled off', text: 'Its estimated max has been flat for a while. The Deluxe coach shows what changed, and adaptive programmes help you break through.' });
    const first = sessions.reduce((min, s) => (s.date < min ? s.date : min), today);
    if (first <= GymLib.addDays(today, -28)) out.push({ id: 'month', priority: 2, feature: 'Advanced analytics', title: 'A month of training logged', text: 'That is enough for real trends: weekly volume, your training rhythm and how each lift is moving.' });
  }
  if (typeof dxNutritionContext === 'function') {
    const n = dxNutritionContext();
    if (GymLib.energyBalance(n.intake, n.weights, n.today).ready) out.push({ id: 'nutrition', priority: 4, feature: 'Nutrition coach', title: 'Your real maintenance calories are ready', text: 'You have logged enough food and weigh-ins to work out what your body actually burns in a day.' });
  }
  return out;
}
function renderDeluxeTip() {
  const host = $('deluxeTip'); if (!host) return;
  if (!deluxeTipsAllowed()) { host.hidden = true; host.textContent = ''; return; }
  const memory = readTipMemory(), now = Date.now(), tip = GymLib.pickNudge(deluxeTipCandidates(memory), memory, now);
  if (!tip) { host.hidden = true; host.textContent = ''; return; }
  if (!memory.current || memory.current.id !== tip.id || now - memory.current.at >= 864e5) {
    memory.current = { id: tip.id, at: now }; memory.seen = Object.assign({}, memory.seen, { [tip.id]: now });
    if (memory.boost === tip.id) memory.boost = '';
    writeTipMemory(memory);
  }
  host.hidden = false;
  host.innerHTML = '<div><strong><span aria-hidden="true">✦ </span>' + esc(tip.title) + '</strong><p class="sub">' + esc(tip.text) + '</p></div>' +
    '<div class="row-wrap"><button class="btn btn-primary" type="button" data-gx="openTip" data-arg="' + esc(tip.feature) + '">See how</button>' +
    '<button class="btn" type="button" data-gx="hideTip" data-arg="' + esc(tip.id) + '" aria-label="Don’t show this Deluxe tip again">Don’t show again</button></div>';
}
function hideDeluxeTip(id) {
  if (!/^[a-z]{1,20}$/.test(String(id || ''))) return;
  const memory = readTipMemory(); memory.dismissed = Object.assign({}, memory.dismissed, { [id]: true }); writeTipMemory(memory);
  renderDeluxeTip();
  showToast('Tip hidden. Turn all Deluxe tips off in Settings → Notifications.');
}
// Called by app.js when a free limit is reached, so the matching tip is first in line.
function noteDeluxeMoment(id) { const memory = readTipMemory(); memory.boost = id; writeTipMemory(memory); }
// One line under a workout summary with a new PR. It is part of the summary, so it has no cooldown.
function summaryDeluxeTip(summary) {
  if (!deluxeTipsAllowed() || !summary || !Array.isArray(summary.prs) || !summary.prs.length) return '';
  return '<p class="deluxe-inline-tip"><span aria-hidden="true">✦ </span><span>New best on ' + esc(summary.prs[0].name) + '. Deluxe draws its strength curve and projects your next milestone.</span> <button class="btn" type="button" data-gx="openTip" data-arg="Performance lab">See how</button></p>';
}
function setDeluxeTips(el) { state.settings.deluxeTips = !!el.checked; saveState(); renderDeluxeTip(); showToast(el.checked ? 'Deluxe tips on' : 'Deluxe tips off'); }
function syncGrowthSettings() { const el = $('deluxeTipsToggle'); if (el && document.activeElement !== el) el.checked = state.settings.deluxeTips !== false; }

// ---------- friend badges ----------
let friendBadges = {};
function friendBadgeMarkup(userId) {
  const badge = friendBadges[String(userId || '')];
  if (!badge) return '';
  return ' <span class="deluxe-pill friend-badge' + (badge === 'founder' ? ' is-founder' : '') + '">' + (badge === 'founder' ? 'FOUNDING MEMBER' : 'DELUXE') + '</span>';
}
async function loadFriendBadges() {
  const r = await sb.rpc('gymplified_friend_badges');
  if (r.error) { console.info('Friend badges unavailable:', r.error.message); return; }
  const next = {};
  (r.data || []).forEach(row => { if (row && /^[0-9a-f-]{36}$/i.test(String(row.user_id)) && (row.badge === 'deluxe' || row.badge === 'founder')) next[row.user_id] = row.badge; });
  friendBadges = next;
  renderLeaderboard(); renderFeed();
}
// Called by loadFriendsCircle in app.js once the leaderboard and feed are in.
function loadFriendExtras() {
  if (!sb || !currentUser) return;
  loadFriendBadges().catch(e => console.info('Friend badges unavailable:', e && e.message));
  loadChallenges();
}

// ---------- friend challenges ----------
let challenges = null, challengeError = '', challengesAvailable = true, challengeFormOpen = false, challengeBusy = false;
const CHALLENGE_LENGTHS = [[7, '1 week'], [14, '2 weeks'], [28, '4 weeks'], [42, '6 weeks'], [63, '9 weeks']];
function challengeValue(metric, value) { return metric === 'volume' ? fmtVolume(Number(value) || 0) : plural(Math.round(Number(value) || 0), 'workout'); }
function challengeDates(c) { const d = k => new Date(k + 'T12:00:00').toLocaleDateString(undefined, { day: 'numeric', month: 'short' }); return d(c.starts_on) + ' – ' + d(c.ends_on); }
function challengeStatus(c, today) {
  if (!c.joined) return { label: 'Invited', cls: 'is-invited' };
  if (c.ends_on < today) return { label: 'Finished', cls: 'is-done' };
  if (c.starts_on > today) return { label: 'Starts ' + new Date(c.starts_on + 'T12:00:00').toLocaleDateString(undefined, { day: 'numeric', month: 'short' }), cls: '' };
  const left = Math.round((new Date(c.ends_on + 'T12:00:00') - new Date(today + 'T12:00:00')) / 864e5);
  return { label: left === 0 ? 'Last day' : plural(left + 1, 'day') + ' left', cls: 'is-live' };
}
// One challenge. `preview` renders a sample with no buttons, for the Deluxe sales screen.
function challengeCardMarkup(c, preview) {
  const today = dayKey(), status = challengeStatus(c, today), ranked = GymLib.rankChallenge(c.members || [], c.target);
  const rows = ranked.map(m => {
    const name = m.is_self ? 'You' : personName(m), value = !m.joined ? 'Invited' : m.progress === null || m.progress === undefined ? 'Not shared' : challengeValue(c.metric, m.progress) + (m.done ? ' ✓' : '');
    return '<li class="challenge-row' + (m.is_self ? ' me' : '') + '"><span class="lb-rank" aria-hidden="true">' + (m.rank ? (m.rank <= 3 ? medalArt(m.rank) : m.rank) : '–') + '</span>' +
      '<span class="challenge-who"><strong>' + esc(name) + '</strong>' + (preview ? '' : friendBadgeMarkup(m.user_id)) + '<span class="progress-bar" aria-hidden="true"><i data-w="' + m.pct + '"></i></span></span>' +
      '<span class="challenge-value' + (m.rank ? '' : ' sub') + '">' + esc(value) + '</span><span class="sr">' + (m.rank ? ', rank ' + m.rank + ', ' + m.pct + ' percent of the goal' : '') + '</span></li>';
  }).join('');
  let actions = '';
  if (!preview) {
    const id = esc(c.id);
    if (!c.joined) actions = '<button class="btn btn-primary" type="button" data-gx="respondChallenge" data-id="' + id + '" data-arg="join">Join challenge</button><button class="btn" type="button" data-gx="respondChallenge" data-id="' + id + '" data-arg="leave">Decline</button>';
    else if (c.is_creator) actions = '<button class="btn" type="button" data-gx="deleteChallenge" data-id="' + id + '">Delete challenge</button>';
    else actions = '<button class="btn" type="button" data-gx="respondChallenge" data-id="' + id + '" data-arg="leave">Leave</button>';
  }
  return '<article class="challenge-card' + (status.cls === 'is-done' ? ' is-finished' : '') + '"><div class="challenge-head"><h3>' + esc(c.title) + '</h3><span class="deluxe-pill challenge-status ' + status.cls + '">' + esc(status.label) + '</span></div>' +
    '<p class="sub">Goal: ' + esc(challengeValue(c.metric, c.target)) + ' · ' + esc(challengeDates(c)) + '</p>' +
    '<ol class="challenge-list" aria-label="Standings">' + rows + '</ol>' +
    (c.others > 0 ? '<p class="sub">+ ' + c.others + (c.others === 1 ? ' more person is' : ' more people are') + ' taking part who ' + (c.others === 1 ? 'is' : 'are') + ' not on your friends list.</p>' : '') +
    (actions ? '<div class="row-wrap st-3">' + actions + '</div>' : '') + '</article>';
}
function challengePreviewMarkup() {
  const today = dayKey(), start = GymLib.addDays(today, -9);
  const sample = { id: 'sample', title: 'November grind', metric: 'workouts', target: 12, starts_on: start, ends_on: GymLib.addDays(start, 27), joined: true, is_creator: true, others: 1,
    members: [{ user_id: 'a', display_name: 'Sam', progress: 6, joined: true }, { user_id: 'me', is_self: true, progress: 5, joined: true }, { user_id: 'b', display_name: 'Alex', progress: 3, joined: true }, { user_id: 'c', display_name: 'Jordan', progress: null, joined: false }] };
  return challengeCardMarkup(sample, true) + '<p class="sub">Friends join for free. Volume challenges count total kilograms or pounds lifted instead of workouts.</p>';
}
function acceptedFriends() {
  if (!currentUser || typeof friendRequests === 'undefined') return [];
  return friendRequests.filter(x => x.status === 'accepted').map(x => { const id = x.requester_id === currentUser.id ? x.receiver_id : x.requester_id; return Object.assign({ id }, friendProfiles[id] || {}); })
    .filter(p => p.username).sort((a, b) => personName(a).localeCompare(personName(b)));
}
function challengeFormMarkup() {
  const friends = acceptedFriends(), today = dayKey(), monday = GymLib.addDays(today, (8 - new Date(today + 'T12:00:00').getDay()) % 7 || 7);
  if (!friends.length) return '<div class="challenge-form"><p class="sub">Add a friend first: challenges are only ever between friends.</p><button class="btn" type="button" data-gx="closeChallengeForm">Close</button></div>';
  return '<form class="challenge-form" data-gx-submit="createChallenge" novalidate><div class="form-grid">' +
    '<div class="field"><label for="challengeTitle">Challenge name</label><input id="challengeTitle" name="title" maxlength="60" required placeholder="e.g. November grind" autocomplete="off"></div>' +
    '<div class="field"><label for="challengeMetric">Count</label><select id="challengeMetric" name="metric" data-gx-change="challengeMetric"><option value="workouts">Workouts finished</option><option value="volume">Total volume lifted</option></select></div>' +
    '<div class="field"><label for="challengeTarget" id="challengeTargetLabel">Goal (workouts)</label><input id="challengeTarget" name="target" type="number" inputmode="numeric" min="1" max="100" step="1" value="12" required></div>' +
    '<div class="field"><label for="challengeLength">Length</label><select id="challengeLength" name="days">' + CHALLENGE_LENGTHS.map(([d, l]) => '<option value="' + d + '"' + (d === 28 ? ' selected' : '') + '>' + l + '</option>').join('') + '</select></div>' +
    '<div class="field"><label for="challengeStart">Starts</label><select id="challengeStart" name="start"><option value="' + today + '">Today</option><option value="' + monday + '">Next Monday</option></select></div>' +
    '</div><fieldset class="challenge-invites"><legend>Invite friends <span class="sub">(up to 20)</span></legend>' +
    friends.map(p => '<label class="dx-option"><input type="checkbox" name="invite" value="' + esc(p.id) + '"><span>' + esc(personName(p)) + ' <small class="sub">@' + esc(p.username) + '</small></span></label>').join('') +
    '</fieldset><p class="sub">Everyone sees each other’s progress only if they are friends, and only what their privacy settings share.</p>' +
    '<div class="row-wrap"><button class="btn btn-primary" type="submit">Start challenge</button><button class="btn" type="button" data-gx="closeChallengeForm">Cancel</button></div>' +
    '<p class="sub" id="challengeFormStatus" role="status" aria-live="polite"></p></form>';
}
function renderChallenges() {
  const host = $('friendChallenges'); if (!host) return;
  if (!currentUser || !challengesAvailable) { host.hidden = true; host.textContent = ''; return; }
  host.hidden = false;
  const canCreate = deluxeEnabled();
  const head = '<div class="section-title"><span id="challengesTitle" tabindex="-1">Challenges</span>' + (canCreate && !challengeFormOpen ? '<button class="btn" type="button" data-gx="openChallengeForm">+ New challenge</button>' : '') + '</div>';
  let body;
  if (challenges === null) body = '<p class="sub">Loading challenges…</p>';
  else if (challengeError) body = '<p class="account-message">' + esc(challengeError) + '</p><button class="btn" type="button" data-gx="reloadChallenges">Try again</button>';
  else if (!challenges.length) body = '<p class="sub">' + (canCreate ? 'No challenges yet. Start one and invite your friends: they join for free.' : 'No challenges yet. When a friend invites you, it appears here and you can join for free.') + '</p>';
  else body = challenges.map(c => challengeCardMarkup(c, false)).join('');
  const upsell = canCreate ? '' : '<p class="sub challenge-upsell">Starting a challenge is part of Deluxe; joining one is always free. <button class="btn" type="button" data-gx="previewChallenges">See how it works</button></p>';
  host.innerHTML = head + (challengeFormOpen && canCreate ? challengeFormMarkup() : '') + body + upsell;
}
function cleanChallengeRow(row) {
  if (!row || typeof row !== 'object' || !/^[0-9a-f-]{36}$/i.test(String(row.id)) || !GymLib.CHALLENGE_METRICS.includes(row.metric) || !GymLib.isDay(row.starts_on) || !GymLib.isDay(row.ends_on)) return null;
  const members = (Array.isArray(row.members) ? row.members : []).slice(0, 25).filter(m => m && typeof m === 'object').map(m => ({
    user_id: String(m.user_id || ''), username: String(m.username || '').slice(0, 40), display_name: String(m.display_name || '').slice(0, 60),
    is_self: !!m.is_self, joined: !!m.joined, progress: m.progress === null || m.progress === undefined || !Number.isFinite(Number(m.progress)) ? null : Number(m.progress) }));
  return { id: row.id, title: String(row.title || 'Challenge').slice(0, 60), metric: row.metric, target: Number(row.target) || 0, starts_on: row.starts_on, ends_on: row.ends_on,
    is_creator: !!row.is_creator, joined: !!row.joined, members, others: Math.max(0, Math.round(Number(row.others) || 0)) };
}
// A missing function means the database migration is not deployed yet: the panel stays hidden.
function challengeMissing(error) { const m = String(error && (error.message || error.code) || ''); return /PGRST202|could not find the function|does not exist/i.test(m); }
async function loadChallenges() {
  if (!sb || !currentUser) { renderChallenges(); return; }
  try {
    const r = await sb.rpc('gymplified_my_challenges');
    if (r.error) throw r.error;
    challengesAvailable = true; challengeError = ''; challenges = (r.data || []).map(cleanChallengeRow).filter(Boolean);
  } catch (e) {
    if (challengeMissing(e)) challengesAvailable = false; else { challengeError = typeof socialError === 'function' ? socialError(e) : 'Challenges could not be loaded.'; challenges = challenges || []; }
  }
  renderChallenges();
}
// Server messages for rule breaks are written for people (see the migration); anything else gets a plain sentence.
const CHALLENGE_SERVER_MESSAGES = [/part of Gymplified Deluxe/, /name of up to 60/, /realistic target/, /starts within the next month/, /between 1 and 20/, /only invite your friends/, /up to 5 challenges/, /delete it instead/, /Only the person who started/, /Challenge not found/];
function challengeErrorText(e) { const m = String(e && e.message || ''); return CHALLENGE_SERVER_MESSAGES.some(re => re.test(m)) ? m : navigator.onLine === false ? 'You seem to be offline. Try again when you are connected.' : 'That did not work. Please try again.'; }
async function createChallenge(form) {
  if (challengeBusy || !sb || !currentUser) return;
  const status = $('challengeFormStatus'), say = t => { if (status) status.textContent = t; };
  const title = String(form.title.value || '').replace(/[\u0000-\u001f\u007f]/g, ' ').trim(), metric = form.metric.value, raw = Number(form.target.value), days = Number(form.days.value), start = form.start.value;
  const invites = [...form.querySelectorAll('input[name="invite"]:checked')].map(x => x.value).filter(v => /^[0-9a-f-]{36}$/i.test(v));
  if (!title) { say('Give the challenge a name.'); form.title.focus(); return; }
  if (!GymLib.CHALLENGE_METRICS.includes(metric)) return;
  const target = metric === 'volume' ? displayToKg(raw) : Math.round(raw);
  if (!(raw > 0) || (metric === 'workouts' && target > 100) || target > 1e8) { say('Choose a goal above zero' + (metric === 'workouts' ? ', up to 100 workouts.' : '.')); form.target.focus(); return; }
  if (!CHALLENGE_LENGTHS.some(([d]) => d === days) || !GymLib.isDay(start)) return;
  if (!invites.length) { say('Invite at least one friend.'); form.querySelector('input[name="invite"]')?.focus(); return; }
  if (invites.length > 20) { say('Invite up to 20 friends.'); return; }
  challengeBusy = true; say('Starting your challenge…');
  try {
    const r = await sb.rpc('gymplified_create_challenge', { p_title: title, p_metric: metric, p_target: Math.round(target * 10) / 10, p_starts: start, p_ends: GymLib.addDays(start, days - 1), p_invitees: invites });
    if (r.error) throw r.error;
    challengeFormOpen = false; showToast('Challenge started. Your friends can join from their Friends screen.');
    await loadChallenges(); $('challengesTitle')?.focus();
  } catch (e) { say(challengeErrorText(e)); }
  finally { challengeBusy = false; }
}
async function respondChallenge(id, join) {
  if (challengeBusy || !sb || !/^[0-9a-f-]{36}$/i.test(String(id))) return;
  if (!join && !confirm('Leave this challenge? You can only rejoin if you are invited again.')) return;
  challengeBusy = true;
  try { const r = await sb.rpc('gymplified_respond_challenge', { p_challenge: id, p_join: !!join }); if (r.error) throw r.error; showToast(join ? 'You’re in. Good luck! 💪' : 'You left the challenge'); await loadChallenges(); }
  catch (e) { showToast(challengeErrorText(e)); }
  finally { challengeBusy = false; }
}
async function deleteChallenge(id) {
  if (challengeBusy || !sb || !/^[0-9a-f-]{36}$/i.test(String(id))) return;
  if (!confirm('Delete this challenge for everyone in it?')) return;
  challengeBusy = true;
  try { const r = await sb.rpc('gymplified_delete_challenge', { p_challenge: id }); if (r.error) throw r.error; showToast('Challenge deleted'); await loadChallenges(); }
  catch (e) { showToast(challengeErrorText(e)); }
  finally { challengeBusy = false; }
}
function setChallengeMetric(el) {
  const target = $('challengeTarget'), label = $('challengeTargetLabel'); if (!target || !label) return;
  const volume = el.value === 'volume';
  label.textContent = volume ? 'Goal (' + weightUnit() + ' lifted)' : 'Goal (workouts)';
  target.max = volume ? '10000000' : '100'; target.step = volume ? '100' : '1'; target.value = volume ? String(Math.round(kgToDisplay(20000, 0))) : '12';
}

// ---------- rendering hook (called from renderAll in app.js) ----------
function renderGrowth() { syncGrowthSettings(); renderDeluxeTip(); }

// ---------- actions ----------
const GROWTH_ACTIONS = Object.freeze({
  openTip: el => previewDeluxeFeature(el.dataset.arg), hideTip: el => hideDeluxeTip(el.dataset.arg), setDeluxeTips: el => setDeluxeTips(el),
  openChallengeForm: () => { challengeFormOpen = true; renderChallenges(); $('challengeTitle')?.focus(); },
  closeChallengeForm: () => { challengeFormOpen = false; renderChallenges(); $('challengesTitle')?.focus(); },
  challengeMetric: el => setChallengeMetric(el), createChallenge: el => createChallenge(el),
  respondChallenge: el => respondChallenge(el.dataset.id, el.dataset.arg === 'join'), deleteChallenge: el => deleteChallenge(el.dataset.id),
  reloadChallenges: () => loadChallenges(), previewChallenges: () => previewDeluxeFeature('Friend challenges')
});
function bindGrowthActions() {
  [['click', 'data-gx'], ['change', 'data-gx-change'], ['submit', 'data-gx-submit']].forEach(([type, attr]) => {
    document.addEventListener(type, e => {
      const el = e.target && e.target.closest ? e.target.closest('[' + attr + ']') : null; if (!el) return;
      if (type === 'submit') e.preventDefault();
      const name = el.getAttribute(attr), run = Object.prototype.hasOwnProperty.call(GROWTH_ACTIONS, name) ? GROWTH_ACTIONS[name] : null;
      if (!run) { console.warn('Unknown growth action:', name); return; }
      run(el, e);
    });
  });
}
bindGrowthActions();
// app.js and deluxe.js rendered before this file loaded; bring the tip and settings up to date.
renderGrowth();
