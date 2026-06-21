<script lang="ts">
    import Group from "$lib/components/settings/Group.svelte";
    import Item from "$lib/components/settings/Item.svelte";
    import Separator from "$lib/components/settings/Separator.svelte";
    import {diff} from "$lib/stores/config.svelte";
    // import {alert as showAlert} from "$lib/stores/modals.svelte";
    import {serialize} from "$lib/utils/parse";
    import {buildShareUrl, encodeConfig, MAX_SHARE_URL_LENGTH} from "$lib/utils/share";
    import Page from "$lib/views/Page.svelte";
    import Button from "$lib/components/Button.svelte";
    import ShareComposerModal from "$lib/components/modals/ShareComposerModal.svelte";
    import {onMount} from "svelte";
    import {error, success} from "$lib/stores/toasts.svelte";
    import {debounce, withPendingGuard} from "$lib/utils/debounce";
    import {applyIncomingImport, checkHashForShare, checkTextForImport, dismissIncomingImport, getSourceInfo, incomingImport} from "$lib/stores/import.svelte";
    import ConfigPreviewModal from "$lib/components/modals/ConfigPreviewModal.svelte";
    import ShareIcon from "$lib/components/icons/ShareIcon.svelte";
    import ImportIcon from "$lib/components/icons/ImportIcon.svelte";
    import ConfigPreview from "$lib/components/ConfigPreview.svelte";

    // Handling for share urls
    onMount(() => {
        checkHashForShare();
        const handler = () => checkHashForShare();
        window.addEventListener("hashchange", handler);
        return () => window.removeEventListener("hashchange", handler);
    });

    // Local states
    const currentConfigDiff = $derived(diff());
    const hasExportableConfig = $derived(Object.keys(currentConfigDiff).length > 0);

    // Button handlers
    async function pasteConfig() {
        try {
            const text = await window.navigator.clipboard.readText();
            checkTextForImport("clipboard", text);
        }
        catch {
            error("Clipboard access failed! Please paste manually or import from file.");
        }
    }

    let filePicker: HTMLInputElement | null = $state(null);
    function selectFile() {
        const file = filePicker?.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.addEventListener("load", (event) => {
            // eslint-disable-next-line @typescript-eslint/no-base-to-string
            const loadedText = event.target?.result?.toString();
            if (!loadedText) return;
            checkTextForImport("file", loadedText);
        });
        reader.readAsText(file);
    }

    const copyConfig = withPendingGuard(async () => {
        if (!hasExportableConfig) return;

        try {
            await window.navigator.clipboard.writeText(serialize(currentConfigDiff));
            success("Config copied to clipboard");
        }
        catch {
            error("Clipboard access failed! Please copy manually or export to file.");
        }
    });

    const downloadConfig = debounce(function() {
        if (!hasExportableConfig) return;

        const blob = new Blob([serialize(currentConfigDiff)], {type: "text/plain"});
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "ghostty-config";
        link.click();

        URL.revokeObjectURL(url);
        success("Config file downloaded");
    }, 300);


    // Share Composer Modal Logic
    let showShareComposer = $state(false);
    let shareUrl = $state<string | null>(null);
    let shareConfigText = $state("");
    let isShareTooLong = $state(false);
    function openShareComposer() {
        if (!hasExportableConfig) return;

        const config = serialize(currentConfigDiff, false);
        const encoded = encodeConfig(config);
        const nextShareUrl = buildShareUrl(window.location.origin, window.location.pathname, encoded);

        isShareTooLong = nextShareUrl.length > MAX_SHARE_URL_LENGTH;
        shareUrl = isShareTooLong ? null : nextShareUrl;
        shareConfigText = config;
        showShareComposer = true;
    }

    function closeShareComposer() {
        showShareComposer = false;
        shareUrl = null;
        shareConfigText = "";
        isShareTooLong = false;
    }

    function handleWindowKeydown(e: KeyboardEvent) {
        if (e.key !== "Escape") return;
        if (showShareComposer) closeShareComposer();
        else if (incomingImport.show) dismissIncomingImport();
    }
</script>

<svelte:window onkeydown={handleWindowKeydown} />

<Page title="Import & Export">
    <ConfigPreview parsed={currentConfigDiff} parsedDiff={currentConfigDiff} />

    <Group title="Import">
        <Item name="From Clipboard" note="Paste a config copied to your clipboard">
            <div class="button-group">
                <Button onclick={pasteConfig} title="Paste">Import</Button>
            </div>
        </Item>
        <Separator />
        <Item name="From File" note="Upload a config file from your device">
            <div class="button-group">
                <input id="config-input" type="file" onchange={selectFile} bind:this={filePicker} />
                <Button onclick={() => filePicker?.click()} title="Upload">Choose File...</Button>
            </div>
        </Item>
    </Group>
    <Group title="Export">
        <Item name="Copy to Clipboard" note="Copy your config to the clipboard to paste elsewhere">
            <div class="button-group">
                <Button
                    onclick={copyConfig}
                    title={hasExportableConfig ? "Copy" : "No changes yet!"}
                    disabled={!hasExportableConfig}
                >Copy</Button>
            </div>
        </Item>
        <Separator />
        <Item name="Download File" note="Save as a config file you can place in Ghostty's config directory">
            <div class="button-group">
                <Button
                    onclick={downloadConfig}
                    title={hasExportableConfig ? "Download" : "No changes yet!"}
                    disabled={!hasExportableConfig}
                >Download</Button>
            </div>
        </Item>
        <Separator />
        <Item name="Share Link" note="Generate a link others can use to import your config">
            <div class="button-group">
                <Button
                    primary
                    onclick={openShareComposer}
                    title={hasExportableConfig ? "Share your config" : "No changes yet!"}
                    disabled={!hasExportableConfig}
                >Share</Button>
            </div>
        </Item>
    </Group>
</Page>

{#if showShareComposer}
<ShareComposerModal
    isTooLong={isShareTooLong}
    {shareUrl}
    configText={shareConfigText}
    onclose={closeShareComposer}
    ondownload={downloadConfig}
/>
{/if}


{#if incomingImport.show && incomingImport.preview}
    {@const info = getSourceInfo(incomingImport.preview.source)}
    <ConfigPreviewModal
        title={info.title}
        description={info.description}
        parsedConfig={incomingImport.preview?.parsedDiff ?? null}
        previewText={incomingImport.preview?.text ?? null}
        parseError={incomingImport.preview?.parseError ?? false}
        onclose={dismissIncomingImport}
        onimport={applyIncomingImport}
    >
    {#snippet icon()}
    {#if incomingImport.preview!.source === "share"}
        <ShareIcon />
    {:else}
        <ImportIcon />
    {/if}
    {/snippet}
    </ConfigPreviewModal>
{/if}


<style>
#config-input {
    display: none;
}

.button-group {
    display: flex;
    gap: 12px;
}
</style>
