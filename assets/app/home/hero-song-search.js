import { escapeAttribute, escapeHtml } from "../shared/escape.js";

function normalize(value) {
  return String(value || "").toLowerCase().trim();
}

export function mountHeroSongSearch({
  els,
  visibleSongs,
  levelById,
  selectSong,
  setQuery,
  documentRef = document
}) {
  if (!els.heroSongSearchForm || !els.heroSongSearchInput || !els.heroSongSearchResults) return;
  if (els.heroSongSearchForm.dataset.heroSongSearchMounted === "true") return;

  let currentMatches = [];

  const getHeroSearchMatches = (query) => {
    const value = normalize(query);
    const songs = visibleSongs();
    if (!value) return songs.slice(0, 6);
    return songs
      .filter((song) => {
        const level = levelById[song.level];
        return [
          song.title,
          song.artist,
          song.style,
          song.category,
          song.source,
          level?.label,
          ...(song.techniques || [])
        ]
          .map(normalize)
          .join(" ")
          .includes(value);
      })
      .slice(0, 6);
  };

  const hideHeroSongSearchResults = () => {
    els.heroSongSearchResults.hidden = true;
    els.heroSongSearchResults.innerHTML = "";
  };

  const renderHeroSongSearchResults = (matches, query) => {
    const hasQuery = normalize(query).length > 0;
    if (!hasQuery && !matches.length) {
      hideHeroSongSearchResults();
      return;
    }
    els.heroSongSearchResults.hidden = false;
    els.heroSongSearchResults.innerHTML = matches.length
      ? matches
          .map((song) => {
            const level = levelById[song.level];
            const levelLabel = level ? level.label : "Level";
            return `
              <button type="button" class="tailark-song-result" role="option" data-hero-song="${escapeAttribute(song.id)}">
                <span class="tailark-song-result-title">${escapeHtml(song.title)}</span>
                <span class="tailark-song-result-meta">${escapeHtml(song.artist || "Ukulele lesson")} · ${escapeHtml(levelLabel)}</span>
              </button>
            `;
          })
          .join("")
      : `<p class="tailark-song-search-empty">No songs found.</p>`;
  };

  const selectHeroSong = (songId, shouldScroll = true) => {
    const song = visibleSongs().find((item) => item.id === songId);
    if (!song) return;
    els.heroSongSearchInput.value = song.title;
    hideHeroSongSearchResults();
    selectSong(song.id, shouldScroll);
  };

  const updateResults = () => {
    currentMatches = getHeroSearchMatches(els.heroSongSearchInput.value);
    renderHeroSongSearchResults(currentMatches, els.heroSongSearchInput.value);
  };

  els.heroSongSearchInput.addEventListener("input", updateResults);
  els.heroSongSearchInput.addEventListener("focus", updateResults);
  els.heroSongSearchInput.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      hideHeroSongSearchResults();
      els.heroSongSearchInput.blur();
    }
  });

  els.heroSongSearchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const firstMatch = currentMatches[0] || getHeroSearchMatches(els.heroSongSearchInput.value)[0];
    if (firstMatch) {
      selectHeroSong(firstMatch.id, true);
      return;
    }
    setQuery(els.heroSongSearchInput.value, true);
  });

  els.heroSongSearchResults.addEventListener("click", (event) => {
    const button = event.target.closest("[data-hero-song]");
    if (!button) return;
    selectHeroSong(button.dataset.heroSong, true);
  });

  documentRef.addEventListener("click", (event) => {
    if (!event.target.closest(".tailark-song-search-shell")) hideHeroSongSearchResults();
  });

  els.heroSongSearchForm.dataset.heroSongSearchMounted = "true";
}
