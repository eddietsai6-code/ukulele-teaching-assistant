import { getPublicDomRoots } from "./app/core/dom-roots.js";
import { renderHeroNotebookView } from "./app/home/hero-notebook.js";
import { mountHeroLanyard } from "./app/home/lanyard.js";
import { mountHeroSongSearch } from "./app/home/hero-song-search.js";
import { initTailarkLogin } from "./app/home/login.js";
import { initPracticeToolsCarousel } from "./app/home/practice-tools.js?v=20260809-practice-tools-carousel";
import { initScrollGallery } from "./app/home/scroll-gallery.js?v=20260809-celebrity-zone-exact";
import { mountTailarkHeroScale } from "./app/home/tailark-hero-scale.js";
import { mountTextPressure } from "./app/home/text-pressure.js";
import { mountTrueFocus } from "./app/home/true-focus.js";
import { createLevelController } from "./app/levels/level-controller.js";
import { renderAudioPane } from "./app/detail/audio-pane.js";
import { renderDetailShell } from "./app/detail/detail-shell.js";
import { applyDetailTab } from "./app/detail/detail-tabs.js";
import { renderLessonPane } from "./app/detail/lesson-pane.js";
import { renderMetronomePane } from "./app/detail/metronome-pane.js";
import { renderScorePane } from "./app/detail/score-pane.js";
import { tagMarkup } from "./app/shared/tags.js";

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
    level: "all",
    selectedSongId: visibleSongs()[0] ? visibleSongs()[0].id : "",
    detailTab: "lesson",
    activeLevelPicker: "",
    levelPickerOpen: false,
    audioVersionBySong: {}
  };

  const els = getPublicDomRoots(document);

  const levelById = Object.fromEntries(data.levels.map((level) => [level.id, level]));
  function getSelectedSong() {
    return visibleSongs().find((song) => song.id === state.selectedSongId) || visibleSongs()[0] || null;
  }

  function preferredDetailTabForSong(songId) {
    const song = visibleSongs().find((item) => item.id === songId);
    return song && Array.isArray(song.audio) && song.audio.length ? "audio" : "lesson";
  }

  function selectSong(songId, shouldScroll) {
    state.selectedSongId = songId;
    state.detailTab = preferredDetailTabForSong(songId);
    state.levelPickerOpen = false;
    render();
    if (shouldScroll) document.getElementById("lesson").scrollIntoView({ behavior: "smooth" });
  }

  function renderHeroNotebook() {
    if (els.heroNotebook?.querySelector("#ukuleleTuner")) return;

    const song = getSelectedSong();
    if (!song) return;
    const level = levelById[song.level];
    els.heroNotebook.innerHTML = renderHeroNotebookView({ song, level });
  }

  const levelController = createLevelController({
    els,
    data,
    state,
    levelById,
    visibleSongs,
    selectSong,
    renderApp: render,
    documentRef: document,
    windowRef: window
  });

  mountTailarkHeroScale(document, window);
  mountTextPressure(els.heroPressure);
  mountTrueFocus(els.heroPrincipleFocus);
  initTailarkLogin(document, window);
  initPracticeToolsCarousel(document);
  initScrollGallery(document);



  mountHeroLanyard(els.heroLanyard);



  function mountLessonMetronome(root = els.songDetail) {
    const host = root?.querySelector("[data-metronome-host]");
    if (!host) return;
    window.UkeBookMetronome?.mount(host);
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
        <div class="song-tags">${tagMarkup(song.techniques)}</div>
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
    mountLessonMetronome(els.songDetail);
  }

  function render() {
    const songs = visibleSongs();
    if (!songs.some((song) => song.id === state.selectedSongId)) {
      state.selectedSongId = songs[0] ? songs[0].id : "";
      state.detailTab = preferredDetailTabForSong(state.selectedSongId);
    }
    renderHeroNotebook();
    levelController.render();
    renderSongDetail();
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

  mountHeroSongSearch({ els, visibleSongs, levelById, selectSong, setQuery: () => {}, documentRef: document });
  render();
  initDecryptedText();
  initSupportFolder();
})();
