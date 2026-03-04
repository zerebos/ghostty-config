<script lang="ts">
    import Page from "$lib/views/Page.svelte";

    import {page} from "$app/stores";
    import {tick} from "svelte";
    import Switch from "$lib/components/settings/Switch.svelte";
    import Item from "$lib/components/settings/Item.svelte";
    import Group from "$lib/components/settings/Group.svelte";
    import Separator from "$lib/components/settings/Separator.svelte";

    import settings from "$lib/data/settings";
    import config from "$lib/stores/config.svelte";
    import Text from "$lib/components/settings/Text.svelte";
    import Number from "$lib/components/settings/Number.svelte";
    import Dropdown from "$lib/components/settings/Dropdown.svelte";
    import Color from "$lib/components/settings/Color.svelte";
    import Palette from "$lib/components/settings/Palette.svelte";
    import BaseColorPreview from "$lib/views/BaseColorPreview.svelte";
    import CursorPreview from "$lib/views/CursorPreview.svelte";
    import PalettePreview from "$lib/views/PalettePreview.svelte";
    import Admonition from "$lib/components/Admonition.svelte";
    import Theme from "$lib/components/settings/Theme.svelte";
    import AppIconPreview from "$lib/views/AppIconPreview.svelte";
    import type {HexColor} from "$lib/utils/colors";
    import {resolve} from "$app/paths";
    import search, {clearHighlightedSetting} from "$lib/stores/search.svelte";

    const category = $derived(settings.find((c) => c.id === $page.params.category));
    const title = $derived(category?.name ?? $page.params.category);

    let highlightTimeout: number | null = null;

    function smoothScrollTo(element: HTMLElement, duration: number = 300) {
        const container = document.querySelector(".content-container") as HTMLElement;
        if (!container) return;

        const containerRect = container.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        const scrollTop = container.scrollTop;
        const elementTop =
            elementRect.top -
            containerRect.top +
            scrollTop -
            containerRect.height / 2 +
            elementRect.height / 2;
        const targetScroll = Math.max(0, elementTop);
        const startTime = performance.now();
        const startScroll = container.scrollTop;

        function animate(currentTime: number) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            container.scrollTop = startScroll + (targetScroll - startScroll) * easeProgress;

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }

        requestAnimationFrame(animate);
    }

    async function scrollToHighlighted() {
        const highlightedId = search.highlightedSettingId;
        if (!highlightedId) return;

        if (highlightTimeout !== null) {
            clearTimeout(highlightTimeout);
        }

        await tick();
        await new Promise((r) => setTimeout(r, 50));

        const element = document.querySelector(
            `[data-setting-id="${highlightedId}"]`
        ) as HTMLDivElement | null;

        if (element) {
            smoothScrollTo(element, 200);
            element.classList.add("highlight-flash");
            highlightTimeout = window.setTimeout(() => {
                if (search.highlightedSettingId === highlightedId) {
                    element.classList.remove("highlight-flash");
                    clearHighlightedSetting();
                }
            }, 2000);
        }
    }

    $effect(() => {
        if (search.highlightedSettingId) {
            scrollToHighlighted();
        }
    });
</script>

<Page {title}>
    {#if category}
        {#if category.id === "fonts"}
            <Admonition size="1.5rem"
                >The font playground has moved to a <a href={resolve("/app/font-playground")}
                    >separate page</a
                >.</Admonition
            >
        {:else if category.id === "colors"}
            <Admonition size="1.5rem"
                >You can reset a color to its default value by right clicking!</Admonition
            >
        {/if}
        {#each category.groups as group (group.id)}
            <Group title={group.name} note={group.note}>
                {#if category.id === "colors" && group.id === "base"}
                    <BaseColorPreview />
                    <Separator />
                {:else if category.id === "colors" && group.id === "cursor"}
                    <CursorPreview />
                    <Separator />
                {:else if category.id === "colors" && group.id === "palette"}
                    <PalettePreview />
                    <Separator />
                {:else if category.id === "macos" && group.id === "icon"}
                    <AppIconPreview />
                    <Separator />
                {/if}
                {#each group.settings as setting, i (setting.id)}
                    {#if i !== 0}<Separator />{/if}
                    <div class="setting-wrapper" data-setting-id={setting.id}>
                        <Item name={setting.name} note={setting.note}>
                            {#if setting.type === "switch"}
                                <Switch
                                    bind:checked={
                                        config[setting.id as keyof typeof config] as boolean
                                    }
                                />
                            {:else if setting.type === "text"}
                                <Text
                                    bind:value={config[setting.id as keyof typeof config] as string}
                                />
                            {:else if setting.type === "number"}
                                <Number
                                    bind:value={config[setting.id as keyof typeof config] as number}
                                    range={setting.range}
                                    min={setting.min}
                                    max={setting.max}
                                    step={setting.step}
                                    size={setting.size}
                                />
                            {:else if setting.type === "dropdown"}
                                <Dropdown
                                    bind:value={config[setting.id as keyof typeof config] as string}
                                    options={setting.options}
                                />
                            {:else if setting.type === "theme"}
                                <Theme
                                    bind:value={config[setting.id as keyof typeof config] as string}
                                    options={setting.options}
                                />
                            {:else if setting.type === "color"}
                                <Color
                                    defaultValue={setting.value}
                                    bind:value={
                                        config[setting.id as keyof typeof config] as HexColor
                                    }
                                />
                            {:else if setting.type === "palette"}
                                <Palette
                                    defaultValue={setting.value}
                                    bind:value={
                                        config[setting.id as keyof typeof config] as HexColor[]
                                    }
                                />
                            {/if}
                        </Item>
                    </div>
                {/each}
            </Group>
        {/each}
    {:else}
        <h1>What Happened?</h1>
        <p>
            You shouldn't be here! If you followed a link, please report the bug on GitHub.
            Otherwise, go ahead and start browsing on the left.
        </p>
    {/if}
</Page>

<style>
    .setting-wrapper {
        border-radius: var(--radius-level-4, 6px);
        margin: -4px;
        padding: 4px;
    }

    :global(.highlight-flash) {
        animation: flash 2s ease-out;
    }

    @keyframes flash {
        0% {
            background: var(--color-selected, rgba(74, 158, 255, 0.3));
        }
        100% {
            background: transparent;
        }
    }
</style>
