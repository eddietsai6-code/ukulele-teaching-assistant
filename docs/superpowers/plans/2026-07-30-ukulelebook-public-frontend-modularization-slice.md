# UkuleleBook Public Frontend Modularization Slice Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split UkuleleBook's public frontend into small owned modules without changing visible UI, behavior, animations, media tools, or the two-channel publish architecture.

**Architecture:** Keep `assets/bootstrap.js` and `assets/app.js` working during the first slices. Add ES modules under `assets/app/`, migrate pure logic and detail panes first, and only remove old `app.js` responsibilities after each module has tests and behavior parity.

**Tech Stack:** Native ES modules, static HTML/CSS, Node built-in test runner, current Audio Speed Player Web Component, current Cloudflare Pages/Functions content architecture.

---

## Scope Guard

This plan is for system/UI modularization only. It must not add songs, replace scores, replace audio, modify D1/R2 migrations, modify Worker API behavior, or change content publisher flow.

Use the isolated worktree:

```powershell
cd "C:\Users\888\AppData\Local\Temp\ukulele-dual-channel-20260723"
```

Do not implement this plan in `C:\Users\888\Documents\尤克里里教学助手`, because that checkout currently contains unrelated local song and score changes.

## File Map

Create these directories over the first slices:

```text
assets/app/core/
assets/app/shared/
assets/app/catalog/
assets/app/detail/
assets/app/home/
assets/app/levels/
assets/app/tools/
tests/fixtures/
```

Planned module ownership:

- `assets/app/core/dom-roots.js`: central DOM root lookup.
- `assets/app/core/store.js`: state container and subscriptions.
- `assets/app/core/actions.js`: named state changes.
- `assets/app/core/selectors.js`: derived state.
- `assets/app/core/lifecycle.js`: mount guard and cleanup utilities.
- `assets/app/shared/escape.js`: HTML and attribute escaping.
- `assets/app/shared/formatting.js`: level labels, duration, compact audio titles.
- `assets/app/shared/tags.js`: tag and technique markup helpers.
- `assets/app/shared/media.js`: audio slot and score helpers.
- `assets/app/catalog/filtering.js`: pure filtering and sorting.
- `assets/app/detail/*.js`: detail shell and panes.
- `assets/app/home/*.js`: hero and motion modules.
- `assets/app/levels/*.js`: level gallery and picker modules.
- `assets/app/tools/*.js`: tuner and rhythm game entry boundaries.

## Phase 0: Baseline Freeze

**Files:**

- Create: `docs/superpowers/baselines/2026-07-30-ukulelebook-public-frontend-baseline.md`

- [ ] **Step 1: Record current git and deployment baseline**

Run:

```powershell
git status --short --branch
git log -1 --oneline
git ls-remote origin refs/heads/main
```

Expected:

- Worktree is clean.
- Local HEAD equals remote `main`.

- [ ] **Step 2: Run current automated tests**

Run:

```powershell
npm.cmd test
npm.cmd run check
npm.cmd run build
```

Expected:

- `npm.cmd test` reports all tests passing.
- `npm.cmd run check` exits 0.
- `npm.cmd run build` exits 0 and writes `dist`.

- [ ] **Step 3: Record current module-risk facts**

Write `docs/superpowers/baselines/2026-07-30-ukulelebook-public-frontend-baseline.md` with:

```markdown
# UkuleleBook Public Frontend Baseline

Date: 2026-07-30

## Git

- Branch:
- HEAD:
- Remote main:

## Current Large Files

- `assets/app.js`: about 2040 lines.
- `assets/styles.css`: about 4142 lines.

## Protected Runtime Behaviors

- Audio Speed Player script source remains online.
- Lesson metronome is page-native through `assets/lesson-metronome.js`.
- Tuner uses `assets/ukulele-tuner.js` and `assets/tuner-core.js`.
- Rhythm game iframe source is `./assets/rhythm-chain-game/index.html?v=20260722-ipad-scroll-reset`.
- Static and dynamic catalog merge through `assets/catalog-runtime.js`.
```

- [ ] **Step 4: Commit baseline documentation**

Run:

