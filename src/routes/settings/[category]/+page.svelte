<script lang="ts">
    import Page from "$lib/views/Page.svelte";

    import {page} from "$app/stores";
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


    const category = $derived(settings.find(c => c.id === $page.params.category));
    const title = $derived(category?.name ?? $page.params.category);
</script>


<Page {title}>
    {#if category}
        {#if category.id === "fonts"}
            <Admonition size="1.5rem">The font playground has moved to a <a href="/app/font-playground/">separate page</a>.</Admonition>
        {:else if category.id === "colors"}
            <Admonition size="1.5rem">You can reset a color to its default value by right clicking!</Admonition>
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
                {/if}
                {#each group.settings as setting, i (setting.id)}
                    {#if i !== 0}<Separator />{/if}
                    <Item name={setting.name} note={setting.note}>
                        {#if setting.type === "switch"}
                            <Switch bind:checked={config[setting.id as keyof typeof config]} />
                        {:else if setting.type === "text"}
                            <Text bind:value={config[setting.id as keyof typeof config]} />
                        {:else if setting.type === "number"}
                            <Number bind:value={config[setting.id as keyof typeof config]} range={setting.range} min={setting.min} max={setting.max} step={setting.step} size={setting.size} />
                        {:else if setting.type === "dropdown"}
                            <Dropdown bind:value={config[setting.id as keyof typeof config]} options={setting.options} />
                        {:else if setting.type === "theme"}
                            <Theme bind:value={config[setting.id as keyof typeof config]} options={setting.options} />
                        {:else if setting.type === "color"}
                            <Color defaultValue={setting.value} bind:value={config[setting.id as keyof typeof config]} />
                        {:else if setting.type === "palette"}
                            <Palette defaultValue={setting.value} bind:value={config[setting.id as keyof typeof config]} />
                        {/if}
                    </Item>
                {/each}
            </Group>
        {/each}
    {:else}
        <h1>What Happened?</h1>
        <p>You shouldn't be here! If you followed a link, please report the bug on GitHub. Otherwise, go ahead and start browsing on the left.</p>
    {/if}
</Page>