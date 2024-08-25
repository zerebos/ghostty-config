<script lang="ts">
    import Page from "$lib/views/Page.svelte";
    import logo from "$lib/images/ghost.svg";
    import {printDifferences} from "$lib/stores/config.svelte";

    function debug() {
        printDifferences();
    }
</script>


<Page title="Ghostty Config">
<section>
    <div class="user">
        <div class="user-avatar">
            <img src={logo} alt="Ghostty Logo" />
        </div>
        <div class="user-label">
            <div class="user-name">Ghostty Config</div>
            <div class="user-subtext">Unofficial Tool</div>
        </div>
    </div>
	<p>Here you will be able to import/export and maybe launch the terminal preview overlay. Maybe some settings specific to the config tool as well?</p>
    <button onclick={debug}>debug</button>
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
        margin-top: 20px;
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
        display: flex;
        justify-content: center;
        font-size: 1.3rem;
        color: var(--color-text);
        font-weight: 600;
    }

    .user-subtext {
        display: flex;
        justify-content: center;
        font-size: 1.1rem;
        /* color: #A7A3AA; */
    }
</style>
