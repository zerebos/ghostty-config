/**
 * Wails desktop runtime integration helpers.
 *
 * These rely on the Go method bindings that Wails injects into `window.go`
 * at runtime when the app is running inside the Wails desktop shell.
 *
 * All exported functions are safe to call from any context:
 * – On the web they no-op or throw, guarded by `isDesktop()`.
 * – On desktop the real Go backend methods are invoked.
 */

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
 * Returns `true` when the page is running inside the Wails desktop shell.
 * Safe to call during SSR – always returns `false` server-side.
 */
export function isDesktop(): boolean {
    return getWailsApp() !== null;
}

/**
 * Reads the user's Ghostty config file from disk.
 * Returns an empty string when no config file exists yet.
 *
 * @throws {Error} when called outside the desktop shell.
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
 * @throws {Error} when called outside the desktop shell.
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
 * @throws {Error} when called outside the desktop shell.
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

/** Minimise the desktop window. No-op on web. */
export function windowMinimise(): void {
    // eslint-disable-next-line new-cap
    getRuntime()?.WindowMinimise();
}

/** Toggle the desktop window between normal and maximised. No-op on web. */
export function windowToggleMaximise(): void {
    // eslint-disable-next-line new-cap
    getRuntime()?.WindowToggleMaximise();
}

/** Close/quit the desktop application. No-op on web. */
export function windowQuit(): void {
    // eslint-disable-next-line new-cap
    getRuntime()?.Quit();
}
