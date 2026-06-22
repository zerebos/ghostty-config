#!/usr/bin/env bun
/**
 * Vendors the macOS app icon assets Ghostty Config uses for its custom icon
 * builder from the `macos/Assets.xcassets` directory of ghostty-org/ghostty,
 * so the app doesn't depend on jsDelivr/GitHub raw at runtime.
 *
 * Strategy mirrors generate-themes.ts: sparse-checkout just the asset
 * catalog directory (single network op) rather than hitting the GitHub
 * contents API once per folder and raw.githubusercontent.com once per file.
 *
 * Unlike themes, there's no "discover everything" step here, the set of
 * icons/frames/layers we care about is the fixed set already referenced in
 * $lib/data/macicons.ts (iconUrls, frameUrls, customLayerUrls). Each entry
 * maps to a known `.imageset` folder. Xcode asset catalogs wrap the actual
 * PNG inside that folder alongside a Contents.json describing it, and the
 * real filename isn't guaranteed to match any naming convention, so we read
 * Contents.json per imageset and pull the filename from its `images` array
 * rather than guessing (e.g. assuming a `-1024px.png` suffix).
 *
 * Most of these catalogs are single-scale (verified manually against
 * upstream), but AppIconImage.imageset is not, it ships 1x/2x/3x entries
 * (256px/512px/1024px) for the same logical icon. We always want the
 * highest-resolution variant, so resolveImagesetFile picks the entry with
 * the largest `scale` (parsed as an integer multiplier, e.g. "3x" -> 3),
 * falling back to the largest file on disk if scale is missing/unparsable.
 *
 * Output: PNGs copied into static/macicons/, plus a regenerated
 * macicons.ts exporting local paths instead of CDN URLs. Diffing is by
 * content hash per logical key (not parsed content, since these are
 * opaque binary assets) for the PR summary.
 */

import {execSync} from "node:child_process";
import {createHash} from "node:crypto";
import {mkdtempSync, readFileSync, copyFileSync, rmSync, writeFileSync, existsSync, mkdirSync} from "node:fs";
import {tmpdir} from "node:os";
import {join} from "node:path";

const REPO_URL = "https://github.com/ghostty-org/ghostty.git";
const SPARSE_PATH = "macos/Assets.xcassets";
const OUTPUT_DIR = join(import.meta.dirname, "..", "static", "macicons");
const OUTPUT_MODULE_PATH = join(import.meta.dirname, "..", "src", "lib", "data", "macicons.ts");
const MANIFEST_PATH = join(import.meta.dirname, "..", "src", "lib", "data", "macicon-manifest.json");
const SUMMARY_PATH = join(import.meta.dirname, "..", "macicon-diff-summary.md");

/**
 * Maps each logical key (used in the app's dropdown options) to the
 * `.imageset` folder it lives in within Assets.xcassets, and which
 * exported record it belongs to. This is the single place that needs
 * updating if Ghostty adds/renames an icon variant.
 */
interface AssetEntry {
    key: string;
    imagesetPath: string; // relative to Assets.xcassets
    record: "iconUrls" | "frameUrls" | "customLayerUrls";
}

const ASSET_ENTRIES: AssetEntry[] = [
    {key: "official", imagesetPath: "AppIconImage.imageset", record: "iconUrls"},
    {key: "blueprint", imagesetPath: "Alternate Icons/BlueprintImage.imageset", record: "iconUrls"},
    {key: "chalkboard", imagesetPath: "Alternate Icons/ChalkboardImage.imageset", record: "iconUrls"},
    {key: "microchip", imagesetPath: "Alternate Icons/MicrochipImage.imageset", record: "iconUrls"},
    {key: "glass", imagesetPath: "Alternate Icons/GlassImage.imageset", record: "iconUrls"},
    {key: "holographic", imagesetPath: "Alternate Icons/HolographicImage.imageset", record: "iconUrls"},
    {key: "paper", imagesetPath: "Alternate Icons/PaperImage.imageset", record: "iconUrls"},
    {key: "retro", imagesetPath: "Alternate Icons/RetroImage.imageset", record: "iconUrls"},
    {key: "xray", imagesetPath: "Alternate Icons/XrayImage.imageset", record: "iconUrls"},

    {key: "aluminum", imagesetPath: "Custom Icon/CustomIconBaseAluminum.imageset", record: "frameUrls"},
    {key: "beige", imagesetPath: "Custom Icon/CustomIconBaseBeige.imageset", record: "frameUrls"},
    {key: "plastic", imagesetPath: "Custom Icon/CustomIconBasePlastic.imageset", record: "frameUrls"},
    {key: "chrome", imagesetPath: "Custom Icon/CustomIconBaseChrome.imageset", record: "frameUrls"},

    {key: "screen", imagesetPath: "Custom Icon/CustomIconScreen.imageset", record: "customLayerUrls"},
    {key: "crt", imagesetPath: "Custom Icon/CustomIconCRT.imageset", record: "customLayerUrls"},
    {key: "gloss", imagesetPath: "Custom Icon/CustomIconGloss.imageset", record: "customLayerUrls"}
];

