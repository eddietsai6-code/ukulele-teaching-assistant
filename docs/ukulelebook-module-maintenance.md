# UkuleleBook 模块维护文档

更新日期：2026-08-24

本文用于把当前 UkuleleBook 首页按业务功能拆成清晰模块，方便后续维护、更新、修 bug 和新增功能。这里的边界描述当前代码事实，不要求重做 UI，也不把截图或历史 handoff 中的说明当成新的实现指令。

## 当前模块总览

当前页面按 6 个业务模块维护：

| 序号 | 模块 | 页面区域 | 主要 DOM 根节点 | 主要 JS 入口 |
| --- | --- | --- | --- | --- |
| 1 | 首页 Hero | 顶部导航、动态标题、搜索、封面视觉 | `section.hero.tailark-hero` | `assets/app.js` + `assets/app/home/*` |
| 2 | 练习工具 | 模块工具选择、调音器、节奏练习 | `section#tuner[data-practice-tools]` 内部 | `assets/app/home/practice-tools.js`、`assets/ukulele-tuner.js` |
| 3 | 明星专区 | 滚动图片矩阵 | `section.scroll-gallery-section[data-scroll-gallery]` | `assets/app/home/scroll-gallery.js` |
| 4 | 标准考级曲目 | 等级封面画廊、歌曲抽屉 | `section#levels`、`#levelBoard`、`#levelSongPicker` | `assets/app/levels/level-controller.js` + `assets/app/levels/*` |
| 5 | 教学课堂 | 当前歌曲详情、音频、谱面、节拍器 | `section#lesson`、`#songDetail` | `assets/app/detail/*`，控制逻辑目前在 `assets/app.js` |
| 6 | 页脚 | 品牌、资源链接、公司链接、法律链接 | `footer.activation-footer` | 无运行时 JS |

支撑层不算页面业务模块，但任何模块整理都必须遵守：

- 数据启动层：`assets/data.js`、`assets/rsl-ukulele-data.js`、`assets/catalog-runtime.js`、`assets/bootstrap.js`
- 内容发布层：`scripts/publish-content.mjs`、`functions/api/catalog/*`、`functions/api/admin/*`、`functions/media/*`
- 共享工具层：`assets/app/shared/*`
- 纯函数保留层：`assets/app/catalog/filtering.js` 当前没有可见 DOM 挂载，但仍由单元测试覆盖，作为未来目录/筛选能力保留

## 全局启动和数据流

页面加载顺序：

1. `index.html` 先加载 `assets/data.js`，提供静态 `window.UKULELE_LEVEL_DATA`。
2. `assets/rsl-ukulele-data.js` 在静态数据上追加 Rockschool/RSL 曲目、音频、谱面。
3. `assets/bootstrap.js` 调用 `loadCatalog()`，优先使用 Worker/D1/R2 动态发布目录，失败时回退缓存或静态目录。
4. `assets/bootstrap.js` 动态 import `assets/app.js`。
5. `assets/app.js` 读取最终 `window.UKULELE_LEVEL_DATA`，合并 `window.UKULELE_SONG_TECH_PROFILES`，初始化首页、等级、详情页和共享状态。
6. `assets/lesson-metronome.js` 和 `assets/ukulele-tuner.js` 作为独立页面级模块加载，分别挂载详情页节拍器与首页调音器。

全局状态目前集中在 `assets/app.js`：

- `state.selectedSongId`：当前歌曲
- `state.detailTab`：详情页当前 tab
- `state.level`、`state.activeLevelPicker`、`state.levelPickerOpen`：等级画廊与歌曲抽屉
- `state.audioVersionBySong`：每首歌选择的音频版本

跨模块调用原则：

- 首页搜索、等级抽屉只能通过 `selectSong(songId, shouldScroll)` 改变当前歌曲。
- 详情页只能读取当前歌曲和当前 tab，不应直接控制 Hero 或练习工具。
- 练习工具外层只切换面板可见性，不重写调音器和节奏游戏内部逻辑。
- 明星专区只维护图片矩阵，不读取曲库数据。
- 页脚保持静态导航，不参与应用状态。
- 内容发布、动态目录、播放器 vendor、调音核心属于支撑层，页面 UI 模块不要顺手重构。

## 模块 1：首页 Hero

