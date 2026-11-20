import {dev} from "$app/environment";

import {diff, load} from "$lib/stores/config.svelte";
import {parse, serialize} from "$lib/utils/parse";
import {debounce} from "$lib/utils/debounce";

// Session-scoped refresh protection. We persist the *serialized diff text* (never the store
// object) under a versioned key for the lifetime of the browsing session only, i.e. refresh/tab
// reload restores in-progress work; closing the tab (new session) starts pristine. Rationale
// for storing diff text rather than state: restore reuses the existing parse()/load() import
// path, the stored text is forward-compatible kebab-key config, only deltas are stored so
// registry-default changes flow through, and theme colors can never leak in (they are derived,
// never written to the store). This module intentionally knows about config; config must NOT
// know about persistence as the dependency points one way.

export const SESSION_KEY = "ghostty-config:session:v1";
const WRITE_DEBOUNCE_MS = 300;

function sessionStore(): Storage | null {
    if (typeof window === "undefined") return null;
    try {
        return window.sessionStorage;
    }
    catch {
        // sessionStorage can throw on access in some privacy modes.
        return null;
    }
}

/** Remove the persisted session entirely. Used by the global "Reset all" control. */
export function clearPersistedSession() {
    const store = sessionStore();
    if (!store) return;
    try {
        store.removeItem(SESSION_KEY);
    }
    catch {/* ignore */}
}

/**
 * Restore any persisted session into the live store via the normal import path. Silent by
 * design... Same-session state is never surprising, so there is no toast or restore notice.
 * Must run before any share-hash import preview is built so the modal's "importing will
 * overwrite your changes" framing is truthful against the restored state.
 */
export function restorePersistedSession() {
    const store = sessionStore();
    if (!store) return;

    let text: string | null;
    try {
        text = store.getItem(SESSION_KEY);
    }
    catch {
        return;
    }
    // Empty string = a persisted-but-pristine session (e.g. after a reset). Nothing to load.
    if (!text) return;

    try {
        load(parse(text));
    }
    catch (err) {
        // Corrupt session text, discard it. Blast radius is a single session, so no `:backup` ceremony. Just drop it and continue from defaults.
        if (dev) console.error("Failed to restore persisted session:", err); // eslint-disable-line no-console
        clearPersistedSession();
    }
}

let stopEffect: (() => void) | null = null;

/**
 * Begin persisting the working config to sessionStorage on every change (debounced,
 * trailing-edge so the final state wins). Idempotent and a no-op without sessionStorage
 * (SSR/prerender, privacy modes).
 */
export function startPersisting() {
    const store = sessionStore();
    if (!store || stopEffect) return;

    const write = debounce(() => {
        try {
            store.setItem(SESSION_KEY, serialize(diff(), false));
        }
        catch {/* quota / privacy — best-effort */}
    }, WRITE_DEBOUNCE_MS, {leading: false, trailing: true});

    stopEffect = $effect.root(() => {
        $effect(() => {
            // diff() touches every config key, so this effect reruns on any config change.
            diff();
            write();
        });
    });
}

/** Tear down the persistence effect. Primarily for tests. */
export function stopPersisting() {
    stopEffect?.();
    stopEffect = null;
}