interface ContentsImage {
    filename?: string;
    scale?: string;
    [key: string]: unknown;
}

interface ContentsJson {
    images?: ContentsImage[];
}

/** Manifest persisted across runs purely to compute the diff summary. */
type Manifest = Record<string, {sourceFile: string; sha256: string; localFile: string;}>;

function sha256(buf: Buffer): string {
    return createHash("sha256").update(buf).digest("hex");
}

// TODO: de-dup with generate-themes
function sparseCheckout(targetDir: string): void {
    const run = (cmd: string) => execSync(cmd, {cwd: targetDir, stdio: "inherit"});

    mkdirSync(targetDir, {recursive: true});
    run(`git init -q`);
    run(`git remote add origin ${REPO_URL}`);
    run(`git config core.sparseCheckout true`);
    writeFileSync(join(targetDir, ".git", "info", "sparse-checkout"), `${SPARSE_PATH}/*\n`);
    run(`git fetch --depth 1 origin main`);
    run(`git checkout main`);
}

/**
 * Reads an imageset's Contents.json and resolves the path to the
 * highest-resolution PNG it describes.
 *
 * Most imagesets here are single-scale (one entry), but AppIconImage.imageset
 * ships 1x/2x/3x entries for the same icon, and we always want the largest.
 * Picks by parsed `scale` (e.g. "3x" -> 3) when present; if scale is
 * missing or unparsable on every candidate, falls back to comparing actual
 * file size on disk so we still deterministically get the best one.
 */
function resolveImagesetFile(imagesetDir: string): string {
    const contentsPath = join(imagesetDir, "Contents.json");
    if (!existsSync(contentsPath)) {
        throw new Error(`Missing Contents.json in ${imagesetDir}`);
    }

    const contents = JSON.parse(readFileSync(contentsPath, "utf-8")) as ContentsJson;
    const candidates = (contents.images ?? []).filter((img) => img.filename);
    if (!candidates.length) {
        throw new Error(`No image filename found in ${contentsPath}`);
    }

    const parseScale = (img: ContentsImage): number | null => {
        const raw = img.scale;
        if (typeof raw !== "string") return null;
        const match = /^(\d+(?:\.\d+)?)x$/.exec(raw.trim());
        return match ? parseFloat(match[1]) : null;
    };

    const allScalesKnown = candidates.every((img) => parseScale(img) !== null);

    let best: typeof candidates[number];
    if (candidates.length === 1) {
        best = candidates[0];
    }
    else if (allScalesKnown) {
        best = candidates.reduce((a, b) => (parseScale(b)! > parseScale(a)! ? b : a));
    }
    else {
        // Scale metadata missing/unparsable on at least one candidate,
        // fall back to whichever file is actually largest on disk.
        best = candidates.reduce((a, b) => {
            const sizeA = existsSync(join(imagesetDir, a.filename!)) ? readFileSync(join(imagesetDir, a.filename!)).length : -1;
            const sizeB = existsSync(join(imagesetDir, b.filename!)) ? readFileSync(join(imagesetDir, b.filename!)).length : -1;
            return sizeB > sizeA ? b : a;
        });
    }

    const pngPath = join(imagesetDir, best.filename!);
    if (!existsSync(pngPath)) {
        throw new Error(`Contents.json references ${best.filename} but it doesn't exist in ${imagesetDir}`);
    }

    return pngPath;
}

function readPreviousManifest(): Manifest {
    if (!existsSync(MANIFEST_PATH)) return {};
    try {
        return JSON.parse(readFileSync(MANIFEST_PATH, "utf-8")) as Manifest;
    }
    catch (err) {
        console.warn(`Could not read previous manifest (${(err as Error).message}); treating as empty`);
        return {};
    }
}

/**
 * Renders the macicon.ts module: same exported shape as with the external design
 * (iconUrls / frameUrls / customLayerUrls records), just pointing at local
 * static paths instead of building jsDelivr URLs.
 */
function renderModule(entries: AssetEntry[], localFileByKey: Record<string, string>): string {
    const lines: string[] = [];
    lines.push("// This file is auto-generated by scripts/generate-macicons.ts");
    lines.push("// Do not edit directly: changes will be overwritten by the next sync.");
    lines.push("// See .github/workflows/macicons.yml for the generation schedule.");
    lines.push("");
    lines.push("");
    lines.push(`export const iconBase = "/macicons";`);
    lines.push("");

    const byRecord: Record<AssetEntry["record"], AssetEntry[]> = {
        iconUrls: [],
        frameUrls: [],
        customLayerUrls: []
    };
    for (const entry of entries) byRecord[entry.record].push(entry);

    for (const recordName of ["iconUrls", "frameUrls", "customLayerUrls"] as const) {
        lines.push(`export const ${recordName} = {`);
        for (const entry of byRecord[recordName]) {
            // Using the key directly without JSON.stringify since we control the keys and
            // they all happen to be valid unquoted identifiers, and this looks nicer in the
            // generated code (and shuts eslint up). Even if an invalid key was added it
            // would be a build time error here, which is good since it wouldn't push to prod.
            lines.push(`    ${entry.key}: \`\${iconBase}/${localFileByKey[entry.key]}\`,`);
        }
        lines.push("} as const satisfies Record<string, string>;");
        lines.push("");
    }

    return lines.join("\n");
}

