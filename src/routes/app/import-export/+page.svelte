<script lang="ts">
    import Group from "$lib/components/settings/Group.svelte";
    import Item from "$lib/components/settings/Item.svelte";
    import Separator from "$lib/components/settings/Separator.svelte";
    import {diff, load, keyToConfig} from "$lib/stores/config.svelte";
    import {alert as showAlert} from "$lib/stores/modals.svelte";
    import parse from "$lib/utils/parse";
    import {DESKTOP, readGhosttyConfig, writeGhosttyConfig, getGhosttyConfigPath} from "$lib/wails";

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
    import ActionMenu from "$lib/components/ActionMenu.svelte";
    import ShareComposerModal from "$lib/components/modals/ShareComposerModal.svelte";
    import SharedConfigModal from "$lib/components/modals/SharedConfigModal.svelte";
    import {onMount} from "svelte";
    import {error, success} from "$lib/stores/toasts.svelte";

    const LABEL_RESET_TIMEOUT_MS = 3000;

    let pasteConfigText = $state("Clipboard");
    let copyConfigText = $state("Clipboard");

    let configPath = $state("");
    let readConfigText = $state("Load from disk");
    let writeConfigText = $state("Save to disk");

    let sharedConfigPreview = $state<string | null>(null);
    let sharedConfigParsed = $state<Record<string, string | string[]> | null>(null);
    let sharedConfigParseError = $state(false);
    let showSharedConfigModal = $state(false);

    // DESKTOP is a build-time constant; the `if` body is tree-shaken out of
    // the web bundle entirely when building with the default Vite mode.
    onMount(async () => {
        if (DESKTOP) {
            try {
                configPath = await getGhosttyConfigPath();
            }
            catch (err) {
                // eslint-disable-next-line no-console
                console.error("Could not resolve Ghostty config path:", err);
                configPath = "~/.config/ghostty/config";
            }
        }
    });


    let showShareComposer = $state(false);
    let shareUrl = $state<string | null>(null);
    let isShareTooLong = $state(false);
    let showImportActionsMenu = $state(false);
    let showExportActionsMenu = $state(false);

    const currentConfigDiff = $derived(diff());
    const hasExportableConfig = $derived(Object.keys(currentConfigDiff).length > 0);

    const importMenuItems = $derived([
        {
            label: "Import file...",
            onclick: openFilePicker
        }
    ]);

    const exportMenuItems = $derived([
        {
            label: "Download file...",
            onclick: downloadConfig,
            disabled: !hasExportableConfig
        },
        {
            label: "Share link...",
            onclick: openShareComposer,
            disabled: !hasExportableConfig
        }
    ]);

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

            showSharedConfigModal = true;
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

    async function pasteConfig() {
        if (pasteConfigText === "Pasted!") return;

        try {
            const text = await window.navigator.clipboard.readText();
            pasteConfigText = "Pasted!";
            setTimeout(() => (pasteConfigText = "Clipboard"), LABEL_RESET_TIMEOUT_MS);
            const loaded = await loadConfig(text);
            if (loaded) success("Config loaded from clipboard");
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
            void loadConfig(loadedText).then((didLoad) => {
                if (didLoad) success("Config loaded from file");
            });
        });
        reader.readAsText(file);
    }

    async function loadFromDisk() {
        if (readConfigText === "Loaded!") return;

        try {
            const text = await readGhosttyConfig();
            readConfigText = "Loaded!";
            setTimeout(() => (readConfigText = "Load from disk"), 3000);
            if (!text) return;
            const loaded = await loadConfig(text);
            if (loaded) success("Config loaded from disk");
        }
        catch (err) {
            // eslint-disable-next-line no-console
            console.error(err);
            error("Could not read Ghostty config from disk. Please open an issue on GitHub!");
        }
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
            return;
        }
        if (copyConfigText === "Copied!") return;

        try {
            await window.navigator.clipboard.writeText(stringifyConfig());
            copyConfigText = "Copied!";
            success("Config copied to clipboard");
            setTimeout(() => (copyConfigText = "Clipboard"), LABEL_RESET_TIMEOUT_MS);
        }
        catch {
            error("Clipboard access failed! Please copy manually or export to file.");
        }
    }

    function openShareComposer() {
        if (!hasExportableConfig) {
            return;
        }

        const config = stringifyConfig(false);
        const encoded = encodeConfig(config);
        const shareOrigin = typeof import.meta.env.VITE_APP_ORIGIN === "string" && import.meta.env.VITE_APP_ORIGIN.length > 0
            ? import.meta.env.VITE_APP_ORIGIN
            : window.location.origin;
        const nextShareUrl = buildShareUrl(shareOrigin, window.location.pathname, encoded);

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
            await window.navigator.clipboard.writeText(stringifyConfig(false));
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

    function downloadConfig() {
        if (!hasExportableConfig) {
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
        success("Config file downloaded");
    }

    function handleWindowKeydown(e: KeyboardEvent) {
        if (e.key !== "Escape") return;
        if (showImportActionsMenu || showExportActionsMenu) {
            showImportActionsMenu = false;
            showExportActionsMenu = false;
        }
        else if (showShareComposer) {
            closeShareComposer();
        }
        else if (showSharedConfigModal) {
            closeSharedConfigModal();
        }
    }

    function handleWindowPointerDown(e: PointerEvent) {
        const target = e.target;
        if (!(target instanceof Node)) return;

        // Check if click is outside any action menu wrapper
        const actionMenuWrappers = document.querySelectorAll(".action-menu-wrapper");
        let clickedInMenu = false;

        for (const wrapper of actionMenuWrappers) {
            if (wrapper.contains(target)) {
                clickedInMenu = true;
                break;
            }
        }

        if (!clickedInMenu) {
            showImportActionsMenu = false;
            showExportActionsMenu = false;
        }
    }

    function toggleImportActionsMenu() {
        showImportActionsMenu = !showImportActionsMenu;
        showExportActionsMenu = false;
    }

    function toggleExportActionsMenu() {
        showExportActionsMenu = !showExportActionsMenu;
        showImportActionsMenu = false;
    }

    async function saveToDisk() {
        if (writeConfigText === "Saved!") return;

        try {
            await writeGhosttyConfig(stringifyConfig());
            writeConfigText = "Saved!";
            success("Config saved to disk");
            setTimeout(() => (writeConfigText = "Save to disk"), 3000);
        }
        catch (err) {
            // eslint-disable-next-line no-console
            console.error(err);
            error("Could not save Ghostty config to disk. Please open an issue on GitHub!");
        }
    }
</script>

<svelte:window onkeydown={handleWindowKeydown} onpointerdown={handleWindowPointerDown} />

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
                {#if DESKTOP}
                    <Button primary onclick={loadFromDisk} title="Load from Ghostty config on disk">{readConfigText}</Button>
                    <ActionMenu
                        items={importMenuItems}
                        visible={showImportActionsMenu}
                        onToggle={toggleImportActionsMenu}
                        buttonLabel="More..."
                        buttonTitle="More import options"
                        menuAriaLabel="More import options"
                    />
                {:else}
                    <Button onclick={openFilePicker} title="Import from file">Import file...</Button>
                {/if}
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
                {#if DESKTOP}
                    <Button primary onclick={saveToDisk} title="Save directly to Ghostty config on disk">{writeConfigText}</Button>
                    <ActionMenu
                        items={exportMenuItems}
                        visible={showExportActionsMenu}
                        onToggle={toggleExportActionsMenu}
                        buttonLabel="More..."
                        buttonTitle={hasExportableConfig ? "More export options" : "No changes yet!"}
                        buttonDisabled={!hasExportableConfig}
                        menuAriaLabel="More export options"
                    />
                {:else}
                    <Button
                        onclick={downloadConfig}
                        title={hasExportableConfig ? "Download" : "No changes yet!"}
                        disabled={!hasExportableConfig}
                    >Download</Button>
                    <Button
                        primary
                        onclick={openShareComposer}
                        title={hasExportableConfig ? "Share your config" : "No changes yet!"}
                        disabled={!hasExportableConfig}
                    >Share</Button>
                {/if}
            </div>
        </Item>
        {#if DESKTOP && configPath}
            <Separator />
            <Item name="Config path">
                <span class="config-path">{configPath}</span>
            </Item>
        {/if}
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
    parsedConfig={sharedConfigParsed}
    previewText={sharedConfigPreview}
    parseError={sharedConfigParseError}
    keyFormatter={keyToConfig}
    onclose={closeSharedConfigModal}
    onimport={importSharedConfig}
/>
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
    flex-wrap: wrap;
    align-items: center;
}



.config-path {
    font-family: var(--font-family-mono);
    font-size: 0.9em;
    color: var(--font-color-muted);
    user-select: text;
}

</style>
