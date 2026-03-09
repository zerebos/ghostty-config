<script lang="ts">
    import type {Snippet} from "svelte";
    import Button from "./Button.svelte";

    interface MenuItem {
        label: string;
        onclick: () => void | Promise<void>;
        disabled?: boolean;
    }

    interface Props {
        items: MenuItem[];
        visible?: boolean;
        onToggle?: () => void;
        buttonLabel?: string;
        buttonTitle?: string;
        buttonDisabled?: boolean;
        menuAriaLabel?: string;
        children?: Snippet;
    }

    const {
        items = [],
        visible = false,
        onToggle,
        buttonLabel = "More...",
        buttonTitle,
        buttonDisabled = false,
        menuAriaLabel = "Menu",
        children
    }: Props = $props();

    let container: HTMLDivElement | null = $state(null);

    function handleMenuItemClick(item: MenuItem) {
        void item.onclick();
    }
</script>

<div class="action-menu-wrapper" bind:this={container}>
    {#if children}
        {@render children()}
    {:else}
        <Button
            onclick={onToggle}
            title={buttonTitle}
            disabled={buttonDisabled}
        >
            {buttonLabel}
        </Button>
    {/if}

    {#if visible}
        <div class="action-menu" role="menu" aria-label={menuAriaLabel}>
            {#each items as item, i (i)}
                <button
                    type="button"
                    role="menuitem"
                    class="action-menu-item"
                    disabled={item.disabled}
                    onclick={() => handleMenuItemClick(item)}
                >
                    {item.label}
                </button>
            {/each}
        </div>
    {/if}
</div>

<style>
    .action-menu-wrapper {
        position: relative;
    }

    .action-menu {
        position: absolute;
        top: calc(100% + 8px);
        right: 0;
        min-width: 170px;
        border-radius: 12px;
        padding: 6px;
        display: flex;
        flex-direction: column;
        gap: 2px;
        z-index: 10;
        border: 1px solid rgba(255, 255, 255, 0.2);
        background: color-mix(in srgb, var(--bg-level-1) 84%, black);
        box-shadow:
            0 10px 28px rgba(0, 0, 0, 0.35),
            inset 0 1px 0 rgba(255, 255, 255, 0.12);
        backdrop-filter: blur(16px) saturate(120%);
    }

    .action-menu-item {
        appearance: none;
        border: 0;
        border-radius: 8px;
        background: transparent;
        color: var(--font-color);
        font: inherit;
        text-align: left;
        padding: 6px 10px;
        cursor: pointer;
    }

    .action-menu-item:disabled {
        cursor: not-allowed;
        opacity: 0.5;
    }

    .action-menu-item:not(:disabled):hover,
    .action-menu-item:not(:disabled):focus-visible {
        outline: none;
        background: color-mix(in srgb, var(--accent) 55%, transparent);
    }
</style>
