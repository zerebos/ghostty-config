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
</script>

<div class="input-wrapper">
    {#if range}
        <div>{value}</div>
    {/if}
    <input type={inputType} bind:value {min} {max} {step} {size} />
</div>

<style>
.input-wrapper {
    display: flex;
    align-items: center;
    gap: 10px;
}

input {
    background: var(--bg-level-2);
    border: 1px solid var(--border-input);
    border-radius: var(--radius-level-5);
    outline: none;
    color: inherit;
    /* text-align: right; */
    max-width: 175px;
}

input[type="number"]:focus {
    background: var(--bg-input-focus);
    outline: var(--border-input-focus);
}
</style>