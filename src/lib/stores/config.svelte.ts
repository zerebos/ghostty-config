import {dev} from "$app/environment";
import settings, {fetchColorScheme, type KeybindString} from "$lib/data/settings";
import type {HexColor} from "$lib/utils/colors";
import parse from "$lib/utils/parse";
// import defs from "../data/defaults.json";

// TODO: find a good way to properly type the config
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const defaults: Partial<Record<keyof DefaultConfig, any>> = {};

for (const panel of settings) {
    for (const group of panel.groups) {
        for (const setting of group.settings) {
            defaults[setting.id as keyof typeof defaults] = setting.value;
        }
    }
}

if (dev) {
    // eslint-disable-next-line no-console
    console.log(defaults);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const config = $state(Object.assign({}, defaults)) as Record<keyof DefaultConfig, any>;


export function keyToConfig(key: string) {
    return key.replaceAll(/([A-Z])/g, "-$1").toLowerCase();
}

export function diff() {
    // TODO: more elegance
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const output: Partial<Record<keyof typeof defaults|string, any>> = {};

    for (const k in config) {
        const key = k as keyof DefaultConfig;
        if (Array.isArray(config[key]) && key === "keybind") {
            const toAdd = config[key].filter(c => !defaults[key].includes(c));
            if (toAdd.length) output[keyToConfig(key)] = toAdd;
        }
        else if (Array.isArray(config[key]) && key === "palette") {
            const toAdd = [];
            for (let p = 0; p < defaults[key].length; p++) {
                if (config[key][p] === defaults[key][p]) continue;
                toAdd.push(`${p}=${config[key][p]}`);
            }
            // const toAdd = config[key].filter(c => !defaults[key].includes(c));
            if (toAdd.length) output[keyToConfig(key)] = toAdd;
        }
        else if (config[key] != defaults[key]) {
            output[keyToConfig(key)] = config[key];
        }
    }

    return output;
}

export function load(conf: Partial<typeof config>) {
    for (const key in conf) {
        if (!(key in config)) continue;
        if (key !== "keybind" && key !== "palette") {
            config[key as keyof typeof config] = conf[key as keyof typeof config];
        }
        else if (key === "keybind") {
            config.keybind = [...config.keybind, ...conf.keybind];
        }
        else if (key === "palette") {
            for (let p = 0; p < conf.palette.length; p++) {
                if (!conf.palette[p]) continue;
                config.palette[p] = conf.palette[p];
            }
        }
    }
}

export async function setColorScheme(name: string) {
    if (name === "") return resetColorScheme();
    const colorSchemeResponse = await fetchColorScheme(name);
    try {
        const parsed = parse(colorSchemeResponse);
        load(parsed);
    }
    catch (error) {
        // TODO: give feedback to user maybe?
        console.error(error); // eslint-disable-line no-console
    }
}

export async function resetColorScheme() {
    const keys = ["background", "foreground", "cursorColor", "selectionBackground", "selectionForeground"] as (keyof DefaultConfig)[];

    for (const key of keys) {
        config[key] = defaults[key];
    }

    for (let c = 0; c < defaults.palette.length; c++) {
        config.palette[c] = defaults.palette[c];
    }
}

export default config;


// TODO: is this useful?
interface DefaultConfig {
    palette: HexColor[];
    keybind: KeybindString[];
    fontFamily: string;
    fontFamilyBold: string;
    fontFamilyItalic: string;
    fontFamilyBoldItalic: string;
    fontStyle: string;
    fontStyleBold: string;
    fontStyleItalic: string;
    fontStyleBoldItalic: string;
    fontFeature: string;
    fontSize: number;
    fontVariation: string;
    fontVariationBold: string;
    fontVariationItalic: string;
    fontVariationBoldItalic: string;
    fontCodepointMap: string;
    fontThicken: boolean;
    adjustCellWidth: string;
    adjustCellHeight: string;
    adjustFontBaseline: string;
    adjustUnderlinePosition: string;
    adjustUnderlineThickness: string;
    adjustStrikethroughPosition: string;
    adjustStrikethroughThickness: string;
    adjustCursorThickness: string;
    graphemeWidthMethod: string;
    theme: string;
    background: HexColor;
    foreground: HexColor;
    selectionForeground: string;
    selectionBackground: string;
    selectionInvertFgBg: boolean;
    minimumContrast: number;
    cursorColor: string;
    cursorInvertFgBg: boolean;
    cursorOpacity: number;
    cursorStyle: string;
    cursorStyleBlink: string;
    cursorText: string;
    cursorClickToMove: boolean;
    mouseHideWhileTyping: boolean;
    mouseShiftCapture: boolean;
    mouseScrollMultiplier: number;
    backgroundOpacity: number;
    backgroundBlurRadius: number;
    unfocusedSplitOpacity: number;
    unfocusedSplitFill: string;
    command: string;
    waitAfterCommand: boolean;
    abnormalCommandExitRuntime: number;
    scrollbackLimit: number;
    linkUrl: boolean;
    fullscreen: boolean;
    title: string;
    class: string;
    workingDirectory: string;
    windowPaddingX: number;
    windowPaddingY: number;
    windowPaddingBalance: boolean;
    windowPaddingColor: string;
    windowVsync: boolean;
    windowInheritWorkingDirectory: boolean;
    windowInheritFontSize: boolean;
    windowDecoration: boolean;
    windowTitleFontFamily: string;
    windowTheme: string;
    windowColorspace: string;
    windowHeight: number;
    windowWidth: number;
    windowSaveState: string;
    windowStepResize: boolean;
    windowNewTabPosition: string;
    resizeOverlay: string;
    resizeOverlayPosition: string;
    resizeOverlayDuration: string;
    focusFollowsMouse: boolean;
    clipboardRead: string;
    clipboardWrite: string;
    clipboardTrimTrailingSpaces: boolean;
    clipboardPasteProtection: boolean;
    clipboardPasteBracketedSafe: boolean;
    imageStorageLimit: number;
    copyOnSelect: boolean;
    clickRepeatInterval: number;
    configFile: string;
    configDefaultFiles: boolean;
    confirmCloseSurface: boolean;
    quitAfterLastWindowClosed: boolean;
    quitAfterLastWindowClosedDelay: string;
    initialWindow: boolean;
    shellIntegration: string;
    shellIntegrationFeatures: string;
    oscColorReportFormat: string;
    vtKamAllowed: boolean;
    customShader: string;
    customShaderAnimation: boolean;
    macosNonNativeFullscreen: boolean;
    macosTitlebarStyle: string;
    macosOptionAsAlt: boolean;
    macosWindowShadow: boolean;
    linuxCgroup: string;
    linuxCgroupMemoryLimit: string;
    linuxCgroupProcessesLimit: string;
    linuxCgroupHardFail: boolean;
    gtkSingleInstance: string;
    gtkTitlebar: boolean;
    gtkTabsLocation: string;
    gtkWideTabs: boolean;
    gtkAdwaita: boolean;
    desktopNotifications: boolean;
    boldIsBright: boolean;
    term: string;
    enquiryResponse: string;
}