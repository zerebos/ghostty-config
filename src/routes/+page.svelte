<script lang="ts">
    import Page from "$lib/views/Page.svelte";
    import logo from "$lib/images/icon.webp";
    import Admonition from "$lib/components/Admonition.svelte";
    import Group from "$lib/components/settings/Group.svelte";
</script>

<Page title="Ghostty Config">
    <section>
        <div class="user">
            <div class="user-avatar">
                <img src={logo} alt="Ghostty Config Logo" />
            </div>
            <div class="user-label">
                <div class="user-name">Ghostty Config</div>
                <div class="user-subtext">by <a href="https://zerebos.com" target="_blank" rel="noopener noreferrer">@zerebos</a></div>
            </div>
        </div>
        <Admonition>
            This tool <em>will</em> have bugs! If you run into any, or have suggestions, please submit them
            <a href="https://github.com/zerebos/ghostty-config/issues" target="_blank" rel="noopener noreferrer">on GitHub</a>.
        </Admonition>
        <Group title="Recent Changes">
            <ul class="recent-changes">
                <li>Updated settings to match Ghostty 1.2 (and 1.3-nightly)</li>
                <li>Designed a brand new logo by hand using <a href="https://www.photopea.com/" target="_blank" rel="noopener noreferrer">Photopea</a></li>
                <li>Added new custom app icon preview on the <a href="/settings/macos">macOS page</a></li>
                <li>New script for easier updates to future Ghostty versions</li>
                <li>Fixed old settings that had outdated options</li>
                <li>Fix extra line breaks when exporting to clipboard by <a href="https://github.com/reussio" target="_blank" rel="noopener noreferrer">@reussio</a></li>
                <li>Better theme sorting by <a href="https://github.com/adamalston" target="_blank" rel="noopener noreferrer">@adamalston</a></li>
            </ul>
        </Group>
        <div class="group-wrapper">
            <Group title="Roadmap" flex={1}>
                <ul>
                    <li>Validation of keybindings</li>
                    <li>Command palette builder</li>
                    <li>Help documentation</li>
                    <li>Unit testing import/export</li>
                    <li>Unify color scheme</li>
                    <li>Refactor & cleanup code</li>
                </ul>
            </Group>
            <Group title="Potential Ideas">
                <ul>
                    <li>Custom setting types to more closely match Ghostty's config</li>
                    <li>Add a way to reset individual settings</li>
                    <li>Change color picker from modal to popout</li>
                    <li>A ghostty-web terminal preview and playground</li>
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
        height: 100%;
        width: 100%;
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
        gap: 3px;
    }

    .group-wrapper {
        display: flex;
        width: 100%;
        gap: 12px;
    }

    ul,
    .group-wrapper ul {
        list-style: "↪ ";
        /* list-style: disclosure-closed; */
        padding-left: 15px;
        margin: 0;
        display: flex;
        flex-direction: column;
        height: 100%;
        justify-content: space-evenly;
    }

    .recent-changes li {
        margin-bottom: 5px;
    }

    /* code {
        background: var(--bg-input-focus);
        padding: 2px 4px;
        border: 1px solid var(--border-input);
        border-radius: var(--radius-level-4);
    } */
</style>
