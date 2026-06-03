import {browser} from "$app/environment";

export type Locale = "en" | "zh-CN";

const LOCALE_STORAGE_KEY = "ghostty-config-locale";

function getInitialLocale(): Locale {
    if (!browser) return "zh-CN";
    const saved = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (saved === "en" || saved === "zh-CN") return saved;
    return navigator.language.toLowerCase().startsWith("zh") ? "zh-CN" : "en";
}

export const locale = $state<{current: Locale}>({current: getInitialLocale()});

if (browser) document.documentElement.lang = locale.current;

export function setLocale(nextLocale: Locale) {
    locale.current = nextLocale;
    if (!browser) return;
    window.localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale);
    document.documentElement.lang = nextLocale;
}

export function appName() {
    return t("Ghostty Config");
}

const common: Record<string, string> = {
    "Ghostty Config": "Ghostty 配置生成器",
    "Application": "应用",
    "Clipboard": "剪贴板",
    "Window": "窗口",
    "Colors": "颜色",
    "Fonts": "字体",
    "Keybinds": "快捷键",
    "Mouse": "鼠标",
    "Import & Export": "导入与导出",
    "Font Playground": "字体预览",
    "Recent Changes": "最近更新",
    "Roadmap": "路线图",
    "Startup": "启动",
    "Shutdown": "关闭",
    "Shell Integration": "Shell 集成",
    "Quick Terminal": "快速终端",
    "Advanced": "高级",
    "Bell": "响铃",
    "Appearance": "外观",
    "Sizing & Resizing": "尺寸与缩放",
    "Base Colors": "基础颜色",
    "Cursor": "光标",
    "Color Palette": "调色板",
    "General Font Settings": "字体通用设置",
    "Font Families": "字体族",
    "Font Styles": "字体样式",
    "Font Variations": "可变字体参数",
    "Advanced Font & Cell Settings": "高级字体与单元格设置",
    "Titlebar & Tabs": "标题栏与标签页",
    "App Icon": "应用图标",
    "Import": "导入",
    "Export": "导出",
    "File...": "文件...",
    "Share...": "分享...",
    "Paste": "粘贴",
    "Upload": "上传",
    "Copy": "复制",
    "Download": "下载",
    "No changes yet!": "还没有改动！",
    "Share your config": "分享你的配置",
    "Cancel": "取消",
    "Close": "关闭",
    "Dismiss": "关闭",
    "Trigger": "触发条件",
    "Action": "动作",
    "Result": "结果",
    "Reset to default": "恢复默认值",
    "Full description": "完整说明",
    "by": "作者",
    "Ghostty Config Logo": "Ghostty 配置生成器 Logo",
    "Application Settings": "应用设置",
    "Clipboard Settings": "剪贴板设置",
    "Window Settings": "窗口设置",
    "Color Settings": "颜色设置",
    "Font Settings": "字体设置",
    "Keybind Settings": "快捷键设置",
    "Mouse Settings": "鼠标设置",
    "GTK Settings": "GTK 设置",
    "Linux Settings": "Linux 设置",
    "MacOS Settings": "macOS 设置",
    "Settings Sync": "配置同步",
    "Ghostty Config GitHub": "Ghostty 配置生成器 GitHub",
    "Ghostty Website": "Ghostty 官网",
    "Language": "语言",
    "default": "默认",
};

