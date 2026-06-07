<script lang="ts">
    import {resolve} from "$app/paths";
    import Tab from "$lib/components/Tab.svelte";
    import settings from "$lib/data/settings";

    import application from "$lib/images/tabs/application.webp";
    import clipboard from "$lib/images/tabs/clipboard.webp";
    import windowIcon from "$lib/images/tabs/window.webp";

    import colors from "$lib/images/tabs/colors.webp";
    import fonts from "$lib/images/tabs/fonts.webp";

    import keybinds from "$lib/images/tabs/keybinds.webp";
    import mouse from "$lib/images/tabs/mouse.webp";

    import gtk from "$lib/images/tabs/gtk.svg";
    import linux from "$lib/images/tabs/linux.webp";
    import macos from "$lib/images/tabs/macos.webp";

    import type {Snippet} from "svelte";

    interface SearchResult {
        categoryId: string;
        categoryName: string;
        groupName: string;
        note: string;
        routeKey: string;
        settingId: string;
        settingName: string;
        searchableText: string;
    }

    interface HighlightPart {
        matched: boolean;
        text: string;
    }

    const {children}: {children: Snippet} = $props();

    const searchableSettings = $derived.by(() => {
        const results: SearchResult[] = [];
        for (const category of settings) {
            for (const group of category.groups) {
                for (const setting of group.settings) {
                    const searchableText = [
                        category.name,
                        group.name,
                        setting.name,
                        setting.note ?? ""
                    ]
                        .join(" ")
                        .toLocaleLowerCase();
                    results.push({
                        categoryId: category.id,
                        categoryName: category.name,
                        groupName: group.name,
                        note: setting.note ?? "",
                        routeKey: `${category.id}:${setting.id}`,
                        settingId: setting.id,
                        settingName: setting.name,
                        searchableText,
                    });
                }
            }
        }
        return results;
    });

    let searchQuery = $state("");
    let selectedSearchIndex = $state(-1);

    const normalizedSearchQuery = $derived(searchQuery.trim().toLocaleLowerCase());
    const searchTokens = $derived(normalizedSearchQuery.split(/\s+/).filter(Boolean));

    const filteredSearchResults = $derived.by(() => {
        if (!searchTokens.length) return [];
        return searchableSettings.filter(result => searchTokens.every(token => result.searchableText.includes(token)));
    });

    const groupedSearchResults = $derived.by(() => {
        const grouped: Array<{
            categoryId: string;
            categoryName: string;
            categoryRoute: string;
            results: Array<SearchResult & {index: number}>;
        }> = [];

        filteredSearchResults.forEach((result, index) => {
            const existing = grouped.find(group => group.categoryId === result.categoryId);
            if (existing) {
                existing.results.push({...result, index});
                return;
            }

            grouped.push({
                categoryId: result.categoryId,
                categoryName: result.categoryName,
                categoryRoute: resolve("/settings/[category]", {category: result.categoryId}),
                results: [{...result, index}],
            });
        });

        return grouped;
    });

    function getHighlightParts(value: string, query: string): HighlightPart[] {
        if (!value) return [];

        const tokens = query
            .trim()
            .toLocaleLowerCase()
            .split(/\s+/)
            .filter(Boolean);

        if (!tokens.length) {
            return [{matched: false, text: value}];
        }

        const lowerValue = value.toLocaleLowerCase();
        const ranges: Array<[number, number]> = [];
        for (const token of tokens) {
            let fromIndex = 0;
            while (fromIndex < lowerValue.length) {
                const index = lowerValue.indexOf(token, fromIndex);
                if (index < 0) break;

                ranges.push([index, index + token.length]);
                fromIndex = index + token.length;
            }
        }

        if (!ranges.length) {
            return [{matched: false, text: value}];
        }

        ranges.sort((a, b) => a[0] - b[0]);

        const merged: Array<[number, number]> = [ranges[0]];
        for (let i = 1; i < ranges.length; i++) {
            const range = ranges[i];
            const last = merged[merged.length - 1];
            if (range[0] <= last[1]) {
                last[1] = Math.max(last[1], range[1]);
            }
            else {
                merged.push(range);
            }
        }

        const parts: HighlightPart[] = [];
        let cursor = 0;
        for (const [start, end] of merged) {
            if (start > cursor) {
                parts.push({matched: false, text: value.slice(cursor, start)});
            }
            parts.push({matched: true, text: value.slice(start, end)});
            cursor = end;
        }

        if (cursor < value.length) {
            parts.push({matched: false, text: value.slice(cursor)});
        }

        return parts;
    }

    function focusSearch(): void {
        const input = document.getElementById("sidebar-settings-search") as HTMLInputElement | null;
        if (!input) return;
        input.focus();
        input.select();
    }

    function getSearchResultHref(result: SearchResult): string {
        const categoryRoute = resolve("/settings/[category]", {category: result.categoryId});
        return `${categoryRoute}?setting=${result.settingId}&focus=${Date.now().toString()}`;
    }

    function activateSearchResult(index: number): void {
        const target = document.getElementById(`search-result-${index.toString()}`) as HTMLAnchorElement | null;
        if (!target) return;
        target.click();
    }

    function handleWindowKeydown(event: KeyboardEvent): void {
        if ((event.metaKey || event.ctrlKey) && event.key.toLocaleLowerCase() === "k") {
            event.preventDefault();
            focusSearch();
        }
    }

    function handleSearchKeydown(event: KeyboardEvent): void {
        if (!filteredSearchResults.length) return;

        if (event.key === "ArrowDown") {
            event.preventDefault();
            selectedSearchIndex = (selectedSearchIndex + 1 + filteredSearchResults.length) % filteredSearchResults.length;
            return;
        }

        if (event.key === "ArrowUp") {
            event.preventDefault();
            selectedSearchIndex = (selectedSearchIndex - 1 + filteredSearchResults.length) % filteredSearchResults.length;
            return;
        }

        if (event.key === "Enter" && selectedSearchIndex >= 0) {
            event.preventDefault();
            activateSearchResult(selectedSearchIndex);
            return;
        }

        if (event.key === "Escape") {
            searchQuery = "";
            selectedSearchIndex = -1;
        }
    }

    function handleSearchInput(event: Event): void {
        const input = event.currentTarget as HTMLInputElement;
        searchQuery = input.value;
        selectedSearchIndex = input.value.trim() ? 0 : -1;
    }
