#!/usr/bin/env bun
/**
 * Ghostty Schema Generator
 *
 * Downloads Ghostty's Config.zig from the ghostty-org/ghostty GitHub repository,
 * parses the field definitions and documentation, and generates the
 * `src/lib/data/ghostty-schema.ts` file.
 *
 * Usage:
 *   bun run scripts/generate-ghostty-schema.ts [--ref <git-ref>]
 *
 * Options:
 *   --ref <ref>   Git ref to fetch from (branch, tag, or commit SHA).
 *                 Defaults to "main".
 *   --out <path>  Output file path. Defaults to "src/lib/data/ghostty-schema.ts".
 *   --dry-run     Print the generated schema to stdout instead of writing to file.
 */

import {writeFileSync} from "fs";
import {join} from "path";

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
const getArg = (flag: string): string | undefined => {
    const i = args.indexOf(flag);
    return i !== -1 ? args[i + 1] : undefined;
};

const REF = getArg("--ref") ?? "main";
const OUT = getArg("--out") ?? join(import.meta.dir, "../src/lib/data/ghostty-schema.ts");
const DRY_RUN = args.includes("--dry-run");

// ---------------------------------------------------------------------------
// Download Config.zig
// ---------------------------------------------------------------------------

const CONFIG_URL = `https://raw.githubusercontent.com/ghostty-org/ghostty/${REF}/src/config/Config.zig`;

console.log(`Fetching ${CONFIG_URL} ...`);
const resp = await fetch(CONFIG_URL);
if (!resp.ok) {
    throw new Error(`Failed to fetch Config.zig: ${resp.status} ${resp.statusText}`);
}
const source = await resp.text();
console.log(`Fetched ${source.length} bytes.`);

// ---------------------------------------------------------------------------
// Type mapping: Zig type → GhosttySettingType
// ---------------------------------------------------------------------------

/**
 * Maps a Zig type name (as it appears in Config.zig) to a GhosttySettingType string.
 * Returns undefined when the type should be resolved via enum lookup.
 */
function mapZigType(zigType: string): string {
    const t = zigType.trim().replace(/^\?/, ""); // strip optional marker

    if (t === "bool") return "bool";
    if (t.match(/^u\d+$|^usize$/)) return "uint";
    if (t.match(/^i\d+$/)) return "int";
    if (t.match(/^f\d+$/)) return "float";

    // String types
    if (t.match(/^\[\]const u8$|^\[:0\]const u8$|^\[\]u8$/)) return "string";

    // Repeatable / collection types
    if (t === "RepeatableString" || t === "RepeatableStringMap") return "string";
    if (t === "RepeatablePath") return "path";
    if (t === "RepeatableFontVariation") return "font-variation";
    if (t === "RepeatableCodepointMap") return "codepoint-map";
    if (t === "RepeatableClipboardCodepointMap") return "clipboard-codepoint-map";
    if (t === "RepeatableLink") return "link";
    if (t === "RepeatableCommand") return "command-palette-entry";
    if (t === "KeyRemapSet") return "key-remap";
    if (t === "Keybinds") return "keybinds";
    if (t === "RepeatableReadableIO") return "readable-io";

    // Named types with known mappings
    if (t === "Color") return "color";
    if (t === "TerminalColor") return "terminal-color";
    if (t === "ColorList") return "color-list";
    if (t === "BoldColor") return "bold-color";
    if (t === "Palette") return "palette";
    if (t === "Theme" || t === "?Theme") return "theme";
    if (t === "Path" || t === "?Path") return "path";
    if (t === "Duration" || t === "?Duration") return "duration";
    if (t === "Command" || t === "?Command") return "command";
    if (t === "FontStyle") return "font-style";
    if (t === "FontSyntheticStyle") return "font-synthetic-style";
    if (t === "FontShapingBreak") return "font-shaping-break";
    if (t === "FreetypeLoadFlags") return "freetype-load-flags";
    if (t === "AlphaBlending") return "alpha-blending";
    if (t === "MetricModifier" || t === "?MetricModifier") return "metric-modifier";
    if (t === "BackgroundBlur") return "background-blur";
    if (t === "WindowPadding") return "window-padding";
    if (t === "ScrollToBottom") return "scroll-to-bottom";
    if (t === "MouseScrollMultiplier") return "mouse-scroll-multiplier";
    if (t === "SelectionWordChars") return "selection-word-chars";
    if (t === "SplitPreserveZoom") return "split-preserve-zoom";
    if (t === "ShellIntegrationFeatures") return "shell-integration-features";
    if (t === "QuickTerminalSize") return "quick-terminal-size";
    if (t === "BellFeatures") return "bell-features";
    if (t === "AppNotifications") return "app-notifications";
    if (t === "NotifyOnCommandFinishAction") return "notify-on-command-finish-action";
    if (t === "RepeatableStringMap") return "repeatable-string-map";
    if (t === "terminal.CursorStyle") return "enum";

    // For anything else, assume it's an enum defined in the same file
    return "enum";
}

