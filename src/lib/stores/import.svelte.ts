import {parse} from "$lib/utils/parse";
import {diffFromDefaults, load} from "$lib/stores/config.svelte";
import {decodeConfig, getSharePayloadFromHash, removeSharePayloadFromHash} from "$lib/utils/share";
import {error, success} from "$lib/stores/toasts.svelte";
import {alert as showAlert} from "$lib/stores/modals.svelte";

export type ImportSource = "share" | "clipboard" | "file";

export interface PreviewState {
    source: ImportSource;
    text: string;
    parsed: Record<string, string | string[]> | null;
    parsedDiff: Record<string, string | string[]> | null;
    parseError: boolean;
}

const SOURCE_INFO: Record<ImportSource, {title: string; description: string; noConfigMessage: string; successMessage: string;}> = {
    share: {
        title: "Shared Config",
        description: "Someone shared a Ghostty config with you. Review it before importing.",
        noConfigMessage: "We couldn't find any valid config settings in the shared URL.",
        successMessage: "Shared config imported"
    },
    clipboard: {
        title: "Import Config",
        description: "Importing will overwrite any changes you have made. Review it before importing.",
        noConfigMessage: "We couldn't find any valid config settings in the clipboard you provided.",
        successMessage: "Config imported"
    },
    file: {
        title: "Import Config",
        description: "Importing will overwrite any changes you have made. Review it before importing.",
        noConfigMessage: "We couldn't find any valid config settings in the file you provided.",
        successMessage: "Config imported"
    }
};

export const incomingImport = $state<{preview: PreviewState | null; show: boolean;}>({preview: null, show: false});

export function getSourceInfo(source: ImportSource) {
    return SOURCE_INFO[source];
}

function clearHash() {
    if (typeof window === "undefined") return;
    const cleaned = removeSharePayloadFromHash(window.location.hash);
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}${cleaned}`);
}

function buildPreview(source: ImportSource, text: string): PreviewState {
    try {
        const parsed = parse(text);
        const parsedDiff = diffFromDefaults(parsed as Parameters<typeof load>[0]) as Record<string, string | string[]>;
        return {source, text, parsed, parsedDiff, parseError: false};
    }
    catch {
        return {source, text, parsed: null, parsedDiff: null, parseError: true};
    }
}

export function checkTextForImport(source: ImportSource, text: string) {
    const preview = buildPreview(source, text);
    const hasKeys = preview.parsedDiff && Object.keys(preview.parsedDiff).length > 0;

    if (!hasKeys && !preview.parseError) {
        void showAlert({title: "No config found", message: SOURCE_INFO[source].noConfigMessage, buttonText: "Dismiss"});
        if (source === "share") clearHash();
        return;
    }

    incomingImport.preview = preview;
    incomingImport.show = true;
}

export function checkHashForShare() {
    if (typeof window === "undefined") return;
    const payload = getSharePayloadFromHash(window.location.hash);
    if (!payload) return;

    try {
        checkTextForImport("share", decodeConfig(payload));
    }
    catch {
        error("Failed to read shared config from URL");
        clearHash();
    }
}

export async function applyIncomingImport() {
    if (!incomingImport.preview?.parsed) return;
    const {source, parsed} = incomingImport.preview;

    try {
        load(parsed);
        success(SOURCE_INFO[source].successMessage);
    }
    catch (err) {
        console.error(err); // eslint-disable-line no-console
        await showAlert({
            title: "Could not load config",
            message: "Something went wrong while loading your parsed config. Please open an issue on GitHub.",
            buttonText: "Dismiss"
        });
    }

    dismissIncomingImport();
}

export function dismissIncomingImport() {
    incomingImport.show = false;
    incomingImport.preview = null;
    clearHash();
}