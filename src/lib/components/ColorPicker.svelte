<script lang="ts">
    import {hexToRgb, hsvToRgb, rgbToHex, rgbToHsv, type HexColor} from "$lib/utils/colors";


    // eslint-disable-next-line prefer-const
    let {defaultValue = "#FF0000", value = $bindable(defaultValue)}: {defaultValue: HexColor, value?: HexColor} = $props();

    let {hue, saturation, value: brightness} = $state(rgbToHsv(...hexToRgb(defaultValue)));
    const [red, green, blue] = $derived.by(() => hsvToRgb(hue, saturation, brightness));
    const hueField = $derived(`rgb(${hsvToRgb(hue, 1, 1).join(", ")})`);
    const csgTop = $derived((1 - brightness) * 100);
    const csgLeft = $derived(saturation * 100);
    const hgLeft = $derived(hue * 100);
    const hexValue = $derived(rgbToHex(...hsvToRgb(hue, saturation, brightness)));

    let tracked: HTMLDivElement|null;

    function moveGrabber(event: MouseEvent) {
        if (!tracked) return;

        const mouseX = event.clientX;
        const mouseY = event.clientY;
        const trackedPos = tracked.getBoundingClientRect();

        const correction = tracked.id === "colorspace" ? 3 : -1;
        let xPercentage = (mouseX - trackedPos.x + correction) / trackedPos.width * 100;
        let yPercentage = (mouseY - trackedPos.y + correction) / trackedPos.height * 100;

        if (xPercentage > 100) xPercentage = 100;
        if (xPercentage < 0) xPercentage = 0;
        if (yPercentage > 100) yPercentage = 100;
        if (yPercentage < 0) yPercentage = 0;

        if (tracked.id === "colorspace") {
            saturation = xPercentage / 100;
            brightness = 1 - yPercentage / 100;
        }
        else if (tracked.id === "hue-selector") {
            hue = xPercentage / 100;
        }

        // Update the customColor which should be bound for change
        value = hexValue;
    }

    function mouseMove(event: MouseEvent) {
        if (!tracked) return;
        moveGrabber(event);
    }

    function mouseDown(event: MouseEvent) {
        tracked = event.currentTarget as HTMLDivElement;
        moveGrabber(event);
    }
</script>

<svelte:document onmouseup={() => tracked = null} onmousemove={mouseMove} />

<div class="main-container">
    <div id="colorspace" style:background={hueField} onmousedown={mouseDown} role="slider" aria-valuenow={saturation} tabindex="0">
        <div id="colorsquare-picker" style:top={csgTop + "%"} style:left={csgLeft + "%"}></div>
    </div>

    <div id="hue-selector" onmousedown={mouseDown} role="slider" aria-valuenow={hue} tabindex="0">
        <div id="hue-picker" style:left={hgLeft + "%"}></div>
    </div>

    <div class="color-info-box">
        <div class="color-picked-bg">
        <div class="color-picked" style:background="rgb({red}, {green}, {blue})"></div>
        </div>

        <div class="hex-text-block">
        <p class="text">{hexValue}</p>
        </div>

        <div class="rgb-text-div">
        <div class="rgb-text-block">
            <p class="text">{red}</p>
            <p class="text-label">R</p>
        </div>

        <div class="rgb-text-block">
            <p class="text">{green}</p>
            <p class="text-label">G</p>
        </div>

        <div class="rgb-text-block">
            <p class="text">{blue}</p>
            <p class="text-label">B</p>
        </div>
        </div>
    </div>
</div>


<style>
.main-container {
    width: 240px;
    height: 265px;
    background: #f2f2f2;
    border-radius: 1px;
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.51);
}

#hue-selector {
    background: linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%);
    margin: 15px 10px 10px 10px;
    border-radius: 10px;
    height: 10px;
}

#hue-picker {
    background: #FFF;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    left: 0%;
    position: relative;
    cursor: default;
    pointer-events: none;
    transform: translate(-5px, -1px);
    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.67);
}

#colorspace {
    background: rgb(255, 0, 0);
    width: 240px;
    height: 160px;
    position: relative;
    overflow: hidden;
}

#colorspace::before,
#colorspace::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}

#colorspace::before {
    background: linear-gradient(to right, rgb(255, 255, 255), rgba(255, 255, 255, 0));
    z-index: 1;
}

#colorspace::after {
    background: linear-gradient(to top, rgb(0, 0, 0), rgba(0, 0, 0, 0));
    z-index: 2;
}

#colorsquare-picker {
    margin: 0;
    padding: 0;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 2px solid #FFFB;
    position: relative;
    transform: translate(-9px, -9px);
    left: 100%;
    pointer-events: none;
    z-index: 3;
}

.color-info-box {
    margin: 10px;
    width: 100%;
    height: 22px;
    vertical-align: middle;
    position: relative;
}

.color-picked {
    width: 18px;
    height: 18px;
    border-radius: 2px;
    background: rgba(255, 0, 0, 1);
    display: inline-block;
}

.color-picked-bg {
    background-image: linear-gradient(45deg, #808080 25%, transparent 25%), linear-gradient(-45deg, #808080 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #808080 75%), linear-gradient(-45deg, transparent 75%, #808080 75%);
    background-size: 10px 10px;
    background-position: 0 0, 0 5px, 5px -5px, -5px 0px;
    border: 2px solid #FFF;
    border-radius: 4px;
    width: 18px;
    height: 18px;
    color: #fff;
    display: inline-block;
}

.hex-text-block {
    display: inline-block;
    background: white;
    border-radius: 2px;
    padding: 2px;
    border: 1px solid #e3e3e3;
    height: 16px;
    width: 54px;
    vertical-align: top;
    text-align: center;
}

.rgb-text-block {
    display: inline-block;
    background: white;
    border-radius: 2px;
    padding: 2px;
    margin: 0 1px;
    border: 1px solid #dcdcdc;
    height: 16px;
    width: 23px;
    vertical-align: top;
    text-align: center;
}

.rgb-text-div {
    right: 10%;
    display: inline-block;
    vertical-align: top;
    position: absolute;
}

.text-label {
    position: relative;
    top: -12px;
    font-family: sans-serif;
    font-size: small;
    color:#888;
}

.text {
    display: inline;
    font-family: sans-serif;
    margin: 0;
    display: inline-block;
    font-size: 12px;
    font-size-adjust: 0.50;
    position: relative;
    top: -1px;
    vertical-align: middle;
}
</style>