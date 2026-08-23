export const SCROLL_GALLERY_PHOTOS = [
  // Replace same-named files in assets/gallery/celebrity-avatars/ to update this module.
  {
    id: "gallery-photo-01",
    label: "Replaceable celebrity avatar 01",
    src: "./assets/gallery/celebrity-avatars/celebrity-avatar-01.jpg"
  },
  {
    id: "gallery-photo-02",
    label: "Replaceable celebrity avatar 02",
    src: "./assets/gallery/celebrity-avatars/celebrity-avatar-02.jpg"
  },
  {
    id: "gallery-photo-03",
    label: "Replaceable celebrity avatar 03",
    src: "./assets/gallery/celebrity-avatars/celebrity-avatar-03.jpeg"
  },
  {
    id: "gallery-photo-04",
    label: "Replaceable celebrity avatar 04",
    src: "./assets/gallery/celebrity-avatars/celebrity-avatar-04.jpeg"
  },
  {
    id: "gallery-photo-05",
    label: "Replaceable celebrity avatar 05",
    src: "./assets/gallery/celebrity-avatars/celebrity-avatar-05.png"
  },
  {
    id: "gallery-photo-06",
    label: "Replaceable celebrity avatar 06",
    src: "./assets/gallery/celebrity-avatars/celebrity-avatar-06.jpg"
  },
  {
    id: "gallery-photo-07",
    label: "Replaceable celebrity avatar 07",
    src: "./assets/gallery/celebrity-avatars/celebrity-avatar-07.jpg"
  },
  {
    id: "gallery-photo-08",
    label: "Replaceable celebrity avatar 08",
    src: "./assets/gallery/celebrity-avatars/celebrity-avatar-08.jpg"
  },
  {
    id: "gallery-photo-09",
    label: "Replaceable celebrity avatar 09",
    src: "./assets/gallery/celebrity-avatars/celebrity-avatar-09.jpg"
  },
  {
    id: "gallery-photo-10",
    label: "Replaceable celebrity avatar 10",
    src: "./assets/gallery/celebrity-avatars/celebrity-avatar-10.jpg"
  },
  {
    id: "gallery-photo-11",
    label: "Replaceable celebrity avatar 11",
    src: "./assets/gallery/celebrity-avatars/celebrity-avatar-11.jpg"
  },
  {
    id: "gallery-photo-12",
    label: "Replaceable celebrity avatar 12",
    src: "./assets/gallery/celebrity-avatars/celebrity-avatar-12.jpg"
  },
  {
    id: "gallery-photo-13",
    label: "Replaceable celebrity avatar 13",
    src: "./assets/gallery/celebrity-avatars/celebrity-avatar-13.jpg"
  },
  {
    id: "gallery-photo-14",
    label: "Replaceable celebrity avatar 14",
    src: "./assets/gallery/celebrity-avatars/celebrity-avatar-14.jpeg"
  },
  {
    id: "gallery-photo-15",
    label: "Replaceable celebrity avatar 15",
    src: "./assets/gallery/celebrity-avatars/celebrity-avatar-15.jpg"
  },
  {
    id: "gallery-photo-16",
    label: "Replaceable celebrity avatar 16",
    src: "./assets/gallery/celebrity-avatars/celebrity-avatar-16.jpg"
  },
  {
    id: "gallery-photo-17",
    label: "Replaceable celebrity avatar 17",
    src: "./assets/gallery/celebrity-avatars/celebrity-avatar-17.jpeg"
  },
  {
    id: "gallery-photo-18",
    label: "Replaceable celebrity avatar 18",
    src: "./assets/gallery/celebrity-avatars/celebrity-avatar-18.jpg"
  }
];

const COLUMN_TRANSFORMS = {
  1: [0, -40],
  2: [-40, 10],
  3: [0, -40],
  4: [-30, 20]
};

const CRUISE_PROGRESS = 0.18;
const CRUISE_BOOST_MAX_RATE = 4.5;
const CRUISE_BOOST_DECAY_MS = 5000;
const GALLERY_PAN_MAX_RATIO = 0.45;
const GALLERY_PAN_MAX_PX = 420;

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function mapRange(value, inputStart, inputEnd, outputStart, outputEnd) {
  const progress = clamp((value - inputStart) / (inputEnd - inputStart));
  return outputStart + (outputEnd - outputStart) * progress;
}