```powershell
git add docs/superpowers/baselines/2026-07-30-ukulelebook-public-frontend-baseline.md
git commit -m "Document UkuleleBook frontend modularization baseline"
```

## Phase 1: Core And Pure Modules

**Files:**

- Create: `assets/app/shared/escape.js`
- Create: `assets/app/shared/formatting.js`
- Create: `assets/app/shared/tags.js`
- Create: `assets/app/shared/media.js`
- Create: `assets/app/catalog/filtering.js`
- Create: `assets/app/core/dom-roots.js`
- Create: `tests/frontend-modules.test.mjs`
- Modify: `assets/app.js`
- Modify: `package.json`

- [ ] **Step 1: Add failing module import tests**

Create `tests/frontend-modules.test.mjs`:

```js
import assert from "node:assert/strict";
import test from "node:test";

import { escapeAttribute, escapeHtml } from "../assets/app/shared/escape.js";
import { compactAudioVersionTitle, formatAudioDuration, levelShort } from "../assets/app/shared/formatting.js";
import { audioVersionSlots, activeAudioVersionIndex } from "../assets/app/shared/media.js";
import { filterSongs, matchesSongQuery } from "../assets/app/catalog/filtering.js";
import { getPublicDomRoots } from "../assets/app/core/dom-roots.js";

test("shared escaping keeps existing app.js HTML escaping behavior", () => {
  assert.equal(escapeHtml("<Uke & Book>"), "&lt;Uke &amp; Book&gt;");
  assert.equal(escapeAttribute('"A&B"'), "&quot;A&amp;B&quot;");
});

test("formatting helpers keep current display contracts", () => {
  assert.equal(levelShort({ name: "Grade 2" }), "G2");
  assert.equal(levelShort({ name: "Debut" }), "0");
  assert.equal(formatAudioDuration(65.2), "1:05");
  assert.equal(compactAudioVersionTitle("SUMMER", "SUMMER - Full", 0), "Full");
});

test("media helpers normalize audio versions without DOM", () => {
  const song = {
    id: "song-a",
    title: "Song A",
    audio: [{ title: "Full", src: "./full.mp3" }, { label: "Backing", src: "./bt.mp3" }]
  };
  const slots = audioVersionSlots(song);
  assert.equal(slots.length, 2);
  assert.equal(slots[0].displayTitle, "Full");
  assert.equal(activeAudioVersionIndex(song, slots, { "song-a": 10 }), 0);
});

test("catalog filtering is pure and keeps level order sorting", () => {
  const levels = [
    { id: "g1", order: 1, name: "Grade 1" },
    { id: "g2", order: 2, name: "Grade 2" }
  ];
  const songs = [
    { id: "b", title: "Beta", artist: "B", level: "g2", sortOrder: 2, source: "Local", category: "Song", techniques: ["Strum"] },
    { id: "a", title: "Alpha", artist: "A", level: "g1", sortOrder: 1, source: "Local", category: "Song", techniques: ["Chord"] }
  ];
  assert.equal(matchesSongQuery(songs[0], "strum", Object.fromEntries(levels.map((level) => [level.id, level]))), true);
  assert.deepEqual(filterSongs({ songs, levels, query: "", level: "all", source: "all", category: "all" }).map((song) => song.id), ["a", "b"]);
});

test("dom roots returns nullable public roots without creating old UI", () => {
  const nodes = new Map();
  const documentLike = { getElementById: (id) => nodes.get(id) || null };
  const roots = getPublicDomRoots(documentLike);
  assert.equal(roots.songDetail, null);
  assert.equal(roots.levelBoard, null);
});
```

Run:

```powershell
node --test tests/frontend-modules.test.mjs
```

Expected: fails because modules do not exist.

- [ ] **Step 2: Implement shared modules**

Create `assets/app/shared/escape.js` by moving the existing escaping functions from `assets/app.js`:

```js
export function escapeAttribute(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
```

Create `assets/app/shared/formatting.js`:

