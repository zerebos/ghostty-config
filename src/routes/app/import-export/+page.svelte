<script lang="ts">
    import Group from "$lib/components/settings/Group.svelte";
    import Item from "$lib/components/settings/Item.svelte";
    import Separator from "$lib/components/settings/Separator.svelte";
    import {diff, load, keyToConfig} from "$lib/stores/config.svelte";
    import parse from "$lib/utils/parse";
    import {
        buildShareUrl,
        decodeConfig,
        encodeConfig,
        getSharePayloadFromHash,
        MAX_SHARE_URL_LENGTH,
        removeSharePayloadFromHash
    } from "$lib/utils/share";
    import Page from "$lib/views/Page.svelte";
    import Button from "$lib/components/Button.svelte";
    import {onMount} from "svelte";
    import {fade, fly} from "svelte/transition";

    const LABEL_RESET_TIMEOUT_MS = 3000;

    let pasteConfigText = $state("Clipboard");
    let copyConfigText = $state("Clipboard");
    let pageNotice = $state<string | null>(null);

    let sharedConfigPreview = $state<string | null>(null);
    let sharedConfigParsed = $state<Record<string, string | string[]> | null>(null);
    let sharedConfigParseError = $state(false);
    let showSharedConfigModal = $state(false);

    let showShareComposer = $state(false);
    let shareUrl = $state<string | null>(null);
    let shareCopyText = $state("Copy Link");
    let shareNotice = $state<string | null>(null);
    let isShareTooLong = $state(false);
    let canUseNativeShare = $state(false);

    const currentConfigDiff = $derived(diff());
    const hasExportableConfig = $derived(Object.keys(currentConfigDiff).length > 0);

    onMount(() => {
        maybeShowSharedConfigFromHash();
        const handler = () => maybeShowSharedConfigFromHash();
        window.addEventListener("hashchange", handler);
        return () => window.removeEventListener("hashchange", handler);
    });

    function maybeShowSharedConfigFromHash() {
        const shareParam = getSharePayloadFromHash(window.location.hash);
        if (!shareParam) return;

        try {
            const decodedConfig = decodeConfig(shareParam);
            sharedConfigPreview = decodedConfig;

            // Try to parse for pretty display
            try {
                sharedConfigParsed = parse(decodedConfig) as Record<string, string | string[]>;
                sharedConfigParseError = false;
            }
            catch {
                // Parsing failed, will fall back to raw text display
                sharedConfigParsed = null;
                sharedConfigParseError = true;
            }

            pageNotice = null;
            showSharedConfigModal = true;
        }
        catch {
            pageNotice = "Could not read shared config link.";
            clearShareHashFromAddressBar();
        }
    }

    function clearShareHashFromAddressBar() {
        const cleanedHash = removeSharePayloadFromHash(window.location.hash);
        const nextUrl = `${window.location.pathname}${window.location.search}${cleanedHash}`;
        window.history.replaceState(null, "", nextUrl);
    }

    // TODO: move alert() to real modals
    function loadConfig(candidate: string) {
        let parsed;
        try {
            // TODO: remove this assertions when the return type of parse is fixed
            parsed = parse(candidate) as Parameters<typeof load>[0];
        }
        catch (parseError) {
            // eslint-disable-next-line no-console
            console.error(parseError);
            alert("Something went wrong trying to parse your config. Please open an issue on GitHub!");
            return;
        }

        try {
            load(parsed);
        }
        catch (loadError) {
            // eslint-disable-next-line no-console
            console.error(loadError);
            alert("Something went wrong trying to load your parsed config. Please open an issue on GitHub!");
        }
    }

    async function pasteConfig() {
        if (pasteConfigText === "Pasted!") return;

        try {
            const text = await window.navigator.clipboard.readText();
            pasteConfigText = "Pasted!";
            setTimeout(() => (pasteConfigText = "Clipboard"), LABEL_RESET_TIMEOUT_MS);
            loadConfig(text);
        }
        catch {
            pageNotice = "Clipboard access failed. Paste manually or import from file.";
        }
    }

    let filePicker: HTMLInputElement;
    function openFilePicker() {
        filePicker.click();
    }

    function selectFile() {
        const file = filePicker.files![0];
        const reader = new FileReader();
        reader.addEventListener("load", (event) => {
            // eslint-disable-next-line @typescript-eslint/no-base-to-string
            const loadedText = event.target?.result?.toString();
            if (loadedText) loadConfig(loadedText);
        });
        reader.readAsText(file);
    }

    // Move to module
    function stringifyConfig(includeHeader = true) {
        const config = currentConfigDiff;
        const lines = includeHeader ? ["# Config generated by Ghostty Config\n"] : [];
        for (const key in config) {
            if (!Array.isArray(config[key])) {
                lines.push(`${key} = ${config[key]}`);
            }
            else {
                for (let i = 0; i < config[key].length; i++) {
                    lines.push(`${key} = ${config[key][i]}`);
                }
            }
        }

        return lines.join("\n");
    }

    async function copyConfig() {
        if (!hasExportableConfig) {
            pageNotice = "No changes to export yet.";
            return;
        }
        if (copyConfigText === "Copied!") return;

        try {
            await window.navigator.clipboard.writeText(stringifyConfig());
            copyConfigText = "Copied!";
            setTimeout(() => (copyConfigText = "Clipboard"), LABEL_RESET_TIMEOUT_MS);
        }
        catch {
            pageNotice = "Clipboard access failed. Use file export instead.";
        }
    }

    function openShareComposer() {
        if (!hasExportableConfig) {
            pageNotice = "No changes to export yet.";
            return;
        }

        const config = stringifyConfig(false);
        const encoded = encodeConfig(config);
        const nextShareUrl = buildShareUrl(window.location.origin, window.location.pathname, encoded);

        shareCopyText = "Copy Link";
        shareNotice = "This link contains your config data. Share only with people you trust.";
        isShareTooLong = nextShareUrl.length > MAX_SHARE_URL_LENGTH;
        shareUrl = isShareTooLong ? null : nextShareUrl;
        canUseNativeShare = !!navigator.share;
        showShareComposer = true;
    }

    function closeShareComposer() {
        showShareComposer = false;
        shareUrl = null;
        shareNotice = null;
        isShareTooLong = false;
    }

    async function copyShareLink() {
        if (!shareUrl || shareCopyText === "Copied!") return;

        try {
            await window.navigator.clipboard.writeText(shareUrl);
            shareCopyText = "Copied!";
            shareNotice = "Share link copied to clipboard.";
            setTimeout(() => (shareCopyText = "Copy Link"), LABEL_RESET_TIMEOUT_MS);
        }
        catch {
            shareCopyText = "Copy Failed";
            shareNotice = "Select the link and copy manually.";
            setTimeout(() => (shareCopyText = "Copy Link"), LABEL_RESET_TIMEOUT_MS);
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
        try {
            await window.navigator.clipboard.writeText(stringifyConfig(false));
            shareNotice = "Config copied. You can share it as plain text instead of a link.";
        }
        catch {
            shareNotice = "Clipboard access failed. Use file export instead.";
        }
    }

    function importSharedConfig() {
        if (sharedConfigPreview) loadConfig(sharedConfigPreview);
        closeSharedConfigModal();
    }

    function closeSharedConfigModal() {
        showSharedConfigModal = false;
        sharedConfigPreview = null;
        sharedConfigParsed = null;
        sharedConfigParseError = false;
        clearShareHashFromAddressBar();
    }

    function downloadConfig() {
        if (!hasExportableConfig) {
            pageNotice = "No changes to export yet.";
            return;
        }

        const file = new File([stringifyConfig()], "config", {type: "text/plain"});
        const link = document.createElement("a");
        const url = URL.createObjectURL(file);
        link.href = url;
        link.download = file.name;
        link.style.display = "none";
        document.body.append(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
    }

    function handleWindowKeydown(e: KeyboardEvent) {
        if (e.key !== "Escape") return;
        if (showShareComposer) closeShareComposer();
        else if (showSharedConfigModal) closeSharedConfigModal();
    }
</script>

<svelte:window onkeydown={handleWindowKeydown} />

<Page title="Import & Export">
    <Group flex={1}>
        <div class="preview">
            {#if hasExportableConfig}
                <div class="row p2"># Config generated by Ghostty Config</div>
            {:else}
                <div class="row p2"># No changes to the default config yet</div>
            {/if}
            <div class="row">&nbsp;</div>

            {#if hasExportableConfig}
                {#each Object.entries(currentConfigDiff) as [key, value], i (i)}
                    {#if Array.isArray(value)}
                        {#each value as val, v (v)}
                        <div class="row"><span class="p4">{key}</span> = <span class="p5">{val}</span></div>
                        {/each}
                    {:else}
                        <div class="row"><span class="p4">{key}</span> = <span class="p5">{value}</span></div>
                    {/if}
                {/each}
            {/if}
        </div>
        <Separator />
        <Item name="Import">
            <div class="button-group">
                <Button onclick={pasteConfig} title="Paste">{pasteConfigText}</Button>
                <input id="config-input" type="file" onchange={selectFile} bind:this={filePicker} />
                <Button onclick={openFilePicker} title="Upload">File...</Button>
            </div>
        </Item>
        <Separator />
        <Item name="Export">
            <div class="button-group">
                <Button
                    onclick={copyConfig}
                    title={hasExportableConfig ? "Copy" : "No changes yet!"}
                    disabled={!hasExportableConfig}
                >{copyConfigText}</Button>
                <Button
                    onclick={downloadConfig}
                    title={hasExportableConfig ? "Download" : "No changes yet!"}
                    disabled={!hasExportableConfig}
                >File...</Button>
                <Button
                    primary
                    onclick={openShareComposer}
                    title={hasExportableConfig ? "Share your config" : "No changes yet!"}
                    disabled={!hasExportableConfig}
                >Share...</Button>
            </div>
            {#if pageNotice}
                <p class="status-text" role="status">{pageNotice}</p>
            {/if}
        </Item>
    </Group>
</Page>

{#if showShareComposer}
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div class="share-modal-backdrop" role="presentation" transition:fade={{duration: 200}} onclick={closeShareComposer}>
    <div class="share-modal" transition:fly={{y: -30, duration: 200}} role="dialog" aria-modal="true" aria-label="Share Config" tabindex="-1" onclick={(e) => e.stopPropagation()}>
        <div class="share-modal-header">
            <span class="share-icon" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
            </span>
            <h2>Share Config</h2>
            <button type="button" class="close-btn" onclick={closeShareComposer} aria-label="Dismiss">&times;</button>
        </div>
        {#if isShareTooLong}
            <p class="share-modal-desc">This config is too large for reliable URL sharing across apps and browsers.</p>
            <div class="share-modal-actions">
                <Button primary onclick={copyConfigForFallback}>Copy Config Text</Button>
                <Button onclick={downloadConfig}>Download File</Button>
                <Button onclick={closeShareComposer}>Close</Button>
            </div>
        {:else}
            <p class="share-modal-desc">Review and copy the share link below.</p>
            <input
                type="text"
                class="share-link-input"
                value={shareUrl ?? ""}
                readonly
                onclick={(event) => event.currentTarget.select()}
            />
            {#if shareNotice}
                <p class="status-text" role="status">{shareNotice}</p>
            {/if}
            <div class="share-modal-actions">
                <Button onclick={closeShareComposer}>Close</Button>
                {#if canUseNativeShare}
                    <Button onclick={nativeShareLink}>Share...</Button>
                {/if}
                <Button primary onclick={copyShareLink}>{shareCopyText}</Button>
            </div>
        {/if}
    </div>
</div>
{/if}

{#if showSharedConfigModal}
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div class="share-modal-backdrop" role="presentation" transition:fade={{duration: 200}} onclick={closeSharedConfigModal}>
    <div class="share-modal" transition:fly={{y: -30, duration: 200}} role="dialog" aria-modal="true" aria-label="Shared Config" tabindex="-1" onclick={(e) => e.stopPropagation()}>
        <div class="share-modal-header">
            <span class="share-icon" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
            </span>
            <h2>Shared Config</h2>
            <button type="button" class="close-btn" onclick={closeSharedConfigModal} aria-label="Dismiss">&times;</button>
        </div>
        <p class="share-modal-desc">Someone shared a Ghostty config with you. Review it before importing.</p>
        <div class="share-preview">
            {#if sharedConfigParsed}
                <div class="row p2"># Config generated by Ghostty Config</div>
                <div class="row">&nbsp;</div>
                {#each Object.entries(sharedConfigParsed) as [key, value], i (i)}
                    {#if Array.isArray(value)}
                        {#each value as val, v (v)}
                        {#if val !== ""}
                            <div class="row"><span class="p4">{keyToConfig(key)}</span> = <span class="p5">{val}</span></div>
                        {/if}
                        {/each}
                    {:else}
                        <div class="row"><span class="p4">{keyToConfig(key)}</span> = <span class="p5">{value}</span></div>
                    {/if}
                {/each}
            {:else}
                {#if sharedConfigParseError}
                    <div class="row p2"># Could not parse config structure. Showing raw text:</div>
                    <div class="row">&nbsp;</div>
                {/if}
                {#each (sharedConfigPreview ?? "").split("\n") as line, i (i)}
                    <div class="row">{line}</div>
                {/each}
            {/if}
        </div>
        <div class="share-modal-actions">
            <Button onclick={closeSharedConfigModal}>Dismiss</Button>
            <Button primary onclick={importSharedConfig}>Import Config</Button>
        </div>
    </div>
</div>
{/if}

<style>
.preview {
    background: var(--config-bg);
    font-family: var(--config-font-family);
    font-size: var(--config-font-size);
    color: var(--config-fg);
    min-height: 200px;
    overflow-y: auto;
    padding: 8px;
    border-radius: var(--radius-level-3);
    border: 1px solid rgba(0, 0, 0, 0.5);
    box-shadow: 0 0 1px rgba(255, 255, 255, 0.5) inset;
    flex: 1;
    user-select: text;
}

.preview .row {
    display: block;
    white-space: pre;
}

/* .bold {font-weight: 700;} */

/* .fg {color: var(--config-fg);} */

/* .p0 {color: var(--config-palette-0);} */
/* .p1 {color: var(--config-palette-1);} */
.p2 {color: var(--config-palette-2);}
/* .p3 {color: var(--config-palette-3);} */
.p4 {color: var(--config-palette-4);}
.p5 {color: var(--config-palette-5);}
/* .p6 {color: var(--config-palette-6);}
.p7 {color: var(--config-palette-7);}
.p8 {color: var(--config-palette-8);}
.p9 {color: var(--config-palette-9);}
.p10 {color: var(--config-palette-10);}
.p11 {color: var(--config-palette-11);}
.p12 {color: var(--config-palette-12);} */
/* .p13 {color: var(--config-palette-13);}
.p14 {color: var(--config-palette-14);}
.p15 {color: var(--config-palette-15);} */


#config-input {
    display: none;
}

.button-group {
    display: flex;
    gap: 12px;
}

.status-text {
    color: var(--font-color-muted);
    font-size: 0.9rem;
    line-height: 1.4;
    margin: 8px 0 0;
}

.share-modal-backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.55);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    border-radius: var(--radius-level-1);
}

.share-modal {
    background: var(--bg-modal);
    border: 1px solid var(--border-level-3);
    border-radius: var(--radius-level-2);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
    width: 90%;
    max-width: 480px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 20px;
    max-height: 80%;
}

.share-modal-header {
    display: flex;
    align-items: center;
    gap: 8px;
}

.share-modal-header h2 {
    flex: 1;
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0;
}

.share-icon {
    display: flex;
    align-items: center;
    color: var(--color-input-accent);
}

.close-btn {
    border: 0;
    background: transparent;
    box-shadow: none;
    font-size: 1.4rem;
    padding: 0 4px;
    line-height: 1;
    color: var(--font-color-muted);
    cursor: pointer;
}

.close-btn:hover {
    color: var(--font-color);
}

.share-modal-desc {
    color: var(--font-color-muted);
    font-size: 0.9rem;
    margin: 0;
    line-height: 1.5;
}

.share-preview {
    background: var(--config-bg);
    font-family: var(--config-font-family);
    font-size: var(--config-font-size);
    color: var(--config-fg);
    overflow-y: auto;
    padding: 8px;
    border-radius: var(--radius-level-3);
    border: 1px solid rgba(0, 0, 0, 0.5);
    box-shadow: 0 0 1px rgba(255, 255, 255, 0.5) inset;
    flex: 1;
    user-select: text;
    min-height: 80px;
    max-height: 280px;
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

.share-preview .row {
    display: block;
    white-space: pre;
}

.share-modal-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    padding-top: 20px;
    margin-top: 20px;
    position: relative;
}

.share-modal-actions::before {
    content: "";
    position: absolute;
    left: -20px;
    right: -20px;
    top: 0;
    height: 1px;
    background: var(--bg-level-3);
}
</style>
