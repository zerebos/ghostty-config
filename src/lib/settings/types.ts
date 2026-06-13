import type {HexColor} from "$lib/utils/colors";

export type GhosttyPlatform = "macos" | "linux" | "gtk" | "gtk-wayland" | "gtk-x11";

interface SettingInfo {
    key: string; // the actual ghostty config key, e.g. "window-padding-x"
    name: string; // display label
    note?: string; // short curated HTML hint
    description: string; // full markdown help text from ghostty schema
    platform?: GhosttyPlatform[];
    since?: string;
    repeatable?: boolean;
    disabled?: boolean;
    deprecated?: boolean | string;
}

interface SwitchSetting extends SettingInfo {
    type: "switch";
    default: boolean;
}

interface TextSetting extends SettingInfo {
    type: "text";
    default: string;
    placeholder?: string;
    size?: number;
}

interface NumberSetting extends SettingInfo {
    type: "number";
    default: number | undefined;
    min?: number;
    max?: number;
    step?: number;
    size?: number;
    placeholder?: string;
}

interface RangeSetting extends SettingInfo {
    type: "range";
    default: number;
    min: number;
    max: number;
    step?: number;
    showLabels?: boolean;
}

export interface DropdownOption {
    name: string;
    value: string;
    description?: string;
    icon?: string;
    group?: string;
    disabled?: boolean;
}

interface DropdownSetting extends SettingInfo {
    type: "dropdown";
    default: string;
    options: Array<DropdownOption | string>;
    searchable?: boolean;
    placeholder?: string;
    allowEmpty?: boolean;
    emptyLabel?: string;
}

interface ColorSetting extends SettingInfo {
    type: "color";
    default: HexColor | "";
}

interface PaletteSetting extends SettingInfo {
    type: "palette";
    default: HexColor[];
}

interface ThemeSetting extends SettingInfo {
    type: "theme";
    default: string;
    options: Array<DropdownOption | string>;
}

// Maybe move this to keybind module?
export type KeybindString = `${string}=${string}`;

interface KeybindsSetting extends SettingInfo {
    type: "keybinds";
    default: KeybindString[];
}

export type SettingDef =
    | SwitchSetting
    | TextSetting
    | NumberSetting
    | RangeSetting
    | DropdownSetting
    | ColorSetting
    | PaletteSetting
    | ThemeSetting
    | KeybindsSetting;

export type TypeToValue<T extends SettingDef["type"]> = Extract<SettingDef, {type: T;}>["default"];

export type SettingsRegistry = Record<string, SettingDef>;