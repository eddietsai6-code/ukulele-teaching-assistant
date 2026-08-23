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
    'class="hero tailark-hero"',
    'tailark-nav',
    'tailark-hero-stage',
    'tailark-hero-copy',
    'text-pressure-stage hero-pressure-stage tailark-pressure-stage',
    'id="heroPressure"',
    'id="heroPrincipleFocus"',
    'tailark-principle-focus',
    'id="heroSongSearchForm"',
    'id="tailarkSongSearch"',
    'id="heroSongSearchResults"',
    'id="heroTextTypeList"',
    'tailark-book-accordion',
    'tailark-carousel-row-mini',
    'class="hero-product"',
    'id="heroNotebook"',
    'class="ukulele-tuner-section section practice-tools-section"',
    'data-practice-tools',
    'id="practiceRhythmPanel"',
    'class="levels-section section"',
    'id="levelBoard"',
    'id="levelSongPicker"',
    'class="lesson-section section"',
    'id="songDetail"',
    'class="footer-band activation-footer"',
  ]) {
    assert.ok(html.includes(expected), `missing original framework token: ${expected}`);
  }

  assert.equal(html.includes('id="heroLanyard"'), false, 'GuitarBook-style hero should not render the hanging badge');
  assert.equal(html.includes('class="ukulele-lanyard lanyard-wrapper"'), false, 'GuitarBook-style hero should not reserve a pendant layer');
});

test('homepage adapts the GuitarBook hero and footer language to UkuleleBook', () => {
  const html = read('index.html');
  const styles = read('assets/styles.css');
  const app = read('assets/app.js');
  const bootstrap = read('assets/bootstrap.js');
  const domRoots = read('assets/app/core/dom-roots.js');
  const heroSearch = read('assets/app/home/hero-song-search.js');
  const trueFocusPath = 'assets/app/home/true-focus.js';
  const trueFocus = fs.existsSync(path.join(root, trueFocusPath)) ? read(trueFocusPath) : '';

  for (const expected of [
    'aria-label="UkuleleBook"',
    'data-text="UkuleleBook"',
    'Motivation',
    'Practice',
    'Method',
    'Search songs',
    './assets/covers/ukulele-books/book-0-cover.png',
    './assets/covers/ukulele-books/book-8-cover.png',
    'activation-footer-card',
    'activation-footer-logo',
    'Resources',
    'Company',
    'About UkuleleBook',
  ]) {
    assert.ok(html.includes(expected), `missing UkuleleBook Tailark token: ${expected}`);
  }

  assert.equal(html.includes('data-text="UkeBook"'), false, 'hero title should not abbreviate UkuleleBook to UkeBook');
  assert.equal(html.includes('>UkeBook<'), false, 'visible brand copy should not abbreviate UkuleleBook to UkeBook');

  for (const expected of [
    '.hero.tailark-hero',
    '.tailark-book-panel.is-featured',
    '@keyframes tailarkHeroCarousel',
    '.activation-footer-card',
    '.footer-tape-left',
    '.footer-tape-right',
  ]) {
    assert.ok(styles.includes(expected), `missing UkuleleBook Tailark style: ${expected}`);
  }
  assert.match(
    styles,
    /\.uke-fresh-theme \.footer-band\s*\{[^}]*background:\s*var\(--page-clean-paper\);/,
    'fresh theme footer should remove the pale green/diagonal background layer'
  );
  assert.match(
    styles,
    /\.activation-footer\s*\{[^}]*background:\s*var\(--page-clean-paper\);/,
    'activation footer should sit on the same clean paper field instead of painting a separate footer tint'
  );
  assert.doesNotMatch(
    styles,
    /\.uke-fresh-theme \.footer-band\s*\{[^}]*linear-gradient/,
    'fresh theme footer should not keep the old gradient background layer'
  );

  for (const expected of [
    'heroSongSearchForm',
    'heroSongSearchInput',
    'tailark-song-result',
    'selectHeroSong',
  ]) {
    assert.ok(heroSearch.includes(expected), `missing hero search behavior: ${expected}`);
  }

  assert.ok(domRoots.includes('heroPrincipleFocus: documentRef.getElementById("heroPrincipleFocus")'), 'DOM roots should expose the true-focus headline row');
  assert.ok(app.includes('import { mountTrueFocus } from "./app/home/true-focus.js";'), 'homepage should import the GuitarBook true-focus behavior');
  assert.ok(app.includes('mountTrueFocus(els.heroPrincipleFocus)'), 'homepage should mount the focus frame animation');
  assert.ok(bootstrap.includes('benefits-scale-lower6-celebrity-zone-exact'), 'bootstrap should import the uncached app bundle with the true-focus and exact celebrity gallery behavior');
  for (const expected of [
    'export function mountTrueFocus',
    'querySelector(".true-focus-frame")',
    'getBoundingClientRect()',
    'frame.style.opacity = "1"',
    'ResizeObserver',
  ]) {
    assert.ok(trueFocus.includes(expected), `missing true-focus frame behavior: ${expected}`);
  }

  assert.ok(
    html.indexOf('data-tailark-book-accordion') < html.indexOf('id="heroTextTypeList"'),
    'Tailark hero should place the book accordion before the benefit copy'
  );
  assert.ok(
    html.indexOf('id="heroTextTypeList"') < html.indexOf('class="tailark-carousel-row tailark-carousel-row-mini"'),
    'Tailark hero should keep the image carousel after the benefit copy'
  );

  assert.equal(html.includes('class="footer-band sponsor-footer"'), false, 'old sponsor footer should be replaced');
});

