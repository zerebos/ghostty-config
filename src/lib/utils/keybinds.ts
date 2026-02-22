const KEY_NAMES = [
    "unidentified",
    "backquote",
    "backslash",
    "bracket_left",
    "bracket_right",
    "comma",
    "digit_0",
    "digit_1",
    "digit_2",
    "digit_3",
    "digit_4",
    "digit_5",
    "digit_6",
    "digit_7",
    "digit_8",
    "digit_9",
    "equal",
    "intl_backslash",
    "intl_ro",
    "intl_yen",
    "key_a",
    "key_b",
    "key_c",
    "key_d",
    "key_e",
    "key_f",
    "key_g",
    "key_h",
    "key_i",
    "key_j",
    "key_k",
    "key_l",
    "key_m",
    "key_n",
    "key_o",
    "key_p",
    "key_q",
    "key_r",
    "key_s",
    "key_t",
    "key_u",
    "key_v",
    "key_w",
    "key_x",
    "key_y",
    "key_z",
    "minus",
    "period",
    "quote",
    "semicolon",
    "slash",
    "alt_left",
    "alt_right",
    "backspace",
    "caps_lock",
    "context_menu",
    "control_left",
    "control_right",
    "enter",
    "meta_left",
    "meta_right",
    "shift_left",
    "shift_right",
    "space",
    "tab",
    "convert",
    "kana_mode",
    "non_convert",
    "delete",
    "end",
    "help",
    "home",
    "insert",
    "page_down",
    "page_up",
    "arrow_down",
    "arrow_left",
    "arrow_right",
    "arrow_up",
    "num_lock",
    "numpad_0",
    "numpad_1",
    "numpad_2",
    "numpad_3",
    "numpad_4",
    "numpad_5",
    "numpad_6",
    "numpad_7",
    "numpad_8",
    "numpad_9",
    "numpad_add",
    "numpad_backspace",
    "numpad_clear",
    "numpad_clear_entry",
    "numpad_comma",
    "numpad_decimal",
    "numpad_divide",
    "numpad_enter",
    "numpad_equal",
    "numpad_memory_add",
    "numpad_memory_clear",
    "numpad_memory_recall",
    "numpad_memory_store",
    "numpad_memory_subtract",
    "numpad_multiply",
    "numpad_paren_left",
    "numpad_paren_right",
    "numpad_subtract",
    "numpad_separator",
    "numpad_up",
    "numpad_down",
    "numpad_right",
    "numpad_left",
    "numpad_begin",
    "numpad_home",
    "numpad_end",
    "numpad_insert",
    "numpad_delete",
    "numpad_page_up",
    "numpad_page_down",
    "escape",
    "f1",
    "f2",
    "f3",
    "f4",
    "f5",
    "f6",
    "f7",
    "f8",
    "f9",
    "f10",
    "f11",
    "f12",
    "f13",
    "f14",
    "f15",
    "f16",
    "f17",
    "f18",
    "f19",
    "f20",
    "f21",
    "f22",
    "f23",
    "f24",
    "f25",
    "fn",
    "fn_lock",
    "print_screen",
    "scroll_lock",
    "pause",
    "browser_back",
    "browser_favorites",
    "browser_forward",
    "browser_home",
    "browser_refresh",
    "browser_search",
    "browser_stop",
    "eject",
    "launch_app_1",
    "launch_app_2",
    "launch_mail",
    "media_play_pause",
    "media_select",
    "media_stop",
    "media_track_next",
    "media_track_previous",
    "power",
    "sleep",
    "audio_volume_down",
    "audio_volume_mute",
    "audio_volume_up",
    "wake_up",
    "copy",
    "cut",
    "paste"
] as const;

export type KeyName = (typeof KEY_NAMES)[number];

const MODIFIER_ALIASES: Record<string, string> = {
    control: "ctrl",
    cmd: "super",
    command: "super",
    opt: "alt",
    option: "alt"
};

const VALID_MODIFIERS = ["shift", "ctrl", "alt", "super"];
const VALID_PREFIXES = ["all", "global", "unconsumed", "performable"];
const directionOptions = ["right", "down", "left", "up", "auto"];
const inspectOptions = ["toggle", "show", "hide"];
const writeOptions = [
    "copy",
    "paste",
    "open",
    "copy,plain",
    "copy,vt",
    "copy,html",
    "paste,plain",
    "paste,vt",
    "paste,html",
    "open,plain",
    "open,vt",
    "open,html"
];
const gotoSplitOptions = [...directionOptions, "previous", "next"];
const adjustSelectionOptions = [
    "left",
    "right",
    "up",
    "down",
    "page_up",
    "page_down",
    "home",
    "end",
    "beginning_of_line",
    "end_of_line"
];

