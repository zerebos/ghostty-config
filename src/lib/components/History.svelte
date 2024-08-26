<script lang="ts">

</script>

<div class="history">
    <button class="back" type="button" disabled={true}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#e8eaed"><path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z" /></svg></button>
    <button class="forward" type="button" disabled={true}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#e8eaed"><path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z" /></svg></button>
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
    color: inherit;
    padding: 4px 4px 4px 12px;
    border-radius: 4px;
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