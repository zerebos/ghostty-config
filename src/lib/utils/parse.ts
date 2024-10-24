import type {KeybindString} from "$lib/data/settings";
import type {HexColor} from "./colors";

const re = /^\s*([a-z-]+)[\s]*=\s*(.*)\s*$/;

const colors = ["background", "foreground", "cursor-color", "selection-background", "selection-foreground"];

export default function(configString: string) {
    const lines = configString.split("\n");

    const results = {
        palette: Array(256),
        keybind: [] as Array<string>
    } as {palette: (HexColor|"")[], keybind: KeybindString[], [key: string]: string|string[]};

    for (let p = 0; p < 256; p++) results.palette[p] = "";

    for (const l of lines) {
        const line = l.trim();
        const match = re.exec(line);
        if (!match) continue;
        const key = match[1].trim();
        const value = match[2].trim();

        if (key === "palette") {
            const split = value.split("=");
            const num = parseInt(split[0].trim());
            const color = split[1].trim() as HexColor; // TODO: perform validation
            if (num < 0 || num > 255) continue;
            results.palette[num] = color;
        }
        else if (key === "keybind") {
            results.keybind.push(value as KeybindString); // TODO: perform validation
        }
        else {
            const split = key.split("-");
            let newKey = split[0].trim();
            for (let s = 1; s < split.length; s++) {
                newKey += split[s].charAt(0).toUpperCase();
                newKey += split[s].substring(1);
            }

            if (colors.includes(key) && value.length === 6 && !value.startsWith("#")) {
                results[newKey] = `#${value}`;
            }
            else {
                results[newKey] = value;
            }
        }
    }

    return results;
};

