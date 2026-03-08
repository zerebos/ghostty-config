<script lang="ts">
    import KeybindEditor from "./KeybindEditor.svelte";
    import Text from "./Text.svelte";
    import settings from "$lib/data/settings";
    import {confirm} from "$lib/stores/modals.svelte";
    import {getDiagnostics} from "$lib/utils/keybinds";
    import icon from "$lib/images/tabs/keybinds.webp";
    import {fly} from "svelte/transition";
    import Admonition from "../Admonition.svelte";

    let selected: number[] = $state([]);
    let {value = $bindable([])}: {value: string[]} = $props();
    let showEditor = $state(false);
    let editorMode = $state<"add" | "edit">("add");
    let editorValue = $state("");

    function handleKeyPress(event: KeyboardEvent) {
        if (event.key === "Escape") selected = [];
        const shouldExpand = event.ctrlKey || event.shiftKey;
        if (!shouldExpand && selected.length) return;
    }

    function select(index: number) {
        return (event: MouseEvent | KeyboardEvent) => {
            if (!event.ctrlKey) return (selected = [index]);
            if (!selected.includes(index)) return selected.push(index);
            selected.splice(selected.indexOf(index), 1);
        };
    }

    // This saves the scroll position when opening the editor and restores
    // it when closing, so that the list doesn't jump around
    let scroller: HTMLDivElement | undefined = $state();
    let scrollPosition = $state(0);

    function onScroll(event: Event) {
        scrollPosition = (event.target as HTMLDivElement).scrollTop;
    }

    // This does the actual restoring of position
    // Could also technically use the save/cancel events too
    $effect(() => {
        if (!showEditor && scroller) {
            scroller.scrollTop = scrollPosition;
        }
    });

    function addNew() {
        editorMode = "add";
        editorValue = "";
        showEditor = true;
    }

    function editSelected() {
        if (selected.length !== 1) return;
        editorMode = "edit";
        editorValue = value[selected[0]];
        showEditor = true;
    }

    function remove() {
        value = value.filter((v, i) => {
            const shouldRemove = selected.includes(i);
            return !shouldRemove;
        });
        selected = [];
    }

    const defaultKeybinds = (() => {
        const panel = settings.find((entry) => entry.id === "keybinds");
        const group = panel?.groups.find((entry) => entry.id === "keybinds");
        const setting = group?.settings.find((entry) => entry.type === "keybinds");
        return (setting?.value as string[]) ?? [];
    })();

    function resetDefaults() {
        value = [...defaultKeybinds];
        selected = [];
        if (scroller) scroller.scrollTop = 0;
    }

    async function requestResetDefaults() {
        const shouldReset = await confirm({
            title: "Are you sure?",
            message: "This will reset all keybinds to their defaults.",
            confirmText: "Reset Keybinds",
            cancelText: "Cancel",
            iconSrc: icon
        });

        if (shouldReset) resetDefaults();
    }

    function update(index: number, isAction: boolean = false) {
        return (event: Event) => {
            const current = value[index].split("=");
            const indexToUpdate = isAction ? 1 : 0;
            current[indexToUpdate] = (event.target as HTMLInputElement).value;
            value[index] = current.join("=");
        };
    }

    function handleSave(detail: string) {
        if (editorMode === "add") {
            value = [...value, detail];

            // Queue up scrolling to the bottom where the new item is added
            setTimeout(() => {
                if (scroller) scroller.scrollTop = scroller.scrollHeight;
            }, 1);
        }
        else if (selected.length === 1) {
            value[selected[0]] = detail;
        }
        showEditor = false;
    }

    function handleCancel() {
        showEditor = false;
    }

    const diagnostics = $derived.by(() => getDiagnostics(value));
</script>


