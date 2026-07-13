<script lang="ts">
    import type {Snippet} from "svelte";

    // The shared fake-terminal box: the config-themed surface (background/foreground/font from the
    // --config-* funnel) with padding, rounded border and inset highlight, that every preview used
    // to hand-roll. Content-only children render inside it. Owns sizing but NOT the light/dark
    // toggle — that's PreviewFrame, which renders this plus the toggle. Surfaces with no toggle
    // (the import preview modal) use PreviewSurface directly.
    //
    // Sizing: `maxHeight`/`minHeight` are raw CSS lengths (e.g. "200px"); `fill` makes the box a
    // flex-grow child that fills a flex-column parent (the import/export config preview). `fill`
    // and a fixed `maxHeight` are mutually exclusive in practice — pass one or the other.

    type Props = {
        children: Snippet;
        maxHeight?: string;
        minHeight?: string;
        fill?: boolean;
        selectable?: boolean;
    };

    const {children, maxHeight, minHeight, fill = false, selectable = false}: Props = $props();
</script>

<div
    class="preview-surface"
    class:fill
    class:selectable
    style:max-height={maxHeight}
    style:min-height={minHeight}
>
    {@render children()}
</div>

<style>
.preview-surface {
    background: var(--config-bg);
    font-family: var(--config-font-family);
    font-size: var(--config-font-size);
    color: var(--config-fg);
    overflow-y: auto;
    padding: 8px;
    border-radius: var(--radius-level-3);
    border: 1px solid rgba(0, 0, 0, 0.5);
    box-shadow: 0 0 1px rgba(255, 255, 255, 0.5) inset;
}

/* Grow to fill a flex-column parent; min-height:0 lets it shrink so overflow-y scrolls. */
.preview-surface.fill {
    flex: 1;
    min-height: 0;
}

.preview-surface.selectable {
    user-select: text;
}
</style>
