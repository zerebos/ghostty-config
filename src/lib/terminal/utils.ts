import type {ExecResult, FSNode, Line, Segment} from "./types";

// Style helpers for command output segments
export const s = {
    plain: (text: string): Segment => ({text}),
    bold: (text: string): Segment => ({text, bold: true}),
    dim: (text: string): Segment => ({text, dim: true}),
    italic: (text: string): Segment => ({text, italic: true}),
    underline: (text: string, bold?: boolean): Segment => ({text, underline: true, bold}),
    inverse: (text: string): Segment => ({text, inverse: true}),
    href: (text: string, url: string): Segment => ({text, href: url}),
    p: (text: string, n: number, bold?: boolean): Segment => ({text, palette: n, bold}),
    hex: (text: string, hex: string, bold?: boolean): Segment => ({text, hex, bold}),
    error: (text: string): Segment => ({text, palette: 1}),
    success: (text: string): Segment => ({text, palette: 2}),
    warn: (text: string): Segment => ({text, palette: 3}),
    info: (text: string): Segment => ({text, palette: 4}),
    pink: (text: string): Segment => ({text, palette: 5}),
    cyan: (text: string): Segment => ({text, palette: 6}),
};

type SegmentFn = ((text: string) => Segment) & {
    bold: SegmentFn;
    dim: SegmentFn;
    italic: SegmentFn;
    underline: SegmentFn;
    inverse: SegmentFn;
    href: (url: string) => SegmentFn;
    fg: (n: number) => SegmentFn;
    hex: (h: string) => SegmentFn;
};

const STYLE_KEYS = [
    "bold",
    "dim",
    "italic",
    "underline",
    "inverse",
] as const;

type StyleKey = typeof STYLE_KEYS[number];

function buildSegStyle(base: Partial<Segment> = {}): SegmentFn {
    const fn = ((text: string) => ({...base, text})) as SegmentFn;

    return new Proxy(fn, {
        get(target, prop, receiver) {
            if (typeof prop === "string" && STYLE_KEYS.includes(prop as StyleKey)) {
                return buildSegStyle({...base, [prop]: true});
            }

            if (prop === "fg") {
                return (n: number) => buildSegStyle({...base, palette: n});
            }

            if (prop === "hex") {
                return (h: string) => buildSegStyle({...base, hex: h});
            }

            if (prop === "href") {
                return (url: string) => buildSegStyle({...base, href: url});
            }

            return Reflect.get(target, prop, receiver) as SegmentFn;
        },
    });
}

export const seg = buildSegStyle();



// Helpers for constructing ExecResults
export const ok = (lines: Line[]): ExecResult => ({lines});
export const clear = (): ExecResult => ({lines: [], clear: true});
export const err = (msg: string): ExecResult => ({lines: [[s.error(msg)]], failed: true});


// Constants and helpers for file segments in `ls` output
const IMAGE_EXTS = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".ico"]);
const ARCHIVE_EXTS = new Set([".gz", ".tar", ".zip", ".bz2", ".xz", ".7z", ".rar", ".tgz"]);
const DOCUMENT_EXTS = new Set([".pdf", ".doc", ".docx", ".odt"]);
const MARKDOWN_EXTS = new Set([".md", ".mdx", ".rst", ".txt"]);
const DATA_EXTS = new Set([".json", ".yaml", ".yml", ".toml", ".xml", ".csv"]);
const CODE_EXTS = new Set([".ts", ".js", ".svelte", ".py", ".rs", ".go", ".c", ".cpp", ".h", ".sh", ".bash"]);

function extOf(name: string): string {
    const dot = name.lastIndexOf(".");
    return dot >= 0 ? name.slice(dot) : "";
}

// Colorize file segments based on type, extension, etc.
export function fileSegment(name: string, node: FSNode): Segment {
    if (node.type === "dir") return s.p(name, 4);
    if (name.startsWith(".")) return s.p(name, 7); // hidden files in dim white
    const ext = extOf(name);
    if (node.executable) return s.p(name + "*", 2);
    if (ARCHIVE_EXTS.has(ext)) return s.p(name, 1);
    if (IMAGE_EXTS.has(ext)) return s.p(name, 5);
    if (DOCUMENT_EXTS.has(ext)) return s.p(name, 9);
    if (MARKDOWN_EXTS.has(ext)) return s.p(name, 6);
    if (DATA_EXTS.has(ext)) return s.p(name, 3);
    if (CODE_EXTS.has(ext)) return s.p(name, 12);
    return s.plain(name);
}