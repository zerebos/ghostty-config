<script lang="ts">
    import {
        ACTION_DEFINITIONS,
        directionOptions,
        formatTrigger,
        parseKeybind,
        VALID_PREFIXES,
        VALID_MODIFIERS,
        KEY_NAMES
    } from "$lib/utils/keybinds";
    import {fade, fly, slide} from "svelte/transition";
    import Switch from "./Switch.svelte";
    import Group from "./Group.svelte";
    import Item from "./Item.svelte";
    import Dropdown from "./Dropdown.svelte";
    import Separator from "./Separator.svelte";
    import Number from "./Number.svelte";
    import Text from "./Text.svelte";
    import {get} from "svelte/store";

    interface Props {
        value?: string;
        mode?: "add" | "edit";
        onsave?: (value: string) => void;
        oncancel?: () => void;
    }

    const {value = "", mode = "add" as "add" | "edit", onsave, oncancel}: Props = $props();

    type Modifier = string;

    type Step = {
        key: string;
        modifiers: Modifier[];
    };

    const parsed = $derived.by(() => parseKeybind(value));
    let prefixes: string[] = $derived.by(() => {
        if (!parsed.trigger) return [];
        return [...parsed.trigger.prefixes];
    });
    let steps: Step[] = $derived.by(() => {
        if (!parsed.trigger) return [{key: "a", modifiers: []}];
        return parsed.trigger.steps.map((step) => ({
            key: step.key,
            modifiers: [...step.modifiers]
        }));
    });

    let actionName = $derived(parsed.action || ACTION_DEFINITIONS[0].name);
    let actionArg = $derived(parsed.args || "");
    let resizeDirection = $derived.by(() => {
        if (actionName !== "resize_split") return directionOptions[0];
        if (!parsed.args) return directionOptions[0];
        const [dir] = parsed.args.split(",").map((segment) => segment.trim());
        return dir || directionOptions[0];
    });
    let resizeAmount = $derived.by(() => {
        if (actionName !== "resize_split") return "";
        if (!parsed.args) return "";
        const [, amount] = parsed.args.split(",").map((segment) => segment.trim());
        return amount || "";
    });


    function togglePrefix(prefix: string) {
        if (prefixes.includes(prefix)) {
            prefixes = prefixes.filter((v) => v !== prefix);
        }
        else {
            prefixes = [...prefixes, prefix];
            if ((prefix === "global" || prefix === "all") && steps.length > 1) {
                steps = [steps[0]];
            }
        }
    }

    function toggleModifier(stepIndex: number, modifier: Modifier) {
        steps = steps.map((step, index) => {
            if (index !== stepIndex) return step;
            const nextModifiers = step.modifiers.includes(modifier)
                ? step.modifiers.filter((v) => v !== modifier)
                : [...step.modifiers, modifier];
            return {key: step.key, modifiers: nextModifiers};
        });
    }

    function updateStepKey(stepIndex: number, v: string) {
        const normalized = v.trim().toLowerCase();
        steps = steps.map((step, index) =>
            index === stepIndex ? {...step, key: normalized} : step
        );
    }

    function addSequenceStep() {
        if (steps.length >= 4) return;
        if (prefixes.includes("global") || prefixes.includes("all")) return;
        steps = [...steps, {key: "", modifiers: []}];
    }

    function removeSequenceStep(indexToRemove: number) {
        if (steps.length === 1) return;
        steps = steps.filter((_, index) => index !== indexToRemove);
    }

    const actionMap = Object.fromEntries(ACTION_DEFINITIONS.map((action) => [action.name, action]));

    function getCurrentAction() {
        return actionMap[actionName];
    }

    function getAllowEmpty() {
        const current = getCurrentAction();
        return current && "allowEmpty" in current ? Boolean(current.allowEmpty) : false;
    }

    function getComputedArg() {
        const currentAction = getCurrentAction();
        if (!currentAction) return actionArg;
        if (currentAction.type === "none") return "";
        if (currentAction.type === "resize") return `${resizeDirection},${resizeAmount}`;
        return actionArg;
    }

    function getTrigger() {
        return formatTrigger({prefixes: [...prefixes], steps});
    }

    function getPreview() {
        const trigger = getTrigger();
        const computedArg = getComputedArg();
        return `${trigger}=${actionName}${computedArg ? `:${computedArg}` : ""}`;
    }

    function getErrors() {
        return parseKeybind(getPreview()).error ?? [];
    }

    function handleSave() {
        if (getErrors().length) return;
        const v = getPreview();
        if (onsave) onsave(v);
    }

    function close() {
        if (oncancel) oncancel();
    }
</script>


