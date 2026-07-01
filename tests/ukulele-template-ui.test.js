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
    'class="lesson-section section"',
    'id="songDetail"',
    'class="footer-band sponsor-footer"',
  ]) {
    assert.ok(html.includes(expected), `missing original framework token: ${expected}`);
  }
});

test('ukulele template applies fresh dopamine ukulele skin with imported score assets', () => {
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
    'drawTropicalBadgeScene',
    'drawBadgeUkulele',
    'drawPalmTree',
    'drawHibiscus',
  ]) {
    assert.ok(combined.includes(expected), `missing ukulele skin token: ${expected}`);
  }

  const lowerStyles = styles.toLowerCase();
  for (const color of ['#7cf6a3', '#ffd166', '#ff8fab', '#5cc8ff', '#b8f35a']) {
    assert.ok(lowerStyles.includes(color), `missing dopamine palette color: ${color}`);
  }

  assert.match(
    styles,
    /\.score-card img\s*\{[^}]*background:\s*#ffffff;[^}]*filter:\s*none;/,
    'score images should render as clean white notation pages without decorative filters'
  );
  assert.doesNotMatch(
    styles,
    /\.score-card img\s*\{[^}]*filter:\s*contrast/,
    'score images should not use contrast or brightness filters that gray out notation'
  );

  for (const forbidden of [
    'audio/',
    'assets/support/',
    'song-tech-profiles',
  ]) {
    assert.equal(combined.includes(forbidden), false, `forbidden resource reference remained: ${forbidden}`);
  }

  for (const expected of [
    'id: "debut-xiao-xing-xing"',
    'title: "小星星"',
    'level: "debut"',
    '认识C调音阶，认识4分音符与2分音符',
    './assets/scores/ukulele/debut-xiao-xing-xing/score-01.png',
    'id: "debut-kang-kang-wu-qu-cancan"',
    'title: "康康舞曲 Cancan"',
    './assets/scores/ukulele/debut-kang-kang-wu-qu-cancan/score-01.png',
    'id: "debut-c-diao-yin-jie"',
    'title: "C 调音阶"',
    'category: "曲目练习"',
    './assets/scores/ukulele/debut-c-diao-yin-jie/score-01.png',
    'id: "g1-yin-yue-zhi-sheng"',
    'title: "音乐之声"',
    '掌握八分音符，C调音阶，附点音符',
    './assets/scores/ukulele/g1-yin-yue-zhi-sheng/score-01.png',
  ]) {
    assert.ok(data.includes(expected), `missing imported score token: ${expected}`);
  }

  assert.match(
    data,
    /id: "g1-yin-yue-zhi-sheng"[\s\S]*?level: "g1"/,
    '音乐之声 should be assigned to G1'
  );

  for (const scorePath of [
    'assets/scores/ukulele/debut-xiao-xing-xing/score-01.png',
    'assets/scores/ukulele/debut-kang-kang-wu-qu-cancan/score-01.png',
    'assets/scores/ukulele/debut-c-diao-yin-jie/score-01.png',
    'assets/scores/ukulele/g1-yin-yue-zhi-sheng/score-01.png',
  ]) {
    assert.ok(fs.existsSync(path.join(root, scorePath)), `imported score image should exist: ${scorePath}`);
  }

  assert.equal(html.includes('鼓'), false, 'visible HTML should not mention drums');
  assert.equal(html.toLowerCase().includes('drum'), false, 'HTML class names should be ukulele-facing');
});

test('mobile hero keeps the UkuleleBook heading readable with a hanging badge', () => {
  const styles = read('assets/styles.css');

  assert.match(
    styles,
    /@media \(max-width: 640px\)[\s\S]*?\.ukulele-lanyard\s*\{[^}]*--badge-top:\s*58px;[^}]*--badge-width:\s*136px;/,
    'mobile hero should pin the badge position near the top-right reference placement'
  );
  assert.match(
    styles,
    /@media \(max-width: 640px\)[\s\S]*?\.ukulele-lanyard::before\s*\{[^}]*height:\s*calc\(var\(--badge-top\) \+ 18px\);/,
    'mobile hero should draw a hanging cord above the badge'
  );
  assert.match(
    styles,
    /@media \(max-width: 640px\)[\s\S]*?\.ukebook-logo-stage\s*\{[^}]*display:\s*block;[^}]*top:\s*var\(--badge-top\);[^}]*right:\s*var\(--badge-right\);[^}]*width:\s*var\(--badge-width\);/,
    'mobile hero should show the badge instead of hiding it'
  );
  assert.match(
    styles,
    /@media \(max-width: 640px\)[\s\S]*?\.text-pressure-title\s*\{[^}]*font-size:\s*42px\s*!important;/,
    'mobile hero should cap the JS-driven pressure title size'
  );
  assert.match(
    styles,
    /@media \(max-width: 640px\)[\s\S]*?\.text-pressure-title span\s*\{[^}]*font-variation-settings:[^;}]*'wdth' 72[^}]*!important;/,
    'mobile hero should freeze pressure-letter width so the title cannot expand out of view'
  );
});