// ---------------------------------------------------------------------------
// Parse enum definitions from Config.zig
// ---------------------------------------------------------------------------

/**
 * Extracts all `pub const EnumName = enum { ... }` definitions from the source.
 * Returns a map of EnumName → string[].
 */
function parseEnums(src: string): Map<string, string[]> {
    const enums = new Map<string, string[]>();

    // Find each enum definition start
    const startPattern = /^pub const (\w+) = enum(?:\([^)]*\))?\s*\{/gm;

    for (const startMatch of src.matchAll(startPattern)) {
        const name = startMatch[1];
        const bodyStart = startMatch.index + startMatch[0].length;

        // Manually scan to find the matching closing brace, tracking depth
        let depth = 1;
        let i = bodyStart;
        while (i < src.length && depth > 0) {
            if (src[i] === "{") depth++;
            else if (src[i] === "}") depth--;
            i++;
        }
        const body = src.slice(bodyStart, i - 1);

        // Extract only the lines BEFORE any `pub const` or `pub fn` declarations
        // (those are methods/nested types, not enum values)
        const valuesSection = body.split(/\n\s*pub\s+(?:const|fn)\s/)[0];

        // Extract enum values: lines that look like `    valueName,` or `    @"value-name",`
        const values: string[] = [];
        const valuePattern = /^\s+(?:@"([^"]+)"|([a-zA-Z_][a-zA-Z0-9_]*))\s*(?:=\s*[^,]+\s*)?(?:,|$)/gm;

        for (const vMatch of valuesSection.matchAll(valuePattern)) {
            const val = vMatch[1] ?? vMatch[2];
            // Skip known non-value keywords and empty captures
            if (val && val !== "pub" && val !== "const" && val !== "fn" && val !== "test") {
                values.push(val);
            }
        }

        if (values.length > 0) {
            enums.set(name, values);
        }
    }

    return enums;
}

// ---------------------------------------------------------------------------
// Parse field definitions from the Config struct body
// ---------------------------------------------------------------------------

interface RawField {
    /** Config file key name, e.g. "font-family" */
    key: string;
    /** Raw Zig type string */
    zigType: string;
    /** Raw default value string from Zig */
    defaultRaw: string;
    /** Whether the type is optional (?) */
    optional: boolean;
    /** Doc comment lines collected above this field */
    docLines: string[];
}

/**
 * Extracts the Config struct body: everything between the first field and the
 * start of private fields / functions.
 *
 * Config.zig uses `const Config = @This()` so the whole file IS the struct.
 * We collect fields from the first public doc'd field down to the private
 * fields (those starting with `_`).
 */
