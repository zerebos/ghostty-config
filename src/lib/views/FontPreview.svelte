<script lang="ts">
    import Group from "$lib/components/settings/Group.svelte";
    import Item from "$lib/components/settings/Item.svelte";
    import Separator from "$lib/components/settings/Separator.svelte";
    import Switch from "$lib/components/settings/Switch.svelte";
    import Text from "$lib/components/settings/Text.svelte";
    import Number from "$lib/components/settings/Number.svelte";

    let fontFamily = $state("JetBrainsMono NF");
    let fontSize = $state(13);
    let bold = $state(false);
    let italic = $state(false);

    // temp
    let background = $state("#181818");
</script>

<div class="font-preview">
    <Group title="Font Preview" note="Use this section to test out and preview your fonts as it may look in the terminal along with some colors and glyphs.">
        <div class="preview" style="background: {background}; font-family: {fontFamily}; font-size: {fontSize + "px"}; font-style: {italic ? "italic" : "normal"}; font-weight: {bold ? 700 : 400};">
        <div class="row prompt">
            <span style="color: rgb(144, 169, 89);">john</span>
            <span style="color: rgb(117, 181, 170);">@</span>
            <span style="color: rgb(106, 159, 181);">doe-pc</span>
            <span style="color: rgb(172, 66, 66); font-weight: 700;">$</span>
            ls
        </div>
        <div class="row">-rwxr-xr-x 1 root <span style="color: rgb(244, 191, 117); font-weight: 700;">Documents</span></div>
        <div class="row">-rwxr-xr-x 1 root <span style="color: rgb(24, 24, 24); background: rgb(144, 169, 89); font-weight: 700;">Downloads</span></div>
        <div class="row">-rwxr-xr-x 1 root <span style="color: rgb(24, 24, 24); background: rgb(107, 107, 107); font-weight: 700;">Pictures</span></div>
        <div class="row">-rwxr-xr-x 1 root <span style="color: rgb(130, 184, 200); font-weight: 700;">Music</span></div>
        <div class="row">-rwxr-xr-x 1 root <span style="color: rgb(144, 169, 89);">実行可能ファイル</span></div>
        <div class="row">-rwxr-xr-x 1 root <span style="color: rgb(117, 181, 170);">sym</span> -> <span style="color: rgb(172, 66, 66);">link</span></div>
        <div class="row">Icons:     <span style="background-color: rgb(172, 66, 66); color: {background};"> Powerline</span><span style="color: rgb(172, 66, 66);"></span></div>
        </div>
        <Separator />
        <Item name="Font family" note="Due to cross-browser limitations, you'll need to manually type in a font-face currently on your system that you want to try out."><Text bind:value={fontFamily} /></Item>
        <Separator />
        <Item name="Font size"><Number bind:value={fontSize} range={true} min={4} max={60} step={0.5} /></Item>
        <Separator />
        <Item name="Bold"><Switch bind:checked={bold} /></Item>
        <Separator />
        <Item name="Italic"><Switch bind:checked={italic} /></Item>
        <!-- Add ligature support -->
    </Group>
</div>

<style>
.preview {
    height: 160px;
    overflow-y: auto;
    padding: 8px;
}

.preview .row {
    display: flex;
    white-space: pre;
    /* width: 100%; */
    /* overflow: hidden; */
}
</style>