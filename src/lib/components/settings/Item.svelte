<script lang="ts">
    import type {Snippet} from "svelte";
    import {createTooltipAttachment} from "$lib/attachments/tooltip";

    interface Props {
        name?: string;
        note?: string;
        children: Snippet;
        onReset?: () => void;
        isNonDefault?: boolean;
    }

    const {name = "", note = "", children, onReset, isNonDefault = false}: Props = $props();
    const tooltipAttachment = createTooltipAttachment("Reset to default");
</script>

<div class="setting-item">
    <div class="row">
        {#if name}
        <div class="setting-name-wrapper">
            <div class="setting-name">{name}</div>
            {#if isNonDefault && onReset}
            <div class="reset-button-wrapper">
                <button
                    class="reset-button"
                    onclick={onReset}
                    title="Reset to default"
                    type="button"
                    {@attach tooltipAttachment}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M9 14 4 9l5-5" />
                        <path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11" />
                    </svg>
                </button>
            </div>
            {/if}
        </div>
        {/if}
        <div class="setting">{@render children()}</div>
    </div>
    {#if note}
    <div class="note">
        {note}
    </div>
    {/if}
</div>


<style>
.setting-item {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.setting-item .row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}

.setting-name-wrapper {
    display: flex;
    align-items: center;
    gap: 6px;
}

.setting-name {
    font-weight: 500;
}

.reset-button-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

.reset-button {
    background: none;
    border: none;
    /* padding: 4px; */
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-level-5);
    color: var(--font-color-muted);
    transition: all 150ms cubic-bezier(0.2, 0, 0.38, 0.9);
    outline: none;
}

.reset-button:focus-visible {
    outline: var(--border-input-focus);
}

.reset-button:hover {
    background-color: var(--bg-level-2);
    color: var(--font-color);
}

.reset-button:active {
    transform: scale(0.95);
}

.reset-button svg {
    width: 14px;
    height: 14px;
    stroke-width: 2.5;
}

.setting {
    display: flex;
    flex: 1;
    justify-content: flex-end;
}

.note {
    color: var(--font-color-muted);
    font-size: 0.9rem;
}
</style>