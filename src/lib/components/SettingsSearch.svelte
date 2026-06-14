<script lang="ts">
    import type {Snippet} from "svelte";
    import {goto} from "$app/navigation";
    import {page} from "$app/state";
    import {resolve} from "$app/paths";
    import {scale} from "svelte/transition";

    import Tab from "$lib/components/Tab.svelte";

    import {getGroupedResults, getHighlightParts, getResults, hasGroupedResults, hasResults, searchState, setQuery, type SearchResult} from "$lib/stores/search.svelte";


    const {children}: {children: Snippet} = $props();


    let inputElement: HTMLInputElement | null = null;
    function focusSearch(): void {
        if (!inputElement) return;
        inputElement.focus();
        inputElement.select();
    }

    function getSearchResultHref(result: SearchResult): string {
        return resolve("/settings/[category]", {category: result.categoryId});
    }

    function activateSearchResult(event: MouseEvent | KeyboardEvent, result: SearchResult & {index?: number}): void {
        const isModifiedClick = event instanceof MouseEvent && (event.metaKey || event.ctrlKey || event.shiftKey || event.button === 1);
        if (isModifiedClick) return;

        const href = getSearchResultHref(result);
        const isSamePage = page.url.pathname === href;

        // If clicking on the already selected search result, retrigger the scroll and highlight effect by clearing and re-setting the selectedId
        if (isSamePage && searchState.selectedId === result.settingId) searchState.selectedId = "";
        searchState.selectedId = result.settingId;

        // Set both selectedIndex and activeIndex to keep keyboard and click selection in sync
        if (result.index !== undefined) {
            searchState.selectedIndex = result.index;
            searchState.activeIndex = result.index;
        }

        // Don't navigate if we're already on the page, just set the selectedId so the item can scroll into view and highlight
        if (isSamePage) return event.preventDefault();

        // Let the link handle navigation for clicks to preserve things like ctrl+click to open in new tab
        if (event.type === "click") return;

        // Keyboard event needs special handling to navigate and then focus search input again for continued keyboard navigation
        if (event.type === "keydown") {
            // eslint-disable-next-line svelte/no-navigation-without-resolve, svelte/no-goto-without-base
            void goto(href).then(() => {
                // Refocus search after navigation so user can continue navigating with keyboard
                focusSearch();
            });
        }
    }

    function handleWindowKeydown(event: KeyboardEvent): void {
        if ((event.metaKey || event.ctrlKey) && event.key.toLocaleLowerCase() === "k") {
            event.preventDefault();
            focusSearch();
        }
    }

    function handleSearchKeydown(event: KeyboardEvent): void {
        if (!hasResults()) return;

        if (event.key === "ArrowDown") {
            event.preventDefault();
            searchState.selectedIndex = searchState.selectedIndex < getResults().length - 1 ? searchState.selectedIndex + 1 : 0;
            return;
        }

        if (event.key === "ArrowUp") {
            event.preventDefault();
            searchState.selectedIndex = searchState.selectedIndex > 0 ? searchState.selectedIndex - 1 : getResults().length - 1;
            return;
        }

        if (event.key === "Enter" && searchState.selectedIndex >= 0) {
            event.preventDefault();
            activateSearchResult(event, {...getResults()[searchState.selectedIndex], index: searchState.selectedIndex});
            return;
        }

        if (event.key === "Escape") {
            setQuery("");
        }
    }

    function handleSearchInput(event: Event): void {
        const input = event.currentTarget as HTMLInputElement;
        setQuery(input.value);
    }

    // Scroll selected search result into view when it changes
    $effect(() => {
        if (searchState.selectedIndex < 0) return;
        const target = document.getElementById(`search-result-${searchState.selectedIndex.toString()}`) as HTMLAnchorElement | null;
        if (!target) return;
        target.scrollIntoView({block: "nearest"});
    });
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
        value={searchState.query}
        oninput={handleSearchInput}
        onkeydown={handleSearchKeydown}
        placeholder="Search"
        aria-label="Search"
        autocomplete="off"
        spellcheck={false}
        bind:this={inputElement}
    />

    {#if searchState.query}
        <button
            class="search-clear-button"
            type="button"
            title="Clear search"
            transition:scale={{duration: 150}}
            onclick={() => {
                setQuery("");
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
    {#if searchState.query}
        <div id="search-results" role="listbox" aria-label="Search results">
            {#if hasGroupedResults()}
                {#each getGroupedResults() as category (category.categoryId)}
                    <section class="search-category">
                        <Tab
                            route={category.categoryRoute}
                            selected={page.url.pathname === category.categoryRoute && searchState.selectedId === ""}
                            onClick={() => {
                                searchState.selectedId = "";
                                searchState.activeIndex = -1; // tab selection is inside component for now
                            }}
                        >
                            {#snippet icon()}
                                <!-- FIXME: this is a hack -->
                                {#if category.categoryIcon.includes("svg+xml") || category.categoryIcon.endsWith(".svg")}
                                    <div class="icon-wrapper">
                                        <img src={category.categoryIcon} alt={`${category.categoryName} Settings`} />
                                    </div>
                                {:else}
                                    <img src={category.categoryIcon} alt={`${category.categoryName} Settings`} />
                                {/if}
                            {/snippet}
                            {category.categoryName}
                        </Tab>
                        <div class="search-category-results">
                            {#each category.results as result (result.routeKey)}
                                <!-- eslint-disable-next-line svelte/no-navigation-without-resolve, svelte/first-attribute-linebreak -->
                                <a href={getSearchResultHref(result)}
                                    id={`search-result-${result.index}`}
                                    class="search-result"
                                    class:active={result.index === searchState.activeIndex}
                                    class:selected={result.index === searchState.selectedIndex}
                                    role="option"
                                    aria-selected={result.index === searchState.selectedIndex}
                                    onclick={(event) => {
                                        activateSearchResult(event, result);
                                    }}
                                >
                                    <span class="search-result-name">
                                        {#each getHighlightParts(result.settingName) as part, i (`${result.routeKey}:name:${i}`)}
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
                                                {#each getHighlightParts(result.groupName) as part, i (`${result.routeKey}:group:${i}`)}
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
                                                {#each getHighlightParts(result.note) as part, i (`${result.routeKey}:note:${i}`)}
                                                    {#if part.matched}
                                                        <strong>{part.text}</strong>
                                                    {:else}
                                                        {part.text}
                                                    {/if}
                                                {/each}
                                            </span>
                                        {/if}
                                        {#if result.description}
                                            <span>
                                                {#each getHighlightParts(result.description) as part, i (`${result.routeKey}:description:${i}`)}
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
                <div class="search-blankslate">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 56 56" class="search-icon">
                        <path d="M0 0h56v56H0z" fill="none" />
                        <path fill="currentColor" d="M23.957 41.77a18.02 18.02 0 0 0 10.477-3.376l11.109 11.11a2.66 2.66 0 0 0 1.898.773c1.524 0 2.625-1.172 2.625-2.672c0-.703-.234-1.359-.75-1.874L38.277 34.668c2.32-3.047 3.703-6.82 3.703-10.922c0-9.914-8.109-18.023-18.023-18.023c-9.937 0-18.023 8.109-18.023 18.023S14.02 41.77 23.957 41.77m0-3.891c-7.758 0-14.133-6.398-14.133-14.133S16.2 9.613 23.957 9.613c7.734 0 14.133 6.399 14.133 14.133c0 7.735-6.399 14.133-14.133 14.133" />
                    </svg>
                    <h2>No Results</h2>
                    <p class="search-empty">No results for<span>"{searchState.query}"</span></p>
                </div>

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
    overflow-x: hidden;
    overflow-y: auto;
}

#search-results {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow-y: auto;
    min-height: 0;
    gap: 10px;
}

.search-blankslate {
    display: flex;
    flex-direction: column;
    flex: 1;
    align-items: center;
    justify-content: center;
    gap: 6px;
    color: var(--font-color-muted);
    margin-top: calc(-50%); /* macOS has a similar offset centering */
}

.search-blankslate .search-icon {
    width: 20px;
    height: 20px;
    margin-bottom: 8px;
}

.search-blankslate h2 {
    margin: 0;
    font-size: 1.2rem;
    color: var(--font-color);
}

.search-empty {
    margin: 0;
    color: var(--font-color-muted);
    font-size: 0.9rem;
    display: inline-flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 4px;
}

.search-empty span {
    word-break: break-all;
    text-align: center;
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
    background: rgba(255, 255, 255, 0.075);
}

.search-result.active {
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

#categories .icon-wrapper :global(img) {
    height: 14px;
    width: 14px;
}

</style>
