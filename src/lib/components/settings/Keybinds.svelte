<script lang="ts">
    import Text from "./Text.svelte";

    let selected: number[] = $state([]);
    let {value = $bindable([])}: {value: string[]} = $props();

    function handleKeyPress(event: KeyboardEvent) {
        if (event.key === "Escape") selected = [];
        const shouldExpand = event.ctrlKey || event.shiftKey;
        if (!shouldExpand && selected.length) return;
        // if (event.key === "ArrowUp") console.log("up");
    }

    function select(index: number) {
        // selected = [index];
        return (event: MouseEvent) => {
            if (!event.ctrlKey) return selected = [index];
            if (!selected.includes(index)) return selected.push(index);
            selected.splice(selected.indexOf(index), 1);
        };
    }

    let scroller: HTMLDivElement;
    function addNew() {
        // console.log("ADD NEW");
        value = [...value, "="];
        setTimeout(() => scroller.scrollTop = scroller.scrollHeight, 1);
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


    function update(index: number, isAction: boolean = false) {
        return (event: Event) => {
            const current = value[index].split("=");
            const indexToUpdate = isAction ? 1 : 0;
            current[indexToUpdate] = (event.target as HTMLInputElement).value;
            value[index] = current.join("=");
        };
    }
</script>

<div class="expandable-list">
    <div class="item-list" bind:this={scroller}>
        {#each value as _, i (i)}
            <div class="keybind" class:selected={selected.includes(i)} onclick={select(i)} onkeypress={() => select(i)} role="option" tabindex="0" aria-selected={selected.includes(i)}>
                <Text value={value[i].split("=")[0]} blank={true} align="left" change={update(i)} />
                <Text value={value[i].split("=")[1]} blank={true} change={update(i, true)} />
            </div>
        {/each}
    </div>
    <div class="list-controls">
        <button onclick={addNew} type="button" title="Add Keybind">+</button>
        <button onclick={remove} disabled={selected.length === 0} type="button" title="Remove Selected">-</button>
    </div>
</div>

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
    background: rgba(255, 255, 255, 0.05)
}

.keybind.selected {
    background: #2457C9;
}

button {
    display: flex;
    justify-content: center;
    align-items: center;
    border: 0;
    background: transparent;
    color: var(--font-color);
    font-size: 1.5rem;
    position: relative;
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