# 刮刀厚涂油画 UI Skill

`palette-knife-impasto-ui` 是一个以 `image_gen` 为主要产出手段的跨平台 UI 视觉资产生成 Skill。它沿用刮刀厚涂油画的厚颜料、方向性刀痕和选择性画布肌理，为游戏或其他交互项目生成面板、按钮、图标、边框、底图和状态资产。

它适用于 Godot、Unity、Unreal、HTML/CSS 以及其他运行时。Skill 默认交付平台中立的图像资产和交接说明，不替目标平台生成场景、脚本或完整 UI 代码。

## 能做什么

- 根据线框、截图、Style Frame 或现有 UI 原型拆解组件。
- 没有原型图时读取项目上下文，先生成整体视觉原型，再生成组件。
- 生成 normal、hover、pressed、focus、disabled、selected 等需要的状态。
- 输出透明 Alpha 组件、面板、边框、装饰、图标和底图。
- 为每项资产提供尺寸、留白、切片、状态和平台接入说明。
- 生成后检查材质、可读性、透明边缘和样式一致性，并进行一次定向修订。

## 两条工作流

### 有原型图

Skill 会先检查原型图，判断它承担的是布局、配色、风格、主体还是编辑参考，然后拆分为：

1. 屏幕结构和安全区。
2. 背景、面板和装饰材质。
3. 按钮、图标、进度条、弹窗等组件。
4. 组件状态和必须保持的比例关系。
5. 正式文字和动态数据的占位区域。

之后按逻辑资产分别调用 `image_gen`。原型中的文字默认只作为位置和长度提示，不直接烘焙进生产图片。

### 没有原型图

Skill 会先读取项目说明、场景、截图、已有资源、目标平台和分辨率要求，输出简短的 UI 判断，包括信息层级、主要操作、情绪、材质、配色和需要避免的网页化元素。

接着生成一张整体视觉原型（Style Frame），并附一份文字版布局契约。Style Frame 用于沟通气氛、层级和组件关系，不作为像素级布局或正式文案的唯一依据。最后再以它为参考逐项生成生产用组件。

## 刮刀油画 UI 原则

- 厚颜料和刀痕主要用于面板、边框、底图和装饰。
- 文字、数字和动态数据区域保持低细节、高对比。
- 小图标和窄按钮降低纹理密度，优先保证轮廓和识别度。
- 默认不生成文字、Logo、签名或水印。
- 透明组件必须是真实 Alpha，不使用绿幕或棋盘格假透明。
- 同一批次资产使用统一的媒介、材质、色彩关系和笔触方向作为风格锚点。

## 跨平台边界

默认输出：

- PNG 等平台中立的图像资产。
- 组件和状态清单。
- 建议画布比例、尺寸、倍率、Alpha 和边缘留白。
- 九切、平铺、裁切和安全区说明。
- 正式文字、字体、动态数据、交互逻辑、本地化和无障碍的接入提示。

Skill 不会默认生成 Godot、Unity、Unreal 或 HTML/CSS 代码。raster 资产本身也不能保证响应式布局、字体正确性、键盘焦点或无障碍行为，这些由目标运行时负责。

## 使用方式

安装后可以直接描述需求，或显式调用：

```text
使用 $palette-knife-impasto-ui，根据这张战斗 HUD 原型图生成面板、按钮和图标组件。
```

没有原型图时可以提供项目类型、世界观、目标平台、画布比例、已有截图和需要的界面；Skill 会执行 fallback 流程。

如果需要严格的文字排版、响应式布局或引擎接入，应在生成视觉资产后，再交给对应的平台实现流程。

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
├── SKILL.md                         # 入口、路由和核心边界
├── agents/openai.yaml               # Skill 展示名称和默认提示
├── references/
│   ├── style-bridge.md              # 刮刀油画到 UI 的风格桥接
│   ├── ui-workflow.md               # 有原型/无原型工作流
│   ├── component-contract.md        # 组件、状态、Alpha 和切片契约
│   └── cross-platform-qa.md         # 跨平台交付与质检
└── evals/scenarios.md               # 行为验收场景
```

## 验证

使用 Skill Creator 的校验脚本：

```powershell
python -X utf8 `
  "$env:USERPROFILE\.codex\skills\.system\skill-creator\scripts\quick_validate.py" `
  .
```

验收场景位于 [`evals/scenarios.md`](evals/scenarios.md)，覆盖有原型、无原型、跨平台、可读性和失败修订边界。

## 已知限制

- image_gen 可能生成错误文字，因此正式文案默认由运行时叠加。
- 多次生成之间的几何和身份一致性需要使用风格锚点并进行实际检查。
- 生成图片无法替代响应式布局、字体系统、本地化、无障碍和交互逻辑。
- 九切、平铺、严格色值、像素级几何和透明通道只有在实际核验后才能确认。
- 生成失败时最多进行一次定向修订，不能无限重试。

## 相关项目

- 远端仓库：<https://github.com/wu-jiuqi/palette-knife-impasto-ui>
- 通用画风 Skill：`palette-knife-impasto`
