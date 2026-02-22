/**
 * Ghostty Configuration Reference Schema
 *
 * This file contains a comprehensive, machine-readable reference of all
 * configuration options available in Ghostty's latest nightly build.
 * It mirrors Ghostty's own Config.zig schema as closely as possible.
 *
 * Each entry includes:
 *   - key: The exact config key name as used in ~/.config/ghostty/config
 *   - type: The value type
 *   - default: The default value (undefined means unset/null)
 *   - description: Full documentation from Ghostty's source
 *   - repeatable: Whether the setting can appear multiple times
 *   - platform: Platform restrictions (undefined = all platforms)
 *   - since: Version in which the setting was introduced
 *   - deprecated: Deprecation info if applicable
 *   - enum: Valid string values for enum types
 *   - min/max: Bounds for numeric types
 */

export type GhosttyPlatform = "macos" | "linux" | "gtk" | "gtk-wayland" | "gtk-x11";

export type GhosttySettingType =
    | "string"
    | "bool"
    | "uint"
    | "int"
    | "float"
    | "color"
    | "enum"
    | "keybinds"
    | "key-remap"
    | "palette"
    | "duration"
    | "path"
    | "font-size"
    | "font-style"
    | "font-variation"
    | "font-synthetic-style"
    | "font-shaping-break"
    | "freetype-load-flags"
    | "alpha-blending"
    | "metric-modifier"
    | "background-blur"
    | "window-padding"
    | "scroll-to-bottom"
    | "mouse-scroll-multiplier"
    | "terminal-color"
    | "bold-color"
    | "codepoint-map"
    | "clipboard-codepoint-map"
    | "selection-word-chars"
    | "split-preserve-zoom"
    | "shell-integration-features"
    | "quick-terminal-size"
    | "bell-features"
    | "app-notifications"
    | "notify-on-command-finish-action"
    | "command"
    | "repeatable-string-map"
    | "readable-io"
    | "link"
    | "command-palette-entry"
    | "color-list"
    | "theme";

export interface GhosttySettingDef {
    /** The config file key, e.g. `font-family` */
    key: string;
    /** The value type */
    type: GhosttySettingType;
    /** The default value. `undefined` means the setting is unset (null) by default. */
    default?: unknown;
    /** Full description from Ghostty's source documentation */
    description: string;
    /** Whether this setting can appear multiple times in config files */
    repeatable?: boolean;
    /** Valid enum values (only for type "enum") */
    enum?: string[];
    /** Minimum numeric value */
    min?: number;
    /** Maximum numeric value */
    max?: number;
    /** Platform(s) this setting applies to. Undefined = all platforms. */
    platform?: GhosttyPlatform[];
    /** Version in which this setting was introduced */
    since?: string;
    /** Deprecation: true if deprecated, or a string with the replacement */
    deprecated?: boolean | string;
}

