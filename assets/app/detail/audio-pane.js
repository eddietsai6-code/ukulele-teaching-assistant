import { escapeAttribute, escapeHtml } from "../shared/escape.js";
import { activeAudioVersionIndex, audioVersionSlots } from "../shared/media.js";

export function renderAudioPane({ song, audioVersionBySong = {} }) {
  const slots = audioVersionSlots(song);
  if (!slots.length) {
    return `
        <div class="audio-workbench">
          <div class="resource-note">
            <span>音频</span>
            <strong>歌曲音频待加入</strong>
            <small>导入授权音频后，这里会显示可播放版本。</small>
          </div>
        </div>
      `;
  }
  const activeIndex = activeAudioVersionIndex(song, slots, audioVersionBySong);
  const activeSlot = slots[activeIndex];
  const playerLabel = `${song.title} - ${activeSlot.displayTitle}`;

  return `
      <div class="audio-workbench">
        <div class="audio-player-frame">
          <div class="audio-version-head">
            <span>播放器版本</span>
            <strong>${escapeHtml(song.title)}</strong>
            <em>${escapeHtml(activeSlot.displayTitle)}</em>
          </div>
          <div class="audio-version-selector" role="tablist" aria-label="${escapeAttribute(song.title)} audio versions">
            ${slots
              .map(
                (slot) => `
                  <button
                    type="button"
                    class="audio-version-button${slot.index === activeIndex ? " is-active" : ""}"
                    role="tab"
                    aria-selected="${slot.index === activeIndex ? "true" : "false"}"
                    data-audio-version="${slot.index}"
                  >
                    <span>${slot.number}</span>
                    <strong>${escapeHtml(slot.displayTitle)}</strong>
                    <small>${escapeHtml(slot.src)}</small>
                  </button>
                `
              )
              .join("")}
          </div>
          <div class="audio-player-shell" data-audio-player-shell>
            <audio-speed-player
              src="${escapeAttribute(activeSlot.src)}"
              label="${escapeAttribute(playerLabel)}"
              rate="1"
              rate-presets="0.75,0.85,1,1.25,1.5"
              min-rate="0.75"
              max-rate="1.5"
              step="0.05"
              engine="rubberband"
              preload="metadata"
              keep-pitch
              visualizer="metaballs"
              no-upload
            ></audio-speed-player>
            <p>播放器会读取当前歌曲的项目内音频资源。</p>
          </div>
        </div>
      </div>
    `;
}
