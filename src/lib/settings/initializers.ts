import {fetchThemeFiles, parseThemeFiles} from "$lib/utils/themes";
import {registry} from "./registry";
import type {SettingsRegistry} from "./types";


type Initializer = (registry: SettingsRegistry) => Promise<void>;

const initializers: Initializer[] = [
    // Theme list from iTerm2-Color-Schemes
    async (reg: SettingsRegistry) => {
        const themeSetting = reg.theme;
        if (themeSetting?.type !== "theme") return;
        const files = await fetchThemeFiles();
        const themeNames = parseThemeFiles(files);
        themeSetting.options.push(...themeNames);
    },

    // Font list... web: skip or no-op; desktop: shell out to `ghostty +list-fonts`
    async (_: SettingsRegistry) => {
        // The following TODO was written by a clanker.
        // TODO: implement this, ideally by shelling out to `ghostty +list-fonts`
        // and parsing the output, which would ensure the list is accurate and
        // includes any custom fonts the user has installed. This is a bit more
        // complex than the theme enrichment because it involves running a child
        // process and handling its output, but it would provide a much better
        // user experience. For now, we can leave this as a no-op or populate
        // it with a static list of common fonts as a placeholder.
    },
];

export async function runInitializers() {
    await Promise.allSettled(initializers.map(fn => fn(registry)));
}