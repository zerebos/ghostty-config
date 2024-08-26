<script lang="ts">
    import {hsvToRgb, rgbToHex, rgbToHsv, type HexColor} from "$lib/utils/colors";


    const {value = "#FF0000", change}: {value: HexColor, change?: (c: HexColor) => void} = $props();

    let tracked: HTMLDivElement|null;
    let h = $state(1);
    let s = $state(1);
    let v = $state(1);
    let r = $state(255);
    let g = $state(0);
    let b = $state(0);
    let hexValue = $state(value);

    $effect(() => void setTimeout(setStartColor, 1));

    function setStartColor() {
        const hex = value.replace("#","");
        if (hex.length !== 6 && hex.length !== 3 && !hex.match(/([^A-F0-9])/gi)) {
            alert("Invalid property value (startColor)");
            return;
        }
        let hexFiltered = "";
        if (hex.length === 3) {hex.split("").forEach(c => {hexFiltered += c + c;});}
        else {hexFiltered = hex;}
        hexValue = "#" + hexFiltered;
        r = parseInt(hexFiltered.substring(0,2), 16);
        g = parseInt(hexFiltered.substring(2,4), 16);
        b = parseInt(hexFiltered.substring(4,6), 16);
        const result = rgbToHsv(r, g, b);
        h = result.hue;
        s = result.saturation;
        v = result.value;
        hueChange();
        updateCsPicker();
        updateHuePicker();
    }

    function updateCsPicker() {
        const csPicker = document.querySelector("#colorsquare-picker") as HTMLDivElement;
        const xPercentage = s * 100;
        const yPercentage = (1 - v) * 100;
        csPicker.style.top = yPercentage + "%";
        csPicker.style.left = xPercentage + "%";
    }

    function updateHuePicker() {
        const huePicker = document.querySelector("#hue-picker") as HTMLDivElement;
        const xPercentage = h * 100;
        huePicker.style.left = xPercentage + "%";
    }

    function colorChangeCallback() {
        change?.(rgbToHex(r, g, b));
    }

    function mouseMove(event: MouseEvent) {
        if (!tracked) return;

        const mouseX = event.clientX;
        const mouseY = event.clientY;
        const trackedPos = tracked.getBoundingClientRect();
        let xPercentage, yPercentage, picker;

        switch (tracked.id) {
            case "colorsquare-event":
                xPercentage = (mouseX - trackedPos.x) / 240 * 100;
                yPercentage = (mouseY - trackedPos.y) / 160 * 100;
                if (xPercentage > 100) xPercentage = 100;
                if (xPercentage < 0) xPercentage = 0;
                if (yPercentage > 100) yPercentage = 100;
                if (yPercentage < 0) yPercentage = 0;
                // (xPercentage > 100) ? xPercentage = 100 : (xPercentage < 0) ? xPercentage = 0 : null;
                // (yPercentage > 100) ? yPercentage = 100 : (yPercentage < 0) ? yPercentage = 0 : null;
                picker = document.querySelector("#colorsquare-picker") as HTMLDivElement;
                // yPercentage = yPercentage.toFixed(2);
                // xPercentage = xPercentage.toFixed(2);
                picker.style.top = yPercentage.toFixed(2) + "%";
                picker.style.left = xPercentage.toFixed(2) + "%";
                s = xPercentage / 100;
                v = 1 - yPercentage / 100;
                colorChange();
                break;
            case "hue-event":
                xPercentage = (mouseX - 10 - trackedPos.x) / 220 * 100;
                if (xPercentage > 100) xPercentage = 100;
                if (xPercentage < 0) xPercentage = 0;
                // (xPercentage > 100) ? xPercentage = 100 : (xPercentage < 0) ? xPercentage = 0 : null;
                // xPercentage = xPercentage.toFixed(2);
                picker = document.querySelector("#hue-picker") as HTMLDivElement;
                picker.style.left = xPercentage.toFixed(2) + "%";
                h = xPercentage / 100;
                hueChange();
                break;
        }
    }

    function csDown(event: MouseEvent) {
        tracked = event.currentTarget as HTMLDivElement;
        const xPercentage = ((event.offsetX + 1) / 240) * 100;
        const yPercentage = ((event.offsetY + 1) / 160) * 100;
        // yPercentage = yPercentage.toFixed(2);
        // xPercentage = xPercentage.toFixed(2);
        const picker = document.querySelector("#colorsquare-picker") as HTMLDivElement;
        picker.style.top = yPercentage.toFixed(2) + "%";
        picker.style.left = xPercentage.toFixed(2) + "%";
        s = xPercentage / 100;
        v = 1 - yPercentage / 100;
        colorChange();
    }

    function mouseUp(_: MouseEvent) {
        tracked = null;
    }

    function hueDown(event: MouseEvent) {
        tracked = event.currentTarget as HTMLDivElement;
        const xPercentage = ((event.offsetX - 9) / 220) * 100;
        // xPercentage = xPercentage.toFixed(2);
        const picker = document.querySelector("#hue-picker") as HTMLDivElement;
        picker.style.left = xPercentage.toFixed(2) + "%";
        h = xPercentage / 100;
        hueChange();
    }

    function hueChange() {
        const rgb = hsvToRgb(h, 1, 1);
        const colorsquare = document.querySelector(".colorsquare") as HTMLDivElement;
        colorsquare.style.background = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},1)`;
        colorChange();
    }

    function colorChange() {
        const rgb = hsvToRgb(h, s, v);
        r = rgb[0];
        g = rgb[1];
        b = rgb[2];
        hexValue = rgbToHex(r, g, b);
        const pickedColor = document.querySelector(".color-picked") as HTMLDivElement;
        pickedColor.style.background = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},1)`;
        colorChangeCallback();
    }