test('homepage exposes one login trigger with a working sign-in dialog', () => {
  const html = read('index.html');
  const styles = read('assets/styles.css');
  const app = read('assets/app.js');

  const loginControls = html.match(/<(?:a|button)[^>]+class="tailark-login tailark-login-dark"/g) || [];
  assert.equal(loginControls.length, 1, 'homepage should render a single Login entry');
  assert.equal(html.includes('tailark-login-light'), false, 'homepage should remove the duplicate light Login button');

  for (const expected of [
    'type="button"',
    'data-login-trigger',
    'id="tailarkLoginDialog"',
    'role="dialog"',
    'aria-modal="true"',
    'id="tailarkLoginForm"',
    'id="tailarkLoginName"',
    'id="tailarkLoginPassword"',
  ]) {
    assert.ok(html.includes(expected), `missing login dialog markup: ${expected}`);
  }

  for (const expected of [
    '.tailark-login-dialog',
    '.tailark-login-panel',
    '.tailark-login-field',
    '.tailark-login-submit',
    '.tailark-login.is-signed-in',
  ]) {
    assert.ok(styles.includes(expected), `missing login dialog style: ${expected}`);
  }

  assert.ok(app.includes('import { initTailarkLogin } from "./app/home/login.js";'), 'homepage should import the login behavior');
  assert.ok(app.includes('initTailarkLogin(document, window)'), 'homepage should mount the login behavior');

  const loginModule = read('assets/app/home/login.js');
  for (const expected of [
    'export function initTailarkLogin',
    'localStorage',
    'ukebook-login-user',
    'is-signed-in',
    'addEventListener("submit"',
    'addEventListener("keydown"',
    'Escape',
  ]) {
    assert.ok(loginModule.includes(expected), `missing login behavior token: ${expected}`);
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
    'tailark-book-accordion',
    'tailark-carousel-row-mini',
    'tailark-song-result',
    'activation-footer-card',
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
    'id: "debut-yao-lan-qu-lulla"',
    'title: "摇篮曲 Lulla"',
    'level: "debut"',
    'category: "曲目练习"',
    './assets/scores/ukulele/debut-yao-lan-qu-lulla/score-01.png',
    './assets/scores/ukulele/debut-yao-lan-qu-lulla/score-02.png',
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
    'id: "g2-zhi-ai-li-si-for-elise"',
    'title: "致爱丽丝 For Elise"',
    'level: "g2"',
    'category: "曲目练习"',
    './assets/scores/ukulele/g2-zhi-ai-li-si-for-elise/score-01.png',
    './assets/scores/ukulele/g2-zhi-ai-li-si-for-elise/score-02.png',
    'id: "g2-chong-er-fei"',
    'title: "虫儿飞"',
    'level: "g2"',
    'category: "曲目练习"',
    './assets/scores/ukulele/g2-chong-er-fei/score-01.png',
    'id: "g3-summer"',
    'title: "SUMMER"',
    'level: "g3"',
    'category: "曲目练习"',
    './assets/scores/ukulele/g3-summer/score-01.png',
    'id: "g3-hei-ren-tai-guan"',
    'title: "黑人抬棺"',
    'level: "g3"',
    'category: "曲目练习"',
    './assets/scores/ukulele/g3-hei-ren-tai-guan/score-01.png',
    'id: "g3-yue-liang-dai-biao-wo-de-xin"',
    'title: "月亮代表我的心"',
    'level: "g3"',
    'category: "曲目练习"',
    './assets/scores/ukulele/g3-yue-liang-dai-biao-wo-de-xin/score-01.png',
    './assets/scores/ukulele/g3-yue-liang-dai-biao-wo-de-xin/score-02.png',
    'id: "g3-tian-kong-zhi-cheng-du-zou-ban"',
    'title: "天空之城（独奏版）"',
    'level: "g3"',
    'category: "曲目练习"',
    './assets/scores/ukulele/g3-tian-kong-zhi-cheng-du-zou-ban/score-01.png',
    'id: "g4-ai-de-luo-man-shi"',
    'title: "爱的罗曼史"',
    'level: "g4"',
    'category: "曲目练习"',
    './assets/scores/ukulele/g4-ai-de-luo-man-shi/score-01.png',
    './assets/scores/ukulele/g4-ai-de-luo-man-shi/score-02.png',
    './assets/scores/ukulele/g4-ai-de-luo-man-shi/score-03.png',
    'id: "g5-huan-hua-cheng-feng"',
    'title: "幻化成风"',
    'level: "g5"',
    'category: "曲目练习"',
    './assets/scores/ukulele/g5-huan-hua-cheng-feng/score-01.png',
  ]) {
    assert.ok(data.includes(expected), `missing imported score token: ${expected}`);
  }

  assert.match(
    data,
    /id: "g1-yin-yue-zhi-sheng"[\s\S]*?level: "g1"[\s\S]*?category: "曲目练习"/,
    '音乐之声 should be assigned to G1 song practice'
  );

  assert.match(
    data,
    /id: "debut-yao-lan-qu-lulla"[\s\S]*?level: "debut"[\s\S]*?category: "曲目练习"/,
    '摇篮曲 Lulla should be assigned to Debut song practice'
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

  assert.match(
    data,
    /id: "g2-zhi-ai-li-si-for-elise"[\s\S]*?level: "g2"[\s\S]*?category: "曲目练习"/,
    '致爱丽丝 For Elise should be assigned to G2 song practice'
  );

  assert.match(
    data,
    /id: "g2-chong-er-fei"[\s\S]*?level: "g2"[\s\S]*?category: "曲目练习"/,
    '虫儿飞 should be assigned to G2 song practice'
  );

  assert.match(
    data,
    /id: "g3-summer"[\s\S]*?level: "g3"[\s\S]*?category: "曲目练习"/,
    'SUMMER should be assigned to G3 song practice'
  );

  assert.match(
    data,
    /id: "g3-hei-ren-tai-guan"[\s\S]*?level: "g3"[\s\S]*?category: "曲目练习"/,
    '黑人抬棺 should be assigned to G3 song practice'
  );

  assert.match(
    data,
    /id: "g3-yue-liang-dai-biao-wo-de-xin"[\s\S]*?level: "g3"[\s\S]*?category: "曲目练习"/,
    '月亮代表我的心 should be assigned to G3 song practice'
  );

  assert.match(
    data,
    /id: "g3-tian-kong-zhi-cheng-du-zou-ban"[\s\S]*?level: "g3"[\s\S]*?category: "曲目练习"/,
    '天空之城（独奏版） should be assigned to G3 song practice'
  );

  assert.match(
    data,
    /id: "g4-ai-de-luo-man-shi"[\s\S]*?level: "g4"[\s\S]*?category: "曲目练习"/,
    '爱的罗曼史 should be assigned to G4 song practice'
  );

  assert.match(
    data,
    /id: "g5-huan-hua-cheng-feng"[\s\S]*?level: "g5"[\s\S]*?category: "曲目练习"/,
    '幻化成风 should be assigned to G5 song practice'
  );


  const retiredCategories = [
    'category: "' + String.fromCharCode(26059, 24459, 32451, 20064) + '"',
    'category: "' + String.fromCharCode(21407, 21019, 32451, 20064) + '"',
  ];
  for (const retiredCategory of retiredCategories) {
    assert.equal(data.includes(retiredCategory), false, 'retired practice categories should be folded into song practice');
  }

  for (const scorePath of [
    'assets/scores/ukulele/debut-xiao-xing-xing/score-01.png',
    'assets/scores/ukulele/debut-xiao-xing-xing/score-02.png',
    'assets/scores/ukulele/debut-kang-kang-wu-qu-cancan/score-01.png',
    'assets/scores/ukulele/debut-kang-kang-wu-qu-cancan/score-02.png',
    'assets/scores/ukulele/debut-c-diao-yin-jie/score-01.png',
    'assets/scores/ukulele/debut-yao-lan-qu-lulla/score-01.png',
    'assets/scores/ukulele/debut-yao-lan-qu-lulla/score-02.png',
    'assets/scores/ukulele/g1-yin-yue-zhi-sheng/score-01.png',
    'assets/scores/ukulele/g1-yin-yue-zhi-sheng/score-02.png',
    'assets/scores/ukulele/g1-f-diao-yin-jie/score-01.png',
    'assets/scores/ukulele/g1-always-with-me/score-01.png',
    'assets/scores/ukulele/g1-always-with-me/score-02.png',
    'assets/scores/ukulele/g2-tian-kong-zhi-cheng/score-01.png',
    'assets/scores/ukulele/g2-tian-kong-zhi-cheng/score-02.png',
    'assets/scores/ukulele/g2-zhi-ai-li-si-for-elise/score-01.png',
    'assets/scores/ukulele/g2-zhi-ai-li-si-for-elise/score-02.png',
    'assets/scores/ukulele/g2-chong-er-fei/score-01.png',
    'assets/scores/ukulele/g3-summer/score-01.png',
    'assets/scores/ukulele/g3-hei-ren-tai-guan/score-01.png',
    'assets/scores/ukulele/g3-yue-liang-dai-biao-wo-de-xin/score-01.png',
    'assets/scores/ukulele/g3-yue-liang-dai-biao-wo-de-xin/score-02.png',
    'assets/scores/ukulele/g3-tian-kong-zhi-cheng-du-zou-ban/score-01.png',
    'assets/scores/ukulele/g4-ai-de-luo-man-shi/score-01.png',
    'assets/scores/ukulele/g4-ai-de-luo-man-shi/score-02.png',
    'assets/scores/ukulele/g4-ai-de-luo-man-shi/score-03.png',
    'assets/scores/ukulele/g5-huan-hua-cheng-feng/score-01.png',
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
      id: 'debut-yao-lan-qu-lulla',
      title: '摇篮曲 Lulla 音频',
      src: './assets/audio/ukulele/debut-yao-lan-qu-lulla/full.mp3',
    },
    {
      id: 'debut-yao-lan-qu-lulla',
      title: '摇篮曲 Lulla With Click 音频',
      src: './assets/audio/ukulele/debut-yao-lan-qu-lulla/with-click.mp3',
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
    {
      id: 'g2-zhi-ai-li-si-for-elise',
      title: '致爱丽丝 For Elise 音频',
      src: './assets/audio/ukulele/g2-zhi-ai-li-si-for-elise/full.mp3',
    },
    {
      id: 'g2-zhi-ai-li-si-for-elise',
      title: '致爱丽丝 For Elise With Click 音频',
      src: './assets/audio/ukulele/g2-zhi-ai-li-si-for-elise/with-click.mp3',
    },

    {
      id: 'g2-chong-er-fei',
      title: '虫儿飞 音频',
      src: './assets/audio/ukulele/g2-chong-er-fei/full.mp3',
    },
    {
      id: 'g3-summer',
      title: 'SUMMER Full 音频',
      src: './assets/audio/ukulele/g3-summer/full.mp3',
    },
    {
      id: 'g3-summer',
      title: 'SUMMER Backing Track 音频',
      src: './assets/audio/ukulele/g3-summer/backing-track.mp3',
    },
    {
      id: 'g3-hei-ren-tai-guan',
      title: '黑人抬棺 音频',
      src: './assets/audio/ukulele/g3-hei-ren-tai-guan/full.mp3',
    },
    {
      id: 'g3-yue-liang-dai-biao-wo-de-xin',
      title: '月亮代表我的心 音频',
      src: './assets/audio/ukulele/g3-yue-liang-dai-biao-wo-de-xin/full.mp3',
    },
    {
      id: 'g3-tian-kong-zhi-cheng-du-zou-ban',
      title: '天空之城（独奏版） 音频',
      src: './assets/audio/ukulele/g3-tian-kong-zhi-cheng-du-zou-ban/full.mp3',
    },
    {
      id: 'g4-ai-de-luo-man-shi',
      title: '爱的罗曼史 音频',
      src: './assets/audio/ukulele/g4-ai-de-luo-man-shi/full.mp3',
    },
    {
      id: 'g5-huan-hua-cheng-feng',
      title: '幻化成风 音频',
      src: './assets/audio/ukulele/g5-huan-hua-cheng-feng/full.mp3',
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

test('level song lists hide placeholder songs without score or audio resources', () => {
  const app = read('assets/app.js');
  const styles = read('assets/styles.css');

  assert.ok(app.includes('function hasSongResources(song)'), 'song filtering should define a resource-content gate');
  assert.ok(app.includes('return data.songs.filter(hasSongResources);'), 'visible song lists should come from resource-backed songs only');

  for (const expected of [
    'selectedSongId: visibleSongs()[0] ? visibleSongs()[0].id : ""',
    'return visibleSongs().find((song) => song.id === state.selectedSongId) || visibleSongs()[0] || null;',
    'return visibleSongs().filter((song) => song.level === levelId).length;',
    'return visibleSongs()',
  ]) {
    assert.ok(app.includes(expected), `missing visible-song guard: ${expected}`);
  }

  assert.equal(app.includes('song.source.includes("2024") ? "2024" : "old"'), false, 'level song picker should not render old placeholder labels');
  assert.equal(app.includes('<span class="handle">${song.source'), false, 'level song picker should not reserve the old handle slot');
  assert.match(
    styles,
    /\.song-picker-info \.name\s*\{[^}]*grid-column:\s*1 \/ -1;/,
    'song picker title should span the row after removing the old handle'
  );
});

test('mobile hero keeps the UkuleleBook heading readable without the hanging badge', () => {
  const styles = read('assets/styles.css');
  const textPressure = read('assets/app/home/text-pressure.js');

  assert.doesNotMatch(styles, /\.tailark-hero \.ukulele-lanyard/, 'Tailark hero should not position the old pendant');
  assert.doesNotMatch(
    styles,
    /@media \(max-width: 640px\)[\s\S]*?\.text-pressure-title\s*\{[^}]*font-size:\s*42px\s*!important;/,
    'mobile hero should not force a 42px title because the GuitarBook master lets JS calculate the pressure font size'
  );
  assert.doesNotMatch(
    styles,
    /@media \(max-width: 640px\)[\s\S]*?\.text-pressure-title span\s*\{[^}]*font-variation-settings:[^}]*!important;/,
    'mobile hero should not freeze pressure-letter width because the title needs the GuitarBook dynamic font effect'
  );
  assert.match(
    styles,
    /\.tailark-hero \.tailark-principle-focus \.true-focus-word\s*\{[^}]*justify-self:\s*start;/,
    'true-focus words should not stretch across the mobile grid because the corner frame must lock to the active word'
  );
  assert.match(
    styles,
    /\.tailark-hero \.text-pressure-title\.flex\s*\{[^}]*justify-content:\s*flex-start;[^}]*gap:\s*clamp\(2px,\s*0\.72vw,\s*9px\);/,
    'UkuleleBook pressure letters should stay locked as a word across desktop and iPad widths'
  );
  assert.match(
    styles,
    /\.tailark-hero \.tailark-principle-focus \.true-focus-word\s*\{[^}]*width:\s*max-content;[^}]*font-size:\s*clamp\(32px,\s*4vw,\s*46px\);/,
    'desktop hero focus words should fit on one locked row instead of forcing Method downward'
  );
  assert.match(
    styles,
    /\.tailark-hero \.tailark-principle-focus \.true-focus-word:nth-child\(3\)\s*\{[^}]*transform:\s*translate\(0,\s*0\);/,
    'desktop and iPad Method should stay in the same focus row'
  );
  assert.match(
    styles,
    /\.tailark-hero \.tailark-principle-focus \.true-focus-word\.is-active:nth-child\(3\)\s*\{[^}]*transform:\s*translateY\(-1px\);/,
    'active Method should only use the normal focus lift, not the old lower-row offset'
  );
  assert.match(
    styles,
    /@media \(max-width: 640px\)[\s\S]*?\.tailark-hero \.tailark-pressure-stage\s*\{[^}]*height:\s*clamp\(84px,\s*24vw,\s*106px\);[^}]*margin-bottom:\s*8px;/,
    'mobile hero title row should keep the GuitarBook pressure-stage height and spacing'
  );
  assert.match(
    styles,
    /@media \(max-width: 640px\)[\s\S]*?\.tailark-principle-copy,\s*\.hero-principle-copy\.tailark-principle-copy\s*\{[^}]*min-height:\s*52px;[^}]*margin-bottom:\s*8px;/,
    'mobile hero focus row should not reserve the old tall vertical stack space'
  );
  assert.match(
    styles,
    /@media \(max-width: 640px\)[\s\S]*?\.tailark-hero \.tailark-principle-focus\s*\{[^}]*grid-template-columns:\s*repeat\(3,\s*max-content\);[^}]*gap:\s*clamp\(10px,\s*3vw,\s*18px\);/,
    'mobile Motivation Practice Method row should stay on one line like the GuitarBook reference'
  );
  assert.match(
    styles,
    /@media \(max-width: 640px\)[\s\S]*?\.tailark-hero \.tailark-principle-focus \.true-focus-word\s*\{[^}]*min-height:\s*44px;[^}]*font-size:\s*clamp\(22px,\s*6vw,\s*34px\);/,
    'mobile hero focus words should keep the reference font-size ratio'
  );
  assert.ok(textPressure.includes("span.style.fontVariationSettings = settings"), 'hero pressure title should keep the master variable-font animation loop');
  assert.match(
    styles,
    /@media \(max-width: 640px\)[\s\S]*?\.tailark-email-card\s*\{[^}]*grid-template-columns:\s*34px minmax\(0,\s*1fr\) 128px;[^}]*min-height:\s*66px;/,
    'mobile hero search should keep the master inline input and compact button layout'
  );
  assert.match(
    styles,
    /@media \(max-width: 640px\)[\s\S]*?\.tailark-search-submit-wrap\s*\{[^}]*grid-column:\s*auto;[^}]*width:\s*128px;[^}]*margin-top:\s*0;/,
    'mobile hero search button should stay on the right instead of spanning a second row'
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

