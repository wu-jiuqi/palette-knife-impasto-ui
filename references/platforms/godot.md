# Godot 4.x / Control 适配契约

## 目标与边界

Godot 适配器把平台中立的刮刀厚涂 UI 资产接入 Godot 4.x 的 Control 场景、Theme 资源和预置控件。它负责资源导入、九切参数、主题状态、布局容器和输入语义；它不重新生成图像，也不把材质本体改成默认的纯色 StyleBox。

同一套资产契约应能服务桌面、移动和 Godot Web 导出。Godot Web 是 Godot 适配器下的部署配置，不是一套独立的视觉资产流程：

1. 先固定 style anchor、组件 ID、状态矩阵和 Alpha/切片契约。
2. 把图片导入为可追溯的 Texture2D，在编辑器中建立 Theme 或场景资源。
3. 优先使用预置 Control 节点、Container、Theme 和输入语义；除非确有必要，不在运行时动态生成整棵 UI 树。
4. 先完成一个可操作的垂直切片，再验证桌面/移动/Web 目标；各目标只调整布局、缩放和输入差异。
5. 把实际运行证据和没有运行的目标分别记录，不把编辑器预览当成导出验证。

## 输入与输出

### 必需输入

- 组件 ID、用途、文件路径、建议尺寸、状态和安全留白。
- 透明 Alpha、bleed、九切/平铺/裁切说明。
- 目标 Godot 4.x 小版本、窗口/视口比例、DPI 和输入方式。
- 正式字体、动态数据、本地化、焦点导航和无障碍要求。
- 场景中应保持的锚点、容器层级和层次关系。

### 适配器输出

- 导入设置与资源目录结构（PNG/WebP 等实际验证过的格式）。
- Texture2D、StyleBoxTexture、Theme、NinePatchRect 和预置 Control 节点的接入记录。
- 组件状态到 Theme 状态的映射表。
- 桌面/移动/Web 的场景和输入验证证据。
- 未验证目标、已知限制和回退方案。

## 资产到 Godot 节点的映射

| 资产/组件 | 推荐 Godot 节点或资源 | 视觉接入 | 约束 |
| --- | --- | --- | --- |
| 页面背景/底图 | TextureRect、ColorRect 仅作基底或 CanvasLayer 下的背景 Control | 底图使用 TextureRect 的纹理和保持比例策略；不把它当作可拉伸面板 | 明确 expand_mode、stretch_mode、焦点和裁切；纯色基底不能取代纹理主体 |
| 可伸缩面板 | Panel/PanelContainer + StyleBoxTexture | 在 Theme 中为目标 Control 类型指定纹理 StyleBox；配置四边 texture_margin 和内容边距 | StyleBoxTexture 的中心/边缘必须来自资产契约；不得再叠一层默认圆角或纯色 border |
| 复杂九切/装饰框 | NinePatchRect | 直接设置 texture、四边 patch_margin 和横/纵轴伸缩模式 | 中心是否绘制、边缘是否平铺/适应必须按清单记录；不要声称任意图都无缝九切 |
| 按钮 | 预置 Button + Theme 中的 StyleBoxTexture | 为 normal、hover、pressed、focus、disabled、checked 提供对应资产或有依据的复用 | 保留按钮文字、键盘/手柄焦点和 toggle_mode 语义；不以 TextureRect 点击脚本冒充按钮 |
| 搜索栏 | LineEdit 或 Search 组合场景 | LineEdit 的 Theme StyleBox 使用独立搜索框资产；提示文字和输入值由节点负责 | 保留清除、提交、输入法和焦点语义；搜索框形状不得复用普通按钮资产 |
| 下拉栏 | OptionButton / MenuButton + PopupMenu | 分别设置控件与弹出菜单的 Theme StyleBox/图标 | 保留键盘导航、焦点和弹出层级；必要时记录 Popup 的安全区适配 |
| Toast/提示 | PanelContainer + Label 或预置 AcceptDialog/Window | 使用独立提示资产的 StyleBoxTexture 或 NinePatchRect | Toast 的生命周期和读屏替代文字由脚本/场景逻辑负责；不要把文字烘焙到图片 |
| 图标/徽章 | TextureRect、TextureButton 或预置按钮 icon | 使用真实 Alpha 纹理；语义图标提供 Label/tooltip | 小尺寸先保证轮廓和方向，再使用刀痕；保持导入过滤设置一致 |
| 进度条 | ProgressBar、TextureProgressBar | 轨道与填充使用独立纹理或 Theme StyleBox；按组件契约选择平铺/裁切 | 同步数值、最小/最大值和可读标签；不能只依靠颜色表达进度 |

若一个组件需要同时使用 NinePatchRect 和语义控件，应让 NinePatchRect 作为视觉子节点，语义控件仍然保留在场景树中。不要用运行时创建的大量匿名节点掩盖缺少的场景资源。

## Theme 与 StyleBoxTexture 规则

- 用项目级 Theme 资源集中管理字体、颜色、图标和 StyleBoxTexture；组件局部覆盖只记录必要差异。
- 每个状态的 StyleBoxTexture 必须来自对应状态资产，或在清单中说明复用依据；状态几何、内容边距和文字安全区保持一致。
- StyleBoxTexture 的纹理边距应与生成资产的九切边缘相符；内容边距与文字区分别记录，不要把两者混为 texture_margin。
- NinePatchRect 用于需要显式控制纹理、中心绘制和轴伸缩的复杂框体；Panel/ Button 的主题绘制优先使用 StyleBoxTexture。
- 允许用 Theme 的颜色、字体和焦点环补充语义状态，但不能用默认纯色 StyleBox 覆盖材质本体。
- 当中心区承载动态内容时，中心纹理应低变化、高对比；若中心有构图焦点，改用不可伸缩的整图或分层场景。
- 为可读性保留 focus 状态（主题 StyleBox 或明确的焦点子节点）；它不能被厚涂刀痕吞掉。

