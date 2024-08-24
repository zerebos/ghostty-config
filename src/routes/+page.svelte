<script>
    import Page from "$lib/views/Page.svelte";
</script>

<svelte:head>
    <title>Home</title>
    <meta name="description" content="Svelte demo app" />
</svelte:head>


<Page title="Ghostty Config">
<section>
	Here you will be able to import/export and maybe launch the terminal preview overlay. Maybe some settings specific to the config tool as well?
</section>
</Page>

<style>
    section {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        flex: 0.6;
    }
</style>
