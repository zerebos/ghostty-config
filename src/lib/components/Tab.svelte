<script lang="ts">
    import {page} from "$app/state";
    import type {Snippet} from "svelte";
    import HighlightText from "$lib/components/HighlightText.svelte";
    import type {MatchRange} from "$lib/utils/search";

    interface Props {
        children: Snippet;
        icon: Snippet;
        route?: string;
        highlightRanges?: MatchRange[];
        label?: string;
        selected?: boolean;
    }
    const {
        children,
        icon,
        route = "",
        highlightRanges = [],
        label = "",
        selected = false
    }: Props = $props();
    const path = $derived(page.url.pathname);

    const isExternal = $derived(route.startsWith("http"));
    const target = $derived(isExternal ? "_blank" : "");
    const rel = $derived(isExternal ? "noopener noreferrer" : "");

    const pageSelected = $derived(path === route);
    const isSelected = $derived(pageSelected || selected);

    const hasHighlight = $derived(highlightRanges.length > 0);
</script>

<!-- Why is eslint like this? -->
<!-- eslint-disable-next-line svelte/no-navigation-without-resolve, svelte/first-attribute-linebreak -->
<a href={route} class="nav-tab" class:isSelected {target} {rel}>
    <div class="tab-icon">{@render icon()}</div>
    <div class="tab-label">
        {#if hasHighlight && label}
            <HighlightText text={label} ranges={highlightRanges} />
        {:else}
            {@render children()}
        {/if}
    </div>
    {#if isExternal}
        <div class="tab-external">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#e8eaed"
                ><path
                    d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z"
                /></svg
            >
        </div>
    {/if}
</a>

<style>
    .nav-tab {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
        padding: 6px;
        border-radius: var(--radius-level-4);
        font-weight: 600;
        position: relative;
        text-decoration: none;
    }

    .nav-tab.isSelected {
        background: var(--color-selected);
    }

    .nav-tab .tab-icon {
        width: 20px;
        height: 20px;
    }

    .nav-tab .tab-label {
        font-size: 1rem;
        flex: 1;
        justify-content: flex-start;
        color: var(--font-color) !important;
        text-decoration: none !important;
    }

    .nav-tab:hover {
        text-decoration: none !important;
    }

    .tab-external {
        display: flex;
    }

    .tab-external svg {
        width: 20px;
        height: 20px;
    }
</style>
