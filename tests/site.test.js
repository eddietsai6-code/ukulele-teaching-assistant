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
  assert.equal(html.includes('id="ukuleleTuningHint"'), false);
  assert.equal(html.includes('4=G4 3=C4 2=E4 1=A4'), false);
  assert.equal(html.includes('sticker-bolt'), false);
  assert.equal(html.includes('C F G'), false);
  assert.equal(html.includes('data-mode="guitar"'), false);
  assert.equal(html.includes('Guitar'), false);
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
