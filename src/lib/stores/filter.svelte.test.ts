import {afterEach, describe, expect, it} from "vitest";
import registry from "$lib/settings/registry";
import type {GhosttyPlatform, SettingInfo} from "$lib/settings/types";
import {clearFilter, filterState, isFilterActive, isVisible, selectedPlatform, setPlatform} from "./filter.svelte";

// Pick real registry entries dynamically so these tests survive an upstream registry re-sync.
const entries = Object.entries(registry) as Array<[string, SettingInfo]>;
const findByTag = (tag: GhosttyPlatform) => entries.find(([, s]) => s.platform?.length === 1 && s.platform[0] === tag)?.[0];
const macId = findByTag("macos")!;
const gtkId = findByTag("gtk")!;
const linuxId = findByTag("linux")!;
const untaggedId = entries.find(([, s]) => !s.platform)![0];

afterEach(() => {
    clearFilter();
});

describe("isVisible", () => {
    it("shows everything when no platform is selected (All)", () => {
        expect(isFilterActive()).toBe(false);
        expect(isVisible(macId)).toBe(true);
        expect(isVisible(gtkId)).toBe(true);
        expect(isVisible(untaggedId)).toBe(true);
    });

    it("under macOS, hides settings whose tags don't intersect macos", () => {
        setPlatform("macos");
        expect(isFilterActive()).toBe(true);
        expect(isVisible(macId)).toBe(true);
        expect(isVisible(gtkId)).toBe(false);
        expect(isVisible(linuxId)).toBe(false);
    });

    it("under Linux, reveals gtk/linux settings and hides macos", () => {
        setPlatform("linux");
        expect(isVisible(linuxId)).toBe(true);
        expect(isVisible(gtkId)).toBe(true);
        expect(isVisible(macId)).toBe(false);
    });

    it("always shows untagged settings, whichever platform is selected", () => {
        setPlatform("macos");
        expect(isVisible(untaggedId)).toBe(true);
        setPlatform("linux");
        expect(isVisible(untaggedId)).toBe(true);
    });
});

describe("platform selection", () => {
    it("tracks the selected platform and reflects active state", () => {
        expect(selectedPlatform()).toBe("");
        setPlatform("macos");
        expect(selectedPlatform()).toBe("macos");
        expect(isFilterActive()).toBe(true);
        expect(filterState.platform).toBe("macos");
    });

    it("selecting All clears the filter", () => {
        setPlatform("linux");
        setPlatform("");
        expect(isFilterActive()).toBe(false);
        expect(selectedPlatform()).toBe("");
    });

    it("clearFilter resets to All", () => {
        setPlatform("linux");
        clearFilter();
        expect(isFilterActive()).toBe(false);
        expect(selectedPlatform()).toBe("");
    });
});
