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
            <option value="" disabled selected hidden>{placeholder}</option>
        {/if}
        {#each options as option, i (i)}
            {#if typeof(option) === "string"}
                <option value={option}>{option}</option>
            {:else}
                <option value={option.value}>{option.name}</option>
            {/if}
        {/each}
    </select>
    <button class="icon" type="button" aria-label="Open dropdown">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 15 5 5 5-5" /><path d="m7 9 5-5 5 5" /></svg>
    </button>
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
    background: #434049;
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
    stroke: #fff;
    width: 16px;
}

/* select {
    appearance: none;
    -webkit-appearance: none;
    display: block;
    height: 28px;
    padding: 0 28px 0 10px;
    border-radius: 6px;
    font-size: 13px;
    font-family: inherit;
    letter-spacing: -0.01em;
    cursor: default;
    color: #e8e8e8;
    background-color: transparent;
    border: 1px solid rgba(0,0,0,0.55);
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.12),
      inset 0 -1px 0 rgba(0,0,0,0.25),
      0 1px 2px rgba(0,0,0,0.5);
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='10' viewBox='0 0 8 10'%3E%3Cpath d='M4 1 L7.5 4.5 L0.5 4.5 Z' fill='%23aaa'/%3E%3Cpath d='M4 9 L0.5 5.5 L7.5 5.5 Z' fill='%23aaa'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 9px center;
    background-size: 8px 10px;
    outline: none;
    transition: filter 0.08s;
    flex: 1;
}
select:hover { filter: brightness(1.12); }
select:focus {
    box-shadow:
        inset 0 1px 0 rgba(255,255,255,0.12),
        inset 0 -1px 0 rgba(0,0,0,0.25),
        0 1px 2px rgba(0,0,0,0.5),
        0 0 0 3px rgba(47,128,245,0.5);
}
select option { background: #3a3a3a; color: #e8e8e8; }

select::after {
    content: "";
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
} */
</style>