test('homepage removes the visible catalog filter module', () => {
  const html = read('index.html');
  const app = read('assets/app.js');
  const domRoots = read('assets/app/core/dom-roots.js');

  assert.equal(html.includes('id="catalog"'), false, 'catalog filter section should be removed');
  assert.equal(html.includes('class="catalog-section section"'), false, 'catalog section wrapper should be removed');
  assert.equal(html.includes('song catalog'), false, 'catalog section marker should be removed');
  assert.equal(html.includes('歌单、技巧和课堂目标都在一页里。'), false, 'catalog headline should be removed');
  assert.equal(html.includes('用原版曲库筛选结构承接尤克里里歌曲'), false, 'catalog helper copy should be removed');
  assert.equal(html.includes('class="filters"'), false, 'catalog filters wrapper should be removed');
  assert.equal(html.includes('id="queryInput"'), false, 'catalog query input should be removed');
  assert.equal(html.includes('id="levelFilter"'), false, 'catalog level filter should be removed');
  assert.equal(html.includes('id="sourceFilter"'), false, 'catalog source filter should be removed');
  assert.equal(html.includes('id="categoryFilter"'), false, 'catalog category filter should be removed');
  assert.equal(html.includes('id="techCloud"'), false, 'catalog technique cloud should be removed');
  assert.equal(html.includes('href="#catalog"'), false, 'navigation should not point at the removed catalog section');
  assert.equal(html.includes('class="catalog-head"'), false, 'catalog result header should be removed');
  assert.equal(html.includes('id="resultCount"'), false, 'catalog result count should be removed');
  assert.equal(html.includes('id="activeSummary"'), false, 'catalog active summary should be removed');
  assert.equal(html.includes('id="songList"'), false, 'catalog song card grid mount should be removed');
  assert.equal(app.includes('filterSongs'), false, 'homepage app should not keep catalog filtering behavior after removing the module');
  assert.equal(app.includes('renderTechCloud'), false, 'homepage app should not render the removed technique cloud');
  assert.equal(app.includes('renderSongList(filteredSongs)'), false, 'app should not render the removed card grid');
  assert.equal(domRoots.includes('queryInput'), false, 'public DOM roots should not expose removed catalog controls');
  assert.equal(domRoots.includes('techCloud'), false, 'public DOM roots should not expose the removed technique cloud');
});

