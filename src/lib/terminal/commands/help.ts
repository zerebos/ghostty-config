import type {Command, Line} from "../types";
import {err, ok, s} from "../utils";


export default function buildHelpCommand(commands: Record<string, Command>): Command {
    return {
        desc: "Show available commands or detailed help for a command",
        usage: "[command]",
        details: ["With no arguments, lists all commands.", "With a command name, shows detailed help for that command."],
        fn(args) {
            if (args[0]) {
                const cmd = commands[args[0]];
                if (!cmd) return err(`help: no such command: ${args[0]}`);
                const lines: Line[] = [
                    [s.bold(args[0]), cmd.usage ? s.plain(" " + cmd.usage) : s.plain(""), s.plain("  —  " + cmd.desc)],
                ];
                if (cmd.details) {
                    lines.push([s.plain("")]);
                    for (const line of cmd.details) lines.push([s.dim(line)]);
                }
                return ok(lines);
            }

            const longest = Math.max(...Object.keys(commands).map(k => k.length + (commands[k].usage?.length ?? 0) + 1));
            const lines: Line[] = [
                [s.bold("Available commands:"), s.dim("  (help <cmd> for details)")],
                [s.plain("")],
            ];
            for (const [name, cmd] of Object.entries(commands)) {
                const left = name + (cmd.usage ? " " + cmd.usage : "");
                const pad = " ".repeat(Math.max(2, longest - left.length + 2));
                lines.push([s.plain("  "), s.p(name, 2, true), cmd.usage ? s.dim(" " + cmd.usage) : s.plain(""), s.plain(pad + cmd.desc)]);
            }
            return ok(lines);
        },
    };
}