<script lang="ts">
    import config from "$lib/stores/config.svelte";
    import {iconUrls, frameUrls, customLayerUrls} from "$lib/utils/macicon";

    let hasCdnError = $state(false);

    function handleAssetError() {
        hasCdnError = true;
    }

    function handlePrimaryIconError(event: Event) {
        const image = event.currentTarget as HTMLImageElement;
        if (image.src === iconUrls.official) {
            hasCdnError = true;
            return;
        }

        image.src = iconUrls.official;
        hasCdnError = true;
    }

    const iconLabel = $derived(config.macosIcon === "custom-style" ? "Custom style" : config.macosIcon === "custom" ? "Custom file" : config.macosIcon);
    const iconUrl = $derived(iconUrls[config.macosIcon] ?? iconUrls.official);
    const frameUrl = $derived(frameUrls[config.macosIconFrame] ?? frameUrls.aluminum);
    const isCustomStyle = $derived(config.macosIcon === "custom-style");
    const isCustomFile = $derived(config.macosIcon === "custom");
    const ghostColor = $derived(config.macosIconGhostColor || "#f6f7fb");
    const screenColor = $derived(config.macosIconScreenColor || "#4f5a6f");
    const hasCustomColors = $derived(Boolean(config.macosIconGhostColor && config.macosIconScreenColor));
</script>

<div class="app-icon-preview">
    <div class="icon-shell" aria-label="Ghostty icon preview">
        {#if isCustomStyle && !hasCdnError}
            <!-- eslint-disable-next-line svelte/no-unused-class-name -->
            <img class="layer frame" src={frameUrl} alt="" onerror={handleAssetError} />
            <!-- eslint-disable-next-line svelte/no-unused-class-name -->
            <div class="layer tint screen-mask" style:background-color={screenColor}></div>
            <!-- <img class="layer screen" src={customLayerUrls.screen} alt="" onerror={handleAssetError} /> -->
            <!-- eslint-disable-next-line svelte/no-unused-class-name -->
            <div class="layer tint ghost-mask" style:background-color={ghostColor}></div>
            <!-- eslint-disable-next-line svelte/no-unused-class-name -->
            <img class="layer crt" src={customLayerUrls.crt} alt="" onerror={handleAssetError} />
            <!-- eslint-disable-next-line svelte/no-unused-class-name -->
            <img class="layer gloss" src={customLayerUrls.gloss} alt="" onerror={handleAssetError} />
        {:else}
            <img class="icon-image" src={hasCdnError ? iconUrls.official : iconUrl} alt={`Ghostty ${iconLabel} icon`} onerror={handlePrimaryIconError} />
            {#if isCustomFile}
                <div class="custom-badge">Custom file</div>
            {:else if hasCdnError}
                <div class="custom-badge">CDN fallback</div>
            {/if}
        {/if}
    </div>

    <div class="label">{iconLabel}</div>
    {#if isCustomStyle && !hasCustomColors}
        <div class="note">
            Set the icon frame and both colors for a fully custom preview.
        </div>
    {/if}
</div>

<style>
    .app-icon-preview {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem;
        border-radius: var(--radius-level-3);
        background: var(--bg-level-3);
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 0 1px rgba(255, 255, 255, 0.25) inset;
        width: 100%;
    }

    .icon-shell {
        position: relative;
        width: 7.5rem;
        height: 7.5rem;
        border-radius: 1.65rem;
        overflow: hidden;
        /* box-shadow: 0 8px 20px -12px rgba(0, 0, 0, 0.9); */
    }

    .icon-image,
    .layer {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .screen-mask,
    .ghost-mask {
        mask-repeat: no-repeat;
        mask-position: center;
        mask-size: cover;
        -webkit-mask-repeat: no-repeat;
        -webkit-mask-position: center;
        -webkit-mask-size: cover;
    }

    .screen-mask {
        mask-image: url("https://cdn.jsdelivr.net/gh/ghostty-org/ghostty@main/macos/Assets.xcassets/Custom%20Icon/CustomIconScreenMask.imageset/screen-mask.png");
        -webkit-mask-image: url("https://cdn.jsdelivr.net/gh/ghostty-org/ghostty@main/macos/Assets.xcassets/Custom%20Icon/CustomIconScreenMask.imageset/screen-mask.png");
    }

    .ghost-mask {
        mask-image: url("https://cdn.jsdelivr.net/gh/ghostty-org/ghostty@main/macos/Assets.xcassets/Custom%20Icon/CustomIconGhost.imageset/ghosty.png");
        -webkit-mask-image: url("https://cdn.jsdelivr.net/gh/ghostty-org/ghostty@main/macos/Assets.xcassets/Custom%20Icon/CustomIconGhost.imageset/ghosty.png");
    }

    .custom-badge {
        position: absolute;
        right: 0.35rem;
        bottom: 0.35rem;
        padding: 0.15rem 0.4rem;
        border-radius: var(--radius-level-5);
        font-size: 0.65rem;
        font-weight: 600;
        background: rgba(0, 0, 0, 0.6);
        color: white;
    }

    .label {
        font-size: 0.875rem;
        font-weight: 600;
        text-transform: capitalize;
        color: var(--font-color);
    }

    .note {
        text-align: center;
        font-size: 0.75rem;
        max-width: 15rem;
        color: var(--font-color-muted);
    }
</style>