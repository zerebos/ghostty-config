import {frameUrls, iconUrls} from "$lib/utils/macicon";
import {fetchThemeFiles, parseThemeFiles} from "$lib/utils/themes";
import {registry, type SettingSchema} from "./registry";


type Initializer = (registry: SettingSchema) => Promise<void>;

const initializers: Initializer[] = [
    // Theme list from iTerm2-Color-Schemes
    async (reg: SettingSchema) => {
        const themeSetting = reg.theme;
        if (themeSetting?.type !== "theme") return;
        const files = await fetchThemeFiles();
        const themeNames = parseThemeFiles(files);
        themeSetting.options.push(...themeNames);
    },

    // eslint-disable-next-line @typescript-eslint/require-await
    async (reg: SettingSchema) => {
        const iconSetting = reg.macosIcon;
        if (iconSetting?.type !== "dropdown") return;
        iconSetting.options = [
            ...Object.keys(iconUrls).map(key => ({
                value: key,
                name: key[0].toUpperCase() + key.slice(1),
                group: "Predefined icons",
                icon: iconUrls[key]
            })),
            {value: "custom", name: "Custom Icon", description: "Use your own icon file.", group: "Custom"},
            {value: "custom-style", name: "Custom Style", description: "Customize the icon with colors and frames.", group: "Custom"}
        ];
    },

    // eslint-disable-next-line @typescript-eslint/require-await
    async (reg: SettingSchema) => {
        const frameSetting = reg.macosIconFrame;
        if (frameSetting?.type !== "dropdown") return;
        frameSetting.options = Object.keys(frameUrls).map(key => ({
            value: key,
            name: key[0].toUpperCase() + key.slice(1),
            icon: frameUrls[key]
        }));
    },

    // Font list... web: skip or no-op; desktop: shell out to `ghostty +list-fonts`
    async (_: SettingSchema) => {
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