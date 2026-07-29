import assert from "node:assert/strict";
import test from "node:test";

import { mountHeroLanyard } from "../assets/app/home/lanyard.js";
import { mountTextPressure } from "../assets/app/home/text-pressure.js";
import { renderHeroNotebookView } from "../assets/app/home/hero-notebook.js";
import { createLevelSongSplash } from "../assets/app/levels/level-song-splash.js";
import { renderLevelBoardView, renderLevelSongPickerView } from "../assets/app/levels/level-views.js";

const level = {
  id: "g2",
  label: "Grade 2",
  order: 2,
  core: "C/F review",
  techniques: ["strum", "chord"],
  coverImage: "./cover.png"
};

const song = {
  id: "song-a",
  title: "Song A",
  artist: "Artist",
  source: "Local Pack",
  style: "Fingerstyle",
  category: "Song",
  techniques: ["strum", "melody"]
};

test("home animation modules skip safely when roots are missing", () => {
  assert.doesNotThrow(() => mountTextPressure(null));
  assert.doesNotThrow(() => mountHeroLanyard(null));
});

test("level song splash module skips safely without a live canvas", () => {
  const splash = createLevelSongSplash({
    matchMedia: () => ({ matches: true }),
    cancelAnimationFrame: () => {},
    requestAnimationFrame: () => 1,
    devicePixelRatio: 1
  });

  assert.doesNotThrow(() => splash.init(null, null));
  assert.doesNotThrow(() => splash.paint({ clientX: 0, clientY: 0, pointerType: "mouse" }));
  assert.doesNotThrow(() => splash.reset());
});

test("hero notebook view keeps the tuner guard and selected song fields separate from app shell", () => {
  const html = renderHeroNotebookView({ song, level });

  assert.ok(html.includes("notebook-cover"));
  assert.ok(html.includes("Song A"));
  assert.ok(html.includes("Grade 2") || html.includes("G2"));
  assert.ok(html.includes("uke"));
});

test("level board view renders stable book-card controls without binding events", () => {
  const html = renderLevelBoardView({
    levels: [level],
    state: { level: "g2", levelPickerOpen: true, activeLevelPicker: "g2" },
    levelCount: () => 3
  });

  assert.ok(html.includes("circular-gallery-track"));
  assert.ok(html.includes('data-level="g2"'));
  assert.ok(html.includes("has-book-cover"));
  assert.ok(html.includes("data-level-gallery-prev"));
  assert.ok(html.includes("data-level-gallery-next"));
});

test("level song picker view renders songs in input order", () => {
  const html = renderLevelSongPickerView({ level, songs: [song] });

  assert.ok(html.includes("level-song-picker-panel"));
  assert.ok(html.includes('data-song="song-a"'));
  assert.ok(html.includes("Song A"));
});
