<script lang="ts">
    import Group from "$lib/components/settings/Group.svelte";
    import Item from "$lib/components/settings/Item.svelte";
    import Separator from "$lib/components/settings/Separator.svelte";
    import {diff, diffFromDefaults, load} from "$lib/stores/config.svelte";
    import {alert as showAlert} from "$lib/stores/modals.svelte";
    import {parse, serialize} from "$lib/utils/parse";
    import {buildShareUrl, decodeConfig, encodeConfig, getSharePayloadFromHash, MAX_SHARE_URL_LENGTH, removeSharePayloadFromHash} from "$lib/utils/share";
    import Page from "$lib/views/Page.svelte";
    import Button from "$lib/components/Button.svelte";
    import ShareComposerModal from "$lib/components/modals/ShareComposerModal.svelte";
    import SharedConfigModal from "$lib/components/modals/SharedConfigModal.svelte";
    import {onMount} from "svelte";
    import {error, success} from "$lib/stores/toasts.svelte";
    import ImportConfigModal from "$lib/components/modals/ImportConfigModal.svelte";
    import {debounce, withPendingGuard} from "$lib/utils/debounce";


    const DEBOUNCE_DELAY_MS = 300;

    let sharedConfigPreview = $state<string | null>(null);
    let sharedConfigParsed = $state<Record<string, string | string[]> | null>(null);
    let sharedConfigParsedDiff = $state<Record<string, string | string[]> | null>(null);
    let sharedConfigParseError = $state(false);
    let showSharedConfigModal = $state(false);

    let importConfigPreview = $state<string | null>(null);
    let importConfigParsed = $state<Record<string, string | string[]> | null>(null);
    let importConfigParsedDiff = $state<Record<string, string | string[]> | null>(null);
    let importConfigParseError = $state(false);
    let showImportConfigModal = $state(false);

    let showShareComposer = $state(false);
    let shareUrl = $state<string | null>(null);
    let isShareTooLong = $state(false);

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
                sharedConfigParsed = parse(decodedConfig);
                sharedConfigParsedDiff = diffFromDefaults(sharedConfigParsed) as Record<string, string | string[]> | null;
                sharedConfigParseError = false;
            }
            catch {
                // Parsing failed, will fall back to raw text display
                sharedConfigParsed = null;
                sharedConfigParseError = true;
            }

            const anyKeys = sharedConfigParsedDiff && Object.keys(sharedConfigParsedDiff).length > 0;
            if (anyKeys) {
                showSharedConfigModal = true;
            }
            else {
                void showAlert({
                    title: "No config found",
                    message: "We couldn't find any valid config settings in the shared URL.",
                    buttonText: "Dismiss"
                });
                clearShareHashFromAddressBar();
            }
        }
        catch {
            error("Failed to read shared config from URL");
            clearShareHashFromAddressBar();
        }
    }

    function clearShareHashFromAddressBar() {
        const cleanedHash = removeSharePayloadFromHash(window.location.hash);
        const nextUrl = `${window.location.pathname}${window.location.search}${cleanedHash}`;
        window.history.replaceState(null, "", nextUrl);
    }

    async function loadConfig(candidate: string): Promise<boolean> {
        let parsed;
        try {
            // TODO: remove this assertions when the return type of parse is fixed
            parsed = parse(candidate) as Parameters<typeof load>[0];
        }
        catch (parseError) {
            // eslint-disable-next-line no-console
            console.error(parseError);
            await showAlert({
                title: "Could not parse config",
                message: "Something went wrong while parsing your config. Please open an issue on GitHub.",
                buttonText: "Dismiss"
            });
            return false;
        }

        try {
            load(parsed);
        }
        catch (loadError) {
            // eslint-disable-next-line no-console
            console.error(loadError);
            await showAlert({
                title: "Could not load config",
                message: "Something went wrong while loading your parsed config. Please open an issue on GitHub.",
                buttonText: "Dismiss"
            });
            return false;
        }

        return true;
    }

    function showImportModal(text: string, source: "clipboard" | "file" = "clipboard") {
        importConfigPreview = text;

        try {
            importConfigParsed = parse(text);
            importConfigParseError = false;
            importConfigParsedDiff = diffFromDefaults(importConfigParsed) as Record<string, string | string[]> | null;
        }
        catch {
            importConfigParsed = null;
            importConfigParseError = true;
        }

        const anyKeys = importConfigParsedDiff && Object.keys(importConfigParsedDiff).length > 0;

        if (anyKeys) {
            showImportConfigModal = true;
        }
        else {
            void showAlert({
                title: "No config found",
                message: `We couldn't find any valid config settings in the ${source} you provided.`,
                buttonText: "Dismiss"
            });
        }
    }

    async function pasteConfig() {
        try {
            const text = await window.navigator.clipboard.readText();
            showImportModal(text, "clipboard");
        }
        catch {
            error("Clipboard access failed! Please paste manually or import from file.");
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
            if (!loadedText) return;
            showImportModal(loadedText, "file");
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

    function openShareComposer() {
        if (!hasExportableConfig) return;

        const config = serialize(currentConfigDiff, false);
        const encoded = encodeConfig(config);
        const nextShareUrl = buildShareUrl(window.location.origin, window.location.pathname, encoded);

        isShareTooLong = nextShareUrl.length > MAX_SHARE_URL_LENGTH;
        shareUrl = isShareTooLong ? null : nextShareUrl;
        showShareComposer = true;
    }

    function closeShareComposer() {
        showShareComposer = false;
        shareUrl = null;
        isShareTooLong = false;
    }

    async function copyConfigForFallback() {
        try {
            await window.navigator.clipboard.writeText(serialize(currentConfigDiff, false));
            return true;
        }
        catch {
            return false;
        }
    }

    async function importSharedConfig() {
        if (sharedConfigPreview) {
            const loaded = await loadConfig(sharedConfigPreview);
            if (loaded) success("Shared config imported");
        }
        closeSharedConfigModal();
    }

    function closeSharedConfigModal() {
        showSharedConfigModal = false;
        sharedConfigPreview = null;
        sharedConfigParsed = null;
        sharedConfigParseError = false;
        clearShareHashFromAddressBar();
    }

    function closeImportConfigModal() {
        showImportConfigModal = false;
        importConfigPreview = null;
        importConfigParsed = null;
        importConfigParseError = false;
    }

    async function importImportConfig() {
        if (importConfigPreview) {
            const loaded = await loadConfig(importConfigPreview);
            if (loaded) success("Config imported");
        }
        closeImportConfigModal();
    }

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
    }, DEBOUNCE_DELAY_MS);

    function handleWindowKeydown(e: KeyboardEvent) {
        if (e.key !== "Escape") return;
        if (showShareComposer) closeShareComposer();
        else if (showSharedConfigModal) closeSharedConfigModal();
    }
