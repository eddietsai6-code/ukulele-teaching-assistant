import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('site uses the UkuleleBook framework as the published homepage', () => {
  const html = read('index.html');

  for (const expected of [
    'UkuleleBook',
    '尤克里里教学助手',
    'class="hero"',
    'id="heroPressure"',
    'id="heroLanyard"',
    'id="levelBoard"',
    'id="songDetail"',
    './assets/styles.css',
    './assets/data.js',
    './assets/app.js',
  ]) {
    assert.ok(html.includes(expected), `missing framework token: ${expected}`);
  }

  for (const expected of [
    '零基础入门',
    '弹唱提高',
    '中级进阶',
    '高阶指弹',
    '四个阶段',
    '0-8 级共 9 个等级',
  ]) {
    assert.ok(html.includes(expected), `missing hero stage copy: ${expected}`);
  }

  assert.equal(html.includes('not just'), false);
  assert.equal(html.includes('难度 1-2'), false);
});

test('homepage embeds the ukulele-only tuner UI without other instrument choices', () => {
  const html = read('index.html');

  for (const expected of [
    'id="ukuleleTuner"',
    'Eddie Ukulele',
    'id="startTunerButton"',
    'id="tunerNoteName"',
    'id="tunerNeedle"',
    'id="twelveTetModeButton"',
    'data-tuning-mode="chromatic"',
    'Any 12-TET note',
    'data-string-target="G4"',
    'data-string-target="C4"',
    'data-string-target="E4"',
    'data-string-target="A4"',
    'type="module" src="./assets/ukulele-tuner.js',
  ]) {
    assert.ok(html.includes(expected), `missing tuner UI token: ${expected}`);
  }

  assert.match(
    html,
    /id="heroNotebook"[\s\S]*id="ukuleleTuner"[\s\S]*<\/article>[\s\S]*<\/div>/,
    'tuner should live inside the floating hero notebook position'
  );
  assert.match(
    html,
    /id="twelveTetModeButton"[\s\S]*id="startTunerButton"[\s\S]*id="tunerStatusText"/,
    '12-TET option should sit in the old START area, with START moved lower'
  );
  assert.match(
    html,
    /class="uke-note-line"[\s\S]*id="tunerFrequency"[\s\S]*id="tunerTargetValue"/,
    'frequency Hz readout should live in the note readout area'
  );
  assert.equal(html.includes('class="uke-meter-frequency"'), false);
  assert.equal(html.includes('id="ukuleleTuningHint"'), false);
  assert.equal(html.includes('4=G4 3=C4 2=E4 1=A4'), false);
  assert.equal(html.includes('sticker-bolt'), false);
  assert.equal(html.includes('C F G'), false);
  assert.equal(html.includes('data-mode="guitar"'), false);
  assert.equal(html.includes('Guitar'), false);
});

test('homepage does not show the hero statistic capsule row', () => {
  const html = read('index.html');
  const app = read('assets/app.js');

  assert.equal(html.includes('id="heroStats"'), false);
  assert.equal(html.includes('aria-label="模板统计"'), false);
  assert.equal(app.includes('renderHeroStats'), false);
  assert.equal(app.includes('heroStats'), false);
});

test('ukulele tuner assets keep microphone tuning behavior', () => {
  const js = read('assets/ukulele-tuner.js');
  const core = read('assets/tuner-core.js');
  const css = read('assets/styles.css');

  for (const expected of [
    'navigator.mediaDevices?.getUserMedia',
    'AudioContext',
    'audioContext.resume',
    'createAnalyser',
    'detectPitchAutoCorrelate',
    'frequencyToNote',
    'getActiveTarget',
    'tuningMode',
    'setTwelveTetMode',
    'setFixedTarget',
    'centsFromFrequency',
    'noteNumberToFrequency',
    'aria-pressed',
    'data-string-midi',
    'requestAnimationFrame',
  ]) {
    assert.ok(js.includes(expected), `missing tuner behavior: ${expected}`);
  }

  assert.ok(core.includes('ukulele'), 'core should keep ukulele mode');
  assert.ok(css.includes('.hero-tuner-panel'), 'stylesheet should include hero tuner placement styles');
});

test('lesson detail embeds a persistent professional metronome tab', () => {
  const html = read('index.html');
  const app = read('assets/app.js');
  const metronome = read('assets/lesson-metronome.js');
  const core = read('assets/professional-metronome-core.js');
  const css = read('assets/styles.css');

  assert.ok(html.includes('assets/lesson-metronome.js'), 'homepage should load the metronome module');
  assert.ok(app.includes('data-tab="metronome"'), 'detail tabs should include the metronome tab');
  assert.ok(app.includes('data-metronome-host'), 'detail pane should expose a metronome mount point');
  assert.ok(app.includes('window.UkeBookMetronome?.mount'), 'app shell should mount the persistent metronome controller');
  assert.equal(app.includes('data-tab="evidence">依据'), false, 'old evidence tab should be replaced');

  for (const expected of [
    '__UKEBOOK_LESSON_METRONOME__',
    'AudioContext',
    'createSchedule',
    'getScheduleEndTime',
    'HIGH_OUTPUT_GAIN',
    'MASTER_OUTPUT_GAIN',
    'CLICK_GAIN_LIMIT',
    'CLICK_DECAY_SECONDS',
    'volume: 1',
    'data-metronome-play',
    'data-metronome-beat',
    'data-metronome-volume',
    'toggleBeatLevel',
    'getNextBeatLevel',
  ]) {
    assert.ok(metronome.includes(expected), `missing metronome behavior token: ${expected}`);
  }
  assert.match(metronome, /const HIGH_OUTPUT_GAIN = 5\.5;/, 'classroom metronome should use boosted click output');
  assert.match(metronome, /const MASTER_OUTPUT_GAIN = 1\.6;/, 'classroom metronome should raise the master output floor');
  assert.match(metronome, /const CLICK_GAIN_LIMIT = 3\.2;/, 'classroom metronome should allow stronger click peaks');
  assert.match(
    metronome,
    /normal[\s\S]*accent[\s\S]*secondary[\s\S]*rest/,
    'beat buttons should cycle through selectable beat levels'
  );

  assert.ok(core.includes('export function createSchedule'), 'professional metronome scheduler core should be imported');
  assert.ok(css.includes('.lesson-metronome'), 'metronome panel should have page-native styling');
  assert.ok(css.includes('.lesson-metronome-beats button'), 'beat selectors should be styled as buttons');
});

