import {dev} from "$app/environment";
import settings from "$lib/data/settings";
import {writable} from "svelte/store";

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

const config = writable(defaults);

// setTimeout(() => {
//     config.update(conf => {
//         conf["desktopNotifications"] = false;
//         return conf;
//     })
// }, 10000);

export default config;
