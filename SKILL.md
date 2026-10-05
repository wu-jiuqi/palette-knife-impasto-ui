---
name: palette-knife-impasto-ui
description: "用刮刀厚涂油画媒介为 H5、Godot 及其他运行时制作 UI。每次先确定主题与组件清单，再调用 image_gen 生成本次主题的配套组件、拼装，最后补充补间动画与粒子等效果。默认交付资产包；用户要求实现时进行运行时集成与验收。"
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

1. **先确定主题**：读取项目上下文、原型和交付范围，写出本次主题、内容定位、情绪、配色、材质、形状与装饰语法，固定 style anchor。已有资源先标为布局、色卡、风格、主体参考或编辑目标，不因本地有旧项目就沿用其主题。用户让你自定主题时直接决定并说明，无需额外等待确认。详见 `references/style-bridge.md`。
2. **再列 UI 组件清单**：从页面内容和操作路径确定需要哪些组件；逐项列出用途、P0/P1/P2、视觉家族、所需状态、比例、文字安全区、透明要求，以及图片与运行时层的分工。按实际需要覆盖背景、主视觉、导航、按钮、面板、卡片、输入控件、选择控件、数据展示、弹窗、提示、结构和装饰，不能用已有素材反推页面需求。执行前读取 `references/component-inventory.md`，没有需求的组件也要写明 N/A 原因。
3. **Style Slice 定向**：组件清单建立后，有原型时按原型重建结构；无原型时用 `image_gen` 生成符合本次主题的整屏视觉方向。按 `references/game-ui-vertical-slice.md` 检查构图，并细化组件契约；整屏图或主视觉图不能代替组件生产。
4. **按主题生成配套组件**：必须实际调用 `image_gen`，依据清单和同一 style anchor 生成本次制作所需的组件本体。P0 独立生成或明确状态变体；本次已生成的同一几何家族可共享模板、切片与运行时状态层，不要求每个实例都单独生成。保留提示词、调用/输出证据和资产来源，不能只新生成主图、其余沿用上次组件后声称完成了配套生成。
5. **生成后拼装与检查**：把本次配套资产与正式文字、动态数据和交互状态回组。`asset-pack` 做静态回组，检查主题一致性、比例、层级、文字安全区、透明边缘和状态契约并标明运行时未验证；`runtime-integration` 接入目标平台后再检查主要交互、输入与实际反馈，然后进入动效阶段。
6. **最后补充动效与粒子**：拼装检查通过后，补充贴合主题的入场、悬停、按下、转场补间和环境粒子等效果；效果不得遮挡文字或抢占输入，保留减少动效/关闭粒子的降级。hover 默认采用同一油彩本体上的局部高光、刀痕或轻微位移，严禁用纯色块替换材质；触控设备提供 pressed、selected 或 focus-visible 等价反馈。`asset-pack` 只交付动效方案及所需资产，标明运行时未实现；不适用的效果说明原因，不用增加特效掩盖资产缺失。
7. **共享 QA + 平台 QA**：按 `references/cross-platform-qa.md` 和目标适配器验收。`asset-pack` 验收静态拼装、效果方案和降级说明并标注运行时未验证；`runtime-integration` 还要验收动效开启/降级、输入与窗口/视口。交付时区分“通过、部分通过、未验证”和证据。

任何 P0 视觉身份失败都回退到身份/切片阶段；`runtime-integration` 中的 P0 主要交互失败也必须回退。不要用增加纹理或数量掩盖方向错误。P1/P2 失败可以暂缓，但必须记录在 `unresolved_issues`。

## 必须遵守的边界

- `image_gen` 是主要视觉产出手段。只写提示词而没有实际生成时，不得声称资产已完成；工具不可用时交付可执行提示词和未完成状态。
- **每次制作遵循“主题 → UI 组件清单 → 按主题 image_gen 生成 → 拼装 → 补间/粒子 → 验收”。** 默认不复用上次或其他项目的成品视觉资产；只有用户明确指定使用已有资产时，才在指定范围内复用并记录来源及主题适配结果。代码、布局技术和状态逻辑可复用，但不能因此绕过本次主题的视觉生产。局部修改只处理用户指定的范围，不强制重做未涉及组件。
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
4. `references/component-inventory.md`：组件覆盖矩阵、完整状态策略、hover 材质规则和文字配对契约。
5. `references/game-ui-vertical-slice.md`：静态切片与运行时切片的验收门槛。
6. `references/cross-platform-qa.md`：共享质量检查和报告格式。
7. `runtime: h5-dom` 时读取 `references/platforms/h5.md`；`runtime: godot` 时读取 `references/platforms/godot.md`；新增平台读取 `references/platforms/adapter-template.md`。

如果宿主已安装 `palette-knife-impasto`，同时遵守它的画风基线和 image_gen 工具规范；本 Skill 只补充 UI 资产和接入规则，不覆盖用户本次明确指定的颜色或媒介要求。

## 输入路由与生成

### 有原型图

使用 `view_image` 检查本地图，说明每张图承担的角色，写出屏幕结构、锚点、安全区、组件清单和状态矩阵。原型中的文字默认只表示长度和位置，不烘焙进生产图片。按 `component-contract.md` 组织提示词并调用 `image_gen`；本地参考图先 `view_image`，然后使用 `referenced_image_paths`，会话图片使用覆盖所需图片的最小 `num_last_images_to_include`，两者不可同时传。

### 没有原型图

先确定本次主题、信息层级与主要操作，列出 UI 组件清单；再生成 Style Slice、细化布局契约，并按 P0/P1/P2 实际调用 `image_gen` 生成主题配套组件、状态或底图。完成拼装检查后再补动效与粒子。Style Slice 是视觉沟通稿，不是像素级布局和正式文案的唯一依据。

### 适配器选择

当用户要求运行时实现时，将共享 manifest 交给对应适配器：

- H5：DOM 语义、ARIA、焦点、safe-area、dvh/svh、触控、加载和响应式检查。
- Godot：预置 Control/Container 场景、Theme/StyleBoxTexture、TextureRect/NinePatchRect、输入导航、视口安全区、纹理导入和真实运行检查。
- 新平台：先复制 `adapter-template.md`，只补平台差异，不重写共享视觉流程。

## 交付

交付内容至少包括：主题说明、UI 组件清单、实际生成文件或预览、保存路径、组件/状态 manifest（含本次生成、同轮共享或用户指定复用的来源）、测得尺寸与颜色模式、Alpha 检查、九切/平铺/裁切说明、动效与粒子方案/实现、平台适配器、QA 证据、假设、未解决问题和最终提示词。使用 `asset-pack` 时明确运行时未验证；使用 `runtime-integration` 时记录运行时、版本、输入、屏幕范围和验证截图/日志。未生成或未接入的组件必须逐项说明，不能用新主图代表全套完成。 组件覆盖、hover 材质和文字配对检查以 `references/component-inventory.md` 的清单为准。
