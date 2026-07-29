export function levelShort(level) {
  if (typeof level?.order === "number") return level.order === 0 ? "Debut" : `G${level.order}`;
  if (!level?.name) return "";
  const match = String(level.name).match(/(\d+)/);
  if (match) return `G${match[1]}`;
  return /debut/i.test(level.name) ? "Debut" : String(level.name).slice(0, 2).toUpperCase();
}

export function compactAudioVersionTitle(songTitle, versionTitle, index) {
  const fallback = `版本 ${index + 1}`;
  const songName = String(songTitle || "").trim();
  const rawTitle = String(versionTitle || "").trim() || fallback;
  if (!songName) return rawTitle;

  const escapedSongName = songName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const separator = "\\s*[-\\u2013\\u2014:\\uFF1A\\u00B7/|]*\\s*";
  const cleaned = rawTitle
    .replace(new RegExp(`^${escapedSongName}${separator}`, "i"), "")
    .replace(new RegExp(`${separator}${escapedSongName}$`, "i"), "")
    .replace(/\s+/g, " ")
    .trim();

  return cleaned || (rawTitle === songName ? fallback : rawTitle);
}

export function formatAudioDuration(seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) return "--:--";
  const totalSeconds = Math.round(seconds);
  const minutes = Math.floor(totalSeconds / 60);
  const rest = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${rest}`;
}
