<script lang="ts">
    import Page from "$lib/views/Page.svelte";
    import LivePreview from "$lib/views/LivePreview.svelte";
    import InteractiveTerminal from "$lib/views/InteractiveTerminal.svelte";
    import InteractiveTerminalRestty from "$lib/views/InteractiveTerminalRestty.svelte";
</script>

<Page title="Live Preview">
    <LivePreview />
    <InteractiveTerminal />
    <InteractiveTerminalRestty />
</Page>
