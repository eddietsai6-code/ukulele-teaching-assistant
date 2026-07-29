import { createLanyardRenderer } from "./lanyard-renderer.js";

const lanyard = {
  initialized: false,
  canvas: null,
  ctx: null,
  logo: null,
  dpr: 1,
  width: 0,
  height: 0,
  frame: 0,
  lastTime: 0,
  dragging: false,
  hover: false,
  pointerId: null,
  pointer: { x: 0, y: 0, previousX: 0, previousY: 0 },
  dragOffset: { x: 0, y: 0 },
  points: [],
  constraints: [],
  base: { x: 0, y: 0, centerX: 0, centerY: 0 },
  gravity: 0.36,
  linearDamping: 0.985,
  segmentDamping: 0.965,
  card: { width: 138, height: 188, angle: 0, skew: 0, attachY: 18 }
};

export function mountHeroLanyard(root) {
  if (!root || lanyard.initialized) return;
  const canvas = root.querySelector(".lanyard-canvas");
  const logo = root.querySelector(".ukebook-logo-stage");
  const ctx = canvas?.getContext("2d");
  if (!canvas || !ctx || !logo) return;

  lanyard.initialized = true;
  lanyard.canvas = canvas;
  lanyard.ctx = ctx;
  lanyard.logo = logo;

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const renderer = createLanyardRenderer({ ctx, state: lanyard, clamp });
  const point = (x, y, fixed) => ({
    x,
    y,
    previousX: x,
    previousY: y,
    lerpX: x,
    lerpY: y,
    fixed: Boolean(fixed)
  });

  const connect = (a, b, length, stiffness) => {
    lanyard.constraints.push({ a, b, length, stiffness });
  };
  const distanceBetween = (a, b) => Math.hypot(b.x - a.x, b.y - a.y);

  const wakeLanyard = () => {
    lanyard.points.forEach((item) => {
      if (item.fixed) return;
      item.previousX = item.x;
      item.previousY = item.y;
    });
  };

  const resetScene = () => {
    const rect = root.getBoundingClientRect();
    lanyard.dpr = Math.min(window.devicePixelRatio || 1, 2);
    lanyard.width = Math.max(1, root.clientWidth || rect.width);
    lanyard.height = Math.max(1, root.clientHeight || rect.height);
    canvas.width = Math.round(lanyard.width * lanyard.dpr);
    canvas.height = Math.round(lanyard.height * lanyard.dpr);
    ctx.setTransform(lanyard.dpr, 0, 0, lanyard.dpr, 0, 0);

    root.style.setProperty("--lanyard-drag-x", "0px");
    root.style.setProperty("--lanyard-drag-y", "0px");
    root.style.setProperty("--lanyard-card-rotate", "0deg");
    root.style.setProperty("--lanyard-card-skew", "0deg");

    const logoRect = logo.getBoundingClientRect();
    const cardWidth = Math.max(1, logoRect.width);
    const cardHeight = Math.max(1, logoRect.height);
    const baseCenterX = logoRect.left - rect.left + logoRect.width / 2;
    const baseCenterY = logoRect.top - rect.top + logoRect.height / 2;
    lanyard.base = {
      x: logoRect.left - rect.left,
      y: logoRect.top - rect.top,
      centerX: baseCenterX,
      centerY: baseCenterY,
      attachX: baseCenterX,
      attachY: logoRect.top - rect.top + cardHeight * 0.105
    };
    lanyard.card.width = cardWidth;
    lanyard.card.height = cardHeight;
    lanyard.card.attachY = cardHeight * 0.105;
    lanyard.card.angle = 0.02;
    lanyard.card.skew = 0;

    const anchorX = clamp(
      baseCenterX + cardWidth * 0.03,
      cardWidth * 0.42,
      lanyard.width - cardWidth * 0.2
    );
    const anchorY = -18;
    const topY = clamp(lanyard.base.attachY, 38, Math.max(42, lanyard.height - cardHeight - 24));
    const drop = topY - anchorY;
    lanyard.points = [
      point(anchorX, anchorY, true),
      point(anchorX - Math.min(26, lanyard.width * 0.035), anchorY + drop * 0.28),
      point(anchorX - Math.min(12, lanyard.width * 0.018), anchorY + drop * 0.62),
      point(lanyard.base.attachX, topY),
      point(baseCenterX, baseCenterY)
    ];
    lanyard.constraints = [];
    connect(0, 1, distanceBetween(lanyard.points[0], lanyard.points[1]), 1);
    connect(1, 2, distanceBetween(lanyard.points[1], lanyard.points[2]), 0.95);
    connect(2, 3, distanceBetween(lanyard.points[2], lanyard.points[3]), 0.95);
    connect(3, 4, Math.max(34, baseCenterY - topY), 1);
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

  const updateCardPhysics = () => {
    const top = lanyard.points[3];
    const center = lanyard.points[4];
    if (!top || !center) return;
    const angle = Math.atan2(center.y - top.y, center.x - top.x) - Math.PI / 2;
    const sway = clamp((center.x - lanyard.points[0].x) / lanyard.width, -0.45, 0.45);
    const speedSkew = clamp((center.x - center.previousX) * 0.012, -0.08, 0.08);
    lanyard.card.angle += (angle - lanyard.card.angle) * 0.22;
    lanyard.card.skew += (sway * 0.18 + speedSkew - lanyard.card.skew) * 0.18;
  };

  const applyLanyardForces = (delta) => {
    lanyard.points.forEach((item, index) => {
      if (item.fixed) return;
      const damping = index === 4 ? lanyard.linearDamping : lanyard.segmentDamping;
      const gravity = index === 4 ? lanyard.gravity : lanyard.gravity * 0.7;
      const velocityX = (item.x - item.previousX) * damping;
      const velocityY = (item.y - item.previousY) * damping;
      item.previousX = item.x;
      item.previousY = item.y;
      item.x += velocityX;
      item.y += velocityY + gravity * delta * delta;
    });
  };

  const syncLogoToPhysics = () => {
    const top = lanyard.points[3];
    const center = lanyard.points[4];
    if (!top || !center) return;
    const offsetX = top.x - lanyard.base.attachX;
    const offsetY = top.y - lanyard.base.attachY;
    const rotation = clamp((lanyard.card.angle * 180) / Math.PI, -14, 14);
    const skew = clamp((lanyard.card.skew * 180) / Math.PI, -6, 6);
    root.style.setProperty("--lanyard-drag-x", `${offsetX.toFixed(2)}px`);
    root.style.setProperty("--lanyard-drag-y", `${offsetY.toFixed(2)}px`);
    root.style.setProperty("--lanyard-card-rotate", `${rotation.toFixed(2)}deg`);
    root.style.setProperty("--lanyard-card-skew", `${skew.toFixed(2)}deg`);
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
      anchor.x = clamp(
        lanyard.base.centerX + lanyard.card.width * 0.03,
        lanyard.card.width * 0.42,
        lanyard.width - lanyard.card.width * 0.2
      );
      anchor.y = -18;
    }

    applyLanyardForces(delta);

    if (lanyard.dragging) {
      const card = lanyard.points[4];
      const dragVelocityX = lanyard.pointer.x - lanyard.pointer.previousX;
      const dragVelocityY = lanyard.pointer.y - lanyard.pointer.previousY;
      card.x = lanyard.pointer.x - lanyard.dragOffset.x;
      card.y = lanyard.pointer.y - lanyard.dragOffset.y;
      card.previousX = card.x - dragVelocityX * 0.85;
      card.previousY = card.y - dragVelocityY * 0.85;
    }

    solveConstraints();

    lanyard.points.forEach((item) => {
      if (item.fixed) return;
      const isCard = item === lanyard.points[4];
      const safeX = isCard ? -lanyard.card.width * 0.85 : 12;
      const safeY = isCard ? -lanyard.card.height * 0.2 : 10;
      item.x = clamp(item.x, safeX, lanyard.width - safeX);
      item.y = clamp(item.y, safeY, lanyard.height - safeY);
    });

    updateCardPhysics();
    ctx.clearRect(0, 0, lanyard.width, lanyard.height);
    renderer.draw();
    syncLogoToPhysics();
    lanyard.frame = requestAnimationFrame(tick);
  };

  const startDrag = (event) => {
    const position = localPointer(event);
    const card = lanyard.points[4];
    if (!card) return;
    lanyard.dragging = true;
    lanyard.pointerId = event.pointerId;
    lanyard.pointer.x = position.x;
    lanyard.pointer.y = position.y;
    lanyard.pointer.previousX = position.x;
    lanyard.pointer.previousY = position.y;
    lanyard.dragOffset.x = position.x - card.x;
    lanyard.dragOffset.y = position.y - card.y;
    wakeLanyard();
    root.classList.add("is-dragging");
    logo.setPointerCapture?.(event.pointerId);
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
    root.classList.remove("is-dragging");
    if (event.pointerId !== undefined && logo.hasPointerCapture?.(event.pointerId)) {
      logo.releasePointerCapture(event.pointerId);
    }
    document.body.style.cursor = "";
  };

  logo.addEventListener("pointerdown", startDrag);
  window.addEventListener("pointermove", movePointer);
  window.addEventListener("pointerup", releaseDrag);
  window.addEventListener("pointercancel", releaseDrag);
  window.addEventListener("resize", resetScene);

  resetScene();
  lanyard.frame = requestAnimationFrame(tick);
}

