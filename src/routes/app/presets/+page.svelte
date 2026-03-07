<script lang="ts">
    import presets from "$lib/data/presets";
    import PresetCard from "$lib/components/PresetCard.svelte";
    import Page from "$lib/views/Page.svelte";
    import {load, resetColorScheme} from "$lib/stores/config.svelte";
    import app from "$lib/stores/state.svelte";

    let selectedPreset = $derived(presets.find(p => p.id === app.selectedPresetId) ?? presets[0]);
    let applied = $state(false);

    function applyPreset() {
        load({
            background: selectedPreset.background,
            foreground: selectedPreset.foreground,
            selectionBackground: selectedPreset.selectionBackground,
            selectionForeground: selectedPreset.selectionForeground,
            cursorColor: selectedPreset.cursorColor,
            palette: [...selectedPreset.palette],
        });
        applied = true;
        setTimeout(() => applied = false, 2000);
    }
</script>

<Page title="Presets">
    <div class="preset-page">
        <div class="preview-section">
            <div class="preview-header">
                <h2>{selectedPreset.name}</h2>
                <p>{selectedPreset.description}</p>
            </div>
            <div
                class="preview-terminal"
                style="
                    --config-bg: {selectedPreset.background};
                    --config-fg: {selectedPreset.foreground};
                    --config-selection-bg: {selectedPreset.selectionBackground};
                    --config-selection-fg: {selectedPreset.selectionForeground};
                    --config-palette-0: {selectedPreset.palette[0]};
                    --config-palette-1: {selectedPreset.palette[1]};
                    --config-palette-2: {selectedPreset.palette[2]};
                    --config-palette-3: {selectedPreset.palette[3]};
                    --config-palette-4: {selectedPreset.palette[4]};
                    --config-palette-5: {selectedPreset.palette[5]};
                    --config-palette-6: {selectedPreset.palette[6]};
                    --config-palette-7: {selectedPreset.palette[7]};
                    --config-palette-8: {selectedPreset.palette[8]};
                    --config-palette-9: {selectedPreset.palette[9]};
                    --config-palette-10: {selectedPreset.palette[10]};
                    --config-palette-11: {selectedPreset.palette[11]};
                    --config-palette-12: {selectedPreset.palette[12]};
                    --config-palette-13: {selectedPreset.palette[13]};
                    --config-palette-14: {selectedPreset.palette[14]};
                    --config-palette-15: {selectedPreset.palette[15]};
                    --config-font-family: monospace;
                    --config-font-size: 13px;
                "
            >
                <div class="terminal-content">
                    <div class="row">
                        <span class="p4 bold">ghostty@macos</span><span class="fg">:</span><span class="p6">~</span><span class="fg">$ eza -la --color=always --icons</span>
                    </div>
                    <div class="row">&nbsp;</div>
                    <div class="row">
                        <span class="p12">d</span><span class="p11">r</span><span class="p9">w</span><span class="p10">x</span><span class="p8">------</span><span class="p8">&nbsp;&nbsp;&nbsp;&nbsp;-</span>&nbsp;<span class="p11">ghostty</span>&nbsp;<span class="p4">22 Aug 13:42</span>&nbsp;<span class="p2">.config</span>
                    </div>
                    <div class="row">
                        <span class="p7">.</span><span class="p11">r</span><span class="p9">w</span><span class="p8">-</span><span class="p3">r</span><span class="p8">-</span><span class="p8">-</span><span class="p3">r</span><span class="p8">-</span><span class="p8">-</span><span class="p2">&nbsp;&nbsp;&nbsp;&nbsp;0</span>&nbsp;<span class="p11">ghostty</span>&nbsp;<span class="p4">&nbsp;7 May 11:11</span>&nbsp;<span class="p7">.zshrc</span>
                    </div>
                    <div class="row">
                        <span class="p7">.</span><span class="p11">r</span><span class="p9">w</span><span class="p8">-------</span><span class="p10">&nbsp;2.5k</span>&nbsp;<span class="p11">ghostty</span>&nbsp;<span class="p4">&nbsp;2 Mar 02:49</span>&nbsp;<span class="p7">README.md</span>
                    </div>
                    <div class="row">
                        <span class="p12">l</span><span class="p11">r</span><span class="p9">w</span><span class="p10">x</span><span class="p3">r</span><span class="p1">w</span><span class="p2">x</span><span class="p3">r</span><span class="p1">w</span><span class="p2">x</span><span class="p8">&nbsp;&nbsp;&nbsp;&nbsp;-</span>&nbsp;<span class="p11">ghostty</span>&nbsp;<span class="p4">&nbsp;9 Feb 20:32</span>&nbsp;<span class="p6">etc -> /etc</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="action-bar">
            <button class="btn-primary" onclick={applyPreset}>
                {#if applied}
                    Applied!
                {:else}
                    Apply Preset
                {/if}
            </button>
            <button class="btn-secondary" onclick={resetColorScheme}>Reset Colors</button>
        </div>

        <div class="presets-grid">
            {#each presets as preset (preset.id)}
                <PresetCard {preset} selected={app.selectedPresetId === preset.id} onselect={() => app.selectedPresetId = preset.id} />
            {/each}
        </div>
    </div>
</Page>

<style>
.preset-page {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.preview-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.preview-header h2 {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0;
}

.preview-header p {
    font-size: 0.85rem;
    color: var(--font-color-muted);
    margin: 4px 0 0;
}

.preview-terminal {
    border-radius: var(--radius-level-3);
    border: 1px solid rgba(0, 0, 0, 0.5);
    box-shadow: 0 0 1px rgba(255, 255, 255, 0.5) inset;
    overflow: hidden;
}

.terminal-content {
    background: var(--config-bg);
    font-family: var(--config-font-family);
    font-size: var(--config-font-size);
    color: var(--config-fg);
    padding: 10px;
    min-height: 160px;
}

.terminal-content .row {
    display: flex;
    white-space: pre;
}

.bold {font-weight: 700;}
.fg {color: var(--config-fg);}
.p1 {color: var(--config-palette-1);}
.p2 {color: var(--config-palette-2);}
.p3 {color: var(--config-palette-3);}
.p4 {color: var(--config-palette-4);}
.p6 {color: var(--config-palette-6);}
.p7 {color: var(--config-palette-7);}
.p8 {color: var(--config-palette-8);}
.p9 {color: var(--config-palette-9);}
.p10 {color: var(--config-palette-10);}
.p11 {color: var(--config-palette-11);}
.p12 {color: var(--config-palette-12);}

.action-bar {
    display: flex;
    gap: 8px;
}

.btn-primary {
    padding: 8px 20px;
    background: var(--color-input-accent);
    color: var(--font-color);
    border: none;
    border-radius: var(--radius-level-4);
    cursor: pointer;
    font-weight: 500;
    min-width: 120px;
    transition: background 0.15s;
}

.btn-primary:hover {
    background: hsl(from var(--color-input-accent) h s calc(l + 8));
}

.btn-secondary {
    padding: 8px 20px;
    background: transparent;
    color: var(--font-color);
    border: 1px solid var(--border-level-2);
    border-radius: var(--radius-level-4);
    cursor: pointer;
    font-weight: 500;
    transition: background 0.15s;
}

.btn-secondary:hover {
    background: var(--bg-level-4);
}

.presets-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
}
</style>
