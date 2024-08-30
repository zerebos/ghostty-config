<script lang="ts">
    import {onNavigate} from "$app/navigation";
    import {processNavigation, canGoBack, canGoForward} from "$lib/stores/history.svelte";


    onNavigate(processNavigation);

    function back() {
        window.history.back();
    }

    function forward() {
        window.history.forward();
    }
</script>

<div class="history">
    <button class="back" type="button" onclick={back} disabled={!canGoBack()} title="Go Back"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#e8eaed"><path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z" /></svg></button>
    <button class="forward" type="button" onclick={forward} disabled={!canGoForward()} title="Go Forward"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#e8eaed"><path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z" /></svg></button>
</div>


<style>
.history {
    display: inline-flex;
    gap: 4px;
    z-index: 11;
}

.history button,
.history .back {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    background: none;
    border: 0;
    padding: 4px 4px 4px 12px;
    border-radius: var(--radius-level-5);
}

.history button svg {
    fill: var(--font-color-muted);
}

.history button.forward {
    padding: 4px 8px;
}

.history button:hover {
    background: rgba(255, 255, 255, 0.1);
}

.history button:active {
    background: rgba(255, 255, 255, 0.3);
}

.history button:disabled {
    opacity: 0.3;
    background: none!important;
}

.history button svg {
    height: 18px;
    width: 18px;
}
</style>