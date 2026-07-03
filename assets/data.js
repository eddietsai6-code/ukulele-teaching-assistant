(function () {
  const levels = [
    {
      id: "debut",
      label: "Debut",
      order: 0,
      core: "Open-string rhythm and first chords",
      boundary: "C, Am, F, and G7 with a steady four-count pulse.",
      techniques: ["open chords", "down strum", "4/4", "steady pulse"],
      color: "#FFD166",
      coverImage: "./assets/covers/ukulele-books/book-0-cover.png"
    },
    {
      id: "g1",
      label: "Level 1",
      order: 1,
      core: "Basic chord changes and sing-along strumming",
      boundary: "Clean C-F-G-Am changes without stopping the beat.",
      techniques: ["chord change", "C-F-G", "sing and strum", "mute"],
      color: "#5CC8FF",
      coverImage: "./assets/covers/ukulele-books/book-1-cover.png"
    },
    {
      id: "g2",
      label: "Level 2",
      order: 2,
      core: "Down-up strumming and simple rhythmic accents",
      boundary: "Eighth-note strums, basic chucking, and weak-beat entries.",
      techniques: ["down-up", "chuck", "8th strum", "syncopation"],
      color: "#7CF6A3",
      coverImage: "./assets/covers/ukulele-books/book-2-cover.png"
    },
    {
      id: "g3",
      label: "Level 3",
      order: 3,
      core: "Fingerpicking patterns and simple melody work",
      boundary: "Thumb and finger separation with melody plus chord shapes.",
      techniques: ["fingerpicking", "arpeggio", "melody", "position"],
      color: "#FF8FAB",
      coverImage: "./assets/covers/ukulele-books/book-3-cover.png"
    },
    {
      id: "g4",
      label: "Level 4",
      order: 4,
      core: "Style strums and dynamic control",
      boundary: "Folk, reggae, ballad, and swing-feel accompaniment basics.",
      techniques: ["reggae chop", "folk strum", "dynamics", "swing"],
      color: "#B8F35A",
      coverImage: "./assets/covers/ukulele-books/book-4-cover.png"
    },
    {
      id: "g5",
      label: "Level 5",
      order: 5,
      core: "Fingerstyle performance and position shifts",
      boundary: "Short performance pieces combining melody, bass, and harmony.",
      techniques: ["fingerstyle", "position shift", "bass note", "performance"],
      color: "#2DD4BF",
      coverImage: "./assets/covers/ukulele-books/book-5-cover.png"
    },
    {
      id: "g6",
      label: "Level 6",
      order: 6,
      core: "Extended harmony and confident groove control",
      boundary: "Move through richer voicings, syncopated figures, and longer forms.",
      techniques: ["extended chords", "groove control", "syncopation", "tone"],
      color: "#FFD166",
      coverImage: "./assets/covers/ukulele-books/book-6-cover.png"
    },
    {
      id: "g7",
      label: "Level 7",
      order: 7,
      core: "Advanced fingerstyle textures and ensemble awareness",
      boundary: "Balance melody, harmony, and accompaniment with polished transitions.",
      techniques: ["advanced fingerstyle", "voice leading", "ensemble", "phrasing"],
      color: "#5CC8FF",
      coverImage: "./assets/covers/ukulele-books/book-7-cover.png"
    },
    {
      id: "g8",
      label: "Level 8",
      order: 8,
      core: "Performance-level repertoire and expressive arranging",
      boundary: "Shape complete performances with confident dynamics and articulation.",
      techniques: ["arranging", "performance", "dynamics", "articulation"],
      color: "#7CF6A3",
      coverImage: "./assets/covers/ukulele-books/book-8-cover.png"
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
      id: "debut-xiao-xing-xing",
      title: "小星星",
      artist: "Traditional",
      level: "debut",
      source: "用户上传曲谱",
      category: "旋律练习",
      style: "Nursery melody",
      techniques: ["C major scale", "quarter note", "half note", "melody tab"],
      goal: "认识C调音阶，认识4分音符与2分音符。",
      focus: "用C调音阶位置读谱，并区分4分音符与2分音符的时值。",
      practiceOrder: ["唱名读谱", "拍读4分音符与2分音符", "慢速弹奏TAB", "跟80 BPM稳定完成全曲"],
      commonIssues: ["2分音符时值不够", "相同音连续弹奏时节拍不稳", "只看数字不唱音阶"],
      passStandard: "能在80 BPM稳定弹完整曲，并说出4分音符与2分音符的区别。",
      audio: [
        {
          title: "小星星 音频",
          src: "./assets/audio/ukulele/debut-xiao-xing-xing/full.mp3"
        }
      ],
      scoreImages: [
        {
          title: "小星星 谱面 1",
          src: "./assets/scores/ukulele/debut-xiao-xing-xing/score-01.png"
        },
        {
          title: "小星星 简谱版",
          src: "./assets/scores/ukulele/debut-xiao-xing-xing/score-02.png"
        }
      ]
    }),
    makeSong({
      id: "debut-kang-kang-wu-qu-cancan",
      title: "康康舞曲 Cancan",
      artist: "Jacques Offenbach",
      level: "debut",
      source: "用户上传曲谱",
      category: "旋律练习",
      style: "Classical melody",
      techniques: ["C major scale", "quarter note", "half note", "melody tab"],
      goal: "认识C调音阶，认识4分音符与2分音符。",
      focus: "用C调音阶位置读谱，并区分4分音符与2分音符的时值。",
      practiceOrder: ["唱名读谱", "拍读4分音符与2分音符", "慢速分句弹奏TAB", "跟160 BPM稳定完成全曲"],
      commonIssues: ["2分音符时值不够", "Do-Re-Fa-Mi-Re 乐句回弹不稳", "速度变快后只看数字不唱音阶"],
      passStandard: "能在160 BPM稳定弹完整曲，并说出4分音符与2分音符的区别。",
      audio: [
        {
          title: "康康舞曲 Cancan 音频",
          src: "./assets/audio/ukulele/debut-kang-kang-wu-qu-cancan/full.mp3"
        }
      ],
      scoreImages: [
        {
          title: "康康舞曲 Cancan 谱面 1",
          src: "./assets/scores/ukulele/debut-kang-kang-wu-qu-cancan/score-01.png"
        },
        {
          title: "康康舞曲 Cancan 简谱版",
          src: "./assets/scores/ukulele/debut-kang-kang-wu-qu-cancan/score-02.png"
        }
      ]
    }),
    makeSong({
      id: "debut-c-diao-yin-jie",
      title: "C 调音阶",
      artist: "乐音树艺术教育",
      level: "debut",
      source: "用户上传曲谱",
      category: "音阶练习",
      style: "Scale exercise",
      techniques: ["C major scale", "quarter note", "half note", "melody tab"],
      goal: "认识C调音阶，建立Do到高音Do的指板位置。",
      focus: "按唱名找到C调音阶在TAB上的位置，并保持4分音符与2分音符的时值稳定。",
      practiceOrder: ["唱名读谱", "上行音阶慢速弹奏", "下行音阶慢速弹奏", "跟80 BPM稳定完成全曲"],
      commonIssues: ["Sol与高音Do位置混淆", "2分音符保持不够", "下行音阶换音时节拍不稳"],
      passStandard: "能在80 BPM稳定弹完整条音阶，并说出C调音阶每个唱名的位置。",
      audio: [
        {
          title: "C 调音阶 音频",
          src: "./assets/audio/ukulele/debut-c-diao-yin-jie/full.mp3"
        }
      ],
      scoreImages: [
        {
          title: "C 调音阶 谱面 1",
          src: "./assets/scores/ukulele/debut-c-diao-yin-jie/score-01.png"
        }
      ]
    }),
    makeSong({
      id: "g1-yin-yue-zhi-sheng",
      title: "音乐之声",
      artist: "Richard Rodgers",
      level: "g1",
      source: "用户上传曲谱",
      category: "旋律练习",
      style: "Musical melody",
      techniques: ["eighth note", "C major scale", "dotted note", "melody tab"],
      goal: "掌握八分音符，C调音阶，附点音符。",
      focus: "在C调音阶中读准旋律位置，并把八分音符与附点音符的时值弹稳定。",
      practiceOrder: ["唱名读谱", "拍读八分音符组合", "单独练习附点节奏", "跟120 BPM分句完成全曲"],
      commonIssues: ["八分音符连接不均匀", "附点音符拖拍或抢拍", "换到高音位置时忘记唱名"],
      passStandard: "能在120 BPM稳定弹完整曲，并说明八分音符和附点音符的时值关系。",
      audio: [
        {
          title: "音乐之声 音频",
          src: "./assets/audio/ukulele/g1-yin-yue-zhi-sheng/full.mp3"
        }
      ],
      scoreImages: [
        {
          title: "音乐之声 谱面 1",
          src: "./assets/scores/ukulele/g1-yin-yue-zhi-sheng/score-01.png"
        },
        {
          title: "音乐之声 简谱版",
          src: "./assets/scores/ukulele/g1-yin-yue-zhi-sheng/score-02.png"
        }
      ]
    }),
    makeSong({
      id: "g1-f-diao-yin-jie",
      title: "F调音阶",
      artist: "乐音树艺术教育",
      level: "g1",
      source: "用户上传曲谱",
      category: "音阶练习",
      style: "Scale exercise",
      techniques: ["F major scale", "quarter note", "half note", "melody tab"],
      goal: "认识F调音阶，熟悉F调中Do到高音Do的指板位置。",
      focus: "从F调Do开始读准TAB位置，练习一升一降的音阶走向和稳定节拍。",
      practiceOrder: ["唱名读谱", "上行音阶慢速弹奏", "下行音阶慢速弹奏", "跟98 BPM稳定完成全条音阶"],
      commonIssues: ["F调Do位置和C调Do混淆", "下行时Sol与Fa换音不稳", "高音Do收尾时二分音符时值不够"],
      passStandard: "能在98 BPM稳定弹完整条音阶，并说出F调Do、Fa和高音Do的位置。",
      audio: [
        {
          title: "F调音阶 音频",
          src: "./assets/audio/ukulele/g1-f-diao-yin-jie/full.mp3"
        }
      ],
      scoreImages: [
        {
          title: "F调音阶 谱面 1",
          src: "./assets/scores/ukulele/g1-f-diao-yin-jie/score-01.png"
        }
      ]
    }),
    makeSong({
      id: "g1-always-with-me",
      title: "Always with me",
      artist: "Youmi Kimura",
      level: "g1",
      source: "用户上传曲谱",
      category: "曲目练习",
      style: "Anime theme",
      techniques: ["F major", "3/4", "eighth note", "melody tab", "chord symbols"],
      goal: "掌握F调旋律、3/4拍和带和弦标记的分句练习。",
      focus: "在F调中读准旋律位置，保持三拍子律动，并把八分音符连接弹均匀。",
      practiceOrder: ["唱名读谱", "分句练习右手节拍", "对照简谱确认旋律走向", "跟90 BPM稳定完成全曲"],
      commonIssues: ["3/4拍重音不清楚", "八分音符连接忽快忽慢", "F、Bb、C和弦位置转换不够提前"],
      passStandard: "能在90 BPM稳定弹完整曲，并说出F调主和弦与三拍子重音位置。",
      audio: [
        {
          title: "Always with me 音频",
          src: "./assets/audio/ukulele/g1-always-with-me/full.mp3"
        }
      ],
      scoreImages: [
        {
          title: "Always with me 谱面 1",
          src: "./assets/scores/ukulele/g1-always-with-me/score-01.png"
        },
        {
          title: "Always with me 简谱版",
          src: "./assets/scores/ukulele/g1-always-with-me/score-02.png"
        }
      ]
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
      audio: Array.isArray(song.audio) ? song.audio : [],
      scoreImages: Array.isArray(song.scoreImages) ? song.scoreImages : [],
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
