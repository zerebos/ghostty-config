import {getNode, resolveParts} from "../filesystem";
import type {Command, FSNode, Line, Segment} from "../types";
import {err, ok, s} from "../utils";


const command: Command = {
    desc: "Search for a pattern in file(s)",
    usage: "[-ri] <pattern> [file...]",
    details: [
        "-r  search recursively through directories",
        "-i  case-insensitive search",
        "-n  show line numbers",
        "Matches are highlighted in the output.",
    ],
    fn(args, ctx) {
        const flags = args.filter(a => a.startsWith("-")).join("");
        const rest = args.filter(a => !a.startsWith("-"));
        const [pattern, ...filePaths] = rest;
        if (!pattern) return err("grep: missing pattern");

        const ignoreCase = flags.includes("i");
        const showNums = flags.includes("n");
        const recursive = flags.includes("r");

        const regex = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), ignoreCase ? "gi" : "g");

        type Match = {file?: string; lineNum: number; line: string; ranges: Array<[number, number]>;};
        const matches: Match[] = [];

        function searchFile(content: string, displayName?: string) {
            content.split("\n").forEach((line, i) => {
                const ranges: Array<[number, number]> = [];
                for (const m of line.matchAll(regex)) {
                    if (m.index === undefined) continue;
                    ranges.push([m.index, m.index + m[0].length]);
                }
                if (ranges.length) matches.push({file: displayName, lineNum: i + 1, line, ranges});
            });
        }

        function searchNode(node: FSNode, path: string, displayPath: string) {
            if (node.type === "file") {
                searchFile(node.content, displayPath);
            }
            else if (recursive) {
                for (const [name, child] of Object.entries(node.children)) {
                    searchNode(child, `${path}/${name}`, `${displayPath}/${name}`);
                }
            }
        }

        if (filePaths.length === 0) {
            // search stdin placeholder
            return err("grep: (no file operand and stdin not supported in preview)");
        }

        const multiFile = filePaths.length > 1 || recursive;
        for (const fp of filePaths) {
            const parts = resolveParts(ctx.cwd(), fp);
            const node = getNode(ctx.root, parts);
            if (!node) return err(`grep: ${fp}: No such file or directory`);
            if (node.type === "dir" && !recursive) return err(`grep: ${fp}: Is a directory`);
            searchNode(node, fp, fp);
        }

        if (matches.length === 0) return ok([]);

        const lines: Line[] = [];
        for (const {file, lineNum, line, ranges} of matches) {
            const row: Segment[] = [];
            if (multiFile && file) row.push(s.p(file + ":", 5));
            if (showNums) row.push(s.p(String(lineNum) + ":", 3));
            // Interleave plain and highlighted segments
            let pos = 0;
            for (const [start, end] of ranges) {
                if (pos < start) row.push(s.plain(line.slice(pos, start)));
                row.push(s.hex(line.slice(start, end), "#ff0000", true)); // highlight match in palette red-ish
                pos = end;
            }
            if (pos < line.length) row.push(s.plain(line.slice(pos)));
            lines.push(row);
        }
        return ok(lines);
    },
};

export default command;