{#if showEditor}
    <KeybindEditor
        value={editorValue}
        onsave={handleSave}
        oncancel={handleCancel}
    />
{:else}
    <Admonition>
        If you're not familiar with keybinds, refer to <a href="https://ghostty.org/docs/config/keybind">the documentation</a>.
    </Admonition>
<div class="expandable-list" in:fly={{y: 30, duration: 200}}>
    <div class="item-list" bind:this={scroller} onscroll={onScroll}>
        {#each value as _, i (i)}
            <div
                class="keybind"
                class:selected={selected.includes(i)}
                class:invalid={diagnostics[i]?.status === "invalid"}
                class:duplicate={diagnostics[i]?.duplicate}
                onclick={select(i)}
                onkeypress={select(i)}
                role="option"
                tabindex="0"
                aria-selected={selected.includes(i)}
            >
                <Text value={value[i].split("=")[0]} blank={true} align="left" change={update(i)} />
                <Text value={value[i].split("=")[1]} blank={true} change={update(i, true)} />
            </div>
        {/each}
    </div>
    <div class="list-controls">
        <button onclick={addNew} type="button" title="Add Keybind">&plus;</button>
        <button onclick={remove} disabled={selected.length === 0} type="button" title="Remove Selected">&ndash;</button>
        <button onclick={editSelected} disabled={selected.length !== 1} type="button" title="Edit Selected">
           <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 56 56"><path fill="currentColor" d="m43.293 16.926l2.367-2.32c1.196-1.196 1.242-2.485.188-3.563l-.797-.797c-1.055-1.055-2.344-.937-3.54.211l-2.367 2.344ZM15.66 44.488l25.57-25.547l-4.101-4.125l-25.594 25.57L9.31 45.59c-.211.562.375 1.219.937.984Z" /></svg>
        </button>
        <div class="list-controls-spacer"></div>
        <button onclick={requestResetDefaults} type="button" title="Reset Defaults">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 5H3" /><path d="M7 12H3" /><path d="M7 19H3" /><path d="M12 18a5 5 0 0 0 9-3 4.5 4.5 0 0 0-4.5-4.5c-1.33 0-2.54.54-3.41 1.41L11 14" /><path d="M11 10v4h4" /></svg>
        </button>
    </div>
</div>
{/if}

<svelte:document onkeydown={handleKeyPress} />

<style>
    .expandable-list {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        position: relative;
        background: var(--bg-level-2);
        border-radius: var(--radius-level-3);
        border: 1px solid var(--border-level-2);
        overflow: hidden;
    }

    .list-controls {
        border-radius: 0 0 var(--radius-level-3) var(--radius-level-3);
        background: var(--bg-level-4);
        min-height: 30px;
        max-height: 30px;
        border-top: 2px solid var(--border-level-4);
        display: flex;
        align-items: center;
        padding: 0 10px;
        gap: 10px;
    }

    .list-controls-spacer {
        flex: 1;
    }

    .item-list {
        display: flex;
        flex-direction: column;
        overflow-y: auto;
    }

    .keybind {
        display: flex;
        justify-content: space-between;
        padding: 8px;
    }

    .keybind:nth-of-type(even) {
        background: rgba(255, 255, 255, 0.05);
    }

    .keybind.selected {
        background: #2457c9;
    }

    .keybind.duplicate {
        box-shadow: inset 4px 0 0 rgba(255, 196, 70, 0.7);
        background: rgba(255, 196, 70, 0.08);
    }

    .keybind.invalid {
        box-shadow: inset 4px 0 0 rgba(255, 106, 106, 0.8);
        background: rgba(255, 90, 90, 0.12);
    }

    .list-controls button {
        display: flex;
        justify-content: center;
        align-items: center;
        border: 0;
        background: transparent;
        color: var(--font-color);
        font-size: 1rem;
        position: relative;
        cursor: pointer;
    }

    .list-controls button:first-child {
        font-size: 1.5rem;
    }

    .list-controls button + button::before {
        content: "";
        position: absolute;
        left: -6px;
        top: 5px;
        bottom: 5px;
        background: var(--border-level-2);
        width: 2px;
    }

    .list-controls button:disabled {
        opacity: 0.5;
    }
</style>
