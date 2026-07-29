export function mountTextPressure(root, options = {}) {
  if (!root || root.dataset.textPressureMounted === "true") return;
  const win = options.windowRef || window;
  const frame = options.requestAnimationFrame || win.requestAnimationFrame.bind(win);
  const pressure = {
    container: root.closest(".text-pressure-stage") || root,
    chars: [],
    hasPointer: false,
    resizeTimer: 0,
    pointer: { x: 0, y: 0 },
    smooth: { x: 0, y: 0 }
  };

  const text = root.dataset.text || "UkuleleBook";
  root.innerHTML = text
    .split("")
    .map((char) => `<span data-char="${char}">${char}</span>`)
    .join("");
  pressure.chars = [...root.querySelectorAll("span")];

  const setSize = () => {
    const rect = pressure.container.getBoundingClientRect();
    const fontSize = Math.max(rect.width / (pressure.chars.length / 2), 24);
    root.style.fontSize = `${fontSize}px`;
    root.style.lineHeight = "1";
    root.style.transform = "scale(1, 1)";
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
    win.clearTimeout(pressure.resizeTimer);
    pressure.resizeTimer = win.setTimeout(() => {
      setSize();
      centerPointer();
    }, 100);
  };
  const pressureValue = (distance, maxDistance, minValue, maxValue) => {
    const value = maxValue - Math.abs((maxValue * distance) / maxDistance);
    return Math.max(minValue, value + minValue);
  };
  const update = () => {
    pressure.smooth.x += (pressure.pointer.x - pressure.smooth.x) / 15;
    pressure.smooth.y += (pressure.pointer.y - pressure.smooth.y) / 15;
    const titleRect = root.getBoundingClientRect();
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

    frame(update);
  };

  setSize();
  centerPointer();
  win.addEventListener("resize", debouncedSetSize);
  win.addEventListener("scroll", centerPointer, { passive: true });
  win.addEventListener("mousemove", (event) => setPointer(event.clientX, event.clientY));
  win.addEventListener(
    "touchmove",
    (event) => {
      const touch = event.touches[0];
      if (!touch) return;
      setPointer(touch.clientX, touch.clientY);
    },
    { passive: true }
  );

  root.dataset.textPressureMounted = "true";
  frame(update);
}
