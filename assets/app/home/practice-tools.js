export function initPracticeToolsCarousel(documentRef = document) {
  const shells = Array.from(documentRef.querySelectorAll("[data-practice-tools]"));
  if (!shells.length) return;

  shells.forEach((shell) => {
    const pages = Array.from(shell.querySelectorAll("[data-practice-tool-page]"));
    if (!pages.length) return;

    const previousButton = shell.querySelector("[data-practice-tool-prev]");
    const nextButton = shell.querySelector("[data-practice-tool-next]");
    const label = shell.querySelector("[data-practice-tool-label]");
    const status = shell.querySelector("[data-practice-tool-status]");
    let activeIndex = Math.max(
      0,
      pages.findIndex((page) => page.classList.contains("is-active"))
    );

    shell.style.setProperty("--practice-tool-count", String(pages.length));

    const setActiveTool = (index) => {
      activeIndex = (index + pages.length) % pages.length;
      const activePage = pages[activeIndex];
      const activeTool = activePage.dataset.practiceToolPage || `tool-${activeIndex + 1}`;
      const activeName = activePage.dataset.practiceToolName || activeTool;

      shell.dataset.activeTool = activeTool;
      shell.style.setProperty("--practice-tool-index", String(activeIndex));
      pages.forEach((page, pageIndex) => {
        const isActive = pageIndex === activeIndex;
        page.classList.toggle("is-active", isActive);
        page.setAttribute("aria-hidden", isActive ? "false" : "true");
      });

      if (label) label.textContent = activeName;
      if (status) status.textContent = `${activeIndex + 1} / ${pages.length}`;
    };

    previousButton?.addEventListener("click", () => setActiveTool(activeIndex - 1));
    nextButton?.addEventListener("click", () => setActiveTool(activeIndex + 1));
    setActiveTool(activeIndex);
  });
}
