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

test('homepage removes the old rotating level orbit module', () => {
  const html = read('index.html');

  for (const removed of [
    'class="infinite-menu-section"',
    'id="infiniteMenu"',
    'id="orbitCanvas"',
    'pick a path',
    '原版的旋转轨道',
  ]) {
    assert.equal(html.includes(removed), false, `old orbit UI should not render: ${removed}`);
  }

  assert.ok(html.includes('id="levelBoard"'), 'book-cover level carousel should remain as the level path UI');
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
    'assets/audio-placeholders/',
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
    './assets/scores/ukulele/debut-xiao-xing-xing/score-02.png',
    'id: "debut-kang-kang-wu-qu-cancan"',
    'title: "康康舞曲 Cancan"',
    './assets/scores/ukulele/debut-kang-kang-wu-qu-cancan/score-01.png',
    './assets/scores/ukulele/debut-kang-kang-wu-qu-cancan/score-02.png',
    'id: "debut-c-diao-yin-jie"',
    'title: "C 调音阶"',
    'category: "音阶练习"',
    './assets/scores/ukulele/debut-c-diao-yin-jie/score-01.png',
    'id: "g1-yin-yue-zhi-sheng"',
    'title: "音乐之声"',
    '掌握八分音符，C调音阶，附点音符',
    './assets/scores/ukulele/g1-yin-yue-zhi-sheng/score-01.png',
    './assets/scores/ukulele/g1-yin-yue-zhi-sheng/score-02.png',
    'id: "g1-f-diao-yin-jie"',
    'title: "F调音阶"',
    'level: "g1"',
    'category: "音阶练习"',
    './assets/scores/ukulele/g1-f-diao-yin-jie/score-01.png',
    'id: "g1-always-with-me"',
    'title: "Always with me"',
    'level: "g1"',
    'category: "曲目练习"',
    './assets/scores/ukulele/g1-always-with-me/score-01.png',
    './assets/scores/ukulele/g1-always-with-me/score-02.png',
    'id: "g2-tian-kong-zhi-cheng"',
    'title: "天空之城"',
    'level: "g2"',
    'category: "曲目练习"',
    './assets/scores/ukulele/g2-tian-kong-zhi-cheng/score-01.png',
    './assets/scores/ukulele/g2-tian-kong-zhi-cheng/score-02.png',
  ]) {
    assert.ok(data.includes(expected), `missing imported score token: ${expected}`);
  }

  assert.match(
    data,
    /id: "g1-yin-yue-zhi-sheng"[\s\S]*?level: "g1"/,
    '音乐之声 should be assigned to G1'
  );

  assert.match(
    data,
    /id: "g1-f-diao-yin-jie"[\s\S]*?level: "g1"/,
    'F调音阶 should be assigned to G1'
  );

  assert.match(
    data,
    /id: "g1-always-with-me"[\s\S]*?level: "g1"/,
    'Always with me should be assigned to G1'
  );

  assert.match(
    data,
    /id: "g2-tian-kong-zhi-cheng"[\s\S]*?level: "g2"/,
    '天空之城 should be assigned to G2'
  );

  for (const scorePath of [
    'assets/scores/ukulele/debut-xiao-xing-xing/score-01.png',
    'assets/scores/ukulele/debut-xiao-xing-xing/score-02.png',
    'assets/scores/ukulele/debut-kang-kang-wu-qu-cancan/score-01.png',
    'assets/scores/ukulele/debut-kang-kang-wu-qu-cancan/score-02.png',
    'assets/scores/ukulele/debut-c-diao-yin-jie/score-01.png',
    'assets/scores/ukulele/g1-yin-yue-zhi-sheng/score-01.png',
    'assets/scores/ukulele/g1-yin-yue-zhi-sheng/score-02.png',
    'assets/scores/ukulele/g1-f-diao-yin-jie/score-01.png',
    'assets/scores/ukulele/g1-always-with-me/score-01.png',
    'assets/scores/ukulele/g1-always-with-me/score-02.png',
    'assets/scores/ukulele/g2-tian-kong-zhi-cheng/score-01.png',
    'assets/scores/ukulele/g2-tian-kong-zhi-cheng/score-02.png',
  ]) {
    assert.ok(fs.existsSync(path.join(root, scorePath)), `imported score image should exist: ${scorePath}`);
  }

  assert.equal(html.includes('鼓'), false, 'visible HTML should not mention drums');
  assert.equal(html.toLowerCase().includes('drum'), false, 'HTML class names should be ukulele-facing');
});

