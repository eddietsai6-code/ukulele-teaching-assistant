# UkuleleBook 公开前端模块化设计规范

> 文档类型：设计与实施约束规范
>
> 适用项目：UkuleleBook / 尤克里里教学助手公开前端
>
> 文档日期：2026-07-30
>
> 当前阶段：设计已确认，等待按切片计划执行

## 1. 目标

在完全保留 UkuleleBook 当前页面外观、功能、交互、动画、曲库加载和双通道发布方式的前提下，将公开前端从集中式脚本和集中式样式，逐步拆分为职责清晰、可独立维护、可独立测试的原生 ES Modules。

本次工作的核心目标不是重做网页，也不是重新设计 UI，而是等价模块化重构：

1. 后续修改某一功能时，可以准确定位到对应模块。
2. 修改播放器、节拍器、调音器、谱面、节奏游戏或首页动效时，不会误伤其他区域。
3. 某个模块出问题时，可以独立回退，不需要整页重做。
4. 重构前后用户可见结果、动画入口、响应式表现和功能行为保持一致。
5. 为后续课程、曲库、工具和互动模块替换建立稳定边界。

## 2. 当前项目诊断

当前干净基线来自 `origin/main` 的提交 `1cfcc08`。工作目录使用隔离 worktree：

```text
C:\Users\888\AppData\Local\Temp\ukulele-dual-channel-20260723
```

主目录 `C:\Users\888\Documents\尤克里里教学助手` 当前包含大量歌曲、谱面、节奏游戏和本地内容发布相关的脏工作区内容，并且不适合作为模块化重构的直接工作区。模块化必须继续在干净 worktree 或新 worktree 中执行，禁止把歌曲内容发布和系统/UI 重构混在同一提交里。

当前公开前端的集中风险：

- `assets/app.js` 约 2040 行，同时承担状态、筛选、首页动效、吊牌物理、等级画廊、曲目详情、播放器、谱面和 Tab 更新。
- `assets/styles.css` 约 4142 行，同时承载首页、调音器、节奏游戏、等级、曲库、详情、播放器、谱面、节拍器和响应式规则。
- `render()` 会串联首页、等级、曲库、详情等多个区域，后续改局部状态时容易带来大范围重渲染。
- 曲目详情仍通过 `innerHTML` 重建外壳和面板，必须在模块化中保护节拍器和播放器的生命周期。
- `assets/bootstrap.js` 和 `assets/catalog-runtime.js` 已经是相对清晰的边界，应保留并只做必要接线。
- `assets/lesson-metronome.js`、`assets/ukulele-tuner.js`、`assets/tuner-core.js`、`assets/rhythm-chain-game/` 已经具备独立工具属性，模块化第一阶段不重写其内部逻辑。
- Cloudflare D1/R2、Worker API、内容发布器已经建立双通道架构，本次前端模块化不得修改内容发布基础设施。

## 3. 不可妥协的验收红线

任何一项不满足，都视为模块化失败：

1. 不改变当前 UI、布局、尺寸、配色、字体、文案、卡片样式和响应式表现。
2. 不改变首页首屏、吊牌动效、调音器、等级书籍画廊、曲库、详情页、播放器、谱面、节拍器和节奏游戏。
3. 不改变现有动画的视觉结果、触发方式、拖动方式、速度和 reduced-motion 行为。
4. 不改变静态曲库、动态 catalog API、D1/R2 内容发布和静态兜底兼容逻辑。
5. 不改变 Audio Speed Player 线上脚本地址：

```html
<script type="module" src="https://eddietsai6-code.github.io/audio-speed-player/dist/audio-speed-player-pro.js"></script>
```

6. 不改变 `<audio-speed-player>` 的当前核心参数、版本选择、速度控制、Rubber Band 引擎、进度拖动和 MetaBalls 视觉。
7. 切换 Lesson、Audio、Score、Metro Tab 时，节拍器的状态保持能力不得倒退。
8. 普通 Tab 切换不得通过整页或整个详情区重渲染来完成。
9. 不改变 `assets/ukulele-tuner.js` 和 `assets/tuner-core.js` 的调音算法、麦克风权限流程和 AudioContext 生命周期。
10. 不改变 `assets/rhythm-chain-game/` 内部游戏逻辑，只允许外层容器边界在后续模块中接入。
11. 不以“顺便优化”为理由修改视觉设计、课程文案或曲库内容。
12. 桌面、iPad 和手机端必须分别验证无横向溢出和关键媒体模块可用。
13. 当前已隐藏或删除的旧 UI 不得因模块拆分重新显示。

