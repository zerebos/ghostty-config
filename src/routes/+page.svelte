<script lang="ts">
    import Page from "$lib/views/Page.svelte";
    import logo from "$lib/images/icon.webp";
    import Admonition from "$lib/components/Admonition.svelte";
    import Group from "$lib/components/settings/Group.svelte";
    import {resolve} from "$app/paths";
    import Checkbox from "$lib/components/settings/Checkbox.svelte";
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
            <ul>
                <li><Checkbox checked />New custom inputs for settings: sliders, number, color, and duration pickers</li>
                <li><Checkbox checked />Repeatable settings like font features now have a dedicated list editor</li>
                <li><Checkbox checked />Reworked import, export, and config sharing flow</li>
                <li><Checkbox checked /><span>Themes now automatically sync from upstream <a href="https://github.com/mbadolato/iTerm2-Color-Schemes/" target="_blank" rel="noopener noreferrer">iTerm2 Color Schemes</a></span></li>
                <li><Checkbox checked /><span>More accurate custom app icon preview on the <a href={resolve("/settings/macos")}>macOS page</a></span></li>
                <li><Checkbox checked />Settings rebuilt on a single unified, typed schema</li>
                <li><Checkbox checked />Interactive terminal preview that re-themes live as you edit</li>
                <li><Checkbox checked />Added a scroll multiplier setting</li>
            </ul>
        </Group>
        <Group title="Roadmap">
            <ul>
                <li><Checkbox />Command palette builder</li>
                <li><Checkbox />Unit testing import/export</li>
                <li><Checkbox />Unify color scheme</li>
                <li><Checkbox />Community presets for quick setup</li>
                <li><Checkbox />Desktop build of Ghostty Config for direct config integration</li>
            </ul>
        </Group>
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

    .user-subtext {
        display: flex;
        justify-content: center;
        font-size: 1.1rem;
        gap: 3px;
    }

    ul {
        /* list-style: "↪ "; */
        /* list-style: "🠶 "; */
        list-style: none;
        padding-left: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        height: 100%;
        justify-content: space-evenly;
    }

    ul li {
        margin-bottom: 5px;
        display: flex;
        align-items: center;
        gap: 8px;
    }
</style>
