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
    'Ukulele Tuner',
    '4=G4 3=C4 2=E4 1=A4',
    'id="startTunerButton"',
    'id="tunerNoteName"',
    'id="tunerNeedle"',
    'type="module" src="./assets/ukulele-tuner.js',
  ]) {
    assert.ok(html.includes(expected), `missing tuner UI token: ${expected}`);
  }

  assert.equal(html.includes('data-mode="guitar"'), false);
  assert.equal(html.includes('data-mode="chromatic"'), false);
  assert.equal(html.includes('Guitar'), false);
  assert.equal(html.includes('Any 12-TET note'), false);
});

test('ukulele tuner assets keep microphone tuning behavior', () => {
  const js = read('assets/ukulele-tuner.js');
  const core = read('assets/tuner-core.js');
  const css = read('assets/styles.css');

  for (const expected of [
    'navigator.mediaDevices?.getUserMedia',
    'AudioContext',
    'createAnalyser',
    'detectPitchAutoCorrelate',
    'findClosestInstrumentTarget',
    'activeMode = "ukulele"',
    'requestAnimationFrame',
  ]) {
    assert.ok(js.includes(expected), `missing tuner behavior: ${expected}`);
  }

  assert.ok(core.includes('ukulele'), 'core should keep ukulele mode');
  assert.ok(core.includes('4=G4'), 'core should expose ukulele string hint');
  assert.ok(css.includes('.ukulele-tuner-section'), 'stylesheet should include embedded tuner styles');
});
