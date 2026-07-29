export function createLevelSongSplash(windowRef = window) {
  const state = {
    canvas: null,
    ctx: null,
    frame: 0,
    particles: [],
    dpr: 1,
    reducedMotion: windowRef.matchMedia("(prefers-reduced-motion: reduce)")
  };

  const reset = () => {
    if (state.frame) {
      windowRef.cancelAnimationFrame(state.frame);
    }
    state.canvas = null;
    state.ctx = null;
    state.frame = 0;
    state.particles = [];
  };

  const syncSize = () => {
    const { canvas, ctx } = state;
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(windowRef.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.round(rect.width * dpr));
    const height = Math.max(1, Math.round(rect.height * dpr));

    if (canvas.width !== width || canvas.height !== height || state.dpr !== dpr) {
      canvas.width = width;
      canvas.height = height;
      state.dpr = dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  };

  const animate = () => {
    const { canvas, ctx } = state;
    if (!canvas || !ctx) return;
    syncSize();
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    ctx.globalCompositeOperation = "screen";

    state.particles = state.particles.filter((particle) => {
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
    state.frame = state.particles.length ? windowRef.requestAnimationFrame(animate) : 0;
  };

  const paint = (event, strength = 1) => {
    if (state.reducedMotion.matches || !state.canvas) return;
    const rect = state.canvas.getBoundingClientRect();
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
      state.particles.push({
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
    if (!state.frame) {
      state.frame = windowRef.requestAnimationFrame(animate);
    }
  };

  const init = (grid, root) => {
    reset();
    if (!grid || state.reducedMotion.matches) return;
    const canvas = root?.querySelector(".level-song-splash");
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    state.canvas = canvas;
    state.ctx = ctx;
    syncSize();
  };

  return { init, paint, reset };
}
