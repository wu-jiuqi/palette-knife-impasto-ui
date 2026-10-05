# 刮刀厚涂油画 UI Skill

`palette-knife-impasto-ui` 用 `image_gen` 生成具有厚颜料、方向性刀痕和选择性画布肌理的 UI 视觉资产。它由平台中立的视觉核心和可替换的平台适配器组成：同一套风格身份与资产契约可以交给 H5、Godot 或后续扩展的平台。

## 核心能力

- 每次先确定主题，再按内容与交互需求列出 UI 组件清单；已有资源先作参考，不默认沿用上一项目的视觉组件。
- 没有原型图时依据主题与清单生成整屏 Style Slice，再调用 `image_gen` 按优先级生成本次配套组件；同轮同家族可共享，已有成品仅在用户明确指定时复用。
- 生成 normal、hover、pressed、focus、disabled、selected、error 等需要的状态，并记录每个状态由图片还是运行时层实现。
- 输出透明前景、面板、边框、底图、装饰、图标和状态资产；不透明背景或纹理会在契约中明确登记。
- 为每项资产提供测得尺寸、颜色模式、Alpha、文字安全区、九切/平铺/裁切和证据。
- 默认交付平台中立的资产包；用户明确要求接入时，按 H5 或 Godot 适配器做运行时验收。
- 生成后拼装并检查静态界面；`runtime-integration` 再检查主要交互，最后补充主题化补间动画、粒子等效果。`asset-pack` 交付静态回组、效果方案与所需素材，并标明运行时未实现。

## 交付模式

### `asset-pack`（默认）

交付 Style Slice、资产文件、组件/状态 manifest、适配说明和共享 QA 结果，不创建网页或引擎项目。静态切片可以检查层级、材质、可读性和缩放假设，但必须注明运行时未验证。

### `runtime-integration`

用户说“接入、实现、可运行、做 H5 页面、做 Godot 场景”等请求时启用。H5 使用 DOM 适配器；Godot 使用 Control/Container/Theme 等 Godot 适配器。必须在实际运行时检查原生文字、布局、输入、焦点、状态、窗口/视口和加载反馈。

Godot Web 导出仍走 Godot 适配器，再追加浏览器导出检查；它不是 H5 DOM 实现。

## 共享流程

`确定主题 → UI 组件清单 → Style Slice 定向 → image_gen 生成配套组件 → 拼装与检查 → 补间动画/粒子等效果 → 共享 QA + 平台 QA → 证据交付`

生成一张新主图后沿用旧项目的按钮、面板和卡片，不算完成本流程。交付必须区分本次生成、同轮共享、用户指定复用和暂缓项；允许复用实现代码，不借此跳过视觉生产。

整屏任务使用 [`references/game-ui-vertical-slice.md`](references/game-ui-vertical-slice.md)。组件字段、状态和切片策略见 [`references/component-contract.md`](references/component-contract.md)。风格桥接见 [`references/style-bridge.md`](references/style-bridge.md)。

## 平台适配器

- [`references/platforms/h5.md`](references/platforms/h5.md)：DOM 语义、ARIA、焦点、safe-area、`dvh/svh`、触控、加载和响应式检查。
- [`references/platforms/godot.md`](references/platforms/godot.md)：预置 `Control/Container` 场景、`Theme/StyleBoxTexture`、`TextureRect/NinePatchRect`、键盘/手柄/触控、视口安全区、导入和真实运行检查。
- [`references/platforms/adapter-template.md`](references/platforms/adapter-template.md)：新增平台的协议、manifest 和证据模板。

平台适配器只补布局、输入、导入、性能和验证方法，不重写共享刮刀厚涂视觉核心。没有明确实现请求时，Skill 不生成 Godot、Unity、Unreal 或 HTML/CSS 代码。

## 使用方式

安装后可以直接描述需求，或显式调用：

```text
使用 $palette-knife-impasto-ui，根据这张战斗 HUD 原型图生成面板、按钮和图标组件。
```

如果需要 H5 实现，请说明运行时版本、屏幕范围和输入方式；如果需要 Godot 实现，请说明 Godot 版本、导出目标、输入设备和已有场景约束。

## 本地安装

将整个目录放入 Codex 技能目录：

```text
C:\Users\30114\.codex\skills\palette-knife-impasto-ui
```

也可以从 GitHub 克隆后复制到 `$CODEX_HOME/skills/`：

```powershell
git clone https://github.com/wu-jiuqi/palette-knife-impasto-ui.git
Copy-Item -Recurse .\palette-knife-impasto-ui "$env:USERPROFILE\.codex\skills\"
```

重新打开或开始下一轮 Codex 对话后，Skill 会进入可发现列表。

## 目录结构

```text
palette-knife-impasto-ui/
├── SKILL.md                         # 共享入口、模式、路由和边界
├── agents/openai.yaml               # Skill 展示名称和默认提示
├── references/
│   ├── style-bridge.md              # 刮刀油画到 UI 的风格桥接
│   ├── ui-workflow.md               # inventory、切片、优先级和回组
│   ├── component-contract.md        # 组件、状态、Alpha 和切片契约
│   ├── game-ui-vertical-slice.md    # 静态/运行时切片验收
│   ├── cross-platform-qa.md         # 共享交付与质检
│   └── platforms/                   # H5、Godot 和扩展适配器
├── demo/                            # H5 交互验收用的示例切片
└── evals/scenarios.md               # 行为验收场景
```

## 验证

使用 Skill Creator 的校验脚本：

```powershell
python -X utf8 `
  "$env:USERPROFILE\.codex\skills\.system\skill-creator\scripts\quick_validate.py" `
  .
```

行为场景位于 [`evals/scenarios.md`](evals/scenarios.md)。示例页可从仓库根目录运行 `python -m http.server 8790` 后访问 `http://localhost:8790/demo/`。

## 已知限制

- `image_gen` 可能生成错误文字，因此正式文案默认由运行时叠加。
- 多次生成之间的几何和身份一致性需要 style anchor、视觉家族和实际回组检查。
- 生成图片无法替代响应式布局、字体系统、本地化、无障碍和交互逻辑。
- 九切、平铺、严格色值、像素级几何、透明通道和运行时性能只有在实际核验后才能确认。
- 生成失败时最多进行一次定向修订；低优先级资产可以暂缓，但必须记录问题。

## 相关项目

- 远端仓库：<https://github.com/wu-jiuqi/palette-knife-impasto-ui>
- 通用画风 Skill：`palette-knife-impasto`
