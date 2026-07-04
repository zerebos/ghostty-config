import {describe, expect, it} from "vitest";
import {hexToRgb, rgbToHsv, type HexColor, type HsvObj} from "./colors";
import {
    BASE_SURFACES,
    brightnessOf,
    deriveSurfaces,
    MAX_TINT_SATURATION,
    neutralSurface,
    surfacesToCss,
    tintSurface
} from "./surfaces";

const WALLPAPER: HsvObj = {hue: 0.72, saturation: 0.6, value: 0.5};

function isGray(hex: HexColor): boolean {
    const [r, g, b] = hexToRgb(hex);
    return r === g && g === b;
}

describe("brightnessOf", () => {
    it("reports 0 for black and 1 for white", () => {
        expect(brightnessOf("#000000")).toBe(0);
        expect(brightnessOf("#FFFFFF")).toBe(1);
    });

    it("uses the brightest channel", () => {
        expect(brightnessOf("#804010")).toBeCloseTo(128 / 255, 5);
    });
});

describe("neutralSurface", () => {
    it("produces a pure gray", () => {
        for (const base of Object.values(BASE_SURFACES)) {
            expect(isGray(neutralSurface(base))).toBe(true);
        }
    });

    it("preserves the original brightness", () => {
        for (const base of Object.values(BASE_SURFACES)) {
            expect(brightnessOf(neutralSurface(base))).toBeCloseTo(brightnessOf(base), 2);
        }
    });
});

describe("tintSurface", () => {
    it("preserves brightness while adopting the wallpaper hue", () => {
        for (const base of Object.values(BASE_SURFACES)) {
            const tinted = tintSurface(base, WALLPAPER, 1);
            expect(brightnessOf(tinted)).toBeCloseTo(brightnessOf(base), 2);
            expect(isGray(tinted)).toBe(false);
        }
    });

    it("never exceeds the saturation ceiling", () => {
        // Allow a little slack: recovering saturation after quantizing to 8-bit RGB drifts a
        // few thousandths for very dark surfaces (a 1/255 step is a larger fraction of a small
        // max channel), but never enough to read as a real color cast.
        for (const base of Object.values(BASE_SURFACES)) {
            const tinted = tintSurface(base, WALLPAPER, 1);
            expect(rgbToHsv(...hexToRgb(tinted)).saturation).toBeLessThanOrEqual(MAX_TINT_SATURATION + 0.03);
        }
    });

    it("is neutral at strength 0", () => {
        expect(tintSurface("#2C2733", WALLPAPER, 0)).toBe(neutralSurface("#2C2733"));
    });
});

describe("deriveSurfaces", () => {
    it("tints every surface when given a wallpaper", () => {
        const surfaces = deriveSurfaces(WALLPAPER, 1);
        for (const key of Object.keys(BASE_SURFACES) as Array<keyof typeof BASE_SURFACES>) {
            expect(brightnessOf(surfaces[key])).toBeCloseTo(brightnessOf(BASE_SURFACES[key]), 2);
            expect(isGray(surfaces[key])).toBe(false);
        }
    });

    it("falls back to neutral grays when given null", () => {
        const surfaces = deriveSurfaces(null);
        for (const value of Object.values(surfaces)) {
            expect(isGray(value)).toBe(true);
        }
    });
});

describe("surfacesToCss", () => {
    it("emits a custom property for every surface", () => {
        const css = surfacesToCss(deriveSurfaces(WALLPAPER, 1));
        for (const key of Object.keys(BASE_SURFACES)) {
            expect(css).toContain(`--${key}: `);
        }
    });

    it("emits a translucent sidebar variant", () => {
        const css = surfacesToCss(deriveSurfaces(null));
        expect(css).toMatch(/--sidebar-bg-translucent: rgba\(\d+, \d+, \d+, 0\.7\);/);
    });
});