function createImageCard(photo, index) {
  const card = document.createElement("div");
  card.className = "scroll-gallery-card";
  card.dataset.photoSlot = String(index + 1).padStart(2, "0");
  card.dataset.photoId = photo.id;
  card.setAttribute("aria-label", photo.label);

  const image = document.createElement("img");
  image.src = photo.src;
  image.alt = "";
  image.loading = "lazy";
  image.decoding = "async";
  image.addEventListener("load", () => {
    card.classList.add("is-loaded");
  });
  image.addEventListener("error", () => {
    card.classList.add("is-fallback");
    image.hidden = true;
  });

  const fallback = document.createElement("span");
  fallback.className = "scroll-gallery-fallback";
  fallback.textContent = `PHOTO ${card.dataset.photoSlot}`;

  card.appendChild(image);
  card.appendChild(fallback);
  return card;
}

function fillColumns(gallery) {
  const columns = gallery.querySelectorAll("[data-scroll-gallery-column]");
  if (!columns.length || columns[0].children.length) return;

  columns.forEach((column) => {
    const columnIndex = Number(column.dataset.scrollGalleryColumn || 1) - 1;
    const base = SCROLL_GALLERY_PHOTOS.filter((_, index) => index % 4 === columnIndex);
    const rail = document.createElement("div");
    rail.className = "scroll-gallery-rail";

    [...base, ...base].forEach((photo, index) => {
      rail.appendChild(createImageCard(photo, index));
    });

    column.appendChild(rail);
  });
}

function applyProgress(gallery, progress) {
  gallery.classList.toggle("is-gallery-cruising", progress >= CRUISE_PROGRESS);
  gallery.style.setProperty("--gallery-banner-width", `${mapRange(progress, 0, 0.15, 90, 100)}vw`);
  gallery.style.setProperty("--gallery-banner-height", `${mapRange(progress, 0, 0.15, 80, 100)}vh`);
  gallery.style.setProperty("--gallery-banner-radius", `${mapRange(progress, 0, 0.15, 48, 0)}px`);
  gallery.style.setProperty("--gallery-banner-border", `${mapRange(progress, 0, 0.15, 4, 0)}px`);
  gallery.style.setProperty("--gallery-rotate-y", `${mapRange(progress, 0.15, 1, -45, -8)}deg`);
  gallery.style.setProperty("--gallery-rotate-x", `${mapRange(progress, 0.15, 1, 25, 4)}deg`);
  gallery.style.setProperty("--gallery-rotate-z", `${mapRange(progress, 0.15, 1, 15, 2)}deg`);
  gallery.style.setProperty("--gallery-translate-z", `${mapRange(progress, 0.15, 1, -800, 0)}px`);

  Object.entries(COLUMN_TRANSFORMS).forEach(([column, range]) => {
    gallery.style.setProperty(`--gallery-col-${column}-y`, `${mapRange(progress, 0.15, 1, range[0], range[1])}%`);
  });
}

function setCruiseRate(gallery, rate) {
  gallery.style.setProperty("--gallery-cruise-rate", rate.toFixed(2));
  gallery.querySelectorAll(".scroll-gallery-rail").forEach((rail) => {
    if (typeof rail.getAnimations !== "function") return;
    rail.getAnimations().forEach((animation) => {
      if (typeof animation.updatePlaybackRate === "function") {
        animation.updatePlaybackRate(rate);
      } else {
        animation.playbackRate = rate;
      }
    });
  });
}

