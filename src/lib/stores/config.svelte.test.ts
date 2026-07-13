import {afterEach, describe, expect, it} from "vitest";
import config, {defaults, diff, diffFromDefaults, isNonDefault, load, resetSetting} from "./config.svelte";
import {serialize} from "$lib/utils/parse";

// These lock in the flat-string store contract: every value is a string | string[], and
// diff()/load() compare/merge them as such (see the store-flatten note in AGENTS.md). There was
// no coverage guarding this serialization source of truth before, so this doubles as regression
// protection.

afterEach(() => {
    // config is a module singleton; reset anything a test touched
    for (const k of ["fontSize", "desktopNotifications", "fontFamily", "windowWidth", "background", "keybind", "palette"] as const) {
        resetSetting(k);
    }
});

describe("flat store defaults", () => {
    it("holds strings for former number/boolean settings", () => {
        expect(defaults.fontSize).toBe("13");
        expect(defaults.desktopNotifications).toBe("true");
        expect(defaults.windowWidth).toBe(""); // was `undefined`
        expect(typeof config.fontSize).toBe("string");
    });

    it("holds string[] for repeatable settings", () => {
        expect(Array.isArray(defaults.fontFamily)).toBe(true);
        expect(Array.isArray(defaults.palette)).toBe(true);
    });
});

describe("diff()", () => {
    it("omits values equal to their (string) default", () => {
        expect(diff()["font-size"]).toBeUndefined();
        expect(isNonDefault("fontSize")).toBe(false);
    });

    it("emits a changed scalar as a string", () => {
        config.fontSize = "16";
        expect(diff()["font-size"]).toBe("16");
        expect(isNonDefault("fontSize")).toBe(true);
    });

    it("emits a changed boolean-encoded scalar as a string", () => {
        config.desktopNotifications = "false";
        expect(diff()["desktop-notifications"]).toBe("false");
    });

    it("emits a changed repeatable setting as a string array", () => {
        config.fontFamily = ["JetBrainsMono NF", "Symbols Nerd Font"];
        expect(diff()["font-family"]).toEqual(["JetBrainsMono NF", "Symbols Nerd Font"]);
    });

    // The two genuinely-special array cases: keybind emits only additions over the defaults,
    // palette emits `index=color` only for slots differing from their default. Both flow
    // through diffFromDefaults now that diff() delegates — these lock that behavior in place.
    it("emits only keybind additions over the default set", () => {
        config.keybind = [...defaults.keybind, "ctrl+shift+x=copy_to_clipboard"];
        expect(diff().keybind).toEqual(["ctrl+shift+x=copy_to_clipboard"]);
    });

    it("emits changed palette slots in index=color form", () => {
        expect(diff().palette).toBeUndefined(); // untouched palette contributes nothing
        config.palette[5] = "#ffffff";
        config.palette[0] = "#000000";
        expect(diff().palette).toEqual(["0=#000000", "5=#ffffff"]);
    });
});

describe("diff() === diffFromDefaults(config)", () => {
    // diff() is defined as diffFromDefaults(config); prove the delegation holds for every
    // value shape (scalar, generic repeatable, keybind, palette) so the de-dup can't silently
    // diverge from the live-store behavior it replaced.
    it("matches for scalar, repeatable, keybind, and palette changes at once", () => {
        config.fontSize = "18";
        config.fontFamily = ["JetBrainsMono NF"];
        config.keybind = [...defaults.keybind, "ctrl+shift+x=copy_to_clipboard"];
        config.palette[5] = "#ffffff";
        expect(diff()).toEqual(diffFromDefaults(config));
    });
});

describe("load()", () => {
    it("merges parsed string values through as-is", () => {
        load({fontSize: "20", background: "#123456"});
        expect(config.fontSize).toBe("20");
        expect(config.background).toBe("#123456");
    });
});

describe("load() idempotency (session-restore cycle)", () => {
    // The persisted diff carries only non-default keybinds; restoring it re-runs load(), which
    // appends. Two loads of the same additions (a double restore, or restore-then-persist-restore)
    // must not duplicate — otherwise every refresh grows the keybind list. Palette merges
    // per-index and is idempotent by construction; covered here in the same cycle.
    const sparsePalette = (index: number, color: string) => {
        const arr = Array.from<string>({length: 256}).fill("");
        arr[index] = color;
        return arr;
    };

    it("does not duplicate keybinds across repeated loads", () => {
        const custom = "ctrl+shift+x=copy_to_clipboard" as const;
        load({keybind: [custom]});
        load({keybind: [custom]});
        expect(config.keybind.filter(k => k === custom)).toHaveLength(1);
    });

    it("merges palette slots idempotently", () => {
        load({palette: sparsePalette(5, "#ffffff")});
        load({palette: sparsePalette(5, "#ffffff")});
        expect(config.palette[5]).toBe("#ffffff");
        expect(diff().palette).toEqual(["5=#ffffff"]);
    });
});

describe("round-trip diff -> serialize", () => {
    it("renders a flat diff as Ghostty config lines", () => {
        config.fontSize = "18";
        config.desktopNotifications = "false";
        const text = serialize(diff(), false);
        expect(text).toContain("font-size = 18");
        expect(text).toContain("desktop-notifications = false");
    });

    it("diffFromDefaults matches diff for the same change", () => {
        config.fontSize = "22";
        expect(diffFromDefaults({fontSize: "22"})["font-size"]).toBe("22");
    });
});