## 4. 本期范围

### 4.1 包含范围

- 公开页面启动和初始化边界。
- 静态 `data.js`、`rsl-ukulele-data.js` 和动态 `catalog-runtime.js` 的读取、合并与展示接线。
- 首页文字压力、吊牌物理、调音器展示区和节奏游戏外框的模块边界。
- 等级书籍画廊、等级曲目选择器、曲库筛选、技巧标签、歌曲选择。
- 曲目详情外壳，以及 Lesson、Audio、Score、Metro 四个详情面板。
- Audio Speed Player Web Component 接入边界。
- 页面内节拍器 `assets/lesson-metronome.js` 的宿主边界和状态保持约束。
- 调音器 `assets/ukulele-tuner.js` 与 `assets/tuner-core.js` 的宿主边界。
- 节奏游戏 iframe 和掌机外壳的宿主边界。
- `assets/styles.css` 的后续模块化拆分策略。
- 与以上模块对应的单元测试、契约测试、集成测试和视觉回归测试。

### 4.2 不包含范围

- 后台管理、Worker API、D1 schema、R2 对象结构和内容发布器。
- 曲目新增、曲谱替换、音频替换和教学资料收录。
- 调音器算法重写。
- 节拍器内部音频引擎重写。
- 节奏游戏内部关卡、按钮、音频和状态重写。
- UI 改版、文案统一、配色调整、动效改版。
- React、Vue、Svelte 等框架迁移。
- 将整页改为 Web Components 或 iframe 微前端。

## 5. 选定方案

采用渐进式原生 ES Modules 拆分，并保留 `assets/bootstrap.js` 作为公开页面启动入口。

选择这个方案的原因：

- 与当前 HTML/CSS/JavaScript 技术栈一致。
- 不需要重写页面框架，不需要引入构建器或前端框架。
- 可以保持现有 DOM、CSS 级联和视觉结果。
- 可以按模块小步迁移，每一步都可测试、可回退。
- 可以保护音频、节拍器、调音器和节奏游戏这些有特殊生命周期的模块。

## 6. 目标架构

目标分为六层：

1. **启动层**：`bootstrap.js` 装载动态 catalog，挂载应用。
2. **核心层**：状态、actions、selectors、DOM roots、生命周期。
3. **共享层**：escape、formatting、tags、media helpers、motion helpers。
4. **功能层**：home、levels、catalog、detail、tools。
5. **外部集成层**：Audio Speed Player、lesson metronome、tuner、rhythm game、catalog API。
6. **样式层**：tokens、base、layout、module CSS、responsive。

推荐文件结构：

```text
assets/
  bootstrap.js
  catalog-runtime.js
  app.js
  app/
    create-app.js
    core/
      store.js
      actions.js
      selectors.js
      dom-roots.js
      lifecycle.js
    shared/
      escape.js
      formatting.js
      tags.js
      media.js
      motion.js
    home/
      hero-notebook.js
      text-pressure.js
      lanyard.js
    levels/
      level-gallery.js
      level-song-picker.js
      splash-canvas.js
    catalog/
      filtering.js
      filters-view.js
      technique-cloud.js
      song-list.js
    detail/
      detail-shell.js
      detail-tabs.js
      lesson-pane.js
      audio-pane.js
      score-pane.js
      metronome-pane.js
    tools/
      tuner-entry.js
      rhythm-game-entry.js
  styles/
    tokens.css
    base.css
    layout.css
    home.css
    tuner.css
    rhythm-game-shell.css
    levels.css
    catalog.css
    detail.css
    audio.css
    score.css
    metronome.css
    responsive.css
```

第一阶段可保留 `assets/app.js` 作为兼容入口，逐步从中抽出模块。只有当对应模块迁移、测试和视觉验证完成后，才删除 `app.js` 中的旧实现。

## 7. 模块契约

### 7.1 DOM 所有权

- 全局 DOM 根节点只由 `dom-roots.js` 查询。
- 模块只能修改自己声明的根节点内部。
- 模块不得通过宽泛的 `document.querySelector` 修改其他模块。
- 模块不得删除、替换或移动其他模块的根节点。
- 缺少可选根节点时模块必须安全跳过，不创建旧 UI。

### 7.2 状态所有权

公共状态由 store 管理，视图模块只能通过 actions 更新状态。

公共状态至少包含：

- 查询关键词。
- 当前等级筛选、来源筛选、类型筛选。
- 当前选中歌曲 ID。
- 当前详情 Tab。
- 等级曲目选择器打开状态与当前等级。
- 每首歌当前音频版本。

规则：

