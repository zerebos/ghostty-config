<script lang="ts">
    type Props = {
        value: string;
        options: (string | {name: string, value: string})[]
    };
    // import type { ChangeEventHandler } from "svelte/elements";
    let {value = $bindable(), options}: Props = $props();

    // export let value: number;
    // export let min: number;
    // export let max: number;
    // export let step: number;

    // function change(event: Event & {currentTarget: HTMLInputElement}) {
    //     value = event.currentTarget.value;
    // }
</script>

<select bind:value>
    {#each options as option}
        {#if typeof(option) === "string"}
            <option value="{option}">{option}</option>
        {:else}
            <option value="{option.value}">{option.name}</option>
        {/if}
    {/each}
</select>

<style>
select {
    background: #2F2935;
    border: 1px solid #443E4B;
    border-radius: 4px;
    outline: none;
    color: inherit;
    /* text-align: right; */
    max-width: 175px;
}

select:focus {
    background: #1F1E1F;
    outline: 3px solid #2656C9;
}
</style>