### 负责什么

- 顶部导航、品牌文字、Login 触发按钮。
- `UkuleleBook` 动态标题。
- `Motivation / Practice / Method` true-focus 动态框选。
- Hero 搜索框和搜索结果浮层。
- 右侧书本封面 accordion 和底部小封面滚动视觉。
- Hero 文案 bullet：每期更新歌曲、按等级收录整理、每首歌曲配备可调节音频。

### 不负责什么

- 不负责调音器 DOM 和 Web Audio 调音逻辑。
- 不负责等级画廊打开歌曲抽屉。
- 不负责详情页 tab、播放器、谱面或节拍器。
- 不负责 Cloudflare 动态内容发布。

### DOM 根节点

- `section.hero.tailark-hero`
- `#gooddayBrandText`
- `#heroPressure`
- `#heroPrincipleFocus`
- `#heroSongSearchForm`
- `#tailarkSongSearch`
- `#heroSongSearchResults`
- `#heroTextTypeList`
- `.tailark-book-accordion`
- `.tailark-visual-shell`
- `#tailarkLoginDialog`

### JS 入口文件

- 总入口：`assets/app.js`
- DOM root：`assets/app/core/dom-roots.js`
- 动态标题：`assets/app/home/text-pressure.js`
- true-focus：`assets/app/home/true-focus.js`
- Hero 搜索：`assets/app/home/hero-song-search.js`
- Hero 尺寸适配：`assets/app/home/tailark-hero-scale.js`
- Login 弹窗：`assets/app/home/login.js`
- 历史保留但当前不挂 DOM：`assets/app/home/lanyard.js`、`assets/app/home/lanyard-renderer.js`

### CSS 归属

当前仍集中在 `assets/styles.css`：

- `.hero.tailark-hero`
- `.tailark-nav*`
- `.tailark-brand*`
- `.tailark-login*`
- `.tailark-login-dialog*`
- `.tailark-hero-stage`
- `.text-pressure-title`
- `.tailark-principle-focus`
- `.tailark-song-search-*`
- `.tailark-book-*`
- `.tailark-carousel-*`
- `.tailark-typed-*`

### 数据来源

- Hero 搜索读取 `visibleSongs()`，最终来自 `window.UKULELE_LEVEL_DATA.songs`。
- 搜索展示等级标签时读取 `levelById`，来自 `window.UKULELE_LEVEL_DATA.levels`。
- Login 只使用 `localStorage` 的 `ukebook-login-user`，当前不是后端登录。

### 图片/资源归属

- 书本封面：`assets/covers/ukulele-books/book-0-cover.png` 到 `book-8-cover.png`
- 品牌 logo 源文件保留：`ukebook_logo.svg`、`UkebookLogo.tsx`、`ukebook_logo_codex_spec.md`、`assets/brand/ukulele-logo-direct.png`

### 测试文件

- `tests/site.test.js`
- `tests/ukulele-template-ui.test.js`
- `tests/home-level-modules.test.mjs`
- `tests/frontend-modules.test.mjs`

### 后续整理规则

- 可以把 Hero 初始化聚合为 `assets/app/home/home-controller.js`，但必须保持 `assets/app.js` 对外状态和 `selectSong` 行为不变。
- 搜索结果只能调用传入的 `selectSong`，不要直接改全局 state。
- Login 当前是本地演示登录；接入真实账号前不要把它和内容发布 API 混在一起。

## 模块 2：练习工具

### 负责什么

- 展示“模块工具选择”手写 callout。
- 用 carousel 在调音器与节奏练习之间切换。
- 保持调音器 DOM 常驻。
- 保持节奏游戏 iframe 常驻，切换时只改可见状态。
- 底部圆形左右按钮和页码状态。

### 不负责什么

- 不负责调音算法、麦克风权限、音高识别。
- 不负责节奏卡片游戏内部代码。
- 不负责详情页节拍器。
- 不负责播放器和歌曲音频版本。

### DOM 根节点

- `section#tuner.practice-tools-section`
- `.practice-tools-shell[data-practice-tools]`
- `#practiceTunerPanel`
- `#heroNotebook`
- `#ukuleleTuner`
- `#practiceRhythmPanel`
- `[data-practice-tool-prev]`
- `[data-practice-tool-next]`
- `[data-practice-tool-label]`
- `[data-practice-tool-status]`

