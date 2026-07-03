<script lang="ts">
    import GhosttyIcon from "./GhosttyIcon.svelte";
    import {desktop} from "$lib/platform";
    import {error} from "$lib/stores/toasts.svelte";
    import {withPendingGuard} from "$lib/utils/debounce";

    // Desktop counterpart to the web build's fake macOS dock. The dock exists to launch the
    // in-browser terminal *preview*; on desktop there is a real Ghostty to launch instead, so
    // this is a single affordance that shells out through the Wails bridge.
    const launch = withPendingGuard(async () => {
        try {
            await desktop.launchTerminal();
        }
        catch {
            error("Couldn't launch Ghostty. Make sure it's installed and on your PATH.");
        }
    });
</script>

<div class="launcher-layer">
    <button type="button" class="launcher" onclick={launch} title="Launch Ghostty" aria-label="Launch Ghostty terminal">
        <div class="launcher-icon">
            <GhosttyIcon width="30px" height="30px" />
        </div>
        <span class="launcher-label">Launch Ghostty</span>
    </button>
</div>

<style>
.launcher-layer {
    position: fixed;
    bottom: 16px;
    right: 16px;
    display: flex;
    z-index: 500;
    pointer-events: none;
}

.launcher {
    pointer-events: all;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 14px 6px 8px;
    border: 1px solid var(--border-level-2);
    border-radius: 999px;
    background: var(--bg-level-3);
    color: var(--font-color);
    cursor: pointer;
    font-weight: 500;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
    transition: transform 0.12s ease, filter 0.12s ease;
}

.launcher:hover {
    filter: brightness(1.12);
    transform: translateY(-2px);
}

.launcher:active {
    transform: translateY(0);
}

.launcher-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4));
}

.launcher-label {
    white-space: nowrap;
}
</style>