type ActionArgType =
    | "none"
    | "number"
    | "integer"
    | "free"
    | "enum"
    | "tuple"
    | "direction"
    | "resize"
    | "text"
    | "crash";

export interface ActionDefinition {
    name: string;
    type: ActionArgType;
    options?: string[];
    allowEmpty?: boolean;
}

const ACTION_DEFINITIONS: ActionDefinition[] = [
    {name: "ignore", type: "none"},
    {name: "unbind", type: "none"},
    {name: "csi", type: "free"},
    {name: "esc", type: "free"},
    {name: "text", type: "text"},
    {name: "cursor_key", type: "none"},
    {name: "reset", type: "none"},
    {
        name: "copy_to_clipboard",
        type: "enum",
        options: ["plain", "vt", "html", "mixed"],
        allowEmpty: true
    },
    {name: "paste_from_clipboard", type: "none"},
    {name: "paste_from_selection", type: "none"},
    {name: "copy_url_to_clipboard", type: "none"},
    {name: "copy_title_to_clipboard", type: "none"},
    {name: "increase_font_size", type: "number"},
    {name: "decrease_font_size", type: "number"},
    {name: "reset_font_size", type: "none"},
    {name: "set_font_size", type: "number"},
    {name: "search", type: "free", allowEmpty: true},
    {name: "search_selection", type: "none"},
    {name: "navigate_search", type: "enum", options: ["previous", "next"]},
    {name: "start_search", type: "none"},
    {name: "end_search", type: "none"},
    {name: "clear_screen", type: "none"},
    {name: "select_all", type: "none"},
    {name: "scroll_to_top", type: "none"},
    {name: "scroll_to_bottom", type: "none"},
    {name: "scroll_to_selection", type: "none"},
    {name: "scroll_to_row", type: "integer"},
    {name: "scroll_page_up", type: "none"},
    {name: "scroll_page_down", type: "none"},
    {name: "scroll_page_fractional", type: "number"},
    {name: "scroll_page_lines", type: "integer"},
    {name: "adjust_selection", type: "enum", options: adjustSelectionOptions},
    {name: "jump_to_prompt", type: "integer"},
    {name: "write_scrollback_file", type: "enum", options: writeOptions},
    {name: "write_screen_file", type: "enum", options: writeOptions},
    {name: "write_selection_file", type: "enum", options: writeOptions},
    {name: "new_window", type: "none"},
    {name: "new_tab", type: "none"},
    {name: "previous_tab", type: "none"},
    {name: "next_tab", type: "none"},
    {name: "last_tab", type: "none"},
    {name: "goto_tab", type: "integer"},
    {name: "move_tab", type: "integer"},
    {name: "toggle_tab_overview", type: "none"},
    {name: "prompt_surface_title", type: "none"},
    {name: "prompt_tab_title", type: "none"},
    {name: "new_split", type: "enum", options: directionOptions, allowEmpty: true},
    {name: "goto_split", type: "enum", options: gotoSplitOptions},
    {name: "goto_window", type: "enum", options: ["previous", "next"]},
    {name: "toggle_split_zoom", type: "none"},
    {name: "toggle_readonly", type: "none"},
    {name: "resize_split", type: "resize"},
    {name: "equalize_splits", type: "none"},
    {name: "reset_window_size", type: "none"},
    {name: "inspector", type: "enum", options: inspectOptions},
    {name: "show_gtk_inspector", type: "none"},
    {name: "show_on_screen_keyboard", type: "none"},
    {name: "open_config", type: "none"},
    {name: "reload_config", type: "none"},
    {name: "close_surface", type: "none"},
    {name: "close_tab", type: "enum", options: ["this", "other", "right"], allowEmpty: true},
    {name: "close_window", type: "none"},
    {name: "close_all_windows", type: "none"},
    {name: "toggle_maximize", type: "none"},
    {name: "toggle_fullscreen", type: "none"},
    {name: "toggle_window_decorations", type: "none"},
    {name: "toggle_window_float_on_top", type: "none"},
    {name: "toggle_secure_input", type: "none"},
    {name: "toggle_mouse_reporting", type: "none"},
    {name: "toggle_command_palette", type: "none"},
    {name: "toggle_quick_terminal", type: "none"},
    {name: "toggle_visibility", type: "none"},
    {name: "toggle_background_opacity", type: "none"},
    {name: "check_for_updates", type: "none"},
    {name: "undo", type: "none"},
    {name: "redo", type: "none"},
    {name: "end_key_sequence", type: "none"},
    {name: "activate_key_table", type: "free"},
    {name: "activate_key_table_once", type: "free"},
    {name: "deactivate_key_table", type: "none"},
    {name: "deactivate_all_key_tables", type: "none"},
    {name: "quit", type: "none"},
    {name: "crash", type: "enum", options: ["main", "io", "render"]}
];

