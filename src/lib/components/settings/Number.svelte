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
    background: #2F2935;
    border: 1px solid #443E4B;
    border-radius: 4px;
    outline: none;
    color: inherit;
    /* text-align: right; */
    max-width: 175px;
}

input[type="number"]:focus {
    background: #1F1E1F;
    outline: 3px solid #2656C9;
}
</style>