// TODO: de-dup with generate-themes
function writeSummary(previous: Manifest, next: Manifest): void {
    const prevKeys = new Set(Object.keys(previous));
    const nextKeys = new Set(Object.keys(next));

    const added = [...nextKeys].filter((k: string) => !prevKeys.has(k)).sort();
    const removed = [...prevKeys].filter((k: string) => !nextKeys.has(k)).sort();
    const changed = [...nextKeys]
        .filter((k: string) => prevKeys.has(k) && previous[k].sha256 !== next[k].sha256)
        .sort();

    const lines: string[] = [];
    lines.push(`### macOS icon asset sync summary`);
    lines.push("");
    lines.push(`- **${added.length}** added`);
    lines.push(`- **${removed.length}** removed`);
    lines.push(`- **${changed.length}** changed`);
    lines.push(`- **${nextKeys.size}** total assets tracked`);

    if (added.length) {
        lines.push("", "<details><summary>Added</summary>", "");
        for (const key of added) lines.push(`- \`${key}\` (${next[key as keyof Manifest].sourceFile})`);
        lines.push("</details>");
    }

    if (removed.length) {
        lines.push("", "<details><summary>Removed</summary>", "");
        for (const key of removed) lines.push(`- \`${key}\``);
        lines.push("</details>");
    }

    if (changed.length) {
        lines.push("", "<details><summary>Changed</summary>", "");
        for (const key of changed) lines.push(`- \`${key}\` (${next[key as keyof Manifest].sourceFile})`);
        lines.push("</details>");
    }

    if (!added.length && !removed.length && !changed.length) {
        lines.push("", "No asset changes detected — only ran due to manual trigger or upstream metadata churn.");
    }

    writeFileSync(SUMMARY_PATH, lines.join("\n") + "\n");
}

// eslint-disable-next-line @typescript-eslint/require-await
async function main(): Promise<void> {
    const workDir = mkdtempSync(join(tmpdir(), "ghostty-macicon-"));

    try {
        console.log(`Cloning sparse checkout of ${SPARSE_PATH}/ into ${workDir}`);
        sparseCheckout(workDir);

        const assetsDir = join(workDir, SPARSE_PATH);
        if (!existsSync(assetsDir)) {
            throw new Error(`Expected directory ${assetsDir} after sparse checkout but it does not exist`);
        }

        mkdirSync(OUTPUT_DIR, {recursive: true});

        const previousManifest = readPreviousManifest();
        const nextManifest: Manifest = {};
        const localFileByKey: Record<string, string> = {};

        for (const entry of ASSET_ENTRIES) {
            const imagesetDir = join(assetsDir, entry.imagesetPath);
            if (!existsSync(imagesetDir)) {
                throw new Error(`Expected imageset at ${imagesetDir} for key "${entry.key}" but it doesn't exist. Did Ghostty rename/move it upstream?`);
            }

            const sourcePngPath = resolveImagesetFile(imagesetDir);
            const sourceBuf = readFileSync(sourcePngPath);
            const hash = sha256(sourceBuf);

            // Stable, predictable local filename independent of whatever
            // Ghostty happens to name the file upstream this week.
            const localFile = `${entry.key}.png`;
            copyFileSync(sourcePngPath, join(OUTPUT_DIR, localFile));

            localFileByKey[entry.key] = localFile;
            nextManifest[entry.key] = {
                sourceFile: sourcePngPath.slice(assetsDir.length + 1),
                sha256: hash,
                localFile
            };
        }

        writeSummary(previousManifest, nextManifest);

        mkdirSync(join(import.meta.dirname, "..", "src", "lib", "data"), {recursive: true});
        writeFileSync(MANIFEST_PATH, JSON.stringify(nextManifest, null, 4) + "\n");
        writeFileSync(OUTPUT_MODULE_PATH, renderModule(ASSET_ENTRIES, localFileByKey));

        console.log(`Wrote ${ASSET_ENTRIES.length} icon assets to ${OUTPUT_DIR}`);
        console.log(`Updated ${OUTPUT_MODULE_PATH}`);
    }
    finally {
        rmSync(workDir, {recursive: true, force: true});
    }
}

main().catch((err: unknown) => {
    console.error(err);
    process.exit(1);
});