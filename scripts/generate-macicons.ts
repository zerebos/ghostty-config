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
 * Output: PNGs copied into OUTPUT_DIR and a regenerated macicons.ts
 * exporting local paths instead of CDN URLs. The PR diff summary is derived
 * from `git diff`/`git ls-files` against the repo's working tree, no
 * separate manifest file is needed.
 */

import {execSync} from "node:child_process";
import {mkdtempSync, readFileSync, copyFileSync, rmSync, writeFileSync, existsSync, mkdirSync, statSync} from "node:fs";
import {tmpdir} from "node:os";
import {join, basename} from "node:path";

const REPO_URL = "https://github.com/ghostty-org/ghostty.git";
const SPARSE_PATH = "macos/Assets.xcassets";
const REPO_ROOT = join(import.meta.dirname, "..");
const IMAGES_DIR = join("src", "lib", "images", "vendor");
const OUTPUT_DIR = join(REPO_ROOT, IMAGES_DIR);
const OUTPUT_MODULE_PATH = join(REPO_ROOT, "src", "lib", "data", "macicons.ts");
const SUMMARY_PATH = join(REPO_ROOT, "macicon-diff-summary.md");

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
    {key: "gloss", imagesetPath: "Custom Icon/CustomIconGloss.imageset", record: "customLayerUrls"},
    {key: "ghost", imagesetPath: "Custom Icon/CustomIconGhost.imageset", record: "customLayerUrls"},
    {key: "mask", imagesetPath: "Custom Icon/CustomIconScreenMask.imageset", record: "customLayerUrls"},
];

interface ContentsImage {
    filename?: string;
    scale?: string;
    [key: string]: unknown;
}

interface ContentsJson {
    images?: ContentsImage[];
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

    let best: ContentsImage;
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
            const sizeOf = (img: ContentsImage) => {
                const p = join(imagesetDir, img.filename!);
                return existsSync(p) ? statSync(p).size : -1;
            };
            return sizeOf(b) > sizeOf(a) ? b : a;
        });
    }

    const pngPath = join(imagesetDir, best.filename!);
    if (!existsSync(pngPath)) {
        throw new Error(`Contents.json references ${best.filename} but it doesn't exist in ${imagesetDir}`);
    }

    return pngPath;
}

/**
 * Renders the macicon.ts module using Vite-imported PNGs rather than plain
 * URL strings. Each asset becomes a named import from $lib/images/vendor/,
 * Vite processes it at build time (content-hashed filename, cache-busting on
 * change), and the three record exports use shorthand property syntax with
 * `as const satisfies` so keys are narrowly typed and usable for autocomplete.
 */
export function renderModule(entries: AssetEntry[], localFileByKey: Record<string, string>): string {
    const lines: string[] = [];
    lines.push("// This file is auto-generated by scripts/generate-macicons.ts");
    lines.push("// Do not edit directly: changes will be overwritten by the next sync.");
    lines.push("// See .github/workflows/macicons.yml for the generation schedule.");
    lines.push("");

    // One import per asset, using the key as the local identifier.
    for (const entry of entries) {
        lines.push(`import ${entry.key} from "$lib/images/vendor/${localFileByKey[entry.key]}";`);
    }

    const byRecord: Record<AssetEntry["record"], AssetEntry[]> = {
        iconUrls: [],
        frameUrls: [],
        customLayerUrls: [],
    };
    for (const entry of entries) byRecord[entry.record].push(entry);

    for (const recordName of ["iconUrls", "frameUrls", "customLayerUrls"] as const) {
        lines.push("", "");
        lines.push(`export const ${recordName} = {`);
        for (const entry of byRecord[recordName]) {
            lines.push(`    ${entry.key},`);
        }
        lines.push("} as const satisfies Record<string, string>;");
    }

    lines.push("");
    return lines.join("\n");
}

/**
 * Derives the PR diff summary from the git working tree rather than a
 * separate manifest file. After the PNGs are copied into OUTPUT_DIR,
 * `git diff --name-only` reports modified files and `git ls-files --others`
 * reports untracked (new) files. Deleted files are tracked via
 * `git ls-files --deleted`. All relative to OUTPUT_DIR.
 */
function buildGitDiffSummary(): string {
    const run = (cmd: string) => execSync(cmd, {cwd: REPO_ROOT, encoding: "utf-8"}).trim();

    // Files git knows about that now differ from the index (modified)
    const modified = run(`git diff --name-only -- ${IMAGES_DIR}`).split("\n").filter(Boolean).map(f => basename(f));

    // Files not yet in the index at all (newly added this run)
    const added = run(`git ls-files --others --exclude-standard -- ${IMAGES_DIR}`).split("\n").filter(Boolean).map(f => basename(f));

    // Files git tracked that are now missing from the working tree (deleted)
    const deleted = run(`git ls-files --deleted -- ${IMAGES_DIR}`).split("\n").filter(Boolean).map(f => basename(f));

    const total = ASSET_ENTRIES.length;

    const lines: string[] = [];
    lines.push("### macOS icon asset sync summary");
    lines.push("");
    lines.push(`- **${added.length}** added`);
    lines.push(`- **${deleted.length}** removed`);
    lines.push(`- **${modified.length}** changed`);
    lines.push(`- **${total}** total assets tracked`);

    if (added.length) {
        lines.push("", "<details><summary>Added</summary>", "");
        for (const f of added.sort()) lines.push(`- \`${f}\``);
        lines.push("</details>");
    }

    if (deleted.length) {
        lines.push("", "<details><summary>Removed</summary>", "");
        for (const f of deleted.sort()) lines.push(`- \`${f}\``);
        lines.push("</details>");
    }

    if (modified.length) {
        lines.push("", "<details><summary>Changed</summary>", "");
        for (const f of modified.sort()) lines.push(`- \`${f}\``);
        lines.push("</details>");
    }

    if (!added.length && !deleted.length && !modified.length) {
        lines.push("", "No asset changes detected — only ran due to manual trigger or upstream metadata churn.");
    }

    return lines.join("\n") + "\n";
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

        const localFileByKey: Record<string, string> = {};

        for (const entry of ASSET_ENTRIES) {
            const imagesetDir = join(assetsDir, entry.imagesetPath);
            if (!existsSync(imagesetDir)) {
                throw new Error(`Expected imageset at ${imagesetDir} for key "${entry.key}" but it doesn't exist. Did Ghostty rename/move it upstream?`);
            }

            const sourcePngPath = resolveImagesetFile(imagesetDir);

            // Stable, predictable local filename independent of whatever
            // Ghostty happens to name the file upstream.
            const localFile = `${entry.key}.png`;
            copyFileSync(sourcePngPath, join(OUTPUT_DIR, localFile));
            localFileByKey[entry.key] = localFile;
            console.log(`  ${entry.key} <- ${sourcePngPath.slice(assetsDir.length + 1)}`);
        }

        writeFileSync(SUMMARY_PATH, buildGitDiffSummary());
        writeFileSync(OUTPUT_MODULE_PATH, renderModule(ASSET_ENTRIES, localFileByKey));

        console.log(`\nWrote ${ASSET_ENTRIES.length} icon assets to ${OUTPUT_DIR}`);
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