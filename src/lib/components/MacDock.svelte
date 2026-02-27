<script lang="ts">
    import FloatingTerminal from "$lib/components/FloatingTerminal.svelte";
    import app from "$lib/stores/state.svelte";

    import appIcon from "$lib/images/icon.webp";
    import ghosttyIcon from "$lib/images/tabs/ghostty.webp";

    function toggleTerminal() {
        app.floatingTerminalOpen = !app.floatingTerminalOpen;
    }
</script>

<div class="dock-layer">
    <FloatingTerminal />
    <div class="dock" role="toolbar" aria-label="macOS-style dock">
        <!-- Ghostty Config icon — always running -->
        <div class="dock-item" title="Ghostty Config">
            <div class="dock-icon-wrap">
                <img src={appIcon} alt="Ghostty Config" class="dock-icon" />
            </div>
            <div class="running-dot"></div>
        </div>

        <div class="dock-separator" role="separator"></div>

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
                <img src={ghosttyIcon} alt="Ghostty" class="dock-icon" />
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
    pointer-events: all;
    display: flex;
    align-items: flex-end;
    gap: 6px;
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
    gap: 3px;
    position: relative;
}

.dock-btn {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
}

.dock-icon-wrap {
    width: 52px;
    height: 52px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.15s ease;
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
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4));
}

.running-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.9);
    flex-shrink: 0;
}

.running-dot.hidden {
    visibility: hidden;
}

.dock-separator {
    width: 1px;
    height: 36px;
    background: rgba(255, 255, 255, 0.2);
    align-self: center;
    margin: 0 2px;
}
</style>
