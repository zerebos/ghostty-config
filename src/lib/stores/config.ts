import {dev} from "$app/environment";
import settings from "$lib/data/settings";
import {get, writable} from "svelte/store";
// import defs from "../data/defaults.json";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const defaults: Record<string, any> = {};

for (const panel of settings) {
    for (const group of panel.groups) {
        for (const setting of group.settings) {
            defaults[setting.id] = setting.value;
        }
    }
}

if (dev) {
    // eslint-disable-next-line no-console
    console.log(defaults);
}

const config = writable(Object.assign({}, defaults));

export function printDifferences() {
    const current = get(config);
    const output: typeof defaults = {};
    
    for (const key in current) {
        if (current[key] !== defaults[key]) output[key] = current[key];
    }

    // eslint-disable-next-line no-console
    console.log(current);

    // eslint-disable-next-line no-console
    console.log(output);
}

// setTimeout(() => {
//     config.update(conf => {
//         conf["desktopNotifications"] = false;
//         return conf;
//     })
// }, 10000);

export default config;
