<script lang="ts">
    import KeybindEditor from "./KeybindEditor.svelte";
    import Text from "./Text.svelte";
    import settings from "$lib/data/settings";
    import {getDiagnostics} from "$lib/utils/keybinds";
    import icon from "$lib/images/tabs/keybinds.webp";
    import {fade, fly} from "svelte/transition";

    let selected: number[] = $state([]);
    let {value = $bindable([])}: {value: string[]} = $props();
    let showEditor = $state(false);
    let editorMode = $state<"add" | "edit">("add");
    let editorValue = $state("");
    let showReset = $state(false);

    function handleKeyPress(event: KeyboardEvent) {
        if (event.key === "Escape") selected = [];
        const shouldExpand = event.ctrlKey || event.shiftKey;
        if (!shouldExpand && selected.length) return;
        // if (event.key === "ArrowUp") console.log("up");
    }

    function select(index: number) {
        // selected = [index];
        return (event: MouseEvent) => {
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
        // console.log(selected.map(i => i));
        // console.log(value.map(v => v));
        value = value.filter((v, i) => {
            const shouldRemove = selected.includes(i);
            // console.log(`Filtering ${v} ${i} ${shouldRemove}`);
            return !shouldRemove;
        });
        // console.log(value.map(v => v));
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
        showReset = false;
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
<div class="expandable-list" in:fly={{y: 30, duration: 200}}>
    <div class="item-list" bind:this={scroller} onscroll={onScroll}>
        {#each value as _, i (i)}
            <div
                class="keybind"
                class:selected={selected.includes(i)}
                class:invalid={diagnostics[i]?.status === "invalid"}
                class:duplicate={diagnostics[i]?.duplicate}
                onclick={select(i)}
                onkeypress={() => select(i)}
                role="option"
                tabindex="0"
                aria-selected={selected.includes(i)}
            >
                <Text value={value[i].split("=")[0]} blank={true} align="left" change={update(i)} />
                <Text value={value[i].split("=")[1]} blank={true} change={update(i, true)} />
            </div>
        {/each}
        <!-- {/if} -->
    </div>
    <div class="list-controls">
        <button onclick={addNew} type="button" title="Add Keybind">&plus;</button>
        <button onclick={remove} disabled={selected.length === 0} type="button" title="Remove Selected">&ndash;</button>
        <button onclick={editSelected} disabled={selected.length !== 1} type="button" title="Edit Selected">
            <!-- ✎ -->
            <!-- <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" /></svg> -->
            <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 56 56"><path fill="currentColor" d="m43.293 16.926l2.367-2.32c1.196-1.196 1.242-2.485.188-3.563l-.797-.797c-1.055-1.055-2.344-.937-3.54.211l-2.367 2.344ZM15.66 44.488l25.57-25.547l-4.101-4.125l-25.594 25.57L9.31 45.59c-.211.562.375 1.219.937.984Z" /></svg>
        </button>
        <div class="list-controls-spacer"></div>
        <button onclick={() => (showReset = true)} type="button" title="Reset Defaults">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 5H3" /><path d="M7 12H3" /><path d="M7 19H3" /><path d="M12 18a5 5 0 0 0 9-3 4.5 4.5 0 0 0-4.5-4.5c-1.33 0-2.54.54-3.41 1.41L11 14" /><path d="M11 10v4h4" /></svg>
        </button>
    </div>
</div>
{/if}

{#if showReset}
    <div class="reset-backdrop" role="dialog" aria-modal="true" transition:fade={{duration: 200}}></div>
        <div class="reset-card" transition:fly={{y: 30, duration: 200}}>
            <header>
                <img src={icon} alt="Warning" />
                <h3>Are you sure?</h3>
            </header>
            <!-- <p>This will restore all keybinds to their default values.</p> -->
            <footer class="reset-actions">
                <button type="button" class="primary" onclick={resetDefaults}>Reset Keybinds</button>
                <button type="button" onclick={() => (showReset = false)}>
                    Cancel
                </button>
            </footer>
        </div>
    <!-- </div> -->
{/if}

<svelte:document onkeydown={handleKeyPress} />

<style>
    .expandable-list {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        /* height: 100%; */
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

    .reset-backdrop {
        position: absolute;
        inset: 0;
        background: rgba(18, 18, 18, 0.75);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 100;
    }

    .reset-card {
        position: absolute;
        top: 30%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: var(--bg-level-1);
        border-radius: 14px;
        padding: 20px 24px;
        width: min(90vw, 260px);
        box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4);
        gap: 24px;
        z-index: 101;
        /* box-sizing: content-box; */
    }

    .reset-card header {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 24px;
    }

    .reset-card header img {
        width: 60px;
        height: 60px;
    }

    .reset-card h3 {
        margin: 0 0 8px;
    }

    /* .reset-card p {
        margin: 0 0 18px;
        color: var(--font-muted);
    } */

    .reset-actions {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        gap: 10px;
        width: 100%;
    }

    .reset-actions button {
        padding: 8px 16px;
        border-radius: 10px;
        /* border: 1px solid var(--border-level-3); */
        border: 0;
        background: #818282;
        flex: 1;
        color: var(--font-color);
        cursor: pointer;
    }

    .reset-actions .primary {
        background: var(--color-danger);
        /* border-color: transparent; */
    }
    /*
.list-controls button + button {
    margin-left: 2px;
} */

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
