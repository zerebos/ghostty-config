<script lang="ts">
    type Props = {
        value: number;
        min?: number;
        max?: number;
        step?: number;
        size?: number;
    };
    // import type { ChangeEventHandler } from "svelte/elements";
    let {value = $bindable(), min, max, step, size}: Props = $props();

    // export let value: number;
    // export let min: number;
    // export let max: number;
    // export let step: number;

    // function change(event: Event & {currentTarget: HTMLInputElement}) {
    //     value = event.currentTarget.value;
    // }
</script>

<input type="number" bind:value min={min} max={max} step={step} size={size} />

<style>
input {
    background: #2F2935;
    border: 1px solid #443E4B;
    border-radius: 4px;
    outline: none;
    color: inherit;
    /* text-align: right; */
    max-width: 175px;
}

input:focus {
    background: #1F1E1F;
    outline: 3px solid #2656C9;
}
</style>