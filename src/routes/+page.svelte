<script lang="ts">
    import Page from "$lib/views/Page.svelte";
    import logo from "$lib/images/ghost.svg";
    // import sync from "$lib/images/tabs/sync.webp";
    // import fonts from "$lib/images/tabs/font-playground.webp";
    import Admonition from "$lib/components/Admonition.svelte";
    import Group from "$lib/components/settings/Group.svelte";
    // import LinkItem from "$lib/components/settings/LinkItem.svelte";
    // import Separator from "$lib/components/settings/Separator.svelte";
</script>

<Page title="Ghostty Config">
    <section>
        <div class="user">
            <div class="user-avatar">
                <img src={logo} alt="Ghostty Logo" />
            </div>
            <div class="user-label">
                <div class="user-name">Ghostty Config<sup>β</sup></div>
                <div class="user-subtext">Community Tool</div>
            </div>
        </div>
        <Admonition>
            This tool is still in a beta stage so there <em>will</em> be bugs! If you run into any,
            please report them
            <a
                href="https://github.com/zerebos/ghostty-config/issues"
                target="_blank"
                rel="noopener noreferrer">on GitHub</a
            >.
        </Admonition>
        <!-- <Group> -->
            <!-- <LinkItem name="Import & Export" href="/app/import-export" icon={sync} /> -->
            <!-- <Separator /> -->
            <!-- <LinkItem name="Font Playground" href="/app/font-playground" icon={fonts} /> -->
        <!-- </Group> -->
        <Group title="Changelog v0.1.2">
            <ul>
                <li>Color picker is now manually editable.</li>
                <li>Slightly rearranged tabs for better organization.</li>
            </ul>
        </Group>
        <div class="group-wrapper">
            <Group title="Roadmap" flex={1}>
                <ul>
                    <li>Validation of keybindings</li>
                    <li>Help documentation</li>
                    <li>Unit testing import/export</li>
                    <li>Unify color scheme</li>
                    <li>Refactor & cleanup code</li>
                    <li>macOS icon preview</li>
                </ul>
            </Group>
            <Group title="Potential Ideas">
                <ul>
                    <li>Custom setting types to more closely match Ghostty's config</li>
                    <li>Add a way to reset individual settings</li>
                    <li>Change color picker from modal to popout</li>
                    <li>A detailed terminal preview and playground</li>
                </ul>
            </Group>
        </div>
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
        background: linear-gradient(#03028f, #09043a);
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
        color: var(--font-color);
        font-weight: 600;
    }

    sup {
        position: absolute;
        color: var(--font-color-accent);
        right: -11px;
        top: -5px;
    }

    .user-subtext {
        display: flex;
        justify-content: center;
        font-size: 1.1rem;
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
        justify-content: space-evenly;
    }

    /* code {
        background: var(--bg-input-focus);
        padding: 2px 4px;
        border: 1px solid var(--border-input);
        border-radius: var(--radius-level-4);
    } */
</style>
