<script lang="ts">
    import config from "$lib/stores/config.svelte";

    const cdnBase = "https://cdn.jsdelivr.net/gh/ghostty-org/ghostty@main/macos/Assets.xcassets";

    const iconUrls: Record<string, string> = {
        official: `${cdnBase}/AppIconImage.imageset/macOS-AppIcon-1024px.png`,
        blueprint: `${cdnBase}/Alternate%20Icons/BlueprintImage.imageset/macOS-AppIcon-1024px.png`,
        chalkboard: `${cdnBase}/Alternate%20Icons/ChalkboardImage.imageset/macOS-AppIcon-1024px.png`,
        microchip: `${cdnBase}/Alternate%20Icons/MicrochipImage.imageset/macOS-AppIcon-1024px.png`,
        glass: `${cdnBase}/Alternate%20Icons/GlassImage.imageset/macOS-AppIcon-1024px.png`,
        holographic: `${cdnBase}/Alternate%20Icons/HolographicImage.imageset/macOS-AppIcon-1024px.png`,
        paper: `${cdnBase}/Alternate%20Icons/PaperImage.imageset/macOS-AppIcon-1024px.png`,
        retro: `${cdnBase}/Alternate%20Icons/RetroImage.imageset/macOS-AppIcon-1024px.png`,
        xray: `${cdnBase}/Alternate%20Icons/XrayImage.imageset/macOS-AppIcon-1024px.png`,
    };

    const frameUrls: Record<string, string> = {
        aluminum: `${cdnBase}/Custom%20Icon/CustomIconBaseAluminum.imageset/base.png`,
        beige: `${cdnBase}/Custom%20Icon/CustomIconBaseBeige.imageset/beige.png`,
        plastic: `${cdnBase}/Custom%20Icon/CustomIconBasePlastic.imageset/plastic.png`,
        chrome: `${cdnBase}/Custom%20Icon/CustomIconBaseChrome.imageset/chrome.png`,
    };

    const customLayerUrls = {
        screen: `${cdnBase}/Custom%20Icon/CustomIconScreen.imageset/screen-dark.png`,
        crt: `${cdnBase}/Custom%20Icon/CustomIconCRT.imageset/crt-effect.png`,
        gloss: `${cdnBase}/Custom%20Icon/CustomIconGloss.imageset/gloss.png`,
    };

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

    interface Props {
        width?: string;
        height?: string;
    }

    const {width = "100px", height = "100px"}: Props = $props();
</script>

<div class="icon-shell" aria-label="Ghostty icon preview" style:width style:height>
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

<style>
    .icon-shell {
        position: relative;
        width: 7.5rem;
        height: 7.5rem;
        border-radius: 1.65rem;
        /* overflow: hidden; */
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
</style>