function extractConfigBody(src: string): string {
    // Find start of actual config fields (just before "language: ?[:0]const u8")
    // The first doc comment for a field starts at around line 97.
    // We look for the first `/// ` comment followed by a field definition.
    const start = src.indexOf("\nlanguage: ?");
    if (start === -1) {
        // Try fallback – find the first field line
        const firstField = src.match(/\n(?:@"[^"]+"|[a-z]\w*): /);
        if (!firstField) throw new Error("Could not find start of Config fields");
        return src.slice(firstField.index);
    }

    // Find where private fields start
    const privateStart = src.indexOf("\n_arena:");
    const end = privateStart !== -1 ? privateStart : src.indexOf("\npub fn deinit");

    return end !== -1 ? src.slice(start, end) : src.slice(start);
}

/**
 * Parses field definitions from the Config struct body.
 */
function parseFields(src: string): RawField[] {
    const fields: RawField[] = [];

    const lines = src.split("\n");
    let docLines: string[] = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Collect doc comment lines
        const docMatch = line.match(/^\/\/\/ ?(.*)/);
        if (docMatch) {
            docLines.push(docMatch[1]);
            continue;
        }

        // Skip non-doc comments and blank lines (but preserve docLines across blanks if
        // we're mid-comment)
        if (line.match(/^\/\//) || line.trim() === "") {
            // Blank line resets doc accumulation only if we haven't seen a field yet
            // Actually: in Config.zig blank lines between /// blocks and the field are fine
            // We reset docLines only on a blank line AFTER we've seen non-doc content
            if (line.trim() === "" && docLines.length === 0) continue;
            if (line.trim() === "") {
                // Keep accumulating - blank lines can appear between /// blocks
                continue;
            }
            // Non-doc comment: reset
            docLines = [];
            continue;
        }

        // Match field definitions:
        // @"field-name": SomeType = default,
        // fieldName: SomeType = default,
        // @"field-name": ?SomeType = null,
        // @"field-name": ?[:0]const u8 = null,
        // @"field-name": []const u8 = "",
        const fieldMatch = line.match(/^(?:@"([^"]+)"|([a-z_]\w*)): (\??(?:\[:[^\]]*\]const u8|\[\](?:const )?u8|[^\s=,]+))/);
        if (fieldMatch) {
            const key = fieldMatch[1] ?? fieldMatch[2];
            const typeStr = fieldMatch[3];
            const optional = typeStr.startsWith("?");
            // For slice types like `[:0]const u8` keep them as-is; for named types use last segment
            const rawType = typeStr.replace(/^\?/, "");

            // Collect the raw default by scanning forward to find `= ...` on same or next lines
            let defaultRaw = "";
            let j = i;

            // Walk forward to collect the full default value (may span multiple lines)
            while (j < lines.length) {
                const eqMatch = lines[j].match(/=\s*(.+)/);
                if (eqMatch) {
                    defaultRaw = eqMatch[1].trim().replace(/,$/, "").trim();
                    break;
                }
                j++;
                if (j - i > 6) break; // safety limit
            }

            // Only include fields with doc comments (skip internal/undocumented fields)
            if (docLines.length > 0 || key.match(/^[a-z]/)) {
                fields.push({
                    key,
                    zigType: rawType,
                    defaultRaw,
                    optional,
                    docLines: [...docLines],
                });
            }

            docLines = [];
            continue;
        }

        // Anything else resets doc accumulation
        docLines = [];
    }

    return fields;
}

// ---------------------------------------------------------------------------
// Convert raw field data to schema entry
// ---------------------------------------------------------------------------

interface SchemaEntry {
    key: string;
    type: string;
    default: unknown;
    description: string;
    repeatable?: boolean;
    enum?: string[];
    min?: number;
    max?: number;
    platform?: string[];
    since?: string;
    deprecated?: boolean | string;
}

const REPEATABLE_TYPES = new Set([
    "RepeatableString",
    "RepeatablePath",
    "RepeatableFontVariation",
    "RepeatableCodepointMap",
    "RepeatableClipboardCodepointMap",
    "RepeatableLink",
    "RepeatableCommand",
    "Keybinds",
    "RepeatableReadableIO",
]);

/** Extracts platform hints from doc comments */
function extractPlatform(doc: string): string[] | undefined {
    const platforms: string[] = [];

    if (doc.match(/GTK Wayland only/i)) platforms.push("gtk-wayland");
    else if (doc.match(/GTK(?:\s+X11)? only|GTK only/i)) platforms.push("gtk");
    if (doc.match(/macOS only|Only.*macOS|implemented on macOS/i)) {
        if (!platforms.includes("macos")) platforms.push("macos");
    }
    if (doc.match(/Linux only|only.*Linux|implemented on Linux/i)) {
        if (!platforms.includes("linux")) platforms.push("linux");
    }

    return platforms.length > 0 ? platforms : undefined;
}

/** Extracts "since" version from doc comments */
function extractSince(doc: string): string | undefined {
    const m = doc.match(/[Aa]vailable since:?\s*([\d.]+?)\.?\s*(?:\n|$)/);
    return m ? m[1] : undefined;
}

/** Converts a raw Zig default value to a JS-friendly representation */
function parseDefault(raw: string, zigType: string, optional: boolean): unknown {
    if (!raw || raw === ".{}" || raw === ".empty" || (optional && raw === "null")) return undefined;

    // null means unset
    if (raw === "null") return undefined;

    // Struct-literal defaults
    if (raw.startsWith(".{") || raw.startsWith("{")) {
        // Duration struct like `.{ .duration = 5 * std.time.ns_per_s }`
        const durationStructMatch = raw.match(/\.duration = (\d+)\s*\*\s*std\.time\.(ns_per_s|ns_per_ms)/);
        if (durationStructMatch) {
            const n = parseInt(durationStructMatch[1], 10);
            return durationStructMatch[2] === "ns_per_s" ? `${n}s` : `${n}ms`;
        }

        // Color struct like `.{ .r = 0x28, .g = 0x2C, .b = 0x34 }`
        const colorMatch = raw.match(/\.r = (0x[0-9a-fA-F]+|\d+),\s*\.g = (0x[0-9a-fA-F]+|\d+),\s*\.b = (0x[0-9a-fA-F]+|\d+)/);
        if (colorMatch) {
            const r = parseInt(colorMatch[1], 16).toString(16).padStart(2, "0");
            const g = parseInt(colorMatch[2], 16).toString(16).padStart(2, "0");
            const b = parseInt(colorMatch[3], 16).toString(16).padStart(2, "0");
            return `#${r}${g}${b}`;
        }

        // Any other struct default (e.g. FontStyle `.{ .default = {} }`) → undefined (unset)
        return undefined;
    }

    // boolean
    if (raw === "true") return true;
    if (raw === "false") return false;

    // numbers
    if (raw.match(/^[\d_]+$/)) return parseInt(raw.replace(/_/g, ""), 10);
    if (raw.match(/^0x[\da-fA-F_]+$/)) return parseInt(raw.replace(/_/g, ""), 16);
    if (raw.match(/^[\d.]+$/)) return parseFloat(raw);

    // compound numeric expressions like `320 * 1000 * 1000`
    const multMatch = raw.match(/^([\d_]+)\s*\*\s*([\d_]+)(?:\s*\*\s*([\d_]+))?$/);
    if (multMatch) {
        const a = parseInt(multMatch[1].replace(/_/g, ""), 10);
        const b = parseInt(multMatch[2].replace(/_/g, ""), 10);
        const c = multMatch[3] ? parseInt(multMatch[3].replace(/_/g, ""), 10) : 1;
        return a * b * c;
    }

    // Duration with ns_per_s/ns_per_ms (standalone)
    const durationMatch = raw.match(/^([\d_]+)\s*\*\s*std\.time\.(ns_per_s|ns_per_ms)$/);
    if (durationMatch) {
        const n = parseInt(durationMatch[1].replace(/_/g, ""), 10);
        return durationMatch[2] === "ns_per_s" ? `${n}s` : `${n}ms`;
    }

    // Enum value like `.srgb` or `.@"16-bit"` or `.true` or `.false`
    const enumMatch = raw.match(/^\.@?"?([^"]+)"?$/);
    if (enumMatch) {
        const val = enumMatch[1];
        if (val === "true") return true;
        if (val === "false") return false;
        return val;
    }

    // Platform-conditional defaults like `switch (builtin.os.tag) { ... }`
    if (raw.match(/switch\s*\(builtin\.os\.tag\)/)) return undefined;

    // if expression like `if (builtin.os.tag == .linux) ...`
    if (raw.match(/^if\s*\(builtin\.os\.tag/)) return undefined;

    // String literal
    const strMatch = raw.match(/^"([^"]*)"$/);
    if (strMatch) return strMatch[1];

    // Return undefined if we couldn't parse it
    return undefined;
}

