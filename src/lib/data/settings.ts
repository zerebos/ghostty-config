import type {HexColor} from "$lib/utils/colors";

interface BaseSettingType {
    id: string;
    name: string;
    note?: string;
}

interface Panel extends BaseSettingType {
    groups: Group[];
}

interface Group extends BaseSettingType {
    settings: (Switch | Text | Number | Dropdown | Color | Palette | Keybinds | Theme)[];
    // type: "group";
}

type SettingType = "switch" | "number" | "dropdown" | "text" | "color" | "palette" | "keybinds" | "theme";

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

interface Theme extends BaseSettingItem {
    type: "theme";
    value: "string";
    options: (DropdownOption | string)[];
}

interface Color extends BaseSettingItem {
    value: HexColor;
    type: "color";
}

interface Palette extends BaseSettingItem {
    value: HexColor[];
    type: "palette";
}

export type KeybindString = `${string}=${string}`;
interface Keybinds extends BaseSettingItem {
    value: KeybindString[];
    type: "keybinds";
}

interface ThemeResponse {
    type: string;
    encoding: string;
    size: number;
    name: string;
    path: string;
    content: string;
    sha: string;
    url: string;
    git_url: string;
    html_url: string;
    download_url: string;
    _links: {
        git: string;
        self: string;
        html: string;
    };
}

// TODO: unify config typing across repo
export interface ColorScheme {
    palette: HexColor[];
    background?: HexColor;
    foreground?: HexColor;
    cursorColor?: HexColor;
    selectionBackground?: HexColor;
    selectionForeground?: HexColor;
}

const fetchThemeFiles = async () => {
    const response = await fetch("https://api.github.com/repos/mbadolato/iTerm2-Color-Schemes/contents/ghostty");
    if (!response.ok) throw new Error(`Error fetching data: ${response.statusText}`);
    return await response.json();
};

export const fetchColorScheme = async (theme: string) => {
    const response = await fetch(`https://raw.githubusercontent.com/mbadolato/iTerm2-Color-Schemes/master/ghostty/${theme}`);
    if (!response.ok) throw new Error(`Error fetching data: ${response.statusText}`);
    return await response.text();
};

fetchThemeFiles().then((themeFiles: ThemeResponse[] | null) => {
    if (!themeFiles) return;
    const themeNames = themeFiles.map((file: ThemeResponse) => file.name);
    const themeSetting = settings.find(p => p.id === "colors")?.groups.find(g => g.id === "general")?.settings.find(s => s.type === "theme");
    themeSetting?.options.push(...themeNames);
});

