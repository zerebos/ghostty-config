<script lang="ts">
    import Range from "./Range.svelte";

    type Props = {
        value: number | undefined;
        min?: number;
        max?: number;
        step?: number;
        size?: number;
        range?: boolean;
        placeholder?: string;
        integer?: boolean;
    };

    // why is eslint like this smh
    // eslint-disable-next-line prefer-const
    let {value = $bindable(), min, max, step = 1, size, range, placeholder, integer = true}: Props = $props();


    const wasInitiallyUndefined = value === undefined;

    // Check if the current value is valid (within min/max bounds)
    // undefined and NaN are considered valid (they just mean "no value")
    const isValid = $derived(() => {
        if (value === undefined || Number.isNaN(value)) return true;
        if (min !== undefined && value < min) return false;
        if (max !== undefined && value > max) return false;
        return true;
    });

    // Display value - show empty string if undefined, NaN, or invalid
    const displayValue = $derived.by(() => {
        if (value === undefined || Number.isNaN(value)) return "";
        if (!isValid()) return "";
        return value.toString();
    });

    // Determine if the input should be treated as an integer based on props and value
    const isDetectedAsInteger = $derived.by(() => {
        if (value === undefined || Number.isNaN(value)) return false;
        if (!Number.isInteger(value)) return false;
        if (step !== undefined && !Number.isInteger(step)) return false;
        if (min !== undefined && !Number.isInteger(min)) return false;
        if (max !== undefined && !Number.isInteger(max)) return false;
        return true;
    });

    // Determine if we should enforce integer values based on props
    const isActuallyInteger = $derived.by(() => integer && isDetectedAsInteger);

    $effect(() => {
        if (!size && !range) {
            const referenceValue = (value !== undefined && !Number.isNaN(value) && isValid()) ? value : (max ?? 100);
            size = referenceValue.toString().length + 2;
        }
    });

    function increment() {
        // If current value is undefined, NaN, or invalid, start from min (or 0)
        if (value === undefined || Number.isNaN(value) || !isValid()) {
            value = min ?? 0;
            return;
        }

        const newValue = value + step;
        if (max === undefined || newValue <= max) {
            value = newValue;
        }
    }

    function decrement() {
        // If current value is undefined, NaN, or invalid, start from max (or min, or 0)
        if (value === undefined || Number.isNaN(value) || !isValid()) {
            value = max ?? Math.max(0, min ?? 0);
            return;
        }

        const newValue = value - step;
        if (min === undefined || newValue >= min) {
            value = newValue;
        }
    }

    function handleInput(event: Event) {
        const target = event.target as HTMLInputElement;
        const inputText = target.value;

        // Allow empty input - set to undefined
        if (inputText === "") {
            if (wasInitiallyUndefined) {
                value = undefined;
            }
            return;
        }

        const numValue = isActuallyInteger ? parseInt(inputText, 10) : parseFloat(inputText);

        if (!isNaN(numValue)) {
            let constrainedValue = isActuallyInteger ? Math.round(numValue) : numValue;
            if (min !== undefined && constrainedValue < min) constrainedValue = min;
            if (max !== undefined && constrainedValue > max) constrainedValue = max;
            value = constrainedValue;
        }
        else {
            // Cleanup for this will happen onBlur rather than trying to be smart while they type
        }
    }

    function handleKeyDown(event: KeyboardEvent) {
        if (event.key === "ArrowUp") {
            event.preventDefault();
            increment();
        }
        else if (event.key === "ArrowDown") {
            event.preventDefault();
            decrement();
        }
    }

    // Reset any abnormal user input after they click out
    function onBlur(e: FocusEvent) {
        const target = e.target as HTMLInputElement;
        target.value = displayValue;
    }

    // TODO: Make this unnecesary by having the `parse()` function actually convert stuff to numbers
    // Make sure if the value was set to string externally, we convert it to a number
    // Use an IIFE to do this synchronously during init and make svelte stop complaining
    (() => {
        if (typeof value === "string") {
            value = isActuallyInteger ? parseInt(value, 10) : parseFloat(value);
        }
    })();
</script>

<div class="input-wrapper">
    {#if range}
        <Range bind:value min={min ?? 0} max={max ?? 1} step={step ?? 0.1} />
    {:else}
        <div class="number-input">
            <input
                type="text"
                value={displayValue}
                {size}
                {placeholder}
                oninput={handleInput}
                onkeydown={handleKeyDown}
                onblur={onBlur}
            />
            <div class="steppers">
                <button type="button" class="stepper up" onclick={increment} aria-label="Increment">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6" /></svg>
                </button>
                <button type="button" class="stepper down" onclick={decrement} aria-label="Decrement">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                </button>
            </div>
        </div>
    {/if}
</div>

<style>
.input-wrapper {
    display: flex;
    align-items: center;
    gap: 10px;
}

.number-input {
    position: relative;
    display: inline-flex;
    align-items: center;
}

.number-input input {
    background: var(--bg-level-2);
    border: 1px solid var(--border-input);
    border-radius: var(--radius-level-5);
    outline: none;
    color: inherit;
    text-align: right;
    max-width: 175px;
    padding-right: 24px;
    padding-left: 8px;
    padding-top: 4px;
    padding-bottom: 5px;
    font-size: inherit;
}

.number-input input:focus {
    background: var(--bg-input-focus);
    outline: var(--border-input-focus);
}

.steppers {
    position: absolute;
    right: 4px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
}

.stepper {
    background: var(--bg-stepper);
    border: none;
    padding: 0px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 11px;
    width: 14px;
}

.stepper.up {
    border-radius: 4px 4px 0 0;
}

.stepper.down {
    border-radius: 0 0 4px 4px;
}

.stepper:active {
    filter: brightness(1.2);
}

.stepper svg {
    stroke: var(--input-icon-color);
}

.stepper:hover svg {
    opacity: 1;
}
</style>