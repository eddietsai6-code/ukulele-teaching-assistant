import { compactAudioVersionTitle } from "./formatting.js";

export function audioVersionSlots(song) {
  const audioItems = Array.isArray(song?.audio) ? song.audio : [];
  return audioItems.map((item, index) => {
    const title = item.title || item.label || item.name || `版本 ${index + 1}`;
    return {
      index,
      number: String(index + 1).padStart(2, "0"),
      title,
      displayTitle: compactAudioVersionTitle(song.title, title, index),
      src: item.src || ""
    };
  });
}

export function activeAudioVersionIndex(song, slots, audioVersionBySong = {}) {
  const value = Number(audioVersionBySong[song?.id] || 0);
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(slots.length - 1, value));
}
