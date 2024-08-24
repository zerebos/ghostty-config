<script lang="ts">
    import Page from "$lib/views/Page.svelte";

    import {page} from "$app/stores";
    import Switch from "$lib/components/settings/Switch.svelte";
    import Item from "$lib/components/settings/Item.svelte";
    import Group from "$lib/components/settings/Group.svelte";
    import Separator from "$lib/components/settings/Separator.svelte";

    import settings from "$lib/data/settings";
    import config from "$lib/stores/config";
    import Text from "$lib/components/settings/Text.svelte";
    import Number from "$lib/components/settings/Number.svelte";
    import Dropdown from "$lib/components/settings/Dropdown.svelte";

    $: category = settings.find(c => c.id === $page.params.category);
</script>

<Page title="{category?.name ?? $page.params.category}">
<div class="text-column">
    {#if category}
        {#each category.groups as group (group.id)}
            <Group title={group.name} note={group.note}>
                {#each group.settings as setting, i (setting.id)}
                    {#if i !== 0}<Separator />{/if}
                    <Item name={setting.name} note={setting.note}>
                        {#if setting.type === "switch"}
                            <Switch bind:checked={$config[setting.id]} />
                        {:else if setting.type === "text"}
                            <Text bind:value={$config[setting.id]} />
                        {:else if setting.type === "number"}
                            <Number bind:value={$config[setting.id]} range={setting.range} min={setting.min} max={setting.max} step={setting.step} size={setting.size} />
                        {:else if setting.type === "dropdown"}
                            <Dropdown bind:value={$config[setting.id]} options={setting.options} />
                        {/if}
                    </Item>
                {/each}
            </Group>
        {/each}
    {:else}
        <h1>About this app</h1>

        <Switch checked={true} />

        <Item name="Do a specific thing"><Switch checked={true} /></Item>
        <Item name="How many?" note="Tell us how many and we do things for you so good!"><Text value="seven" /></Item>


        <Group>
            <Item name="Do a specific thing"><Switch checked={true} /></Item>
            <Separator />
            <Item name="How many?" note="Tell us how many and we do things for you so good!"><Text value="seven" /></Item>
        </Group>

        <p>
            This is a <a href="https://kit.svelte.dev">SvelteKit</a> app. You can make your own by typing
            the following into your command line and following the prompts:
        </p>
    
        <pre>npm create svelte@latest</pre>
    
        <p>
            The page you're looking at is purely static HTML, with no client-side interactivity needed.
            Because of that, we don't need to load any JavaScript. Try viewing the page's source, or
            opening the devtools network panel and reloading.
        </p>
    
        <p>
            The <a href="/sverdle">Sverdle</a> page illustrates SvelteKit's data loading and form handling.
            Try using it with JavaScript disabled!
        </p>
    {/if}


</div>
</Page>