### JS 入口文件

- 面板切换：`assets/app/home/practice-tools.js`
- 调音器入口：`assets/ukulele-tuner.js`
- 调音核心：`assets/tuner-core.js`

### CSS 归属

当前仍集中在 `assets/styles.css`：

- `.practice-tools-section*`
- `.practice-tools-shell`
- `.practice-tools-viewport`
- `.practice-tools-track`
- `.practice-tool-page`
- `.practice-tools-controls`
- `.practice-tools-arrow`
- `.uke-*`
- `.rhythm-game-*`
- `.rhythm-handheld*`
- `.rhythm-console-*`
- `.rhythm-screen`
- `.rhythm-controls`

### 数据来源

- Carousel 本身不读取业务数据。
- 调音器使用 DOM 上的 `data-string-target`、`data-string-midi`、`data-string-label`。
- 调音器使用浏览器 `navigator.mediaDevices.getUserMedia` 和 Web Audio。

### 图片/音频/资源归属

- 节奏游戏 iframe：`assets/rhythm-chain-game/index.html`
- 节奏游戏内部资源：`assets/rhythm-chain-game/assets/*`
- 调音器无独立图片资源。

### 测试文件

- `tests/site.test.js`
- `tests/ukulele-template-ui.test.js`
- `tests/home-level-modules.test.mjs`

### 后续整理规则

- 外层 `practice-tools.js` 只允许管理页签、ARIA、CSS 变量和页码。
- 不在 `practice-tools.js` 中访问或重建 `#ukuleleTuner` 内部元素。
- 不在 `practice-tools.js` 中 reload iframe，避免节奏游戏进度丢失。
- 新增第 3 个练习工具时继续用 `[data-practice-tool-page]` 扩展，不新增全局状态。

## 模块 3：明星专区

### 负责什么

- 展示“明星专区”手写 callout。
- 构建 4 列滚动图片矩阵。
- 处理内部滚动进度、3D 旋转、巡航动画和拖拽/滚轮加速。
- 图片加载失败时显示 fallback。

### 不负责什么

- 不读取歌曲、等级或用户登录数据。
- 不控制页面其他区域滚动。
- 不维护考级封面。

### DOM 根节点

- `section.scroll-gallery-section[data-scroll-gallery]`
- `[data-scroll-gallery-wrapper]`
- `[data-scroll-gallery-container]`
- `[data-scroll-gallery-matrix]`
- `[data-scroll-gallery-column="1"]` 到 `[data-scroll-gallery-column="4"]`

### JS 入口文件

- `assets/app/home/scroll-gallery.js`

### CSS 归属

当前仍集中在 `assets/styles.css`：

- `.scroll-gallery-section`
- `.scroll-gallery-wrapper`
- `.scroll-gallery-container`
- `.scroll-gallery-sticky`
- `.scroll-gallery-banner`
- `.scroll-gallery-shadow*`
- `.scroll-gallery-perspective`
- `.scroll-gallery-matrix`
- `.scroll-gallery-column`
- `.scroll-gallery-rail`
- `.scroll-gallery-card`
- `.scroll-gallery-fallback`

### 数据来源

- `SCROLL_GALLERY_PHOTOS` 常量，定义在 `assets/app/home/scroll-gallery.js`。

### 图片/资源归属

- `assets/gallery/celebrity-avatars/celebrity-avatar-01.*` 到 `celebrity-avatar-18.*`

### 测试文件

- `tests/ukulele-template-ui.test.js`

### 后续整理规则

- 更换图片优先替换同名文件。
- 新增/减少图片时同步修改 `SCROLL_GALLERY_PHOTOS` 和 UI 测试。
- 不要让明星专区依赖 `visibleSongs()`，它应保持纯视觉模块。

## 模块 4：标准考级曲目

### 负责什么

- 展示“标准考级曲目”手写 callout。
- 渲染 Debut 到 Grade 8 的考级封面画廊。
- 支持左右按钮、键盘、拖拽切换等级封面。
- 点击等级后打开该等级歌曲抽屉。
- 点击歌曲后通过 `selectSong(songId, true)` 更新教学课堂。

### 不负责什么

