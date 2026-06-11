<script lang="ts">
    import {relativeTooltip} from "$lib/actions/tooltip.svelte";
    import {countDecimalPlaces} from "$lib/utils/numbers";

    interface RangeProps {
        min: number;
        max: number;
        step?: number;
        value: number;
        showLabels?: boolean;
    }

    // why is eslint like this smh
    // eslint-disable-next-line prefer-const
    let {value = $bindable(), min, max, step = 1, showLabels = true}: RangeProps = $props();

    // html refs
    let track: HTMLDivElement | undefined = $state();
    let thumb: HTMLDivElement | undefined = $state();

    // Calculate the percentage position of the thumb based on the current value
    const percentage = $derived(((value - min) / (max - min)) * 100);

    // Calculate the number of decimal places to show based on step, min, and max
    const maxDecimalPlaces = $derived(Math.max(countDecimalPlaces(min), countDecimalPlaces(max), countDecimalPlaces(step)));

    // Get the value based on a pointer event's clientX position relative to the track
    function valueFromPointer(e: PointerEvent): number {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const raw = ((e.clientX - rect.left) / rect.width) * (max - min) + min;
        const stepped = Math.round((raw - min) / step) * step + min;
        return parseFloat(Math.min(max, Math.max(min, stepped)).toFixed(maxDecimalPlaces));
    }

    // Pointer event handlers for dragging the thumb
    let dragging = $state(false);
    function onPointerDown(e: PointerEvent) {
        if (e.button !== 0) return;
        dragging = true;
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        // value = valueFromPointer(e);
        value = valueFromPointer(e);
    }

    function onPointerMove(e: PointerEvent) {
        if (!dragging) return;
        value = valueFromPointer(e);
    }

    function onPointerUp(e: PointerEvent) {
        dragging = false;
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    }

    function onKeyDown(e: KeyboardEvent) {
        const inc = e.shiftKey ? step * 10 : step;
        if (e.key === "ArrowRight" || e.key === "ArrowUp") {
            e.preventDefault();
            const nextValue = Math.min(max, value + inc);
            value = parseFloat(nextValue.toFixed(maxDecimalPlaces));
        }
        else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
            e.preventDefault();
            const nextValue = Math.max(min, value - inc);
            value = parseFloat(nextValue.toFixed(maxDecimalPlaces));
        }
        else if (e.key === "Home") {
            e.preventDefault();
            value = parseFloat(min.toFixed(maxDecimalPlaces));
        }
        else if (e.key === "End") {
            e.preventDefault();
            value = parseFloat(max.toFixed(maxDecimalPlaces));
        }
    }
</script>


<div class="slider-setting">
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
        onkeydown={onKeyDown}
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
    {#if showLabels}
        <div class="labels">
            <span>{min}</span>
            <span>{max}</span>
        </div>
    {/if}
</div>


<style>
.slider-setting {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    margin: 0 6px;
    width: 163px;
}

.labels {
    display: flex;
    justify-content: space-between;
    /* width: calc(100% + 12px); */
    width: 100%;
    height: 13px;
    font-size: 0.75rem;
    color: var(--font-color, #ccc);
    font-variant-numeric: tabular-nums;
}

.labels span:first-child {
    position: absolute;
    left: 0;
    transform: translateX(calc(-50% - 1.5px));
}

.labels span:last-child {
    position: absolute;
    right: 0;
    transform: translateX(calc(50% + 1.5px));
}

.slider {
    position: relative;
    height: 24px;
    display: flex;
    align-items: center;
    cursor: pointer;
    touch-action: none;
    /* width: 169px; */
    /* margin: 0 3px; */
    width: 100%;
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