</script>

<svelte:window onkeydown={handleWindowKeydown} />

<div class="sidebar-search">
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 56 56" class="search-icon">
        <path d="M0 0h56v56H0z" fill="none" />
        <path fill="currentColor" d="M23.957 41.77a18.02 18.02 0 0 0 10.477-3.376l11.109 11.11a2.66 2.66 0 0 0 1.898.773c1.524 0 2.625-1.172 2.625-2.672c0-.703-.234-1.359-.75-1.874L38.277 34.668c2.32-3.047 3.703-6.82 3.703-10.922c0-9.914-8.109-18.023-18.023-18.023c-9.937 0-18.023 8.109-18.023 18.023S14.02 41.77 23.957 41.77m0-3.891c-7.758 0-14.133-6.398-14.133-14.133S16.2 9.613 23.957 9.613c7.734 0 14.133 6.399 14.133 14.133c0 7.735-6.399 14.133-14.133 14.133" />
    </svg>

    <input
        id="sidebar-settings-search"
        type="search"
        class="search-input"
        value={searchQuery}
        oninput={handleSearchInput}
        onkeydown={handleSearchKeydown}
        placeholder="Search"
        aria-label="Search"
        autocomplete="off"
        spellcheck={false}
    />

    {#if normalizedSearchQuery}
        <button
            class="search-clear-button"
            type="button"
            title="Clear search"
            onclick={() => {
                searchQuery = "";
                selectedSearchIndex = -1;
            }}
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 56 56">
                <path d="M0 0h56v56H0z" fill="none" />
                <path fill="currentColor" d="M28 51.906c13.055 0 23.906-10.828 23.906-23.906c0-13.055-10.875-23.906-23.93-23.906C14.899 4.094 4.095 14.945 4.095 28c0 13.078 10.828 23.906 23.906 23.906m-8.414-13.5a1.99 1.99 0 0 1-1.992-1.992c0-.539.234-1.008.609-1.36l6.984-7.03l-6.984-7.032a1.8 1.8 0 0 1-.61-1.36c0-1.077.891-1.945 1.993-1.945c.539 0 1.008.211 1.36.586l7.03 7.008l7.079-7.031c.398-.422.82-.61 1.336-.61c1.101 0 1.992.891 1.992 1.97c0 .538-.188.984-.586 1.359l-7.031 7.054l7.007 6.985c.352.375.586.844.586 1.406a1.99 1.99 0 0 1-1.992 1.992a1.93 1.93 0 0 1-1.383-.586l-7.007-7.031l-6.985 7.031a1.93 1.93 0 0 1-1.406.586" />
            </svg>
        </button>
    {/if}
</div>

<nav id="categories">
    {#if normalizedSearchQuery}
        <div id="search-results" role="listbox" aria-label="Search results">
            {#if groupedSearchResults.length}
                {#each groupedSearchResults as category (category.categoryId)}
                    <section class="search-category">
                        <Tab route={category.categoryRoute}>
                            {#snippet icon()}
                                {#if category.categoryId === "application"}
                                    <img src={application} alt="Application Settings" />
                                {:else if category.categoryId === "clipboard"}
                                    <img src={clipboard} alt="Clipboard Settings" />
                                {:else if category.categoryId === "window"}
                                    <img src={windowIcon} alt="Window Settings" />
                                {:else if category.categoryId === "colors"}
                                    <img src={colors} alt="Color Settings" />
                                {:else if category.categoryId === "fonts"}
                                    <img src={fonts} alt="Font Settings" />
                                {:else if category.categoryId === "keybinds"}
                                    <img src={keybinds} alt="Keybind Settings" />
                                {:else if category.categoryId === "mouse"}
                                    <img src={mouse} alt="Mouse Settings" />
                                {:else if category.categoryId === "gtk"}
                                    <div class="icon-wrapper"><img src={gtk} alt="GTK Settings" /></div>
                                {:else if category.categoryId === "linux"}
                                    <img src={linux} alt="Linux Settings" />
                                {:else if category.categoryId === "macos"}
                                    <img src={macos} alt="macOS Settings" />
                                {/if}
                            {/snippet}
                            {category.categoryName}
                        </Tab>
                        <div class="search-category-results">
                            {#each category.results as result (result.routeKey)}
                                <!-- eslint-disable-next-line svelte/no-navigation-without-resolve, svelte/first-attribute-linebreak -->
                                <a href={getSearchResultHref(result)}
                                    id={`search-result-${result.index.toString()}`}
                                    class="search-result"
                                    class:selected={result.index === selectedSearchIndex}
                                    role="option"
                                    aria-selected={result.index === selectedSearchIndex}
                                    onmousemove={() => selectedSearchIndex = result.index}
                                    onclick={() => {
                                        searchQuery = "";
                                        selectedSearchIndex = -1;
                                    }}
                                >
                                    <span class="search-result-name">
                                        {#each getHighlightParts(result.settingName, searchQuery) as part, i (`${result.routeKey}:name:${i.toString()}`)}
                                            {#if part.matched}
                                                <strong>{part.text}</strong>
                                            {:else}
                                                {part.text}
                                            {/if}
                                        {/each}
                                    </span>
                                    <span class="search-result-meta">
                                        {#if result.groupName}
                                            <span>
                                                {#each getHighlightParts(result.groupName, searchQuery) as part, i (`${result.routeKey}:group:${i.toString()}`)}
                                                    {#if part.matched}
                                                        <strong>{part.text}</strong>
                                                    {:else}
                                                        {part.text}
                                                    {/if}
                                                {/each}
                                            </span>
                                        {/if}
                                        {#if result.note}
                                            <span>
                                                {#each getHighlightParts(result.note, searchQuery) as part, i (`${result.routeKey}:note:${i.toString()}`)}
                                                    {#if part.matched}
                                                        <strong>{part.text}</strong>
                                                    {:else}
                                                        {part.text}
                                                    {/if}
                                                {/each}
                                            </span>
                                        {/if}
                                    </span>
                                </a>
                            {/each}
                        </div>
                    </section>
                {/each}
            {:else}
                <p class="search-empty">No settings match "{searchQuery.trim()}".</p>
            {/if}
        </div>
    {:else}
        {@render children()}
    {/if}
</nav>

<style>
.sidebar-search {
    --search-height: 16px;

    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px;
    margin: 0 10px 4px;
    border-radius: var(--radius-level-4);
    background: rgba(255, 255, 255, 0.075);
    box-shadow:
        inset 0px 2px 1px -3px rgba(255, 255, 255, 0.65),
        inset 0px -3px 1px -3px rgba(255, 255, 255, 0.65);
}

.sidebar-search:has(.search-input:focus) {
    outline: var(--border-input-focus);
}

.search-icon {
    color: currentColor;
    height: var(--search-height);
    width: var(--search-height);
}

.search-input {
    width: 100%;
    flex: 1;
    border: 0;
    background: transparent;
    color: var(--font-color);
    font-size: 0.9rem;
    font-weight: 500;
    outline: none;
    height: var(--search-height);
}

.search-input:focus {
    /* Focus border is handled by container */
    outline: 0;
}

.search-clear-button {
    border: none;
    background: transparent;
    color: var(--font-color);
    padding: 0;
    height: var(--search-height);
    width: var(--search-height);
    border-radius: var(--radius-level-4);
    display: flex;
    justify-content: center;
    align-items: center;
}

.search-clear-button:hover {
    background: none;
}

#categories {
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 10px;
    min-height: 0;
    overflow: hidden;
}

#search-results {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    min-height: 0;
    gap: 10px;
}

.search-empty {
    margin: 0;
    color: var(--font-color-muted);
    font-size: 0.9rem;
}

.search-category {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.search-category-results {
    display: flex;
    flex-direction: column;
    gap: 3px;
    margin-left: 10px;
}

.search-result {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    border: none;
    background: transparent;
    color: var(--font-color);
    text-align: left;
    padding: 6px;
    border-radius: var(--radius-level-4);
    gap: 2px;
    text-decoration: none;
}

.search-result.selected,
.search-result:hover {
    background: var(--color-selected);
}

.search-result-name {
    font-weight: 600;
    font-size: 0.92rem;
    line-height: 1.2;
}

.search-result-name :global(strong),
.search-result-meta :global(strong) {
    font-weight: 800;
}

.search-result-meta {
    display: flex;
    flex-direction: column;
    color: var(--font-color-muted);
    font-size: 0.78rem;
    line-height: 1.2;
    gap: 1px;
}

#categories img {
    width: 100%;
}

#categories .icon-wrapper {
    background: linear-gradient(#D3E3E9, #908F8C);
    width: 20px;
    height: 20px;
    border-radius: var(--radius-level-4);
    display: inline-flex;
    justify-content: center;
    align-items: center;
}

#categories .icon-wrapper img {
    height: 14px;
    width: 14px;
}

</style>
