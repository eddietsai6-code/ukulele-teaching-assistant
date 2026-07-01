import {
  calculateTapTempo,
  clampTempo,
  createDefaultState,
  createSchedule,
  getAudibleEventLevel,
  getScheduleEndTime,
} from "./professional-metronome-core.js";

const GLOBAL_KEY = "__UKEBOOK_LESSON_METRONOME__";
const SCHEDULE_BARS = 4;
const LOOKAHEAD_SECONDS = 0.14;
const SCHEDULER_INTERVAL_MS = 25;
const START_DELAY_SECONDS = 0.07;
const HIGH_OUTPUT_GAIN = 5.5;
const MASTER_OUTPUT_GAIN = 1.6;
const CLICK_GAIN_LIMIT = 3.2;
const CLICK_DECAY_SECONDS = 0.11;
const BEAT_LEVEL_SEQUENCE = ["normal", "accent", "secondary", "rest"];
const BEAT_LEVEL_LABELS = {
  normal: "普通",
  accent: "重拍",
  secondary: "次重",
  rest: "静音",
};

function createLessonMetronome() {
  const controller = {
    host: null,
    audioContext: null,
    masterGain: null,
    playing: false,
    activeBeatIndex: -1,
    schedule: [],
    scheduledIndex: 0,
    scheduledNodes: new Set(),
    schedulerTimer: null,
    rafId: null,
    nextScheduleTime: 0,
    nextBarIndex: 0,
    tapTimes: [],
    status: "READY",
    state: createDefaultState({
      tempo: 88,
      meter: { beatsPerBar: 4, beatUnit: 4 },
      subdivision: "none",
      volume: 1,
      muted: false,
      soundStyle: "stick",
      countInBars: 0,
    }),
  };

  const getAudioContext = () => {
    if (!controller.audioContext) {
      const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextConstructor) {
        controller.status = "当前浏览器不支持 Web Audio";
        render();
        return null;
      }
      controller.audioContext = new AudioContextConstructor();
      controller.masterGain = controller.audioContext.createGain();
      controller.masterGain.gain.value = MASTER_OUTPUT_GAIN;
      controller.masterGain.connect(controller.audioContext.destination);
    }
    return controller.audioContext;
  };

  const setStatus = (status) => {
    controller.status = status;
    render();
  };

  const normalizeState = (patch = {}) => {
    controller.state = createDefaultState({
      ...controller.state,
      ...patch,
      meter: {
        ...controller.state.meter,
        ...(patch.meter || {}),
      },
    });
    if (controller.playing) refreshPlaybackSchedule();
    render();
  };

  const getClickProfile = (level) => {
    const profiles = {
      accent: [2040, 0.7],
      secondary: [1520, 0.56],
      normal: [1120, 0.46],
      subdivision: [760, 0.3],
      polyrhythm: [520, 0.3],
    };
    return profiles[level] || profiles.normal;
  };

  const scheduleToneClick = (event, level, context) => {
    if (!controller.masterGain) return;
    const [frequency, gainValue] = getClickProfile(level);
    const clickGain = Math.max(
      0.0001,
      Math.min(CLICK_GAIN_LIMIT, gainValue * controller.state.volume * HIGH_OUTPUT_GAIN)
    );
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const snap = context.createBiquadFilter();

    oscillator.frequency.setValueAtTime(frequency, event.time);
    oscillator.type = "square";
    snap.type = "highpass";
    snap.frequency.setValueAtTime(360, event.time);
    gain.gain.setValueAtTime(0.0001, event.time);
    gain.gain.exponentialRampToValueAtTime(clickGain, event.time + 0.003);
    gain.gain.exponentialRampToValueAtTime(0.0001, event.time + CLICK_DECAY_SECONDS);

    oscillator.connect(snap);
    snap.connect(gain);
    gain.connect(controller.masterGain);

    const scheduledNode = { oscillator, gain, snap };
    controller.scheduledNodes.add(scheduledNode);
    oscillator.onended = () => {
      oscillator.disconnect();
      snap.disconnect();
      gain.disconnect();
      controller.scheduledNodes.delete(scheduledNode);
    };
    oscillator.start(event.time);
    oscillator.stop(event.time + CLICK_DECAY_SECONDS + 0.02);
  };

  const scheduleClick = (event) => {
    const context = getAudioContext();
    if (!context) return;
    const level = getAudibleEventLevel(event, controller.state.muted);
    if (level === "silent") return;
    scheduleToneClick(event, level, context);
  };

  const cancelScheduledNodes = () => {
    for (const node of controller.scheduledNodes) {
      try {
        node.oscillator?.stop();
      } catch {
        // A scheduled click may already have ended.
      }
      node.oscillator?.disconnect();
      node.snap?.disconnect();
      node.gain?.disconnect();
    }
    controller.scheduledNodes.clear();
  };

  const rebuildSchedule = () => {
    const context = getAudioContext();
    if (!context) return;
    controller.schedule = createSchedule({
      state: createDefaultState({ ...controller.state, countInBars: 0 }),
      bars: SCHEDULE_BARS,
      startTime: context.currentTime + START_DELAY_SECONDS,
    });
    controller.scheduledIndex = 0;
    controller.nextScheduleTime = getScheduleEndTime(
      controller.schedule,
      context.currentTime + START_DELAY_SECONDS
    );
    controller.nextBarIndex = SCHEDULE_BARS;
  };

  const appendScheduleWindow = () => {
    const appendedEvents = createSchedule({
      state: createDefaultState({ ...controller.state, countInBars: 0 }),
      bars: SCHEDULE_BARS,
      startTime: controller.nextScheduleTime,
      barOffset: controller.nextBarIndex,
    });
    controller.schedule = [...controller.schedule, ...appendedEvents];
    controller.nextScheduleTime = getScheduleEndTime(
      appendedEvents,
      controller.nextScheduleTime
    );
    controller.nextBarIndex += SCHEDULE_BARS;
  };

  function refreshPlaybackSchedule() {
    if (!controller.playing) return;
    cancelScheduledNodes();
    rebuildSchedule();
  }

  function schedulerTick() {
    if (!controller.playing || !controller.audioContext) return;
    const throughTime = controller.audioContext.currentTime + LOOKAHEAD_SECONDS;
    while (
      controller.scheduledIndex < controller.schedule.length &&
      controller.schedule[controller.scheduledIndex].time <= throughTime
    ) {
      scheduleClick(controller.schedule[controller.scheduledIndex]);
      controller.scheduledIndex += 1;
    }
    if (controller.schedule.length - controller.scheduledIndex <= 16) {
      appendScheduleWindow();
    }
    controller.schedulerTimer = window.setTimeout(schedulerTick, SCHEDULER_INTERVAL_MS);
  }

  function visualTick() {
    if (!controller.playing || !controller.audioContext) return;
    const now = controller.audioContext.currentTime;
    let current = null;
    for (let index = controller.schedule.length - 1; index >= 0; index -= 1) {
      const event = controller.schedule[index];
      if (event.time <= now && event.kind === "main") {
        current = event;
        break;
      }
    }
    const nextBeatIndex = current?.beatIndex ?? -1;
    if (nextBeatIndex !== controller.activeBeatIndex) {
      controller.activeBeatIndex = nextBeatIndex;
      render();
    }
    controller.rafId = window.requestAnimationFrame(visualTick);
  }

  const start = async () => {
    const context = getAudioContext();
    if (!context) return;
    controller.playing = true;
    setStatus("STARTING");
    const resumePromise = context.resume();
    rebuildSchedule();
    schedulerTick();
    visualTick();
    setStatus(`${controller.state.tempo} BPM · 正在播放`);
    try {
      await resumePromise;
    } catch {
      controller.playing = false;
      window.clearTimeout(controller.schedulerTimer);
      window.cancelAnimationFrame(controller.rafId);
      controller.schedulerTimer = null;
      controller.rafId = null;
      cancelScheduledNodes();
      setStatus("浏览器阻止了音频启动");
      return;
    }
  };

  const stop = () => {
    controller.playing = false;
    controller.activeBeatIndex = -1;
    window.clearTimeout(controller.schedulerTimer);
    window.cancelAnimationFrame(controller.rafId);
    controller.schedulerTimer = null;
    controller.rafId = null;
    controller.schedule = [];
    controller.scheduledIndex = 0;
    controller.nextScheduleTime = 0;
    controller.nextBarIndex = 0;
    cancelScheduledNodes();
    setStatus("STOPPED");
  };

  const toggle = () => {
    if (controller.playing) {
      stop();
      return;
    }
    start();
  };

  const handleTapTempo = () => {
    const now = performance.now();
    controller.tapTimes = [...controller.tapTimes, now].slice(-6);
    const tempo = calculateTapTempo(controller.tapTimes);
    if (!tempo) {
      setStatus("再点一次 Tap");
      return;
    }
    normalizeState({ tempo });
    setStatus(`Tap tempo ${tempo} BPM`);
  };

  const getBeatLevel = (index) => {
    return controller.state.meter.beats?.[index]?.level || (index === 0 ? "accent" : "normal");
  };

  const getNextBeatLevel = (level) => {
    const currentIndex = BEAT_LEVEL_SEQUENCE.indexOf(level);
    return BEAT_LEVEL_SEQUENCE[(currentIndex + 1) % BEAT_LEVEL_SEQUENCE.length];
  };

  const toggleBeatLevel = (index) => {
    const beatIndex = Number(index);
    if (!Number.isInteger(beatIndex) || beatIndex < 0 || beatIndex >= controller.state.meter.beatsPerBar) {
      return;
    }
    const beats = Array.from({ length: controller.state.meter.beatsPerBar }, (_, itemIndex) => {
      const beat = controller.state.meter.beats?.[itemIndex] || {
        index: itemIndex,
        level: itemIndex === 0 ? "accent" : "normal",
        rhythm: "inherit",
      };
      if (itemIndex !== beatIndex) {
        return { ...beat, index: itemIndex };
      }
      const nextLevel = getNextBeatLevel(getBeatLevel(itemIndex));
      return { ...beat, index: itemIndex, level: nextLevel };
    });
    const nextLevel = beats[beatIndex].level;
    normalizeState({
      meter: {
        ...controller.state.meter,
        beats,
      },
    });
    setStatus(`第 ${beatIndex + 1} 拍：${BEAT_LEVEL_LABELS[nextLevel]}`);
  };

  const beatDots = () => {
    const beats = controller.state.meter.beats;
    return beats.map((beat, index) => {
      const level = beat.level || getBeatLevel(index);
      const active = controller.playing && controller.activeBeatIndex === index;
      const label = BEAT_LEVEL_LABELS[level] || BEAT_LEVEL_LABELS.normal;
      return `
        <button
          type="button"
          class="${active ? "is-active" : ""}"
          data-metronome-beat="${index}"
          data-level="${level}"
          aria-pressed="${level !== "normal" ? "true" : "false"}"
          aria-label="第 ${index + 1} 拍，${label}，点击切换"
        >
          <span>${index + 1}</span>
          <small>${label}</small>
        </button>
      `;
    }).join("");
  };

  const render = () => {
    const host = controller.host;
    if (!host || !host.isConnected) return;
    const { tempo, muted, volume, subdivision, meter } = controller.state;
    const volumePercent = Math.round(volume * 100);
    host.innerHTML = `
      <section class="lesson-metronome" data-metronome-root>
        <div class="lesson-metronome-display">
          <div>
            <span>全局节拍器</span>
            <strong>${tempo}</strong>
            <small>BPM · ${meter.beatsPerBar}/${meter.beatUnit}</small>
          </div>
          <div class="lesson-metronome-status">${controller.status}</div>
          <div class="lesson-metronome-beats" aria-label="beat visual">${beatDots()}</div>
        </div>
        <div class="lesson-metronome-controls">
          <button type="button" class="lesson-metronome-play" data-metronome-play>
            ${controller.playing ? "停止" : "开始"}
          </button>
          <button type="button" data-metronome-tap>Tap</button>
          <button type="button" data-metronome-mute aria-pressed="${muted ? "true" : "false"}">
            ${muted ? "取消静音" : "静音"}
          </button>
        </div>
        <div class="lesson-metronome-grid">
          <label>
            <span>速度</span>
            <input data-metronome-tempo type="number" min="30" max="280" step="1" value="${tempo}" inputmode="numeric">
          </label>
          <label>
            <span>拍号</span>
            <select data-metronome-beats>
              ${[2, 3, 4, 5, 6, 7, 8].map((value) => `<option value="${value}" ${value === meter.beatsPerBar ? "selected" : ""}>${value}/4</option>`).join("")}
            </select>
          </label>
          <label>
            <span>细分</span>
            <select data-metronome-subdivision>
              <option value="none" ${subdivision === "none" ? "selected" : ""}>四分音符</option>
              <option value="eighth" ${subdivision === "eighth" ? "selected" : ""}>八分音符</option>
              <option value="triplet" ${subdivision === "triplet" ? "selected" : ""}>三连音</option>
              <option value="sixteenth" ${subdivision === "sixteenth" ? "selected" : ""}>十六分音符</option>
            </select>
          </label>
          <label class="lesson-metronome-volume">
            <span>音量 ${volumePercent}%</span>
            <input data-metronome-volume type="range" min="0.4" max="1" step="0.01" value="${volume}">
          </label>
        </div>
        <p class="lesson-metronome-note">节拍器是全局播放状态：切到谱面、教学或其他歌曲详情 tab 时，声音不会中断。</p>
      </section>
    `;
    bindHost(host);
  };

  const bindHost = (host) => {
    host.querySelector("[data-metronome-play]")?.addEventListener("click", toggle);
    host.querySelectorAll("[data-metronome-beat]").forEach((button) => {
      button.addEventListener("click", () => {
        toggleBeatLevel(Number(button.dataset.metronomeBeat));
      });
    });
    host.querySelector("[data-metronome-tap]")?.addEventListener("click", handleTapTempo);
    host.querySelector("[data-metronome-mute]")?.addEventListener("click", () => {
      normalizeState({ muted: !controller.state.muted });
      setStatus(controller.state.muted ? "MUTED" : `${controller.state.tempo} BPM`);
    });
    host.querySelector("[data-metronome-tempo]")?.addEventListener("change", (event) => {
      normalizeState({ tempo: clampTempo(event.target.value) });
      setStatus(`${controller.state.tempo} BPM`);
    });
    host.querySelector("[data-metronome-beats]")?.addEventListener("change", (event) => {
      normalizeState({ meter: { beatsPerBar: Number(event.target.value), beatUnit: 4 } });
      setStatus(`${controller.state.meter.beatsPerBar}/4`);
    });
    host.querySelector("[data-metronome-subdivision]")?.addEventListener("change", (event) => {
      normalizeState({ subdivision: event.target.value });
      setStatus("细分已更新");
    });
    host.querySelector("[data-metronome-volume]")?.addEventListener("input", (event) => {
      controller.state = createDefaultState({
        ...controller.state,
        volume: Number(event.target.value),
      });
      if (controller.masterGain) controller.masterGain.gain.value = MASTER_OUTPUT_GAIN;
      const label = host.querySelector(".lesson-metronome-volume span");
      if (label) label.textContent = `音量 ${Math.round(controller.state.volume * 100)}%`;
    });
  };

  return {
    mount(host) {
      controller.host = host;
      render();
    },
    isPlaying() {
      return controller.playing;
    },
    stop,
    getState() {
      return controller.state;
    },
  };
}

window.UkeBookMetronome = window[GLOBAL_KEY] || createLessonMetronome();
window[GLOBAL_KEY] = window.UkeBookMetronome;

document.addEventListener("DOMContentLoaded", () => {
  const host = document.querySelector("[data-metronome-host]");
  if (host) window.UkeBookMetronome.mount(host);
});
