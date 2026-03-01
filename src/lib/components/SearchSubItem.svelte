<script lang="ts">
    import HighlightText from "$lib/components/HighlightText.svelte";
    import {setHighlightedSetting, clearSearch} from "$lib/stores/search.svelte";
    import type {MatchedSetting} from "$lib/utils/search";
    import {goto} from "$app/navigation";

    const {
        setting,
        categoryRoute,
        selected = false
    }: {setting: MatchedSetting; categoryRoute: string; selected?: boolean} = $props();

    async function handleClick() {
        setHighlightedSetting(setting.id);
        clearSearch();
        await goto(categoryRoute);
    }
</script>

<button type="button" class="sub-item" class:selected onclick={handleClick}>
    <HighlightText text={setting.name} ranges={setting.matchRanges} />
</button>

<style>
    .sub-item {
        display: flex;
        align-items: center;
        width: 100%;
        padding: 6px;
        padding-left: 24px;
        background: transparent;
        border: none;
        border-radius: var(--radius-level-4, 6px);
        color: var(--font-color-muted, #aaa);
        font-size: 0.85rem;
        text-align: left;
        cursor: pointer;
        transition: background 0.15s ease;
    }

    .sub-item:hover {
        background: var(--color-selected, rgba(255, 255, 255, 0.1));
        color: var(--font-color, #fff);
    }

    .sub-item.selected {
        background: var(--color-selected, rgba(255, 255, 255, 0.15));
    }
</style>
