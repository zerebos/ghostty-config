<script lang="ts">
    import {fly} from "svelte/transition";

    import {isFilterActive, isPlatformSelected, togglePlatform, clearFilter, type FilterPlatform} from "$lib/stores/filter.svelte";


    let isOpen = $state(false);
    let rootEl = $state<HTMLDivElement>();

    const platforms: Array<{id: FilterPlatform; label: string}> = [
        {id: "macos", label: "macOS"},
        {id: "linux", label: "Linux"}
    ];

    const active = $derived(isFilterActive());

    function toggle() {
        isOpen = !isOpen;
    }

    // Close when clicking outside the trigger/popover.
    $effect(() => {
        if (!isOpen || !rootEl) return;

        const onPointerDown = (event: MouseEvent) => {
            if (!rootEl?.contains(event.target as Node)) isOpen = false;
        };
        const onKeydown = (event: KeyboardEvent) => {
            if (event.key === "Escape") isOpen = false;
        };

        window.addEventListener("mousedown", onPointerDown);
        window.addEventListener("keydown", onKeydown);
        return () => {
            window.removeEventListener("mousedown", onPointerDown);
            window.removeEventListener("keydown", onKeydown);
        };
    });
</script>

<div class="platform-filter" bind:this={rootEl}>
    <button
        class="filter-trigger"
        class:active
        class:open={isOpen}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label="Filter settings by platform"
        title="Filter settings by platform"
        onclick={toggle}
    >
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 3H2l8 9.46V19l4 2v-8.54z" />
        </svg>
        {#if active}<span class="active-dot" aria-hidden="true"></span>{/if}
    </button>

    {#if isOpen}
        <div class="popover" role="dialog" aria-label="Platform filter" transition:fly={{y: -6, duration: 120}}>
            <div class="popover-header">
                <span class="popover-title">Filter by platform</span>
                {#if active}
                    <button class="clear-button" type="button" onclick={clearFilter}>Show all</button>
                {/if}
            </div>
            <p class="popover-hint">Hide settings that don't apply to your platform. This only affects what's shown — your exported config is unchanged.</p>
            <div class="pills">
                {#each platforms as platform (platform.id)}
                    <button
                        class="pill"
                        class:selected={isPlatformSelected(platform.id)}
                        type="button"
                        aria-pressed={isPlatformSelected(platform.id)}
                        onclick={() => togglePlatform(platform.id)}
                    >
                        {platform.label}
                    </button>
                {/each}
            </div>
        </div>
    {/if}
</div>

<style>
.platform-filter {
    position: relative;
    display: inline-flex;
    margin-left: auto;
}

.filter-trigger {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
    height: 18px;
    width: 18px;
    padding: 0;
    border: 0;
    border-radius: var(--radius-level-5);
    background: transparent;
    color: var(--font-color-muted);
    cursor: pointer;
    transition: color 100ms ease, background 100ms ease;
}

.filter-trigger svg {
    height: 14px;
    width: 14px;
}

.filter-trigger:hover,
.filter-trigger.open {
    color: var(--font-color);
    background: rgba(255, 255, 255, 0.1);
}

.filter-trigger.active {
    color: var(--font-color);
}

.active-dot {
    position: absolute;
    top: -1px;
    right: -1px;
    height: 6px;
    width: 6px;
    border-radius: 50%;
    background: var(--color-input-accent, var(--color-success));
    box-shadow: 0 0 0 1.5px rgba(0, 0, 0, 0.35);
}

.popover {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    z-index: 9999;
    width: 240px;
    padding: 12px;
    border-radius: var(--radius-level-3);
    border: 1px solid var(--border-level-2);
    background: color-mix(in srgb, var(--bg-level-2) 85%, black);
    backdrop-filter: blur(10px);
    box-shadow:
        0 8px 20px rgba(0, 0, 0, 0.45),
        0 0 0 1px rgba(255, 255, 255, 0.06) inset;
}

.popover-header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 8px;
}

.popover-title {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--font-color);
}

.clear-button {
    border: 0;
    background: transparent;
    color: var(--color-input-accent, var(--font-color-muted));
    font-size: 0.75rem;
    padding: 0;
    cursor: pointer;
}

.clear-button:hover {
    text-decoration: underline;
}

.popover-hint {
    margin: 4px 0 10px;
    font-size: 0.75rem;
    line-height: 1.35;
    color: var(--font-color-muted);
}

.pills {
    display: flex;
    gap: 6px;
}

.pill {
    flex: 1;
    padding: 6px 10px;
    border: 1px solid var(--border-level-2);
    border-radius: var(--radius-level-5);
    background: var(--bg-level-3);
    color: var(--font-color);
    font-size: 0.85rem;
    cursor: pointer;
    transition: background 100ms ease, border-color 100ms ease;
}

.pill:hover {
    border-color: var(--color-input-accent);
}

.pill.selected {
    background: color-mix(in srgb, var(--color-selected) 70%, transparent);
    border-color: var(--color-input-accent);
}
</style>
