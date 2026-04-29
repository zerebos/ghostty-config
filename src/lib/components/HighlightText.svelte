<script lang="ts">
    import type {MatchRange} from "$lib/utils/search";

    const {text, ranges}: {text: string; ranges: MatchRange[]} = $props();

    const parts = $derived.by(() => {
        if (!ranges.length) return [{content: text, highlighted: false}];

        const result: Array<{content: string; highlighted: boolean}> = [];
        let lastIndex = 0;

        for (const range of [...ranges].sort((a, b) => a.start - b.start)) {
            const start = Math.max(0, Math.min(range.start, text.length));
            const end = Math.max(start, Math.min(range.end, text.length));
            if (end <= start) continue;
            if (start > lastIndex) {
                result.push({content: text.slice(lastIndex, start), highlighted: false});
            }
            result.push({content: text.slice(start, end), highlighted: true});
            lastIndex = end;
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
