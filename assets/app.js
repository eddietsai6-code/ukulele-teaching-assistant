import { filterSongs } from "./app/catalog/filtering.js";
import { getPublicDomRoots } from "./app/core/dom-roots.js";
import { renderHeroNotebookView } from "./app/home/hero-notebook.js";
import { mountHeroLanyard } from "./app/home/lanyard.js";
import { mountHeroSongSearch } from "./app/home/hero-song-search.js";
import { mountTailarkHeroScale } from "./app/home/tailark-hero-scale.js";
import { mountTextPressure } from "./app/home/text-pressure.js";
import { createLevelSongSplash } from "./app/levels/level-song-splash.js";
import { renderLevelBoardView, renderLevelSongPickerView } from "./app/levels/level-views.js";
import { renderAudioPane } from "./app/detail/audio-pane.js";
import { renderDetailShell } from "./app/detail/detail-shell.js";
import { applyDetailTab } from "./app/detail/detail-tabs.js";
import { renderLessonPane } from "./app/detail/lesson-pane.js";
import { renderMetronomePane } from "./app/detail/metronome-pane.js";
import { renderScorePane } from "./app/detail/score-pane.js";
import { tagMarkup, techButtonMarkup } from "./app/shared/tags.js";

(function () {
  const data = window.UKULELE_LEVEL_DATA;
  const songTechProfiles = window.UKULELE_SONG_TECH_PROFILES || {};

  function mergeSongTechProfiles() {
    data.songs.forEach((song) => {
      const profile = songTechProfiles[song.id];
      if (!profile) return;
      song.technicalProfile = profile;
      if (Array.isArray(profile.tags) && profile.tags.length) {
        song.techniques = profile.tags;
      }
      song.teaching = {
        ...song.teaching,
        focus: profile.focus || song.teaching.focus,
        practiceOrder: Array.isArray(profile.practiceOrder) ? profile.practiceOrder : song.teaching.practiceOrder,
        commonIssues: Array.isArray(profile.commonIssues) ? profile.commonIssues : song.teaching.commonIssues,
        passStandard: profile.passStandard || song.teaching.passStandard
      };
    });
  }

  mergeSongTechProfiles();

  function hasSongResources(song) {
    const hasAudio = Array.isArray(song.audio) && song.audio.some((item) => item && item.src);
    const hasScore = Array.isArray(song.scoreImages) && song.scoreImages.some((item) => item && item.src);
    return hasAudio || hasScore;
  }

  function visibleSongs() {
    return data.songs.filter(hasSongResources);
  }

  const state = {
    query: "",
    level: "all",
    source: "all",
    category: "all",
    selectedSongId: visibleSongs()[0] ? visibleSongs()[0].id : "",
    detailTab: "lesson",
    activeLevelPicker: "",
    levelPickerOpen: false,
    audioVersionBySong: {}
  };

  const els = getPublicDomRoots(document);

  const levelById = Object.fromEntries(data.levels.map((level) => [level.id, level]));
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
  const levelSongSplash = createLevelSongSplash(window);
  function normalize(value) {
    return String(value || "").toLowerCase().trim();
  }

  function uniqueValues(key) {
    return [...new Set(visibleSongs().map((song) => song[key]).filter(Boolean))].sort();
  }

  function getSelectedSong() {
    return visibleSongs().find((song) => song.id === state.selectedSongId) || visibleSongs()[0] || null;
  }

  function preferredDetailTabForSong(songId) {
    const song = visibleSongs().find((item) => item.id === songId);
    return song && Array.isArray(song.audio) && song.audio.length ? "audio" : "lesson";
  }

  function levelCount(levelId) {
    return visibleSongs().filter((song) => song.level === levelId).length;
  }

  function songsForLevel(levelId) {
    return visibleSongs()
      .filter((song) => song.level === levelId)
      .sort((a, b) => a.title.localeCompare(b.title, "zh-CN"));
  }

  function getFilteredSongs() {
    return filterSongs({
      songs: visibleSongs(),
      levels: data.levels,
      query: state.query,
      level: state.level,
      source: state.source,
      category: state.category
    });
  }

  function initFilters() {
    if (!els.levelFilter || !els.sourceFilter || !els.categoryFilter) return;
    data.levels.forEach((level) => {
      const option = document.createElement("option");
      option.value = level.id;
      option.textContent = level.label;
      els.levelFilter.appendChild(option);
    });

    uniqueValues("source").forEach((source) => {
      const option = document.createElement("option");
      option.value = source;
      option.textContent = source;
      els.sourceFilter.appendChild(option);
    });

    uniqueValues("category").forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      els.categoryFilter.appendChild(option);
    });
  }

  function syncControls() {
    if (els.queryInput) els.queryInput.value = state.query;
    if (els.sourceFilter) els.sourceFilter.value = state.source;
    if (els.categoryFilter) els.categoryFilter.value = state.category;
    if (els.levelFilter) els.levelFilter.value = state.level;
  }

  function setLevel(levelId, shouldScroll) {
    state.level = levelId;
    state.detailTab = "lesson";
    if (levelId === "all") state.levelPickerOpen = false;
    render();
    if (shouldScroll) document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
  }

  function setQuery(query, shouldScroll) {
    state.query = query;
    state.detailTab = "lesson";
    render();
    if (shouldScroll) document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
  }

  function selectSong(songId, shouldScroll) {
    state.selectedSongId = songId;
    state.detailTab = preferredDetailTabForSong(songId);
    state.levelPickerOpen = false;
    render();
    if (shouldScroll) document.getElementById("lesson").scrollIntoView({ behavior: "smooth" });
  }

  function openLevelSongPicker(levelId) {
    if (!levelById[levelId]) return;
    state.level = levelId;
    state.activeLevelPicker = levelId;
    state.levelPickerOpen = true;
    state.detailTab = "lesson";
    render();
    els.levelSongPicker?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function closeLevelSongPicker() {
    state.levelPickerOpen = false;
    render();
  }

  function renderHeroNotebook() {
    if (els.heroNotebook?.querySelector("#ukuleleTuner")) return;

    const song = getSelectedSong();
    if (!song) return;
    const level = levelById[song.level];
    els.heroNotebook.innerHTML = renderHeroNotebookView({ song, level });
  }

  mountTailarkHeroScale(document, window);
  mountTextPressure(els.heroPressure);



  mountHeroLanyard(els.heroLanyard);



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
      levelGallery.frame = requestAnimationFrame(animateLevelGallery);
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
    levelGallery.frame = requestAnimationFrame(animateLevelGallery);
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
      setTimeout(() => {
        levelGallery.moved = false;
      }, 0);
    };
    root.onpointercancel = root.onpointerup;
    root.onclick = (event) => {
      const pointed = document.elementFromPoint(event.clientX, event.clientY);
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

  function renderTechCloud(filteredSongs) {
    if (!els.techCloud) return;
    const counts = new Map();
    filteredSongs.forEach((song) => {
      song.techniques.forEach((tech) => counts.set(tech, (counts.get(tech) || 0) + 1));
    });

    const tags = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 14);
    els.techCloud.innerHTML = `
      <span>技巧标签</span>
      ${tags
        .map(
          ([tech, count]) => `
            <button type="button" data-tech="${tech}" class="${normalize(state.query) === normalize(tech) ? "is-active" : ""}">
              ${tech}<em>${count}</em>
            </button>
          `
        )
        .join("")}
    `;

    els.techCloud.querySelectorAll("[data-tech]").forEach((button) => {
      button.addEventListener("click", () => setQuery(button.dataset.tech, false));
    });
  }

  function mountLessonMetronome(root = els.songDetail) {
    const host = root?.querySelector("[data-metronome-host]");
    if (!host) return;
    window.UkeBookMetronome?.mount(host);
  }

  function bindDetailTechButtons(root) {
    root.querySelectorAll("[data-tech]").forEach((button) => {
      button.addEventListener("click", () => setQuery(button.dataset.tech, true));
    });
  }

  function normalizeDetailTab(tab) {
    return ["lesson", "audio", "score", "metronome"].includes(tab) ? tab : "lesson";
  }

  function refreshAudioPane(song) {
    const audioPane = els.songDetail.querySelector('[data-detail-pane="audio"]');
    if (!audioPane) return;
    audioPane.innerHTML = renderAudioPane({ song, audioVersionBySong: state.audioVersionBySong });
    bindAudioVersionButtons(audioPane, song);
  }

  function bindAudioVersionButtons(root, song) {
    root.querySelectorAll("[data-audio-version]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        state.audioVersionBySong[song.id] = Number(button.dataset.audioVersion || 0);
        state.detailTab = "audio";
        updateSongDetailTab();
        refreshAudioPane(song);
      });
    });
  }

  function updateSongDetailTab() {
    state.detailTab = normalizeDetailTab(state.detailTab);
    applyDetailTab(els.songDetail, state.detailTab);
  }

  function renderSongDetail() {
    if (!els.songDetail) return;
    const song = getSelectedSong();
    if (!song) {
      els.songDetail.innerHTML = `<div class="empty-note">请选择一首歌。</div>`;
      return;
    }
    const level = levelById[song.level];
    state.detailTab = normalizeDetailTab(state.detailTab);
    const detailShell = renderDetailShell({
      activeTab: state.detailTab,
      audioHtml: renderAudioPane({ song, audioVersionBySong: state.audioVersionBySong }),
      lessonHtml: renderLessonPane({ song, level }),
      scoreHtml: `<div class="score-grid">${renderScorePane({ song })}</div>`,
      metronomeHtml: renderMetronomePane()
    });

    els.songDetail.innerHTML = `
      <div class="lesson-cover">
        <span class="label-field">Song</span>
        <h3>${song.title}</h3>
        <p>${song.artist || "Ukulele Template"} · ${song.style}</p>
        <div class="sticker-grid lesson-fields">
          <p><span>Level</span><b>${level.label}</b></p>
          <p><span>Source</span><b>${song.source}</b></p>
          <p><span>Type</span><b>${song.category}</b></p>
        </div>
        <div class="song-tags">${techButtonMarkup(song.techniques)}</div>
      </div>
      ${detailShell}
    `;

    els.songDetail.querySelectorAll("[data-tab]").forEach((button) => {
      button.addEventListener("click", () => {
        state.detailTab = button.dataset.tab;
        updateSongDetailTab();
      });
    });

    bindAudioVersionButtons(els.songDetail, song);
    bindDetailTechButtons(els.songDetail);
    mountLessonMetronome(els.songDetail);
  }

  function render() {
    const filteredSongs = getFilteredSongs();
    if (!filteredSongs.some((song) => song.id === state.selectedSongId)) {
      state.selectedSongId = filteredSongs[0] ? filteredSongs[0].id : "";
      state.detailTab = preferredDetailTabForSong(state.selectedSongId);
    }
    syncControls();
    renderHeroNotebook();
    renderLevelBoard();
    renderLevelSongPicker();
    renderTechCloud(filteredSongs);
    renderSongDetail();
  }

  function bindEvents() {
    els.queryInput?.addEventListener("input", (event) => {
      state.query = event.target.value;
      state.detailTab = "lesson";
      render();
    });

    els.sourceFilter?.addEventListener("change", (event) => {
      state.source = event.target.value;
      state.detailTab = "lesson";
      render();
    });

    els.categoryFilter?.addEventListener("change", (event) => {
      state.category = event.target.value;
      state.detailTab = "lesson";
      render();
    });

    els.levelFilter?.addEventListener("change", (event) => setLevel(event.target.value, false));

  }

  function initDecryptedText() {
    const targets = document.querySelectorAll("[data-decrypt-text]");
    if (!targets.length) return;

    const scrambleChars = "四弦和弦扫弦节拍练习课堂更新0123456789";
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    const decrypt = (element) => {
      const text = element.dataset.decryptText || element.textContent || "";
      if (!text) return;

      window.clearInterval(element._decryptTimer);

      if (reduceMotion) {
        element.textContent = text;
        element.classList.remove("is-encrypted");
        return;
      }

      const order = [];
      const middle = Math.floor(text.length / 2);
      for (let offset = 0; order.length < text.length; offset += 1) {
        const right = middle + offset;
        const left = middle - offset - 1;
        if (right < text.length) order.push(right);
        if (left >= 0) order.push(left);
      }

      let revealed = new Set();
      let tick = 0;
      element.classList.add("is-encrypted");

      const renderScramble = () => {
        element.textContent = Array.from(text)
          .map((char, index) => {
            if (char.trim() === "" || /[，。,.]/.test(char) || revealed.has(index)) return char;
            return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
          })
          .join("");
      };

      renderScramble();
      element._decryptTimer = window.setInterval(() => {
        const nextItems = order.slice(tick, tick + 2);
        if (nextItems.length) {
          revealed = new Set(revealed);
          nextItems.forEach((next) => revealed.add(next));
          renderScramble();
          tick += 2;
          return;
        }

        window.clearInterval(element._decryptTimer);
        element.textContent = text;
        element.classList.remove("is-encrypted");
      }, 36);
    };

    const reveal = (element) => {
      if (element.dataset.decryptedOnce === "true") return;
      element.dataset.decryptedOnce = "true";
      decrypt(element);
    };

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            reveal(entry.target);
            observer.unobserve(entry.target);
          });
        },
        { threshold: 0.45 }
      );
      targets.forEach((element) => observer.observe(element));
    } else {
      targets.forEach(reveal);
    }

    targets.forEach((element) => {
      element.addEventListener("mouseenter", () => decrypt(element));
    });
  }

  function initSupportFolder() {
    const toggle = document.querySelector(".support-toggle");
    const popover = document.getElementById("supportFolder");
    const folder = popover?.querySelector(".support-folder");
    if (!toggle || !popover || !folder) return;

    const setOpen = (open) => {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      popover.setAttribute("aria-hidden", open ? "false" : "true");
      popover.classList.toggle("is-open", open);
      folder.classList.toggle("open", open);
      if (open) {
        window.setTimeout(() => {
          (popover.querySelector(".support-qr-grid") || popover).scrollIntoView({ behavior: "smooth", block: "start" });
        }, 420);
      }
    };

    const toggleOpen = () => {
      setOpen(!popover.classList.contains("is-open"));
    };

    toggle.addEventListener("click", toggleOpen);
    folder.addEventListener("click", (event) => {
      if (event.target.closest(".paper")) return;
      toggleOpen();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setOpen(false);
    });
  }

  initFilters();
  mountHeroSongSearch({ els, visibleSongs, levelById, selectSong, setQuery, documentRef: document });
  bindEvents();
  render();
  initDecryptedText();
  initSupportFolder();
})();
