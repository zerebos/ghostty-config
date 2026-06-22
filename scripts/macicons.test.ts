/**
 * Tests for scripts/generate-macicon-assets.ts
 *
 * Run with: bun test scripts/generate-macicon-assets.test.ts
 *
 * These tests exercise the two functions that have non-trivial logic:
 *
 *   resolveImagesetFile — picks the right PNG from a Contents.json,
 *     especially the multi-scale case (AppIconImage.imageset ships 1x/2x/3x).
 *
 *   renderModule — produces valid TS source with the right shape.
 *
 * buildGitDiffSummary is intentionally not tested here: it shells out to git
 * and its output is only ever read by a human in a PR body, so a live
 * end-to-end run (`bun run scripts/generate-macicon-assets.ts`) is the right
 * validation for that one.
 */

import {describe, it, expect, beforeEach, afterEach} from "bun:test";
import {mkdtempSync, mkdirSync, writeFileSync, rmSync} from "node:fs";
import {tmpdir} from "node:os";
import {join} from "node:path";

// The functions under test are exported from the script.
import {resolveImagesetFile, renderModule} from "./generate-macicons";

// ── helpers ────────────────────────────────────────────────────────────────

function makeImageset(
    dir: string,
    name: string,
    images: Array<{filename: string; scale?: string; sizeBytes?: number;}>
): string {
    const imagesetDir = join(dir, name);
    mkdirSync(imagesetDir, {recursive: true});

    for (const img of images) {
        // Write a minimal fake PNG so file-size fallback has real data to read.
        writeFileSync(join(imagesetDir, img.filename), Buffer.alloc(img.sizeBytes ?? 100));
    }

    const contentsImages = images.map(({filename, scale}) => ({
        filename,
        idiom: "universal",
        ...(scale ? {scale} : {}),
    }));

    writeFileSync(
        join(imagesetDir, "Contents.json"),
        JSON.stringify({images: contentsImages, info: {author: "xcode", version: 1}})
    );

    return imagesetDir;
}

// ── resolveImagesetFile ────────────────────────────────────────────────────

describe("resolveImagesetFile", () => {
    let tmpDir: string;

    beforeEach(() => {
        tmpDir = mkdtempSync(join(tmpdir(), "macicon-test-"));
    });

    afterEach(() => {
        rmSync(tmpDir, {recursive: true, force: true});
    });

    it("returns the only file when there is one entry", () => {
        const imagesetDir = makeImageset(tmpDir, "Single.imageset", [
            {filename: "icon.png", scale: "1x"},
        ]);
        expect(resolveImagesetFile(imagesetDir)).toEndWith("icon.png");
    });

    it("picks the highest scale when multiple entries are present", () => {
        const imagesetDir = makeImageset(tmpDir, "Multi.imageset", [
            {filename: "icon-256.png", scale: "1x"},
            {filename: "icon-512.png", scale: "2x"},
            {filename: "icon-1024.png", scale: "3x"},
        ]);
        expect(resolveImagesetFile(imagesetDir)).toEndWith("icon-1024.png");
    });

    it("picks highest scale regardless of order in Contents.json", () => {
        // Xcode might write them in any order — we must not rely on position.
        const imagesetDir = makeImageset(tmpDir, "Unordered.imageset", [
            {filename: "icon-1024.png", scale: "3x"},
            {filename: "icon-256.png", scale: "1x"},
            {filename: "icon-512.png", scale: "2x"},
        ]);
        expect(resolveImagesetFile(imagesetDir)).toEndWith("icon-1024.png");
    });

    it("falls back to largest file by size when scale is absent", () => {
        const imagesetDir = makeImageset(tmpDir, "NoScale.imageset", [
            {filename: "small.png", sizeBytes: 100},
            {filename: "large.png", sizeBytes: 9000},
            {filename: "medium.png", sizeBytes: 500},
        ]);
        expect(resolveImagesetFile(imagesetDir)).toEndWith("large.png");
    });

    it("falls back to largest file when only some entries have scale", () => {
        const imagesetDir = makeImageset(tmpDir, "MixedScale.imageset", [
            {filename: "a.png", scale: "1x", sizeBytes: 100},
            {filename: "b.png", sizeBytes: 9000}, // no scale — makes allScalesKnown false
        ]);
        expect(resolveImagesetFile(imagesetDir)).toEndWith("b.png");
    });

    it("throws when Contents.json is missing", () => {
        mkdirSync(join(tmpDir, "Empty.imageset"));
        expect(() => resolveImagesetFile(join(tmpDir, "Empty.imageset"))).toThrow("Missing Contents.json");
    });

    it("throws when no entry has a filename", () => {
        const imagesetDir = join(tmpDir, "NoFile.imageset");
        mkdirSync(imagesetDir);
        writeFileSync(
            join(imagesetDir, "Contents.json"),
            JSON.stringify({images: [{idiom: "universal", scale: "1x"}]})
        );
        expect(() => resolveImagesetFile(imagesetDir)).toThrow("No image filename found");
    });

    it("throws when Contents.json references a file that does not exist on disk", () => {
        const imagesetDir = join(tmpDir, "Ghost.imageset");
        mkdirSync(imagesetDir);
        writeFileSync(
            join(imagesetDir, "Contents.json"),
            JSON.stringify({images: [{filename: "missing.png", scale: "1x"}]})
        );
        // Note: no actual PNG written
        expect(() => resolveImagesetFile(imagesetDir)).toThrow("doesn't exist");
    });
});

// ── renderModule ───────────────────────────────────────────────────────────

describe("renderModule", () => {
    const entries = [
        {key: "official", imagesetPath: "AppIconImage.imageset", record: "iconUrls" as const},
        {key: "blueprint", imagesetPath: "Alternate Icons/BlueprintImage.imageset", record: "iconUrls" as const},
        {key: "aluminum", imagesetPath: "Custom Icon/CustomIconBaseAluminum.imageset", record: "frameUrls" as const},
        {key: "screen", imagesetPath: "Custom Icon/CustomIconScreen.imageset", record: "customLayerUrls" as const},
    ];

    const localFileByKey: Record<string, string> = {
        official: "official.png",
        blueprint: "blueprint.png",
        aluminum: "aluminum.png",
        screen: "screen.png",
    };

    const output = renderModule(entries, localFileByKey);

    it("includes the auto-generated header", () => {
        expect(output).toContain("auto-generated by scripts/generate-macicon-assets.ts");
    });

    it("exports iconBase pointing at /macos-icons", () => {
        expect(output).toContain('export const iconBase = "/macos-icons"');
    });

    it("exports all three record names", () => {
        expect(output).toContain("export const iconUrls");
        expect(output).toContain("export const frameUrls");
        expect(output).toContain("export const customLayerUrls");
    });

    it("uses iconBase template literal for paths", () => {
        expect(output).toContain("`${iconBase}/official.png`");
        expect(output).toContain("`${iconBase}/aluminum.png`");
    });

    it("places each key in the correct record", () => {
        // official and blueprint belong in iconUrls, not frameUrls
        const iconUrlsBlock = output.slice(
            output.indexOf("export const iconUrls"),
            output.indexOf("export const frameUrls")
        );
        expect(iconUrlsBlock).toContain('"official"');
        expect(iconUrlsBlock).toContain('"blueprint"');
        expect(iconUrlsBlock).not.toContain('"aluminum"');
    });

    it("produces output that does not contain the old cdnBase pattern", () => {
        expect(output).not.toContain("cdn.jsdelivr.net");
        expect(output).not.toContain("ghostty-org/ghostty@main");
    });
});