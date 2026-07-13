<script lang="ts">
    import MoonIcon from "$lib/components/icons/MoonIcon.svelte";
    import SunIcon from "$lib/components/icons/SunIcon.svelte";
    import type {PreviewMode} from "$lib/stores/theme.svelte";

    // Compact sun/moon segmented control for a preview's light/dark half. Sits over the terminal
    // background (in a preview box corner or the floating window's titlebar), so it uses a dark
    // translucent scrim with light icons — legible on both light and dark theme backgrounds rather
    // than tracking --config-* colors (it's a meta control, not part of the previewed terminal).

    type Props = {
        value: PreviewMode;
        onchange: (mode: PreviewMode) => void;
    };

    const {value, onchange}: Props = $props();
</script>

<div class="mode-toggle" role="group" aria-label="Preview light or dark half">
    <button
        type="button"
        class="mode-btn"
        class:active={value === "light"}
        aria-pressed={value === "light"}
        aria-label="Preview light theme"
        title="Preview light theme"
        onclick={() => onchange("light")}
    >
        <SunIcon />
    </button>
    <button
        type="button"
        class="mode-btn"
        class:active={value === "dark"}
        aria-pressed={value === "dark"}
        aria-label="Preview dark theme"
        title="Preview dark theme"
        onclick={() => onchange("dark")}
    >
        <MoonIcon />
    </button>
</div>

<style>
.mode-toggle {
    display: inline-flex;
    gap: 2px;
    padding: 2px;
    border-radius: var(--radius-level-4);
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(4px);
    border: 1px solid rgba(255, 255, 255, 0.12);
}

.mode-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    padding: 0;
    border: none;
    border-radius: var(--radius-level-4);
    background: transparent;
    color: rgba(255, 255, 255, 0.55);
    cursor: pointer;
    transition: color 120ms ease, background-color 120ms ease;
}

.mode-btn:hover {
    color: rgba(255, 255, 255, 0.85);
}

.mode-btn.active {
    background: rgba(255, 255, 255, 0.18);
    color: #fff;
}
</style>
