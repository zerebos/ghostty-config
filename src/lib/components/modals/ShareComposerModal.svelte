<script lang="ts">
    import {onMount} from "svelte";
    import ShareIcon from "$lib/components/icons/ShareIcon.svelte";
    import DialogModal from "$lib/components/modals/DialogModal.svelte";
    import Button from "$lib/components/Button.svelte";
    import {error, success} from "$lib/stores/toasts.svelte";

    const LABEL_RESET_TIMEOUT_MS = 3000;

    interface Props {
        isTooLong: boolean;
        shareUrl: string | null;
        onclose?: () => void;
        ondownload?: () => void;
        oncopyconfigtext?: () => Promise<boolean> | boolean;
    }

    const {
        isTooLong,
        shareUrl,
        onclose,
        ondownload,
        oncopyconfigtext
    }: Props = $props();

    let copyLinkText = $state("Copy Link");
    let notice = $state<string | null>(null);
    let canUseNativeShare = $state(false);
    const displayNotice = $derived(
        notice ?? (isTooLong ? null : "This link contains your config data. Share only with people you trust.")
    );

    onMount(() => {
        canUseNativeShare = !!navigator.share;
    });

    async function copyShareLink() {
        if (!shareUrl || copyLinkText === "Copied!") return;

        try {
            await window.navigator.clipboard.writeText(shareUrl);
            copyLinkText = "Copied!";
            notice = "Share link copied to clipboard.";
            success("Share link copied to clipboard");
            setTimeout(() => (copyLinkText = "Copy Link"), LABEL_RESET_TIMEOUT_MS);
        }
        catch {
            copyLinkText = "Copy Failed";
            notice = "Select the link and copy manually.";
            error("Failed to copy share link to clipboard");
            setTimeout(() => (copyLinkText = "Copy Link"), LABEL_RESET_TIMEOUT_MS);
        }
    }

    async function nativeShareLink() {
        if (!shareUrl || !navigator.share) return;

        try {
            await navigator.share({
                title: "Ghostty Config",
                text: "Ghostty config share link",
                url: shareUrl
            });
        }
        catch {
            // User cancellation should not show an error.
        }
    }

    async function copyConfigForFallback() {
        if (!oncopyconfigtext) return;

        const ok = await oncopyconfigtext();
        notice = ok
            ? "Config copied. You can share it as plain text instead of a link."
            : "Clipboard access failed. Use file export instead.";
    }
</script>

<DialogModal title="Share Config" {onclose}>
    {#snippet icon()}
        <ShareIcon />
    {/snippet}

    {#if isTooLong}
        <p class="share-modal-desc">This config is too large for reliable URL sharing across apps and browsers.</p>
        {#if displayNotice}
            <p class="status-text" role="status">{displayNotice}</p>
        {/if}
    {:else}
        <p class="share-modal-desc">Review and copy the share link below.</p>
        <input
            type="text"
            class="share-link-input"
            value={shareUrl ?? ""}
            readonly
            onclick={(event) => event.currentTarget.select()}
        />
        {#if displayNotice}
            <p class="status-text" role="status">{displayNotice}</p>
        {/if}
    {/if}

    {#snippet footer()}
        {#if isTooLong}
            <Button primary onclick={copyConfigForFallback}>Copy Config Text</Button>
            <Button onclick={ondownload}>Download File</Button>
            <Button onclick={onclose}>Close</Button>
        {:else}
            <Button onclick={onclose}>Close</Button>
            {#if canUseNativeShare}
                <Button onclick={nativeShareLink}>Share...</Button>
            {/if}
            <Button primary onclick={copyShareLink}>{copyLinkText}</Button>
        {/if}
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