test('catalog removes the visible song result card module', () => {
  const html = read('index.html');
  const app = read('assets/app.js');

  assert.equal(html.includes('class="catalog-head"'), false, 'catalog result header should be removed');
  assert.equal(html.includes('id="resultCount"'), false, 'catalog result count should be removed');
  assert.equal(html.includes('id="activeSummary"'), false, 'catalog active summary should be removed');
  assert.equal(html.includes('id="songList"'), false, 'catalog song card grid mount should be removed');
  assert.equal(app.includes('renderSongList(filteredSongs)'), false, 'app should not render the removed card grid');
});

test('level cards use first-page covers for all nine ukulele books', () => {
  const html = read('index.html');
  const data = read('assets/data.js');
  const app = read('assets/app.js');
  const styles = read('assets/styles.css');
  const coverPaths = Array.from(
    { length: 9 },
    (_, index) => `./assets/covers/ukulele-books/book-${index}-cover.png`
  );

  for (const coverPath of coverPaths) {
    assert.ok(data.includes(`coverImage: "${coverPath}"`), `missing level cover reference: ${coverPath}`);
    assert.ok(fs.existsSync(path.join(root, coverPath)), `missing exported cover image: ${coverPath}`);
  }

  assert.match(data, /id: "debut"[\s\S]*?label: "Debut"/, 'first level card should be titled Debut');
  assert.doesNotMatch(data, /id: "debut"[\s\S]*?label: "Starter"/, 'first level card should not be titled Starter');
  assert.match(data, /id: "g8"[\s\S]*?coverImage: "\.\/assets\/covers\/ukulele-books\/book-8-cover\.png"/);
  assert.ok(app.includes('has-book-cover'), 'level gallery cards with covers should be addressable for cover-specific styling');
  assert.ok(app.includes('class="circular-cover-image"'), 'level gallery should render cover images');
  assert.match(
    app,
    /class="circular-cover-image"[^>]*loading="eager"/,
    'level covers should load before carousel rotation'
  );
  assert.ok(app.includes('data-level-gallery-prev'), 'level gallery should expose a previous slide control');
  assert.ok(app.includes('data-level-gallery-next'), 'level gallery should expose a next slide control');
  assert.ok(
    app.includes('Math.round(levelGallery.target) - 1') && app.includes('Math.round(levelGallery.target) + 1'),
    'level gallery controls should slide one book at a time'
  );
  assert.match(
    styles,
    /\.level-board\.circular-gallery \.level-label\.circular-card\.has-book-cover\s*\{[^}]*height:\s*560px;[^}]*background:\s*#fffdf8;/,
    'real book cover cards should use a tall light book-card layout'
  );
  assert.match(
    styles,
    /\.circular-media\.has-cover\s*\{[^}]*width:\s*88%;[^}]*aspect-ratio:\s*829 \/ 1200;[^}]*margin:\s*8px auto 0;/,
    'cover frames should match the rendered first-page cover ratio with tighter card whitespace'
  );
  assert.match(
    styles,
    /\.level-gallery-arrow\s*\{[\s\S]*?position:\s*absolute;[\s\S]*?border-radius:\s*999px;/,
    'level gallery should render visible round slide controls'
  );
  assert.match(
    styles,
    /\.circular-cover-image\s*\{[^}]*object-fit:\s*cover;/,
    'cover images should fill the book-card cover frame without distortion'
  );
  assert.match(
    styles,
    /\.level-label\.has-book-cover \.circular-caption \.role,[\s\S]*?\.level-label\.has-book-cover \.circular-caption \.location\s*\{[^}]*white-space:\s*nowrap;/,
    'book-card captions should stay to single-line summaries so covers do not clip text'
  );
  assert.ok(html.includes('./assets/data.js?v=book-cover-cards-fit4-audio-player'), 'homepage should bust cached level data');
  assert.ok(html.includes('./assets/app.js?v=book-cover-cards-fit4-audio-player'), 'homepage should bust cached level rendering');
  assert.ok(html.includes('./assets/styles.css?v=book-cover-cards-fit4-audio-player'), 'homepage should bust cached cover styles');
});
