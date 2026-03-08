<script lang="ts">
    import {sequoiaFlyFast} from "$lib/utils/animations";
    import type {Snippet} from "svelte";
    import {fade, fly} from "svelte/transition";

    interface Props {
        title: string;
        ariaLabel?: string;
        onclose?: () => void;
        icon?: Snippet;
        footer?: Snippet;
        children: Snippet;
        maxWidth?: string;
    }

    const {
        title,
        ariaLabel = title,
        onclose,
        icon,
        footer,
        children,
        maxWidth = "480px"
    }: Props = $props();

    function handleBackdropClick(event: MouseEvent) {
        if (!onclose) return;
        if (event.target !== event.currentTarget) return;
        onclose();
    }
</script>

<div
    class="dialog-backdrop"
    role="presentation"
    onclick={handleBackdropClick}
    transition:fade={{duration: 250}}
>
    <div
        class="dialog"
        style:--dialog-max-width={maxWidth}
        transition:fly={sequoiaFlyFast}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        tabindex="-1"
    >
        <header class="dialog-header">
            {#if icon}
                <span class="dialog-icon" aria-hidden="true">
                    {@render icon()}
                </span>
            {/if}
            <h2>{title}</h2>
            {#if onclose}
                <button type="button" class="close-btn" onclick={onclose} aria-label="Dismiss">&times;</button>
            {/if}
        </header>

        <div class="dialog-body">
            {@render children()}
        </div>

        {#if footer}
            <footer class="dialog-footer">
                {@render footer()}
            </footer>
        {/if}
    </div>
</div>

<style>
.dialog-backdrop {
    position: absolute;
    inset: 0;
    background: rgba(18, 18, 18, 0.75);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    border-radius: var(--radius-level-1);
}

.dialog {
    background: var(--bg-modal);
    /* background: rgba(from var(--bg-modal) r g b / 0.7); */
    /* backdrop-filter: blur(20px); */
    border: 1px solid var(--border-level-3);
    border-radius: var(--radius-level-2);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
    width: 90%;
    max-width: var(--dialog-max-width);
    display: flex;
    flex-direction: column;
    max-height: 80%;
}

.dialog-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 20px 20px 12px;
}

.dialog-header h2 {
    flex: 1;
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0;
}

.dialog-icon {
    display: flex;
    align-items: center;
    color: var(--color-input-accent);
}

.close-btn {
    border: 0;
    background: transparent;
    box-shadow: none;
    font-size: 1.4rem;
    padding: 0 4px;
    line-height: 1;
    color: var(--font-color-muted);
    cursor: pointer;
}

.close-btn:hover {
    color: var(--font-color);
}

.dialog-body {
    padding: 0 20px 20px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.dialog-footer {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    padding: 20px;
    position: relative;
}

.dialog-footer::before {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 1px;
    background: var(--bg-level-3);
}
</style>