<div class="editor" in:fly={{y: 30, duration: 200}}>
    <!-- <header>
        <h2>{mode === "edit" ? "Edit Keybind" : "Add Keybind"}</h2>
        <button class="ghost" type="button" aria-label="Close" onclick={close}>✕</button>
    </header> -->
    <main>
    <section class="section">
        <h3>Trigger</h3>
        <div class="prefix-row">
            {#each VALID_PREFIXES as prefix (prefix)}
                <label class:selected={prefixes.includes(prefix)}>
                    <input
                        type="checkbox"
                        checked={prefixes.includes(prefix)}
                        onchange={() => togglePrefix(prefix)}
                    />
                    <!-- <Switch checked={prefixes.includes(prefix)} onchange={() => togglePrefix(prefix)} /> -->
                    {prefix}
                </label>
            {/each}
        </div>
        <div class="sequence">
            {#each steps as step, index (index)}
                <div class="sequence-step" class:invalid={!step.key}>
                    <div class="modifiers">
                        {#each VALID_MODIFIERS as modifier (modifier)}
                            <button
                                type="button"
                                class:selected={step.modifiers.includes(modifier)}
                                onclick={() => toggleModifier(index, modifier)}
                            >
                                {modifier}
                            </button>
                        {/each}
                    </div>
                    <div class="key-entry">
                        <input
                            type="text"
                            placeholder="key"
                            bind:value={step.key}
                            list="key-options"
                            oninput={(event) => updateStepKey(index, event.currentTarget.value)}
                        />
                        <datalist id="key-options">
                            {#each KEY_NAMES as keyName (keyName)}
                                <option value={keyName}></option>
                            {/each}
                        </datalist>
                        <button
                            type="button"
                            class="remove"
                            onclick={() => removeSequenceStep(index)}
                            disabled={steps.length === 1}
                        >
                            –
                        </button>
                    </div>
                </div>
                {#if index < steps.length - 1}
                    <div class="sequence-arrow">→</div>
                {/if}
            {/each}
            <button
                class="add-step"
                type="button"
                onclick={addSequenceStep}
                disabled={prefixes.includes("global") || prefixes.includes("all")}
            >
                Add Step
            </button>
            {#if prefixes.includes("global") || prefixes.includes("all")}
                <div class="sequence-note">Global/all keybinds cannot be sequences.</div>
            {/if}
        </div>
    </section>
    <Group title="Action">
    <!-- <section class="section"> -->
        <!-- <h3>Action</h3> -->
         <Item name="Name" note="The action to perform when the keybind is triggered">
            <Dropdown
                bind:value={actionName}
                options={ACTION_DEFINITIONS.map((action) => ({
                    name: action.name,
                    value: action.name
                }))}
            />
        </Item>
        <!-- <div class="action-row"> -->
            <!-- <Item name="Type">
                <Dropdown
                    bind:value={actionName}
                    options={ACTION_DEFINITIONS.map((action) => ({
                        name: action.name,
                        value: action.name
                    }))}
                />
            </Item> -->
            <!-- <select bind:value={actionName}>
                {#each ACTION_DEFINITIONS as action (action.name)}
                    <option value={action.name}>{action.name}</option>
                {/each}
            </select> -->
            {#if getCurrentAction()?.type !== "none"}
            <Separator />
            <Item name="Argument" note="Optional argument for the action, format depends on the action type">
            {#if getCurrentAction()?.type === "enum"}
                <!-- <select bind:value={actionArg}>
                    <option value="">
                        {getAllowEmpty() ? "Default" : "Select value"}
                    </option>
                    {#each getCurrentAction()?.options ?? [] as option (option)}
                        <option value={option}>{option}</option>
                    {/each}
                </select> -->
                <Dropdown
                    bind:value={actionArg}
                    options={[
                        ...(getAllowEmpty() ? [{name: "Default", value: ""}] : []),
                        ...((getCurrentAction()?.options ?? []).map((option) => ({
                            name: option,
                            value: option
                        })) ?? [])
                    ]}
                />
            {:else if getCurrentAction()?.type === "number" || getCurrentAction()?.type === "integer"}
                <!-- <input type="number" bind:value={actionArg} placeholder="amount" /> -->
                <Number bind:value={() => parseInt(actionArg, 10), (v) => actionArg = v.toString()} />
            {:else if getCurrentAction()?.type === "resize"}
                <!-- <select bind:value={resizeDirection}>
                    {#each directionOptions as direction (direction)}
                        <option value={direction}>{direction}</option>
                    {/each}
                </select> -->
                <Dropdown
                    bind:value={resizeDirection}
                    options={directionOptions.map((direction) => ({
                        name: direction,
                        value: direction
                    }))}
                />
                <Number bind:value={() => parseInt(resizeAmount, 10), (v) => resizeAmount = v?.toString() || ""} min={0} step={1} />
                <!-- <input
                    type="number"
                    min="0"
                    step="1"
                    bind:value={resizeAmount}
                    placeholder="pixels"
                /> -->
            {:else if getCurrentAction()?.type === "text"}
                <!-- <input type="text" bind:value={actionArg} placeholder="Zig string literal" /> -->
                 <Text bind:value={actionArg} placeholder="Zig string literal" />
            {:else if getCurrentAction()?.type === "free"}
                <!-- <input type="text" bind:value={actionArg} placeholder="raw sequence" /> -->
                <Text bind:value={actionArg} placeholder="raw sequence" />
            {/if}
            </Item>
            {/if}
        <!-- </div> -->
    <!-- </section> -->
     </Group>
    <!-- <section class="section">
        <div class="preview-label">Preview</div>
        <div class="preview-box">{getPreview()}</div>
        {#if getErrors().length}
            <ul class="errors">
                {#each getErrors() as error (error)}
                    <li>{error}</li>
                {/each}
            </ul>
        {/if}
    </section> -->
    <Group title="Preview">
        <div class="preview-box">{getPreview()}</div>
        {#if getErrors().length}
            <ul class="errors">
                {#each getErrors() as error (error)}
                    <li>{error}</li>
                {/each}
            </ul>
        {/if}
    </Group>
    </main>
    <footer class="actions">
        <button type="button" class="ghost" onclick={close}>Cancel</button>
        <button
            type="button"
            class="primary"
            onclick={handleSave}
            disabled={getErrors().length > 0}
        >
            Save
        </button>
    </footer>
</div>


<style>
    .editor {
        width: 100%;
        flex: 1;
        /* padding: 20px 28px; */
        padding-bottom: 20px;
        display: flex;
        flex-direction: column;
    }

    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
    }

    header h2 {
        margin: 0;
        font-size: 1.2rem;
    }

    header button {
        border: none;
        background: none;
        color: var(--font-color);
        font-size: 1.15rem;
    }

    main {
        flex: 1;
    }

    .section {
        margin-bottom: 20px;
    }

    h3 {
        font-size: 1.05rem;
        font-weight: 600;
        margin-top: 20px;
    }

    .prefix-row {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        margin-bottom: 12px;
    }

    .prefix-row label {
        border-radius: var(--radius-level-4);
        border: 1px solid var(--border-level-3);
        padding: 6px 12px;
        font-size: 0.8rem;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 4px;
        background: var(--bg-level-2);
    }

    .prefix-row label.selected {
        background: rgba(255, 255, 255, 0.08);
        border-color: var(--accent-active);
    }

    .prefix-row input {
        width: 1rem;
        height: 1rem;
        display: none;
    }

    .sequence {
        display: flex;
        gap: 14px;
        flex-direction: column;
    }

    .sequence-step {
        display: grid;
        gap: 10px;
        background: var(--bg-level-2);
        border: 1px solid var(--border-level-3);
        border-radius: var(--radius-level-3);
        padding: 12px;
    }

    .sequence-step.invalid {
        border-color: rgba(255, 99, 71, 0.8);
        box-shadow: 0 0 0 1px rgba(255, 99, 71, 0.2);
    }

    .modifiers {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
    }

    .modifiers button {
        padding: 4px 8px;
        border-radius: var(--radius-level-4);
        border: 1px solid var(--border-level-3);
        background: transparent;
        color: var(--font-color);
        font-size: 0.75rem;
        cursor: pointer;
    }

    .modifiers button.selected {
        background: var(--accent-active);
        border-color: var(--accent-active);
        color: #fff;
    }

    .key-entry {
        display: flex;
        align-items: center;
        gap: 6px;
    }

    .key-entry input {
        color: var(--font-color);
        background: var(--bg-level-3);
        border: 1px solid var(--border-level-3);
        border-radius: var(--radius-level-4);
        padding: 10px 14px;
        flex: 1;
    }

    .key-entry input:focus {
        /* outline: none; */
        /* border-color: var(--accent-active); */
        outline: var(--border-input-focus);
        box-shadow: 0 0 0 1px var(--accent-active);
    }

    .key-entry .remove {
        border: none;
        border-radius: 50%;
        background: var(--bg-level-4);
        width: 30px;
        height: 30px;
    }

    .sequence-arrow {
        font-size: 1.25rem;
        text-align: center;
    }

    .add-step {
        align-self: flex-start;
        border-radius: 999px;
        border: 1px dashed var(--border-level-3);
        padding: 4px 12px;
        background: transparent;
        color: var(--font-color);
    }

    .add-step:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .sequence-note {
        font-size: 0.75rem;
        color: var(--font-muted);
    }

    .action-row {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
    }

    .action-row select,
    .action-row input {
        border-radius: var(--radius-level-3);
        border: 1px solid var(--border-level-3);
        background: var(--bg-level-2);
        color: var(--font-color);
        padding: 10px 12px;
        min-width: 120px;
    }

    .preview-label {
        font-size: 0.85rem;
        color: var(--font-muted);
        margin-bottom: 4px;
    }

    .preview-box {
        background: var(--bg-level-2);
        border-radius: 12px;
        padding: 12px;
        font-family: "SF Mono", "JetBrains Mono", monospace;
        font-size: 0.95rem;
    }

    .errors {
        margin-top: 8px;
        padding-left: 16px;
        color: #ff9b9b;
    }

    .actions {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
    }

    .actions button {
        padding: 4px 8px;
        border-radius: var(--radius-level-4);
        border: 1px solid var(--border-level-3);
        background: transparent;
        color: var(--font-color);
        cursor: pointer;
    }

    .ghost {
        background: transparent;
        border-color: var(--border-level-3);
    }

    .primary {
        background: var(--accent-active);
        color: #fff;
        border-color: transparent;
    }

    .primary:disabled {
        background: var(--color-danger);
        cursor: not-allowed;
    }
</style>
