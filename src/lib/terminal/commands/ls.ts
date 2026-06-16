import {getNode, resolveParts} from "../filesystem";
import type {Command, FSNode, Line, Segment} from "../types";
import {err, fileSegment, ok, s} from "../utils";


const permissions = {
    "d": s.p("d", 12),
    ".": s.p(".", 7),
    "-": s.p("-", 8),
    "r": s.p("r", 11),
    "w": s.p("w", 9),
    "x": s.p("x", 10),
};


const RWX = [permissions.r, permissions.w, permissions.x, permissions.r, permissions["-"], permissions.x, permissions.r, permissions["-"], permissions.x];
const RW = [permissions.r, permissions.w, permissions["-"], permissions.r, permissions["-"], permissions["-"], permissions.r, permissions["-"], permissions["-"]];

function buildPermissions(name: string, node: FSNode): Segment[] {
    const isDir = node.type === "dir";
    const isDot = name.startsWith(".");
    const isExec = node.type === "file" && node.executable;
    const chars: Segment[] = [];

    // Dir or file
    if (isDir) chars.push(permissions.d);
    else chars.push(permissions["."]);

    // Special perms for dotfiles: rwx for owner, --- for group and others
    if (isDir && isDot) {
        chars.push(permissions.r, permissions.w, permissions.x, permissions["-"], permissions["-"], permissions["-"], permissions["-"], permissions["-"], permissions["-"]);
    }

    // Generic permissions: rwx for dirs, rw- for executables, r-- for regular files
    if (isExec || (isDir && !isDot)) chars.push(...RWX);
    else if (!isDir) chars.push(...RW);
    chars.push(s.plain(" ")); // spacer after permissions
    return chars;
}


// const LONG_HEADER = [s.underline("Permissions"), s.plain(" "), s.underline("Size"), s.plain(" "), s.underline("User"), s.plain(" "), s.underline("Date Modified"), s.plain(" "), s.underline("Name")];

const command: Command = {
    desc: "List directory contents (eza-like)",
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
            // const now = "  1 Jan 10:00";
            const userLength = Math.max(ctx.user.length, 4); // cheating here because there's only one potential user, but in a real fs need to measure actual owner names across all rows
            // const lines: Line[] = [[s.dim(`total ${entries.length * 8}`)]];
            const lines: Line[] = [];
            lines.push([
                s.underline("Permissions"),
                s.plain(" "),
                s.underline("Size"),
                s.plain(" "),
                s.underline("User"),
                s.plain(" ".padStart(userLength - 4, " ")), // account for username longer than "User"
                s.plain(" "),
                s.underline("Date Modified"),
                s.plain(" "),
                s.underline("Name")
            ]);
            for (const [name, node] of entries) {
                const randomDate = new Date(Date.now() - Math.floor(Math.random() * 31536000000)); // random date within the last year
                const day = String(randomDate.getDate()).padStart(2, " ");
                const month = randomDate.toLocaleString("en-US", {month: "short"});
                const time = randomDate.toLocaleTimeString("en-US", {hour: "2-digit", minute: "2-digit", hour12: false});
                const now = `${day} ${month} ${time}`;
                const isDir = node.type === "dir";
                const perms = buildPermissions(name, node);
                const size = isDir ? s.p("-".padStart(4, " "), 8) : s.p(`${String(node.content.length).padStart(4)}`, 2);
                lines.push([
                    ...perms,
                    s.plain(" "),
                    size,
                    s.plain(" "),
                    s.p(ctx.user.padEnd(5, " "), 11),
                    s.plain(" "),
                    s.p(`${now}`, 4),
                    s.plain("  "),
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