const settings: Record<string, string> = {
    title: "所有窗口的固定标题",
    desktopNotifications: "允许桌面通知",
    configFile: "额外配置文件",
    configDefaultFiles: "加载默认配置文件",
    link: "链接处理",
    linkUrl: "自动识别 URL 链接",
    linkPreviews: "显示链接预览",
    undoTimeout: "撤销超时",
    command: "启动时运行的命令",
    initialCommand: "首次启动时运行的命令",
    env: "环境变量",
    input: "初始输入",
    maximize: "启动时最大化窗口",
    fullscreen: "启动时进入全屏模式",
    initialWindow: "启动时显示窗口",
    workingDirectory: "启动后的工作目录",
    waitAfterCommand: "命令结束后等待输入",
    abnormalCommandExitRuntime: "异常命令退出运行时长",
    confirmCloseSurface: "关闭界面时确认",
    quitAfterLastWindowClosed: "关闭最后一个窗口后退出",
    quitAfterLastWindowClosedDelay: "自动退出前延迟",
    shellIntegration: "Shell 集成方式",
    shellIntegrationFeatures: "Shell 集成功能",
    term: "TERM 环境变量",
    titleReport: "CSI 21 标题报告",
    quickTerminalPosition: "终端位置",
    quickTerminalScreen: "屏幕位置",
    quickTerminalSize: "快速终端大小",
    quickTerminalAnimationDuration: "动画时长",
    quickTerminalAutohide: "自动隐藏",
    quickTerminalSpaceBehavior: "macOS 空间行为",
    quickTerminalKeyboardInteractivity: "键盘交互",
    scrollbackLimit: "回滚缓冲区大小（字节）",
    customShader: "自定义着色器",
    customShaderAnimation: "允许着色器动画",
    scrollToBottom: "滚动到底部时机",
    enquiryResponse: "ENQ 响应",
    oscColorReportFormat: "OSC 颜色报告格式",
    vtKamAllowed: "允许 VT KAM 模式",
    imageStorageLimit: "图片缓冲区限制（字节）",
    bellFeatures: "响铃功能",
    bellAudioPath: "响铃音频文件",
    bellAudioVolume: "响铃音量",
    clipboardRead: "允许终端读取剪贴板",
    clipboardWrite: "允许终端写入剪贴板",
    copyOnSelect: "选中即复制",
    clipboardTrimTrailingSpaces: "复制时去除行尾空格",
    clipboardPasteProtection: "不安全粘贴时确认",
    clipboardPasteBracketedSafe: "将括号粘贴标记为安全",
    windowTitleFontFamily: "窗口标题字体",
    windowSubtitle: "窗口副标题",
    windowVsync: "启用垂直同步",
    windowInheritWorkingDirectory: "继承工作目录",
    tabInheritWorkingDirectory: "标签页继承工作目录",
    splitInheritWorkingDirectory: "分屏继承工作目录",
    windowInheritFontSize: "继承字体大小",
    windowColorspace: "窗口色彩空间",
    windowSaveState: "保存窗口状态",
    windowShowTabBar: "显示标签栏",
    windowNewTabPosition: "新标签页位置",
    windowTheme: "窗口主题",
    windowDecoration: "窗口装饰",
    windowPaddingX: "窗口水平内边距",
    windowPaddingY: "窗口垂直内边距",
    windowPaddingBalance: "自动平衡窗口内边距",
    windowPaddingColor: "窗口内边距颜色",
    windowTitlebarBackground: "标题栏背景色",
    windowTitlebarForeground: "标题栏前景色",
    backgroundOpacity: "背景不透明度",
    backgroundOpacityCells: "强制单元格背景不透明度",
    backgroundBlur: "背景模糊",
    backgroundImage: "背景图片",
    backgroundImageOpacity: "背景图片不透明度",
    backgroundImagePosition: "背景图片位置",
    backgroundImageFit: "背景图片适配",
    backgroundImageRepeat: "重复背景图片",
    scrollbar: "滚动条可见性",
    unfocusedSplitOpacity: "未聚焦分屏不透明度",
    unfocusedSplitFill: "未聚焦分屏填充颜色",
    splitDividerColor: "分屏分隔线颜色",
    splitPreserveZoom: "分屏导航时保持缩放",
    windowHeight: "初始窗口高度",
    windowWidth: "初始窗口宽度",
    windowPositionY: "初始窗口 Y 坐标",
    windowPositionX: "初始窗口 X 坐标",
    windowStepResize: "按网格单元增量调整大小",
    resizeOverlay: "显示尺寸提示浮层",
    resizeOverlayPosition: "尺寸提示浮层位置",
    resizeOverlayDuration: "尺寸提示浮层显示时间",
    boldColor: "粗体文本颜色",
    faintOpacity: "弱化文本不透明度",
    minimumContrast: "最小对比度",
    paletteGenerate: "自动生成缺失的调色板颜色",
    paletteHarmonious: "和谐调色板生成",
    background: "背景色",
    foreground: "前景色",
    selectionBackground: "选区背景色",
    selectionForeground: "选区前景色",
    selectionClearOnTyping: "输入时清除选区",
    selectionClearOnCopy: "复制时清除选区",
    selectionWordChars: "单词选择字符",
    cursorColor: "光标颜色",
    cursorText: "光标下文字颜色",
    cursorOpacity: "光标不透明度",
    cursorStyle: "光标样式",
    cursorStyleBlink: "光标闪烁样式",
    fontSize: "基础字体大小",
    fontThicken: "加粗字体渲染",
    fontThickenStrength: "加粗强度",
    fontShapingBreak: "字形塑形分段方式（光标/无光标）",
    fontFeature: "字体连字设置",
    fontSyntheticStyle: "合成样式",
    alphaBlending: "Alpha 混合色彩空间",
    fontFamily: "主字体族",
    fontFamilyBold: "粗体文本字体族",
    fontFamilyItalic: "斜体文本字体族",
    fontFamilyBoldItalic: "粗斜体文本字体族",
    fontCodepointMap: "按 Unicode 映射字体",
    fontStyle: "主字体样式",
    fontStyleBold: "粗体文本字体样式",
    fontStyleItalic: "斜体文本字体样式",
    fontStyleBoldItalic: "粗斜体文本字体样式",
    fontVariation: "主字体变体",
    fontVariationBold: "粗体字体变体",
    fontVariationItalic: "斜体字体变体",
    fontVariationBoldItalic: "粗斜体字体变体",
    adjustCellWidth: "单元格宽度调整",
    adjustCellHeight: "单元格高度调整",
    adjustFontBaseline: "字体基线调整",
    adjustUnderlinePosition: "下划线位置调整",
    adjustUnderlineThickness: "下划线粗细调整",
    adjustStrikethroughPosition: "删除线位置调整",
    adjustStrikethroughThickness: "删除线粗细调整",
    adjustOverlinePosition: "上划线位置调整",
    adjustOverlineThickness: "上划线粗细调整",
    adjustCursorThickness: "光标粗细调整",
    adjustBoxThickness: "方框粗细调整",
    adjustCursorHeight: "光标高度调整",
    adjustIconHeight: "Nerd Font 图标高度调整",
    graphemeWidthMethod: "字素宽度计算方法",
    freetypeLoadFlags: "FreeType 加载标志",
    keybind: "快捷键",
    cursorClickToMove: "启用点击移动光标",
    mouseHideWhileTyping: "输入时隐藏鼠标",
    mouseReporting: "允许鼠标报告",
    mouseShiftCapture: "允许 Shift 配合鼠标点击",
    mouseScrollMultiplier: "鼠标滚动倍率",
    rightClickAction: "右键动作",
    focusFollowsMouse: "鼠标移动时聚焦分屏",
    clickRepeatInterval: "多次点击间隔（毫秒）",
    class: "WM_CLASS class 字段",
    x11InstanceName: "WM_CLASS instance 名称",
    gtkSingleInstance: "单实例模式",
    gtkCustomCss: "自定义 CSS 文件",
    gtkOpenglDebug: "OpenGL 调试",
    appNotifications: "应用通知",
    gtkToolbarStyle: "工具栏样式",
    gtkTitlebarStyle: "标题栏样式",
    gtkTabsLocation: "标签页位置",
    gtkWideTabs: "使用宽标签页",
    gtkTitlebar: "显示标题栏",
    gtkTitlebarHideWhenMaximized: "最大化时隐藏标题栏",
    gtkQuickTerminalLayer: "快速终端层级",
    gtkQuickTerminalNamespace: "快速终端命名空间",
    asyncBackend: "异步后端",
    linuxCgroup: "使用专用 cgroups",
    linuxCgroupMemoryLimit: "内存限制（字节）",
    linuxCgroupProcessesLimit: "最大进程数",
    linuxCgroupHardFail: "启动时硬失败",
    macosNonNativeFullscreen: "使用非原生全屏",
    macosTitlebarStyle: "标题栏样式",
    macosTitlebarProxyIcon: "标题栏代理图标",
    macosOptionAsAlt: "将 Option 键作为 Alt 键",
    macosWindowShadow: "显示窗口阴影",
    macosWindowButtons: "窗口按钮（红黄绿交通灯）",
    macosHidden: "从 Dock 和切换器中隐藏",
    macosAutoSecureInput: "自动安全输入",
    macosSecureInputIndication: "指示安全输入状态",
    macosDockDropBehavior: "Dock 拖放行为",
    macosShortcuts: "macOS 快捷键",
    autoUpdate: "自动更新",
    autoUpdateChannel: "更新频道",
    macosIcon: "图标",
    macosCustomIcon: "图标文件",
    macosIconFrame: "图标边框",
    macosIconGhostColor: "幽灵颜色",
    macosIconScreenColor: "屏幕颜色",
};

