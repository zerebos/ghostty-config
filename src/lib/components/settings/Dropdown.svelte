<script lang="ts">
    import {fly, scale} from "svelte/transition";

    type DropdownOptionInput =
        | string
        | {
            name: string;
            value: string;
            description?: string;
            icon?: string;
            group?: string;
            disabled?: boolean;
            search?: string[];
        };

    type DropdownGroupInput = {
        label: string;
        options: DropdownOptionInput[];
        separatorBefore?: boolean;
    };

    type DropdownOption = {
        id: string;
        name: string;
        value: string;
        description?: string;
        icon?: string;
        group: string | null;
        disabled: boolean;
        searchText: string;
    };

    type DropdownGroup = {
        label: string | null;
        separatorBefore: boolean;
        options: DropdownOption[];
    };

    type Props = {
        value?: string;
        options?: DropdownOptionInput[];
        groups?: DropdownGroupInput[];
        placeholder?: string;
        searchable?: boolean;
        allowEmpty?: boolean;
        emptyLabel?: string;
        noResultsLabel?: string;
        disabled?: boolean;
        change?: () => void;
    };

    /* eslint-disable prefer-const */
    let {
        value = $bindable(""),
        options = [],
        groups,
        placeholder = "Select",
        searchable = false,
        allowEmpty = false,
        emptyLabel = "Clear selection",
        noResultsLabel = "No results",
        disabled = false,
        change
    }: Props = $props();
    /* eslint-enable prefer-const */

    let isOpen = $state(false);
    let query = $state("");
    let highlightedValue = $state<string | null>(null);
    let menuPosition = $state({top: 0, right: 0, minWidth: 230});

    let rootEl = $state<HTMLDivElement>();
    let triggerEl = $state<HTMLButtonElement>();
    let searchEl = $state<HTMLInputElement>();
    let menuEl = $state<HTMLDivElement>();
    let optionsContainerEl = $state<HTMLDivElement>();

    function normalizeOption(input: DropdownOptionInput, index: number, group: string | null): DropdownOption {
        if (typeof input === "string") {
            return {
                id: `${group || "default"}-${index}-${input}`,
                name: input,
                value: input,
                group,
                disabled: false,
                searchText: input.toLowerCase()
            };
        }

        const extraSearch = input.search ? input.search.join(" ") : "";
        return {
            id: `${group || input.group || "default"}-${index}-${input.value}`,
            name: input.name,
            value: input.value,
            description: input.description,
            icon: input.icon,
            group: group ?? input.group ?? null,
            disabled: Boolean(input.disabled),
            searchText: `${input.name} ${input.value} ${input.description || ""} ${extraSearch}`.toLowerCase()
        };
    }

    const allGroups = $derived.by<DropdownGroup[]>(() => {
        if (groups?.length) {
            return groups.map((group, groupIndex) => ({
                label: group.label,
                separatorBefore: Boolean(group.separatorBefore && groupIndex > 0),
                options: group.options.map((option, optionIndex) => normalizeOption(option, optionIndex, group.label))
            }));
        }

        const grouped: Array<{label: string; options: DropdownOption[]}> = [];
        const ungrouped: DropdownOption[] = [];

        for (let i = 0; i < options.length; i++) {
            const option = normalizeOption(options[i], i, null);
            if (!option.group) {
                ungrouped.push(option);
                continue;
            }

            const existingGroup = grouped.find((entry) => entry.label === option.group);
            if (existingGroup) {
                existingGroup.options.push(option);
            }
            else {
                grouped.push({label: option.group, options: [option]});
            }
        }

        const output: DropdownGroup[] = [];
        if (ungrouped.length) {
            output.push({label: null, separatorBefore: false, options: ungrouped});
        }
        for (const group of grouped) {
            output.push({label: group.label, separatorBefore: output.length > 0, options: group.options});
        }

        return output;
    });

    const filteredGroups = $derived.by(() => {
        const normalizedQuery = query.trim().toLowerCase();
        if (!normalizedQuery) return allGroups;

        const output: DropdownGroup[] = [];
        for (const group of allGroups) {
            const matches = group.options.filter((option) => option.searchText.includes(normalizedQuery));
            if (!matches.length) continue;
            output.push({
                label: group.label,
                separatorBefore: group.separatorBefore,
                options: matches
            });
        }
        return output;
    });

    const visibleOptions = $derived.by(() => {
        const output: DropdownOption[] = [];
        for (const group of filteredGroups) {
            for (const option of group.options) output.push(option);
        }
        return output;
    });

    const selectedOption = $derived.by(() => {
        if (!value) return null;
        for (const group of allGroups) {
            const match = group.options.find((option) => option.value === value);
            if (match) return match;
        }
        return null;
    });

    // Close dropdown when clicking outside
    $effect(() => {
        if (!isOpen || !rootEl) return;

        const onPointerDown = (event: MouseEvent) => {
            const target = event.target as Node;
            const clickedTriggerRegion = rootEl?.contains(target);
            const clickedMenuRegion = menuEl?.contains(target);
            if (!clickedTriggerRegion && !clickedMenuRegion) {
                close();
            }
        };

        window.addEventListener("mousedown", onPointerDown);
        return () => window.removeEventListener("mousedown", onPointerDown);
    });

    // Focus search input when opening searchable dropdowns
    $effect(() => {
        if (!isOpen || !searchable) return;
        queueMicrotask(() => searchEl?.focus());
    });

    // Focus menu for keyboard navigation when opening non-searchable dropdowns
    $effect(() => {
        if (!isOpen || searchable) return;
        queueMicrotask(() => menuEl?.focus());
    });

    // Scroll highlighted option into view when it changes
    $effect(() => {
        if (!isOpen || !highlightedValue || !optionsContainerEl) return;
        const highlightedEl = optionsContainerEl.querySelector(`[data-option-value="${CSS.escape(highlightedValue)}"]`);
        if (highlightedEl) {
            highlightedEl.scrollIntoView({block: "nearest", behavior: "smooth"});
        }
    });

    // Scroll selected option into view when opening
    $effect(() => {
        if (!isOpen || !value || !optionsContainerEl) return;
        const container = optionsContainerEl;
        queueMicrotask(() => {
            const selectedEl = container.querySelector(`[data-option-value="${CSS.escape(value)}"]`);
            if (selectedEl) {
                selectedEl.scrollIntoView({block: "center", behavior: "instant"});
            }
        });
    });

    // Teleport menu to body to avoid overflow issues
    $effect(() => {
        if (!isOpen || !menuEl) return;

        document.body.appendChild(menuEl);

        return () => {
            if (menuEl && document.body.contains(menuEl)) {
                document.body.removeChild(menuEl);
            }
        };
    });

    // Positioning logic
    $effect(() => {
        if (!isOpen || !triggerEl) return;

        const updatePosition = () => {
            if (!triggerEl) return;
            const rect = triggerEl.getBoundingClientRect();
            menuPosition = {
                top: rect.bottom + 6,
                right: window.innerWidth - rect.right,
                minWidth: Math.max(230, rect.width)
            };
        };

        updatePosition();

        const handleScroll = () => updatePosition();
        const handleResize = () => updatePosition();
        window.addEventListener("scroll", handleScroll, true);
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("scroll", handleScroll, true);
            window.removeEventListener("resize", handleResize);
        };
    });

    function open() {
        if (disabled) return;
        isOpen = true;
        query = "";
        highlightedValue = selectedOption?.value ?? visibleOptions.find((option) => !option.disabled)?.value ?? null;
    }

    function close() {
        isOpen = false;
        query = "";
        highlightedValue = null;
    }

    function toggle() {
        if (isOpen) close();
        else open();
    }

    function commitChange(nextValue: string) {
        value = nextValue;
        if (change) change();
    }

    function selectOption(option: DropdownOption) {
        if (option.disabled) return;
        commitChange(option.value);
        close();
        triggerEl?.focus();
    }

    function clearSelection() {
        if (!allowEmpty) return;
        commitChange("");
        close();
        triggerEl?.focus();
    }

    function moveHighlight(direction: 1 | -1) {
        const available = visibleOptions.filter((option) => !option.disabled);
        if (!available.length) return;

        if (!highlightedValue) {
            highlightedValue = available[0].value;
            return;
        }

        const currentIndex = available.findIndex((option) => option.value === highlightedValue);
        const nextIndex = currentIndex === -1
            ? 0
            : (currentIndex + direction + available.length) % available.length;
        highlightedValue = available[nextIndex].value;
    }

    function handleTriggerKeydown(event: KeyboardEvent) {
        if (disabled) return;

        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            if (!isOpen) open();
            moveHighlight(event.key === "ArrowDown" ? 1 : -1);
            return;
        }

        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            if (!isOpen) open();
            return;
        }

        if (event.key === "Escape" && isOpen) {
            event.preventDefault();
            close();
        }
    }

    function handleMenuKeydown(event: KeyboardEvent) {
        if (!isOpen) return;

        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            moveHighlight(event.key === "ArrowDown" ? 1 : -1);
            return;
        }

        if (event.key === "Enter") {
            event.preventDefault();
            const highlighted = visibleOptions.find((option) => option.value === highlightedValue);
            if (highlighted) selectOption(highlighted);
            return;
        }

        if (event.key === "Escape") {
            event.preventDefault();
            close();
            triggerEl?.focus();
        }
    }
