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
    const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new TextDecoder().decode(bytes);
}
