import {afterEach, describe, expect, it} from "vitest";
import themes from "$lib/data/themes";
import config, {defaults, diff, resetSetting} from "./config.svelte";
import {activeThemeName, colorTier, effectiveColors, paletteTier, preview, resolveEffective, themeSelection} from "./theme.svelte";

// Two real themes with distinct, defined backgrounds, picked dynamically so the tests don't
// break when the generated themes data is re-synced.
const [nameA, schemeA] = Object.entries(themes).find(([, s]) => s.background && s.palette.length >= 16)!;
const [nameB, schemeB] = Object.entries(themes).find(([, s]) => s.background && s.background !== schemeA.background)!;

afterEach(() => {
    resetSetting("theme");
    resetSetting("background");
    resetSetting("palette");
    preview.mode = "dark";
});

describe("themeSelection", () => {
    it("follows config.theme", () => {
        expect(themeSelection().kind).toBe("unset");
        config.theme = nameA;
        expect(themeSelection()).toEqual({kind: "single", name: nameA});
        config.theme = `light:${nameA},dark:${nameB}`;
        expect(themeSelection().kind).toBe("dual");
    });
});

describe("effectiveColors", () => {
    it("returns app defaults when no theme is set", () => {
        expect(effectiveColors().background).toBe(defaults.background);
        expect(effectiveColors().palette[0]).toBe(defaults.palette[0]);
    });

    it("returns theme colors when a theme is active", () => {
        config.theme = nameA;
        expect(effectiveColors().background).toBe(schemeA.background);
        expect(effectiveColors().palette[0]).toBe(schemeA.palette[0]);
    });

    it("lets an explicit override beat the theme, and reset fall back to the theme", () => {
        config.theme = nameA;
        config.background = "#123456";
        expect(effectiveColors().background).toBe("#123456");
        resetSetting("background");
        expect(effectiveColors().background).toBe(schemeA.background);
    });

    it("overrides the palette element-wise", () => {
        config.theme = nameA;
        config.palette[3] = "#ff00ff";
        expect(effectiveColors().palette[3]).toBe("#ff00ff");
        expect(effectiveColors().palette[0]).toBe(schemeA.palette[0]);
    });

    it("resolves a dual theme through the preview mode", () => {
        config.theme = `light:${nameA},dark:${nameB}`;
        expect(effectiveColors().background).toBe(schemeB.background); // default preview: dark
        preview.mode = "light";
        expect(effectiveColors().background).toBe(schemeA.background);
    });

    it("falls back to defaults for an unknown/custom theme name", () => {
        config.theme = "Some Custom Theme That Does Not Exist";
        expect(effectiveColors().background).toBe(defaults.background);
    });

    // Not every theme defines every scheme key; a missing key must fall to the app default.
    const partialEntry = Object.entries(themes).find(([, s]) => s.background && s.selectionBackground === undefined);
    it.skipIf(!partialEntry)("falls back to the app default for keys the theme doesn't provide", () => {
        config.theme = partialEntry![0];
        expect(effectiveColors().selectionBackground).toBe(defaults.selectionBackground);
        expect(effectiveColors().background).toBe(partialEntry![1].background);
    });
});

describe("resolveEffective (per-preview mode)", () => {
    it("resolves each half of a dual theme independently of the global preview mode", () => {
        config.theme = `light:${nameA},dark:${nameB}`;
        // Global mode stays dark; resolveEffective must answer for whichever mode is asked.
        expect(preview.mode).toBe("dark");
        expect(resolveEffective("light").background).toBe(schemeA.background);
        expect(resolveEffective("dark").background).toBe(schemeB.background);
        expect(effectiveColors().background).toBe(schemeB.background); // global unchanged
    });

    it("applies the same override precedence (override > theme > default) in either mode", () => {
        config.theme = `light:${nameA},dark:${nameB}`;
        config.background = "#123456";
        expect(resolveEffective("light").background).toBe("#123456");
        expect(resolveEffective("dark").background).toBe("#123456");
        resetSetting("background");
        expect(resolveEffective("light").background).toBe(schemeA.background);
        expect(resolveEffective("dark").background).toBe(schemeB.background);
    });

    it("overrides the palette element-wise per mode", () => {
        config.theme = `light:${nameA},dark:${nameB}`;
        config.palette[3] = "#ff00ff";
        expect(resolveEffective("light").palette[3]).toBe("#ff00ff");
        expect(resolveEffective("dark").palette[3]).toBe("#ff00ff");
        expect(resolveEffective("light").palette[0]).toBe(schemeA.palette[0]);
        expect(resolveEffective("dark").palette[0]).toBe(schemeB.palette[0]);
    });

    it("falls back to app defaults when no theme is set, regardless of mode", () => {
        expect(resolveEffective("light").background).toBe(defaults.background);
        expect(resolveEffective("dark").background).toBe(defaults.background);
    });
});

describe("colorTier / activeThemeName", () => {
    it("classifies default -> theme -> override transitions", () => {
        expect(colorTier("background")).toBe("default");
        config.theme = nameA;
        expect(colorTier("background")).toBe("theme");
        config.background = "#123456";
        expect(colorTier("background")).toBe("override");
        resetSetting("background");
        expect(colorTier("background")).toBe("theme");
    });

    it("classifies the palette as a whole (any edited index -> override)", () => {
        config.theme = nameA;
        expect(colorTier("palette")).toBe("theme");
        config.palette[3] = "#ff00ff";
        expect(colorTier("palette")).toBe("override");
    });

    it("classifies palette tiers per index", () => {
        config.theme = nameA;
        config.palette[3] = "#ff00ff";
        expect(paletteTier(3)).toBe("override");
        expect(paletteTier(0)).toBe("theme"); // themes provide the first 16
        expect(paletteTier(200)).toBe("default"); // beyond the theme's 16
        expect(paletteTier(0)).not.toBe(paletteTier(3)); // mixed state is per-index
    });

    it("activeThemeName resolves only known themes (dual: the previewed half)", () => {
        expect(activeThemeName()).toBeNull();
        config.theme = "Not A Real Theme";
        expect(activeThemeName()).toBeNull();
        config.theme = `light:${nameA},dark:${nameB}`;
        expect(activeThemeName()).toBe(nameB); // preview defaults to dark in tests
        preview.mode = "light";
        expect(activeThemeName()).toBe(nameA);
    });
});

describe("no theme bleed in diff()", () => {
    it("selecting a theme emits only the theme key, never its colors", () => {
        config.theme = nameA;
        const output = diff();
        expect(output.theme).toBe(nameA);
        expect(output.background).toBeUndefined();
        expect(output.palette).toBeUndefined();
        expect(Object.keys(output)).toEqual(["theme"]);
    });

    it("a genuine override serializes alongside the theme", () => {
        config.theme = nameA;
        config.background = "#123456";
        expect(diff().background).toBe("#123456");
    });

    it("a per-index palette edit emits only that index, not the themed array", () => {
        config.theme = nameA;
        config.palette[3] = "#ff00ff";
        const output = diff();
        expect(output.palette).toEqual(["3=#ff00ff"]);
        expect(Object.keys(output).sort()).toEqual(["palette", "theme"]);
    });
});
