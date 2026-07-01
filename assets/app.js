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

  const state = {
    query: "",
    level: "all",
    source: "all",
    category: "all",
    selectedSongId: data.songs[0] ? data.songs[0].id : "",
    detailTab: "lesson",
    activeLevelPicker: "",
    levelPickerOpen: false,
    audioVersionBySong: {}
  };

  const els = {
    heroNotebook: document.getElementById("heroNotebook"),
    infiniteMenu: document.getElementById("infiniteMenu"),
    orbitCanvas: document.getElementById("orbitCanvas"),
    orbitTitle: document.getElementById("orbitTitle"),
    orbitDescription: document.getElementById("orbitDescription"),
    orbitAction: document.getElementById("orbitAction"),
    heroPressure: document.getElementById("heroPressure"),
    heroLanyard: document.getElementById("heroLanyard"),
    levelBoard: document.getElementById("levelBoard"),
    levelSongPicker: document.getElementById("levelSongPicker"),
    queryInput: document.getElementById("queryInput"),
    sourceFilter: document.getElementById("sourceFilter"),
    categoryFilter: document.getElementById("categoryFilter"),
    levelFilter: document.getElementById("levelFilter"),
    techCloud: document.getElementById("techCloud"),
    songDetail: document.getElementById("songDetail")
  };

  const levelById = Object.fromEntries(data.levels.map((level) => [level.id, level]));
  const orbit = {
    initialized: false,
    discs: [],
    activeIndex: 0,
    rotationX: -0.18,
    rotationY: 0.28,
    velocityX: 0,
    velocityY: 0.003,
    pointerDown: false,
    lastX: 0,
    lastY: 0,
    moved: false,
    frame: 0
  };
  const pressure = {
    initialized: false,
    container: null,
    chars: [],
    hasPointer: false,
    resizeTimer: 0,
    pointer: { x: 0, y: 0 },
    smooth: { x: 0, y: 0 },
    frame: 0
  };
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
  const levelSongSplash = {
    canvas: null,
    ctx: null,
    frame: 0,
    particles: [],
    dpr: 1,
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)")
  };
  const lanyard = {
    initialized: false,
    canvas: null,
    ctx: null,
    dpr: 1,
    width: 0,
    height: 0,
    frame: 0,
    lastTime: 0,
    dragging: false,
    hover: false,
    pointerId: null,
    pointer: { x: 0, y: 0, previousX: 0, previousY: 0 },
    points: [],
    constraints: [],
    card: { width: 138, height: 188, angle: 0, skew: 0 }
  };
  const chromaPalette = [
    { border: "#7CF6A3", gradient: "linear-gradient(145deg, #7CF6A3, #153047)" },
    { border: "#FFD166", gradient: "linear-gradient(210deg, #FFD166, #153047)" },
    { border: "#FF8FAB", gradient: "linear-gradient(165deg, #FF8FAB, #153047)" },
    { border: "#5CC8FF", gradient: "linear-gradient(195deg, #5CC8FF, #153047)" },
    { border: "#B8F35A", gradient: "linear-gradient(225deg, #B8F35A, #153047)" },
    { border: "#31D6FF", gradient: "linear-gradient(135deg, #31D6FF, #153047)" },
    { border: "#FF7A59", gradient: "linear-gradient(155deg, #FF7A59, #153047)" },
    { border: "#FF66CF", gradient: "linear-gradient(215deg, #FF66CF, #153047)" },
    { border: "#2DD4BF", gradient: "linear-gradient(180deg, #2DD4BF, #153047)" }
  ];

  function normalize(value) {
    return String(value || "").toLowerCase().trim();
  }

  function escapeAttribute(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function uniqueValues(key) {
    return [...new Set(data.songs.map((song) => song[key]).filter(Boolean))].sort();
  }

  function getSelectedSong() {
    return data.songs.find((song) => song.id === state.selectedSongId) || data.songs[0] || null;
  }

  function levelCount(levelId) {
    return data.songs.filter((song) => song.level === levelId).length;
  }

  function songsForLevel(levelId) {
    return data.songs
      .filter((song) => song.level === levelId)
      .sort((a, b) => a.title.localeCompare(b.title, "zh-CN"));
  }

  function levelShort(level) {
    return level.order === 0 ? "Debut" : `G${level.order}`;
  }

  function renderLevelMedia(level) {
    const shortName = levelShort(level);
    const songCount = levelCount(level.id);
    if (level.coverImage) {
      return `
        <div class="circular-media has-cover">
          <img
            class="circular-cover-image"
            src="${level.coverImage}"
            alt=""
            loading="eager"
            decoding="async"
          />
          <div class="circular-cover-meta" aria-hidden="true">
            <strong>${songCount}</strong>
            <em>songs</em>
          </div>
        </div>
      `;
    }

    return `
      <div class="circular-media">
        <span>${shortName}</span>
        <strong>${songCount}</strong>
        <em>songs</em>
      </div>
    `;
  }

  function chromaStyle(level) {
    const item = chromaPalette[level.order % chromaPalette.length];
    return `--card-border:${item.border}; --card-gradient:${item.gradient};`;
  }

  function resetLevelSongSplash() {
    if (levelSongSplash.frame) {
      cancelAnimationFrame(levelSongSplash.frame);
    }
    levelSongSplash.canvas = null;
    levelSongSplash.ctx = null;
    levelSongSplash.frame = 0;
    levelSongSplash.particles = [];
  }

  function syncLevelSongSplashSize() {
    const { canvas, ctx } = levelSongSplash;
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.round(rect.width * dpr));
    const height = Math.max(1, Math.round(rect.height * dpr));

    if (canvas.width !== width || canvas.height !== height || levelSongSplash.dpr !== dpr) {
      canvas.width = width;
      canvas.height = height;
      levelSongSplash.dpr = dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  }

  function animateLevelSongSplash() {
    const { canvas, ctx } = levelSongSplash;
    if (!canvas || !ctx) return;
    syncLevelSongSplashSize();
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    ctx.globalCompositeOperation = "screen";

    levelSongSplash.particles = levelSongSplash.particles.filter((particle) => {
      particle.life -= 0.018;
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vx *= 0.985;
      particle.vy *= 0.985;
      particle.radius += particle.grow;
      if (particle.life <= 0) return false;

      const alpha = Math.max(0, particle.life);
      const gradient = ctx.createRadialGradient(
        particle.x,
        particle.y,
        0,
        particle.x,
        particle.y,
        particle.radius
      );
      gradient.addColorStop(0, `rgba(${particle.color}, ${0.34 * alpha})`);
      gradient.addColorStop(0.38, `rgba(${particle.color}, ${0.18 * alpha})`);
      gradient.addColorStop(0.72, `rgba(${particle.color}, ${0.07 * alpha})`);
      gradient.addColorStop(1, `rgba(${particle.color}, 0)`);
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fill();
      return true;
    });

    ctx.globalCompositeOperation = "source-over";
    if (levelSongSplash.particles.length) {
      levelSongSplash.frame = requestAnimationFrame(animateLevelSongSplash);
    } else {
      levelSongSplash.frame = 0;
    }
  }

  function paintLevelSongSplash(event, strength = 1) {
    if (levelSongSplash.reducedMotion.matches || !levelSongSplash.canvas) return;
    const rect = levelSongSplash.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;

    const colors = [
      "255, 111, 30",
      "255, 206, 84",
      "30, 210, 255",
      "64, 156, 255",
      "39, 214, 156",
      "244, 114, 182",
      "168, 85, 247"
    ];
    const count = event.pointerType === "touch" ? 8 : 5;
    for (let index = 0; index < count; index += 1) {
      const angle = Math.random() * Math.PI * 2;
      const speed = (0.55 + Math.random() * 1.4) * strength;
      levelSongSplash.particles.push({
        x: x + (Math.random() - 0.5) * 12,
        y: y + (Math.random() - 0.5) * 12,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 16 + Math.random() * 24,
        grow: 0.62 + Math.random() * 1,
        life: 0.82 + Math.random() * 0.32,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
    if (!levelSongSplash.frame) {
      levelSongSplash.frame = requestAnimationFrame(animateLevelSongSplash);
    }
  }

  function initLevelSongSplash(grid) {
    resetLevelSongSplash();
    if (!grid || levelSongSplash.reducedMotion.matches) return;
    const canvas = els.levelSongPicker?.querySelector(".level-song-splash");
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    levelSongSplash.canvas = canvas;
    levelSongSplash.ctx = ctx;
    syncLevelSongSplashSize();
  }

  function matchesQuery(song) {
    const query = normalize(state.query);
    if (!query) return true;
    const level = levelById[song.level];
    const haystack = [
      song.title,
      song.artist,
      song.style,
      song.source,
      song.category,
      level.label,
      song.teaching.goal,
      song.teaching.focus,
      ...(song.teaching.practiceOrder || []),
      ...(song.teaching.commonIssues || []),
      song.teaching.passStandard,
      ...song.techniques
    ]
      .map(normalize)
      .join(" ");
    return haystack.includes(query);
  }

  function getFilteredSongs() {
    return data.songs
      .filter((song) => state.level === "all" || song.level === state.level)
      .filter((song) => state.source === "all" || song.source === state.source)
      .filter((song) => state.category === "all" || song.category === state.category)
      .filter(matchesQuery)
      .sort((a, b) => {
        const levelDiff = levelById[a.level].order - levelById[b.level].order;
        if (levelDiff !== 0) return levelDiff;
        return a.title.localeCompare(b.title, "zh-CN");
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
    state.detailTab = "lesson";
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

  function tagMarkup(tags, limit) {
    return tags
      .slice(0, limit)
      .map((tag) => `<span class="tag-chip">${tag}</span>`)
      .join("");
  }

  function techButtonMarkup(tags) {
    return tags.map((tag) => `<button type="button" class="tag-chip" data-tech="${tag}">${tag}</button>`).join("");
  }

  function renderHeroNotebook() {
    if (els.heroNotebook?.querySelector("#ukuleleTuner")) return;

    const song = getSelectedSong();
    if (!song) return;
    const level = levelById[song.level];
    els.heroNotebook.innerHTML = `
      <div class="notebook-cover">
        <div class="cover-pattern"></div>
        <div class="name-sticker">
          <span>Song</span>
          <strong>${song.title}</strong>
          <div class="sticker-grid">
            <p><span>Level</span><b>${levelShort(level)}</b></p>
            <p><span>Path</span><b>${song.source.includes("Pack") ? "uke" : "song"}</b></p>
          </div>
        </div>
        <p class="cover-note">${song.artist || "Template Original"} · ${song.style}</p>
      </div>
    `;
  }

  function initTextPressure() {
    if (!els.heroPressure || pressure.initialized) return;
    const text = els.heroPressure.dataset.text || "UkuleleBook";
    pressure.container = els.heroPressure.closest(".text-pressure-stage") || els.heroPressure;
    els.heroPressure.innerHTML = text
      .split("")
      .map((char) => `<span data-char="${char}">${char}</span>`)
      .join("");
    pressure.chars = [...els.heroPressure.querySelectorAll("span")];

    const setSize = () => {
      const rect = pressure.container.getBoundingClientRect();
      const fontSize = Math.max(rect.width / (pressure.chars.length / 2), 24);
      els.heroPressure.style.fontSize = `${fontSize}px`;
      els.heroPressure.style.lineHeight = "1";
      els.heroPressure.style.transform = "scale(1, 1)";
    };
    const centerPointer = () => {
      if (pressure.hasPointer) return;
      const rect = pressure.container.getBoundingClientRect();
      pressure.pointer.x = rect.left + rect.width / 2;
      pressure.pointer.y = rect.top + rect.height / 2;
      pressure.smooth.x = pressure.pointer.x;
      pressure.smooth.y = pressure.pointer.y;
    };
    const setPointer = (x, y) => {
      if (!pressure.hasPointer) {
        pressure.smooth.x = x;
        pressure.smooth.y = y;
        pressure.hasPointer = true;
      }
      pressure.pointer.x = x;
      pressure.pointer.y = y;
    };
    const debouncedSetSize = () => {
      window.clearTimeout(pressure.resizeTimer);
      pressure.resizeTimer = window.setTimeout(() => {
        setSize();
        centerPointer();
      }, 100);
    };

    setSize();
    centerPointer();
    window.addEventListener("resize", debouncedSetSize);
    window.addEventListener("scroll", centerPointer, { passive: true });
    window.addEventListener("mousemove", (event) => {
      setPointer(event.clientX, event.clientY);
    });
    window.addEventListener(
      "touchmove",
      (event) => {
        const touch = event.touches[0];
        if (!touch) return;
        setPointer(touch.clientX, touch.clientY);
      },
      { passive: true }
    );

    pressure.initialized = true;
    pressure.frame = requestAnimationFrame(updateTextPressure);
  }

  function pressureValue(distance, maxDistance, minValue, maxValue) {
    const value = maxValue - Math.abs((maxValue * distance) / maxDistance);
    return Math.max(minValue, value + minValue);
  }

  function updateTextPressure() {
    if (!pressure.initialized || !els.heroPressure) return;
    pressure.smooth.x += (pressure.pointer.x - pressure.smooth.x) / 15;
    pressure.smooth.y += (pressure.pointer.y - pressure.smooth.y) / 15;
    const titleRect = els.heroPressure.getBoundingClientRect();
    const maxDistance = Math.max(180, titleRect.width / 2);

    pressure.chars.forEach((span) => {
      const rect = span.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distance = Math.hypot(pressure.smooth.x - centerX, pressure.smooth.y - centerY);
      const width = Math.floor(pressureValue(distance, maxDistance, 5, 200));
      const weight = Math.floor(pressureValue(distance, maxDistance, 100, 900));
      const italic = pressureValue(distance, maxDistance, 0, 1).toFixed(2);
      const settings = `'wght' ${weight}, 'wdth' ${width}, 'ital' ${italic}`;
      if (span.style.fontVariationSettings !== settings) {
        span.style.fontVariationSettings = settings;
      }
    });

    pressure.frame = requestAnimationFrame(updateTextPressure);
  }

  initTextPressure();

  function bindLanyard() {
    if (!els.heroLanyard || lanyard.initialized) return;
    const canvas = els.heroLanyard.querySelector(".lanyard-canvas");
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    lanyard.initialized = true;
    lanyard.canvas = canvas;
    lanyard.ctx = ctx;

    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
    const point = (x, y, fixed) => ({ x, y, previousX: x, previousY: y, fixed: Boolean(fixed) });

    const connect = (a, b, length, stiffness) => {
      lanyard.constraints.push({ a, b, length, stiffness });
    };
    const distanceBetween = (a, b) => Math.hypot(b.x - a.x, b.y - a.y);

    const resetScene = () => {
      const rect = els.heroLanyard.getBoundingClientRect();
      lanyard.dpr = Math.min(window.devicePixelRatio || 1, 2);
      lanyard.width = Math.max(1, els.heroLanyard.clientWidth || rect.width);
      lanyard.height = Math.max(1, els.heroLanyard.clientHeight || rect.height);
      canvas.width = Math.round(lanyard.width * lanyard.dpr);
      canvas.height = Math.round(lanyard.height * lanyard.dpr);
      ctx.setTransform(lanyard.dpr, 0, 0, lanyard.dpr, 0, 0);

      const isNarrow = lanyard.width < 680;
      const cardWidth = isNarrow
        ? clamp(lanyard.width * 0.36, 156, 214)
        : clamp(lanyard.width * 0.24, 190, 260);
      const cardHeight = cardWidth * 1.18;
      lanyard.card.width = cardWidth;
      lanyard.card.height = cardHeight;
      lanyard.card.angle = -0.08;
      lanyard.card.skew = 0;

      const anchorX = clamp(
        lanyard.width * (isNarrow ? 0.82 : 0.88),
        cardWidth * 0.78,
        lanyard.width - cardWidth * 0.62 - 10
      );
      const anchorY = -22;
      const topY = Math.min(lanyard.height * (isNarrow ? 0.34 : 0.32), 280);
      const drop = topY - anchorY;
      lanyard.points = [
        point(anchorX, anchorY, true),
        point(anchorX - Math.min(26, lanyard.width * 0.035), anchorY + drop * 0.28),
        point(anchorX - Math.min(12, lanyard.width * 0.018), anchorY + drop * 0.62),
        point(anchorX, topY),
        point(anchorX + Math.min(18, lanyard.width * 0.024), topY + cardHeight * 0.54)
      ];
      lanyard.constraints = [];
      connect(0, 1, distanceBetween(lanyard.points[0], lanyard.points[1]), 1);
      connect(1, 2, distanceBetween(lanyard.points[1], lanyard.points[2]), 0.95);
      connect(2, 3, distanceBetween(lanyard.points[2], lanyard.points[3]), 0.95);
      connect(3, 4, cardHeight * 0.53, 1);
    };

    const localPointer = (event) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: ((event.clientX - rect.left) / rect.width) * lanyard.width,
        y: ((event.clientY - rect.top) / rect.height) * lanyard.height
      };
    };

    const cardContains = (x, y) => {
      const center = lanyard.points[4];
      if (!center) return false;
      const dx = x - center.x;
      const dy = y - center.y;
      const cos = Math.cos(-lanyard.card.angle);
      const sin = Math.sin(-lanyard.card.angle);
      const rx = dx * cos - dy * sin;
      const ry = dx * sin + dy * cos;
      return Math.abs(rx) <= lanyard.card.width * 0.62 && Math.abs(ry) <= lanyard.card.height * 0.58;
    };

    const roundedRect = (x, y, width, height, radius) => {
      const r = Math.min(radius, width / 2, height / 2);
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + width, y, x + width, y + height, r);
      ctx.arcTo(x + width, y + height, x, y + height, r);
      ctx.arcTo(x, y + height, x, y, r);
      ctx.arcTo(x, y, x + width, y, r);
      ctx.closePath();
    };

    const smoothPath = (points) => {
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let index = 1; index < points.length - 1; index += 1) {
        const current = points[index];
        const next = points[index + 1];
        ctx.quadraticCurveTo(current.x, current.y, (current.x + next.x) / 2, (current.y + next.y) / 2);
      }
      const last = points[points.length - 1];
      ctx.lineTo(last.x, last.y);
    };

    const drawAnchor = () => {
      const anchor = lanyard.points[0];
      ctx.save();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = "#171717";
      ctx.fillStyle = "#fdfbf9";
      roundedRect(anchor.x - 30, anchor.y - 9, 60, 20, 10);
      ctx.shadowColor = "rgba(0, 0, 0, 0.18)";
      ctx.shadowBlur = 10;
      ctx.shadowOffsetY = 4;
      ctx.fill();
      ctx.shadowColor = "transparent";
      ctx.stroke();
      ctx.strokeStyle = "#ff6f1e";
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(anchor.x - 13, anchor.y + 1);
      ctx.lineTo(anchor.x + 13, anchor.y - 2);
      ctx.stroke();
      ctx.restore();
    };

    const drawBand = () => {
      const bandPoints = lanyard.points.slice(0, 4);
      ctx.save();
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      smoothPath(bandPoints);
      ctx.lineWidth = 18;
      ctx.strokeStyle = "rgba(0, 0, 0, 0.88)";
      ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
      ctx.shadowBlur = 14;
      ctx.shadowOffsetY = 8;
      ctx.stroke();

      smoothPath(bandPoints);
      ctx.lineWidth = 12;
      ctx.strokeStyle = "#f6f1ea";
      ctx.shadowColor = "transparent";
      ctx.stroke();

      smoothPath(bandPoints);
      ctx.lineWidth = 2;
      ctx.setLineDash([9, 13]);
      ctx.strokeStyle = "#ff6f1e";
      ctx.stroke();
      ctx.restore();
    };

    const badgePath = (width, height, inset = 0) => {
      const left = -width / 2 + inset;
      const right = width / 2 - inset;
      const top = -height / 2 + inset;
      const bottom = height / 2 - inset;
      const shoulder = Math.min(width * 0.22, 56);
      const radius = Math.min(width * 0.16, 34);

      ctx.beginPath();
      ctx.moveTo(left + shoulder, top);
      ctx.quadraticCurveTo(0, top - radius * 0.42, right - shoulder, top);
      ctx.quadraticCurveTo(right, top + 3, right, top + shoulder);
      ctx.lineTo(right, bottom - shoulder * 0.66);
      ctx.quadraticCurveTo(right, bottom, right - shoulder * 0.82, bottom);
      ctx.lineTo(left + shoulder * 0.82, bottom);
      ctx.quadraticCurveTo(left, bottom, left, bottom - shoulder * 0.66);
      ctx.lineTo(left, top + shoulder);
      ctx.quadraticCurveTo(left, top + 3, left + shoulder, top);
      ctx.closePath();
    };

    const drawPalmTree = (x, y, scale = 1, flip = 1) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(flip * scale, scale);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.strokeStyle = "#5a3516";
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(0, 48);
      ctx.quadraticCurveTo(8, 17, -2, -18);
      ctx.stroke();

      ctx.strokeStyle = "rgba(255, 209, 102, 0.44)";
      ctx.lineWidth = 2;
      [-6, 2, 10, 18, 27].forEach((mark) => {
        ctx.beginPath();
        ctx.moveTo(-5, mark);
        ctx.lineTo(6, mark - 4);
        ctx.stroke();
      });

      const leaf = (angle, length, width) => {
        ctx.save();
        ctx.rotate(angle);
        const grad = ctx.createLinearGradient(0, 0, length, 0);
        grad.addColorStop(0, "#0b5f38");
        grad.addColorStop(0.55, "#4fbf62");
        grad.addColorStop(1, "#b8f35a");
        ctx.fillStyle = grad;
        ctx.strokeStyle = "#073323";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(length * 0.46, -width, length, -2);
        ctx.quadraticCurveTo(length * 0.42, width * 0.64, 0, 0);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      };

      ctx.translate(-2, -20);
      [-2.55, -2.05, -1.55, -1.05, -0.55, 0.12].forEach((angle, index) => {
        leaf(angle, 45 - index * 2, 14);
      });
      ctx.restore();
    };

    const drawHibiscus = (x, y, scale = 1) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(scale, scale);
      ctx.strokeStyle = "#0b3a2d";
      ctx.lineWidth = 2;
      for (let index = 0; index < 5; index += 1) {
        ctx.save();
        ctx.rotate((Math.PI * 2 * index) / 5);
        const petal = ctx.createRadialGradient(0, -12, 2, 0, -12, 22);
        petal.addColorStop(0, "#fff8b5");
        petal.addColorStop(0.65, "#FFD166");
        petal.addColorStop(1, "#f7a33b");
        ctx.fillStyle = petal;
        ctx.beginPath();
        ctx.ellipse(0, -15, 10, 20, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }
      ctx.fillStyle = "#7b4b13";
      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#7b4b13";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(9, 8, 14, 22);
      ctx.stroke();
      ctx.fillStyle = "#fff8b5";
      ctx.beginPath();
      ctx.arc(15, 23, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const drawBadgeUkulele = (width, height) => {
      ctx.save();
      ctx.translate(width * 0.12, height * -0.01);
      ctx.rotate(0.26);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.strokeStyle = "#062d27";
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.moveTo(18, -20);
      ctx.lineTo(44, -106);
      ctx.stroke();

      ctx.strokeStyle = "#f6f1da";
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(18, -20);
      ctx.lineTo(44, -106);
      ctx.stroke();

      const neck = ctx.createLinearGradient(20, -28, 46, -104);
      neck.addColorStop(0, "#8c5620");
      neck.addColorStop(0.5, "#5b3517");
      neck.addColorStop(1, "#2b1b10");
      ctx.strokeStyle = neck;
      ctx.lineWidth = 20;
      ctx.beginPath();
      ctx.moveTo(18, -20);
      ctx.lineTo(44, -106);
      ctx.stroke();

      ctx.strokeStyle = "#f6f1da";
      ctx.lineWidth = 1.3;
      [-11, -4, 3, 10].forEach((offset) => {
        ctx.beginPath();
        ctx.moveTo(11 + offset * 0.16, 44);
        ctx.lineTo(41 + offset * 0.1, -104);
        ctx.stroke();
      });

      ctx.strokeStyle = "rgba(255,255,255,0.58)";
      ctx.lineWidth = 1;
      [-86, -72, -58, -44, -30].forEach((fret) => {
        ctx.beginPath();
        ctx.moveTo(28, fret);
        ctx.lineTo(54, fret - 5);
        ctx.stroke();
      });

      ctx.save();
      ctx.translate(48, -119);
      ctx.rotate(0.12);
      ctx.fillStyle = "#6edb87";
      ctx.strokeStyle = "#062d27";
      ctx.lineWidth = 6;
      roundedRect(-16, -31, 38, 58, 12);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#f6f1da";
      ctx.font = "900 25px Georgia, serif";
      ctx.fillText("E", 3, -2);
      ctx.fillStyle = "#f6f1da";
      [-12, 20].forEach((x) => {
        [-16, 9].forEach((y) => {
          ctx.beginPath();
          ctx.arc(x, y, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        });
      });
      ctx.restore();

      const body = ctx.createRadialGradient(-10, 18, 10, -3, 27, 82);
      body.addColorStop(0, "#fff2a8");
      body.addColorStop(0.35, "#FFD166");
      body.addColorStop(1, "#d98725");
      ctx.strokeStyle = "#062d27";
      ctx.lineWidth = 8;
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.ellipse(-22, 15, 34, 42, -0.12, 0, Math.PI * 2);
      ctx.ellipse(14, 21, 42, 56, 0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.strokeStyle = "#f6f1da";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.ellipse(-22, 15, 27, 34, -0.12, 0, Math.PI * 2);
      ctx.ellipse(14, 21, 34, 48, 0.15, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = "#052923";
      ctx.beginPath();
      ctx.arc(-1, 20, 15, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#573411";
      ctx.strokeStyle = "#062d27";
      ctx.lineWidth = 3;
      roundedRect(-24, 62, 54, 10, 4);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    };

    const drawTropicalBadgeScene = (width, height) => {
      ctx.save();
      badgePath(width, height, 11);
      ctx.clip();

      const sky = ctx.createLinearGradient(0, -height / 2, 0, height / 2);
      sky.addColorStop(0, "#0b665f");
      sky.addColorStop(0.28, "#48b69d");
      sky.addColorStop(0.52, "#c8f5cf");
      sky.addColorStop(1, "#0c4b45");
      ctx.fillStyle = sky;
      ctx.fillRect(-width / 2, -height / 2, width, height);

      const sunY = -height * 0.06;
      ctx.fillStyle = "#FFD166";
      ctx.beginPath();
      ctx.arc(0, sunY, width * 0.18, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "rgba(255, 239, 156, 0.72)";
      ctx.lineWidth = 3;
      for (let index = 0; index < 9; index += 1) {
        const angle = -Math.PI * 0.85 + index * (Math.PI * 0.21);
        ctx.beginPath();
        ctx.moveTo(Math.cos(angle) * width * 0.16, sunY + Math.sin(angle) * width * 0.16);
        ctx.lineTo(Math.cos(angle) * width * 0.34, sunY + Math.sin(angle) * width * 0.34);
        ctx.stroke();
      }

      ctx.fillStyle = "rgba(255, 248, 218, 0.9)";
      [-width * 0.3, width * 0.3].forEach((cloudX) => {
        ctx.beginPath();
        ctx.arc(cloudX - 12, sunY + 8, 14, 0, Math.PI * 2);
        ctx.arc(cloudX + 4, sunY + 1, 18, 0, Math.PI * 2);
        ctx.arc(cloudX + 25, sunY + 9, 12, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.fillStyle = "rgba(255, 255, 255, 0.74)";
      ctx.strokeStyle = "#eaf8d5";
      ctx.lineWidth = 2;
      [-38, 0, 42].forEach((x, index) => {
        ctx.beginPath();
        ctx.moveTo(x, sunY + 12 + index * 2);
        ctx.quadraticCurveTo(x + 7, sunY + 5, x + 14, sunY + 12 + index * 2);
        ctx.quadraticCurveTo(x + 20, sunY + 5, x + 27, sunY + 12 + index * 2);
        ctx.stroke();
      });

      for (let row = 0; row < 4; row += 1) {
        const y = height * (0.12 + row * 0.07);
        ctx.strokeStyle = row % 2 ? "#8debc7" : "#2d9e91";
        ctx.lineWidth = row % 2 ? 4 : 6;
        ctx.beginPath();
        ctx.moveTo(-width / 2, y);
        for (let x = -width / 2; x <= width / 2 + 20; x += 28) {
          ctx.quadraticCurveTo(x + 14, y - 10, x + 28, y);
        }
        ctx.stroke();
      }

      drawPalmTree(-width * 0.35, height * 0.19, width / 250, 1);
      drawPalmTree(width * 0.36, height * 0.18, width / 250, -1);
      drawHibiscus(-width * 0.32, height * 0.33, width / 265);
      drawHibiscus(width * 0.34, height * 0.34, width / 280);

      ctx.restore();
    };

    const drawClip = () => {
      const top = lanyard.points[3];
      ctx.save();
      ctx.translate(top.x, top.y);
      ctx.rotate(lanyard.card.angle);
      ctx.lineWidth = 1.4;
      ctx.strokeStyle = "rgba(23, 23, 23, 0.78)";
      const clipWidth = Math.min(lanyard.card.width * 0.44, 108);
      const metal = ctx.createLinearGradient(-clipWidth / 2, -38, clipWidth / 2, 10);
      metal.addColorStop(0, "#f6f1ea");
      metal.addColorStop(0.5, "#fffdf2");
      metal.addColorStop(1, "#c8c2b6");
      ctx.fillStyle = metal;
      roundedRect(-clipWidth / 2, -44, clipWidth, 46, 16);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#0b5b52";
      ctx.textAlign = "center";
      ctx.font = "900 34px Aptos, Segoe UI, sans-serif";
      ctx.fillText("E", 0, -13);
      ctx.fillStyle = "#ff8a2a";
      roundedRect(10, -23, 17, 5, 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(0, 10, 12, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    };

    const drawCard = () => {
      const top = lanyard.points[3];
      const center = lanyard.points[4];
      const angle = Math.atan2(center.y - top.y, center.x - top.x) - Math.PI / 2;
      const sway = clamp((center.x - lanyard.points[0].x) / lanyard.width, -0.45, 0.45);
      const speedSkew = clamp((center.x - center.previousX) * 0.012, -0.08, 0.08);
      lanyard.card.angle += (angle - lanyard.card.angle) * 0.22;
      lanyard.card.skew += (sway * 0.18 + speedSkew - lanyard.card.skew) * 0.18;

      const { width, height, skew } = lanyard.card;
      ctx.save();
      ctx.translate(center.x, center.y);
      ctx.rotate(lanyard.card.angle);
      ctx.transform(1, 0, skew, 1, 0, 0);

      ctx.save();
      ctx.translate(0, 12);
      ctx.shadowColor = "rgba(0, 0, 0, 0.36)";
      ctx.shadowBlur = 28;
      ctx.shadowOffsetY = 18;
      badgePath(width, height, 0);
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.fill();
      ctx.restore();

      badgePath(width, height, 0);
      ctx.fillStyle = "#083d37";
      ctx.fill();
      ctx.lineWidth = 8;
      ctx.strokeStyle = "#f6f1da";
      ctx.stroke();
      ctx.lineWidth = 4;
      ctx.strokeStyle = "#062923";
      ctx.stroke();

      drawTropicalBadgeScene(width, height);

      badgePath(width - 26, height - 28, 0);
      ctx.lineWidth = 3;
      ctx.strokeStyle = "rgba(246, 241, 218, 0.62)";
      ctx.stroke();

      ctx.textAlign = "center";
      ctx.fillStyle = "#FFD166";
      ctx.font = `900 ${Math.round(width * 0.12)}px Aptos, Segoe UI, sans-serif`;
      ctx.fillText("EDDIE", -width * 0.1, -height * 0.34);

      drawBadgeUkulele(width, height);

      const band = ctx.createLinearGradient(0, height * 0.18, 0, height * 0.44);
      band.addColorStop(0, "rgba(2, 42, 35, 0.72)");
      band.addColorStop(1, "rgba(0, 25, 24, 0.96)");
      ctx.fillStyle = band;
      ctx.beginPath();
      ctx.moveTo(-width / 2 + 18, height * 0.22);
      ctx.quadraticCurveTo(0, height * 0.15, width / 2 - 18, height * 0.22);
      ctx.lineTo(width / 2 - 18, height / 2 - 22);
      ctx.quadraticCurveTo(0, height / 2 - 8, -width / 2 + 18, height / 2 - 22);
      ctx.closePath();
      ctx.fill();

      const fitCardText = (text, maxWidth, maxSize, minSize, weight, family) => {
        let size = maxSize;
        do {
          ctx.font = `${weight} ${size}px ${family}`;
          size -= 1;
        } while (ctx.measureText(text).width > maxWidth && size > minSize);
      };

      ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
      fitCardText("UkeBook", width - 22, width * 0.22, width * 0.14, "800", "Georgia, serif");
      ctx.fillText("UkeBook", 3, height * 0.33 + 5);
      ctx.fillStyle = "#fff6d9";
      fitCardText("UkeBook", width - 22, width * 0.22, width * 0.14, "800", "Georgia, serif");
      ctx.fillText("UkeBook", 0, height * 0.33);

      ctx.fillStyle = "rgba(184, 243, 90, 0.85)";
      ctx.font = `900 ${Math.round(width * 0.056)}px Aptos, Segoe UI, sans-serif`;
      ctx.fillText("LEVEL ATLAS", 0, height * 0.43);
      ctx.restore();
    };

    const solveConstraints = () => {
      for (let iteration = 0; iteration < 8; iteration += 1) {
        lanyard.constraints.forEach((constraint) => {
          const a = lanyard.points[constraint.a];
          const b = lanyard.points[constraint.b];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const distance = Math.hypot(dx, dy) || 1;
          const difference = ((distance - constraint.length) / distance) * constraint.stiffness;
          const offsetX = dx * difference;
          const offsetY = dy * difference;
          if (a.fixed) {
            b.x -= offsetX;
            b.y -= offsetY;
          } else if (b.fixed) {
            a.x += offsetX;
            a.y += offsetY;
          } else {
            a.x += offsetX * 0.5;
            a.y += offsetY * 0.5;
            b.x -= offsetX * 0.5;
            b.y -= offsetY * 0.5;
          }
        });
      }
    };

    const tick = (time) => {
      if (!lanyard.lastTime) lanyard.lastTime = time;
      const delta = clamp((time - lanyard.lastTime) / 16.67, 0.5, 2);
      lanyard.lastTime = time;

      const anchor = lanyard.points[0];
      if (anchor) {
        const isNarrow = lanyard.width < 680;
        anchor.x = clamp(
          lanyard.width * (isNarrow ? 0.82 : 0.88),
          lanyard.card.width * 0.78,
          lanyard.width - lanyard.card.width * 0.62 - 10
        );
        anchor.y = -22;
      }

      lanyard.points.forEach((item, index) => {
        if (item.fixed) return;
        const velocityX = (item.x - item.previousX) * 0.985;
        const velocityY = (item.y - item.previousY) * 0.985;
        item.previousX = item.x;
        item.previousY = item.y;
        item.x += velocityX;
        item.y += velocityY + (index === 4 ? 0.34 : 0.24) * delta * delta;
      });

      if (lanyard.dragging) {
        const card = lanyard.points[4];
        const dragVelocityX = lanyard.pointer.x - lanyard.pointer.previousX;
        const dragVelocityY = lanyard.pointer.y - lanyard.pointer.previousY;
        card.x = lanyard.pointer.x;
        card.y = lanyard.pointer.y;
        card.previousX = card.x - dragVelocityX * 0.85;
        card.previousY = card.y - dragVelocityY * 0.85;
      }

      solveConstraints();

      lanyard.points.forEach((item) => {
        if (item.fixed) return;
        const isCard = item === lanyard.points[4];
        const safeX = isCard ? lanyard.card.width * 0.72 : 12;
        const safeY = isCard ? lanyard.card.height * 0.56 : 10;
        item.x = clamp(item.x, safeX, lanyard.width - safeX);
        item.y = clamp(item.y, safeY, lanyard.height - safeY);
      });

      ctx.clearRect(0, 0, lanyard.width, lanyard.height);
      drawAnchor();
      drawBand();
      drawClip();
      drawCard();
      lanyard.frame = requestAnimationFrame(tick);
    };

    const startDrag = (event) => {
      const position = localPointer(event);
      if (!cardContains(position.x, position.y)) return;
      lanyard.dragging = true;
      lanyard.pointerId = event.pointerId;
      lanyard.pointer.x = position.x;
      lanyard.pointer.y = position.y;
      lanyard.pointer.previousX = position.x;
      lanyard.pointer.previousY = position.y;
      els.heroLanyard.classList.add("is-dragging");
      document.body.style.cursor = "grabbing";
      event.preventDefault();
      event.stopPropagation();
    };

    const movePointer = (event) => {
      const position = localPointer(event);
      if (lanyard.dragging && event.pointerId === lanyard.pointerId) {
        lanyard.pointer.previousX = lanyard.pointer.x;
        lanyard.pointer.previousY = lanyard.pointer.y;
        lanyard.pointer.x = position.x;
        lanyard.pointer.y = position.y;
        event.preventDefault();
        return;
      }
      const nextHover = cardContains(position.x, position.y);
      if (nextHover !== lanyard.hover) {
        lanyard.hover = nextHover;
        document.body.style.cursor = nextHover ? "grab" : "";
      }
    };

    const releaseDrag = (event) => {
      if (!lanyard.dragging || event.pointerId !== lanyard.pointerId) return;
      lanyard.dragging = false;
      lanyard.pointerId = null;
      els.heroLanyard.classList.remove("is-dragging");
      document.body.style.cursor = "";
    };

    document.addEventListener("pointerdown", startDrag, true);
    window.addEventListener("pointermove", movePointer);
    window.addEventListener("pointerup", releaseDrag);
    window.addEventListener("pointercancel", releaseDrag);
    window.addEventListener("resize", resetScene);

    resetScene();
    lanyard.frame = requestAnimationFrame(tick);
  }

  bindLanyard();

  function spherePoint(index, total) {
    if (total === 1) return { x: 0, y: 0, z: 1 };
    const y = 1 - (index / (total - 1)) * 2;
    const radius = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = index * Math.PI * (3 - Math.sqrt(5));
    return {
      x: Math.cos(theta) * radius,
      y,
      z: Math.sin(theta) * radius
    };
  }

  function renderLevelOrbit() {
    if (!els.orbitCanvas || orbit.initialized) {
      updateOrbitSelection();
      return;
    }

    els.orbitCanvas.innerHTML = data.levels
      .map((level) => {
        const shortName = levelShort(level);
        return `
          <button class="orbit-disc" type="button" data-level="${level.id}" aria-label="${level.label}">
            <span>${shortName}</span>
            <strong>${levelCount(level.id)}</strong>
            <em>${level.techniques[0] || "strum"}</em>
          </button>
        `;
      })
      .join("");

    orbit.discs = [...els.orbitCanvas.querySelectorAll(".orbit-disc")].map((element, index) => ({
      element,
      point: spherePoint(index, data.levels.length),
      level: data.levels[index]
    }));

    orbit.discs.forEach((disc) => {
      disc.element.addEventListener("click", () => {
        if (orbit.moved) return;
        setLevel(disc.level.id, true);
      });
    });

    bindInfiniteMenu();
    orbit.initialized = true;
    orbit.frame = requestAnimationFrame(updateOrbit);
  }

  function bindInfiniteMenu() {
    const root = els.infiniteMenu;
    if (!root) return;

    root.addEventListener("pointerdown", (event) => {
      orbit.pointerDown = true;
      orbit.moved = false;
      orbit.lastX = event.clientX;
      orbit.lastY = event.clientY;
      root.classList.add("is-moving");
      root.setPointerCapture(event.pointerId);
    });

    root.addEventListener("pointermove", (event) => {
      if (!orbit.pointerDown) return;
      const dx = event.clientX - orbit.lastX;
      const dy = event.clientY - orbit.lastY;
      if (Math.abs(dx) + Math.abs(dy) > 4) orbit.moved = true;
      orbit.rotationY += dx * 0.006;
      orbit.rotationX = Math.max(-0.9, Math.min(0.9, orbit.rotationX - dy * 0.004));
      orbit.velocityY = dx * 0.00075;
      orbit.velocityX = -dy * 0.00045;
      orbit.lastX = event.clientX;
      orbit.lastY = event.clientY;
    });

    const endDrag = (event) => {
      orbit.pointerDown = false;
      root.classList.remove("is-moving");
      if (event.pointerId !== undefined && root.hasPointerCapture(event.pointerId)) {
        root.releasePointerCapture(event.pointerId);
      }
      setTimeout(() => {
        orbit.moved = false;
      }, 0);
    };

    root.addEventListener("pointerup", endDrag);
    root.addEventListener("pointercancel", endDrag);
    root.addEventListener("pointerleave", () => {
      orbit.pointerDown = false;
      root.classList.remove("is-moving");
    });

    els.orbitAction.addEventListener("pointerdown", (event) => {
      event.stopPropagation();
    });

    els.orbitAction.addEventListener("click", (event) => {
      event.stopPropagation();
      const level = data.levels[orbit.activeIndex];
      if (level) setLevel(level.id, true);
    });
  }

  function updateOrbitSelection() {
    if (!orbit.initialized) return;
    orbit.discs.forEach((disc) => {
      disc.element.classList.toggle("is-selected", state.level === disc.level.id);
    });
  }

  function setOrbitActive(index) {
    if (index === orbit.activeIndex && els.orbitTitle.textContent) return;
    orbit.activeIndex = index;
    const level = data.levels[index];
    if (!level) return;
    els.orbitTitle.textContent = level.label;
    els.orbitDescription.textContent = level.core;
    els.orbitAction.dataset.level = level.id;
  }

  function updateOrbit() {
    const width = els.orbitCanvas.clientWidth || 620;
    const height = els.orbitCanvas.clientHeight || 560;
    const orbitRadiusX = Math.min(250, width * 0.34);
    const orbitRadiusY = Math.min(200, height * 0.32);
    const depth = 190;
    const perspective = 560;
    let frontIndex = 0;
    let frontZ = -Infinity;

    if (!orbit.pointerDown) {
      orbit.rotationY += orbit.velocityY;
      orbit.rotationX += orbit.velocityX;
      orbit.velocityY = orbit.velocityY * 0.985 + 0.0024 * 0.015;
      orbit.velocityX *= 0.96;
    }

    const cosY = Math.cos(orbit.rotationY);
    const sinY = Math.sin(orbit.rotationY);
    const cosX = Math.cos(orbit.rotationX);
    const sinX = Math.sin(orbit.rotationX);

    orbit.discs.forEach((disc, index) => {
      const { x, y, z } = disc.point;
      const x1 = x * cosY + z * sinY;
      const z1 = -x * sinY + z * cosY;
      const y1 = y * cosX - z1 * sinX;
      const z2 = y * sinX + z1 * cosX;
      const scale = perspective / (perspective - z2 * depth);
      const screenX = x1 * orbitRadiusX * scale;
      const screenY = y1 * orbitRadiusY * scale;
      const alpha = 0.28 + Math.max(0, (z2 + 1) / 2) * 0.72;

      if (z2 > frontZ) {
        frontZ = z2;
        frontIndex = index;
      }

      disc.element.style.transform = `translate(-50%, -50%) translate3d(${screenX}px, ${screenY}px, 0) scale(${scale})`;
      disc.element.style.zIndex = String(Math.round((z2 + 2) * 100));
      disc.element.style.opacity = alpha.toFixed(3);
    });

    orbit.discs.forEach((disc, index) => {
      disc.element.classList.toggle("is-front", index === frontIndex);
    });
    setOrbitActive(frontIndex);
    updateOrbitSelection();
    orbit.frame = requestAnimationFrame(updateOrbit);
  }

  function renderLevelSongPicker() {
    if (!els.levelSongPicker) return;
    const level = levelById[state.activeLevelPicker];
    if (!state.levelPickerOpen || !level) {
      resetLevelSongSplash();
      els.levelSongPicker.hidden = true;
      els.levelSongPicker.innerHTML = "";
      return;
    }

    const songs = songsForLevel(level.id);
    els.levelSongPicker.hidden = false;
    els.levelSongPicker.innerHTML = `
      <section class="level-song-picker-panel" aria-label="${level.label} 歌曲选择">
        <div class="level-song-picker-head">
          <div>
            <p class="marker-caption">选择一首歌</p>
            <h3>${level.label} 歌曲抽屉</h3>
            <p>${level.core}</p>
          </div>
          <button type="button" class="picker-close" data-close-picker aria-label="关闭歌曲选择">×</button>
        </div>
        <div class="level-song-picker-body">
          <canvas class="level-song-splash" aria-hidden="true"></canvas>
          <div class="level-song-picker-grid chroma-grid" style="--r: 300px;">
            ${songs
              .map((song, index) => `
                <button
                  type="button"
                  class="song-picker-card chroma-card"
                  data-song="${song.id}"
                  aria-label="选择 ${song.title}"
                >
                  <div class="chroma-img-wrapper song-picker-visual">
                    <span>${levelShort(level)}</span>
                    <strong>${String(index + 1).padStart(2, "0")}</strong>
                    <em>${song.category}</em>
                  </div>
                  <footer class="chroma-info song-picker-info">
                    <h3 class="name">${song.title}</h3>
                    <span class="handle">${song.source.includes("2024") ? "2024" : "old"}</span>
                    <p class="role">${song.artist || "Ukulele Template"} · ${song.style}</p>
                    <span class="location">${song.techniques.slice(0, 2).join(" / ")}</span>
                  </footer>
                </button>
              `)
              .join("")}
          </div>
        </div>
      </section>
    `;
    bindLevelSongPicker();
  }

  function bindLevelSongPicker() {
    if (!els.levelSongPicker) return;
    const grid = els.levelSongPicker.querySelector(".level-song-picker-grid");
    const fade = grid?.querySelector(".chroma-fade");
    if (grid) {
      initLevelSongSplash(grid);
      grid.style.setProperty("--x", "50%");
      grid.style.setProperty("--y", "50%");
      grid.onpointermove = (event) => {
        const rect = grid.getBoundingClientRect();
        grid.style.setProperty("--x", `${event.clientX - rect.left}px`);
        grid.style.setProperty("--y", `${event.clientY - rect.top}px`);
        if (fade) fade.style.opacity = "0";
        paintLevelSongSplash(event, 0.84);

        const card = event.target.closest(".chroma-card");
        if (card) {
          const cardRect = card.getBoundingClientRect();
          card.style.setProperty("--mouse-x", `${event.clientX - cardRect.left}px`);
          card.style.setProperty("--mouse-y", `${event.clientY - cardRect.top}px`);
        }
      };
      grid.onpointerdown = (event) => paintLevelSongSplash(event, 1.45);
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
    els.levelBoard.innerHTML = `<div class="circular-gallery-track">` + data.levels
      .map((level) => {
        const active = state.level === level.id ? " is-active" : "";
        const expanded = state.levelPickerOpen && state.activeLevelPicker === level.id ? "true" : "false";
        return `
          <button
            type="button"
            class="level-label circular-card chroma-card${level.coverImage ? " has-book-cover" : ""}${active}"
            data-level="${level.id}"
            aria-controls="levelSongPicker"
            aria-expanded="${expanded}"
            style="${chromaStyle(level)}"
          >
            ${renderLevelMedia(level)}
            <footer class="circular-caption chroma-info">
              <h3 class="name">${level.label}</h3>
              <span class="handle">${level.techniques[0] || "strum"}</span>
              <p class="role">${level.core}</p>
              <span class="location">${level.techniques.slice(0, 2).join(" / ")}</span>
            </footer>
          </button>
        `;
      })
      .join("") + `</div>
        <button class="level-gallery-arrow level-gallery-prev" type="button" data-level-gallery-prev aria-label="Previous level cover">
          <span aria-hidden="true">&lsaquo;</span>
        </button>
        <button class="level-gallery-arrow level-gallery-next" type="button" data-level-gallery-next aria-label="Next level cover">
          <span aria-hidden="true">&rsaquo;</span>
        </button>
        <div class="chroma-overlay"></div><div class="chroma-fade"></div>`;

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

  function audioVersionSlots(song) {
    const audioItems = Array.isArray(song.audio) ? song.audio : [];
    return audioItems.map((item, index) => {
      return {
        index,
        number: String(index + 1).padStart(2, "0"),
        title: item.title || item.label || item.name || `版本 ${index + 1}`,
        src: item.src || ""
      };
    });
  }

  function activeAudioVersionIndex(song, slots) {
    const value = Number(state.audioVersionBySong[song.id] || 0);
    if (!Number.isFinite(value)) return 0;
    return Math.max(0, Math.min(slots.length - 1, value));
  }

  function formatAudioDuration(seconds) {
    if (!Number.isFinite(seconds) || seconds <= 0) return "--:--";
    const totalSeconds = Math.round(seconds);
    const minutes = Math.floor(totalSeconds / 60);
    const rest = String(totalSeconds % 60).padStart(2, "0");
    return `${minutes}:${rest}`;
  }

  function bindAudioProgress() {
    // Template build: audio playback is intentionally disabled until licensed ukulele media is added.
  }

  function renderAudio(song) {
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
    const activeIndex = activeAudioVersionIndex(song, slots);
    const activeSlot = slots[activeIndex];
    const playerLabel = `${song.title} - ${activeSlot.title}`;

    return `
      <div class="audio-workbench">
        <div class="audio-player-frame">
          <div class="audio-version-head">
            <span>播放器版本</span>
            <strong>${escapeHtml(activeSlot.title)}</strong>
            <em>${escapeHtml(playerLabel)}</em>
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
                    <strong>${escapeHtml(slot.title)}</strong>
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
              min-rate="0.5"
              max-rate="1.5"
              step="0.05"
              engine="rubberband"
              no-upload
              version-selector
            ></audio-speed-player>
            <p>播放器会读取当前曲目的项目内音频资源。</p>
          </div>
        </div>
      </div>
    `;
  }

  function renderScores(song) {
    if (!song.scoreImages.length) {
      return `
        <div class="resource-note">
          <span>谱面图片</span>
          <strong>谱面图片待加入</strong>
          <small>后续可按 Intro、Verse、Chorus、Fill 等段落上传。</small>
        </div>
      `;
    }
    return song.scoreImages
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

  function renderLesson(song, level) {
    return `
      <div class="practice-steps">
        ${song.teaching.practiceOrder
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
        <dt>教学目标</dt><dd>${song.teaching.goal}</dd>
        <dt>技术要点</dt><dd>${song.teaching.focus}</dd>
        <dt>常见问题</dt><dd>${song.teaching.commonIssues.join("；")}</dd>
        <dt>通过标准</dt><dd>${song.teaching.passStandard}</dd>
        <dt>等级依据</dt><dd>${level.label} · ${level.core}</dd>
      </dl>
    `;
  }

  function renderEvidence(song, level) {
    return `
      <div class="evidence-tags">
        <div><span>grade</span><strong>${level.label}</strong><small>${level.core}</small></div>
        <div><span>source</span><strong>${song.source}</strong><small>${song.category}</small></div>
        <div><span>style</span><strong>${song.style}</strong><small>${song.artist || "Ukulele Template"}</small></div>
      </div>
      <p>${level.boundary}</p>
      <div class="song-tags">${techButtonMarkup(song.techniques)}</div>
    `;
  }

  function renderContentPane(song, level) {
    if (state.detailTab === "score") return `<div class="score-grid">${renderScores(song)}</div>`;
    if (state.detailTab === "metronome") return `<div class="lesson-metronome-host" data-metronome-host></div>`;
    if (state.detailTab === "evidence") return renderEvidence(song, level);
    return renderLesson(song, level);
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

  function updateSongDetailTab(song, level) {
    const audioPane = els.songDetail.querySelector("[data-audio-pane]");
    const contentPane = els.songDetail.querySelector("[data-content-pane]");

    els.songDetail.querySelectorAll("[data-tab]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.tab === state.detailTab);
    });

    if (audioPane) audioPane.hidden = state.detailTab !== "audio";
    if (contentPane) {
      contentPane.hidden = state.detailTab === "audio";
      if (state.detailTab !== "audio") {
        contentPane.innerHTML = renderContentPane(song, level);
        bindDetailTechButtons(contentPane);
        mountLessonMetronome(contentPane);
      }
    }
  }

  function renderSongDetail() {
    if (!els.songDetail) return;
    const song = getSelectedSong();
    if (!song) {
      els.songDetail.innerHTML = `<div class="empty-note">请选择一首歌。</div>`;
      return;
    }
    const level = levelById[song.level];
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
      <div class="lesson-tabs" role="tablist" aria-label="歌曲详情">
        <button type="button" class="${state.detailTab === "lesson" ? "is-active" : ""}" data-tab="lesson">教学</button>
        <button type="button" class="${state.detailTab === "audio" ? "is-active" : ""}" data-tab="audio">音频</button>
        <button type="button" class="${state.detailTab === "score" ? "is-active" : ""}" data-tab="score">谱面</button>
        <button type="button" class="${state.detailTab === "metronome" ? "is-active" : ""}" data-tab="metronome">节拍器</button>
      </div>
      <div class="lesson-pane lesson-audio-pane" data-audio-pane ${state.detailTab === "audio" ? "" : "hidden"}>${renderAudio(song)}</div>
      <div class="lesson-pane" data-content-pane ${state.detailTab === "audio" ? "hidden" : ""}>${state.detailTab === "audio" ? "" : renderContentPane(song, level)}</div>
    `;

    els.songDetail.querySelectorAll("[data-tab]").forEach((button) => {
      button.addEventListener("click", () => {
        state.detailTab = button.dataset.tab;
        updateSongDetailTab(song, level);
      });
    });

    els.songDetail.querySelectorAll("[data-audio-version]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        state.audioVersionBySong[song.id] = Number(button.dataset.audioVersion || 0);
        state.detailTab = "audio";
        renderSongDetail();
      });
    });

    bindDetailTechButtons(els.songDetail);
    bindAudioProgress(els.songDetail);
    mountLessonMetronome(els.songDetail);
  }

  function render() {
    const filteredSongs = getFilteredSongs();
    if (!filteredSongs.some((song) => song.id === state.selectedSongId)) {
      state.selectedSongId = filteredSongs[0] ? filteredSongs[0].id : "";
      state.detailTab = "lesson";
    }
    syncControls();
    renderHeroNotebook();
    renderLevelOrbit();
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
  bindEvents();
  render();
  initDecryptedText();
  initSupportFolder();
})();
