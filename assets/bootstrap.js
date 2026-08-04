import { loadCatalog } from "./catalog-runtime.js?v=dual-channel-content-api";

const staticData = window.UKULELE_LEVEL_DATA || { levels: [], songs: [] };
const appVersion = "book-cover-cards-fit4-audio-player-photo-lanyard-row-clean-audio-title-scale-category-rhythm-game-panel-fit6-fixed-audio-progress-content-filter-song-category2-chong-er-fei-g2-huan-hua-cheng-feng-g5-summer-g3-hei-ren-tai-guan-g3-ai-de-luo-man-shi-g4-yue-liang-dai-biao-wo-de-xin-g3-tian-kong-zhi-cheng-du-zou-ban-g3-tailark-hero-footer-master-accordion-swap-ukulelebook-gap-ipad-master-ratio-benefits-scale-lower4";

try {
  const result = await loadCatalog({ staticData });
  window.UKULELE_LEVEL_DATA = result.catalog;
  window.UKEBOOK_CATALOG_SOURCE = result.source;
  if (result.error) {
    console.warn("UkuleleBook dynamic catalog unavailable; using cached or static catalog.", result.error);
  }
} catch (error) {
  window.UKULELE_LEVEL_DATA = staticData;
  window.UKEBOOK_CATALOG_SOURCE = "static";
  console.warn("UkuleleBook catalog bootstrap failed; using static catalog.", error);
}

await import(`./app.js?v=${appVersion}`);
