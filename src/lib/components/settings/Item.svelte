<script lang="ts">
    import {type Snippet} from "svelte";
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
        "gtk-wayland": "GTK (Wayland)",
        "gtk-x11": "GTK (X11)"
    };

    const platformLabels = $derived(
        platform?.map((value) => platformLabelMap[value]).filter(Boolean) ?? []
    );

    const getPlatformBadgeLabel = (labels: string[]) => {
        if (labels.length === 0) return "";
        if (labels.length === 1) return labels[0];
        return `${labels[0]} +${labels.length - 1}`;
    };

    const infoBadges = $derived.by(() => {
        const badges: Array<{label: string, type: "platform" | "version"}> = [];
        const platformBadge = getPlatformBadgeLabel(platformLabels);
        if (platformBadge) badges.push({label: platformBadge, type: "platform"});
        if (since) badges.push({label: since, type: "version"});
        return badges;
    });

    const getBadgeTooltip = (badge: {label: string, type: "platform" | "version"}) => {
        if (badge.type === "platform") return platformLabels.length > 1 ? `Available on: ${platformLabels.join(", ")}` : `Platform: ${platformLabels[0]}`;
        if (badge.type === "version") return `Added in Ghostty v${since}`;
        return "";
    };

    const infoBadgesWithTooltips = $derived.by(() =>
        infoBadges.map((badge) => ({
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
            {#if infoBadgesWithTooltips.length > 0 || (isNonDefault && onReset)}
                <div class="setting-extra">
                    {#each infoBadgesWithTooltips as badge (badge.key)}
                        <span
                            class="badge"
                            class:platform={badge.type === "platform"}
                            class:version={badge.type === "version"}
                            role="img"
                            aria-label={badge.label}
                            {@attach badge.tooltipAttachment}
                        >
                        {#if badge.type === "platform"}
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 56 56">
                                <path d="M0 0h56v56H0z" fill="none" />
                                <path fill="currentColor" d="M6.086 43.293h14.672l-.633 4.313h-3.21c-1.079 0-1.993.89-1.993 1.992s.914 2.015 1.992 2.015h22.172c1.078 0 1.992-.914 1.992-2.015a2.006 2.006 0 0 0-1.992-1.992h-3.21l-.634-4.313h14.672c4.008 0 6.023-1.922 6.023-6.023V10.41c0-4.101-2.015-6.023-6.023-6.023H6.086C2.078 4.387.6 6.309.6 10.41v26.86c0 4.101 1.478 6.023 5.486 6.023M4.844 32.981c-.703 0-1.008-.282-1.008-1.008V10.48c0-1.665.727-2.32 2.32-2.32h43.688c1.617 0 2.32.655 2.32 2.32v21.492c0 .726-.305 1.008-1.008 1.008ZM28 40.973c-1.172 0-2.18-.985-2.18-2.18c0-1.148 1.008-2.156 2.18-2.156s2.18 1.008 2.18 2.156c0 1.195-1.008 2.18-2.18 2.18" />
                            </svg>
                        {/if}
                        {#if badge.type === "version"}
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 56 56">
                                <path d="M0 0h56v56H0z" fill="none" />
                                <path fill="currentColor" d="M26.113 51.215c3.352 3.351 6.797 3.398 10.243-.024L51.19 36.38c3.422-3.422 3.375-6.89.024-10.242L28.293 3.262c-1.758-1.758-2.742-1.875-5.227-1.875H14.16c-2.484 0-3.258.61-5.015 2.367l-5.391 5.39c-1.781 1.782-2.367 2.555-2.367 5.04v8.906c0 2.46.093 3.469 1.875 5.226Zm2.532-2.836L5.91 25.645c-.469-.47-.75-.961-.75-1.735v-9.89c0-.727.258-1.22.75-1.711l6.375-6.375c.516-.493.985-.774 1.735-.774h9.867c.797 0 1.265.305 1.758.774l22.734 22.71c1.664 1.665 1.71 3.47-.023 5.18L33.823 48.356c-1.71 1.734-3.515 1.71-5.18.023M16.902 20.137c1.828 0 3.211-1.43 3.211-3.211c0-1.805-1.383-3.211-3.21-3.211c-1.829 0-3.212 1.406-3.212 3.21c0 1.782 1.383 3.212 3.211 3.212" />
                            </svg>
                        {/if}
                    </span>
                    {/each}

                    {#if isNonDefault && onReset}
                        <button
                            class="reset-button"
                            onclick={onReset}
                            title="Reset to default"
                            type="button"
                            {@attach tooltipAttachment}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 56 56">
                                <path d="M0 0h56v56H0z" fill="none" />
                                <path fill="currentColor" stroke="currentColor" stroke-width="2.5" paint-order="stroke" d="M50.148 34.914c0-8.953-6.046-15.14-16.757-15.14H17.664l-5.508.257l4.454-3.797l6.75-6.609c.374-.375.562-.82.562-1.43c0-1.218-.82-2.062-2.062-2.062c-.516 0-1.126.258-1.524.656L6.555 20.312c-.469.446-.703.985-.703 1.57c0 .563.234 1.102.703 1.548l13.781 13.523a2.2 2.2 0 0 0 1.524.656c1.242 0 2.062-.843 2.062-2.062c0-.61-.188-1.055-.562-1.43l-6.75-6.586l-4.454-3.797l5.508.235h16.078c7.992 0 12.235 4.406 12.235 10.71c0 6.329-4.243 11.016-12.235 11.016h-5.39c-1.29 0-2.133.938-2.133 2.086c0 1.149.844 2.086 2.133 2.086h5.414c10.5 0 16.382-5.976 16.382-14.953" />
                            </svg>

                        </button>
                    {/if}
                </div>
            {/if}
        </div>
        {/if}
        {#if schemaDescription}
            <div class="row-right">
                <div class="setting">{@render children()}</div>
                <button type="button" class="setting-info" aria-label="Full description" onclick={() => alert({title: name, message: schemaDescription})}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 56 56">
                        <path d="M0 0h56v56H0z" fill="none" />
                        <path fill="currentColor" d="M28 51.906c13.055 0 23.906-10.828 23.906-23.906c0-13.055-10.875-23.906-23.93-23.906C14.899 4.094 4.095 14.945 4.095 28c0 13.078 10.828 23.906 23.906 23.906m0-3.984C16.937 47.922 8.1 39.062 8.1 28c0-11.04 8.813-19.922 19.876-19.922c11.039 0 19.921 8.883 19.945 19.922c.023 11.063-8.883 19.922-19.922 19.922m-.211-28.266c1.71 0 3.047-1.36 3.047-3.047c0-1.71-1.336-3.07-3.047-3.07s-3.047 1.36-3.047 3.07a3.026 3.026 0 0 0 3.047 3.047m-3.914 21.235h9.562c.961 0 1.711-.68 1.711-1.641c0-.914-.75-1.64-1.71-1.64H30.53V25.68c0-1.266-.656-2.11-1.828-2.11h-4.43c-.937 0-1.687.727-1.687 1.64c0 .962.75 1.642 1.687 1.642h2.532v10.757h-2.93c-.938 0-1.688.727-1.688 1.641c0 .96.75 1.64 1.688 1.64" />
                    </svg>
                </button>
            </div>
        {:else}
            <div class="setting">{@render children()}</div>
        {/if}
    </div>
    {#if note}
    <div class="note">
        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
        {@html note} <!-- TODO: sanitize this? It's written and maintained by us -->
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
    flex-wrap: wrap;
}

.setting-name {
    font-weight: 500;
}

.setting-extra {
    display: inline-flex;
    align-items: center;
    gap: 5px;
}

.badge {
    display: inline-flex;
    align-items: center;
    color: var(--font-color-muted);
    cursor: help;
    user-select: none;
}

/* TODO: rethink these colors */
.badge.platform {
    color: #6B8CFF;
}

.badge.version {
    color: #F0A500;
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

.reset-button {
    background: none;
    border: 0;
    padding: 0;
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
}

.row-right {
    display: flex;
    align-items: center;
    flex: 1;
    justify-content: flex-end;
    gap: 10px;
}

.setting {
    display: flex;
    flex: 1;
    justify-content: flex-end;
}

.row-right .setting {
    flex: none;
}

.note {
    color: var(--font-color-muted);
    font-size: 0.9rem;
}

.note :global(code) {
    padding: 2px 4px;
    border-radius: var(--radius-level-4);
    background: rgba(from var(--bg-level-2) r g b / 0.6);
    backdrop-filter: blur(20px);
    border: 1px solid var(--border-level-1);
    box-shadow:
        0 0 1px -1px rgba(0,0,0,0.7),
        0 0 1px white inset;
}
</style>