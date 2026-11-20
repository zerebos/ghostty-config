import registry from "$lib/settings/registry";
import type {GhosttyPlatform, SettingInfo} from "$lib/settings/types";


// Global, view-only platform filter. Hides settings irrelevant to the selected platform from
// every settings page and from search. It is *view-only*: it never touches `config`, `diff()`,
// serialization, or import — a hidden setting with a non-default value still exports. Ephemeral
// by design; not persisted (see notes/plans — session persistence is a deliberate follow-up).

// The user-facing choice is a single coarse platform, not the raw five-value tag union. With only
// two platforms covering the whole union, "both" and "neither" are the same outcome (show all),
// so a single-select `All | macOS | Linux` captures every distinct state — `""` is that "All".
export type FilterPlatform = "macos" | "linux";

// Maps a user-facing platform to the raw registry tags it should reveal. Linux covers the GTK
// variants since those settings only apply on Linux.
const PLATFORM_TAGS: Record<FilterPlatform, GhosttyPlatform[]> = {
    macos: ["macos"],
    linux: ["linux", "gtk", "gtk-wayland", "gtk-x11"]
};

// `platform === ""` means no filter (show everything); otherwise the single selected platform.
export const filterState = $state<{platform: FilterPlatform | ""}>({platform: ""});


export function isFilterActive(): boolean {
    return filterState.platform !== "";
}

export function selectedPlatform(): FilterPlatform | "" {
    return filterState.platform;
}

export function setPlatform(platform: FilterPlatform | ""): void {
    filterState.platform = platform;
}

export function clearFilter(): void {
    filterState.platform = "";
}

// The single visibility predicate. Untagged settings are always visible; a tagged setting is
// visible iff its tags intersect the selected platform's tag set.
export function isVisible(settingId: string): boolean {
    if (filterState.platform === "") return true;

    const setting = registry[settingId as keyof typeof registry] as SettingInfo | undefined;
    const tags = setting?.platform;
    if (!tags || tags.length === 0) return true;

    const allowed = PLATFORM_TAGS[filterState.platform];
    return tags.some(tag => allowed.includes(tag));
}
