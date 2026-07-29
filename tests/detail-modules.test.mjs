import assert from "node:assert/strict";
import test from "node:test";

import { renderAudioPane } from "../assets/app/detail/audio-pane.js";
import { renderDetailShell } from "../assets/app/detail/detail-shell.js";
import { applyDetailTab } from "../assets/app/detail/detail-tabs.js";
import { renderLessonPane } from "../assets/app/detail/lesson-pane.js";
import { renderMetronomePane } from "../assets/app/detail/metronome-pane.js";
import { renderScorePane } from "../assets/app/detail/score-pane.js";

const song = {
  id: "song-a",
  title: "Song A",
  artist: "Artist",
  source: "Local",
  category: "Song",
  style: "Fingerstyle",
  techniques: ["Arpeggio"],
  audio: [
    { title: "Song A - Full", src: "./audio/full.mp3" },
    { title: "Song A - Backing", src: "./audio/backing.mp3" }
  ],
  scoreImages: [
    { title: "Page 1", src: "./scores/01.png" },
    { title: "Page 2", src: "./scores/02.png" }
  ],
  teaching: {
    goal: "Goal",
    focus: "Focus",
    practiceOrder: ["Tune", "Play"],
    commonIssues: ["Issue"],
    passStandard: "Standard"
  }
};

const level = {
  label: "Grade 2",
  core: "Core",
  boundary: "Boundary"
};

test("detail shell renders stable pane hosts for every tab", () => {
  const html = renderDetailShell({
    activeTab: "score",
    audioHtml: "AUDIO",
    lessonHtml: "LESSON",
    scoreHtml: "SCORE",
    metronomeHtml: renderMetronomePane()
  });

  for (const pane of ["audio", "lesson", "score", "metronome"]) {
    assert.ok(html.includes(`data-detail-pane="${pane}"`), `missing stable pane host for ${pane}`);
  }
  assert.ok(html.includes('data-metronome-host'), "metronome host should be rendered inside its own stable pane");
  assert.match(html, /data-detail-pane="score"[^>]*>SCORE/, "active score pane should render its content");
  assert.match(html, /data-detail-pane="audio"[^>]*hidden/, "inactive audio pane should be hidden, not omitted");
});

test("detail tab switching only toggles state and leaves pane content untouched", () => {
  const buttons = [
    makeTabButton("lesson"),
    makeTabButton("score"),
    makeTabButton("metronome")
  ];
  const panes = [
    makePane("lesson"),
    makePane("score"),
    makePane("metronome")
  ];
  const metronomeHost = { id: "metronome-host" };
  panes[2].querySelector = (selector) => (selector === "[data-metronome-host]" ? metronomeHost : null);
  const root = {
    querySelectorAll(selector) {
      if (selector === "[data-tab]") return buttons;
      if (selector === "[data-detail-pane]") return panes;
      return [];
    }
  };

  applyDetailTab(root, "score");

  assert.equal(buttons[1].active, true);
  assert.equal(panes[0].hidden, true);
  assert.equal(panes[1].hidden, false);
  assert.equal(panes[2].hidden, true);
  assert.equal(panes[2].querySelector("[data-metronome-host]"), metronomeHost);
});

test("audio pane keeps fixed song audio, speed options, and version buttons", () => {
  const html = renderAudioPane({ song, audioVersionBySong: { "song-a": 1 } });

  assert.ok(html.includes("<audio-speed-player"));
  assert.ok(html.includes('src="./audio/backing.mp3"'));
  assert.ok(html.includes('engine="rubberband"'));
  assert.ok(html.includes('rate-presets="0.75,0.85,1,1.25,1.5"'));
  assert.ok(html.includes("no-upload"));
  assert.ok(html.includes('data-audio-version="0"'));
  assert.ok(html.includes('data-audio-version="1"'));
  assert.match(html, /audio-version-button[^>]*is-active/);
});

test("score pane renders score images in input order", () => {
  const html = renderScorePane({ song });

  assert.ok(html.indexOf("./scores/01.png") < html.indexOf("./scores/02.png"));
  assert.ok(html.includes('loading="eager"'));
  assert.ok(html.includes('class="score-card score-sheet"'));
});

test("lesson pane does not require score or audio data", () => {
  const html = renderLessonPane({ song: { ...song, audio: [], scoreImages: [] }, level });

  assert.ok(html.includes("Tune"));
  assert.ok(html.includes("Goal"));
  assert.ok(html.includes("Grade 2"));
});

function makeTabButton(tab) {
  const button = {
    dataset: { tab },
    active: false,
    ariaSelected: "",
    classList: {
      toggle(name, value) {
        if (name === "is-active") this.owner.active = value;
      },
      owner: null
    },
    setAttribute(name, value) {
      if (name === "aria-selected") this.ariaSelected = value;
    }
  };
  button.classList.owner = button;
  return button;
}

function makePane(detailPane) {
  const pane = {
    dataset: { detailPane },
    hidden: false,
    querySelector: () => null
  };
  Object.defineProperty(pane, "innerHTML", {
    set() {
      throw new Error("tab switching must not replace pane markup");
    }
  });
  return pane;
}
