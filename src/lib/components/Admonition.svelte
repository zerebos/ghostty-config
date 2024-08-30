<script lang="ts">
    import type {Snippet} from "svelte";

    // TODO: add type prop
    const {size = "24px", children}: {size?: string, title?: string, note?: string, children: Snippet} = $props();
</script>

<div class="admonition">
    <div class="icon">
        <svg xmlns="http://www.w3.org/2000/svg" height={size} viewBox="0 -960 960 960" width={size} fill="var(--font-color)"><path d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" /></svg>
    </div>
    <div class="info">{@render children()}</div>
</div>

<style>
.admonition {
    background: var(--bg-level-3);
    border: 1px solid var(--border-level-3);
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.05) inset;
    border-radius: var(--radius-level-3);
    padding: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 20px;
}

.icon, .info {
    display: flex;
    align-items: center;
}

.icon {
    font-size: 1.5rem;
}

.info {
    /* flex: 1; */
    /* color: #A4A0A6; */
    display: inline;
    font-size: 0.9rem;
    line-height: 1.5;
}
</style>