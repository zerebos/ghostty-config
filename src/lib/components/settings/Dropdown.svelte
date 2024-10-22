<script lang="ts">
    type Props = {
        value: string;
        options: (string | {name: string, value: string})[];
        change?: () => void;
    };

    // eslint-disable-next-line prefer-const
    let {value = $bindable(), options, change}: Props = $props();
</script>

<select bind:value onchange={change}>
    {#each options as option, i (i)}
        {#if typeof(option) === "string"}
            <option value={option}>{option}</option>
        {:else}
            <option value={option.value}>{option.name}</option>
        {/if}
    {/each}
</select>

<style>
select {
    background: var(--bg-level-2);
    border: 0px solid var(--border-input);
    border-radius: var(--radius-level-5);
    outline: none;
    color: inherit;
    text-align: right;
    max-width: 175px;
}

select:focus {
    background: var(--bg-input-focus);
    outline: var(--border-input-focus);
}
</style>