const settings = [
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
                    {id: "initialCommand", name: "Command to run on first launch", note: "Unlike the previous setting, this will only run once in the lifetime of the app.", type: "text", value: ""},
                    {id: "env", name: "Environment variables", type: "text", value: ""},
                    {id: "maximize", name: "Launch as maximized window", type: "switch", value: false},
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
                    {id: "titleReport", name: "CSI 21 title reporting", note: "This allows running apps to read the terminal title.", type: "switch", value: true},
                ]
            },
            {
                id: "quick",
                name: "Quick Terminal",
                settings: [
                    {id: "quickTerminalPosition", name: "Terminal position", type: "dropdown", value: "top", options: ["top", "right", "bottom", "left", "center"]},
                    {id: "quickTerminalScreen", name: "Screen location", type: "dropdown", value: "main", options: ["main", "mouse", "macos-menu-bar"]},
                    {id: "quickTerminalAnimationDuration", name: "Animation duration", type: "number", value: 0.2, min: 0, max: 10, step: 0.1, range: true},
                    {id: "quickTerminalAutohide", name: "Autohide", note: "This autohides the quick terminal when focus shifts away.", type: "switch", value: true},
                    {id: "quickTerminalSpaceBehavior", name: "macOS space behavior", type: "dropdown", value: "move", options: ["move", "remain"]},
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
                    {id: "imageStorageLimit", name: "Image buffer limit (bytes)", type: "number", value: 320000000, min: 0, max: 4294967295, size: 12},
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
                    {id: "copyOnSelect", name: "Copy on select", type: "dropdown", value: true, options: ["true", "false", "clipboard"]},
                    {id: "clipboardTrimTrailingSpaces", name: "Trim trailing space on copy", type: "switch", value: true},
                    {id: "clipboardPasteProtection", name: "Confirm when pasting unsafely", type: "switch", value: true},
                    {id: "clipboardPasteBracketedSafe", name: "Mark bracketed paste as safe", type: "switch", value: true},
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
                    {id: "windowTitleFontFamily", name: "Window title font", type: "text", value: ""},
                    {id: "windowSubtitle", name: "Window subtitle", type: "dropdown", value: "false", options: ["false", "working-directory"]},
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
                    {id: "windowDecoration", name: "Window decorations", type: "dropdown", value: "auto", options: ["auto", "none", "client", "server"]},
                    {id: "windowPaddingX", name: "Horizontal window padding", type: "text", value: "2"},
                    {id: "windowPaddingY", name: "Vertical window padding", type: "text", value: "2"},
                    {id: "windowPaddingBalance", name: "Auto-balance window padding", type: "switch", value: false},
                    {id: "windowPaddingColor", name: "Window padding color", type: "dropdown", value: "background", options: ["background", "extend", "extend-always"]},

                    // maybe move to colors
                    {id: "windowTitlebarBackground", name: "Titlebar background", type: "color", value: ""},
                    {id: "windowTitlebarForeground", name: "Titlebar foreground", type: "color", value: ""},
                    {id: "backgroundOpacity", name: "Background opacity", type: "number", range: true, value: 1, min: 0, max: 1, step: 0.01},
                    {id: "backgroundBlur", name: "Background blur radius", note: "A value of 20 is reasonable for a good looking blur, going beyond that can cause rendering and performance issues.", type: "number", range: true, value: 0, min: 0, max: 50, step: 1},
                    {id: "unfocusedSplitOpacity", name: "Unfocused split opacity", type: "number", range: true, value: 0.7, min: 0.15, max: 1, step: 0.01},
                    {id: "unfocusedSplitFill", name: "Unfocused split fill color", type: "color", value: ""},
                    {id: "splitDividerColor", name: "Split divider color", type: "color", value: ""},
                ]
            },
            {
                id: "resize",
                name: "Sizing & Resizing",
                settings: [
                    {id: "windowHeight", name: "Initial window height", note: "This size is not in pixels but in number of terminal grid cells", type: "number", value: 0, min: 4, step: 1, size: 4},
                    {id: "windowWidth", name: "Initial window width", note: "This size is not in pixels but in number of terminal grid cells", type: "number", value: 0, min: 10, step: 1, size: 4},
                    {id: "windowY", name: "Initial window Y", note: "Relative to the top left pixel of the screen", type: "number", value: 0, min: 0, step: 1, size: 4},
                    {id: "windowX", name: "Initial window X", note: "Relative to the top left pixel of the screen", type: "number", value: 0, min: 0, step: 1, size: 4},
                    {id: "windowStepResize", name: "Resize in grid cell increments", type: "switch", value: false},
                    {id: "resizeOverlay", name: "Show resize overlays", type: "dropdown", value: "after-first", options: ["always", "never", "after-first"]},
                    {id: "resizeOverlayPosition", name: "Resize overlay position", type: "dropdown", value: "center", options: ["center", "top-left", "top-center", "top-right", "bottom-left", "bottom-center", "bottom-right"]},
                    {id: "resizeOverlayDuration", name: "Show resize overlay time", type: "text", value: "750ms"},
                ]
            },
        ]
    },
    {
        id: "colors",
        name: "Colors",
        groups: [
            {
                id: "general",
                name: "",
                settings: [
                    {
                        id: "theme",
                        name: "Color theme",
                        note: "Any colors selected after setting this will overwrite the theme's colors.",
                        type: "theme",
                        value: "",
                        options: [{name: "Custom", value: ""}]
                    },
                    {id: "boldIsBright", name: "Bold text uses bright colors", type: "switch", value: false},
                    {id: "minimumContrast", name: "Minimum contrast", type: "number", value: 1, range: true, min: 1, max: 21, step: 0.1},
                ]
            },
            {
                id: "base",
                name: "Base Colors",
                note: "The preview here shows selected text in the second line of the command output.",
                settings: [
                    {id: "background", name: "Background color", type: "color", value: "#282c34"},
                    {id: "foreground", name: "Foreground color", type: "color", value: "#ffffff"},
                    {id: "selectionBackground", name: "Selection background color", type: "color", value: ""},
                    {id: "selectionForeground", name: "Selection foreground color", type: "color", value: ""},
                    {id: "selectionInvertFgBg", name: "Invert selection colors", note: "Enabling this will cause selections to be the inverse of their current colors. This ignores the two selection colors above.", type: "switch", value: false},
                ]
            },
            {
                id: "cursor",
                name: "Cursor",
                note: "The cursor in this preview blinks on and off at 1 second intervals for emphasis, it may not match what you see in Ghostty!",
                settings: [
                    {id: "cursorColor", name: "Cursor color", type: "color", value: ""},
                    {id: "cursorText", name: "Text color under cursor", type: "color", value: ""},
                    {id: "cursorInvertFgBg", name: "Invert cursor cell colors", note: "Enabling this will cause cells under the cursor to be the inverse of their current colors. This ignores the two cursor colors above.", type: "switch", value: false},
                    {id: "cursorOpacity", name: "Cursor opacity", type: "number", value: 1, range: true, min: 0, max: 1, step: 0.05},
                    {id: "cursorStyle", name: "Cursor style", type: "dropdown", value: "block", options: ["block", "bar", "underline", {value: "block_hollow", name: "hollow block"}]},
                    {id: "cursorStyleBlink", name: "Cursor blink style", note: "The `default` option defers to DEC mode 12 to determine blinking state.", type: "dropdown", value: "", options: ["true", "false", {value: "", name: "default"}]},
                ]
            },
            {
                id: "palette",
                name: "Color Palette",
                note: "The first 16 colors are the most commonly displayed colors in the terminal.\n\nColors 1-8 are typically black, red, green, yellow, blue, magenta, cyan, and white.\nColors 9-16 are typically \"brighter\" variants of these colors.",
                settings: [
                    {id: "palette", name: "", type: "palette", value: ["#1d1f21", "#cc6666", "#b5bd68", "#f0c674", "#81a2be", "#b294bb", "#8abeb7", "#c5c8c6", "#666666", "#d54e53", "#b9ca4a", "#e7c547", "#7aa6da", "#c397d8", "#70c0b1", "#eaeaea", "#000000", "#00005f", "#000087", "#0000af", "#0000d7", "#0000ff", "#005f00", "#005f5f", "#005f87", "#005faf", "#005fd7", "#005fff", "#008700", "#00875f", "#008787", "#0087af", "#0087d7", "#0087ff", "#00af00", "#00af5f", "#00af87", "#00afaf", "#00afd7", "#00afff", "#00d700", "#00d75f", "#00d787", "#00d7af", "#00d7d7", "#00d7ff", "#00ff00", "#00ff5f", "#00ff87", "#00ffaf", "#00ffd7", "#00ffff", "#5f0000", "#5f005f", "#5f0087", "#5f00af", "#5f00d7", "#5f00ff", "#5f5f00", "#5f5f5f", "#5f5f87", "#5f5faf", "#5f5fd7", "#5f5fff", "#5f8700", "#5f875f", "#5f8787", "#5f87af", "#5f87d7", "#5f87ff", "#5faf00", "#5faf5f", "#5faf87", "#5fafaf", "#5fafd7", "#5fafff", "#5fd700", "#5fd75f", "#5fd787", "#5fd7af", "#5fd7d7", "#5fd7ff", "#5fff00", "#5fff5f", "#5fff87", "#5fffaf", "#5fffd7", "#5fffff", "#870000", "#87005f", "#870087", "#8700af", "#8700d7", "#8700ff", "#875f00", "#875f5f", "#875f87", "#875faf", "#875fd7", "#875fff", "#878700", "#87875f", "#878787", "#8787af", "#8787d7", "#8787ff", "#87af00", "#87af5f", "#87af87", "#87afaf", "#87afd7", "#87afff", "#87d700", "#87d75f", "#87d787", "#87d7af", "#87d7d7", "#87d7ff", "#87ff00", "#87ff5f", "#87ff87", "#87ffaf", "#87ffd7", "#87ffff", "#af0000", "#af005f", "#af0087", "#af00af", "#af00d7", "#af00ff", "#af5f00", "#af5f5f", "#af5f87", "#af5faf", "#af5fd7", "#af5fff", "#af8700", "#af875f", "#af8787", "#af87af", "#af87d7", "#af87ff", "#afaf00", "#afaf5f", "#afaf87", "#afafaf", "#afafd7", "#afafff", "#afd700", "#afd75f", "#afd787", "#afd7af", "#afd7d7", "#afd7ff", "#afff00", "#afff5f", "#afff87", "#afffaf", "#afffd7", "#afffff", "#d70000", "#d7005f", "#d70087", "#d700af", "#d700d7", "#d700ff", "#d75f00", "#d75f5f", "#d75f87", "#d75faf", "#d75fd7", "#d75fff", "#d78700", "#d7875f", "#d78787", "#d787af", "#d787d7", "#d787ff", "#d7af00", "#d7af5f", "#d7af87", "#d7afaf", "#d7afd7", "#d7afff", "#d7d700", "#d7d75f", "#d7d787", "#d7d7af", "#d7d7d7", "#d7d7ff", "#d7ff00", "#d7ff5f", "#d7ff87", "#d7ffaf", "#d7ffd7", "#d7ffff", "#ff0000", "#ff005f", "#ff0087", "#ff00af", "#ff00d7", "#ff00ff", "#ff5f00", "#ff5f5f", "#ff5f87", "#ff5faf", "#ff5fd7", "#ff5fff", "#ff8700", "#ff875f", "#ff8787", "#ff87af", "#ff87d7", "#ff87ff", "#ffaf00", "#ffaf5f", "#ffaf87", "#ffafaf", "#ffafd7", "#ffafff", "#ffd700", "#ffd75f", "#ffd787", "#ffd7af", "#ffd7d7", "#ffd7ff", "#ffff00", "#ffff5f", "#ffff87", "#ffffaf", "#ffffd7", "#ffffff", "#080808", "#121212", "#1c1c1c", "#262626", "#303030", "#3a3a3a", "#444444", "#4e4e4e", "#585858", "#626262", "#6c6c6c", "#767676", "#808080", "#8a8a8a", "#949494", "#9e9e9e", "#a8a8a8", "#b2b2b2", "#bcbcbc", "#c6c6c6", "#d0d0d0", "#dadada", "#e4e4e4", "#eeeeee"]},
                ]
            }
        ]
    },
    {
        id: "fonts",
        name: "Fonts",
        groups: [
            {
                id: "general",
                name: "General Font Settings",
                settings: [
                    {id: "fontSize", name: "Base font size", type: "number", value: 13, min: 4, max: 60, step: 0.5, range: true},
                    {id: "fontThicken", name: "Thicken fonts", type: "switch", note: "This currently only affects macOS.", value: false},
                    {id: "fontThickenStrength", name: "Thicken strength", type: "number", value: 255, min: 0, max: 255, step: 1, range: true},
                    {id: "fontFeature", name: "Font ligature settings", type: "text", value: ""},
                    {id: "fontSyntheticStyle", name: "Synthetic styles", note: "See the docs for more info.", type: "text", value: "bold,italic,bold-italic"},
                    {id: "alphaBlending", name: "Alpha blending colorspace", type: "dropdown", value: "native", options: ["native", "linear", "linear-corrected"]},
                ]
            },
            {
                id: "family",
                name: "Font Families",
                settings: [
                    {id: "fontFamily", name: "Main font family", type: "text", value: ""},
                    {id: "fontFamilyBold", name: "Font family for bold text", type: "text", value: ""},
                    {id: "fontFamilyItalic", name: "Font family for italic text", type: "text", value: ""},
                    {id: "fontFamilyBoldItalic", name: "Font family for bold italic text", type: "text", value: ""},
                    {id: "fontCodepointMap", name: "Unicode-specifc font mapping", note: "", type: "text", value: ""},
                ]
            },
            {
                id: "styles",
                name: "Font Styles",
                note: "Named font styles for the fields above. For example for `Ioveska Heavy` you would use a style of `Heavy`. Alternately you can set the style to `false` to completely disable the style and revert to default style.",
                settings: [
                    {id: "fontStyle", name: "Main font style", type: "text", value: "default"},
                    {id: "fontStyleBold", name: "Font style for bold text", type: "text", value: "default"},
                    {id: "fontStyleItalic", name: "Font style for italic text", type: "text", value: "default"},
                    {id: "fontStyleBoldItalic", name: "Font style for bold italic text", type: "text", value: "default"},
                ]
            },
            {
                id: "variations",
                name: "Font Variations",
                note: "Variable font specific settings, please only touch this if you know what you're doing!",
                settings: [
                    {id: "fontVariation", name: "Main font variant", type: "text", value: ""},
                    {id: "fontVariationBold", name: "Font variant for bold text", type: "text", value: ""},
                    {id: "fontVariationItalic", name: "Font variant for italic text", type: "text", value: ""},
                    {id: "fontVariationBoldItalic", name: "Font variant for bold italic text", type: "text", value: ""},
                ]
            },
            {
                id: "advanced",
                name: "Advanced Font & Cell Settings",
                note: "The settings below have very little validation in Ghostty and can cause your terminal to become unusable. Be careful messing with any of these.",
                settings: [
                    {id: "adjustCellWidth", name: "Cell width adjustment", type: "text", value: ""},
                    {id: "adjustCellHeight", name: "Cell height adjustment", type: "text", value: ""},
                    {id: "adjustFontBaseline", name: "Font baseline adjustment", type: "text", value: ""},
                    {id: "adjustUnderlinePosition", name: "Underline position adjustment", type: "text", value: ""},
                    {id: "adjustUnderlineThickness", name: "Underline thickness adjustment", type: "text", value: ""},
                    {id: "adjustStrikethroughPosition", name: "Strikethrough position adjustment", type: "text", value: ""},
                    {id: "adjustStrikethroughThickness", name: "Strikethrough thickness adjustment", type: "text", value: ""},
                    {id: "adjustOverlinePosition", name: "Overline position adjustment", type: "text", value: ""},
                    {id: "adjustOverlineThickness", name: "Overline thickness adjustment", type: "text", value: ""},
                    {id: "adjustCursorThickness", name: "Cursor thickness adjustment", type: "text", value: ""},
                    {id: "adjustBoxThickness", name: "Box thickness adjustment", type: "text", value: ""},
                    {id: "adjustCursorHeight", name: "Cursor height adjustment", type: "text", value: ""},
                    {id: "graphemeWidthMethod", name: "Grapheme width calculation method", type: "dropdown", value: "unicode", options: ["unicode", "legacy"]},
                    {id: "freetypeLoadFlags", name: "FreeType load flags", type: "text", value: "hinting,force-autohint,monochrome,autohint"},
                ]
            },

        ]
    },
    {
        id: "keybinds",
        name: "Keybinds",
        groups: [
            {
                id: "keybinds",
                name: "",
                settings: [
                    {id: "keybind", name: "", type: "keybinds", value: ["super+page_up=scroll_page_up", "super+ctrl+equal=equalize_splits", "super+physical:four=goto_tab:4", "super+shift+down=jump_to_prompt:1", "super+shift+w=close_window", "super+shift+left_bracket=previous_tab", "super+backspace=text:\\x15", "super+alt+w=close_tab", "super+w=close_surface", "super+alt+i=inspector:toggle", "super+physical:eight=goto_tab:8", "super+alt+right=goto_split:right", "shift+up=adjust_selection:up", "super+down=jump_to_prompt:1", "super+enter=toggle_fullscreen", "super+t=new_tab", "super+c=copy_to_clipboard", "super+shift+right_bracket=next_tab", "super+physical:one=goto_tab:1", "shift+left=adjust_selection:left", "super+equal=increase_font_size:1", "shift+page_up=adjust_selection:page_up", "super+physical:three=goto_tab:3", "super+right=text:\\x05", "super+d=new_split:right", "super+ctrl+down=resize_split:down,10", "shift+end=adjust_selection:end", "super+plus=increase_font_size:1", "super+q=quit", "super+home=scroll_to_top", "super+ctrl+left=resize_split:left,10", "alt+left=esc:b", "super+ctrl+up=resize_split:up,10", "super+left=text:\\x01", "super+shift+up=jump_to_prompt:-1", "shift+right=adjust_selection:right", "super+comma=open_config", "super+shift+comma=reload_config", "super+minus=decrease_font_size:1", "shift+page_down=adjust_selection:page_down", "ctrl+tab=next_tab", "super+a=select_all", "alt+right=esc:f", "super+shift+enter=toggle_split_zoom", "super+alt+down=goto_split:down", "super+ctrl+f=toggle_fullscreen", "super+ctrl+right=resize_split:right,10", "super+alt+shift+j=write_screen_file:open", "shift+down=adjust_selection:down", "ctrl+shift+tab=previous_tab", "super+n=new_window", "super+alt+left=goto_split:left", "super+page_down=scroll_page_down", "super+alt+shift+w=close_all_windows", "super+alt+up=goto_split:up", "super+shift+v=paste_from_selection", "super+left_bracket=goto_split:previous", "super+physical:nine=last_tab", "super+right_bracket=goto_split:next", "super+end=scroll_to_bottom", "super+shift+j=write_screen_file:paste", "super+shift+d=new_split:down", "super+zero=reset_font_size", "super+physical:five=goto_tab:5", "shift+home=adjust_selection:home", "super+physical:seven=goto_tab:7", "super+up=jump_to_prompt:-1", "super+k=clear_screen", "super+physical:two=goto_tab:2", "super+physical:six=goto_tab:6", "super+v=paste_from_clipboard"]}
                ]
            }
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
                    {id: "mouseScrollMultiplier", name: "Mouse scroll multiplier", type: "number", range: true, value: 3, min: 0.1, max: 10, step: 0.1},
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
                    {id: "gtkCustomCss", name: "Custom css file", type: "text", value: ""},
                    {id: "gtkOpenglDebug", name: "OpenGL debug", type: "switch", value: false},
                    {id: "gtkGskRenderer", name: "GSK renderer", type: "text", value: "opengl"},
                    {id: "appNotifications", name: "App notifications", type: "dropdown", value: "clipboard-copy", options: ["clipboard-copy", "no-clipboard-copy"]}, // TODO: move and expand once ghostty has more support
                ]
            },
            {
                id: "tabs",
                name: "Titlebar & Tabs",
                settings: [
                    {id: "gtkToolbarStyle", name: "Toolbar style", type: "dropdown", value: "raised", options: ["raised", "flat", "raised-border"]},
                    {id: "gtkTabsLocation", name: "Tab location", type: "dropdown", value: "top", options: ["top", "right", "bottom", "left"]},
                    {id: "gtkWideTabs", name: "Use wide tabs", note: "Setting this to false will make tabs use the least space necessary.", type: "switch", value: true},
                    {id: "gtkTitlebar", name: "Show titlebar", type: "switch", value: true},
                    {id: "gtkTitlebarHideWhenMaximized", name: "Hide titlebar on maximize", type: "switch", value: false},
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
                    {id: "asyncBackend", name: "Async backend", note: "If unsure, leave this set to auto.", type: "dropdown", value: "auto", options: ["auto", "epoll", "io_uring"]},
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
                    {id: "macosNonNativeFullscreen", name: "Use non-native fullscreen", note: "Tabs currently do not work with non-native fullscreen windows", type: "dropdown", value: "false", options: ["visible-menu", "true", "false", "padded-notch"]},
                    {id: "macosTitlebarStyle", name: "Titlebar style", type: "dropdown", value: "transparent", options: ["transparent", "native", "tabs", "hidden"]},
                    {id: "macosTitlebarProxyIcon", name: "Titlebar proxy icon", type: "dropdown", value: "visible", options: ["visible", "hidden"]},
                    {id: "macosOptionAsAlt", name: "Use option key as alt key", type: "dropdown", value: "", options: ["", "true", "false", "left", "right"]},
                    {id: "macosWindowShadow", name: "Show the window shadow", type: "switch", value: true},
                    {id: "macosHidden", name: "Hide from dock and switcher", type: "dropdown", value: "never", options: ["never", "always"]},
                    {id: "macosAutoSecureInput", name: "Auto secure input", type: "switch", value: true},
                    {id: "macosSecureInputIndication", name: "Indicate secure input", type: "switch", value: true},

                    // TODO: move these once it is available on non-mac
                    {id: "autoUpdate", name: "Auto update", note: "Leaving this unset will fall back to your Sparkle preferences.", type: "dropdown", value: "", options: ["", "off", "check", "download"]},
                    {id: "autoUpdateChannel", name: "Update channel", note: "By default this will adhere to whichever version you downloaded.", type: "dropdown", value: "", options: ["", "stable", "tip"]},
                ]
            },
            {
                id: "icon",
                name: "App Icon",
                note: "An app icon previewer has been added to the to-do list.",
                settings: [
                    {id: "macosIcon", name: "Icon", note: "Custom style must specify both ghost and screen colors.", type: "dropdown", value: "official", options: ["official", "blueprint", "chalkboard", "microchip", "glass", "holographic", "paper", "retro", "xray", "custom-style"]},
                    {id: "macosIconFrame", name: "Icon frame", type: "dropdown", value: "aluminum", options: ["aluminum", "beige", "plastic", "chrome"]},
                    {id: "macosIconGhostColor", name: "Ghost color", type: "color", value: ""},
                    {id: "macosIconScreenColor", name: "Screen color", type: "color", value: ""},
                ]
            }
        ]
    },
] as Panel[];


export default settings;
