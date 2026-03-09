export const SHARE_HASH_KEY = "share";
export const MAX_SHARE_URL_LENGTH = 1800;

/**
 * Encode a config string to a URL-safe base64 string for sharing.
 */
export function encodeConfig(config: string): string {
    const bytes = new TextEncoder().encode(config);
    let binary = "";
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

/**
 * Decode a URL-safe base64 string back to a config string.
 */
export function decodeConfig(encoded: string): string {
    const normalized = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const padding = normalized.length % 4;
    const base64 = padding === 0 ? normalized : `${normalized}${"=".repeat(4 - padding)}`;
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new TextDecoder().decode(bytes);
}

export function buildShareUrl(origin: string, pathname: string, encodedConfig: string): string {
    const params = new URLSearchParams();
    params.set(SHARE_HASH_KEY, encodedConfig);
    return `${origin}${pathname}#${params.toString()}`;
}

export function getSharePayloadFromHash(hash: string): string | null {
    if (!hash) return null;
    const params = new URLSearchParams(hash.startsWith("#") ? hash.slice(1) : hash);
    return params.get(SHARE_HASH_KEY);
}

export function removeSharePayloadFromHash(hash: string): string {
    const params = new URLSearchParams(hash.startsWith("#") ? hash.slice(1) : hash);
    params.delete(SHARE_HASH_KEY);
    const remaining = params.toString();
    return remaining ? `#${remaining}` : "";
}
