export function mountTrueFocus(root, options = {}) {
  if (!root || root.dataset.trueFocusMounted === "true") return;

  const win = options.windowRef || window;
  const words = [...root.querySelectorAll(".true-focus-word")];
  const frame = root.querySelector(".true-focus-frame");
  if (!words.length || !frame) return;

  const intervalMs = Number(root.dataset.interval || options.intervalMs || 1900);
  const reduceMotion = win.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  let activeIndex = Math.max(0, words.findIndex((word) => word.classList.contains("is-active")));
  let timer = 0;

  const syncFrame = () => {
    const active = words[activeIndex];
    if (!active) return;

    const activeRect = active.getBoundingClientRect();
    const rootRect = root.getBoundingClientRect();
    const scaleX = root.offsetWidth ? rootRect.width / root.offsetWidth : 1;
    const scaleY = root.offsetHeight ? rootRect.height / root.offsetHeight : 1;

    frame.style.width = `${activeRect.width / scaleX}px`;
    frame.style.height = `${activeRect.height / scaleY}px`;
    frame.style.transform = `translate(${(activeRect.left - rootRect.left) / scaleX}px, ${(activeRect.top - rootRect.top) / scaleY}px)`;
    frame.style.opacity = "1";
  };

  const setActive = (nextIndex) => {
    activeIndex = (nextIndex + words.length) % words.length;
    words.forEach((word, index) => {
      const isActive = index === activeIndex;
      word.classList.toggle("is-active", isActive);
      word.setAttribute("aria-current", isActive ? "true" : "false");
    });
    win.requestAnimationFrame(syncFrame);
  };

  const startAutoFocus = () => {
    if (reduceMotion || words.length < 2 || timer) return;
    timer = win.setInterval(() => setActive(activeIndex + 1), intervalMs);
  };

  const restartAutoFocus = () => {
    win.clearInterval(timer);
    timer = 0;
    startAutoFocus();
  };

  words.forEach((word, index) => {
    const activate = () => {
      setActive(index);
      restartAutoFocus();
    };
    word.addEventListener("pointerenter", activate);
    word.addEventListener("pointerdown", activate);
    word.addEventListener("focus", activate);
  });

  if ("ResizeObserver" in win) {
    new win.ResizeObserver(syncFrame).observe(root);
  } else {
    win.addEventListener("resize", syncFrame, { passive: true });
  }

  root.dataset.trueFocusMounted = "true";
  setActive(activeIndex);
  startAutoFocus();
}