- 状态变化只更新受影响模块。
- Tab 切换只更新 Tab 和面板显隐。
- 音频版本变化只更新 Audio 面板。
- 筛选变化只更新筛选、技巧云、曲目列表和必要的选中歌曲。
- 首页动效、节奏游戏、调音器和节拍器不得因为普通筛选变化被重建。

### 7.3 生命周期

每个交互模块应提供一致的生命周期：

```js
mount(context)
update(nextSlice)
destroy()
```

规则：

- 同一模块不得重复挂载。
- `window`、`document` 事件必须有清理逻辑。
- `requestAnimationFrame`、`ResizeObserver`、`IntersectionObserver` 和定时器由所属模块负责。
- 媒体模块默认采用持久宿主，不因 Tab 切换销毁。
- `destroy()` 只在页面卸载、模块真实移除或专项测试中调用。

## 8. 各模块职责

### 8.1 启动模块

- `bootstrap.js` 继续负责加载动态 catalog。
- `create-app.js` 创建上下文、状态、DOM roots 并按顺序挂载模块。
- 单个非关键模块失败时记录错误，不阻止其他模块初始化。
- 不在启动模块里写 UI 模板。

### 8.2 首页模块

包含：

- `hero-notebook.js`：负责 hero 中当前歌曲/调音器周边的展示边界。
- `text-pressure.js`：负责 UkuleleBook 字体压力效果。
- `lanyard.js`：负责吊牌 canvas、拖拽和物理。

规则：

- 首页动效不读取详情页内部 DOM。
- 吊牌拖拽、resize 和动画帧由 lanyard 模块自行管理。
- 不改变现有吊牌大小、位置、图片和动效参数。

### 8.3 调音器工具模块

- `tools/tuner-entry.js` 只负责确认 `#ukuleleTuner` 存在并导入/启动现有调音器。
- `assets/ukulele-tuner.js` 和 `assets/tuner-core.js` 第一阶段不重写。
- 其他模块不得直接控制调音器内部 AudioContext。

### 8.4 节奏游戏模块

- `tools/rhythm-game-entry.js` 只负责掌机外框、iframe 宿主和加载错误兜底。
- `assets/rhythm-chain-game/` 内部代码保持独立。
- 首页其他模块不得重建节奏游戏 iframe。
- 保留当前外框尺寸、倾斜、悬浮和响应式适配。

### 8.5 等级模块

包含：

- `level-gallery.js`：书籍封面横向画廊、拖动、左右按钮和选中态。
- `level-song-picker.js`：等级曲目选择弹层。
- `splash-canvas.js`：曲目选择器粒子/水花效果。

规则：

- 等级选择通过 action 更新公共状态。
- 画廊拖动状态属于画廊模块。
- 粒子 canvas 状态属于 splash 模块。
- 等级模块不得触碰详情 Tab、播放器或节拍器 DOM。

### 8.6 曲库模块

包含：

- `filtering.js`：纯筛选逻辑。
- `filters-view.js`：查询、等级、来源、类型控件。
- `technique-cloud.js`：技巧标签。
- `song-list.js`：曲目列表和选中动作。

规则：

- 只消费 `catalog-runtime.js` 输出的合并后数据。
- 筛选逻辑必须可在无 DOM 环境下测试。
- 曲目选择只发出 `selectSong(songId)`。
- 曲库模块不得操作详情面板内部 DOM。

### 8.7 详情外壳模块

`detail-shell.js` 负责：

- 歌曲标题、艺人、等级、来源、类型、技巧标签。
- 创建 Lesson、Audio、Score、Metro 固定宿主节点。
- 将歌曲变化分发给四个 pane。

`detail-tabs.js` 负责：

- Tab 按钮激活状态。
- 面板 `hidden`、ARIA 和可见类。
- 禁止通过重建详情外壳完成普通 Tab 切换。

### 8.8 Lesson 模块

- 只负责教学目标、重点、练习顺序、常见问题和通过标准。
- 技巧按钮只发出筛选 action。
- 不读取 Audio、Score、Metro 内部状态。

### 8.9 Audio 模块

`audio-pane.js` 负责：

- 根据歌曲 `audio` 数组生成版本选择。
- 维护每首歌当前音频版本。
- 创建 `<audio-speed-player>`。
- 更新播放器 `src`、`label` 和版本显示。

必须保持：

- 线上播放器脚本来源不变。
- 当前 Web Component 参数不变。
- 速度、音高保持、进度条、时长和 MetaBalls 由组件继续负责。
- 普通 Tab 切换不得重建 Metro。

### 8.10 Score 模块

