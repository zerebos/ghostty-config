<script lang="ts">
    import KeybindEditor from "./KeybindEditor.svelte";
    import Text from "./Text.svelte";
    import settings from "$lib/data/settings";
    import {getDiagnostics} from "$lib/utils/keybinds";

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

    let scroller: HTMLDivElement;
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
            setTimeout(() => (scroller.scrollTop = scroller.scrollHeight), 1);
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

<div class="expandable-list">
    <div class="item-list" bind:this={scroller}>
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
    </div>
    <div class="list-controls">
        <button onclick={addNew} type="button" title="Add Keybind">+</button>
        <button
            onclick={editSelected}
            disabled={selected.length !== 1}
            type="button"
            title="Edit Selected"
        >
            Edit
        </button>
        <button
            onclick={remove}
            disabled={selected.length === 0}
            type="button"
            title="Remove Selected"
        >
            -
        </button>
        <button onclick={() => (showReset = true)} type="button" title="Reset Defaults">
            Reset
        </button>
    </div>
</div>

{#if showEditor}
    <KeybindEditor
        mode={editorMode}
        value={editorValue}
        onsave={handleSave}
        oncancel={handleCancel}
    />
{/if}

{#if showReset}
    <div class="reset-backdrop" role="dialog" aria-modal="true">
        <div class="reset-card">
            <h3>Reset keybinds?</h3>
            <p>This will restore all keybinds to their default values.</p>
            <div class="reset-actions">
                <button type="button" class="ghost" onclick={() => (showReset = false)}>
                    Cancel
                </button>
                <button type="button" class="primary" onclick={resetDefaults}>Reset</button>
            </div>
        </div>
    </div>
{/if}

<svelte:document onkeydown={handleKeyPress} />

<style>
    .expandable-list {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
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
        padding-left: 10px;
        gap: 10px;
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

    button {
        display: flex;
        justify-content: center;
        align-items: center;
        border: 0;
        background: transparent;
        color: var(--font-color);
        font-size: 1rem;
        position: relative;
    }

    button:first-child {
        font-size: 1.5rem;
    }

    .reset-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(18, 18, 18, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 40;
    }

    .reset-card {
        background: var(--bg-level-1);
        border-radius: 14px;
        padding: 20px 24px;
        width: min(90vw, 420px);
        box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4);
    }

    .reset-card h3 {
        margin: 0 0 8px;
    }

    .reset-card p {
        margin: 0 0 18px;
        color: var(--font-muted);
    }

    .reset-actions {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
    }

    .reset-actions button {
        padding: 8px 16px;
        border-radius: 10px;
        border: 1px solid var(--border-level-3);
    }

    .reset-actions .ghost {
        background: transparent;
    }

    .reset-actions .primary {
        background: var(--accent-active);
        color: #fff;
        border-color: transparent;
    }
    /*
button + button {
    margin-left: 2px;
} */

    button + button::before {
        content: "";
        position: absolute;
        left: -6px;
        top: 5px;
        bottom: 5px;
        background: var(--border-level-2);
        width: 2px;
    }

    button:disabled {
        opacity: 0.5;
    }
</style>
