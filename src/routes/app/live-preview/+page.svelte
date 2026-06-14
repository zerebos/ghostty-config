<script lang="ts">
    import Page from "$lib/views/Page.svelte";
    import LivePreview from "$lib/views/LivePreview.svelte";
    import InteractiveTerminal from "$lib/views/InteractiveTerminal.svelte";
    import InteractiveTerminalBash from "$lib/views/InteractiveTerminalBash.svelte";
</script>

<Page title="Live Preview">
    <LivePreview />
    <InteractiveTerminal />
    <InteractiveTerminalBash />
</Page>
