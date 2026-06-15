<script lang="ts">
    import {onMount} from "svelte";
    import {init, Terminal, FitAddon} from "ghostty-web";
    import Group from "$lib/components/settings/Group.svelte";
    import config from "$lib/stores/config.svelte";
    import {cwdString, makeFilesystem} from "$lib/terminal/filesystem";
    import commands from "$lib/terminal/commands";
    import type {ExecContext} from "$lib/terminal/types";
    import {execChain} from "$lib/terminal/exec";
    import {encodeSegment, renderLine} from "$lib/terminal/ansi";
    import {seg} from "$lib/terminal/utils";

    const {standalone = false}: {standalone?: boolean} = $props();

    const USER = "john";
    const HOST = "ghostty-pc";

    let root = makeFilesystem();
    let cwdParts: string[] = [];
    let cmdHistory: string[] = [];
    let histIdx = -1;
    let inputBuffer = "";
    let cursorPos = 0;


    // ── ANSI helpers ───────────────────────────────────────────────────────────

    // function promptStr(): string {
    //     return (
    //         style.bold.fg(2)(USER) +
    //         style.fg(6)("@") +
    //         style.bold.fg(4)(HOST) +
    //         ":" +
    //         style.fg(3)(cwdString(cwdParts)) +
    //         style.bold("$") +
    //         " "
    //     );
    // }

    // function promptStr(): string {
    //     return renderLine([
    //         s.p(USER, 2, true),
    //         s.p("@", 6),
    //         s.p(HOST, 4, true),
    //         s.plain(":"),
    //         s.p(cwdString(cwdParts), 3, false),
    //         s.bold("$"),
    //         s.plain(" "),
    //     ]);
    // }

    function promptStr(): string {
        return renderLine([
            seg.fg(2).bold(USER),
            seg.fg(6)("@"),
            seg.fg(4).bold(HOST),
            seg(":"),
            seg.fg(3)(cwdString(cwdParts)),
            seg.bold("$"),
            seg(" "),
        ]);
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

    const ctx: ExecContext = {
        cwd: () => cwdParts,
        setCwd: (p) => {cwdParts = p;},
        root,
        commands,
        user: USER,
        host: HOST,
    };

    /**
     * Rewrite input from the current cursor position to the end of the buffer,
     * erase any leftover characters, then move the visual cursor back to cursorPos.
     * Called after inserting or deleting a character in the middle of the line.
     */
    function redrawFromCursor() {
        if (!term) return;
        const suffix = inputBuffer.slice(cursorPos);
        term.write(suffix + "\x1b[K"); // write suffix and erase to EOL
        if (suffix.length > 0) {
            term.write(`\x1b[${suffix.length}D`); // move cursor back to cursorPos
        }
    }

    /**
     * Replace the entire displayed input with newBuffer, placing the cursor at the end.
     * Used for history navigation and Ctrl+C clearing.
     */
    function replaceInput(newBuffer: string) {
        if (!term) return;
        if (cursorPos > 0) {
            term.write(`\x1b[${cursorPos}D`); // move to start of input
        }
        term.write("\x1b[K"); // erase to end of line
        inputBuffer = newBuffer;
        cursorPos = newBuffer.length;
        if (newBuffer.length > 0) {
            term.write(newBuffer);
        }
    }

    function handleData(data: string) {
        if (!term) return;

        // Handle escape sequences (arrow keys, etc.) as complete strings.
        // VT sequences: \x1b[A = up, \x1b[B = down, \x1b[C = right, \x1b[D = left.
        if (data === "\x1b[A") {
            // Arrow up – older history entry
            if (histIdx < cmdHistory.length - 1) {
                histIdx++;
                replaceInput(cmdHistory[histIdx]);
            }
            return;
        }
        if (data === "\x1b[B") {
            // Arrow down – newer history entry (or empty line)
            if (histIdx > 0) {
                histIdx--;
                replaceInput(cmdHistory[histIdx]);
            }
            else if (histIdx === 0) {
                histIdx = -1;
                replaceInput("");
            }
            return;
        }
        if (data === "\x1b[C") {
            // Arrow right – move cursor forward one character
            if (cursorPos < inputBuffer.length) {
                cursorPos++;
                term.write("\x1b[C");
            }
            return;
        }
        if (data === "\x1b[D") {
            // Arrow left – move cursor back one character
            if (cursorPos > 0) {
                cursorPos--;
                term.write("\x1b[D");
            }
            return;
        }
        if (data.startsWith("\x1b")) return; // ignore other escape sequences

        // Process remaining input character by character
        for (const char of data) {
            const code = char.charCodeAt(0);
            if (char === "\r" || char === "\n") {
                // Move visual cursor to end of line before executing
                if (cursorPos < inputBuffer.length) {
                    term.write(`\x1b[${inputBuffer.length - cursorPos}C`);
                }
                term.writeln("");
                const cmd = inputBuffer;
                inputBuffer = "";
                cursorPos = 0;
                histIdx = -1;
                if (cmd.trim()) {
                    cmdHistory.unshift(cmd);
                    if (cmdHistory.length > 100) cmdHistory.pop();
                }
                const result = execChain(cmd, ctx);
                if (result.clear) {
                    term.clear();
                }
                else {
                    for (const line of result.lines) term.writeln(renderLine(line));
                    if (result.lines.length > 0) term.writeln("");
                }
                writePrompt();
            }
            else if (code === 127) {
                // Backspace – delete character before cursor
                if (cursorPos > 0) {
                    inputBuffer = inputBuffer.slice(0, cursorPos - 1) + inputBuffer.slice(cursorPos);
                    cursorPos--;
                    term.write("\b");
                    redrawFromCursor();
                }
            }
            else if (code === 3) {
                // Ctrl+C
                term.writeln("^C");
                inputBuffer = "";
                cursorPos = 0;
                histIdx = -1;
                writePrompt();
            }
            else if (code >= 32) {
                // Insert printable character at cursor position
                inputBuffer = inputBuffer.slice(0, cursorPos) + char + inputBuffer.slice(cursorPos);
                cursorPos++;
                term.write(char);
                redrawFromCursor();
            }
        }
    }

    async function recreateTerminal() {
        if (!container) return;

        // console.log("Recreating terminal with new config...");

        if (term) {
            term.renderer?.clear();
            term.clear();
            term.reset();
            term.dispose();
            fitAddon?.dispose();
            term = undefined;
            fitAddon = undefined;
            // while (container.firstChild) container.removeChild(container.firstChild);
            container.innerHTML = "";
            await new Promise(resolve => setTimeout(resolve, 50)); // Wait a tick to ensure old terminal is fully cleaned up
        }

        // Reset shell state
        root = makeFilesystem();
        cwdParts = [];
        inputBuffer = "";
        cursorPos = 0;
        histIdx = -1;
        cmdHistory = [];

        term = new Terminal({
            fontSize: config.fontSize || 13,
            fontFamily: config.fontFamily || "JetBrainsMono NF, monospace",
            theme: getTheme(),
            convertEol: true,
            scrollback: 1000,
            cursorBlink: config.cursorStyleBlink !== "false",
            cursorStyle: (config.cursorStyle as "block" | "underline" | "bar") || "block",
        });

        fitAddon = new FitAddon();
        term.loadAddon(fitAddon);
        term.open(container);
        fitAddon.fit();
        fitAddon.observeResize();

        term.onData(handleData);

        term.writeln(encodeSegment({text: "Welcome to the interactive terminal preview!", bold: true}));
        term.writeln(`Type ${encodeSegment({text: "help", palette: 2, bold: true})} to see available commands.\r\n`);
        writePrompt();
    }

    onMount(() => {
        void init().then(() => {
            initialized = true;
        });

        return () => {
            term?.dispose();
        };
    });

    // let onlyCreateOnce = false;
    $effect(() => {
        if (!initialized || !container) return;
        // Track config values to trigger reactivity on changes
        // const _configDependencies = [
        //     config.background,
        //     config.foreground,
        //     config.fontFamily,
        //     config.fontSize,
        //     config.cursorColor,
        //     config.cursorStyle,
        //     config.cursorStyleBlink,
        //     config.selectionBackground,
        //     config.selectionForeground,
        //     ...config.palette.slice(0, 16),
        // ];
        // term?.clear();
        // if (!onlyCreateOnce) {
            void recreateTerminal();
            // onlyCreateOnce = true;
        // }
        // term?.renderer?.setTheme(getTheme());
    });

    $effect(() => {
        // if (!initialized || !container) return;
        // term?.renderer?.setTheme(getTheme());
        // term?.resize(term.cols, term.rows); // Trigger re-render to apply new theme colors
        // term?.selectAll(); // Fix cursor color not updating sometimes by forcing a full re-render of the viewport
        // term?.clearSelection();
        // term?.scrollToBottom();
        // term?.blur();
        // term?.focus();
        // term?.blur();
        // fitAddon?.fit();
    });
</script>

{#if standalone}
    <div class="terminal-wrapper standalone" bind:this={container}></div>
{:else}
    <Group title="Interactive Terminal" note="Try it out! Type commands to interact with a simulated shell. Supported: ls, cd, pwd, cat, echo, clear, whoami, hostname, date, uname, mkdir, touch, help">
        <div class="terminal-wrapper" bind:this={container}></div>
    </Group>
{/if}

<style>
.terminal-wrapper {
    width: 100%;
    height: 360px;
    overflow: hidden;
    background: var(--config-bg);
    font-family: var(--config-font-family);
    font-size: var(--config-font-size);
    color: var(--config-fg);
    padding: 8px 0;
    border-radius: var(--radius-level-3);
    border: 1px solid rgba(0, 0, 0, 0.5);
    box-shadow: 0 0 1px rgba(255, 255, 255, 0.5) inset;
    display: flex;
    justify-content: center;
    align-items: center;
}

.terminal-wrapper.standalone {
    height: 100%;
    border-radius: 0;
    border: 0;
    box-shadow: none;
}
</style>
