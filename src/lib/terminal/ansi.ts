import type {ExecResult, Line, Segment} from "./types";


export const RESET = "\x1b[0m";

export function sgr(...codes: Array<string | number | undefined>) {
    const filtered = codes.filter(Boolean);
    return filtered.length ? `\x1b[${filtered.join(";")}m` : "";
}

export function hexToRgb(hex: string): [number, number, number] {
    const clean = hex.replace("#", "");
    const num = parseInt(clean, 16);
    return [
        (num >> 16) & 0xff,
        (num >> 8) & 0xff,
        num & 0xff,
    ];
}

export function paletteToAnsi(p: number): number {
    return p < 8 ? 30 + p : 90 + (p - 8);
}

export function encodeSegment(seg: Segment): string {
    const codes: number[] = [];

    if (seg.bold) codes.push(1);
    if (seg.dim) codes.push(2);
    if (seg.italic) codes.push(3);
    if (seg.underline) codes.push(4);
    if (seg.inverse) codes.push(7);

    // Palette color
    if (typeof seg.palette === "number") {
        codes.push(paletteToAnsi(seg.palette));
    }

    // Hex color → 24-bit color
    if (seg.hex) {
        const [r, g, b] = hexToRgb(seg.hex);
        codes.push(38, 2, r, g, b);
    }

    const sgrPrefix = codes.length > 0 ? `\x1b[${codes.join(";")}m` : "";
    const sgrReset = codes.length > 0 ? RESET : "";

    // If no hyperlink, just return styled text
    if (!seg.href) return `${sgrPrefix}${seg.text}${sgrReset}`;

    // Clickable (OSC 8 hyperlinks)
    const osc8Open = `\x1b]8;;${seg.href}\x1b\\`;
    const osc8Close = `\x1b]8;;\x1b\\`;

    return `${osc8Open}${sgrPrefix}${seg.text}${sgrReset}${osc8Close}`;
}

export function renderLine(line: Line): string {
    return line.map(encodeSegment).join("");
}

export function renderResult(result: ExecResult): string {
    return result.lines.map(renderLine).join("\n");
}
