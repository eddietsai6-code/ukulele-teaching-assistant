export function mountTailarkHeroScale(documentRef = document, windowRef = window) {
  const hero = documentRef.querySelector(".tailark-hero");
  if (!hero || hero.dataset.tailarkScaleMounted === "true") return;
  const stage = hero.querySelector(".tailark-hero-stage");
  const nav = hero.querySelector(".tailark-nav");
  if (!stage || !nav) return;

  const settings = {
    designWidth: 1228,
    designHeight: 770,
    stageLeft: 102,
    stageTop: 70,
    frame: 0
  };

  const clearScale = () => {
    hero.classList.remove("is-tailark-scaled");
    hero.style.removeProperty("--tailark-scale");
    hero.style.removeProperty("--tailark-hero-height");
    hero.style.removeProperty("--tailark-stage-left");
    hero.style.removeProperty("--tailark-stage-top");
  };

  const applyScale = () => {
    const viewportWidth = Math.max(
      documentRef.documentElement.clientWidth || windowRef.innerWidth || settings.designWidth,
      1
    );
    if (viewportWidth <= 640 || viewportWidth >= settings.designWidth) {
      clearScale();
      return;
    }

    const scale = viewportWidth / settings.designWidth;
    hero.style.setProperty("--tailark-scale", scale.toFixed(5));
    hero.style.setProperty("--tailark-hero-height", `${Math.ceil(settings.designHeight * scale)}px`);
    hero.style.setProperty("--tailark-stage-left", `${(settings.stageLeft * scale).toFixed(2)}px`);
    hero.style.setProperty("--tailark-stage-top", `${(settings.stageTop * scale).toFixed(2)}px`);
    hero.classList.add("is-tailark-scaled");
  };

  const scheduleScale = () => {
    if (settings.frame) windowRef.cancelAnimationFrame(settings.frame);
    settings.frame = windowRef.requestAnimationFrame(applyScale);
  };

  hero.dataset.tailarkScaleMounted = "true";
  applyScale();
  windowRef.addEventListener("resize", scheduleScale, { passive: true });
}