const notes: Record<string, string> = {
    link: "用于生成可点击链接的正则表达式，当前已禁用。",
    linkUrl: "按住 Control（Linux）或 Command（macOS）键时进行匹配。",
    undoTimeout: "撤销操作的超时时间，格式如 <code>1h30m</code>、<code>5s</code>、<code>500ms</code>。",
    initialCommand: "不同于上一项，这条命令在应用生命周期内只运行一次。",
    workingDirectory: "这里也允许使用 <code>home</code> 和 <code>inherit</code> 等特殊值。",
    advanced: "只有在你清楚自己在做什么时才修改这些设置，否则可能导致 Ghostty 出现严重问题！",
    colorsBase: "此处预览会在命令输出第二行展示选中文本效果。",
    colorsCursor: "预览中的光标会每 1 秒闪烁一次以便观察，可能与你在 Ghostty 中看到的不完全一致。",
    colorsPalette: "前 16 个颜色是终端中最常显示的颜色。\n\n颜色 1-8 通常是黑、红、绿、黄、蓝、洋红、青、白。\n颜色 9-16 通常是这些颜色的“高亮”变体。",
    fontsFamilies: "默认情况下 Ghostty 内置并使用 JetBrainsMono Nerd Font，因此你不需要在系统中安装或在配置里指定它。",
    fontsAdvanced: "下面这些设置在 Ghostty 中几乎没有校验，可能导致终端不可用，请谨慎修改。",
};

export function t(text: string | undefined): string {
    locale.current;
    if (!text) return "";
    if (locale.current === "en") return text;
    return common[text] ?? text;
}

export function settingName(id: string, fallback: string): string {
    locale.current;
    if (locale.current === "en") return fallback;
    return settings[id] ?? t(fallback);
}

export function settingNote(id: string, fallback?: string): string {
    locale.current;
    if (locale.current === "en") return fallback ?? "";
    return notes[id] ?? fallback ?? "";
}

export function groupNote(categoryId: string, groupId: string, fallback?: string): string {
    locale.current;
    if (locale.current === "en") return fallback ?? "";
    return notes[`${categoryId}${groupId[0]?.toUpperCase() ?? ""}${groupId.slice(1)}`] ?? notes[groupId] ?? fallback ?? "";
}

export function msg(english: string, chinese: string): string {
    locale.current;
    return locale.current === "zh-CN" ? chinese : english;
}
