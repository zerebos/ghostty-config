<script lang="ts">
    import type {Snippet} from "svelte";
    import {createTooltipAttachment} from "$lib/attachments/tooltip";
    import type {GhosttyPlatform} from "$lib/data/ghostty-schema";

    interface Props {
        name?: string;
        note?: string;
        platform?: GhosttyPlatform[];
        since?: string;
        children: Snippet;
        onReset?: () => void;
        isNonDefault?: boolean;
    }

    const {name = "", note = "", platform, since, children, onReset, isNonDefault = false}: Props = $props();
    const tooltipAttachment = createTooltipAttachment("Reset to default");


     const platformLabelMap: Record<GhosttyPlatform, string> = {
        "macos": "macOS",
        "linux": "Linux",
        "gtk": "GTK",
        "gtk-wayland": "GTK Wayland",
        "gtk-x11": "GTK X11"
    };

    const platformLabels = $derived(
        platform?.map((value) => platformLabelMap[value]).filter(Boolean) ?? []
    );

    const metadataBadges = $derived.by(() => {
        const badges: string[] = [];
        if (platformLabels.length === 1) badges.push(platformLabels[0]);
        else if (platformLabels.length > 1) badges.push(`${platformLabels.length} platforms`);
        if (since) badges.push(`New in ${since}`);
        return badges;
    });

    const metadataTooltip = $derived.by(() => {
        const lines: string[] = [];
        if (platformLabels.length > 0) lines.push(`Available on: ${platformLabels.join(", ")}`);
        if (since) lines.push(`Introduced in Ghostty ${since}`);
        return lines.join("\n");
    });

    const metadataTooltipAttachment = createTooltipAttachment(() => metadataTooltip);
</script>

<div class="setting-item">
    <div class="row">
        {#if name}
        <div class="setting-name-wrapper">
            <div class="setting-name">{name}</div>
            {#if metadataBadges.length > 0}
                <div class="metadata" aria-label="Setting metadata">
                    {#each metadataBadges as badge (badge)}
                        <span class="metadata-badge">{badge}</span>
                    {/each}
                    <button type="button" class="metadata-info" aria-label="More metadata information" {@attach metadataTooltipAttachment}>i</button>
                </div>
            {/if}
            {#if isNonDefault && onReset}
            <div class="reset-button-wrapper">
                <button
                    class="reset-button"
                    onclick={onReset}
                    title="Reset to default"
                    type="button"
                    {@attach tooltipAttachment}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M9 14 4 9l5-5" />
                        <path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11" />
                    </svg>
                </button>
            </div>
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


<style>
.setting-item {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.setting-item .row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}

.setting-name-wrapper {
    display: flex;
    align-items: center;
    gap: 6px;
}

.setting-name {
    font-weight: 500;
}

.metadata {
    display: inline-flex;
    align-items: center;
    gap: 5px;
}

.metadata-badge {
    display: inline-flex;
    align-items: center;
    border-radius: 999px;
    border: 1px solid var(--border-level-3);
    background: color-mix(in srgb, var(--bg-level-3) 92%, transparent);
    color: var(--font-color-muted);
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.01em;
    line-height: 1;
    padding: 3px 7px;
}

.metadata-info {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 1px solid var(--border-level-3);
    background: color-mix(in srgb, var(--bg-level-3) 90%, transparent);
    color: var(--font-color-muted);
    font-size: 0.65rem;
    font-weight: 700;
    cursor: help;
    user-select: none;
}

.metadata-info:focus-visible,
.metadata-info:hover {
    border-color: var(--color-input-accent);
    color: var(--font-color);
    outline: none;
}

.reset-button-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

.reset-button {
    background: none;
    border: none;
    /* padding: 4px; */
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-level-5);
    color: var(--font-color-muted);
    transition: all 150ms cubic-bezier(0.2, 0, 0.38, 0.9);
    outline: none;
}

.reset-button:focus-visible {
    outline: var(--border-input-focus);
}

.reset-button:hover {
    background-color: var(--bg-level-2);
    color: var(--font-color);
}

.reset-button:active {
    transform: scale(0.95);
}

.reset-button svg {
    width: 14px;
    height: 14px;
    stroke-width: 2.5;
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
</style>