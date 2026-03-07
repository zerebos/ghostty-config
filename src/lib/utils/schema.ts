import ghosttySchema from "$lib/data/ghostty-schema";

/**
 * Converts a camelCase setting ID to the kebab-case key used in ghostty-schema.
 *
 * Examples:
 *   gtkOpenglDebug        -> gtk-opengl-debug
 *   focusFollowsMouse     -> focus-follows-mouse
 *   clipboardRead         -> clipboard-read
 *   macosNonNativeFullscreen -> macos-non-native-fullscreen
 *   x11InstanceName       -> x11-instance-name
 */
export function camelToKebab(id: string): string {
    return id
        .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
        .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
        .toLowerCase();
}

/**
 * Looks up the description for a setting by its camelCase ID.
 * Returns undefined if the setting is not found in the schema.
 */
export function getSettingDescription(id: string): string | undefined {
    const key = camelToKebab(id);
    const def = ghosttySchema.find((s) => s.key === key);
    return def?.description;
}
