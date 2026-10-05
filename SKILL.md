---
name: palette-knife-impasto-ui
description: "用刮刀厚涂油画媒介为 H5、Godot 及其他运行时生成可扩展的 UI 视觉资产。先建立平台中立的视觉身份与组件契约，再按需加载 H5 或 Godot 适配器；默认交付图像资产和接入说明，只有用户要求实现时才验证运行时集成。"
---

# 刮刀厚涂油画 UI

这个 Skill 由一个平台中立的视觉核心和可替换的平台适配器组成。核心负责视觉身份、资产生产、状态契约和共享质检；适配器负责具体运行时的布局、输入、焦点、资源导入、性能和验收方法。首批适配器是 H5 DOM 和 Godot 4.x，其他平台按 `references/platforms/adapter-template.md` 扩展。

## 入口先确定交付模式

从用户请求中提取以下字段；未提供的字段写成假设，不要凭空声称已经验证：

```text
delivery_mode: asset-pack | runtime-integration
runtime: h5-dom | godot | other | unspecified
runtime_version:
input: mouse | keyboard | gamepad | touch | mixed
screen_range / export_targets:
existing_constraints:
```

- `asset-pack` 是默认模式：交付视觉切片、生产资产、状态清单和适配说明，不创建网页或引擎项目。静态切片用于检查层级、材质、文字安全区和缩放假设，并明确“运行时未验证”。
- `runtime-integration` 来自用户明确说“接入、实现、可运行、做 H5 页面、做 Godot 场景”等请求。加载对应平台适配器，必须在真实目标运行时检查组件、文字、输入、状态和尺寸；整张生成截图加几个热点不算完整运行时验收。
- `runtime` 未指定时保持平台中立。不要因为出现“网页”或“游戏”就替用户选择 H5 或 Godot；如果用户只要资产，继续使用 `asset-pack`。
- Godot 的 Web 导出仍使用 Godot 适配器，并在其后追加浏览器导出检查；不要把它改写成 H5 DOM 项目。

## 共享工作流

整屏或多组件任务按下面顺序执行；单个小资产可以缩小范围，但仍要留下契约和状态假设：

1. **项目与 inventory**：读取原型、截图、现有资源、画布/响应式范围、输入方式和目标运行时。区分布局参考、色卡、风格参考、主体参考和编辑目标。
2. **视觉身份**：固定刮刀厚涂媒介、刀痕方向、颜料体积、画布露底、主次色、形状语法、标题处理、装饰符号、动效语气和禁用方向。详见 `references/style-bridge.md`。
3. **Style Slice**：有原型时按原型重建结构；无原型时先用 `image_gen` 生成整屏视觉方向。整屏任务使用 `references/game-ui-vertical-slice.md`，根据交付模式选择静态或运行时验收。
4. **优先级生产**：把组件标为 P0/P1/P2，按视觉家族复用风格锚点。P0 组件独立生成或明确的状态变体；同一几何家族可以共享模板和切片，但不能把一个按钮任意拉伸成搜索栏、Toast 或提示框。
5. **回组**：将生产资产与运行时文字、动态数据和状态说明重新放回切片，复查比例、层级、文字安全区、透明边缘和状态差异。
6. **共享 QA + 平台 QA**：先执行 `references/cross-platform-qa.md`，再按 `references/platforms/h5.md`、`godot.md` 或新增适配器执行平台检查。交付时区分“通过、部分通过、未验证”和证据。

任何 P0 视觉身份或主要交互失败，都回退到身份/切片阶段；不要用增加纹理或数量掩盖方向错误。P1/P2 失败可以暂缓，但必须记录在 `unresolved_issues`。

## 必须遵守的边界

- `image_gen` 是主要视觉产出手段。只写提示词而没有实际生成时，不得声称资产已完成；工具不可用时交付可执行提示词和未完成状态。
- 默认生成无字、无 Logo、无水印的资产，正式文字、动态数据、业务状态、本地化和无障碍由运行时负责。若用户明确要求图中文字，把它登记为 artwork content 并单独验收。
- 透明组件必须是真实 Alpha；明确登记的不透明背景、底图或纹理可以是 RGB。不要用绿幕、棋盘格或混合模式伪造透明。
- 生成图必须承担主要组件本体的外形、边缘和油画材质。运行时可以提供文字、焦点环、错误/加载反馈和低细节降级层，但不能用扁平纯色框替代主要厚涂本体。
- 不把“每个实例一张图”和“所有状态都做成图片”当成硬规则。按优先级、视觉家族和状态实现策略决定独立图、共享图加运行时强调、模板变体或原生状态层；focus 可以与 selected 同时存在，无需生成笛卡尔积。
- 默认最多进行一次针对性视觉修订。第二次仍失败时报告限制和未解决问题，不无限重试。
- 没有明确实现请求时，不生成 Godot、Unity、Unreal 或 HTML/CSS 代码；适配器文档只用于说明接入与验收边界。

## 参考文件路由

按任务读取最小必要集合：

1. `references/style-bridge.md`：媒介、笔触、材质、颜色、细节密度和可读性。
2. `references/ui-workflow.md`：有/无原型、inventory、Style Slice、优先级和回组流程。
3. `references/component-contract.md`：组件字段、状态策略、Alpha、文字安全区、九切/平铺和证据。
4. `references/game-ui-vertical-slice.md`：静态切片与运行时切片的验收门槛。
5. `references/cross-platform-qa.md`：共享质量检查和报告格式。
6. `runtime: h5-dom` 时读取 `references/platforms/h5.md`；`runtime: godot` 时读取 `references/platforms/godot.md`；新增平台读取 `references/platforms/adapter-template.md`。

如果宿主已安装 `palette-knife-impasto`，同时遵守它的画风基线和 image_gen 工具规范；本 Skill 只补充 UI 资产和接入规则，不覆盖用户本次明确指定的颜色或媒介要求。

## 输入路由与生成

### 有原型图

使用 `view_image` 检查本地图，说明每张图承担的角色，写出屏幕结构、锚点、安全区、组件清单和状态矩阵。原型中的文字默认只表示长度和位置，不烘焙进生产图片。按 `component-contract.md` 组织提示词并调用 `image_gen`；本地参考图先 `view_image`，然后使用 `referenced_image_paths`，会话图片使用覆盖所需图片的最小 `num_last_images_to_include`，两者不可同时传。

### 没有原型图

先读取项目上下文和已有资源，输出信息层级、主要操作、情绪、材料、色彩、假设和要避免的方向。生成 Style Slice 和布局契约，再按 P0/P1/P2 生成透明组件、状态或底图。Style Slice 是视觉沟通稿，不是像素级布局和正式文案的唯一依据。

### 适配器选择

当用户要求运行时实现时，将共享 manifest 交给对应适配器：

- H5：DOM 语义、ARIA、焦点、safe-area、dvh/svh、触控、加载和响应式检查。
- Godot：预置 Control/Container 场景、Theme/StyleBoxTexture、TextureRect/NinePatchRect、输入导航、视口安全区、纹理导入和真实运行检查。
- 新平台：先复制 `adapter-template.md`，只补平台差异，不重写共享视觉流程。

## 交付

交付内容至少包括：实际生成文件或预览、保存路径、组件/状态 manifest、测得尺寸与颜色模式、Alpha 检查、九切/平铺/裁切说明、平台适配器、QA 证据、假设、未解决问题和最终提示词。使用 `asset-pack` 时明确运行时未验证；使用 `runtime-integration` 时记录运行时、版本、输入、屏幕范围和验证截图/日志。
