<script lang="ts">
    type Props = {
        value: string;
        options: Array<string | {name: string, value: string}>;
        placeholder?: string;
        change?: () => void;
    };

    // eslint-disable-next-line prefer-const
    let {value = $bindable(), options, placeholder, change}: Props = $props();
</script>

<label>
    <select bind:value onchange={change}>
        {#if placeholder}
            <option value="" disabled hidden>{placeholder}</option>
        {/if}
        {#each options as option, i (i)}
            {#if typeof(option) === "string"}
                <option value={option}>{option}</option>
            {:else}
                <option value={option.value}>{option.name}</option>
            {/if}
        {/each}
    </select>
    <div class="icon" aria-label="Open dropdown">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 15 5 5 5-5" /><path d="m7 9 5-5 5 5" /></svg>
    </div>
</label>

<style>
label {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 4px;
}
select {
    appearance: none;
    -webkit-appearance: none;
    background: var(--bg-level-2);
    border: 0px solid var(--border-input);
    border-radius: var(--radius-level-5);
    outline: none;
    color: inherit;
    text-align: right;
    max-width: 175px;
    padding-right: 24px;
}

select:focus {
    background: var(--bg-input-focus);
    outline: var(--border-input-focus);
}

.icon {
    position: absolute;
    background: var(--bg-handle);
    height: 18px;
    width: 18px;
    border: 0;
    padding: 0;
    border-radius: var(--radius-level-5);
    right: 2px;
    pointer-events: none;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    justify-content: center;
    align-items: center;
}

.icon svg {
    stroke: var(--input-icon-color);
    width: 16px;
}
</style>