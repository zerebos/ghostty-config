<script lang="ts">
    import type {ExecContext, Line, HistoryEntry, PromptSnapshot, DirNode} from "$lib/terminal/types";
    import {cwdString, makeFilesystem} from "$lib/terminal/filesystem";
    import {s} from "$lib/terminal/utils";
    import {tick} from "svelte";
    import commands from "$lib/terminal/commands";
    import {getCompletion} from "$lib/terminal/completion";
    import {execChain} from "$lib/terminal/exec";


    const USER = "ghostty";
    const HOST = "config-app";

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
                s.p("help <cmd>", 10, true), s.plain(" for command details."),
            ]
        },
        {kind: "output", id: outputIdCounter++, segments: [s.plain("\n")]},
    ]);

    const ctx: ExecContext = {
        cwd: () => cwdParts,
        setCwd: (p) => {cwdParts = p;},
        root,
        commands,
        user: USER,
        host: HOST,
    };

    // ── Rendering helpers ──────────────────────────────────────────────────────

    let container: HTMLDivElement | undefined = $state();

    async function scrollToBottom() {
        await tick();
        if (!container) return;
        container.scrollTop = container.scrollHeight;
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
                const completed = getCompletion(inputBuffer, ctx);
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

                history.push({id: outputIdCounter++, kind: "cmd", prompt: snap, cmd});

                const result = execChain(cmd, ctx);
                if (result.clear) {
                    history = [];
                }
                else {
                    pushOutput(result.lines);
                    // pushOutput([[{text: "\n"}]]);
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
                history.push({id: outputIdCounter++, kind: "ctrlc", prompt: snapshot(), input: inputBuffer});
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


    const currentCwd = $derived(cwdString(cwdParts));
    const cursorChar = $derived(inputBuffer[cursorPos] ?? " ");
    const beforeCursor = $derived(inputBuffer.slice(0, cursorPos));
    const afterCursor = $derived(inputBuffer.slice(cursorPos + 1));

    function focusTerminal() {container?.focus();}

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
        {#each history as entry (entry.id)}
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
                    {#each entry.segments as seg, i (i)}
                        <span
                            class:bold={seg.bold}
                            class:dimmed={seg.dim}
                            class:italic={seg.italic}
                            class:underline={seg.underline}
                            class:inverse={seg.inverse}
                            class:clickable={seg.clickable}
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
    /* line-height: 1.4; */
    flex-wrap: nowrap;
    padding: 1px 0;
}

.input-line {
    min-height: 1.4em;
}

.bold   {font-weight: 700;}
.dimmed {opacity: 0.55;}
.italic {font-style: italic;}
.underline {text-decoration: underline;}
.inverse {background: var(--config-fg); color: var(--config-bg);}
.clickable {text-decoration: underline; cursor: pointer;}

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