<script lang="ts">
    import {tick} from "svelte";

    // ── Types ──────────────────────────────────────────────────────────────────

    type FileNode = {type: "file"; content: string; executable?: boolean};
    type DirNode = {type: "dir"; children: Record<string, FSNode>};
    type FSNode = FileNode | DirNode;

    type Segment = {
        text: string;
        palette?: number; // index into --config-palette-N
        hex?: string; // explicit hex color (for git, grep highlights, etc.)
        bold?: boolean;
        dim?: boolean;
        italic?: boolean;
    };

    type Line = Segment[];

    type ExecResult = {lines: Line[]; clear?: boolean; mutateCwd?: string[]};

    type ExecContext = {
        cwd: () => string[]; // getter so commands always see latest
        setCwd: (p: string[]) => void;
        root: DirNode;
        user: string;
        host: string;
    };

    type Command = {
        desc: string; // one-liner shown in `help`
        usage?: string; // args shown in `help`, e.g. "[-la] [path]"
        details?: string[]; // extra lines shown in `help <cmd>`
        fn: (args: string[], ctx: ExecContext) => ExecResult;
    };

    type HistoryEntry =
        | {kind: "cmd"; prompt: PromptSnapshot; cmd: string}
        | {kind: "output"; id: number; segments: Segment[]}
        | {kind: "ctrlc"; prompt: PromptSnapshot; input: string};

    type PromptSnapshot = {user: string; host: string; cwd: string};

    // ── Filesystem ─────────────────────────────────────────────────────────────

    function makeFilesystem(): DirNode {
        return {
            type: "dir",
            children: {
                "Desktop": {type: "dir", children: {}},
                "Documents": {
                    type: "dir",
                    children: {
                        "notes.txt": {type: "file", content: "Meeting notes – Jan 1\nTODO: update ghostty config"},
                        "todo.md": {type: "file", content: "# TODO\n- [ ] Configure ghostty\n- [x] Install ghostty\n- [ ] Customize colors"},
                        "report.pdf": {type: "file", content: "(binary file)"},
                    },
                },
                "Downloads": {
                    type: "dir",
                    children: {
                        "ghostty-1.0.0.tar.gz": {type: "file", content: "(binary file)"},
                        "setup.sh": {type: "file", content: "#!/bin/bash\napt-get install -y ghostty", executable: true},
                    },
                },
                "Pictures": {
                    type: "dir",
                    children: {
                        "screenshot.png": {type: "file", content: "(binary file)"},
                        "wallpaper.jpg": {type: "file", content: "(binary file)"},
                    },
                },
                "Projects": {
                    type: "dir",
                    children: {
                        "ghostty-config": {
                            type: "dir",
                            children: {
                                "README.md": {type: "file", content: "# ghostty-config\nA web-based GUI config generator for Ghostty."},
                                "package.json": {type: "file", content: "{\n  \"name\": \"ghostty-config\",\n  \"version\": \"1.0.0\"\n}"},
                                "src": {
                                    type: "dir",
                                    children: {
                                        "index.ts": {type: "file", content: "import \"./app.css\";\nimport App from \"./App.svelte\";"},
                                    },
                                },
                            },
                        },
                    },
                },
                ".bash_profile": {type: "file", content: "export PATH=\"$HOME/.local/bin:$PATH\"\nexport TERM=ghostty"},
                ".gitconfig": {type: "file", content: "[user]\n\tname = John\n\temail = john@example.com\n[core]\n\teditor = nvim"},
                "README.md": {type: "file", content: "# My Ghostty Setup\n\nA customized Ghostty configuration.\nGenerated with ghostty-config."},
                "install.sh": {type: "file", content: "#!/bin/bash\necho \"Installing...\"\napt-get install -y ghostty", executable: true},
            },
        };
    }

    // ── Path helpers ───────────────────────────────────────────────────────────

    function resolveParts(cwd: string[], path: string): string[] {
        let parts: string[];
        if (path === "~" || path === "") parts = [];
        else if (path.startsWith("~/")) parts = path.slice(2).split("/").filter(Boolean);
        else if (path.startsWith("/")) parts = path.slice(1).split("/").filter(Boolean);
        else parts = [...cwd, ...path.split("/").filter(Boolean)];

        const out: string[] = [];
        for (const p of parts) {
            if (p === ".") continue;
            else if (p === "..") out.pop();
            else out.push(p);
        }
        return out;
    }

    function getNode(root: DirNode, parts: string[]): FSNode | null {
        let node: FSNode = root;
        for (const part of parts) {
            if (node.type !== "dir") return null;
            const child = node.children[part] as FSNode | undefined;
            if (!child) return null;
            node = child;
        }
        return node;
    }

    function cwdString(parts: string[]): string {
        return parts.length === 0 ? "~" : "~/" + parts.join("/");
    }

    function cwdAbs(user: string, parts: string[]): string {
        return parts.length === 0 ? `/home/${user}` : `/home/${user}/${parts.join("/")}`;
    }

    // ── Segment helpers ────────────────────────────────────────────────────────

    const s = {
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

    const ok = (lines: Line[]): ExecResult => ({lines});
    const clear = (): ExecResult => ({lines: [], clear: true});
    const err = (msg: string): ExecResult => ({lines: [[s.error(msg)]]});

    // ── File coloring (eza-style) ──────────────────────────────────────────────

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

    function fileSegment(name: string, node: FSNode): Segment {
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

    // ── Fake git state ─────────────────────────────────────────────────────────

    const gitState = {
        branch: "main",
        staged: ["src/index.ts", "README.md"],
        modified: ["package.json", "src/app.css"],
        untracked: ["dist/", ".env"],
        log: [
            {hash: "a3f9c12", author: "John", date: "2 hours ago", msg: "feat: add background image settings"},
            {hash: "b81e204", author: "John", date: "5 hours ago", msg: "fix: correct palette reset logic"},
            {hash: "c0d3a99", author: "John", date: "yesterday", msg: "refactor: split registry into modules"},
            {hash: "d4e7f11", author: "John", date: "2 days ago", msg: "chore: update dependencies"},
            {hash: "e5b2c30", author: "Jane", date: "3 days ago", msg: "docs: improve README"},
        ],
    };

    // ── Command registry ───────────────────────────────────────────────────────

    const commands: Record<string, Command> = {

        help: {
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
        },

        clear: {
            desc: "Clear the terminal screen",
            fn: () => clear(),
        },

        pwd: {
            desc: "Print working directory",
            fn(_, ctx) {
                return ok([[s.plain(cwdAbs(ctx.user, ctx.cwd()))]]);
            },
        },

        cd: {
            desc: "Change directory",
            usage: "[path]",
            details: ["With no arguments, returns to home directory (~).", "Supports ~, .., and absolute paths."],
            fn(args, ctx) {
                const target = args[0] ?? "~";
                const parts = resolveParts(ctx.cwd(), target);
                const node = getNode(ctx.root, parts);
                if (!node) return err(`cd: no such file or directory: ${target}`);
                if (node.type !== "dir") return err(`cd: not a directory: ${target}`);
                ctx.setCwd(parts);
                return ok([]);
            },
        },

        ls: {
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
        },

        cat: {
            desc: "Print file contents",
            usage: "<file>",
            fn(args, ctx) {
                if (!args[0]) return err("cat: missing operand");
                const parts = resolveParts(ctx.cwd(), args[0]);
                const node = getNode(ctx.root, parts);
                if (!node) return err(`cat: ${args[0]}: No such file or directory`);
                if (node.type === "dir") return err(`cat: ${args[0]}: Is a directory`);
                return ok(node.content.split("\n").map(l => [s.plain(l)]));
            },
        },

        echo: {
            desc: "Print text",
            usage: "[text...]",
            fn(args, ctx) {
                const text = args
                    .join(" ")
                    .replace(/^["']|["']$/g, "")
                    .replace(/\$USER/g, ctx.user)
                    .replace(/\$HOME/g, `/home/${ctx.user}`)
                    .replace(/\$PWD/g, cwdAbs(ctx.user, ctx.cwd()));
                return ok([[s.plain(text)]]);
            },
        },

        mkdir: {
            desc: "Create a directory",
            usage: "<dir>",
            fn(args, ctx) {
                if (!args[0]) return err("mkdir: missing operand");
                const cwd = getNode(ctx.root, ctx.cwd()) as DirNode;
                if (cwd.children[args[0]]) return err(`mkdir: cannot create directory '${args[0]}': File exists`);
                cwd.children[args[0]] = {type: "dir", children: {}};
                return ok([]);
            },
        },

        touch: {
            desc: "Create an empty file or update timestamp",
            usage: "<file>",
            fn(args, ctx) {
                if (!args[0]) return err("touch: missing file operand");
                const cwd = getNode(ctx.root, ctx.cwd()) as DirNode;
                if (!cwd.children[args[0]]) cwd.children[args[0]] = {type: "file", content: ""};
                return ok([]);
            },
        },

        rm: {
            desc: "Remove a file",
            usage: "[-r] <file>",
            details: ["-r  remove directories recursively"],
            fn(args, ctx) {
                const recursive = args.includes("-r") || args.includes("-rf") || args.includes("-fr");
                const targets = args.filter(a => !a.startsWith("-"));
                if (!targets[0]) return err("rm: missing operand");
                const cwd = getNode(ctx.root, ctx.cwd()) as DirNode;
                const node = cwd.children[targets[0]];
                if (!node) return err(`rm: cannot remove '${targets[0]}': No such file or directory`);
                if (node.type === "dir" && !recursive) return err(`rm: cannot remove '${targets[0]}': Is a directory`);
                delete cwd.children[targets[0]];
                return ok([]);
            },
        },

        whoami: {
            desc: "Print current user name",
            fn(_, ctx) {return ok([[s.plain(ctx.user)]]);},
        },

        hostname: {
            desc: "Print system hostname",
            fn(_, ctx) {return ok([[s.plain(ctx.host)]]);},
        },

        date: {
            desc: "Print current date and time",
            fn() {return ok([[s.plain(new Date().toString())]]);},
        },

        uname: {
            desc: "Print system information",
            usage: "[-a]",
            details: ["-a  print all information"],
            fn(args, ctx) {
                return ok([[s.plain(args.includes("-a")
                    ? `Linux ${ctx.host} 6.1.0 #1 SMP x86_64 GNU/Linux`
                    : "Linux")]]);
            },
        },

        grep: {
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

                type Match = {file?: string; lineNum: number; line: string; ranges: Array<[number, number]>};
                const matches: Match[] = [];

                function searchFile(content: string, displayName?: string) {
                    content.split("\n").forEach((line, i) => {
                        // const testRegex = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), ignoreCase ? "gi" : "g");
                        const ranges: Array<[number, number]> = [];
                        let m: RegExpExecArray | null;
                        while ((m = regex.exec(line)) !== null) ranges.push([m.index, m.index + m[0].length]);
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
        },

        git: {
            desc: "Version control (curated preview)",
            usage: "<subcommand>",
            details: [
                "Supported subcommands: status, log, diff, branch, add, commit",
                "This is a curated demo — output is simulated for preview purposes.",
            ],
            fn(args) {
                const sub = args[0];

                if (!sub) return err("git: missing subcommand. Try: status, log, diff, branch");

                if (sub === "status") {
                    const lines: Line[] = [
                        [s.plain("On branch "), s.p(gitState.branch, 2, true)],
                        [s.plain("")],
                        [s.bold("Changes to be committed:")],
                        [s.dim("  (use \"git restore --staged <file>...\" to unstage)")],
                    ];
                    for (const f of gitState.staged) lines.push([s.plain("        "), s.success("modified:   " + f)]);
                    lines.push([s.plain("")]);
                    lines.push([s.bold("Changes not staged for commit:")]);
                    lines.push([s.dim("  (use \"git add <file>...\" to update what will be committed)")]);
                    for (const f of gitState.modified) lines.push([s.plain("        "), s.error("modified:   " + f)]);
                    lines.push([s.plain("")]);
                    lines.push([s.bold("Untracked files:")]);
                    lines.push([s.dim("  (use \"git add <file>...\" to include in what will be committed)")]);
                    for (const f of gitState.untracked) lines.push([s.plain("        "), s.error(f)]);
                    return ok(lines);
                }

                if (sub === "log" || (sub === "log" && args.includes("--oneline"))) {
                    const oneline = args.includes("--oneline");
                    const n = parseInt(args[args.indexOf("-n") + 1] ?? args.find(a => /^-\d+$/.test(a))?.slice(1) ?? "5");
                    const count = isNaN(n) ? 5 : Math.min(n, gitState.log.length);
                    const lines: Line[] = [];
                    for (const entry of gitState.log.slice(0, count)) {
                        if (oneline) {
                            lines.push([s.p(entry.hash, 3), s.plain(" " + entry.msg)]);
                        }
                        else {
                            lines.push([s.p("commit " + entry.hash + "f3a91b2c", 3)]);
                            lines.push([s.plain(`Author: ${entry.author} <${entry.author.toLowerCase()}@example.com>`)]);
                            lines.push([s.plain(`Date:   ${entry.date}`)]);
                            lines.push([s.plain("")]);
                            lines.push([s.plain("    " + entry.msg)]);
                            lines.push([s.plain("")]);
                        }
                    }
                    return ok(lines);
                }

                if (sub === "diff") {
                    const lines: Line[] = [
                        [s.dim("diff --git a/package.json b/package.json")],
                        [s.dim("index 3a1b2c4..5d6e7f8 100644")],
                        [s.bold("--- a/package.json")],
                        [s.bold("+++ b/package.json")],
                        [s.p("@@ -1,4 +1,5 @@", 6)],
                        [s.plain(" {")],
                        [s.plain("   \"name\": \"ghostty-config\",")],
                        [s.error("-  \"version\": \"1.0.0\"")],
                        [s.success("+  \"version\": \"1.1.0\",")],
                        [s.success("+  \"description\": \"Web GUI for Ghostty configuration\"")],
                        [s.plain(" }")],
                    ];
                    return ok(lines);
                }

                if (sub === "branch") {
                    const lines: Line[] = [
                        [s.success("* " + gitState.branch)],
                        [s.plain("  develop")],
                        [s.plain("  feature/background-image")],
                    ];
                    return ok(lines);
                }

                if (sub === "add") {
                    if (!args[1]) return err("git add: nothing specified");
                    return ok([[s.plain("")]]);
                }

                if (sub === "commit") {
                    const mIdx = args.indexOf("-m");
                    const msg = mIdx >= 0 ? args[mIdx + 1] : undefined;
                    if (!msg) return err("git commit: please provide a message with -m \"...\"");
                    const hash = Math.random().toString(16).slice(2, 9);
                    return ok([
                        [s.plain("["), s.p(gitState.branch, 2), s.plain(" "), s.p(hash, 3), s.plain("] " + msg.replace(/^["']|["']$/g, ""))],
                        [s.plain(` ${gitState.staged.length} files changed`)],
                    ]);
                }

                return err(`git: '${sub}' is not a supported subcommand in this preview. Try: status, log, diff, branch, add, commit`);
            },
        },
    };

    // ── Command execution (with && chain support) ──────────────────────────────

    function execChain(input: string, ctx: ExecContext): ExecResult {
        // Split on && — run each segment, stop on first error/non-empty-exit
        const parts = input.split("&&").map(p => p.trim()).filter(Boolean);
        const allLines: Line[] = [];

        for (const part of parts) {
            const result = execSingle(part, ctx);
            if (result.clear) return result; // clear short-circuits everything
            allLines.push(...result.lines);
            // Treat an error line (palette 1) as failure — stop the chain
            const failed = result.lines.some(line => line.some(seg => seg.palette === 1));
            if (failed) break;
        }

        return {lines: allLines};
    }

    function execSingle(input: string, ctx: ExecContext): ExecResult {
        const trimmed = input.trim();
        if (!trimmed) return {lines: []};

        const argv = trimmed.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g) ?? [];
        const [cmd, ...args] = argv;
        if (!cmd) return {lines: []};

        const def = commands[cmd];
        if (!def) {
            return {lines: [[
                s.error(`${cmd}: command not found`),
                s.plain(". Type "),
                s.bold("help"),
                s.plain(" to list available commands."),
            ]]};
        }

        try {
            return def.fn(args, ctx);
        }
        catch {
            return err(`${cmd}: unexpected error`);
        }
    }

    // ── Tab completion ─────────────────────────────────────────────────────────

    function tabComplete(input: string, cwd: string[], root: DirNode): string | null {
        const argv = input.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g) ?? [];
        const isCmd = argv.length === 0 || (argv.length === 1 && !input.endsWith(" "));

        if (isCmd) {
            const partial = argv[0] ?? "";
            const matches = Object.keys(commands).filter(c => c.startsWith(partial));
            if (matches.length === 1) return matches[0] + " ";
            if (matches.length > 1) {
                // Return longest common prefix
                const lcp = longestCommonPrefix(matches);
                return lcp.length > partial.length ? lcp : null;
            }
            return null;
        }

        // File/dir completion for the last arg
        const lastArg = input.endsWith(" ") ? "" : (argv[argv.length - 1] ?? "");
        const slashIdx = lastArg.lastIndexOf("/");
        const dirPart = slashIdx >= 0 ? lastArg.slice(0, slashIdx + 1) : "";
        const filePart = slashIdx >= 0 ? lastArg.slice(slashIdx + 1) : lastArg;

        const dirParts = resolveParts(cwd, dirPart || ".");
        const dirNode = getNode(root, dirParts);
        if (!dirNode || dirNode.type !== "dir") return null;

        const matches = Object.entries(dirNode.children)
            .filter(([name]) => name.startsWith(filePart))
            .map(([name, node]) => dirPart + name + (node.type === "dir" ? "/" : ""));

        if (matches.length === 1) {
            // Replace last arg with completed version
            const prefix = input.endsWith(" ") ? input : input.slice(0, input.length - lastArg.length);
            return prefix + matches[0];
        }
        if (matches.length > 1) {
            const lcp = longestCommonPrefix(matches);
            const prefix = input.endsWith(" ") ? input : input.slice(0, input.length - lastArg.length);
            const newLast = lcp.length > filePart.length ? lcp : null;
            return newLast ? prefix + newLast : null;
        }
        return null;
    }

    function longestCommonPrefix(strs: string[]): string {
        if (!strs.length) return "";
        let prefix = strs[0];
        for (const s of strs.slice(1)) {
            while (!s.startsWith(prefix)) prefix = prefix.slice(0, -1);
        }
        return prefix;
    }

    // ── Terminal state ─────────────────────────────────────────────────────────

    const USER = "john";
    const HOST = "ghostty-pc";

    const root: DirNode = $state(makeFilesystem());
    let cwdParts: string[] = $state([]);
    const cmdHistory: string[] = $state([]);
    let histIdx = $state(-1);
    let inputBuffer = $state("");
    let cursorPos = $state(0);
    let outputIdCounter = 0;

    let history: HistoryEntry[] = $state([
        {kind: "output", id: outputIdCounter++, segments: [{text: "Welcome to the interactive terminal preview!", bold: true}]},
        {
            kind: "output",
            id: outputIdCounter++,
            segments: [
                s.plain("Type "), s.p("help", 10, true), s.plain(" to get started or "),
                s.p("help <cmd>", 10), s.plain(" for command details."),
            ]
        },
        {kind: "output", id: outputIdCounter++, segments: [s.plain("")]},
    ]);

    const ctx: ExecContext = {
        cwd: () => cwdParts,
        setCwd: (p) => {cwdParts = p;},
        root,
        user: USER,
        host: HOST,
    };

    // ── Rendering helpers ──────────────────────────────────────────────────────

    let container: HTMLDivElement | undefined = $state();
    let scrollTarget: HTMLDivElement | undefined = $state();

    async function scrollToBottom() {
        await tick();
        scrollTarget?.scrollIntoView({block: "end"});
    }

    function snapshot(): PromptSnapshot {
        return {user: USER, host: HOST, cwd: cwdString(cwdParts)};
    }

    function pushOutput(lines: Line[]) {
        for (const segments of lines) {
            history.push({kind: "output", id: outputIdCounter++, segments});
        }
    }

    // ── Input handling ─────────────────────────────────────────────────────────

    function handleKeydown(e: KeyboardEvent) {
        if (e.metaKey) return;
        if (e.ctrlKey && !["c", "l"].includes(e.key)) return;

        switch (true) {
            case e.key === "Tab": {
                e.preventDefault();
                const completed = tabComplete(inputBuffer, cwdParts, root);
                if (completed !== null) {
                    inputBuffer = completed;
                    cursorPos = inputBuffer.length;
                }
                break;
            }

            case e.key === "ArrowUp": {
                e.preventDefault();
                if (histIdx < cmdHistory.length - 1) {
                    histIdx++;
                    inputBuffer = cmdHistory[histIdx];
                    cursorPos = inputBuffer.length;
                }
                break;
            }

            case e.key === "ArrowDown": {
                e.preventDefault();
                if (histIdx > 0) {
                    histIdx--;
                    inputBuffer = cmdHistory[histIdx];
                    cursorPos = inputBuffer.length;
                }
            else if (histIdx === 0) {
                    histIdx = -1;
                    inputBuffer = "";
                    cursorPos = 0;
                }
                break;
            }

            case e.key === "ArrowLeft": {
                e.preventDefault();
                if (cursorPos > 0) cursorPos--;
                break;
            }

            case e.key === "ArrowRight": {
                e.preventDefault();
                if (cursorPos < inputBuffer.length) cursorPos++;
                break;
            }

            case e.key === "Home": {
                e.preventDefault();
                cursorPos = 0;
                break;
            }

            case e.key === "End": {
                e.preventDefault();
                cursorPos = inputBuffer.length;
                break;
            }

            case e.key === "Enter": {
                e.preventDefault();
                const snap = snapshot();
                const cmd = inputBuffer;
                if (cmd.trim()) {
                    cmdHistory.unshift(cmd);
                    if (cmdHistory.length > 100) cmdHistory.pop();
                }
                inputBuffer = "";
                cursorPos = 0;
                histIdx = -1;

                history.push({kind: "cmd", prompt: snap, cmd});

                const result = execChain(cmd, ctx);
                if (result.clear) {
                    history = [];
                }
                else {
                    pushOutput(result.lines);
                }
                void scrollToBottom();
                break;
            }

            case e.key === "Backspace": {
                e.preventDefault();
                if (cursorPos > 0) {
                    inputBuffer = inputBuffer.slice(0, cursorPos - 1) + inputBuffer.slice(cursorPos);
                    cursorPos--;
                }
                break;
            }

            case e.key === "Delete": {
                e.preventDefault();
                if (cursorPos < inputBuffer.length) {
                    inputBuffer = inputBuffer.slice(0, cursorPos) + inputBuffer.slice(cursorPos + 1);
                }
                break;
            }

            case e.ctrlKey && e.key === "c": {
                e.preventDefault();
                history.push({kind: "ctrlc", prompt: snapshot(), input: inputBuffer});
                inputBuffer = "";
                cursorPos = 0;
                histIdx = -1;
                void scrollToBottom();
                break;
            }

            case e.ctrlKey && e.key === "l": {
                e.preventDefault();
                history = [];
                break;
            }

            default: {
                if (e.key.length === 1 && !e.ctrlKey) {
                    e.preventDefault();
                    inputBuffer = inputBuffer.slice(0, cursorPos) + e.key + inputBuffer.slice(cursorPos);
                    cursorPos++;
                }
            }
        }
    }

    // ── Derived prompt state ───────────────────────────────────────────────────

    const currentCwd = $derived(cwdString(cwdParts));
    const cursorChar = $derived(inputBuffer[cursorPos] ?? " ");
    const beforeCursor = $derived(inputBuffer.slice(0, cursorPos));
    const afterCursor = $derived(inputBuffer.slice(cursorPos + 1));

    function focusTerminal() {container?.focus();}

    // ── Props ──────────────────────────────────────────────────────────────────

    interface Props {
        onCwdChange?: (cwd: string) => void;
    }

    const {onCwdChange}: Props = $props();

    $effect(() => {onCwdChange?.(cwdString(cwdParts));});
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex, a11y_no_noninteractive_element_interactions -->
<div
    class="term standalone"
    role="application"
    aria-label="Interactive terminal"
    tabindex="0"
    bind:this={container}
    onkeydown={handleKeydown}
    onclick={focusTerminal}
>
    <div class="term-scroll">
        {#each history as entry (entry.kind === "output" ? entry.id : entry)}
            {#if entry.kind === "cmd"}
                <div class="line">
                    <span class="p2 bold">{entry.prompt.user}</span><!--
                    --><span class="p6">@</span><!--
                    --><span class="p4 bold">{entry.prompt.host}</span><!--
                    --><span class="fg">:</span><!--
                    --><span class="p3">{entry.prompt.cwd}</span><!--
                    --><span class="fg bold">$&nbsp;</span><!--
                    --><span class="fg">{entry.cmd}</span>
                </div>
            {:else if entry.kind === "ctrlc"}
                <div class="line">
                    <span class="p2 bold">{entry.prompt.user}</span><!--
                    --><span class="p6">@</span><!--
                    --><span class="p4 bold">{entry.prompt.host}</span><!--
                    --><span class="fg">:</span><!--
                    --><span class="p3">{entry.prompt.cwd}</span><!--
                    --><span class="fg bold">$&nbsp;</span><!--
                    --><span class="fg">{entry.input}</span><!--
                    --><span class="p1">^C</span>
                </div>
            {:else}
                <div class="line">
                    {#each entry.segments as seg (seg)}
                        <span
                            class:bold={seg.bold}
                            class:dimmed={seg.dim}
                            class:italic={seg.italic}
                            style:color={seg.hex ?? (seg.palette !== undefined ? `var(--config-palette-${seg.palette})` : undefined)}
                        >{seg.text}</span>
                    {/each}
                </div>
            {/if}
        {/each}

        <div class="line input-line">
            <span class="p2 bold">{USER}</span><!--
            --><span class="p6">@</span><!--
            --><span class="p4 bold">{HOST}</span><!--
            --><span class="fg">:</span><!--
            --><span class="p3">{currentCwd}</span><!--
            --><span class="fg bold">$&nbsp;</span><!--
            --><span class="fg">{beforeCursor}</span><!--
            --><span class="cursor">{cursorChar}</span><!--
            --><span class="fg">{afterCursor}</span>
        </div>

        <div bind:this={scrollTarget}></div>
    </div>
</div>


<style>
.term {
    background: var(--config-bg);
    color: var(--config-fg);
    font-family: var(--config-font-family);
    font-size: var(--config-font-size);
    padding: 10px;
    border-radius: var(--radius-level-3);
    border: 1px solid rgba(0, 0, 0, 0.5);
    box-shadow: 0 0 1px rgba(255, 255, 255, 0.5) inset;
    outline: none;
    cursor: text;
    overflow-y: auto;
    height: 360px;
}

.term.standalone {
    height: 100%;
    border-radius: 0;
    border: none;
    box-shadow: none;
}

.term-scroll {
    min-height: 100%;
}

.line {
    display: flex;
    white-space: pre;
    line-height: 1.4;
    flex-wrap: nowrap;
}

.input-line {
    min-height: 1.4em;
}

.bold   {font-weight: 700;}
.dimmed {opacity: 0.55;}
.italic {font-style: italic;}

.fg {color: var(--config-fg);}
.p1 {color: var(--config-palette-1);}
.p2 {color: var(--config-palette-2);}
.p3 {color: var(--config-palette-3);}
.p4 {color: var(--config-palette-4);}
.p6 {color: var(--config-palette-6);}

.cursor {
    color: var(--config-bg);
    background: var(--config-fg);
    min-width: 1ch;
    display: inline-block;
    animation: blink 1.2s step-start infinite;
}

.term:not(:focus) .cursor {
    background: transparent;
    color: var(--config-fg);
    outline: 1px solid var(--config-fg);
    animation: none;
}

@keyframes blink {
    0%, 100% {opacity: 1;}
    50% {opacity: 0;}
}
</style>