</script>

<svelte:document onmouseup={mouseUp} onmousemove={mouseMove} />

<div class="main-container">
    <div class="colorsquare" style:background="">
        <div class="saturation-gradient">
            <div class="value-gradient">
                <div id="colorsquare-picker"></div>
                <div id="colorsquare-event" onmousedown={csDown} role="slider" aria-valuenow="0" tabindex="0"></div>
            </div>
        </div>
    </div>

    <div class="hue-selector">
        <div id="hue-picker"></div>
        <div id="hue-event" onmousedown={hueDown} role="slider" aria-valuenow="0" tabindex="0"></div>
    </div>

    <div class="color-info-box">
        <div class="color-picked-bg">
        <div class="color-picked"></div>
        </div>

        <div class="hex-text-block">
        <p class="text">{hexValue}</p>
        </div>

        <div class="rgb-text-div">
        <div class="rgb-text-block">
            <p class="text">{r}</p>
            <p class="text-label">R</p>
        </div>

        <div class="rgb-text-block">
            <p class="text">{g}</p>
            <p class="text-label">G</p>
        </div>

        <div class="rgb-text-block">
            <p class="text">{b}</p>
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
    -webkit-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.51);
    -moz-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.51);
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.51);
    -webkit-touch-callout: none;
    -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
            user-select: none;
}

.saturation-gradient {
    background: linear-gradient(to right, rgb(255, 255, 255), rgba(255, 255, 255, 0));
    width: 240px;
    height: 160px;
}

.value-gradient {
    background: linear-gradient(to top, rgb(0, 0, 0), rgba(0, 0, 0, 0));
    overflow: hidden;
    width: 240px;
    height: 160px;
}

.hue-selector {
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
    transform: translate(-5px, -1px);
    -webkit-box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.67);
    -moz-box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.67);
    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.67);
}

#hue-event {
    width: 236px;
    height: 14px;
    transform: translate(-8px, -14px);
    cursor: default;
    touch-action: none;
}

.colorsquare {
    background: rgb(255, 0, 0);
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
}

#colorsquare-event {
    width: 100%;
    height: 100%;
    position: relative;
    transform: translate(0, -16px);
    touch-action: none;
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