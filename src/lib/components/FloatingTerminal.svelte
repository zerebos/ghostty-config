<script lang="ts">
    import {onMount} from "svelte";
    import InteractiveTerminalDom from "$lib/views/InteractiveTerminalDom.svelte";
    import app from "$lib/stores/state.svelte";

    const WIDTH = 680;
    const HEIGHT = 480;

    let x = $state(0);
    let y = $state(0);
    let dragging = $state(false);
    let dragOffsetX = 0;
    let dragOffsetY = 0;

    onMount(() => {
        x = Math.max(0, (window.innerWidth - WIDTH) / 2);
        y = Math.max(0, (window.innerHeight - HEIGHT) / 3);
    });

    function startDrag(e: MouseEvent) {
        dragging = true;
        dragOffsetX = e.clientX - x;
        dragOffsetY = e.clientY - y;
    }

    $effect(() => {
        if (!dragging) return;

        function onMove(e: MouseEvent) {
            x = Math.max(0, Math.min(window.innerWidth - WIDTH, e.clientX - dragOffsetX));
            y = Math.max(0, Math.min(window.innerHeight - HEIGHT, e.clientY - dragOffsetY));
        }

        function onUp() {
            dragging = false;
        }

        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
        return () => {
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);
        };
    });

    function close() {
        app.floatingTerminalOpen = false;
    }

    let title = $state(`Ghostty — Interactive Preview`);
    function onCwdChange(cwd: string) {
        title = `${cwd}`;
    }
</script>

{#if app.floatingTerminalOpen}
    <div
        class="ghostty-window"
        style:left={`${x}px`}
        style:top={`${y}px`}
        style:cursor={dragging ? "grabbing" : "default"}
        role="dialog"
        aria-label="Interactive terminal preview"
        aria-modal="false"
    >
        <div class="titlebar" role="presentation" onmousedown={startDrag}>
            <div class="traffic-lights">
                <button type="button" class="dot dot-red" onclick={close} aria-label="Close preview window" title="Close">
                    <span class="dot-symbol">&times;</span>
                </button>
                <button type="button" class="dot dot-yellow" aria-label="Minimize" title="Minimize">
                    <span class="dot-symbol">&ndash;</span>
                </button>
                <button type="button" class="dot dot-green" aria-label="Zoom" title="Zoom">
                    <span class="dot-symbol">&plus;</span>
                </button>
            </div>
            <span class="window-title">{title}</span>
            <div class="titlebar-end"></div>
        </div>
        <div class="terminal-body">
            <InteractiveTerminalDom {onCwdChange} />
        </div>
    </div>
{/if}

<style>
.ghostty-window {
    position: fixed;
    z-index: 1000;
    width: 680px;
    height: 480px;
    display: flex;
    flex-direction: column;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid var(--border-level-1);
    /* box-shadow: 0 22px 70px 8px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(255, 255, 255, 0.07) inset; */
    box-shadow: 0 0 20px -1px rgba(0,0,0,0.7);
    pointer-events: all;
    background: var(--config-bg);
}

.ghostty-window::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    box-shadow: 0 0 1px white inset;
    border-radius: inherit;
    z-index: 2;
    pointer-events: none;
}

.titlebar {
    height: 38px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    padding: 0 12px;
    /* background: #2A2434; */
    border-bottom: 1px solid transparent;
    cursor: grab;
    user-select: none;
    transition: border-color 250ms cubic-bezier(0, 0.3, 0.7, 1);
}

.titlebar:active {
    cursor: grabbing;
    border-bottom: 1px solid var(--border-level-1);
}

.traffic-lights {
    display: flex;
    gap: 8px;
    flex-shrink: 0;
}

.dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    padding: 0;
}

.dot-red {background: #FF5F57;}
.dot-yellow {background: #FEBC2E;}
.dot-green {background: #28C840;}

.dot-symbol {
    /* font-size: 8px; */
    line-height: 1;
    color: rgba(0, 0, 0, 0);
    font-weight: 400;
    margin-top: -3px;
}

.traffic-lights:hover .dot-symbol {
    color: rgba(0, 0, 0, 0.6);
}

.window-title {
    flex: 1;
    text-align: center;
    /* font-size: 0.75rem; */
    font-weight: 700;
    /* color: rgba(235, 230, 238, 0.6); */
    pointer-events: none;
}

.titlebar-end {
    width: 52px;
    flex-shrink: 0;
}

.terminal-body {
    flex: 1;
    overflow: hidden;
    min-height: 0;
}
</style>
