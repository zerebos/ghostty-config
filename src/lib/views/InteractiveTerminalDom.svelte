<script lang="ts">
    import type {ExecContext, Line, ExecResult, HistoryEntry, PromptSnapshot, DirNode} from "$lib/terminal";
    import {cwdString, getNode, makeFilesystem, resolveParts} from "$lib/terminal/filesystem";
    import {s, err} from "$lib/terminal/utils";
    import {tick} from "svelte";
    import commands from "$lib/terminal/commands";


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