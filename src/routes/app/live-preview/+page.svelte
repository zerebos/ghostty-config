<script lang="ts">
    import Page from "$lib/views/Page.svelte";
    import LivePreview from "$lib/views/LivePreview.svelte";
    import InteractiveTerminal from "$lib/views/InteractiveTerminal.svelte";
    import InteractiveTerminalWterm from "$lib/views/InteractiveTerminalWterm.svelte";
    import InteractiveTerminalXterm from "$lib/views/InteractiveTerminalXterm.svelte";
</script>

<Page title="Live Preview">
    <LivePreview />
    <InteractiveTerminal />
    <InteractiveTerminalWterm />
    <InteractiveTerminalXterm />
</Page>
