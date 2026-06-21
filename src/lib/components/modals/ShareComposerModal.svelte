<script lang="ts">
    import {onMount} from "svelte";
    import ShareIcon from "$lib/components/icons/ShareIcon.svelte";
    import DialogModal from "$lib/components/modals/DialogModal.svelte";
    import Button from "$lib/components/Button.svelte";
    import {error, success} from "$lib/stores/toasts.svelte";
    import {debounce} from "$lib/utils/debounce";


    // Prereq
    onMount(() => {
        canUseNativeShare = !isTooLong && !!window.navigator.share;
    });

    // Local props and state
    interface Props {
        isTooLong: boolean;
        shareUrl: string | null;
        configText: string;
        onclose?: () => void;
        ondownload?: () => void;
    }

    const {isTooLong, shareUrl, configText, onclose, ondownload}: Props = $props();

    let notice = $state<string | null>(null);
    let canUseNativeShare = $state(false);

    const displayNotice = $derived(
        notice ?? (isTooLong ? null : "This link contains your config data. Share only with people you trust.")
    );

    // Button handlers
    async function copyToClipboard(text: string, successNotice: string, failureNotice: string) {
        try {
            await window.navigator.clipboard.writeText(text);
            notice = successNotice;
            success(successNotice);
        }
        catch {
            notice = failureNotice;
            error(failureNotice);
        }
    }

    const onClickCopy = debounce(() => {
        if (isTooLong) {
            void copyToClipboard(
                configText,
                "Config copied. You can share it as plain text instead of a link.",
                "Clipboard access failed. Use file export instead."
            );
        }
        else if (shareUrl) {
            void copyToClipboard(
                shareUrl,
                "Share link copied to clipboard.",
                "Select the link and copy manually."
            );
        }
    }, 300);

    async function nativeShareLink() {
        if (!shareUrl) return;
        try {
            await navigator.share({title: "Ghostty Config", text: "Ghostty config share link", url: shareUrl});
        }
        catch {
            // User cancellation should not show an error.
        }
    }
</script>


<DialogModal title="Share Config" {onclose}>
    {#snippet icon()}
        <ShareIcon />
    {/snippet}

    {#if isTooLong}
        <p class="share-modal-desc">This config is too large for reliable URL sharing across apps and browsers.</p>
    {:else}
        <p class="share-modal-desc">Review and copy the share link below.</p>
        <input
            type="text"
            class="share-link-input"
            value={shareUrl ?? ""}
            readonly
            onclick={(event) => event.currentTarget.select()}
        />
    {/if}
    {#if displayNotice}
        <p class="status-text" role="status">{displayNotice}</p>
    {/if}

    {#snippet footer()}
        <Button onclick={onclose}>Close</Button>

        {#if isTooLong}
            <Button onclick={ondownload}>Download File</Button>
        {:else if canUseNativeShare}
            <Button onclick={nativeShareLink}>Share...</Button>
        {/if}

        <Button primary onclick={onClickCopy}>{isTooLong ? "Copy Config Text" : "Copy Link"}</Button>
    {/snippet}
</DialogModal>


<style>
.share-modal-desc {
    color: var(--font-color-muted);
    font-size: 0.9rem;
    margin: 0;
    line-height: 1.5;
}

.status-text {
    color: var(--font-color-muted);
    font-size: 0.9rem;
    line-height: 1.4;
    margin: 8px 0 0;
}

.share-link-input {
    width: 100%;
    resize: vertical;
    font-family: var(--config-font-family);
    border: 1px solid var(--border-level-3);
    border-radius: var(--radius-level-4);
    background: var(--bg-input);
    color: var(--font-color);
    padding: 8px;
}

.share-link-input:focus-visible {
    outline: 1px solid var(--color-input-accent);
}
</style>