/** Processes doc comment lines into a clean description string */
function buildDescription(docLines: string[]): string {
    return docLines
        .join("\n")
        .replace(/\n{3,}/g, "\n\n") // collapse extra blank lines
        .trim();
}

// ---------------------------------------------------------------------------
// Main parsing + schema generation
// ---------------------------------------------------------------------------

console.log("Parsing enums...");
const enumMap = parseEnums(source);
console.log(`Found ${enumMap.size} enum definitions.`);

console.log("Extracting Config struct body...");
const configBody = extractConfigBody(source);

console.log("Parsing fields...");
const rawFields = parseFields(configBody);
console.log(`Found ${rawFields.length} raw fields.`);

// Filter out private/internal fields
const publicFields = rawFields.filter(f =>
    !f.key.startsWith("_") && !["_arena", "_diagnostics", "_conditional_state", "_conditional_set", "_replay_steps"].includes(f.key)
);

console.log(`Processing ${publicFields.length} public fields...`);

const schemaEntries: SchemaEntry[] = publicFields.map(field => {
    const doc = buildDescription(field.docLines);
    const type = mapZigType(field.zigType);
    const defaultVal = parseDefault(field.defaultRaw, field.zigType, field.optional);
    const platform = extractPlatform(doc);
    const since = extractSince(doc);
    const repeatable = REPEATABLE_TYPES.has(field.zigType) || undefined;

    // Look up enum values
    let enumValues: string[] | undefined;
    if (type === "enum") {
        // Try to find the enum by type name
        const typeName = field.zigType.split(".").pop()!.replace(/^\?/, "");
        enumValues = enumMap.get(typeName);

        // For terminal.CursorStyle, look it up specially
        if (!enumValues && field.zigType.includes("CursorStyle")) {
            enumValues = enumMap.get("CursorStyle");
        }
    }

    const entry: SchemaEntry = {
        "key": field.key,
        type,
        "default": defaultVal,
        "description": doc,
    };

    if (repeatable) entry.repeatable = true;
    if (enumValues) entry.enum = enumValues;
    if (platform) entry.platform = platform;
    if (since) entry.since = since;

    return entry;
});

