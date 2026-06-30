import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('ukulele template keeps the original interactive framework', () => {
  const html = read('index.html');

  for (const expected of [
    './assets/styles.css',
    './assets/data.js',
    './assets/app.js',
    'class="hero"',
    'hero-copy',
    'text-pressure-stage hero-pressure-stage',
    'id="heroPressure"',
    'id="heroLanyard"',
    'lanyard-wrapper',
    'lanyard-canvas',
    'class="hero-product"',
    'id="heroNotebook"',
    'class="product-row"',
    'id="infiniteMenu"',
    'id="orbitCanvas"',
    'class="levels-section section"',
    'id="levelBoard"',
    'id="levelSongPicker"',
    'class="catalog-section section"',
    'id="queryInput"',
    'id="techCloud"',
    'id="songList"',
    'class="lesson-section section"',
    'id="songDetail"',
    'class="footer-band sponsor-footer"',
  ]) {
    assert.ok(html.includes(expected), `missing original framework token: ${expected}`);
  }
});

test('ukulele template applies fresh dopamine ukulele skin without real resources', () => {
  const html = read('index.html');
  const styles = read('assets/styles.css');
  const app = read('assets/app.js');
  const data = read('assets/data.js');
  const combined = [html, styles, app, data].join('\n');

  for (const expected of [
    'UkuleleBook',
    '尤克里里教学助手',
    '四弦',
    '和弦',
    '扫弦',
    '节拍',
    '清新多巴胺',
    'uke-fresh-theme',
    'ukulele-lanyard',
    'drawUkuleleLogo',
  ]) {
    assert.ok(combined.includes(expected), `missing ukulele skin token: ${expected}`);
  }

  const lowerStyles = styles.toLowerCase();
  for (const color of ['#7cf6a3', '#ffd166', '#ff8fab', '#5cc8ff', '#b8f35a']) {
    assert.ok(lowerStyles.includes(color), `missing dopamine palette color: ${color}`);
  }

  for (const forbidden of [
    'audio/',
    'scores/',
    'assets/support/',
    'audio-speed-player',
    'song-tech-profiles',
  ]) {
    assert.equal(combined.includes(forbidden), false, `forbidden resource reference remained: ${forbidden}`);
  }

  assert.equal(html.includes('鼓'), false, 'visible HTML should not mention drums');
  assert.equal(html.toLowerCase().includes('drum'), false, 'HTML class names should be ukulele-facing');
});