## 场景、布局与输入

- 使用 MarginContainer、VBoxContainer、HBoxContainer、GridContainer、AspectRatioContainer 等预置节点表达布局；锚点和最小尺寸服务于内容，不用固定像素把整屏锁死。
- HUD 或覆盖层放入明确的 CanvasLayer；弹窗和 Toast 的层级、鼠标过滤及焦点转移写入场景/交互契约。
- 触控目标建议至少 44px × 44px（按项目 DPI 规范换算），并检查最小尺寸在缩放后仍可触控。
- 按钮、LineEdit、OptionButton、Dialog 等保留 Godot 原生语义和输入动作；脚本只处理业务状态，不重写基础导航。
- 通过 FocusMode、焦点邻接或容器顺序明确键盘/手柄导航；移动端点击状态不能依赖 hover。
- 字体、文本、动态数值和本地化由 Label/Theme/翻译系统承担；生成图保持无字和干净留白。

## 导入与性能

- 记录每张纹理的实际尺寸、Alpha、压缩格式、过滤、重复和 mipmap 设置；透明组件不要被有损压缩破坏边缘。
- 首屏纹理可在场景资源中预加载；大量非关键装饰按项目资源策略延迟加载，避免同时解码大图。
- 不把高分辨率底图复制到每个控件；共享 Texture2D 和 Theme 资源，减少重复内存。
- 以实际平台 profiler 或帧时间记录为依据调整尺寸、压缩和绘制层级；没有采样时不要宣称性能达标。
- 如果资源需要多倍率，优先通过导出尺寸、Viewport 缩放或项目资源规则解决；不要在运行时无依据地放大模糊纹理。

## Godot Web 部署适配

Godot Web 复用同一场景、Theme 和资产，但必须单独验证导出和浏览器行为：

- 记录 Godot 版本、渲染后端、浏览器版本、视口尺寸、设备像素比和输入设备。
- 检查 Canvas resize 模式、拉伸设置、Viewport/Control 锚点及移动浏览器可视区域；不要把编辑器窗口尺寸当成 Web 证据。
- 在至少一个桌面浏览器和一个移动浏览器中验证：首屏可见、点击/触控、键盘焦点（如适用）、弹窗关闭、滚动和横向溢出。
- 检查 Web 导出加载日志、资源 404、纹理导入失败、音频/输入策略和暂停恢复；若某功能受浏览器策略限制，记录为未验证或降级。
- 视觉风格仍由共享生成资产承担；Godot Web 只改变缩放、输入和加载条件。不要因为 Web 导出而重新用 CSS 或纯色补画 Godot UI。
- Web 导出受限于浏览器与 Godot 小版本；具体线程、音频、输入、渲染后端和缓存行为以目标版本实测为准，文档不替代测试。

## Godot 验证证据

| 检查 | 证据示例 | 结论 |
| --- | --- | --- |
| 资源导入 | Inspector 截图、导入设置、Alpha 检查 | 已验证/未验证 |
| Theme/九切 | Scene/Theme 资源、不同尺寸截图 | 已验证/未验证 |
| 状态与输入 | normal/hover/pressed/focus/disabled、键盘/手柄步骤 | 已验证/未验证 |
| 布局与缩放 | 多视口运行截图、容器/锚点检查 | 已验证/未验证 |
| 可读性与本地化 | Label/字体/语言切换记录 | 已验证/未验证 |
| 性能 | Profiler 帧时间、纹理内存或 draw call 记录 | 已验证/未验证 |
| Godot Web | 导出包、浏览器日志、桌面/移动 Web 截图 | 已验证/未验证 |

证据至少包含测试日期、Godot 小版本、导出预设、设备/浏览器和资产提交。只有编辑器中打开资源而没有运行截图时，最多标记为“资源级已验证”，不能写成“运行时已验证”。

## 失败与回退

- StyleBoxTexture 九切变形：检查 texture margin、中心绘制和轴伸缩；必要时回退到保持比例的整图或分层 NinePatchRect。
- 透明边缘污染：重新检查导入压缩、过滤和 bleed；不要用纯色背景遮盖。
- Web 导出加载或输入失败：保留可见语义和尺寸，提供静态状态/提示并在未验证报告中写明浏览器限制。
- 字体或本地化撑破布局：调整容器、最小尺寸和文字区契约；不要截断关键文案或将其烘焙进图片。

## 未验证报告模板

    平台：Godot 4.x / 桌面、移动或 Web：
    Godot 版本与导出预设：
    资产版本/提交：
    资源级已验证：
    - [ ] Texture2D 导入与 Alpha
    - [ ] Theme/StyleBoxTexture/NinePatchRect 参数
    运行时已验证：
    - [ ] 布局、状态和输入
    - [ ] 字体、本地化和可读性
    - [ ] 性能采样
    - [ ] Godot Web（如适用）

    未验证：
    - 目标：
      原因：
      需要的证据：
    已知限制与回退：