- 不直接渲染详情页内容。
- 不管理音频版本和详情 tab 内部内容。
- 不改写曲库数据。

### DOM 根节点

- `section#levels.levels-section`
- `#levelBoard`
- `#levelSongPicker`
- `[data-level]`
- `[data-level-gallery-prev]`
- `[data-level-gallery-next]`
- `[data-song]`

### JS 入口文件

- 控制器：`assets/app/levels/level-controller.js`
- 视图渲染：`assets/app/levels/level-views.js`
- 抽屉动效：`assets/app/levels/level-song-splash.js`
- `assets/app.js` 只负责创建 `createLevelController(...)` 并在主 `render()` 中调用 `levelController.render()`。
- 控制器内部拥有：
  - `renderLevelBoard()`
  - `bindLevelGalleryControls()`
  - `bindChromaGrid()`
  - `renderLevelSongPicker()`
  - `bindLevelSongPicker()`
  - `openLevelSongPicker()`
  - `closeLevelSongPicker()`
  - `songsForLevel()`
  - `levelCount()`

### CSS 归属

当前仍集中在 `assets/styles.css`：

- `.levels-section`
- `.level-choice-callout*`
- `.level-board*`
- `.level-label*`
- `.circular-gallery*`
- `.circular-media*`
- `.level-gallery-arrow*`
- `.level-song-picker*`
- `.level-song-splash`
- `.song-picker-*`
- `.chroma-*`

### 数据来源

- 等级：`window.UKULELE_LEVEL_DATA.levels`
- 歌曲：`window.UKULELE_LEVEL_DATA.songs`
- 资源过滤：`visibleSongs()` 只保留有音频或谱面的歌曲。
- 排序：`songsForLevel()` 按标题 `zh-CN` 排序。

### 图片/音频/资源归属

- 等级封面：`assets/covers/ukulele-books/book-0-cover.png` 到 `book-8-cover.png`
- 歌曲谱面和音频属于教学课堂数据资源，由本模块只读取数量和歌曲列表。

### 测试文件

- `tests/home-level-modules.test.mjs`
- `tests/site.test.js`
- `tests/ukulele-template-ui.test.js`
- `tests/rsl-ukulele-import.test.js`
- `tests/catalog-runtime.test.mjs`

### 后续整理规则

- 已完成第一轮整理：`assets/app.js` 中的等级控制逻辑已抽到 `assets/app/levels/level-controller.js`。
- 必须保持 `renderLevelBoardView()` 和 `renderLevelSongPickerView()` 作为纯视图函数。
- 等级控制器只能通过传入回调调用 `selectSong`，不要 import 详情页模块。
- 后续修改前先补单元测试，再迁移代码，再跑 `node --test tests/home-level-modules.test.mjs tests/ukulele-template-ui.test.js`。

## 模块 5：教学课堂

### 负责什么

- 展示“教学课堂”手写 callout。
- 渲染当前歌曲的标题、作者、风格、等级、来源、类型、技巧标签。
- 渲染并切换详情 tab：Lesson、Audio、Score、Metronome。
- 音频 tab 使用固定项目音频和 Audio Speed Player Pro。
- Score tab 按输入顺序展示谱面图片。
- Metronome tab 挂载专业节拍器。
- 切换音频版本时保持当前歌曲和当前 tab 状态。

### 不负责什么

- 不负责 Hero 搜索 UI。
- 不负责等级画廊交互。
- 不负责调音器。
- 不负责 Cloudflare 内容发布。

### DOM 根节点

- `section#lesson.lesson-section`
- `#songDetail`
- `[data-tab]`
- `[data-detail-pane]`
- `[data-audio-version]`
- `[data-metronome-host]`

### JS 入口文件

- Shell：`assets/app/detail/detail-shell.js`
- Tab 切换：`assets/app/detail/detail-tabs.js`
- Lesson pane：`assets/app/detail/lesson-pane.js`
- Audio pane：`assets/app/detail/audio-pane.js`
- Score pane：`assets/app/detail/score-pane.js`
- Metronome pane：`assets/app/detail/metronome-pane.js`
- 页面节拍器：`assets/lesson-metronome.js`
- 节拍器核心：`assets/professional-metronome-core.js`
- 控制逻辑目前仍在 `assets/app.js`：
  - `renderSongDetail()`
  - `refreshAudioPane()`
  - `bindAudioVersionButtons()`
  - `updateSongDetailTab()`
  - `mountLessonMetronome()`
  - `preferredDetailTabForSong()`
  - `normalizeDetailTab()`

