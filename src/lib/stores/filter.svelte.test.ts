import {afterEach, describe, expect, it} from "vitest";
import registry from "$lib/settings/registry";
import type {GhosttyPlatform, SettingInfo} from "$lib/settings/types";
import {clearFilter, filterState, isFilterActive, isPlatformSelected, isVisible, togglePlatform} from "./filter.svelte";

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
    it("shows everything when no filter is active", () => {
        expect(isFilterActive()).toBe(false);
        expect(isVisible(macId)).toBe(true);
        expect(isVisible(gtkId)).toBe(true);
        expect(isVisible(untaggedId)).toBe(true);
    });

    it("hides settings whose tags don't intersect the macOS selection", () => {
        togglePlatform("macos");
        expect(isFilterActive()).toBe(true);
        expect(isVisible(macId)).toBe(true);
        expect(isVisible(gtkId)).toBe(false);
        expect(isVisible(linuxId)).toBe(false);
    });

    it("reveals gtk/linux settings under the Linux selection", () => {
        togglePlatform("linux");
        expect(isVisible(linuxId)).toBe(true);
        expect(isVisible(gtkId)).toBe(true);
        expect(isVisible(macId)).toBe(false);
    });

    it("always shows untagged settings, filter active or not", () => {
        togglePlatform("macos");
        expect(isVisible(untaggedId)).toBe(true);
        togglePlatform("macos");
        togglePlatform("linux");
        expect(isVisible(untaggedId)).toBe(true);
    });
});

describe("platform selection", () => {
    it("collapses selecting both platforms back to no filter (show all)", () => {
        togglePlatform("macos");
        togglePlatform("linux");
        expect(isFilterActive()).toBe(false);
        expect(filterState.platforms).toBeNull();
        expect(isVisible(macId)).toBe(true);
        expect(isVisible(gtkId)).toBe(true);
    });

    it("toggling a platform off clears the filter", () => {
        togglePlatform("macos");
        expect(isPlatformSelected("macos")).toBe(true);
        togglePlatform("macos");
        expect(isPlatformSelected("macos")).toBe(false);
        expect(isFilterActive()).toBe(false);
    });

    it("clearFilter resets to show-all", () => {
        togglePlatform("linux");
        clearFilter();
        expect(isFilterActive()).toBe(false);
        expect(isPlatformSelected("linux")).toBe(false);
    });
});
