import {describe, expect, it} from "vitest";
import {
    BASE_SURFACES,
    deriveSurfaces,
    mixHex,
    surfacesToCss,
    WALLPAPER_SAMPLE
} from "./surfaces";

describe("mixHex", () => {
    it("returns the first color at t=0", () => {
        expect(mixHex("#000000", "#FFFFFF", 0)).toBe("#000000");
    });

    it("returns the second color at t=1", () => {
        expect(mixHex("#000000", "#FFFFFF", 1)).toBe("#FFFFFF");
    });

    it("returns the midpoint at t=0.5", () => {
        expect(mixHex("#000000", "#FFFFFF", 0.5)).toBe("#808080");
    });

    it("blends per channel", () => {
        expect(mixHex("#204060", "#60A0E0", 0.5)).toBe("#4070A0");
    });

    it("clamps amounts outside [0, 1]", () => {
        expect(mixHex("#102030", "#405060", -1)).toBe("#102030");
        expect(mixHex("#102030", "#405060", 2)).toBe("#405060");
    });
});

describe("deriveSurfaces", () => {
    it("is the identity transform at amount 0", () => {
        const surfaces = deriveSurfaces(WALLPAPER_SAMPLE, 0);
        for (const key of Object.keys(BASE_SURFACES) as Array<keyof typeof BASE_SURFACES>) {
            expect(surfaces[key]).toBe(BASE_SURFACES[key]);
        }
    });

    it("collapses every surface onto the sample at amount 1", () => {
        const surfaces = deriveSurfaces("#123456", 1);
        for (const value of Object.values(surfaces)) {
            expect(value).toBe("#123456");
        }
    });

    it("nudges surfaces toward the sample for intermediate amounts", () => {
        const surfaces = deriveSurfaces("#FFFFFF", 0.5);
        // Every derived surface should be lighter than its base when mixing toward white.
        for (const key of Object.keys(BASE_SURFACES) as Array<keyof typeof BASE_SURFACES>) {
            expect(surfaces[key]).not.toBe(BASE_SURFACES[key]);
        }
    });
});

describe("surfacesToCss", () => {
    it("emits a custom property for every surface", () => {
        const css = surfacesToCss(deriveSurfaces(WALLPAPER_SAMPLE, 0));
        for (const key of Object.keys(BASE_SURFACES)) {
            expect(css).toContain(`--${key}: `);
        }
    });

    it("emits a translucent sidebar variant derived from the sidebar surface", () => {
        const css = surfacesToCss(deriveSurfaces("#000000", 1));
        expect(css).toContain("--sidebar-bg-translucent: rgba(0, 0, 0, 0.7);");
    });
});
