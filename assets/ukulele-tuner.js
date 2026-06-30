import {
  centsToNeedleDegrees,
  detectPitchAutoCorrelate,
  findClosestInstrumentTarget,
  getRms,
  getTuningHint,
  isTuned,
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
const tuningHint = document.querySelector("#ukuleleTuningHint");

let audioContext = null;
let analyser = null;
let stream = null;
let animationFrame = null;
let timeBuffer = null;
let lastFrequency = null;
let lastDetectedAt = 0;
const activeMode = "ukulele";
const tuningA4 = 440;

function buildScale() {
  if (!scale) return;

  for (let cents = -50; cents <= 50; cents += 5) {
    const tick = document.createElement("span");
    tick.className = "uke-tuner-tick";
    if (cents % 10 === 0) tick.classList.add("major");
    if (cents === 0) tick.classList.add("center");
    tick.style.setProperty("--angle", `${centsToNeedleDegrees(cents)}deg`);
    scale.appendChild(tick);
  }
}

function formatFrequency(value) {
  return Number.isFinite(value) ? value.toFixed(1) : "--";
}

function setStatus(text, isError = false) {
  statusText.textContent = text;
  statusText.classList.toggle("error", isError);
}

function setNeedle(cents) {
  const safeCents = Number.isFinite(cents) ? cents : 0;
  const degrees = centsToNeedleDegrees(safeCents);
  needle.style.setProperty("--needle-deg", `${degrees}deg`);
  vuMeter.setAttribute("aria-valuenow", String(Math.max(-50, Math.min(50, safeCents))));
}

function setTunedState(tuned) {
  app.classList.toggle("is-tuned", tuned);
}

function getTuningResult(frequency) {
  return findClosestInstrumentTarget(frequency, activeMode, tuningA4);
}

function updateReadout(result) {
  if (!result) {
    setTunedState(false);
    setNeedle(0);
    meterFrequency.textContent = "--";
    meterCentsValue.textContent = "0";
    noteName.textContent = "--";
    noteOctave.textContent = "";
    targetValue.textContent = "";
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
  targetValue.textContent = result.display;

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
  levelFill.style.width = `${Math.round(level * 100)}%`;
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

  startButton.disabled = true;
  setStatus("STARTING");

  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioContextClass();
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
  levelFill.style.width = "0%";
  startButton.textContent = "START";
  startButton.disabled = false;
  updateReadout(null);
  setStatus("READY");
}

if (app && startButton) {
  startButton.addEventListener("click", () => {
    if (audioContext) {
      stop();
      return;
    }
    start();
  });

  buildScale();
  tuningHint.textContent = getTuningHint(activeMode);
  updateReadout(null);
  setStatus("READY");
}
