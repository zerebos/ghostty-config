<script lang="ts">
    import {luminosity, isDark, type HexColor} from "$lib/utils/colors";

    let {value = $bindable(), size = 20, label = ""}: {value: HexColor, size?: number, label?: string} = $props();
    let borderColor = $derived(`rgba(255, 255, 255, ${luminosity(value) * 0.0027451 + 0.3})`)
    let labelColor = $derived(isDark(value) ? `var(--color-text)` : "black");
</script>

<div class="color-wrap" style={`background-color: ${value}; border-color: ${borderColor}; width: ${size}px; height: ${size}px`}>
    {#if label}<span class="label" style="color: {labelColor};">{label}</span>{/if}
    <input type="color" bind:value style={`width: ${size}px; height: ${size}px`} />
</div>

<style>
.color-wrap {
    position: relative;
    display: flex;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    outline: none;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.3);
    /* box-shadow: 0 0 1px 0px rgba(255, 255, 255, 0.5) inset; */
    box-shadow: 0 0 3px 0px black;
    justify-content: center;
    align-items: center;
}

input {
    position: absolute;
    top: -2px;
    left: -2px;
    width: 20px;
    height: 20px;
    border: 0;
    padding: 0;
    outline: none;
    box-shadow: none;
    opacity: 0;
}

input:focus {
    outline: 3px solid #2656C9;
}

.label {
    /* text-shadow: 0 0 5px black; */
    font-weight: 600;
}
</style>