<script lang="ts">
    import {fly} from "svelte/transition";

    import {toAppWindow} from "$lib/attachments/portal";
    import PillButtons, {type PillOption} from "$lib/components/settings/PillButtons.svelte";
    import {isFilterActive, selectedPlatform, setPlatform, type FilterPlatform} from "$lib/stores/filter.svelte";


    const MENU_WIDTH = 240;

    let isOpen = $state(false);
    let triggerEl = $state<HTMLButtonElement>();
    let menuEl = $state<HTMLDivElement>();
    let menuPos = $state({top: 0, left: 0});

    // Single-select: "" = All (no filter). Both/neither collapse to All, so three pills cover every case needed
    const platformOptions: PillOption[] = [
        {label: "All", value: ""},
        {label: "macOS", value: "macos"},
        {label: "Linux", value: "linux"}
    ];

    const active = $derived(isFilterActive());

    function toggle() {
        isOpen = !isOpen;
    }

    // The menu is portaled into `.app-window` (via toAppWindow) to escape the sidebar's bounds,
    // so it's positioned off the trigger's rect, right-aligned under it. Both the trigger and the
    // menu share `.app-window` as their offset parent, so these coordinates stay valid and the
    // left-anchored, fixed-width sidebar keeps the trigger's offset constant across resizes.
    $effect(() => {
        if (!isOpen || !triggerEl) return;
        const origin = triggerEl.closest(".app-window")?.getBoundingClientRect() ?? {top: 0, left: 0};
        const trigger = triggerEl.getBoundingClientRect();
        menuPos = {
            top: trigger.bottom - origin.top + 8,
            left: Math.max(8, trigger.right - origin.left - MENU_WIDTH)
        };
    });

    // Close on outside click (checking both the trigger and the portaled menu) or Escape.
    $effect(() => {
        if (!isOpen) return;

        const onPointerDown = (event: MouseEvent) => {
            const target = event.target as Node;
            if (!triggerEl?.contains(target) && !menuEl?.contains(target)) isOpen = false;
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

<div class="platform-filter">
    <button
        class="filter-trigger"
        class:active
        class:open={isOpen}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label="Filter settings by platform"
        title="Filter settings by platform"
        bind:this={triggerEl}
        onclick={toggle}
    >
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 3H2l8 9.46V19l4 2v-8.54z" />
        </svg>
        {#if active}<span class="active-dot" aria-hidden="true"></span>{/if}
    </button>

    {#if isOpen}
        <div
            class="popover"
            role="dialog"
            aria-label="Filter settings"
            bind:this={menuEl}
            style:top="{menuPos.top}px"
            style:left="{menuPos.left}px"
            style:width="{MENU_WIDTH}px"
            transition:fly={{y: -6, duration: 120}}
            {@attach toAppWindow}
        >
            <div class="popover-header">
                <span class="popover-title">Filter settings</span>
            </div>
            <p class="popover-hint">Hide settings that don't apply to you. This only changes what's shown, your exported config is unchanged.</p>

            <div class="popover-divider" aria-hidden="true"></div>

            <div class="filter-section">
                <span class="section-label">Platform</span>
                <div class="section-controls">
                    <PillButtons options={platformOptions} value={selectedPlatform()} onchange={(v) => setPlatform(v as FilterPlatform | "")} />
                </div>
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

/* Clanker comment below */
/* Positioned relative to `.app-window` (the portal target); top/left/width come from inline style.
   Surface borrowed from the tooltip (frosted glass + soft outer glow + white inset hairline — the
   same signature the app-window uses), with modal-style internal structure (header + divider). */
.popover {
    position: absolute;
    z-index: 9999;
    padding: 16px;
    border-radius: var(--radius-level-3);
    border: 1px solid var(--border-level-1);
    /* Firmer than the tooltip's 0.6 glass and mixed toward black, so the panel clears the translucent sidebar it partly overlaps instead of dissolving into it. */
    background: rgba(from color-mix(in srgb, var(--bg-level-2) 85%, black) r g b / 0.85);
    backdrop-filter: blur(20px);
    box-shadow:
        0 0 20px -1px rgba(0, 0, 0, 0.7),
        0 0 1px white inset;
}

.popover-header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 8px;
}

.popover-title {
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--font-color);
}

.popover-hint {
    margin: 6px 0 0;
    font-size: 0.75rem;
    line-height: 1.35;
    color: var(--font-color-muted);
}

/* Modal-inspired hairline (cf. DialogModal's footer separator); a light-on-glass tint reads more reliably over the translucent surface than --border-separator. */
.popover-divider {
    height: 1px;
    margin: 12px 0;
    background: rgba(255, 255, 255, 0.08);
}

/* Each filter dimension is its own labelled section; add siblings (e.g. Ghostty version) here. A second section wants `margin-top` for separation (would need to add that rule alongside it). */
.filter-section {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.section-label {
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--font-color-muted);
}

.section-controls {
    display: flex;
    align-items: center;
    justify-content: flex-start;
}
</style>
