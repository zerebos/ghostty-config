<script lang="ts">
    import {dev} from "$app/environment";
    import Page from "$lib/views/Page.svelte";
    import logo from "$lib/images/ghost.svg";
    import sync from "$lib/images/tabs/sync.png";
    import {diff} from "$lib/stores/config.svelte";
    import Admonition from "$lib/components/Admonition.svelte";
    import Group from "$lib/components/settings/Group.svelte";
    import LinkItem from "$lib/components/settings/LinkItem.svelte";
    import ColorPicker from "$lib/components/ColorPicker.svelte";

    function debug() {
        // eslint-disable-next-line no-console
        console.log(diff());
    }
</script>

<!-- Do this more elegantly, maybe a $state -->
<svelte:head>
    <title>Ghostyy Config</title>
</svelte:head>

<Page title="Ghostty Config">
<section>
    <div class="user">
        <div class="user-avatar">
            <img src={logo} alt="Ghostty Logo" />
        </div>
        <div class="user-label">
            <div class="user-name">Ghostty Config<sup>𝛼</sup></div>
            <div class="user-subtext">Unofficial Tool</div>
        </div>
    </div>
    <Admonition>
        This tool is still in an alpha stage so there <em>will</em> be bugs! If you run into any, please report them <a href="https://github.com/zerebos/ghostty-config" target="_blank" rel="noopener noreferrer">on GitHub</a>.
    </Admonition>
    <Group>
        <LinkItem name="Import & Export" href="/app/import-export" icon={sync} />
    </Group>
    <Group title="Known Issues">
        <ul>
            <li>Most settings do not allow for multiple entries like multiple <code>font-family</code> entries for fallback fonts.</li>
            <li>Cancelling a "null" color will set it to <code>#000000</code> (black).</li>
        </ul>
    </Group>
    <div class="group-wrapper">
        <Group title="Roadmap" flex={1}>
            <ul>
                <li>Validation of keybindings</li>
                <li>Custom color picker</li>
                <li>Help documentation</li>
            </ul>
        </Group>
        <Group title="Potential Ideas">
            <ul>
                <li>Custom setting types to more closely match Ghostty's config</li>
                <li>Add a way to reset individual settings</li>
            </ul>
        </Group>
    </div>

    {#if dev}
        <button onclick={debug} type="button">debug</button><br />
        <ColorPicker value="#00FF00" />
    {/if}
</section>
</Page>

<style>
    section {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        flex: 0.6;
    }

    .user {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 8px;
        margin: 20px 0;
    }

    .user-avatar img {
        height: 80%;
        width: 80%;
    }

    .user-avatar {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        background: linear-gradient(#03028F, #09043A);
        height: 100px;
        width: 100px;
        border-radius: 50%;
        /* border: 2px solid black; */
        /* box-shadow: 0 0 0 2px white; */
    }

    .user-label {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 5px;
    }

    .user-name {
        position: relative;
        display: flex;
        justify-content: center;
        font-size: 1.3rem;
        color: var(--color-text);
        font-weight: 600;
    }

    sup {
        position: absolute;
        color: var(--color-theme-1);
        right: -11px;
        top: -5px;
    }

    .user-subtext {
        display: flex;
        justify-content: center;
        font-size: 1.1rem;
        /* color: #A7A3AA; */
    }

    .group-wrapper {
        display: flex;
        width: 100%;
        gap: 12px;
    }

    ul,
    .group-wrapper ul {
        /* list-style: "↪ "; */
        list-style: "🠶 ";
        padding-left: 15px;
        margin: 0;
        display: flex;
        flex-direction: column;
        height: 100%;
        justify-content: space-between;
    }

    code {
        background: #1F1E1F;
        padding: 2px 4px;
        border: 1px solid #443E4B;
        border-radius: 6px;
    }
</style>
