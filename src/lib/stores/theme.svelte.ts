/**
 * Surface-tint state.
 *
 * Holds the wallpaper sample that drives the app's hue-tinted grays (see `utils/surfaces`) and
 * resolves it for the current build target: the Monterey wallpaper on web, the user's OS
 * wallpaper on desktop (with a neutral-gray fallback when it can't be read).
 */

import {desktop, isDesktop} from "$lib/platform";
import monterey from "$lib/images/monterey.webp";
import {hexToRgb, rgbToHsv, type HexColor, type HsvObj} from "$lib/utils/colors";
import {deriveSurfaces, surfacesToCss} from "$lib/utils/surfaces";
import {sampleImageHsv} from "$lib/utils/wallpaper";

// Monterey-derived default so the very first paint is already tinted, avoiding a gray→tinted
// flash before the runtime sample resolves.
const MONTEREY_HSV: HsvObj = {hue: 0.72, saturation: 0.32, value: 0.5};
const TINT_STRENGTH = 1;
const HEX6 = /^#[0-9a-fA-F]{6}$/;

// null means "no wallpaper tint" → neutral grays (the desktop fallback).
let wallpaper = $state<HsvObj | null>(MONTEREY_HSV);

/** Live CSS custom-property string for the tinted surface ramp. Reactive; read in templates. */
export function surfaceStyle(): string {
    return surfacesToCss(deriveSurfaces(wallpaper, TINT_STRENGTH));
}

/** True when surfaces are neutral grays (no wallpaper tint) — used to opt into translucency. */
export function isNeutralSurface(): boolean {
    return wallpaper === null;
}

/** Resolve the wallpaper sample for the current build target. Call once on mount. */
export async function initSurfaceTint(): Promise<void> {
    if (isDesktop) {
        try {
            const hex = await desktop.wallpaperColor();
            if (HEX6.test(hex)) {
                wallpaper = rgbToHsv(...hexToRgb(hex as HexColor));
                return;
            }
        }
        catch {
            // fall through to the neutral fallback
        }
        wallpaper = null;
        return;
    }

    const sampled = await sampleImageHsv(monterey);
    if (sampled) wallpaper = sampled;
}