const ACTION_LOOKUP = Object.fromEntries(ACTION_DEFINITIONS.map((action) => [action.name, action]));

export type ParsedTriggerStep = {
    key: string;
    modifiers: string[];
};

export type ParsedTrigger = {
    prefixes: string[];
    steps: ParsedTriggerStep[];
};

export type ParsedKeybind = {
    trigger?: ParsedTrigger;
    action?: string;
    args?: string;
    error?: string[];
};

const KEY_SET = new Set<string>(KEY_NAMES as readonly string[]);

function normalizeModifier(mod: string) {
    const normalized = mod.toLowerCase().trim();
    if (MODIFIER_ALIASES[normalized]) return MODIFIER_ALIASES[normalized];
    return normalized;
}

function parsePrefixes(trigger: string) {
    const prefixes: string[] = [];
    let cursor = trigger;
    let found = true;
    while (found) {
        found = false;
        for (const prefix of VALID_PREFIXES) {
            if (cursor.startsWith(`${prefix}:`)) {
                prefixes.push(prefix);
                cursor = cursor.slice(prefix.length + 1);
                found = true;
                break;
            }
        }
    }
    return {prefixes, remainder: cursor};
}

function parseStep(rawStep: string): ParsedTriggerStep | null {
    const tokens = rawStep
        .split("+")
        .map((token) => token.trim())
        .filter(Boolean);
    if (tokens.length === 0) return null;
    const key = tokens.pop()!;
    const normalizedKey = key.toLowerCase();
    const modifiers = tokens.map(normalizeModifier).filter((value) => value.length > 0);
    return {key: normalizedKey, modifiers};
}

export function parseTrigger(triggerString: string): ParsedTrigger | null {
    if (!triggerString) return null;
    const steps: ParsedTriggerStep[] = [];
    const normalized = triggerString.replace(/\s+/g, "");
    const {prefixes, remainder} = parsePrefixes(normalized);
    const tokens = remainder
        .split(">")
        .map((segment) => segment.trim())
        .filter(Boolean);
    if (!tokens.length) return null;
    for (const token of tokens) {
        const step = parseStep(token);
        if (!step) return null;
        steps.push(step);
    }
    return {prefixes, steps};
}

function normalizeKey(key: string) {
    return key.replace(/\s+/g, "").toLowerCase();
}

function isValidKey(key: string) {
    if (KEY_SET.has(key)) return true;
    if (key.startsWith("physical:")) return true;
    return [...key].length === 1;
}

function validateAction(action: string, args: string | undefined) {
    const definition = ACTION_LOOKUP[action];
    if (!definition) return [`unknown action '${action}'`];
    if (definition.type === "none" && args) {
        return [`'${action}' does not take arguments`];
    }
    if (definition.type === "free") {
        if (args === undefined) {
            if (definition.allowEmpty) return [];
            return [`'${action}' requires arguments`];
        }
        return [];
    }
    if (definition.type === "text") {
        if (args === undefined) return [`'${action}' requires text argument (Zig string literal)`];
        return [];
    }
    if (definition.type === "number") {
        if (args === undefined) return [`'${action}' requires a numeric argument`];
        if (!Number.isNaN(Number(args))) return [];
        return [`'${action}' expects a number, got '${args}'`];
    }
    if (definition.type === "integer") {
        if (args === undefined) return [`'${action}' requires an integer argument`];
        if (!Number.isNaN(Number(args)) && Number(args) % 1 === 0) return [];
        return [`'${action}' expects an integer, got '${args}'`];
    }
    if (definition.type === "enum") {
        if (args === undefined) {
            if (definition.allowEmpty) return [];
            return [`'${action}' requires one of [${definition.options?.join(", ")}].`];
        }
        if (!definition.options?.includes(args)) {
            return [`Invalid value for '${action}': '${args}'`];
        }
        return [];
    }
    if (definition.type === "resize") {
        if (args === undefined) return [`'${action}' expects 'direction,offset'`];
        const [dir, amount] = args.split(",").map((segment) => segment.trim());
        if (!directionOptions.includes(dir)) {
            return [`'${action}' direction must be ${directionOptions.join(", ")}`];
        }
        if (Number.isNaN(Number(amount))) return [`'${action}' requires a numeric offset`];
        return [];
    }
    return [];
}

