<script lang="ts">
    import type {Snippet} from "svelte";
    import {fade, fly} from "svelte/transition";

    interface Props {
        title: string;
        iconSrc?: string;
        iconAlt?: string;
        onclose?: () => void;
        actions?: Snippet;
        children?: Snippet;
    }

    const {
        title,
        iconSrc,
        iconAlt = "Warning",
        onclose,
        actions,
        children
    }: Props = $props();

    function handleBackdropClick(event: MouseEvent) {
        if (!onclose) return;
        if (event.target !== event.currentTarget) return;
        onclose();
    }
</script>

<div
    class="alert-backdrop"
    role="presentation"
    onclick={handleBackdropClick}
    transition:fade={{duration: 200}}
>
    <div
        class="alert-card"
        transition:fly={{y: -30, duration: 200}}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabindex="-1"
    >
        <header class="alert-header">
            {#if iconSrc}
                <img src={iconSrc} alt={iconAlt} />
            {/if}
            <h3>{title}</h3>
        </header>

        {#if children}
            <div class="alert-body">{@render children()}</div>
        {/if}

        {#if actions}
            <footer class="alert-actions">{@render actions()}</footer>
        {/if}
    </div>
</div>

<style>
.alert-backdrop {
    position: absolute;
    inset: 0;
    background: rgba(18, 18, 18, 0.75);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
}

.alert-card {
    position: absolute;
    top: 30%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: rgba(from var(--bg-level-1) r g b / 0.7);
    backdrop-filter: blur(20px);
    border-radius: var(--radius-level-2);
    padding: 16px;
    width: min(90vw, 260px);
    border: 1px solid var(--border-level-1);
    box-shadow:
        0 0 20px -1px rgba(0, 0, 0, 0.7),
        0 0 1px white inset;
    /* gap: 26px; */
    z-index: 101;
}

.alert-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.alert-header img {
    width: 52px;
    height: 52px;
    margin: 26px;
}

.alert-header h3 {
    margin: 0 0 8px;
}

.alert-body {
    width: 100%;
    font-size: 0.9rem;
    color: var(--font-color-muted);
    line-height: 1.4;
    text-align: center;
    margin-top: 13px;
}

.alert-actions {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    gap: 10px;
    width: 100%;
    margin-top: 26px;
}

.alert-actions :global(button),
.alert-actions :global(button.primary) {
    flex: 1;
    padding: 6px 16px;
}
</style>
