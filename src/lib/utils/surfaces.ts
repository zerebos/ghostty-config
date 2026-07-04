/**
 * Surface (background / border) color derivation.
 *
 * The app mimics macOS, and macOS tints its window chrome toward the desktop wallpaper: the
 * "grays" aren't truly neutral, they carry a faint hue borrowed from whatever is behind the
 * window. The original static surface colors here were hand-tuned that way — a neutral gray
 * nudged toward the purple of the Monterey wallpaper the web build sits on.
 *
 * This module makes that relationship explicit. Each surface keeps its own **brightness** (so
 * the light/dark ladder is preserved) but takes its **hue** — and a bounded slice of its
 * saturation — from a wallpaper sample:
 *
 *   - **web**: the static Monterey wallpaper, sampled at runtime (see `utils/wallpaper`).
 *   - **desktop**: the user's actual OS wallpaper when it can be sampled, otherwise a neutral
 *     gray fallback (no hue), leaning on translucency/blur instead.
 *
 * Tinting in HSV (hue + saturation, fixed value) rather than blending in RGB is what makes
 * this read as a "tint" rather than a wash: a dark gray stays exactly as dark, it just leans
 * purple/blue/whatever the wallpaper is.
 */

import {hexToRgb, hsvToRgb, rgbToHex, rgbToHsv, type HexColor, type HsvObj} from "$lib/utils/colors";

/**
 * The hand-tuned surface ramp. Only the **brightness** of each entry is used as the source of
 * truth — hue and saturation are replaced by the wallpaper tint — so these can stay as the
 * familiar values without re-tuning. Keys map to CSS custom properties.
 */
export const BASE_SURFACES = {
    "bg-level-1": "#2C2733",
    "bg-level-2": "#2F2935",
    "bg-level-3": "#332D38",
    "bg-level-4": "#39343F",
    "bg-separator": "#39333F",
    "bg-modal": "#231E2A",
    "bg-input-focus": "#1F1E1F",
    "bg-basic-button": "#635F68",
    "bg-stepper": "#535258",
    "bg-handle": "#434049",
    "sidebar-bg": "#322E34",
    "border-level-2": "#4F4A54",
    "border-level-3": "#4C4651",
    "border-level-4": "#423E48",
    "border-separator": "#302B37",
    "border-input": "#443E4B"
} satisfies Record<string, HexColor>;

export type SurfaceKey = keyof typeof BASE_SURFACES;
export type SurfaceMap = Record<SurfaceKey, HexColor>;

/**
 * Upper bound on how saturated a tinted surface may become. Grays should read as grays; this
 * keeps the tint a whisper rather than a color cast even when the wallpaper is vivid. The
 * original Monterey-tuned surfaces sit around 0.23, so this leaves them essentially unchanged.
 */
export const MAX_TINT_SATURATION = 0.24;

/** Clamp a number into the inclusive [0, 1] range (NaN → 0). */
function clamp01(t: number): number {
    if (Number.isNaN(t)) return 0;
    return Math.min(1, Math.max(0, t));
}

/** The brightness (HSV value, 0–1) of a color — how light/dark it is, hue aside. */
export function brightnessOf(color: HexColor): number {
    return rgbToHsv(...hexToRgb(color)).value;
}

/**
 * Tint one surface: keep its brightness, adopt the wallpaper's hue, and take a bounded slice
 * of the wallpaper's saturation scaled by `strength`.
 */
export function tintSurface(base: HexColor, wallpaper: HsvObj, strength: number): HexColor {
    const value = brightnessOf(base);
    const saturation = Math.min(wallpaper.saturation * clamp01(strength), MAX_TINT_SATURATION);
    return rgbToHex(...hsvToRgb(wallpaper.hue, saturation, value));
}

/** Neutralize one surface to a pure gray at its original brightness (no hue). */
export function neutralSurface(base: HexColor): HexColor {
    return rgbToHex(...hsvToRgb(0, 0, brightnessOf(base)));
}

/**
 * Derive the full surface ramp. Passing a wallpaper sample tints every surface toward it;
 * passing `null` collapses the ramp to neutral grays (the desktop fallback when no wallpaper
 * can be read).
 */
export function deriveSurfaces(wallpaper: HsvObj | null, strength = 1): SurfaceMap {
    const out = {} as SurfaceMap;
    for (const key of Object.keys(BASE_SURFACES) as SurfaceKey[]) {
        out[key] = wallpaper ? tintSurface(BASE_SURFACES[key], wallpaper, strength) : neutralSurface(BASE_SURFACES[key]);
    }
    return out;
}

/**
 * Render a surface map as a CSS custom-property declaration string suitable for a `style`
 * attribute, e.g. `--bg-level-1: #2C2733;--bg-level-2: ...`. The `sidebar-bg` surface is also
 * emitted as a translucent variant (`--sidebar-bg-translucent`) so the frosted sidebar keeps
 * its blur.
 */
export function surfacesToCss(surfaces: SurfaceMap): string {
    let css = "";
    for (const key of Object.keys(surfaces) as SurfaceKey[]) {
        css += `--${key}: ${surfaces[key]};`;
    }
    const [r, g, b] = hexToRgb(surfaces["sidebar-bg"]);
    css += `--sidebar-bg-translucent: rgba(${r}, ${g}, ${b}, 0.7);`;
    return css;
}
