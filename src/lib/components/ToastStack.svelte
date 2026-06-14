<script lang="ts">
    import Toast from "$lib/components/Toast.svelte";
    import {getToasts} from "$lib/stores/toasts.svelte";

    const toasts = $derived(getToasts());
</script>

<div class="toast-stack">
    {#each toasts as toast (toast.id)}
        <Toast id={toast.id} type={toast.type} message={toast.message} />
    {/each}
</div>

<style>
    .toast-stack {
        position: absolute;
        top: 24px;
        left: 0;
        right: 0;
        z-index: 1000;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        pointer-events: none;
        padding: 0 20px;
    }

    .toast-stack > :global(*) {
        pointer-events: auto;
    }
</style>
