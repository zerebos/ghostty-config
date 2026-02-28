<script lang="ts">
    import {onMount} from "svelte";
    import InteractiveTerminalDom from "$lib/views/InteractiveTerminalDom.svelte";
    import app from "$lib/stores/state.svelte";

    const DEFAULT_WIDTH = 680;
    const DEFAULT_HEIGHT = 480;
    const MIN_WIDTH = 420;
    const MIN_HEIGHT = 280;
    const MINIMIZE_DURATION = 280;
    const RESTORE_DURATION = 260;

    type ResizeDirection = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

    let x = $state(0);
    let y = $state(0);
    let width = $state(DEFAULT_WIDTH);
    let height = $state(DEFAULT_HEIGHT);
    let dragging = $state(false);
    let resizing = $state(false);
    let animating = $state(false);
    let resizeDirection: ResizeDirection | null = null;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    let resizeStartX = 0;
    let resizeStartY = 0;
    let startWidth = DEFAULT_WIDTH;
    let startHeight = DEFAULT_HEIGHT;
    let startLeft = 0;
    let startTop = 0;
    let windowElement = $state<HTMLDivElement | null>(null);

    onMount(() => {
        x = Math.max(0, (window.innerWidth - width) / 2);
        y = Math.max(0, (window.innerHeight - height) / 3);
    });

    function startDrag(e: MouseEvent) {
        if (resizing || animating || !app.floatingTerminalVisible) return;
        dragging = true;
        dragOffsetX = e.clientX - x;
        dragOffsetY = e.clientY - y;
    }

    function startResize(e: MouseEvent, direction: ResizeDirection) {
        if (animating || !app.floatingTerminalVisible) return;
        e.preventDefault();
        e.stopPropagation();
        resizing = true;
        resizeDirection = direction;
        resizeStartX = e.clientX;
        resizeStartY = e.clientY;
        startWidth = width;
        startHeight = height;
        startLeft = x;
        startTop = y;
    }

    $effect(() => {
        if (!dragging && !resizing) return;

        function onMove(e: MouseEvent) {
            if (dragging) {
                x = Math.max(0, Math.min(window.innerWidth - width, e.clientX - dragOffsetX));
                y = Math.max(0, Math.min(window.innerHeight - height, e.clientY - dragOffsetY));
                return;
            }

            if (!resizing || !resizeDirection) return;

            const dx = e.clientX - resizeStartX;
            const dy = e.clientY - resizeStartY;

            let nextX = startLeft;
            let nextY = startTop;
            let nextWidth = startWidth;
            let nextHeight = startHeight;

            if (resizeDirection.includes("e")) {
                nextWidth = startWidth + dx;
            }

            if (resizeDirection.includes("s")) {
                nextHeight = startHeight + dy;
            }

            if (resizeDirection.includes("w")) {
                nextWidth = startWidth - dx;
                nextX = startLeft + dx;
            }

            if (resizeDirection.includes("n")) {
                nextHeight = startHeight - dy;
                nextY = startTop + dy;
            }

            if (resizeDirection.includes("w") && nextWidth < MIN_WIDTH) {
                nextX = startLeft + (startWidth - MIN_WIDTH);
                nextWidth = MIN_WIDTH;
            }
            else {
                nextWidth = Math.max(MIN_WIDTH, nextWidth);
            }

            if (resizeDirection.includes("n") && nextHeight < MIN_HEIGHT) {
                nextY = startTop + (startHeight - MIN_HEIGHT);
                nextHeight = MIN_HEIGHT;
            }
            else {
                nextHeight = Math.max(MIN_HEIGHT, nextHeight);
            }

            if (nextX < 0) {
                if (resizeDirection.includes("w")) {
                    nextWidth += nextX;
                }
                nextX = 0;
            }

            if (nextY < 0) {
                if (resizeDirection.includes("n")) {
                    nextHeight += nextY;
                }
                nextY = 0;
            }

            nextWidth = Math.max(MIN_WIDTH, Math.min(nextWidth, window.innerWidth - nextX));
            nextHeight = Math.max(MIN_HEIGHT, Math.min(nextHeight, window.innerHeight - nextY));

            x = nextX;
            y = nextY;
            width = nextWidth;
            height = nextHeight;
        }

        function onUp() {
            dragging = false;
            resizing = false;
            resizeDirection = null;
        }

        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
        return () => {
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);
        };
    });

    function clearAnimationStyles() {
        windowElement?.style.removeProperty("transform");
        windowElement?.style.removeProperty("opacity");
    }

    function shouldReduceMotion() {
        return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }

    function getDockButtonRect() {
        const dockButton = document.getElementById("ghostty-terminal-dock-button");
        return dockButton?.getBoundingClientRect() ?? null;
    }

    async function animateDockTransition(mode: "minimize" | "restore") {
        if (!windowElement) return false;

        const dockRect = getDockButtonRect();
        if (!dockRect) return false;

        const sourceRect = windowElement.getBoundingClientRect();
        const deltaX = (dockRect.left + dockRect.width / 2) - (sourceRect.left + sourceRect.width / 2);
        const deltaY = (dockRect.top + dockRect.height / 2) - (sourceRect.top + sourceRect.height / 2);
        const scaleX = Math.max(0.12, dockRect.width / sourceRect.width);
        const scaleY = Math.max(0.12, dockRect.height / sourceRect.height);

        const keyframes = mode === "minimize"
            ? [
                {transform: "translate3d(0px, 0px, 0px) scale(1, 1)", opacity: 1},
                {transform: `translate3d(${deltaX}px, ${deltaY}px, 0px) scale(${scaleX}, ${scaleY})`, opacity: 0.18},
            ]
            : [
                {transform: `translate3d(${deltaX}px, ${deltaY}px, 0px) scale(${scaleX}, ${scaleY})`, opacity: 0.18},
                {transform: "translate3d(0px, 0px, 0px) scale(1, 1)", opacity: 1},
            ];

        const animation = windowElement.animate(keyframes, {
            duration: mode === "minimize" ? MINIMIZE_DURATION : RESTORE_DURATION,
            easing: mode === "minimize"
                ? "cubic-bezier(0.18, 0.9, 0.22, 1)"
                : "cubic-bezier(0.2, 0.8, 0.2, 1)",
            fill: "both",
        });

        try {
            await animation.finished;
            return true;
        }
        catch {
            return false;
        }
        finally {
            animation.cancel();
            clearAnimationStyles();
        }
    }

    async function minimize() {
        if (!app.floatingTerminalRunning || app.floatingTerminalMinimized || animating) return;

        dragging = false;
        resizing = false;
        resizeDirection = null;
        app.floatingTerminalRestoreRequested = false;

        if (shouldReduceMotion()) {
            app.floatingTerminalVisible = false;
            app.floatingTerminalMinimized = true;
            app.floatingTerminalRestoreRequested = false;
            return;
        }

        animating = true;
        await animateDockTransition("minimize");
        animating = false;

        if (!app.floatingTerminalRunning) return;

        app.floatingTerminalVisible = false;
        app.floatingTerminalMinimized = true;
    }

    $effect(() => {
        if (!app.floatingTerminalRestoreRequested || !app.floatingTerminalRunning || app.floatingTerminalMinimized) return;

        app.floatingTerminalRestoreRequested = false;
        if (shouldReduceMotion()) return;

        let canceled = false;
        void (async () => {
            animating = true;
            await animateDockTransition("restore");
            if (!canceled) {
                animating = false;
            }
        })();

        return () => {
            canceled = true;
            animating = false;
            clearAnimationStyles();
        };
    });

    function close() {
        dragging = false;
        resizing = false;
        resizeDirection = null;
        animating = false;
        clearAnimationStyles();
        app.floatingTerminalRunning = false;
        app.floatingTerminalVisible = false;
        app.floatingTerminalMinimized = false;
        app.floatingTerminalRestoreRequested = false;
    }

    let title = $state(`Ghostty — Interactive Preview`);
    function onCwdChange(cwd: string) {
        title = `${cwd}`;
    }
