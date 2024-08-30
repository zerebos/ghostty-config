<script lang="ts">
    type Props = {
        value: number;
        min?: number;
        max?: number;
        step?: number;
        size?: number;
        range?: boolean;
    };

    // eslint-disable-next-line prefer-const
    let {value = $bindable(), min, max, step, size, range}: Props = $props();

    const inputType = range ? "range" : "number";
    if (!size && !range) size = max ? max.toString().length : value.toString().length + 2;
</script>

<div class="input-wrapper">
    {#if range}
        <div>{value}</div>
    {/if}
    <input type={inputType} bind:value {min} {max} {step} {size} />
</div>

<style>
/* TODO: make custom component */
.input-wrapper {
    display: flex;
    align-items: center;
    gap: 10px;
}

input {
    background: var(--bg-level-2);
    border: 1px solid transparent;
    border-radius: var(--radius-level-5);
    outline: none;
    color: inherit;
    text-align: right;
    max-width: 175px;
}

input[type="number"]:focus {
    background: var(--bg-input-focus);
    outline: var(--border-input-focus);
}


/* Chrome is dumb so TODO: add a custom slider */
input[type="range"] {
   border: 0;
   height: 5px;
   background-color: var(--bg-separator);
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
   border-radius: 50%;
   height: 20px;
   width: 20px;
}

input[type="range"]:focus::-moz-range-thumb {
    background-color: hsl(from #98949B h s calc(l + 10));
}
</style>