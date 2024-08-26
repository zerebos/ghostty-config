import {dev} from "$app/environment";
import settings, {type KeybindString} from "$lib/data/settings";
import type {HexColor} from "$lib/utils/colors";
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

export function printDifferences() {
    const output: Partial<typeof defaults> = {};

    for (const key in config) {
        if (config[key as keyof DefaultConfig] !== defaults[key as keyof DefaultConfig]) output[key as keyof DefaultConfig] = config[key as keyof DefaultConfig];
    }

    // eslint-disable-next-line no-console
    console.log(config);

    // eslint-disable-next-line no-console
    console.log(output);
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