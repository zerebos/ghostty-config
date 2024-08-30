<script lang="ts">
    import Page from "$lib/views/Page.svelte";
    import config from "$lib/stores/config.svelte";
    import Keybinds from "$lib/components/settings/Keybinds.svelte";
</script>

<Page title="Keybinds">
    <Keybinds bind:value={config.keybind} />
</Page>
