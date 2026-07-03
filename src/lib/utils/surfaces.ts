/**
 * Surface (background / border) color derivation.
 *
 * Historically the app's gray "surface" colors were hand-picked static hex values, tuned by
 * eye to sit nicely on top of the macOS Monterey wallpaper shown behind the fake window on
 * the web build. That coupling is invisible but real: the grays are already a purple-tinted
 * gray because the wallpaper is purple.
 *
 * This module makes that relationship explicit and dynamic. A neutral base ramp is blended
 * toward a *sample* color — on the web that sample is a representative swatch of the
 * wallpaper, and on desktop (where there is no wallpaper) it is the user's chosen terminal
 * background, so the whole app subtly tints to match their theme. The same machinery drives
 * both targets, which is what keeps them visually consistent.
 */

import {hexToRgb, rgbToHex, type HexColor} from "$lib/utils/colors";

/** The hand-tuned neutral surface ramp used as the blend base. Keys map to CSS custom props. */
export const BASE_SURFACES = {
    "bg-level-1": "#2C2733",
    "bg-level-2": "#2F2935",
    "bg-level-3": "#332D38",
    "bg-level-4": "#39343F",
    "bg-separator": "#39333F",
    "bg-modal": "#231E2A",
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
 * Representative swatch of the Monterey wallpaper (a muted blue-purple). Used as the blend
 * sample for the web build so its surfaces derive from the same source they were eyeballed
 * against.
 */
export const WALLPAPER_SAMPLE: HexColor = "#3B2E52";

/** Clamp a blend amount into the inclusive [0, 1] range. */
function clamp01(t: number): number {
    if (Number.isNaN(t)) return 0;
    return Math.min(1, Math.max(0, t));
}

/**
 * Linearly blend two hex colors in RGB space. `t = 0` returns `a`, `t = 1` returns `b`.
 */
export function mixHex(a: HexColor, b: HexColor, t: number): HexColor {
    const amount = clamp01(t);
    const [ar, ag, ab] = hexToRgb(a);
    const [br, bg, bb] = hexToRgb(b);
    const blend = (x: number, y: number) => Math.round(x + (y - x) * amount);
    return rgbToHex(blend(ar, br), blend(ag, bg), blend(ab, bb));
}

/**
 * Derive the full surface ramp by blending each neutral base color toward `sample` by
 * `amount`. `amount = 0` reproduces {@link BASE_SURFACES} exactly (an identity transform, so
 * a zero-tint build is byte-for-byte the historical look); `amount = 1` collapses every
 * surface onto `sample`.
 */
export function deriveSurfaces(sample: HexColor, amount: number): SurfaceMap {
    const out = {} as SurfaceMap;
    for (const key of Object.keys(BASE_SURFACES) as SurfaceKey[]) {
        out[key] = mixHex(BASE_SURFACES[key], sample, amount);
    }
    return out;
}

/**
 * Render a surface map as a CSS custom-property declaration string suitable for a `style`
 * attribute, e.g. `--bg-level-1: #2C2733;--bg-level-2: ...`. The `sidebar-bg` surface is
 * emitted both as a solid and as a translucent variant (`--sidebar-bg-translucent`) so the
 * frosted sidebar keeps its blur.
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