test('uploaded melody songs expose copied project-relative audio', () => {
  const data = read('assets/data.js');
  const uploads = [
    {
      id: 'debut-xiao-xing-xing',
      title: '小星星 音频',
      src: './assets/audio/ukulele/debut-xiao-xing-xing/full.mp3',
    },
    {
      id: 'debut-xiao-xing-xing',
      title: '小星星 With Click 音频',
      src: './assets/audio/ukulele/debut-xiao-xing-xing/with-click.mp3',
    },
    {
      id: 'debut-kang-kang-wu-qu-cancan',
      title: '康康舞曲 Cancan 音频',
      src: './assets/audio/ukulele/debut-kang-kang-wu-qu-cancan/full.mp3',
    },
    {
      id: 'debut-kang-kang-wu-qu-cancan',
      title: '康康舞曲 Cancan With Click 音频',
      src: './assets/audio/ukulele/debut-kang-kang-wu-qu-cancan/with-click.mp3',
    },
    {
      id: 'debut-c-diao-yin-jie',
      title: 'C 调音阶 音频',
      src: './assets/audio/ukulele/debut-c-diao-yin-jie/full.mp3',
    },
    {
      id: 'debut-c-diao-yin-jie',
      title: 'C 调音阶 With Click 音频',
      src: './assets/audio/ukulele/debut-c-diao-yin-jie/with-click.mp3',
    },
    {
      id: 'g1-yin-yue-zhi-sheng',
      title: '音乐之声 音频',
      src: './assets/audio/ukulele/g1-yin-yue-zhi-sheng/full.mp3',
    },
    {
      id: 'g1-yin-yue-zhi-sheng',
      title: '音乐之声 With Click 音频',
      src: './assets/audio/ukulele/g1-yin-yue-zhi-sheng/with-click.mp3',
    },
    {
      id: 'g1-f-diao-yin-jie',
      title: 'F调音阶 音频',
      src: './assets/audio/ukulele/g1-f-diao-yin-jie/full.mp3',
    },
    {
      id: 'g1-f-diao-yin-jie',
      title: 'F调音阶 With Click 音频',
      src: './assets/audio/ukulele/g1-f-diao-yin-jie/with-click.mp3',
    },
    {
      id: 'g1-always-with-me',
      title: 'Always with me 音频',
      src: './assets/audio/ukulele/g1-always-with-me/full.mp3',
    },
    {
      id: 'g1-always-with-me',
      title: 'Always with me With Click 音频',
      src: './assets/audio/ukulele/g1-always-with-me/with-click.mp3',
    },
    {
      id: 'g2-tian-kong-zhi-cheng',
      title: '天空之城 音频',
      src: './assets/audio/ukulele/g2-tian-kong-zhi-cheng/full.mp3',
    },
    {
      id: 'g2-tian-kong-zhi-cheng',
      title: '天空之城 With Click 音频',
      src: './assets/audio/ukulele/g2-tian-kong-zhi-cheng/with-click.mp3',
    },
  ];

  for (const item of uploads) {
    assert.match(
      data,
      new RegExp(`id: "${item.id}"[\\s\\S]*?audio: \\[[\\s\\S]*?title: "${item.title}"[\\s\\S]*?src: "${item.src.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`),
      `missing uploaded audio mapping for ${item.id}`
    );
    assert.equal(path.isAbsolute(item.src), false, `audio path should stay project-relative for ${item.id}`);
    assert.ok(fs.existsSync(path.join(root, item.src.replace(/^\.\//, ''))), `missing uploaded audio asset: ${item.src}`);
  }

  assert.doesNotMatch(data, /(?:[A-Z]:[\\/]|file:\/\/)/, 'uploaded audio data should not expose local Desktop paths');
});

test('mobile hero keeps the UkuleleBook heading readable with a hanging badge', () => {
  const styles = read('assets/styles.css');

  assert.match(
    styles,
    /@media \(max-width: 640px\)[\s\S]*?\.ukulele-lanyard\s*\{[^}]*--badge-top:\s*244px;[^}]*--badge-right:\s*36px;[^}]*--badge-width:\s*124px;/,
    'mobile hero should size the pendant like a hanging badge instead of a small corner sticker'
  );
  assert.match(
    styles,
    /@media \(max-width: 640px\)[\s\S]*?\.ukulele-lanyard::before\s*\{[^}]*display:\s*none;/,
    'mobile hero should not draw a second static cord over the physics lanyard'
  );
  assert.match(
    styles,
    /@media \(max-width: 640px\)[\s\S]*?--badge-right:\s*36px;[\s\S]*?--badge-center-right:\s*98px;/,
    'mobile hero should align the cord through the wider pendant center'
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

test('UI layout baseline is iPad-first before desktop and mobile adaptation', () => {
  const docs = read('docs/ui-layout-baseline.md');
  const styles = read('assets/styles.css');

  for (const expected of [
    'iPad-first teaching interface',
    '820px` wide by `1180px` high',
    '1180px` wide by `820px` high',
    'same information hierarchy',
    'Validate iPad portrait at `820x1180`',
    'Validate iPad landscape at `1180x820`',
  ]) {
    assert.ok(docs.includes(expected), `missing iPad-first policy token: ${expected}`);
  }

  for (const expected of [
    '--layout-canonical-portrait-width: 820px;',
    '--layout-canonical-portrait-height: 1180px;',
    '--layout-canonical-landscape-width: 1180px;',
    '--layout-canonical-landscape-height: 820px;',
  ]) {
    assert.ok(styles.includes(expected), `missing iPad-first layout token: ${expected}`);
  }
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

test('homepage hides the old fresh frame copy panel', () => {
  const html = read('index.html');
  const styles = read('assets/styles.css');

  assert.ok(html.includes('<div class="showcase-copy" hidden>'), 'fresh frame copy panel should not render in the homepage UI');
  assert.match(
    styles,
    /\.product-row\s*\{[^}]*grid-template-columns:\s*repeat\(2,\s*minmax\(250px,\s*1fr\)\);/,
    'product row should collapse to two visible teaching cards after the copy panel is hidden'
  );
});

test('homepage replaces the chord notebook slot with the rhythm chain game', () => {
  const html = read('index.html');
  const styles = read('assets/styles.css');
  const onlineRhythmGameSrc = 'https://rhythm-chain-game.pages.dev/?v=9b2fb40e4f8464391cf81b13aaeca281f1704efd';

  assert.ok(
    html.includes('class="showcase-object notebook-blue rhythm-game-showcase"'),
    'the former blue chord notebook slot should remain in the product row but become the rhythm game showcase'
  );
  assert.ok(
    html.includes(`src="${onlineRhythmGameSrc}"`),
    'the rhythm chain game should be embedded from the pinned online release only'
  );
  assert.ok(
    html.includes('style="width:430px;height:844px;border:0;max-width:100%;"'),
    'the embedded rhythm game iframe should keep the provided 430x844 install size'
  );
  assert.equal(html.includes('./assets/rhythm-chain-game/'), false, 'homepage should not point at the stale local rhythm game copy');
  assert.equal(html.includes('embed=showcase'), false, 'homepage should not reuse the old embedded-cache query');
  assert.ok(html.includes('title="节奏卡片游戏"'), 'the embedded game should have an accessible title');
  assert.equal(html.includes('<span>chord book</span>'), false, 'the old chord book card label should be removed');
  assert.equal(html.includes('C · F · G7 · Am'), false, 'the old chord book chord sample should be removed');

  for (const expected of [
    'class="rhythm-handheld"',
    'class="rhythm-screen"',
    'class="rhythm-controls"',
    'class="rhythm-dpad"',
    'class="rhythm-action-buttons"',
  ]) {
    assert.ok(html.includes(expected), `missing handheld shell markup: ${expected}`);
  }

  assert.match(
    styles,
    /\.rhythm-game-showcase\s*\{[^}]*min-height:\s*760px;/,
    'the taller rhythm game should reserve enough space in the original product row slot'
  );
  assert.match(
    styles,
    /\.rhythm-handheld\s*\{[^}]*width:\s*min\(360px,\s*calc\(100vw - 72px\)\);[^}]*animation:\s*cardPeelIn 520ms ease both;/,
    'the rhythm game should be wrapped in a compact practice panel that keeps the original card reveal motion'
  );
  assert.match(
    styles,
    /\.rhythm-screen\s*\{[^}]*aspect-ratio:\s*430 \/ 704;/,
    'the handheld screen should crop the remote game to its useful content height'
  );
  assert.match(
    styles,
    /\.rhythm-game-frame iframe\s*\{[^}]*border:\s*0;[^}]*width:\s*430px\s*!important;[^}]*height:\s*844px\s*!important;[^}]*max-width:\s*none\s*!important;[^}]*transform:\s*scale\(var\(--rhythm-frame-scale\)\);/,
    'the rhythm game iframe should keep its requested viewport and scale into the panel cleanly'
  );
  assert.match(
    styles,
    /\.rhythm-controls\s*\{[^}]*grid-template-columns:\s*40px 1fr 48px;[^}]*min-height:\s*32px;/,
    'the rhythm game panel controls should be compact enough for the tall iframe'
  );
  assert.match(
    styles,
    /@media \(max-width: 640px\)[\s\S]*?\.rhythm-handheld\s*\{[^}]*width:\s*min\(340px,\s*calc\(100vw - 48px\)\);/,
    'the rhythm game should not collapse under the mobile showcase-object rule'
  );
});

test('rhythm game install avoids stale local cache sources', () => {
  const html = read('index.html');

  assert.ok(
    html.includes('https://rhythm-chain-game.pages.dev/?v=9b2fb40e4f8464391cf81b13aaeca281f1704efd'),
    'homepage should use the requested online rhythm game release'
  );
  assert.equal(html.includes('assets/rhythm-chain-game/index.html'), false, 'homepage should not load the old copied game HTML');
  assert.equal(html.includes('assets/rhythm-chain-game/assets/'), false, 'homepage should not load old copied game assets');
  assert.equal(html.includes('?embed=showcase'), false, 'homepage should not reuse the old embedded query cache');
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
  assert.ok(html.includes('./assets/data.js?v=book-cover-cards-fit4-audio-player-photo-lanyard-row-clean-audio-title-scale-category-rhythm-game-panel-fit6-fixed-audio-progress'), 'homepage should bust cached level data');
  assert.ok(html.includes('./assets/app.js?v=book-cover-cards-fit4-audio-player-photo-lanyard-row-clean-audio-title-scale-category-rhythm-game-panel-fit6-fixed-audio-progress'), 'homepage should bust cached level rendering');
  assert.ok(html.includes('./assets/styles.css?v=book-cover-cards-fit4-audio-player-photo-lanyard-row-clean-audio-title-scale-category-rhythm-game-panel-fit6-fixed-audio-progress'), 'homepage should bust cached cover styles');
});

test('hero lanyard adapts the React Bits pendant behavior to the static PNG logo', () => {
  const html = read('index.html');
  const app = read('assets/app.js');
  const styles = read('assets/styles.css');

  for (const expected of [
    'querySelector(".ukebook-logo-stage")',
    'setPointerCapture',
    'releasePointerCapture',
    '--lanyard-drag-x',
    '--lanyard-drag-y',
    '--lanyard-card-rotate',
    '--lanyard-card-skew',
    'syncLogoToPhysics',
    'updateCardPhysics',
    'dragOffset',
    'wakeLanyard',
    'applyLanyardForces',
  ]) {
    assert.ok(app.includes(expected), `missing static lanyard behavior token: ${expected}`);
  }

  assert.equal(app.includes('drawCard();'), false, 'the canvas should not redraw a second logo over the provided PNG');
  assert.equal(app.includes('ctx.font = "900 34px Aptos'), false, 'the canvas connector should not draw a separate floating mini badge over the card clip');
  assert.equal(app.includes('idleX'), false, 'released lanyard card should not be forced through a fake idle sine motion');
  assert.equal(app.includes('card.x = lanyard.base.centerX'), false, 'released card should hang from rope constraints instead of being pinned to its base center');
  assert.ok(app.includes('position.x - card.x') && app.includes('position.y - card.y'), 'drag should keep the pointer-to-card offset like the React Bits kinematic body');
  assert.ok(app.includes('attachX: baseCenterX') && app.includes('top.x - lanyard.base.attachX'), 'the DOM logo should move from the same top eyelet point as the canvas cord');
  assert.ok(html.includes('class="ukebook-logo-art"'), 'the provided logo PNG should be cropped inside the hanging badge shell');
  assert.ok(html.includes('src="./assets/brand/ukulele-logo-direct.png"'), 'the hanging badge should still use the provided direct PNG logo');
  assert.match(
    styles,
    /\.ukebook-logo-stage\s*\{[^}]*right:\s*clamp\(-118px,\s*-6vw,\s*-52px\);[^}]*aspect-ratio:\s*0\.66;[^}]*overflow:\s*hidden;[^}]*pointer-events:\s*auto;/,
    'desktop pendant logo should crop the direct PNG inside a draggable badge shell'
  );
  assert.match(
    styles,
    /\.ukebook-logo-art\s*\{[^}]*top:\s*-28%;[^}]*width:\s*146%;/,
    'the original PNG should be zoomed and shifted so the badge artwork connects to the clip'
  );
  assert.match(
    styles,
    /\.ukebook-logo-stage::before\s*\{[^}]*content:\s*"";[^}]*background:[^}]*#fff7df;/,
    'the badge should draw a visible webbing tab that connects the lanyard into the card'
  );
  assert.match(
    styles,
    /\.ukebook-logo-stage::after\s*\{[^}]*content:\s*"";[^}]*border:[^}]*rgba\(21,\s*48,\s*71,\s*0\.72\);/,
    'the badge should draw a metal eyelet that moves with the draggable card'
  );
  assert.doesNotMatch(
    styles,
    /\.ukebook-logo-stage\s*\{[^}]*animation:\s*ukebookLogoDrift/,
    'the badge should not drift independently from the canvas lanyard connection'
  );
  assert.match(
    styles,
    /\.lanyard-canvas\s*\{[^}]*opacity:\s*0\.92;/,
    'lanyard canvas should remain visible for the hanging cord and clip'
  );
  assert.match(
    styles,
    /\.ukebook-logo-stage\s*\{[^}]*transform-origin:\s*50%\s*10\.5%;/,
    'the PNG pendant should rotate from the same top eyelet used by the physics cord'
  );
  assert.match(
    styles,
    /@media \(max-width: 980px\)[\s\S]*?\.ukebook-logo-stage\s*\{[^}]*right:\s*clamp\(36px,\s*7vw,\s*70px\);[^}]*width:\s*clamp\(122px,\s*19vw,\s*152px\);/,
    'narrow desktop pendant should read as a hanging badge at the reference scale'
  );
  assert.match(
    styles,
    /\.ukulele-lanyard\.is-dragging \.ukebook-logo-stage\s*\{[^}]*cursor:\s*grabbing;/,
    'dragging state should visibly switch the logo handle'
  );
  assert.ok(html.includes('./assets/app.js?v=book-cover-cards-fit4-audio-player-photo-lanyard-row-clean-audio-title-scale-category-rhythm-game-panel-fit6-fixed-audio-progress'), 'homepage should bust cached lanyard physics');
  assert.ok(html.includes('./assets/styles.css?v=book-cover-cards-fit4-audio-player-photo-lanyard-row-clean-audio-title-scale-category-rhythm-game-panel-fit6-fixed-audio-progress'), 'homepage should bust cached connected lanyard styles');
});
