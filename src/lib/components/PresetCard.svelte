<script lang="ts">
    import type {Preset} from "$lib/data/presets";

    interface Props {
        preset: Preset;
        selected?: boolean;
        onselect: () => void;
    }

    const {preset, selected = false, onselect}: Props = $props();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="preset-card" class:selected onclick={onselect}>
    <div
        class="mini-preview"
        style="background: {preset.background}; color: {preset.foreground}; font-family: monospace; font-size: 10px;"
    >
        <div class="row">
            <span style="color: {preset.palette[4]}; font-weight: 700;">ghostty@macos</span><span style="color: {preset.foreground}">:</span><span style="color: {preset.palette[6]}">~</span><span style="color: {preset.foreground}">$ ls -la</span>
        </div>
        <div class="row">
            <span style="color: {preset.palette[2]}">drwxr-xr-x</span>&nbsp;&nbsp;<span style="color: {preset.palette[7]}">ghostty</span>&nbsp;&nbsp;<span style="color: {preset.palette[2]}">.config</span>
        </div>
        <div class="row">
            <span style="color: {preset.palette[3]}">.rwxr--r--</span>&nbsp;&nbsp;<span style="color: {preset.palette[7]}">ghostty</span>&nbsp;&nbsp;<span style="color: {preset.palette[7]}">.zshrc</span>
        </div>
        <div class="row">
            <span style="color: {preset.palette[3]}">.rw-r--r--</span>&nbsp;&nbsp;<span style="color: {preset.palette[7]}">ghostty</span>&nbsp;&nbsp;<span style="color: {preset.palette[7]}">README.md</span>
        </div>
    </div>

    <div class="card-info">
        <span class="card-name">{preset.name}</span>
        <span class="card-desc">{preset.description}</span>
    </div>

    <div class="swatches">
        {#each [preset.palette[1], preset.palette[2], preset.palette[3], preset.palette[4], preset.palette[6]] as color}
            <span class="swatch" style="background: {color};"></span>
        {/each}
    </div>
</div>

<style>
.preset-card {
    display: flex;
    flex-direction: column;
    background: var(--bg-level-3);
    border: 1px solid var(--border-level-2);
    border-radius: var(--radius-level-2);
    overflow: hidden;
    cursor: pointer;
    transition: border-color 0.15s, box-shadow 0.15s;
}

.preset-card:hover {
    border-color: #6a6570;
}

.preset-card.selected {
    border-color: var(--color-input-accent);
    box-shadow: 0 0 0 1px var(--color-input-accent), 0 0 8px rgba(23, 105, 230, 0.3);
}

.mini-preview {
    height: 100px;
    padding: 8px;
    overflow: hidden;
    border-bottom: 1px solid var(--border-level-2);
    line-height: 1.5;
}

.mini-preview .row {
    white-space: pre;
    overflow: hidden;
    text-overflow: ellipsis;
}

.card-info {
    display: flex;
    flex-direction: column;
    padding: 10px 12px 6px;
    gap: 2px;
}

.card-name {
    font-weight: 600;
    font-size: 0.95rem;
    color: var(--font-color);
}

.card-desc {
    font-size: 0.78rem;
    color: var(--font-color-muted);
    line-height: 1.3;
}

.swatches {
    display: flex;
    gap: 6px;
    padding: 6px 12px 10px;
}

.swatch {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.3);
}
</style>
