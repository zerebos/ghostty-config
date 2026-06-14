import application from "$lib/images/tabs/application.webp";
import terminal from "$lib/images/tabs/terminal.webp"; // placeholder
import clipboard from "$lib/images/tabs/clipboard.webp";
import window from "$lib/images/tabs/window.webp";

import colors from "$lib/images/tabs/colors.webp";
import fonts from "$lib/images/tabs/fonts.webp";

import keybinds from "$lib/images/tabs/keybinds.webp";
import mouse from "$lib/images/tabs/mouse.webp";

import gtk from "$lib/images/tabs/gtk.svg";
import linux from "$lib/images/tabs/linux.webp";
import macos from "$lib/images/tabs/macos.webp";

import {registry} from "./registry";
import {dev} from "$app/environment";

interface NavGroup {
    id: string;
    name: string;
    note?: string;
    settings: Array<keyof typeof registry>;
}

interface NavPanel {
    id: string;
    icon: string;
    name: string;
    note?: string;
    groups?: NavGroup[];
    pages?: NavPanel[];
}

export const navigation = [
    {
        id: "application",
        icon: application,
        name: "Application",
        groups: [
            {
                id: "main",
                name: "",
                settings: [
                    "title",
                    "desktopNotifications",
                    "configFile",
                    "configDefaultFiles",
                    "link",
                    "linkUrl",
                    "linkPreviews",
                    "undoTimeout"
                ]
            },
            {
                id: "bell",
                name: "Bell",
                settings: [
                    "bellFeatures",
                    "bellAudioPath",
                    "bellAudioVolume"
                ]
            },
            {
                id: "startup",
                name: "Startup",
                settings: [
                    "command",
                    "initialCommand",
                    "env",
                    "input",
                    "maximize",
                    "fullscreen",
                    "initialWindow",
                    "workingDirectory"
                ]
            },
            {
                id: "shutdown",
                name: "Shutdown",
                settings: [
                    "waitAfterCommand",
                    "abnormalCommandExitRuntime",
                    "confirmCloseSurface",
                    "quitAfterLastWindowClosed",
                    "quitAfterLastWindowClosedDelay"
                ]
            },
            {
                id: "quickTerminal",
                name: "Quick Terminal",
                settings: [
                    "quickTerminalPosition",
                    "quickTerminalScreen",
                    "quickTerminalSize",
                    "quickTerminalAnimationDuration",
                    "quickTerminalAutohide",
                    "quickTerminalSpaceBehavior",
                    "quickTerminalKeyboardInteractivity"
                ]
            }
        ]
    },
    {
        id: "terminal",
        icon: terminal, // TODO: replace
        name: "Terminal",
        groups: [
            {
                id: "shell",
                name: "",
                settings: [
                    "shellIntegration",
                    "shellIntegrationFeatures",
                    "term",
                    "titleReport"
                ]
            },
            {
                id: "notifications",
                name: "Command Notifications",
                settings: [
                    "notifyOnCommandFinish",
                    "notifyOnCommandFinishAction",
                    "notifyOnCommandFinishAfter"
                ]
            },
            {
                id: "display",
                name: "Display",
                settings: [
                    "scrollbackLimit",
                    "scrollToBottom",
                    "imageStorageLimit",
                    "progressStyle",
                    "customShader",
                    "customShaderAnimation"
                ]
            },
            {
                id: "compatibility",
                name: "Protocol & Compatibility",
                note: "These settings control low-level terminal protocol behavior. Only change these if you know what you're doing.",
                settings: [
                    "oscColorReportFormat",
                    "enquiryResponse",
                    "vtKamAllowed"
                ]
            }
        ]
    },
    {
        id: "clipboard",
        icon: clipboard,
        name: "Clipboard",
        groups: [
            {
                id: "main",
                name: "",
                settings: [
                    "clipboardRead",
                    "clipboardWrite",
                    "copyOnSelect",
                    "clipboardTrimTrailingSpaces",
                    "clipboardPasteProtection",
                    "clipboardPasteBracketedSafe"
                ]
            }
        ]
    },
    {
        id: "window",
        icon: window,
        name: "Window",
        groups: [
            {
                id: "main",
                name: "",
                settings: [
                    "windowTitleFontFamily",
                    "windowSubtitle",
                    "windowVsync",
                    "windowInheritWorkingDirectory",
                    "tabInheritWorkingDirectory",
                    "splitInheritWorkingDirectory",
                    "windowInheritFontSize",
                    "windowColorspace",
                    "windowSaveState",
                    "windowShowTabBar",
                    "windowNewTabPosition"
                ]
            },
            {
                id: "appearance",
                name: "Appearance",
                settings: [
                    "windowTheme",
                    "windowDecoration",
                    "windowPaddingX",
                    "windowPaddingY",
                    "windowPaddingBalance",
                    "windowPaddingColor",
                    "windowTitlebarBackground",
                    "windowTitlebarForeground",
                    "backgroundOpacity",
                    "backgroundOpacityCells",
                    "backgroundBlur",
                    "backgroundImage",
                    "backgroundImageOpacity",
                    "backgroundImagePosition",
                    "backgroundImageFit",
                    "backgroundImageRepeat",
                    "scrollbar",
                    "unfocusedSplitOpacity",
                    "unfocusedSplitFill",
                    "splitDividerColor",
                    "splitPreserveZoom"
                ]
            },
            {
                id: "resize",
                name: "Sizing & Resizing",
                settings: [
                    "windowHeight",
                    "windowWidth",
                    "windowPositionY",
                    "windowPositionX",
                    "windowStepResize",
                    "resizeOverlay",
                    "resizeOverlayPosition",
                    "resizeOverlayDuration"
                ]
            }
        ]
    },
    {
        id: "colors",
        icon: colors,
        name: "Colors",
        groups: [
            {
                id: "general",
                name: "",
                settings: [
                    "theme",
                    "boldColor",
                    "faintOpacity",
                    "minimumContrast",
                    "paletteGenerate",
                    "paletteHarmonious"
                ]
            },
            {
                id: "base",
                name: "Base Colors",
                note: "The preview here shows selected text in the second line of the command output.",
                settings: [
                    "background",
                    "foreground",
                    "selectionBackground",
                    "selectionForeground",
                    "selectionClearOnTyping",
                    "selectionClearOnCopy",
                    "selectionWordChars"
                ]
            },
            {
                id: "search",
                name: "Search Colors",
                settings: [
                    "searchForeground",
                    "searchBackground",
                    "searchSelectedForeground",
                    "searchSelectedBackground"
                ]
            },
            {
                id: "cursor",
                name: "Cursor",
                note: "The cursor in this preview blinks on and off at 1 second intervals for emphasis, it may not match what you see in Ghostty!",
                settings: [
                    "cursorColor",
                    "cursorText",
                    "cursorOpacity",
                    "cursorStyle",
                    "cursorStyleBlink"
                ]
            },
            {
                id: "palette",
                name: "Color Palette",
                note: "The first 16 colors are the most commonly displayed colors in the terminal.\n\nColors 1-8 are typically black, red, green, yellow, blue, magenta, cyan, and white.\nColors 9-16 are typically \"brighter\" variants of these colors.",
                settings: [
                    "palette"
                ]
            }
        ]
    },
    {
        id: "fonts",
        icon: fonts,
        name: "Fonts",
        groups: [
            {
                id: "general",
                name: "",
                settings: [
                    "fontSize",
                    "fontThicken",
                    "fontThickenStrength",
                    "fontShapingBreak",
                    "fontFeature",
                    "fontSyntheticStyle",
                    "alphaBlending"
                ]
            },
            {
                id: "family",
                name: "Font Families",
                note: "By default Ghostty embeds and uses JetBrainsMono Nerd Font so you don't need to install it on your system or set it in your configuration.",
                settings: [
                    "fontFamily",
                    "fontFamilyBold",
                    "fontFamilyItalic",
                    "fontFamilyBoldItalic",
                    "fontCodepointMap"
                ]
            },
            {
                id: "styles",
                name: "Font Styles",
                note: "Named font styles for the fields above. For example for <code>Ioveska Heavy</code> you would use a style of <code>Heavy</code>. Alternately you can set the style to <code>false</code> to completely disable the style and revert to default style.",
                settings: [
                    "fontStyle",
                    "fontStyleBold",
                    "fontStyleItalic",
                    "fontStyleBoldItalic"
                ]
            },
            {
                id: "variations",
                name: "Font Variations",
                note: "Variable font specific settings, please only touch this if you know what you're doing!",
                settings: [
                    "fontVariation",
                    "fontVariationBold",
                    "fontVariationItalic",
                    "fontVariationBoldItalic"
                ]
            },
            {
                id: "advanced",
                name: "Advanced Font & Cell Settings",
                note: "The settings below have very little validation in Ghostty and can cause your terminal to become unusable. Be careful messing with any of these.",
                settings: [
                    "adjustCellWidth",
                    "adjustCellHeight",
                    "adjustFontBaseline",
                    "adjustUnderlinePosition",
                    "adjustUnderlineThickness",
                    "adjustStrikethroughPosition",
                    "adjustStrikethroughThickness",
                    "adjustOverlinePosition",
                    "adjustOverlineThickness",
                    "adjustCursorThickness",
                    "adjustBoxThickness",
                    "adjustCursorHeight",
                    "adjustIconHeight",
                    "graphemeWidthMethod",
                    "freetypeLoadFlags"
                ]
            }
        ]
    },
    {
        id: "keybinds",
        icon: keybinds,
        name: "Keybinds",
        groups: [
            {
                id: "keybinds",
                name: "",
                settings: [
                    "keybind"
                ]
            }
        ]
    },
    {
        id: "mouse",
        icon: mouse,
        name: "Mouse",
        groups: [
            {
                id: "main",
                name: "",
                settings: [
                    "cursorClickToMove",
                    "mouseHideWhileTyping",
                    "mouseReporting",
                    "mouseShiftCapture",
                    "mouseScrollMultiplier",
                    "rightClickAction",
                    "middleClickAction",
                    "focusFollowsMouse",
                    "clickRepeatInterval"
                ]
            }
        ]
    },
    {
        id: "gtk",
        icon: gtk,
        name: "GTK",
        groups: [
            {
                id: "main",
                name: "",
                settings: [
                    "language",
                    "class",
                    "x11InstanceName",
                    "gtkSingleInstance",
                    "gtkCustomCss",
                    "gtkOpenglDebug",
                    "appNotifications"
                ]
            },
            {
                id: "tabs",
                name: "Titlebar & Tabs",
                settings: [
                    "gtkToolbarStyle",
                    "gtkTitlebarStyle",
                    "gtkTabsLocation",
                    "gtkWideTabs",
                    "gtkTitlebar",
                    "gtkTitlebarHideWhenMaximized",
                    "gtkQuickTerminalLayer",
                    "gtkQuickTerminalNamespace"
                ]
            }
        ]
    },
    {
        id: "linux",
        icon: linux,
        name: "Linux",
        groups: [
            {
                id: "main",
                name: "",
                settings: [
                    "asyncBackend",
                    "linuxCgroup",
                    "linuxCgroupMemoryLimit",
                    "linuxCgroupProcessesLimit",
                    "linuxCgroupHardFail"
                ]
            }
        ]
    },
    {
        id: "macos",
        icon: macos,
        name: "macOS",
        groups: [
            {
                id: "main",
                name: "",
                settings: [
                    "macosNonNativeFullscreen",
                    "macosTitlebarStyle",
                    "macosTitlebarProxyIcon",
                    "macosOptionAsAlt",
                    "macosWindowShadow",
                    "macosWindowButtons",
                    "macosHidden",
                    "macosAutoSecureInput",
                    "macosSecureInputIndication",
                    "macosApplescript",
                    "macosDockDropBehavior",
                    "macosShortcuts",
                    "autoUpdate",
                    "autoUpdateChannel"
                ]
            },
            {
                id: "icon",
                name: "App Icon",
                note: "If you choose the <code>custom-style</code> option, you can use any of the other icon settings to customize your icon with a live preview.",
                settings: [
                    "macosIcon",
                    "macosCustomIcon",
                    "macosIconFrame",
                    "macosIconGhostColor",
                    "macosIconScreenColor"
                ]
            }
        ]
    }
] as const satisfies NavPanel[];

export default navigation;

type TopLevelPanelIDs = typeof navigation[number]["id"];
type TabGroups = TopLevelPanelIDs[][];

export const tabGroups: TabGroups = [
    ["application", "terminal", "clipboard"],
    ["window", "colors", "fonts"],
    ["keybinds", "mouse"],
    ["gtk", "linux", "macos"]
];

// Validation: run at build time or in dev
export function validateNavigation() {
    const seen = new Set<string>();
    const walk = (panels: NavPanel[]) => {
        for (const panel of panels) {
            for (const group of panel.groups ?? []) {
                for (const id of group.settings) {
                    if (!(id in registry)) throw new Error(`Unknown setting id in nav tree: ${id}`);
                    if (seen.has(id)) throw new Error(`Duplicate setting id in nav tree: ${id}`);
                    seen.add(id);
                }
            }
            if (panel.pages) walk(panel.pages);
        }
    };
    walk(navigation);

    for (const id of Object.keys(registry)) {
        if (!seen.has(id)) throw new Error(`Setting "${id}" exists in registry but is not categorized in navigation`);
    }
}

if (dev) validateNavigation();