interface BaseSettingType {
    id: string;
    name: string;
    note?: string;
}

interface Panel extends BaseSettingType {
    groups: Group[];
}

interface Group extends BaseSettingType {
    settings: (Switch | Text | Number | Dropdown)[];
    // type: "group";
}

type SettingType = "switch" | "number" | "dropdown" | "text" | "group";

interface BaseSettingItem extends BaseSettingType {
    type: SettingType;
    value: unknown;
}

interface Switch extends BaseSettingItem {
    type: "switch";
    value: boolean;
}

interface Text extends BaseSettingItem {
    type: "text";
    value: string;
}

interface Number extends BaseSettingItem {
    type: "number";
    value: number;
    min?: number;
    max?: number;
    step?: number;
    size?: number;
    range?: boolean;
}

interface DropdownOption {
    name: string;
    value: string;
}

interface Dropdown extends BaseSettingItem {
    type: "dropdown";
    value: "string";
    options: (DropdownOption | string)[];
}

export default [
    {
        id: "application",
        name: "Application",
        note: "",
        groups: [
            {
                id: "general",
                name: "",
                // type: "group",
                settings: [
                    {id: "title", name: "Static title for all windows", type: "text", value: ""},
                    {id: "desktopNotifications", name: "Allow desktop notifications", type: "switch", value: true},
                    {id: "configFile", name: "Additional config file", type: "text", value: ""},
                    {id: "configDefaultFiles", name: "Load default config file", type: "switch", value: true},
                    {id: "linkUrl", name: "Automatically link URLs", note: "Matching occurs while holding the control (Linux) or command (macOS) key.", type: "switch", value: true},
                ]
            },
            {
                id: "startup",
                name: "Startup",
                // type: "group",
                settings: [
                    {id: "command", name: "Command to run on launch", type: "text", value: ""},
                    {id: "fullscreen", name: "Launch in fullscreen mode", type: "switch", value: false},
                    {id: "initialWindow", name: "Show a window on startup", type: "switch", value: true},
                    {id: "workingDirectory", name: "Directory to use after startup", note: "Special values of `home` and `inherit` are also allowed here.", type: "text", value: ""},
                ]
            },
            {
                id: "shutdown",
                name: "Shutdown",
                // type: "group",
                settings: [
                    {id: "waitAfterCommand", name: "Wait for input after command", type: "switch", value: false},
                    {id: "abnormalCommandExitRuntime", name: "Abnormal command exit runtime", type: "number", value: 250, min: 0, size: 5},
                    {id: "confirmCloseSurface", name: "Confirm when closing a surface", type: "switch", value: true},
                    {id: "quitAfterLastWindowClosed", name: "Quit after closing last window", type: "switch", value: false},
                    {id: "quitAfterLastWindowClosedDelay", name: "Delay before auto quitting", type: "text", value: ""},
                ]
            },
            {
                id: "shell",
                name: "Shell Integration",
                // type: "group",
                settings: [
                    {id: "shellIntegration", name: "Shell integration style", type: "dropdown", value: "detect", options: ["none", "detect", "bash", "elvish", "fish", "zsh"]},
                    {id: "shellIntegrationFeatures", name: "Shell integration features", note: "The current available features are cursor, sudo, and title. Including one force enables it, prefixing it with `no-` force disables it, omitting it falls back to default.", type: "text", value: "cursor,no-sudo,title"},
                    {id: "term", name: "TERM environment variable", type: "text", value: "xterm-ghostty"},
                ]
            },
            {
                id: "advanced",
                name: "Advanced",
                note: "You should only touch these settings if you know what you're doing, otherwise you could cause major issues with Ghostty!",
                // type: "group",
                settings: [
                    {id: "scrollbackLimit", name: "Scrollback buffer size (bytes)", note: "This buffer exists completely in memory but is allocated lazily.", type: "number", value: 10000000, min: 0, size: 10},
                    {id: "customShader", name: "Custom shader", note: "This matches the API of Shadertoy.", type: "text", value: ""},
                    {id: "customShaderAnimation", name: "Allow shaders to animate", type: "dropdown", value: "false", options: ["false", "true", "always"]},
                    {id: "enquiryResponse", name: "Reponse to ENQ", type: "text", value: ""},
                    {id: "oscColorReportFormat", name: "OSC color report format", type: "dropdown", value: "16-bit", options: ["none", "8-bit", "16-bit"]},
                    {id: "vtKamAllowed", name: "VT kam mode allowed", note: "If you don't know what this is, don't touch it!", type: "switch", value: false},
                ]
            },
        ]
    },
    {
        id: "clipboard",
        name: "Clipboard",
        groups: [
            {
                id: "main",
                name: "",
                settings: [
                    {id: "clipboardRead", name: "Allow terminal to read clipboard", type: "dropdown", value: "ask", options: ["ask", "allow", "deny"]},
                    {id: "clipboardWrite", name: "Allow terminal to write clipboard", type: "dropdown", value: "ask", options: ["ask", "allow", "deny"]},
                    {id: "copyOnSelect", name: "Copy on select", type: "switch", value: true},
                    {id: "clipboardTrimTrailingSpaces", name: "Trim trailing space on copy", type: "switch", value: true},
                    {id: "clipboardPasteProtection", name: "Confirm when pasting unsafely", type: "switch", value: true},
                    {id: "clipboardPasteBracketedSafe", name: "Mark bracketed paste as safe", type: "switch", value: true},
                    {id: "imageStorageLimit", name: "Image buffer limit (bytes)", type: "number", value: 320000000, min: 0, max: 4294967295, size: 12},
                ]
            }
        ]
    },
    {
        id: "window",
        name: "Window",
        groups: [
            {
                id: "main",
                name: "",
                settings: [
                    {id: "windowVsync", name: "Enable vsync", type: "switch", value: true},
                    {id: "windowInheritWorkingDirectory", name: "Inherit working directory", type: "switch", value: true},
                    {id: "windowInheritFontSize", name: "Inherit font size", type: "switch", value: true},
                    {id: "windowColorspace", name: "Window colorspace", type: "dropdown", value: "srgb", options: ["srgb", "display-p3"]},
                    {id: "windowSaveState", name: "Save window state", type: "dropdown", value: "default", options: ["default", "never", "always"]},
                    // maybe move to application?
                    {id: "windowNewTabPosition", name: "New tab position", type: "dropdown", value: "current", options: ["current", "end"]},
                ]
            },
            {
                id: "appearance",
                name: "Appearance",
                settings: [
                    {id: "windowTheme", name: "Window theme", type: "dropdown", value: "auto", options: ["auto", "system", "light", "dark"]},
                    {id: "windowDecoration", name: "Enable native frames", type: "switch", value: true},
                    {id: "windowPaddingX", name: "Horizontal window padding", type: "text", value: "2"},
                    {id: "windowPaddingY", name: "Vertical window padding", type: "text", value: "2"},
                    {id: "windowPaddingBalance", name: "Auto-balance window padding", type: "switch", value: false},
                    {id: "windowPaddingColor", name: "Window padding color", type: "dropdown", value: "extend", options: ["background", "extend", "extend-always"]},
                    
                    // maybe move to colors
                    {id: "backgroundOpacity", name: "Background opacity", type: "number", range: true, value: 1, min: 0, max: 1, step: 0.01},
                    {id: "backgroundBlurRadius", name: "Background blur radius", note: "A value of 20 is reasonable for a good looking blur, going beyond that can cause rendering and performance issues.", type: "number", range: true, value: 0, min: 0, max: 50, step: 1},
                    {id: "unfocusedSplitOpacity", name: "Unfocused split opacity", type: "number", range: true, value: 0.7, min: 0.15, max: 1, step: 0.01},
                    {id: "unfocusedSplitFill", name: "Unfocused split fill color", type: "color", value: ""},
                ]
            },
            {
                id: "resize",
                name: "Sizing & Resizing",
                settings: [
                    {id: "windowHeight", name: "Initial window height", note: "This size is not in pixels but in number of terminal grid cells", type: "number", value: 0, min: 4, step: 1, size: 12},
                    {id: "windowWidth", name: "Initial window width", note: "This size is not in pixels but in number of terminal grid cells", type: "number", value: 0, min: 10, step: 1, size: 12},
                    {id: "windowStepResize", name: "Resize in grid cell increments", type: "switch", value: false},
                    {id: "resizeOverlay", name: "Show resize overlays", type: "dropdown", value: "after-first", options: ["always", "never", "after-first"]},
                    {id: "resizeOverlayPosition", name: "Resize overlay position", type: "dropdown", value: "center", options: ["center", "top-left", "top-center", "top-right", "bottom-left", "bottom-center", "bottom-right"]},
                    {id: "resizeOverlayDuration", name: "Show resize overlay time", type: "text", value: "750ms"},
                ]
            },
        ]
    },






    {
        id: "mouse",
        name: "Mouse",
        groups: [
            {
                id: "main",
                name: "",
                settings: [
                    {id: "cursorClickToMove", name: "Enable click to move cursor", type: "switch", value: true},
                    {id: "mouseHideWhileTyping", name: "Hide mouse while typing", type: "switch", value: false},
                    {id: "mouseShiftCapture", name: "Allow shift with mouse click", type: "dropdown", value: "false", options: ["true", "false", "always", "never"]},
                    // Technically the values should be min: 0.01, max: 10000, step: 0.01 but those are insane so instead I'll use sane defaults
                    {id: "mouseScrollMultiplier", name: "Mouse scroll multiplier", type: "number", range: true, value: 1, min: 0.1, max: 10, step: 0.1},
                    {id: "focusFollowsMouse", name: "Focus splits on mouse move", type: "switch", value: false},
                    {id: "clickRepeatInterval", name: "Milliseconds between multi-click", note: "A value of 0 means to use the operating system's default timing.", type: "number", value: 0, min: 0, size: 4},
                ]
            }
        ]
    },
    {
        id: "gtk",
        name: "GTK",
        groups: [
            {
                id: "main",
                name: "",
                settings: [
                    {id: "class", name: "WM_CLASS class field", note: "This defaults to `com.mitchellh.ghostty`", type: "text", value: ""},
                    {id: "x11InstanceName", name: "WM_CLASS instance name", note: "This defaults to `ghostty`", type: "text", value: ""},
                    {id: "gtkSingleInstance", name: "Single-instance mode", type: "dropdown", value: "desktop", options: [{name: "detect", value: "desktop"}, "true", "false"]},
                    {id: "gtkTitlebar", name: "Show titlebar", type: "switch", value: true},
                    {id: "gtkTabsLocation", name: "Tab location", type: "dropdown", value: "top", options: ["top", "right", "bottom", "left"]},
                    {id: "gtkWideTabs", name: "Use wide tabs", type: "switch", value: true},
                    {id: "gtkAdwaita", name: "Enable adwaita theme support", type: "switch", value: true},
                ]
            }
        ]
    },
    {
        id: "linux",
        name: "Linux",
        groups: [
            {
                id: "main",
                name: "",
                settings: [
                    {id: "linuxCgroup", name: "Use dedicated cgroups", type: "dropdown", value: "single-instance", options: ["single-instance", "always", "never"]},
                    {id: "linuxCgroupMemoryLimit", name: "Memory limit (bytes)", type: "number", min: 0, max: 4294967295, size: 12},
                    {id: "linuxCgroupProcessLimit", name: "Max number of processes", type: "number", min: 0, size: 5},
                    {id: "linuxCgroupHardFail", name: "Hard fail on startup", type: "switch", value: false},
                ]
            }
        ]
    },
    {
        id: "macos",
        name: "macOS",
        groups: [
            {
                id: "main",
                name: "",
                settings: [
                    {id: "macosNonNativeFullscreen", name: "Use non-native fullscreen", note: "Tabs currently do not work with non-native fullscreen windows", type: "dropdown", value: "false", options: ["visible-menu", "true", "false"]},
                    {id: "macosTitlebarStyle", name: "Titlebar style", type: "dropdown", value: "transparent", options: ["transparent", "native", "tabs"]},
                    {id: "macosOptionAsAlt", name: "Use option key as alt key", type: "switch", value: false},
                    {id: "macosWindowShadow", name: "Show the window shadow", type: "switch", value: true},
                ]
            }
        ]
    },
] as Panel[];