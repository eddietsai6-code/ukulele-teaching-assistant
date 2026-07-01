import {
  centsFromFrequency,
  centsToNeedleDegrees,
  detectPitchAutoCorrelate,
  frequencyToNote,
  getRms,
  isTuned,
  noteNumberToFrequency,
} from "./tuner-core.js";

const app = document.querySelector("#ukuleleTuner");
const startButton = document.querySelector("#startTunerButton");
const needle = document.querySelector("#tunerNeedle");
const vuMeter = document.querySelector("#ukuleleVuMeter");
const scale = document.querySelector("#tunerScale");
const meterFrequency = document.querySelector("#tunerFrequency");
const meterCentsValue = document.querySelector("#tunerCentsValue");
const noteName = document.querySelector("#tunerNoteName");
const noteOctave = document.querySelector("#tunerNoteOctave");
const targetValue = document.querySelector("#tunerTargetValue");
const statusText = document.querySelector("#tunerStatusText");
const levelFill = document.querySelector("#tunerLevelFill");
const twelveTetModeButton = document.querySelector("#twelveTetModeButton");
const stringButtons = [...document.querySelectorAll("[data-string-midi]")];

let audioContext = null;
let analyser = null;
let stream = null;
let animationFrame = null;
let timeBuffer = null;
let lastFrequency = null;
let lastDetectedAt = 0;
let selectedTarget = null;
let tuningMode = "fixed";
const tuningA4 = 440;
const defaultTarget = {
  string: "4",
  name: "G",
  octave: 4,
  midi: 67,
  label: "4 · G4",
  target: "G4",
};

function buildScale() {
  if (!scale) return;
  scale.textContent = "";

  for (let cents = -50; cents <= 50; cents += 10) {
    const tick = document.createElement("span");
    tick.className = "uke-tuner-tick";
    if (cents % 20 === 0) tick.classList.add("major");
    if (cents === 0) tick.classList.add("center");
    tick.style.setProperty("--angle", `${centsToNeedleDegrees(cents)}deg`);
    scale.appendChild(tick);
  }
}

function formatFrequency(value) {
  return Number.isFinite(value) ? value.toFixed(1) : "--";
}

function setStatus(text, isError = false) {
  if (!statusText) return;
  statusText.textContent = text;
  statusText.classList.toggle("error", isError);
}

function setNeedle(cents) {
  const safeCents = Number.isFinite(cents) ? cents : 0;
  const degrees = centsToNeedleDegrees(safeCents);
  needle.style.setProperty("--needle-deg", `${degrees}deg`);
  vuMeter?.setAttribute("aria-valuenow", String(Math.max(-50, Math.min(50, safeCents))));
}

function setTunedState(tuned) {
  app.classList.toggle("is-tuned", tuned);
}

function targetFromButton(button) {
  if (!button) return null;

  const midi = Number(button.dataset.stringMidi);
  if (!Number.isFinite(midi)) return null;

  return {
    string: button.dataset.stringLabel?.split(" · ")[0] || "",
    name: button.dataset.stringName || button.dataset.stringTarget?.replace(/\d+$/, "") || "",
    octave: Number(button.dataset.stringOctave || 4),
    midi,
    label: button.dataset.stringLabel || button.textContent.trim(),
    target: button.dataset.stringTarget || "",
  };
}

function getActiveTarget() {
  if (selectedTarget) return selectedTarget;

  const activeButton = stringButtons.find((button) => button.classList.contains("is-active"));
  selectedTarget = targetFromButton(activeButton) || defaultTarget;
  return selectedTarget;
}

function setTwelveTetButton(active) {
  twelveTetModeButton?.classList.toggle("is-active", active);
  twelveTetModeButton?.setAttribute("aria-pressed", active ? "true" : "false");
}

function setFixedTarget(button) {
  const nextTarget = targetFromButton(button);
  if (!nextTarget) return;

  tuningMode = "fixed";
  selectedTarget = nextTarget;
  setTwelveTetButton(false);
  stringButtons.forEach((item) => {
    const active = item === button;
    item.classList.toggle("is-active", active);
    item.setAttribute("aria-pressed", active ? "true" : "false");
  });

  updateReadout(lastFrequency ? getTuningResult(lastFrequency) : null);
  if (audioContext && !lastFrequency) {
    setStatus("LISTENING");
  }
}

function setTwelveTetMode() {
  getActiveTarget();
  tuningMode = "chromatic";
  stringButtons.forEach((item) => {
    item.classList.remove("is-active");
    item.setAttribute("aria-pressed", "false");
  });
  setTwelveTetButton(true);

  updateReadout(lastFrequency ? getTuningResult(lastFrequency) : null);
  if (audioContext && !lastFrequency) {
    setStatus("LISTENING");
  }
}

