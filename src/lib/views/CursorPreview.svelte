<script lang="ts">
    import config from "$lib/stores/config";
    import {onMount} from "svelte";

    let isCursorVisible = $state(true);

    onMount(() => {
        const interval = setInterval(() => {
            if ($config.cursorStyleBlink !== "false") isCursorVisible = !isCursorVisible;
            else isCursorVisible = true;
        }, 1000);
        return () => clearInterval(interval);
    });

    // TODO: make less gross with less ternaries
    let cursorColor = $derived($config.cursorInvertFgBg ? $config.foreground : ($config.cursorColor || $config.foreground));
    let cursorText = $derived(isCursorVisible ? $config.cursorInvertFgBg ? $config.background : ($config.cursorText || $config.background) : $config.foreground);
    let cursorOpacity = $derived(isCursorVisible ? Math.round($config.cursorOpacity * 255).toString(16) : "00");
    $inspect(cursorOpacity);
</script>

<div class="preview" style="background: {$config.background}; color: {$config.foreground}; font-family: {$config.fontFamily || "monospace"}; font-size: {$config.fontSize + "px"};">
    <div class="row prompt">
        <span style="color: {$config.palette[2]};">john</span>
        <span style="color: {$config.palette[6]};">@</span>
        <span style="color: {$config.palette[4]};">doe-pc</span>
        <span style="color: {$config.palette[1]}; font-weight: 700;">$</span>
        git commit -m "<span class="cursor {$config.cursorStyle}" style="color: {cursorText}; background-color: {cursorColor}{cursorOpacity}; border-color: {cursorColor}{cursorOpacity};">"</span>
    </div>
</div>

<style>
.preview {
    height: 32px;
    overflow-y: auto;
    padding: 8px;
    border-radius: 8px;
    border: 1px solid rgba(0, 0, 0, 0.5);
    box-shadow: 0 0 1px rgba(255, 255, 255, 0.5) inset;
    /* border: 1px solid #4B4652; */
}

.preview .row {
    display: flex;
    white-space: pre;
}

.cursor {
    margin-left: 2px;
}

.cursor.bar,
.cursor.underline,
.cursor.block_hollow {
    background-color: transparent!important;
    color: inherit !important;
}

.cursor.bar {
    border-left: 2px solid transparent;
    margin-left: 0;
}

.cursor.underline {
    border-bottom: 2px solid transparent;
}

.cursor.block_hollow {
    border: 2px solid transparent;
    margin-top: -2px;
    margin-left: 0;
}
</style>