import settings from "$lib/data/settings";
import {writable} from "svelte/store";

const defaults: Record<string, any> = {};

for (const panel of settings) {
    for (const group of panel.groups) {
        for (const setting of group.settings) {
            defaults[setting.id] = setting.value;
        }
    }
}

// console.log(defaults);

const config = writable(defaults);

// setTimeout(() => {
//     config.update(conf => {
//         conf["desktopNotifications"] = false;
//         return conf;
//     })
// }, 10000);

export default config;
