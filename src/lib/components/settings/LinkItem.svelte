<script lang="ts">
    // TODO: think of a way to elegantly de-duplicate this with the regular ITEM
    const {name = "", note = "", href, icon}: {name?: string, note?: string, href: string, icon?: string} = $props();
</script>

<a class="setting-item" {href}>
    <div class="row">
        <div class="setting-name">
            {#if icon}<img src={icon} alt={`${name} Submenu`} />{/if}
            <span>{name}</span>
        </div>
        <div class="setting">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#e8eaed"><path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z" /></svg>
        </div>
    </div>
    {#if note}
        <div class="note">
            {note}
        </div>
    {/if}
</a>


<style>
.setting-item {
    display: flex;
    flex-direction: column;
    gap: 5px;
    color: inherit;
    text-decoration: none!important;
}

.setting-item .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-height: 24px;
}

.setting-name {
    /* font-weight: 500; */
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    gap: 12px;
}

.setting-name img {
    height: 24px;
}

.setting {
    display: flex;
    flex: 1;
    justify-content: flex-end;
    min-width: none;
    min-height: none;
}

.setting svg {
    height: 16px;
    fill: #A7A3AA;
}

.note {
    color: var(--font-color-muted);
    font-size: 0.9rem;
}
</style>