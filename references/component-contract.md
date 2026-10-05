# UI 组件资产契约

组件在生成前建立记录，生成后补齐测量值和证据。未知字段写成假设，不要把未测量的数据当成事实。这个契约只描述共享资产；平台专属字段放入对应 adapter manifest。

```text
component_id:
family:                         # 同一几何/材质家族，可共享模板
purpose:
priority: P0 | P1 | P2
semantic_role: button | input | panel | icon | decorative | ...
required_states: normal, hover, pressed, focus, disabled, selected, error
state_rendering_strategy: independent_image | shared_plus_runtime | template | native_layer
source_master:
runtime_variants:
actual_dimensions:              # 生成后实测像素
file_bytes:
color_mode: RGBA | RGB | ...
alpha_required: yes | no
alpha_min_max / alpha_visual_check:
canvas_ratio / suggested_size / scale:
text_safe_rect / content_padding / bleed:
resize_mode: fixed | nine-slice | tile | crop
slice_margins / stretch_axes / minimum_size / allowed_crop:
style_anchor / reference_roles / generation_prompt:
integration_locations:
qa_status: pass | partial | unverified | blocked
evidence:
unresolved_issues:
```

## 材质本体与复用

- 生成图必须承担主要组件本体的外形、边缘和颜料材质。运行时可以叠加文字、图标、动态数据、焦点环、错误/加载反馈和低细节降级层，但不能用扁平纯色框替代主要厚涂本体。
- 同一视觉家族可以共享模板、边缘或九切策略；组件语义不同或最小尺寸/文字区不同，就要重新验证，不能只靠改颜色或任意拉伸按钮图。
- 搜索栏、下拉栏、Toast、提示框、标签和进度条默认需要不同的形状语法；只有在契约中说明家族关系和裁切限制时才可复用。
- 缩略图中只剩平面色块、油画体积消失、刀痕方向与风格锚点冲突时，材质检查失败。

## 资产类型

- **独立组件**：按钮、图标、徽章、游标和装饰。保持完整轮廓并留出安全边距。
- **面板和边框**：记录中心区、边缘区、切片边距、内容留白和是否适合九切；不得把底图当成可拉伸面板。
- **底图和场景 UI**：明确画布比例、视觉焦点、前中后景和文字/动态数据留白。
- **状态图集**：仅在用户需要或适配器要求时输出；每个格子记录状态、尺寸和可见差异。

## 透明、文字与颜色模式

- 透明组件必须是真实 Alpha，不能带绿幕、棋盘格或意外背景色。检查 Alpha 通道是否存在、可见像素是否存在、透明边缘是否干净，并在深浅背景上查看。
- 不要求 Alpha 最大值必须为 255；生成工具可能返回 254 的半透明边缘。RGB 只在契约明确它是不透明背景或纹理时成立，不能用混合模式冒充独立透明组件。
- 正式文字、数字、计时器、长文案和本地化内容默认不烘焙进图像。需要文字时生成低细节、高对比的安全区，由目标平台负责字体、排版、焦点和语言切换。
- 小图标优先保证轮廓、方向、孔洞和识别比例，再增加厚涂细节。

## 尺寸、边缘和切片

- 生成前明确目标画布比例、建议像素尺寸、倍率、文件格式和性能预算；工具实际返回尺寸、字节数和颜色模式需核验后才能报告。
- 九切要分别记录纹理切片边距、内容留白和外扩刀痕；实际测试最小尺寸、常用尺寸和允许的最大裁切，避免文字压到刀痕。
- 需要平铺时检查接缝；不要声称生成图天然无缝。阴影、刀痕和外轮廓必须有 bleed，裁切时不能削掉关键结构。
- 命名包含功能、状态和版本，例如 `menu_button_normal_v01`；不要覆盖旧版资源。

## 状态矩阵

状态差异写进提示词或运行时实现策略，保持几何关系不变：

| 状态 | 视觉提示 | 不应改变 |
| --- | --- | --- |
| normal | 基准材质、基准明暗 | 轮廓、内边距、文字区 |
| hover | 局部高光、轻微色温或刀痕强调 | 尺寸、语义、可读性 |
| pressed | 压低明暗、内陷或颜料受压痕迹 | 位置、轮廓、图标方向 |
| focus | 清晰可识别的焦点边缘或对比环 | 主要材质和文字区 |
| disabled | 降低对比度或饱和度 | 仍需可辨识、不可伪装成缺失 |
| selected | 稳定的当前项/选中强调 | 交互语义和布局 |
| error/success | 受控色彩或符号反馈 | 基础结构和叠字区 |

focus 与 selected 可以同时存在；不必为每种组合生成独立图片，契约要记录哪个层负责组合。
