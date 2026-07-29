import { levelShort } from "../shared/formatting.js";

export function renderHeroNotebookView({ song, level }) {
  if (!song || !level) return "";
  return `
      <div class="notebook-cover">
        <div class="cover-pattern"></div>
        <div class="name-sticker">
          <span>Song</span>
          <strong>${song.title}</strong>
          <div class="sticker-grid">
            <p><span>Level</span><b>${levelShort(level)}</b></p>
            <p><span>Path</span><b>${song.source.includes("Pack") ? "uke" : "song"}</b></p>
          </div>
        </div>
        <p class="cover-note">${song.artist || "Template Original"} · ${song.style}</p>
      </div>
    `;
}