test('lesson detail mounts the EddieDrumBook audio speed player shell', () => {
  const html = read('index.html');
  const app = read('assets/app.js');
  const data = read('assets/data.js');
  const css = read('assets/styles.css');

  assert.ok(
    html.includes('https://eddietsai6-code.github.io/audio-speed-player/dist/audio-speed-player-pro.js'),
    'homepage head should load the EddieDrumBook audio speed player module'
  );

  for (const expected of [
    '<audio-speed-player',
    'version-selector',
    'no-upload',
    'engine="rubberband"',
    'min-rate="0.5"',
    'max-rate="1.5"',
    'step="0.05"',
    'data-audio-player-shell',
    'activeAudioVersionIndex(song, slots)',
    'compactAudioVersionTitle(song.title, title, index)',
    '<strong>${escapeHtml(song.title)}</strong>',
    '<em>${escapeHtml(activeSlot.displayTitle)}</em>',
    '<strong>${escapeHtml(slot.displayTitle)}</strong>',
  ]) {
    assert.ok(app.includes(expected), `missing audio player integration token: ${expected}`);
  }

  assert.equal(app.includes('<strong>${escapeHtml(activeSlot.title)}</strong>'), false, 'audio heading should not repeat the full imported audio title');
  assert.equal(app.includes('<em>${escapeHtml(playerLabel)}</em>'), false, 'audio heading should not echo the full player label after the song title');
  assert.equal(data.includes('createPlaceholderAudio(song)'), false, 'song data should not create synthetic audio versions');
  assert.equal(data.includes('assets/audio-placeholders/'), false, 'catalog data should not reference placeholder audio paths');
  assert.equal(app.includes('AUDIO_VERSION_COUNT'), false, 'audio tab should not create fixed placeholder version controls');
  assert.ok(app.includes('if (!slots.length)'), 'audio tab should show an empty state when a song has no audio');
  assert.ok(css.includes('.audio-player-shell'), 'audio speed player should have a native frame in the detail audio area');
});

test('song selection opens the audio tab first when the selected song has audio', () => {
  const app = read('assets/app.js');

  assert.ok(app.includes('function preferredDetailTabForSong'), 'app should centralize the initial detail tab choice');
  assert.match(
    app,
    /return\s+song\s*&&\s*Array\.isArray\(song\.audio\)\s*&&\s*song\.audio\.length\s*\?\s*"audio"\s*:\s*"lesson"/,
    'songs with real audio should default to the audio tab'
  );
  assert.match(
    app,
    /function selectSong\(songId, shouldScroll\)[\s\S]*?state\.detailTab\s*=\s*preferredDetailTabForSong\(songId\)/,
    'selecting a song should not force the lesson tab'
  );
  assert.match(
    app,
    /state\.selectedSongId\s*=\s*filteredSongs\[0\]\s*\?\s*filteredSongs\[0\]\.id\s*:\s*"";[\s\S]*?state\.detailTab\s*=\s*preferredDetailTabForSong\(state\.selectedSongId\)/,
    'filter-driven song changes should also reveal audio when available'
  );
});

test('homepage uses the provided direct PNG logo and keeps editable logo sources', () => {
  const html = read('index.html');
  const svg = read('ukebook_logo.svg');
  const component = read('UkebookLogo.tsx');
  const spec = read('ukebook_logo_codex_spec.md');

  assert.ok(html.includes('src="./assets/brand/ukulele-logo-direct.png"'), 'homepage should use the provided direct PNG logo asset');
  assert.ok(fs.existsSync(path.join(root, 'assets/brand/ukulele-logo-direct.png')), 'provided direct PNG logo should exist in project assets');
  assert.ok(html.includes('height="1536"'), 'homepage should preserve the provided PNG logo aspect ratio');
  assert.ok(html.includes('class="ukebook-logo-stage"'), 'homepage should position the logo layer');

  for (const expected of [
    'id="clip"',
    'id="badge-shell"',
    'id="tropical-scene"',
    'id="ukulele-hero"',
    'id="wordmark"',
    'UkeBook',
    'EDDIE',
    'LEVEL ATLAS',
  ]) {
    assert.ok(svg.includes(expected), `missing editable SVG token: ${expected}`);
  }

  for (const expected of [
    'export function UkebookLogo',
    'React.useId',
    'ukulele-hero',
    'wordmark',
    'UkeBook',
    'LEVEL ATLAS',
  ]) {
    assert.ok(component.includes(expected), `missing React logo token: ${expected}`);
  }

  assert.ok(spec.includes('Deliverables'), 'logo spec should document deliverables');
});
