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
      category: "曲目练习",
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
        },
        {
          title: "小星星 With Click 音频",
          src: "./assets/audio/ukulele/debut-xiao-xing-xing/with-click.mp3"
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
      category: "曲目练习",
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
        },
        {
          title: "康康舞曲 Cancan With Click 音频",
          src: "./assets/audio/ukulele/debut-kang-kang-wu-qu-cancan/with-click.mp3"
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
        },
        {
          title: "C 调音阶 With Click 音频",
          src: "./assets/audio/ukulele/debut-c-diao-yin-jie/with-click.mp3"
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
      id: "debut-yao-lan-qu-lulla",
      title: "摇篮曲 Lulla",
      artist: "Traditional",
      level: "debut",
      source: "用户上传曲谱",
      category: "曲目练习",
      style: "Lullaby",
      techniques: ["3/4", "eighth note", "dotted note", "melody tab"],
      goal: "练习《摇篮曲 Lulla》的预备级曲目，掌握3/4拍、八分音符和附点节奏。",
      focus: "保持80 BPM的三拍子律动，读准TAB位置，并把长音和附点节奏弹稳定。",
      practiceOrder: ["唱名读谱", "拍读3/4节奏", "分句慢练TAB", "跟80 BPM完整弹奏"],
      commonIssues: ["三拍子重音不清楚", "八分音符连接不均匀", "附点节奏时值不稳定"],
      passStandard: "能在80 BPM稳定弹完整曲，并准确处理3/4拍和附点节奏。",
      audio: [
        {
          title: "摇篮曲 Lulla 音频",
          src: "./assets/audio/ukulele/debut-yao-lan-qu-lulla/full.mp3"
        },
        {
          title: "摇篮曲 Lulla With Click 音频",
          src: "./assets/audio/ukulele/debut-yao-lan-qu-lulla/with-click.mp3"
        }
      ],
      scoreImages: [
        {
          title: "摇篮曲 Lulla 谱面 1",
          src: "./assets/scores/ukulele/debut-yao-lan-qu-lulla/score-01.png"
        },
        {
          title: "摇篮曲 Lulla 简谱版",
          src: "./assets/scores/ukulele/debut-yao-lan-qu-lulla/score-02.png"
        }
      ]
    }),
    makeSong({
      id: "g1-yin-yue-zhi-sheng",
      title: "音乐之声",
      artist: "Richard Rodgers",
      level: "g1",
      source: "用户上传曲谱",
      category: "曲目练习",
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
        },
        {
          title: "音乐之声 With Click 音频",
          src: "./assets/audio/ukulele/g1-yin-yue-zhi-sheng/with-click.mp3"
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
      id: "g2-zhi-ai-li-si-for-elise",
      title: "致爱丽丝 For Elise",
      artist: "Ludwig van Beethoven",
      level: "g2",
      source: "用户上传曲谱",
      category: "曲目练习",
      style: "Classical melody",
      techniques: ["3/4", "eighth note", "dotted note", "melody tab", "repeat ending"],
      goal: "练习《致爱丽丝》的G2旋律读谱，掌握3/4拍、八分音符和附点节奏。",
      focus: "保持90 BPM的三拍子律动，读准高把位TAB数字，并把反复段落弹连贯。",
      practiceOrder: ["唱名读谱", "拍读3/4节奏", "分句慢练高把位旋律", "跟90 BPM完整弹奏"],
      commonIssues: ["高把位数字反应变慢", "八分音符连接不均匀", "反复记号处回弹位置不清楚"],
      passStandard: "能在90 BPM稳定弹完整曲，并准确处理八分音符、附点节奏和反复段落。",
      audio: [
        {
          title: "致爱丽丝 For Elise 音频",
          src: "./assets/audio/ukulele/g2-zhi-ai-li-si-for-elise/full.mp3"
        },
        {
          title: "致爱丽丝 For Elise With Click 音频",
          src: "./assets/audio/ukulele/g2-zhi-ai-li-si-for-elise/with-click.mp3"
        }
      ],
      scoreImages: [
        {
          title: "致爱丽丝 For Elise 谱面 1",
          src: "./assets/scores/ukulele/g2-zhi-ai-li-si-for-elise/score-01.png"
        },
        {
          title: "致爱丽丝 For Elise 简谱版",
          src: "./assets/scores/ukulele/g2-zhi-ai-li-si-for-elise/score-02.png"
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
        },
        {
          title: "F调音阶 With Click 音频",
          src: "./assets/audio/ukulele/g1-f-diao-yin-jie/with-click.mp3"
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
        },
        {
          title: "Always with me With Click 音频",
          src: "./assets/audio/ukulele/g1-always-with-me/with-click.mp3"
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
      id: "g2-tian-kong-zhi-cheng",
      title: "天空之城",
      artist: "Joe Hisaishi",
      level: "g2",
      source: "用户上传曲谱",
      category: "曲目练习",
      style: "Anime theme",
      techniques: ["position shift", "eighth note", "tie", "chord symbols", "melody tab"],
      goal: "掌握《天空之城》的G2曲目练习，稳定处理换把、连音和八分音符。",
      focus: "读准高把位TAB位置，保持78 BPM的稳定速度，并把连音线后的延长时值弹完整。",
      practiceOrder: ["唱名读谱", "低把位分句慢练", "高把位换把单独练习", "跟78 BPM完整弹奏"],
      commonIssues: ["换到7品以上时找音变慢", "连音线后的时值保持不够", "八分音符连接不均匀"],
      passStandard: "能在78 BPM稳定弹完整曲，并准确处理换把位置和连音时值。",
      audio: [
        {
          title: "天空之城 音频",
          src: "./assets/audio/ukulele/g2-tian-kong-zhi-cheng/full.mp3"
        },
        {
          title: "天空之城 With Click 音频",
          src: "./assets/audio/ukulele/g2-tian-kong-zhi-cheng/with-click.mp3"
        }
      ],
      scoreImages: [
        {
          title: "天空之城 谱面 1",
          src: "./assets/scores/ukulele/g2-tian-kong-zhi-cheng/score-01.png"
        },
        {
          title: "天空之城 简谱版",
          src: "./assets/scores/ukulele/g2-tian-kong-zhi-cheng/score-02.png"
        }
      ]
    }),
    makeSong({
      id: "g2-chong-er-fei",
      title: "虫儿飞",
      artist: "陈光荣",
      level: "g2",
      source: "用户上传曲谱",
      category: "曲目练习",
      style: "Chinese ballad melody",
      techniques: ["F major", "4/4", "eighth note", "melody tab", "repeat ending"],
      goal: "练习《虫儿飞》的二级旋律读谱，掌握F调位置、4/4拍和八分音符连接。",
      focus: "按80 BPM保持稳定速度，读准TAB数字，并把反复段落和收尾和声音弹清楚。",
      practiceOrder: ["唱名读谱", "拍读4/4节奏", "分句慢练旋律TAB", "跟80 BPM完整弹奏"],
      commonIssues: ["八分音符连接不均匀", "F调音位和C调音位混淆", "反复记号后的回弹位置不清楚"],
      passStandard: "能在80 BPM稳定弹完整曲，并准确处理八分音符、反复段落和最后和声音。",
      audio: [
        {
          title: "虫儿飞 音频",
          src: "./assets/audio/ukulele/g2-chong-er-fei/full.mp3"
        }
      ],
      scoreImages: [
        {
          title: "虫儿飞 谱面 1",
          src: "./assets/scores/ukulele/g2-chong-er-fei/score-01.png"
        }
      ]
    }),
    makeSong({
      id: "coffee-chuck",
      title: "Coffee Chuck",
      artist: "Ukulele Template",
      level: "g2",
      source: "Rhythm Pack",
      category: "曲目练习",
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
      category: "曲目练习",
      style: "Ballad",
      techniques: ["fingerpicking", "arpeggio", "melody"],
      goal: "Separate bass notes from a simple top-line melody.",
      focus: "Right-hand assignment and melody balance.",
      practiceOrder: ["Assign thumb and fingers", "Play bass alone", "Play melody alone", "Combine both layers"],
      commonIssues: ["Bass covering the melody", "Fingers flying too far away", "Uneven arpeggios"],
      passStandard: "The melody stays clear while the bass remains steady."
    }),
    makeSong({
      id: "g3-summer",
      title: "SUMMER",
      artist: "Joe Hisaishi",
      level: "g3",
      source: "用户上传曲谱",
      category: "曲目练习",
      style: "Film theme melody",
      techniques: ["4/4", "75 BPM", "repeat ending", "tie", "position shift"],
      goal: "练习《SUMMER》的三级旋律曲目，掌握75 BPM中速律动、反复段落和换把连接。",
      focus: "保持旋律线连贯，读准休止与连音，并在第一、第二结尾之间顺畅衔接。",
      practiceOrder: ["拍读75 BPM节奏", "分句慢练TAB旋律", "单独处理反复与第二结尾", "跟伴奏完整弹奏"],
      commonIssues: ["休止符后进拍偏晚", "连音处理过短", "换把到高把位时音色不稳定"],
      passStandard: "能在75 BPM稳定弹完整曲，并准确处理休止、连音、反复结尾和高把位连接。",
      audio: [
        {
          title: "SUMMER Full 音频",
          src: "./assets/audio/ukulele/g3-summer/full.mp3"
        },
        {
          title: "SUMMER Backing Track 音频",
          src: "./assets/audio/ukulele/g3-summer/backing-track.mp3"
        }
      ],
      scoreImages: [
        {
          title: "SUMMER 谱面 1",
          src: "./assets/scores/ukulele/g3-summer/score-01.png"
        }
      ]
    }),
    makeSong({
      id: "g3-hei-ren-tai-guan",
      title: "黑人抬棺",
      artist: "Coffin Dance",
      level: "g3",
      source: "用户上传曲谱",
      category: "曲目练习",
      style: "Meme theme melody",
      techniques: ["4/4", "120 BPM", "flat key", "eighth note", "position shift"],
      goal: "练习《黑人抬棺》的三级旋律曲目，掌握120 BPM快速八分音符、降号调号和重复乐句。",
      focus: "保持稳定速度，读准带降号的五线谱与TAB对应位置，并让重复段落的节奏不断线。",
      practiceOrder: ["拍读120 BPM八分音符", "分句练习1-4小节主题", "慢练高把位重复乐句", "完整跟音频弹奏"],
      commonIssues: ["120 BPM下手指提前紧张", "高把位8-7交替不均匀", "重复段落越弹越快"],
      passStandard: "能在120 BPM稳定弹完整曲，并准确处理主题重复、高把位连接和收尾长音。",
      audio: [
        {
          title: "黑人抬棺 音频",
          src: "./assets/audio/ukulele/g3-hei-ren-tai-guan/full.mp3"
        }
      ],
      scoreImages: [
        {
          title: "黑人抬棺 谱面 1",
          src: "./assets/scores/ukulele/g3-hei-ren-tai-guan/score-01.png"
        }
      ]
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
      category: "曲目练习",
      style: "Waltz",
      techniques: ["fingerstyle", "bass note", "position shift"],
      goal: "Combine bass, harmony, and melody in a short performance piece.",
      focus: "Three-beat flow and smooth position movement.",
      practiceOrder: ["Play bass line", "Play melody line", "Add harmony notes", "Perform slowly from start to finish"],
      commonIssues: ["Unclear waltz accent", "Sound gaps during shifts", "Short melody note values"],
      passStandard: "Perform the whole piece with a clear three-beat feel."
    }),
    makeSong({
      id: "g5-huan-hua-cheng-feng",
      title: "幻化成风",
      artist: "Ayano Tsuji",
      level: "g5",
      source: "用户上传曲谱",
      category: "曲目练习",
      style: "Anime fingerstyle",
      techniques: ["F major", "4/4", "triplet feel", "chord melody", "position shift"],
      goal: "练习《幻化成风》的五级指弹曲目，掌握F调和弦旋律、三连律动和高把位连接。",
      focus: "保持轻快的4/4律动，读准F调TAB位置，并让旋律音从伴奏和弦中清楚浮出来。",
      practiceOrder: ["唱名读谱", "单独拍读三连律动", "分句慢练高把位旋律", "连贯弹奏和弦旋律段落"],
      commonIssues: ["三连律动弹成平均八分音符", "高把位换把时旋律断开", "和弦音量盖过主旋律"],
      passStandard: "能稳定弹完整曲，并清楚呈现F调和弦走向、三连律动和主旋律线条。",
      audio: [
        {
          title: "幻化成风 音频",
          src: "./assets/audio/ukulele/g5-huan-hua-cheng-feng/full.mp3"
        }
      ],
      scoreImages: [
        {
          title: "幻化成风 谱面 1",
          src: "./assets/scores/ukulele/g5-huan-hua-cheng-feng/score-01.png"
        }
      ]
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