### CSS 归属

当前仍集中在 `assets/styles.css`：

- `.lesson-section`
- `.lesson-choice-callout*`
- `.lesson-card`
- `.lesson-cover`
- `.lesson-fields`
- `.lesson-tabs`
- `.lesson-pane`
- `.lesson-list`
- `.audio-workbench`
- `.audio-version-*`
- `.audio-player-*`
- `.score-grid`
- `.score-card`
- `.score-sheet`
- `.lesson-metronome*`

### 数据来源

- 当前歌曲：`getSelectedSong()` 从 `visibleSongs()` 和 `state.selectedSongId` 计算。
- 当前等级：`levelById[song.level]`。
- 音频版本：`song.audio` 与 `state.audioVersionBySong[song.id]`。
- 谱面：`song.scoreImages`。
- 教学字段：`song.teaching`，来自静态数据、RSL 导入或动态目录合并。

### 图片/音频/资源归属

- 音频：`assets/audio/ukulele/**`、`assets/audio/rockschool/ukulele/**`，动态内容为 `/media/**`。
- 谱面：`assets/scores/ukulele/**`，动态内容为 `/media/**`。
- Audio Speed Player Pro：`assets/vendor/audio-speed-player/*`。

### 测试文件

- `tests/detail-modules.test.mjs`
- `tests/site.test.js`
- `tests/ukulele-template-ui.test.js`
- `tests/rsl-ukulele-import.test.js`
- `tests/catalog-runtime.test.mjs`

### 后续整理规则

- 第二优先整理目标是把详情控制逻辑抽到 `assets/app/detail/detail-controller.js`。
- 详情控制器只能接收 `els.songDetail`、`getSelectedSong()`、`levelById`、`state.audioVersionBySong` 等显式依赖。
- `detail-shell` 与各 pane 文件继续保持纯 HTML 渲染函数，不绑定 DOM 事件。
- Audio Speed Player vendor 文件不要在 UI 整理中修改。
- 节拍器核心 `professional-metronome-core.js` 不参与 UI 模块整理。

## 模块 6：页脚

### 负责什么

- 展示 UkuleleBook 品牌说明。
- 展示 Resources 和 Company 静态链接。
- 展示 copyright、Privacy、Terms、GoodDay 链接。
- 展示装饰胶带。

### 不负责什么

- 不执行 JS。
- 不读取曲库或用户登录。
- 不处理真实隐私/条款路由。

### DOM 根节点

- `footer.footer-band.activation-footer`
- `.activation-footer-card`
- `.activation-footer-brand`
- `.activation-footer-nav`
- `.activation-footer-column`
- `.activation-footer-bottom`
- `.activation-footer-legal`
- `.activation-footer-social`

### JS 入口文件

- 无。

### CSS 归属

当前仍集中在 `assets/styles.css`：

- `.activation-footer`
- `.activation-footer-card`
- `.activation-footer-brand`
- `.activation-footer-logo`
- `.activation-footer-nav`
- `.activation-footer-column`
- `.footer-soon`
- `.activation-footer-bottom`
- `.activation-footer-legal`
- `.activation-footer-social`
- `.footer-tape`

### 数据来源

- 静态 HTML。

### 图片/音频/资源归属

- 无独立图片或音频资源。

### 测试文件

- `tests/ukulele-template-ui.test.js`
- `tests/site.test.js`

### 后续整理规则

- 页脚可保持在 `index.html` 内，暂不需要 JS 模块。
- 链接目标变更需要同步 UI 测试中的 footer token。
- 若以后接入真实页面路由，先增加路由文档，再改链接。

## CSS 维护边界

当前 `assets/styles.css` 是单文件样式表，已经按历史迭代累积较长。为了降低风险，短期不拆成多个 CSS 文件，先用选择器归属维护：

