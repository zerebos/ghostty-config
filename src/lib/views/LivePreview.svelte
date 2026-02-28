<script lang="ts">
    import {onMount} from "svelte";
    import {init, Terminal, FitAddon} from "ghostty-web";
    import Group from "$lib/components/settings/Group.svelte";
    import config from "$lib/stores/config.svelte";

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

    function writeDemo() {
        if (!term) return;
        term.reset();
        term.writeln("\x1b[1;32mjohn\x1b[0m\x1b[36m@\x1b[0m\x1b[1;34mdoe-pc\x1b[0m:\x1b[33m~\x1b[0m\x1b[1m$\x1b[0m eza -la --color=always --icons");
        term.writeln("\x1b[4mPermissions\x1b[0m \x1b[4mSize\x1b[0m \x1b[4mUser\x1b[0m \x1b[4mDate Modified\x1b[0m \x1b[4mName\x1b[0m");
        term.writeln("\x1b[1;34md\x1b[33mr\x1b[31mw\x1b[32mx\x1b[90m------\x1b[0m     \x1b[1;90m-\x1b[0m \x1b[1;33mzack\x1b[0m \x1b[34m22 Feb 10:56\x1b[0m  \x1b[34m\uF115 \x1b[1m.cache\x1b[0m");
        term.writeln("\x1b[1;34md\x1b[33mr\x1b[31mw\x1b[32mx\x1b[90m------\x1b[0m     \x1b[1;90m-\x1b[0m \x1b[1;33mzack\x1b[0m \x1b[34m22 Feb 10:56\x1b[0m  \x1b[34m\uE5FC \x1b[1m.config\x1b[0m");
        term.writeln(".\x1b[1;33mr\x1b[31mw\x1b[90m-\x1b[0m\x1b[33mr\x1b[1;90m--\x1b[0m\x1b[33mr\x1b[1;90m--\x1b[0m     \x1b[32m0\x1b[0m \x1b[1;33mzack\x1b[0m \x1b[34m22 Feb 10:57\x1b[0m  \x1b[32m\uF15B \x1b[1m.hushlogin\x1b[0m");
        term.writeln(".\x1b[1;33mr\x1b[31mw\x1b[90m-\x1b[0m\x1b[33mr\x1b[1;90m--\x1b[0m\x1b[33mr\x1b[1;90m--\x1b[0m     \x1b[32m0\x1b[0m \x1b[1;33mzack\x1b[0m \x1b[34m22 Feb 10:57\x1b[0m  \x1b[32m\uE7C5 \x1b[1m.viminfo\x1b[0m");
        term.writeln("\x1b[1;36ml\x1b[33mr\x1b[31mw\x1b[32mx\x1b[0m\x1b[33mr\x1b[31mw\x1b[32mx\x1b[33mr\x1b[31mw\x1b[32mx\x1b[0m     \x1b[1;90m-\x1b[0m \x1b[1;33mzack\x1b[0m \x1b[34m22 Feb 10:57\x1b[0m  \x1b[36m\uE5FC \x1b[1metc\x1b[0m \x1b[1;90m->\x1b[0m \x1b[36m/\x1b[1;34metc\x1b[0m");
        term.writeln(".\x1b[1;33mr\x1b[31mw\x1b[4;32mx\x1b[0m\x1b[33mr\x1b[1;90m-\x1b[0m\x1b[32mx\x1b[33mr\x1b[1;90m-\x1b[0m\x1b[32mx\x1b[0m     \x1b[32m0\x1b[0m \x1b[1;33mzack\x1b[0m \x1b[34m22 Feb 10:57\x1b[0m  \x1b[32m\u{F086F} \x1b[1mlsix\x1b[0m");
        term.writeln("");
        term.writeln("\x1b[1;32mjohn\x1b[0m\x1b[36m@\x1b[0m\x1b[1;34mdoe-pc\x1b[0m:\x1b[33m~\x1b[0m\x1b[1m$\x1b[0m echo \"Hello, Ghostty! 👻\"");
        term.writeln("Hello, Ghostty! 👻");
        term.writeln("");
        term.writeln("\x1b[1;32mjohn\x1b[0m\x1b[36m@\x1b[0m\x1b[1;34mdoe-pc\x1b[0m:\x1b[33m~/dev/project\x1b[0m\x1b[1m$\x1b[0m git status");
        term.writeln("\x1b[1mOn branch \x1b[33mmain\x1b[0m");
        term.writeln("Changes not staged for commit:");
        term.writeln("  \x1b[31mmodified:   config\x1b[0m");
        term.writeln("  \x1b[32mnew file:   preview.ts\x1b[0m");
        term.writeln("");
        term.write("\x1b[1;32mjohn\x1b[0m\x1b[36m@\x1b[0m\x1b[1;34mdoe-pc\x1b[0m:\x1b[33m~\x1b[0m\x1b[1m$\x1b[0m ");
    }

    function recreateTerminal() {
        if (!container) return;

        if (term) {
            term.dispose();
            term = undefined;
            fitAddon = undefined;
            while (container.firstChild) container.removeChild(container.firstChild);
        }

        term = new Terminal({
            fontSize: config.fontSize || 13,
            fontFamily: config.fontFamily || "JetBrainsMono NF, monospace",
            theme: getTheme(),
            convertEol: true,
            scrollback: 100,
            cursorBlink: config.cursorStyleBlink !== "false" && config.cursorStyleBlink !== false,
            cursorStyle: (config.cursorStyle as "block" | "underline" | "bar") || "block",
        });

        fitAddon = new FitAddon();
        term.loadAddon(fitAddon);
        term.open(container);
        fitAddon.fit();
        fitAddon.observeResize();

        writeDemo();
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
        // Track all relevant config values to trigger reactivity
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

<Group note="A live terminal preview powered by ghostty-web — Ghostty's own WASM-compiled VT100 parser running directly in your browser. The preview updates automatically as you change your configuration.">
    <div class="terminal-wrapper" bind:this={container}></div>
</Group>

<style>
.terminal-wrapper {
    width: 100%;
    height: 400px;
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
</style>
