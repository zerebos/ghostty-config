<script lang="ts">
    import {relativeTooltip} from "$lib/actions/tooltip.svelte";
    import {countDecimalPlaces} from "$lib/utils/numbers";

    interface RangeProps {
        min: number;
        max: number;
        step?: number;
        value: number;
    }

    // why is eslint like this smh
    // eslint-disable-next-line prefer-const
    let {value = $bindable(), min, max, step = 1}: RangeProps = $props();

    // html refs
    let track: HTMLDivElement | undefined = $state();
    let thumb: HTMLDivElement | undefined = $state();

    // Calculate the percentage position of the thumb based on the current value
    const percentage = $derived(((value - min) / (max - min)) * 100);

    // Calculate the number of decimal places to show based on step, min, and max
    const maxDecimalPlaces = $derived(Math.max(countDecimalPlaces(min), countDecimalPlaces(max), countDecimalPlaces(step)));

    // Set the value based on a pointer event's clientX position relative to the track
    function setValue(clientX: number) {
        if (!track) return;

        const rect = track.getBoundingClientRect();
        const raw = ((clientX - rect.left) / rect.width) * (max - min) + min;
        const stepped = Math.round(raw / step) * step;

        value = Math.min(
            max,
            Math.max(min, stepped)
        );
    }

    // Pointer event handlers for dragging the thumb
    let dragging = $state(false);
    function onPointerDown(e: PointerEvent) {
        if (e.button !== 0) return;
        dragging = true;
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        // value = valueFromPointer(e);
        setValue(e.clientX);
    }

    function onPointerMove(e: PointerEvent) {
        if (!dragging) return;
        setValue(e.clientX);
    }

    function onPointerUp(e: PointerEvent) {
        dragging = false;
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    }
</script>

<div
    class="slider"
    role="slider"
    tabindex="0"
    bind:this={track}
    aria-valuemin={min}
    aria-valuemax={max}
    aria-valuenow={value}
    onpointerdown={onPointerDown}
    onpointermove={onPointerMove}
    onpointerup={onPointerUp}
    onpointercancel={onPointerUp}
    use:relativeTooltip={{
        text: Number.isInteger(step) ? value.toString() : value.toFixed(maxDecimalPlaces),
        relativeTarget: thumb,
        numeric: true,
        offsetY: -4
    }}
>
    <div class="track"></div>

    <div
        class="thumb"
        class:dragging
        style:left={`${percentage}%`}
        bind:this={thumb}
    ></div>
</div>


<style>
.slider {
    position: relative;
    height: 24px;
    display: flex;
    align-items: center;
    cursor: pointer;
    touch-action: none;
    width: 169px;
    margin: 0 3px;
}

.track {
    position: absolute;
    width: 100%;
    height: 4px;
    /* border-radius: 999px; */
    /* background: #19181B; */
    /* background: rgba(0,0,0,0.475); */
    background: var(--border-level-4);
}

.track::before,
.track::after {
    content: "";
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    height: 10px;
    width: 3px;
    border-radius: 2px;
    background: var(--bg-basic-button);
    z-index: 1;
}

.track::before {
    left: -3px;
}

.track::after {
    right: -3px;
}

.thumb {
    position: absolute;
    width: 8px;
    height: 21px;

    border-radius: 4px;
    background: hsl(270, 7%, 62%);

    transform: translateX(-50%);
    pointer-events: none;

    box-shadow: 0 0 5px rgba(0,0,0,0.6);
    z-index: 2;
}

.thumb.dragging {
    background: hsl(270, 7%, 75%);
}
</style>