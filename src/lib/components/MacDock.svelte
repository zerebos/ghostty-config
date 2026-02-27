<script lang="ts">
    import FloatingTerminal from "$lib/components/FloatingTerminal.svelte";
    import app from "$lib/stores/state.svelte";

    import appIcon from "$lib/images/icon.webp";
    import GhosttyIcon from "./GhosttyIcon.svelte";

    function toggleTerminal() {
        app.floatingTerminalOpen = !app.floatingTerminalOpen;
    }

    const tileSize = $state(48);
    const dockHeight = $derived((tileSize + 30));
    const ghosttyTileSize = $derived(Math.floor(tileSize * (1024 / 832)));
</script>

<div class="dock-layer">
    <FloatingTerminal />
    <div class="dock" role="toolbar" aria-label="macOS-style dock" style:height={`${dockHeight}px`}>
        <!-- Ghostty Config icon — always running -->
        <div class="dock-item dock-btn" title="Ghostty Config">
            <div class="dock-icon-wrap">
                <img src={appIcon} alt="Ghostty Config" class="dock-icon" />
            </div>
            <div class="running-dot"></div>
        </div>

        <!-- <div class="dock-separator" role="separator"></div> -->

        <!-- Ghostty terminal preview — running when floatingTerminalOpen -->
        <button
            type="button"
            class="dock-item dock-btn"
            title="Live Preview Terminal"
            onclick={toggleTerminal}
            aria-label="Toggle live preview terminal"
            aria-pressed={app.floatingTerminalOpen}
        >
            <div class="dock-icon-wrap">
                <!--
                    Using the <GhosttyIcon> component here allows the dock icon to reflect the user's current icon settings.

                    The size discrepency is because the official icon images have a transparent padding around them
                    so they appear smaller than you might expect. There are 96px gaps on each edge so by doing
                    1024 / (1024 - (96 * 2)) we get 1024 / 832 or 1.2307692307692308, and with a target size of 48px
                    we get 48 * 1.2307692307692308 ≈ 59px.
                -->
                <GhosttyIcon width={`${ghosttyTileSize}px`} height={`${ghosttyTileSize}px`} />
            </div>
            {#if app.floatingTerminalOpen}
                <div class="running-dot"></div>
            {:else}
                <div class="running-dot hidden"></div>
            {/if}
        </button>
    </div>
</div>

<style>
.dock-layer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    pointer-events: none;
    z-index: 500;
    padding-bottom: 8px;
}

.dock {
    height: 86px;
    pointer-events: all;
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 8px 14px;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 18px;
    box-shadow:
        0 8px 32px rgba(0, 0, 0, 0.4),
        0 0 0 1px rgba(0, 0, 0, 0.15) inset;
}

.dock-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    /* gap: 3px; */
    /* position: relative; */
}

.dock-btn {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    /* position: relative; */
}

.dock-icon-wrap {
    width: 52px;
    height: 52px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.15s ease;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4));
}

.dock-btn:hover .dock-icon-wrap {
    transform: translateY(-6px) scale(1.15);
}

.dock-btn:active .dock-icon-wrap {
    transform: translateY(-2px) scale(1.05);
}

.dock-icon {
    width: 48px;
    height: 48px;
    object-fit: contain;
    border-radius: 11px;
    /* filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4)); */
}

.running-dot {
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    flex-shrink: 0;
    position: absolute;
    bottom: 3px;
}

.running-dot.hidden {
    visibility: hidden;
}

.dock-separator {
    width: 1px;
    height: 90%;
    background: rgba(255, 255, 255, 0.2);
    align-self: center;
    margin: 0 12px;
}
</style>
