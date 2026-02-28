<script lang="ts">
    import {tick} from "svelte";

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
                        "notes.txt": {type: "file", content: "Meeting notes – Jan 1\nTODO: update ghostty config"},
                        "todo.md": {type: "file", content: "# TODO\n- [ ] Configure ghostty\n- [x] Install ghostty\n- [ ] Customize colors"},
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
                ".bash_profile": {type: "file", content: "export PATH=\"$HOME/.local/bin:$PATH\"\nexport TERM=ghostty"},
                "install.sh": {type: "file", content: "#!/bin/bash\necho \"Installing...\"\napt-get install -y ghostty"},
                "README.md": {type: "file", content: "# My Ghostty Setup\n\nA customized Ghostty configuration.\nGenerated with ghostty-config."},
            },
        };
    }

    const USER = "john";
    const HOST = "ghostty-pc";

    const root: DirNode = $state(makeFilesystem());
    let cwdParts: string[] = $state([]);
    const cmdHistory: string[] = $state([]);
    let histIdx = $state(-1);
    let inputBuffer = $state("");
    let cursorPos = $state(0);

    // ── History display ────────────────────────────────────────────────────────

    type Segment = {text: string; palette?: number; bold?: boolean; dim?: boolean};
    type HistoryEntry =
        | {kind: "cmd"; user: string; host: string; cwd: string; cmd: string}
        | {kind: "output"; segments: Segment[]}
        | {kind: "ctrlc"; user: string; host: string; cwd: string; input: string};

    let history: HistoryEntry[] = $state([]);

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

    // ── Segment helpers ────────────────────────────────────────────────────────

    const plain = (text: string): Segment => ({text});
    const colored = (text: string, palette: number, bold?: boolean): Segment => ({text, palette, bold});
    const error = (text: string): Segment => ({text, palette: 1});
    const dim = (text: string): Segment => ({text, dim: true});

    function dirEntry(name: string, node: FileNode | DirNode): Segment {
        if (node.type === "dir") return colored(name, 4, true);
        if (name.endsWith(".sh")) return colored(name, 2, true);
        return plain(name);
    }

    // ── Command execution ──────────────────────────────────────────────────────

    function exec(input: string): {lines: Segment[][]; clear?: boolean} {
        const trimmed = input.trim();
        if (!trimmed) return {lines: []};

        const argv = trimmed.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g) ?? [];
        const [cmd, ...args] = argv;
        if (!cmd) return {lines: []};

        switch (cmd) {
            case "help":
                return {
                    lines: [
                        [{text: "Available commands:", bold: true}],
                        [plain("  "), colored("ls", 2, true), plain(" [-la] [path]    List directory contents")],
                        [plain("  "), colored("cd", 2, true), plain(" [path]          Change directory")],
                        [plain("  "), colored("pwd", 2, true), plain("                Print working directory")],
                        [plain("  "), colored("cat", 2, true), plain(" <file>         Print file contents")],
                        [plain("  "), colored("echo", 2, true), plain(" [text]        Print text")],
                        [plain("  "), colored("clear", 2, true), plain("              Clear the screen")],
                        [plain("  "), colored("whoami", 2, true), plain("             Print current user")],
                        [plain("  "), colored("hostname", 2, true), plain("           Print hostname")],
                        [plain("  "), colored("date", 2, true), plain("               Print date/time")],
                        [plain("  "), colored("uname", 2, true), plain(" [-a]         Print system info")],
                        [plain("  "), colored("mkdir", 2, true), plain(" <dir>        Create directory")],
                        [plain("  "), colored("touch", 2, true), plain(" <file>       Create empty file")],
                        [plain("  "), colored("help", 2, true), plain("               Show this help")],
                    ],
                };

            case "whoami":
                return {lines: [[plain(USER)]]};

            case "hostname":
                return {lines: [[plain(HOST)]]};

            case "date":
                return {lines: [[plain(new Date().toString())]]};

            case "uname":
                return {
                    lines: [
                        [plain(args.includes("-a") ? "Linux ghostty-pc 6.1.0 #1 SMP x86_64 GNU/Linux" : "Linux")],
                    ],
                };

            case "pwd": {
                const abs = cwdParts.length === 0 ? `/home/${USER}` : `/home/${USER}/${cwdParts.join("/")}`;
                return {lines: [[plain(abs)]]};
            }

            case "echo":
                return {
                    lines: [
                        [
                            plain(
                                args
                                    .join(" ")
                                    .replace(/"/g, "")
                                    .replace(/'/g, "")
                                    .replace(/\$USER/g, USER)
                                    .replace(/\$HOME/g, `/home/${USER}`),
                            ),
                        ],
                    ],
                };

            case "cd": {
                const target = args[0] ?? "~";
                const parts = resolvePathParts(target);
                const node = getNodeAt(parts);
                if (!node) return {lines: [[error(`cd: no such file or directory: ${target}`)]]};
                if (node.type !== "dir") return {lines: [[error(`cd: not a directory: ${target}`)]]};
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
                    return {lines: [[error(`ls: cannot access '${paths[0]}': No such file or directory`)]]};
                }
                if (targetNode.type === "file") {
                    return {lines: [[dirEntry(paths[0] ?? ".", targetNode)]]};
                }

                const entries = Object.entries((targetNode as DirNode).children)
                    .filter(([name]) => all || !name.startsWith("."))
                    .sort(([a], [b]) => a.localeCompare(b));

                if (long) {
                    const lines: Segment[][] = [[dim(`total ${entries.length * 8}`)]];
                    if (all) {
                        lines.push([plain(`drwxr-xr-x  2 ${USER} ${USER}  4096 Jan  1 10:00 `), colored(".", 4, true)]);
                        lines.push([plain(`drwxr-xr-x  2 ${USER} ${USER}  4096 Jan  1 10:00 `), colored("..", 4, true)]);
                    }
                    for (const [name, node] of entries) {
                        const isDir = node.type === "dir";
                        const perms = isDir ? "drwxr-xr-x" : name.endsWith(".sh") ? "-rwxr-xr-x" : "-rw-r--r--";
                        const size = isDir
                            ? " 4096"
                            : String((node as FileNode).content.length).padStart(5);
                        lines.push([
                            plain(`${perms}  1 ${USER} ${USER} ${size} Jan  1 10:00 `),
                            dirEntry(name, node),
                        ]);
                    }
                    return {lines};
                }

                // Short ls: 4 columns
                const cols = 4;
                const colWidth = 20;
                const lines: Segment[][] = [];
                for (let i = 0; i < entries.length; i += cols) {
                    const row: Segment[] = [];
                    const slice = entries.slice(i, i + cols);
                    for (let j = 0; j < slice.length; j++) {
                        const [name, node] = slice[j];
                        row.push(dirEntry(name, node));
                        const pad = colWidth - name.length;
                        if (pad > 0 && j < slice.length - 1) row.push(plain(" ".repeat(pad)));
                    }
                    lines.push(row);
                }
                return {lines};
            }

            case "cat": {
                if (!args[0]) return {lines: [[error("cat: missing operand")]]};
                const parts = resolvePathParts(args[0]);
                const node = getNodeAt(parts);
                if (!node) return {lines: [[error(`cat: ${args[0]}: No such file or directory`)]]};
                if (node.type === "dir") return {lines: [[error(`cat: ${args[0]}: Is a directory`)]]};
                return {lines: (node as FileNode).content.split("\n").map(l => [plain(l)])};
            }

            case "clear":
                return {lines: [], clear: true};

            case "mkdir": {
                if (!args[0]) return {lines: [[error("mkdir: missing operand")]]};
                const cwd = getCwdNode();
                if (cwd.children[args[0]]) {
                    return {lines: [[error(`mkdir: cannot create directory '${args[0]}': File exists`)]]};
                }
                cwd.children[args[0]] = {type: "dir", children: {}};
                return {lines: []};
            }

            case "touch": {
                if (!args[0]) return {lines: [[error("touch: missing file operand")]]};
                const cwd = getCwdNode();
                if (!cwd.children[args[0]]) {
                    cwd.children[args[0]] = {type: "file", content: ""};
                }
                return {lines: []};
            }

            default:
                return {
                    lines: [
                        [
                            error(`${cmd}: command not found`),
                            plain(". Type "),
                            {text: "help", bold: true},
                            plain(" to list available commands."),
                        ],
                    ],
                };
        }
    }

    // ── Input handling ─────────────────────────────────────────────────────────

    let container: HTMLDivElement | undefined = $state();
    let scrollTarget: HTMLDivElement | undefined = $state();

    async function scrollToBottom() {
        await tick();
        if (scrollTarget) scrollTarget.scrollIntoView({block: "end"});
    }

    function handleKeydown(e: KeyboardEvent) {
        // Don't steal regular browser shortcuts
        if (e.metaKey || (e.ctrlKey && !["c", "l"].includes(e.key))) return;

        if (e.key === "ArrowUp") {
            e.preventDefault();
            if (histIdx < cmdHistory.length - 1) {
                histIdx++;
                inputBuffer = cmdHistory[histIdx];
                cursorPos = inputBuffer.length;
            }
        }
        else if (e.key === "ArrowDown") {
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
        }
        else if (e.key === "ArrowLeft") {
            e.preventDefault();
            if (cursorPos > 0) cursorPos--;
        }
        else if (e.key === "ArrowRight") {
            e.preventDefault();
            if (cursorPos < inputBuffer.length) cursorPos++;
        }
        else if (e.key === "Home") {
            e.preventDefault();
            cursorPos = 0;
        }
        else if (e.key === "End") {
            e.preventDefault();
            cursorPos = inputBuffer.length;
        }
        else if (e.key === "Enter") {
            e.preventDefault();
            const snapshotCwd = getCwdString();
            const cmd = inputBuffer;
            if (cmd.trim()) {
                cmdHistory.unshift(cmd);
                if (cmdHistory.length > 100) cmdHistory.pop();
            }
            inputBuffer = "";
            cursorPos = 0;
            histIdx = -1;

            history.push({kind: "cmd", user: USER, host: HOST, cwd: snapshotCwd, cmd});

            const result = exec(cmd);
            if (result.clear) {
                history = [];
            }
            else {
                for (const segments of result.lines) {
                    history.push({kind: "output", segments});
                }
            }
            scrollToBottom();
        }
        else if (e.key === "Backspace") {
            e.preventDefault();
            if (cursorPos > 0) {
                inputBuffer = inputBuffer.slice(0, cursorPos - 1) + inputBuffer.slice(cursorPos);
                cursorPos--;
            }
        }
        else if (e.key === "Delete") {
            e.preventDefault();
            if (cursorPos < inputBuffer.length) {
                inputBuffer = inputBuffer.slice(0, cursorPos) + inputBuffer.slice(cursorPos + 1);
            }
        }
        else if (e.ctrlKey && e.key === "c") {
            e.preventDefault();
            const snapshotCwd = getCwdString();
            history.push({kind: "ctrlc", user: USER, host: HOST, cwd: snapshotCwd, input: inputBuffer});
            inputBuffer = "";
            cursorPos = 0;
            histIdx = -1;
            scrollToBottom();
        }
        else if (e.ctrlKey && e.key === "l") {
            e.preventDefault();
            history = [];
        }
        else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            inputBuffer = inputBuffer.slice(0, cursorPos) + e.key + inputBuffer.slice(cursorPos);
            cursorPos++;
        }
    }

    // ── Derived prompt parts ───────────────────────────────────────────────────

    const currentCwd = $derived(getCwdString());
    const cursorChar = $derived(inputBuffer[cursorPos] ?? " ");
    const beforeCursor = $derived(inputBuffer.slice(0, cursorPos));
    const afterCursor = $derived(inputBuffer.slice(cursorPos + 1));

    function focusTerminal() {
        container?.focus();
    }

    interface Props {
        onCwdChange?: (cwd: string) => void;
    }

    const {onCwdChange}: Props = $props();

    $effect(() => {
        onCwdChange?.(getCwdString());
    });
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
        {#each history as entry (entry)}
            {#if entry.kind === "cmd"}
                <div class="line">
                    <span class="p2 bold">{entry.user}</span><!--
                    --><span class="p6">@</span><!--
                    --><span class="p4 bold">{entry.host}</span><!--
                    --><span class="fg">:</span><!--
                    --><span class="p3">{entry.cwd}</span><!--
                    --><span class="fg bold">$&nbsp;</span><!--
                    --><span class="fg">{entry.cmd}</span>
                </div>
            {:else if entry.kind === "ctrlc"}
                <div class="line">
                    <span class="p2 bold">{entry.user}</span><!--
                    --><span class="p6">@</span><!--
                    --><span class="p4 bold">{entry.host}</span><!--
                    --><span class="fg">:</span><!--
                    --><span class="p3">{entry.cwd}</span><!--
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
                            style:color={seg.palette !== undefined ? `var(--config-palette-${seg.palette})` : undefined}
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

.bold {font-weight: 700;}
.dimmed {opacity: 0.55;}

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

.term:focus .cursor {
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
