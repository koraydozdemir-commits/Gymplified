# Next Update Batch

Backlog for the next release. Items are ordered by priority within each section.

## Bugs

### 1. Reps input auto-corrects while typing (high priority)

**Symptom:** When entering reps in a workout set row, the value jumps to a different number and digits are randomly added or removed, so typing a number such as `12` is unreliable.

**Where:** `app.js`, set rows (`data-set-field="reps"`, around line 1820) and the handlers around lines 1549, 1576, 2032 and 2033.

**Likely causes (to verify):**
- The `input` listener (`app.js:2032`) calls `updateSetEstimate` -> `applySetField` on **every keystroke**. `applySetField` clamps reps to `Math.max(1, ...)` and rounds, and writes the result into `state`. `scheduleDraftSave` then runs on each keystroke.
- `setVal` (`app.js:1549`) runs on `change`/blur and **overwrites the input's DOM value from state** (`input.value = x.reps`). If state was clamped or rounded mid-typing, the field visibly changes under the user.
- Any re-render triggered by the draft save, rest timer or cloud sync can rebuild the row from state (`value="..."`, `app.js:1820`) and replace what the user is typing. `focusKey` (`app.js:1675`) restores focus but not the caret position or the in-progress text.
- `type="number"` inputs on mobile browsers handle caret and partial input inconsistently (for example intermediate values such as `1.` or an empty string).

**Proposed fix:**
- Do not write to state or the DOM on `input`. Update only the 1RM estimate preview from the parsed value, and commit and clamp on `blur`/`change`.
- Never rewrite `input.value` while the field is focused.
- Skip re-rendering set rows while one of their inputs has focus. Alternatively, preserve value, selection and caret across a re-render.
- Switch reps to `type="text" inputmode="numeric" pattern="[0-9]*"` and sanitize to digits only.
- Add tests in `tests/` for typing `1`, `12`, `120`, backspacing to empty, and typing while a draft save or timer re-render fires.

## Features

### 2. Faster set entry
- Tap-to-select-all on focus for reps and weight fields so a new value replaces the old one.
- "Next" key on the mobile keyboard moves weight -> reps -> next set.
- One-tap "copy previous set" and "repeat last set".

### 3. Workout logging quality of life
- Undo toast after deleting a set or an exercise.
- Per-exercise notes carried over from the last session.
- Show last session's weight x reps as a placeholder on each set row.

### 4. Progress and insights
- Per-exercise progress chart (estimated 1RM and volume over time).
- Personal record badges and a PR history list.
- Weekly summary card (workouts, volume, PRs).

### 5. Data and portability
- Export and import workout history (CSV and JSON).
- Backup and restore from Settings.

### 6. Polish
- Haptic feedback on completing a set (where supported).
- Optional plate calculator for barbell loading.

## Notes
- Scope each item as its own PR so the reps fix can ship independently.
- Re-check accessibility (labels, focus order, contrast) on any changed inputs.
