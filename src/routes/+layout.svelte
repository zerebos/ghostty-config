<script lang="ts">
    // import {dev} from "$app/environment";
    import {type Snippet} from "svelte";

    import "../app.css";

    import Gap from "$lib/components/Gap.svelte";
    import Tab from "$lib/components/Tab.svelte";
    import User from "$lib/components/User.svelte";
    import ModalStack from "$lib/components/modals/ModalStack.svelte";
    import ToastStack from "$lib/components/ToastStack.svelte";
    import SettingsSearch from "$lib/components/SettingsSearch.svelte";
    import MacDock from "$lib/components/MacDock.svelte";

    import github from "$lib/images/tabs/github.svg";
    import ghostty from "$lib/images/tabs/ghostty.webp";

    import sync from "$lib/images/tabs/sync.webp";
    import calligraphy from "$lib/images/tabs/font-playground.webp";

    import config from "$lib/stores/config.svelte";
    import {numberCodec} from "$lib/settings/codecs";
    import {effectiveColors} from "$lib/stores/theme.svelte";
    import {resolveCellColor} from "$lib/utils/colors";
    import app from "$lib/stores/state.svelte";
    import navigation, {tabGroups} from "$lib/settings/navigation";
    import {restorePersistedSession, startPersisting} from "$lib/stores/persistence.svelte";


    // Session refresh-protection. Run synchronously during layout init (the root component)
    // so restore completes before any page's onMount fires — in particular before the
    // import-export page's checkHashForShare() builds a share-import preview, keeping that
    // modal's "will overwrite your changes" framing truthful against the restored state.
    // No-op on the server (prerender); config's sync initializers have already run by import.
    restorePersistedSession();
    startPersisting();


    // The single funnel for the color keys: everything below reads the *effective* colors
    // (override > theme > default, see stores/theme.svelte.ts) and every other surface reads
    // the resulting --config-* CSS vars, inheriting the layered colors for free.
    const cssConfigVars = $derived.by(() => {
        let str = "";

        const add = (key: string, val: string) => str += `--config-${key}: ${val};`;

        // Add the base colors. Cursor/selection colors may hold `cell-foreground`/`cell-background`
        // keywords, so resolve those against fg/bg before emitting them as CSS colors.
        const colors = effectiveColors();
        const fg = colors.foreground;
        const bg = colors.background;
        add("bg", bg);
        add("fg", fg);
        add("selection-bg", resolveCellColor(colors.selectionBackground, fg, bg) || fg);
        add("selection-fg", resolveCellColor(colors.selectionForeground, fg, bg) || bg);
        add("cursor-color", resolveCellColor(colors.cursorColor, fg, bg) || fg);
        add("cursor-text", resolveCellColor(colors.cursorText, fg, bg) || bg);
        // Coerced here so downstream CSS (color-mix in CursorPreview) always gets a number.
        add("cursor-opacity", String(numberCodec.parse(config.cursorOpacity) ?? 1));

        // Add the palette colors
        const paletteSize = 16; // colors.palette.length;
        for (let c = 0; c < paletteSize; c++) add(`palette-${c}`, colors.palette[c]);

        // TODO: consider honoring separate fonts for bold/italic and such in previews
        // Add font settings
        add("font-family", config.fontFamily.filter(Boolean).map(f => JSON.stringify(f)).join(", ") || JSON.stringify("JetBrainsMono Nerd Font"));
        add("font-size", `${config.fontSize}px`);

        return str;
    });

    const {children}: {children: Snippet} = $props();



    const htmlTitle = $derived.by(() => {
        const name = app.title === "Ghostty Config" ? "" : app.title;
        let title = "Ghostty Config";
        if (name) title = `${name} - ${title}`;
        return title;
    });
</script>

<svelte:head>
    <title>{htmlTitle}</title>
</svelte:head>

