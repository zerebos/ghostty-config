import type {ExecResult, FSNode, Line, Segment} from "./types";

// Style helpers for command output segments
export const s = {
    plain: (text: string): Segment => ({text}),
    bold: (text: string): Segment => ({text, bold: true}),
    dim: (text: string): Segment => ({text, dim: true}),
    italic: (text: string): Segment => ({text, italic: true}),
    p: (text: string, n: number, bold?: boolean): Segment => ({text, palette: n, bold}),
    hex: (text: string, hex: string, bold?: boolean): Segment => ({text, hex, bold}),
    error: (text: string): Segment => ({text, palette: 1}),
    success: (text: string): Segment => ({text, palette: 2}),
    warn: (text: string): Segment => ({text, palette: 3}),
    info: (text: string): Segment => ({text, palette: 4}),
    pink: (text: string): Segment => ({text, palette: 5}),
    cyan: (text: string): Segment => ({text, palette: 6}),
};

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
    if (node.type === "dir") return s.p(name + "/", 4, true);
    if (name.startsWith(".")) return s.dim(name);
    const ext = extOf(name);
    if (node.executable) return s.p(name + "*", 2, true);
    if (ARCHIVE_EXTS.has(ext)) return s.p(name, 1, true);
    if (IMAGE_EXTS.has(ext)) return s.p(name, 5);
    if (DOCUMENT_EXTS.has(ext)) return s.p(name, 9);
    if (MARKDOWN_EXTS.has(ext)) return s.p(name, 6);
    if (DATA_EXTS.has(ext)) return s.p(name, 3);
    if (CODE_EXTS.has(ext)) return s.p(name, 12);
    return s.plain(name);
}