`score-pane.js` 负责：

- 按数据顺序显示谱面图。
- 保留当前图片标题、懒加载、白底和适配方式。
- 单张图片失败只影响该图片位置。

规则：

- 不改变谱面顺序。
- 不裁切、不压缩、不修图。
- Score 更新不影响节拍器和播放器生命周期。

### 8.11 Metro 模块

`metronome-pane.js` 是生命周期保护优先级最高的模块。

必须保持：

- 同一详情生命周期内只存在一个页面内节拍器实例。
- 普通 Tab 切换只隐藏或停放 Metro 面板。
- 不因切到 Lesson、Audio、Score 而销毁节拍器宿主。
- 不因音频版本切换重建节拍器。
- 节拍器不可用时只在 Metro 面板显示兜底，不影响其他 pane。

当前项目使用 `assets/lesson-metronome.js` 页面内节拍器，不是远程 iframe。模块化文档和测试必须以当前真实实现为准，不能照搬 GuitarBook 的 iframe 约束。

## 9. CSS 模块化规则

CSS 拆分只能移动现有规则，第一轮不修改视觉值。

拆分顺序：

1. `tokens.css`：颜色、阴影、边框、尺寸变量。
2. `base.css`：reset、字体、基础元素。
3. `layout.css`：页面主布局、section、header、footer。
4. `home.css`：hero、文字压力、吊牌、首页装饰。
5. `tuner.css`：调音器。
6. `rhythm-game-shell.css`：节奏游戏外框。
7. `levels.css`：等级书籍画廊和曲目选择器。
8. `catalog.css`：筛选和曲库。
9. `detail.css`、`audio.css`、`score.css`、`metronome.css`：详情页分区。
10. `responsive.css`：保留媒体查询顺序，按模块注释归属。

规则：

- 每个模块样式从稳定模块根类开始。
- 禁止为了拆分引入新的视觉值。
- 禁止一个模块 CSS 定义另一个模块的内部类。
- 禁止用 `!important` 掩盖边界问题。
- CSS 入口可以先通过 `@import` 保持原加载顺序。

## 10. 数据流与更新范围

目标数据流：

```text
data.js + rsl-ukulele-data.js + catalog API
                 |
                 v
          catalog-runtime.js
                 |
                 v
        normalized catalog data
                 |
                 v
          store + actions
      |          |          |
      v          v          v
    home       catalog    detail shell
                            |
              +-------------+-------------+-------------+-------------+
              v             v             v             v
            lesson         audio         score         metro
```

更新范围：

| 用户操作 | 允许更新 | 禁止更新 |
| --- | --- | --- |
| 输入搜索 | 筛选控件、技巧云、曲目列表、必要时详情 | 首页吊牌、调音器、节奏游戏、节拍器实例 |
| 选择等级 | 等级模块、曲目列表、必要时详情 | 调音器、节奏游戏、节拍器实例 |
| 选择歌曲 | 详情标题、Lesson、Audio、Score、必要的 Metro 歌曲上下文 | 首页动效、等级动画、节奏游戏 |
| 切换详情 Tab | Tab 状态和面板显隐 | 详情外壳重建、Metro 销毁、Audio 无关重建 |
| 切换音频版本 | Audio 面板 | Lesson、Score、Metro |
| 调音器 START | 调音器模块 | 曲库、详情、节奏游戏 |
| 节奏游戏交互 | iframe 内部应用 | 公共 store、详情模块 |

## 11. 错误隔离

- 单个模块初始化失败不能阻止页面其他模块挂载。
- 错误日志必须带模块名。
- 动态 catalog 加载失败时继续使用静态曲库和缓存。
- Audio Speed Player 未注册时只影响 Audio 面板。
- 单张谱面加载失败只影响该谱面卡片。
- 节拍器初始化失败只影响 Metro 面板。
- 调音器麦克风授权失败只在调音器区域提示。
- 节奏游戏 iframe 加载失败只在游戏屏幕内兜底。

## 12. 测试策略

### 12.1 单元测试

- catalog 合并、动态覆盖、静态音频保留。
- 筛选和排序纯逻辑。
- 音频版本选择。
- 谱面顺序和空谱面状态。
- actions 只修改声明的状态切片。
- selectors 不把无关状态变化传给其他模块。

### 12.2 模块契约测试

- 每个模块只查询和修改自己的 root。
- 重复 `mount` 不重复绑定事件。
- Tab 切换不重建详情外壳。
- Tab 切换不重建 Metro 宿主。
- Audio 版本切换不影响 Score 和 Metro。
- 筛选变化不重建调音器和节奏游戏 iframe。
- 缺少可选 root 时模块安全跳过。