<!-- eslint-disable-next-line svelte/require-optimized-style-attribute -->
<div class="app-window" style={cssConfigVars}>
    <div id="sidebar">
        <div class="sidebar-header">
            <div class="window-actions-container">
                <div class="window-actions">
                    <div class="window-dot"><span>&times;</span></div>
                    <div class="window-dot"><span>&ndash;</span></div>
                    <div class="window-dot"><span>&plus;</span></div>
                </div>
            </div>
        </div>
        <SettingsSearch>
            <User route="/" />
            <!-- <Gap />
            <Tab route="/settings/application">
                {#snippet icon()}<img src={application} alt="Application Settings" />{/snippet}
                Application
            </Tab>
            <Tab route="/settings/clipboard">
                {#snippet icon()}<img src={clipboard} alt="Clipboard Settings" />{/snippet}
                Clipboard
            </Tab>
            <Tab route="/settings/window">
                {#snippet icon()}<img src={window} alt="Window Settings" />{/snippet}
                Window
            </Tab>
            <Gap />
            <Tab route="/settings/colors">
                {#snippet icon()}<img src={colors} alt="Color Settings" />{/snippet}
                Colors
            </Tab>
            <Tab route="/settings/fonts">
                {#snippet icon()}<img src={fonts} alt="Font Settings" />{/snippet}
                Fonts
            </Tab>
            <Gap />
            <Tab route="/settings/keybinds">
                {#snippet icon()}<img src={keybinds} alt="Keybind Settings" />{/snippet}
                Keybinds
            </Tab>
            <Tab route="/settings/mouse">
                {#snippet icon()}<img src={mouse} alt="Mouse Settings" />{/snippet}
                Mouse
            </Tab>
            <Gap />
            <Tab route="/settings/gtk">
                {#snippet icon()}<div class="icon-wrapper"><img src={gtk} alt="GTK Settings" /></div>{/snippet}
                GTK
            </Tab>
            <Tab route="/settings/linux">
                {#snippet icon()}<img src={linux} alt="Linux Settings" />{/snippet}
                Linux
            </Tab>
            <Tab route="/settings/macos">
                {#snippet icon()}<img src={macos} alt="MacOS Settings" />{/snippet}
                macOS
            </Tab> -->
            {#each tabGroups as group, i (i)}
                <Gap />
                {#each group as panelId (panelId)}
                    {@const panel = navigation.find(p => p.id === panelId)}
                    {#if panel}
                        <Tab route={`/settings/${panel.id}`}>
                            {#snippet icon()}
                                <!-- FIXME: this is a hack -->
                                {#if panel.icon.includes("svg+xml") || panel.icon.endsWith(".svg")}
                                    <div class="icon-wrapper">
                                        <img src={panel.icon} alt={`${panel.name} Settings`} />
                                    </div>
                                {:else}
                                    <img src={panel.icon} alt={`${panel.name} Settings`} />
                                {/if}
                            {/snippet}
                            {panel.name}
                        </Tab>
                    {/if}
                {/each}
            {/each}
            <Gap expand={true} />
            <Tab route="/app/import-export">
                {#snippet icon()}<img src={sync} alt="Settings Sync" />{/snippet}
                Import & Export
            </Tab>
            <Tab route="/app/font-playground">
                {#snippet icon()}<img src={calligraphy} alt="Font Playground" />{/snippet}
                Font Playground
            </Tab>
            <!-- {#if dev}
            <Tab route="/app/dropdown-debug">
                {#snippet icon()}<img src={ghostty} alt="Dropdown Debug" />{/snippet}
                Dropdown Debug
            </Tab>
            {/if} -->
            <Gap expand={true} />
            <Tab route="https://github.com/zerebos/ghostty-config">
                {#snippet icon()}<div class="icon-wrapper github"><img src={github} alt="Ghostty Config GitHub" /></div>{/snippet}
                GitHub
            </Tab>
            <Tab route="https://ghostty.org/">
                {#snippet icon()}<img src={ghostty} alt="Ghostty Website" />{/snippet}
                Ghostty
            </Tab>
        </SettingsSearch>
    </div>
    <div id="content-view">
        {@render children()}
    </div>
    <MacDock />
    <ModalStack />
    <ToastStack />
</div>

<!-- <svelte:window onmouseup={onMouseUp} onmousemove={onMouseMove} /> -->

<style>
.app-window {
    user-select: none;
    /* cursor: move; */
    display: flex;
    position: relative;
    flex-direction: row;
    height: 100%;
    /* margin: 20px auto; */
    width: 90%;
    max-width: var(--app-width);
    height: var(--app-height);
    border: 1px solid var(--border-level-1);
    /* box-shadow: 0 0 1px white inset; */
    box-shadow: 0 0 20px -1px rgba(0,0,0,0.7);
    border-radius: var(--radius-level-1);
    overflow: hidden;
}

/* .app-window .draggable {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 50px;
    cursor: move;
    z-index: 10;
} */

/* TODO: try this without pseudoelement using outline */
.app-window::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    box-shadow: 0 0 1px white inset;
    border-radius: inherit;
    z-index: 2;
    pointer-events: none;
}

#sidebar {
    width: var(--sidebar-width);
    /* black: #272329; white: #544F57; */
    background: rgba(50, 46, 52, 0.7);
    backdrop-filter: blur(10px);
    padding: 5px;
    border-right: 2px solid var(--border-level-1);
    display: flex;
    flex-direction: column;
}

.sidebar-header {
    display: flex;
    flex-direction: column;
}

.sidebar-header .window-actions-container {
    display: flex;
    padding: 15px 0 0 15px;
    margin-bottom: 20px;
}

.sidebar-header .window-actions {
    display: flex;
    gap: 8px;
}

.app-window .window-dot {
    border-radius: 50%;
    /* display: inline-block; */
    height: 12px;
    /* margin-right: 6px; */
    /* margin-top: 4px; */
    width: 12px;
    border: 0;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    color: rgba(0, 0, 0, 0);
}

.window-dot span {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    margin-top: -3px;
    margin-right: -1px;
}

.app-window .window-actions:hover .window-dot {
    /* background: white!important; */
    /* cursor: pointer; */
    color: rgba(0, 0, 0, 0.5);
}

.window-dot {
    background-color: var(--color-warning);
}

.window-dot:first-of-type {
    background-color: var(--color-danger);
}

.window-dot:last-of-type {
    background-color: var(--color-success);
}

#content-view {
    background: var(--bg-level-1);
    flex: 1;
    display: flex;
    min-width: 0;
}



/* #categories {
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 10px;
} */

:global(#categories img) {
    width: 100%;
}

:global(#categories .icon-wrapper) {
    background: linear-gradient(#D3E3E9, #908F8C);
    width: 20px;
    height: 20px;
    border-radius: var(--radius-level-4);
    display: inline-flex;
    justify-content: center;
    align-items: center;
}

:global(#categories .icon-wrapper img) {
    height: 14px;
    width: 14px;
}

:global(#categories .icon-wrapper.github) {
    background: linear-gradient(#9C45A9, #3B1E68);
}

:global(#categories .icon-wrapper.github img) {
    filter: invert(100%);
    height: 18px;
    width: 18px;
}

:global(#categories .icon-wrapper.terminal) {
    background: linear-gradient(#2D9F6B, #1A5C3E);
    color: #e8eaed;
}
</style>
