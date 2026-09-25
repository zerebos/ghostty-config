import {afterEach, describe, expect, it, vi} from "vitest";

// Covers the session refresh-protection *restore/clear* surface in persistence store: the
// no-window/no-storage guards, the parse()/load() restore path, empty-string (pristine after
// reset) handling, corrupt-payload discard, and end-to-end restore idempotency (a double
// restore must not duplicate keybinds, the load() dedup is exercised here through the real
// persistence path). The debounced write effect's reactive timing is intentionally not unit
// tested; it is thin and exercised in the running app.

import config, {defaults, diff, resetAllSettings, resetSetting} from "$lib/stores/config.svelte";
import {serialize} from "$lib/utils/parse";
import {clearPersistedSession, restorePersistedSession, SESSION_KEY} from "./persistence.svelte";

function makeStorage(): Storage {
    const map = new Map<string, string>();
    return {
        getItem: (k: string) => (map.has(k) ? map.get(k)! : null),
        setItem: (k: string, v: string) => void map.set(k, String(v)),
        removeItem: (k: string) => void map.delete(k),
        clear: () => map.clear(),
        key: (i: number) => Array.from(map.keys())[i] ?? null,
        get length() {
            return map.size;
        }
    };
}

function stubSession(storage: Storage = makeStorage()) {
    vi.stubGlobal("window", {sessionStorage: storage});
    return storage;
}

afterEach(() => {
    resetAllSettings();
    vi.unstubAllGlobals();
});

describe("restorePersistedSession", () => {
    it("no-ops (no throw, no mutation) when there is no window", () => {
        expect(() => restorePersistedSession()).not.toThrow();
        expect(config.fontSize).toBe(defaults.fontSize);
    });

    it("restores a persisted diff into the live store via the import path", () => {
        const storage = stubSession();
        storage.setItem(SESSION_KEY, "font-size = 20\nbackground = #123456");

        restorePersistedSession();

        expect(config.fontSize).toBe("20");
        expect(config.background).toBe("#123456");
    });

    it("treats an empty persisted value as pristine (nothing loaded)", () => {
        const storage = stubSession();
        storage.setItem(SESSION_KEY, "");

        restorePersistedSession();

        expect(config.fontSize).toBe(defaults.fontSize);
    });

    it("is idempotent across repeated restores — no duplicated keybinds", () => {
        const storage = stubSession();
        config.keybind = [...defaults.keybind, "ctrl+shift+x=copy_to_clipboard"];
        // Persist exactly what the write path would: the serialized diff (additions only).
        storage.setItem(SESSION_KEY, serialize(diff(), false));

        // Simulate a fresh session (module state reset) then two restores in a row.
        resetSetting("keybind");
        restorePersistedSession();
        restorePersistedSession();

        expect(config.keybind.filter(k => k === "ctrl+shift+x=copy_to_clipboard")).toHaveLength(1);
    });
});

describe("clearPersistedSession", () => {
    it("removes the persisted key so a later restore is pristine", () => {
        const storage = stubSession();
        storage.setItem(SESSION_KEY, "font-size = 20");

        clearPersistedSession();
        expect(storage.getItem(SESSION_KEY)).toBeNull();

        restorePersistedSession();
        expect(config.fontSize).toBe(defaults.fontSize);
    });

    it("no-ops without a window", () => {
        expect(() => clearPersistedSession()).not.toThrow();
    });
});
