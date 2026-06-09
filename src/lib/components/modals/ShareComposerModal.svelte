<script lang="ts">
    import {onMount} from "svelte";
    import ShareIcon from "$lib/components/icons/ShareIcon.svelte";
    import DialogModal from "$lib/components/modals/DialogModal.svelte";
    import Button from "$lib/components/Button.svelte";
    import {error, success} from "$lib/stores/toasts.svelte";
    import {appName, msg, t} from "$lib/i18n.svelte";

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

    let copyLinkStatus = $state<"idle" | "copied" | "failed">("idle");
    let notice = $state<string | null>(null);
    let canUseNativeShare = $state(false);
    const displayNotice = $derived(
        notice ?? (isTooLong ? null : msg("This link contains your config data. Share only with people you trust.", "此链接包含你的配置数据，请只分享给可信的人。"))
    );
    const copyLinkText = $derived(copyLinkStatus === "copied" ? msg("Copied!", "已复制！") : copyLinkStatus === "failed" ? msg("Copy Failed", "复制失败") : msg("Copy Link", "复制链接"));

    onMount(() => {
        canUseNativeShare = !!navigator.share;
    });

    async function copyShareLink() {
        if (!shareUrl || copyLinkStatus === "copied") return;

        try {
            await window.navigator.clipboard.writeText(shareUrl);
            copyLinkStatus = "copied";
            notice = msg("Share link copied to clipboard.", "分享链接已复制到剪贴板。");
            success(msg("Share link copied to clipboard", "分享链接已复制到剪贴板"));
            setTimeout(() => (copyLinkStatus = "idle"), LABEL_RESET_TIMEOUT_MS);
        }
        catch {
            copyLinkStatus = "failed";
            notice = msg("Select the link and copy manually.", "请选择链接并手动复制。");
            error(msg("Failed to copy share link to clipboard", "无法将分享链接复制到剪贴板"));
            setTimeout(() => (copyLinkStatus = "idle"), LABEL_RESET_TIMEOUT_MS);
        }
    }

    async function nativeShareLink() {
        if (!shareUrl || !navigator.share) return;

        try {
            await navigator.share({
                title: appName(),
                text: msg("Ghostty config share link", "Ghostty 配置分享链接"),
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
            ? msg("Config copied. You can share it as plain text instead of a link.", "配置已复制。你可以改为以纯文本方式分享。")
            : msg("Clipboard access failed. Use file export instead.", "剪贴板访问失败，请改用文件导出。");
    }
</script>

<DialogModal title={msg("Share Config", "分享配置")} {onclose}>
    {#snippet icon()}
        <ShareIcon />
    {/snippet}

    {#if isTooLong}
        <p class="share-modal-desc">{msg("This config is too large for reliable URL sharing across apps and browsers.", "此配置过大，无法在应用和浏览器之间可靠地通过 URL 分享。")}</p>
        {#if displayNotice}
            <p class="status-text" role="status">{displayNotice}</p>
        {/if}
    {:else}
        <p class="share-modal-desc">{msg("Review and copy the share link below.", "请检查并复制下面的分享链接。")}</p>
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
            <Button primary onclick={copyConfigForFallback}>{msg("Copy Config Text", "复制配置文本")}</Button>
            <Button onclick={ondownload}>{msg("Download File", "下载文件")}</Button>
            <Button onclick={onclose}>{t("Close")}</Button>
        {:else}
            <Button onclick={onclose}>{t("Close")}</Button>
            {#if canUseNativeShare}
                <Button onclick={nativeShareLink}>{t("Share...")}</Button>
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
