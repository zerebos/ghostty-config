import {dev} from "$app/environment";
import {fetchColorScheme} from "$lib/data/settings";
import {registry, type SettingDefaults, type SettingValues} from "$lib/settings/registry";
import parse from "$lib/utils/parse";
// import defs from "../data/defaults.json";

// TODO: find a good way to properly type the config
const defaults = Object.fromEntries(Object.entries(registry).map(([k, v]) => [k, v.default])) as SettingDefaults;

// for (const panel of settings) {
//     for (const group of panel.groups) {
//         for (const setting of group.settings) {
//             // @ts-expect-error - this is a bit hacky but it allows us to avoid having to maintain a separate defaults file, and also ensures that the defaults are always in sync with the schema
//             defaults[setting.id as keyof SettingValues] = setting.value;
//         }
//     }
// }

if (dev) {
    // eslint-disable-next-line no-console
    console.log(defaults);
}

const config: SettingValues = $state(Object.assign({}, defaults));


export function keyToConfig(key: string) {
    return key.replaceAll(/([A-Z])/g, "-$1").toLowerCase();
}

export function diff() {
    // TODO: more elegance
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-redundant-type-constituents
    const output: Partial<Record<keyof typeof defaults | string, any>> = {};

    for (const k in config) {
        const key = k as keyof SettingValues;
        if (Array.isArray(config[key]) && key === "keybind") {
            const toAdd = config[key].filter(c => !defaults[key].includes(c as never));
            if (toAdd.length) output[keyToConfig(key)] = toAdd;
        }
        else if (Array.isArray(config[key]) && key === "palette") {
            const toAdd = [];
            for (let p = 0; p < defaults[key].length; p++) {
                if (config[key][p] === defaults[key][p]) continue;
                toAdd.push(`${p}=${config[key][p]}`);
            }
            if (toAdd.length) output[keyToConfig(key)] = toAdd;
        }
        else if (config[key] != defaults[key]) {
            output[keyToConfig(key)] = config[key];
        }
    }

    return output;
}

export function load(conf: Partial<typeof config>) {
    for (const key in conf) {
        if (!(key in config)) continue;
        if (key !== "keybind" && key !== "palette") {
            // @ts-expect-error doing this properly is hard
            config[key as keyof typeof config] = conf[key as keyof typeof config]!;
        }
        else if (key === "keybind") {
            config.keybind = [...config.keybind, ...conf.keybind!];
        }
        else if (key === "palette") {
            for (let p = 0; p < conf.palette!.length; p++) {
                if (!conf.palette![p]) continue;
                config.palette[p] = conf.palette![p];
            }
        }
    }
}

export async function setColorScheme(name: string): Promise<boolean> {
    if (name === "") {
        resetColorScheme();
        return true;
    }

    try {
        const colorSchemeResponse = await fetchColorScheme(name);
        // TODO: move the assertion into the return,
        // didn't do it now because it would have lead to a circular dep
        const parsed = parse(colorSchemeResponse) as Partial<SettingValues>;
        load(parsed);
        return true;
    }
    catch (err) {
        // TODO: give feedback to user maybe?
        console.error(err); // eslint-disable-line no-console
        return false;
    }
}

export function resetColorScheme() {
    const keys = [
        "background",
        "foreground",
        "cursorColor",
        "selectionBackground",
        "selectionForeground"
    ] as Array<keyof SettingValues>;

    for (const key of keys) {
        // @ts-expect-error doing this properly is hard
        config[key] = defaults[key];
    }

    for (let c = 0; c < defaults.palette.length; c++) {
        config.palette[c] = defaults.palette[c];
    }
}

export function resetSetting(key: keyof SettingValues) {
    const defaultValue = defaults[key];
    // @ts-expect-error doing this properly is hard
    config[key] = Array.isArray(defaultValue) ? [...defaultValue] : defaultValue;
}

export function isNonDefault(key: keyof SettingValues): boolean {
    const val = config[key];
    const defaultVal = defaults[key];

    // Handle array comparisons for keybinds and palette
    if (Array.isArray(val) && Array.isArray(defaultVal)) {
        if (val.length !== defaultVal.length) return true;
        for (let i = 0; i < val.length; i++) {
            if (val[i] !== defaultVal[i]) return true;
        }
        return false;
    }

    return val !== defaultVal;
}

export {defaults};
export default config;
