(function () {
  const data = window.UKULELE_LEVEL_DATA;
  if (!data) return;

  const source = "Rockschool Ukulele 2020";
  const category = "\u548c\u5f26\u8282\u594f\u7ec3\u4e60";
  const levelNames = {
    debut: "Debut",
    g1: "Grade 1",
    g2: "Grade 2",
    g3: "Grade 3",
    g4: "Grade 4",
    g5: "Grade 5",
    g6: "Grade 6",
    g7: "Grade 7",
    g8: "Grade 8"
  };

  const extraLevels = [
    {
      id: "g6",
      label: "Level 6",
      order: 6,
      core: "Advanced solo phrasing and extended forms",
      boundary: "Upper-position reading, rhythmic control, and longer performance arcs.",
      techniques: ["advanced rhythm", "solo ukulele", "position work", "phrasing"],
      color: "#F59E0B"
    },
    {
      id: "g7",
      label: "Level 7",
      order: 7,
      core: "High-grade style command and expressive detail",
      boundary: "Complex syncopation, harmonic color, and confident stylistic interpretation.",
      techniques: ["syncopation", "style study", "harmony", "expression"],
      color: "#A78BFA"
    },
    {
      id: "g8",
      label: "Level 8",
      order: 8,
      core: "Advanced repertoire performance standard",
      boundary: "Extended arrangements with accuracy, stamina, tone, and musical intent.",
      techniques: ["extended form", "advanced technique", "tone control", "performance"],
      color: "#FB7185"
    }
  ];

  const rslPieces = [
    { id: "debut-rsl-demons", level: "debut", book: 0, title: "Demons", artist: "Imagine Dragons", pages: [10, 11] },
    { id: "debut-rsl-knockin-on-heavens-door", level: "debut", book: 0, title: "Knockin' On Heaven's Door", artist: "Bob Dylan", pages: [14, 15] },
    { id: "debut-rsl-lean-on-me", level: "debut", book: 0, title: "Lean On Me", artist: "Bill Withers", pages: [18, 19] },
    { id: "debut-rsl-marry-you", level: "debut", book: 0, title: "Marry You", artist: "Bruno Mars", pages: [22, 23, 24, 25] },
    { id: "debut-rsl-rolling-in-the-deep", level: "debut", book: 0, title: "Rolling In The Deep", artist: "Adele", pages: [28, 29, 30, 31] },
    { id: "debut-rsl-shake-it-off", level: "debut", book: 0, title: "Shake It Off", artist: "Taylor Swift", pages: [34, 35, 36, 37] },
    { id: "g1-rsl-stand-by-me", level: "g1", book: 1, title: "Stand By Me", artist: "Ben E. King", pages: [10, 11, 12, 13] },
    { id: "g1-rsl-im-yours", level: "g1", book: 1, title: "I'm Yours", artist: "Jason Mraz", pages: [16, 17, 18, 19] },
    { id: "g1-rsl-somewhere-over-the-rainbow", level: "g1", book: 1, title: "Somewhere Over The Rainbow", artist: "Israel Kamakawiwo'ole", pages: [22, 23, 24, 25] },
    { id: "g1-rsl-wild-world", level: "g1", book: 1, title: "Wild World", artist: "Cat Stevens", pages: [28, 29] },
    { id: "g1-rsl-send-my-love-to-your-new-lover", level: "g1", book: 1, title: "Send My Love (To Your New Lover)", artist: "Adele", pages: [32, 33] },
    { id: "g1-rsl-take-me-home", level: "g1", book: 1, title: "Take Me Home", artist: "Jess Glynne", pages: [36, 37] },
    { id: "g2-rsl-ziggy-stardust", level: "g2", book: 2, title: "Ziggy Stardust", artist: "David Bowie", pages: [10, 11, 12, 13] },
    { id: "g2-rsl-trouble", level: "g2", book: 2, title: "Trouble", artist: "Coldplay", pages: [16, 17, 18, 19] },
    { id: "g2-rsl-mr-brightside", level: "g2", book: 2, title: "Mr. Brightside", artist: "The Killers", pages: [22, 23, 24, 25] },
    { id: "g2-rsl-how-far-ill-go", level: "g2", book: 2, title: "How Far I'll Go", artist: "Lin-Manuel Miranda", pages: [28, 29, 30, 31] },
    { id: "g2-rsl-hold-back-the-river", level: "g2", book: 2, title: "Hold Back The River", artist: "James Bay", pages: [34, 35, 36, 37] },
    { id: "g2-rsl-happy", level: "g2", book: 2, title: "Happy", artist: "Pharrell Williams", pages: [40, 41, 42, 43] },
    { id: "g3-rsl-perfect", level: "g3", book: 3, title: "Perfect", artist: "Ed Sheeran", pages: [10, 11, 12, 13] },
    { id: "g3-rsl-viva-la-vida", level: "g3", book: 3, title: "Viva La Vida", artist: "Coldplay", pages: [16, 17, 18, 19, 20, 21, 22, 23] },
    { id: "g3-rsl-california-dreamin", level: "g3", book: 3, title: "California Dreamin'", artist: "The Mamas and The Papas", pages: [26, 27, 28, 29] },
    { id: "g3-rsl-jamming", level: "g3", book: 3, title: "Jamming", artist: "Bob Marley", pages: [32, 33, 34, 35] },
    { id: "g3-rsl-golden-touch", level: "g3", book: 3, title: "Golden Touch", artist: "Razorlight", pages: [38, 39, 40, 41] },
    { id: "g3-rsl-dreaming", level: "g3", book: 3, title: "Dreaming", artist: "Imelda May", pages: [44, 45] },
    { id: "g4-rsl-use-me", level: "g4", book: 4, title: "Use Me", artist: "Bill Withers", pages: [10, 11, 12, 13] },
    { id: "g4-rsl-let-her-go", level: "g4", book: 4, title: "Let Her Go", artist: "Passenger", pages: [16, 17] },
    { id: "g4-rsl-havana", level: "g4", book: 4, title: "Havana", artist: "Camila Cabello", pages: [20, 21, 22, 23] },
    { id: "g4-rsl-under-the-bridge", level: "g4", book: 4, title: "Under The Bridge", artist: "Red Hot Chili Peppers", pages: [26, 27, 28, 29] },
    { id: "g4-rsl-ghost-town", level: "g4", book: 4, title: "Ghost Town", artist: "The Specials", pages: [32, 33, 34, 35] },
    { id: "g4-rsl-me-and-julio-down-by-the-schoolyard", level: "g4", book: 4, title: "Me And Julio Down By The Schoolyard", artist: "Paul Simon", pages: [38, 39, 40, 41, 42, 43] },
    { id: "g5-rsl-hallelujah", level: "g5", book: 5, title: "Hallelujah", artist: "Jeff Buckley", pages: [10, 11, 12, 13] },
    { id: "g5-rsl-get-lucky", level: "g5", book: 5, title: "Get Lucky", artist: "Daft Punk ft. Pharrell Williams", pages: [16, 17, 18, 19] },
    { id: "g5-rsl-songbird", level: "g5", book: 5, title: "Songbird", artist: "Eva Cassidy", pages: [22, 23] },
    { id: "g5-rsl-wanted-dead-or-alive", level: "g5", book: 5, title: "Wanted Dead Or Alive", artist: "Bon Jovi", pages: [26, 27, 28, 29] },
    { id: "g5-rsl-enter-sandman", level: "g5", book: 5, title: "Enter Sandman", artist: "Metallica", pages: [32, 33, 34, 35] },
    { id: "g5-rsl-pick-up-the-pieces", level: "g5", book: 5, title: "Pick Up The Pieces", artist: "Average White Band", pages: [38, 39] },
    { id: "g6-rsl-eleanor-rigby", level: "g6", book: 6, title: "Eleanor Rigby", artist: "The Beatles", pages: [10, 11] },
    { id: "g6-rsl-fly-me-to-the-moon-in-other-words", level: "g6", book: 6, title: "Fly Me To The Moon (In Other Words)", artist: "Bart Howard", pages: [14, 15] },
    { id: "g6-rsl-no-one-knows", level: "g6", book: 6, title: "No One Knows", artist: "Queens of the Stone Age", pages: [18, 19, 20, 21, 22, 23] },
    { id: "g6-rsl-feeling-good", level: "g6", book: 6, title: "Feeling Good", artist: "Nina Simone", pages: [26, 27, 28, 29] },
    { id: "g6-rsl-a-thousand-years", level: "g6", book: 6, title: "A Thousand Years", artist: "From The Twilight Saga: Breaking Dawn - Part 2 (2012)", pages: [32, 33, 34, 35] },
    { id: "g6-rsl-hes-a-pirate", level: "g6", book: 6, title: "He's A Pirate", artist: "From Pirates of the Caribbean: The Curse of the Black Pearl (2003)", pages: [38, 39, 40, 41] },
    { id: "g7-rsl-if-i-aint-got-you", level: "g7", book: 7, title: "If I Ain't Got You", artist: "Alicia Keys", pages: [10, 11, 12, 13] },
    { id: "g7-rsl-satin-doll", level: "g7", book: 7, title: "Satin Doll", artist: "Lyle Ritz", pages: [16, 17] },
    { id: "g7-rsl-atlantis", level: "g7", book: 7, title: "Atlantis", artist: "Taimane Gardner", pages: [20, 21, 22, 23] },
    { id: "g7-rsl-what-is-hip", level: "g7", book: 7, title: "What Is Hip?", artist: "Tower Of Power", pages: [26, 27, 28, 29, 30, 31] },
    { id: "g7-rsl-toxicity", level: "g7", book: 7, title: "Toxicity", artist: "System Of A Down", pages: [34, 35, 36, 37, 38, 39] },
    { id: "g7-rsl-desafinado", level: "g7", book: 7, title: "Desafinado", artist: "Antonio Carlos Jobim", pages: [42, 43, 44, 45, 46, 47] },
    { id: "g8-rsl-bohemian-rhapsody", level: "g8", book: 8, title: "Bohemian Rhapsody", artist: "Queen", pages: [10, 11, 12, 13, 14, 15, 16, 17] },
    { id: "g8-rsl-fire", level: "g8", book: 8, title: "Fire", artist: "Taimane Gardner", pages: [20, 21, 22, 23, 24, 25] },
    { id: "g8-rsl-cinema-paradiso", level: "g8", book: 8, title: "Cinema Paradiso", artist: "Pat Metheny", pages: [28, 29, 30, 31] },
    { id: "g8-rsl-holier-than-thou", level: "g8", book: 8, title: "Holier Than Thou", artist: "Metallica", pages: [34, 35, 36, 37, 38, 39] },
    { id: "g8-rsl-rather-be", level: "g8", book: 8, title: "Rather Be", artist: "Clean Bandit", pages: [42, 43, 44, 45, 46, 47] },
    { id: "g8-rsl-spain", level: "g8", book: 8, title: "Spain", artist: "Chick Corea", pages: [50, 51, 52, 53] }
  ];

  const soloPieceIds = new Set([
    "g4-rsl-let-her-go",
    "g4-rsl-under-the-bridge",
    "g5-rsl-hallelujah",
    "g5-rsl-songbird",
    "g6-rsl-eleanor-rigby",
    "g6-rsl-hes-a-pirate",
    "g7-rsl-if-i-aint-got-you",
    "g7-rsl-satin-doll",
    "g8-rsl-bohemian-rhapsody",
    "g8-rsl-fire"
  ]);

  const audioVersions = (piece) => {
    const basePath = `./assets/audio/rockschool/ukulele/${piece.level}/${piece.id}`;
    if (soloPieceIds.has(piece.id)) {
      return [{ title: "Solo performance", src: `${basePath}/solo.mp3` }];
    }
    return [
      { title: "Full mix", src: `${basePath}/full.mp3` },
      { title: "Backing track", src: `${basePath}/backing.mp3` }
    ];
  };

  const scoreImages = (piece) =>
    piece.pages.map((page, index) => ({
      title: `${piece.title} score page ${index + 1}`,
      src: `./assets/scores/ukulele/${piece.id}/score-${String(index + 1).padStart(2, "0")}.png`,
      sourcePdfPage: page
    }));

  const makeRslSong = (piece) => {
    const levelName = levelNames[piece.level] || piece.level.toUpperCase();
    const teaching = {
      goal: `${levelName} Rockschool performance piece: read the mapped score pages accurately and keep a steady musical pulse.`,
      focus: "Use the formal score pages only; source-book fact files, blank pages, tests, and marking notes are excluded from the lesson asset.",
      practiceOrder: ["Read the form and repeats", "Count the rhythm slowly", "Practice phrase by phrase", "Play through with steady tempo"],
      commonIssues: ["Skipping repeats or endings", "Letting page turns break the pulse", "Reading tab without checking rhythm"],
      passStandard: "Perform the mapped score pages with accurate rhythm, clear tone, and controlled phrasing."
    };

    return {
      id: piece.id,
      title: piece.title,
      artist: piece.artist,
      level: piece.level,
      source,
      sourceBook: `Rockschool Ukulele ${levelName}`,
      sourcePdf: `${piece.book}.pdf`,
      sourcePdfPages: piece.pages,
      category,
      style: "Rockschool grade piece",
      techniques: ["score reading", "ukulele tab", "performance piece"],
      goal: teaching.goal,
      focus: teaching.focus,
      practiceOrder: teaching.practiceOrder,
      commonIssues: teaching.commonIssues,
      passStandard: teaching.passStandard,
      audio: audioVersions(piece),
      scoreImages: scoreImages(piece),
      teaching
    };
  };

  const knownLevelIds = new Set(data.levels.map((level) => level.id));
  extraLevels.forEach((level) => {
    if (!knownLevelIds.has(level.id)) data.levels.push(level);
  });
  data.levels.sort((a, b) => a.order - b.order);

  const knownSongIds = new Set(data.songs.map((song) => song.id));
  data.songs.push(...rslPieces.filter((piece) => !knownSongIds.has(piece.id)).map(makeRslSong));
})();
