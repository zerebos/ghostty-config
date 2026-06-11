<script lang="ts">
    import {relativeTooltip} from "$lib/actions/tooltip.svelte";
    import {createFooltipAttachment} from "$lib/attachments/fooltip.svelte";

    let {
        min = 0,
        max = 100,
        step = 1,
        value = $bindable(50)
    }: {
        min?: number;
        max?: number;
        step?: number;
        value?: number;
    } = $props();

    let track: HTMLDivElement = $state();
    let tracktrack: HTMLDivElement = $state();
    let fill: HTMLDivElement = $state();
    let thumb: HTMLDivElement = $state();

    const percentage = $derived(
        ((value - min) / (max - min)) * 100
    );

    function setValue(clientX: number) {
        if (!track) return;

        const rect = track.getBoundingClientRect();

        const raw =
            ((clientX - rect.left) / rect.width) *
                (max - min) +
            min;

        const stepped =
            Math.round(raw / step) * step;

        value = Math.min(
            max,
            Math.max(min, stepped)
        );
    }

    function startDrag(e: PointerEvent) {
        setValue(e.clientX);
        e.target.setPointerCapture(e.pointerId);
        console.log(e.target);

        const move = (e: PointerEvent) =>
            setValue(e.clientX);

        const up = (ee: PointerEvent) => {
            ee.target.releasePointerCapture(ee.pointerId);
            window.removeEventListener(
                "pointermove",
                move
            );

            window.removeEventListener(
                "pointerup",
                up
            );
        };

        window.addEventListener(
            "pointermove",
            move
        );

        window.addEventListener(
            "pointerup",
            up
        );
    }

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

    // const fooltip = createFooltipAttachment(() => value.toString());
    let forceShow = $state(false);
    const sliderId = `slider-${Math.random().toString(36).slice(2)}`;
</script>

<div
    id={sliderId}
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
    use:relativeTooltip={{ text: Number.isInteger(step) ? value.toString() : value.toFixed(2), relativeTarget: thumb }}
    // onmouseenter={() => forceShow = true}
    // onmouseleave={() => forceShow = false}
>
    <div class="track" bind:this={tracktrack}></div>

    <div
        class="fill"
        style:width={`${percentage}%`}
        bind:this={fill}
    ></div>

    <div
        class="thumb"
        class:dragging
        style:left={`${percentage}%`}
        bind:this={thumb}
        // use:createFooltipAttachment={value.toString()}
        // {@attach fooltip}
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
    width: 200px;
}

.track {
    position: absolute;
    width: 100%;
    height: 6px;
    border-radius: 999px;
    background: #333;
}

.fill {
    position: absolute;
    height: 6px;
    border-radius: 999px;
    background: #4f8cff;
}

.thumb {
    position: absolute;
    width: 18px;
    height: 18px;

    border-radius: 50%;
    background: white;

    transform: translateX(-50%);
    pointer-events: none;

    box-shadow:
        0 0 0 2px #4f8cff,
        0 2px 6px rgb(0 0 0 / 25%);
}

/* .thumb {
    position: absolute;
    top: 50%;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #fff;
    border: 2px solid var(--accent-end, #c084fc);
    box-shadow: 0 0 6px rgba(0,0,0,0.5);
    transform: translate(-50%, -50%);
    pointer-events: none;
    transition: transform 100ms ease, box-shadow 100ms ease;
}

.thumb.dragging {
    transform: translate(-50%, -50%) scale(1.25);
    box-shadow: 0 0 10px rgba(0,0,0,0.6);
} */
</style>