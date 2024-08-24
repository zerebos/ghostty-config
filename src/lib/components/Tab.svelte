<script lang="ts">
    export let route = "";

    import {page} from "$app/stores";

    let path;

    $: path = $page.url.pathname;
</script>


<a href="{route}" class={"nav-tab" + (path === route ? " selected" : "")}>
    <div class="tab-icon"><slot name="icon" /></div>
    <div class="tab-label"><slot /></div>
</a>


<style>
    .nav-tab {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 5px;
        padding: 6px;
        border-radius: 6px;
    }

    .nav-tab.selected {
        background: #2C56B9;
    }

    .nav-tab .tab-icon {
        width: 18px;
        height: 18px;
    }

    .nav-tab .tab-label {
        flex: 1;
        justify-content: flex-start;
        color: var(--color-text)!important;
        text-decoration: none !important;
    }

    .nav-tab:hover {
        text-decoration: none !important;
    }
</style>