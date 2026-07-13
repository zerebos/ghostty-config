<script lang="ts">
    import DialogModal from "$lib/components/modals/DialogModal.svelte";
    import Button from "$lib/components/Button.svelte";
    import type {Snippet} from "svelte";
    import ConfigPreview from "../ConfigPreview.svelte";
    import PreviewSurface from "../PreviewSurface.svelte";

    type ConfigValue = string | string[];

    interface Props {
        title: string;
        description: string;
        icon: Snippet;
        parsedConfig: Record<string, ConfigValue> | null;
        previewText: string | null;
        parseError: boolean;
        onclose?: () => void | Promise<void>;
        onimport?: () => void | Promise<void>;
    }

    const {title, description, icon, parsedConfig, previewText, parseError, onclose, onimport}: Props = $props();
</script>

<DialogModal {title} {onclose} {icon}>
    <p class="modal-desc">{description}</p>
    <!-- Bare surface (no light/dark toggle), the toggle is import/export-page-only. -->
    <PreviewSurface minHeight="80px" maxHeight="280px" selectable>
        <ConfigPreview parsed={parsedConfig} parsedDiff={parsedConfig} text={previewText} {parseError} showEmptyState={false} />
    </PreviewSurface>
    {#snippet footer()}
        <Button onclick={onclose}>Dismiss</Button>
        <Button primary onclick={onimport} disabled={!parsedConfig}>Import Config</Button>
    {/snippet}
</DialogModal>


<style>
.modal-desc {
    color: var(--font-color-muted);
    font-size: 0.9rem;
    margin: 0;
    line-height: 1.5;
}
</style>
