<script lang="ts">
    import AlertModal from "$lib/components/modals/AlertModal.svelte";
    import Button from "$lib/components/Button.svelte";
    import {
        dismissTopModal,
        getTopModal,
        resolveTopAlert,
        resolveTopConfirm
    } from "$lib/stores/modals.svelte";

    const activeModal = $derived(getTopModal());

    function handleDocumentKeydown(event: KeyboardEvent) {
        if (event.key !== "Escape") return;
        if (!activeModal) return;
        dismissTopModal();
    }
</script>

<svelte:document onkeydown={handleDocumentKeydown} />

{#if activeModal}
    <AlertModal
        title={activeModal.title}
        iconSrc={activeModal.iconSrc}
        iconAlt={activeModal.iconAlt}
        onclose={dismissTopModal}
    >
        {#if activeModal.message}
            <p>{activeModal.message}</p>
        {/if}

        {#snippet actions()}
            {#if activeModal.kind === "confirm"}
                <Button primary onclick={() => resolveTopConfirm(true)}>{activeModal.confirmText}</Button>
                <Button onclick={() => resolveTopConfirm(false)}>{activeModal.cancelText}</Button>
            {:else}
                <Button primary onclick={resolveTopAlert}>{activeModal.buttonText}</Button>
            {/if}
        {/snippet}
    </AlertModal>
{/if}


<style>
p {
    margin: 0;
}
</style>