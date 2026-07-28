import {SvelteSet} from "svelte/reactivity";

import registry from "$lib/settings/registry";
import type {GhosttyPlatform, SettingInfo} from "$lib/settings/types";


// Global, view-only platform filter. Hides settings irrelevant to the selected platform(s)
// from every settings page and from search. It is *view-only*: it never touches `config`,
// `diff()`, serialization, or import — a hidden setting with a non-default value still exports.
// Ephemeral by design; not persisted (see notes/plans — session persistence is a deliberate
// follow-up, not v1).

// The user-facing choices are the two coarse platforms, not the raw five-value tag union.
export type FilterPlatform = "macos" | "linux";

// Maps a user-facing platform to the raw registry tags it should reveal. Linux covers the GTK
// variants since those settings only apply on Linux.
const PLATFORM_TAGS: Record<FilterPlatform, GhosttyPlatform[]> = {
    macos: ["macos"],
    linux: ["linux", "gtk", "gtk-wayland", "gtk-x11"]
};

const ALL_FILTER_PLATFORMS = Object.keys(PLATFORM_TAGS) as FilterPlatform[];

// `platforms === null` means no filter (show everything). A non-null set holds the raw tags to
// reveal; every tagged setting is visible iff its tag list intersects the set.
export const filterState = $state<{platforms: SvelteSet<GhosttyPlatform> | null}>({platforms: null});


export function isFilterActive(): boolean {
    return filterState.platforms !== null;
}

// Whether a given user-facing platform toggle currently reads as "on". A platform is selected
// iff all of its raw tags are present in the active set.
export function isPlatformSelected(platform: FilterPlatform): boolean {
    const set = filterState.platforms;
    if (!set) return false;
    return PLATFORM_TAGS[platform].every(tag => set.has(tag));
}

// Recompute the raw tag set from the user-facing selection. None-selected or all-selected both
// collapse to `null` (show all) — with only two platforms covering the whole tag union, "both"
// is equivalent to "no filter".
function applySelection(selected: FilterPlatform[]): void {
    if (selected.length === 0 || selected.length === ALL_FILTER_PLATFORMS.length) {
        filterState.platforms = null;
        return;
    }

    const tags = new SvelteSet<GhosttyPlatform>();
    for (const platform of selected) {
        for (const tag of PLATFORM_TAGS[platform]) tags.add(tag);
    }
    filterState.platforms = tags;
}

export function togglePlatform(platform: FilterPlatform): void {
    const selected = ALL_FILTER_PLATFORMS.filter(isPlatformSelected);
    applySelection(selected.includes(platform) ? selected.filter(p => p !== platform) : [...selected, platform]);
}

export function clearFilter(): void {
    filterState.platforms = null;
}

// The single visibility predicate. Untagged settings are always visible; a tagged setting is
// visible iff its tags intersect the active selection.
export function isVisible(settingId: string): boolean {
    const set = filterState.platforms;
    if (!set) return true;

    const setting = registry[settingId as keyof typeof registry] as SettingInfo | undefined;
    const tags = setting?.platform;
    if (!tags || tags.length === 0) return true;
    return tags.some(tag => set.has(tag));
}
