/**
 * Ghostty Configuration Reference Schema
 *
 * AUTO-GENERATED — do not edit manually.
 * Generated from: https://github.com/ghostty-org/ghostty/blob/main/src/config/Config.zig
 *
 * To regenerate, run:
 *   bun run scripts/generate-ghostty-schema.ts
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
    | "alpha-blending"
    | "app-notifications"
    | "background-blur"
    | "bell-features"
    | "bold-color"
    | "bool"
    | "clipboard-codepoint-map"
    | "codepoint-map"
    | "color"
    | "color-list"
    | "command"
    | "command-palette-entry"
    | "duration"
    | "enum"
    | "float"
    | "font-shaping-break"
    | "font-style"
    | "font-synthetic-style"
    | "font-variation"
    | "freetype-load-flags"
    | "int"
    | "key-remap"
    | "keybinds"
    | "link"
    | "metric-modifier"
    | "mouse-scroll-multiplier"
    | "notify-on-command-finish-action"
    | "palette"
    | "path"
    | "quick-terminal-size"
    | "readable-io"
    | "scroll-to-bottom"
    | "selection-word-chars"
    | "shell-integration-features"
    | "split-preserve-zoom"
    | "string"
    | "terminal-color"
    | "theme"
    | "uint"
    | "window-padding";

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
    {
        key: "language",
        type: "string",
        default: undefined,
        description: ``,
    },
    {
        key: "font-family",
        type: "string",
        default: undefined,
        description: `The font families to use.

You can generate the list of valid values using the CLI:

    ghostty +list-fonts

This configuration can be repeated multiple times to specify preferred
fallback fonts when the requested codepoint is not available in the primary
font. This is particularly useful for multiple languages, symbolic fonts,
etc.

Notes on emoji specifically: On macOS, Ghostty by default will always use
Apple Color Emoji and on Linux will always use Noto Emoji. You can
override this behavior by specifying a font family here that contains
emoji glyphs.

The specific styles (bold, italic, bold italic) do not need to be
explicitly set. If a style is not set, then the regular style (font-family)
will be searched for stylistic variants. If a stylistic variant is not
found, Ghostty will use the regular style. This prevents falling back to a
different font family just to get a style such as bold. This also applies
if you explicitly specify a font family for a style. For example, if you
set \`font-family-bold = FooBar\` and "FooBar" cannot be found, Ghostty will
use whatever font is set for \`font-family\` for the bold style.

Finally, some styles may be synthesized if they are not supported.
For example, if a font does not have an italic style and no alternative
italic font is specified, Ghostty will synthesize an italic style by
applying a slant to the regular style. If you want to disable these
synthesized styles then you can use the \`font-style\` configurations
as documented below.

You can disable styles completely by using the \`font-style\` set of
configurations. See the documentation for \`font-style\` for more information.

If you want to overwrite a previous set value rather than append a fallback,
specify the value as \`""\` (empty string) to reset the list and then set the
new values. For example:

    font-family = ""
    font-family = "My Favorite Font"

Setting any of these as CLI arguments will automatically clear the
values set in configuration files so you don't need to specify
\`--font-family=""\` before setting a new value. You only need to specify
this within config files if you want to clear previously set values in
configuration files or on the CLI if you want to clear values set on the
CLI.`,
        repeatable: true,
    },
    {
        key: "font-family-bold",
        type: "string",
        default: undefined,
        description: ``,
        repeatable: true,
    },
    {
        key: "font-family-italic",
        type: "string",
        default: undefined,
        description: ``,
        repeatable: true,
    },
    {
        key: "font-family-bold-italic",
        type: "string",
        default: undefined,
        description: ``,
        repeatable: true,
    },
    {
        key: "font-style",
        type: "font-style",
        default: undefined,
        description: `The named font style to use for each of the requested terminal font styles.
This looks up the style based on the font style string advertised by the
font itself. For example, "Iosevka Heavy" has a style of "Heavy".

You can also use these fields to completely disable a font style. If you set
the value of the configuration below to literal \`false\` then that font style
will be disabled. If the running program in the terminal requests a disabled
font style, the regular font style will be used instead.

These are only valid if its corresponding font-family is also specified. If
no font-family is specified, then the font-style is ignored unless you're
disabling the font style.`,
    },
    {
        key: "font-style-bold",
        type: "font-style",
        default: undefined,
        description: ``,
    },
    {
        key: "font-style-italic",
        type: "font-style",
        default: undefined,
        description: ``,
    },
    {
        key: "font-style-bold-italic",
        type: "font-style",
        default: undefined,
        description: ``,
    },
    {
        key: "font-synthetic-style",
        type: "font-synthetic-style",
        default: undefined,
        description: `Control whether Ghostty should synthesize a style if the requested style is
not available in the specified font-family.

Ghostty can synthesize bold, italic, and bold italic styles if the font
does not have a specific style. For bold, this is done by drawing an
outline around the glyph of varying thickness. For italic, this is done by
applying a slant to the glyph. For bold italic, both of these are applied.

Synthetic styles are not perfect and will generally not look as good
as a font that has the style natively. However, they are useful to
provide styled text when the font does not have the style.

Set this to "false" or "true" to disable or enable synthetic styles
completely. You can disable specific styles using "no-bold", "no-italic",
and "no-bold-italic". You can disable multiple styles by separating them
with a comma. For example, "no-bold,no-italic".

Available style keys are: \`bold\`, \`italic\`, \`bold-italic\`.

If synthetic styles are disabled, then the regular style will be used
instead if the requested style is not available. If the font has the
requested style, then the font will be used as-is since the style is
not synthetic.

Warning: An easy mistake is to disable \`bold\` or \`italic\` but not
\`bold-italic\`. Disabling only \`bold\` or \`italic\` will NOT disable either
in the \`bold-italic\` style. If you want to disable \`bold-italic\`, you must
explicitly disable it. You cannot partially disable \`bold-italic\`.

By default, synthetic styles are enabled.`,
    },
    {
        key: "font-feature",
        type: "string",
        default: undefined,
        description: `Apply a font feature. To enable multiple font features you can repeat
this multiple times or use a comma-separated list of feature settings.

The syntax for feature settings is as follows, where \`feat\` is a feature:

  * Enable features with e.g. \`feat\`, \`+feat\`, \`feat on\`, \`feat=1\`.
  * Disabled features with e.g. \`-feat\`, \`feat off\`, \`feat=0\`.
  * Set a feature value with e.g. \`feat=2\`, \`feat = 3\`, \`feat 4\`.
  * Feature names may be wrapped in quotes, meaning this config should be
    syntactically compatible with the \`font-feature-settings\` CSS property.

The syntax is fairly loose, but invalid settings will be silently ignored.

The font feature will apply to all fonts rendered by Ghostty. A future
enhancement will allow targeting specific faces.

To disable programming ligatures, use \`-calt\` since this is the typical
feature name for programming ligatures. To look into what font features
your font has and what they do, use a font inspection tool such as
[fontdrop.info](https://fontdrop.info).

To generally disable most ligatures, use \`-calt, -liga, -dlig\`.`,
        repeatable: true,
    },
    {
        key: "font-size",
        type: "float",
        default: undefined,
        description: `Font size in points. This value can be a non-integer and the nearest integer
pixel size will be selected. If you have a high dpi display where 1pt = 2px
then you can get an odd numbered pixel size by specifying a half point.

For example, 13.5pt @ 2px/pt = 27px

Changing this configuration at runtime will only affect existing
terminals that have NOT manually adjusted their font size in some way
(e.g. increased or decreased the font size). Terminals that have manually
adjusted their font size will retain their manually adjusted size.
Otherwise, the font size of existing terminals will be updated on
reload.

On Linux with GTK, font size is scaled according to both display-wide and
text-specific scaling factors, which are often managed by your desktop
environment (e.g. the GNOME display scale and large text settings).`,
    },
    {
        key: "font-variation",
        type: "font-variation",
        default: undefined,
        description: `A repeatable configuration to set one or more font variations values for
a variable font. A variable font is a single font, usually with a filename
ending in \`-VF.ttf\` or \`-VF.otf\` that contains one or more configurable axes
for things such as weight, slant, etc. Not all fonts support variations;
only fonts that explicitly state they are variable fonts will work.

The format of this is \`id=value\` where \`id\` is the axis identifier. An axis
identifier is always a 4 character string, such as \`wght\`. To get the list
of supported axes, look at your font documentation or use a font inspection
tool.

Invalid ids and values are usually ignored. For example, if a font only
supports weights from 100 to 700, setting \`wght=800\` will do nothing (it
will not be clamped to 700). You must consult your font's documentation to
see what values are supported.

Common axes are: \`wght\` (weight), \`slnt\` (slant), \`ital\` (italic), \`opsz\`
(optical size), \`wdth\` (width), \`GRAD\` (gradient), etc.`,
        repeatable: true,
    },
    {
        key: "font-variation-bold",
        type: "font-variation",
        default: undefined,
        description: ``,
        repeatable: true,
    },
    {
        key: "font-variation-italic",
        type: "font-variation",
        default: undefined,
        description: ``,
        repeatable: true,
    },
    {
        key: "font-variation-bold-italic",
        type: "font-variation",
        default: undefined,
        description: ``,
        repeatable: true,
    },
    {
        key: "font-codepoint-map",
        type: "codepoint-map",
        default: undefined,
        description: `Force one or a range of Unicode codepoints to map to a specific named font.
This is useful if you want to support special symbols or if you want to use
specific glyphs that render better for your specific font.

The syntax is \`codepoint=fontname\` where \`codepoint\` is either a single
codepoint or a range. Codepoints must be specified as full Unicode
hex values, such as \`U+ABCD\`. Codepoints ranges are specified as
\`U+ABCD-U+DEFG\`. You can specify multiple ranges for the same font separated
by commas, such as \`U+ABCD-U+DEFG,U+1234-U+5678=fontname\`. The font name is
the same value as you would use for \`font-family\`.

This configuration can be repeated multiple times to specify multiple
codepoint mappings.

Changing this configuration at runtime will only affect new terminals,
i.e. new windows, tabs, etc.`,
        repeatable: true,
    },
    {
        key: "clipboard-codepoint-map",
        type: "clipboard-codepoint-map",
        default: undefined,
        description: `Map specific Unicode codepoints to replacement values when copying text
to clipboard.

This configuration allows you to replace specific Unicode characters with
other characters or strings when copying terminal content to the clipboard.
This is useful for converting special terminal symbols to more compatible
characters for pasting into other applications.

The syntax is similar to \`font-codepoint-map\`:
- Single codepoint: \`U+1234=U+ABCD\` or \`U+1234=replacement_text\`
- Codepoint range: \`U+1234-U+5678=U+ABCD\`

Examples:
- \`clipboard-codepoint-map = U+2500=U+002D\` (box drawing horizontal → hyphen)
- \`clipboard-codepoint-map = U+2502=U+007C\` (box drawing vertical → pipe)
- \`clipboard-codepoint-map = U+03A3=SUM\` (Greek sigma → "SUM")

This configuration can be repeated multiple times to specify multiple
mappings. Later entries take priority over earlier ones for overlapping
ranges.

Note: This only applies to text copying operations, not URL copying.`,
        repeatable: true,
    },
    {
        key: "font-thicken",
        type: "bool",
        default: false,
        description: `Draw fonts with a thicker stroke, if supported.
This is currently only supported on macOS.`,
        platform: ["macos"],
    },
    {
        key: "font-thicken-strength",
        type: "uint",
        default: 255,
        description: `Strength of thickening when \`font-thicken\` is enabled.

Valid values are integers between \`0\` and \`255\`. \`0\` does not correspond to
*no* thickening, rather it corresponds to the lightest available thickening.

Has no effect when \`font-thicken\` is set to \`false\`.

This is currently only supported on macOS.`,
        platform: ["macos"],
    },
    {
        key: "font-shaping-break",
        type: "font-shaping-break",
        default: undefined,
        description: `Locations to break font shaping into multiple runs.

A "run" is a contiguous segment of text that is shaped together. "Shaping"
is the process of converting text (codepoints) into glyphs (renderable
characters). This is how ligatures are formed, among other things.
For example, if a coding font turns "!=" into a single glyph, then it
must see "!" and "=" next to each other in a single run. When a run
is broken, the text is shaped separately. To continue our example, if
"!" is at the end of one run and "=" is at the start of the next run,
then the ligature will not be formed.

Ghostty breaks runs at certain points to improve readability or usability.
For example, Ghostty by default will break runs under the cursor so that
text editing can see the individual characters rather than a ligature.
This configuration lets you configure this behavior.

Combine values with a comma to set multiple options. Prefix an
option with "no-" to disable it. Enabling and disabling options
can be done at the same time.

Available options:

  * \`cursor\` - Break runs under the cursor.

Available since: 1.2.0`,
        since: "1.2.0",
    },
    {
        key: "alpha-blending",
        type: "alpha-blending",
        default: undefined,
        description: `What color space to use when performing alpha blending.

This affects the appearance of text and of any images with transparency.
Additionally, custom shaders will receive colors in the configured space.

On macOS the default is \`native\`, on all other platforms the default is
\`linear-corrected\`.

Valid values:

* \`native\` - Perform alpha blending in the native color space for the OS.
  On macOS this corresponds to Display P3, and on Linux it's sRGB.

* \`linear\` - Perform alpha blending in linear space. This will eliminate
  the darkening artifacts around the edges of text that are very visible
  when certain color combinations are used (e.g. red / green), but makes
  dark text look much thinner than normal and light text much thicker.
  This is also sometimes known as "gamma correction".

* \`linear-corrected\` - Same as \`linear\`, but with a correction step applied
  for text that makes it look nearly or completely identical to \`native\`,
  but without any of the darkening artifacts.

Available since: 1.1.0`,
        since: "1.1.0",
    },
    {
        key: "adjust-cell-width",
        type: "metric-modifier",
        default: undefined,
        description: `All of the configurations behavior adjust various metrics determined by the
font. The values can be integers (1, -1, etc.) or a percentage (20%, -15%,
etc.). In each case, the values represent the amount to change the original
value.

For example, a value of \`1\` increases the value by 1; it does not set it to
literally 1. A value of \`20%\` increases the value by 20%. And so on.

There is little to no validation on these values so the wrong values (e.g.
\`-100%\`) can cause the terminal to be unusable. Use with caution and reason.

Some values are clamped to minimum or maximum values. This can make it
appear that certain values are ignored. For example, many \`*-thickness\`
adjustments cannot go below 1px.

\`adjust-cell-height\` has some additional behaviors to describe:

  * The font will be centered vertically in the cell.

  * The cursor will remain the same size as the font, but may be
    adjusted separately with \`adjust-cursor-height\`.

  * Powerline glyphs will be adjusted along with the cell height so
    that things like status lines continue to look aligned.`,
    },
    {
        key: "adjust-cell-height",
        type: "metric-modifier",
        default: undefined,
        description: ``,
    },
    {
        key: "adjust-font-baseline",
        type: "metric-modifier",
        default: undefined,
        description: `Distance in pixels or percentage adjustment from the bottom of the cell to the text baseline.
Increase to move baseline UP, decrease to move baseline DOWN.
See the notes about adjustments in \`adjust-cell-width\`.`,
    },
    {
        key: "adjust-underline-position",
        type: "metric-modifier",
        default: undefined,
        description: `Distance in pixels or percentage adjustment from the top of the cell to the top of the underline.
Increase to move underline DOWN, decrease to move underline UP.
See the notes about adjustments in \`adjust-cell-width\`.`,
    },
    {
        key: "adjust-underline-thickness",
        type: "metric-modifier",
        default: undefined,
        description: `Thickness in pixels of the underline.
See the notes about adjustments in \`adjust-cell-width\`.`,
    },
    {
        key: "adjust-strikethrough-position",
        type: "metric-modifier",
        default: undefined,
        description: `Distance in pixels or percentage adjustment from the top of the cell to the top of the strikethrough.
Increase to move strikethrough DOWN, decrease to move strikethrough UP.
See the notes about adjustments in \`adjust-cell-width\`.`,
    },
    {
        key: "adjust-strikethrough-thickness",
        type: "metric-modifier",
        default: undefined,
        description: `Thickness in pixels or percentage adjustment of the strikethrough.
See the notes about adjustments in \`adjust-cell-width\`.`,
    },
    {
        key: "adjust-overline-position",
        type: "metric-modifier",
        default: undefined,
        description: `Distance in pixels or percentage adjustment from the top of the cell to the top of the overline.
Increase to move overline DOWN, decrease to move overline UP.
See the notes about adjustments in \`adjust-cell-width\`.`,
    },
    {
        key: "adjust-overline-thickness",
        type: "metric-modifier",
        default: undefined,
        description: `Thickness in pixels or percentage adjustment of the overline.
See the notes about adjustments in \`adjust-cell-width\`.`,
    },
    {
        key: "adjust-cursor-thickness",
        type: "metric-modifier",
        default: undefined,
        description: `Thickness in pixels or percentage adjustment of the bar cursor and outlined rect cursor.
See the notes about adjustments in \`adjust-cell-width\`.`,
    },
    {
        key: "adjust-cursor-height",
        type: "metric-modifier",
        default: undefined,
        description: `Height in pixels or percentage adjustment of the cursor. Currently applies to all cursor types:
bar, rect, and outlined rect.
See the notes about adjustments in \`adjust-cell-width\`.`,
    },
    {
        key: "adjust-box-thickness",
        type: "metric-modifier",
        default: undefined,
        description: `Thickness in pixels or percentage adjustment of box drawing characters.
See the notes about adjustments in \`adjust-cell-width\`.`,
    },
    {
        key: "adjust-icon-height",
        type: "metric-modifier",
        default: undefined,
        description: `Height in pixels or percentage adjustment of maximum height for nerd font icons.

A positive (negative) value will increase (decrease) the maximum icon
height. This may not affect all icons equally: the effect depends on whether
the default size of the icon is height-constrained, which in turn depends on
the aspect ratio of both the icon and your primary font.

Certain icons designed for box drawing and terminal graphics, such as
Powerline symbols, are not affected by this option.

See the notes about adjustments in \`adjust-cell-width\`.

Available in: 1.2.0`,
    },
    {
        key: "grapheme-width-method",
        type: "enum",
        default: "unicode",
        description: `The method to use for calculating the cell width of a grapheme cluster.
The default value is \`unicode\` which uses the Unicode standard to determine
grapheme width. This results in correct grapheme width but may result in
cursor-desync issues with some programs (such as shells) that may use a
legacy method such as \`wcswidth\`.

Valid values are:

* \`legacy\` - Use a legacy method to determine grapheme width, such as
  wcswidth This maximizes compatibility with legacy programs but may result
  in incorrect grapheme width for certain graphemes such as skin-tone
  emoji, non-English characters, etc.

  This is called "legacy" and not something more specific because the
  behavior is undefined and we want to retain the ability to modify it.
  For example, we may or may not use libc \`wcswidth\` now or in the future.

* \`unicode\` - Use the Unicode standard to determine grapheme width.

If a running program explicitly enables terminal mode 2027, then \`unicode\`
width will be forced regardless of this configuration. When mode 2027 is
reset, this configuration will be used again.

This configuration can be changed at runtime but will not affect existing
terminals. Only new terminals will use the new configuration.`,
        enum: ["legacy", "unicode"],
    },
    {
        key: "freetype-load-flags",
        type: "freetype-load-flags",
        default: undefined,
        description: `FreeType load flags to enable. The format of this is a list of flags to
enable separated by commas. If you prefix a flag with \`no-\` then it is
disabled. If you omit a flag, its default value is used, so you must
explicitly disable flags you don't want. You can also use \`true\` or \`false\`
to turn all flags on or off.

This configuration only applies to Ghostty builds that use FreeType.
This is usually the case only for Linux builds. macOS uses CoreText
and does not have an equivalent configuration.

Available flags:

  * \`hinting\` - Enable or disable hinting. Enabled by default.

  * \`force-autohint\` - Always use the freetype auto-hinter instead of
    the font's native hinter. Disabled by default.

  * \`monochrome\` - Instructs renderer to use 1-bit monochrome rendering.
    This will disable anti-aliasing, and probably not look very good unless
    you're using a pixel font. Disabled by default.

  * \`autohint\` - Enable the freetype auto-hinter. Enabled by default.

  * \`light\` - Use a light hinting style, better preserving glyph shapes.
    This is the most common setting in GTK apps and therefore also Ghostty's
    default. This has no effect if \`monochrome\` is enabled. Enabled by
    default.

Example: \`hinting\`, \`no-hinting\`, \`force-autohint\`, \`no-force-autohint\``,
        platform: ["macos", "linux"],
    },
    {
        key: "theme",
        type: "theme",
        default: undefined,
        description: `A theme to use. This can be a built-in theme name, a custom theme
name, or an absolute path to a custom theme file. Ghostty also supports
specifying a different theme to use for light and dark mode. Each
option is documented below.

If the theme is an absolute pathname, Ghostty will attempt to load that
file as a theme. If that file does not exist or is inaccessible, an error
will be logged and no other directories will be searched.

If the theme is not an absolute pathname, two different directories will be
searched for a file name that matches the theme. This is case sensitive on
systems with case-sensitive filesystems. It is an error for a theme name to
include path separators unless it is an absolute pathname.

The first directory is the \`themes\` subdirectory of your Ghostty
configuration directory. This is \`$XDG_CONFIG_HOME/ghostty/themes\` or
\`~/.config/ghostty/themes\`.

The second directory is the \`themes\` subdirectory of the Ghostty resources
directory. Ghostty ships with a multitude of themes that will be installed
into this directory. On macOS, this list is in the
\`Ghostty.app/Contents/Resources/ghostty/themes\` directory. On Linux, this
list is in the \`share/ghostty/themes\` directory (wherever you installed the
Ghostty "share" directory.

To see a list of available themes, run \`ghostty +list-themes\`.

A theme file is simply another Ghostty configuration file. They share
the same syntax and same configuration options. A theme can set any valid
configuration option so please do not use a theme file from an untrusted
source. The built-in themes are audited to only set safe configuration
options.

Some options cannot be set within theme files. The reason these are not
supported should be self-evident. A theme file cannot set \`theme\` or
\`config-file\`. At the time of writing this, Ghostty will not show any
warnings or errors if you set these options in a theme file but they will
be silently ignored.

Any additional colors specified via background, foreground, palette, etc.
will override the colors specified in the theme.

To specify a different theme for light and dark mode, use the following
syntax: \`light:theme-name,dark:theme-name\`. For example:
\`light:Rose Pine Dawn,dark:Rose Pine\`. Whitespace around all values are
trimmed and order of light and dark does not matter. Both light and dark
must be specified in this form. In this form, the theme used will be
based on the current desktop environment theme.

There are some known bugs with light/dark mode theming. These will
be fixed in a future update:

  - macOS: titlebar tabs style is not updated when switching themes.`,
    },
    {
        key: "background",
        type: "color",
        default: "#282c34",
        description: `Background color for the window.
Specified as either hex (\`#RRGGBB\` or \`RRGGBB\`) or a named X11 color.`,
    },
    {
        key: "foreground",
        type: "color",
        default: "#ffffff",
        description: `Foreground color for the window.
Specified as either hex (\`#RRGGBB\` or \`RRGGBB\`) or a named X11 color.`,
    },
    {
        key: "background-image",
        type: "path",
        default: undefined,
        description: `Background image for the terminal.

This should be a path to a PNG or JPEG file, other image formats are
not yet supported.

The background image is currently per-terminal, not per-window. If
you are a heavy split user, the background image will be repeated across
splits. A future improvement to Ghostty will address this.

WARNING: Background images are currently duplicated in VRAM per-terminal.
For sufficiently large images, this could lead to a large increase in
memory usage (specifically VRAM usage). A future Ghostty improvement
will resolve this by sharing image textures across terminals.

Available since: 1.2.0`,
        since: "1.2.0",
    },
    {
        key: "background-image-opacity",
        type: "float",
        default: 1,
        description: `Background image opacity.

This is relative to the value of \`background-opacity\`.

A value of \`1.0\` (the default) will result in the background image being
placed on top of the general background color, and then the combined result
will be adjusted to the opacity specified by \`background-opacity\`.

A value less than \`1.0\` will result in the background image being mixed
with the general background color before the combined result is adjusted
to the configured \`background-opacity\`.

A value greater than \`1.0\` will result in the background image having a
higher opacity than the general background color. For instance, if the
configured \`background-opacity\` is \`0.5\` and \`background-image-opacity\`
is set to \`1.5\`, then the final opacity of the background image will be
\`0.5 * 1.5 = 0.75\`.

Available since: 1.2.0`,
        since: "1.2.0",
    },
    {
        key: "background-image-position",
        type: "enum",
        default: "center",
        description: `Background image position.

Valid values are:
  * \`top-left\`
  * \`top-center\`
  * \`top-right\`
  * \`center-left\`
  * \`center\`
  * \`center-right\`
  * \`bottom-left\`
  * \`bottom-center\`
  * \`bottom-right\`

The default value is \`center\`.

Available since: 1.2.0`,
        enum: ["top-left", "top-center", "top-right", "center-left", "center-center", "center-right", "bottom-left", "bottom-center", "bottom-right", "center"],
        since: "1.2.0",
    },
    {
        key: "background-image-fit",
        type: "enum",
        default: "contain",
        description: `Background image fit.

Valid values are:

 * \`contain\`

   Preserving the aspect ratio, scale the background image to the largest
   size that can still be contained within the terminal, so that the whole
   image is visible.

 * \`cover\`

   Preserving the aspect ratio, scale the background image to the smallest
   size that can completely cover the terminal. This may result in one or
   more edges of the image being clipped by the edge of the terminal.

 * \`stretch\`

   Stretch the background image to the full size of the terminal, without
   preserving the aspect ratio.

 * \`none\`

   Don't scale the background image.

The default value is \`contain\`.

Available since: 1.2.0`,
        enum: ["contain", "cover", "stretch", "none"],
        since: "1.2.0",
    },
    {
        key: "background-image-repeat",
        type: "bool",
        default: false,
        description: `Whether to repeat the background image or not.

If this is set to true, the background image will be repeated if there
would otherwise be blank space around it because it doesn't completely
fill the terminal area.

The default value is \`false\`.

Available since: 1.2.0`,
        since: "1.2.0",
    },
    {
        key: "selection-foreground",
        type: "terminal-color",
        default: undefined,
        description: `The foreground and background color for selection. If this is not set, then
the selection color is just the inverted window background and foreground
(note: not to be confused with the cell bg/fg).
Specified as either hex (\`#RRGGBB\` or \`RRGGBB\`) or a named X11 color.
Since version 1.2.0, this can also be set to \`cell-foreground\` to match
the cell foreground color, or \`cell-background\` to match the cell
background color.`,
    },
    {
        key: "selection-background",
        type: "terminal-color",
        default: undefined,
        description: ``,
    },
    {
        key: "selection-clear-on-typing",
        type: "bool",
        default: true,
        description: `Whether to clear selected text when typing. This defaults to \`true\`.
This is typical behavior for most terminal emulators as well as
text input fields. If you set this to \`false\`, then the selected text
will not be cleared when typing.

"Typing" is specifically defined as any non-modifier (shift, control,
alt, etc.) keypress that produces data to be sent to the application
running within the terminal (e.g. the shell). Additionally, selection
is cleared when any preedit or composition state is started (e.g.
when typing languages such as Japanese).

If this is \`false\`, then the selection can still be manually
cleared by clicking once or by pressing \`escape\`.

Available since: 1.2.0`,
        since: "1.2.0",
    },
    {
        key: "selection-clear-on-copy",
        type: "bool",
        default: false,
        description: `Whether to clear selected text after copying. This defaults to \`false\`.

When set to \`true\`, the selection will be automatically cleared after
any copy operation that invokes the \`copy_to_clipboard\` keyboard binding.
Importantly, this will not clear the selection if the copy operation
was invoked via \`copy-on-select\`.

When set to \`false\`, the selection remains visible after copying, allowing
to see what was copied and potentially perform additional operations
on the same selection.`,
    },
    {
        key: "selection-word-chars",
        type: "selection-word-chars",
        default: undefined,
        description: `Characters that mark word boundaries during text selection operations such
as double-clicking. When selecting a word, the selection will stop at any
of these characters.

This is similar to the \`WORDCHARS\` environment variable in zsh, except this
specifies the boundary characters rather than the word characters. The
default includes common delimiters and punctuation that typically separate
words in code and prose.

Each character in this string becomes a word boundary. Multi-byte UTF-8
characters are supported, but only single codepoints can be specified.
Multi-codepoint sequences (e.g. emoji) are not supported.

The null character (U+0000) is always treated as a boundary and does not
need to be included in this configuration.

Default: \` \\t'"│\`|:;,()[]{}<>$\`

To add or remove specific characters, you can set this to a custom value.
For example, to treat semicolons as part of words:

    selection-word-chars = " \\t'\\"│\`|:,()[]{}<>$"

Available since: 1.3.0`,
        since: "1.3.0",
    },
    {
        key: "minimum-contrast",
        type: "float",
        default: 1,
        description: `The minimum contrast ratio between the foreground and background colors.
The contrast ratio is a value between 1 and 21. A value of 1 allows for no
contrast (e.g. black on black). This value is the contrast ratio as defined
by the [WCAG 2.0 specification](https://www.w3.org/TR/WCAG20/).

If you want to avoid invisible text (same color as background), a value of
1.1 is a good value. If you want to avoid text that is difficult to read, a
value of 3 or higher is a good value. The higher the value, the more likely
that text will become black or white.

This value does not apply to Emoji or images.`,
    },
    {
        key: "palette",
        type: "palette",
        default: undefined,
        description: `Color palette for the 256 color form that many terminal applications use.
The syntax of this configuration is \`N=COLOR\` where \`N\` is 0 to 255 (for
the 256 colors in the terminal color table) and \`COLOR\` is a typical RGB
color code such as \`#AABBCC\` or \`AABBCC\`, or a named X11 color. For example,
\`palette = 5=#BB78D9\` will set the 'purple' color.

The palette index can be in decimal, binary, octal, or hexadecimal.
Decimal is assumed unless a prefix is used: \`0b\` for binary, \`0o\` for octal,
and \`0x\` for hexadecimal.

For definitions on the color indices and what they canonically map to,
[see this cheat sheet](https://www.ditig.com/256-colors-cheat-sheet).

For most themes, you only need to set the first 16 colors (0–15) since the
rest of the palette (16–255) will be automatically generated by
default (see \`palette-generate\` for more details).`,
    },
    {
        key: "palette-generate",
        type: "bool",
        default: true,
        description: `Whether to automatically generate the extended 256 color palette
(indices 16–255) from the base 16 ANSI colors.

This lets theme authors specify only the base 16 colors and have the
rest of the palette be automatically generated in a consistent and
aesthetic way.

When enabled, the 6×6×6 color cube and 24-step grayscale ramp are
derived from interpolations of the base palette, giving a more cohesive
look. Colors that have been explicitly set via \`palette\` are never
overwritten.

For more information on how the generation works, see here:
https://gist.github.com/jake-stewart/0a8ea46159a7da2c808e5be2177e1783

Available since: 1.3.0`,
        since: "1.3.0",
    },
    {
        key: "palette-harmonious",
        type: "bool",
        default: false,
        description: `Invert the palette colors generated when \`palette-generate\` is enabled,
so that the colors go in reverse order. This allows palette-based
applications to work well in both light and dark mode since the
palettes are always relatively good colors.

This defaults to off because some legacy terminal applications
hardcode the assumption that palette indices 16–231 are ordered from
darkest to lightest, so enabling this would make them unreadable.
This is not a generally good assumption and we encourage modern
terminal applications to use the indices in a more semantic way.

This has no effect if \`palette-generate\` is disabled.

For more information see \`palette-generate\`.

Available since: 1.3.0`,
        since: "1.3.0",
    },
    {
        key: "cursor-color",
        type: "terminal-color",
        default: undefined,
        description: `The color of the cursor. If this is not set, a default will be chosen.

Direct colors can be specified as either hex (\`#RRGGBB\` or \`RRGGBB\`)
or a named X11 color.

Additionally, special values can be used to set the color to match
other colors at runtime:

  * \`cell-foreground\` - Match the cell foreground color.
    (Available since: 1.2.0)

  * \`cell-background\` - Match the cell background color.
    (Available since: 1.2.0)`,
    },
    {
        key: "cursor-opacity",
        type: "float",
        default: 1,
        description: `The opacity level (opposite of transparency) of the cursor. A value of 1
is fully opaque and a value of 0 is fully transparent. A value less than 0
or greater than 1 will be clamped to the nearest valid value. Note that a
sufficiently small value such as 0.3 may be effectively invisible and may
make it difficult to find the cursor.`,
    },
    {
        key: "cursor-style",
        type: "enum",
        default: "block",
        description: `The style of the cursor. This sets the default style. A running program can
still request an explicit cursor style using escape sequences (such as \`CSI
q\`). Shell configurations will often request specific cursor styles.

Note that shell integration will automatically set the cursor to a bar at
a prompt, regardless of this configuration. You can disable that behavior
by specifying \`shell-integration-features = no-cursor\` or disabling shell
integration entirely.

Valid values are:

  * \`block\`
  * \`bar\`
  * \`underline\`
  * \`block_hollow\``,
    },
    {
        key: "cursor-style-blink",
        type: "bool",
        default: undefined,
        description: `Sets the default blinking state of the cursor. This is just the default
state; running programs may override the cursor style using \`DECSCUSR\` (\`CSI
q\`).

If this is not set, the cursor blinks by default. Note that this is not the
same as a "true" value, as noted below.

If this is not set at all (\`null\`), then Ghostty will respect DEC Mode 12
(AT&T cursor blink) as an alternate approach to turning blinking on/off. If
this is set to any value other than null, DEC mode 12 will be ignored but
\`DECSCUSR\` will still be respected.

Valid values are:

  * \` \` (blank)
  * \`true\`
  * \`false\``,
    },
    {
        key: "cursor-text",
        type: "terminal-color",
        default: undefined,
        description: `The color of the text under the cursor. If this is not set, a default will
be chosen.
Specified as either hex (\`#RRGGBB\` or \`RRGGBB\`) or a named X11 color.
Since version 1.2.0, this can also be set to \`cell-foreground\` to match
the cell foreground color, or \`cell-background\` to match the cell
background color.`,
    },
    {
        key: "cursor-click-to-move",
        type: "bool",
        default: true,
        description: `Enables the ability to move the cursor at prompts by using \`alt+click\` on
Linux and \`option+click\` on macOS.

This feature requires shell integration (specifically prompt marking
via \`OSC 133\`) and only works in primary screen mode. Alternate screen
applications like vim usually have their own version of this feature but
this configuration doesn't control that.

It should be noted that this feature works by translating your desired
position into a series of synthetic arrow key movements, so some weird
behavior around edge cases are to be expected. This is unfortunately how
this feature is implemented across terminals because there isn't any other
way to implement it.`,
    },
    {
        key: "mouse-hide-while-typing",
        type: "bool",
        default: false,
        description: `Hide the mouse immediately when typing. The mouse becomes visible again
when the mouse is used (button, movement, etc.). Platform-specific behavior
may dictate other scenarios where the mouse is shown. For example on macOS,
the mouse is shown again when a new window, tab, or split is created.`,
    },
    {
        key: "scroll-to-bottom",
        type: "scroll-to-bottom",
        default: "default",
        description: `When to scroll the surface to the bottom. The format of this is a list of
options to enable separated by commas. If you prefix an option with \`no-\`
then it is disabled. If you omit an option, its default value is used.

Available options:

- \`keystroke\` If set, scroll the surface to the bottom when the user
  presses a key that results in data being sent to the PTY (basically
  anything but modifiers or keybinds that are processed by Ghostty).

- \`output\` If set, scroll the surface to the bottom if there is new data
  to display (e.g., when new lines are printed to the terminal).

The default is \`keystroke, no-output\`.`,
    },
    {
        key: "mouse-shift-capture",
        type: "enum",
        default: false,
        description: `Determines whether running programs can detect the shift key pressed with a
mouse click. Typically, the shift key is used to extend mouse selection.

The default value of \`false\` means that the shift key is not sent with
the mouse protocol and will extend the selection. This value can be
conditionally overridden by the running program with the \`XTSHIFTESCAPE\`
sequence.

The value \`true\` means that the shift key is sent with the mouse protocol
but the running program can override this behavior with \`XTSHIFTESCAPE\`.

The value \`never\` is the same as \`false\` but the running program cannot
override this behavior with \`XTSHIFTESCAPE\`. The value \`always\` is the
same as \`true\` but the running program cannot override this behavior with
\`XTSHIFTESCAPE\`.

If you always want shift to extend mouse selection even if the program
requests otherwise, set this to \`never\`.

Valid values are:

  * \`true\`
  * \`false\`
  * \`always\`
  * \`never\``,
        enum: ["false", "true", "always", "never"],
    },
    {
        key: "mouse-reporting",
        type: "bool",
        default: true,
        description: `Enable or disable mouse reporting. When set to \`false\`, mouse events will
not be reported to terminal applications even if they request it. This
allows you to always use the mouse for selection and other terminal UI
interactions without applications capturing mouse input.

When set to \`true\` (the default), terminal applications can request mouse
reporting and will receive mouse events according to their requested mode.

This can be toggled at runtime using the \`toggle_mouse_reporting\` keybind
action.`,
    },
    {
        key: "mouse-scroll-multiplier",
        type: "mouse-scroll-multiplier",
        default: "default",
        description: `Multiplier for scrolling distance with the mouse wheel.

A prefix of \`precision:\` or \`discrete:\` can be used to set the multiplier
only for scrolling with the specific type of devices. These can be
comma-separated to set both types of multipliers at the same time, e.g.
\`precision:0.1,discrete:3\`. If no prefix is used, the multiplier applies
to all scrolling devices. Specifying a prefix was introduced in Ghostty
1.2.1.

The value will be clamped to [0.01, 10,000]. Both of these are extreme
and you're likely to have a bad experience if you set either extreme.

The default value is "3" for discrete devices and "1" for precision devices.`,
    },
    {
        key: "background-opacity",
        type: "float",
        default: 1,
        description: `The opacity level (opposite of transparency) of the background. A value of
1 is fully opaque and a value of 0 is fully transparent. A value less than 0
or greater than 1 will be clamped to the nearest valid value.

On macOS, background opacity is disabled when the terminal enters native
fullscreen. This is because the background becomes gray and it can cause
widgets to show through which isn't generally desirable.

On macOS, changing this configuration requires restarting Ghostty completely.`,
    },
    {
        key: "background-opacity-cells",
        type: "bool",
        default: false,
        description: `Applies background opacity to cells with an explicit background color
set.

Normally, \`background-opacity\` is only applied to the window background.
If a cell has an explicit background color set, such as red, then that
background color will be fully opaque. An effect of this is that some
terminal applications that repaint the background color of the terminal
such as a Neovim and Tmux may not respect the \`background-opacity\`
(by design).

Setting this to \`true\` will apply the \`background-opacity\` to all cells
regardless of whether they have an explicit background color set or not.

Available since: 1.2.0`,
        since: "1.2.0",
    },
    {
        key: "background-blur",
        type: "background-blur",
        default: false,
        description: `Whether to blur the background when \`background-opacity\` is less than 1.

Valid values are:

  * a nonnegative integer specifying the *blur intensity*
  * \`false\`, equivalent to a blur intensity of 0
  * \`true\`, equivalent to the default blur intensity of 20, which is
    reasonable for a good looking blur. Higher blur intensities may
    cause strange rendering and performance issues.

On macOS 26.0 and later, there are additional special values that
can be set to use the native macOS glass effects:

  * \`macos-glass-regular\` - Standard glass effect with some opacity
  * \`macos-glass-clear\` - Highly transparent glass effect

If the macOS values are set, then this implies \`background-blur = true\`
on non-macOS platforms.

Supported on macOS and on some Linux desktop environments, including:

  * KDE Plasma (Wayland and X11)

Warning: the exact blur intensity is _ignored_ under KDE Plasma, and setting
this setting to either \`true\` or any positive blur intensity value would
achieve the same effect. The reason is that KWin, the window compositor
powering Plasma, only has one global blur setting and does not allow
applications to specify individual blur settings.

To configure KWin's global blur setting, open System Settings and go to
"Apps & Windows" > "Window Management" > "Desktop Effects" and select the
"Blur" plugin. If disabled, enable it by ticking the checkbox to the left.
Then click on the "Configure" button and there will be two sliders that
allow you to set background blur and noise intensities for all apps,
including Ghostty.

All other Linux desktop environments are as of now unsupported. Users may
need to set environment-specific settings and/or install third-party plugins
in order to support background blur, as there isn't a unified interface for
doing so.`,
    },
    {
        key: "unfocused-split-opacity",
        type: "float",
        default: 0.7,
        description: `The opacity level (opposite of transparency) of an unfocused split.
Unfocused splits by default are slightly faded out to make it easier to see
which split is focused. To disable this feature, set this value to 1.

A value of 1 is fully opaque and a value of 0 is fully transparent. Because
"0" is not useful (it makes the window look very weird), the minimum value
is 0.15. This value still looks weird but you can at least see what's going
on. A value outside of the range 0.15 to 1 will be clamped to the nearest
valid value.`,
    },
    {
        key: "unfocused-split-fill",
        type: "color",
        default: undefined,
        description: `The color to dim the unfocused split. Unfocused splits are dimmed by
rendering a semi-transparent rectangle over the split. This sets the color of
that rectangle and can be used to carefully control the dimming effect.

This will default to the background color.

Specified as either hex (\`#RRGGBB\` or \`RRGGBB\`) or a named X11 color.`,
    },
    {
        key: "split-divider-color",
        type: "color",
        default: undefined,
        description: `The color of the split divider. If this is not set, a default will be chosen.
Specified as either hex (\`#RRGGBB\` or \`RRGGBB\`) or a named X11 color.

Available since: 1.1.0`,
        since: "1.1.0",
    },
    {
        key: "split-preserve-zoom",
        type: "split-preserve-zoom",
        default: undefined,
        description: `Control when Ghostty preserves a zoomed split. Under normal circumstances,
any operation that changes focus or layout of the split tree in a window
will unzoom any zoomed split. This configuration allows you to control
this behavior.

This can be set to \`navigation\` to preserve the zoomed split state
when navigating to another split (e.g. via \`goto_split\`). This will
change the zoomed split to the newly focused split instead of unzooming.

Any options can also be prefixed with \`no-\` to disable that option.

Example: \`split-preserve-zoom = navigation\`

Available since: 1.3.0`,
        since: "1.3.0",
    },
    {
        key: "search-foreground",
        type: "terminal-color",
        default: "#000000",
        description: `The foreground and background color for search matches. This only applies
to non-focused search matches, also known as candidate matches.

Valid values:

  - Hex (\`#RRGGBB\` or \`RRGGBB\`)
  - Named X11 color
  - "cell-foreground" to match the cell foreground color
  - "cell-background" to match the cell background color

The default value is black text on a golden yellow background.`,
    },
    {
        key: "search-background",
        type: "terminal-color",
        default: "#ffe082",
        description: ``,
    },
    {
        key: "search-selected-foreground",
        type: "terminal-color",
        default: "#000000",
        description: `The foreground and background color for the currently selected search match.
This is the focused match that will be jumped to when using next/previous
search navigation.

Valid values:

  - Hex (\`#RRGGBB\` or \`RRGGBB\`)
  - Named X11 color
  - "cell-foreground" to match the cell foreground color
  - "cell-background" to match the cell background color

The default value is black text on a soft peach background.`,
    },
    {
        key: "search-selected-background",
        type: "terminal-color",
        default: "#f2a57e",
        description: ``,
    },
    {
        key: "command",
        type: "command",
        default: undefined,
        description: `The command to run, usually a shell. If this is not an absolute path, it'll
be looked up in the \`PATH\`. If this is not set, a default will be looked up
from your system. The rules for the default lookup are:

  * \`SHELL\` environment variable

  * \`passwd\` entry (user information)

This can contain additional arguments to run the command with. If additional
arguments are provided, the command will be executed using \`/bin/sh -c\`
to offload shell argument expansion.

To avoid shell expansion altogether, prefix the command with \`direct:\`, e.g.
\`direct:nvim foo\`. This will avoid the roundtrip to \`/bin/sh\` but will also
not support any shell parsing such as arguments with spaces, filepaths with
\`~\`, globs, etc. (Available since: 1.2.0)

You can also explicitly prefix the command with \`shell:\` to always wrap the
command in a shell. This can be used to ensure our heuristics to choose the
right mode are not used in case they are wrong. (Available since: 1.2.0)

This command will be used for all new terminal surfaces, i.e. new windows,
tabs, etc. If you want to run a command only for the first terminal surface
created when Ghostty starts, use the \`initial-command\` configuration.

Ghostty supports the common \`-e\` flag for executing a command with
arguments. For example, \`ghostty -e fish --with --custom --args\`.
This flag sets the \`initial-command\` configuration, see that for more
information.`,
    },
    {
        key: "initial-command",
        type: "command",
        default: undefined,
        description: `This is the same as "command", but only applies to the first terminal
surface created when Ghostty starts. Subsequent terminal surfaces will use
the \`command\` configuration.

After the first terminal surface is created (or closed), there is no
way to run this initial command again automatically. As such, setting
this at runtime works but will only affect the next terminal surface
if it is the first one ever created.

If you're using the \`ghostty\` CLI there is also a shortcut to set this
with arguments directly: you can use the \`-e\` flag. For example: \`ghostty -e
fish --with --custom --args\`. The \`-e\` flag automatically forces some
other behaviors as well:

  * Disables shell expansion since the input is expected to already
    be shell-expanded by the upstream (e.g. the shell used to type in
    the \`ghostty -e\` command).

  * \`gtk-single-instance=false\` - This ensures that a new instance is
    launched and the CLI args are respected.

  * \`quit-after-last-window-closed=true\` - This ensures that the Ghostty
    process will exit when the command exits. Additionally, the
    \`quit-after-last-window-closed-delay\` is unset.

  * \`shell-integration=detect\` (if not \`none\`) - This prevents forcibly
    injecting any configured shell integration into the command's
    environment. With \`-e\` its highly unlikely that you're executing a
    shell and forced shell integration is likely to cause problems
    (e.g. by wrapping your command in a shell, setting env vars, etc.).
    This is a safety measure to prevent unexpected behavior. If you want
    shell integration with a \`-e\`-executed command, you must either
    name your binary appropriately or source the shell integration script
    manually.`,
    },
    {
        key: "notify-on-command-finish",
        type: "enum",
        default: "never",
        description: `Controls when command finished notifications are sent. There are
three options:

* \`never\` - Never send notifications (the default).
* \`unfocused\` - Only send notifications if the surface that the command is
  running in is not focused.
* \`always\` - Always send notifications.

Command finished notifications requires that either shell integration is
enabled, or that your shell sends OSC 133 escape sequences to mark the start
and end of commands.

On GTK, there is a context menu item that will enable command finished
notifications for a single command, overriding the \`never\` and \`unfocused\`
options.

GTK only.

Available since 1.3.0.`,
        enum: ["never", "unfocused", "always"],
        platform: ["gtk"],
        since: "1.3.0",
    },
    {
        key: "notify-on-command-finish-action",
        type: "notify-on-command-finish-action",
        default: undefined,
        description: `If command finished notifications are enabled, this controls how the user is
notified.

Available options:

* \`bell\` - enabled by default
* \`notify\` - disabled by default

Options can be combined by listing them as a comma separated list. Options
can be negated by prefixing them with \`no-\`. For example \`no-bell,notify\`.

GTK only.

Available since 1.3.0.`,
        platform: ["gtk"],
        since: "1.3.0",
    },
    {
        key: "notify-on-command-finish-after",
        type: "duration",
        default: "5s",
        description: `If command finished notifications are enabled, this controls how long a
command must have been running before a notification will be sent. The
default is five seconds.

The duration is specified as a series of numbers followed by time units.
Whitespace is allowed between numbers and units. Each number and unit will
be added together to form the total duration.

The allowed time units are as follows:

  * \`y\` - 365 SI days, or 8760 hours, or 31536000 seconds. No adjustments
    are made for leap years or leap seconds.
  * \`d\` - one SI day, or 86400 seconds.
  * \`h\` - one hour, or 3600 seconds.
  * \`m\` - one minute, or 60 seconds.
  * \`s\` - one second.
  * \`ms\` - one millisecond, or 0.001 second.
  * \`us\` or \`µs\` - one microsecond, or 0.000001 second.
  * \`ns\` - one nanosecond, or 0.000000001 second.

Examples:
  * \`1h30m\`
  * \`45s\`

Units can be repeated and will be added together. This means that
\`1h1h\` is equivalent to \`2h\`. This is confusing and should be avoided.
A future update may disallow this.

The maximum value is \`584y 49w 23h 34m 33s 709ms 551µs 615ns\`. Any
value larger than this will be clamped to the maximum value.

GTK only.

Available since 1.3.0`,
        platform: ["gtk"],
        since: "1.3.0",
    },
    {
        key: "env",
        type: "string",
        default: undefined,
        description: `Extra environment variables to pass to commands launched in a terminal
surface. The format is \`env=KEY=VALUE\`.

\`env = foo=bar\`
\`env = bar=baz\`

Setting \`env\` to an empty string will reset the entire map to default
(empty).

\`env =\`

Setting a key to an empty string will remove that particular key and
corresponding value from the map.

\`env = foo=bar\`
\`env = foo=\`

will result in \`foo\` not being passed to the launched commands.

Setting a key multiple times will overwrite previous entries.

\`env = foo=bar\`
\`env = foo=baz\`

will result in \`foo=baz\` being passed to the launched commands.

These environment variables will override any existing environment
variables set by Ghostty. For example, if you set \`GHOSTTY_RESOURCES_DIR\`
then the value you set here will override the value Ghostty typically
automatically injects.

These environment variables _will not_ be passed to commands run by Ghostty
for other purposes, like \`open\` or \`xdg-open\` used to open URLs in your
browser.

Available since: 1.2.0`,
        since: "1.2.0",
    },
    {
        key: "input",
        type: "readable-io",
        default: undefined,
        description: `Data to send as input to the command on startup.

The configured \`command\` will be launched using the typical rules,
then the data specified as this input will be written to the pty
before any other input can be provided.

The bytes are sent as-is with no additional encoding. Therefore, be
cautious about input that can contain control characters, because this
can be used to execute programs in a shell.

The format of this value is:

  * \`raw:<string>\` - Send raw text as-is. This uses Zig string literal
    syntax so you can specify control characters and other standard
    escapes.

  * \`path:<path>\` - Read a filepath and send the contents. The path
    must be to a file with finite length. e.g. don't use a device
    such as \`/dev/stdin\` or \`/dev/urandom\` as these will block
    terminal startup indefinitely. Files are limited to 10MB
    in size to prevent excessive memory usage. If you have files
    larger than this you should write a script to read the file
    and send it to the terminal.

If no valid prefix is found, it is assumed to be a \`raw:\` input.
This is an ergonomic choice to allow you to simply write
\`input = "Hello, world!"\` (a common case) without needing to prefix
every value with \`raw:\`.

This can be repeated multiple times to send more data. The data
is concatenated directly with no separator characters in between
(e.g. no newline).

If any of the input sources do not exist, then none of the input
will be sent. Input sources are not verified until the terminal
is starting, so missing paths will not show up in config validation.

Changing this configuration at runtime will only affect new
terminals.

Available since: 1.2.0`,
        repeatable: true,
        since: "1.2.0",
    },
    {
        key: "wait-after-command",
        type: "bool",
        default: false,
        description: `If true, keep the terminal open after the command exits. Normally, the
terminal window closes when the running command (such as a shell) exits.
With this true, the terminal window will stay open until any keypress is
received.

This is primarily useful for scripts or debugging.`,
    },
    {
        key: "abnormal-command-exit-runtime",
        type: "uint",
        default: 250,
        description: `The number of milliseconds of runtime below which we consider a process exit
to be abnormal. This is used to show an error message when the process exits
too quickly.

On Linux, this must be paired with a non-zero exit code. On macOS, we allow
any exit code because of the way shell processes are launched via the login
command.`,
    },
    {
        key: "scrollback-limit",
        type: "uint",
        default: undefined,
        description: `The size of the scrollback buffer in bytes. This also includes the active
screen. No matter what this is set to, enough memory will always be
allocated for the visible screen and anything leftover is the limit for
the scrollback.

When this limit is reached, the oldest lines are removed from the
scrollback.

Scrollback currently exists completely in memory. This means that the
larger this value, the larger potential memory usage. Scrollback is
allocated lazily up to this limit, so if you set this to a very large
value, it will not immediately consume a lot of memory.

This size is per terminal surface, not for the entire application.

It is not currently possible to set an unlimited scrollback buffer.
This is a future planned feature.

This can be changed at runtime but will only affect new terminal surfaces.`,
    },
    {
        key: "scrollbar",
        type: "enum",
        default: "system",
        description: `Control when the scrollbar is shown to scroll the scrollback buffer.

The default value is \`system\`.

Valid values:

  * \`system\` - Respect the system settings for when to show scrollbars.
    For example, on macOS, this will respect the "Scrollbar behavior"
    system setting which by default usually only shows scrollbars while
    actively scrolling or hovering the gutter.

  * \`never\` - Never show a scrollbar. You can still scroll using the mouse,
    keybind actions, etc. but you will not have a visual UI widget showing
    a scrollbar.

This only applies to macOS currently. GTK doesn't yet support scrollbars.`,
        enum: ["system", "never"],
        platform: ["macos"],
    },
    {
        key: "link",
        type: "link",
        default: undefined,
        description: `Match a regular expression against the terminal text and associate clicking
it with an action. This can be used to match URLs, file paths, etc. Actions
can be opening using the system opener (e.g. \`open\` or \`xdg-open\`) or
executing any arbitrary binding action.

Links that are configured earlier take precedence over links that are
configured later.

A default link that matches a URL and opens it in the system opener always
exists. This can be disabled using \`link-url\`.

TODO: This can't currently be set!`,
        repeatable: true,
    },
    {
        key: "link-url",
        type: "bool",
        default: true,
        description: `Enable URL matching. URLs are matched on hover with control (Linux) or
command (macOS) pressed and open using the default system application for
the linked URL.

The URL matcher is always lowest priority of any configured links (see
\`link\`). If you want to customize URL matching, use \`link\` and disable this.`,
    },
    {
        key: "link-previews",
        type: "enum",
        default: true,
        description: `Show link previews for a matched URL.

When true, link previews are shown for all matched URLs. When false, link
previews are never shown. When set to "osc8", link previews are only shown
for hyperlinks created with the OSC 8 sequence (in this case, the link text
can differ from the link destination).

Available since: 1.2.0`,
        enum: ["false", "true", "osc8"],
        since: "1.2.0",
    },
    {
        key: "maximize",
        type: "bool",
        default: false,
        description: `Whether to start the window in a maximized state. This setting applies
to new windows and does not apply to tabs, splits, etc. However, this setting
will apply to all new windows, not just the first one.

Available since: 1.1.0`,
        since: "1.1.0",
    },
    {
        key: "fullscreen",
        type: "enum",
        default: false,
        description: `Start new windows in fullscreen. This setting applies to new windows and
does not apply to tabs, splits, etc. However, this setting will apply to all
new windows, not just the first one.

Allowable values are:

  * \`false\` - Don't start in fullscreen (default)
  * \`true\` - Start in native fullscreen
  * \`non-native\` - (macOS only) Start in non-native fullscreen, hiding the
    menu bar. This is faster than native fullscreen since it doesn't use
    animations. On non-macOS platforms, this behaves the same as \`true\`.
  * \`non-native-visible-menu\` - (macOS only) Start in non-native fullscreen,
    keeping the menu bar visible. On non-macOS platforms, behaves like \`true\`.
  * \`non-native-padded-notch\` - (macOS only) Start in non-native fullscreen,
    hiding the menu bar but padding for the notch on applicable devices.
    On non-macOS platforms, behaves like \`true\`.

Important: tabs DO NOT WORK with non-native fullscreen modes. Non-native
fullscreen removes the titlebar and macOS native tabs require the titlebar.
If you use tabs, use \`true\` (native) instead.

On macOS, \`true\` (native fullscreen) does not work if \`window-decoration\`
is set to \`false\`, because native fullscreen on macOS requires window
decorations.`,
        enum: ["false", "true", "non-native", "non-native-visible-menu", "non-native-padded-notch"],
        platform: ["macos"],
    },
    {
        key: "title",
        type: "string",
        default: undefined,
        description: `The title Ghostty will use for the window. This will force the title of the
window to be this title at all times and Ghostty will ignore any set title
escape sequences programs (such as Neovim) may send.

If you want a blank title, set this to one or more spaces by quoting
the value. For example, \`title = " "\`. This effectively hides the title.
This is necessary because setting a blank value resets the title to the
default value of the running program.

This configuration can be reloaded at runtime. If it is set, the title
will update for all windows. If it is unset, the next title change escape
sequence will be honored but previous changes will not retroactively
be set. This latter case may require you to restart programs such as Neovim
to get the new title.`,
    },
    {
        key: "class",
        type: "string",
        default: undefined,
        description: `The setting that will change the application class value.

This controls the class field of the \`WM_CLASS\` X11 property (when running
under X11), the Wayland application ID (when running under Wayland), and the
bus name that Ghostty uses to connect to DBus.

Note that changing this value between invocations will create new, separate
instances, of Ghostty when running with \`gtk-single-instance=true\`. See that
option for more details.

Changing this value may break launching Ghostty from \`.desktop\` files, via
DBus activation, or systemd user services as the system is expecting Ghostty
to connect to DBus using the default \`class\` when it is launched.

The class name must follow the requirements defined [in the GTK
documentation](https://docs.gtk.org/gio/type_func.Application.id_is_valid.html).

The default is \`com.mitchellh.ghostty\`.

This only affects GTK builds.`,
    },
    {
        key: "x11-instance-name",
        type: "string",
        default: undefined,
        description: `This controls the instance name field of the \`WM_CLASS\` X11 property when
running under X11. It has no effect otherwise.

The default is \`ghostty\`.

This only affects GTK builds.`,
    },
    {
        key: "working-directory",
        type: "string",
        default: undefined,
        description: `The directory to change to after starting the command.

This setting is secondary to the \`window-inherit-working-directory\`
setting. If a previous Ghostty terminal exists in the same process,
\`window-inherit-working-directory\` will take precedence. Otherwise, this
setting will be used. Typically, this setting is used only for the first
window.

The default is \`inherit\` except in special scenarios listed next. On macOS,
if Ghostty can detect it is launched from launchd (double-clicked) or
\`open\`, then it defaults to \`home\`. On Linux with GTK, if Ghostty can detect
it was launched from a desktop launcher, then it defaults to \`home\`.

The value of this must be an absolute value or one of the special values
below:

  * \`home\` - The home directory of the executing user.

  * \`inherit\` - The working directory of the launching process.`,
    },
    {
        key: "keybind",
        type: "keybinds",
        default: undefined,
        description: `Key bindings. The format is \`trigger=action\`. Duplicate triggers will
overwrite previously set values. The list of actions is available in
the documentation or using the \`ghostty +list-actions\` command.

Trigger: \`+\`-separated list of keys and modifiers. Example: \`ctrl+a\`,
\`ctrl+shift+b\`, \`up\`.

If the key is a single Unicode codepoint, the trigger will match
any presses that produce that codepoint. These are impacted by
keyboard layouts. For example, \`a\` will match the \`a\` key on a
QWERTY keyboard, but will match the \`q\` key on a AZERTY keyboard
(assuming US physical layout).

For Unicode codepoints, matching is done by comparing the set of
modifiers with the unmodified codepoint. The unmodified codepoint is
sometimes called an "unshifted character" in other software, but all
modifiers are considered, not only shift. For example, \`ctrl+a\` will match
\`a\` but not \`ctrl+shift+a\` (which is \`A\` on a US keyboard).

Further, codepoint matching is case-insensitive and the unmodified
codepoint is always case folded for comparison. As a result,
\`ctrl+A\` configured will match when \`ctrl+a\` is pressed. Note that
this means some key combinations are impossible depending on keyboard
layout. For example, \`ctrl+_\` is impossible on a US keyboard because
\`_\` is \`shift+-\` and \`ctrl+shift+-\` is not equal to \`ctrl+_\` (because
the modifiers don't match!). More details on impossible key combinations
can be found at this excellent source written by Qt developers:
https://doc.qt.io/qt-6/qkeysequence.html#keyboard-layout-issues

Physical key codes can be specified by using any of the key codes
as specified by the [W3C specification](https://www.w3.org/TR/uievents-code/).
For example, \`KeyA\` will match the physical \`a\` key on a US standard
keyboard regardless of the keyboard layout. These are case-sensitive.

For aesthetic reasons, the w3c codes also support snake case. For
example, \`key_a\` is equivalent to \`KeyA\`. The only exceptions are
function keys, e.g. \`F1\` is \`f1\` (no underscore). This is a consequence
of our internal code using snake case but is purposely supported
and tested so it is safe to use. It allows an all-lowercase binding
which I find more aesthetically pleasing.

Function keys such as \`insert\`, \`up\`, \`f5\`, etc. are also specified
using the keys as specified by the previously linked W3C specification.

Physical keys always match with a higher priority than Unicode codepoints,
so if you specify both \`a\` and \`KeyA\`, the physical key will always be used
regardless of what order they are configured.

The special key \`catch_all\` can be used to match any key that is not
otherwise bound. This can be combined with modifiers, for example
\`ctrl+catch_all\` will match any key pressed with \`ctrl\` that is not
otherwise bound. When looking up a binding, Ghostty first tries to match
\`catch_all\` with modifiers. If no match is found and the event has
modifiers, it falls back to \`catch_all\` without modifiers.

Valid modifiers are \`shift\`, \`ctrl\` (alias: \`control\`), \`alt\` (alias: \`opt\`,
\`option\`), and \`super\` (alias: \`cmd\`, \`command\`). You may use the modifier
or the alias. When debugging keybinds, the non-aliased modifier will always
be used in output.

Note: The fn or "globe" key on keyboards are not supported as a
modifier. This is a limitation of the operating systems and GUI toolkits
that Ghostty uses.

Some additional notes for triggers:

  * modifiers cannot repeat, \`ctrl+ctrl+a\` is invalid.

  * modifiers and keys can be in any order, \`shift+a+ctrl\` is *weird*,
    but valid.

  * only a single key input is allowed, \`ctrl+a+b\` is invalid.

You may also specify multiple triggers separated by \`>\` to require a
sequence of triggers to activate the action. For example,
\`ctrl+a>n=new_window\` will only trigger the \`new_window\` action if the
user presses \`ctrl+a\` followed separately by \`n\`. In other software, this
is sometimes called a leader key, a key chord, a key table, etc. There
is no hardcoded limit on the number of parts in a sequence.

Warning: If you define a sequence as a CLI argument to \`ghostty\`,
you probably have to quote the keybind since \`>\` is a special character
in most shells. Example: ghostty --keybind='ctrl+a>n=new_window'

A trigger sequence has some special handling:

  * Ghostty will wait an indefinite amount of time for the next key in
    the sequence. There is no way to specify a timeout. The only way to
    force the output of a prefix key is to assign another keybind to
    specifically output that key (e.g. \`ctrl+a>ctrl+a=text:foo\`) or
    press an unbound key which will send both keys to the program.

  * If an unbound key is pressed during a sequence and a \`catch_all\`
    binding exists that would \`ignore\` the input, the entire sequence
    is dropped and nothing happens. Otherwise, the entire sequence is
    encoded and sent to the running program as if no keybind existed.

  * If a prefix in a sequence is previously bound, the sequence will
    override the previous binding. For example, if \`ctrl+a\` is bound to
    \`new_window\` and \`ctrl+a>n\` is bound to \`new_tab\`, pressing \`ctrl+a\`
    will do nothing.

  * Adding to the above, if a previously bound sequence prefix is
    used in a new, non-sequence binding, the entire previously bound
    sequence will be unbound. For example, if you bind \`ctrl+a>n\` and
    \`ctrl+a>t\`, and then bind \`ctrl+a\` directly, both \`ctrl+a>n\` and
    \`ctrl+a>t\` will become unbound.

  * Trigger sequences are not allowed for \`global:\` or \`all:\`-prefixed
    triggers. This is a limitation we could remove in the future.

Action is the action to take when the trigger is satisfied. It takes the
format \`action\` or \`action:param\`. The latter form is only valid if the
action requires a parameter.

  * \`ignore\` - Do nothing, ignore the key input. This can be used to
    black hole certain inputs to have no effect.

  * \`unbind\` - Remove the binding. This makes it so the previous action
    is removed, and the key will be sent through to the child command
    if it is printable. Unbind will remove any matching trigger,
    including \`physical:\`-prefixed triggers without specifying the
    prefix.

  * \`csi:text\` - Send a CSI sequence. e.g. \`csi:A\` sends "cursor up".

  * \`esc:text\` - Send an escape sequence. e.g. \`esc:d\` deletes to the
    end of the word to the right.

  * \`text:text\` - Send a string. Uses Zig string literal syntax.
    e.g. \`text:\\x15\` sends Ctrl-U.

  * All other actions can be found in the documentation or by using the
    \`ghostty +list-actions\` command.

Some notes for the action:

  * The parameter is taken as-is after the \`:\`. Double quotes or
    other mechanisms are included and NOT parsed. If you want to
    send a string value that includes spaces, wrap the entire
    trigger/action in double quotes. Example: \`--keybind="up=csi:A B"\`

There are some additional special values that can be specified for
keybind:

  * \`keybind=clear\` will clear all set keybindings. Warning: this
    removes ALL keybindings up to this point, including the default
    keybindings.

The keybind trigger can be prefixed with some special values to change
the behavior of the keybind. These are:

 * \`all:\`

   Make the keybind apply to all terminal surfaces. By default,
   keybinds only apply to the focused terminal surface. If this is true,
   then the keybind will be sent to all terminal surfaces. This only
   applies to actions that are surface-specific. For actions that
   are already global (e.g. \`quit\`), this prefix has no effect.

   Available since: 1.0.0

 * \`global:\`

   Make the keybind global. By default, keybinds only work within Ghostty
   and under the right conditions (application focused, sometimes terminal
   focused, etc.). If you want a keybind to work globally across your system
   (e.g. even when Ghostty is not focused), specify this prefix.
   This prefix implies \`all:\`.

   Note: this does not work in all environments; see the additional notes
   below for more information.

   Available since: 1.0.0 on macOS, 1.2.0 on GTK

 * \`unconsumed:\`

   Do not consume the input. By default, a keybind will consume the input,
   meaning that the associated encoding (if any) will not be sent to the
   running program in the terminal. If you wish to send the encoded value
   to the program, specify the \`unconsumed:\` prefix before the entire
   keybind. For example: \`unconsumed:ctrl+a=reload_config\`. \`global:\` and
   \`all:\`-prefixed keybinds will always consume the input regardless of
   this setting. Since they are not associated with a specific terminal
   surface, they're never encoded.

   Available since: 1.0.0

 * \`performable:\`

   Only consume the input if the action is able to be performed.
   For example, the \`copy_to_clipboard\` action will only consume the input
   if there is a selection to copy. If there is no selection, Ghostty
   behaves as if the keybind was not set. This has no effect with \`global:\`
   or \`all:\`-prefixed keybinds. For key sequences, this will reset the
   sequence if the action is not performable (acting identically to not
   having a keybind set at all).

   Performable keybinds will not appear as menu shortcuts in the
   application menu. This is because the menu shortcuts force the
   action to be performed regardless of the state of the terminal.
   Performable keybinds will still work, they just won't appear as
   a shortcut label in the menu.

   Available since: 1.1.0

Keybind triggers are not unique per prefix combination. For example,
\`ctrl+a\` and \`global:ctrl+a\` are not two separate keybinds. The keybind
set later will overwrite the keybind set earlier. In this case, the
\`global:\` keybind will be used.

Multiple prefixes can be specified. For example,
\`global:unconsumed:ctrl+a=reload_config\` will make the keybind global
and not consume the input to reload the config.

Note: \`global:\` is only supported on macOS and certain Linux platforms.

On macOS, this feature requires accessibility permissions to be granted
to Ghostty. When a \`global:\` keybind is specified and Ghostty is launched
or reloaded, Ghostty will attempt to request these permissions.
If the permissions are not granted, the keybind will not work. On macOS,
you can find these permissions in System Preferences -> Privacy & Security
-> Accessibility.

On Linux, you need a desktop environment that implements the
[Global Shortcuts](https://flatpak.github.io/xdg-desktop-portal/docs/doc-org.freedesktop.portal.GlobalShortcuts.html)
protocol as a part of its XDG desktop protocol implementation.
Desktop environments that are known to support (or not support)
global shortcuts include:

 - Users using KDE Plasma (since [5.27](https://kde.org/announcements/plasma/5/5.27.0/#wayland))
   and GNOME (since [48](https://release.gnome.org/48/#and-thats-not-all)) should be able
   to use global shortcuts with little to no configuration.

 - Some manual configuration is required on Hyprland. Consult the steps
   outlined on the [Hyprland Wiki](https://wiki.hyprland.org/Configuring/Binds/#dbus-global-shortcuts)
   to set up global shortcuts correctly.
   (Important: [\`xdg-desktop-portal-hyprland\`](https://wiki.hyprland.org/Hypr-Ecosystem/xdg-desktop-portal-hyprland/)
   must also be installed!)

 - Notably, global shortcuts have not been implemented on wlroots-based
   compositors like Sway (see [upstream issue](https://github.com/emersion/xdg-desktop-portal-wlr/issues/240)).

## Chained Actions

A keybind can have multiple actions by using the \`chain\` keyword for
subsequent actions. When a keybind is activated, all chained actions are
executed in order. The syntax is:

\`\`\`ini
keybind = ctrl+a=new_window
keybind = chain=goto_split:left
\`\`\`

This binds \`ctrl+a\` to first open a new window, then move focus to the
left split. Each \`chain\` entry appends an action to the most recently
defined keybind. You can chain as many actions as you want:

\`\`\`ini
keybind = ctrl+a=new_window
keybind = chain=goto_split:left
keybind = chain=toggle_fullscreen
\`\`\`

Chained actions cannot have prefixes like \`global:\` or \`unconsumed:\`.
The flags from the original keybind apply to the entire chain.

Chained actions work with key sequences as well. For example:

\`\`\`ini
keybind = ctrl+a>n=new_window
keybind = chain=goto_split:left
\`\`\`\`

Chains with key sequences apply to the most recent binding in the
sequence.

Chained keybinds are available since Ghostty 1.3.0.

## Key Tables

You may also create a named set of keybindings known as a "key table."
A key table must be explicitly activated for the bindings to become
available. This can be used to implement features such as a
"copy mode", "vim mode", etc. Generically, this can implement modal
keyboard input.

Key tables are defined using the syntax \`<table>/<binding>\`. The
\`<binding>\` value is everything documented above for keybinds. The
\`<table>\` value is the name of the key table. Table names can contain
anything except \`/\`, \`=\`, \`+\`, and \`>\`. The characters \`+\` and \`>\` are
reserved for keybind syntax (modifier combinations and key sequences).
For example \`foo/ctrl+a=new_window\` defines a binding within a table
named \`foo\`.

Tables are activated and deactivated using the binding actions
\`activate_key_table:<name>\` and \`deactivate_key_table\`. Other table
related binding actions also exist; see the documentation for a full list.
These are the primary way to interact with key tables.

Binding lookup proceeds from the innermost table outward, so keybinds in
the default table remain available unless explicitly unbound in an inner
table.

A key table has some special syntax and handling:

  * \`<name>/\` (with no binding) defines and clears a table, resetting all
    of its keybinds and settings.

  * You cannot activate a table that is already the innermost table; such
    attempts are ignored. However, the same table can appear multiple times
    in the stack as long as it is not innermost (e.g., \`A -> B -> A -> B\`
    is valid, but \`A -> B -> B\` is not).

  * A table can be activated in one-shot mode using
    \`activate_key_table_once:<name>\`. A one-shot table is automatically
    deactivated when any non-catch-all binding is invoked.

  * Key sequences work within tables: \`foo/ctrl+a>ctrl+b=new_window\`.
    If an invalid key is pressed, the sequence ends but the table remains
    active.

  * Prefixes like \`global:\` work within tables:
    \`foo/global:ctrl+a=new_window\`.

Key tables are available since Ghostty 1.3.0.`,
        repeatable: true,
        platform: ["macos", "linux"],
        since: "1.0.0",
    },
    {
        key: "key-remap",
        type: "key-remap",
        default: undefined,
        description: `Remap modifier keys within Ghostty. This allows you to swap or reassign
modifier keys at the application level without affecting system-wide
settings.

The format is \`from=to\` where both \`from\` and \`to\` are modifier key names.
You can use generic names like \`ctrl\`, \`alt\`, \`shift\`, \`super\` (macOS:
\`cmd\`/\`command\`) or sided names like \`left_ctrl\`, \`right_alt\`, etc.

This will NOT change keyboard layout or key encodings outside of Ghostty.
For example, on macOS, \`option+a\` may still produce \`å\` even if \`option\` is
remapped to \`ctrl\`. Desktop environments usually handle key layout long
before Ghostty receives the key events.

Example:

    key-remap = ctrl=super
    key-remap = left_control=right_alt

Important notes:

* This is a one-way remap. If you remap \`ctrl=super\`, then the physical
  Ctrl key acts as Super, but the Super key remains Super.

* Remaps are not transitive. If you remap \`ctrl=super\` and \`alt=ctrl\`,
  pressing Alt will produce Ctrl, NOT Super.

* This affects both keybind matching and terminal input encoding.
  This does NOT impact keyboard layout or how keys are interpreted
  prior to Ghostty receiving them. For example, \`option+a\` on macOS
  may still produce \`å\` even if \`option\` is remapped to \`ctrl\`.

* Generic modifiers (e.g. \`ctrl\`) match both left and right physical keys.
  Use sided names (e.g. \`left_ctrl\`) to remap only one side.

There are other edge case scenarios that may not behave as expected
but are working as intended the way this feature is designed:

* On macOS, bindings in the main menu will trigger before any remapping
  is done. This is because macOS itself handles menu activation and
  this happens before Ghostty receives the key event. To workaround
  this, you should unbind the menu items and rebind them using your
  desired modifier.

This configuration can be repeated to specify multiple remaps.`,
    },
    {
        key: "window-padding-x",
        type: "window-padding",
        default: undefined,
        description: `Horizontal window padding. This applies padding between the terminal cells
and the left and right window borders. The value is in points, meaning that
it will be scaled appropriately for screen DPI.

If this value is set too large, the screen will render nothing, because the
grid will be completely squished by the padding. It is up to you as the user
to pick a reasonable value. If you pick an unreasonable value, a warning
will appear in the logs.

Changing this configuration at runtime will only affect new terminals, i.e.
new windows, tabs, etc.

To set a different left and right padding, specify two numerical values
separated by a comma. For example, \`window-padding-x = 2,4\` will set the
left padding to 2 and the right padding to 4. If you want to set both
paddings to the same value, you can use a single value. For example,
\`window-padding-x = 2\` will set both paddings to 2.`,
    },
    {
        key: "window-padding-y",
        type: "window-padding",
        default: undefined,
        description: `Vertical window padding. This applies padding between the terminal cells and
the top and bottom window borders. The value is in points, meaning that it
will be scaled appropriately for screen DPI.

If this value is set too large, the screen will render nothing, because the
grid will be completely squished by the padding. It is up to you as the user
to pick a reasonable value. If you pick an unreasonable value, a warning
will appear in the logs.

Changing this configuration at runtime will only affect new terminals,
i.e. new windows, tabs, etc.

To set a different top and bottom padding, specify two numerical values
separated by a comma. For example, \`window-padding-y = 2,4\` will set the
top padding to 2 and the bottom padding to 4. If you want to set both
paddings to the same value, you can use a single value. For example,
\`window-padding-y = 2\` will set both paddings to 2.`,
    },
    {
        key: "window-padding-balance",
        type: "bool",
        default: false,
        description: `The viewport dimensions are usually not perfectly divisible by the cell
size. In this case, some extra padding on the end of a column and the bottom
of the final row may exist. If this is \`true\`, then this extra padding
is automatically balanced between all four edges to minimize imbalance on
one side. If this is \`false\`, the top left grid cell will always hug the
edge with zero padding other than what may be specified with the other
\`window-padding\` options.

If other \`window-padding\` fields are set and this is \`true\`, this will still
apply. The other padding is applied first and may affect how many grid cells
actually exist, and this is applied last in order to balance the padding
given a certain viewport size and grid cell size.`,
    },
    {
        key: "window-padding-color",
        type: "enum",
        default: "background",
        description: `The color of the padding area of the window. Valid values are:

* \`background\` - The background color specified in \`background\`.
* \`extend\` - Extend the background color of the nearest grid cell.
* \`extend-always\` - Same as "extend" but always extends without applying
  any of the heuristics that disable extending noted below.

The "extend" value will be disabled in certain scenarios. On primary
screen applications (e.g. not something like Neovim), the color will not
be extended vertically if any of the following are true:

* The nearest row has any cells that have the default background color.
  The thinking is that in this case, the default background color looks
  fine as a padding color.
* The nearest row is a prompt row (requires shell integration). The
  thinking here is that prompts often contain powerline glyphs that
  do not look good extended.
* The nearest row contains a perfect fit powerline character. These
  don't look good extended.`,
        enum: ["background", "extend", "extend-always"],
    },
    {
        key: "window-vsync",
        type: "bool",
        default: true,
        description: `Synchronize rendering with the screen refresh rate. If true, this will
minimize tearing and align redraws with the screen but may cause input
latency. If false, this will maximize redraw frequency but may cause tearing,
and under heavy load may use more CPU and power.

This defaults to true because out-of-sync rendering on macOS can
cause kernel panics (macOS 14.4+) and performance issues for external
displays over some hardware such as DisplayLink. If you want to minimize
input latency, set this to false with the known aforementioned risks.

Changing this value at runtime will only affect new terminals.

This setting is only supported currently on macOS.`,
        platform: ["macos"],
    },
    {
        key: "window-inherit-working-directory",
        type: "bool",
        default: true,
        description: `If true, new windows will inherit the working directory of the
previously focused window. If no window was previously focused, the default
working directory will be used (the \`working-directory\` option).`,
    },
    {
        key: "tab-inherit-working-directory",
        type: "bool",
        default: true,
        description: `If true, new tabs will inherit the working directory of the
previously focused tab. If no tab was previously focused, the default
working directory will be used (the \`working-directory\` option).`,
    },
    {
        key: "split-inherit-working-directory",
        type: "bool",
        default: true,
        description: `If true, new split panes will inherit the working directory of the
previously focused split. If no split was previously focused, the default
working directory will be used (the \`working-directory\` option).`,
    },
    {
        key: "window-inherit-font-size",
        type: "bool",
        default: true,
        description: `If true, new windows and tabs will inherit the font size of the previously
focused window. If no window was previously focused, the default font size
will be used. If this is false, the default font size specified in the
configuration \`font-size\` will be used.`,
    },
    {
        key: "window-decoration",
        type: "enum",
        default: "auto",
        description: `Configure a preference for window decorations. This setting specifies
a _preference_; the actual OS, desktop environment, window manager, etc.
may override this preference. Ghostty will do its best to respect this
preference but it may not always be possible.

Valid values:

 * \`none\`

   All window decorations will be disabled. Titlebar, borders, etc. will
   not be shown. On macOS, this will also disable tabs (enforced by the
   system).

 * \`auto\`

   Automatically decide to use either client-side or server-side
   decorations based on the detected preferences of the current OS and
   desktop environment. This option usually makes Ghostty look the most
   "native" for your desktop.

 * \`client\`

   Prefer client-side decorations.

   Available since: 1.1.0

 * \`server\`

   Prefer server-side decorations. This is only relevant on Linux with GTK,
   either on X11, or Wayland on a compositor that supports the
   \`org_kde_kwin_server_decoration\` protocol (e.g. KDE Plasma, but almost
   any non-GNOME desktop supports this protocol).

   If \`server\` is set but the environment doesn't support server-side
   decorations, client-side decorations will be used instead.

   Available since: 1.1.0

The default value is \`auto\`.

For the sake of backwards compatibility and convenience, this setting also
accepts boolean true and false values. If set to \`true\`, this is equivalent
to \`auto\`. If set to \`false\`, this is equivalent to \`none\`.
This is convenient for users who live primarily on systems that don't
differentiate between client and server-side decorations (e.g. macOS and
Windows).

The "toggle_window_decorations" keybind action can be used to create
a keybinding to toggle this setting at runtime.

macOS: To hide the titlebar without removing the native window borders
       or rounded corners, use \`macos-titlebar-style = hidden\` instead.`,
        enum: ["auto", "client", "server", "none"],
        platform: ["linux"],
        since: "1.1.0",
    },
    {
        key: "window-title-font-family",
        type: "string",
        default: undefined,
        description: `The font that will be used for the application's window and tab titles.

If this setting is left unset, the system default font will be used.

Note: any font available on the system may be used, this font is not
required to be a fixed-width font.

Available since: 1.0.0 on macOS, 1.1.0 on GTK`,
    },
    {
        key: "window-subtitle",
        type: "enum",
        default: false,
        description: `The text that will be displayed in the subtitle of the window. Valid values:

  * \`false\` - Disable the subtitle.
  * \`working-directory\` - Set the subtitle to the working directory of the
     surface.

This feature is only supported on GTK.

Available since: 1.1.0`,
        enum: ["false", "working-directory"],
        since: "1.1.0",
    },
    {
        key: "window-theme",
        type: "enum",
        default: "auto",
        description: `The theme to use for the windows. Valid values:

  * \`auto\` - Determine the theme based on the configured terminal
     background color. This has no effect if the "theme" configuration
     has separate light and dark themes. In that case, the behavior
     of "auto" is equivalent to "system".
  * \`system\` - Use the system theme.
  * \`light\` - Use the light theme regardless of system theme.
  * \`dark\` - Use the dark theme regardless of system theme.
  * \`ghostty\` - Use the background and foreground colors specified in the
    Ghostty configuration. This is only supported on Linux builds.

On macOS, if \`macos-titlebar-style\` is \`tabs\` or \`transparent\`, the window theme will be
automatically set based on the luminosity of the terminal background color.
This only applies to terminal windows. This setting will still apply to
non-terminal windows within Ghostty.

This is currently only supported on macOS and Linux.`,
        enum: ["auto", "system", "light", "dark", "ghostty"],
        platform: ["macos", "linux"],
    },
    {
        key: "window-colorspace",
        type: "enum",
        default: "srgb",
        description: `The color space to use when interpreting terminal colors. "Terminal colors"
refers to colors specified in your configuration and colors produced by
direct-color SGR sequences.

Valid values:

  * \`srgb\` - Interpret colors in the sRGB color space. This is the default.
  * \`display-p3\` - Interpret colors in the Display P3 color space.

This setting is currently only supported on macOS.`,
        enum: ["srgb", "display-p3"],
        platform: ["macos"],
    },
    {
        key: "window-height",
        type: "uint",
        default: 0,
        description: `The initial window size. This size is in terminal grid cells by default.
Both values must be set to take effect. If only one value is set, it is
ignored.

We don't currently support specifying a size in pixels but a future change
can enable that. If this isn't specified, the app runtime will determine
some default size.

Note that the window manager may put limits on the size or override the
size. For example, a tiling window manager may force the window to be a
certain size to fit within the grid. There is nothing Ghostty will do about
this, but it will make an effort.

Sizes larger than the screen size will be clamped to the screen size.
This can be used to create a maximized-by-default window size.

This will not affect new tabs, splits, or other nested terminal elements.
This only affects the initial window size of any new window. Changing this
value will not affect the size of the window after it has been created. This
is only used for the initial size.

BUG: On Linux with GTK, the calculated window size will not properly take
into account window decorations. As a result, the grid dimensions will not
exactly match this configuration. If window decorations are disabled (see
\`window-decoration\`), then this will work as expected.

Windows smaller than 10 wide by 4 high are not allowed.`,
    },
    {
        key: "window-width",
        type: "uint",
        default: 0,
        description: ``,
    },
    {
        key: "window-position-x",
        type: "int",
        default: undefined,
        description: `The starting window position. This position is in pixels and is relative
to the top-left corner of the primary monitor. Both values must be set to take
effect. If only one value is set, it is ignored.

Note that the window manager may put limits on the position or override
the position. For example, a tiling window manager may force the window
to be a certain position to fit within the grid. There is nothing Ghostty
will do about this, but it will make an effort.

Also note that negative values are also up to the operating system and
window manager. Some window managers may not allow windows to be placed
off-screen.

Invalid positions are runtime-specific, but generally the positions are
clamped to the nearest valid position.

On macOS, the window position is relative to the top-left corner of
the visible screen area. This means that if the menu bar is visible, the
window will be placed below the menu bar.

Note: this is only supported on macOS. The GTK runtime does not support
setting the window position, as windows are only allowed position
themselves in X11 and not Wayland.`,
        platform: ["macos"],
    },
    {
        key: "window-position-y",
        type: "int",
        default: undefined,
        description: ``,
    },
    {
        key: "window-save-state",
        type: "enum",
        default: "default",
        description: `Whether to enable saving and restoring window state. Window state includes
their position, size, tabs, splits, etc. Some window state requires shell
integration, such as preserving working directories. See \`shell-integration\`
for more information.

There are three valid values for this configuration:

  * \`default\` will use the default system behavior. On macOS, this
    will only save state if the application is forcibly terminated
    or if it is configured systemwide via Settings.app.

  * \`never\` will never save window state.

  * \`always\` will always save window state whenever Ghostty is exited.

If you change this value to \`never\` while Ghostty is not running, the next
Ghostty launch will NOT restore the window state.

If you change this value to \`default\` while Ghostty is not running and the
previous exit saved state, the next Ghostty launch will still restore the
window state. This is because Ghostty cannot know if the previous exit was
due to a forced save or not (macOS doesn't provide this information).

If you change this value so that window state is saved while Ghostty is not
running, the previous window state will not be restored because Ghostty only
saves state on exit if this is enabled.

The default value is \`default\`.

This is currently only supported on macOS. This has no effect on Linux.`,
        enum: ["default", "never", "always"],
        platform: ["macos", "linux"],
    },
    {
        key: "window-step-resize",
        type: "bool",
        default: false,
        description: `Resize the window in discrete increments of the focused surface's cell size.
If this is disabled, surfaces are resized in pixel increments. Currently
only supported on macOS.`,
        platform: ["macos"],
    },
    {
        key: "window-new-tab-position",
        type: "enum",
        default: "current",
        description: `The position where new tabs are created. Valid values:

  * \`current\` - Insert the new tab after the currently focused tab,
    or at the end if there are no focused tabs.

  * \`end\` - Insert the new tab at the end of the tab list.`,
        enum: ["current", "end"],
    },
    {
        key: "window-show-tab-bar",
        type: "enum",
        default: "auto",
        description: `Whether to show the tab bar.

Valid values:

 - \`always\`

   Always display the tab bar, even when there's only one tab.

   Available since: 1.2.0

 - \`auto\` *(default)*

   Automatically show and hide the tab bar. The tab bar is only
   shown when there are two or more tabs present.

 - \`never\`

   Never show the tab bar. Tabs are only accessible via the tab
   overview or by keybind actions.

Currently only supported on Linux (GTK).`,
        enum: ["always", "auto", "never"],
        platform: ["linux"],
        since: "1.2.0",
    },
    {
        key: "window-titlebar-background",
        type: "color",
        default: undefined,
        description: `Background color for the window titlebar. This only takes effect if
window-theme is set to ghostty. Currently only supported in the GTK app
runtime.

Specified as either hex (\`#RRGGBB\` or \`RRGGBB\`) or a named X11 color.`,
    },
    {
        key: "window-titlebar-foreground",
        type: "color",
        default: undefined,
        description: `Foreground color for the window titlebar. This only takes effect if
window-theme is set to ghostty. Currently only supported in the GTK app
runtime.

Specified as either hex (\`#RRGGBB\` or \`RRGGBB\`) or a named X11 color.`,
    },
    {
        key: "resize-overlay",
        type: "enum",
        default: "after-first",
        description: `This controls when resize overlays are shown. Resize overlays are a
transient popup that shows the size of the terminal while the surfaces are
being resized. The possible options are:

  * \`always\` - Always show resize overlays.
  * \`never\` - Never show resize overlays.
  * \`after-first\` - The resize overlay will not appear when the surface
                    is first created, but will show up if the surface is
                    subsequently resized.

The default is \`after-first\`.`,
        enum: ["always", "never", "after-first"],
    },
    {
        key: "resize-overlay-position",
        type: "enum",
        default: "center",
        description: `If resize overlays are enabled, this controls the position of the overlay.
The possible options are:

  * \`center\`
  * \`top-left\`
  * \`top-center\`
  * \`top-right\`
  * \`bottom-left\`
  * \`bottom-center\`
  * \`bottom-right\`

The default is \`center\`.`,
        enum: ["center", "top-left", "top-center", "top-right", "bottom-left", "bottom-center", "bottom-right"],
    },
    {
        key: "resize-overlay-duration",
        type: "duration",
        default: "750ms",
        description: `If resize overlays are enabled, this controls how long the overlay is
visible on the screen before it is hidden. The default is ¾ of a second or
750 ms.

The duration is specified as a series of numbers followed by time units.
Whitespace is allowed between numbers and units. Each number and unit will
be added together to form the total duration.

The allowed time units are as follows:

  * \`y\` - 365 SI days, or 8760 hours, or 31536000 seconds. No adjustments
    are made for leap years or leap seconds.
  * \`d\` - one SI day, or 86400 seconds.
  * \`h\` - one hour, or 3600 seconds.
  * \`m\` - one minute, or 60 seconds.
  * \`s\` - one second.
  * \`ms\` - one millisecond, or 0.001 second.
  * \`us\` or \`µs\` - one microsecond, or 0.000001 second.
  * \`ns\` - one nanosecond, or 0.000000001 second.

Examples:
  * \`1h30m\`
  * \`45s\`

Units can be repeated and will be added together. This means that
\`1h1h\` is equivalent to \`2h\`. This is confusing and should be avoided.
A future update may disallow this.

The maximum value is \`584y 49w 23h 34m 33s 709ms 551µs 615ns\`. Any
value larger than this will be clamped to the maximum value.

Available since 1.0.0`,
        since: "1.0.0",
    },
    {
        key: "focus-follows-mouse",
        type: "bool",
        default: false,
        description: `If true, when there are multiple split panes, the mouse selects the pane
that is focused. This only applies to the currently focused window; e.g.
mousing over a split in an unfocused window will not focus that split
and bring the window to front.

Default is false.`,
    },
    {
        key: "clipboard-read",
        type: "enum",
        default: "ask",
        description: `Whether to allow programs running in the terminal to read/write to the
system clipboard (OSC 52, for googling). The default is to allow clipboard
reading after prompting the user and allow writing unconditionally.

Valid values are:

  * \`ask\`
  * \`allow\`
  * \`deny\``,
        enum: ["allow", "deny", "ask"],
    },
    {
        key: "clipboard-write",
        type: "enum",
        default: "allow",
        description: ``,
        enum: ["allow", "deny", "ask"],
    },
    {
        key: "clipboard-trim-trailing-spaces",
        type: "bool",
        default: true,
        description: `Trims trailing whitespace on data that is copied to the clipboard. This does
not affect data sent to the clipboard via \`clipboard-write\`. This only
applies to trailing whitespace on lines that have other characters.
Completely blank lines always have their whitespace trimmed.`,
    },
    {
        key: "clipboard-paste-protection",
        type: "bool",
        default: true,
        description: `Require confirmation before pasting text that appears unsafe. This helps
prevent a "copy/paste attack" where a user may accidentally execute unsafe
commands by pasting text with newlines.`,
    },
    {
        key: "clipboard-paste-bracketed-safe",
        type: "bool",
        default: true,
        description: `If true, bracketed pastes will be considered safe. By default, bracketed
pastes are considered safe. "Bracketed" pastes are pastes while the running
program has bracketed paste mode enabled (a setting set by the running
program, not the terminal emulator).`,
    },
    {
        key: "title-report",
        type: "bool",
        default: false,
        description: `Enables or disabled title reporting (CSI 21 t). This escape sequence
allows the running program to query the terminal title. This is a common
security issue and is disabled by default.

Warning: This can expose sensitive information at best and enable
arbitrary code execution at worst (with a maliciously crafted title
and a minor amount of user interaction).

Available since: 1.0.1`,
        since: "1.0.1",
    },
    {
        key: "image-storage-limit",
        type: "uint",
        default: 320000000,
        description: `The total amount of bytes that can be used for image data (e.g. the Kitty
image protocol) per terminal screen. The maximum value is 4,294,967,295
(4GiB). The default is 320MB. If this is set to zero, then all image
protocols will be disabled.

This value is separate for primary and alternate screens so the effective
limit per surface is double.`,
    },
    {
        key: "copy-on-select",
        type: "enum",
        default: undefined,
        description: `Whether to automatically copy selected text to the clipboard. \`true\`
will prefer to copy to the selection clipboard, otherwise it will copy to
the system clipboard.

The value \`clipboard\` will always copy text to the selection clipboard
as well as the system clipboard.

Middle-click paste will always use the selection clipboard. Middle-click
paste is always enabled even if this is \`false\`.

The default value is true on Linux and macOS.`,
        enum: ["false", "true", "clipboard"],
    },
    {
        key: "right-click-action",
        type: "enum",
        default: "context-menu",
        description: `The action to take when the user right-clicks on the terminal surface.

Valid values:
  * \`context-menu\` - Show the context menu.
  * \`paste\` - Paste the contents of the clipboard.
  * \`copy\` - Copy the selected text to the clipboard.
  * \`copy-or-paste\` - If there is a selection, copy the selected text to
     the clipboard; otherwise, paste the contents of the clipboard.
  * \`ignore\` - Do nothing, ignore the right-click.

The default value is \`context-menu\`.`,
        enum: ["ignore", "paste", "copy", "copy-or-paste", "context-menu"],
    },
    {
        key: "click-repeat-interval",
        type: "uint",
        default: 0,
        description: `The time in milliseconds between clicks to consider a click a repeat
(double, triple, etc.) or an entirely new single click. A value of zero will
use a platform-specific default. The default on macOS is determined by the
OS settings. On every other platform it is 500ms.`,
    },
    {
        key: "config-file",
        type: "path",
        default: undefined,
        description: `Additional configuration files to read. This configuration can be repeated
to read multiple configuration files. Configuration files themselves can
load more configuration files. Paths are relative to the file containing the
\`config-file\` directive. For command-line arguments, paths are relative to
the current working directory.

Prepend a ? character to the file path to suppress errors if the file does
not exist. If you want to include a file that begins with a literal ?
character, surround the file path in double quotes (").

Cycles are not allowed. If a cycle is detected, an error will be logged and
the configuration file will be ignored.

Configuration files are loaded after the configuration they're defined
within in the order they're defined. **THIS IS A VERY SUBTLE BUT IMPORTANT
POINT.** To put it another way: configuration files do not take effect
until after the entire configuration is loaded. For example, in the
configuration below:

\`\`\`
config-file = "foo"
a = 1
\`\`\`

If "foo" contains \`a = 2\`, the final value of \`a\` will be 2, because
\`foo\` is loaded after the configuration file that configures the
nested \`config-file\` value.`,
        repeatable: true,
    },
    {
        key: "config-default-files",
        type: "bool",
        default: true,
        description: `When this is true, the default configuration file paths will be loaded.
The default configuration file paths are currently only the XDG
config path ($XDG_CONFIG_HOME/ghostty/config.ghostty).

If this is false, the default configuration paths will not be loaded.
This is targeted directly at using Ghostty from the CLI in a way
that minimizes external effects.

This is a CLI-only configuration. Setting this in a configuration file
will have no effect. It is not an error, but it will not do anything.
This configuration can only be set via CLI arguments.`,
    },
    {
        key: "confirm-close-surface",
        type: "enum",
        default: true,
        description: `Confirms that a surface should be closed before closing it.

This defaults to \`true\`. If set to \`false\`, surfaces will close without
any confirmation. This can also be set to \`always\`, which will always
confirm closing a surface, even if shell integration says a process isn't
running.`,
        enum: ["false", "true", "always"],
    },
    {
        key: "quit-after-last-window-closed",
        type: "bool",
        default: undefined,
        description: `Whether or not to quit after the last surface is closed.

This defaults to \`false\` on macOS since that is standard behavior for
a macOS application. On Linux, this defaults to \`true\` since that is
generally expected behavior.

On Linux, if this is \`true\`, Ghostty can delay quitting fully until a
configurable amount of time has passed after the last window is closed.
See the documentation of \`quit-after-last-window-closed-delay\`.`,
    },
    {
        key: "quit-after-last-window-closed-delay",
        type: "duration",
        default: undefined,
        description: `Controls how long Ghostty will stay running after the last open surface has
been closed. This only has an effect if \`quit-after-last-window-closed\` is
also set to \`true\`.

The minimum value for this configuration is \`1s\`. Any values lower than
this will be clamped to \`1s\`.

The duration is specified as a series of numbers followed by time units.
Whitespace is allowed between numbers and units. Each number and unit will
be added together to form the total duration.

The allowed time units are as follows:

  * \`y\` - 365 SI days, or 8760 hours, or 31536000 seconds. No adjustments
    are made for leap years or leap seconds.
  * \`d\` - one SI day, or 86400 seconds.
  * \`h\` - one hour, or 3600 seconds.
  * \`m\` - one minute, or 60 seconds.
  * \`s\` - one second.
  * \`ms\` - one millisecond, or 0.001 second.
  * \`us\` or \`µs\` - one microsecond, or 0.000001 second.
  * \`ns\` - one nanosecond, or 0.000000001 second.

Examples:
  * \`1h30m\`
  * \`45s\`

Units can be repeated and will be added together. This means that
\`1h1h\` is equivalent to \`2h\`. This is confusing and should be avoided.
A future update may disallow this.

The maximum value is \`584y 49w 23h 34m 33s 709ms 551µs 615ns\`. Any
value larger than this will be clamped to the maximum value.

By default \`quit-after-last-window-closed-delay\` is unset and
Ghostty will quit immediately after the last window is closed if
\`quit-after-last-window-closed\` is \`true\`.

Only implemented on Linux.`,
        platform: ["linux"],
    },
    {
        key: "initial-window",
        type: "bool",
        default: true,
        description: `This controls whether an initial window is created when Ghostty
is run. Note that if \`quit-after-last-window-closed\` is \`true\` and
\`quit-after-last-window-closed-delay\` is set, setting \`initial-window\` to
\`false\` will mean that Ghostty will quit after the configured delay if no
window is ever created. Only implemented on Linux and macOS.`,
        platform: ["macos", "linux"],
    },
    {
        key: "undo-timeout",
        type: "duration",
        default: "5s",
        description: `The duration that undo operations remain available. After this
time, the operation will be removed from the undo stack and
cannot be undone.

The default value is 5 seconds.

This timeout applies per operation, meaning that if you perform
multiple operations, each operation will have its own timeout.
New operations do not reset the timeout of previous operations.

A timeout of zero will effectively disable undo operations. It is
not possible to set an infinite timeout, but you can set a very
large timeout to effectively disable the timeout (on the order of years).
This is highly discouraged, as it will cause the undo stack to grow
indefinitely, memory usage to grow unbounded, and terminal sessions
to never actually quit.

The duration is specified as a series of numbers followed by time units.
Whitespace is allowed between numbers and units. Each number and unit will
be added together to form the total duration.

The allowed time units are as follows:

  * \`y\` - 365 SI days, or 8760 hours, or 31536000 seconds. No adjustments
    are made for leap years or leap seconds.
  * \`d\` - one SI day, or 86400 seconds.
  * \`h\` - one hour, or 3600 seconds.
  * \`m\` - one minute, or 60 seconds.
  * \`s\` - one second.
  * \`ms\` - one millisecond, or 0.001 second.
  * \`us\` or \`µs\` - one microsecond, or 0.000001 second.
  * \`ns\` - one nanosecond, or 0.000000001 second.

Examples:
  * \`1h30m\`
  * \`45s\`

Units can be repeated and will be added together. This means that
\`1h1h\` is equivalent to \`2h\`. This is confusing and should be avoided.
A future update may disallow this.

This configuration is only supported on macOS. Linux doesn't
support undo operations at all so this configuration has no
effect.

Available since: 1.2.0`,
        platform: ["macos", "linux"],
        since: "1.2.0",
    },
    {
        key: "quick-terminal-position",
        type: "enum",
        default: "top",
        description: `The position of the "quick" terminal window. To learn more about the
quick terminal, see the documentation for the \`toggle_quick_terminal\`
binding action.

Valid values are:

  * \`top\` - Terminal appears at the top of the screen.
  * \`bottom\` - Terminal appears at the bottom of the screen.
  * \`left\` - Terminal appears at the left of the screen.
  * \`right\` - Terminal appears at the right of the screen.
  * \`center\` - Terminal appears at the center of the screen.

On macOS, changing this configuration requires restarting Ghostty
completely.

Note: There is no default keybind for toggling the quick terminal.
To enable this feature, bind the \`toggle_quick_terminal\` action to a key.`,
        enum: ["top", "bottom", "left", "right", "center"],
    },
    {
        key: "quick-terminal-size",
        type: "quick-terminal-size",
        default: undefined,
        description: `The size of the quick terminal.

The size can be specified either as a percentage of the screen dimensions
(height/width), or as an absolute size in pixels. Percentage values are
suffixed with \`%\` (e.g. \`20%\`) while pixel values are suffixed with \`px\`
(e.g. \`300px\`). A bare value without a suffix is a config error.

When only one size is specified, the size parameter affects the size of
the quick terminal on its *primary axis*, which depends on its position:
height for quick terminals placed on the top or bottom, and width for left
or right. The primary axis of a centered quick terminal depends on the
monitor's orientation: height when on a landscape monitor, and width when
on a portrait monitor.

The *secondary axis* would be maximized for non-center positioned
quick terminals unless another size parameter is specified, separated
from the first by a comma (\`,\`). Percentage and pixel sizes can be mixed
together: for instance, a size of \`50%,500px\` for a top-positioned quick
terminal would be half a screen tall, and 500 pixels wide.

Available since: 1.2.0`,
        since: "1.2.0",
    },
    {
        key: "gtk-quick-terminal-layer",
        type: "enum",
        default: "top",
        description: `The layer of the quick terminal window. The higher the layer,
the more windows the quick terminal may conceal.

Valid values are:

 * \`overlay\`

   The quick terminal appears in front of all windows.

 * \`top\` (default)

   The quick terminal appears in front of normal windows but behind
   fullscreen overlays like lock screens.

 * \`bottom\`

   The quick terminal appears behind normal windows but in front of
   wallpapers and other windows in the background layer.

 * \`background\`

   The quick terminal appears behind all windows.

GTK Wayland only.

Available since: 1.2.0`,
        enum: ["overlay", "top", "bottom", "background"],
        platform: ["gtk-wayland"],
        since: "1.2.0",
    },
    {
        key: "gtk-quick-terminal-namespace",
        type: "string",
        default: "ghostty-quick-terminal",
        description: `The namespace for the quick terminal window.

This is an identifier that is used by the Wayland compositor and/or
scripts to determine the type of layer surfaces and to possibly apply
unique effects.

GTK Wayland only.

Available since: 1.2.0`,
        platform: ["gtk-wayland"],
        since: "1.2.0",
    },
    {
        key: "quick-terminal-screen",
        type: "enum",
        default: "main",
        description: `The screen where the quick terminal should show up.

Valid values are:

 * \`main\` - The screen that the operating system recommends as the main
   screen. On macOS, this is the screen that is currently receiving
   keyboard input. This screen is defined by the operating system and
   not chosen by Ghostty.

 * \`mouse\` - The screen that the mouse is currently hovered over.

 * \`macos-menu-bar\` - The screen that contains the macOS menu bar as
   set in the display settings on macOS. This is a bit confusing because
   every screen on macOS has a menu bar, but this is the screen that
   contains the primary menu bar.

The default value is \`main\` because this is the recommended screen
by the operating system.

Only implemented on macOS.`,
        enum: ["main", "mouse", "macos-menu-bar"],
        platform: ["macos"],
    },
    {
        key: "quick-terminal-animation-duration",
        type: "float",
        default: 0.2,
        description: `Duration (in seconds) of the quick terminal enter and exit animation.
Set it to 0 to disable animation completely. This can be changed at
runtime.

Only implemented on macOS.`,
        platform: ["macos"],
    },
    {
        key: "quick-terminal-autohide",
        type: "bool",
        default: undefined,
        description: `Automatically hide the quick terminal when focus shifts to another window.
Set it to false for the quick terminal to remain open even when it loses focus.

Defaults to true on macOS and on false on Linux/BSD. This is because global
shortcuts on Linux require system configuration and are considerably less
accessible than on macOS, meaning that it is more preferable to keep the
quick terminal open until the user has completed their task.
This default may change in the future.`,
    },
    {
        key: "quick-terminal-space-behavior",
        type: "enum",
        default: "move",
        description: `This configuration option determines the behavior of the quick terminal
when switching between macOS spaces. macOS spaces are virtual desktops
that can be manually created or are automatically created when an
application is in full-screen mode.

Valid values are:

 * \`move\` - When switching to another space, the quick terminal will
   also moved to the current space.

 * \`remain\` - The quick terminal will stay only in the space where it
   was originally opened and will not follow when switching to another
   space.

The default value is \`move\`.

Only implemented on macOS.
On Linux the behavior is always equivalent to \`move\`.

Available since: 1.1.0`,
        enum: ["remain", "move"],
        platform: ["macos"],
        since: "1.1.0",
    },
    {
        key: "quick-terminal-keyboard-interactivity",
        type: "enum",
        default: "on-demand",
        description: `Determines under which circumstances that the quick terminal should receive
keyboard input. See the corresponding [Wayland documentation](https://wayland.app/protocols/wlr-layer-shell-unstable-v1#zwlr_layer_surface_v1:enum:keyboard_interactivity)
for a more detailed explanation of the behavior of each option.

> [!NOTE]
> The exact behavior of each option may differ significantly across
> compositors -- experiment with them on your system to find one that
> suits your liking!

Valid values are:

 * \`none\`

   The quick terminal will not receive any keyboard input.

 * \`on-demand\` (default)

   The quick terminal would only receive keyboard input when it is focused.

 * \`exclusive\`

   The quick terminal will always receive keyboard input, even when another
   window is currently focused.

Only has an effect on Linux Wayland.
On macOS the behavior is always equivalent to \`on-demand\`.

Available since: 1.2.0`,
        enum: ["none", "on-demand", "exclusive"],
        platform: ["linux"],
        since: "1.2.0",
    },
    {
        key: "shell-integration",
        type: "enum",
        default: "detect",
        description: `Whether to enable shell integration auto-injection or not. Shell integration
greatly enhances the terminal experience by enabling a number of features:

  * Working directory reporting so new tabs, splits inherit the
    previous terminal's working directory.

  * Prompt marking that enables the "jump_to_prompt" keybinding.

  * If you're sitting at a prompt, closing a terminal will not ask
    for confirmation.

  * Resizing the window with a complex prompt usually paints much
    better.

Allowable values are:

  * \`none\` - Do not do any automatic injection. You can still manually
    configure your shell to enable the integration.

  * \`detect\` - Detect the shell based on the filename.

  * \`bash\`, \`elvish\`, \`fish\`, \`nushell\`, \`zsh\` - Use this specific shell injection scheme.

The default value is \`detect\`.`,
        enum: ["none", "detect", "bash", "elvish", "fish", "nushell", "zsh"],
    },
    {
        key: "shell-integration-features",
        type: "shell-integration-features",
        default: undefined,
        description: `Shell integration features to enable. These require our shell integration
to be loaded, either automatically via shell-integration or manually.

The format of this is a list of features to enable separated by commas. If
you prefix a feature with \`no-\` then it is disabled. If you omit a feature,
its default value is used, so you must explicitly disable features you don't
want. You can also use \`true\` or \`false\` to turn all features on or off.

Example: \`cursor\`, \`no-cursor\`, \`sudo\`, \`no-sudo\`, \`title\`, \`no-title\`

Available features:

  * \`cursor\` - Set the cursor to a bar at the prompt.

  * \`sudo\` - Set sudo wrapper to preserve terminfo.

  * \`title\` - Set the window title via shell integration.

  * \`ssh-env\` - Enable SSH environment variable compatibility. Automatically
    converts TERM from \`xterm-ghostty\` to \`xterm-256color\` when connecting to
    remote hosts and propagates COLORTERM, TERM_PROGRAM, and TERM_PROGRAM_VERSION.
    Whether or not these variables will be accepted by the remote host(s) will
    depend on whether or not the variables are allowed in their sshd_config.
    (Available since: 1.2.0)

  * \`ssh-terminfo\` - Enable automatic terminfo installation on remote hosts.
    Attempts to install Ghostty's terminfo entry using \`infocmp\` and \`tic\` when
    connecting to hosts that lack it. Requires \`infocmp\` to be available locally
    and \`tic\` to be available on remote hosts. Once terminfo is installed on a
    remote host, it will be automatically "cached" to avoid repeat installations.
    If desired, the \`+ssh-cache\` CLI action can be used to manage the installation
    cache manually using various arguments.
    (Available since: 1.2.0)

  * \`path\` - Add Ghostty's binary directory to PATH. This ensures the \`ghostty\`
    command is available in the shell even if shell init scripts reset PATH.
    This is particularly useful on macOS where PATH is often overridden by
    system scripts. The directory is only added if not already present.

SSH features work independently and can be combined for optimal experience:
when both \`ssh-env\` and \`ssh-terminfo\` are enabled, Ghostty will install its
terminfo on remote hosts and use \`xterm-ghostty\` as TERM, falling back to
\`xterm-256color\` with environment variables if terminfo installation fails.`,
    },
    {
        key: "command-palette-entry",
        type: "command-palette-entry",
        default: undefined,
        description: `Custom entries into the command palette.

Each entry requires the title, the corresponding action, and an optional
description. Each field should be prefixed with the field name, a colon
(\`:\`), and then the specified value. The syntax for actions is identical
to the one for keybind actions. Whitespace in between fields is ignored.

If you need to embed commas or any other special characters in the values,
enclose the value in double quotes and it will be interpreted as a Zig
string literal. This is also useful for including whitespace at the
beginning or the end of a value. See the
[Zig documentation](https://ziglang.org/documentation/master/#Escape-Sequences)
for more information on string literals. Note that multiline string literals
are not supported.

Double quotes can not be used around the field names.

\`\`\`ini
command-palette-entry = title:Reset Font Style, action:csi:0m
command-palette-entry = title:Crash on Main Thread,description:Causes a crash on the main (UI) thread.,action:crash:main
command-palette-entry = title:Focus Split: Right,description:"Focus the split to the right, if it exists.",action:goto_split:right
command-palette-entry = title:"Ghostty",description:"Add a little Ghostty to your terminal.",action:"text:\\xf0\\x9f\\x91\\xbb"
\`\`\`

By default, the command palette is preloaded with most actions that might
be useful in an interactive setting yet do not have easily accessible or
memorizable shortcuts. The default entries can be cleared by setting this
setting to an empty value:

\`\`\`ini
command-palette-entry =
\`\`\`

Available since: 1.2.0`,
        repeatable: true,
        since: "1.2.0",
    },
    {
        key: "osc-color-report-format",
        type: "enum",
        default: "16-bit",
        description: `Sets the reporting format for OSC sequences that request color information.
Ghostty currently supports OSC 10 (foreground), OSC 11 (background), and
OSC 4 (256 color palette) queries, and by default the reported values
are scaled-up RGB values, where each component are 16 bits. This is how
most terminals report these values. However, some legacy applications may
require 8-bit, unscaled, components. We also support turning off reporting
altogether. The components are lowercase hex values.

Allowable values are:

  * \`none\` - OSC 4/10/11 queries receive no reply

  * \`8-bit\` - Color components are return unscaled, e.g. \`rr/gg/bb\`

  * \`16-bit\` - Color components are returned scaled, e.g. \`rrrr/gggg/bbbb\`

The default value is \`16-bit\`.`,
        enum: ["none", "8-bit", "16-bit"],
    },
    {
        key: "vt-kam-allowed",
        type: "bool",
        default: false,
        description: `If true, allows the "KAM" mode (ANSI mode 2) to be used within
the terminal. KAM disables keyboard input at the request of the
application. This is not a common feature and is not recommended
to be enabled. This will not be documented further because
if you know you need KAM, you know. If you don't know if you
need KAM, you don't need it.`,
    },
    {
        key: "custom-shader",
        type: "path",
        default: undefined,
        description: `Custom shaders to run after the default shaders. This is a file path
to a GLSL-syntax shader for all platforms.

Warning: Invalid shaders can cause Ghostty to become unusable such as by
causing the window to be completely black. If this happens, you can
unset this configuration to disable the shader.

Custom shader support is based on and compatible with the Shadertoy shaders.
Shaders should specify a \`mainImage\` function and the available uniforms
largely match Shadertoy, with some caveats and Ghostty-specific extensions.

The uniform values available to shaders are as follows:

 * \`sampler2D iChannel0\` - Input texture.

   A texture containing the current terminal screen. If multiple custom
   shaders are specified, the output of previous shaders is written to
   this texture, to allow combining multiple effects.

 * \`vec3 iResolution\` - Output texture size, \`[width, height, 1]\` (in px).

 * \`float iTime\` - Time in seconds since first frame was rendered.

 * \`float iTimeDelta\` - Time in seconds since previous frame was rendered.

 * \`float iFrameRate\` - Average framerate. (NOT CURRENTLY SUPPORTED)

 * \`int iFrame\` - Number of frames that have been rendered so far.

 * \`float iChannelTime[4]\` - Current time for video or sound input. (N/A)

 * \`vec3 iChannelResolution[4]\` - Resolutions of the 4 input samplers.

   Currently only \`iChannel0\` exists, and \`iChannelResolution[0]\` is
   identical to \`iResolution\`.

 * \`vec4 iMouse\` - Mouse input info. (NOT CURRENTLY SUPPORTED)

 * \`vec4 iDate\` - Date/time info. (NOT CURRENTLY SUPPORTED)

 * \`float iSampleRate\` - Sample rate for audio. (N/A)

Ghostty-specific extensions:

 * \`vec4 iCurrentCursor\` - Info about the terminal cursor.

   - \`iCurrentCursor.xy\` is the -X, +Y corner of the current cursor.
   - \`iCurrentCursor.zw\` is the width and height of the current cursor.

 * \`vec4 iPreviousCursor\` - Info about the previous terminal cursor.

 * \`vec4 iCurrentCursorColor\` - Color of the terminal cursor.

 * \`vec4 iPreviousCursorColor\` - Color of the previous terminal cursor.

 * \`float iTimeCursorChange\` - Timestamp of terminal cursor change.

   When the terminal cursor changes position or color, this is set to
   the same time as the \`iTime\` uniform, allowing you to compute the
   time since the change by subtracting this from \`iTime\`.

 * \`float iTimeFocus\` - Timestamp when the surface last gained iFocus.

   When the surface gains focus, this is set to the current value of
   \`iTime\`, similar to how \`iTimeCursorChange\` works. This allows you
   to compute the time since focus was gained or lost by calculating
   \`iTime - iTimeFocus\`. Use this to create animations that restart
   when the terminal regains focus.

 * \`int iFocus\` - Current focus state of the surface.

   Set to 1.0 when the surface is focused, 0.0 when unfocused. This
   allows shaders to detect unfocused state and avoid animation artifacts
   from large time deltas caused by infrequent "deceptive frames"
   (e.g., modifier key presses, link hover events in unfocused split panes).
   Check \`iFocus > 0\` to determine if the surface is currently focused.

 * \`vec3 iPalette[256]\` - The 256-color terminal palette.

   RGB values for all 256 colors in the terminal palette, normalized
   to [0.0, 1.0]. Index 0-15 are the ANSI colors, 16-231 are the 6x6x6
   color cube, and 232-255 are the grayscale colors.

 * \`vec3 iBackgroundColor\` - Terminal background color (RGB).

 * \`vec3 iForegroundColor\` - Terminal foreground color (RGB).

 * \`vec3 iCursorColor\` - Terminal cursor color (RGB).

 * \`vec3 iCursorText\` - Terminal cursor text color (RGB).

 * \`vec3 iSelectionBackgroundColor\` - Selection background color (RGB).

 * \`vec3 iSelectionForegroundColor\` - Selection foreground color (RGB).

If the shader fails to compile, the shader will be ignored. Any errors
related to shader compilation will not show up as configuration errors
and only show up in the log, since shader compilation happens after
configuration loading on the dedicated render thread.  For interactive
development, use [shadertoy.com](https://shadertoy.com).

This can be repeated multiple times to load multiple shaders. The shaders
will be run in the order they are specified.

This can be changed at runtime and will affect all open terminals.`,
        repeatable: true,
    },
    {
        key: "custom-shader-animation",
        type: "enum",
        default: true,
        description: `If \`true\` (default), the focused terminal surface will run an animation
loop when custom shaders are used. This uses slightly more CPU (generally
less than 10%) but allows the shader to animate. This only runs if there
are custom shaders and the terminal is focused.

If this is set to \`false\`, the terminal and custom shader will only render
when the terminal is updated. This is more efficient but the shader will
not animate.

This can also be set to \`always\`, which will always run the animation
loop regardless of whether the terminal is focused or not. The animation
loop will still only run when custom shaders are used. Note that this
will use more CPU per terminal surface and can become quite expensive
depending on the shader and your terminal usage.

This can be changed at runtime and will affect all open terminals.`,
        enum: ["false", "true", "always"],
    },
    {
        key: "bell-features",
        type: "bell-features",
        default: undefined,
        description: `Bell features to enable if bell support is available in your runtime. Not
all features are available on all runtimes. The format of this is a list of
features to enable separated by commas. If you prefix a feature with \`no-\`
then it is disabled. If you omit a feature, its default value is used.

Valid values are:

 * \`system\`

   Instruct the system to notify the user using built-in system functions.
   This could result in an audiovisual effect, a notification, or something
   else entirely. Changing these effects require altering system settings:
   for instance under the "Sound > Alert Sound" setting in GNOME,
   or the "Accessibility > System Bell" settings in KDE Plasma.

   On macOS, this plays the system alert sound.

 * \`audio\`

   Play a custom sound. (GTK only)

 * \`attention\` *(enabled by default)*

   Request the user's attention when Ghostty is unfocused, until it has
   received focus again. On macOS, this will bounce the app icon in the
   dock once. On Linux, the behavior depends on the desktop environment
   and/or the window manager/compositor:

   - On KDE, the background of the desktop icon in the task bar would be
     highlighted;

   - On GNOME, you may receive a notification that, when clicked, would
     bring the Ghostty window into focus;

   - On Sway, the window may be decorated with a distinctly colored border;

   - On other systems this may have no effect at all.

 * \`title\` *(enabled by default)*

   Prepend a bell emoji (🔔) to the title of the alerted surface until the
   terminal is re-focused or interacted with (such as on keyboard input).

 * \`border\`

   Display a border around the alerted surface until the terminal is
   re-focused or interacted with (such as on keyboard input).

   Available since: 1.2.0 on GTK, 1.2.1 on macOS

Example: \`audio\`, \`no-audio\`, \`system\`, \`no-system\`

Available since: 1.2.0`,
        platform: ["gtk"],
        since: "1.2.0",
    },
    {
        key: "bell-audio-path",
        type: "path",
        default: undefined,
        description: `If \`audio\` is an enabled bell feature, this is a path to an audio file. If
the path is not absolute, it is considered relative to the directory of the
configuration file that it is referenced from, or from the current working
directory if this is used as a CLI flag. The path may be prefixed with \`~/\`
to reference the user's home directory. (GTK only)

Available since: 1.2.0`,
        platform: ["gtk"],
        since: "1.2.0",
    },
    {
        key: "bell-audio-volume",
        type: "float",
        default: 0.5,
        description: `If \`audio\` is an enabled bell feature, this is the volume to play the audio
file at (relative to the system volume). This is a floating point number
ranging from 0.0 (silence) to 1.0 (as loud as possible). The default is 0.5.
(GTK only)

Available since: 1.2.0`,
        platform: ["gtk"],
        since: "1.2.0",
    },
    {
        key: "app-notifications",
        type: "app-notifications",
        default: undefined,
        description: `Control the in-app notifications that Ghostty shows.

On Linux (GTK), in-app notifications show up as toasts. Toasts appear
overlaid on top of the terminal window. They are used to show information
that is not critical but may be important.

Possible notifications are:

  - \`clipboard-copy\` (default: true) - Show a notification when text is copied
    to the clipboard.
  - \`config-reload\` (default: true) - Show a notification when
    the configuration is reloaded.

To specify a notification to enable, specify the name of the notification.
To specify a notification to disable, prefix the name with \`no-\`. For
example, to disable \`clipboard-copy\`, set this configuration to
\`no-clipboard-copy\`. To enable it, set this configuration to \`clipboard-copy\`.

Multiple notifications can be enabled or disabled by separating them
with a comma.

A value of "false" will disable all notifications. A value of "true" will
enable all notifications.

This configuration only applies to GTK.

Available since: 1.1.0`,
        since: "1.1.0",
    },
    {
        key: "macos-non-native-fullscreen",
        type: "enum",
        default: false,
        description: `If anything other than false, fullscreen mode on macOS will not use the
native fullscreen, but make the window fullscreen without animations and
using a new space. It's faster than the native fullscreen mode since it
doesn't use animations.

Important: tabs DO NOT WORK in this mode. Non-native fullscreen removes
the titlebar and macOS native tabs require the titlebar. If you use tabs,
you should not use this mode.

If you fullscreen a window with tabs, the currently focused tab will
become fullscreen while the others will remain in a separate window in
the background. You can switch to that window using normal window-switching
keybindings such as command+tilde. When you exit fullscreen, the window
will return to the tabbed state it was in before.

Allowable values are:

  * \`true\` - Use non-native macOS fullscreen, hide the menu bar
  * \`false\` - Use native macOS fullscreen
  * \`visible-menu\` - Use non-native macOS fullscreen, keep the menu bar
    visible
  * \`padded-notch\` - Use non-native macOS fullscreen, hide the menu bar,
    but ensure the window is not obscured by the notch on applicable
    devices. The area around the notch will remain transparent currently,
    but in the future we may fill it with the window background color.

Changing this option at runtime works, but will only apply to the next
time the window is made fullscreen. If a window is already fullscreen,
it will retain the previous setting until fullscreen is exited.`,
        enum: ["false", "true", "visible-menu", "padded-notch"],
    },
    {
        key: "macos-window-buttons",
        type: "enum",
        default: "visible",
        description: `Whether the window buttons in the macOS titlebar are visible. The window
buttons are the colored buttons in the upper left corner of most macOS apps,
also known as the traffic lights, that allow you to close, miniaturize, and
zoom the window.

This setting has no effect when \`window-decoration = none\` or
\`macos-titlebar-style = hidden\`, as the window buttons are always hidden in
these modes.

Valid values are:

  * \`visible\` - Show the window buttons.
  * \`hidden\` - Hide the window buttons.

The default value is \`visible\`.

Changing this option at runtime only applies to new windows.

Available since: 1.2.0`,
        enum: ["visible", "hidden"],
        since: "1.2.0",
    },
    {
        key: "macos-titlebar-style",
        type: "enum",
        default: "transparent",
        description: `The style of the macOS titlebar. Available values are: "native",
"transparent", "tabs", and "hidden".

The "native" style uses the native macOS titlebar with zero customization.
The titlebar will match your window theme (see \`window-theme\`).

The "transparent" style is the same as "native" but the titlebar will
be transparent and allow your window background color to come through.
This makes a more seamless window appearance but looks a little less
typical for a macOS application and may not work well with all themes.

The "transparent" style will also update in real-time to dynamic
changes to the window background color, e.g. via OSC 11. To make this
more aesthetically pleasing, this only happens if the terminal is
a window, tab, or split that borders the top of the window. This
avoids a disjointed appearance where the titlebar color changes
but all the topmost terminals don't match.

The "tabs" style is a completely custom titlebar that integrates the
tab bar into the titlebar. This titlebar always matches the background
color of the terminal. There are some limitations to this style:
On macOS 13 and below, saved window state will not restore tabs correctly.
macOS 14 does not have this issue and any other macOS version has not
been tested.

The "hidden" style hides the titlebar. Unlike \`window-decoration = none\`,
however, it does not remove the frame from the window or cause it to have
squared corners. Changing to or from this option at run-time may affect
existing windows in buggy ways.

When "hidden", the top titlebar area can no longer be used for dragging
the window. To drag the window, you can use option+click on the resizable
areas of the frame to drag the window. This is a standard macOS behavior
and not something Ghostty enables.

The default value is "transparent". This is an opinionated choice
but its one I think is the most aesthetically pleasing and works in
most cases.

Changing this option at runtime only applies to new windows.`,
        enum: ["native", "transparent", "tabs", "hidden"],
    },
    {
        key: "macos-titlebar-proxy-icon",
        type: "enum",
        default: "visible",
        description: `Whether the proxy icon in the macOS titlebar is visible. The proxy icon
is the icon that represents the folder of the current working directory.
You can see this very clearly in the macOS built-in Terminal.app
titlebar.

The proxy icon is only visible with the native macOS titlebar style.

Valid values are:

  * \`visible\` - Show the proxy icon.
  * \`hidden\` - Hide the proxy icon.

The default value is \`visible\`.

This setting can be changed at runtime and will affect all currently
open windows but only after their working directory changes again.
Therefore, to make this work after changing the setting, you must
usually \`cd\` to a different directory, open a different file in an
editor, etc.`,
        enum: ["visible", "hidden"],
        platform: ["macos"],
    },
    {
        key: "macos-dock-drop-behavior",
        type: "enum",
        default: "new-tab",
        description: `Controls the windowing behavior when dropping a file or folder
onto the Ghostty icon in the macOS dock.

Valid values are:

  * \`new-tab\` - Create a new tab in the current window, or open
    a new window if none exist.
  * \`new-window\` - Create a new window unconditionally.

The default value is \`new-tab\`.

This setting is only supported on macOS and has no effect on other
platforms.`,
        enum: ["new-tab", "new-window"],
        platform: ["macos"],
    },
    {
        key: "macos-option-as-alt",
        type: "enum",
        default: undefined,
        description: `macOS doesn't have a distinct "alt" key and instead has the "option"
key which behaves slightly differently. On macOS by default, the
option key plus a character will sometimes produce a Unicode character.
For example, on US standard layouts option-b produces "∫". This may be
undesirable if you want to use "option" as an "alt" key for keybindings
in terminal programs or shells.

This configuration lets you change the behavior so that option is treated
as alt.

The default behavior (unset) will depend on your active keyboard
layout. If your keyboard layout is one of the keyboard layouts listed
below, then the default value is "true". Otherwise, the default
value is "false". Keyboard layouts with a default value of "true" are:

  - U.S. Standard
  - U.S. International

Note that if an *Option*-sequence doesn't produce a printable character, it
will be treated as *Alt* regardless of this setting. (e.g. \`alt+ctrl+a\`).

Explicit values that can be set:

If \`true\`, the *Option* key will be treated as *Alt*. This makes terminal
sequences expecting *Alt* to work properly, but will break Unicode input
sequences on macOS if you use them via the *Alt* key.

You may set this to \`false\` to restore the macOS *Alt* key unicode
sequences but this will break terminal sequences expecting *Alt* to work.

The values \`left\` or \`right\` enable this for the left or right *Option*
key, respectively.`,
    },
    {
        key: "macos-window-shadow",
        type: "bool",
        default: true,
        description: `Whether to enable the macOS window shadow. The default value is true.
With some window managers and window transparency settings, you may
find false more visually appealing.`,
    },
    {
        key: "macos-hidden",
        type: "enum",
        default: "never",
        description: `If true, the macOS icon in the dock and app switcher will be hidden. This is
mainly intended for those primarily using the quick-terminal mode.

Note that setting this to true means that keyboard layout changes
will no longer be automatic.

Control whether macOS app is excluded from the dock and app switcher,
a "hidden" state. This is mainly intended for those primarily using
quick-terminal mode, but is a general configuration for any use
case.

Available values:

  * \`never\` - The macOS app is never hidden.
  * \`always\` - The macOS app is always hidden.

Note: When the macOS application is hidden, keyboard layout changes
will no longer be automatic. This is a limitation of macOS.

Available since: 1.2.0`,
        enum: ["never", "always"],
        since: "1.2.0",
    },
    {
        key: "macos-auto-secure-input",
        type: "bool",
        default: true,
        description: `If true, Ghostty on macOS will automatically enable the "Secure Input"
feature when it detects that a password prompt is being displayed.

"Secure Input" is a macOS security feature that prevents applications from
reading keyboard events. This can always be enabled manually using the
\`Ghostty > Secure Keyboard Entry\` menu item.

Note that automatic password prompt detection is based on heuristics
and may not always work as expected. Specifically, it does not work
over SSH connections, but there may be other cases where it also
doesn't work.

A reason to disable this feature is if you find that it is interfering
with legitimate accessibility software (or software that uses the
accessibility APIs), since secure input prevents any application from
reading keyboard events.`,
    },
    {
        key: "macos-secure-input-indication",
        type: "bool",
        default: true,
        description: `If true, Ghostty will show a graphical indication when secure input is
enabled. This indication is generally recommended to know when secure input
is enabled.

Normally, secure input is only active when a password prompt is displayed
or it is manually (and typically temporarily) enabled. However, if you
always have secure input enabled, the indication can be distracting and
you may want to disable it.`,
    },
    {
        key: "macos-icon",
        type: "enum",
        default: "official",
        description: `Customize the macOS app icon.

This only affects the icon that appears in the dock, application
switcher, etc. This does not affect the icon in Finder because
that is controlled by a hardcoded value in the signed application
bundle and can't be changed at runtime. For more details on what
exactly is affected, see the \`NSApplication.icon\` Apple documentation;
that is the API that is being used to set the icon.

Valid values:

 * \`official\` - Use the official Ghostty icon.
 * \`blueprint\`, \`chalkboard\`, \`microchip\`, \`glass\`, \`holographic\`,
   \`paper\`, \`retro\`, \`xray\` - Official variants of the Ghostty icon
   hand-created by artists (no AI).
 * \`custom\` - Use a completely custom icon. The location must be specified
   using the additional \`macos-custom-icon\` configuration
 * \`custom-style\` - Use the official Ghostty icon but with custom
   styles applied to various layers. The custom styles must be
   specified using the additional \`macos-icon\`-prefixed configurations.
   The \`macos-icon-ghost-color\` and \`macos-icon-screen-color\`
   configurations are required for this style.

WARNING: The \`custom-style\` option is _experimental_. We may change
the format of the custom styles in the future. We're still finalizing
the exact layers and customization options that will be available.

Other caveats:

  * The icon in the update dialog will always be the official icon.
    This is because the update dialog is managed through a
    separate framework and cannot be customized without significant
    effort.`,
        enum: ["official", "blueprint", "chalkboard", "microchip", "glass", "holographic", "paper", "retro", "xray", "custom", "custom-style"],
    },
    {
        key: "macos-custom-icon",
        type: "string",
        default: undefined,
        description: `The absolute path to the custom icon file.
Supported formats include PNG, JPEG, and ICNS.

Defaults to \`~/.config/ghostty/Ghostty.icns\``,
    },
    {
        key: "macos-icon-frame",
        type: "enum",
        default: "aluminum",
        description: `The material to use for the frame of the macOS app icon.

Valid values:

 * \`aluminum\` - A brushed aluminum frame. This is the default.
 * \`beige\` - A classic 90's computer beige frame.
 * \`plastic\` - A glossy, dark plastic frame.
 * \`chrome\` - A shiny chrome frame.

Note: This configuration is required when \`macos-icon\` is set to
\`custom-style\`.`,
        enum: ["aluminum", "beige", "plastic", "chrome"],
    },
    {
        key: "macos-icon-ghost-color",
        type: "color",
        default: undefined,
        description: `The color of the ghost in the macOS app icon.

Note: This configuration is required when \`macos-icon\` is set to
\`custom-style\`.

Specified as either hex (\`#RRGGBB\` or \`RRGGBB\`) or a named X11 color.`,
    },
    {
        key: "macos-icon-screen-color",
        type: "color-list",
        default: undefined,
        description: `The color of the screen in the macOS app icon.

The screen is a linear gradient so you can specify multiple colors
that make up the gradient. Up to 64 comma-separated colors may be
specified as either hex (\`#RRGGBB\` or \`RRGGBB\`) or as named X11
colors. The first color is the bottom of the gradient and the last
color is the top of the gradient.

Note: This configuration is required when \`macos-icon\` is set to
\`custom-style\`.`,
    },
    {
        key: "macos-shortcuts",
        type: "enum",
        default: "ask",
        description: `Whether macOS Shortcuts are allowed to control Ghostty.

Ghostty exposes a number of actions that allow Shortcuts to
control and interact with Ghostty. This includes creating new
terminals, sending text to terminals, running commands, invoking
any keybind action, etc.

This is a powerful feature but can be a security risk if a malicious
shortcut is able to be installed and executed. Therefore, this
configuration allows you to disable this feature.

Valid values are:

* \`ask\` - Ask the user whether for permission. Ghostty will remember
  this choice and never ask again. This is similar to other macOS
  permissions such as microphone access, camera access, etc.

* \`allow\` - Allow Shortcuts to control Ghostty without asking.

* \`deny\` - Deny Shortcuts from controlling Ghostty.

Available since: 1.2.0`,
        enum: ["allow", "deny", "ask"],
        since: "1.2.0",
    },
    {
        key: "linux-cgroup",
        type: "enum",
        default: undefined,
        description: `Put every surface (tab, split, window) into a transient \`systemd\` scope.

This allows per-surface resource management. For example, if a shell program
is using too much memory, only that shell will be killed by the oom monitor
instead of the entire Ghostty process. Similarly, if a shell program is
using too much CPU, only that surface will be CPU-throttled.

This will cause startup times to be slower (a hundred milliseconds or so),
so the default value is "single-instance." In single-instance mode, only
one instance of Ghostty is running (see gtk-single-instance) so the startup
time is a one-time cost. Additionally, single instance Ghostty is much
more likely to have many windows, tabs, etc. so cgroup isolation is a
big benefit.

This feature requires \`systemd\`. If \`systemd\` is unavailable, cgroup
initialization will fail. By default, this will not prevent Ghostty from
working (see \`linux-cgroup-hard-fail\`).

Changing this value and reloading the config will not affect existing
surfaces.

Valid values are:

  * \`never\` - Never use cgroups.
  * \`always\` - Always use cgroups.
  * \`single-instance\` - Enable cgroups only for Ghostty instances launched
    as single-instance applications (see gtk-single-instance).`,
        enum: ["never", "always", "single-instance"],
    },
    {
        key: "linux-cgroup-memory-limit",
        type: "uint",
        default: undefined,
        description: `Memory limit for any individual terminal process (tab, split, window,
etc.) in bytes. If this is unset then no memory limit will be set.

Note that this sets the \`MemoryHigh\` setting on the transient \`systemd\`
scope, which is a soft limit. You should configure something like
\`systemd-oom\` to handle killing processes that have too much memory
pressure.

Changing this value and reloading the config will not affect existing
surfaces.

See the \`systemd.resource-control\` manual page for more information:
https://www.freedesktop.org/software/systemd/man/latest/systemd.resource-control.html`,
    },
    {
        key: "linux-cgroup-processes-limit",
        type: "uint",
        default: undefined,
        description: `Number of processes limit for any individual terminal process (tab, split,
window, etc.). If this is unset then no limit will be set.

Note that this sets the \`TasksMax\` setting on the transient \`systemd\` scope,
which is a hard limit.

Changing this value and reloading the config will not affect existing
surfaces.

See the \`systemd.resource-control\` manual page for more information:
https://www.freedesktop.org/software/systemd/man/latest/systemd.resource-control.html`,
    },
    {
        key: "linux-cgroup-hard-fail",
        type: "bool",
        default: false,
        description: `If this is false, then creating a transient \`systemd\` scope (for
\`linux-cgroup\`) will be allowed to fail and the failure is ignored. This is
useful if you view cgroup isolation as a "nice to have" and not a critical
resource management feature, because surface creation will not fail if
\`systemd\` APIs fail.

If this is true, then any transient \`systemd\` scope creation failure will
cause surface creation to fail.

Changing this value and reloading the config will not affect existing
surfaces.`,
    },
    {
        key: "gtk-opengl-debug",
        type: "bool",
        default: undefined,
        description: `Enable or disable GTK's OpenGL debugging logs. The default is \`true\` for
debug builds, \`false\` for all others.

Available since: 1.1.0`,
        since: "1.1.0",
    },
    {
        key: "gtk-single-instance",
        type: "enum",
        default: "default",
        description: `If \`true\`, the Ghostty GTK application will run in single-instance mode:
each new \`ghostty\` process launched will result in a new window if there is
already a running process.

If \`false\`, each new ghostty process will launch a separate application.

If \`detect\`, Ghostty will assume true (single instance) unless one of
the following scenarios is found:

1. TERM_PROGRAM environment variable is a non-empty value. In this
case, we assume Ghostty is being launched from a graphical terminal
session and you want a dedicated instance.

2. Any CLI arguments exist. In this case, we assume you are passing
custom Ghostty configuration. Single instance mode inherits the
configuration from when it was launched, so we must disable single
instance to load the new configuration.

If either of these scenarios is producing a false positive, you can
set this configuration explicitly to the behavior you want.

The pre-1.2 option \`desktop\` has been deprecated. Please replace
this with \`detect\`.

The default value is \`detect\`.

Note that debug builds of Ghostty have a separate single-instance ID
so you can test single instance without conflicting with release builds.`,
        enum: ["false", "true", "detect"],
    },
    {
        key: "gtk-titlebar",
        type: "bool",
        default: true,
        description: `When enabled, the full GTK titlebar is displayed instead of your window
manager's simple titlebar. The behavior of this option will vary with your
window manager.

This option does nothing when \`window-decoration\` is none or when running
under macOS.`,
    },
    {
        key: "gtk-tabs-location",
        type: "enum",
        default: "top",
        description: `Determines the side of the screen that the GTK tab bar will stick to.
Top, bottom, and hidden are supported. The default is top.

When \`hidden\` is set, a tab button displaying the number of tabs will appear
in the title bar. It has the ability to open a tab overview for displaying
tabs. Alternatively, you can use the \`toggle_tab_overview\` action in a
keybind if your window doesn't have a title bar, or you can switch tabs
with keybinds.`,
        enum: ["top", "bottom"],
    },
    {
        key: "gtk-titlebar-hide-when-maximized",
        type: "bool",
        default: false,
        description: `If this is \`true\`, the titlebar will be hidden when the window is maximized,
and shown when the titlebar is unmaximized. GTK only.

Available since: 1.1.0`,
        platform: ["gtk"],
        since: "1.1.0",
    },
    {
        key: "gtk-toolbar-style",
        type: "enum",
        default: "raised",
        description: `Determines the appearance of the top and bottom bars tab bar.

Valid values are:

 * \`flat\` - Top and bottom bars are flat with the terminal window.
 * \`raised\` - Top and bottom bars cast a shadow on the terminal area.
 * \`raised-border\` - Similar to \`raised\` but the shadow is replaced with a
   more subtle border.`,
        enum: ["flat", "raised", "raised-border"],
    },
    {
        key: "gtk-titlebar-style",
        type: "enum",
        default: "native",
        description: `The style of the GTK titlebar. Available values are \`native\` and \`tabs\`.

The \`native\` titlebar style is a traditional titlebar with a title, a few
buttons and window controls. A separate tab bar will show up below the
titlebar if you have multiple tabs open in the window.

The \`tabs\` titlebar merges the tab bar and the traditional titlebar.
This frees up vertical space on your screen if you use multiple tabs. One
limitation of the \`tabs\` titlebar is that you cannot drag the titlebar
by the titles any longer (as they are tab titles now). Other areas of the
\`tabs\` title bar can be used to drag the window around.

The default style is \`native\`.`,
        enum: ["native", "tabs"],
    },
    {
        key: "gtk-wide-tabs",
        type: "bool",
        default: true,
        description: `If \`true\` (default), then the Ghostty GTK tabs will be "wide." Wide tabs
are the new typical Gnome style where tabs fill their available space.
If you set this to \`false\` then tabs will only take up space they need,
which is the old style.`,
    },
    {
        key: "gtk-custom-css",
        type: "path",
        default: undefined,
        description: `Custom CSS files to be loaded.

GTK CSS documentation can be found at the following links:

  * https://docs.gtk.org/gtk4/css-overview.html - An overview of GTK CSS.
  * https://docs.gtk.org/gtk4/css-properties.html - A comprehensive list
    of supported CSS properties.

Launch Ghostty with \`env GTK_DEBUG=interactive ghostty\` to tweak Ghostty's
CSS in real time using the GTK Inspector. Errors in your CSS files would
also be reported in the terminal you started Ghostty from. See
https://developer.gnome.org/documentation/tools/inspector.html for more
information about the GTK Inspector.

This configuration can be repeated multiple times to load multiple files.
Prepend a ? character to the file path to suppress errors if the file does
not exist. If you want to include a file that begins with a literal ?
character, surround the file path in double quotes (").
The file size limit for a single stylesheet is 5MiB.

Available since: 1.1.0`,
        repeatable: true,
        since: "1.1.0",
    },
    {
        key: "desktop-notifications",
        type: "bool",
        default: true,
        description: `If \`true\` (default), applications running in the terminal can show desktop
notifications using certain escape sequences such as OSC 9 or OSC 777.`,
    },
    {
        key: "bold-color",
        type: "bold-color",
        default: undefined,
        description: `Modifies the color used for bold text in the terminal.

This can be set to a specific color, using the same format as
\`background\` or \`foreground\` (e.g. \`#RRGGBB\` but other formats
are also supported; see the aforementioned documentation). If a
specific color is set, this color will always be used for the default
bold text color. It will set the rest of the bold colors to \`bright\`.

This can also be set to \`bright\`, which uses the bright color palette
for bold text. For example, if the text is red, then the bold will
use the bright red color. The terminal palette is set with \`palette\`
but can also be overridden by the terminal application itself using
escape sequences such as OSC 4. (Since Ghostty 1.2.0, the previous
configuration \`bold-is-bright\` is deprecated and replaced by this
usage).

Available since Ghostty 1.2.0.`,
    },
    {
        key: "faint-opacity",
        type: "float",
        default: 0.5,
        description: `The opacity level (opposite of transparency) of the faint text. A value of
1 is fully opaque and a value of 0 is fully transparent. A value less than 0
or greater than 1 will be clamped to the nearest valid value.

Available since Ghostty 1.2.0.`,
    },
    {
        key: "term",
        type: "string",
        default: "xterm-ghostty",
        description: `This will be used to set the \`TERM\` environment variable.
HACK: We set this with an \`xterm\` prefix because vim uses that to enable key
protocols (specifically this will enable \`modifyOtherKeys\`), among other
features. An option exists in vim to modify this: \`:set
keyprotocol=ghostty:kitty\`, however a bug in the implementation prevents it
from working properly. https://github.com/vim/vim/pull/13211 fixes this.`,
    },
    {
        key: "enquiry-response",
        type: "string",
        default: "",
        description: `String to send when we receive \`ENQ\` (\`0x05\`) from the command that we are
running. Defaults to an empty string if not set.`,
    },
    {
        key: "async-backend",
        type: "enum",
        default: "auto",
        description: `Configures the low-level API to use for async IO, eventing, etc.

Most users should leave this set to \`auto\`. This will automatically detect
scenarios where APIs may not be available (for example \`io_uring\` on
certain hardened kernels) and fall back to a different API. However, if
you want to force a specific backend for any reason, you can set this
here.

Based on various benchmarks, we haven't found a statistically significant
difference between the backends with regards to memory, CPU, or latency.
The choice of backend is more about compatibility and features.

Available options:

  * \`auto\` - Automatically choose the best backend for the platform
    based on available options.
  * \`epoll\` - Use the \`epoll\` API
  * \`io_uring\` - Use the \`io_uring\` API

If the selected backend is not available on the platform, Ghostty will
fall back to an automatically chosen backend that is available.

Changing this value requires a full application restart to take effect.

This is only supported on Linux, since this is the only platform
where we have multiple options. On macOS, we always use \`kqueue\`.

Available since: 1.2.0`,
        enum: ["auto", "epoll", "io_uring"],
        platform: ["linux"],
        since: "1.2.0",
    },
    {
        key: "auto-update",
        type: "enum",
        default: undefined,
        description: `Control the auto-update functionality of Ghostty. This is only supported
on macOS currently, since Linux builds are distributed via package
managers that are not centrally controlled by Ghostty.

Checking or downloading an update does not send any information to
the project beyond standard network information mandated by the
underlying protocols. To put it another way: Ghostty doesn't explicitly
add any tracking to the update process. The update process works by
downloading information about the latest version and comparing it
client-side to the current version.

Valid values are:

 * \`off\` - Disable auto-updates.
 * \`check\` - Check for updates and notify the user if an update is
   available, but do not automatically download or install the update.
 * \`download\` - Check for updates, automatically download the update,
   notify the user, but do not automatically install the update.

If unset, we defer to Sparkle's default behavior, which respects the
preference stored in the standard user defaults (\`defaults(1)\`).

Changing this value at runtime works after a small delay.`,
        enum: ["off", "check", "download"],
    },
    {
        key: "auto-update-channel",
        type: "enum",
        default: undefined,
        description: `The release channel to use for auto-updates.

The default value of this matches the release channel of the currently
running Ghostty version. If you download a pre-release version of Ghostty
then this will be set to \`tip\` and you will receive pre-release updates.
If you download a stable version of Ghostty then this will be set to
\`stable\` and you will receive stable updates.

Valid values are:

 * \`stable\` - Stable, tagged releases such as "1.0.0".
 * \`tip\` - Pre-release versions generated from each commit to the
   main branch. This is the version that was in use during private
   beta testing by thousands of people. It is generally stable but
   will likely have more bugs than the stable channel.

Changing this configuration requires a full restart of
Ghostty to take effect.

This only works on macOS since only macOS has an auto-update feature.`,
        platform: ["macos"],
    },
];

export default ghosttySchema;