### 12.3 集成测试

- 页面启动后必要模块挂载。
- 静态歌曲和动态歌曲都能打开详情。
- Lesson、Audio、Score、Metro Tab 可连续切换。
- Audio Speed Player 显示正确 `src` 和 `label`。
- Score 显示全部谱页。
- 调音器 START 按钮仍可触发麦克风流程。
- 节奏游戏 iframe 保持当前本地路径。

### 12.4 视觉回归

重构前后使用同一数据和同一浏览器截图：

- 桌面：1440 x 900。
- iPad 竖屏：768 x 1024。
- iPad 横屏：1024 x 768。
- 手机：390 x 844。

至少覆盖：

- 首页首屏和吊牌。
- 调音器。
- 节奏游戏外框完整显示。
- 等级书籍画廊。
- 曲库筛选。
- Lesson、Audio、Score、Metro。
- 多页谱面滚动。

## 13. 分阶段迁移

### 阶段 0：冻结基线

- 记录当前提交、测试结果和生产 URL。
- 保存关键视口截图。
- 记录当前详情 Tab、Audio、Metro、Tuner、Rhythm Game 的行为。
- 不修改代码。

### 阶段 1：核心接口与纯逻辑

- 建立 `dom-roots.js`、`store.js`、`actions.js`、`selectors.js`、`lifecycle.js`。
- 迁移 escape、formatting、tags、media helpers。
- 迁移 catalog filtering 纯逻辑。
- 保持 `assets/app.js` 继续作为兼容主入口。

### 阶段 2：详情页稳定外壳

- 建立 `detail-shell.js` 和 `detail-tabs.js`。
- 建立四个固定 pane 宿主。
- 先写 Metro 宿主不被 Tab 切换销毁的契约测试。
- 再迁移 Lesson、Audio、Score、Metro pane。

### 阶段 3：首页和工具边界

- 迁移 text pressure。
- 迁移 lanyard。
- 建立 tuner entry。
- 建立 rhythm game entry。
- 保留视觉和动效参数。

### 阶段 4：等级和曲库

- 迁移等级书籍画廊。
- 迁移等级曲目选择器和 splash canvas。
- 迁移筛选控件、技巧云和曲目列表。

### 阶段 5：CSS 拆分

- 按模块移动 CSS。
- 只移动声明，不改变值。
- 每次移动后跑视觉和契约测试。

### 阶段 6：收口

- 删除 `assets/app.js` 中已迁移的旧逻辑。
- 保留 `assets/app.js` 或 `create-app.js` 作为轻量入口。
- 更新维护文档，说明各功能归属。

## 14. Git 与发布规则

- 必须在干净 worktree 和独立分支中执行。
- 不得在主目录脏工作区直接进行拆分。
- 不得把歌曲、音频、谱面、教学资料更新与模块化提交混合。
- 每个模块或基础契约一个小提交。
- 系统/UI 模块化走 GitHub main 到 Cloudflare Pages。
- 日常歌曲内容仍走本地内容发布器到 Worker API、D1 和 R2。
- 模块化发布前必须运行自动化测试、构建、线上 smoke test。

## 15. 后续维护规则

以后任何前端修改任务应先声明：

```markdown
任务名称：
所属模块：
目标行为：
现有行为基线：
允许修改文件：
禁止修改模块：
跨模块接口：
测试命令：
真机验证：
发布路线：GitHub/Pages 系统路线 或 D1/R2 内容路线
```

默认规则：

1. 修改某一模块，只改该模块、公共接口和对应测试。
2. 需要跨模块时必须说明原因和影响范围。
3. 禁止重新引入全局总渲染解决局部问题。
4. 禁止在模块外直接访问模块内部变量。
5. 涉及 Audio、Metro、Tuner、Rhythm Game 的修改必须运行媒体专项测试。

## 16. 完成定义

只有同时满足以下条件，模块化才算完成：

- `assets/app.js` 不再承载多个无关功能的大型实现。
- `assets/styles.css` 拆分为稳定模块样式，视觉级联保持一致。
- 每个模块都有明确 DOM root、输入、输出、生命周期和测试。
- 现有自动化测试全部通过。
- 新增模块契约测试和集成测试通过。
- 桌面、iPad、手机视觉验证通过。
- Audio Speed Player、谱面、节拍器、调音器、节奏游戏功能保持不变。
- 静态曲库和 D1 动态曲库都正常加载。
- D1/R2/Worker/content publisher 未被模块化提交修改。
- 变更可以按模块独立理解、测试和回退。