test('homepage removes the old fresh frame copy panel and keeps the practice tools carousel', () => {
  const html = read('index.html');
  const app = read('assets/app.js');
  const styles = read('assets/styles.css');
  const practiceTools = read('assets/app/home/practice-tools.js');

  assert.equal(html.includes('class="product-row"'), false, 'the old two-column product row should not render after the practice tools carousel replaced it');
  assert.equal(html.includes('class="showcase-copy"'), false, 'the old fresh frame copy panel should not render in the homepage UI');
  assert.ok(html.includes('class="practice-tools-shell" data-practice-tools'), 'practice tools carousel should hold the tuner and rhythm game modules');
  assert.ok(html.includes('class="gallery-choice-callout tools-choice-callout"'), 'practice tools should use the handwritten callout shell');
  assert.ok(html.includes('class="gallery-choice-callout-text tools-choice-callout-text"'), 'practice tools should use the handwritten orange callout text');
  assert.ok(html.includes('>模块工具选择</p>'), 'practice tools callout should use the requested title text');
  assert.ok(html.includes('class="gallery-choice-callout-arrow tools-choice-callout-arrow"'), 'practice tools should include the hand-drawn arrow');
  assert.equal(html.includes('从调音开始'), false, 'old tuner-only scribble sticker should be removed');
  assert.equal(html.includes('class="scribble-caption caption-left"'), false, 'old tuner-only caption-left sticker should be removed');
  assert.equal(styles.includes('.caption-left'), false, 'old tuner-only caption-left CSS should be removed');
  assert.ok(html.includes('id="practiceTunerPanel"'), 'practice tools carousel should keep the tuner panel');
  assert.ok(html.includes('id="practiceRhythmPanel"'), 'practice tools carousel should keep the rhythm game panel');
  const rhythmPanelStart = html.indexOf('id="practiceRhythmPanel"');
  const rhythmFrameStart = html.indexOf('class="rhythm-game-frame"', rhythmPanelStart);
  const rhythmPanelIntro = html.slice(rhythmPanelStart, rhythmFrameStart);
  assert.equal(rhythmPanelIntro.includes('class="scribble-caption"'), false, 'rhythm tool should not show the decorative label above the game frame');
  assert.equal(rhythmPanelIntro.includes('class="arrow"'), false, 'rhythm tool should not show the decorative arrow above the game frame');
  assert.ok(html.includes('data-practice-tool-prev'), 'practice tools carousel should expose the GuitarBook-style previous control');
  assert.ok(html.includes('data-practice-tool-next'), 'practice tools carousel should expose the GuitarBook-style next control');
  assert.ok(html.includes('data-practice-tool-label'), 'practice tools carousel should expose the active tool label');
  assert.ok(html.includes('data-practice-tool-status'), 'practice tools carousel should expose the active tool page count');
  assert.ok(html.includes('id="ukuleleTuner"'), 'practice tools carousel should preserve the original tuner DOM target');
  assert.ok(html.includes('src="./assets/rhythm-chain-game/index.html?v=20260722-ipad-scroll-reset"'), 'practice tools carousel should preserve the rhythm game iframe source');

  assert.ok(app.includes('import { initPracticeToolsCarousel } from "./app/home/practice-tools.js?v=20260809-practice-tools-carousel";'), 'homepage app should import the practice tools carousel behavior');
  assert.ok(app.includes('initPracticeToolsCarousel(document)'), 'homepage app should mount the practice tools carousel behavior');
  assert.ok(practiceTools.includes('querySelectorAll("[data-practice-tools]")'), 'carousel behavior should attach to the outer shell instead of individual tools');
  assert.ok(practiceTools.includes('activePage.dataset.practiceToolName'), 'carousel behavior should read tool names from markup');
  assert.ok(practiceTools.includes('setProperty("--practice-tool-index"'), 'carousel behavior should drive horizontal track motion with a CSS variable');
  assert.ok(practiceTools.includes('pages.forEach'), 'carousel behavior should keep inactive pages mounted while toggling active state');

  assert.match(
    styles,
    /\.practice-tools-track\s*\{[^}]*display:\s*flex;[^}]*transform:\s*translate3d\(calc\(var\(--practice-tool-index,\s*0\) \* -100%\),\s*0,\s*0\);[^}]*transition:\s*transform 520ms cubic-bezier\(0\.22,\s*0\.72,\s*0\.18,\s*1\);/ ,
    'practice tools track should slide horizontally like the GuitarBook module'
  );
  assert.match(
    styles,
    /\.practice-tools-controls\s*\{[^}]*grid-template-columns:\s*44px minmax\(0,\s*1fr\) 44px;[^}]*margin:\s*22px auto 0;/,
    'practice tools controls should keep the GuitarBook round-button label layout'
  );
  assert.match(
    styles,
    /\.practice-tools-arrow\s*\{[^}]*border-radius:\s*999px;[^}]*background:\s*#fffdf8;[^}]*box-shadow:\s*0 8px 22px rgba\(23,\s*17,\s*11,\s*0\.12\);/,
    'practice tool arrows should use the clean cream circular GuitarBook treatment'
  );
  assert.match(
    styles,
    /\.practice-tools-section\.ukulele-tuner-section\s*\{[^}]*background:\s*#ffffff;/,
    'practice tools section should cover the pale green page tint with a clean white field behind the tuner'
  );
  assert.match(
    styles,
    /\.tools-choice-callout\s*\{[^}]*min-height:\s*118px;[^}]*margin:\s*0 auto -24px;/,
    'practice tools callout should sit above the tool carousel without adding a large spacer'
  );
  assert.match(
    styles,
    /\.tools-choice-callout-text\s*\{[^}]*top:\s*16px;[^}]*left:\s*82px;[^}]*font-size:\s*30px;[^}]*transform:\s*rotate\(-8deg\);/,
    'practice tools callout title should match the handwritten orange treatment'
  );
  assert.match(
    styles,
    /\.tools-choice-callout-arrow\s*\{[^}]*top:\s*48px;[^}]*left:\s*254px;[^}]*width:\s*174px;[^}]*height:\s*96px;/,
    'practice tools callout arrow should point from the title toward the carousel controls'
  );
});