</script>

{#if app.floatingTerminalRunning}
    <div
        bind:this={windowElement}
        class="ghostty-window"
        class:minimized={!app.floatingTerminalVisible && !animating}
        style:left={`${x}px`}
        style:top={`${y}px`}
        style:width={`${width}px`}
        style:height={`${height}px`}
        style:cursor={dragging ? "grabbing" : "default"}
        role="dialog"
        aria-label="Interactive terminal preview"
        aria-hidden={!app.floatingTerminalVisible && !animating}
        aria-modal="false"
    >
        <div class="titlebar" role="presentation" onmousedown={startDrag}>
            <div class="traffic-lights">
                <button type="button" class="dot dot-red" onclick={close} aria-label="Close preview window" title="Close">
                    <span class="dot-symbol">&times;</span>
                </button>
                <button type="button" class="dot dot-yellow" onclick={minimize} aria-label="Minimize" title="Minimize">
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

        <div class="resize-handle resize-n" onmousedown={(e) => startResize(e, "n")} aria-hidden="true"></div>
        <div class="resize-handle resize-s" onmousedown={(e) => startResize(e, "s")} aria-hidden="true"></div>
        <div class="resize-handle resize-e" onmousedown={(e) => startResize(e, "e")} aria-hidden="true"></div>
        <div class="resize-handle resize-w" onmousedown={(e) => startResize(e, "w")} aria-hidden="true"></div>
        <div class="resize-handle resize-ne" onmousedown={(e) => startResize(e, "ne")} aria-hidden="true"></div>
        <div class="resize-handle resize-nw" onmousedown={(e) => startResize(e, "nw")} aria-hidden="true"></div>
        <div class="resize-handle resize-se" onmousedown={(e) => startResize(e, "se")} aria-hidden="true"></div>
        <div class="resize-handle resize-sw" onmousedown={(e) => startResize(e, "sw")} aria-hidden="true"></div>
    </div>
{/if}

<style>
.ghostty-window {
    position: fixed;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid var(--border-level-1);
    /* box-shadow: 0 22px 70px 8px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(255, 255, 255, 0.07) inset; */
    box-shadow: 0 0 20px -1px rgba(0,0,0,0.7);
    pointer-events: all;
    background: var(--config-bg);
    transform-origin: center center;
}

.ghostty-window.minimized {
    opacity: 0;
    pointer-events: none;
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

.resize-handle {
    position: absolute;
    z-index: 3;
}

.resize-n,
.resize-s {
    left: 10px;
    right: 10px;
    height: 8px;
}

.resize-n {
    top: -4px;
    cursor: ns-resize;
}

.resize-s {
    bottom: -4px;
    cursor: ns-resize;
}

.resize-e,
.resize-w {
    top: 10px;
    bottom: 10px;
    width: 8px;
}

.resize-e {
    right: -4px;
    cursor: ew-resize;
}

.resize-w {
    left: -4px;
    cursor: ew-resize;
}

.resize-ne,
.resize-nw,
.resize-se,
.resize-sw {
    width: 12px;
    height: 12px;
}

.resize-ne {
    top: -4px;
    right: -4px;
    cursor: nesw-resize;
}

.resize-nw {
    top: -4px;
    left: -4px;
    cursor: nwse-resize;
}

.resize-se {
    right: -4px;
    bottom: -4px;
    cursor: nwse-resize;
}

.resize-sw {
    left: -4px;
    bottom: -4px;
    cursor: nesw-resize;
}
</style>
