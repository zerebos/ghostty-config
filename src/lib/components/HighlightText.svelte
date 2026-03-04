<script lang="ts">
    import type {MatchRange} from "$lib/utils/search";

    const {text, ranges}: {text: string; ranges: MatchRange[]} = $props();

    const parts = $derived.by(() => {
        if (!ranges.length) return [{content: text, highlighted: false}];

        const result: Array<{content: string; highlighted: boolean}> = [];
        let lastIndex = 0;

        for (const range of [...ranges].sort((a, b) => a.start - b.start)) {
            if (range.start > lastIndex) {
                result.push({content: text.slice(lastIndex, range.start), highlighted: false});
            }
            result.push({content: text.slice(range.start, range.end), highlighted: true});
            lastIndex = range.end;
        }

        if (lastIndex < text.length) {
            result.push({content: text.slice(lastIndex), highlighted: false});
        }

        return result;
    });
</script>

<span>
    {#each parts as part, i (i)}
        {#if part.highlighted}
            <span class="highlight">{part.content}</span>
        {:else}
            {part.content}
        {/if}
    {/each}
</span>

<style>
    .highlight {
        color: var(--color-selected, #4a9eff);
        font-weight: 600;
    }
</style>