```js
export function levelShort(level) {
  if (!level?.name) return "";
  if (/debut/i.test(level.name)) return "0";
  const match = level.name.match(/(\d+)/);
  return match ? `G${match[1]}` : level.name.slice(0, 2).toUpperCase();
}

export function compactAudioVersionTitle(songTitle, versionTitle, index) {
  const fallback = `版本 ${index + 1}`;
  const songName = String(songTitle || "").trim();
  const rawTitle = String(versionTitle || "").trim() || fallback;
  if (!songName) return rawTitle;
  const escapedSongName = songName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const separator = "\\s*[-—–:：·|/]*\\s*";
  const cleaned = rawTitle.replace(new RegExp(`^${escapedSongName}${separator}`, "i"), "").trim();
  return cleaned || rawTitle;
}

export function formatAudioDuration(seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) return "--:--";
  const totalSeconds = Math.round(seconds);
  const minutes = Math.floor(totalSeconds / 60);
  const rest = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${rest}`;
}
```

Create `assets/app/shared/media.js`:

```js
import { compactAudioVersionTitle } from "./formatting.js";

export function audioVersionSlots(song) {
  const audioItems = Array.isArray(song?.audio) ? song.audio : [];
  return audioItems
    .filter((item) => item?.src)
    .map((item, index) => {
      const title = item.title || item.label || item.name || `版本 ${index + 1}`;
      return {
        ...item,
        index,
        title,
        displayTitle: compactAudioVersionTitle(song.title, title, index)
      };
    });
}

export function activeAudioVersionIndex(song, slots, audioVersionBySong = {}) {
  const value = Number(audioVersionBySong?.[song?.id] || 0);
  if (!Number.isFinite(value) || value < 0 || value >= slots.length) return 0;
  return value;
}
```

Create `assets/app/catalog/filtering.js`:

```js
function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

export function matchesSongQuery(song, query, levelById = {}) {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return true;
  const level = levelById[song.level];
  const haystack = [
    song.title,
    song.artist,
    song.source,
    song.category,
    song.style,
    level?.name,
    ...(song.techniques || [])
  ].map(normalize).join(" ");
  return haystack.includes(normalizedQuery);
}

