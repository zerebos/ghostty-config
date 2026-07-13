<script lang="ts">
    import type {Snippet} from "svelte";

    import PreviewModeToggle from "$lib/components/PreviewModeToggle.svelte";
    import PreviewSurface from "$lib/components/PreviewSurface.svelte";
    import {createPreviewMode} from "$lib/stores/theme.svelte";

    /**
     * A fake-terminal preview box (PreviewSurface) plus its own light/dark toggle, overlaid in the
     * box's top-right corner. Content-only children render inside the surface. By default the preview
     * follows the global contextual toggle (`preview.mode`, bound in Theme.svelte); flipping this
     * preview's toggle overrides that locally. The toggle only appears for a dual `light:A,dark:B`
     * theme, the same relevance condition the global toggle uses; for single/unset themes the mode
     * has no effect so the control would be noise. Non-terminal surfaces (e.g. the app-icon preview)
     * simply don't use this wrapper, and box-without-toggle surfaces (the import modal) use
     * PreviewSurface directly.
     *
     * Sizing props are forwarded to PreviewSurface: `maxHeight`/`minHeight` (raw CSS lengths) or
     * `fill` (grow to fill a flex-column parent, as the import/export config preview does).
     */

    type Props = {
        children: Snippet;
        maxHeight?: string;
        minHeight?: string;
        fill?: boolean;
        selectable?: boolean;
    };

    const {children, maxHeight, minHeight, fill = false, selectable = false}: Props = $props();

    // Per-instance light/dark override (see createPreviewMode); scoped vars shadow the global funnel
    // for this subtree only, and the toggle appears just for a dual theme.
    const mode = createPreviewMode();
</script>

<!-- eslint-disable-next-line svelte/require-optimized-style-attribute -->
<div class="preview-frame" class:fill style={mode.scopedVars}>
    <PreviewSurface {maxHeight} {minHeight} {fill} {selectable}>
        {@render children()}
    </PreviewSurface>
    {#if mode.isDual}
        <div class="preview-mode-toggle">
            <PreviewModeToggle value={mode.effectiveMode} onchange={mode.setMode} />
        </div>
    {/if}
</div>

<style>
.preview-frame {
    position: relative;
}

/* Grow to fill a flex-column parent so the `fill` surface inside can fill it in turn, preserving
   the config preview's full-height behavior instead of collapsing to content height. */
.preview-frame.fill {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
}

/* Overlaid in the preview box's top-right corner (the prompt/content is left-aligned, so the
   corner is clear). Sits outside the surface's scroll area, so it stays put as content scrolls. */
.preview-mode-toggle {
    position: absolute;
    top: 6px;
    right: 6px;
    z-index: 2;
}
</style>
