import {getNode, resolveParts} from "../filesystem";
import type {Command, Line, Segment} from "../types";
import {err, fileSegment, ok, s} from "../utils";


const command: Command = {
    desc: "List directory contents",
    usage: "[-la] [path]",
    details: [
        "-l  long listing format",
        "-a  include hidden files (dotfiles)",
        "Directories shown in blue, executables in green, archives in red,",
        "images in magenta, documents in cyan, data files in yellow.",
    ],
    fn(args, ctx) {
        const flagStr = args.filter(a => a.startsWith("-")).join("");
        const paths = args.filter(a => !a.startsWith("-"));
        const long = flagStr.includes("l");
        const all = flagStr.includes("a");

        const targetParts = paths.length ? resolveParts(ctx.cwd(), paths[0]) : ctx.cwd();
        const targetNode = getNode(ctx.root, targetParts);

        if (!targetNode) return err(`ls: cannot access '${paths[0]}': No such file or directory`);
        if (targetNode.type === "file") return ok([[fileSegment(paths[0] ?? ".", targetNode)]]);

        const entries = Object.entries(targetNode.children)
            .filter(([name]) => all || !name.startsWith("."))
            .sort(([a, na], [b, nb]) => {
                // dirs first, then alpha
                if (na.type !== nb.type) return na.type === "dir" ? -1 : 1;
                return a.localeCompare(b);
            });

        if (long) {
            const now = "Jan  1 10:00";
            const lines: Line[] = [[s.dim(`total ${entries.length * 8}`)]];
            if (all) {
                lines.push([s.dim(`drwxr-xr-x  2 ${ctx.user} ${ctx.user}  4096 ${now} `), s.p("./", 4, true)]);
                lines.push([s.dim(`drwxr-xr-x  2 ${ctx.user} ${ctx.user}  4096 ${now} `), s.p("../", 4, true)]);
            }
            for (const [name, node] of entries) {
                const isDir = node.type === "dir";
                const isExec = !isDir && node.executable;
                const perms = isDir ? "drwxr-xr-x" : isExec ? "-rwxr-xr-x" : "-rw-r--r--";
                const size = isDir ? " 4096" : String(node.content.length).padStart(5);
                lines.push([
                    s.dim(`${perms}  1 ${ctx.user} ${ctx.user} ${size} ${now} `),
                    fileSegment(name, node),
                ]);
            }
            return ok(lines);
        }

        // Grid layout — measure col width from actual entries
        const names = entries.map(([n, node]) => n + (node.type === "dir" ? "/" : node.executable ? "*" : ""));
        const maxLen = Math.max(...names.map(n => n.length), 1);
        const colWidth = maxLen + 2;
        const cols = Math.max(1, Math.floor(72 / colWidth));
        const lines: Line[] = [];

        for (let i = 0; i < entries.length; i += cols) {
            const row: Segment[] = [];
            const slice = entries.slice(i, i + cols);
            for (let j = 0; j < slice.length; j++) {
                const [name, node] = slice[j];
                const seg = fileSegment(name, node);
                row.push(seg);
                const displayLen = seg.text.length;
                if (j < slice.length - 1) row.push(s.plain(" ".repeat(Math.max(1, colWidth - displayLen))));
            }
            lines.push(row);
        }
        return ok(lines);
    },
};

export default command;