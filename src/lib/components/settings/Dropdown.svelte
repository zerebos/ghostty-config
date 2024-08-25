<script lang="ts">
    type Props = {
        value: string;
        options: (string | {name: string, value: string})[]
    };

    let {value = $bindable(), options}: Props = $props();
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
    border: 0px solid #443E4B;
    border-radius: 4px;
    outline: none;
    color: inherit;
    text-align: right;
    max-width: 175px;
}

select:focus {
    background: #1F1E1F;
    outline: 3px solid #2656C9;
}
</style>