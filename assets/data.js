(function () {
  const levels = [
    {
      id: "debut",
      label: "Starter",
      order: 0,
      core: "Open-string rhythm and first chords",
      boundary: "C, Am, F, and G7 with a steady four-count pulse.",
      techniques: ["open chords", "down strum", "4/4", "steady pulse"],
      color: "#FFD166"
    },
    {
      id: "g1",
      label: "Level 1",
      order: 1,
      core: "Basic chord changes and sing-along strumming",
      boundary: "Clean C-F-G-Am changes without stopping the beat.",
      techniques: ["chord change", "C-F-G", "sing and strum", "mute"],
      color: "#5CC8FF"
    },
    {
      id: "g2",
      label: "Level 2",
      order: 2,
      core: "Down-up strumming and simple rhythmic accents",
      boundary: "Eighth-note strums, basic chucking, and weak-beat entries.",
      techniques: ["down-up", "chuck", "8th strum", "syncopation"],
      color: "#7CF6A3"
    },
    {
      id: "g3",
      label: "Level 3",
      order: 3,
      core: "Fingerpicking patterns and simple melody work",
      boundary: "Thumb and finger separation with melody plus chord shapes.",
      techniques: ["fingerpicking", "arpeggio", "melody", "position"],
      color: "#FF8FAB"
    },
    {
      id: "g4",
      label: "Level 4",
      order: 4,
      core: "Style strums and dynamic control",
      boundary: "Folk, reggae, ballad, and swing-feel accompaniment basics.",
      techniques: ["reggae chop", "folk strum", "dynamics", "swing"],
      color: "#B8F35A"
    },
    {
      id: "g5",
      label: "Level 5",
      order: 5,
      core: "Fingerstyle performance and position shifts",
      boundary: "Short performance pieces combining melody, bass, and harmony.",
      techniques: ["fingerstyle", "position shift", "bass note", "performance"],
      color: "#2DD4BF"
    }
  ];

  const songs = [
    makeSong({
      id: "sunny-strum",
      title: "Sunny Strum",
      artist: "Ukulele Template",
      level: "debut",
      source: "Ukulele Starter Pack",
      category: "弹唱",
      style: "Pop",
      techniques: ["open chords", "down strum", "steady pulse"],
      goal: "Build a steady four-count pulse with C and Am.",
      focus: "Right-hand consistency before adding more chords.",
      practiceOrder: ["Count out loud", "Strum open strings", "Hold C for 8 bars", "Change C to Am"],
      commonIssues: ["Rushing the right hand", "Pressing too far from the fret", "Stopping before chord changes"],
      passStandard: "Play 16 bars at 60 BPM without losing the beat."
    }),
    makeSong({
      id: "little-island",
      title: "Little Island",
      artist: "Ukulele Template",
      level: "g1",
      source: "Ukulele Starter Pack",
      category: "弹唱",
      style: "Folk Pop",
      techniques: ["chord change", "C-F-G", "sing and strum"],
      goal: "Connect C, F, G, and Am in a classroom song form.",
      focus: "Small left-hand movement and no pauses between chords.",
      practiceOrder: ["Shape F alone", "Loop C to F", "Add G", "Sing while keeping the strum"],
      commonIssues: ["Collapsed first finger on F", "Right hand stopping while singing", "Oversized G shape"],
      passStandard: "Complete one verse and chorus with a simplified strum."
    }),
    makeSong({
      id: "coffee-chuck",
      title: "Coffee Chuck",
      artist: "Ukulele Template",
      level: "g2",
      source: "Rhythm Pack",
      category: "原创练习",
      style: "Acoustic Pop",
      techniques: ["down-up", "chuck", "8th strum"],
      goal: "Place a light chuck inside an eighth-note strumming pattern.",
      focus: "Keep the strum relaxed while muting cleanly.",
      practiceOrder: ["Down-up on open strings", "Add chuck on beat 2", "Loop C-Am-F-G", "Play with a metronome"],
      commonIssues: ["Chucking too hard", "Missing up-strums", "Memorizing hands without hearing the pulse"],
      passStandard: "Hold the pattern at 80 BPM with a clear chuck."
    }),
    makeSong({
      id: "rainy-window",
      title: "Rainy Window",
      artist: "Ukulele Template",
      level: "g3",
      source: "Finger Pack",
      category: "原创练习",
      style: "Ballad",
      techniques: ["fingerpicking", "arpeggio", "melody"],
      goal: "Separate bass notes from a simple top-line melody.",
      focus: "Right-hand assignment and melody balance.",
      practiceOrder: ["Assign thumb and fingers", "Play bass alone", "Play melody alone", "Combine both layers"],
      commonIssues: ["Bass covering the melody", "Fingers flying too far away", "Uneven arpeggios"],
      passStandard: "The melody stays clear while the bass remains steady."
    }),
    makeSong({
      id: "harbor-reggae",
      title: "Harbor Reggae",
      artist: "Ukulele Template",
      level: "g4",
      source: "Style Pack",
      category: "弹唱",
      style: "Reggae",
      techniques: ["reggae chop", "syncopation", "mute"],
      goal: "Understand offbeat entrances and left-hand muting.",
      focus: "Short, clean chord attacks on the offbeat.",
      practiceOrder: ["Clap beats 2 and 4", "Mute with the left hand", "Add chord shapes", "Loop with a metronome"],
      commonIssues: ["Playing too much on the downbeat", "Messy muting", "Not feeling the body pulse"],
      passStandard: "Offbeats are clear, short, and consistent."
    }),
    makeSong({
      id: "tiny-waltz",
      title: "Tiny Waltz",
      artist: "Ukulele Template",
      level: "g5",
      source: "Performance Pack",
      category: "原创练习",
      style: "Waltz",
      techniques: ["fingerstyle", "bass note", "position shift"],
      goal: "Combine bass, harmony, and melody in a short performance piece.",
      focus: "Three-beat flow and smooth position movement.",
      practiceOrder: ["Play bass line", "Play melody line", "Add harmony notes", "Perform slowly from start to finish"],
      commonIssues: ["Unclear waltz accent", "Sound gaps during shifts", "Short melody note values"],
      passStandard: "Perform the whole piece with a clear three-beat feel."
    })
  ];

  function makeSong(song) {
    return {
      ...song,
      audio: [],
      scoreImages: [],
      teaching: {
        goal: song.goal,
        focus: song.focus,
        practiceOrder: song.practiceOrder,
        commonIssues: song.commonIssues,
        passStandard: song.passStandard
      }
    };
  }

  window.UKULELE_LEVEL_DATA = { levels, songs };
})();
