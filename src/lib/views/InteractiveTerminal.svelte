<script lang="ts">
    import {onMount} from "svelte";
    import {init, Terminal, FitAddon} from "ghostty-web";
    import Group from "$lib/components/settings/Group.svelte";
    import config from "$lib/stores/config.svelte";

    // ── Filesystem simulation ──────────────────────────────────────────────────

    type FileNode = {type: "file"; content: string};
    type DirNode = {type: "dir"; children: Record<string, FileNode | DirNode>};

    function makeFilesystem(): DirNode {
        return {
            type: "dir",
            children: {
                "Desktop": {type: "dir", children: {}},
                "Documents": {
                    type: "dir",
                    children: {
                        "notes.txt": {
                            type: "file",
                            content: "Meeting notes – Jan 1\nTODO: update ghostty config",
                        },
                        "todo.md": {
                            type: "file",
                            content: "# TODO\n- [ ] Configure ghostty\n- [x] Install ghostty\n- [ ] Customize colors",
                        },
                    },
                },
                "Downloads": {
                    type: "dir",
                    children: {
                        "ghostty-1.0.0.tar.gz": {type: "file", content: "(binary file)"},
                    },
                },
                "Pictures": {
                    type: "dir",
                    children: {
                        "screenshot.png": {type: "file", content: "(binary file)"},
                    },
                },
                ".bash_profile": {
                    type: "file",
                    content: "export PATH=\"$HOME/.local/bin:$PATH\"\nexport TERM=ghostty",
                },
                "install.sh": {
                    type: "file",
                    content: "#!/bin/bash\necho \"Installing...\"\napt-get install -y ghostty",
                },
                "README.md": {
                    type: "file",
                    content: "# My Ghostty Setup\n\nA customized Ghostty configuration.\nGenerated with ghostty-config.",
                },
            },
        };
    }

    const USER = "john";
    const HOST = "ghostty-pc";

    let root: DirNode = makeFilesystem();
    let cwdParts: string[] = [];
    let cmdHistory: string[] = [];
    let histIdx = -1;
    let inputBuffer = "";

    // ── Filesystem helpers ─────────────────────────────────────────────────────

    function getCwdNode(): DirNode {
        let node: DirNode = root;
        for (const part of cwdParts) {
            const child = node.children[part];
            if (!child || child.type !== "dir") return root;
            node = child as DirNode;
        }
        return node;
    }

    function getCwdString(): string {
        return cwdParts.length === 0 ? "~" : "~/" + cwdParts.join("/");
    }

    function resolvePathParts(path: string): string[] {
        let parts: string[];
        if (path === "~" || path === "") return [];
        if (path.startsWith("~/")) parts = path.slice(2).split("/").filter(Boolean);
        else if (path.startsWith("/")) parts = path.slice(1).split("/").filter(Boolean);
        else parts = [...cwdParts, ...path.split("/").filter(Boolean)];

        const resolved: string[] = [];
        for (const p of parts) {
            if (p === ".") continue;
            else if (p === "..") resolved.pop();
            else resolved.push(p);
        }
        return resolved;
    }

    function getNodeAt(parts: string[]): FileNode | DirNode | null {
        let node: FileNode | DirNode = root;
        for (const part of parts) {
            if (node.type !== "dir") return null;
            const child: FileNode | DirNode | undefined = (node as DirNode).children[part];
            if (!child) return null;
            node = child;
        }
        return node;
    }

    // ── ANSI helpers ───────────────────────────────────────────────────────────

    const RESET = "\x1b[0m";
    function bold(s: string) {return `\x1b[1m${s}${RESET}`;}
    function dim(s: string) {return `\x1b[2m${s}${RESET}`;}
    function fg(n: number, s: string) {return `\x1b[${30 + n}m${s}${RESET}`;}
    function boldFg(n: number, s: string) {return `\x1b[1;${30 + n}m${s}${RESET}`;}

    function promptStr(): string {
        return `${boldFg(2, USER)}${fg(6, "@")}${boldFg(4, HOST)}:${fg(3, getCwdString())}${bold("$")} `;
    }

    // ── ls entry formatting ────────────────────────────────────────────────────

    function lsEntry(name: string, node: FileNode | DirNode, long: boolean): string {
        let colored: string;
        if (node.type === "dir") colored = boldFg(4, name);
        else if (name.endsWith(".sh")) colored = boldFg(2, name);
        else colored = name;

        if (!long) return colored;

        const isDir = node.type === "dir";
        const perms = isDir
            ? "drwxr-xr-x"
            : name.endsWith(".sh")
            ? "-rwxr-xr-x"
            : "-rw-r--r--";
        const size = isDir ? " 4096" : String((node as FileNode).content.length).padStart(5);
        return `${perms}  1 ${USER} ${USER} ${size} Jan  1 10:00 ${colored}`;
    }

    // ── Command execution ──────────────────────────────────────────────────────

    function exec(input: string): {lines: string[]; clear?: boolean} {
        const trimmed = input.trim();
        if (!trimmed) return {lines: []};

        const argv = trimmed.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g) ?? [];
        const [cmd, ...args] = argv;
        if (!cmd) return {lines: []};

        switch (cmd) {
            case "help":
                return {
                    lines: [
                        bold("Available commands:"),
                        `  ${boldFg(2, "ls")} [-la] [path]    List directory contents`,
                        `  ${boldFg(2, "cd")} [path]          Change directory`,
                        `  ${boldFg(2, "pwd")}                Print working directory`,
                        `  ${boldFg(2, "cat")} <file>         Print file contents`,
                        `  ${boldFg(2, "echo")} [text]        Print text`,
                        `  ${boldFg(2, "clear")}              Clear the screen`,
                        `  ${boldFg(2, "whoami")}             Print current user`,
                        `  ${boldFg(2, "hostname")}           Print hostname`,
                        `  ${boldFg(2, "date")}               Print date/time`,
                        `  ${boldFg(2, "uname")} [-a]         Print system info`,
                        `  ${boldFg(2, "mkdir")} <dir>        Create directory`,
                        `  ${boldFg(2, "touch")} <file>       Create empty file`,
                        `  ${boldFg(2, "help")}               Show this help`,
                    ],
                };

            case "whoami":
                return {lines: [USER]};

            case "hostname":
                return {lines: [HOST]};

            case "date":
                return {lines: [new Date().toString()]};

            case "uname":
                return {
                    lines: args.includes("-a")
                        ? ["Linux ghostty-pc 6.1.0 #1 SMP x86_64 GNU/Linux"]
                        : ["Linux"],
                };

            case "pwd": {
                const abs = cwdParts.length === 0 ? `/home/${USER}` : `/home/${USER}/${cwdParts.join("/")}`;
                return {lines: [abs]};
            }

            case "echo":
                return {
                    lines: [
                        args
                            .join(" ")
                            .replace(/"/g, "")
                            .replace(/'/g, "")
                            .replace(/\$USER/g, USER)
                            .replace(/\$HOME/g, `/home/${USER}`),
                    ],
                };

            case "cd": {
                const target = args[0] ?? "~";
                const parts = resolvePathParts(target);
                const node = getNodeAt(parts);
                if (!node) return {lines: [fg(1, `cd: no such file or directory: ${target}`)]};
                if (node.type !== "dir") return {lines: [fg(1, `cd: not a directory: ${target}`)]};
                cwdParts = parts;
                return {lines: []};
            }

            case "ls": {
                const flagStr = args.filter(a => a.startsWith("-")).join("");
                const paths = args.filter(a => !a.startsWith("-"));
                const long = flagStr.includes("l");
                const all = flagStr.includes("a");
                const targetParts = paths.length ? resolvePathParts(paths[0]) : cwdParts;
                const targetNode = getNodeAt(targetParts);

                if (!targetNode) {
                    return {lines: [fg(1, `ls: cannot access '${paths[0]}': No such file or directory`)]};
                }
                if (targetNode.type === "file") {
                    return {lines: [lsEntry(paths[0] ?? ".", targetNode, long)]};
                }

                const entries = Object.entries((targetNode as DirNode).children)
                    .filter(([name]) => all || !name.startsWith("."))
                    .sort(([a], [b]) => a.localeCompare(b));

                if (long) {
                    const lines: string[] = [dim(`total ${entries.length * 8}`)];
                    if (all) {
                        lines.push(`drwxr-xr-x  2 ${USER} ${USER}  4096 Jan  1 10:00 ${boldFg(4, ".")}`);
                        lines.push(`drwxr-xr-x  2 ${USER} ${USER}  4096 Jan  1 10:00 ${boldFg(4, "..")}`);
                    }
                    for (const [name, node] of entries) lines.push(lsEntry(name, node, true));
                    return {lines};
                }

                // Multi-column layout for short ls
                const cols = term ? Math.max(1, Math.floor(term.cols / 20)) : 4;
                const lines: string[] = [];
                for (let i = 0; i < entries.length; i += cols) {
                    lines.push(
                        entries
                            .slice(i, i + cols)
                            .map(([name, node]) => lsEntry(name, node, false).padEnd(20 + (lsEntry(name, node, false).length - name.length)))
                            .join(""),
                    );
                }
                return {lines};
            }

            case "cat": {
                if (!args[0]) return {lines: [fg(1, "cat: missing operand")]};
                const parts = resolvePathParts(args[0]);
                const node = getNodeAt(parts);
                if (!node) return {lines: [fg(1, `cat: ${args[0]}: No such file or directory`)]};
                if (node.type === "dir") return {lines: [fg(1, `cat: ${args[0]}: Is a directory`)]};
                return {lines: (node as FileNode).content.split("\n")};
            }

            case "clear":
                return {lines: [], clear: true};

            case "mkdir": {
                if (!args[0]) return {lines: [fg(1, "mkdir: missing operand")]};
                const cwd = getCwdNode();
                if (cwd.children[args[0]]) {
                    return {lines: [fg(1, `mkdir: cannot create directory '${args[0]}': File exists`)]};
                }
                cwd.children[args[0]] = {type: "dir", children: {}};
                return {lines: []};
            }

            case "touch": {
                if (!args[0]) return {lines: [fg(1, "touch: missing file operand")]};
                const cwd = getCwdNode();
                if (!cwd.children[args[0]]) {
                    cwd.children[args[0]] = {type: "file", content: ""};
                }
                return {lines: []};
            }

            default:
                return {
                    lines: [
                        `${fg(1, cmd)}: command not found. Type ${bold("help")} to list available commands.`,
                    ],
                };
        }
    }

    // ── Terminal setup ─────────────────────────────────────────────────────────

    const PALETTE_KEYS = [
        "black", "red", "green", "yellow",
        "blue", "magenta", "cyan", "white",
        "brightBlack", "brightRed", "brightGreen", "brightYellow",
        "brightBlue", "brightMagenta", "brightCyan", "brightWhite",
    ] as const;

    let container: HTMLDivElement | undefined = $state();
    let initialized = $state(false);
    let term: Terminal | undefined;
    let fitAddon: FitAddon | undefined;

    function getTheme() {
        const theme: Record<string, string> = {
            background: config.background,
            foreground: config.foreground,
        };
        if (config.cursorColor) theme.cursor = config.cursorColor;
        if (config.selectionBackground) theme.selectionBackground = config.selectionBackground;
        if (config.selectionForeground) theme.selectionForeground = config.selectionForeground;
        for (let i = 0; i < 16; i++) {
            const color = config.palette[i];
            if (color) theme[PALETTE_KEYS[i]] = color;
        }
        return theme;
    }

    function writePrompt() {
        term?.write(promptStr());
    }

    function handleData(data: string) {
        if (!term) return;

        // Handle escape sequences (arrow keys, etc.) as complete strings.
        // VT sequences: \x1b[A = up, \x1b[B = down, \x1b[C = right, \x1b[D = left.
        if (data === "\x1b[A") {
            // Arrow up – history
            if (histIdx < cmdHistory.length - 1) {
                histIdx++;
                term.write("\b \b".repeat(inputBuffer.length));
                inputBuffer = cmdHistory[histIdx];
                term.write(inputBuffer);
            }
            return;
        }
        if (data === "\x1b[B") {
            // Arrow down – history
            if (histIdx > 0) {
                histIdx--;
                term.write("\b \b".repeat(inputBuffer.length));
                inputBuffer = cmdHistory[histIdx];
                term.write(inputBuffer);
            }
            else if (histIdx === 0) {
                histIdx = -1;
                term.write("\b \b".repeat(inputBuffer.length));
                inputBuffer = "";
            }
            return;
        }
        if (data.startsWith("\x1b")) return; // ignore other escape sequences

        // Process remaining input character by character
        for (const char of data) {
            const code = char.charCodeAt(0);
            if (char === "\r" || char === "\n") {
                // Enter – execute command
                term.writeln("");
                const cmd = inputBuffer;
                inputBuffer = "";
                histIdx = -1;
                if (cmd.trim()) {
                    cmdHistory.unshift(cmd);
                    if (cmdHistory.length > 100) cmdHistory.pop();
                }
                const result = exec(cmd);
                if (result.clear) {
                    term.clear();
                }
                else {
                    for (const line of result.lines) term.writeln(line);
                }
                writePrompt();
            }
            else if (code === 127) {
                // Backspace
                if (inputBuffer.length > 0) {
                    inputBuffer = inputBuffer.slice(0, -1);
                    term.write("\b \b");
                }
            }
            else if (code === 3) {
                // Ctrl+C
                term.writeln("^C");
                inputBuffer = "";
                histIdx = -1;
                writePrompt();
            }
            else if (code >= 32) {
                // Printable character
                inputBuffer += char;
                term.write(char);
            }
        }
    }

    function recreateTerminal() {
        if (!container) return;

        if (term) {
            term.dispose();
            term = undefined;
            fitAddon = undefined;
            while (container.firstChild) container.removeChild(container.firstChild);
        }

        // Reset shell state
        root = makeFilesystem();
        cwdParts = [];
        inputBuffer = "";
        histIdx = -1;
        cmdHistory = [];

        term = new Terminal({
            fontSize: config.fontSize || 14,
            fontFamily: config.fontFamily || "monospace",
            theme: getTheme(),
            convertEol: true,
            scrollback: 1000,
            cursorBlink: config.cursorStyleBlink !== "false" && config.cursorStyleBlink !== false,
            cursorStyle: (config.cursorStyle as "block" | "underline" | "bar") || "block",
        });

        fitAddon = new FitAddon();
        term.loadAddon(fitAddon);
        term.open(container);
        fitAddon.fit();
        fitAddon.observeResize();

        term.onData(handleData);

        term.writeln(bold("Welcome to the interactive terminal preview!"));
        term.writeln(`Type ${bold("help")} to see available commands.\r\n`);
        writePrompt();
    }

    onMount(() => {
        init().then(() => {
            initialized = true;
        });

        return () => {
            term?.dispose();
        };
    });

    $effect(() => {
        if (!initialized || !container) return;
        // Track config values to trigger reactivity on changes
        const _configDependencies = [
            config.background,
            config.foreground,
            config.fontFamily,
            config.fontSize,
            config.cursorColor,
            config.cursorStyle,
            config.cursorStyleBlink,
            config.selectionBackground,
            config.selectionForeground,
            ...config.palette.slice(0, 16),
        ];
        recreateTerminal();
    });
</script>

<Group title="Interactive Terminal" note="Try it out! Type commands to interact with a simulated shell. Supported: ls, cd, pwd, cat, echo, clear, whoami, hostname, date, uname, mkdir, touch, help">
    <div class="terminal-wrapper" bind:this={container}></div>
</Group>

<style>
.terminal-wrapper {
    width: 100%;
    height: 360px;
    overflow: hidden;
    border-radius: var(--radius-level-3);
}
</style>
