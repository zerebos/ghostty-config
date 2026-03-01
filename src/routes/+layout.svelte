<script lang="ts">
    import Gap from "$lib/components/Gap.svelte";
    import Tab from "$lib/components/Tab.svelte";
    import User from "$lib/components/User.svelte";
    import Search from "$lib/components/Search.svelte";
    import SearchSubItem from "$lib/components/SearchSubItem.svelte";
    import {searchSettings, flattenSearchResults, type ExternalTab} from "$lib/utils/search";
    import search, {clearSearch, setHighlightedSetting} from "$lib/stores/search.svelte";
    import {goto} from "$app/navigation";
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
    import type {Snippet} from "svelte";
    import settings from "$lib/data/settings";

    const externalTabs: ExternalTab[] = [
        {id: "github", name: "GitHub", route: "https://github.com/zerebos/ghostty-config"},
        {id: "ghostty", name: "Ghostty", route: "https://ghostty.org/"}
    ];

    const cssConfigVars = $derived.by(() => {
        let str = "";

        const add = (key: string, val: string) => (str += `--config-${key}: ${val};`);

        // Add the base colors
        add("bg", config.background);
        add("fg", config.foreground);
        add("selection-bg", config.selectionBackground || config.foreground);
        add("selection-fg", config.selectionForeground || config.background);

        // Add the palette colors
        const paletteSize = 16; // config.palette.length;
        for (let c = 0; c < paletteSize; c++) add(`palette-${c}`, config.palette[c]);

        // TODO: consider honoring separate fonts for bold/italic and such in previews
        // Add font settings
        add("font-family", config.fontFamily || "monospace");
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

    const searchResults = $derived(searchSettings(search.query, settings, externalTabs));
    const flattenedResults = $derived(flattenSearchResults(searchResults));
    const isSearching = $derived(search.query.trim().length > 0);
    const hasResults = $derived(flattenedResults.length > 0);

    function handleKeydown(e: KeyboardEvent) {
        if (!isSearching) return;

        const totalItems = flattenedResults.length;
        if (totalItems === 0) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            search.selectedIndex = (search.selectedIndex + 1) % totalItems;
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            search.selectedIndex = (search.selectedIndex - 1 + totalItems) % totalItems;
        } else if (e.key === "Enter") {
            e.preventDefault();
            selectItem(search.selectedIndex);
        }
    }

    async function selectItem(index: number) {
        const item = flattenedResults[index];
        if (!item) return;

        if (item.type === "setting" && item.setting) {
            setHighlightedSetting(item.setting.id);
            await goto(item.result.categoryRoute);
        } else {
            await goto(item.result.categoryRoute);
        }
        clearSearch();
    }

    function getResultIcon(categoryId: string): string {
        const iconMap: Record<string, string> = {
            application,
            clipboard,
            window,
            colors,
            fonts,
            keybinds,
            mouse,
            gtk,
            linux,
            macos,
            github,
            ghostty,
            sync,
            calligraphy
        };
        return iconMap[categoryId] || application;
    }

    function isExternalCategory(categoryId: string): boolean {
        return categoryId === "github" || categoryId === "ghostty";
    }
</script>

<svelte:head>
    <title>{htmlTitle}</title>
</svelte:head>

<svelte:window onkeydown={handleKeydown} />

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
            <Search />
        </div>
        <nav id="categories">
            {#if isSearching}
                {#if hasResults}
                    {#each flattenedResults as item, index (`${item.result.categoryId}-${item.type}-${item.setting?.id || ""}`)}
                        {#if item.type === "category" || item.type === "external"}
                            <div class="search-result-group">
                                <Tab
                                    route={item.result.categoryRoute}
                                    highlightRanges={item.result.categoryMatchRanges}
                                    label={item.result.categoryName}
                                >
                                    {#snippet icon()}
                                        {#if isExternalCategory(item.result.categoryId)}
                                            <div
                                                class="icon-wrapper"
                                                class:github={item.result.categoryId === "github"}
                                            >
                                                <img
                                                    src={getResultIcon(item.result.categoryId)}
                                                    alt={item.result.categoryName}
                                                />
                                            </div>
                                        {:else}
                                            <img
                                                src={getResultIcon(item.result.categoryId)}
                                                alt={item.result.categoryName}
                                            />
                                        {/if}
                                    {/snippet}
                                    {item.result.categoryName}
                                </Tab>
                            </div>
                        {:else if item.type === "setting" && item.setting}
                            <SearchSubItem
                                setting={item.setting}
                                categoryRoute={item.result.categoryRoute}
                                selected={index === search.selectedIndex}
                            />
                        {/if}
                    {/each}
                {:else}
                    <div class="no-results">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="32"
                            viewBox="0 -960 960 960"
                            width="32"
                            fill="currentColor"
                            class="no-results-icon"
                        >
                            <path
                                d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"
                            />
                        </svg>
                        <div class="no-results-title">No Results</div>
                        <div class="no-results-desc">No results for "{search.query}"</div>
                    </div>
                {/if}
            {:else}
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
                    {#snippet icon()}<div class="icon-wrapper">
                            <img src={gtk} alt="GTK Settings" />
                        </div>{/snippet}
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
                <Gap expand={true} />
                <Tab route="https://github.com/zerebos/ghostty-config">
                    {#snippet icon()}<div class="icon-wrapper github">
                            <img src={github} alt="Ghostty Config GitHub" />
                        </div>{/snippet}
                    GitHub
                </Tab>
                <Tab route="https://ghostty.org/">
                    {#snippet icon()}<img src={ghostty} alt="Ghostty Website" />{/snippet}
                    Ghostty
                </Tab>
            {/if}
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
        max-width: var(--app-width);
        height: var(--app-height);
        border: 1px solid var(--border-level-1);
        /* box-shadow: 0 0 1px white inset; */
        box-shadow: 0 0 20px -1px rgba(0, 0, 0, 0.7);
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
        padding: 5px 0px 0px 5px;
        border-right: 2px solid var(--border-level-1);
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    .sidebar-header {
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
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
        min-height: 0;
        padding: 20px 15px 15px 10px;
        margin: 0px 0px 0px 0px;
        overflow-y: auto;
        overflow-x: hidden;
    }

    #categories img {
        width: 100%;
    }

    #categories .icon-wrapper {
        background: linear-gradient(#d3e3e9, #908f8c);
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
        background: linear-gradient(#9c45a9, #3b1e68);
    }

    #categories .icon-wrapper.github img {
        filter: invert(100%);
        height: 18px;
        width: 18px;
    }

    .no-results {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        flex: 1;
        padding: 40px 20px;
        color: var(--font-color-muted, #888);
        text-align: center;
    }

    .no-results-icon {
        opacity: 0.4;
        margin-bottom: 16px;
    }

    .no-results-title {
        font-size: 1rem;
        font-weight: 600;
        margin-bottom: 4px;
    }

    .no-results-desc {
        font-size: 0.85rem;
        opacity: 0.8;
    }

    .search-result-group {
        display: flex;
        flex-direction: column;
    }
</style>
