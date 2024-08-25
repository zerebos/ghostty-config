<script lang="ts">
</script>

<div class="preview" style="background: var(--config-bg); color: var(--config-fg); font-family: var(--config-font-family); font-size: var(--config-font-size);">
    <div class="row prompt">
        <span style="color: var(--config-palette-2);">john</span>
        <span style="color: var(--config-palette-6);">@</span>
        <span style="color: var(--config-palette-4);">doe-pc</span>
        <span style="color: var(--config-palette-1); font-weight: 700;">$</span>
        cat file.txt
    </div>
    <div class="row">&nbsp;</div>
    <div class="row">Lorem ipsum dolor sit amet, consectetur adipiscing</div>
    <div class="row">elit. Maecenas <span style="color: var(--config-selection-fg); background-color: var(--config-selection-bg);">tempus massa ac mauris maximus, at</span></div>
    <div class="row">blandit diam vestibulum.</div>

</div>

<style>
.preview {
    max-height: 200px;
    overflow-y: auto;
    padding: 8px;
    border-radius: 8px;
    border: 1px solid rgba(0, 0, 0, 0.5);
    box-shadow: 0 0 1px rgba(255, 255, 255, 0.5) inset;
}

.preview .row {
    display: flex;
    white-space: pre;
    /* width: 100%; */
    /* overflow: hidden; */
}
</style>