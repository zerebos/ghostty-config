import {describe, expect, it} from "vitest";
import {
    buildShareUrl,
    decodeConfig,
    encodeConfig,
    getSharePayloadFromHash,
    removeSharePayloadFromHash,
    SHARE_HASH_KEY
} from "./share";

describe("share utils", () => {
    it("round-trips unicode config content", () => {
        const source = "# Ghostty\nfont-size = 14\ntitle = hello 🌍";
        const encoded = encodeConfig(source);

        expect(decodeConfig(encoded)).toBe(source);
    });

    it("decodes unpadded url-safe payloads", () => {
        const source = "abc";
        const encoded = encodeConfig(source);
        const unpadded = encoded.replace(/=/g, "");

        expect(decodeConfig(unpadded)).toBe(source);
    });

    it("throws on malformed encoded payload", () => {
        expect(() => decodeConfig("***")).toThrow();
    });

    it("builds and reads share payload from hash", () => {
        const payload = encodeConfig("foreground = #ffffff");
        const shareUrl = buildShareUrl("https://example.com", "/app/import-export", payload);
        const hash = shareUrl.split("#")[1];

        expect(hash).toContain(`${SHARE_HASH_KEY}=`);
        expect(getSharePayloadFromHash(`#${hash}`)).toBe(payload);
    });

    it("removes only share payload from hash", () => {
        const payload = encodeConfig("background = #000000");
        const hash = `#foo=bar&${SHARE_HASH_KEY}=${payload}&baz=qux`;

        expect(removeSharePayloadFromHash(hash)).toBe("#foo=bar&baz=qux");
    });
});
