export function renderLessonPane({ song, level }) {
  const teaching = song?.teaching || {};
  const practiceOrder = Array.isArray(teaching.practiceOrder) ? teaching.practiceOrder : [];
  const commonIssues = Array.isArray(teaching.commonIssues) ? teaching.commonIssues : [];

  return `
      <div class="practice-steps">
        ${practiceOrder
          .map(
            (step, index) => `
              <div>
                <span>${String(index + 1).padStart(2, "0")}</span>
                <strong>${step}</strong>
              </div>
            `
          )
          .join("")}
      </div>
      <dl class="lesson-list">
        <dt>教学目标</dt><dd>${teaching.goal || ""}</dd>
        <dt>技术要点</dt><dd>${teaching.focus || ""}</dd>
        <dt>常见问题</dt><dd>${commonIssues.join("；")}</dd>
        <dt>通过标准</dt><dd>${teaching.passStandard || ""}</dd>
        <dt>等级依据</dt><dd>${level.label} · ${level.core}</dd>
      </dl>
    `;
}