</script>

<svelte:window onkeydown={handleWindowKeydown} />

<Page title="Import & Export">
    <div class="preview">
        {#if hasExportableConfig}
            <div class="row p2"># Config generated by Ghostty Config</div>
            <div class="row p2"># https://ghostty.zerebos.com</div>
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
                <Button onclick={openFilePicker} title="Upload">Choose File...</Button>
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
    onclose={closeShareComposer}
    ondownload={downloadConfig}
    oncopyconfigtext={copyConfigForFallback}
/>
{/if}

{#if showSharedConfigModal}
<SharedConfigModal
    parsedConfig={sharedConfigParsedDiff}
    previewText={sharedConfigPreview}
    parseError={sharedConfigParseError}
    onclose={closeSharedConfigModal}
    onimport={importSharedConfig}
/>
{/if}

{#if showImportConfigModal}
<ImportConfigModal
    parsedConfig={importConfigParsedDiff}
    previewText={importConfigPreview}
    parseError={importConfigParseError}
    onclose={closeImportConfigModal}
    onimport={importImportConfig}
/>
{/if}


<style>
.preview {
    background: var(--config-bg);
    font-family: var(--config-font-family);
    font-size: var(--config-font-size);
    color: var(--config-fg);
    min-height: 175px;
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

</style>