| 归属 | 选择器前缀 |
| --- | --- |
| 全局主题 | `:root`、`body.uke-fresh-theme`、基础 reset |
| 首页 Hero | `.tailark-*`、`.text-pressure-*`、`.true-focus-*`、`.glass-button*` |
| 练习工具 | `.practice-tools-*`、`.uke-*`、`.rhythm-*` |
| 明星专区 | `.scroll-gallery-*` |
| 标准考级曲目 | `.levels-section`、`.level-*`、`.circular-*`、`.chroma-*` |
| 教学课堂 | `.lesson-*`、`.audio-*`、`.score-*` |
| 页脚 | `.activation-footer*`、`.footer-*` |

CSS 修改规则：

- 一次只改一个模块对应选择器。
- 不用全局选择器修局部问题。
- 不把详情页 `.lesson-*` 样式拿去控制首页练习工具。
- 不把 `.rhythm-*` 样式写进 iframe 内部游戏；iframe 内部由 `assets/rhythm-chain-game/assets/styles.css` 管。
- 如果以后拆 CSS，先从“无 JS 的页脚”或“明星专区”开始，验证构建复制和缓存参数，再拆更复杂模块。

## 渐进代码整理路线

### 阶段 0：文档与基线

- 新增本文档。
- 跑 `npm.cmd run check`、`npm.cmd test`、`npm.cmd run build` 建立基线。
- 不提交根目录未跟踪的 `reference-links.html`、`script.js`、`styles.css`，除非明确确认来源。

### 阶段 1：等级模块控制器（已完成）

目标：把 `assets/app.js` 中等级画廊和歌曲抽屉控制逻辑移动到 `assets/app/levels/level-controller.js`。

验收：

- `assets/app.js` 仍持有全局 state 和 `selectSong`。
- 新控制器通过显式依赖接收 `levels`、`visibleSongs`、`levelById`、`selectSong`、`els.levelBoard`、`els.levelSongPicker`。
- `tests/home-level-modules.test.mjs` 增加控制器缺失 DOM 时安全跳过的测试。
- `node --test tests/home-level-modules.test.mjs tests/ukulele-template-ui.test.js` 通过。

### 阶段 2：详情模块控制器

目标：把 `assets/app.js` 中详情页渲染、tab、音频版本按钮、节拍器挂载移动到 `assets/app/detail/detail-controller.js`。

验收：

- 各 pane 文件继续是纯渲染函数。
- 详情控制器不 import Hero、练习工具或明星专区。
- `tests/detail-modules.test.mjs` 增加控制器缺失 DOM 时安全跳过的测试。
- `node --test tests/detail-modules.test.mjs tests/site.test.js` 通过。

### 阶段 3：首页辅助控制器

目标：把 Hero 初始化、搜索、登录、品牌解密等首页逻辑聚合为 `assets/app/home/home-controller.js`，但不改视觉。

验收：

- `mountHeroSongSearch` 继续只通过回调选择歌曲。
- `initTailarkLogin` 继续只用本地 `localStorage`。
- `tests/home-level-modules.test.mjs` 和 `tests/ukulele-template-ui.test.js` 通过。

### 阶段 4：样式归属标记

目标：在 `assets/styles.css` 内添加清晰的模块分段注释，不拆文件。

验收：

- 注释只标边界，不改选择器行为。
- `npm.cmd run check` 通过。
- 若任何视觉测试或截图基线依赖样式文本，先更新测试再改注释。

### 阶段 5：发布前验证

完整验证：

```cmd
npm.cmd run check
npm.cmd test
npm.cmd run build
```

如需上线，再执行 GitHub 推送与 Cloudflare Pages 部署。发布前必须确认本地 diff 只包含本轮文档和已验证的小步代码整理。

## 禁止事项

- 不用 `git reset` 或 `git restore` 清理未知 WIP。
- 不把根目录未跟踪的 `reference-links.html`、`script.js`、`styles.css` 自动加入提交。
- 不在 UI 模块整理中重写 Audio Speed Player vendor、调音核心、节奏游戏内部、Cloudflare 内容 API。
- 不一次性抽空 `assets/app.js`；每次只抽一个模块控制器。
- 不改变现有 DOM id，尤其是 `#ukuleleTuner`、`#startTunerButton`、`#tunerNeedle`、`#tunerScale`、`#tunerStatusText`、`#songDetail`、`#levelBoard`。
- 不改变已有用户体验：视觉、滚动、切换、播放器、调音器、节奏游戏、详情 tab 都必须保持现状。