export function parseKeybind(value: string): ParsedKeybind {
    const colon = value.indexOf("=");
    if (colon === -1) return {error: ["missing '=' between trigger and action"]};
    const trigger = value.slice(0, colon).trim();
    const actionPart = value.slice(colon + 1).trim();
    if (!trigger || !actionPart) return {error: ["trigger or action missing"]};
    const parsedTrigger = parseTrigger(trigger);
    if (!parsedTrigger) return {error: ["invalid trigger format"]};
    const argIndex = actionPart.indexOf(":");
    const action = argIndex === -1 ? actionPart : actionPart.slice(0, argIndex);
    const args = argIndex === -1 ? undefined : actionPart.slice(argIndex + 1);
    const errors: string[] = [];
    if (!action) errors.push("action missing");
    const prefixSet = new Set(parsedTrigger.prefixes);
    if (parsedTrigger.steps.length > 1 && (prefixSet.has("global") || prefixSet.has("all"))) {
        errors.push("global/all keybinds cannot be sequences");
    }
    const actionErrors = action ? validateAction(action, args) : ["missing action"];
    errors.push(...actionErrors);
    for (const step of parsedTrigger.steps) {
        if (!isValidKey(step.key)) {
            errors.push(`invalid key '${step.key}'`);
            break;
        }
        for (const mod of step.modifiers) {
            if (!VALID_MODIFIERS.includes(mod)) {
                errors.push(`invalid modifier '${mod}'`);
                break;
            }
        }
        if (step.modifiers.length > 4) {
            errors.push("too many modifiers");
            break;
        }
    }
    return {trigger: parsedTrigger, action, args, error: errors.filter(Boolean)};
}

export function canonicalTrigger(parsed: ParsedTrigger) {
    const steps = parsed.steps.map((step) => {
        const sortedModifiers = [...step.modifiers].sort();
        const key = step.key;
        return `${sortedModifiers.join("+")}${sortedModifiers.length ? "+" : ""}${key}`;
    });
    return steps.join(">");
}

export function getDiagnostics(keybinds: string[]) {
    const entries = keybinds.map(parseKeybind);
    const counts: Record<string, number> = {};
    entries.forEach((entry) => {
        if (entry.trigger) {
            const canon = canonicalTrigger(entry.trigger);
            counts[canon] = (counts[canon] || 0) + 1;
        }
    });
    return entries.map((entry) => {
        const status = entry.error && entry.error.length ? "invalid" : "ok";
        if (entry.trigger) {
            const canon = canonicalTrigger(entry.trigger);
            const duplicate = counts[canon] > 1;
            return {status, duplicate, errors: entry.error ?? [], canonical: canon};
        }
        return {status, duplicate: false, errors: entry.error ?? [], canonical: ""};
    });
}

export function formatTrigger(trigger: ParsedTrigger) {
    const prefixes = Array.from(new Set(trigger.prefixes));
    const prefixPart = prefixes.map((prefix) => `${prefix}:`).join("");
    const stepStrings = trigger.steps.map((step) => {
        const normalizedKey = normalizeKey(step.key);
        const sortedModifiers = [...step.modifiers].sort();
        const modifierPart = sortedModifiers.length ? `${sortedModifiers.join("+")}+` : "";
        return `${modifierPart}${normalizedKey}`;
    });
    return `${prefixPart}${stepStrings.join(">")}`;
}

export {KEY_NAMES, ACTION_DEFINITIONS, VALID_MODIFIERS, VALID_PREFIXES, directionOptions};
