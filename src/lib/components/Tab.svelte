<script lang="ts">
    import {page} from "$app/stores";
    import type {Snippet} from "svelte";


    interface Props {
        children: Snippet;
        icon: Snippet;
        route?: string;
    }
    const {children, icon, route = ""}: Props = $props();
    const path = $derived($page.url.pathname);

    const isExternal = route.startsWith("http");
    const target = isExternal ? "_blank" : "";
    const rel = isExternal ? "noopener noreferer" : "";

    const selected = $derived(path === route);
</script>


<a href={route} class="nav-tab" class:selected {target} {rel}>
    <div class="tab-icon">{@render icon()}</div>
    <div class="tab-label">{@render children()}</div>
    {#if isExternal}
        <div class="tab-external">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z" /></svg>
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

    .nav-tab.selected {
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
        color: var(--font-color)!important;
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