const ghosttySchema: GhosttySettingDef[] = [
    // =========================================================================
    // LANGUAGE / LOCALE
    // =========================================================================
    {
        key: "language",
        type: "string",
        default: undefined,
        description: "Set Ghostty's graphical user interface language to a language other than the system default language. The language must be fully specified, including the encoding. For example: `language = de_DE.UTF-8` will force the strings in Ghostty's graphical user interface to be in German rather than the system default.\n\nThis will not affect the language used by programs run within Ghostty. Those will continue to use the default system language.\n\nWarning: This setting cannot be reloaded at runtime. To change the language you must fully restart Ghostty.",
        platform: ["gtk"],
        since: "1.3.0",
    },

    // =========================================================================
    // FONTS
    // =========================================================================
    {
        key: "font-family",
        type: "string",
        default: undefined,
        description: "The font families to use. You can generate the list of valid values using the CLI: `ghostty +list-fonts`.\n\nThis configuration can be repeated multiple times to specify preferred fallback fonts when the requested codepoint is not available in the primary font. This is particularly useful for multiple languages, symbolic fonts, etc.\n\nIf you want to overwrite a previous set value rather than append a fallback, specify the value as `\"\"` (empty string) to reset the list.",
        repeatable: true,
    },
    {
        key: "font-family-bold",
        type: "string",
        default: undefined,
        description: "The font family to use for bold text. Falls back to `font-family` if not set or not found.",
        repeatable: true,
    },
    {
        key: "font-family-italic",
        type: "string",
        default: undefined,
        description: "The font family to use for italic text. Falls back to `font-family` if not set or not found.",
        repeatable: true,
    },
    {
        key: "font-family-bold-italic",
        type: "string",
        default: undefined,
        description: "The font family to use for bold italic text. Falls back to `font-family` if not set or not found.",
        repeatable: true,
    },
    {
        key: "font-style",
        type: "font-style",
        default: "default",
        description: "Named font style for the main font. For example for `Iosevka Heavy` use a style of `Heavy`. Set to `false` to completely disable the style.",
    },
    {
        key: "font-style-bold",
        type: "font-style",
        default: "default",
        description: "Named font style for bold text. For example for `Iosevka Heavy` use a style of `Heavy`. Set to `false` to completely disable the style.",
    },
    {
        key: "font-style-italic",
        type: "font-style",
        default: "default",
        description: "Named font style for italic text. Set to `false` to completely disable the style.",
    },
    {
        key: "font-style-bold-italic",
        type: "font-style",
        default: "default",
        description: "Named font style for bold italic text. Set to `false` to completely disable the style.",
    },
    {
        key: "font-synthetic-style",
        type: "font-synthetic-style",
        default: "bold,italic,bold-italic",
        description: "Control whether Ghostty should synthesize a style if the requested style is not available in the specified font-family.\n\nSet to `false` or `true` to disable or enable synthetic styles completely. You can enable or disable specific styles using `bold`, `italic`, and `bold-italic` (to enable) or `no-bold`, `no-italic`, and `no-bold-italic` (to disable). Multiple styles can be combined with commas.\n\nAvailable style keys are: `bold`, `italic`, `bold-italic`.",
    },
    {
        key: "font-feature",
        type: "string",
        default: undefined,
        description: "Apply a font feature. To enable multiple font features you can repeat this multiple times or use a comma-separated list.\n\nSyntax: `feat`, `+feat`, `-feat`, `feat on`, `feat off`, `feat=1`, `feat=0`.\n\nTo disable programming ligatures, use `-calt`. To generally disable most ligatures, use `-calt, -liga, -dlig`.",
        repeatable: true,
    },
    {
        key: "font-size",
        type: "font-size",
        default: 13,
        description: "Font size in points. This value can be a non-integer and the nearest integer pixel size will be selected.\n\nDefaults to 13 on macOS and 12 on other platforms.",
        min: 4,
        max: 300,
    },
    {
        key: "font-variation",
        type: "font-variation",
        default: undefined,
        description: "A repeatable configuration to set one or more font variations values for a variable font. Format: `id=value` where `id` is the axis identifier (always 4 characters, e.g. `wght`). Common axes: `wght` (weight), `slnt` (slant), `ital` (italic), `opsz` (optical size), `wdth` (width).",
        repeatable: true,
    },
    {
        key: "font-variation-bold",
        type: "font-variation",
        default: undefined,
        description: "Variable font variations for bold text. See `font-variation`.",
        repeatable: true,
    },
    {
        key: "font-variation-italic",
        type: "font-variation",
        default: undefined,
        description: "Variable font variations for italic text. See `font-variation`.",
        repeatable: true,
    },
    {
        key: "font-variation-bold-italic",
        type: "font-variation",
        default: undefined,
        description: "Variable font variations for bold italic text. See `font-variation`.",
        repeatable: true,
    },
    {
        key: "font-codepoint-map",
        type: "codepoint-map",
        default: undefined,
        description: "Force one or a range of Unicode codepoints to map to a specific named font. Syntax: `codepoint=fontname` where codepoint is either a single codepoint (`U+ABCD`) or a range (`U+ABCD-U+DEFG`). Multiple ranges for the same font can be separated by commas.",
        repeatable: true,
    },
    {
        key: "clipboard-codepoint-map",
        type: "clipboard-codepoint-map",
        default: undefined,
        description: "Map specific Unicode codepoints to replacement values when copying text to clipboard. Syntax is similar to `font-codepoint-map`. Examples: `U+2500=U+002D` (box drawing horizontal → hyphen), `U+03A3=SUM` (Greek sigma → \"SUM\"). Only applies to text copying, not URL copying.",
        repeatable: true,
    },
    {
        key: "font-thicken",
        type: "bool",
        default: false,
        description: "Draw fonts with a thicker stroke, if supported. Currently only supported on macOS.",
        platform: ["macos"],
    },
    {
        key: "font-thicken-strength",
        type: "uint",
        default: 255,
        description: "Strength of thickening when `font-thicken` is enabled. Valid values are integers between 0 and 255. 0 does not correspond to no thickening — it corresponds to the lightest available thickening. Has no effect when `font-thicken` is false. macOS only.",
        platform: ["macos"],
        min: 0,
        max: 255,
    },
    {
        key: "font-shaping-break",
        type: "font-shaping-break",
        default: undefined,
        description: "Locations to break font shaping into multiple runs. A run is a contiguous segment of text that is shaped together. Breaking runs prevents ligatures from forming across certain points.\n\nCombine values with a comma to set multiple options. Prefix an option with `no-` to disable it.\n\nAvailable options:\n- `cursor` - Break runs under the cursor.",
        since: "1.2.0",
    },
    {
        key: "alpha-blending",
        type: "enum",
        default: "native (macOS) / linear-corrected (other)",
        description: "What color space to use when performing alpha blending. The default is platform-specific: `native` on macOS, `linear-corrected` on all other platforms.\n\nValues:\n- `native` - Perform alpha blending in the native color space for the OS (Display P3 on macOS, sRGB on Linux).\n- `linear` - Perform alpha blending in linear space.\n- `linear-corrected` - Same as `linear`, but with a correction step applied for text that makes it look nearly or completely identical to `native`, but without any of the darkening artifacts.",
        enum: ["native", "linear", "linear-corrected"],
        since: "1.1.0",
    },
    {
        key: "adjust-cell-width",
        type: "metric-modifier",
        default: undefined,
        description: "Adjust the cell width determined by the font. Values can be integers (1, -1) or a percentage (20%, -15%). Represents the amount to change the original value, not the absolute value.",
    },
    {
        key: "adjust-cell-height",
        type: "metric-modifier",
        default: undefined,
        description: "Adjust the cell height determined by the font. The font will be centered vertically in the cell. Values can be integers or percentages.",
    },
    {
        key: "adjust-font-baseline",
        type: "metric-modifier",
        default: undefined,
        description: "Distance in pixels or percentage adjustment from the bottom of the cell to the text baseline. Increase to move baseline UP, decrease to move baseline DOWN.",
    },
    {
        key: "adjust-underline-position",
        type: "metric-modifier",
        default: undefined,
        description: "Distance in pixels or percentage adjustment from the top of the cell to the top of the underline. Increase to move underline DOWN, decrease to move underline UP.",
    },
    {
        key: "adjust-underline-thickness",
        type: "metric-modifier",
        default: undefined,
        description: "Thickness in pixels of the underline.",
    },
    {
        key: "adjust-strikethrough-position",
        type: "metric-modifier",
        default: undefined,
        description: "Distance in pixels or percentage adjustment from the top of the cell to the top of the strikethrough. Increase to move strikethrough DOWN, decrease to move strikethrough UP.",
    },
    {
        key: "adjust-strikethrough-thickness",
        type: "metric-modifier",
        default: undefined,
        description: "Thickness in pixels or percentage adjustment of the strikethrough.",
    },
    {
        key: "adjust-overline-position",
        type: "metric-modifier",
        default: undefined,
        description: "Distance in pixels or percentage adjustment from the top of the cell to the top of the overline. Increase to move overline DOWN, decrease to move overline UP.",
    },
    {
        key: "adjust-overline-thickness",
        type: "metric-modifier",
        default: undefined,
        description: "Thickness in pixels or percentage adjustment of the overline.",
    },
    {
        key: "adjust-cursor-thickness",
        type: "metric-modifier",
        default: undefined,
        description: "Thickness in pixels or percentage adjustment of the bar cursor and outlined rect cursor.",
    },
    {
        key: "adjust-cursor-height",
        type: "metric-modifier",
        default: undefined,
        description: "Height in pixels or percentage adjustment of the cursor. Currently applies to all cursor types: bar, rect, and outlined rect.",
    },
    {
        key: "adjust-box-thickness",
        type: "metric-modifier",
        default: undefined,
        description: "Thickness in pixels or percentage adjustment of box drawing characters.",
    },
    {
        key: "adjust-icon-height",
        type: "metric-modifier",
        default: undefined,
        description: "Height in pixels or percentage adjustment of maximum height for nerd font icons. Powerline symbols are not affected.",
        since: "1.2.0",
    },
    {
        key: "grapheme-width-method",
        type: "enum",
        default: "unicode",
        description: "The method to use for calculating the cell width of a grapheme cluster.\n\n- `unicode` - Use the Unicode standard (default, correct but may cause cursor-desync with legacy programs).\n- `legacy` - Use a legacy method such as wcswidth (maximizes compatibility with legacy programs).\n\nIf a running program explicitly enables terminal mode 2027, then `unicode` width will be forced regardless of this configuration.",
        enum: ["unicode", "legacy"],
    },
    {
        key: "freetype-load-flags",
        type: "freetype-load-flags",
        default: "hinting,autohint,light",
        description: "FreeType load flags to enable. Format: comma-separated flags. Prefix with `no-` to disable. Use `true`/`false` to turn all flags on or off.\n\nAvailable flags:\n- `hinting` - Enable hinting (default: on)\n- `force-autohint` - Always use the freetype auto-hinter (default: off)\n- `monochrome` - Use 1-bit monochrome rendering, disables anti-aliasing (default: off)\n- `autohint` - Enable the freetype auto-hinter (default: on)\n- `light` - Use light hinting style, better preserving glyph shapes (default: on)\n\nOnly applies to Ghostty builds that use FreeType (typically Linux builds).",
        platform: ["linux"],
    },

    // =========================================================================
    // THEME & COLORS
    // =========================================================================
    {
        key: "theme",
        type: "theme",
        default: undefined,
        description: "A theme to use. Can be a built-in theme name, custom theme name, or absolute path to a custom theme file.\n\nTo specify different themes for light/dark mode: `light:theme-name,dark:theme-name`.\n\nTo see available themes, run `ghostty +list-themes`.",
    },
    {
        key: "background",
        type: "color",
        default: "#282c34",
        description: "Background color for the window. Specified as either hex (`#RRGGBB` or `RRGGBB`) or a named X11 color.",
    },
    {
        key: "foreground",
        type: "color",
        default: "#ffffff",
        description: "Foreground color for the window. Specified as either hex (`#RRGGBB` or `RRGGBB`) or a named X11 color.",
    },
    {
        key: "background-image",
        type: "path",
        default: undefined,
        description: "Background image for the terminal. Should be a path to a PNG or JPEG file.\n\nThe background image is per-terminal, not per-window. Background images are duplicated in VRAM per-terminal.\n\nWARNING: For large images this could lead to significant VRAM usage.",
        since: "1.2.0",
    },
    {
        key: "background-image-opacity",
        type: "float",
        default: 1.0,
        description: "Background image opacity, relative to `background-opacity`. A value of 1.0 places the image on top of the background color. Values greater than 1.0 give the image higher opacity than the general background.",
        min: 0,
        since: "1.2.0",
    },
    {
        key: "background-image-position",
        type: "enum",
        default: "center",
        description: "Background image position.",
        enum: ["top-left", "top-center", "top-right", "center-left", "center", "center-right", "bottom-left", "bottom-center", "bottom-right"],
        since: "1.2.0",
    },
    {
        key: "background-image-fit",
        type: "enum",
        default: "contain",
        description: "Background image fit.\n\n- `contain` - Scale to largest size that fits within the terminal while preserving aspect ratio.\n- `cover` - Scale to smallest size that completely covers the terminal while preserving aspect ratio (may clip edges).\n- `stretch` - Stretch to full size of the terminal without preserving aspect ratio.\n- `none` - Don't scale the background image.",
        enum: ["contain", "cover", "stretch", "none"],
        since: "1.2.0",
    },
    {
        key: "background-image-repeat",
        type: "bool",
        default: false,
        description: "Whether to repeat the background image if it doesn't completely fill the terminal area.",
        since: "1.2.0",
    },
    {
        key: "selection-foreground",
        type: "terminal-color",
        default: undefined,
        description: "Foreground color for selection. If not set, the selection color is the inverted window background/foreground. Specified as hex or named X11 color. Since 1.2.0, can be set to `cell-foreground` or `cell-background`.",
    },
    {
        key: "selection-background",
        type: "terminal-color",
        default: undefined,
        description: "Background color for selection. If not set, the selection color is the inverted window background/foreground. Specified as hex or named X11 color. Since 1.2.0, can be set to `cell-foreground` or `cell-background`.",
    },
    {
        key: "selection-clear-on-typing",
        type: "bool",
        default: true,
        description: "Whether to clear selected text when typing. If false, the selected text will not be cleared when typing. Selection can still be manually cleared by clicking once or pressing `escape`.",
        since: "1.2.0",
    },
    {
        key: "selection-clear-on-copy",
        type: "bool",
        default: false,
        description: "Whether to clear selected text after copying. When true, the selection will be automatically cleared after any `copy_to_clipboard` keyboard binding. Does not apply to `copy-on-select` copies.",
    },
    {
        key: "selection-word-chars",
        type: "selection-word-chars",
        default: " \\t'\"│`|:;,()[]{}<>$",
        description: "Characters that mark word boundaries during text selection (e.g. double-clicking). When selecting a word, the selection will stop at any of these characters.\n\nEach character becomes a word boundary. The null character (U+0000) is always treated as a boundary.",
        since: "1.3.0",
    },
    {
        key: "minimum-contrast",
        type: "float",
        default: 1,
        description: "The minimum contrast ratio between the foreground and background colors. A value between 1 and 21. A value of 1 allows no contrast (e.g. black on black). Based on the WCAG 2.0 specification. Does not apply to Emoji or images.",
        min: 1,
        max: 21,
    },
    {
        key: "palette",
        type: "palette",
        default: undefined,
        description: "Color palette for the 256 color form. Syntax: `N=COLOR` where N is 0-255 and COLOR is an RGB color code (`#AABBCC`) or named X11 color. The palette index can be in decimal, binary (0b), octal (0o), or hexadecimal (0x).",
        repeatable: true,
    },
    {
        key: "palette-generate",
        type: "bool",
        default: true,
        description: "Whether to automatically generate the extended 256 color palette (indices 16–255) from the base 16 ANSI colors. Colors explicitly set via `palette` are never overwritten.",
        since: "1.3.0",
    },
    {
        key: "palette-harmonious",
        type: "bool",
        default: false,
        description: "Invert the palette colors generated when `palette-generate` is enabled, so that colors go in reverse order. This allows palette-based applications to work well in both light and dark mode. Has no effect if `palette-generate` is disabled.",
        since: "1.3.0",
    },

    // =========================================================================
    // CURSOR
    // =========================================================================
    {
        key: "cursor-color",
        type: "terminal-color",
        default: undefined,
        description: "The color of the cursor. If not set, a default will be chosen. Specified as hex or named X11 color. Since 1.2.0, can be set to `cell-foreground` or `cell-background`.",
    },
    {
        key: "cursor-opacity",
        type: "float",
        default: 1.0,
        description: "The opacity level of the cursor. A value of 1 is fully opaque and 0 is fully transparent. A sufficiently small value such as 0.3 may be effectively invisible.",
        min: 0,
        max: 1,
    },
    {
        key: "cursor-style",
        type: "enum",
        default: "block",
        description: "The style of the cursor. Sets the default style; running programs can override using escape sequences (CSI q). Shell integration will automatically set the cursor to a bar at a prompt (disable via `shell-integration-features = no-cursor`).\n\nValues: `block`, `bar`, `underline`, `block_hollow`",
        enum: ["block", "bar", "underline", "block_hollow"],
    },
    {
        key: "cursor-style-blink",
        type: "bool",
        default: undefined,
        description: "Sets the default blinking state of the cursor. If not set (`undefined`/unset), Ghostty will respect DEC Mode 12 (AT&T cursor blink) as an alternate approach to turning blinking on/off. If set to any value, DEC mode 12 will be ignored but DECSCUSR will still be respected.\n\nValues: `true`, `false`, or leave unset (null/undefined) to follow DEC Mode 12.",
    },
    {
        key: "cursor-text",
        type: "terminal-color",
        default: undefined,
        description: "The color of the text under the cursor. If not set, a default will be chosen. Specified as hex or named X11 color. Since 1.2.0, can be set to `cell-foreground` or `cell-background`.",
    },
    {
        key: "cursor-click-to-move",
        type: "bool",
        default: true,
        description: "Enables the ability to move the cursor at prompts by using alt+click (Linux) or option+click (macOS). Requires shell integration (OSC 133) and only works in primary screen mode.",
    },

    // =========================================================================
    // MOUSE
    // =========================================================================
    {
        key: "mouse-hide-while-typing",
        type: "bool",
        default: false,
        description: "Hide the mouse immediately when typing. The mouse becomes visible again when it is used (button, movement, etc.).",
    },
    {
        key: "scroll-to-bottom",
        type: "scroll-to-bottom",
        default: "keystroke",
        description: "When to scroll the surface to the bottom. Comma-separated list of options. Prefix with `no-` to disable.\n\nOptions:\n- `keystroke` - Scroll to bottom when a key is pressed that sends data to the PTY (default: on)\n- `output` - Scroll to bottom when new data is displayed (default: off)",
    },
    {
        key: "mouse-shift-capture",
        type: "enum",
        default: "false",
        description: "Determines whether running programs can detect the shift key pressed with a mouse click. Typically, shift extends mouse selection.\n\n- `false` - Shift not sent with mouse protocol, will extend selection. Program can override with XTSHIFTESCAPE.\n- `true` - Shift sent with mouse protocol. Program can override with XTSHIFTESCAPE.\n- `never` - Same as false but program cannot override with XTSHIFTESCAPE.\n- `always` - Same as true but program cannot override with XTSHIFTESCAPE.",
        enum: ["true", "false", "always", "never"],
    },
    {
        key: "mouse-reporting",
        type: "bool",
        default: true,
        description: "Enable or disable mouse reporting. When false, mouse events will not be reported to terminal applications even if they request it. Can be toggled at runtime using the `toggle_mouse_reporting` keybind action.",
    },
    {
        key: "mouse-scroll-multiplier",
        type: "mouse-scroll-multiplier",
        default: "precision:1,discrete:3",
        description: "Multiplier for scrolling distance with the mouse wheel. Can be prefixed with `precision:` or `discrete:` to set the multiplier only for specific device types, comma-separated. If no prefix is used, the multiplier applies to all devices.\n\nDefault is 3 for discrete devices and 1 for precision devices. Value will be clamped to [0.01, 10000].",
        min: 0.01,
        max: 10000,
    },

    // =========================================================================
    // BACKGROUND
    // =========================================================================
    {
        key: "background-opacity",
        type: "float",
        default: 1.0,
        description: "The opacity level of the background. A value of 1 is fully opaque and 0 is fully transparent. On macOS, background opacity is disabled when in native fullscreen. On macOS, changing this requires restarting Ghostty completely.",
        min: 0,
        max: 1,
    },
    {
        key: "background-opacity-cells",
        type: "bool",
        default: false,
        description: "Applies background opacity to cells with an explicit background color set. Normally, `background-opacity` is only applied to the window background. Setting this to true will apply it to all cells regardless of whether they have an explicit background color.",
        since: "1.2.0",
    },
    {
        key: "background-blur",
        type: "background-blur",
        default: "false",
        description: "Whether to blur the background when `background-opacity` is less than 1.\n\nValues:\n- A nonnegative integer specifying the blur intensity\n- `false` (equivalent to intensity 0)\n- `true` (equivalent to default intensity of 20)\n- `macos-glass-regular` - Standard glass effect (macOS 26.0+)\n- `macos-glass-clear` - Highly transparent glass effect (macOS 26.0+)\n\nSupported on macOS and some Linux DEs (KDE Plasma). On KDE Plasma, the exact blur intensity is ignored — any truthy value enables blur.",
    },

    // =========================================================================
    // SPLITS
    // =========================================================================
    {
        key: "unfocused-split-opacity",
        type: "float",
        default: 0.7,
        description: "The opacity level of an unfocused split. Unfocused splits are slightly faded out to make it easier to see which split is focused. To disable this feature, set to 1. Clamped to [0.15, 1].",
        min: 0.15,
        max: 1,
    },
    {
        key: "unfocused-split-fill",
        type: "color",
        default: undefined,
        description: "The color to dim the unfocused split. Unfocused splits are dimmed by rendering a semi-transparent rectangle over the split. Defaults to the background color. Specified as hex or named X11 color.",
    },
    {
        key: "split-divider-color",
        type: "color",
        default: undefined,
        description: "The color of the split divider. If not set, a default will be chosen. Specified as hex or named X11 color.",
        since: "1.1.0",
    },
    {
        key: "split-preserve-zoom",
        type: "split-preserve-zoom",
        default: undefined,
        description: "Control when Ghostty preserves a zoomed split. Normally, any operation that changes focus or layout of the split tree will unzoom any zoomed split.\n\nSet to `navigation` to preserve the zoomed split state when navigating to another split (e.g. via `goto_split`). Prefix with `no-` to disable.\n\nExample: `split-preserve-zoom = navigation`",
        since: "1.3.0",
    },

    // =========================================================================
    // SEARCH
    // =========================================================================
    {
        key: "search-foreground",
        type: "terminal-color",
        default: "#000000",
        description: "Foreground color for non-focused (candidate) search matches. Valid values: hex, named X11 color, `cell-foreground`, or `cell-background`. Default is black.",
    },
    {
        key: "search-background",
        type: "terminal-color",
        default: "#ffe082",
        description: "Background color for non-focused (candidate) search matches. Valid values: hex, named X11 color, `cell-foreground`, or `cell-background`. Default is golden yellow.",
    },
    {
        key: "search-selected-foreground",
        type: "terminal-color",
        default: "#000000",
        description: "Foreground color for the currently selected (focused) search match. Default is black.",
    },
    {
        key: "search-selected-background",
        type: "terminal-color",
        default: "#f2a57e",
        description: "Background color for the currently selected (focused) search match. Default is soft peach.",
    },

    // =========================================================================
    // COMMAND / PROCESS
    // =========================================================================
    {
        key: "command",
        type: "command",
        default: undefined,
        description: "The command to run, usually a shell. If not an absolute path, looked up in PATH. If not set, the shell is determined from SHELL env var or passwd entry.\n\nPrefix with `direct:` to avoid shell expansion. Prefix with `shell:` to always wrap in a shell. Additional arguments are supported.\n\nUsed for all new terminal surfaces.",
    },
    {
        key: "initial-command",
        type: "command",
        default: undefined,
        description: "Same as `command`, but only applies to the first terminal surface created when Ghostty starts. Can also be set with the `-e` CLI flag (e.g. `ghostty -e fish --with --custom --args`).",
    },
    {
        key: "notify-on-command-finish",
        type: "enum",
        default: "never",
        description: "Controls when command finished notifications are sent. Requires shell integration or OSC 133 escape sequences.\n\n- `never` - Never send notifications (default)\n- `unfocused` - Only when the surface is not focused\n- `always` - Always send notifications",
        enum: ["never", "unfocused", "always"],
        platform: ["gtk"],
        since: "1.3.0",
    },
    {
        key: "notify-on-command-finish-action",
        type: "notify-on-command-finish-action",
        default: "bell",
        description: "How the user is notified when command finished notifications are enabled. Comma-separated list. Prefix with `no-` to disable.\n\nOptions:\n- `bell` - enabled by default\n- `notify` - disabled by default",
        platform: ["gtk"],
        since: "1.3.0",
    },
    {
        key: "notify-on-command-finish-after",
        type: "duration",
        default: "5s",
        description: "How long a command must have been running before a notification will be sent. Default is 5 seconds. Duration format: numbers followed by time units (y, d, h, m, s, ms, us, ns).",
        platform: ["gtk"],
        since: "1.3.0",
    },
    {
        key: "env",
        type: "repeatable-string-map",
        default: undefined,
        description: "Extra environment variables to pass to commands launched in a terminal surface. Format: `KEY=VALUE`. Setting a key to an empty string removes it. Setting `env` to an empty string resets the entire map.",
        repeatable: true,
        since: "1.2.0",
    },
    {
        key: "input",
        type: "readable-io",
        default: undefined,
        description: "Data to send as input to the command on startup. Formats:\n- `raw:<string>` - Send raw text (Zig string literal syntax)\n- `path:<path>` - Read a file and send its contents (max 10MB)\n- Bare value is treated as `raw:`\n\nCan be repeated; data is concatenated directly.",
        repeatable: true,
        since: "1.2.0",
    },
    {
        key: "wait-after-command",
        type: "bool",
        default: false,
        description: "If true, keep the terminal open after the command exits until any keypress is received. Primarily useful for scripts or debugging.",
    },
    {
        key: "abnormal-command-exit-runtime",
        type: "uint",
        default: 250,
        description: "The number of milliseconds of runtime below which a process exit is considered abnormal. Used to show an error message when the process exits too quickly.",
        min: 0,
    },

    // =========================================================================
    // SCROLLBACK
    // =========================================================================
    {
        key: "scrollback-limit",
        type: "uint",
        default: 10000000,
        description: "The size of the scrollback buffer in bytes. This also includes the active screen. When the limit is reached, the oldest lines are removed. Scrollback exists completely in memory. Allocated lazily. Per terminal surface, not for the entire application.",
        min: 0,
    },
    {
        key: "scrollbar",
        type: "enum",
        default: "system",
        description: "Control when the scrollbar is shown.\n\n- `system` - Respect the system settings for when to show scrollbars.\n- `never` - Never show a scrollbar.\n\nCurrently only supported on macOS. GTK doesn't yet support scrollbars.",
        enum: ["system", "never"],
        platform: ["macos"],
    },

    // =========================================================================
    // LINKS
    // =========================================================================
    {
        key: "link",
        type: "link",
        default: undefined,
        description: "Match a regular expression against the terminal text and associate clicking it with an action. Links configured earlier take precedence. A default link that matches URLs and opens them in the system opener always exists (disable with `link-url`).",
        repeatable: true,
    },
    {
        key: "link-url",
        type: "bool",
        default: true,
        description: "Enable URL matching. URLs are matched on hover with control (Linux) or command (macOS) pressed and open using the default system application. The URL matcher is always lowest priority of any configured links.",
    },
    {
        key: "link-previews",
        type: "enum",
        default: "true",
        description: "Show link previews for a matched URL.\n\n- `true` - Show previews for all matched URLs\n- `false` - Never show link previews\n- `osc8` - Only show previews for OSC 8 hyperlinks (where link text can differ from destination)",
        enum: ["true", "false", "osc8"],
        since: "1.2.0",
    },

    // =========================================================================
    // WINDOW STATE
    // =========================================================================
    {
        key: "maximize",
        type: "bool",
        default: false,
        description: "Whether to start the window in a maximized state. Applies to new windows only, not tabs or splits.",
        since: "1.1.0",
    },
    {
        key: "fullscreen",
        type: "enum",
        default: "false",
        description: "Start new windows in fullscreen.\n\n- `false` - Don't start in fullscreen (default)\n- `true` - Start in native fullscreen\n- `non-native` - (macOS only) Non-native fullscreen without animations, hides menu bar\n- `non-native-visible-menu` - (macOS only) Non-native fullscreen, keeps menu bar visible\n- `non-native-padded-notch` - (macOS only) Non-native fullscreen, hides menu bar but pads for notch\n\nIMPORTANT: Tabs do NOT work with non-native fullscreen modes.",
        enum: ["false", "true", "non-native", "non-native-visible-menu", "non-native-padded-notch"],
    },
    {
        key: "title",
        type: "string",
        default: undefined,
        description: "The title Ghostty will use for the window. Forces the title at all times; Ghostty will ignore set title escape sequences from programs. For a blank title, set to one or more spaces (quoted).",
    },
    {
        key: "class",
        type: "string",
        default: undefined,
        description: "Controls the WM_CLASS class field (X11), Wayland application ID, and DBus bus name. Default is `com.mitchellh.ghostty`. Changing this creates separate single-instance Ghostty instances.",
        platform: ["gtk"],
    },
    {
        key: "x11-instance-name",
        type: "string",
        default: undefined,
        description: "Controls the instance name field of the WM_CLASS X11 property when running under X11. Default is `ghostty`.",
        platform: ["gtk-x11"],
    },
    {
        key: "working-directory",
        type: "string",
        default: undefined,
        description: "The directory to change to after starting the command. Secondary to `window-inherit-working-directory`. Special values:\n- `home` - The home directory\n- `inherit` - The working directory of the launching process\n\nOn macOS, if launched from launchd/open, defaults to `home`. On GTK, if launched from a desktop launcher, defaults to `home`.",
    },

    // =========================================================================
    // KEYBINDS
    // =========================================================================
    {
        key: "keybind",
        type: "keybinds",
        default: undefined,
        description: "Key bindings. Format: `trigger=action`. Duplicate triggers overwrite previous values.\n\nTrigger: `+`-separated list of keys and modifiers (e.g. `ctrl+a`, `ctrl+shift+b`).\n\nPhysical keys can be specified using W3C key codes (e.g. `KeyA`, `key_a`).\n\nSpecial trigger prefix values:\n- `all:` - Apply to all terminal surfaces\n- `global:` - Make keybind global (system-wide)\n- `unconsumed:` - Don't consume the input\n- `performable:` - Only consume if action is performable\n\nSpecial values:\n- `keybind=clear` - Clear all keybindings\n\nChained actions (since 1.3.0): Use `chain=action` as subsequent keybind entries.\n\nKey tables (since 1.3.0): Use `<table>/<binding>` syntax.",
        repeatable: true,
    },
    {
        key: "key-remap",
        type: "key-remap",
        default: undefined,
        description: "Remap modifier keys within Ghostty. Allows swapping or reassigning modifier keys at the application level without affecting system-wide settings. Format: `from=to`.\n\nExamples:\n- `key-remap = ctrl=super`\n- `key-remap = left_control=right_alt`",
        repeatable: true,
    },

    // =========================================================================
    // WINDOW PADDING
    // =========================================================================
    {
        key: "window-padding-x",
        type: "window-padding",
        default: "2",
        description: "Horizontal window padding between terminal cells and left/right window borders. Value is in points (scaled for DPI). Can specify two comma-separated values for different left/right padding: `window-padding-x = 2,4`.",
    },
    {
        key: "window-padding-y",
        type: "window-padding",
        default: "2",
        description: "Vertical window padding between terminal cells and top/bottom window borders. Value is in points (scaled for DPI). Can specify two comma-separated values for different top/bottom padding: `window-padding-y = 2,4`.",
    },
    {
        key: "window-padding-balance",
        type: "bool",
        default: false,
        description: "If true, extra padding from viewport not divisible by cell size is automatically balanced between all four edges. The other `window-padding` options are applied first.",
    },
    {
        key: "window-padding-color",
        type: "enum",
        default: "background",
        description: "The color of the padding area of the window.\n\n- `background` - The background color specified in `background`\n- `extend` - Extend the background color of the nearest grid cell (with heuristics)\n- `extend-always` - Same as `extend` but always extends without applying heuristics",
        enum: ["background", "extend", "extend-always"],
    },

    // =========================================================================
    // WINDOW SETTINGS
    // =========================================================================
    {
        key: "window-vsync",
        type: "bool",
        default: true,
        description: "Synchronize rendering with the screen refresh rate. If true, minimizes tearing and aligns redraws with the screen but may cause input latency. Defaults to true because out-of-sync rendering on macOS can cause kernel panics (macOS 14.4+). Currently only supported on macOS.",
        platform: ["macos"],
    },
    {
        key: "window-inherit-working-directory",
        type: "bool",
        default: true,
        description: "If true, new windows will inherit the working directory of the previously focused window. If no window was previously focused, the `working-directory` option is used.",
    },
    {
        key: "tab-inherit-working-directory",
        type: "bool",
        default: true,
        description: "If true, new tabs will inherit the working directory of the previously focused tab. If no tab was previously focused, the `working-directory` option is used.",
    },
    {
        key: "split-inherit-working-directory",
        type: "bool",
        default: true,
        description: "If true, new split panes will inherit the working directory of the previously focused split. If no split was previously focused, the `working-directory` option is used.",
    },
    {
        key: "window-inherit-font-size",
        type: "bool",
        default: true,
        description: "If true, new windows and tabs will inherit the font size of the previously focused window. If false, the default font size from `font-size` is used.",
    },
    {
        key: "window-decoration",
        type: "enum",
        default: "auto",
        description: "Configure a preference for window decorations.\n\n- `none` - Disable all window decorations (titlebar, borders). On macOS, disables tabs.\n- `auto` - Automatically use client-side or server-side decorations based on OS/DE.\n- `client` - Prefer client-side decorations. (since 1.1.0)\n- `server` - Prefer server-side decorations (Linux GTK only). (since 1.1.0)\n\nAlso accepts boolean `true` (= auto) and `false` (= none).",
        enum: ["auto", "none", "client", "server"],
    },
    {
        key: "window-title-font-family",
        type: "string",
        default: undefined,
        description: "The font that will be used for the application's window and tab titles. If unset, the system default font is used. Does not need to be a fixed-width font.",
        since: "1.0.0",
    },
    {
        key: "window-subtitle",
        type: "enum",
        default: "false",
        description: "The text displayed in the subtitle of the window.\n\n- `false` - Disable the subtitle\n- `working-directory` - Set the subtitle to the working directory\n\nOnly supported on GTK.",
        enum: ["false", "working-directory"],
        platform: ["gtk"],
        since: "1.1.0",
    },
    {
        key: "window-theme",
        type: "enum",
        default: "auto",
        description: "The theme to use for the windows.\n\n- `auto` - Determine based on terminal background color. If theme has separate light/dark themes, behaves as `system`.\n- `system` - Use the system theme.\n- `light` - Use the light theme regardless of system theme.\n- `dark` - Use the dark theme regardless of system theme.\n- `ghostty` - Use the background/foreground colors from Ghostty configuration (Linux builds only).\n\nCurrently only supported on macOS and Linux.",
        enum: ["auto", "system", "light", "dark", "ghostty"],
    },
    {
        key: "window-colorspace",
        type: "enum",
        default: "srgb",
        description: "The color space to use when interpreting terminal colors.\n\n- `srgb` - Interpret colors in the sRGB color space (default).\n- `display-p3` - Interpret colors in the Display P3 color space.\n\nCurrently only supported on macOS.",
        enum: ["srgb", "display-p3"],
        platform: ["macos"],
    },
    {
        key: "window-height",
        type: "uint",
        default: 0,
        description: "The initial window height in terminal grid cells. Both `window-height` and `window-width` must be set to take effect. Values smaller than 4 are not allowed. Setting to 0 uses the app runtime default.",
        min: 0,
    },
    {
        key: "window-width",
        type: "uint",
        default: 0,
        description: "The initial window width in terminal grid cells. Both `window-height` and `window-width` must be set to take effect. Values smaller than 10 are not allowed. Setting to 0 uses the app runtime default.",
        min: 0,
    },
    {
        key: "window-position-x",
        type: "int",
        default: undefined,
        description: "The starting window X position in pixels, relative to the top-left corner of the primary monitor. Both x and y must be set to take effect. Note: only supported on macOS; GTK does not support setting window position.",
        platform: ["macos"],
    },
    {
        key: "window-position-y",
        type: "int",
        default: undefined,
        description: "The starting window Y position in pixels, relative to the top-left corner of the primary monitor. On macOS, relative to the top-left of the visible screen area. Both x and y must be set to take effect.",
        platform: ["macos"],
    },
    {
        key: "window-save-state",
        type: "enum",
        default: "default",
        description: "Whether to enable saving and restoring window state (position, size, tabs, splits, etc.).\n\n- `default` - Use the default system behavior (macOS: only if forcibly terminated or configured system-wide).\n- `never` - Never save window state.\n- `always` - Always save window state on exit.\n\nCurrently only supported on macOS.",
        enum: ["default", "never", "always"],
        platform: ["macos"],
    },
    {
        key: "window-step-resize",
        type: "bool",
        default: false,
        description: "Resize the window in discrete increments of the focused surface's cell size. If disabled, surfaces are resized in pixel increments. Currently only supported on macOS.",
        platform: ["macos"],
    },
    {
        key: "window-new-tab-position",
        type: "enum",
        default: "current",
        description: "The position where new tabs are created.\n\n- `current` - Insert after the currently focused tab, or at the end if no focused tabs.\n- `end` - Insert at the end of the tab list.",
        enum: ["current", "end"],
    },
    {
        key: "window-show-tab-bar",
        type: "enum",
        default: "auto",
        description: "Whether to show the tab bar.\n\n- `always` - Always display the tab bar, even with only one tab. (since 1.2.0)\n- `auto` - Show the tab bar only when there are two or more tabs.\n- `never` - Never show the tab bar. Tabs accessible via tab overview or keybinds.\n\nCurrently only supported on Linux (GTK).",
        enum: ["always", "auto", "never"],
        platform: ["gtk"],
    },
    {
        key: "window-titlebar-background",
        type: "color",
        default: undefined,
        description: "Background color for the window titlebar. Only takes effect if `window-theme` is set to `ghostty`. Currently only supported in the GTK app runtime. Specified as hex or named X11 color.",
        platform: ["gtk"],
    },
    {
        key: "window-titlebar-foreground",
        type: "color",
        default: undefined,
        description: "Foreground color for the window titlebar. Only takes effect if `window-theme` is set to `ghostty`. Currently only supported in the GTK app runtime. Specified as hex or named X11 color.",
        platform: ["gtk"],
    },
    {
        key: "resize-overlay",
        type: "enum",
        default: "after-first",
        description: "Controls when resize overlays are shown. Resize overlays are a transient popup showing the terminal size while resizing.\n\n- `always` - Always show resize overlays.\n- `never` - Never show resize overlays.\n- `after-first` - Don't show on initial creation, but show on subsequent resizes.",
        enum: ["always", "never", "after-first"],
    },
    {
        key: "resize-overlay-position",
        type: "enum",
        default: "center",
        description: "If resize overlays are enabled, controls the position of the overlay.",
        enum: ["center", "top-left", "top-center", "top-right", "bottom-left", "bottom-center", "bottom-right"],
    },
    {
        key: "resize-overlay-duration",
        type: "duration",
        default: "750ms",
        description: "If resize overlays are enabled, controls how long the overlay is visible before it is hidden. Default is 750ms. Duration format: numbers followed by time units (y, d, h, m, s, ms, us, ns).",
    },

    // =========================================================================
    // FOCUS
    // =========================================================================
    {
        key: "focus-follows-mouse",
        type: "bool",
        default: false,
        description: "If true, when there are multiple split panes, the mouse selects the pane that is focused. Only applies to the currently focused window.",
    },

    // =========================================================================
    // CLIPBOARD
    // =========================================================================
    {
        key: "clipboard-read",
        type: "enum",
        default: "ask",
        description: "Whether to allow programs running in the terminal to read from the system clipboard (OSC 52).\n\n- `ask` - Ask the user before allowing (default)\n- `allow` - Always allow\n- `deny` - Always deny",
        enum: ["ask", "allow", "deny"],
    },
    {
        key: "clipboard-write",
        type: "enum",
        default: "allow",
        description: "Whether to allow programs running in the terminal to write to the system clipboard (OSC 52).\n\n- `ask` - Ask the user before allowing\n- `allow` - Always allow (default)\n- `deny` - Always deny",
        enum: ["ask", "allow", "deny"],
    },
    {
        key: "clipboard-trim-trailing-spaces",
        type: "bool",
        default: true,
        description: "Trims trailing whitespace on data that is copied to the clipboard. Only applies to trailing whitespace on lines that have other characters. Completely blank lines always have their whitespace trimmed.",
    },
    {
        key: "clipboard-paste-protection",
        type: "bool",
        default: true,
        description: "Require confirmation before pasting text that appears unsafe. Helps prevent 'copy/paste attacks' where a user may accidentally execute unsafe commands by pasting text with newlines.",
    },
    {
        key: "clipboard-paste-bracketed-safe",
        type: "bool",
        default: true,
        description: "If true, bracketed pastes will be considered safe. Bracketed pastes are pastes while the running program has bracketed paste mode enabled.",
    },
    {
        key: "title-report",
        type: "bool",
        default: false,
        description: "Enables or disables title reporting (CSI 21 t). Allows the running program to query the terminal title.\n\nWARNING: This can expose sensitive information at best and enable arbitrary code execution at worst.",
        since: "1.0.1",
    },
    {
        key: "image-storage-limit",
        type: "uint",
        default: 320000000,
        description: "The total amount of bytes that can be used for image data (e.g. the Kitty image protocol) per terminal screen. Maximum value is 4,294,967,295 (4GiB). Default is 320MB. If set to zero, all image protocols are disabled. Separate for primary and alternate screens.",
        min: 0,
        max: 4294967295,
    },
    {
        key: "copy-on-select",
        type: "enum",
        default: "true",
        description: "Whether to automatically copy selected text to the clipboard.\n\n- `true` - Copy to the selection clipboard (default on Linux and macOS)\n- `false` - Disable copy on select\n- `clipboard` - Copy to both the selection clipboard and system clipboard\n\nMiddle-click paste always uses the selection clipboard.",
        enum: ["true", "false", "clipboard"],
    },
    {
        key: "right-click-action",
        type: "enum",
        default: "context-menu",
        description: "The action to take when the user right-clicks on the terminal surface.\n\n- `context-menu` - Show the context menu (default)\n- `paste` - Paste from clipboard\n- `copy` - Copy selected text\n- `copy-or-paste` - Copy if there's a selection, paste otherwise\n- `ignore` - Do nothing",
        enum: ["context-menu", "paste", "copy", "copy-or-paste", "ignore"],
    },
    {
        key: "click-repeat-interval",
        type: "uint",
        default: 0,
        description: "The time in milliseconds between clicks to consider a click a repeat (double, triple, etc.). A value of zero uses a platform-specific default (macOS: OS settings, other: 500ms).",
        min: 0,
    },

    // =========================================================================
    // CONFIG FILES
    // =========================================================================
    {
        key: "config-file",
        type: "path",
        default: undefined,
        description: "Additional configuration files to read. Can be repeated. Paths are relative to the config file containing the directive. Prepend `?` to suppress errors if the file doesn't exist. Cycles are not allowed. Config files are loaded after the config they're defined within.",
        repeatable: true,
    },
    {
        key: "config-default-files",
        type: "bool",
        default: true,
        description: "When true, the default configuration file paths will be loaded (e.g. `$XDG_CONFIG_HOME/ghostty/config`). Setting this to false targets using Ghostty from CLI minimizing external effects. CLI-only configuration; setting in a config file has no effect.",
    },

    // =========================================================================
    // WINDOW LIFECYCLE
    // =========================================================================
    {
        key: "confirm-close-surface",
        type: "enum",
        default: "true",
        description: "Confirms that a surface should be closed before closing it.\n\n- `true` - Confirm if shell integration detects a running process (default)\n- `false` - Close without confirmation\n- `always` - Always confirm, even if shell integration says no process is running",
        enum: ["true", "false", "always"],
    },
    {
        key: "quit-after-last-window-closed",
        type: "bool",
        default: false,
        description: "Whether to quit after the last surface is closed. Defaults to false on macOS (standard macOS behavior) and true on Linux. On Linux with this set to true, Ghostty can delay quitting using `quit-after-last-window-closed-delay`.",
    },
    {
        key: "quit-after-last-window-closed-delay",
        type: "duration",
        default: undefined,
        description: "Controls how long Ghostty stays running after the last surface is closed. Only has an effect if `quit-after-last-window-closed` is true. Minimum value is 1s. Duration format: numbers followed by time units (y, d, h, m, s, ms, us, ns).\n\nOnly implemented on Linux.",
        platform: ["linux"],
    },
    {
        key: "initial-window",
        type: "bool",
        default: true,
        description: "Controls whether an initial window is created when Ghostty is run. Only implemented on Linux and macOS.",
    },
    {
        key: "undo-timeout",
        type: "duration",
        default: "5s",
        description: "The duration that undo operations remain available. Default is 5 seconds. Duration format: numbers followed by time units (y, d, h, m, s, ms, us, ns).\n\nA timeout of zero effectively disables undo. Only supported on macOS.",
        platform: ["macos"],
        since: "1.2.0",
    },

    // =========================================================================
    // QUICK TERMINAL
    // =========================================================================
    {
        key: "quick-terminal-position",
        type: "enum",
        default: "top",
        description: "The position of the quick terminal window.\n\n- `top` - Terminal appears at the top of the screen\n- `bottom` - Terminal appears at the bottom\n- `left` - Terminal appears at the left\n- `right` - Terminal appears at the right\n- `center` - Terminal appears at the center\n\nOn macOS, changing this requires restarting Ghostty.",
        enum: ["top", "bottom", "left", "right", "center"],
    },
    {
        key: "quick-terminal-size",
        type: "quick-terminal-size",
        default: undefined,
        description: "The size of the quick terminal. Can be a percentage (e.g. `50%`) or pixels (e.g. `300px`). A bare value without suffix is a config error.\n\nWhen one size is specified, it affects the primary axis (height for top/bottom, width for left/right). Specify two values comma-separated for both dimensions.\n\nExample: `50%,500px` for a top-positioned terminal = half-screen tall, 500px wide.",
        since: "1.2.0",
    },
    {
        key: "gtk-quick-terminal-layer",
        type: "enum",
        default: "top",
        description: "The layer of the quick terminal window.\n\n- `overlay` - In front of all windows\n- `top` - In front of normal windows but behind fullscreen overlays (default)\n- `bottom` - Behind normal windows but in front of wallpapers\n- `background` - Behind all windows\n\nGTK Wayland only.",
        enum: ["overlay", "top", "bottom", "background"],
        platform: ["gtk-wayland"],
        since: "1.2.0",
    },
    {
        key: "gtk-quick-terminal-namespace",
        type: "string",
        default: "ghostty-quick-terminal",
        description: "The namespace (identifier) for the quick terminal window used by the Wayland compositor and/or scripts to determine the type of layer surfaces.\n\nGTK Wayland only.",
        platform: ["gtk-wayland"],
        since: "1.2.0",
    },
    {
        key: "quick-terminal-screen",
        type: "enum",
        default: "main",
        description: "The screen where the quick terminal should show up.\n\n- `main` - The screen recommended by the OS as the main screen (default)\n- `mouse` - The screen the mouse is currently over\n- `macos-menu-bar` - The screen containing the macOS menu bar\n\nOnly implemented on macOS.",
        enum: ["main", "mouse", "macos-menu-bar"],
        platform: ["macos"],
    },
    {
        key: "quick-terminal-animation-duration",
        type: "float",
        default: 0.2,
        description: "Duration (in seconds) of the quick terminal enter and exit animation. Set to 0 to disable animation completely. Can be changed at runtime. Only implemented on macOS.",
        platform: ["macos"],
        min: 0,
    },
    {
        key: "quick-terminal-autohide",
        type: "bool",
        default: true,
        description: "Automatically hide the quick terminal when focus shifts to another window. Defaults to true on macOS and false on Linux/BSD.\n\nOn Linux, global shortcuts require system configuration and are less accessible, so it's preferable to keep the terminal open.",
    },
    {
        key: "quick-terminal-space-behavior",
        type: "enum",
        default: "move",
        description: "Behavior of the quick terminal when switching between macOS spaces.\n\n- `move` - Quick terminal moves to the current space (default)\n- `remain` - Quick terminal stays in its original space\n\nOnly implemented on macOS. On Linux, behavior is always equivalent to `move`.",
        enum: ["move", "remain"],
        since: "1.1.0",
    },
    {
        key: "quick-terminal-keyboard-interactivity",
        type: "enum",
        default: "on-demand",
        description: "Determines when the quick terminal receives keyboard input.\n\n- `none` - Will not receive any keyboard input\n- `on-demand` - Only receives keyboard input when focused (default)\n- `exclusive` - Always receives keyboard input, even when another window is focused\n\nOnly has an effect on Linux Wayland. On macOS, behavior is always equivalent to `on-demand`.",
        enum: ["none", "on-demand", "exclusive"],
        platform: ["gtk-wayland"],
        since: "1.2.0",
    },

    // =========================================================================
    // SHELL INTEGRATION
    // =========================================================================
    {
        key: "shell-integration",
        type: "enum",
        default: "detect",
        description: "Whether to enable shell integration auto-injection.\n\n- `none` - Disable shell integration\n- `detect` - Auto-detect the shell and inject if supported (default)\n- `bash`, `elvish`, `fish`, `nushell`, `zsh` - Use a specific shell integration scheme",
        enum: ["none", "detect", "bash", "elvish", "fish", "nushell", "zsh"],
    },
    {
        key: "shell-integration-features",
        type: "shell-integration-features",
        default: "cursor,no-sudo,title,no-ssh-env,no-ssh-terminfo,path",
        description: "Shell integration features to enable. Comma-separated list. Prefix with `no-` to disable. Use `true`/`false` to turn all features on or off.\n\nFeatures:\n- `cursor` - Set cursor to bar at prompt (default: on)\n- `sudo` - Set sudo wrapper to preserve terminfo (default: off)\n- `title` - Set window title via shell integration (default: on)\n- `ssh-env` - SSH environment variable compatibility: converts TERM to xterm-256color and propagates COLORTERM (default: off, since 1.2.0)\n- `ssh-terminfo` - Automatic terminfo installation on remote hosts (default: off, since 1.2.0)\n- `path` - Add Ghostty's binary directory to PATH (default: on)",
    },
    {
        key: "command-palette-entry",
        type: "command-palette-entry",
        default: undefined,
        description: "Custom entries into the command palette. Each entry requires a title and action, and an optional description. Fields are prefixed with field name and colon: `title:Reset Font Style, action:csi:0m`.\n\nSet to empty to clear default entries.\n\nAvailable since: 1.2.0",
        repeatable: true,
        since: "1.2.0",
    },

    // =========================================================================
    // TERMINAL COMPATIBILITY
    // =========================================================================
    {
        key: "osc-color-report-format",
        type: "enum",
        default: "16-bit",
        description: "The reporting format for OSC sequences that request color information (OSC 4, 10, 11).\n\n- `none` - OSC queries receive no reply\n- `8-bit` - Color components returned unscaled (e.g. `rr/gg/bb`)\n- `16-bit` - Color components returned scaled (e.g. `rrrr/gggg/bbbb`) (default)",
        enum: ["none", "8-bit", "16-bit"],
    },
    {
        key: "vt-kam-allowed",
        type: "bool",
        default: false,
        description: "If true, allows the 'KAM' mode (ANSI mode 2) to be used within the terminal. KAM disables keyboard input at the request of the application. Not common and not recommended.",
    },
    {
        key: "term",
        type: "string",
        default: "xterm-ghostty",
        description: "The value to set for the TERM environment variable.",
    },
    {
        key: "enquiry-response",
        type: "string",
        default: "",
        description: "String to send when ENQ (0x05) is received from the running command. Defaults to an empty string.",
    },

    // =========================================================================
    // CUSTOM SHADERS
    // =========================================================================
    {
        key: "custom-shader",
        type: "path",
        default: undefined,
        description: "Custom shaders to run after the default shaders. Path to a GLSL-syntax shader compatible with the Shadertoy API. Shaders should specify a `mainImage` function.\n\nWARNING: Invalid shaders can cause Ghostty to become unusable (completely black window).\n\nCan be repeated to load multiple shaders run in order.",
        repeatable: true,
    },
    {
        key: "custom-shader-animation",
        type: "enum",
        default: "true",
        description: "If `true` (default), the focused terminal surface will run an animation loop when custom shaders are used.\n\n- `false` - Shader only renders when the terminal is updated\n- `true` - Run animation loop when terminal is focused\n- `always` - Always run the animation loop regardless of focus (uses more CPU)",
        enum: ["false", "true", "always"],
    },

    // =========================================================================
    // BELL
    // =========================================================================
    {
        key: "bell-features",
        type: "bell-features",
        default: "attention,title",
        description: "Bell features to enable. Comma-separated list. Prefix with `no-` to disable.\n\nFeatures:\n- `system` - Use built-in system functions (plays system alert sound on macOS)\n- `audio` - Play a custom sound (GTK only)\n- `attention` - Request user's attention when unfocused (default: on)\n- `title` - Prepend a bell emoji (🔔) to the title until re-focused (default: on)\n- `border` - Display a border around the alerted surface until re-focused (since 1.2.0 on GTK, 1.2.1 on macOS)",
        since: "1.2.0",
    },
    {
        key: "bell-audio-path",
        type: "path",
        default: undefined,
        description: "If `audio` is an enabled bell feature, this is a path to an audio file. Supports `~/` prefix. Relative paths are relative to the config file directory or CWD if used as CLI flag. GTK only.",
        platform: ["gtk"],
        since: "1.2.0",
    },
    {
        key: "bell-audio-volume",
        type: "float",
        default: 0.5,
        description: "If `audio` is an enabled bell feature, the volume to play the audio file at (relative to system volume). Range 0.0 (silence) to 1.0 (as loud as possible). GTK only.",
        platform: ["gtk"],
        min: 0,
        max: 1,
        since: "1.2.0",
    },
    {
        key: "app-notifications",
        type: "app-notifications",
        default: "clipboard-copy,config-reload",
        description: "Control the in-app notifications that Ghostty shows (toasts on GTK).\n\nNotifications:\n- `clipboard-copy` - Show when text is copied to clipboard (default: on)\n- `config-reload` - Show when configuration is reloaded (default: on)\n\nPrefix with `no-` to disable. Use `true`/`false` to enable/disable all. GTK only.",
        platform: ["gtk"],
        since: "1.1.0",
    },
    {
        key: "desktop-notifications",
        type: "bool",
        default: true,
        description: "If true (default), applications running in the terminal can show desktop notifications using certain escape sequences such as OSC 9 or OSC 777.",
    },

    // =========================================================================
    // BOLD COLOR
    // =========================================================================
    {
        key: "bold-color",
        type: "bold-color",
        default: undefined,
        description: "Modifies the color used for bold text in the terminal.\n\n- Set to a specific color (`#RRGGBB`) - Always use this color for default bold text. Sets remaining bold colors to `bright`.\n- Set to `bright` - Use bright color palette for bold text (replaces deprecated `bold-is-bright`).\n- Unset (default) - Use the normal foreground color for bold text.\n\nNote: The previous `bold-is-bright` configuration is deprecated and replaced by `bold-color = bright`.",
        since: "1.2.0",
    },
    {
        key: "faint-opacity",
        type: "float",
        default: 0.5,
        description: "The opacity level of faint text. A value of 1 is fully opaque and 0 is fully transparent.",
        min: 0,
        max: 1,
        since: "1.2.0",
    },

    // =========================================================================
    // ASYNC BACKEND
    // =========================================================================
    {
        key: "async-backend",
        type: "enum",
        default: "auto",
        description: "Configures the low-level API to use for async IO, eventing, etc.\n\n- `auto` - Automatically choose the best backend (default)\n- `epoll` - Use the epoll API\n- `io_uring` - Use the io_uring API\n\nOnly supported on Linux. Requires a full application restart to take effect.",
        enum: ["auto", "epoll", "io_uring"],
        platform: ["linux"],
        since: "1.2.0",
    },

    // =========================================================================
    // AUTO UPDATE
    // =========================================================================
    {
        key: "auto-update",
        type: "enum",
        default: undefined,
        description: "Control the auto-update functionality. Only supported on macOS.\n\n- `off` - Disable auto-updates\n- `check` - Check for updates and notify, but don't download\n- `download` - Download the update automatically, but don't install\n\nIf unset, defers to Sparkle's default behavior.",
        enum: ["off", "check", "download"],
        platform: ["macos"],
    },
    {
        key: "auto-update-channel",
        type: "enum",
        default: undefined,
        description: "The release channel to use for auto-updates. Defaults to match the release channel of the currently running Ghostty version.\n\n- `stable` - Stable tagged releases\n- `tip` - Pre-release versions from the main branch\n\nRequires a full restart to take effect. macOS only.",
        enum: ["stable", "tip"],
        platform: ["macos"],
    },

    // =========================================================================
    // macOS SPECIFIC
    // =========================================================================
    {
        key: "macos-non-native-fullscreen",
        type: "enum",
        default: "false",
        description: "If not false, fullscreen on macOS will not use native fullscreen but makes the window fullscreen without animations using a new space.\n\nIMPORTANT: Tabs do NOT work in this mode.\n\n- `false` - Use native macOS fullscreen (default)\n- `true` - Non-native fullscreen, hide menu bar\n- `visible-menu` - Non-native fullscreen, keep menu bar visible\n- `padded-notch` - Non-native fullscreen, hide menu bar, pad for notch",
        enum: ["false", "true", "visible-menu", "padded-notch"],
        platform: ["macos"],
    },
    {
        key: "macos-window-buttons",
        type: "enum",
        default: "visible",
        description: "Whether the window buttons (traffic lights) in the macOS titlebar are visible.\n\n- `visible` - Show the window buttons (default)\n- `hidden` - Hide the window buttons\n\nNo effect when `window-decoration = none` or `macos-titlebar-style = hidden`.",
        enum: ["visible", "hidden"],
        platform: ["macos"],
        since: "1.2.0",
    },
    {
        key: "macos-titlebar-style",
        type: "enum",
        default: "transparent",
        description: "The style of the macOS titlebar.\n\n- `native` - Standard native macOS titlebar\n- `transparent` - Native but transparent, shows window background color\n- `tabs` - Custom titlebar that integrates the tab bar (limitations on macOS 13 and below)\n- `hidden` - Hides the titlebar (window frame and rounded corners remain unlike `window-decoration = none`)",
        enum: ["native", "transparent", "tabs", "hidden"],
        platform: ["macos"],
    },
    {
        key: "macos-titlebar-proxy-icon",
        type: "enum",
        default: "visible",
        description: "Whether the proxy icon in the macOS titlebar is visible. The proxy icon represents the folder of the current working directory. Only visible with native macOS titlebar style.",
        enum: ["visible", "hidden"],
        platform: ["macos"],
    },
    {
        key: "macos-dock-drop-behavior",
        type: "enum",
        default: "new-tab",
        description: "Controls the windowing behavior when dropping a file or folder onto the Ghostty icon in the macOS dock.\n\n- `new-tab` - Create a new tab in the current window (default)\n- `new-window` - Create a new window unconditionally",
        enum: ["new-tab", "new-window"],
        platform: ["macos"],
    },
    {
        key: "macos-option-as-alt",
        type: "enum",
        default: undefined,
        description: "Changes the behavior of the macOS option key to act as alt.\n\nDefault (unset) depends on keyboard layout: `true` for U.S. Standard/International layouts, `false` otherwise.\n\n- `true` - Option treated as Alt (breaks Unicode input sequences)\n- `false` - Restore macOS Alt key unicode sequences (breaks terminal Alt sequences)\n- `left` - Enable only for left Option key\n- `right` - Enable only for right Option key",
        enum: ["true", "false", "left", "right"],
        platform: ["macos"],
    },
    {
        key: "macos-window-shadow",
        type: "bool",
        default: true,
        description: "Whether to enable the macOS window shadow. With some window managers and window transparency settings, you may find false more visually appealing.",
        platform: ["macos"],
    },
    {
        key: "macos-hidden",
        type: "enum",
        default: "never",
        description: "Control whether the macOS app is excluded from the dock and app switcher. Mainly intended for those primarily using quick-terminal mode.\n\n- `never` - App is never hidden (default)\n- `always` - App is always hidden\n\nNote: When hidden, keyboard layout changes will not be automatic.",
        enum: ["never", "always"],
        platform: ["macos"],
        since: "1.2.0",
    },
    {
        key: "macos-auto-secure-input",
        type: "bool",
        default: true,
        description: "If true, Ghostty on macOS will automatically enable Secure Input when it detects a password prompt. Secure Input prevents applications from reading keyboard events. Note that automatic detection is based on heuristics and may not work over SSH.",
        platform: ["macos"],
    },
    {
        key: "macos-secure-input-indication",
        type: "bool",
        default: true,
        description: "If true, Ghostty will show a graphical indication when secure input is enabled.",
        platform: ["macos"],
    },
    {
        key: "macos-icon",
        type: "enum",
        default: "official",
        description: "Customize the macOS app icon (affects dock, application switcher, etc.).\n\n- `official` - Official Ghostty icon\n- `blueprint`, `chalkboard`, `microchip`, `glass`, `holographic`, `paper`, `retro`, `xray` - Official icon variants\n- `custom` - Completely custom icon (set path with `macos-custom-icon`)\n- `custom-style` - Official icon with custom styles (requires `macos-icon-ghost-color` and `macos-icon-screen-color`)",
        enum: ["official", "blueprint", "chalkboard", "microchip", "glass", "holographic", "paper", "retro", "xray", "custom", "custom-style"],
        platform: ["macos"],
    },
    {
        key: "macos-custom-icon",
        type: "path",
        default: undefined,
        description: "The absolute path to the custom icon file. Supported formats: PNG, JPEG, ICNS. Defaults to `~/.config/ghostty/Ghostty.icns`. Used when `macos-icon = custom`.",
        platform: ["macos"],
    },
    {
        key: "macos-icon-frame",
        type: "enum",
        default: "aluminum",
        description: "The material to use for the frame of the macOS app icon. Required when `macos-icon = custom-style`.\n\n- `aluminum` - Brushed aluminum frame (default)\n- `beige` - Classic 90's computer beige frame\n- `plastic` - Glossy dark plastic frame\n- `chrome` - Shiny chrome frame",
        enum: ["aluminum", "beige", "plastic", "chrome"],
        platform: ["macos"],
    },
    {
        key: "macos-icon-ghost-color",
        type: "color",
        default: undefined,
        description: "The color of the ghost in the macOS app icon. Required when `macos-icon = custom-style`. Specified as hex or named X11 color.",
        platform: ["macos"],
    },
    {
        key: "macos-icon-screen-color",
        type: "color-list",
        default: undefined,
        description: "The color(s) of the screen in the macOS app icon. The screen is a linear gradient; specify up to 64 comma-separated colors. First color is the bottom of the gradient, last is the top. Required when `macos-icon = custom-style`.",
        platform: ["macos"],
    },
    {
        key: "macos-shortcuts",
        type: "enum",
        default: "ask",
        description: "Whether macOS Shortcuts are allowed to control Ghostty. Ghostty exposes actions that allow Shortcuts to create terminals, send text, run commands, etc.\n\n- `ask` - Ask the user for permission (remembered, like other macOS permissions) (default)\n- `allow` - Allow without asking\n- `deny` - Deny Shortcuts from controlling Ghostty",
        enum: ["allow", "deny", "ask"],
        platform: ["macos"],
        since: "1.2.0",
    },

    // =========================================================================
    // LINUX CGROUP
    // =========================================================================
    {
        key: "linux-cgroup",
        type: "enum",
        default: "single-instance",
        description: "Put every surface (tab, split, window) into a transient systemd scope for per-surface resource management.\n\n- `never` - Never use cgroups\n- `always` - Always use cgroups\n- `single-instance` - Enable cgroups only for Ghostty instances launched as single-instance applications (default on Linux)\n\nRequires systemd. Causes slightly slower startup. Changes not reflected in existing surfaces.",
        enum: ["never", "always", "single-instance"],
        platform: ["linux"],
    },
    {
        key: "linux-cgroup-memory-limit",
        type: "uint",
        default: undefined,
        description: "Memory limit in bytes for any individual terminal process (tab, split, window). If unset, no limit is set. Sets the `MemoryHigh` setting on the transient systemd scope (soft limit). Changes not reflected in existing surfaces.",
        platform: ["linux"],
        min: 0,
    },
    {
        key: "linux-cgroup-processes-limit",
        type: "uint",
        default: undefined,
        description: "Number of processes limit for any individual terminal process (tab, split, window). If unset, no limit is set. Sets the `TasksMax` setting (hard limit). Changes not reflected in existing surfaces.",
        platform: ["linux"],
        min: 0,
    },
    {
        key: "linux-cgroup-hard-fail",
        type: "bool",
        default: false,
        description: "If false, creating a transient systemd scope will be allowed to fail silently. If true, any transient systemd scope creation failure will cause surface creation to fail.",
        platform: ["linux"],
    },

    // =========================================================================
    // GTK SPECIFIC
    // =========================================================================
    {
        key: "gtk-opengl-debug",
        type: "bool",
        default: false,
        description: "Enable or disable GTK's OpenGL debugging logs. The default is true for debug builds and false for all others.",
        platform: ["gtk"],
        since: "1.1.0",
    },
    {
        key: "gtk-single-instance",
        type: "enum",
        default: "detect",
        description: "Controls whether the Ghostty GTK application runs in single-instance mode.\n\n- `true` - Single instance mode: new processes create windows in the existing instance\n- `false` - Each new process launches a separate application\n- `detect` - Assume single-instance unless TERM_PROGRAM is set or CLI args exist (default)\n\nNote: debug builds have a separate single-instance ID to avoid conflicting with release builds.",
        enum: ["true", "false", "detect"],
        platform: ["gtk"],
    },
    {
        key: "gtk-titlebar",
        type: "bool",
        default: true,
        description: "When enabled, the full GTK titlebar is displayed instead of your window manager's simple titlebar. Has no effect when `window-decoration` is none or when running under macOS.",
        platform: ["gtk"],
    },
    {
        key: "gtk-tabs-location",
        type: "enum",
        default: "top",
        description: "Determines the side of the screen that the GTK tab bar will stick to. When `hidden`, a tab button displaying the number of tabs appears in the title bar.",
        enum: ["top", "bottom"],
        platform: ["gtk"],
    },
    {
        key: "gtk-titlebar-hide-when-maximized",
        type: "bool",
        default: false,
        description: "If true, the titlebar will be hidden when the window is maximized, and shown when unmaximized. GTK only.",
        platform: ["gtk"],
        since: "1.1.0",
    },
    {
        key: "gtk-toolbar-style",
        type: "enum",
        default: "raised",
        description: "Determines the appearance of the top and bottom bars in the GTK terminal.\n\n- `flat` - Top and bottom bars are flat with the terminal window\n- `raised` - Top and bottom bars cast a shadow on the terminal area\n- `raised-border` - Like `raised` but the shadow is replaced with a subtle border",
        enum: ["flat", "raised", "raised-border"],
        platform: ["gtk"],
    },
    {
        key: "gtk-titlebar-style",
        type: "enum",
        default: "native",
        description: "The style of the GTK titlebar.\n\n- `native` - Traditional titlebar with title, buttons, and window controls. Tab bar appears below when multiple tabs are open.\n- `tabs` - Merges the tab bar and titlebar to save vertical space. Cannot drag the window by tab titles.",
        enum: ["native", "tabs"],
        platform: ["gtk"],
    },
    {
        key: "gtk-wide-tabs",
        type: "bool",
        default: true,
        description: "If true (default), GTK tabs will be 'wide' (fill available space, GNOME style). If false, tabs only take up space they need.",
        platform: ["gtk"],
    },
    {
        key: "gtk-custom-css",
        type: "path",
        default: undefined,
        description: "Custom CSS files to be loaded. Can be repeated to load multiple files. Prepend `?` to suppress errors if the file doesn't exist. File size limit per stylesheet: 5MiB.",
        repeatable: true,
        platform: ["gtk"],
        since: "1.1.0",
    },
];

export default ghosttySchema;
