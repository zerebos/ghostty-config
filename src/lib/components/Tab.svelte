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
</script>


<a href={route} class={"nav-tab" + (path === route ? " selected" : "")}>
    <div class="tab-icon">{@render icon()}</div>
    <div class="tab-label">{@render children()}</div>
</a>


<style>
    .nav-tab {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
        padding: 6px;
        border-radius: 6px;
        font-weight: 600;
    }

    .nav-tab.selected {
        background: #2C56B9;
    }

    .nav-tab .tab-icon {
        width: 20px;
        height: 20px;
    }

    .nav-tab .tab-label {
        font-size: 1rem;
        flex: 1;
        justify-content: flex-start;
        color: var(--color-text)!important;
        text-decoration: none !important;
    }

    .nav-tab:hover {
        text-decoration: none !important;
    }
</style>