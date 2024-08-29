<script lang="ts">
    import {hexToRgb, hsvToRgb, rgbToHex, rgbToHsv, luminosity, type HexColor} from "$lib/utils/colors";


    // eslint-disable-next-line prefer-const
    let {defaultValue = "#408080", value = $bindable(defaultValue)}: {defaultValue?: HexColor, value?: HexColor|""} = $props();

    let {hue, saturation, value: brightness} = $state(rgbToHsv(...hexToRgb(value || defaultValue)));
    const [red, green, blue] = $derived.by(() => hsvToRgb(hue, saturation, brightness));
    const hueField = $derived(`rgb(${hsvToRgb(hue, 1, 1).join(", ")})`);
    const csgTop = $derived((1 - brightness) * 100);
    const csgLeft = $derived(saturation * 100);
    const hgLeft = $derived(hue * 100);
    const hexValue = $derived(rgbToHex(...hsvToRgb(hue, saturation, brightness)));
    const borderColor = $derived(`rgba(255, 255, 255, ${luminosity(value || defaultValue) * 0.0027451 + 0.3})`);
    const isEmpty = $derived(value === "");

    let tracked: HTMLDivElement|null;

    function moveGrabber(event: MouseEvent) {
        if (!tracked) return;

        const mouseX = event.clientX;
        const mouseY = event.clientY;
        const trackedPos = tracked.getBoundingClientRect();

        let xPercentage = (mouseX - trackedPos.x) / trackedPos.width * 100;
        let yPercentage = (mouseY - trackedPos.y) / trackedPos.height * 100;

        if (xPercentage > 100) xPercentage = 100;
        if (xPercentage < 0) xPercentage = 0;
        if (yPercentage > 100) yPercentage = 100;
        if (yPercentage < 0) yPercentage = 0;

        if (tracked.id === "colorspace") {
            saturation = xPercentage / 100;
            brightness = 1 - yPercentage / 100;
        }
        else if (tracked.id === "huespace") {
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

<div class="picker-container">
    <div id="colorspace" style:background={hueField} onmousedown={mouseDown} role="slider" aria-valuenow={saturation} tabindex="0">
        <div class="colorspace-grabber" style:top={csgTop + "%"} style:left={csgLeft + "%"}></div>
    </div>

    <div id="huespace" onmousedown={mouseDown} role="slider" aria-valuenow={hue} tabindex="0">
        <div class="huespace-grabber" style:left={hgLeft + "%"}></div>
    </div>

    <div class="color-info">
        <div class="info-split">
            <div class="color-picked" class:empty={isEmpty} style:background="rgb({red}, {green}, {blue})" style:border-color={borderColor}></div>

            <div class="color-values">
                <div class="hex-value">{isEmpty ? "-" : hexValue}</div>

                <div class="rgb-values">
                    <div class="rgb-value">
                        <div class="value">{isEmpty ? "-" : red}</div>
                        <div>R</div>
                    </div>

                    <div class="rgb-value">
                        <div class="value">{isEmpty ? "-" : green}</div>
                        <div>G</div>
                    </div>

                    <div class="rgb-value">
                        <div class="value">{isEmpty ? "-" : blue}</div>
                        <div>B</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>


<style>
.picker-container {
    position: relative;
    background: var(--bg-modal);
    border: 1px solid black;
    box-shadow: 0 0 20px -1px rgba(0,0,0,0.7);
    padding: 12px;
    border-radius: var(--radius-level-2);
    overflow: hidden;
}

.picker-container::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    box-shadow: 0 0 1px white inset;
    border-radius: inherit;
    z-index: 2;
    pointer-events: none;
}

#colorspace {
    width: 240px;
    height: 160px;
    position: relative;
    overflow: hidden;
    border-radius: var(--radius-level-3);
    border: 1px solid var(--border-input);
    box-shadow: 0 0 3px 0px black;
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

.colorspace-grabber {
    margin: 0;
    padding: 0;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 2px solid black;
    background: white;
    position: relative;
    transform: translate(-50%, -50%);
    left: 100%;
    pointer-events: none;
    z-index: 3;
}

#huespace {
    background: linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%);
    margin: 15px 10px 10px 10px;
    border-radius: 10px;
    height: 10px;
}

.huespace-grabber {
    background: white;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 2px solid black;
    transform: translate(-50%, -1px);
    left: 0%;
    position: relative;
    cursor: default;
    pointer-events: none;
}

.color-info {
    display: flex;
    padding: 10px;
    /* padding-top: 10px; */
    width: 100%;
    position: relative;
}

.info-split {
    display: flex;
    width: 100%;
    gap: 20px;
}

.color-picked {
    display: flex;
    flex: 1 1 50%;
    min-height: 100%;
    border-radius: var(--radius-level-3);
    border: 1px solid rgba(0, 0, 0, 1);
    box-shadow: 0 0 1px rgba(255, 255, 255, 1) inset;
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 0 3px 0px black;
}

.color-values {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 50%;
    gap: 12px;
}

.hex-value {
    display: flex;
    justify-content: center;
    background: var(--bg-input-focus);
    padding: 2px;
    border: 1px solid var(--border-input);
    border-radius: var(--radius-level-5);
    width: 100%;
}

.rgb-values {
    display: flex;
    justify-content: space-between;
    width: 100%;
}

.rgb-value {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
}

.value {
    display: flex;
    justify-content: center;
    background: var(--bg-input-focus);
    padding: 2px;
    border: 1px solid var(--border-input);
    border-radius: var(--radius-level-5);
    width: 30px;
}


.color-picked.empty {
    background: var(--bg-input-focus)!important;
    border-color: var(--border-input)!important;
    box-shadow: none!important;
    background: linear-gradient(to top left,
             rgba(0,0,0,0) 0%,
             rgba(0,0,0,0) calc(50% - 1px),
             var(--color-danger) 50%,
             rgba(0,0,0,0) calc(50% + 1px),
             rgba(0,0,0,0) 100%),
         linear-gradient(to top right,
             rgba(0,0,0,0) 0%,
             rgba(0,0,0,0) calc(50% - 1px),
             var(--color-danger) 50%,
             rgba(0,0,0,0) calc(50% + 1px),
             rgba(0,0,0,0) 100%) var(--bg-input-focus)!important;
    /* opacity: 0; */
}

/* .empty .hex-value, */
/* .empty .value {
    color: transparent;
} */
</style>