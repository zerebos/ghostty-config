<script lang="ts">
    import PreviewFrame from "$lib/components/PreviewFrame.svelte";
    import config from "$lib/stores/config.svelte";
    import {onMount} from "svelte";

    let isCursorVisible = $state(true);

    onMount(() => {
        const interval = setInterval(() => {
            if (config.cursorStyleBlink !== "false") isCursorVisible = !isCursorVisible;
            else isCursorVisible = true;
        }, 1000);
        return () => clearInterval(interval);
    });
</script>

<PreviewFrame maxHeight="60px">
    <div class="row prompt">
        <span style:color="var(--config-palette-2)">john</span>
        <span style:color="var(--config-palette-6)">@</span>
        <span style:color="var(--config-palette-4)">doe-pc</span>
        <span style:color="var(--config-palette-1)" style:font-weight="700">$</span>
        git commit -m "<span class="cursor {config.cursorStyle}" class:blink-hidden={!isCursorVisible}>"</span>
    </div>
</PreviewFrame>

<style>
.row,
.prompt {
    display: flex;
    white-space: pre;
}

.cursor {
    margin-left: 1px;
    /* +layout resolves cell-keywords/fallbacks into the --config-cursor-* vars, so this view
       reads colors only through CSS vars. color-mix applies cursor-opacity to the block while
       the glyph on top stays opaque, matching how Ghostty renders a translucent cursor. */
    --cursor-fill: color-mix(in srgb, var(--config-cursor-color) calc(var(--config-cursor-opacity) * 100%), transparent);
    color: var(--config-cursor-text);
    background-color: var(--cursor-fill);
    border-color: var(--cursor-fill);
}

.cursor.bar,
.cursor.underline,
.cursor.block_hollow {
    background-color: transparent!important;
    color: inherit !important;
}

.cursor.bar {
    border-left: 1px solid var(--cursor-fill);
    margin-left: 0;
}

.cursor.underline {
    border-bottom: 1px solid var(--cursor-fill);
}

.cursor.block_hollow {
    border: 1px solid var(--cursor-fill);
    margin-top: -1px;
    margin-left: 0;
}

/* Blink "off" phase: the block/line disappears, the glyph shows in plain foreground.
   Kept last so its border reset outranks the per-style border shorthands above. */
.cursor.blink-hidden {
    color: var(--config-fg) !important;
    background-color: transparent !important;
    border-color: transparent !important;
}
</style>