function getTuningResult(frequency) {
  if (tuningMode === "chromatic") {
    const note = frequencyToNote(frequency, tuningA4);
    if (!note) return null;

    return {
      ...note,
      display: `${note.name}${note.octave}`,
      mode: "chromatic",
    };
  }

  const target = getActiveTarget();
  const targetFrequency = noteNumberToFrequency(target.midi, tuningA4);

  return {
    ...target,
    frequency,
    targetFrequency,
    cents: centsFromFrequency(frequency, target.midi, tuningA4),
    display: target.label,
  };
}

function updateReadout(result) {
  const target = result || getActiveTarget();

  if (!result) {
    setTunedState(false);
    setNeedle(0);
    meterFrequency.textContent = "--";
    meterCentsValue.textContent = "0";
    if (tuningMode === "chromatic") {
      noteName.textContent = "--";
      noteOctave.textContent = "";
      targetValue.textContent = "12-TET / ANY NOTE";
    } else {
      noteName.textContent = target.name;
      noteOctave.textContent = target.octave;
      targetValue.textContent = `TARGET ${target.label}`;
    }
    return;
  }

  const tuned = isTuned(result.cents);
  const centsPrefix = result.cents > 0 ? "+" : "";

  setTunedState(tuned);
  setNeedle(result.cents);
  meterFrequency.textContent = formatFrequency(result.frequency);
  meterCentsValue.textContent = `${centsPrefix}${result.cents}`;
  noteName.textContent = result.name;
  noteOctave.textContent = result.octave;
  targetValue.textContent = result.mode === "chromatic" ? "12-TET" : result.display;

  if (tuned) {
    setStatus("TUNED");
  } else if (result.cents < 0) {
    setStatus("FLAT");
  } else {
    setStatus("SHARP");
  }
}

function updateLevel(buffer) {
  const level = Math.min(1, getRms(buffer) * 8);
  if (levelFill) {
    levelFill.style.width = `${Math.round(level * 100)}%`;
  }
}

function tick() {
  if (!analyser || !audioContext || !timeBuffer) return;

  analyser.getFloatTimeDomainData(timeBuffer);
  updateLevel(timeBuffer);

  const detected = detectPitchAutoCorrelate(timeBuffer, audioContext.sampleRate, {
    minFrequency: 40,
    maxFrequency: 5000,
    rmsThreshold: 0.0035,
    correlationThreshold: 0.68,
  });

  if (detected) {
    lastFrequency = detected;
    lastDetectedAt = performance.now();
    updateReadout(getTuningResult(detected));
  } else if (lastFrequency && performance.now() - lastDetectedAt > 650) {
    lastFrequency = null;
    updateReadout(null);
    setStatus("LISTENING");
  } else if (!lastFrequency) {
    updateReadout(null);
    setStatus("LISTENING");
  }

  animationFrame = window.requestAnimationFrame(tick);
}

async function start() {
  if (!navigator.mediaDevices?.getUserMedia) {
    setStatus("MIC API UNAVAILABLE", true);
    return;
  }

  if (!window.isSecureContext && !["localhost", "127.0.0.1"].includes(window.location.hostname)) {
    setStatus("HTTPS REQUIRED", true);
    return;
  }

  startButton.disabled = true;
  setStatus("STARTING");

  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioContextClass();
    if (audioContext.state === "suspended") {
      await audioContext.resume();
    }

    analyser = audioContext.createAnalyser();
    analyser.fftSize = 8192;
    analyser.smoothingTimeConstant = 0.12;
    timeBuffer = new Float32Array(analyser.fftSize);

    stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
      },
    });

    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);
    if (audioContext.state === "suspended") {
      await audioContext.resume();
    }

    startButton.textContent = "STOP";
    startButton.disabled = false;
    lastFrequency = null;
    lastDetectedAt = 0;
    setStatus("LISTENING");
    animationFrame = window.requestAnimationFrame(tick);
  } catch (error) {
    stop();
    startButton.disabled = false;
    setStatus(error?.name === "NotAllowedError" ? "MIC DENIED" : "MIC ERROR", true);
  }
}

function stop() {
  if (animationFrame) {
    window.cancelAnimationFrame(animationFrame);
    animationFrame = null;
  }

  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
    stream = null;
  }

  if (audioContext) {
    audioContext.close();
    audioContext = null;
  }

  analyser = null;
  timeBuffer = null;
  lastFrequency = null;
  lastDetectedAt = 0;
  if (levelFill) {
    levelFill.style.width = "0%";
  }
  startButton.textContent = "START";
  startButton.disabled = false;
  updateReadout(null);
  setStatus("READY");
}

if (app && startButton) {
  stringButtons.forEach((button) => {
    button.addEventListener("click", () => setFixedTarget(button));
  });

  twelveTetModeButton?.addEventListener("click", setTwelveTetMode);

  startButton.addEventListener("click", () => {
    if (audioContext) {
      stop();
      return;
    }
    start();
  });

  buildScale();
  getActiveTarget();
  updateReadout(null);
  setStatus("READY");
}
