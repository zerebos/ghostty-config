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
    import {createTooltipAttachment} from "$lib/attachments/tooltip";
    import {fly, scale} from "svelte/transition";
    import Group from "./Group.svelte";
    import Item from "./Item.svelte";
    import Dropdown from "./Dropdown.svelte";
    import Separator from "./Separator.svelte";
    import Number from "./Number.svelte";
    import Text from "./Text.svelte";
    import Checkbox from "./Checkbox.svelte";

    interface Props {
        value?: string;
        onsave?: (value: string) => void;
        oncancel?: () => void;
    }

    const {value = "", onsave, oncancel}: Props = $props();

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
    const dropdownOptions = $derived.by(() => {
        const currentAction = getCurrentAction();
        if (!currentAction || currentAction.type !== "enum") return [];
        const options = [];
        if (getAllowEmpty()) options.push({name: "default", value: ""});
        if (currentAction.options) {
            options.push(...currentAction.options.map((option) => ({name: option, value: option})));
        }
        return options;
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

    function actionChanged() {
        actionArg = "";
        resizeDirection = directionOptions[0];
        resizeAmount = "";
    }

    const hasGlobalOrAllPrefix = $derived(prefixes.includes("global") || prefixes.includes("all"));
    const hasMaxSequenceSteps = $derived(steps.length >= 4);
    const isAddStepDisabled = $derived(hasGlobalOrAllPrefix || hasMaxSequenceSteps);

    function getAddStepTooltipMessage() {
        if (hasGlobalOrAllPrefix) return "Global/all keybinds cannot be sequences";
        if (hasMaxSequenceSteps) return "Maximum of 4 sequence steps";
        return "Add sequence step";
    }

    const addStepTooltipAttachment = createTooltipAttachment(getAddStepTooltipMessage);
</script>


<div class="editor" in:fly={{y: 30, duration: 200}}>
    <main>
    <!-- <Admonition>
        <p>Use this editor to create or edit a keybind. A keybind consists of an optional prefix, a trigger sequence, and an action.</p>
        <p><strong>Prefixes</strong> modify when the keybind is active, for example "global" means it will trigger regardless of which application is focused. Multiple prefixes can be combined for more specific behavior.</p>
        <p>The <strong>trigger sequence</strong> is the combination of keys that must be pressed to activate the keybind. It can be a single key or a sequence of up to 4 steps. Each step can have optional modifiers like Ctrl or Shift.</p>
        <p>The <strong>action</strong> is what happens when the keybind is triggered. There are various actions available, some of which may require additional arguments.</p>
    </Admonition> -->
    <Group>
        <Item name="Prefixes">
            <div class="prefix-row">
                {#each VALID_PREFIXES as prefix (prefix)}
                    <label class:selected={prefixes.includes(prefix)}>
                        <Checkbox checked={prefixes.includes(prefix)} onchange={() => togglePrefix(prefix)} />
                        {prefix}
                    </label>
                {/each}
            </div>
        </Item>
    </Group>
    <Group title="Trigger" borderless>
        <div class="sequence">
            <datalist id="key-options">
                {#each KEY_NAMES as keyName (keyName)}
                    <option value={keyName}></option>
                {/each}
            </datalist>
            {#each steps as step, index (index)}
                <div class="sequence-step" class:invalid={!step.key}>
                    {#if steps.length > 1}
                        <button transition:scale={{duration: 200}} type="button" class="remove" onclick={() => removeSequenceStep(index)} disabled={steps.length === 1}>
                            &times;
                        </button>
                    {/if}

                    <Item name={steps.length > 1 ? `Key Name ${index + 1}` : "Key Name"} note={steps.length > 1 ? `The key to use for step ${index + 1} in the sequence.` : "The key to use for this action."}>
                        <div class="key-entry">
                            <input
                                type="text"
                                placeholder="key"
                                bind:value={step.key}
                                list="key-options"
                                oninput={(event) => updateStepKey(index, event.currentTarget.value)}
                            />
                        </div>
                    </Item>
                    <Separator />
                    <!-- <Item name="Modifiers" note={steps.length > 1 ? `Optional modifiers for step ${index + 1}.` : "Optional modifiers that must be held for this trigger."}> -->
                     <Item name="Modifiers">
                        <div class="modifiers">
                            {#each VALID_MODIFIERS as modifier (modifier)}
                                <label class:selected={step.modifiers.includes(modifier)}>
                                    <Checkbox checked={step.modifiers.includes(modifier)} onchange={() => toggleModifier(index, modifier)} />
                                    <span>{modifier}</span>
                                </label>
                            {/each}
                        </div>
                    </Item>
                </div>
                {#if index < steps.length - 1}
                    <div class="sequence-arrow">→</div>
                {/if}
            {/each}
            <button
                class="add-step"
                type="button"
                onclick={addSequenceStep}
                disabled={isAddStepDisabled}
                {@attach addStepTooltipAttachment}
            >
                <!-- Add Step -->
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
            </button>
        </div>
    </Group>
    <Group title="Action">
        <Item name="Name" note="The action to perform when the keybind is triggered.">
            <Dropdown
                bind:value={actionName}
                options={ACTION_DEFINITIONS.map((action) => ({
                    name: action.name,
                    value: action.name
                }))}
                change={actionChanged}
            />
        </Item>

        {#if getCurrentAction()?.type !== "none"}
            <Separator />
            <Item name="Argument" note="Optional argument for the action, format depends on the action type.">
            {#if getCurrentAction()?.type === "enum"}
                <Dropdown bind:value={actionArg} options={dropdownOptions} />
            {:else if getCurrentAction()?.type === "number" || getCurrentAction()?.type === "integer"}
                <Number bind:value={() => parseInt(actionArg, 10), (v: number) => actionArg = v?.toString()} />
            {:else if getCurrentAction()?.type === "resize"}
                <!-- TODO: should these be split to separate rows? -->
                <Dropdown
                    bind:value={resizeDirection}
                    options={directionOptions.map((direction) => ({
                        name: direction,
                        value: direction
                    }))}
                />
                <Number bind:value={() => parseInt(resizeAmount, 10), (v: number) => resizeAmount = v?.toString()} min={0} step={1} placeholder="pixels" />
            {:else if getCurrentAction()?.type === "text"}
                <Text bind:value={actionArg} placeholder="Zig string literal" />
            {:else if getCurrentAction()?.type === "free"}
                <Text bind:value={actionArg} placeholder="raw sequence" />
            {/if}
            </Item>
        {/if}
     </Group>
    <Group title="Result" borderless>
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
    <div class="actions">
        <button type="button" onclick={close}>Cancel</button>
        <button
            type="button"
            class="primary"
            onclick={handleSave}
            disabled={getErrors().length > 0}
        >
            Done
        </button>
    </div>
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

    main {
        flex: 1;
        padding-bottom: 25px;
    }

    .prefix-row {
        display: flex;
        gap: 16px;
        flex-wrap: wrap;
        /* margin-bottom: 12px; */
        /* justify-content: space-between; */
    }

    .prefix-row label {
        border-radius: var(--radius-level-4);
        /* border: 1px solid var(--border-level-3); */
        /* padding: 6px 12px; */
        font-size: 0.8rem;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: var(--bg-level-2);
    }

    .prefix-row label.selected {
        /* background: rgba(255, 255, 255, 0.08); */
        /* background: var(--color-selected); */
        /* border-color: var(--color-selected); */
    }

    .sequence {
        display: flex;
        gap: 14px;
        flex-direction: column;
    }

    .sequence-step {
        display: grid;
        /* gap: 10px; */
        background: var(--bg-level-2);
        border: 1px solid var(--border-level-3);
        border-radius: var(--radius-level-3);
        padding: 12px;
        position: relative;
    }

    .sequence-step.invalid {
        border-color: rgba(255, 99, 71, 0.8);
        box-shadow: 0 0 0 1px rgba(255, 99, 71, 0.2);
    }

    .modifiers {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
        /* justify-content: space-evenly; */
    }

    .modifiers label {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        color: var(--font-color);
        font-size: 0.75rem;
        cursor: pointer;
    }

    .key-entry {
        display: flex;
        align-items: center;
        gap: 6px;
    }

    .key-entry input {
        /* color: var(--font-color);
        background: var(--bg-level-3);
        border: 1px solid var(--border-level-3);
        border-radius: var(--radius-level-4);
        padding: 10px 14px;
        flex: 1; */
        /* background: var(--bg-level-2); */
        background: rgba(0, 0, 0, 0.15);
        border: 1px solid var(--border-input);
        border-radius: var(--radius-level-5);
        outline: none;
        color: inherit;
        text-align: right;
        max-width: 150px;
        /* padding: 4px 8px 4px 4px; */
        padding: 2px 8px 2px 0;
    }

    .key-entry input:focus {
        /* outline: none; */
        /* border-color: var(--accent-active); */
        background:var(--bg-input-focus);
        outline: var(--border-input-focus);
    }

    .sequence-step .remove {
        background: var(--color-danger);
        color: white;
        position: absolute;
        top: -6px;
        right: -6px;
        border-radius: 50%;
        height: 16px;
        width: 16px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 0.8rem;
        padding: 0;
        cursor: pointer;
        border: 0;
        outline: 0;
    }

    .sequence-arrow {
        font-size: 1.25rem;
        text-align: center;
    }

    .add-step {
        align-self: center;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 999px;
        border: 1px dashed var(--border-level-3);
        padding: 4px;
        background: transparent;
        color: var(--font-color);
        cursor: pointer;
    }

    .add-step:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .preview-box {
        background: var(--config-bg);
        font-family: var(--config-font-family);
        font-size: var(--config-font-size);
        color: var(--config-fg);
        max-height: 200px;
        overflow-y: auto;
        padding: 8px;
        border-radius: var(--radius-level-3);
        border: 1px solid rgba(0, 0, 0, 0.5);
        box-shadow: 0 0 1px rgba(255, 255, 255, 0.5) inset;
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
        margin-top: 20px;
    }

    .actions button {
        padding: 4px 12px;
        border-radius: var(--radius-level-4);
        border: 0;
        font-weight: 500;
        /* font-size: 14px; */
        /* height: 28px; */
        /* height: 24px; */

        /* border: 1px solid var(--border-level-2); */
        /* box-shadow: inset 0px 2px 2px -3px white; */
        box-shadow:
            0px 0px 1px 0px #000000,
            inset 0px 3px 1px -3px rgba(255, 255, 255, 0.65);

        /* border: 1px solid rgba(0,0,0,0.55);
        height: 28px;
        padding: 0 14px;
        border-radius: 6px;
        font-size: 13px;
        font-weight: 400;
        letter-spacing: -0.01em; */

        /* Outer glow / halo — the bright top edge */
        /* top inner highlight, bottom inner shadow, subtle outer drop shadow, faint outer glow */
        /* box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.12),
            inset 0 -1px 0 rgba(0,0,0,0.25),
            0 1px 2px rgba(0,0,0,0.5),
            0 0 0 0.5px rgba(255,255,255,0.04); */

        /* box-shadow:
            0 1px 0px rgba(0, 0, 0, 0.6),

            inset 0 0 0 1px rgba(255, 255, 255, 0.15),

            inset 0 0 0 0px rgba(0, 0, 0, 0.6); */
        /* background: #5D595C; */
        /* background: #514F56; */
        background: #59575C;
        color: var(--font-color);
        cursor: pointer;
        position: relative;

        display: flex;
        justify-content: center;
        align-items: center;
    }

    .actions button.primary {
        /* background:  #2f80f5; */
        /* background: #3B6CD3; */
        /* background: linear-gradient(0deg, #3665C3, #3D72DF); */
        background: linear-gradient(0deg, #3C6EC9, #437AE2);
        color: #fff;
        /* border: 1px solid rgba(0,0,0,0.35); */
        border: 0;
        padding: 0 20px;

        /* box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.25),
            inset 0 -1px 0 rgba(0,0,0,0.2),
            0 1px 3px rgba(0,0,0,0.45),
            0 0 6px rgba(30,130,255,0.35); */
    }

    .actions button.primary:disabled {
        /* background: var(--color-danger); */
        cursor: not-allowed;
        filter: brightness(0.6);
    }

    .actions button:active {
        filter: brightness(1.2);
    }
</style>
