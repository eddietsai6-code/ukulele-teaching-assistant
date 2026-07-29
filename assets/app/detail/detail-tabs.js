export function applyDetailTab(root, activeTab) {
  if (!root) return;
  root.querySelectorAll("[data-tab]").forEach((button) => {
    const isActive = button.dataset.tab === activeTab;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", isActive ? "true" : "false");
  });

  root.querySelectorAll("[data-detail-pane]").forEach((pane) => {
    pane.hidden = pane.dataset.detailPane !== activeTab;
  });
}
