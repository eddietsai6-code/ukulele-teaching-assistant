# UkuleleBook Public Frontend Baseline

Date: 2026-07-30

## Git

- Repository: `C:\Users\888\AppData\Local\Temp\ukulele-dual-channel-20260723`
- Remote: `https://github.com/eddietsai6-code/ukulele-teaching-assistant.git`
- Branch: `codex/ukulele-public-frontend-modularization-docs`
- HEAD: `12c4319 Document UkuleleBook frontend modularization plan`
- Remote main: `1cfcc08b1401551c6203be9e57c7b5909c24f3a8`
- Merge base with `origin/main`: `1cfcc08b1401551c6203be9e57c7b5909c24f3a8`
- Status: clean worktree on the feature branch. HEAD intentionally contains the modularization docs commit above remote `main`.

## Current Large Files

- `assets/app.js`: 2257 lines.
- `assets/styles.css`: 4740 lines.

## Protected Runtime Behaviors

- Audio Speed Player script source remains online.
- Lesson metronome is page-native through `assets/lesson-metronome.js`.
- Tuner uses `assets/ukulele-tuner.js` and `assets/tuner-core.js`.
- Rhythm game iframe source is `./assets/rhythm-chain-game/index.html?v=20260722-ipad-scroll-reset`.
- Static and dynamic catalog merge through `assets/catalog-runtime.js`.

## Baseline Verification

- `npm.cmd test`: 36 tests passed, 0 failed.
- `npm.cmd run check`: exited 0.
- `npm.cmd run build`: exited 0 and built 382 public files in `dist`.
