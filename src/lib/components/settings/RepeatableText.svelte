<script lang="ts">
    import Text from "./Text.svelte";

    interface Props {
        value: string[];
        placeholder?: string;
    }

    // eslint-disable-next-line prefer-const
    let {value = $bindable(), placeholder = ""}: Props = $props();

    const normalize = (entries: string[]) => {
        const next = entries.filter((entry, index) => entry !== "" || index === entries.length - 1);
        return next.length ? next : [""];
    };

    const update = (index: number, nextValue: string) => {
        const next = [...value];
        next[index] = nextValue;

        if (index === next.length - 1 && nextValue !== "") {
            next.push("");
        }

        value = normalize(next);
    };

    const remove = (index: number) => {
        const next = value.filter((_, entryIndex) => entryIndex !== index);
        value = normalize(next);
    };

    const handleChange = (index: number, event: Event) => {
        update(index, (event.currentTarget as HTMLInputElement).value);
    };
</script>

<div class="repeatable-text">
    {#each value as entry, index (index)}
        <div class="entry">
            <Text
                value={entry}
                {placeholder}
                change={(event: Event) => handleChange(index, event)}
            />
            {#if value.length > 1}
                <button type="button" aria-label="Remove entry" onclick={() => remove(index)}>x</button>
            {/if}
        </div>
    {/each}
</div>

<style>
.repeatable-text {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 6px;
}

.entry {
    display: flex;
    align-items: center;
    gap: 6px;
}

button {
    background: var(--bg-level-2);
    border: 1px solid var(--border-input);
    border-radius: var(--radius-level-5);
    color: inherit;
    cursor: pointer;
    line-height: 1;
    width: 22px;
    height: 22px;
}

button:hover {
    background: var(--bg-level-3);
}
</style>
