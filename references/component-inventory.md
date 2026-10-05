# UI 组件覆盖清单

这份清单解决“只做主按钮和卡片，却声称独立完成 UI”的问题。每次制作先把本次需求映射到下表，再按 P0/P1/P2 逐项生成、拼装和验收。没有需求的项可以标记为 N/A，但不能默默遗漏。

## 组件族与最低状态

| 组件族 | 组件 | 最低状态 | 材质本体策略 | 文字搭配要求 |
| --- | --- | --- | --- | --- |
| 基础操作 | Primary/Secondary/Danger/Icon Button | default、hover、pressed、focus、disabled、selected | 独立按钮资产或同一几何家族状态图；状态只在局部刀痕、高光、受压处变化 | 文字放在干净安全区，主操作使用高对比，图标和文字不得压住颜料堆积 |
| 导航 | Tabs、Breadcrumb、Pagination、Segmented Control | default、hover、active、focus、disabled | Tab 下划线/印章/撕纸边保持材质；不要用纯色矩形高亮整项 | 标签长度变化时仍保留左右留白和基线对齐 |
| 输入 | Text Field、Search、Textarea、Select/Combobox | empty、filled、hover、focus、error、disabled | 每种容器独立形状；聚焦只增加材质高光或焦点环，不覆盖油彩 | placeholder、正文、错误文案采用明确层级，错误图标与文字同一阅读起点 |
| 选择 | Checkbox、Radio、Switch、Slider | default、hover、pressed、checked、focus、disabled | 控件本体保留刀痕；轨道与滑块分开定义，checked 不退化为纯色圆点 | 选择状态同时使用勾、点、位置或标签，不只依赖颜色 |
| 信息展示 | Panel、Card、List、Table、Badge、Avatar、Progress | loading、default、selected、empty、error（按需） | 大面板使用九切/平铺契约，小卡片用独立边缘；进度填充必须有真实材质或可核验平铺 | 标题、正文、元数据三层字号与颜色固定，数字区降低纹理密度 |
| 反馈 | Toast、Alert、Tooltip、Popover、Dialog/Modal、Skeleton | info、success、warning、error、open、close、disabled | 每种反馈使用独立轮廓；遮罩/焦点环是语义层，不替代提示本体 | 状态图标先于标题，正文行长受控，关闭控件有清晰命中区 |
| 结构 | App Shell、Sidebar、Toolbar、Section Header、Empty State | default、collapsed、mobile | 结构材质由背景/边框资产承担，布局层不伪造默认圆角卡片 | 标题与操作遵循同一基线，移动端可折叠但不截断关键文案 |
| 装饰 | Icon、Badge、Stamp、Divider、Cursor、Particles | default、hover/active（需要交互时） | 透明 Alpha；小尺寸降低刀痕密度，保留轮廓与孔洞 | 装饰不得与正文竞争对比度，不在图像中烘焙动态文本 |

## 完整状态策略

每个组件在 manifest 中记录 `state_strategy`：

- `asset`：状态需要独立 image_gen 资产，几何、视角和安全区不变。
- `runtime-emphasis`：共享材质本体，运行时只增加局部高光、刀痕闪动、轻微位移或焦点环。
- `native`：语义或无障碍状态由 DOM/Godot 原生控件提供，不能改变主要油画轮廓。
- `not-needed`：本组件不支持该状态，写明原因。

### Hover 材质硬规则

1. hover 不能把生成图替换成纯色背景、纯色渐变或默认系统高亮。
2. 优先保持原图，使用同一材质的亮度/饱和度微调、局部叠加刀痕纹理或 `mix-blend-mode: screen/overlay`；叠加层必须透明且不改变轮廓。
3. 只允许 4–10% 的尺寸/位移变化，避免文字与组件错位。
4. 触控设备不能依赖 hover；必须有 pressed、selected 或 focus-visible 的可见等价反馈。
5. disabled 也要保留厚涂边缘和可辨识轮廓，使用去饱和/降低对比度而不是删除材质。

## 文字与组件配对契约

每个组件都要声明 `text_zone` 和 `type_pairing`：

- `text_zone`：安全区位置、最大行数、建议字号、最小对比度和可变宽度。
- `type_pairing`：标题衬线/展示字体、正文无衬线、数字等宽或半衬线的组合，以及中文 fallback。
- 文案默认由运行时叠加，image_gen 只生成无字资产；用户明确要求烘焙文字时单独验收。
- 深色油彩用暖纸色文字，浅色油彩用墨色文字；必要时加小范围描边或阴影，不能加整块纯色底。
- 组件有图标时，图标和文字共享视觉基线，图标尺寸不超过正文行高的 1.35 倍。
- 窄屏以换行和压缩间距解决，不通过裁剪文字或把字号降到 12px 以下。

## 交付前检查

- [ ] 本次需求已映射到组件清单，未覆盖项有 N/A 原因。
- [ ] 每个 P0 组件有本体资产、状态策略、文字安全区和实际回组证据。
- [ ] hover/pressed/disabled 没有纯色块替换材质。
- [ ] 所有输入、反馈和结构组件均有语义映射，不只展示装饰图。
- [ ] 桌面、窄屏和触控路径都能识别状态；`prefers-reduced-motion` 有静态降级。
