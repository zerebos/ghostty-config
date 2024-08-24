<script lang="ts">
    export let name = "";
    export let note = "";
</script>

<div class="setting-item">
    <div class="row">
        <div class="setting-name">{name}</div>
        <div class="setting"><slot /></div>
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

.note {
    color: #A7A3AA;
    font-size: 0.9rem;
}
</style>