/**
 * Wails desktop build helpers.
 *
 * `DESKTOP` is a **build-time** constant baked in by Vite when the project is
 * built with `--mode desktop` (i.e. `npm run build:desktop`).  It is `false`
 * for the standard web build so that all desktop-only code paths are
 * tree-shaken out of the web bundle.
 *
 * The Go method wrappers (`readGhosttyConfig`, etc.) call the bindings that
 * Wails injects at runtime into `window.go`.  They should only be called from
 * code that is already guarded by `DESKTOP`.
 */

/**
 * Build-time flag — `true` when built with `vite build --mode desktop`
 * (the Wails build), `false` for the standard web build.
 *
 * Evaluated at compile time; the inactive branch is tree-shaken by the
 * bundler so desktop-only code never ships in the web build.
 */
export const DESKTOP = import.meta.env.VITE_DESKTOP === "true";

interface WailsGoApp {
    ReadGhosttyConfig: () => Promise<string>;
    WriteGhosttyConfig: (content: string) => Promise<void>;
    GetGhosttyConfigPath: () => Promise<string>;
}

/** @internal */
function getWailsApp(): WailsGoApp | null {
    if (typeof window === "undefined") return null;
    // Wails v2 injects Go bindings under window.go.<package>.<struct>
    return (window as unknown as {go?: {main?: {App?: WailsGoApp}}}).go?.main?.App ?? null;
}

/**
 * Reads the user's Ghostty config file from disk.
 * Returns an empty string when no config file exists yet.
 *
 * Only call this from desktop-guarded code (`if (DESKTOP) { ... }`).
 */
export async function readGhosttyConfig(): Promise<string> {
    const app = getWailsApp();
    if (!app) throw new Error("readGhosttyConfig: not running in desktop mode");
    // eslint-disable-next-line new-cap
    return app.ReadGhosttyConfig();
}

/**
 * Writes `content` to the user's Ghostty config file on disk,
 * creating parent directories as needed.
 *
 * Only call this from desktop-guarded code (`if (DESKTOP) { ... }`).
 */
export async function writeGhosttyConfig(content: string): Promise<void> {
    const app = getWailsApp();
    if (!app) throw new Error("writeGhosttyConfig: not running in desktop mode");
    // eslint-disable-next-line new-cap
    return app.WriteGhosttyConfig(content);
}

/**
 * Returns the platform-resolved path to the Ghostty config file
 * (e.g. `~/.config/ghostty/config`).
 *
 * Only call this from desktop-guarded code (`if (DESKTOP) { ... }`).
 */
export async function getGhosttyConfigPath(): Promise<string> {
    const app = getWailsApp();
    if (!app) throw new Error("getGhosttyConfigPath: not running in desktop mode");
    // eslint-disable-next-line new-cap
    return app.GetGhosttyConfigPath();
}

/**
 * Wails v2 runtime helpers injected as `window.runtime`.
 * @internal
 */
interface WailsRuntime {
    WindowMinimise: () => void;
    WindowToggleMaximise: () => void;
    Quit: () => void;
}

function getRuntime(): WailsRuntime | null {
    if (typeof window === "undefined") return null;
    return (window as unknown as {runtime?: WailsRuntime}).runtime ?? null;
}

/** Minimise the desktop window. */
export function windowMinimise(): void {
    // eslint-disable-next-line new-cap
    getRuntime()?.WindowMinimise();
}

/** Toggle the desktop window between normal and maximised. */
export function windowToggleMaximise(): void {
    // eslint-disable-next-line new-cap
    getRuntime()?.WindowToggleMaximise();
}

/** Close/quit the desktop application. */
export function windowQuit(): void {
    // eslint-disable-next-line new-cap
    getRuntime()?.Quit();
}
