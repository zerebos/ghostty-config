<script lang="ts">
    import type {Snippet} from "svelte";

    // TODO: add type prop
    const {children}: {title?: string, note?: string, children: Snippet} = $props();
</script>

<div class="admonition">
    <div class="icon">ℹ️</div>
    <div class="info">{@render children()}</div>
</div>

<style>
.admonition {
    background: #322D39;
    border: 1px solid #3C3743;
    border-radius: 8px;
    padding: 12px;
    display: flex;
    align-items: stretch;
    gap: 8px;
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
    font-size: 0.9rem;
}
</style>