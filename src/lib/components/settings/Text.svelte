<script lang="ts">
    // import type { ChangeEventHandler } from "svelte/elements";

    export let value = "";

    // function change(event: Event & {currentTarget: HTMLInputElement}) {
    //     value = event.currentTarget.value;
    // }
</script>

<input type="text" bind:value />

<style>
input {
    background: #2F2935;
    border: 1px solid #443E4B;
    border-radius: 4px;
    outline: none;
    color: inherit;
    text-align: right;
    max-width: 175px;
}

input:focus {
    background: #1F1E1F;
    outline: 3px solid #2656C9;
}
</style>