export function filterSongs({ songs, levels, query = "", level = "all", source = "all", category = "all" }) {
  const levelById = Object.fromEntries(levels.map((item) => [item.id, item]));
  return songs
    .filter((song) => level === "all" || song.level === level)
    .filter((song) => source === "all" || song.source === source)
    .filter((song) => category === "all" || song.category === category)
    .filter((song) => matchesSongQuery(song, query, levelById))
    .sort((a, b) => {
      const levelDiff = (levelById[a.level]?.order || 0) - (levelById[b.level]?.order || 0);
      if (levelDiff) return levelDiff;
      return (a.sortOrder || 0) - (b.sortOrder || 0);
    });
}
```

Create `assets/app/core/dom-roots.js`:

```js
export function getPublicDomRoots(documentRef = document) {
  return {
    heroNotebook: documentRef.getElementById("heroNotebook"),
    heroPressure: documentRef.getElementById("heroPressure"),
    heroLanyard: documentRef.getElementById("heroLanyard"),
    levelBoard: documentRef.getElementById("levelBoard"),
    levelSongPicker: documentRef.getElementById("levelSongPicker"),
    queryInput: documentRef.getElementById("queryInput"),
    sourceFilter: documentRef.getElementById("sourceFilter"),
    categoryFilter: documentRef.getElementById("categoryFilter"),
    levelFilter: documentRef.getElementById("levelFilter"),
    techCloud: documentRef.getElementById("techCloud"),
    songDetail: documentRef.getElementById("songDetail")
  };
}
```

- [ ] **Step 3: Wire app.js to imported pure modules**

Modify `assets/app.js`:

```js
import { getPublicDomRoots } from "./app/core/dom-roots.js";
import { escapeAttribute, escapeHtml } from "./app/shared/escape.js";
import { compactAudioVersionTitle, formatAudioDuration, levelShort } from "./app/shared/formatting.js";
import { activeAudioVersionIndex, audioVersionSlots } from "./app/shared/media.js";
import { filterSongs, matchesSongQuery } from "./app/catalog/filtering.js";
```

Replace local duplicate implementations only after imports are present.

- [ ] **Step 4: Include new module test in npm test**

Modify `package.json` script:

```json
"test": "node --test tests/site.test.js tests/ukulele-template-ui.test.js tests/rsl-ukulele-import.test.js tests/content-config.test.mjs tests/catalog-runtime.test.mjs tests/content-api.test.mjs tests/content-publisher.test.mjs tests/build-site.test.mjs tests/frontend-modules.test.mjs"
```

- [ ] **Step 5: Verify phase 1**

Run:

```powershell
node --test tests/frontend-modules.test.mjs
npm.cmd test
npm.cmd run check
npm.cmd run build
```

Expected: all pass, no UI behavior changes.

- [ ] **Step 6: Commit phase 1**

Run:

```powershell
git add assets/app.js assets/app tests/frontend-modules.test.mjs package.json
git commit -m "Extract UkuleleBook frontend pure modules"
```

## Phase 2: Detail Shell And Pane Contracts

**Files:**

- Create: `assets/app/detail/detail-shell.js`
- Create: `assets/app/detail/detail-tabs.js`
- Create: `assets/app/detail/lesson-pane.js`
- Create: `assets/app/detail/audio-pane.js`
- Create: `assets/app/detail/score-pane.js`
- Create: `assets/app/detail/metronome-pane.js`
- Create: `tests/detail-modules.test.mjs`
- Modify: `assets/app.js`
- Modify: `package.json`

- [ ] **Step 1: Write detail contract tests**

Create `tests/detail-modules.test.mjs` with tests that verify:

- Detail shell renders four stable pane hosts.
- Tab switching toggles `hidden` and active classes without replacing Metro host.
- Audio version selection updates only audio pane state.
- Score pane renders images in input order.
- Lesson pane does not require audio or score data.

Run:

```powershell
node --test tests/detail-modules.test.mjs
```

Expected: fails before modules exist.

- [ ] **Step 2: Extract Lesson pane first**

Move current `renderLesson(song, level)` into `lesson-pane.js`.

Keep the exported function pure:

```js
export function renderLessonPane({ song, level, escapeHtml, techButtonMarkup }) {
  // Move current markup exactly. Do not change copy, classes, or order.
}
```

- [ ] **Step 3: Extract Score pane**

Move current `renderScores(song)` into `score-pane.js`.

Keep:

- Existing `.score-grid` and `.score-card` classes.
- Existing image `loading` behavior.
- Existing no-score empty-state.

- [ ] **Step 4: Extract Audio pane**

Move current audio pane markup into `audio-pane.js`.

Keep:

- `<audio-speed-player>`.
- `engine="rubberband"`.
- Current `visualizer="metaballs"`.
- Existing label logic.
- Existing version selector UI.

- [ ] **Step 5: Extract Metro pane**

Move only the host rendering and mount call boundary into `metronome-pane.js`.

Do not edit `assets/lesson-metronome.js`.

- [ ] **Step 6: Extract tabs**

`detail-tabs.js` owns:

- Tab button active class.
- `hidden` attributes.
- ARIA state.

It must not rebuild the shell on ordinary Tab switching.

- [ ] **Step 7: Verify phase 2**

Run:

```powershell
node --test tests/detail-modules.test.mjs
npm.cmd test
npm.cmd run check
npm.cmd run build
```

- [ ] **Step 8: Commit phase 2**

Run:

```powershell
git add assets/app.js assets/app/detail tests/detail-modules.test.mjs package.json
git commit -m "Extract UkuleleBook song detail panes"
```

## Phase 3: Home And Tool Boundaries

**Files:**

- Create: `assets/app/home/text-pressure.js`
- Create: `assets/app/home/lanyard.js`
- Create: `assets/app/tools/tuner-entry.js`
- Create: `assets/app/tools/rhythm-game-entry.js`
- Create: `tests/home-tool-modules.test.mjs`
- Modify: `assets/app.js`

- [ ] Write tests that ensure modules skip safely when roots are missing.
- [ ] Move text pressure without changing animation constants.
- [ ] Move lanyard without changing canvas drawing or drag physics.
- [ ] Add tuner entry without changing tuner core.
- [ ] Add rhythm game entry without changing iframe src or game files.
- [ ] Run `npm.cmd test`, `npm.cmd run check`, `npm.cmd run build`.
- [ ] Commit with `git commit -m "Extract UkuleleBook home tool boundaries"`.

## Phase 4: Levels And Catalog Views

**Files:**

- Create: `assets/app/levels/level-gallery.js`
- Create: `assets/app/levels/level-song-picker.js`
- Create: `assets/app/levels/splash-canvas.js`
- Create: `assets/app/catalog/filters-view.js`
- Create: `assets/app/catalog/technique-cloud.js`
- Create: `assets/app/catalog/song-list.js`
- Create: `tests/level-catalog-modules.test.mjs`
- Modify: `assets/app.js`

- [ ] Write tests for level selection and song list update scope.
- [ ] Move level gallery render and controls.
- [ ] Move level song picker and splash canvas.
- [ ] Move filter controls and technique cloud.
- [ ] Move song list selection events.
- [ ] Run `npm.cmd test`, `npm.cmd run check`, `npm.cmd run build`.
- [ ] Commit with `git commit -m "Extract UkuleleBook level and catalog views"`.

## Phase 5: CSS Split

**Files:**

- Create: `assets/styles/tokens.css`
- Create: `assets/styles/base.css`
- Create: `assets/styles/layout.css`
- Create: `assets/styles/home.css`
- Create: `assets/styles/tuner.css`
- Create: `assets/styles/rhythm-game-shell.css`
- Create: `assets/styles/levels.css`
- Create: `assets/styles/catalog.css`
- Create: `assets/styles/detail.css`
- Create: `assets/styles/audio.css`
- Create: `assets/styles/score.css`
- Create: `assets/styles/metronome.css`
- Create: `assets/styles/responsive.css`
- Modify: `assets/styles.css`

- [ ] Move variables and base rules first.
- [ ] Move module rules by ownership, without changing values.
- [ ] Keep `assets/styles.css` as ordered import entry:

```css
@import "./styles/tokens.css";
@import "./styles/base.css";
@import "./styles/layout.css";
@import "./styles/home.css";
@import "./styles/tuner.css";
@import "./styles/rhythm-game-shell.css";
@import "./styles/levels.css";
@import "./styles/catalog.css";
@import "./styles/detail.css";
@import "./styles/audio.css";
@import "./styles/score.css";
@import "./styles/metronome.css";
@import "./styles/responsive.css";
```

- [ ] Run `npm.cmd test`, `npm.cmd run check`, `npm.cmd run build`.
- [ ] Run visual screenshots before and after CSS split.
- [ ] Commit with `git commit -m "Split UkuleleBook public frontend styles"`.

## Phase 6: Final Integration And Publish

**Files:**

- Modify: `assets/app.js`
- Modify: `assets/app/create-app.js`
- Modify: tests as needed for import paths only.

- [ ] Remove migrated duplicate logic from `assets/app.js`.
- [ ] Keep a small entry that calls `createApp().mount()`.
- [ ] Verify no old UI tokens reappear.
- [ ] Run:

```powershell
npm.cmd test
npm.cmd run check
npm.cmd run build
```

- [ ] Verify production-style static output in `dist`.
- [ ] If user approves publishing, push through GitHub/Cloudflare Pages system route.

## Final Verification Checklist

Before claiming the modularization is complete:

- [ ] `npm.cmd test` passes.
- [ ] `npm.cmd run check` passes.
- [ ] `npm.cmd run build` passes.
- [ ] `assets/app.js` is reduced to entry/orchestration responsibility.
- [ ] Audio Speed Player still renders fixed song audio.
- [ ] Score tab still renders score images in order.
- [ ] Metro tab state does not reset on ordinary Tab switching.
- [ ] Tuner can still request microphone permission.
- [ ] Rhythm game iframe still points at local `assets/rhythm-chain-game`.
- [ ] Static catalog fallback works.
- [ ] Dynamic catalog API still works.
- [ ] D1/R2/Worker/content publisher files are untouched unless the user explicitly asks.
- [ ] Desktop, iPad and mobile layouts have no horizontal overflow.
