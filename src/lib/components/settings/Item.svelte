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
                        <!-- <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 56 56">
                            <path d="M0 0h56v56H0z" fill="none" />
                            <path fill="currentColor" d="M26.688 12.66c.28 0 .421-.164.492-.422c.726-3.914.68-4.008 4.758-4.781c.28-.047.445-.21.445-.492c0-.281-.164-.445-.446-.492c-4.054-.82-3.937-.914-4.757-4.782c-.07-.257-.211-.421-.492-.421s-.422.164-.493.421c-.82 3.868-.68 3.961-4.757 4.782c-.258.046-.446.21-.446.492c0 .281.188.445.445.492c4.079.82 4.032.867 4.758 4.781c.07.258.211.422.492.422M15.344 28.785c.445 0 .75-.281.797-.703c.843-6.258 1.054-6.258 7.523-7.5c.422-.07.727-.352.727-.797c0-.422-.305-.726-.727-.797c-6.469-.89-6.703-1.101-7.523-7.476c-.047-.422-.352-.727-.797-.727c-.422 0-.727.305-.774.75c-.773 6.281-1.101 6.258-7.523 7.453c-.422.094-.727.375-.727.797c0 .469.305.727.82.797c6.376 1.031 6.657 1.195 7.43 7.453c.047.469.352.75.774.75m15.89 25.946c.61 0 1.055-.446 1.172-1.079c1.664-12.843 3.469-14.789 16.172-16.195c.656-.07 1.102-.562 1.102-1.172s-.446-1.078-1.102-1.172c-12.703-1.406-14.508-3.351-16.172-16.195c-.117-.633-.562-1.055-1.172-1.055s-1.054.422-1.148 1.055c-1.664 12.844-3.492 14.789-16.172 16.195c-.68.094-1.125.563-1.125 1.172c0 .61.445 1.102 1.125 1.172c12.656 1.664 14.414 3.375 16.172 16.195c.094.633.539 1.078 1.148 1.078" />
                        </svg> -->

                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 56 56">
                                <path d="M0 0h56v56H0z" fill="none" />
                                <path fill="currentColor" d="M26.113 51.215c3.352 3.351 6.797 3.398 10.243-.024L51.19 36.38c3.422-3.422 3.375-6.89.024-10.242L28.293 3.262c-1.758-1.758-2.742-1.875-5.227-1.875H14.16c-2.484 0-3.258.61-5.015 2.367l-5.391 5.39c-1.781 1.782-2.367 2.555-2.367 5.04v8.906c0 2.46.093 3.469 1.875 5.226Zm2.532-2.836L5.91 25.645c-.469-.47-.75-.961-.75-1.735v-9.89c0-.727.258-1.22.75-1.711l6.375-6.375c.516-.493.985-.774 1.735-.774h9.867c.797 0 1.265.305 1.758.774l22.734 22.71c1.664 1.665 1.71 3.47-.023 5.18L33.823 48.356c-1.71 1.734-3.515 1.71-5.18.023M16.902 20.137c1.828 0 3.211-1.43 3.211-3.211c0-1.805-1.383-3.211-3.21-3.211c-1.829 0-3.212 1.406-3.212 3.21c0 1.782 1.383 3.212 3.211 3.212" />
                            </svg>


                        {/if}
                    </span>
                    {/each}

                    {#if isNonDefault && onReset}
                    <!-- <div class="reset-button-wrapper"> -->
                        <button
                            class="reset-button"
                            onclick={onReset}
                            title="Reset to default"
                            type="button"
                            {@attach tooltipAttachment}
                        >
                            <!-- <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M9 14 4 9l5-5" />
                                <path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11" />
                            </svg> -->
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 56 56">
                                <path d="M0 0h56v56H0z" fill="none" />
                                <path fill="currentColor" stroke="currentColor" stroke-width="2.5" paint-order="stroke" d="M50.148 34.914c0-8.953-6.046-15.14-16.757-15.14H17.664l-5.508.257l4.454-3.797l6.75-6.609c.374-.375.562-.82.562-1.43c0-1.218-.82-2.062-2.062-2.062c-.516 0-1.126.258-1.524.656L6.555 20.312c-.469.446-.703.985-.703 1.57c0 .563.234 1.102.703 1.548l13.781 13.523a2.2 2.2 0 0 0 1.524.656c1.242 0 2.062-.843 2.062-2.062c0-.61-.188-1.055-.562-1.43l-6.75-6.586l-4.454-3.797l5.508.235h16.078c7.992 0 12.235 4.406 12.235 10.71c0 6.329-4.243 11.016-12.235 11.016h-5.39c-1.29 0-2.133.938-2.133 2.086c0 1.149.844 2.086 2.133 2.086h5.414c10.5 0 16.382-5.976 16.382-14.953" />
                            </svg>

                        </button>
                    <!-- </div> -->
                    {/if}
                </div>
            {/if}
        </div>
        {/if}
        {#if schemaDescription}
            <div class="row-right">
                <div class="setting">{@render children()}</div>
                <button type="button" class="setting-info" aria-label="Full description" onclick={() => alert({title: name, message: schemaDescription})}>
                    <!-- <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 16v-4" />
                        <path d="M12 8h.01" />
                    </svg> -->
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
    /* border-radius: 999px; */
    /* border: 1px solid var(--border-level-3); */
    /* background: color-mix(in srgb, var(--bg-level-3) 92%, transparent); */
    color: var(--font-color-muted);
    /* font-size: 0.68rem; */
    /* font-weight: 600; */
    /* letter-spacing: 0.01em; */
    /* line-height: 1; */
    /* padding: 3px 7px; */
    /* cursor: default; */
    cursor: help;
    user-select: none;
}

.badge.platform {
    /* color: #f8dca4; */
    /* border-color: color-mix(in srgb, var(--color-platform) 65%, #000); */
    /* background: color-mix(in srgb, var(--color-platform) 18%, transparent); */
    /* color: var(--color-input-accent); */
    color: #6B8CFF;
}

.badge.version {
    /* color: color-mix(in srgb, var(--color-input-accent) 90%, #fff); */
    /* border-color: color-mix(in srgb, var(--color-input-accent) 45%, transparent); */
    /* background: color-mix(in srgb, var(--color-input-accent) 12%, transparent); */
    /* color: #f8dca4; */
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
}

.row-right .setting {
    flex: none;
}

.note {
    color: var(--font-color-muted);
    font-size: 0.9rem;
}
</style>