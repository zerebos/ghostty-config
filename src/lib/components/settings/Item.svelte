<script lang="ts">
    import type {Snippet} from "svelte";
    import {scale} from "svelte/transition";
    import {getSettingDescription} from "$lib/utils/schema";

    const {name = "", note = "", settingId = "", children}: {name?: string, note?: string, settingId?: string, children: Snippet} = $props();

    const description = $derived(settingId ? getSettingDescription(settingId) : undefined);

    let showInfo = $state(false);
    let hideTimeout: ReturnType<typeof setTimeout> | undefined;
    let iconEl: HTMLSpanElement | undefined = $state();
    let popoverStyle = $state("");

    function updatePosition() {
        if (!iconEl) return;
        const rect = iconEl.getBoundingClientRect();
        const popoverWidth = 320;

        let left = rect.left;
        if (left + popoverWidth > window.innerWidth - 12) {
            left = window.innerWidth - popoverWidth - 12;
        }

        popoverStyle = `top: ${rect.bottom + 8}px; left: ${left}px;`;
    }

    function handleMouseEnter() {
        clearTimeout(hideTimeout);
        updatePosition();
        showInfo = true;
    }

    function handleMouseLeave() {
        hideTimeout = setTimeout(() => { showInfo = false; }, 150);
    }
</script>

<div class="setting-item">
    <div class="row">
        {#if name}
            <div class="setting-name">
                {name}
                {#if description}
                    <!-- svelte-ignore a11y_no_static_element_interactions -->
                    <span
                        class="info-btn"
                        bind:this={iconEl}
                        onmouseenter={handleMouseEnter}
                        onmouseleave={handleMouseLeave}
                        aria-label="More info about {name}"
                    >
                        <svg width="8" height="8" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm1 12H7V7h2v5zM8 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
                        </svg>
                    </span>
                {/if}
            </div>
        {/if}
        <div class="setting">{@render children()}</div>
    </div>
    {#if note}
    <div class="note">
        {note}
    </div>
    {/if}
</div>

{#if showInfo && description}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        class="info-popover"
        style={popoverStyle}
        onmouseenter={() => clearTimeout(hideTimeout)}
        onmouseleave={handleMouseLeave}
        transition:scale={{duration: 150, start: 0.95}}
    >
        {description}
    </div>
{/if}


<style>
.setting-item {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.setting-item .row {
    display: flex;
    justify-content: space-between;
}

.setting-name {
    /* font-weight: 500; */
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    gap: 4px;
}

.setting {
    display: flex;
    flex: 1;
    justify-content: flex-end;
}

.note {
    color: var(--font-color-muted);
    font-size: 0.9rem;
}

.info-btn {
    color: var(--font-color-muted);
    cursor: help;
    line-height: 1;
    display: inline-flex;
    align-items: center;
    transition: color 0.15s;
}

.info-btn:hover {
    color: var(--font-color-accent);
}

.info-popover {
    position: fixed;
    z-index: 100;
    width: 320px;
    border-radius: var(--radius-level-2);
    background: rgba(from var(--bg-level-1) r g b / 0.85);
    backdrop-filter: blur(20px);
    color: var(--font-color);
    padding: 12px;
    border: 1px solid var(--border-level-1);
    box-shadow:
        0 0 20px -1px rgba(0, 0, 0, 0.7),
        0 0 1px white inset;
    font-size: 0.85rem;
    line-height: 1.5;
    white-space: pre-line;
    transform-origin: top left;
    pointer-events: auto;
}
</style>