test('homepage replaces the strum card with the GuitarBook celebrity zone', () => {
  const html = read('index.html');
  const styles = read('assets/styles.css');
  const app = read('assets/app.js');
  const scrollGalleryPath = 'assets/app/home/scroll-gallery.js';
  const scrollGallery = fs.existsSync(path.join(root, scrollGalleryPath)) ? read(scrollGalleryPath) : '';

  assert.equal(html.includes('扫弦卡'), false, 'old strum card callout should be removed');
  assert.equal(html.includes('strum notes'), false, 'old strum card label should be removed');
  assert.equal(html.includes('down · up · chuck'), false, 'old strum card content should be removed');
  const practiceToolsIndex = html.indexOf('<section class="ukulele-tuner-section section practice-tools-section"');
  const celebrityZoneIndex = html.indexOf('<section class="scroll-gallery-section" aria-label="明星专区" data-scroll-gallery>');
  const levelsIndex = html.indexOf('<section id="levels"');
  assert.ok(celebrityZoneIndex > practiceToolsIndex, 'celebrity zone should come after the practice tools section like the GuitarBook module follows its preceding feature');
  assert.ok(celebrityZoneIndex > -1 && celebrityZoneIndex < levelsIndex, 'celebrity zone should sit before the level path section');
  assert.equal(html.includes('celebrity-zone-showcase'), false, 'celebrity zone should not be constrained by the former half-card showcase class');
  assert.equal(html.includes('showcase-object celebrity-zone-showcase'), false, 'celebrity zone should not remain a product-row article');
  assert.ok(html.includes('>明星专区</p>'), 'celebrity zone should keep the handwritten orange title text');
  assert.ok(html.includes('class="gallery-choice-callout-arrow"'), 'celebrity zone should include the hand-drawn black curved arrow');
  assert.ok(html.includes('data-scroll-gallery'), 'celebrity zone should expose the scroll gallery hook');
  assert.ok(html.includes('data-scroll-gallery-wrapper'), 'celebrity zone should include the GuitarBook gallery wrapper');
  assert.ok(html.includes('data-scroll-gallery-column="1"'), 'celebrity zone should render the first image column mount');
  assert.ok(html.includes('data-scroll-gallery-column="4"'), 'celebrity zone should render the fourth image column mount');

  assert.ok(app.includes('import { initScrollGallery } from "./app/home/scroll-gallery.js?v=20260809-celebrity-zone-exact";'), 'homepage should import the uncached celebrity gallery behavior');
  assert.ok(app.includes('initScrollGallery(document)'), 'homepage should mount the celebrity gallery behavior');
  assert.equal((scrollGallery.match(/label: "Replaceable celebrity avatar/g) || []).length, 18, 'celebrity gallery should keep the GuitarBook 18 replaceable photo slots');
  assert.equal((scrollGallery.match(/src: "\.\/assets\/gallery\/celebrity-avatars\/celebrity-avatar-/g) || []).length, 18, 'celebrity gallery should point at local celebrity avatar assets');
  assert.ok(scrollGallery.includes('rail.className = "scroll-gallery-rail"'), 'celebrity gallery should build vertical image rails');
  assert.ok(scrollGallery.includes('const CRUISE_PROGRESS = 0.18'), 'celebrity gallery should keep the GuitarBook scroll threshold');
  assert.ok(scrollGallery.includes('function applyProgress(gallery, progress)'), 'celebrity gallery should keep the GuitarBook scroll-progress animation');
  assert.ok(scrollGallery.includes('gallery.classList.toggle("is-gallery-cruising", progress >= CRUISE_PROGRESS)'), 'celebrity gallery should cruise only after the GuitarBook scroll threshold');
  assert.ok(scrollGallery.includes('wrapper.addEventListener("scroll", readProgress'), 'celebrity gallery should use the GuitarBook internal scroll scene behavior');

  for (let index = 1; index <= 18; index += 1) {
    const base = `assets/gallery/celebrity-avatars/celebrity-avatar-${String(index).padStart(2, '0')}`;
    const exists = ['.jpg', '.jpeg', '.png'].some((ext) => fs.existsSync(path.join(root, `${base}${ext}`)));
    assert.ok(exists, `missing celebrity avatar asset ${base}`);
  }

  assert.match(
    styles,
    /\.scroll-gallery-section\s*\{[^}]*position:\s*relative;[^}]*width:\s*100%;[^}]*padding:\s*0;[^}]*background:\s*transparent;/,
    'celebrity zone section should not paint its own background'
  );
  assert.match(
    styles,
    /--page-clean-paper:\s*repeating-linear-gradient\(90deg,\s*rgba\(21,\s*48,\s*71,\s*0\.025\)\s*0 1px,\s*transparent 1px 36px\),\s*linear-gradient\(180deg,\s*#ffffff 0%,\s*#ffffff 100%\);/,
    'clean module paper should remove the colored diagonal page tint while keeping the vertical paper ruling'
  );
  assert.match(
    styles,
    /\.scroll-gallery-section::before,\s*\.levels-section::before,\s*\.lesson-section::before\s*\{[^}]*background:\s*var\(--page-clean-paper\);/,
    'celebrity, level, and lesson modules should cover the page tint with the same clean paper field'
  );
  assert.match(
    styles,
    /\.scroll-gallery-wrapper\s*\{[^}]*background:\s*transparent;/,
    'celebrity scroll wrapper should not reintroduce a module background'
  );
  assert.match(
    styles,
    /\.scroll-gallery-container\s*\{[^}]*background:\s*transparent;/,
    'celebrity scroll scene should stay transparent while scrolling'
  );
  assert.match(
    styles,
    /\.gallery-choice-callout-text\s*\{[^}]*color:\s*var\(--color-marker-orange\);[^}]*font-size:\s*28px;[^}]*transform:\s*rotate\(-8deg\);/,
    'celebrity zone title should match the GuitarBook handwritten orange callout'
  );
  assert.match(
    styles,
    /\.gallery-choice-callout-arrow\s*\{[^}]*stroke:\s*var\(--color-charcoal\);[^}]*stroke-width:\s*2;[^}]*transform:\s*rotate\(3deg\);/,
    'celebrity zone arrow should keep the black hand-drawn GuitarBook treatment'
  );
  assert.match(
    styles,
    /\.scroll-gallery-wrapper\s*\{[^}]*height:\s*100vh;[^}]*height:\s*100svh;[^}]*overflow-x:\s*hidden;[^}]*overflow-y:\s*auto;/,
    'celebrity zone should keep the GuitarBook viewport-tall scroll wrapper'
  );
  assert.match(
    styles,
    /\.scroll-gallery-container\s*\{[^}]*height:\s*600vh;/,
    'celebrity zone should keep the GuitarBook 600vh internal scroll scene'
  );
  assert.match(
    styles,
    /\.scroll-gallery-sticky\s*\{[^}]*position:\s*sticky;[^}]*top:\s*0;[^}]*height:\s*100vh;[^}]*height:\s*100svh;/,
    'celebrity zone should keep the GuitarBook sticky viewport composition'
  );
  assert.match(
    styles,
    /\.scroll-gallery-shadow-y\s*\{[^}]*box-shadow:\s*[^}]*rgba\(255,\s*255,\s*255,\s*0\.88\)[^}]*rgba\(255,\s*255,\s*255,\s*0\.72\)/,
    'celebrity vertical shadow mask should keep the white halo without painting a pale background'
  );
  assert.match(
    styles,
    /\.scroll-gallery-shadow-x\s*\{[^}]*box-shadow:\s*[^}]*rgba\(255,\s*255,\s*255,\s*0\.9\)[^}]*rgba\(255,\s*255,\s*255,\s*0\.86\)/,
    'celebrity horizontal shadow mask should keep the white halo without painting a pale background'
  );
  assert.doesNotMatch(
    styles,
    /\.scroll-gallery-shadow-[xy]\s*\{[^}]*var\(--color-cream-paper\)/,
    'celebrity halo masks should not use the page cream color as a background fill'
  );
  assert.match(
    styles,
    /\.scroll-gallery-matrix\s*\{[^}]*width:\s*120vw;[^}]*height:\s*150vh;[^}]*display:\s*flex;[^}]*rotateY\(var\(--gallery-rotate-y,\s*-45deg\)\)/,
    'celebrity zone should keep the GuitarBook oversized 3D photo matrix'
  );
  assert.match(
    styles,
    /\.scroll-gallery-column\s*\{[^}]*width:\s*22vw;[^}]*min-width:\s*200px;/,
    'celebrity zone should keep the GuitarBook column proportions'
  );
  assert.match(
    styles,
    /\.scroll-gallery-card\s*\{[^}]*height:\s*clamp\(200px,\s*24vw,\s*400px\);/,
    'celebrity cards should keep the GuitarBook image proportions'
  );
  assert.match(
    styles,
    /\.scroll-gallery-rail\s*\{[^}]*animation:\s*galleryVerticalCruise var\(--gallery-cruise-duration\) linear infinite;/,
    'celebrity image rails should keep the gentle vertical cruise motion'
  );
});

