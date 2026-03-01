<script lang="ts">
    import type {Snippet} from "svelte";

    const {name = "", note = "", children}: {name?: string, note?: string, children: Snippet} = $props();
</script>

<div class="setting-item">
    <div class="row">
        {#if name}<div class="setting-name">{name}</div>{/if}
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
}

.setting-name {
    /* font-weight: 500; */
    font-size: 1.1rem;
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