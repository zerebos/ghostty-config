<script lang="ts">
    import type {Snippet} from "svelte";

    import PreviewModeToggle from "$lib/components/PreviewModeToggle.svelte";
    import {preview, previewColorVars, themeSelection, type PreviewMode} from "$lib/stores/theme.svelte";

    /**
     * Wraps a fake-terminal preview (anything rendering the effective --config-* colors) to give it
     * its own light/dark toggle, overlaid in the box's top-right corner. By default the preview
     * follows the global contextual toggle (`preview.mode`, bound in Theme.svelte); flipping this
     * preview's toggle overrides that locally. The toggle only appears for a dual `light:A,dark:B`
     * theme, the same relevance condition the global toggle uses; for single/unset themes the mode
     * has no effect so the control would be noise. Non-terminal surfaces (e.g. the app-icon preview)
     * simply don't use this wrapper.
     *
     * `fill`: previews with a fixed/max height (settings, font playground) hug their content, the
     * default. The import/export config preview instead uses `flex: 1` to grow and fill the page, so
     * it passes `fill` to make the frame a transparent flex-grow container rather than collapsing it.
     */

    type Props = {
        children: Snippet;
        fill?: boolean;
    };

    const {children, fill = false}: Props = $props();

    // Per-instance override. `null` = follow the global toggle. Flipping the global toggle CLEARS
    // it (the effect below) so the global toggle never looks broken, every preview snaps back to
    // following it. Clearing (not masking) is deliberate: masking would revive a stale override on
    // a dark→light→dark round-trip.
    let localMode = $state<PreviewMode | null>(null);

    $effect(() => {
        // Reading preview.mode registers the dependency; it's always truthy ("light"/"dark"), so
        // any change to the global toggle re-runs this and drops this preview's local override.
        if (preview.mode) localMode = null;
    });

    const isDual = $derived(themeSelection().kind === "dual");
    const effectiveMode = $derived(localMode ?? preview.mode);

    // Only scope vars when this preview has actually diverged from the global mode; otherwise emit
    // nothing and inherit the global --config-* funnel (zero cost, pixel-identical to today).
    const scopedVars = $derived(isDual && effectiveMode !== preview.mode ? previewColorVars(effectiveMode) : "");

    function setMode(mode: PreviewMode) {
        localMode = mode;
    }
</script>

<!-- eslint-disable-next-line svelte/require-optimized-style-attribute -->
<div class="preview-frame" class:fill style={scopedVars}>
    {@render children()}
    {#if isDual}
        <div class="preview-mode-toggle">
            <PreviewModeToggle value={effectiveMode} onchange={setMode} />
        </div>
    {/if}
</div>

<style>
.preview-frame {
    position: relative;
}

/* Grow to fill a flex-column parent and let a `flex: 1` child (the config preview) fill this,
   preserving its full-height behavior instead of collapsing to min-height inside a plain block. */
.preview-frame.fill {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
}

/* Overlaid in the preview box's top-right corner (the prompt/content is left-aligned, so the
   corner is clear). Sits outside the preview's scroll area, so it stays put as content scrolls. */
.preview-mode-toggle {
    position: absolute;
    top: 6px;
    right: 6px;
    z-index: 2;
}
</style>
