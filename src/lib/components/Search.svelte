<script lang="ts">
    import search, {clearSearch} from "$lib/stores/search.svelte";
    import {onMount} from "svelte";

    let inputRef: HTMLInputElement | undefined = $state();
    let isMac = $state(false);

    onMount(() => {
        isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
        window.addEventListener("keydown", handleKeydown);
        return () => window.removeEventListener("keydown", handleKeydown);
    });

    function handleKeydown(e: KeyboardEvent) {
        if ((e.metaKey || e.ctrlKey) && e.key === "k") {
            e.preventDefault();
            inputRef?.focus();
        }
    }

    function handleInputKeydown(e: KeyboardEvent) {
        if (e.key === "Escape") {
            e.preventDefault();
            clearSearch();
            inputRef?.blur();
        }
    }

    function clearInput() {
        clearSearch();
        inputRef?.focus();
    }
</script>

<div class="search-container">
    <div class="search-icon">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            height="16"
            viewBox="0 -960 960 960"
            width="16"
            fill="currentColor"
        >
            <path
                d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"
            />
        </svg>
    </div>
    <input
        type="text"
        bind:this={inputRef}
        bind:value={search.query}
        placeholder="Search..."
        class="search-input"
        onkeydown={handleInputKeydown}
    />
    {#if search.query}
        <button class="clear-button" onclick={clearInput} type="button" aria-label="Clear search">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                height="14"
                viewBox="0 -960 960 960"
                width="14"
                fill="currentColor"
            >
                <path
                    d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"
                />
            </svg>
        </button>
    {:else}
        <kbd
            class="shortcut-hint"
            aria-label="Press {isMac ? 'Command' : 'Control'} plus K to focus search"
        >
            {isMac ? "⌘K" : "Ctrl+K"}
        </kbd>
    {/if}
</div>

<style>
    .search-container {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        margin: 0 10px 0px 5px;
        background: var(--bg-level-2, rgba(0, 0, 0, 0.2));
        border-radius: var(--radius-level-4, 6px);
        border: 1px solid var(--border-level-1, transparent);
    }

    .search-container:focus-within {
        border-color: var(--color-selected, #4a9eff);
    }

    .search-icon {
        display: flex;
        align-items: center;
        color: var(--font-color-muted, #888);
        flex-shrink: 0;
    }

    .search-input {
        flex: 1;
        background: transparent;
        border: none;
        outline: none;
        color: var(--font-color, #fff);
        font-size: 0.9rem;
        width: 100%;
    }

    .search-input::placeholder {
        color: var(--font-color-muted, #888);
    }

    .clear-button {
        display: flex;
        align-items: center;
        justify-content: center;
        background: transparent;
        border: none;
        color: var(--font-color-muted, #888);
        cursor: pointer;
        padding: 0;
        flex-shrink: 0;
    }

    .clear-button:hover {
        color: var(--font-color, #fff);
    }

    .shortcut-hint {
        font-family: inherit;
        font-size: 0.75rem;
        color: var(--font-color-muted, #888);
        background: var(--bg-level-3, rgba(0, 0, 0, 0.3));
        padding: 2px 6px;
        border-radius: var(--radius-level-4, 4px);
        border: 1px solid var(--border-level-1, rgba(255, 255, 255, 0.1));
        flex-shrink: 0;
        user-select: none;
    }
</style>
