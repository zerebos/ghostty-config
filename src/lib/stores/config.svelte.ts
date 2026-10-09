import {dev} from "$app/environment";
import {registry, type SettingDefaults, type SettingValues} from "$lib/settings/registry";
import {runInitializers} from "$lib/settings/initializers";


// Run initializers before setting up defaults to ensure that any dynamic options are populated
void runInitializers();

const buildDefaults = () => Object.fromEntries(Object.entries(registry).map(([k, v]) => [k, v.default])) as SettingDefaults;
const defaults = buildDefaults();
if (dev) console.log(defaults); // eslint-disable-line no-console

const config: SettingValues = $state(buildDefaults());


// diff() is just diffFromDefaults() applied to the live store: every key in `config` exists in
// the registry, and (for palette) every slot is always a real color — so the extra guards in
// diffFromDefaults are no-ops here. One implementation, no drift.
export function diff() {
    return diffFromDefaults(config);
}

export function diffFromDefaults(conf: Partial<SettingValues>) {
    // Flat store: every emitted value is a Ghostty config string, or a string[] for the
    // repeatable/indexed cases (keybind, palette, generic lists). No `any` needed post-flatten.
    const output: Record<string, string | string[]> = {};

    for (const k in conf) {
        const settingId = k as keyof SettingValues;
        const settingKey = registry[settingId]?.key;
        if (!settingKey) continue;
        if (Array.isArray(conf[settingId]) && settingId === "keybind") {
            const toAdd = conf[settingId].filter(c => !defaults[settingId].includes(c as never));
            if (toAdd.length) output[settingKey] = toAdd;
        }
        else if (Array.isArray(conf[settingId]) && settingId === "palette") {
            const toAdd: string[] = [];
            for (let p = 0; p < defaults[settingId].length; p++) {
                if (!conf[settingId][p]) continue;
                if (conf[settingId][p] === defaults[settingId][p]) continue;
                toAdd.push(`${p}=${conf[settingId][p]}`);
            }
            if (toAdd.length) output[settingKey] = toAdd;
        }
        else if (Array.isArray(conf[settingId])) {
            const cur = conf[settingId] as string[];
            const def = defaults[settingId] as string[];
            const changed = cur.length !== def.length || cur.some((v, i) => v !== def[i]);
            if (changed) output[settingKey] = cur.filter(v => v.trim() !== "");
        }
        else if (conf[settingId] !== undefined && conf[settingId] != defaults[settingId]) {
            output[settingKey] = conf[settingId];
        }
    }

    return output;
}

export function load(conf: Partial<typeof config>) {
    for (const key in conf) {
        if (!(key in config)) continue;
        if (key !== "keybind" && key !== "palette") {
            setSetting(key as keyof typeof config, conf[key as keyof typeof config]!);
        }
        else if (key === "keybind") {
            // Dedup on append: skip keybinds already present. load() runs on every import
            // source (share, clipboard, file, session restore); without this, restoring a
            // persisted session — whose diff already carries the non-default keybinds —
            // would re-append them each cycle and duplicate custom binds. Palette (below)
            // merges per-index and is naturally idempotent.
            const additions = conf.keybind!.filter(k => !config.keybind.includes(k));
            if (additions.length) config.keybind = [...config.keybind, ...additions];
        }
        else if (key === "palette") {
            for (let p = 0; p < conf.palette!.length; p++) {
                if (!conf.palette![p]) continue;
                config.palette[p] = conf.palette![p];
            }
        }
    }
}

// NOTE: theme colors are never written into this store. Selecting a theme only sets the
// `theme` string; the displayed colors are derived in stores/theme.svelte.ts (effectiveColors),
// which is why diff() needs no theme-exclusion logic to keep exports clean.

/**
 * Typed single-setting write. Prefer this over assigning through a widened `config[key]`
 * lvalue in components — the generic ties the value type to the key, no cast needed.
 * */
export function setSetting<K extends keyof SettingValues>(key: K, value: SettingValues[K]) {
    config[key] = value;
}

export function resetSetting(key: keyof SettingValues) {
    const defaultValue = defaults[key];
    setSetting(key, Array.isArray(defaultValue) ? [...defaultValue] : defaultValue);
}

/** Reset every setting to its registry default. Config-state only — touches nothing else. */
export function resetAllSettings() {
    for (const key in defaults) resetSetting(key as keyof SettingValues);
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
