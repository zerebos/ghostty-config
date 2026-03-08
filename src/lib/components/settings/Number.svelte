<script lang="ts">
    type Props = {
        value: number;
        min?: number;
        max?: number;
        step?: number;
        size?: number;
        range?: boolean;
        placeholder?: string;
    };

    // eslint-disable-next-line prefer-const
    let {value = $bindable(), min, max, step = 1, size, range, placeholder}: Props = $props();

    const inputType = $derived(range ? "range" : "text");

    // Check if the current value is valid (within min/max bounds)
    const isValid = $derived(() => {
        if (min !== undefined && value < min) return false;
        if (max !== undefined && value > max) return false;
        return true;
    });

    // Display value - show empty string if invalid, otherwise show the value
    const displayValue = $derived(isValid() ? value.toString() : "");

    $effect(() => {
        if (!size && !range) {
            const referenceValue = isValid() ? value : (max ?? 100);
            size = referenceValue.toString().length + 2;
        }
    });

    function increment() {
        // If current value is invalid, start from min (or 0)
        if (!isValid()) {
            value = min ?? 0;
            return;
        }

        const newValue = value + step;
        if (max === undefined || newValue <= max) {
            value = newValue;
        }
    }

    function decrement() {
        // If current value is invalid, start from max (or 0)
        if (!isValid()) {
            value = max ?? Math.min(0, min ?? 0);
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

        // Allow empty input (shows placeholder)
        if (inputText === "" && placeholder) {
            value = 0; // TODO: this is currently what "clearable" numbers use as a placeholder, I need to rework the settings system to allow clearable settings more elegantly, but for now this will do. It just needs to be some number that is outside the valid range so that it shows as empty. If you are still reading this comment, why?
            return;
        }

        const numValue = parseFloat(inputText);

        if (!isNaN(numValue)) {
            let constrainedValue = numValue;
            if (min !== undefined && constrainedValue < min) constrainedValue = min;
            if (max !== undefined && constrainedValue > max) constrainedValue = max;
            value = constrainedValue;
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
</script>

<div class="input-wrapper">
    {#if range}
        <div>{value}</div>
        <input type={inputType} bind:value {min} {max} {step} {size} {placeholder} />
    {:else}
        <div class="number-input">
            <input
                type="text"
                value={displayValue}
                {size}
                {placeholder}
                oninput={handleInput}
                onkeydown={handleKeyDown}
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
    background: #535258;
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
    stroke: #fff;
}

.stepper:hover svg {
    opacity: 1;
}



/* Range slider styles */
input[type="range"] {
   border: 0;
   height: 5px;
   background-color: var(--bg-separator);
   border-radius: var(--radius-level-5);
}

input[type="range"]::-moz-range-progress {
   background-color: var(--color-input-accent);
   border-radius: 5px;
   height: 5px;
   width: 100%;
}

input[type="range"]::-moz-range-thumb {
   margin-top: -10px;
   background-color: #98949B;
   border-radius: 12px;
   height: 20px;
   width: 8px;
}

input[type="range"]:focus::-moz-range-thumb {
    background-color: hsl(from #98949B h s calc(l + 10));
}
</style>