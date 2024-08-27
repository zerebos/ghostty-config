<script lang="ts">
    import type {HexColor} from "$lib/utils/colors";
    import Color from "./Color.svelte";


    const {value = $bindable([]), defaultValue}: {value: HexColor[], defaultValue: HexColor[]} = $props();
</script>

<div class="grid-container">
    <div class="color-grid">
        {#each value as _, i (i)}
            <Color defaultValue={defaultValue[i]} bind:value={value[i]} size={40} label={(i + 1).toString()} />
        {/each}
    </div>
</div>

<style>
.grid-container {
    display: flex;
    align-items: center;
    flex: 1;
}
.color-grid {
    display: grid;
    /* width: 100%; */
    flex: 1;
    grid-template-columns: repeat(8, 1fr);
    grid-template-rows: repeat(32, 1fr);
    /* grid-column-gap: 30px; */
    justify-content: space-around;
    justify-items: center;

    /* align-items: center; */
    /* align-content: space-evenly; */
    grid-row-gap: 14px;
    margin-bottom: 12px;
}
</style>