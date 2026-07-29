import assert from "node:assert/strict";
import test from "node:test";

import { getPublicDomRoots } from "../assets/app/core/dom-roots.js";
import { filterSongs, matchesSongQuery } from "../assets/app/catalog/filtering.js";
import { escapeAttribute, escapeHtml } from "../assets/app/shared/escape.js";
import { compactAudioVersionTitle, formatAudioDuration, levelShort } from "../assets/app/shared/formatting.js";
import { activeAudioVersionIndex, audioVersionSlots } from "../assets/app/shared/media.js";

test("shared escaping keeps existing app.js HTML escaping behavior", () => {
  assert.equal(escapeHtml("<Uke & Book>"), "&lt;Uke &amp; Book&gt;");
  assert.equal(escapeAttribute('"A&B"'), "&quot;A&amp;B&quot;");
});

test("formatting helpers keep current display contracts", () => {
  assert.equal(levelShort({ name: "Grade 2" }), "G2");
  assert.equal(levelShort({ name: "Debut", order: 0 }), "Debut");
  assert.equal(formatAudioDuration(65.2), "1:05");
  assert.equal(compactAudioVersionTitle("SUMMER", "SUMMER - Full", 0), "Full");
});

test("media helpers normalize audio versions without DOM", () => {
  const song = {
    id: "song-a",
    title: "Song A",
    audio: [
      { title: "Full", src: "./full.mp3" },
      { label: "Backing", src: "./bt.mp3" }
    ]
  };
  const slots = audioVersionSlots(song);
  assert.equal(slots.length, 2);
  assert.equal(slots[0].displayTitle, "Full");
  assert.equal(activeAudioVersionIndex(song, slots, { "song-a": 10 }), 1);
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
  const levelById = Object.fromEntries(levels.map((level) => [level.id, level]));

  assert.equal(matchesSongQuery(songs[0], "strum", levelById), true);
  assert.deepEqual(filterSongs({ songs, levels, query: "", level: "all", source: "all", category: "all" }).map((song) => song.id), ["a", "b"]);
});

test("dom roots returns nullable public roots without creating old UI", () => {
  const nodes = new Map();
  const documentLike = { getElementById: (id) => nodes.get(id) || null };
  const roots = getPublicDomRoots(documentLike);

  assert.equal(roots.songDetail, null);
  assert.equal(roots.levelBoard, null);
});
