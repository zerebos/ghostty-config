<script lang="ts">
    import PreviewFrame from "$lib/components/PreviewFrame.svelte";
    /* eslint-disable svelte/prefer-style-directive */
</script>

<PreviewFrame maxHeight="200px">
    <div class="row prompt">
        <span style="color: var(--config-palette-2)">John</span>
        <span style="color: var(--config-palette-6)">@</span>
        <span style="color: var(--config-palette-4)">doe-pc</span>
        <span style="color: var(--config-palette-1)" style:font-weight="700">$</span>
        cat file.txt
    </div>

    <div class="row">&nbsp;</div>
    <div class="row">Lorem ipsum dolor sit amet, consectetur adipiscing</div>
    <div class="row">elit. Maecenas <span style="color: var(--config-selection-fg); background-color: var(--config-selection-bg)">tempus massa ac mauris maximus, at</span></div>
    <div class="row">blandit diam vestibulum.</div>
</PreviewFrame>

<style>
.row,
.prompt {
    display: flex;
    white-space: pre;
}
</style>
