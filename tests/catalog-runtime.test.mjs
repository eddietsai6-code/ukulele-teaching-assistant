import assert from "node:assert/strict";
import test from "node:test";

import { loadCatalog, mergeCatalog, normalizeDynamicSong } from "../assets/catalog-runtime.js";

const staticData = {
  levels: [{ id: "debut" }, { id: "g1" }, { id: "g2" }],
  songs: [
    { id: "static-a", title: "Static A", artist: "Teacher", level: "debut", source: "Static", category: "Song", style: "Starter", techniques: [], audio: [], scoreImages: [] },
    {
      id: "duplicate",
      title: "Static Duplicate",
      artist: "Teacher",
      level: "g1",
      source: "Static",
      category: "Song",
      style: "Starter",
      techniques: [],
      audio: [{ title: "Static Audio", src: "./assets/audio/static/full.mp3" }],
      scoreImages: []
    }
  ]
};

const dynamicSong = {
  id: "dynamic-song",
  title: "Dynamic Song",
  artist: "Teacher",
  level: "g2",
  sortOrder: 20,
  source: "Teacher Upload",
  category: "曲目练习",
  style: "Fingerstyle",
  techniques: ["arpeggio"],
  audio: [{ title: "Full", src: "/media/release-20260723-a/dynamic-song/audio-01-full-123456789abc.mp3" }],
  scoreImages: [{ title: "Page 1", src: "/media/release-20260723-a/dynamic-song/score-01-page-123456789abc.png" }],
  teaching: {
    goal: "Play the piece.",
    focus: "Keep time.",
    practiceOrder: ["Count", "Play"],
    commonIssues: ["Rush"],
    passStandard: "Perform steadily."
  }
};

test("dynamic songs are normalized for UkuleleBook and require immutable media URLs", () => {
  const normalized = normalizeDynamicSong(dynamicSong);

  assert.equal(normalized.catalogOrigin, "dynamic");
  assert.equal(normalized.audio[0].src.startsWith("/media/"), true);
  assert.equal(normalized.scoreImageCount, 1);
  assert.equal(normalized.goal, "Play the piece.");
  assert.throws(
    () => normalizeDynamicSong({ ...dynamicSong, audio: [{ title: "Bad", src: "./assets/audio/local.mp3" }] }),
    /must use \/media\//
  );
});

test("dynamic catalog can replace static songs with the same stable ID", () => {
  const catalog = mergeCatalog(staticData, {
    releaseId: "release-20260723-a",
    songs: [
      { ...dynamicSong, id: "duplicate", title: "Dynamic Replacement", sortOrder: 1 },
      dynamicSong
    ]
  });

  assert.equal(catalog.releaseId, "release-20260723-a");
  assert.deepEqual(catalog.songs.map((song) => song.id), ["static-a", "duplicate", "dynamic-song"]);
  assert.equal(catalog.songs[0].catalogOrigin, "static");
  assert.equal(catalog.songs[1].title, "Dynamic Replacement");
  assert.equal(catalog.songs[1].catalogOrigin, "dynamic");
  assert.equal(catalog.songs[1].replacedStatic, true);
  assert.equal(catalog.songs[2].catalogOrigin, "dynamic");
});

test("dynamic score-only replacement keeps existing static audio", () => {
  const catalog = mergeCatalog(staticData, {
    releaseId: "release-20260723-a",
    songs: [
      {
        ...dynamicSong,
        id: "duplicate",
        title: "Dynamic Score Update",
        audio: [],
        scoreImages: [{ title: "New Page", src: "/media/release-20260723-a/duplicate/score-01-new-123456789abc.png" }]
      }
    ]
  });

  assert.equal(catalog.songs[1].title, "Dynamic Score Update");
  assert.equal(catalog.songs[1].audio[0].title, "Static Audio");
  assert.equal(catalog.songs[1].scoreImages[0].title, "New Page");
  assert.equal(catalog.songs[1].scoreImageCount, 1);
});

test("catalog loader reads active release manifest and falls back to cached or static data", async () => {
  const responses = new Map([
    ["/api/catalog/current", { releaseId: "release-20260723-a", manifestUrl: "/api/catalog/releases/release-20260723-a" }],
    ["/api/catalog/releases/release-20260723-a", { releaseId: "release-20260723-a", songs: [dynamicSong] }]
  ]);
  const storage = new Map();
  const fetchImpl = async (url) => ({
    ok: responses.has(url),
    status: responses.has(url) ? 200 : 404,
    json: async () => responses.get(url)
  });

  const loaded = await loadCatalog({
    staticData,
    fetchImpl,
    storage: {
      getItem: (key) => storage.get(key) || null,
      setItem: (key, value) => storage.set(key, value)
    }
  });

  assert.equal(loaded.source, "network");
  assert.equal(loaded.catalog.releaseId, "release-20260723-a");
  assert.equal(loaded.catalog.songs.some((song) => song.id === "dynamic-song"), true);

  const cached = await loadCatalog({
    staticData,
    fetchImpl: async () => ({ ok: false, status: 503, json: async () => ({}) }),
    storage: {
      getItem: (key) => storage.get(key) || null,
      setItem: (key, value) => storage.set(key, value)
    }
  });
  assert.equal(cached.source, "cache");

  const staticOnly = await loadCatalog({
    staticData,
    fetchImpl: async () => ({ ok: false, status: 503, json: async () => ({}) }),
    storage: null
  });
  assert.equal(staticOnly.source, "static");
  assert.equal(staticOnly.catalog.songs.length, staticData.songs.length);
});
