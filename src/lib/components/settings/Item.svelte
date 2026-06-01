<script lang="ts">
    import {onMount, type Snippet} from "svelte";
    import {createTooltipAttachment} from "$lib/attachments/tooltip";
    import type {GhosttyPlatform} from "$lib/data/ghostty-schema";
    import {alert} from "$lib/stores/modals.svelte";

    interface Props {
        name?: string;
        note?: string;
        platform?: GhosttyPlatform[];
        since?: string;
        schemaDescription?: string;
        children: Snippet;
        onReset?: () => void;
        isNonDefault?: boolean;
    }

    const {name = "", note = "", platform, since, schemaDescription, children, onReset, isNonDefault = false}: Props = $props();
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

        type RuntimePlatform = "macos" | "linux" | "other";

    let runtimePlatform = $state<RuntimePlatform>("other");

    onMount(() => {
        const userAgent = navigator.userAgent.toLowerCase();
        if (userAgent.includes("mac")) runtimePlatform = "macos";
        else if (userAgent.includes("linux")) runtimePlatform = "linux";
        else runtimePlatform = "other";
    });

    const supportedPlatformsByRuntime: Record<RuntimePlatform, GhosttyPlatform[]> = {
        macos: ["macos"],
        linux: ["linux", "gtk", "gtk-wayland", "gtk-x11"],
        other: []
    };

    const isUnsupportedOnCurrentOS = $derived.by(() => {
        if (!platform || platform.length === 0) return false;
        if (runtimePlatform === "other") return true;
        const supported = supportedPlatformsByRuntime[runtimePlatform];
        return !platform.some((value) => supported.includes(value));
    });

    const getPlatformBadgeLabel = (labels: string[]) => {
        if (labels.length === 0) return "";
        if (labels.length === 1) return labels[0];
        return `${labels[0]} +${labels.length - 1}`;
    };

    // const parseVersion = (version: string) =>
    //     version
    //         .split(".")
    //         .map((part) => Number.parseInt(part, 10))
    //         .map((num) => Number.isFinite(num) ? num : 0);

    const isSinceVisible = $derived.by(() => {
        // if (!since) return false;
        // if (!versionBaseline) return true;

        // const settingParts = parseVersion(since);
        // const baselineParts = parseVersion(versionBaseline);
        // const maxLen = Math.max(settingParts.length, baselineParts.length);

        // for (let i = 0; i < maxLen; i++) {
        //     const settingNum = settingParts[i] ?? 0;
        //     const baselineNum = baselineParts[i] ?? 0;
        //     if (settingNum > baselineNum) return true;
        //     if (settingNum < baselineNum) return false;
        // }

        // return false;
        return !!since;
    });

    const metadataBadges = $derived.by(() => {
        const badges: Array<{label: string, type: "unsupported" | "platform" | "version"}> = [];
        if (isUnsupportedOnCurrentOS) badges.push({label: "Not available on this OS", type: "unsupported"});
        const platformBadge = getPlatformBadgeLabel(platformLabels);
        if (platformBadge) badges.push({label: platformBadge, type: "platform"});
        if (isSinceVisible) badges.push({label: `New in ${since}`, type: "version"});
        return badges;
    });

    const getBadgeTooltip = (badge: {label: string, type: "unsupported" | "platform" | "version"}) => {
        switch (badge.type) {
            case "unsupported":
                return "Not available on your current operating system";
            case "platform":
                return platformLabels.length > 1 ? `Available on: ${platformLabels.join(", ")}` : `Platform: ${platformLabels[0]}`;
            case "version":
                return `Introduced in Ghostty ${since}`;
            default:
                return "";
        }
    };

    const metadataBadgesWithTooltips = $derived.by(() =>
        metadataBadges.map((badge) => ({
            ...badge,
            key: `${badge.type}-${badge.label}`,
            tooltipAttachment: createTooltipAttachment(() => getBadgeTooltip(badge))
        }))
    );
</script>

<div class="setting-item">
    <div class="row">
        {#if name}
        <div class="row-left">
            <div class="setting-name">{name}</div>
            {#if metadataBadgesWithTooltips.length > 0 || schemaDescription}
                <div class="metadata" aria-label="Setting metadata">
                    {#each metadataBadgesWithTooltips as badge (badge.key)}
                        <span
                            class="metadata-badge"
                            class:warning={badge.type === "unsupported"}
                            class:version={badge.type === "version"}
                            role="img"
                            aria-label={badge.label}
                            {@attach badge.tooltipAttachment}
                        >{badge.label}</span>
                    {/each}
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
        <div class="row-right">
            <div class="setting">{@render children()}</div>
            {#if schemaDescription}
                <button type="button" class="setting-info" aria-label="Full description" onclick={() => alert({title: name, message: schemaDescription})}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 16v-4" />
                        <path d="M12 8h.01" />
                    </svg>
                </button>
            {/if}
        </div>
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

.row-left {
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
    cursor: default;
}

.metadata-badge.warning {
    color: #f8dca4;
    border-color: color-mix(in srgb, var(--color-warning) 65%, #000);
    background: color-mix(in srgb, var(--color-warning) 18%, transparent);
}

.metadata-badge.version {
    color: color-mix(in srgb, var(--color-input-accent) 90%, #fff);
    border-color: color-mix(in srgb, var(--color-input-accent) 45%, transparent);
    background: color-mix(in srgb, var(--color-input-accent) 12%, transparent);
}

.setting-info {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    border: 0;
    padding: 0;
    background: none;
    color: var(--font-color-muted);
    cursor: pointer;
}

.setting-info svg {
    width: 16px;
    height: 16px;
}

.setting-info:focus-visible,
.setting-info:hover {
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

.row-right {
    display: flex;
    align-items: center;
    flex: 1;
    justify-content: flex-end;
    gap: 10px;
}

.row-right,
.setting {
    display: flex;
}

.note {
    color: var(--font-color-muted);
    font-size: 0.9rem;
}
</style>