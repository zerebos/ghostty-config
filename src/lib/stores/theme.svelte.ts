import themes from "$lib/data/themes";
import {parseTheme} from "$lib/settings/codecs";
import {resolveCellColor, type ColorScheme} from "$lib/utils/colors";
import config, {defaults, isNonDefault} from "./config.svelte";

// Theme layering view-model. `config` stores only what serializes — the raw `theme` string and
// genuine color overrides; theme colors are NEVER written into it, so they cannot leak into
// diff()/export by construction. This module derives what the UI *displays*: for each color
// key, precedence is explicit override > active theme > app default. The only consumers are
// the CSS-var funnel in +layout.svelte and the color editors (which display effective colors
// and write overrides back to `config`). See the theme-layering section in AGENTS.md.

export type PreviewMode = "light" | "dark";

// Ephemeral view state: which half of a `light:A,dark:B` dual theme is being previewed.
// Never stored in config, never serialized. Defaults to the visitor's own OS appearance
// "what would Ghostty show *me*" falling back to dark during prerender/tests.
const prefersLight = typeof window !== "undefined" && (window.matchMedia?.("(prefers-color-scheme: light)").matches ?? false);
export const preview = $state<{mode: PreviewMode;}>({mode: prefersLight ? "light" : "dark"});

const selection = $derived(parseTheme(config.theme));

// Resolve the theme driving a GIVEN preview mode: a dual `light:A,dark:B` selection maps each
// half to a mode; single/unset selections ignore the mode. Parametrized by mode so per-preview
// light/dark toggles can resolve colors for a mode other than the global `preview.mode`.
function themeForMode(mode: PreviewMode): {name: string, colors: ColorScheme;} | null {
    let name: string | null = null;
    if (selection.kind === "single") name = selection.name;
    else if (selection.kind === "dual") name = mode === "light" ? selection.light : selection.dark;
    if (name === null) return null;
    // Unknown/custom names (or absolute paths) can't be previewed; the string still round-trips.
    const colors = (themes as Record<string, ColorScheme>)[name];
    return colors ? {name, colors} : null;
}

const activeTheme = $derived(themeForMode(preview.mode));
const themeColors = $derived(activeTheme?.colors ?? null);

const SCHEME_KEYS = ["background", "foreground", "cursorColor", "cursorText", "selectionBackground", "selectionForeground"] as const;
export type SchemeColorKey = typeof SCHEME_KEYS[number];

/** Is this settings-registry key one of the theme-affected color keys? */
export function isSchemeColorKey(key: string): key is SchemeColorKey {
    return (SCHEME_KEYS as readonly string[]).includes(key);
}

// Override detection is value-inferred (`isNonDefault`), the same rule diff() uses: a color
// explicitly set to the app default reads as "not overridden", so the theme wins. Consistent
// with export semantics; provenance tracking would be the stricter (unshipped) alternative.
function resolveKey(key: SchemeColorKey, tc: ColorScheme | null): string {
    return isNonDefault(key) ? config[key] : tc?.[key] ?? config[key];
}

/**
 * Effective colors (override > theme > default) resolved for an ARBITRARY preview mode. The
 * global `effectiveColors()` is exactly this at `preview.mode`; a preview instance with its own
 * light/dark toggle passes its local mode to get the colors for that half without disturbing the
 * global funnel.
 */
export function resolveEffective(mode: PreviewMode) {
    const tc = themeForMode(mode)?.colors ?? null;
    return {
        background: resolveKey("background", tc),
        foreground: resolveKey("foreground", tc),
        cursorColor: resolveKey("cursorColor", tc),
        cursorText: resolveKey("cursorText", tc),
        selectionBackground: resolveKey("selectionBackground", tc),
        selectionForeground: resolveKey("selectionForeground", tc),
        // Element-wise: override per index > theme index (themes carry 16) > default index.
        palette: config.palette.map((color, i) => color !== defaults.palette[i] ? color : tc?.palette?.[i] ?? color),
    };
}

const effective = $derived(resolveEffective(preview.mode));

export type EffectiveColors = ReturnType<typeof resolveEffective>;

/**
 * The `--config-*` color CSS vars for an already-resolved color set. This is the single source of
 * truth for the color half of the funnel: `+layout.svelte` passes the memoized `effectiveColors()`
 * (so the global funnel never re-resolves), and per-preview overrides go through `previewColorVars`
 * below. Shape and values are identical either way, so scoped previews render pixel-identically.
 */
export function colorVarsFrom(colors: EffectiveColors): string {
    const fg = colors.foreground;
    const bg = colors.background;
    let str = "";
    const add = (key: string, val: string) => str += `--config-${key}: ${val};`;
    add("bg", bg);
    add("fg", fg);
    // Cursor/selection colors may hold `cell-foreground`/`cell-background` keywords; resolve
    // those against this set's fg/bg before emitting them as CSS colors.
    add("selection-bg", resolveCellColor(colors.selectionBackground, fg, bg) || fg);
    add("selection-fg", resolveCellColor(colors.selectionForeground, fg, bg) || bg);
    add("cursor-color", resolveCellColor(colors.cursorColor, fg, bg) || fg);
    add("cursor-text", resolveCellColor(colors.cursorText, fg, bg) || bg);
    for (let c = 0; c < 16; c++) add(`palette-${c}`, colors.palette[c]);
    return str;
}

/**
 * Scoped `--config-*` vars for a preview whose local light/dark toggle diverges from the global
 * one: resolve that mode's colors and build the vars in one call. Applied to the preview's own
 * root, shadowing the inherited funnel vars for that subtree only. The global funnel does NOT use
 * this — it reuses the memoized `effectiveColors()` via `colorVarsFrom()` to avoid re-resolving.
 */
export function previewColorVars(mode: PreviewMode): string {
    return colorVarsFrom(resolveEffective(mode));
}

// $derived bindings can't be exported from a module directly; expose them through getters.
export function themeSelection() {
    return selection;
}

export function effectiveColors() {
    return effective;
}

/** The name of the theme currently driving the preview (dual: the previewed half), or null
 * when no theme is set or the name doesn't resolve to known theme data. */
export function activeThemeName(): string | null {
    return activeTheme?.name ?? null;
}

export type ColorTier = "override" | "theme" | "default";

/**
 * Which source a color key's *displayed* value comes from — the tier-badge classifier.
 * Note: an overridden palette reports "override" even though un-edited indices still follow
 * the theme; per-index tiers can be derived the same way if a per-swatch UI ever wants them.
 */
export function colorTier(key: SchemeColorKey | "palette"): ColorTier {
    if (isNonDefault(key)) return "override";
    if (key === "palette") return themeColors ? "theme" : "default";
    return themeColors?.[key] !== undefined ? "theme" : "default";
}

/** Per-index palette tier — the palette is the one setting whose tiers vary per index
 * (themes provide the first 16; anything the user edited is an override). */
export function paletteTier(index: number): ColorTier {
    if (config.palette[index] !== defaults.palette[index]) return "override";
    return themeColors?.palette?.[index] !== undefined ? "theme" : "default";
}