test('level section uses a handwritten standard exam repertoire callout', () => {
  const html = read('index.html');
  const styles = read('assets/styles.css');

  assert.equal(html.includes('level path'), false, 'old level path marker text should be removed from the level section');
  assert.equal(html.includes('从四弦入门到完整弹唱。'), false, 'old level section headline should be removed');
  assert.equal(html.includes('保留原模板的横向等级画廊和弹出式歌曲抽屉'), false, 'old level section explanatory copy should be removed');
  assert.ok(html.includes('class="gallery-choice-callout level-choice-callout"'), 'level section should use the handwritten callout shell');
  assert.ok(html.includes('class="gallery-choice-callout-text level-choice-callout-text"'), 'level section should use the handwritten orange title treatment');
  assert.ok(html.includes('>标准考级曲目</p>'), 'level section callout should use the requested title text');
  assert.ok(html.includes('class="gallery-choice-callout-arrow level-choice-callout-arrow"'), 'level section should include the hand-drawn curved arrow');
  assert.match(
    styles,
    /\.level-choice-callout\s*\{[^}]*min-height:\s*118px;[^}]*margin:\s*0 auto -8px;/,
    'level callout should keep the compact GuitarBook-style vertical spacing'
  );
  assert.match(
    styles,
    /\.level-choice-callout-text\s*\{[^}]*font-size:\s*30px;[^}]*transform:\s*rotate\(-8deg\);/,
    'level callout title should match the handwritten orange scale'
  );
  assert.match(
    styles,
    /\.level-choice-callout-arrow\s*\{[^}]*top:\s*36px;[^}]*left:\s*186px;[^}]*width:\s*166px;[^}]*height:\s*92px;/,
    'level callout arrow should point from the title toward the book carousel'
  );
  assert.match(
    styles,
    /\.levels-section\s*\{[^}]*position:\s*relative;[^}]*isolation:\s*isolate;[^}]*background:\s*transparent;/,
    'level section shell should stay transparent while its clean paper field removes the diagonal page tint'
  );
});

test('lesson section uses a handwritten teaching classroom callout', () => {
  const html = read('index.html');
  const styles = read('assets/styles.css');

  assert.equal(html.includes('lesson card'), false, 'old lesson marker text should be removed from the lesson section');
  assert.equal(html.includes('点一首歌，右侧就是课堂卡片。'), false, 'old lesson section headline should be removed');
  assert.equal(html.includes('原版课程详情卡继续保留'), false, 'old lesson explanatory copy should be removed');
  assert.ok(html.includes('class="gallery-choice-callout lesson-choice-callout"'), 'lesson section should use the handwritten callout shell');
  assert.ok(html.includes('class="gallery-choice-callout-text lesson-choice-callout-text"'), 'lesson section should use the handwritten orange title treatment');
  assert.ok(html.includes('>教学课堂</p>'), 'lesson section callout should use the requested title text');
  assert.ok(html.includes('class="gallery-choice-callout-arrow lesson-choice-callout-arrow"'), 'lesson section should include the hand-drawn curved arrow');
  assert.match(
    styles,
    /\.lesson-choice-callout\s*\{[^}]*min-height:\s*126px;[^}]*margin:\s*0 auto -12px;[^}]*justify-self:\s*stretch;[^}]*width:\s*100%;/,
    'lesson callout should keep the GuitarBook-style full-width header spacing before the lesson card'
  );
  assert.match(
    styles,
    /\.lesson-choice-callout-text\s*\{[^}]*top:\s*18px;[^}]*left:\s*46px;[^}]*font-size:\s*30px;[^}]*white-space:\s*nowrap;[^}]*writing-mode:\s*horizontal-tb;[^}]*transform:\s*rotate\(-8deg\);/,
    'lesson callout title should stay as a left-aligned horizontal handwritten orange label'
  );
  assert.match(
    styles,
    /\.lesson-choice-callout-arrow\s*\{[^}]*top:\s*42px;[^}]*left:\s*186px;[^}]*width:\s*166px;[^}]*height:\s*92px;/,
    'lesson callout arrow should point from the title toward the lesson card'
  );
  assert.match(
    styles,
    /\.lesson-section\s*\{[^}]*position:\s*relative;[^}]*isolation:\s*isolate;[^}]*background:\s*transparent;/,
    'lesson section shell should stay transparent while its clean paper field removes the diagonal page tint'
  );
  assert.match(
    styles,
    /\.scroll-gallery-section::before,\s*\.levels-section::before,\s*\.lesson-section::before\s*\{[^}]*background:\s*var\(--page-clean-paper\);/,
    'lesson section should share the same clean paper field as the gallery and level modules'
  );
});