</script>

<div class="dropdown" bind:this={rootEl}>
    <button
        class="trigger"
        class:open={isOpen}
        class:empty={!selectedOption}
        class:disabled
        bind:this={triggerEl}
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={placeholder}
        onclick={toggle}
        onkeydown={handleTriggerKeydown}
    >
        <span class="value-wrap">
            {#if selectedOption?.icon}
                <span class="option-icon" aria-hidden="true">{selectedOption.icon}</span>
            {/if}
            <span class="value">{selectedOption ? selectedOption.name : placeholder}</span>
        </span>
        <span class="icon" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 15 5 5 5-5" /><path d="m7 9 5-5 5 5" /></svg>
        </span>
    </button>

    {#if isOpen}
        <div
            bind:this={menuEl}
            class="menu"
            role="listbox"
            tabindex="-1"
            style:top="{menuPosition.top}px"
            style:right="{menuPosition.right}px"
            style:min-width="{menuPosition.minWidth}px"
            onkeydown={handleMenuKeydown}
            transition:fly={{y: -6, duration: 120}}
        >
            {#if searchable}
                <div class="search-row" transition:scale={{duration: 80}}>
                    <input
                        bind:this={searchEl}
                        bind:value={query}
                        type="text"
                        placeholder="Search"
                    />
                </div>
            {/if}

            {#if allowEmpty}
                <button
                    class="clear"
                    type="button"
                    onclick={clearSelection}
                    disabled={!value}
                >
                    {emptyLabel}
                </button>
            {/if}

            <div class="options" bind:this={optionsContainerEl}>
                {#if visibleOptions.length === 0}
                    <div class="empty-results">{noResultsLabel}</div>
                {:else}
                    {#each filteredGroups as group, groupIndex (`${group.label ?? "ungrouped"}-${groupIndex}`)}
                        {#if group.separatorBefore && groupIndex !== 0}
                            <div class="separator" aria-hidden="true"></div>
                        {/if}

                        {#if group.label}
                            <div class="group-label">{group.label}</div>
                        {/if}

                        {#each group.options as option (option.id)}
                            <button
                                type="button"
                                class="option"
                                class:active={option.value === value}
                                class:highlighted={option.value === highlightedValue}
                                class:disabled={option.disabled}
                                role="option"
                                aria-selected={option.value === value}
                                data-option-value={option.value}
                                onclick={() => selectOption(option)}
                                onmousemove={() => {
                                    if (!option.disabled) highlightedValue = option.value;
                                }}
                            >
                                <div class="option-main" class:has-icon={Boolean(option.icon)}>
                                    <div class="option-title-row">
                                        {#if option.icon}
                                            <span class="option-icon" aria-hidden="true">{option.icon}</span>
                                        {/if}
                                        <span class="option-name">{option.name}</span>
                                    </div>
                                    {#if option.description}
                                        <span class="option-description">{option.description}</span>
                                    {/if}
                                </div>
                            </button>
                        {/each}
                    {/each}
                {/if}
            </div>
        </div>
    {/if}
</div>

<style>
    .dropdown {
        position: relative;
        /* min-width: 175px; */
        max-width: 320px;
        /* width: 100%; */
    }

    .trigger {
        appearance: none;
        background: var(--bg-level-2);
        border: 0;
        border-radius: var(--radius-level-5);
        color: inherit;
        min-height: 24px;
        padding: 2px 24px 2px 8px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
        text-align: left;
        transition: filter 100ms ease;
    }

    .trigger.empty {
        color: var(--font-color-muted);
    }

    .trigger.disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .trigger:focus-visible,
    .trigger.open {
        background: var(--bg-input-focus);
        outline: var(--border-input-focus);
    }

    .value-wrap {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        min-width: 0;
    }

    .value {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .icon {
        position: absolute;
        background: var(--bg-handle);
        height: 18px;
        width: 18px;
        border: 0;
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

    .menu {
        position: fixed;
        max-width: 380px;
        width: max-content;
        z-index: 9999;
        border-radius: var(--radius-level-3);
        border: 1px solid var(--border-level-2);
        background: color-mix(in srgb, var(--bg-level-2) 85%, black);
        backdrop-filter: blur(10px);
        box-shadow:
            0 8px 20px rgba(0, 0, 0, 0.45),
            0 0 0 1px rgba(255, 255, 255, 0.06) inset;
        padding: 8px;
    }

    .search-row {
        margin-bottom: 8px;
    }

    .search-row input {
        width: 100%;
        border: 1px solid var(--border-input);
        border-radius: var(--radius-level-5);
        background: var(--bg-level-3);
        color: inherit;
        padding: 6px 8px;
        outline: none;
    }

    .search-row input:focus {
        outline: var(--border-input-focus);
    }

    .clear {
        border: 0;
        border-radius: var(--radius-level-5);
        background: var(--bg-level-3);
        color: inherit;
        font-size: 0.8rem;
        width: 100%;
        text-align: left;
        padding: 5px 8px;
        margin-bottom: 8px;
        cursor: pointer;
    }

    .clear:disabled {
        opacity: 0.45;
        cursor: default;
    }

    .options {
        max-height: 280px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 3px;
        padding-right: 2px;
    }

    .group-label {
        font-size: 0.72rem;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        color: var(--font-color-muted);
        padding: 8px 8px 4px 8px;
    }

    .separator {
        height: 1px;
        background: var(--border-separator);
        margin: 5px 2px;
    }

    .option {
        width: 100%;
        border: 0;
        background: transparent;
        color: inherit;
        border-radius: var(--radius-level-5);
        text-align: left;
        padding: 7px 8px;
        cursor: pointer;
    }

    .option.highlighted {
        background: color-mix(in srgb, var(--color-selected) 45%, transparent);
    }

    .option.active {
        background: color-mix(in srgb, var(--color-selected) 70%, transparent);
    }

    .option.disabled {
        opacity: 0.35;
        cursor: not-allowed;
    }

    .option-main {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .option-title-row {
        display: inline-flex;
        align-items: center;
        gap: 7px;
    }

    .option-icon {
        width: 16px;
        text-align: center;
        flex-shrink: 0;
    }

    .option-name {
        line-height: 1.2;
    }

    .option-description {
        font-size: 0.8rem;
        color: var(--font-color-muted);
        line-height: 1.2;
    }

    .option-main.has-icon .option-description {
        margin-left: 23px;
    }

    .empty-results {
        color: var(--font-color-muted);
        padding: 8px;
        font-size: 0.85rem;
    }
</style>