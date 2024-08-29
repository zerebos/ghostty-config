<script lang="ts">
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

    // TODO: make less gross with less ternaries
    const cursorColor = $derived(config.cursorInvertFgBg ? config.foreground : (config.cursorColor || config.foreground));
    const cursorText = $derived(isCursorVisible ? config.cursorInvertFgBg ? config.background : (config.cursorText || config.background) : config.foreground);
    const cursorOpacity = $derived(isCursorVisible ? Math.round(config.cursorOpacity * 255).toString(16) : "00");
</script>

<div class="preview">
    <div class="row prompt">
        <span style:color="var(--config-palette-2)">john</span>
        <span style:color="var(--config-palette-6)">@</span>
        <span style:color="var(--config-palette-4)">doe-pc</span>
        <span style:color="var(--config-palette-1)" style:font-weight="700">$</span>
        git commit -m "<span class="cursor {config.cursorStyle}" style:color={cursorText} style:border-color="{cursorColor}{cursorOpacity}" style:background-color="{cursorColor}{cursorOpacity}">"</span>
    </div>
</div>

<style>
.preview {
    background: var(--config-bg);
    font-family: var(--config-font-family);
    font-size: var(--config-font-size);
    color: var(--config-fg);
    max-height: 60px;
    overflow-y: auto;
    padding: 8px;
    border-radius: var(--radius-level-3);
    border: 1px solid rgba(0, 0, 0, 0.5);
    box-shadow: 0 0 1px rgba(255, 255, 255, 0.5) inset;
}

.preview .row,
.prompt {
    display: flex;
    white-space: pre;
}

.cursor {
    margin-left: 1px;
}

.cursor.bar,
.cursor.underline,
.cursor.block_hollow {
    background-color: transparent!important;
    color: inherit !important;
}

.cursor.bar {
    border-left: 1px solid transparent;
    margin-left: 0;
}

.cursor.underline {
    border-bottom: 1px solid transparent;
}

.cursor.block_hollow {
    border: 1px solid transparent;
    margin-top: -1px;
    margin-left: 0;
}
</style>