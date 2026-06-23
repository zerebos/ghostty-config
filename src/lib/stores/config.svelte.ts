import {dev} from "$app/environment";
import {registry, type SettingDefaults, type SettingValues} from "$lib/settings/registry";
import {runInitializers} from "$lib/settings/initializers";
import themes from "$lib/data/themes";


// Run initializers before setting up defaults to ensure that any dynamic options are populated
void runInitializers();

const buildDefaults = () => Object.fromEntries(Object.entries(registry).map(([k, v]) => [k, v.default])) as SettingDefaults;
const defaults = buildDefaults();
if (dev) console.log(defaults); // eslint-disable-line no-console

const config: SettingValues = $state(buildDefaults());


export function diff() {
    // TODO: more elegance
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-redundant-type-constituents
    const output: Partial<Record<keyof typeof defaults | string, any>> = {};

    for (const k in config) {
        const settingId = k as keyof SettingValues;
        const settingKey = registry[settingId].key;
        if (Array.isArray(config[settingId]) && settingId === "keybind") {
            const toAdd = config[settingId].filter(c => !defaults[settingId].includes(c as never));
            if (toAdd.length) output[settingKey] = toAdd;
        }
        else if (Array.isArray(config[settingId]) && settingId === "palette") {
            const toAdd = [];
            for (let p = 0; p < defaults[settingId].length; p++) {
                if (config[settingId][p] === defaults[settingId][p]) continue;
                toAdd.push(`${p}=${config[settingId][p]}`);
            }
            if (toAdd.length) output[settingKey] = toAdd;
        }
        else if (config[settingId] != defaults[settingId]) {
            output[settingKey] = config[settingId];
        }
    }

    return output;
}

// FIXME: de-dup with above
export function diffFromDefaults(conf: Partial<SettingValues>) {
    // TODO: more elegance
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-redundant-type-constituents
    const output: Partial<Record<keyof typeof defaults | string, any>> = {};

    for (const k in conf) {
        const settingId = k as keyof SettingValues;
        const settingKey = registry[settingId]?.key;
        if (!settingKey) continue;
        if (Array.isArray(conf[settingId]) && settingId === "keybind") {
            const toAdd = conf[settingId].filter(c => !defaults[settingId].includes(c as never));
            if (toAdd.length) output[settingKey] = toAdd;
        }
        else if (Array.isArray(conf[settingId]) && settingId === "palette") {
            const toAdd = [];
            for (let p = 0; p < defaults[settingId].length; p++) {
                if (!conf[settingId][p]) continue;
                if (conf[settingId][p] === defaults[settingId][p]) continue;
                toAdd.push(`${p}=${conf[settingId][p]}`);
            }
            if (toAdd.length) output[settingKey] = toAdd;
        }
        else if (conf[settingId] != defaults[settingId]) {
            output[settingKey] = conf[settingId];
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

export function setColorScheme(name: string): boolean {
    if (name === "") {
        resetColorScheme();
        return true;
    }

    const theme = themes[name as keyof typeof themes];
    if (!theme) return false;

    // Clear out any extra keys the next theme doesn't use
    resetColorScheme();
    load(theme);
    return true;
}

export function resetColorScheme() {
    const keys = [
        "background",
        "foreground",
        "cursorColor",
        "cursorText",
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
