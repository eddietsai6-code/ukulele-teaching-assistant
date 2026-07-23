export const CATALOG_CACHE_KEY = "ukebook.catalog.release.v1";

const LEVEL_IDS = new Set(["debut", "g1", "g2", "g3", "g4", "g5", "g6", "g7", "g8"]);

function requiredText(value, field) {
  const text = String(value || "").trim();
  if (!text) throw new Error(`Dynamic song ${field} is required.`);
  return text;
}

function stringArray(value) {
  return Array.isArray(value) ? value.map((item) => String(item || "").trim()).filter(Boolean) : [];
}

function normalizeMedia(items, kind) {
  if (!Array.isArray(items)) return [];
  return items.map((item, index) => {
    const src = requiredText(item?.src, `${kind}[${index}].src`);
    if (!src.startsWith("/media/")) throw new Error(`Dynamic song ${kind}[${index}].src must use /media/.`);
    return {
      ...item,
      id: item.id || `${kind}-${index + 1}`,
      title: item.title || `${kind === "audio" ? "Audio" : "Score"} ${index + 1}`,
      src
    };
  });
}

export function normalizeDynamicSong(song) {
  const id = requiredText(song?.id, "id");
  const level = requiredText(song?.level, "level");
  if (!LEVEL_IDS.has(level)) throw new Error(`Dynamic song level is invalid: ${level}`);

  const teachingInput = song.teaching || {};
  const teaching = {
    goal: String(teachingInput.goal || song.goal || "Learn the assigned score with secure rhythm and tone."),
    focus: String(teachingInput.focus || song.focus || "Read, isolate, and connect each section."),
    practiceOrder: stringArray(teachingInput.practiceOrder || song.practiceOrder),
    commonIssues: stringArray(teachingInput.commonIssues || song.commonIssues),
    passStandard: String(teachingInput.passStandard || song.passStandard || "Perform the complete piece with steady time."),
    speed: {
      startBpm: teachingInput.speed?.startBpm ?? song.startBpm ?? null,
      targetBpm: teachingInput.speed?.targetBpm ?? song.targetBpm ?? null,
      unit: String(teachingInput.speed?.unit || song.speedUnit || "BPM")
    }
  };
  const scoreImages = normalizeMedia(song.scoreImages, "scoreImages");

  return {
    ...song,
    id,
    title: requiredText(song.title, "title"),
    artist: requiredText(song.artist, "artist"),
    level,
    sortOrder: Number.isFinite(Number(song.sortOrder)) ? Number(song.sortOrder) : 1000,
    source: String(song.source || "Teacher Upload"),
    sourcePdf: String(song.sourcePdf || "Cloudflare Content Library"),
    category: String(song.category || "Teaching Piece"),
    supplementary: String(song.supplementary || ""),
    style: String(song.style || "Ukulele"),
    techniques: stringArray(song.techniques),
    audio: normalizeMedia(song.audio, "audio"),
    scoreImages,
    scoreImageCount: scoreImages.length,
    teaching,
    goal: teaching.goal,
    focus: teaching.focus,
    practiceOrder: teaching.practiceOrder,
    commonIssues: teaching.commonIssues,
    passStandard: teaching.passStandard,
    catalogOrigin: "dynamic"
  };
}

export function compareCatalogSongs(a, b) {
  const originDiff = (a.catalogOrigin === "dynamic" ? 1 : 0) - (b.catalogOrigin === "dynamic" ? 1 : 0);
  if (originDiff !== 0) return originDiff;
  if (a.catalogOrigin !== "dynamic") return Number(a.catalogOrder || 0) - Number(b.catalogOrder || 0);
  const positionDiff = Number(a.sortOrder || 0) - Number(b.sortOrder || 0);
  if (positionDiff !== 0) return positionDiff;
  return String(a.id).localeCompare(String(b.id), "en");
}

export function mergeCatalog(staticData, manifest = null) {
  const staticSongs = (staticData?.songs || []).map((song, index) => ({
    ...song,
    catalogOrigin: "static",
    catalogOrder: index
  }));
  const mergedSongs = [...staticSongs];
  const idToIndex = new Map(staticSongs.map((song, index) => [song.id, index]));

  for (const candidate of manifest?.songs || []) {
    try {
      const song = normalizeDynamicSong(candidate);
      if (idToIndex.has(song.id)) {
        const index = idToIndex.get(song.id);
        const previous = mergedSongs[index];
        mergedSongs[index] = {
          ...previous,
          ...song,
          audio: song.audio.length ? song.audio : previous.audio || [],
          scoreImages: song.scoreImages.length ? song.scoreImages : previous.scoreImages || [],
          scoreImageCount: song.scoreImages.length ? song.scoreImages.length : previous.scoreImages?.length || 0,
          teaching: {
            ...(previous.teaching || {}),
            ...(song.teaching || {})
          },
          catalogOrder: previous.catalogOrder ?? index,
          replacedStatic: previous.catalogOrigin === "static" || previous.replacedStatic === true
        };
        continue;
      }
      idToIndex.set(song.id, mergedSongs.length);
      mergedSongs.push(song);
    } catch (error) {
      console.warn("Skipped invalid UkuleleBook content record.", error);
    }
  }

  return {
    levels: staticData?.levels || [],
    songs: mergedSongs,
    releaseId: manifest?.releaseId || null
  };
}

function parseCachedManifest(storage) {
  if (!storage) return null;
  try {
    const value = JSON.parse(storage.getItem(CATALOG_CACHE_KEY) || "null");
    return value && typeof value.releaseId === "string" && Array.isArray(value.songs) ? value : null;
  } catch {
    return null;
  }
}

async function fetchJson(fetchImpl, url, options) {
  const response = await fetchImpl(url, options);
  if (!response.ok) throw new Error(`Catalog request failed with HTTP ${response.status}.`);
  return response.json();
}

export async function loadCatalog({ staticData, fetchImpl = fetch, storage = globalThis.localStorage } = {}) {
  try {
    const current = await fetchJson(fetchImpl, "/api/catalog/current", { cache: "no-store" });
    if (!current.releaseId || !current.manifestUrl) {
      return { source: "network", catalog: mergeCatalog(staticData) };
    }
    const manifest = await fetchJson(fetchImpl, current.manifestUrl, { cache: "force-cache" });
    if (manifest.releaseId !== current.releaseId || !Array.isArray(manifest.songs)) {
      throw new Error("Catalog release pointer and manifest do not match.");
    }
    storage?.setItem(CATALOG_CACHE_KEY, JSON.stringify(manifest));
    return { source: "network", catalog: mergeCatalog(staticData, manifest) };
  } catch (error) {
    const cachedManifest = parseCachedManifest(storage);
    if (cachedManifest) return { source: "cache", catalog: mergeCatalog(staticData, cachedManifest), error };
    return { source: "static", catalog: mergeCatalog(staticData), error };
  }
}

