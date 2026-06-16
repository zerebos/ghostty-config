import type {ExecContext, ExecResult, Line} from "./types";
import {err, s} from "./utils";


const chainRegex = /"[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*'|&&/g;
export function execChain(input: string, ctx: ExecContext): ExecResult {
    chainRegex.lastIndex = 0; // reset regex state in case of reuse

    // This regex matches either:
    // - double-quoted strings (allowing for escaped quotes)
    // - single-quoted strings (allowing for escaped quotes)
    // - the chain operator "&&"
    // We use it to split the input into parts while respecting quoted substrings.
    let match: RegExpExecArray | null;
    let lastIndex = 0;
    const parts: string[] = [];
    while ((match = chainRegex.exec(input)) !== null) {
        if (match[0] !== "&&") continue;
        parts.push(input.slice(lastIndex, match.index).trim());
        lastIndex = chainRegex.lastIndex;
    }
    parts.push(input.slice(lastIndex).trim());

    // Now we have the input split into parts by "&&", but quoted substrings are preserved.
    const allLines: Line[] = [];
    for (const part of parts) {
        const result = execSingle(part, ctx);
        if (result.clear) return result; // clear short-circuits everything
        allLines.push(...result.lines);
        if (result.failed) break;
    }

    return {lines: allLines};
}

export function execSingle(input: string, ctx: ExecContext): ExecResult {
    const trimmed = input.trim();
    if (!trimmed) return {lines: []};

    const rawArgv = trimmed.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g) ?? [];
    const argv = rawArgv.map(a => a.replace(/^["']|["']$/g, "")); // Remove surrounding quotes if present
    const [cmd, ...args] = argv;
    if (!cmd) return {lines: []};

    const def = ctx.commands[cmd];
    if (!def) {
        return {
            lines: [[
                s.error(`${cmd}: command not found`),
                s.plain(". Type "),
                s.bold("help"),
                s.plain(" to list available commands."),
            ]]
        };
    }

    try {
        return def.fn(args, ctx);
    }
    catch {
        return err(`${cmd}: unexpected error`);
    }
}