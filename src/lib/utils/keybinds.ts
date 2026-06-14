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
const resizeDirectionOptions = ["up", "down", "left", "right"];
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
    | "unsignedInteger"
    | "free"
    | "enum"
    | "direction"
    | "resize"
    | "text";

export interface ActionDefinition {
    name: string;
    description?: string;
    type: ActionArgType;
    options?: string[];
    allowEmpty?: boolean;
    min?: number;
}

const ACTION_DEFINITIONS: ActionDefinition[] = [
    {name: "ignore", description: "Ignore this key and do not forward it to the terminal.", type: "none"},
    {name: "unbind", description: "Remove a previously defined Ghostty or user keybind.", type: "none"},
    {name: "csi", description: "Send a CSI sequence without the ESC[ prefix.", type: "free"},
    {name: "esc", description: "Send a raw ESC sequence.", type: "free"},
    {name: "text", description: "Send literal text using Zig string literal syntax.", type: "text"},
    {name: "cursor_key", description: "Send cursor-key data based on normal or application mode.", type: "none"},
    {name: "reset", description: "Reset the terminal state.", type: "none"},
    {
        name: "copy_to_clipboard",
        description: "Copy selection to clipboard as plain, vt, html, or mixed.",
        type: "enum",
        options: ["plain", "vt", "html", "mixed"],
        allowEmpty: true
    },
    {name: "paste_from_clipboard", description: "Paste from the default clipboard.", type: "none"},
    {name: "paste_from_selection", description: "Paste from the selection clipboard.", type: "none"},
    {name: "copy_url_to_clipboard", description: "Copy URL under cursor to clipboard.", type: "none"},
    {name: "copy_title_to_clipboard", description: "Copy terminal title to clipboard.", type: "none"},
    {name: "increase_font_size", description: "Increase font size by a point amount.", type: "number"},
    {name: "decrease_font_size", description: "Decrease font size by a point amount.", type: "number"},
    {name: "reset_font_size", description: "Reset font size to configured default.", type: "none"},
    {name: "set_font_size", description: "Set font size to a point value.", type: "number"},
    {name: "search", description: "Start or replace search text; use empty text to clear terms.", type: "free"},
    {name: "search_selection", description: "Search using the current text selection.", type: "none"},
    {name: "navigate_search", description: "Jump to previous or next search match.", type: "enum", options: ["previous", "next"]},
    {name: "start_search", description: "Open search UI without setting search text.", type: "none"},
    {name: "end_search", description: "End active search and hide search UI.", type: "none"},
    {name: "clear_screen", description: "Clear screen and scrollback.", type: "none"},
    {name: "select_all", description: "Select all terminal text.", type: "none"},
    {name: "scroll_to_top", description: "Scroll viewport to the top.", type: "none"},
    {name: "scroll_to_bottom", description: "Scroll viewport to the bottom.", type: "none"},
    {name: "scroll_to_selection", description: "Scroll viewport to the current selection.", type: "none"},
    {name: "scroll_to_row", description: "Scroll to an absolute row index starting at 0.", type: "unsignedInteger"},
    {name: "scroll_page_up", description: "Scroll up by one page.", type: "none"},
    {name: "scroll_page_down", description: "Scroll down by one page.", type: "none"},
    {name: "scroll_page_fractional", description: "Scroll by a fractional page amount.", type: "number"},
    {name: "scroll_page_lines", description: "Scroll by a number of lines.", type: "integer"},
    {name: "adjust_selection", description: "Adjust the current selection in a direction.", type: "enum", options: adjustSelectionOptions},
    {name: "jump_to_prompt", description: "Jump viewport by prompt count (requires shell integration).", type: "integer"},
    {name: "write_scrollback_file", description: "Write full scrollback to temp file and copy, paste, or open its path.", type: "enum", options: writeOptions},
    {name: "write_screen_file", description: "Write current screen to temp file and copy, paste, or open its path.", type: "enum", options: writeOptions},
    {name: "write_selection_file", description: "Write selection to temp file and copy, paste, or open its path.", type: "enum", options: writeOptions},
    {name: "new_window", description: "Open a new window.", type: "none"},
    {name: "new_tab", description: "Open a new tab.", type: "none"},
    {name: "previous_tab", description: "Focus previous tab.", type: "none"},
    {name: "next_tab", description: "Focus next tab.", type: "none"},
    {name: "last_tab", description: "Focus last tab.", type: "none"},
    {name: "goto_tab", description: "Focus tab by 1-based index.", type: "unsignedInteger", min: 1},
    {name: "move_tab", description: "Move current tab by relative offset.", type: "integer"},
    {name: "toggle_tab_overview", description: "Toggle tab overview.", type: "none"},
    {name: "prompt_surface_title", description: "Prompt for focused surface title.", type: "none"},
    {name: "prompt_tab_title", description: "Prompt for current tab title.", type: "none"},
    {name: "new_split", description: "Create a split in a direction or auto.", type: "enum", options: directionOptions, allowEmpty: true},
    {name: "goto_split", description: "Focus split by direction or previous/next order.", type: "enum", options: gotoSplitOptions},
    {name: "goto_window", description: "Focus previous or next window.", type: "enum", options: ["previous", "next"]},
    {name: "toggle_split_zoom", description: "Zoom or unzoom the current split.", type: "none"},
    {name: "toggle_readonly", description: "Toggle read-only mode for the focused surface.", type: "none"},
    {name: "resize_split", description: "Resize split by direction and pixel offset.", type: "resize"},
    {name: "equalize_splits", description: "Equalize all split sizes in the window.", type: "none"},
    {name: "reset_window_size", description: "Reset window to default size.", type: "none"},
    {name: "inspector", description: "Toggle, show, or hide terminal inspector.", type: "enum", options: inspectOptions},
    {name: "show_gtk_inspector", description: "Open GTK inspector.", type: "none"},
    {name: "show_on_screen_keyboard", description: "Show on-screen keyboard if available.", type: "none"},
    {name: "open_config", description: "Open Ghostty config in default editor.", type: "none"},
    {name: "reload_config", description: "Reload configuration and apply runtime-safe changes.", type: "none"},
    {name: "close_surface", description: "Close focused surface (window, tab, split, etc.).", type: "none"},
    {name: "close_tab", description: "Close this tab, other tabs, or tabs to the right.", type: "enum", options: ["this", "other", "right"], allowEmpty: true},
    {name: "close_window", description: "Close current window.", type: "none"},
    {name: "close_all_windows", description: "Close all windows (deprecated; prefer all:close_window).", type: "none"},
    {name: "toggle_maximize", description: "Toggle maximized window state.", type: "none"},
    {name: "toggle_fullscreen", description: "Toggle fullscreen state.", type: "none"},
    {name: "toggle_window_decorations", description: "Toggle window decorations (titlebar/buttons).", type: "none"},
    {name: "toggle_window_float_on_top", description: "Toggle always-on-top window mode.", type: "none"},
    {name: "toggle_secure_input", description: "Toggle secure input mode for sensitive typing.", type: "none"},
    {name: "toggle_mouse_reporting", description: "Toggle whether mouse events are reported to terminal apps.", type: "none"},
    {name: "toggle_command_palette", description: "Toggle command palette.", type: "none"},
    {name: "toggle_quick_terminal", description: "Toggle quick drop-down terminal.", type: "none"},
    {name: "toggle_visibility", description: "Show or hide all Ghostty windows.", type: "none"},
    {name: "toggle_background_opacity", description: "Toggle between transparent and opaque window background.", type: "none"},
    {name: "check_for_updates", description: "Check for Ghostty updates.", type: "none"},
    {name: "undo", description: "Undo last undoable Ghostty action.", type: "none"},
    {name: "redo", description: "Redo last undone Ghostty action.", type: "none"},
    {name: "end_key_sequence", description: "End active key sequence and flush prior keys.", type: "none"},
    {name: "activate_key_table", description: "Activate a named key table until deactivated.", type: "free"},
    {name: "activate_key_table_once", description: "Activate a named key table for one successful keybind use.", type: "free"},
    {name: "deactivate_key_table", description: "Deactivate currently active key table.", type: "none"},
    {name: "deactivate_all_key_tables", description: "Deactivate all active key tables.", type: "none"},
    {name: "quit", description: "Quit Ghostty.", type: "none"},
    {name: "crash", description: "Force a crash in selected thread for testing.", type: "enum", options: ["main", "io", "render"]}
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
    const step = rawStep.trim();
    if (!step) return null;

    let key: string;
    let modifierPart = "";

    if (step === "+") {
        key = "+";
    }
    else if (step.endsWith("++")) {
        key = "+";
        modifierPart = step.slice(0, -2);
    }
    else {
        const lastPlusIndex = step.lastIndexOf("+");
        if (lastPlusIndex === -1) {
            key = step;
        }
        else {
            key = step.slice(lastPlusIndex + 1);
            modifierPart = step.slice(0, lastPlusIndex);
            if (!key) return null;
        }
    }

    const normalizedKey = normalizeKeyName(key);
    const modifiers = modifierPart
        .split("+")
        .map((token) => token.trim())
        .filter(Boolean)
        .map(normalizeModifier)
        .filter((value) => value.length > 0);
    return {key: normalizedKey, modifiers};
}