function bindManualCruiseBoost(gallery, wrapper) {
  let boostTimeout = 0;
  let isDragging = false;
  let dragInput = "";
  let lastDragPoint = { x: 0, y: 0 };
  let panX = 0;

  const getPanLimit = () => Math.max(120, Math.min(wrapper.clientWidth * GALLERY_PAN_MAX_RATIO, GALLERY_PAN_MAX_PX));

  const setGalleryPan = (nextPanX) => {
    const panLimit = getPanLimit();
    panX = clamp(nextPanX, -panLimit, panLimit);
    gallery.style.setProperty("--gallery-pan-x", `${panX.toFixed(1)}px`);
  };

  const boostCruise = (amount) => {
    if (!gallery.classList.contains("is-gallery-cruising")) return;
    const rate = clamp(1 + amount / 48, 1.25, CRUISE_BOOST_MAX_RATE);
    gallery.classList.add("is-gallery-boosting");
    setCruiseRate(gallery, rate);

    window.clearTimeout(boostTimeout);
    boostTimeout = window.setTimeout(() => {
      setCruiseRate(gallery, 1);
      gallery.classList.remove("is-gallery-boosting");
    }, CRUISE_BOOST_DECAY_MS);
  };

  const startDrag = (clientX, clientY, input) => {
    if (isDragging || !gallery.classList.contains("is-gallery-cruising")) return;
    isDragging = true;
    dragInput = input;
    lastDragPoint = { x: clientX, y: clientY };
    gallery.classList.add("is-gallery-dragging");
  };

  const moveDrag = (clientX, clientY) => {
    if (!isDragging) return;
    const deltaX = clientX - lastDragPoint.x;
    const deltaY = clientY - lastDragPoint.y;
    const delta = Math.hypot(deltaX, deltaY);
    lastDragPoint = { x: clientX, y: clientY };
    if (Math.abs(deltaX) > 0.5) setGalleryPan(panX + deltaX);
    if (delta > 1) boostCruise(delta * 5);
  };

  const endDrag = (event) => {
    isDragging = false;
    dragInput = "";
    gallery.classList.remove("is-gallery-dragging");
    if (event?.pointerId != null && wrapper.hasPointerCapture?.(event.pointerId)) {
      wrapper.releasePointerCapture?.(event.pointerId);
    }
  };

  wrapper.addEventListener(
    "wheel",
    (event) => {
      if (Math.abs(event.deltaX) > 0.5) setGalleryPan(panX - event.deltaX);
      boostCruise(Math.hypot(event.deltaX, event.deltaY) * 0.45);
    },
    { passive: true }
  );

  wrapper.addEventListener("pointerdown", (event) => {
    startDrag(event.clientX, event.clientY, "pointer");
    wrapper.setPointerCapture?.(event.pointerId);
  });

  wrapper.addEventListener("pointermove", (event) => {
    if (dragInput !== "pointer") return;
    moveDrag(event.clientX, event.clientY);
  });

  wrapper.addEventListener("pointerup", endDrag);
  wrapper.addEventListener("pointercancel", endDrag);
  wrapper.addEventListener("pointerleave", endDrag);

  wrapper.addEventListener("mousedown", (event) => {
    startDrag(event.clientX, event.clientY, "mouse");
  });

  window.addEventListener("mousemove", (event) => {
    if (dragInput !== "mouse") return;
    moveDrag(event.clientX, event.clientY);
  });

  window.addEventListener("mouseup", endDrag);

  wrapper.addEventListener(
    "touchstart",
    (event) => {
      const touch = event.touches[0];
      if (touch) startDrag(touch.clientX, touch.clientY, "touch");
    },
    { passive: true }
  );

  wrapper.addEventListener(
    "touchmove",
    (event) => {
      if (dragInput !== "touch") return;
      const touch = event.touches[0];
      if (touch) moveDrag(touch.clientX, touch.clientY);
    },
    { passive: true }
  );

  wrapper.addEventListener("touchend", endDrag);
  wrapper.addEventListener("touchcancel", endDrag);
  window.addEventListener("resize", () => setGalleryPan(panX));

  return boostCruise;
}

function initGallery(gallery) {
  const wrapper = gallery.querySelector("[data-scroll-gallery-wrapper]");
  if (!wrapper || gallery.dataset.scrollGalleryReady === "true") return;

  gallery.dataset.scrollGalleryReady = "true";
  fillColumns(gallery);

  let targetProgress = 0;
  let smoothProgress = 0;
  let frame = 0;
  let lastScrollTop = 0;
  let boostCruise = () => {};

  const readProgress = () => {
    const maxScroll = Math.max(1, wrapper.scrollHeight - wrapper.clientHeight);
    const nextScrollTop = wrapper.scrollTop;
    const scrollDelta = Math.abs(nextScrollTop - lastScrollTop);
    targetProgress = clamp(nextScrollTop / maxScroll);
    if (scrollDelta > 8 && targetProgress >= CRUISE_PROGRESS) {
      boostCruise(scrollDelta * 0.2);
    }
    lastScrollTop = nextScrollTop;
    if (!frame) frame = requestAnimationFrame(tick);
  };

  const tick = () => {
    smoothProgress += (targetProgress - smoothProgress) * 0.16;
    applyProgress(gallery, smoothProgress);

    if (Math.abs(targetProgress - smoothProgress) > 0.001) {
      frame = requestAnimationFrame(tick);
    } else {
      smoothProgress = targetProgress;
      applyProgress(gallery, smoothProgress);
      frame = 0;
    }
  };

  applyProgress(gallery, 0);
  boostCruise = bindManualCruiseBoost(gallery, wrapper);
  wrapper.addEventListener("scroll", readProgress, { passive: true });
  window.addEventListener("resize", readProgress);
  readProgress();
}

export function initScrollGallery(root = document) {
  root.querySelectorAll("[data-scroll-gallery]").forEach(initGallery);
}
