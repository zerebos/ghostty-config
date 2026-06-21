import {parse} from "$lib/utils/parse";
import {diffFromDefaults, load} from "$lib/stores/config.svelte";
import {decodeConfig, getSharePayloadFromHash, removeSharePayloadFromHash} from "$lib/utils/share";
import {error} from "$lib/stores/toasts.svelte";
import {alert as showAlert} from "$lib/stores/modals.svelte";


interface PreviewState {
    text: string;
    parsed: Record<string, string | string[]> | null;
    parsedDiff: Record<string, string | string[]> | null;
    parseError: boolean;
}

export const incomingShare = $state<{preview: PreviewState | null; show: boolean;}>({preview: null, show: false});

function clearHash() {
    const cleaned = removeSharePayloadFromHash(window.location.hash);
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}${cleaned}`);
}

export function checkHashForShare() {
    const payload = getSharePayloadFromHash(window.location.hash);
    if (!payload) return;

    let decoded: string;
    try {
        decoded = decodeConfig(payload);
    }
    catch {
        error("Failed to read shared config from URL");
        clearHash();
        return;
    }

    let parsed: Record<string, string | string[]> | null = null;
    let parseError = false;
    let parsedDiff: Record<string, string | string[]> | null = null;
    try {
        parsed = parse(decoded);
        parsedDiff = diffFromDefaults(parsed) as Record<string, string | string[]>;
    }
    catch {
        parseError = true;
    }

    if (!parsedDiff || !Object.keys(parsedDiff).length) {
        void showAlert({title: "No config found", message: "We couldn't find any valid config settings in the shared URL.", buttonText: "Dismiss"});
        clearHash();
        return;
    }

    incomingShare.preview = {text: decoded, parsed, parsedDiff, parseError};
    incomingShare.show = true;
}

export async function applyIncomingShare() {
    if (incomingShare.preview) {
        try {
            load(parse(incomingShare.preview.text) as Parameters<typeof load>[0]);
        }
        catch (err) {
            console.error(err); // eslint-disable-line no-console
            await showAlert({title: "Could not load config", message: "Something went wrong while loading your parsed config. Please open an issue on GitHub.", buttonText: "Dismiss"});
        }
    }
    dismissIncomingShare();
}

export function dismissIncomingShare() {
    incomingShare.show = false;
    incomingShare.preview = null;
    clearHash();
}