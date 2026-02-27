<script lang="ts">
    import Gap from "$lib/components/Gap.svelte";
    import Tab from "$lib/components/Tab.svelte";
    import User from "$lib/components/User.svelte";
    import FloatingTerminal from "$lib/components/FloatingTerminal.svelte";
    import "../app.css";

    import application from "$lib/images/tabs/application.webp";
    import clipboard from "$lib/images/tabs/clipboard.webp";
    import window from "$lib/images/tabs/window.webp";

    import colors from "$lib/images/tabs/colors.webp";
    import fonts from "$lib/images/tabs/fonts.webp";

    import keybinds from "$lib/images/tabs/keybinds.webp";
    import mouse from "$lib/images/tabs/mouse.webp";

    import gtk from "$lib/images/tabs/gtk.svg";
    import linux from "$lib/images/tabs/linux.webp";
    import macos from "$lib/images/tabs/macos.webp";

    import github from "$lib/images/tabs/github.svg";
    import ghostty from "$lib/images/tabs/ghostty.webp";

    import sync from "$lib/images/tabs/sync.webp";
    import calligraphy from "$lib/images/tabs/font-playground.webp";

    import config from "$lib/stores/config.svelte";
    import app from "$lib/stores/state.svelte";

    const cssConfigVars = $derived.by(() => {
        let str = "";

        const add = (key: string, val: string) => str += `--config-${key}: ${val};`;

        // Add the base colors
        add("bg", config.background);
        add("fg", config.foreground);
        add("selection-bg", config.selectionInvertFgBg ? config.foreground : config.selectionBackground || config.foreground);
        add("selection-fg", config.selectionInvertFgBg ? config.background : config.selectionForeground || config.background);

        // Add the palette colors
        const paletteSize = 16; // config.palette.length;
        for (let c = 0; c < paletteSize; c++) add(`palette-${c}`, config.palette[c]);

        // TODO: consider honoring separate fonts for bold/italic and such in previews
        // Add font settings
        add("font-family", config.fontFamily || "monospace");
        add("font-size", `${config.fontSize}px`);

        return str;
    });

    const {children} = $props();




    const htmlTitle = $derived.by(() => {
        const name = app.title === "Ghostty Config" ? "" : app.title;
        let title = "Ghostty Config";
        if (name) title = `${title} - ${name}`;
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
                    <div class="window-dot"><span>×</span></div>
                    <div class="window-dot"><span>-</span></div>
                    <div class="window-dot"><span>+</span></div>
                </div>
            </div>
        </div>
        <nav id="categories">
            <User route="/" />
            <Gap />
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
            </Tab>
            <Gap expand={true} />
            <Tab route="/app/import-export">
                {#snippet icon()}<img src={sync} alt="Settings Sync" />{/snippet}
                Import & Export
            </Tab>
            <Tab route="/app/font-playground">
                {#snippet icon()}<img src={calligraphy} alt="Font Playground" />{/snippet}
                Font Playground
            </Tab>
            <button
                type="button"
                class="nav-tab-btn"
                class:active={app.floatingTerminalOpen}
                onclick={() => {app.floatingTerminalOpen = !app.floatingTerminalOpen;}}
                aria-label="Toggle live preview terminal"
                aria-pressed={app.floatingTerminalOpen}
            >
                <div class="tab-icon">
                    <div class="icon-wrapper terminal">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M20 3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H4V5h16v14zM6 15h5v2H6zm6.5-7.5 1.41-1.41L18 10.17l-4.09 4.08-1.41-1.41 2.67-2.67zM6 11.17l1.41-1.41 2.12 2.12-2.12 2.12L6 12.59z" /></svg>
                    </div>
                </div>
                <div class="tab-label">Live Preview</div>
            </button>
            <Gap expand={true} />
            <Tab route="https://github.com/zerebos/ghostty-config">
                {#snippet icon()}<div class="icon-wrapper github"><img src={github} alt="Ghostty Config GitHub" /></div>{/snippet}
                GitHub
            </Tab>
            <Tab route="https://github.com/ghostty-org">
                {#snippet icon()}<img src={ghostty} alt="Ghostty GitHub" />{/snippet}
                Ghostty
            </Tab>
        </nav>
    </div>
    <div id="content-view">
        {@render children()}
    </div>
    <FloatingTerminal />
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



#categories {
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 10px;
}

#categories img {
    width: 100%;
}

#categories .icon-wrapper {
    background: linear-gradient(#D3E3E9, #908F8C);
    width: 20px;
    height: 20px;
    border-radius: var(--radius-level-4);
    display: inline-flex;
    justify-content: center;
    align-items: center;
}

#categories .icon-wrapper img {
    height: 14px;
    width: 14px;
}

#categories .icon-wrapper.github {
    background: linear-gradient(#9C45A9, #3B1E68);
}

#categories .icon-wrapper.github img {
    filter: invert(100%);
    height: 18px;
    width: 18px;
}

#categories .icon-wrapper.terminal {
    background: linear-gradient(#2D9F6B, #1A5C3E);
    color: #e8eaed;
}

.nav-tab-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    padding: 6px;
    border-radius: var(--radius-level-4);
    font-weight: 600;
    background: transparent;
    border: none;
    cursor: pointer;
    width: 100%;
    color: var(--font-color);
    font-size: 1rem;
    font-family: inherit;
    text-align: left;
}

.nav-tab-btn.active {
    background: var(--color-selected);
}

.nav-tab-btn:hover {
    background: rgba(255, 255, 255, 0.07);
}

.nav-tab-btn.active:hover {
    background: var(--color-selected);
}

.nav-tab-btn .tab-icon {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
}

.nav-tab-btn .tab-label {
    flex: 1;
    text-align: left;
}
</style>
