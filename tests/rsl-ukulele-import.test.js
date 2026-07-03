import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

function loadData() {
  const files = ['assets/data.js', 'assets/rsl-ukulele-data.js'];
  const context = { window: {} };
  vm.createContext(context);
  for (const file of files) {
    if (!fs.existsSync(path.join(root, file))) continue;
    const code = fs.readFileSync(path.join(root, file), 'utf8');
    vm.runInContext(code, context, { filename: file });
  }
  return context.window.UKULELE_LEVEL_DATA;
}

test('Rockschool ukulele books are imported as score-backed songs', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  assert.ok(
    html.includes('assets/rsl-ukulele-data.js?v=rockschool-ukulele-chord-rhythm-category'),
    'homepage should load the latest Rockschool data'
  );

  const data = loadData();
  const levelIds = data.levels.map((level) => level.id);
  const expectedLevels = ['debut', 'g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7', 'g8'];

  for (const levelId of expectedLevels) {
    assert.ok(levelIds.includes(levelId), `missing level ${levelId}`);
  }

  const rslSongs = data.songs.filter((song) => song.source === 'Rockschool Ukulele 2020');
  assert.equal(rslSongs.length, 54, 'expected six Rockschool songs for each of nine books');

  for (const levelId of expectedLevels) {
    const songsForLevel = rslSongs.filter((song) => song.level === levelId);
    assert.equal(songsForLevel.length, 6, `expected six Rockschool songs for ${levelId}`);
  }

  for (const song of rslSongs) {
    assert.ok(song.id.startsWith(`${song.level}-rsl-`), `unexpected Rockschool id: ${song.id}`);
    assert.equal(song.category, '和弦节奏练习', `unexpected Rockschool category for ${song.id}`);
    assert.ok(song.scoreImages.length > 0, `missing score images for ${song.id}`);
    for (const image of song.scoreImages) {
      assert.match(image.src, /^\.\/assets\/scores\/ukulele\/[^/]+\/score-\d{2}\.png$/);
      assert.equal(path.isAbsolute(image.src), false, `absolute score path leaked for ${song.id}`);
      const assetPath = image.src.replace(/^\.\//, '');
      assert.ok(fs.existsSync(path.join(root, assetPath)), `missing score asset ${assetPath}`);
    }
  }
});

test('Rockschool ukulele grade pieces expose copied project-relative audio only', () => {
  const data = loadData();
  const rslSongs = data.songs.filter((song) => song.source === 'Rockschool Ukulele 2020');
  const expectedSingleTrackSongs = new Set([
    'g4-rsl-let-her-go',
    'g4-rsl-under-the-bridge',
    'g5-rsl-hallelujah',
    'g5-rsl-songbird',
    'g6-rsl-eleanor-rigby',
    'g6-rsl-hes-a-pirate',
    'g7-rsl-if-i-aint-got-you',
    'g7-rsl-satin-doll',
    'g8-rsl-bohemian-rhapsody',
    'g8-rsl-fire',
  ]);

  assert.equal(rslSongs.length, 54, 'expected Rockschool songs to be loaded before checking audio');

  for (const song of rslSongs) {
    const expectedCount = expectedSingleTrackSongs.has(song.id) ? 1 : 2;
    assert.equal(song.audio.length, expectedCount, `unexpected audio version count for ${song.id}`);

    for (const item of song.audio) {
      assert.match(item.src, /^\.\/assets\/audio\/rockschool\/ukulele\/(?:debut|g[1-8])\/[^/]+\/(?:full|backing|solo)\.mp3$/);
      assert.equal(path.isAbsolute(item.src), false, `absolute audio path leaked for ${song.id}`);
      assert.doesNotMatch(item.src, /(?:^|[/:\\])(?:slow|slower|practice|practise|0\.75|0\.85|75%|85%)(?:[/:\\.]|$)/i);
      assert.ok(fs.existsSync(path.join(root, item.src.replace(/^\.\//, ''))), `missing audio asset ${item.src}`);
    }
  }

  const serialized = JSON.stringify(data);
  assert.doesNotMatch(serialized, /(?:[A-Z]:[\\/]|file:\/\/)/, 'catalog data should not expose machine-local paths');
  assert.doesNotMatch(serialized, /audio-placeholders|slow-practice/i, 'catalog data should not expose placeholder or slow-practice audio');
});