// ---------------------------------------------------------------------------
// Generate TypeScript output
// ---------------------------------------------------------------------------

function toTsValue(val: unknown): string {
    if (val === undefined) return "undefined";
    if (typeof val === "boolean") return String(val);
    if (typeof val === "number") return String(val);
    if (typeof val === "string") return JSON.stringify(val);
    if (Array.isArray(val)) return `[${val.map(toTsValue).join(", ")}]`;
    return JSON.stringify(val);
}

function generateTypesList(entries: SchemaEntry[]): string {
    const types = new Set(entries.map(e => e.type));
    const sorted = [...types].sort();
    return sorted.map(t => `    | ${JSON.stringify(t)}`).join("\n");
}

function generateEntry(entry: SchemaEntry): string {
    const lines: string[] = ["    {"];

    lines.push(`        key: ${JSON.stringify(entry.key)},`);
    lines.push(`        type: ${JSON.stringify(entry.type)},`);
    lines.push(`        default: ${toTsValue(entry.default)},`);

    // Description: multi-line template literal for readability
    const escapedDesc = entry.description
        .replace(/\\/g, "\\\\")
        .replace(/`/g, "\\`")
        .replace(/\$\{/g, "\\${");
    lines.push(`        description: \`${escapedDesc}\`,`);

    if (entry.repeatable) lines.push(`        repeatable: true,`);
    if (entry.enum) lines.push(`        enum: [${entry.enum.map(v => JSON.stringify(v)).join(", ")}],`);
    if (entry.min !== undefined) lines.push(`        min: ${entry.min},`);
    if (entry.max !== undefined) lines.push(`        max: ${entry.max},`);
    if (entry.platform) lines.push(`        platform: [${entry.platform.map(p => JSON.stringify(p)).join(", ")}],`);
    if (entry.since) lines.push(`        since: ${JSON.stringify(entry.since)},`);
    if (entry.deprecated) lines.push(`        deprecated: ${typeof entry.deprecated === "string" ? JSON.stringify(entry.deprecated) : entry.deprecated},`);

    lines.push("    }");
    return lines.join("\n");
}

function generateOutput(entries: SchemaEntry[], ref: string): string {
    const typesList = generateTypesList(entries);
    const entriesStr = entries.map(generateEntry).join(",\n");

    return `/**
 * Ghostty Configuration Reference Schema
 *
 * AUTO-GENERATED — do not edit manually.
 * Generated from: https://github.com/ghostty-org/ghostty/blob/${ref}/src/config/Config.zig
 *
 * To regenerate, run:
 *   bun run scripts/generate-ghostty-schema.ts
 *
 * Each entry includes:
 *   - key: The exact config key name as used in ~/.config/ghostty/config
 *   - type: The value type
 *   - default: The default value (undefined means unset/null)
 *   - description: Full documentation from Ghostty's source
 *   - repeatable: Whether the setting can appear multiple times
 *   - platform: Platform restrictions (undefined = all platforms)
 *   - since: Version in which the setting was introduced
 *   - deprecated: Deprecation info if applicable
 *   - enum: Valid string values for enum types
 *   - min/max: Bounds for numeric types
 */

export type GhosttyPlatform = "macos" | "linux" | "gtk" | "gtk-wayland" | "gtk-x11";

export type GhosttySettingType =
${typesList};

export interface GhosttySettingDef {
    /** The config file key, e.g. \`font-family\` */
    key: string;
    /** The value type */
    type: GhosttySettingType;
    /** The default value. \`undefined\` means the setting is unset (null) by default. */
    default?: unknown;
    /** Full description from Ghostty's source documentation */
    description: string;
    /** Whether this setting can appear multiple times in config files */
    repeatable?: boolean;
    /** Valid enum values (only for type "enum") */
    enum?: string[];
    /** Minimum numeric value */
    min?: number;
    /** Maximum numeric value */
    max?: number;
    /** Platform(s) this setting applies to. Undefined = all platforms. */
    platform?: GhosttyPlatform[];
    /** Version in which this setting was introduced */
    since?: string;
    /** Deprecation: true if deprecated, or a string with the replacement */
    deprecated?: boolean | string;
}

const ghosttySchema: GhosttySettingDef[] = [
${entriesStr},
];

export default ghosttySchema;
`;
}

// ---------------------------------------------------------------------------
// Write output
// ---------------------------------------------------------------------------

const output = generateOutput(schemaEntries, REF);

if (DRY_RUN) {
    console.log(output);
}
else {
    writeFileSync(OUT, output, "utf8");
    console.log(`\nWritten ${schemaEntries.length} settings to ${OUT}`);
    console.log("Done!");
}
