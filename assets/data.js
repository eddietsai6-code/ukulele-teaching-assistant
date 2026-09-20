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
      id: "g1-jia-le-bi-hai-dao-zhu-ti-qu",
      title: "加勒比海盗 主题曲",
      artist: "Klaus Badelt",
      level: "g1",
      source: "用户上传曲谱",
      category: "曲目练习",
      style: "Film theme melody",
      techniques: ["1=F", "3/4", "120 BPM", "eighth note", "repeat ending"],
      goal: "练习《加勒比海盗 主题曲》的一级旋律曲目，掌握F调三拍子、120 BPM律动和反复结尾。",
      focus: "保持三拍子重音清楚，读准F调旋律位置，并把反复段落与第一、第二结尾连接顺畅。",
      practiceOrder: ["唱名读谱", "拍读3/4节奏", "慢练反复段落与结尾", "跟120 BPM完整弹奏"],
      commonIssues: ["三拍子重音不稳", "八分音符连接容易抢拍", "反复结尾回弹位置不清楚"],
      passStandard: "能在120 BPM稳定弹完整曲，并准确处理三拍子、八分音符和反复结尾。",
      audio: [
        {
          title: "加勒比海盗 主题曲 音频",
          src: "./assets/audio/ukulele/g1-jia-le-bi-hai-dao-zhu-ti-qu/full.mp3"
        }
      ],
      scoreImages: [
        {
          title: "加勒比海盗 主题曲 谱面 1",
          src: "./assets/scores/ukulele/g1-jia-le-bi-hai-dao-zhu-ti-qu/score-01.png"
        }
      ]
    }),
    makeSong({
      id: "g1-mo-si-ke-jiao-wai-de-wan-shang",
      title: "莫斯科郊外的晚上",
      artist: "Vasily Solovyov-Sedoi",
      level: "g1",
      source: "用户上传曲谱",
      category: "曲目练习",
      style: "Folk melody",
      techniques: ["1=F", "2/4", "80 BPM", "eighth note", "tie"],
      goal: "练习《莫斯科郊外的晚上》的一级旋律曲目，掌握F调2/4拍、80 BPM慢速律动和长音保持。",
      focus: "保持二拍子稳定，读准F调旋律与临时升降音，并让连线长音自然延续。",
      practiceOrder: ["唱名读谱", "拍读2/4节奏", "单独练习连线长音", "跟80 BPM完整弹奏"],
      commonIssues: ["长音保持不够", "临时升降音位置反应慢", "二拍子弱拍进入不稳"],
      passStandard: "能在80 BPM稳定弹完整曲，并准确处理2/4拍、连线长音和临时升降音。",
      audio: [
        {
          title: "莫斯科郊外的晚上 音频",
          src: "./assets/audio/ukulele/g1-mo-si-ke-jiao-wai-de-wan-shang/full.mp3"
        }
      ],
      scoreImages: [
        {
          title: "莫斯科郊外的晚上 谱面 1",
          src: "./assets/scores/ukulele/g1-mo-si-ke-jiao-wai-de-wan-shang/score-01.png"
        }
      ]
    }),
    makeSong({
      id: "g1-si-ka-luo-man-ji-shi",
      title: "斯卡罗曼集市",
      artist: "Traditional",
      level: "g1",
      source: "用户上传曲谱",
      category: "曲目练习",
      style: "English folk melody",
      techniques: ["1=F", "3/4", "120 BPM", "slide", "dotted note"],
      goal: "练习《斯卡罗曼集市》的一级旋律曲目，掌握F调三拍子、滑音和附点长音。",
      focus: "保持三拍子律动，读准滑音后的目标音，并让附点与长音的时值稳定。",
      practiceOrder: ["唱名读谱", "拍读3/4节奏", "单独练习滑音小节", "跟120 BPM完整弹奏"],
      commonIssues: ["滑音目标音不到位", "附点长音时值不够", "三拍子重音不清楚"],
      passStandard: "能在120 BPM稳定弹完整曲，并准确处理三拍子、滑音和附点长音。",
      audio: [
        {
          title: "斯卡罗曼集市 音频",
          src: "./assets/audio/ukulele/g1-si-ka-luo-man-ji-shi/full.mp3"
        }
      ],
      scoreImages: [
        {
          title: "斯卡罗曼集市 谱面 1",
          src: "./assets/scores/ukulele/g1-si-ka-luo-man-ji-shi/score-01.png"
        }
      ]
    }),
    makeSong({
      id: "g1-ye-mei-gui",
      title: "野玫瑰",
      artist: "舒伯特",
      level: "g1",
      source: "用户上传曲谱",
      category: "曲目练习",
      style: "Classical melody",
      techniques: ["1=F", "4/4", "80 BPM", "eighth note", "slide"],
      goal: "练习《野玫瑰》的一级旋律曲目，掌握F调4/4拍、80 BPM中速律动和滑音连接。",
      focus: "保持四拍子稳定，读准F调旋律与临时升降音，并让滑音后的目标音清楚落点。",
      practiceOrder: ["唱名读谱", "拍读4/4节奏", "单独练习滑音与临时音小节", "跟80 BPM完整弹奏"],
      commonIssues: ["八分音符连续处容易不均匀", "滑音目标音不到位", "高把位8品音反应慢"],
      passStandard: "能在80 BPM稳定弹完整曲，并准确处理4/4拍、滑音和临时升降音。",
      audio: [
        {
          title: "野玫瑰 音频",
          src: "./assets/audio/ukulele/g1-ye-mei-gui/full.mp3"
        }
      ],
      scoreImages: [
        {
          title: "野玫瑰 谱面 1",
          src: "./assets/scores/ukulele/g1-ye-mei-gui/score-01.png"
        }
      ]
    }),
    makeSong({
      id: "g1-xiao-mao-lv",
      title: "小毛驴",
      artist: "Traditional",
      level: "g1",
      source: "用户上传曲谱",
      category: "曲目练习",
      style: "Children's melody",
      techniques: ["1=C", "4/4", "90 BPM", "eighth note", "melody tab"],
      goal: "练习《小毛驴》的一级旋律曲目，掌握C调四拍子、90 BPM律动和重复短句。",
      focus: "保持四拍子稳定，读准C调旋律位置，并把重复节奏弹得均匀清楚。",
      practiceOrder: ["唱名读谱", "拍读4/4节奏", "分句慢练重复短句", "跟90 BPM完整弹奏"],
      commonIssues: ["重复音容易抢拍", "八分音符连接忽快忽慢", "结尾和声音按下不整齐"],
      passStandard: "能在90 BPM稳定弹完整曲，并准确处理四拍子、重复音和结尾和声音。",
      audio: [
        {
          title: "小毛驴 音频",
          src: "./assets/audio/ukulele/g1-xiao-mao-lv/full.mp3"
        }
      ],
      scoreImages: [
        {
          title: "小毛驴 谱面 1",
          src: "./assets/scores/ukulele/g1-xiao-mao-lv/score-01.png"
        }
      ]
    }),
    makeSong({
      id: "g1-xue-rong-hua",
      title: "雪绒花",
      artist: "Richard Rodgers",
      level: "g1",
      source: "用户上传曲谱",
      category: "曲目练习",
      style: "Musical melody",
      techniques: ["1=C", "3/4", "120 BPM", "chord melody", "repeat ending"],
      goal: "练习《雪绒花》的一级旋律曲目，掌握C调三拍子、120 BPM律动和反复结尾。",
      focus: "保持三拍子重音清楚，读准C调和声音，并把反复段落和长音时值弹完整。",
      practiceOrder: ["唱名读谱", "拍读3/4节奏", "慢练和声音与长音", "跟120 BPM完整弹奏"],
      commonIssues: ["三拍子重音不清楚", "长音保持不够", "反复结尾回弹位置不清楚"],
      passStandard: "能在120 BPM稳定弹完整曲，并准确处理三拍子、长音和反复结尾。",
      audio: [
        {
          title: "雪绒花 音频",
          src: "./assets/audio/ukulele/g1-xue-rong-hua/full.mp3"
        }
      ],
      scoreImages: [
        {
          title: "雪绒花 谱面 1",
          src: "./assets/scores/ukulele/g1-xue-rong-hua/score-01.png"
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
      id: "g2-xiao-bu-wu-qu",
      title: "小步舞曲",
      artist: "Johann Sebastian Bach",
      level: "g2",
      source: "用户上传曲谱",
      category: "曲目练习",
      style: "Classical melody",
      techniques: ["1=C", "3/4", "100 BPM", "eighth note", "melody tab"],
      goal: "练习《小步舞曲》的二级旋律曲目，掌握C调三拍子、100 BPM律动和八分音符连接。",
      focus: "保持三拍子重音清楚，读准C调旋律，并把低把位旋律与收尾和弦弹稳定。",
      practiceOrder: ["唱名读谱", "拍读3/4节奏", "分句慢练八分音符连接", "跟100 BPM完整弹奏"],
      commonIssues: ["三拍子重音不清楚", "八分音符连接忽快忽慢", "结尾和弦按下不整齐"],
      passStandard: "能在100 BPM稳定弹完整曲，并准确处理三拍子、八分音符和收尾和声音。",
      audio: [
        {
          title: "小步舞曲 音频",
          src: "./assets/audio/ukulele/g2-xiao-bu-wu-qu/full.mp3"
        }
      ],
      scoreImages: [
        {
          title: "小步舞曲 谱面 1",
          src: "./assets/scores/ukulele/g2-xiao-bu-wu-qu/score-01.png"
        }
      ]
    }),
    makeSong({
      id: "g2-duo-nian-yi-qian",
      title: "多年以前",
      artist: "Traditional",
      level: "g2",
      source: "用户上传曲谱",
      category: "曲目练习",
      style: "Folk melody",
      techniques: ["1=F", "4/4", "90 BPM", "eighth note", "arpeggio"],
      goal: "练习《多年以前》的二级旋律曲目，掌握F调四拍子、90 BPM律动和八分音符分解连接。",
      focus: "保持四拍子稳定，读准F调旋律位置，并让连续八分音符均匀流动。",
      practiceOrder: ["唱名读谱", "拍读4/4节奏", "分句慢练八分音符连接", "跟90 BPM完整弹奏"],
      commonIssues: ["八分音符颗粒不均匀", "F调音位和C调音位混淆", "长句换弦时节拍被拉慢"],
      passStandard: "能在90 BPM稳定弹完整曲，并准确处理F调旋律、四拍子和八分音符连接。",
      audio: [
        {
          title: "多年以前 音频",
          src: "./assets/audio/ukulele/g2-duo-nian-yi-qian/full.mp3"
        }
      ],
      scoreImages: [
        {
          title: "多年以前 谱面 1",
          src: "./assets/scores/ukulele/g2-duo-nian-yi-qian/score-01.png"
        }
      ]
    }),
    makeSong({
      id: "g2-huan-le-song",
      title: "欢乐颂",
      artist: "Ludwig van Beethoven",
      level: "g2",
      source: "用户上传曲谱",
      category: "曲目练习",
      style: "Classical melody",
      techniques: ["1=F", "4/4", "110 BPM", "eighth note", "melody tab"],
      goal: "练习《欢乐颂》的二级旋律曲目，掌握F调四拍子、110 BPM律动和连续八分音符。",
      focus: "保持四拍子强弱规律，读准F调旋律，并把熟悉旋律弹得均匀不抢拍。",
      practiceOrder: ["唱名读谱", "拍读4/4节奏", "分句慢练连续八分音符", "跟110 BPM完整弹奏"],
      commonIssues: ["熟悉旋律导致抢拍", "连续八分音符忽快忽慢", "结尾长音时值不够"],
      passStandard: "能在110 BPM稳定弹完整曲，并准确处理四拍子、八分音符和结尾长音。",
      audio: [
        {
          title: "欢乐颂 音频",
          src: "./assets/audio/ukulele/g2-huan-le-song/full.mp3"
        }
      ],
      scoreImages: [
        {
          title: "欢乐颂 谱面 1",
          src: "./assets/scores/ukulele/g2-huan-le-song/score-01.png"
        }
      ]
    }),
    makeSong({
      id: "g2-song-bie",
      title: "送别",
      artist: "John P. Ordway",
      level: "g2",
      source: "用户上传曲谱",
      category: "曲目练习",
      style: "Chinese school song",
      techniques: ["1=C", "4/4", "80 BPM", "chord melody", "eighth note"],
      goal: "练习《送别》的二级旋律曲目，掌握C调四拍子、80 BPM慢速律动和和声音连接。",
      focus: "保持旋律歌唱性，读准C调TAB位置，并让和声音与八分音符衔接自然。",
      practiceOrder: ["唱名读谱", "拍读4/4节奏", "慢练和声音按法", "跟80 BPM完整弹奏"],
      commonIssues: ["长音保持不够", "和声音按下不整齐", "八分音符进入时抢拍"],
      passStandard: "能在80 BPM稳定弹完整曲，并准确处理四拍子、和声音和旋律长音。",
      audio: [
        {
          title: "送别 音频",
          src: "./assets/audio/ukulele/g2-song-bie/full.mp3"
        }
      ],
      scoreImages: [
        {
          title: "送别 谱面 1",
          src: "./assets/scores/ukulele/g2-song-bie/score-01.png"
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
      id: "g3-yue-liang-dai-biao-wo-de-xin",
      title: "月亮代表我的心",
      artist: "Weng Ching-hsi",
      level: "g3",
      source: "用户上传曲谱",
      category: "曲目练习",
      style: "Pop chord melody",
      techniques: ["4/4", "70 BPM", "flat key", "eighth note", "chord melody"],
      goal: "练习《月亮代表我的心》的三级和弦旋律曲目，掌握降号调号、八分音符律动和旋律声部突出。",
      focus: "保持70 BPM稳定节拍，读准五线谱与TAB对应位置，并让和弦中的旋律音清楚突出。",
      practiceOrder: ["拍读70 BPM八分音符", "分句练习和弦旋律", "单独处理滑音与连音", "完整连接两页谱面"],
      commonIssues: ["和弦音压过旋律", "八分音符连接不均匀", "滑音和连音处理不够自然"],
      passStandard: "能在70 BPM稳定弹完整曲，并保持旋律清楚、和弦饱满、两页衔接顺畅。",
      audio: [
        {
          title: "月亮代表我的心 音频",
          src: "./assets/audio/ukulele/g3-yue-liang-dai-biao-wo-de-xin/full.mp3"
        }
      ],
      scoreImages: [
        {
          title: "月亮代表我的心 谱面 1",
          src: "./assets/scores/ukulele/g3-yue-liang-dai-biao-wo-de-xin/score-01.png"
        },
        {
          title: "月亮代表我的心 谱面 2",
          src: "./assets/scores/ukulele/g3-yue-liang-dai-biao-wo-de-xin/score-02.png"
        }
      ]
    }),
    makeSong({
      id: "g3-tian-kong-zhi-cheng-du-zou-ban",
      title: "天空之城（独奏版）",
      artist: "Joe Hisaishi",
      level: "g3",
      source: "用户上传曲谱",
      category: "曲目练习",
      style: "Solo chord melody",
      techniques: ["1=C", "4/4", "chord melody", "eighth note", "position shift"],
      goal: "练习《天空之城（独奏版）》的三级独奏曲目，掌握旋律与和弦同弹、八分音符连接和中高把位换把。",
      focus: "保持旋律声部清楚，和弦下压要整齐，并在换把时维持稳定拍点。",
      practiceOrder: ["先拍读八分音符节奏", "拆分旋律音与和弦框架", "慢练中高把位移动", "完整连接独奏版谱面"],
      commonIssues: ["和弦按下不整齐", "旋律音被伴奏音盖住", "高把位移动时节拍变慢"],
      passStandard: "能稳定弹完整首独奏版，并保持旋律清楚、和弦干净、换把不断拍。",
      audio: [
        {
          title: "天空之城（独奏版） 音频",
          src: "./assets/audio/ukulele/g3-tian-kong-zhi-cheng-du-zou-ban/full.mp3"
        }
      ],
      scoreImages: [
        {
          title: "天空之城（独奏版）谱面 1",
          src: "./assets/scores/ukulele/g3-tian-kong-zhi-cheng-du-zou-ban/score-01.png"
        }
      ]
    }),
    makeSong({
      id: "g3-tong-nian",
      title: "童年",
      artist: "罗大佑",
      level: "g3",
      source: "用户上传曲谱",
      category: "曲目练习",
      style: "Mandopop chord melody",
      techniques: ["1=C", "4/4", "80 BPM", "eighth note", "chord melody"],
      goal: "练习《童年》的三级弹唱曲目，掌握80 BPM中速律动、八分音符旋律和A/B段衔接。",
      focus: "保持C调旋律清楚，按稳常用和弦，并让前奏、A段和B段的拍点不断。",
      practiceOrder: ["拍读80 BPM八分节奏", "先练前奏和A段旋律", "分开慢练B段高音与和弦", "跟音频完整连接前奏、A段和B段"],
      commonIssues: ["八分音符连续处容易抢拍", "和弦伴奏音盖过旋律", "进入B段高音位置时换把不稳"],
      passStandard: "能在80 BPM稳定弹完整曲，并保持旋律清楚、和弦干净、A/B段衔接不断拍。",
      audio: [
        {
          title: "童年 音频",
          src: "./assets/audio/ukulele/g3-tong-nian/full.mp3"
        }
      ],
      scoreImages: [
        {
          title: "童年 谱面 1",
          src: "./assets/scores/ukulele/g3-tong-nian/score-01.png"
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
      id: "g4-ai-de-luo-man-shi",
      title: "爱的罗曼史",
      artist: "Traditional",
      level: "g4",
      source: "用户上传曲谱",
      category: "曲目练习",
      style: "Classical arpeggio",
      techniques: ["3/4", "80 BPM", "Am", "triplet arpeggio", "position shift"],
      goal: "练习《爱的罗曼史》的四级古典分解和弦曲目，掌握3/4拍三连音琶音和高把位旋律连接。",
      focus: "保持每组三连音均匀流动，突出上声部旋律，并在Am、Dm、E、E7之间稳定换位。",
      practiceOrder: ["空弦拍读三连音", "分句慢练Am段旋律", "单独练习高把位换把", "完整连接和声段落"],
      commonIssues: ["三连音不均匀", "高把位换把时断音", "低音和伴奏音盖过旋律"],
      passStandard: "能以80 BPM稳定弹完整曲，三连音均匀，上声部旋律清楚，并准确处理高把位换把。",
      audio: [
        {
          title: "爱的罗曼史 音频",
          src: "./assets/audio/ukulele/g4-ai-de-luo-man-shi/full.mp3"
        }
      ],
      scoreImages: [
        {
          title: "爱的罗曼史 谱面 1",
          src: "./assets/scores/ukulele/g4-ai-de-luo-man-shi/score-01.png"
        },
        {
          title: "爱的罗曼史 谱面 2",
          src: "./assets/scores/ukulele/g4-ai-de-luo-man-shi/score-02.png"
        },
        {
          title: "爱的罗曼史 谱面 3",
          src: "./assets/scores/ukulele/g4-ai-de-luo-man-shi/score-03.png"
        }
      ]
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
