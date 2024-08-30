<script lang="ts">
    import type {Snippet} from "svelte";

    const {title = "", note = "", children, flex = ""}: {title?: string, note?: string, children: Snippet, flex?: string|number} = $props();
</script>

<div class="setting-group">
    <div class="group-info">
        {#if title}<h2>{title}</h2>{/if}
        {#if note}<h4>{note}</h4>{/if}
    </div>
    <div class="settings-items" style:flex style:height={flex ? "100%" : null}>
        {@render children()}
    </div>
</div>

<style>
.setting-group {
    display: flex;
    flex-direction: column;
    flex: 1;
    width: 100%;
    height: 100%;
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
</style>