import { createLevelSongSplash } from "./level-song-splash.js";
import { renderLevelBoardView, renderLevelSongPickerView } from "./level-views.js";

export function createLevelController({
  els,
  data,
  state,
  levelById,
  visibleSongs,
  selectSong,
  renderApp,
  documentRef = globalThis.document,
  windowRef = globalThis.window
}) {
  const levelGallery = {
    initialized: false,
    cards: [],
    current: 0,
    target: 0,
    frame: 0,
    pointerDown: false,
    moved: false,
    startX: 0,
    startTarget: 0,
    cardStep: 320
  };
  const levelSongSplash = createLevelSongSplash(windowRef);

  function levelCount(levelId) {
    return visibleSongs().filter((song) => song.level === levelId).length;
  }

  function songsForLevel(levelId) {
    return visibleSongs()
      .filter((song) => song.level === levelId)
      .sort((a, b) => a.title.localeCompare(b.title, "zh-CN"));
  }

  function closeLevelSongPicker() {
    if (!els.levelSongPicker) return;
    state.levelPickerOpen = false;
    renderApp();
  }

  function openLevelSongPicker(levelId) {
    if (!levelById[levelId]) return;
    state.level = levelId;
    state.activeLevelPicker = levelId;
    state.levelPickerOpen = true;
    state.detailTab = "lesson";
    if (!els.levelBoard && !els.levelSongPicker) return;
    renderApp();
    els.levelSongPicker?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function renderLevelSongPicker() {
    if (!els.levelSongPicker) return;
    const level = levelById[state.activeLevelPicker];
    if (!state.levelPickerOpen || !level) {
      levelSongSplash.reset();
      els.levelSongPicker.hidden = true;
      els.levelSongPicker.innerHTML = "";
      return;
    }

    const songs = songsForLevel(level.id);
    els.levelSongPicker.hidden = false;
    els.levelSongPicker.innerHTML = renderLevelSongPickerView({ level, songs });
    bindLevelSongPicker();
  }

  function bindLevelSongPicker() {
    if (!els.levelSongPicker) return;
    const grid = els.levelSongPicker.querySelector(".level-song-picker-grid");
    const fade = grid?.querySelector(".chroma-fade");
    if (grid) {
      levelSongSplash.init(grid, els.levelSongPicker);
      grid.style.setProperty("--x", "50%");
      grid.style.setProperty("--y", "50%");
      grid.onpointermove = (event) => {
        const rect = grid.getBoundingClientRect();
        grid.style.setProperty("--x", `${event.clientX - rect.left}px`);
        grid.style.setProperty("--y", `${event.clientY - rect.top}px`);
        if (fade) fade.style.opacity = "0";
        levelSongSplash.paint(event, 0.84);

        const card = event.target.closest(".chroma-card");
        if (card) {
          const cardRect = card.getBoundingClientRect();
          card.style.setProperty("--mouse-x", `${event.clientX - cardRect.left}px`);
          card.style.setProperty("--mouse-y", `${event.clientY - cardRect.top}px`);
        }
      };
      grid.onpointerdown = (event) => levelSongSplash.paint(event, 1.45);
      grid.onpointerleave = () => {
        if (fade) fade.style.opacity = "1";
      };
    }

    els.levelSongPicker.querySelector("[data-close-picker]")?.addEventListener("click", closeLevelSongPicker);
    els.levelSongPicker.querySelectorAll("[data-song]").forEach((button) => {
      button.addEventListener("click", () => selectSong(button.dataset.song, true));
    });
  }

  function renderLevelBoard() {
    if (!els.levelBoard) return;
    els.levelBoard.innerHTML = renderLevelBoardView({ levels: data.levels, state, levelCount });

    levelGallery.cards = [...els.levelBoard.querySelectorAll("[data-level]")];
    const selectedIndex = data.levels.findIndex((level) => level.id === state.level);
    if (!levelGallery.initialized) {
      levelGallery.current = selectedIndex >= 0 ? selectedIndex : 0;
      levelGallery.target = levelGallery.current;
      levelGallery.initialized = true;
    } else if (selectedIndex >= 0) {
      levelGallery.target = selectedIndex;
    }

    levelGallery.cards.forEach((button, index) => {
      button.dataset.galleryIndex = String(index);
    });
    bindLevelGalleryControls();
    bindChromaGrid();
    updateLevelGalleryLayout();
  }

  function clampGalleryTarget(value) {
    return Math.max(0, Math.min(data.levels.length - 1, value));
  }

  function startLevelGalleryAnimation() {
    if (!levelGallery.frame) {
      levelGallery.frame = windowRef.requestAnimationFrame(animateLevelGallery);
    }
  }

  function updateLevelGalleryLayout() {
    const root = els.levelBoard;
    if (!root || !levelGallery.cards.length) return;
    levelGallery.cardStep = Math.min(360, Math.max(235, root.clientWidth * 0.36));

    levelGallery.cards.forEach((card, index) => {
      const offset = index - levelGallery.current;
      const abs = Math.abs(offset);
      const bend = Math.pow(Math.min(abs, 3.4), 1.65) * 24;
      const translateX = offset * levelGallery.cardStep;
      const rotate = offset * -4.5;
      const scale = Math.max(0.68, 1 - abs * 0.085);
      const alpha = abs > 4.1 ? 0 : Math.max(0.24, 1 - abs * 0.18);
      const zIndex = Math.max(1, 100 - Math.round(abs * 10));
      card.style.setProperty("--tx", `${translateX}px`);
      card.style.setProperty("--ty", `${bend}px`);
      card.style.setProperty("--rz", `${rotate}deg`);
      card.style.setProperty("--scale", scale.toFixed(3));
      card.style.setProperty("--alpha", alpha.toFixed(3));
      card.style.zIndex = String(zIndex);
      card.tabIndex = abs < 2.6 ? 0 : -1;
    });
  }

  function animateLevelGallery() {
    levelGallery.current += (levelGallery.target - levelGallery.current) * 0.08;
    if (Math.abs(levelGallery.target - levelGallery.current) < 0.002) {
      levelGallery.current = levelGallery.target;
      updateLevelGalleryLayout();
      levelGallery.frame = 0;
      return;
    }
    updateLevelGalleryLayout();
    levelGallery.frame = windowRef.requestAnimationFrame(animateLevelGallery);
  }

  function bindLevelGalleryControls() {
    const root = els.levelBoard;
    if (!root) return;
    root.querySelector("[data-level-gallery-prev]")?.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      levelGallery.target = clampGalleryTarget(Math.round(levelGallery.target) - 1);
      startLevelGalleryAnimation();
    });
    root.querySelector("[data-level-gallery-next]")?.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      levelGallery.target = clampGalleryTarget(Math.round(levelGallery.target) + 1);
      startLevelGalleryAnimation();
    });
  }

  function bindChromaGrid() {
    const root = els.levelBoard;
    if (!root) return;
    const fade = root.querySelector(".chroma-fade");
    root.style.setProperty("--x", "50%");
    root.style.setProperty("--y", "50%");
    root.onpointerdown = (event) => {
      const dragCard = event.target.closest("#levelBoard [data-level]");
      if (!dragCard) return;
      levelGallery.pointerDown = true;
      levelGallery.moved = false;
      levelGallery.startX = event.clientX;
      levelGallery.startTarget = levelGallery.target;
      root.classList.add("is-dragging");
      root.setPointerCapture?.(event.pointerId);
    };
    root.onpointermove = (event) => {
      const rect = root.getBoundingClientRect();
      root.style.setProperty("--x", `${event.clientX - rect.left}px`);
      root.style.setProperty("--y", `${event.clientY - rect.top}px`);
      if (fade) fade.style.opacity = "0";

      const card = event.target.closest(".chroma-card");
      if (card) {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mouse-x", `${event.clientX - rect.left}px`);
        card.style.setProperty("--mouse-y", `${event.clientY - rect.top}px`);
      }

      if (levelGallery.pointerDown) {
        const delta = (levelGallery.startX - event.clientX) / levelGallery.cardStep;
        if (Math.abs(event.clientX - levelGallery.startX) > 6) levelGallery.moved = true;
        levelGallery.target = clampGalleryTarget(levelGallery.startTarget + delta);
        startLevelGalleryAnimation();
      }
    };
    root.onpointerup = (event) => {
      if (!levelGallery.pointerDown) return;
      levelGallery.pointerDown = false;
      levelGallery.target = Math.round(clampGalleryTarget(levelGallery.target));
      root.classList.remove("is-dragging");
      if (event.pointerId !== undefined && root.hasPointerCapture?.(event.pointerId)) {
        root.releasePointerCapture(event.pointerId);
      }
      startLevelGalleryAnimation();
      windowRef.setTimeout(() => {
        levelGallery.moved = false;
      }, 0);
    };
    root.onpointercancel = root.onpointerup;
    root.onclick = (event) => {
      const pointed = documentRef?.elementFromPoint?.(event.clientX, event.clientY);
      const button = pointed?.closest("#levelBoard [data-level]") || event.target.closest("[data-level]");
      if (!button || levelGallery.moved) return;
      const index = Number(button.dataset.galleryIndex || 0);
      levelGallery.target = index;
      startLevelGalleryAnimation();
      openLevelSongPicker(button.dataset.level);
    };
    root.onpointerleave = () => {
      levelGallery.pointerDown = false;
      root.classList.remove("is-dragging");
      if (fade) fade.style.opacity = "1";
    };
    root.onkeydown = (event) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        levelGallery.target = clampGalleryTarget(Math.round(levelGallery.target) + 1);
        startLevelGalleryAnimation();
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        levelGallery.target = clampGalleryTarget(Math.round(levelGallery.target) - 1);
        startLevelGalleryAnimation();
      }
      if (event.key === "Home") {
        event.preventDefault();
        levelGallery.target = 0;
        startLevelGalleryAnimation();
      }
      if (event.key === "End") {
        event.preventDefault();
        levelGallery.target = data.levels.length - 1;
        startLevelGalleryAnimation();
      }
    };
  }

  function render() {
    renderLevelBoard();
    renderLevelSongPicker();
  }

  return {
    closeLevelSongPicker,
    openLevelSongPicker,
    render
  };
}
