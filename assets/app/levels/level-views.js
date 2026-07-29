import { levelShort } from "../shared/formatting.js";

const chromaPalette = [
  { border: "#7CF6A3", gradient: "linear-gradient(145deg, #7CF6A3, #153047)" },
  { border: "#FFD166", gradient: "linear-gradient(210deg, #FFD166, #153047)" },
  { border: "#FF8FAB", gradient: "linear-gradient(165deg, #FF8FAB, #153047)" },
  { border: "#5CC8FF", gradient: "linear-gradient(195deg, #5CC8FF, #153047)" },
  { border: "#B8F35A", gradient: "linear-gradient(225deg, #B8F35A, #153047)" },
  { border: "#31D6FF", gradient: "linear-gradient(135deg, #31D6FF, #153047)" },
  { border: "#FF7A59", gradient: "linear-gradient(155deg, #FF7A59, #153047)" },
  { border: "#FF66CF", gradient: "linear-gradient(215deg, #FF66CF, #153047)" },
  { border: "#2DD4BF", gradient: "linear-gradient(180deg, #2DD4BF, #153047)" }
];

export function chromaStyle(level) {
  const item = chromaPalette[level.order % chromaPalette.length];
  return `--card-border:${item.border}; --card-gradient:${item.gradient};`;
}

export function renderLevelMedia({ level, songCount }) {
  const shortName = levelShort(level);
  if (level.coverImage) {
    return `
        <div class="circular-media has-cover">
          <img
            class="circular-cover-image"
            src="${level.coverImage}"
            alt=""
            loading="eager"
            decoding="async"
          />
          <div class="circular-cover-meta" aria-hidden="true">
            <strong>${songCount}</strong>
            <em>songs</em>
          </div>
        </div>
      `;
  }

  return `
      <div class="circular-media">
        <span>${shortName}</span>
        <strong>${songCount}</strong>
        <em>songs</em>
      </div>
    `;
}

export function renderLevelBoardView({ levels, state, levelCount }) {
  return `<div class="circular-gallery-track">` + levels
    .map((level) => {
      const active = state.level === level.id ? " is-active" : "";
      const expanded = state.levelPickerOpen && state.activeLevelPicker === level.id ? "true" : "false";
      return `
          <button
            type="button"
            class="level-label circular-card chroma-card${level.coverImage ? " has-book-cover" : ""}${active}"
            data-level="${level.id}"
            aria-controls="levelSongPicker"
            aria-expanded="${expanded}"
            style="${chromaStyle(level)}"
          >
            ${renderLevelMedia({ level, songCount: levelCount(level.id) })}
            <footer class="circular-caption chroma-info">
              <h3 class="name">${level.label}</h3>
              <span class="handle">${level.techniques[0] || "strum"}</span>
              <p class="role">${level.core}</p>
              <span class="location">${level.techniques.slice(0, 2).join(" / ")}</span>
            </footer>
          </button>
        `;
    })
    .join("") + `</div>
        <button class="level-gallery-arrow level-gallery-prev" type="button" data-level-gallery-prev aria-label="Previous level cover">
          <span aria-hidden="true">&lsaquo;</span>
        </button>
        <button class="level-gallery-arrow level-gallery-next" type="button" data-level-gallery-next aria-label="Next level cover">
          <span aria-hidden="true">&rsaquo;</span>
        </button>
        <div class="chroma-overlay"></div><div class="chroma-fade"></div>`;
}

export function renderLevelSongPickerView({ level, songs }) {
  return `
      <section class="level-song-picker-panel" aria-label="${level.label} 歌曲选择">
        <div class="level-song-picker-head">
          <div>
            <p class="marker-caption">选择一首歌</p>
            <h3>${level.label} 歌曲抽屉</h3>
            <p>${level.core}</p>
          </div>
          <button type="button" class="picker-close" data-close-picker aria-label="关闭歌曲选择">×</button>
        </div>
        <div class="level-song-picker-body">
          <canvas class="level-song-splash" aria-hidden="true"></canvas>
          <div class="level-song-picker-grid chroma-grid" style="--r: 300px;">
            ${songs
              .map((song, index) => `
                <button
                  type="button"
                  class="song-picker-card chroma-card"
                  data-song="${song.id}"
                  aria-label="选择 ${song.title}"
                >
                  <div class="chroma-img-wrapper song-picker-visual">
                    <span>${levelShort(level)}</span>
                    <strong>${String(index + 1).padStart(2, "0")}</strong>
                    <em>${song.category}</em>
                  </div>
                  <footer class="chroma-info song-picker-info">
                    <h3 class="name">${song.title}</h3>
                    <p class="role">${song.artist || "Ukulele Template"} · ${song.style}</p>
                    <span class="location">${song.techniques.slice(0, 2).join(" / ")}</span>
                  </footer>
                </button>
              `)
              .join("")}
          </div>
        </div>
      </section>
    `;
}
