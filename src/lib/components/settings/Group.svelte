<script lang="ts">
    import type {Snippet} from "svelte";

    const {title = "", note = "", children}: {title?: string, note?: string, children: Snippet} = $props();
</script>

<div class="setting-group">
    <div class="group-info">
        {#if title}<h2>{title}</h2>{/if}
        {#if note}<h4>{note}</h4>{/if}
    </div>
    <div class="settings-items">
        {@render children()}
    </div>
</div>

<style>
.setting-group {
    display: flex;
    flex-direction: column;
    flex: 1;
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
    color: #A7A3AA;
    margin-top: -6px;
    white-space: preserve;
}

.settings-items {
    background: #2F2935;
    border-radius: 8px;
    border: 1px solid #4B4652;
    padding: 12px;
    margin-bottom: 12px;
    flex: 1;
}
</style>