function normalizeKeyName(key: string) {
    const compact = key.replace(/\s+/g, "");
    if (!compact) return "";
    const lowered = compact.toLowerCase();

    if (KEY_SET.has(lowered) || lowered.startsWith("physical:") || [...lowered].length === 1) {
        return lowered;
    }

    const snake = compact
        .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
        .replace(/([a-zA-Z])([0-9])/g, "$1_$2")
        .replace(/([0-9])([a-zA-Z])/g, "$1_$2")
        .toLowerCase();

    if (KEY_SET.has(snake) || snake.startsWith("physical:")) return snake;
    return lowered;
}

export function parseTrigger(triggerString: string): ParsedTrigger | null {
    if (!triggerString) return null;
    const steps: ParsedTriggerStep[] = [];
    const normalized = triggerString.replace(/\s+/g, "");
    const {prefixes, remainder} = parsePrefixes(normalized);
    const tokens = remainder
        .split(">")
        .map((segment) => segment.trim());
    if (!tokens.length) return null;
    if (tokens.some((segment) => !segment.length)) return null;
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
        if (args === undefined || args.trim() === "") return [`'${action}' requires a numeric argument`];
        if (!Number.isNaN(Number(args))) return [];
        return [`'${action}' expects a number, got '${args}'`];
    }
    if (definition.type === "integer") {
        if (args === undefined || args.trim() === "") return [`'${action}' requires an integer argument`];
        if (!Number.isNaN(Number(args)) && Number(args) % 1 === 0) return [];
        return [`'${action}' expects an integer, got '${args}'`];
    }
    if (definition.type === "unsignedInteger") {
        if (args === undefined || args.trim() === "") return [`'${action}' requires a non-negative integer argument`];
        const min = definition.min ?? 0;
        const value = Number(args);
        if (!Number.isNaN(value) && value % 1 === 0 && value >= min) return [];
        return [min === 0 ? `'${action}' expects a non-negative integer, got '${args}'` : `'${action}' expects an integer >= ${min}, got '${args}'`];
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
        const parts = args.split(",").map((segment) => segment.trim());
        if (parts.length !== 2) return [`'${action}' expects 'direction,offset'`];
        const [dir, amount] = parts;
        if (!resizeDirectionOptions.includes(dir)) {
            return [`'${action}' direction must be ${resizeDirectionOptions.join(", ")}`];
        }
        const offset = Number(amount);
        if (amount.trim() === "" || Number.isNaN(offset) || offset % 1 !== 0 || offset < 0) {
            return [`'${action}' requires a non-negative integer offset`];
        }
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

export {KEY_NAMES, ACTION_DEFINITIONS, VALID_MODIFIERS, VALID_PREFIXES, directionOptions, resizeDirectionOptions};
