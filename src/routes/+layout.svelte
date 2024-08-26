<script lang="ts">
    import Gap from "$lib/components/Gap.svelte";
    import Tab from "$lib/components/Tab.svelte";
    import User from "$lib/components/User.svelte";
    import "../app.css";

    import application from "$lib/images/tabs/application.png";
    import clipboard from "$lib/images/tabs/clipboard.png";
    import window from "$lib/images/tabs/window.png";

    import colors from "$lib/images/tabs/colors.png";
    import fonts from "$lib/images/tabs/fonts.png";

    import keybinds from "$lib/images/tabs/keybinds.png";
    import mouse from "$lib/images/tabs/mouse.png";

    import gtk from "$lib/images/tabs/gtk.svg";
    import linux from "$lib/images/tabs/linux.png";
    import macos from "$lib/images/tabs/macos.png";

    import github from "$lib/images/tabs/github.svg";
    import ghostty from "$lib/images/tabs/ghostty.png";

    import config from "$lib/stores/config.svelte";

    const cssConfigVars = $derived.by(() => {
        let str = "";

        const add = (key: string, val: string) => str += `--config-${key}: ${val};`;

        // Add the base colors
        add("bg", config.background);
        add("fg", config.foreground);
        add("selection-bg", config.selectionInvertFgBg ? config.foreground : config.selectionBackground || config.foreground);
        add("selection-fg", config.selectionInvertFgBg ? config.background : config.selectionForeground || config.background);

        // Add the palette colors
        const paletteSize = config.palette.length;
        for (let c = 0; c < paletteSize; c++) add(`palette-${c}`, config.palette[c]);

        // TODO: consider honoring separate fonts for bold/italic and such in previews
        // Add font settings
        add("font-family", config.fontFamily || "monospace");
        add("font-size", `${config.fontSize}px`);

        return str;
    });

    const {children} = $props();
</script>

<!-- eslint-disable-next-line svelte/require-optimized-style-attribute -->
<div class="app-window" style={cssConfigVars}>
    <div id="sidebar">
        <div class="sidebar-header">
            <div class="window-actions-container">
                <div class="window-actions">
                    <button class="window-dot" type="button"><span>×</span></button>
                    <button class="window-dot" type="button"><span>-</span></button>
                    <button class="window-dot" type="button"><span>+</span></button>
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
    max-width: 715px;
    height: 700px;
    border: 1px solid black;
    /* box-shadow: 0 0 1px white inset; */
    box-shadow: 0 0 20px -1px rgba(0,0,0,0.7);
    border-radius: 15px;
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
    width: 215px;
    /* black: #272329; white: #544F57; */
    /* background: #272329; */
    /* background: rgba(62, 57, 64, 0.6); */
    /* background: rgba(39, 35, 41, 0.7); */
    background: rgba(50, 46, 52, 0.7);
    backdrop-filter: blur(10px);
    padding: 5px;
    border-right: 1px solid black;
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
    background-color: rgb(251, 190, 60);
}

.window-dot:first-of-type {
    background-color: rgb(242, 95, 88);
}

.window-dot:last-of-type {
    background-color: rgb(88, 203, 66);
}

#content-view {
    background: #2C2733;
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
    border-radius: 6px;
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

/* .app-window .content {
    flex: 1;
}

.app-window .sidebar-header {
    display: flex;
    align-items: center;
    background: #444950;
    border-radius: 12px 12px 0 0;
    overflow: hidden;
    padding: 10px 16px;
    min-height: 49px;
}

.app-window .window-dot {
    border-radius: 50%;
    display: inline-block;
    height: 12px;
    margin-right: 6px;
    margin-top: 4px;
    width: 12px;
}

.app-window .address-bar {
    display: flex;
    align-items: center;
    background-color: #1B1B1D;
    border-radius: 12.5px;
    color: #DADDE1;
    flex: 1 0;
    font: 400 13px Arial, sans-serif;
    margin: 0 1rem 0 .5rem;
    padding: 5px 15px;
}

.app-window .burger-bar {
    background-color: #aaa;
    display: block;
    height: 3px;
    margin: 3px 0;
    width: 17px;
}

.app-window .content {
    background: #292c30;
    display: flex;
    border: 3px solid #444950;
    border-top: 0;
    border-radius: 0 0 12px 12px;
    padding: 20px;
}


.app-window .browser-tabs {
    background: #444950;
    display: flex;
    padding: 0 10px;
    gap: 10px;
    user-select: none;
}

.app-window .browser-tabs .browser-tab {
    background: #1B1B1D;
    display: flex;
    border-radius: 12px 12px 0 0;
    padding: 6px 10px 3px 10px;
    align-items: center;
    gap: 6px;
    line-height: 1.5;
}

.app-window .browser-tabs .browser-tab:hover {
    background: rgba(0, 0, 0, 0.5);
    cursor: pointer;
}

.app-window .browser-tabs .browser-tab.active {
    background: #292C30;
} */
</style>
