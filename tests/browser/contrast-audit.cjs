// Contrast audit (Batch 7, I1). Loads the app in Chromium and checks every visible text element
// on every screen against WCAG AA, for each theme x accent x contrast mode.
// Usage: serve the repo root on http://localhost:8765, then `node tests/browser/contrast-audit.cjs`.
// Prints failures grouped by element and exits 1 if any are found.
const { chromium } = require('playwright');
const THEMES = ['dark', 'light'], ACCENTS = ['gold', 'blue', 'emerald', 'slate', 'crimson', 'amber', 'violet'], CONTRAST = ['normal', 'high'];
const SCREENS = ['dashboard', 'prs', 'training', 'nutrition', 'friends', 'deluxe', 'settings'];
const base = process.env.GYMPLIFIED_URL || 'http://localhost:8765/index.html';
(async () => {
  const browser = await chromium.launch();
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' })).newPage();
  await page.route('**/cdn.jsdelivr.net/**', r => r.abort());
  await page.route('https://world.openfoodfacts.org/**', r => r.abort());
  await page.goto(base); await page.waitForTimeout(400);
  await page.evaluate(() => {
    state.onboarded = true;
    state.workouts.push(syncW({ name: 'Leg Press', muscle: 'Quadriceps', setList: [{ kg: 100, reps: 8, done: true, type: 'normal' }, { kg: 40, reps: 10, done: false, type: 'warmup', auto: true }] }));
    state.prs.push({ id: 'pr-a', name: 'Bench', weight: 100, reps: 3, date: dayKey() });
    state.foods.push({ id: 'f-a', name: 'Oats', grams: 40, portion: '1 serving', meal: 'Breakfast', day: dayKey(), cal: 156, protein: 6.8, carbs: 26.5, fat: 2.8, createdAt: Date.now() });
    state.sessions.unshift({ id: 's-a', date: dayKey(), name: 'Workout', mins: 45, vol: 800, sets: 1, reps: 8, ex: 1, names: ['Leg Press'], exercises: [{ id: 'e', name: 'Leg Press', muscle: 'Quadriceps', sets: [{ id: 'x', kg: 100, reps: 8, type: 'normal' }] }] });
    state.lastSummary = summaryFromSession(state.sessions[0]);
    saveState();
    document.querySelectorAll('dialog[open]').forEach(d => d.close());
  });
  const failures = new Map();
  for (const theme of THEMES) for (const color of ACCENTS) for (const contrast of CONTRAST) {
    await page.evaluate(([t, c, k]) => { state.settings.theme = t; state.settings.color = c; state.settings.contrast = k; saveState(); document.querySelectorAll('dialog[open]').forEach(d => d.close()); }, [theme, color, contrast]);
    for (const screen of SCREENS) {
      await page.evaluate(s => showScreen(s, document.querySelector('nav button[data-screen="' + s + '"]')), screen);
      await page.waitForTimeout(30);
      const found = await page.evaluate(() => {
        const parse = v => {
          let m = /rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/.exec(v);
          if (m) return [+m[1], +m[2], +m[3], m[4] === undefined ? 1 : +m[4]];
          m = /color\(srgb ([\d.e-]+) ([\d.e-]+) ([\d.e-]+)(?: \/ ([\d.]+))?\)/.exec(v);
          if (m) return [m[1] * 255, m[2] * 255, m[3] * 255, m[4] === undefined ? 1 : +m[4]];
          return null;
        };
        const lum = c => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };
        const blend = (top, under) => { const a = top[3]; return [top[0] * a + under[0] * (1 - a), top[1] * a + under[1] * (1 - a), top[2] * a + under[2] * (1 - a), 1]; };
        const bgOf = el => {
          const layers = [];
          for (let n = el; n; n = n.parentElement) {
            const cs = getComputedStyle(n);
            if (cs.backgroundImage && cs.backgroundImage !== 'none' && /gradient/.test(cs.backgroundImage)) return null; // skip gradients
            const c = parse(cs.backgroundColor);
            if (c && c[3] > 0) { layers.push(c); if (c[3] >= 1) break; }
          }
          let out = [255, 255, 255, 1];
          for (let i = layers.length - 1; i >= 0; i--) out = blend(layers[i], out);
          return out;
        };
        const opacityOf = el => { let o = 1; for (let n = el; n; n = n.parentElement) o *= +getComputedStyle(n).opacity; return o; };
        const screen = document.querySelector('.screen.active');
        const roots = [document.querySelector('header'), document.querySelector('aside'), screen].filter(Boolean);
        const out = [];
        const seen = new Set();
        for (const root of roots) for (const el of root.querySelectorAll('*')) {
          if (seen.has(el) || !el.offsetParent && getComputedStyle(el).position !== 'fixed') continue;
          seen.add(el);
          const own = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
          const isField = el.matches('input:not([type=checkbox]):not([type=radio]):not([type=hidden]):not([type=file]),select,textarea');
          if (!own && !isField) continue;
          if (el.closest('[aria-hidden="true"]') || el.closest('.sr')) continue;
          const cs = getComputedStyle(el), r = el.getBoundingClientRect();
          if (r.width < 1 || r.height < 1 || cs.visibility === 'hidden') continue;
          const fg = parse(cs.color), bg = bgOf(el);
          if (!fg || !bg) continue;
          const disabled = el.matches(':disabled') || !!el.closest('button:disabled');
          const op = opacityOf(el), under = bg;
          let text = blend([fg[0], fg[1], fg[2], fg[3] * op], under);
          const L1 = lum(text), L2 = lum(under), ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
          const size = parseFloat(cs.fontSize), bold = +cs.fontWeight >= 700, large = size >= 24 || (bold && size >= 18.66);
          const need = large ? 3 : 4.5;
          if (ratio + 0.005 < need && !disabled) {
            const label = el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '');
            out.push({ label, text: (el.innerText || el.value || el.placeholder || '').trim().slice(0, 30), ratio: +ratio.toFixed(2), need, fg: cs.color, bg: 'rgb(' + under.slice(0, 3).map(Math.round).join(',') + ')' });
          }
        }
        // placeholders
        for (const input of screen.querySelectorAll('input[placeholder]')) {
          if (!input.offsetParent) continue;
          const ph = parse(getComputedStyle(input, '::placeholder').color), bg = bgOf(input);
          if (!ph || !bg) continue;
          const t = blend(ph, bg), L1 = lum(t), L2 = lum(bg), ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
          if (ratio < 4.5) out.push({ label: 'input::placeholder#' + input.id, text: input.placeholder.slice(0, 30), ratio: +ratio.toFixed(2), need: 4.5, fg: getComputedStyle(input, '::placeholder').color, bg: '' });
        }
        return out;
      });
      for (const f of found) {
        const key = f.label + ' | ' + f.text;
        if (!failures.has(key)) failures.set(key, { ...f, where: [] });
        const entry = failures.get(key);
        entry.where.push(theme + '/' + color + '/' + contrast + '/' + screen + ' ' + f.ratio);
        entry.ratio = Math.min(entry.ratio, f.ratio);
      }
    }
  }
  const list = [...failures.values()].sort((a, b) => a.ratio - b.ratio);
  for (const f of list) console.log(f.ratio.toFixed(2) + ' < ' + f.need + '  ' + f.label + '  "' + f.text + '"  fg=' + f.fg + ' bg=' + f.bg + '  [' + f.where.length + '× e.g. ' + f.where.slice(0, 3).join(', ') + ']');
  console.log(list.length ? list.length + ' contrast failures' : 'No contrast failures');
  await browser.close();
  process.exit(list.length ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
