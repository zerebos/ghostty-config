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
        term.writeln("\x1b[1;32mjohn\x1b[0m\x1b[36m@\x1b[0m\x1b[1;34mdoe-pc\x1b[0m:\x1b[33m~\x1b[0m\x1b[1m$\x1b[0m ls -la");
        term.writeln("\x1b[2mtotal 56\x1b[0m");
        term.writeln("drwxr-xr-x  2 john john 4096 Jan  1 10:00 \x1b[1;34mDesktop\x1b[0m");
        term.writeln("drwxr-xr-x  3 john john 4096 Jan  1 12:00 \x1b[1;34mDocuments\x1b[0m");
        term.writeln("drwxr-xr-x  4 john john 4096 Jan  1 11:59 \x1b[1;34mDownloads\x1b[0m");
        term.writeln("-rw-r--r--  1 john john  220 Jan  1 10:00 \x1b[32m.bash_profile\x1b[0m");
        term.writeln("-rwxr-xr-x  1 john john  512 Jan  1 09:30 \x1b[32minstall.sh\x1b[0m");
        term.writeln("drwxr-xr-x  2 john john 4096 Jan  1 08:00 \x1b[1;34mPictures\x1b[0m");
        term.writeln("-rw-r--r--  1 john john  980 Jan  1 12:00 \x1b[31mREADME.md\x1b[0m");
        term.writeln("lrwxrwxrwx  1 john john    6 Jan  1 07:00 \x1b[36msymlink\x1b[0m -> \x1b[33mtarget\x1b[0m");
        term.writeln("\x1b[1;32mjohn\x1b[0m\x1b[36m@\x1b[0m\x1b[1;34mdoe-pc\x1b[0m:\x1b[33m~\x1b[0m\x1b[1m$\x1b[0m echo \"Hello, Ghostty! 👻\"");
        term.writeln("Hello, Ghostty! 👻");
        term.writeln("\x1b[1;32mjohn\x1b[0m\x1b[36m@\x1b[0m\x1b[1;34mdoe-pc\x1b[0m:\x1b[33m~\x1b[0m\x1b[1m$\x1b[0m git status");
        term.writeln("\x1b[1mOn branch \x1b[33mmain\x1b[0m");
        term.writeln("Changes not staged for commit:");
        term.writeln("  \x1b[31mmodified:   config\x1b[0m");
        term.writeln("  \x1b[32mnew file:   preview.ts\x1b[0m");
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
            fontSize: config.fontSize || 14,
            fontFamily: config.fontFamily || "monospace",
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
    border-radius: var(--radius-level-3);
}
</style>
