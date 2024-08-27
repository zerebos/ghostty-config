<script lang="ts">
    import {page} from "$app/stores";
    import logo from "$lib/images/ghost.svg";


    const {route = "/", name = "Ghostty Config", subtext = "Unofficial Tool"} = $props();
    const path = $derived($page.url.pathname);

    const selected = $derived(path === route || path.startsWith("/app"));
</script>


<a href={route} class="user-tab" class:selected>
    <div class="user-avatar">
        <img src={logo} alt="Ghostty Logo" />
    </div>
    <div class="user-label">
        <div class="user-name">{name}</div>
        <div class="user-subtext">{subtext}</div>
    </div>
</a>


<style>
    .user-tab {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 8px;
        padding: 6px;
        border-radius: 6px;
        text-decoration: none!important;
        font-weight: 600;
    }

    .user-tab.selected {
        background: #2C56B9;
    }

    .user-avatar img {
        height: 30px;
        width: 30px;
    }

    .user-avatar {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        background: linear-gradient(#03028F, #09043A);
        height: 40px;
        min-width: 40px;
        border-radius: 50%;
        /* border: 2px solid black; */
        /* box-shadow: 0 0 0 2px white; */
    }

    .user-label {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 5px;
    }

    .user-name {
        font-size: 1rem;
        color: var(--color-text);
    }

    .user-subtext {
        font-size: 0.7rem;
        color: #A7A3AA;
    }

    .selected .user-subtext {
        color: var(--color-text);
    }
</style>