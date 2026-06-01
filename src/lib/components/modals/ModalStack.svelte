<script lang="ts">
    import {marked} from "marked";
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
            <!-- eslint-disable-next-line svelte/no-at-html-tags -->
            {@html marked.parse(activeModal.message)}
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
:global(.alert-body p) {
    margin: 0;
}

:global(.alert-body ul) {
    padding-left: 1rem;
    text-align: left;
}

:global(.alert-body ul li + li) {
    margin-top: 0.25rem;
}

:global(.alert-body code) {
    padding: 2px 4px;
    border-radius: var(--radius-level-4);
    background: rgba(from var(--bg-level-2) r g b / 0.6);
    backdrop-filter: blur(20px);
    border: 1px solid var(--border-level-1);
    box-shadow:
        0 0 1px -1px rgba(0,0,0,0.7),
        0 0 1px white inset;
}
</style>