<script lang="ts">
    import {createTooltipAttachment} from "$lib/attachments/tooltip";

    interface Props {
        type: "platform" | "version";
        label: string;
        tooltip: string;
    }

    const {type, label, tooltip}: Props = $props();

    const tooltipAttachment = createTooltipAttachment(() => tooltip);
</script>


<span
    class="badge"
    class:platform={type === "platform"}
    class:version={type === "version"}
    role="img"
    aria-label={label}
    {@attach tooltipAttachment}
>
    {#if type === "platform"}
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 56 56">
            <path d="M0 0h56v56H0z" fill="none" />
            <path fill="currentColor" d="M6.086 43.293h14.672l-.633 4.313h-3.21c-1.079 0-1.993.89-1.993 1.992s.914 2.015 1.992 2.015h22.172c1.078 0 1.992-.914 1.992-2.015a2.006 2.006 0 0 0-1.992-1.992h-3.21l-.634-4.313h14.672c4.008 0 6.023-1.922 6.023-6.023V10.41c0-4.101-2.015-6.023-6.023-6.023H6.086C2.078 4.387.6 6.309.6 10.41v26.86c0 4.101 1.478 6.023 5.486 6.023M4.844 32.981c-.703 0-1.008-.282-1.008-1.008V10.48c0-1.665.727-2.32 2.32-2.32h43.688c1.617 0 2.32.655 2.32 2.32v21.492c0 .726-.305 1.008-1.008 1.008ZM28 40.973c-1.172 0-2.18-.985-2.18-2.18c0-1.148 1.008-2.156 2.18-2.156s2.18 1.008 2.18 2.156c0 1.195-1.008 2.18-2.18 2.18" />
        </svg>
    {/if}
    {#if type === "version"}
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 56 56">
            <path d="M0 0h56v56H0z" fill="none" />
            <path fill="currentColor" d="M26.113 51.215c3.352 3.351 6.797 3.398 10.243-.024L51.19 36.38c3.422-3.422 3.375-6.89.024-10.242L28.293 3.262c-1.758-1.758-2.742-1.875-5.227-1.875H14.16c-2.484 0-3.258.61-5.015 2.367l-5.391 5.39c-1.781 1.782-2.367 2.555-2.367 5.04v8.906c0 2.46.093 3.469 1.875 5.226Zm2.532-2.836L5.91 25.645c-.469-.47-.75-.961-.75-1.735v-9.89c0-.727.258-1.22.75-1.711l6.375-6.375c.516-.493.985-.774 1.735-.774h9.867c.797 0 1.265.305 1.758.774l22.734 22.71c1.664 1.665 1.71 3.47-.023 5.18L33.823 48.356c-1.71 1.734-3.515 1.71-5.18.023M16.902 20.137c1.828 0 3.211-1.43 3.211-3.211c0-1.805-1.383-3.211-3.21-3.211c-1.829 0-3.212 1.406-3.212 3.21c0 1.782 1.383 3.212 3.211 3.212" />
        </svg>
    {/if}
</span>


<style>
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
</style>