test('homepage replaces the chord notebook slot with the rhythm chain game', () => {
  const html = read('index.html');
  const styles = read('assets/styles.css');
  const localRhythmGameSrc = './assets/rhythm-chain-game/index.html?v=20260722-ipad-scroll-reset';

  assert.ok(
    html.includes('class="showcase-object notebook-blue rhythm-game-showcase"'),
    'the former blue chord notebook slot should remain in the product row but become the rhythm game showcase'
  );
  assert.ok(
    html.includes(`src="${localRhythmGameSrc}"`),
    'the rhythm chain game should be embedded from the refreshed local dist build'
  );
  assert.ok(
    html.includes('style="width:430px;height:844px;border:0;max-width:100%;"'),
    'the embedded rhythm game iframe should keep the provided 430x844 install size'
  );
  assert.equal(html.includes('https://rhythm-chain-game.pages.dev/'), false, 'homepage should not point at the previous pinned online game release');
  assert.equal(html.includes('embed=showcase'), false, 'homepage should not reuse the old embedded-cache query');
  assert.ok(html.includes('title="节奏卡片游戏"'), 'the embedded game should have an accessible title');
  assert.equal(html.includes('<span>chord book</span>'), false, 'the old chord book card label should be removed');
  assert.equal(html.includes('C ? F ? G7 ? Am'), false, 'the old chord book chord sample should be removed');

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

test('rhythm game install uses the refreshed local dist copy', () => {
  const html = read('index.html');
  const gameHtml = read('assets/rhythm-chain-game/index.html');
  const gameApp = read('assets/rhythm-chain-game/assets/app.js');
  const gameStyles = read('assets/rhythm-chain-game/assets/styles.css');

  assert.ok(
    html.includes('./assets/rhythm-chain-game/index.html?v=20260722-ipad-scroll-reset'),
    'homepage should use the refreshed local rhythm game build'
  );
  assert.ok(gameHtml.includes('<main class="game-shell">'), 'local rhythm game HTML should be present');
  assert.ok(gameHtml.includes('./assets/styles.css?v=ipad-scroll-reset'), 'local rhythm game should bust cached iPad scroll styles');
  assert.ok(gameHtml.includes('./assets/app.js?v=ipad-scroll-reset'), 'local rhythm game should bust cached iPad scroll behavior');
  assert.ok(gameApp.includes('const storageKey = "rhythm-chain-game-progress-v1";'), 'local rhythm game app bundle should be present');
  assert.ok(gameApp.includes('function resetGameViewport()'), 'slot picker interactions should keep the embedded game viewport anchored');
  assert.ok(gameApp.includes('window.scrollTo({ top: 0, left: 0, behavior: "auto" });'), 'embedded game should restore its own scroll position after picker changes');
  assert.equal(gameApp.includes('selectors.slotPicker.scrollIntoView'), false, 'slot picker should not force-scroll the iframe on iPad');
  assert.match(
    gameStyles,
    /body\s*\{[^}]*overscroll-behavior-y:\s*none;/,
    'embedded rhythm game should not rubber-band the iframe body under iPad touch scrolling'
  );
  assert.match(
    gameStyles,
    /\.slot-picker-grid\s*\{[^}]*-webkit-overflow-scrolling:\s*touch;[^}]*overscroll-behavior:\s*auto;/,
    'slot picker should keep smooth local touch scrolling without trapping the page'
  );
  assert.equal(html.includes('?embed=showcase'), false, 'homepage should not reuse the old embedded query cache');
});

test('level cards use first-page covers for all nine ukulele books', () => {
  const html = read('index.html');
  const data = read('assets/data.js');
  const app = read('assets/app.js');
  const levelViews = read('assets/app/levels/level-views.js');
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
  assert.ok(levelViews.includes('has-book-cover'), 'level gallery cards with covers should be addressable for cover-specific styling');
  assert.ok(levelViews.includes('class="circular-cover-image"'), 'level gallery should render cover images');
  assert.match(
    levelViews,
    /class="circular-cover-image"[^>]*loading="eager"/,
    'level covers should load before carousel rotation'
  );
  assert.ok(levelViews.includes('data-level-gallery-prev'), 'level gallery should expose a previous slide control');
  assert.ok(levelViews.includes('data-level-gallery-next'), 'level gallery should expose a next slide control');
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
  assert.ok(html.includes('./assets/data.js?v=book-cover-cards-fit4-audio-player-photo-lanyard-row-clean-audio-title-scale-category-rhythm-game-panel-fit6-fixed-audio-progress-content-filter-song-category2-chong-er-fei-g2-huan-hua-cheng-feng-g5-summer-g3-hei-ren-tai-guan-g3-ai-de-luo-man-shi-g4-yue-liang-dai-biao-wo-de-xin-g3-tian-kong-zhi-cheng-du-zou-ban-g3'), 'homepage should bust cached level data');
  assert.ok(html.includes('./assets/app.js?v=book-cover-cards-fit4-audio-player-photo-lanyard-row-clean-audio-title-scale-category-rhythm-game-panel-fit6-fixed-audio-progress-content-filter-song-category2-chong-er-fei-g2-huan-hua-cheng-feng-g5-summer-g3-hei-ren-tai-guan-g3-ai-de-luo-man-shi-g4-yue-liang-dai-biao-wo-de-xin-g3-tian-kong-zhi-cheng-du-zou-ban-g3-tailark-hero-footer-master-accordion-swap-ukulelebook-gap-ipad-master-ratio-benefits-scale-lower6-celebrity-zone-exact'), 'homepage should bust cached level rendering preload');
  assert.match(
    html,
    /<link rel="stylesheet" href="\.\/assets\/styles\.css\?v=[^"]*lower17-clean-lesson-footer[^"]*"/,
    'homepage should bust cached cover styles'
  );
});

test('GuitarBook-style hero removes the pendant and keeps books on the right', () => {
  const html = read('index.html');
  const styles = read('assets/styles.css');
  const app = read('assets/app.js');
  const heroSearch = read('assets/app/home/hero-song-search.js');
  const heroScale = read('assets/app/home/tailark-hero-scale.js');
  const textPressure = read('assets/app/home/text-pressure.js');

  assert.equal(html.includes('id="heroLanyard"'), false, 'Tailark hero should not render the old hanging badge');
  assert.equal(html.includes('class="ukebook-logo-art"'), false, 'Tailark hero should not reserve the old pendant image');
  assert.ok(html.includes('class="tailark-visual-fade"'), 'hero should keep the same visual shell layering as the GuitarBook master');
  assert.ok(html.includes('data-fit-chars="11"'), 'UkuleleBook title should fit from its full eleven-letter brand name');
  assert.ok(app.includes('mountTailarkHeroScale(document, window)'), 'hero should mount the GuitarBook master scaling behavior');
  assert.ok(heroScale.includes('designWidth: 1228') && heroScale.includes('designHeight: 770'), 'hero scale should use the GuitarBook master design frame');
  assert.ok(textPressure.includes('dataset.fitChars') && textPressure.includes('visualCharCount'), 'title fitting should support the GuitarBook visual character count');
  assert.match(
    styles,
    /\.tailark-hero-stage\s*\{[^}]*width:\s*min\(100%,\s*1024px\);[^}]*min-height:\s*698px;[^}]*padding:\s*28px 0 0;/,
    'hero stage should match the GuitarBook master frame'
  );
  assert.match(
    styles,
    /\.tailark-hero-copy\s*\{[^}]*width:\s*min\(100%,\s*480px\);/,
    'left copy column should match the GuitarBook master width'
  );
  assert.match(
    styles,
    /\.tailark-visual-shell\s*\{[^}]*top:\s*22px;[^}]*left:\s*650px;[^}]*width:\s*728px;[^}]*height:\s*660px;/,
    'book accordion should sit in the same right-side coordinate system as the GuitarBook master'
  );
  assert.match(
    styles,
    /\.tailark-book-accordion\s*\{[^}]*top:\s*168px;[^}]*left:\s*578px;[^}]*width:\s*min\(588px,\s*calc\(100vw - 452px\)\);[^}]*min-width:\s*520px;[^}]*height:\s*360px;/,
    'featured book stack should move independently of the image carousel'
  );
  assert.match(
    styles,
    /@media \(max-width:\s*640px\)[\s\S]*?\.tailark-book-accordion\s*\{[^}]*position:\s*relative;[^}]*top:\s*auto;[^}]*left:\s*auto;[^}]*margin:\s*8px 16px 0;/,
    'mobile book stack should occupy its own slot before the benefit copy'
  );
  assert.match(
    styles,
    /@media \(max-width:\s*640px\)[\s\S]*?\.tailark-visual-shell\s*\{[^}]*height:\s*116px;[^}]*margin:\s*12px -16px 0;/,
    'mobile carousel shell should not keep the old accordion-sized blank space'
  );
  assert.match(
    styles,
    /\.tailark-carousel-row-mini\s*\{[^}]*top:\s*530px;[^}]*left:\s*-300px;[^}]*height:\s*116px;/,
    'mini cover strip should remain below the book stack on the right'
  );
  assert.match(
    styles,
    /@media \(max-width:\s*640px\)[\s\S]*?\.tailark-carousel-row-mini\s*\{[^}]*top:\s*0;[^}]*left:\s*-150px;[^}]*height:\s*96px;/,
    'mobile carousel strip should start at the top of its trimmed shell'
  );
  assert.match(
    styles,
    /@media \(min-width:\s*641px\) and \(max-width:\s*1227px\)[\s\S]*?\.hero\.tailark-hero\.is-tailark-scaled \.tailark-hero-stage\s*\{[^}]*width:\s*1024px;[^}]*min-height:\s*698px;/,
    'tablet and narrow desktop widths should scale the master layout instead of reflowing it'
  );
  assert.match(
    styles,
    /@media \(min-width:\s*641px\) and \(max-width:\s*1227px\)[\s\S]*?\.hero\.tailark-hero\.is-tailark-scaled \.text-pressure-title\.flex\s*\{[^}]*justify-content:\s*space-between;[^}]*gap:\s*0;/,
    'iPad hero title should use the GuitarBook wide pressure-title proportion'
  );
  assert.match(
    styles,
    /@media \(min-width:\s*641px\) and \(max-width:\s*1227px\)[\s\S]*?\.hero\.tailark-hero\.is-tailark-scaled \.tailark-principle-focus\s*\{[^}]*gap:\s*clamp\(28px,\s*3\.8vw,\s*52px\);/,
    'iPad hero focus row should keep the GuitarBook word spacing'
  );
  assert.match(
    styles,
    /@media \(min-width:\s*641px\) and \(max-width:\s*1227px\)[\s\S]*?\.hero\.tailark-hero\.is-tailark-scaled \.tailark-principle-focus \.true-focus-word\s*\{[^}]*min-height:\s*72px;[^}]*font-size:\s*clamp\(54px,\s*5\.8vw,\s*72px\);/,
    'iPad hero focus words should keep the GuitarBook word scale'
  );
  assert.match(
    styles,
    /@media \(min-width:\s*641px\) and \(max-width:\s*1227px\)[\s\S]*?\.hero\.tailark-hero\.is-tailark-scaled \.tailark-principle-focus \.true-focus-word:nth-child\(3\)\s*\{[^}]*transform:\s*translate\(clamp\(-410px,\s*-35vw,\s*-360px\),\s*clamp\(76px,\s*7vw,\s*92px\)\);/,
    'iPad Method word should sit on the GuitarBook lower focus line'
  );
  assert.match(
    styles,
    /@media \(min-width:\s*641px\) and \(max-width:\s*1227px\)[\s\S]*?\.hero\.tailark-hero\.is-tailark-scaled \.tailark-song-search-shell\s*\{[^}]*width:\s*min\(100%,\s*560px\);[^}]*margin-top:\s*88px;[^}]*margin-bottom:\s*38px;/,
    'iPad search bar should keep the GuitarBook spacing below the focus line'
  );
  assert.match(
    styles,
    /@media \(min-width:\s*641px\) and \(max-width:\s*1227px\)[\s\S]*?\.hero\.tailark-hero\.is-tailark-scaled \.tailark-book-accordion\s*\{[^}]*top:\s*168px;[^}]*left:\s*578px;[^}]*width:\s*min\(588px,\s*calc\(100vw - 452px\)\);[^}]*height:\s*360px;/,
    'iPad book accordion should keep the GuitarBook right-side coordinates and size'
  );
  assert.match(
    styles,
    /@media \(min-width:\s*641px\) and \(max-width:\s*1227px\)[\s\S]*?\.hero\.tailark-hero\.is-tailark-scaled \.tailark-carousel-row-mini\s*\{[^}]*top:\s*530px;[^}]*left:\s*-300px;[^}]*height:\s*116px;/,
    'iPad mini carousel should keep the GuitarBook bottom strip position'
  );
  assert.match(
    styles,
    /@media \(min-width:\s*641px\) and \(max-width:\s*1227px\)[\s\S]*?\.hero\.tailark-hero\.is-tailark-scaled \.tailark-typed-benefits\s*\{[^}]*margin-top:\s*88px;[^}]*font-size:\s*clamp\(22px,\s*2\.2vw,\s*26px\);[^}]*font-weight:\s*700;/,
    'iPad benefit copy should read larger and sit lower after the scaled master layout is applied'
  );
  assert.match(
    styles,
    /@media \(max-width:\s*640px\)[\s\S]*?\.tailark-links\s*\{[^}]*display:\s*none;/,
    'only phone widths should hide the reference navigation'
  );
  assert.match(
    styles,
    /@media \(max-width:\s*640px\)[\s\S]*?\.tailark-typed-benefits\s*\{[^}]*font-size:\s*15px;/,
    'phone benefit copy should keep the previously locked mobile scale'
  );
});
