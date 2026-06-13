<script lang="ts">
    import Page from "$lib/views/Page.svelte";

    import {page} from "$app/stores";
    import Switch from "$lib/components/settings/Switch.svelte";
    import Item from "$lib/components/settings/Item.svelte";
    import Group from "$lib/components/settings/Group.svelte";
    import Separator from "$lib/components/settings/Separator.svelte";

    import registry from "$lib/settings/registry";
    import navigation from "$lib/settings/navigation";
    import config, {isNonDefault, resetSetting} from "$lib/stores/config.svelte";
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
    import {success} from "$lib/stores/toasts.svelte";
    import Range from "$lib/components/settings/Range.svelte";
    import {type SettingsRegistry} from "$lib/settings/types";


    const category = $derived(navigation.find(c => c.id === $page.params.category));
    const title = $derived(category?.name ?? $page.params.category);
</script>


<Page {title}>
    {#if category}
        {#if category.id === "fonts"}
            <Admonition size="1.5rem">The font playground has moved to a <a href={resolve("/app/font-playground")}>separate page</a>.</Admonition>
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
                {:else if category.id === "macos" && group.id === "icon"}
                    <AppIconPreview />
                    <Separator />
                {/if}
                {#each group.settings as settingId, i (settingId)}
                    {@const setting = registry[settingId] as SettingsRegistry[keyof SettingsRegistry]}
                    {#if i !== 0}<Separator />{/if}
                    <Item
                        {settingId}
                        name={setting.name}
                        note={setting.note}
                        // filter out the current platform from the badge list since it's already obvious from the UI
                        platform={setting?.platform?.filter(p => p !== title?.toLowerCase())}
                        since={setting.since}
                        schemaDescription={setting.type !== "palette" ? setting.description : undefined}
                        isNonDefault={isNonDefault(settingId)}
                        onReset={() => {
                            resetSetting(settingId);
                            success(`${setting.name} reset to default`);
                        }}
                    >
                        {#if setting.type === "switch"}
                            <Switch bind:checked={config[settingId] as boolean} />
                        {:else if setting.type === "text"}
                            <Text bind:value={config[settingId] as string} placeholder={setting.placeholder} size={setting.size} />
                        {:else if setting.type === "range"}
                            <Range bind:value={config[settingId] as number} min={setting.min} max={setting.max} step={setting.step} showLabels={setting.showLabels} />
                        {:else if setting.type === "number"}
                            <Number bind:value={config[settingId] as number} min={setting.min} max={setting.max} step={setting.step} size={setting.size} placeholder={setting.placeholder} />
                        {:else if setting.type === "dropdown"}
                            <Dropdown bind:value={config[settingId] as string} options={setting.options} placeholder={setting.placeholder} allowEmpty={setting.allowEmpty} emptyLabel={setting.emptyLabel} disabled={setting.disabled} />
                        {:else if setting.type === "theme"}
                            <Theme bind:value={config[settingId] as string} options={setting.options} />
                        {:else if setting.type === "color"}
                            <Color defaultValue={setting.default as HexColor} bind:value={config[settingId] as HexColor} />
                        {:else if setting.type === "palette"}
                            <Palette defaultValue={setting.default} bind:value={config[settingId] as HexColor[]} />
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