import type {DropdownOption, SettingsRegistry, TypeToValue} from "./types";


/* eslint quote-props: ["error", "consistent-as-needed", {"keywords": false}] */

export const registry = {
    abnormalCommandExitRuntime: {
        default: 250,
        description: "The number of milliseconds of runtime below which a process exit is considered abnormal. Used to show an error message when the process exits too quickly.",
        key: "abnormal-command-exit-runtime",
        min: 0,
        name: "Abnormal command exit runtime",
        size: 5,
        type: "number"
    },
    adjustBoxThickness: {
        default: "",
        description: "Thickness in pixels or percentage adjustment of box drawing characters.",
        key: "adjust-box-thickness",
        name: "Box thickness adjustment",
        type: "text"
    },
    adjustCellHeight: {
        default: "",
        description: "Adjust the cell height determined by the font. The font will be centered vertically in the cell. Values can be integers or percentages.",
        key: "adjust-cell-height",
        name: "Cell height adjustment",
        type: "text"
    },
    adjustCellWidth: {
        default: "",
        description: "Adjust the cell width determined by the font. Values can be integers (1, -1) or a percentage (20%, -15%). Represents the amount to change the original value, not the absolute value.",
        key: "adjust-cell-width",
        name: "Cell width adjustment",
        type: "text"
    },
    adjustCursorHeight: {
        default: "",
        description: "Height in pixels or percentage adjustment of the cursor. Currently applies to all cursor types: bar, rect, and outlined rect.",
        key: "adjust-cursor-height",
        name: "Cursor height adjustment",
        type: "text"
    },
    adjustCursorThickness: {
        default: "",
        description: "Thickness in pixels or percentage adjustment of the bar cursor and outlined rect cursor.",
        key: "adjust-cursor-thickness",
        name: "Cursor thickness adjustment",
        type: "text"
    },
    adjustFontBaseline: {
        default: "",
        description: "Distance in pixels or percentage adjustment from the bottom of the cell to the text baseline. Increase to move baseline UP, decrease to move baseline DOWN.",
        key: "adjust-font-baseline",
        name: "Font baseline adjustment",
        type: "text"
    },
    adjustIconHeight: {
        default: "",
        description: "Height in pixels or percentage adjustment of maximum height for nerd font icons. Powerline symbols are not affected.",
        key: "adjust-icon-height",
        name: "Nerd font icon height adjustment",
        since: "1.2.0",
        type: "text"
    },
    adjustOverlinePosition: {
        default: "",
        description: "Distance in pixels or percentage adjustment from the top of the cell to the top of the overline. Increase to move overline DOWN, decrease to move overline UP.",
        key: "adjust-overline-position",
        name: "Overline position adjustment",
        type: "text"
    },
    adjustOverlineThickness: {
        default: "",
        description: "Thickness in pixels or percentage adjustment of the overline.",
        key: "adjust-overline-thickness",
        name: "Overline thickness adjustment",
        type: "text"
    },
    adjustStrikethroughPosition: {
        default: "",
        description: "Distance in pixels or percentage adjustment from the top of the cell to the top of the strikethrough. Increase to move strikethrough DOWN, decrease to move strikethrough UP.",
        key: "adjust-strikethrough-position",
        name: "Strikethrough position adjustment",
        type: "text"
    },
    adjustStrikethroughThickness: {
        default: "",
        description: "Thickness in pixels or percentage adjustment of the strikethrough.",
        key: "adjust-strikethrough-thickness",
        name: "Strikethrough thickness adjustment",
        type: "text"
    },
    adjustUnderlinePosition: {
        default: "",
        description: "Distance in pixels or percentage adjustment from the top of the cell to the top of the underline. Increase to move underline DOWN, decrease to move underline UP.",
        key: "adjust-underline-position",
        name: "Underline position adjustment",
        type: "text"
    },
    adjustUnderlineThickness: {
        default: "",
        description: "Thickness in pixels of the underline.",
        key: "adjust-underline-thickness",
        name: "Underline thickness adjustment",
        type: "text"
    },
    alphaBlending: {
        default: "native",
        description: "What color space to use when performing alpha blending. The default is platform-specific: `native` on macOS, `linear-corrected` on all other platforms.\n\nValues:\n- `native` - Perform alpha blending in the native color space for the OS (Display P3 on macOS, sRGB on Linux).\n- `linear` - Perform alpha blending in linear space.\n- `linear-corrected` - Same as `linear`, but with a correction step applied for text that makes it look nearly or completely identical to `native`, but without any of the darkening artifacts.",
        key: "alpha-blending",
        name: "Alpha blending colorspace",
        options: ["native", "linear", "linear-corrected"],
        since: "1.1.0",
        type: "dropdown"
    },
    appNotifications: {
        default: "",
        description: "Control the in-app notifications that Ghostty shows (toasts on GTK).\n\nNotifications:\n- `clipboard-copy` - Show when text is copied to clipboard (default: on)\n- `config-reload` - Show when configuration is reloaded (default: on)\n\nPrefix with `no-` to disable. Use `true`/`false` to enable/disable all. GTK only.",
        key: "app-notifications",
        name: "App notifications",
        note: "Comma-separated list of notifications to enable/disable. Available: clipboard-copy, config-reload. Prefix with <code>no-</code> to disable. <code>true</code>/<code>false</code> to enable/disable all.",
        platform: ["gtk"],
        since: "1.1.0",
        type: "text"
    },
    asyncBackend: {
        default: "auto",
        description: "Configures the low-level API to use for async IO, eventing, etc.\n\n- `auto` - Automatically choose the best backend (default)\n- `epoll` - Use the epoll API\n- `io_uring` - Use the io_uring API\n\nOnly supported on Linux. Requires a full application restart to take effect.",
        key: "async-backend",
        name: "Async backend",
        note: "If unsure, leave this set to auto.",
        options: ["auto", "epoll", "io_uring"],
        platform: ["linux"],
        since: "1.2.0",
        type: "dropdown"
    },
    autoUpdate: {
        allowEmpty: true,
        default: "",
        description: "Control the auto-update functionality. Only supported on macOS.\n\n- `off` - Disable auto-updates\n- `check` - Check for updates and notify, but don't download\n- `download` - Download the update automatically, but don't install\n\nIf unset, defers to Sparkle's default behavior.",
        emptyLabel: "Follow Sparkle",
        key: "auto-update",
        name: "Auto update",
        note: "Leaving this unset will fall back to your Sparkle preferences.",
        options: ["off", "check", "download"],
        placeholder: "Follow Sparkle",
        platform: ["macos"],
        type: "dropdown"
    },
    autoUpdateChannel: {
        allowEmpty: true,
        default: "",
        description: "The release channel to use for auto-updates. Defaults to match the release channel of the currently running Ghostty version.\n\n- `stable` - Stable tagged releases\n- `tip` - Pre-release versions from the main branch\n\nRequires a full restart to take effect. macOS only.",
        emptyLabel: "Current Sparkle",
        key: "auto-update-channel",
        name: "Update channel",
        note: "By default this will adhere to whichever version you downloaded.",
        options: ["stable", "tip"],
        placeholder: "Current Channel",
        platform: ["macos"],
        type: "dropdown"
    },
    background: {
        default: "#282c34",
        description: "Background color for the window. Specified as either hex (`#RRGGBB` or `RRGGBB`) or a named X11 color.",
        key: "background",
        name: "Background color",
        type: "color"
    },
    backgroundBlur: {
        default: "false",
        description: "Whether to blur the background when `background-opacity` is less than 1.\n\nValues:\n- A nonnegative integer specifying the blur intensity\n- `false` (equivalent to intensity 0)\n- `true` (equivalent to default intensity of 20)\n- `macos-glass-regular` - Standard glass effect (macOS 26.0+)\n- `macos-glass-clear` - Highly transparent glass effect (macOS 26.0+)\n\nSupported on macOS and some Linux DEs (KDE Plasma). On KDE Plasma, the exact blur intensity is ignored — any truthy value enables blur.",
        key: "background-blur",
        name: "Background blur",
        note: "Set to <code>true</code> to enable blur, <code>false</code> to disable, a number for a specific radius (macOS), or <code>macos-glass-regular</code>/<code>macos-glass-clear</code> for macOS glass effects.",
        type: "text"
    },
    backgroundImage: {
        default: "",
        description: "Background image for the terminal. Should be a path to a PNG or JPEG file.\n\nThe background image is per-terminal, not per-window. Background images are duplicated in VRAM per-terminal.\n\nWARNING: For large images this could lead to significant VRAM usage.",
        key: "background-image",
        name: "Background image",
        note: "Path to an image file to use as the terminal background.",
        since: "1.2.0",
        type: "text"
    },
    backgroundImageFit: {
        default: "contain",
        description: "Background image fit.\n\n- `contain` - Scale to largest size that fits within the terminal while preserving aspect ratio.\n- `cover` - Scale to smallest size that completely covers the terminal while preserving aspect ratio (may clip edges).\n- `stretch` - Stretch to full size of the terminal without preserving aspect ratio.\n- `none` - Don't scale the background image.",
        key: "background-image-fit",
        name: "Background image fit",
        options: ["contain", "cover", "stretch", "none"],
        since: "1.2.0",
        type: "dropdown"
    },
    backgroundImageOpacity: {
        default: 1,
        description: "Background image opacity, relative to `background-opacity`. A value of 1.0 places the image on top of the background color. Values greater than 1.0 give the image higher opacity than the general background.",
        key: "background-image-opacity",
        max: 1,
        min: 0,
        name: "Background image opacity",
        since: "1.2.0",
        step: 0.01,
        type: "range"
    },
    backgroundImagePosition: {
        default: "center",
        description: "Background image position.",
        key: "background-image-position",
        name: "Background image position",
        options: ["center", "top-left", "top-center", "top-right", "center-left", "center-center", "center-right", "bottom-left", "bottom-center", "bottom-right"],
        since: "1.2.0",
        type: "dropdown"
    },
    backgroundImageRepeat: {
        default: false,
        description: "Whether to repeat the background image if it doesn't completely fill the terminal area.",
        key: "background-image-repeat",
        name: "Repeat background image",
        since: "1.2.0",
        type: "switch"
    },
    backgroundOpacity: {
        default: 1,
        description: "The opacity level of the background. A value of 1 is fully opaque and 0 is fully transparent. On macOS, background opacity is disabled when in native fullscreen. On macOS, changing this requires restarting Ghostty completely.",
        key: "background-opacity",
        max: 1,
        min: 0,
        name: "Background opacity",
        step: 0.01,
        type: "range"
    },
    backgroundOpacityCells: {
        default: false,
        description: "Applies background opacity to cells with an explicit background color set. Normally, `background-opacity` is only applied to the window background. Setting this to true will apply it to all cells regardless of whether they have an explicit background color.",
        key: "background-opacity-cells",
        name: "Force background opacity on cells.",
        since: "1.2.0",
        type: "switch"
    },
    bellAudioPath: {
        default: "",
        description: "If `audio` is an enabled bell feature, this is a path to an audio file. Supports `~/` prefix. Relative paths are relative to the config file directory or CWD if used as CLI flag. GTK only.",
        key: "bell-audio-path",
        name: "Bell audio file",
        note: "Path to an audio file to play when the bell rings. Requires <code>audio</code> in bell features. GTK only.",
        platform: ["gtk"],
        since: "1.2.0",
        type: "text"
    },
    bellAudioVolume: {
        default: 0.5,
        description: "If `audio` is an enabled bell feature, the volume to play the audio file at (relative to system volume). Range 0.0 (silence) to 1.0 (as loud as possible). GTK only.",
        key: "bell-audio-volume",
        max: 1,
        min: 0,
        name: "Bell audio volume",
        note: "Volume for the bell audio, from 0 (silent) to 1 (full). GTK only.",
        platform: ["gtk"],
        showLabels: false,
        since: "1.2.0",
        step: 0.05,
        type: "range"
    },
    bellFeatures: {
        default: "",
        description: "Bell features to enable. Comma-separated list. Prefix with `no-` to disable.\n\nFeatures:\n- `system` - Use built-in system functions (plays system alert sound on macOS)\n- `audio` - Play a custom sound (GTK only)\n- `attention` - Request user's attention when unfocused (default: on)\n- `title` - Prepend a bell emoji (🔔) to the title until re-focused (default: on)\n- `border` - Display a border around the alerted surface until re-focused (since 1.2.0 on GTK, 1.2.1 on macOS)",
        key: "bell-features",
        name: "Bell features",
        note: "Comma-separated list of features. Available: system, audio, attention, title, border. Prefix with <code>no-</code> to disable.",
        since: "1.2.0",
        type: "text"
    },
    boldColor: {
        default: "",
        description: "Modifies the color used for bold text in the terminal.\n\n- Set to a specific color (`#RRGGBB`) - Always use this color for default bold text. Sets remaining bold colors to `bright`.\n- Set to `bright` - Use bright color palette for bold text (replaces deprecated `bold-is-bright`).\n- Unset (default) - Use the normal foreground color for bold text.\n\nNote: The previous `bold-is-bright` configuration is deprecated and replaced by `bold-color = bright`.",
        key: "bold-color",
        name: "Bold text color",
        note: "Set to <code>bright</code> to use bright palette colors for bold text, or a hex color value. Leave empty to use the default.",
        since: "1.2.0",
        type: "text"
    },
    class: {
        default: "",
        description: "Controls the WM_CLASS class field (X11), Wayland application ID, and DBus bus name. Default is `com.mitchellh.ghostty`. Changing this creates separate single-instance Ghostty instances.",
        key: "class",
        name: "WM_CLASS class field",
        note: "This defaults to <code>com.mitchellh.ghostty</code>",
        platform: ["gtk"],
        type: "text"
    },
    clickRepeatInterval: {
        default: 0,
        description: "The time in milliseconds between clicks to consider a click a repeat (double, triple, etc.). A value of zero uses a platform-specific default (macOS: OS settings, other: 500ms).",
        key: "click-repeat-interval",
        min: 0,
        name: "Milliseconds between multi-click",
        note: "A value of 0 means to use the operating system's default timing.",
        size: 4,
        type: "number"
    },
    clipboardPasteBracketedSafe: {
        default: true,
        description: "If true, bracketed pastes will be considered safe. Bracketed pastes are pastes while the running program has bracketed paste mode enabled.",
        key: "clipboard-paste-bracketed-safe",
        name: "Mark bracketed paste as safe",
        type: "switch"
    },
    clipboardPasteProtection: {
        default: true,
        description: "Require confirmation before pasting text that appears unsafe. Helps prevent 'copy/paste attacks' where a user may accidentally execute unsafe commands by pasting text with newlines.",
        key: "clipboard-paste-protection",
        name: "Confirm when pasting unsafely",
        type: "switch"
    },
    clipboardRead: {
        default: "ask",
        description: "Whether to allow programs running in the terminal to read from the system clipboard (OSC 52).\n\n- `ask` - Ask the user before allowing (default)\n- `allow` - Always allow\n- `deny` - Always deny",
        key: "clipboard-read",
        name: "Allow terminal to read clipboard",
        options: ["ask", "allow", "deny"],
        type: "dropdown"
    },
    clipboardTrimTrailingSpaces: {
        default: true,
        description: "Trims trailing whitespace on data that is copied to the clipboard. Only applies to trailing whitespace on lines that have other characters. Completely blank lines always have their whitespace trimmed.",
        key: "clipboard-trim-trailing-spaces",
        name: "Trim trailing space on copy",
        type: "switch"
    },
    clipboardWrite: {
        default: "allow",
        description: "Whether to allow programs running in the terminal to write to the system clipboard (OSC 52).\n\n- `ask` - Ask the user before allowing\n- `allow` - Always allow (default)\n- `deny` - Always deny",
        key: "clipboard-write",
        name: "Allow terminal to write clipboard",
        options: ["ask", "allow", "deny"],
        type: "dropdown"
    },
    command: {
        default: "",
        description: "The command to run, usually a shell. If not an absolute path, looked up in PATH. If not set, the shell is determined from SHELL env var or passwd entry.\n\nPrefix with `direct:` to avoid shell expansion. Prefix with `shell:` to always wrap in a shell. Additional arguments are supported.\n\nUsed for all new terminal surfaces.",
        key: "command",
        name: "Command to run on launch",
        type: "text"
    },
    configDefaultFiles: {
        default: true,
        description: "When true, the default configuration file paths will be loaded (e.g. `$XDG_CONFIG_HOME/ghostty/config`). Setting this to false targets using Ghostty from CLI minimizing external effects. CLI-only configuration; setting in a config file has no effect.",
        key: "config-default-files",
        name: "Load default config file",
        type: "switch"
    },
    configFile: {
        default: "",
        description: "Additional configuration files to read. Can be repeated. Paths are relative to the config file containing the directive. Prepend `?` to suppress errors if the file doesn't exist. Cycles are not allowed. Config files are loaded after the config they're defined within.",
        key: "config-file",
        name: "Additional config file",
        repeatable: true,
        type: "text"
    },
    confirmCloseSurface: {
        default: "true",
        description: "Confirms that a surface should be closed before closing it.\n\n- `true` - Confirm if shell integration detects a running process (default)\n- `false` - Close without confirmation\n- `always` - Always confirm, even if shell integration says no process is running",
        key: "confirm-close-surface",
        name: "Confirm when closing a surface",
        options: ["true", "false", "always"],
        type: "dropdown"
    },
    copyOnSelect: {
        default: "false",
        description: "Whether to automatically copy selected text to the clipboard.\n\n- `true` - Copy to the selection clipboard (default on Linux and macOS)\n- `false` - Disable copy on select\n- `clipboard` - Copy to both the selection clipboard and system clipboard\n\nMiddle-click paste always uses the selection clipboard.",
        key: "copy-on-select",
        name: "Copy on select",
        options: ["true", "false", "clipboard"],
        type: "dropdown"
    },
    cursorClickToMove: {
        default: true,
        description: "Enables the ability to move the cursor at prompts by using alt+click (Linux) or option+click (macOS). Requires shell integration (OSC 133) and only works in primary screen mode.",
        key: "cursor-click-to-move",
        name: "Enable click to move cursor",
        type: "switch"
    },
    cursorColor: {
        default: "",
        description: "The color of the cursor. If not set, a default will be chosen. Specified as hex or named X11 color. Since 1.2.0, can be set to `cell-foreground` or `cell-background`.",
        key: "cursor-color",
        name: "Cursor color",
        type: "color"
    },
    cursorOpacity: {
        default: 1,
        description: "The opacity level of the cursor. A value of 1 is fully opaque and 0 is fully transparent. A sufficiently small value such as 0.3 may be effectively invisible.",
        key: "cursor-opacity",
        max: 1,
        min: 0,
        name: "Cursor opacity",
        step: 0.05,
        type: "range"
    },
    cursorStyle: {
        default: "block",
        description: "The style of the cursor. Sets the default style; running programs can override using escape sequences (CSI q). Shell integration will automatically set the cursor to a bar at a prompt (disable via `shell-integration-features = no-cursor`).\n\nValues: `block`, `bar`, `underline`, `block_hollow`",
        key: "cursor-style",
        name: "Cursor style",
        options: ["block", "bar", "underline", {name: "hollow block", value: "block_hollow"}],
        type: "dropdown"
    },
    cursorStyleBlink: {
        default: "",
        description: "Sets the default blinking state of the cursor. If not set (`undefined`/unset), Ghostty will respect DEC Mode 12 (AT&T cursor blink) as an alternate approach to turning blinking on/off. If set to any value, DEC mode 12 will be ignored but DECSCUSR will still be respected.\n\nValues: `true`, `false`, or leave unset (null/undefined) to follow DEC Mode 12.",
        key: "cursor-style-blink",
        name: "Cursor blink style",
        note: "The <code>default</code> option defers to DEC mode 12 to determine blinking state.",
        options: ["true", "false", {name: "default", value: ""}],
        type: "dropdown"
    },
    cursorText: {
        default: "",
        description: "The color of the text under the cursor. If not set, a default will be chosen. Specified as hex or named X11 color. Since 1.2.0, can be set to `cell-foreground` or `cell-background`.",
        key: "cursor-text",
        name: "Text color under cursor",
        type: "color"
    },
    customShader: {
        default: "",
        description: "Custom shaders to run after the default shaders. Path to a GLSL-syntax shader compatible with the Shadertoy API. Shaders should specify a `mainImage` function.\n\nWARNING: Invalid shaders can cause Ghostty to become unusable (completely black window).\n\nCan be repeated to load multiple shaders run in order.",
        key: "custom-shader",
        name: "Custom shader",
        note: "This matches the API of Shadertoy.",
        repeatable: true,
        type: "text"
    },
    customShaderAnimation: {
        default: "true",
        description: "If `true` (default), the focused terminal surface will run an animation loop when custom shaders are used.\n\n- `false` - Shader only renders when the terminal is updated\n- `true` - Run animation loop when terminal is focused\n- `always` - Always run the animation loop regardless of focus (uses more CPU)",
        key: "custom-shader-animation",
        name: "Allow shaders to animate",
        options: ["false", "true", "always"],
        type: "dropdown"
    },
    desktopNotifications: {
        default: true,
        description: "If true (default), applications running in the terminal can show desktop notifications using certain escape sequences such as OSC 9 or OSC 777.",
        key: "desktop-notifications",
        name: "Allow desktop notifications",
        type: "switch"
    },
    enquiryResponse: {
        default: "",
        description: "String to send when ENQ (0x05) is received from the running command. Defaults to an empty string.",
        key: "enquiry-response",
        name: "Response to ENQ",
        type: "text"
    },
    env: {
        default: "",
        description: "Extra environment variables to pass to commands launched in a terminal surface. Format: `KEY=VALUE`. Setting a key to an empty string removes it. Setting `env` to an empty string resets the entire map.",
        key: "env",
        name: "Environment variables",
        repeatable: true,
        since: "1.2.0",
        type: "text"
    },
    faintOpacity: {
        default: 0.5,
        description: "The opacity level of faint text. A value of 1 is fully opaque and 0 is fully transparent.",
        key: "faint-opacity",
        max: 1,
        min: 0,
        name: "Faint text opacity",
        since: "1.2.0",
        step: 0.01,
        type: "range"
    },
    focusFollowsMouse: {
        default: false,
        description: "If true, when there are multiple split panes, the mouse selects the pane that is focused. Only applies to the currently focused window.",
        key: "focus-follows-mouse",
        name: "Focus splits on mouse move",
        type: "switch"
    },
    fontCodepointMap: {
        default: "",
        description: "Force one or a range of Unicode codepoints to map to a specific named font. Syntax: `codepoint=fontname` where codepoint is either a single codepoint (`U+ABCD`) or a range (`U+ABCD-U+DEFG`). Multiple ranges for the same font can be separated by commas.",
        key: "font-codepoint-map",
        name: "Unicode-specifc font mapping",
        note: "",
        repeatable: true,
        type: "text"
    },
    fontFamily: {
        default: "",
        description: "The font families to use. You can generate the list of valid values using the CLI: `ghostty +list-fonts`.\n\nThis configuration can be repeated multiple times to specify preferred fallback fonts when the requested codepoint is not available in the primary font. This is particularly useful for multiple languages, symbolic fonts, etc.\n\nIf you want to overwrite a previous set value rather than append a fallback, specify the value as `\"\"` (empty string) to reset the list.",
        key: "font-family",
        name: "Main font family",
        placeholder: "JetBrainsMono NF",
        repeatable: true,
        type: "text"
    },
    fontFamilyBold: {
        default: "",
        description: "The font family to use for bold text. Falls back to `font-family` if not set or not found.",
        key: "font-family-bold",
        name: "Font family for bold text",
        repeatable: true,
        type: "text"
    },
    fontFamilyBoldItalic: {
        default: "",
        description: "The font family to use for bold italic text. Falls back to `font-family` if not set or not found.",
        key: "font-family-bold-italic",
        name: "Font family for bold italic text",
        repeatable: true,
        type: "text"
    },
    fontFamilyItalic: {
        default: "",
        description: "The font family to use for italic text. Falls back to `font-family` if not set or not found.",
        key: "font-family-italic",
        name: "Font family for italic text",
        repeatable: true,
        type: "text"
    },
    fontFeature: {
        default: "",
        description: "Apply a font feature. To enable multiple font features you can repeat this multiple times or use a comma-separated list.\n\nSyntax: `feat`, `+feat`, `-feat`, `feat on`, `feat off`, `feat=1`, `feat=0`.\n\nTo disable programming ligatures, use `-calt`. To generally disable most ligatures, use `-calt, -liga, -dlig`.",
        key: "font-feature",
        name: "Font ligature settings",
        repeatable: true,
        type: "text"
    },
    fontShapingBreak: {
        default: "",
        description: "Locations to break font shaping into multiple runs. A run is a contiguous segment of text that is shaped together. Breaking runs prevents ligatures from forming across certain points.\n\nCombine values with a comma to set multiple options. Prefix an option with `no-` to disable it.\n\nAvailable options:\n- `cursor` - Break runs under the cursor.",
        key: "font-shaping-break",
        name: "How to break runs (cursor, no-cursor).",
        since: "1.2.0",
        type: "text"
    },
    fontSize: {
        default: 13,
        description: "Font size in points. This value can be a non-integer and the nearest integer pixel size will be selected.\n\nDefaults to 13 on macOS and 12 on other platforms.",
        key: "font-size",
        max: 60,
        min: 4,
        name: "Base font size",
        step: 0.5,
        type: "range"
    },
    fontStyle: {
        default: "default",
        description: "Named font style for the main font. For example for `Iosevka Heavy` use a style of `Heavy`. Set to `false` to completely disable the style.",
        key: "font-style",
        name: "Main font style",
        type: "text"
    },
    fontStyleBold: {
        default: "default",
        description: "Named font style for bold text. For example for `Iosevka Heavy` use a style of `Heavy`. Set to `false` to completely disable the style.",
        key: "font-style-bold",
        name: "Font style for bold text",
        type: "text"
    },
    fontStyleBoldItalic: {
        default: "default",
        description: "Named font style for bold italic text. Set to `false` to completely disable the style.",
        key: "font-style-bold-italic",
        name: "Font style for bold italic text",
        type: "text"
    },
    fontStyleItalic: {
        default: "default",
        description: "Named font style for italic text. Set to `false` to completely disable the style.",
        key: "font-style-italic",
        name: "Font style for italic text",
        type: "text"
    },
    fontSyntheticStyle: {
        default: "bold,italic,bold-italic",
        description: "Control whether Ghostty should synthesize a style if the requested style is not available in the specified font-family.\n\nSet to `false` or `true` to disable or enable synthetic styles completely. You can enable or disable specific styles using `bold`, `italic`, and `bold-italic` (to enable) or `no-bold`, `no-italic`, and `no-bold-italic` (to disable). Multiple styles can be combined with commas.\n\nAvailable style keys are: `bold`, `italic`, `bold-italic`.",
        key: "font-synthetic-style",
        name: "Synthetic styles",
        note: "See the docs for more info.",
        type: "text"
    },
    fontThicken: {
        default: false,
        description: "Draw fonts with a thicker stroke, if supported. Currently only supported on macOS.",
        key: "font-thicken",
        name: "Thicken fonts",
        note: "This currently only affects macOS.",
        platform: ["macos"],
        type: "switch"
    },
    fontThickenStrength: {
        default: 255,
        description: "Strength of thickening when `font-thicken` is enabled. Valid values are integers between 0 and 255. 0 does not correspond to no thickening — it corresponds to the lightest available thickening. Has no effect when `font-thicken` is false. macOS only.",
        key: "font-thicken-strength",
        max: 255,
        min: 0,
        name: "Thicken strength",
        platform: ["macos"],
        step: 1,
        type: "range"
    },
    fontVariation: {
        default: "",
        description: "A repeatable configuration to set one or more font variations values for a variable font. Format: `id=value` where `id` is the axis identifier (always 4 characters, e.g. `wght`). Common axes: `wght` (weight), `slnt` (slant), `ital` (italic), `opsz` (optical size), `wdth` (width).",
        key: "font-variation",
        name: "Main font variant",
        repeatable: true,
        type: "text"
    },
    fontVariationBold: {
        default: "",
        description: "Variable font variations for bold text. See `font-variation`.",
        key: "font-variation-bold",
        name: "Font variant for bold text",
        repeatable: true,
        type: "text"
    },
    fontVariationBoldItalic: {
        default: "",
        description: "Variable font variations for bold italic text. See `font-variation`.",
        key: "font-variation-bold-italic",
        name: "Font variant for bold italic text",
        repeatable: true,
        type: "text"
    },
    fontVariationItalic: {
        default: "",
        description: "Variable font variations for italic text. See `font-variation`.",
        key: "font-variation-italic",
        name: "Font variant for italic text",
        repeatable: true,
        type: "text"
    },
    foreground: {
        default: "#ffffff",
        description: "Foreground color for the window. Specified as either hex (`#RRGGBB` or `RRGGBB`) or a named X11 color.",
        key: "foreground",
        name: "Foreground color",
        type: "color"
    },
    freetypeLoadFlags: {
        default: "hinting,autohint,light",
        description: "FreeType load flags to enable. Format: comma-separated flags. Prefix with `no-` to disable. Use `true`/`false` to turn all flags on or off.\n\nAvailable flags:\n- `hinting` - Enable hinting (default: on)\n- `force-autohint` - Always use the freetype auto-hinter (default: off)\n- `monochrome` - Use 1-bit monochrome rendering, disables anti-aliasing (default: off)\n- `autohint` - Enable the freetype auto-hinter (default: on)\n- `light` - Use light hinting style, better preserving glyph shapes (default: on)\n\nOnly applies to Ghostty builds that use FreeType (typically Linux builds).",
        key: "freetype-load-flags",
        name: "FreeType load flags",
        platform: ["linux"],
        type: "text"
    },
    fullscreen: {
        default: false,
        description: "Start new windows in fullscreen.\n\n- `false` - Don't start in fullscreen (default)\n- `true` - Start in native fullscreen\n- `non-native` - (macOS only) Non-native fullscreen without animations, hides menu bar\n- `non-native-visible-menu` - (macOS only) Non-native fullscreen, keeps menu bar visible\n- `non-native-padded-notch` - (macOS only) Non-native fullscreen, hides menu bar but pads for notch\n\nIMPORTANT: Tabs do NOT work with non-native fullscreen modes.",
        key: "fullscreen",
        name: "Launch in fullscreen mode",
        type: "switch"
    },
    graphemeWidthMethod: {
        default: "unicode",
        description: "The method to use for calculating the cell width of a grapheme cluster.\n\n- `unicode` - Use the Unicode standard (default, correct but may cause cursor-desync with legacy programs).\n- `legacy` - Use a legacy method such as wcswidth (maximizes compatibility with legacy programs).\n\nIf a running program explicitly enables terminal mode 2027, then `unicode` width will be forced regardless of this configuration.",
        key: "grapheme-width-method",
        name: "Grapheme width calculation method.",
        options: ["unicode", "legacy"],
        type: "dropdown"
    },
    gtkCustomCss: {
        default: "",
        description: "Custom CSS files to be loaded. Can be repeated to load multiple files. Prepend `?` to suppress errors if the file doesn't exist. File size limit per stylesheet: 5MiB.",
        key: "gtk-custom-css",
        name: "Custom css file",
        platform: ["gtk"],
        repeatable: true,
        since: "1.1.0",
        type: "text"
    },
    gtkOpenglDebug: {
        default: false,
        description: "Enable or disable GTK's OpenGL debugging logs. The default is true for debug builds and false for all others.",
        key: "gtk-opengl-debug",
        name: "OpenGL debug",
        platform: ["gtk"],
        since: "1.1.0",
        type: "switch"
    },
    gtkQuickTerminalLayer: {
        default: "top",
        description: "The layer of the quick terminal window.\n\n- `overlay` - In front of all windows\n- `top` - In front of normal windows but behind fullscreen overlays (default)\n- `bottom` - Behind normal windows but in front of wallpapers\n- `background` - Behind all windows\n\nGTK Wayland only.",
        key: "gtk-quick-terminal-layer",
        name: "Quick terminal layer",
        note: "Controls which layer the quick terminal appears on. GTK Wayland only.",
        options: ["overlay", "top", "bottom", "background"],
        platform: ["gtk-wayland"],
        since: "1.2.0",
        type: "dropdown"
    },
    gtkQuickTerminalNamespace: {
        default: "ghostty-quick-terminal",
        description: "The namespace (identifier) for the quick terminal window used by the Wayland compositor and/or scripts to determine the type of layer surfaces.\n\nGTK Wayland only.",
        key: "gtk-quick-terminal-namespace",
        name: "Quick terminal namespace",
        note: "Identifier for the quick terminal layer surface. GTK Wayland only.",
        platform: ["gtk-wayland"],
        since: "1.2.0",
        size: 18,
        type: "text"
    },
    gtkSingleInstance: {
        default: "detect",
        description: "Controls whether the Ghostty GTK application runs in single-instance mode.\n\n- `true` - Single instance mode: new processes create windows in the existing instance\n- `false` - Each new process launches a separate application\n- `detect` - Assume single-instance unless TERM_PROGRAM is set or CLI args exist (default)\n\nNote: debug builds have a separate single-instance ID to avoid conflicting with release builds.",
        key: "gtk-single-instance",
        name: "Single-instance mode",
        options: ["detect", "true", "false"],
        platform: ["gtk"],
        type: "dropdown"
    },
    gtkTabsLocation: {
        default: "top",
        description: "Determines the side of the screen that the GTK tab bar will stick to. When `hidden`, a tab button displaying the number of tabs appears in the title bar.",
        key: "gtk-tabs-location",
        name: "Tab location",
        options: ["top", "bottom"],
        platform: ["gtk"],
        type: "dropdown"
    },
    gtkTitlebar: {
        default: true,
        description: "When enabled, the full GTK titlebar is displayed instead of your window manager's simple titlebar. Has no effect when `window-decoration` is none or when running under macOS.",
        key: "gtk-titlebar",
        name: "Show titlebar",
        platform: ["gtk"],
        type: "switch"
    },
    gtkTitlebarHideWhenMaximized: {
        default: false,
        description: "If true, the titlebar will be hidden when the window is maximized, and shown when unmaximized. GTK only.",
        key: "gtk-titlebar-hide-when-maximized",
        name: "Hide titlebar on maximize",
        platform: ["gtk"],
        since: "1.1.0",
        type: "switch"
    },
    gtkTitlebarStyle: {
        default: "native",
        description: "The style of the GTK titlebar.\n\n- `native` - Traditional titlebar with title, buttons, and window controls. Tab bar appears below when multiple tabs are open.\n- `tabs` - Merges the tab bar and titlebar to save vertical space. Cannot drag the window by tab titles.",
        key: "gtk-titlebar-style",
        name: "Titlebar style",
        note: "<code>tabs</code> merges the tab bar and titlebar to save vertical space.",
        options: ["native", "tabs"],
        platform: ["gtk"],
        type: "dropdown"
    },
    gtkToolbarStyle: {
        default: "raised",
        description: "Determines the appearance of the top and bottom bars in the GTK terminal.\n\n- `flat` - Top and bottom bars are flat with the terminal window\n- `raised` - Top and bottom bars cast a shadow on the terminal area\n- `raised-border` - Like `raised` but the shadow is replaced with a subtle border",
        key: "gtk-toolbar-style",
        name: "Toolbar style",
        options: ["raised", "flat", "raised-border"],
        platform: ["gtk"],
        type: "dropdown"
    },
    gtkWideTabs: {
        default: true,
        description: "If true (default), GTK tabs will be 'wide' (fill available space, GNOME style). If false, tabs only take up space they need.",
        key: "gtk-wide-tabs",
        name: "Use wide tabs",
        note: "Setting this to <code>false</code> will make tabs use the least space necessary.",
        platform: ["gtk"],
        type: "switch"
    },
    imageStorageLimit: {
        default: 320000000,
        description: "The total amount of bytes that can be used for image data (e.g. the Kitty image protocol) per terminal screen. Maximum value is 4,294,967,295 (4GiB). Default is 320MB. If set to zero, all image protocols are disabled. Separate for primary and alternate screens.",
        key: "image-storage-limit",
        max: 4294967295,
        min: 0,
        name: "Image buffer limit (bytes)",
        size: 12,
        type: "number"
    },
    initialCommand: {
        default: "",
        description: "Same as `command`, but only applies to the first terminal surface created when Ghostty starts. Can also be set with the `-e` CLI flag (e.g. `ghostty -e fish --with --custom --args`).",
        key: "initial-command",
        name: "Command to run on first launch",
        note: "Unlike the previous setting, this will only run once in the lifetime of the app.",
        type: "text"
    },
    initialWindow: {
        default: true,
        description: "Controls whether an initial window is created when Ghostty is run. Only implemented on Linux and macOS.",
        key: "initial-window",
        name: "Show a window on startup",
        type: "switch"
    },
    input: {
        default: "",
        description: "Data to send as input to the command on startup. Formats:\n- `raw:<string>` - Send raw text (Zig string literal syntax)\n- `path:<path>` - Read a file and send its contents (max 10MB)\n- Bare value is treated as `raw:`\n\nCan be repeated; data is concatenated directly.",
        key: "input",
        name: "Initial input",
        note: "Input for tty launch. Can be raw text, zig string literal, or path:/to/file.",
        repeatable: true,
        since: "1.2.0",
        type: "text"
    },
    keybind: {
        default: [
            "super+page_up=scroll_page_up",
            "super+ctrl+equal=equalize_splits",
            "super+physical:four=goto_tab:4",
            "super+shift+arrow_down=jump_to_prompt:1",
            "super+shift+w=close_window",
            "super+shift+bracket_left=previous_tab",
            "super+backspace=text:\\x15",
            "super+alt+w=close_tab",
            "super+w=close_surface",
            "super+alt+i=inspector:toggle",
            "super+physical:eight=goto_tab:8",
            "super+alt+arrow_right=goto_split:right",
            "shift+arrow_up=adjust_selection:up",
            "super+arrow_down=jump_to_prompt:1",
            "super+enter=toggle_fullscreen",
            "super+t=new_tab",
            "super+c=copy_to_clipboard",
            "super+shift+bracket_right=next_tab",
            "super+physical:one=goto_tab:1",
            "shift+arrow_left=adjust_selection:left",
            "super+equal=increase_font_size:1",
            "shift+page_up=adjust_selection:page_up",
            "super+physical:three=goto_tab:3",
            "super+arrow_right=text:\\x05",
            "super+d=new_split:right",
            "super+ctrl+arrow_down=resize_split:down,10",
            "shift+end=adjust_selection:end",
            "super++=increase_font_size:1",
            "super+q=quit",
            "super+home=scroll_to_top",
            "super+ctrl+arrow_left=resize_split:left,10",
            "alt+arrow_left=esc:b",
            "super+ctrl+arrow_up=resize_split:up,10",
            "super+arrow_left=text:\\x01",
            "super+shift+arrow_up=jump_to_prompt:-1",
            "shift+arrow_right=adjust_selection:right",
            "super+comma=open_config",
            "super+shift+comma=reload_config",
            "super+minus=decrease_font_size:1",
            "shift+page_down=adjust_selection:page_down",
            "ctrl+tab=next_tab",
            "super+a=select_all",
            "alt+arrow_right=esc:f",
            "super+shift+enter=toggle_split_zoom",
            "super+alt+arrow_down=goto_split:down",
            "super+ctrl+f=toggle_fullscreen",
            "super+ctrl+arrow_right=resize_split:right,10",
            "super+alt+shift+j=write_screen_file:open",
            "shift+arrow_down=adjust_selection:down",
            "ctrl+shift+tab=previous_tab",
            "super+n=new_window",
            "super+alt+arrow_left=goto_split:left",
            "super+page_down=scroll_page_down",
            "super+alt+shift+w=close_all_windows",
            "super+alt+arrow_up=goto_split:up",
            "super+shift+v=paste_from_selection",
            "super+bracket_left=goto_split:previous",
            "super+physical:nine=last_tab",
            "super+bracket_right=goto_split:next",
            "super+end=scroll_to_bottom",
            "super+shift+j=write_screen_file:paste",
            "super+shift+d=new_split:down",
            "super+0=reset_font_size",
            "super+physical:five=goto_tab:5",
            "shift+home=adjust_selection:home",
            "super+physical:seven=goto_tab:7",
            "super+arrow_up=jump_to_prompt:-1",
            "super+k=clear_screen",
            "super+physical:two=goto_tab:2",
            "super+physical:six=goto_tab:6",
            "super+v=paste_from_clipboard"
        ],
        description: "Key bindings. Format: `trigger=action`. Duplicate triggers overwrite previous values.\n\nTrigger: `+`-separated list of keys and modifiers (e.g. `ctrl+a`, `ctrl+shift+b`).\n\nPhysical keys can be specified using W3C key codes (e.g. `KeyA`, `key_a`).\n\nSpecial trigger prefix values:\n- `all:` - Apply to all terminal surfaces\n- `global:` - Make keybind global (system-wide)\n- `unconsumed:` - Don't consume the input\n- `performable:` - Only consume if action is performable\n\nSpecial values:\n- `keybind=clear` - Clear all keybindings\n\nChained actions (since 1.3.0): Use `chain=action` as subsequent keybind entries.\n\nKey tables (since 1.3.0): Use `<table>/<binding>` syntax.",
        key: "keybind",
        name: "",
        repeatable: true,
        type: "keybinds"
    },
    language: {
        default: "",
        description: "Set Ghostty's graphical user interface language to a language other than the system default language. The language must be fully specified, including the encoding. For example: `language = de_DE.UTF-8` will force the strings in Ghostty's graphical user interface to be in German rather than the system default.\n\nThis will not affect the language used by programs run within Ghostty. Those will continue to use the default system language.\n\nWarning: This setting cannot be reloaded at runtime. To change the language you must fully restart Ghostty.",
        key: "language",
        name: "UI language",
        note: "Set Ghostty's GTK GUI language (e.g. <code>de</code>, <code>fr</code>). Requires a full restart. GTK only.",
        platform: ["gtk"],
        since: "1.3.0",
        type: "text"
    },
    link: {
        default: "",
        description: "Match a regular expression against the terminal text and associate clicking it with an action. Links configured earlier take precedence. A default link that matches URLs and opens them in the system opener always exists (disable with `link-url`).",
        disabled: true,
        key: "link",
        name: "Link handling",
        note: "Regex for making clickable links, currently disabled.",
        repeatable: true,
        type: "text"
    },
    linkPreviews: {
        default: "true",
        description: "Show link previews for a matched URL.\n\n- `true` - Show previews for all matched URLs\n- `false` - Never show link previews\n- `osc8` - Only show previews for OSC 8 hyperlinks (where link text can differ from destination)",
        key: "link-previews",
        name: "Show link previews",
        note: "When set to <code>osc8</code>, previews are only shown for hyperlinks created with the OSC 8 sequence.",
        options: ["true", "false", "osc8"],
        since: "1.2.0",
        type: "dropdown"
    },
    linkUrl: {
        default: true,
        description: "Enable URL matching. URLs are matched on hover with control (Linux) or command (macOS) pressed and open using the default system application. The URL matcher is always lowest priority of any configured links.",
        key: "link-url",
        name: "Automatically link URLs",
        note: "Matching occurs while holding the control (Linux) or command (macOS) key.",
        type: "switch"
    },
    linuxCgroup: {
        default: "single-instance",
        description: "Put every surface (tab, split, window) into a transient systemd scope for per-surface resource management.\n\n- `never` - Never use cgroups\n- `always` - Always use cgroups\n- `single-instance` - Enable cgroups only for Ghostty instances launched as single-instance applications (default on Linux)\n\nRequires systemd. Causes slightly slower startup. Changes not reflected in existing surfaces.",
        key: "linux-cgroup",
        name: "Use dedicated cgroups",
        options: ["single-instance", "always", "never"],
        platform: ["linux"],
        type: "dropdown"
    },
    linuxCgroupHardFail: {
        default: false,
        description: "If false, creating a transient systemd scope will be allowed to fail silently. If true, any transient systemd scope creation failure will cause surface creation to fail.",
        key: "linux-cgroup-hard-fail",
        name: "Hard fail on startup",
        platform: ["linux"],
        type: "switch"
    },
    linuxCgroupMemoryLimit: {
        default: undefined,
        description: "Memory limit in bytes for any individual terminal process (tab, split, window). If unset, no limit is set. Sets the `MemoryHigh` setting on the transient systemd scope (soft limit). Changes not reflected in existing surfaces.",
        key: "linux-cgroup-memory-limit",
        max: 4294967295,
        min: 0,
        name: "Memory limit (bytes)",
        platform: ["linux"],
        size: 12,
        type: "number"
    },
    linuxCgroupProcessesLimit: {
        default: undefined,
        description: "Number of processes limit for any individual terminal process (tab, split, window). If unset, no limit is set. Sets the `TasksMax` setting (hard limit). Changes not reflected in existing surfaces.",
        key: "linux-cgroup-processes-limit",
        min: 0,
        name: "Max number of processes",
        platform: ["linux"],
        size: 5,
        type: "number"
    },
    macosApplescript: {
        default: true,
        description: "If true (default), Ghostty exposes and handles the built-in AppleScript dictionary on macOS. If false, all AppleScript interactions are disabled, including AppleScript commands and object lookup for windows, tabs, and terminals.",
        key: "macos-applescript",
        name: "Enable AppleScript support",
        note: "If disabled, all AppleScript interactions with Ghostty are turned off.",
        platform: ["macos"],
        type: "switch"
    },
    macosAutoSecureInput: {
        default: true,
        description: "If true, Ghostty on macOS will automatically enable Secure Input when it detects a password prompt. Secure Input prevents applications from reading keyboard events. Note that automatic detection is based on heuristics and may not work over SSH.",
        key: "macos-auto-secure-input",
        name: "Auto secure input",
        platform: ["macos"],
        type: "switch"
    },
    macosCustomIcon: {
        default: "",
        description: "The absolute path to the custom icon file. Supported formats: PNG, JPEG, ICNS. Defaults to `~/.config/ghostty/Ghostty.icns`. Used when `macos-icon = custom`.",
        key: "macos-custom-icon",
        name: "Icon file",
        note: "Only used when <code>custom</code> is selected above.",
        platform: ["macos"],
        type: "text"
    },
    macosDockDropBehavior: {
        default: "new-tab",
        description: "Controls the windowing behavior when dropping a file or folder onto the Ghostty icon in the macOS dock.\n\n- `new-tab` - Create a new tab in the current window (default)\n- `new-window` - Create a new window unconditionally",
        key: "macos-dock-drop-behavior",
        name: "Dock drop behavior",
        note: "What happens when a file is dropped onto Ghostty's dock icon.",
        options: ["new-tab", "new-window"],
        platform: ["macos"],
        type: "dropdown"
    },
    macosHidden: {
        default: "never",
        description: "Control whether the macOS app is excluded from the dock and app switcher. Mainly intended for those primarily using quick-terminal mode.\n\n- `never` - App is never hidden (default)\n- `always` - App is always hidden\n\nNote: When hidden, keyboard layout changes will not be automatic.",
        key: "macos-hidden",
        name: "Hide from dock and switcher",
        options: ["never", "always"],
        platform: ["macos"],
        since: "1.2.0",
        type: "dropdown"
    },
    macosIcon: {
        default: "official",
        description: "Customize the macOS app icon (affects dock, application switcher, etc.).\n\n- `official` - Official Ghostty icon\n- `blueprint`, `chalkboard`, `microchip`, `glass`, `holographic`, `paper`, `retro`, `xray` - Official icon variants\n- `custom` - Completely custom icon (set path with `macos-custom-icon`)\n- `custom-style` - Official icon with custom styles (requires `macos-icon-ghost-color` and `macos-icon-screen-color`)",
        key: "macos-icon",
        name: "Icon",
        note: "Custom style must specify both ghost and screen colors.",
        options: [] as DropdownOption[],
        platform: ["macos"],
        type: "dropdown"
    },
    macosIconFrame: {
        default: "aluminum",
        description: "The material to use for the frame of the macOS app icon. Required when `macos-icon = custom-style`.\n\n- `aluminum` - Brushed aluminum frame (default)\n- `beige` - Classic 90's computer beige frame\n- `plastic` - Glossy dark plastic frame\n- `chrome` - Shiny chrome frame",
        key: "macos-icon-frame",
        name: "Icon frame",
        options: [] as DropdownOption[],
        platform: ["macos"],
        type: "dropdown"
    },
    macosIconGhostColor: {
        default: "",
        description: "The color of the ghost in the macOS app icon. Required when `macos-icon = custom-style`. Specified as hex or named X11 color.",
        key: "macos-icon-ghost-color",
        name: "Ghost color",
        platform: ["macos"],
        type: "color"
    },
    macosIconScreenColor: {
        default: "",
        description: "The color(s) of the screen in the macOS app icon. The screen is a linear gradient; specify up to 64 comma-separated colors. First color is the bottom of the gradient, last is the top. Required when `macos-icon = custom-style`.",
        key: "macos-icon-screen-color",
        name: "Screen color",
        platform: ["macos"],
        type: "color"
    },
    macosNonNativeFullscreen: {
        default: "false",
        description: "If not false, fullscreen on macOS will not use native fullscreen but makes the window fullscreen without animations using a new space.\n\nIMPORTANT: Tabs do NOT work in this mode.\n\n- `false` - Use native macOS fullscreen (default)\n- `true` - Non-native fullscreen, hide menu bar\n- `visible-menu` - Non-native fullscreen, keep menu bar visible\n- `padded-notch` - Non-native fullscreen, hide menu bar, pad for notch",
        key: "macos-non-native-fullscreen",
        name: "Use non-native fullscreen",
        note: "Tabs currently do not work with non-native fullscreen windows",
        options: ["visible-menu", "true", "false", "padded-notch"],
        platform: ["macos"],
        type: "dropdown"
    },
    macosOptionAsAlt: {
        allowEmpty: true,
        default: "",
        description: "Changes the behavior of the macOS option key to act as alt.\n\nDefault (unset) depends on keyboard layout: `true` for U.S. Standard/International layouts, `false` otherwise.\n\n- `true` - Option treated as Alt (breaks Unicode input sequences)\n- `false` - Restore macOS Alt key unicode sequences (breaks terminal Alt sequences)\n- `left` - Enable only for left Option key\n- `right` - Enable only for right Option key",
        emptyLabel: "Reset to default",
        key: "macos-option-as-alt",
        name: "Use option key as alt key",
        options: ["true", "false", "left", "right"],
        platform: ["macos"],
        type: "dropdown"
    },
    macosSecureInputIndication: {
        default: true,
        description: "If true, Ghostty will show a graphical indication when secure input is enabled.",
        key: "macos-secure-input-indication",
        name: "Indicate secure input",
        platform: ["macos"],
        type: "switch"
    },
    macosShortcuts: {
        default: "ask",
        description: "Whether macOS Shortcuts are allowed to control Ghostty. Ghostty exposes actions that allow Shortcuts to create terminals, send text, run commands, etc.\n\n- `ask` - Ask the user for permission (remembered, like other macOS permissions) (default)\n- `allow` - Allow without asking\n- `deny` - Deny Shortcuts from controlling Ghostty",
        key: "macos-shortcuts",
        name: "macOS shortcuts",
        note: "Controls whether macOS system shortcuts (e.g. Cmd+Space) can be captured.",
        options: ["allow", "deny", "ask"],
        platform: ["macos"],
        since: "1.2.0",
        type: "dropdown"
    },
    macosTitlebarProxyIcon: {
        default: "visible",
        description: "Whether the proxy icon in the macOS titlebar is visible. The proxy icon represents the folder of the current working directory. Only visible with native macOS titlebar style.",
        key: "macos-titlebar-proxy-icon",
        name: "Titlebar proxy icon",
        options: ["visible", "hidden"],
        platform: ["macos"],
        type: "dropdown"
    },
    macosTitlebarStyle: {
        default: "transparent",
        description: "The style of the macOS titlebar.\n\n- `native` - Standard native macOS titlebar\n- `transparent` - Native but transparent, shows window background color\n- `tabs` - Custom titlebar that integrates the tab bar (limitations on macOS 13 and below)\n- `hidden` - Hides the titlebar (window frame and rounded corners remain unlike `window-decoration = none`)",
        key: "macos-titlebar-style",
        name: "Titlebar style",
        options: ["transparent", "native", "tabs", "hidden"],
        platform: ["macos"],
        type: "dropdown"
    },
    macosWindowButtons: {
        default: "visible",
        description: "Whether the window buttons (traffic lights) in the macOS titlebar are visible.\n\n- `visible` - Show the window buttons (default)\n- `hidden` - Hide the window buttons\n\nNo effect when `window-decoration = none` or `macos-titlebar-style = hidden`.",
        key: "macos-window-buttons",
        name: "Window buttons (traffic lights)",
        options: ["visible", "hidden"],
        platform: ["macos"],
        since: "1.2.0",
        type: "dropdown"
    },
    macosWindowShadow: {
        default: true,
        description: "Whether to enable the macOS window shadow. With some window managers and window transparency settings, you may find false more visually appealing.",
        key: "macos-window-shadow",
        name: "Show the window shadow",
        platform: ["macos"],
        type: "switch"
    },
    maximize: {
        default: false,
        description: "Whether to start the window in a maximized state. Applies to new windows only, not tabs or splits.",
        key: "maximize",
        name: "Launch as maximized window",
        since: "1.1.0",
        type: "switch"
    },
    middleClickAction: {
        default: "primary-paste",
        description: "The action to take when the user middle-clicks on the terminal surface.\n\n- `primary-paste` - Paste from the selection (or system) clipboard per `copy-on-select` (default)\n- `ignore` - Do nothing, ignore the middle click",
        key: "middle-click-action",
        name: "Middle-click action",
        options: ["primary-paste", "ignore"],
        type: "dropdown"
    },
    minimumContrast: {
        default: 1,
        description: "The minimum contrast ratio between the foreground and background colors. A value between 1 and 21. A value of 1 allows no contrast (e.g. black on black). Based on the WCAG 2.0 specification. Does not apply to Emoji or images.",
        key: "minimum-contrast",
        max: 21,
        min: 1,
        name: "Minimum contrast",
        step: 0.1,
        type: "range"
    },
    mouseHideWhileTyping: {
        default: false,
        description: "Hide the mouse immediately when typing. The mouse becomes visible again when it is used (button, movement, etc.).",
        key: "mouse-hide-while-typing",
        name: "Hide mouse while typing",
        type: "switch"
    },
    mouseReporting: {
        default: true,
        description: "Enable or disable mouse reporting. When false, mouse events will not be reported to terminal applications even if they request it. Can be toggled at runtime using the `toggle_mouse_reporting` keybind action.",
        key: "mouse-reporting",
        name: "Allow mouse reporting",
        note: "Allows terminal applications to receive mouse events.",
        type: "switch"
    },
    mouseScrollMultiplier: {
        default: 3,
        description: "Multiplier for scrolling distance with the mouse wheel. Can be prefixed with `precision:` or `discrete:` to set the multiplier only for specific device types, comma-separated. If no prefix is used, the multiplier applies to all devices.\n\nDefault is 3 for discrete devices and 1 for precision devices. Value will be clamped to [0.01, 10000].",
        key: "mouse-scroll-multiplier",
        max: 10,
        min: 0.1,
        name: "Mouse scroll multiplier",
        step: 0.1,
        type: "range"
    },
    mouseShiftCapture: {
        default: "false",
        description: "Determines whether running programs can detect the shift key pressed with a mouse click. Typically, shift extends mouse selection.\n\n- `false` - Shift not sent with mouse protocol, will extend selection. Program can override with XTSHIFTESCAPE.\n- `true` - Shift sent with mouse protocol. Program can override with XTSHIFTESCAPE.\n- `never` - Same as false but program cannot override with XTSHIFTESCAPE.\n- `always` - Same as true but program cannot override with XTSHIFTESCAPE.",
        key: "mouse-shift-capture",
        name: "Allow shift with mouse click",
        options: ["true", "false", "always", "never"],
        type: "dropdown"
    },
    notifyOnCommandFinish: {
        default: "never",
        description: "Controls when command finished notifications are sent. Requires shell integration or OSC 133 escape sequences.\n\n- `never` - Never send notifications (default)\n- `unfocused` - Only when the surface is not focused\n- `always` - Always send notifications",
        key: "notify-on-command-finish",
        name: "Notify on command finish",
        note: "Requires shell integration or OSC 133 escape sequences.",
        options: ["never", "unfocused", "always"],
        since: "1.3.0",
        type: "dropdown"
    },
    notifyOnCommandFinishAction: {
        default: "bell",
        description: "How the user is notified when command finished notifications are enabled. Comma-separated list. Prefix with `no-` to disable.\n\nOptions:\n- `bell` - enabled by default\n- `notify` - disabled by default",
        key: "notify-on-command-finish-action",
        name: "Notification action",
        note: "How the user is notified. Comma-separated list. Available: bell, notify. Prefix with <code>no-</code> to disable.",
        since: "1.3.0",
        type: "text"
    },
    notifyOnCommandFinishAfter: {
        default: "5s",
        description: "How long a command must have been running before a notification will be sent. Default is 5 seconds. Duration format: numbers followed by time units (y, d, h, m, s, ms, us, ns).",
        key: "notify-on-command-finish-after",
        name: "Minimum runtime before notifying",
        note: "How long a command must run before a notification is sent. Format like <code>5s</code>, <code>500ms</code>.",
        since: "1.3.0",
        type: "text"
    },
    oscColorReportFormat: {
        default: "16-bit",
        description: "The reporting format for OSC sequences that request color information (OSC 4, 10, 11).\n\n- `none` - OSC queries receive no reply\n- `8-bit` - Color components returned unscaled (e.g. `rr/gg/bb`)\n- `16-bit` - Color components returned scaled (e.g. `rrrr/gggg/bbbb`) (default)",
        key: "osc-color-report-format",
        name: "OSC color report format",
        options: ["none", "8-bit", "16-bit"],
        type: "dropdown"
    },
    palette: {
        default: ["#1d1f21", "#cc6666", "#b5bd68", "#f0c674", "#81a2be", "#b294bb", "#8abeb7", "#c5c8c6", "#666666", "#d54e53", "#b9ca4a", "#e7c547", "#7aa6da", "#c397d8", "#70c0b1", "#eaeaea", "#000000", "#00005f", "#000087", "#0000af", "#0000d7", "#0000ff", "#005f00", "#005f5f", "#005f87", "#005faf", "#005fd7", "#005fff", "#008700", "#00875f", "#008787", "#0087af", "#0087d7", "#0087ff", "#00af00", "#00af5f", "#00af87", "#00afaf", "#00afd7", "#00afff", "#00d700", "#00d75f", "#00d787", "#00d7af", "#00d7d7", "#00d7ff", "#00ff00", "#00ff5f", "#00ff87", "#00ffaf", "#00ffd7", "#00ffff", "#5f0000", "#5f005f", "#5f0087", "#5f00af", "#5f00d7", "#5f00ff", "#5f5f00", "#5f5f5f", "#5f5f87", "#5f5faf", "#5f5fd7", "#5f5fff", "#5f8700", "#5f875f", "#5f8787", "#5f87af", "#5f87d7", "#5f87ff", "#5faf00", "#5faf5f", "#5faf87", "#5fafaf", "#5fafd7", "#5fafff", "#5fd700", "#5fd75f", "#5fd787", "#5fd7af", "#5fd7d7", "#5fd7ff", "#5fff00", "#5fff5f", "#5fff87", "#5fffaf", "#5fffd7", "#5fffff", "#870000", "#87005f", "#870087", "#8700af", "#8700d7", "#8700ff", "#875f00", "#875f5f", "#875f87", "#875faf", "#875fd7", "#875fff", "#878700", "#87875f", "#878787", "#8787af", "#8787d7", "#8787ff", "#87af00", "#87af5f", "#87af87", "#87afaf", "#87afd7", "#87afff", "#87d700", "#87d75f", "#87d787", "#87d7af", "#87d7d7", "#87d7ff", "#87ff00", "#87ff5f", "#87ff87", "#87ffaf", "#87ffd7", "#87ffff", "#af0000", "#af005f", "#af0087", "#af00af", "#af00d7", "#af00ff", "#af5f00", "#af5f5f", "#af5f87", "#af5faf", "#af5fd7", "#af5fff", "#af8700", "#af875f", "#af8787", "#af87af", "#af87d7", "#af87ff", "#afaf00", "#afaf5f", "#afaf87", "#afafaf", "#afafd7", "#afafff", "#afd700", "#afd75f", "#afd787", "#afd7af", "#afd7d7", "#afd7ff", "#afff00", "#afff5f", "#afff87", "#afffaf", "#afffd7", "#afffff", "#d70000", "#d7005f", "#d70087", "#d700af", "#d700d7", "#d700ff", "#d75f00", "#d75f5f", "#d75f87", "#d75faf", "#d75fd7", "#d75fff", "#d78700", "#d7875f", "#d78787", "#d787af", "#d787d7", "#d787ff", "#d7af00", "#d7af5f", "#d7af87", "#d7afaf", "#d7afd7", "#d7afff", "#d7d700", "#d7d75f", "#d7d787", "#d7d7af", "#d7d7d7", "#d7d7ff", "#d7ff00", "#d7ff5f", "#d7ff87", "#d7ffaf", "#d7ffd7", "#d7ffff", "#ff0000", "#ff005f", "#ff0087", "#ff00af", "#ff00d7", "#ff00ff", "#ff5f00", "#ff5f5f", "#ff5f87", "#ff5faf", "#ff5fd7", "#ff5fff", "#ff8700", "#ff875f", "#ff8787", "#ff87af", "#ff87d7", "#ff87ff", "#ffaf00", "#ffaf5f", "#ffaf87", "#ffafaf", "#ffafd7", "#ffafff", "#ffd700", "#ffd75f", "#ffd787", "#ffd7af", "#ffd7d7", "#ffd7ff", "#ffff00", "#ffff5f", "#ffff87", "#ffffaf", "#ffffd7", "#ffffff", "#080808", "#121212", "#1c1c1c", "#262626", "#303030", "#3a3a3a", "#444444", "#4e4e4e", "#585858", "#626262", "#6c6c6c", "#767676", "#808080", "#8a8a8a", "#949494", "#9e9e9e", "#a8a8a8", "#b2b2b2", "#bcbcbc", "#c6c6c6", "#d0d0d0", "#dadada", "#e4e4e4", "#eeeeee"],
        description: "Color palette for the 256 color form. Syntax: `N=COLOR` where N is 0-255 and COLOR is an RGB color code (`#AABBCC`) or named X11 color. The palette index can be in decimal, binary (0b), octal (0o), or hexadecimal (0x).",
        key: "palette",
        name: "",
        repeatable: true,
        type: "palette"
    },
    paletteGenerate: {
        default: true,
        description: "Whether to automatically generate the extended 256 color palette (indices 16–255) from the base 16 ANSI colors. Colors explicitly set via `palette` are never overwritten.",
        key: "palette-generate",
        name: "Auto-generate missing palette colors",
        note: "When enabled, Ghostty will generate missing colors (indices 16-231) based on the first 16.",
        since: "1.3.0",
        type: "switch"
    },
    paletteHarmonious: {
        default: false,
        description: "Invert the palette colors generated when `palette-generate` is enabled, so that colors go in reverse order. This allows palette-based applications to work well in both light and dark mode. Has no effect if `palette-generate` is disabled.",
        key: "palette-harmonious",
        name: "Harmonious palette generation",
        note: "Inverts generated palette colors. Has no effect if auto-generation is disabled.",
        since: "1.3.0",
        type: "switch"
    },
    progressStyle: {
        default: true,
        description: "If true (default), applications running in the terminal can show graphical progress bars using the ConEmu OSC 9;4 escape sequence. If false, progress bar sequences are silently ignored.",
        key: "progress-style",
        name: "Show progress bars (OSC 9;4)",
        note: "Allows applications to show graphical progress bars via the ConEmu OSC 9;4 escape sequence.",
        type: "switch"
    },
    quickTerminalAnimationDuration: {
        default: 0.2,
        description: "Duration (in seconds) of the quick terminal enter and exit animation. Set to 0 to disable animation completely. Can be changed at runtime. Only implemented on macOS.",
        key: "quick-terminal-animation-duration",
        max: 10,
        min: 0,
        name: "Animation duration",
        note: "Duration of the quick terminal animation in seconds from 0 to 10.",
        platform: ["macos"],
        showLabels: false,
        step: 0.1,
        type: "range"
    },
    quickTerminalAutohide: {
        default: true,
        description: "Automatically hide the quick terminal when focus shifts to another window. Defaults to true on macOS and false on Linux/BSD.\n\nOn Linux, global shortcuts require system configuration and are less accessible, so it's preferable to keep the terminal open.",
        key: "quick-terminal-autohide",
        name: "Autohide",
        note: "This autohides the quick terminal when focus shifts away.",
        type: "switch"
    },
    quickTerminalKeyboardInteractivity: {
        default: "on-demand",
        description: "Determines when the quick terminal receives keyboard input.\n\n- `none` - Will not receive any keyboard input\n- `on-demand` - Only receives keyboard input when focused (default)\n- `exclusive` - Always receives keyboard input, even when another window is focused\n\nOnly has an effect on Linux Wayland. On macOS, behavior is always equivalent to `on-demand`.",
        key: "quick-terminal-keyboard-interactivity",
        name: "Keyboard interactivity",
        note: "Controls when the quick terminal receives keyboard input. GTK Wayland only.",
        options: ["none", "on-demand", "exclusive"],
        platform: ["gtk-wayland"],
        since: "1.2.0",
        type: "dropdown"
    },
    quickTerminalPosition: {
        default: "top",
        description: "The position of the quick terminal window.\n\n- `top` - Terminal appears at the top of the screen\n- `bottom` - Terminal appears at the bottom\n- `left` - Terminal appears at the left\n- `right` - Terminal appears at the right\n- `center` - Terminal appears at the center\n\nOn macOS, changing this requires restarting Ghostty.",
        key: "quick-terminal-position",
        name: "Terminal position",
        options: ["top", "right", "bottom", "left", "center"],
        type: "dropdown"
    },
    quickTerminalScreen: {
        default: "main",
        description: "The screen where the quick terminal should show up.\n\n- `main` - The screen recommended by the OS as the main screen (default)\n- `mouse` - The screen the mouse is currently over\n- `macos-menu-bar` - The screen containing the macOS menu bar\n\nOnly implemented on macOS.",
        key: "quick-terminal-screen",
        name: "Screen location",
        options: ["main", "mouse", "macos-menu-bar"],
        platform: ["macos"],
        type: "dropdown"
    },
    quickTerminalSize: {
        default: "",
        description: "The size of the quick terminal. Can be a percentage (e.g. `50%`) or pixels (e.g. `300px`). A bare value without suffix is a config error.\n\nWhen one size is specified, it affects the primary axis (height for top/bottom, width for left/right). Specify two values comma-separated for both dimensions.\n\nExample: `50%,500px` for a top-positioned terminal = half-screen tall, 500px wide.",
        key: "quick-terminal-size",
        name: "Quick terminal size",
        note: "Specify the size as a percentage (e.g. <code>50%</code>) or in pixels (e.g. <code>800</code>). You can specify two values separated by a comma for width and height.",
        since: "1.2.0",
        type: "text"
    },
    quickTerminalSpaceBehavior: {
        default: "move",
        description: "Behavior of the quick terminal when switching between macOS spaces.\n\n- `move` - Quick terminal moves to the current space (default)\n- `remain` - Quick terminal stays in its original space\n\nOnly implemented on macOS. On Linux, behavior is always equivalent to `move`.",
        key: "quick-terminal-space-behavior",
        name: "macOS space behavior",
        options: ["move", "remain"],
        since: "1.1.0",
        type: "dropdown"
    },
    quitAfterLastWindowClosed: {
        default: false,
        description: "Whether to quit after the last surface is closed. Defaults to false on macOS (standard macOS behavior) and true on Linux. On Linux with this set to true, Ghostty can delay quitting using `quit-after-last-window-closed-delay`.",
        key: "quit-after-last-window-closed",
        name: "Quit after closing last window",
        type: "switch"
    },
    quitAfterLastWindowClosedDelay: {
        default: "",
        description: "Controls how long Ghostty stays running after the last surface is closed. Only has an effect if `quit-after-last-window-closed` is true. Minimum value is 1s. Duration format: numbers followed by time units (y, d, h, m, s, ms, us, ns).\n\nOnly implemented on Linux.",
        key: "quit-after-last-window-closed-delay",
        name: "Delay before auto quitting",
        platform: ["linux"],
        type: "text"
    },
    resizeOverlay: {
        default: "after-first",
        description: "Controls when resize overlays are shown. Resize overlays are a transient popup showing the terminal size while resizing.\n\n- `always` - Always show resize overlays.\n- `never` - Never show resize overlays.\n- `after-first` - Don't show on initial creation, but show on subsequent resizes.",
        key: "resize-overlay",
        name: "Show resize overlays",
        options: ["always", "never", "after-first"],
        type: "dropdown"
    },
    resizeOverlayDuration: {
        default: "750ms",
        description: "If resize overlays are enabled, controls how long the overlay is visible before it is hidden. Default is 750ms. Duration format: numbers followed by time units (y, d, h, m, s, ms, us, ns).",
        key: "resize-overlay-duration",
        name: "Show resize overlay time",
        type: "text"
    },
    resizeOverlayPosition: {
        default: "center",
        description: "If resize overlays are enabled, controls the position of the overlay.",
        key: "resize-overlay-position",
        name: "Resize overlay position",
        options: ["center", "top-left", "top-center", "top-right", "bottom-left", "bottom-center", "bottom-right"],
        type: "dropdown"
    },
    rightClickAction: {
        default: "context-menu",
        description: "The action to take when the user right-clicks on the terminal surface.\n\n- `context-menu` - Show the context menu (default)\n- `paste` - Paste from clipboard\n- `copy` - Copy selected text\n- `copy-or-paste` - Copy if there's a selection, paste otherwise\n- `ignore` - Do nothing",
        key: "right-click-action",
        name: "Right-click action",
        options: ["context-menu", "copy-or-paste", "copy", "paste", "ignore"],
        type: "dropdown"
    },
    scrollToBottom: {
        default: "",
        description: "When to scroll the surface to the bottom. Comma-separated list of options. Prefix with `no-` to disable.\n\nOptions:\n- `keystroke` - Scroll to bottom when a key is pressed that sends data to the PTY (default: on)\n- `output` - Scroll to bottom when new data is displayed (default: off)",
        key: "scroll-to-bottom",
        name: "Scroll to bottom on",
        note: "Comma-separated list. Available values: keystroke, output.",
        type: "text"
    },
    scrollbackLimit: {
        default: 10000000,
        description: "The size of the scrollback buffer in bytes. This also includes the active screen. When the limit is reached, the oldest lines are removed. Scrollback exists completely in memory. Allocated lazily. Per terminal surface, not for the entire application.",
        key: "scrollback-limit",
        min: 0,
        name: "Scrollback buffer size (bytes)",
        note: "This buffer exists completely in memory but is allocated lazily.",
        size: 10,
        type: "number"
    },
    scrollbar: {
        default: "system",
        description: "Control when the scrollbar is shown.\n\n- `system` - Respect the system settings for when to show scrollbars.\n- `never` - Never show a scrollbar.\n\nCurrently only supported on macOS. GTK doesn't yet support scrollbars.",
        key: "scrollbar",
        name: "Scrollbar visibility",
        note: "Currently only supported on macOS.",
        options: ["system", "never"],
        platform: ["macos"],
        type: "dropdown"
    },
    searchBackground: {
        default: "",
        description: "Background color for non-focused (candidate) search matches. Valid values: hex, named X11 color, `cell-foreground`, or `cell-background`. Default is golden yellow.",
        key: "search-background",
        name: "Search match background",
        note: "Background color for non-focused (candidate) search matches. Defaults to golden yellow (#ffe082). Also accepts `cell-foreground` or `cell-background`.",
        type: "color"
    },
    searchForeground: {
        default: "",
        description: "Foreground color for non-focused (candidate) search matches. Valid values: hex, named X11 color, `cell-foreground`, or `cell-background`. Default is black.",
        key: "search-foreground",
        name: "Search match foreground",
        note: "Foreground color for non-focused (candidate) search matches. Also accepts `cell-foreground` or `cell-background`.",
        type: "color"
    },
    searchSelectedBackground: {
        default: "",
        description: "Background color for the currently selected (focused) search match. Default is soft peach.",
        key: "search-selected-background",
        name: "Selected match background",
        note: "Background color for the active/focused search match. Defaults to soft peach (#f2a57e).",
        type: "color"
    },
    searchSelectedForeground: {
        default: "",
        description: "Foreground color for the currently selected (focused) search match. Default is black.",
        key: "search-selected-foreground",
        name: "Selected match foreground",
        note: "Foreground color for the active/focused search match.",
        type: "color"
    },
    selectionBackground: {
        default: "",
        description: "Background color for selection. If not set, the selection color is the inverted window background/foreground. Specified as hex or named X11 color. Since 1.2.0, can be set to `cell-foreground` or `cell-background`.",
        key: "selection-background",
        name: "Selection background color",
        type: "color"
    },
    selectionClearOnCopy: {
        default: false,
        description: "Whether to clear selected text after copying. When true, the selection will be automatically cleared after any `copy_to_clipboard` keyboard binding. Does not apply to `copy-on-select` copies.",
        key: "selection-clear-on-copy",
        name: "Clear selection on copy",
        type: "switch"
    },
    selectionClearOnTyping: {
        default: true,
        description: "Whether to clear selected text when typing. If false, the selected text will not be cleared when typing. Selection can still be manually cleared by clicking once or pressing `escape`.",
        key: "selection-clear-on-typing",
        name: "Clear selection on typing",
        since: "1.2.0",
        type: "switch"
    },
    selectionForeground: {
        default: "",
        description: "Foreground color for selection. If not set, the selection color is the inverted window background/foreground. Specified as hex or named X11 color. Since 1.2.0, can be set to `cell-foreground` or `cell-background`.",
        key: "selection-foreground",
        name: "Selection foreground color",
        type: "color"
    },
    selectionWordChars: {
        default: "",
        description: "Characters that mark word boundaries during text selection (e.g. double-clicking). When selecting a word, the selection will stop at any of these characters.\n\nEach character becomes a word boundary. The null character (U+0000) is always treated as a boundary.",
        key: "selection-word-chars",
        name: "Word selection characters",
        note: "Characters that are considered part of a word for double-click selection.",
        since: "1.3.0",
        type: "text"
    },
    shellIntegration: {
        default: "detect",
        description: "Whether to enable shell integration auto-injection.\n\n- `none` - Disable shell integration\n- `detect` - Auto-detect the shell and inject if supported (default)\n- `bash`, `elvish`, `fish`, `nushell`, `zsh` - Use a specific shell integration scheme",
        key: "shell-integration",
        name: "Shell integration style",
        options: ["none", "detect", "bash", "elvish", "fish", "nushell", "zsh"],
        type: "dropdown"
    },
    shellIntegrationFeatures: {
        default: "cursor,no-sudo,title,no-ssh-env,no-ssh-terminfo,path",
        description: "Shell integration features to enable. Comma-separated list. Prefix with `no-` to disable. Use `true`/`false` to turn all features on or off.\n\nFeatures:\n- `cursor` - Set cursor to bar at prompt (default: on)\n- `sudo` - Set sudo wrapper to preserve terminfo (default: off)\n- `title` - Set window title via shell integration (default: on)\n- `ssh-env` - SSH environment variable compatibility: converts TERM to xterm-256color and propagates COLORTERM (default: off, since 1.2.0)\n- `ssh-terminfo` - Automatic terminfo installation on remote hosts (default: off, since 1.2.0)\n- `path` - Add Ghostty's binary directory to PATH (default: on)",
        key: "shell-integration-features",
        name: "Shell integration features",
        note: "Available features: cursor, sudo, title, ssh-env, ssh-terminfo, path. Including one force enables it, prefixing it with <code>no-</code> force disables it, omitting it falls back to default.",
        type: "text"
    },
    splitDividerColor: {
        default: "",
        description: "The color of the split divider. If not set, a default will be chosen. Specified as hex or named X11 color.",
        key: "split-divider-color",
        name: "Split divider color",
        since: "1.1.0",
        type: "color"
    },
    splitInheritWorkingDirectory: {
        default: true,
        description: "If true, new split panes will inherit the working directory of the previously focused split. If no split was previously focused, the `working-directory` option is used.",
        key: "split-inherit-working-directory",
        name: "Splits inherit working directory",
        type: "switch"
    },
    splitPreserveZoom: {
        default: false,
        description: "Control when Ghostty preserves a zoomed split. Normally, any operation that changes focus or layout of the split tree will unzoom any zoomed split.\n\nSet to `navigation` to preserve the zoomed split state when navigating to another split (e.g. via `goto_split`). Prefix with `no-` to disable.\n\nExample: `split-preserve-zoom = navigation`",
        key: "split-preserve-zoom",
        name: "Split preserve zoom on navigation",
        note: "When navigating between splits, keep the zoomed state.",
        since: "1.3.0",
        type: "switch"
    },
    tabInheritWorkingDirectory: {
        default: true,
        description: "If true, new tabs will inherit the working directory of the previously focused tab. If no tab was previously focused, the `working-directory` option is used.",
        key: "tab-inherit-working-directory",
        name: "Tabs inherit working directory",
        type: "switch"
    },
    term: {
        default: "xterm-ghostty",
        description: "The value to set for the TERM environment variable.",
        key: "term",
        name: "TERM environment variable",
        type: "text"
    },
    theme: {
        default: "",
        description: "A theme to use. Can be a built-in theme name, custom theme name, or absolute path to a custom theme file.\n\nTo specify different themes for light/dark mode: `light:theme-name,dark:theme-name`.\n\nTo see available themes, run `ghostty +list-themes`.",
        key: "theme",
        name: "Color theme",
        note: "Any colors selected after setting this will overwrite the theme's colors.",
        options: [] as string[],
        type: "theme"
    },
    title: {
        default: "",
        description: "The title Ghostty will use for the window. Forces the title at all times; Ghostty will ignore set title escape sequences from programs. For a blank title, set to one or more spaces (quoted).",
        key: "title",
        name: "Static title for all windows",
        type: "text"
    },
    titleReport: {
        default: false,
        description: "Enables or disables title reporting (CSI 21 t). Allows the running program to query the terminal title.\n\nWARNING: This can expose sensitive information at best and enable arbitrary code execution at worst.",
        key: "title-report",
        name: "CSI 21 title reporting",
        note: "This allows running apps to read the terminal title.",
        since: "1.0.1",
        type: "switch"
    },
    undoTimeout: {
        default: "",
        description: "The duration that undo operations remain available. Default is 5 seconds. Duration format: numbers followed by time units (y, d, h, m, s, ms, us, ns).\n\nA timeout of zero effectively disables undo. Only supported on macOS.",
        key: "undo-timeout",
        name: "Undo timeout",
        note: "Timeout for undo operations. Format like <code>1h30m</code>, <code>5s</code>, <code>500ms</code>.",
        platform: ["macos"],
        since: "1.2.0",
        type: "text"
    },
    unfocusedSplitFill: {
        default: "",
        description: "The color to dim the unfocused split. Unfocused splits are dimmed by rendering a semi-transparent rectangle over the split. Defaults to the background color. Specified as hex or named X11 color.",
        key: "unfocused-split-fill",
        name: "Unfocused split fill color",
        type: "color"
    },
    unfocusedSplitOpacity: {
        default: 0.7,
        description: "The opacity level of an unfocused split. Unfocused splits are slightly faded out to make it easier to see which split is focused. To disable this feature, set to 1. Clamped to [0.15, 1].",
        key: "unfocused-split-opacity",
        max: 1,
        min: 0.15,
        name: "Unfocused split opacity",
        step: 0.01,
        type: "range"
    },
    vtKamAllowed: {
        default: false,
        description: "If true, allows the 'KAM' mode (ANSI mode 2) to be used within the terminal. KAM disables keyboard input at the request of the application. Not common and not recommended.",
        key: "vt-kam-allowed",
        name: "VT kam mode allowed",
        note: "If you don't know what this is, don't touch it!",
        type: "switch"
    },
    waitAfterCommand: {
        default: false,
        description: "If true, keep the terminal open after the command exits until any keypress is received. Primarily useful for scripts or debugging.",
        key: "wait-after-command",
        name: "Wait for input after command",
        type: "switch"
    },
    windowColorspace: {
        default: "srgb",
        description: "The color space to use when interpreting terminal colors.\n\n- `srgb` - Interpret colors in the sRGB color space (default).\n- `display-p3` - Interpret colors in the Display P3 color space.\n\nCurrently only supported on macOS.",
        key: "window-colorspace",
        name: "Window colorspace",
        options: ["srgb", "display-p3"],
        platform: ["macos"],
        type: "dropdown"
    },
    windowDecoration: {
        default: "auto",
        description: "Configure a preference for window decorations.\n\n- `none` - Disable all window decorations (titlebar, borders). On macOS, disables tabs.\n- `auto` - Automatically use client-side or server-side decorations based on OS/DE.\n- `client` - Prefer client-side decorations. (since 1.1.0)\n- `server` - Prefer server-side decorations (Linux GTK only). (since 1.1.0)\n\nAlso accepts boolean `true` (= auto) and `false` (= none).",
        key: "window-decoration",
        name: "Window decorations",
        options: ["auto", "none", "client", "server"],
        type: "dropdown"
    },
    windowHeight: {
        default: undefined,
        description: "The initial window height in terminal grid cells. Both `window-height` and `window-width` must be set to take effect. Values smaller than 4 are not allowed. Setting to 0 uses the app runtime default.",
        key: "window-height",
        min: 4,
        name: "Initial window height",
        note: "This size is not in pixels but in number of terminal grid cells",
        placeholder: "e.g. 24",
        size: 4,
        step: 1,
        type: "number"
    },
    windowInheritFontSize: {
        default: true,
        description: "If true, new windows and tabs will inherit the font size of the previously focused window. If false, the default font size from `font-size` is used.",
        key: "window-inherit-font-size",
        name: "Inherit font size",
        type: "switch"
    },
    windowInheritWorkingDirectory: {
        default: true,
        description: "If true, new windows will inherit the working directory of the previously focused window. If no window was previously focused, the `working-directory` option is used.",
        key: "window-inherit-working-directory",
        name: "Inherit working directory",
        type: "switch"
    },
    windowNewTabPosition: {
        default: "current",
        description: "The position where new tabs are created.\n\n- `current` - Insert after the currently focused tab, or at the end if no focused tabs.\n- `end` - Insert at the end of the tab list.",
        key: "window-new-tab-position",
        name: "New tab position",
        options: ["current", "end"],
        type: "dropdown"
    },
    windowPaddingBalance: {
        default: false,
        description: "If true, extra padding from viewport not divisible by cell size is automatically balanced between all four edges. The other `window-padding` options are applied first.",
        key: "window-padding-balance",
        name: "Auto-balance window padding",
        type: "switch"
    },
    windowPaddingColor: {
        default: "background",
        description: "The color of the padding area of the window.\n\n- `background` - The background color specified in `background`\n- `extend` - Extend the background color of the nearest grid cell (with heuristics)\n- `extend-always` - Same as `extend` but always extends without applying heuristics",
        key: "window-padding-color",
        name: "Window padding color",
        options: ["background", "extend", "extend-always"],
        type: "dropdown"
    },
    windowPaddingX: {
        default: "2",
        description: "Horizontal window padding between terminal cells and left/right window borders. Value is in points (scaled for DPI). Can specify two comma-separated values for different left/right padding: `window-padding-x = 2,4`.",
        key: "window-padding-x",
        name: "Horizontal window padding",
        type: "text"
    },
    windowPaddingY: {
        default: "2",
        description: "Vertical window padding between terminal cells and top/bottom window borders. Value is in points (scaled for DPI). Can specify two comma-separated values for different top/bottom padding: `window-padding-y = 2,4`.",
        key: "window-padding-y",
        name: "Vertical window padding",
        type: "text"
    },
    windowPositionX: {
        default: 0,
        description: "The starting window X position in pixels, relative to the top-left corner of the primary monitor. Both x and y must be set to take effect. Note: only supported on macOS; GTK does not support setting window position.",
        key: "window-position-x",
        min: 0,
        name: "Initial window X",
        note: "Relative to the top left pixel of the screen",
        placeholder: "e.g. 0",
        platform: ["macos"],
        size: 4,
        step: 1,
        type: "number"
    },
    windowPositionY: {
        default: 0,
        description: "The starting window Y position in pixels, relative to the top-left corner of the primary monitor. On macOS, relative to the top-left of the visible screen area. Both x and y must be set to take effect.",
        key: "window-position-y",
        min: 0,
        name: "Initial window Y",
        note: "Relative to the top left pixel of the screen",
        placeholder: "e.g. 0",
        platform: ["macos"],
        size: 4,
        step: 1,
        type: "number"
    },
    windowSaveState: {
        default: "default",
        description: "Whether to enable saving and restoring window state (position, size, tabs, splits, etc.).\n\n- `default` - Use the default system behavior (macOS: only if forcibly terminated or configured system-wide).\n- `never` - Never save window state.\n- `always` - Always save window state on exit.\n\nCurrently only supported on macOS.",
        key: "window-save-state",
        name: "Save window state",
        options: ["default", "never", "always"],
        platform: ["macos"],
        type: "dropdown"
    },
    windowShowTabBar: {
        default: "auto",
        description: "Whether to show the tab bar.\n\n- `always` - Always display the tab bar, even with only one tab. (since 1.2.0)\n- `auto` - Show the tab bar only when there are two or more tabs.\n- `never` - Never show the tab bar. Tabs accessible via tab overview or keybinds.\n\nCurrently only supported on Linux (GTK).",
        key: "window-show-tab-bar",
        name: "Show tab bar",
        options: ["always", "auto", "never"],
        platform: ["gtk"],
        type: "dropdown"
    },
    windowStepResize: {
        default: false,
        description: "Resize the window in discrete increments of the focused surface's cell size. If disabled, surfaces are resized in pixel increments. Currently only supported on macOS.",
        key: "window-step-resize",
        name: "Resize in grid cell increments",
        platform: ["macos"],
        type: "switch"
    },
    windowSubtitle: {
        default: "false",
        description: "The text displayed in the subtitle of the window.\n\n- `false` - Disable the subtitle\n- `working-directory` - Set the subtitle to the working directory\n\nOnly supported on GTK.",
        key: "window-subtitle",
        name: "Window subtitle",
        options: ["false", "working-directory"],
        platform: ["gtk"],
        since: "1.1.0",
        type: "dropdown"
    },
    windowTheme: {
        default: "auto",
        description: "The theme to use for the windows.\n\n- `auto` - Determine based on terminal background color. If theme has separate light/dark themes, behaves as `system`.\n- `system` - Use the system theme.\n- `light` - Use the light theme regardless of system theme.\n- `dark` - Use the dark theme regardless of system theme.\n- `ghostty` - Use the background/foreground colors from Ghostty configuration (Linux builds only).\n\nCurrently only supported on macOS and Linux.",
        key: "window-theme",
        name: "Window theme",
        options: ["auto", "system", "light", "dark", "ghostty"],
        type: "dropdown"
    },
    windowTitleFontFamily: {
        default: "",
        description: "The font that will be used for the application's window and tab titles. If unset, the system default font is used. Does not need to be a fixed-width font.",
        key: "window-title-font-family",
        name: "Window title font",
        since: "1.0.0",
        type: "text"
    },
    windowTitlebarBackground: {
        default: "",
        description: "Background color for the window titlebar. Only takes effect if `window-theme` is set to `ghostty`. Currently only supported in the GTK app runtime. Specified as hex or named X11 color.",
        key: "window-titlebar-background",
        name: "Titlebar background",
        platform: ["gtk"],
        type: "color"
    },
    windowTitlebarForeground: {
        default: "",
        description: "Foreground color for the window titlebar. Only takes effect if `window-theme` is set to `ghostty`. Currently only supported in the GTK app runtime. Specified as hex or named X11 color.",
        key: "window-titlebar-foreground",
        name: "Titlebar foreground",
        platform: ["gtk"],
        type: "color"
    },
    windowVsync: {
        default: true,
        description: "Synchronize rendering with the screen refresh rate. If true, minimizes tearing and aligns redraws with the screen but may cause input latency. Defaults to true because out-of-sync rendering on macOS can cause kernel panics (macOS 14.4+). Currently only supported on macOS.",
        key: "window-vsync",
        name: "Enable vsync",
        platform: ["macos"],
        type: "switch"
    },
    windowWidth: {
        default: undefined,
        description: "The initial window width in terminal grid cells. Both `window-height` and `window-width` must be set to take effect. Values smaller than 10 are not allowed. Setting to 0 uses the app runtime default.",
        key: "window-width",
        min: 10,
        name: "Initial window width",
        note: "This size is not in pixels but in number of terminal grid cells",
        placeholder: "e.g. 80",
        size: 4,
        step: 1,
        type: "number"
    },
    workingDirectory: {
        default: "",
        description: "The directory to change to after starting the command. Secondary to `window-inherit-working-directory`. Special values:\n- `home` - The home directory\n- `inherit` - The working directory of the launching process\n\nOn macOS, if launched from launchd/open, defaults to `home`. On GTK, if launched from a desktop launcher, defaults to `home`.",
        key: "working-directory",
        name: "Directory to use after startup",
        note: "Special values of <code>home</code> and <code>inherit</code> are also allowed here.",
        type: "text"
    },
    x11InstanceName: {
        default: "",
        description: "Controls the instance name field of the WM_CLASS X11 property when running under X11. Default is `ghostty`.",
        key: "x11-instance-name",
        name: "WM_CLASS instance name",
        note: "This defaults to <code>ghostty</code>",
        platform: ["gtk-x11"],
        type: "text"
    }
} satisfies SettingsRegistry;


export type SettingSchema = typeof registry;

export type SettingKeys = keyof typeof registry;

export type SettingDefaults = {
    [K in SettingKeys]: typeof registry[K]["default"]
};

export type SettingValues = {
    [K in SettingKeys]: TypeToValue<typeof registry[K]["type"]>;
};