export function renderDetailShell({ activeTab = "lesson", audioHtml = "", lessonHtml = "", scoreHtml = "", metronomeHtml = "" }) {
  return `
      <div class="lesson-tabs" role="tablist" aria-label="歌曲详情">
        ${renderTabButton("lesson", "教学", activeTab)}
        ${renderTabButton("audio", "音频", activeTab)}
        ${renderTabButton("score", "谱面", activeTab)}
        ${renderTabButton("metronome", "节拍器", activeTab)}
      </div>
      <div class="lesson-pane lesson-audio-pane" data-detail-pane="audio" data-audio-pane ${activeTab === "audio" ? "" : "hidden"}>${audioHtml}</div>
      <div class="lesson-pane" data-detail-pane="lesson" ${activeTab === "lesson" ? "" : "hidden"}>${lessonHtml}</div>
      <div class="lesson-pane" data-detail-pane="score" ${activeTab === "score" ? "" : "hidden"}>${scoreHtml}</div>
      <div class="lesson-pane" data-detail-pane="metronome" ${activeTab === "metronome" ? "" : "hidden"}>${metronomeHtml}</div>
    `;
}

function renderTabButton(tab, label, activeTab) {
  const isActive = tab === activeTab;
  return `<button type="button" class="${isActive ? "is-active" : ""}" data-tab="${tab}" aria-selected="${isActive ? "true" : "false"}">${label}</button>`;
}
