<script lang="ts">
    import {dev} from "$app/environment";
    import {error} from "@sveltejs/kit";
    import Page from "$lib/views/Page.svelte";
    import LivePreview from "$lib/views/LivePreview.svelte";
    import InteractiveTerminal from "$lib/views/InteractiveTerminal.svelte";


    if (!dev) error(404, "Not found");
</script>

<Page title="Live Preview">
    <LivePreview />
    <InteractiveTerminal />
</Page>
