import themes from "$lib/data/themes";
import {frameUrls, iconUrls} from "$lib/data/macicons";
import {registry, type SettingsSchema} from "./registry";


type AsyncInitializer = (registry: SettingsSchema) => Promise<void>;

const asyncInitializers: AsyncInitializer[] = [
    // Font list... web: skip or no-op; desktop: shell out to `ghostty +list-fonts`
    async (_: SettingsSchema) => {
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

export async function runAsyncInitializers() {
    await Promise.allSettled(asyncInitializers.map(fn => fn(registry)));
}


// TODO: this belongs elsewhere surely
const getOS = () => {
    if (typeof navigator === "undefined") return "other";
    const platform = navigator.userAgent?.toLowerCase();
    if (platform.includes("linux")) return "linux";
    if (platform.includes("mac")) return "macos";
    return "other";
};

type Initializer = (registry: SettingsSchema) => void;

const syncInitializers: Initializer[] = [
    (_: SettingsSchema) => {
        // Leaving this here as an example for the future
        // Apparently Ghostty now sets this to "true" for both mac and linux
        // reg.copyOnSelect.default = getOS() === "linux" ? "true" : "false";
    },

    // Theme list from iTerm2-Color-Schemes
    (reg: SettingsSchema) => {
        const themeSetting = reg.theme;
        if (themeSetting?.type !== "theme") return;
        themeSetting.options = Object.keys(themes);
    },

    // MacOS icon options
    (reg: SettingsSchema) => {
        const iconSetting = reg.macosIcon;
        if (iconSetting?.type !== "dropdown") return;
        iconSetting.options = [
            ...Object.keys(iconUrls).map(key => ({
                value: key,
                name: key[0].toUpperCase() + key.slice(1),
                group: "Predefined icons",
                icon: iconUrls[key as keyof typeof iconUrls]
            })),
            {value: "custom", name: "Custom Icon", description: "Use your own icon file.", group: "Custom"},
            {value: "custom-style", name: "Custom Style", description: "Customize the icon with colors and frames.", group: "Custom"}
        ];
    },

    // MacOS icon frame options
    (reg: SettingsSchema) => {
        const frameSetting = reg.macosIconFrame;
        if (frameSetting?.type !== "dropdown") return;
        frameSetting.options = Object.keys(frameUrls).map(key => ({
            value: key,
            name: key[0].toUpperCase() + key.slice(1),
            icon: frameUrls[key as keyof typeof frameUrls]
        }));
    },

    (reg: SettingsSchema) => reg.quitAfterLastWindowClosed.default = getOS() !== "macos",
];

export function runSyncInitializers() {
    syncInitializers.map(fn => fn(registry));
}


export async function runInitializers() {
    runSyncInitializers();
    if (typeof window !== "undefined") await runAsyncInitializers();
}