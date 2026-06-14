<script lang="ts">
    import type {Snippet} from "svelte";

    interface Props {
        title?: string;
        note?: string;
        flex?: string|number;
        borderless?: boolean;
        children: Snippet;
    }

    const {title = "", note = "", children, flex = "", borderless = false}: Props = $props();
</script>

<div class="setting-group" class:borderless style:flex={flex ? flex : ""}>
    <div class="group-info">
        {#if title}<h2>{title}</h2>{/if}
        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
        {#if note}<h4>{@html note}</h4>{/if}
    </div>
    <div class="settings-items" style:flex style:height={flex ? "100%" : null}>
        {@render children()}
    </div>
</div>

<style>
.setting-group {
    display: flex;
    flex-direction: column;
    /* flex: 1; */
    width: 100%;
}

.group-info {
    display: flex;
    flex-direction: column;
    padding-left: 12px;
}

/* .setting-group:first-child h2 {
    margin-top: 10px;
} */

h2 {
    font-size: 1.05rem;
    font-weight: 600;
    margin-top: 20px;
}

h4 {
    font-size: 0.8rem;
    color: var(--font-color-muted);
    margin-top: -6px;
    white-space: preserve;
}

h4 :global(code) {
    padding: 2px 4px;
    border-radius: var(--radius-level-4);
    background: rgba(from var(--bg-level-2) r g b / 0.6);
    backdrop-filter: blur(20px);
    border: 1px solid var(--border-level-1);
    box-shadow:
        0 0 1px -1px rgba(0,0,0,0.7),
        0 0 1px white inset;
}

.settings-items {
    display: flex;
    flex-direction: column;
    background: var(--bg-level-2);
    border-radius: var(--radius-level-3);
    border: 1px solid var(--border-level-2);
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.05) inset;
    padding: 12px;
    margin-bottom: 12px;
}

.borderless .settings-items {
    background: transparent;
    border: none;
    box-shadow: none;
    padding: 0;
    margin: 0;
}
</style>