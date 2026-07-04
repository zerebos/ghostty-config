/**
 * Platform abstraction layer.
 *
 * The same Svelte codebase powers two build targets:
 *
 *   - the public **web** build (SvelteKit + adapter-static, deployed to Cloudflare)
 *   - the offline **desktop** build (the web assets embedded in a Wails shell)
 *
 * `isDesktop` is resolved at build time from the `VITE_DESKTOP` env var (set by the
 * `build:desktop` script) so the branch is tree-shakeable: the web bundle never ships
 * the desktop code paths and vice-versa. Runtime bridge calls additionally guard on the
 * presence of the Wails-injected globals so a mis-flagged build fails soft instead of
 * throwing.
 */

// `import.meta.env` is typed with an `any` index signature; narrow it once so the rest of
// the module stays free of unsafe-any accesses.
const env = import.meta.env as unknown as Record<string, string | undefined>;

/** True when this bundle was built for the Wails desktop shell. */
export const isDesktop: boolean = env.VITE_DESKTOP === "1";

/**
 * Canonical, publicly-reachable origin for the app. Share links generated on the web use
 * the current location (so they stay agnostic to whatever host serves them), but the
 * desktop build has no meaningful location to share, so it falls back to this URL. Override
 * at build time with `VITE_CANONICAL_URL`.
 */
export const CANONICAL_URL: string = env.VITE_CANONICAL_URL ?? "https://ghostty.zerebos.com";

/** Route that share links point at. */
export const SHARE_PATHNAME = "/app/import-export";

/**
 * Shape of the Go methods Wails binds onto `window.go.main.App`. These are hand-declared
 * (rather than importing generated `wailsjs` bindings) so the web build has zero dependency
 * on the desktop toolchain. Keep in sync with the `App` methods in `desktop/app.go`.
 */
interface WailsAppBindings {
    GetConfigPath(): Promise<string>;
    ReadGhosttyConfig(): Promise<string>;
    WriteGhosttyConfig(content: string): Promise<void>;
    LaunchTerminal(): Promise<void>;
    GetWallpaperColor(): Promise<string>;
}

/** Subset of the runtime Wails injects at `window.runtime` for native window control. */
interface WailsRuntime {
    Quit(): void;
    WindowMinimise(): void;
    WindowToggleMaximise(): void;
}

interface WailsWindow extends Window {
    go?: {main?: {App?: WailsAppBindings}};
    runtime?: WailsRuntime;
}

/* eslint-disable new-cap -- the Go methods Wails binds are exported (PascalCase) by language rule */

function bindings(): WailsAppBindings | null {
    if (typeof window === "undefined") return null;
    return (window as WailsWindow).go?.main?.App ?? null;
}

function runtime(): WailsRuntime | null {
    if (typeof window === "undefined") return null;
    return (window as WailsWindow).runtime ?? null;
}

/**
 * The desktop bridge. Every method rejects when called outside the Wails shell, so callers
 * should gate on `isDesktop` (compile-time) and may additionally `try/catch` for safety.
 */
export const desktop = {
    /** Whether the live Wails bridge is actually reachable right now. */
    get available(): boolean {
        return bindings() !== null;
    },

    /** Absolute path to the Ghostty config file this machine reads/writes. */
    async configPath(): Promise<string> {
        const app = bindings();
        if (!app) throw new Error("Desktop bridge unavailable");
        return app.GetConfigPath();
    },

    /** Read the live Ghostty config file from disk. */
    async readConfig(): Promise<string> {
        const app = bindings();
        if (!app) throw new Error("Desktop bridge unavailable");
        return app.ReadGhosttyConfig();
    },

    /** Overwrite the live Ghostty config file on disk. */
    async writeConfig(content: string): Promise<void> {
        const app = bindings();
        if (!app) throw new Error("Desktop bridge unavailable");
        await app.WriteGhosttyConfig(content);
    },

    /** Launch a real Ghostty terminal window. */
    async launchTerminal(): Promise<void> {
        const app = bindings();
        if (!app) throw new Error("Desktop bridge unavailable");
        await app.LaunchTerminal();
    },

    /**
     * Best-effort average color of the OS desktop wallpaper as a `#rrggbb` string, or an empty
     * string if it can't be determined (unsupported format, no desktop environment, etc.). Used
     * to hue-tint the app's surfaces the way macOS tints its own chrome.
     */
    async wallpaperColor(): Promise<string> {
        const app = bindings();
        if (!app) throw new Error("Desktop bridge unavailable");
        return app.GetWallpaperColor();
    },

    /** Close the native window (quits the app). */
    quit(): void {
        runtime()?.Quit();
    },

    /** Minimize the native window to the taskbar/dock. */
    minimize(): void {
        runtime()?.WindowMinimise();
    },

    /** Toggle the native window between maximized and its previous size. */
    toggleMaximize(): void {
        runtime()?.WindowToggleMaximise();
    }
};

/** Origin to use when building a share link for the current build target. */
export function shareOrigin(): string {
    if (isDesktop) return CANONICAL_URL;
    return typeof window === "undefined" ? CANONICAL_URL : window.location.origin;
}

/** Pathname to use when building a share link for the current build target. */
export function sharePathname(): string {
    if (isDesktop) return SHARE_PATHNAME;
    return typeof window === "undefined" ? SHARE_PATHNAME : window.location.pathname;
}
