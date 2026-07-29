export function renderScorePane({ song }) {
  const scoreImages = Array.isArray(song?.scoreImages) ? song.scoreImages : [];
  if (!scoreImages.length) {
    return `
        <div class="resource-note">
          <span>谱面图片</span>
          <strong>谱面图片待加入</strong>
          <small>后续可按 Intro、Verse、Chorus、Fill 等段落上传。</small>
        </div>
      `;
  }
  return scoreImages
    .map(
      (item) => `
          <figure class="score-card score-sheet">
            <div class="score-image-frame">
              <img src="${item.src}" alt="${item.title || song.title}" loading="eager" decoding="async" />
            </div>
          </figure>
        `
    )
    .join("");
}
