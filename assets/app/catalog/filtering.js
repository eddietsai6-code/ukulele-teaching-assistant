function normalize(value) {
  return String(value || "").toLowerCase().trim();
}

export function matchesSongQuery(song, query, levelById = {}) {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return true;
  const level = levelById[song.level] || {};
  const teaching = song.teaching || {};
  const haystack = [
    song.title,
    song.artist,
    song.style,
    song.source,
    song.category,
    level.label,
    level.name,
    teaching.goal,
    teaching.focus,
    ...(teaching.practiceOrder || []),
    ...(teaching.commonIssues || []),
    teaching.passStandard,
    ...(song.techniques || [])
  ]
    .map(normalize)
    .join(" ");
  return haystack.includes(normalizedQuery);
}

export function filterSongs({ songs, levels, query = "", level = "all", source = "all", category = "all" }) {
  const levelById = Object.fromEntries((levels || []).map((item) => [item.id, item]));
  return [...(songs || [])]
    .filter((song) => level === "all" || song.level === level)
    .filter((song) => source === "all" || song.source === source)
    .filter((song) => category === "all" || song.category === category)
    .filter((song) => matchesSongQuery(song, query, levelById))
    .sort((a, b) => {
      const levelDiff = (levelById[a.level]?.order || 0) - (levelById[b.level]?.order || 0);
      if (levelDiff !== 0) return levelDiff;
      return a.title.localeCompare(b.title, "zh-CN");
    });
}
