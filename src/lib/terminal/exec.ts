import type {ExecContext, ExecResult, Line} from "./types";
import {err, s} from "./utils";


export function execChain(input: string, ctx: ExecContext): ExecResult {
    // Split on && — run each segment, stop on first error/non-empty-exit
    const parts = input.split("&&").map(p => p.trim()).filter(Boolean);
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

    const argv = trimmed.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g) ?? [];
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