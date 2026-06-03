<script lang="ts">
    import Page from "$lib/views/Page.svelte";

    import {page} from "$app/stores";
    import Switch from "$lib/components/settings/Switch.svelte";
    import Item from "$lib/components/settings/Item.svelte";
    import Group from "$lib/components/settings/Group.svelte";
    import Separator from "$lib/components/settings/Separator.svelte";

    import settings from "$lib/data/settings";
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
    import {groupNote, msg, settingName, settingNote, t} from "$lib/i18n.svelte";


    const category = $derived(settings.find(c => c.id === $page.params.category));
    const title = $derived(t(category?.name ?? $page.params.category));
</script>


<Page {title}>
    {#if category}
        {#if category.id === "fonts"}
            <Admonition size="1.5rem">{msg("The font playground has moved to a ", "字体预览已移到")}<a href={resolve("/app/font-playground")}>{msg("separate page", "单独页面")}</a>{msg(".", "。")}</Admonition>
        {:else if category.id === "colors"}
            <Admonition size="1.5rem">{msg("You can reset a color to its default value by right clicking!", "可以右键点击颜色，将其恢复为默认值！")}</Admonition>
        {/if}
        {#each category.groups as group (group.id)}
            <Group title={t(group.name)} note={groupNote(category.id, group.id, group.note)}>
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
                    <Item
                        name={settingName(setting.id, setting.name)}
                        note={settingNote(setting.id, setting.note)}
                        // filter out the current platform from the badge list since it's already obvious from the UI
                        platform={setting.platform?.filter(p => p !== category.name.toLowerCase())}
                        since={setting.since}
                        schemaDescription={setting.type !== "palette" ? setting.schemaDescription : undefined}
                        isNonDefault={isNonDefault(setting.id as keyof typeof config)}
                        onReset={() => {
                            resetSetting(setting.id as keyof typeof config);
                            success(msg(`${settingName(setting.id, setting.name)} reset to default`, `${settingName(setting.id, setting.name)} 已恢复默认值`));
                        }}
                    >
                        {#if setting.type === "switch"}
                            <Switch bind:checked={config[setting.id as keyof typeof config] as boolean} />
                        {:else if setting.type === "text"}
                            <Text bind:value={config[setting.id as keyof typeof config] as string} placeholder={setting.placeholder} size={setting.size} />
                        {:else if setting.type === "number"}
                            <Number bind:value={config[setting.id as keyof typeof config] as number} range={setting.range} min={setting.min} max={setting.max} step={setting.step} size={setting.size} placeholder={setting.placeholder} />
                        {:else if setting.type === "dropdown"}
                            <Dropdown bind:value={config[setting.id as keyof typeof config] as string} options={setting.options} placeholder={setting.placeholder} />
                        {:else if setting.type === "theme"}
                            <Theme bind:value={config[setting.id as keyof typeof config] as string} options={setting.options} />
                        {:else if setting.type === "color"}
                            <Color defaultValue={setting.value} bind:value={config[setting.id as keyof typeof config] as HexColor} />
                        {:else if setting.type === "palette"}
                            <Palette defaultValue={setting.value} bind:value={config[setting.id as keyof typeof config] as HexColor[]} />
                        {/if}
                    </Item>
                {/each}
            </Group>
        {/each}
    {:else}
        <h1>{msg("What Happened?", "发生了什么？")}</h1>
        <p>{msg("You shouldn't be here! If you followed a link, please report the bug on GitHub. Otherwise, go ahead and start browsing on the left.", "这里没有可显示的内容。如果你是通过链接来到这里的，请在 GitHub 上报告这个问题；否则请从左侧开始浏览。")}</p>
    {/if}
</Page>