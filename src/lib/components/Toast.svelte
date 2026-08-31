<script lang="ts">
    import {dismissToast, type ToastAction} from "$lib/stores/toasts.svelte";
    import {sequoiaEase} from "$lib/utils/animations";
    import {fly} from "svelte/transition";

    interface Props {
        id: string;
        type: "success" | "error";
        message: string;
        action?: ToastAction;
    }

    const {id, type, message, action}: Props = $props();

    function handleDismiss() {
        dismissToast(id);
    }

    function handleAction() {
        action?.onClick();
        dismissToast(id);
    }

</script>

<!-- eslint-disable-next-line svelte/no-unused-class-name -->
<div class="toast-container toast-{type}" role="status" aria-live="polite" transition:fly={{y: -44, duration: 300, easing: sequoiaEase}}>
    <button type="button" class="toast" onclick={handleDismiss}>
        <div class="toast-icon">
            {#if type === "success"}
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM8 15L3 10L4.41 8.59L8 12.17L15.59 4.58L17 6L8 15Z"
                        fill="currentColor"
                    />
                </svg>
            {:else}
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V13H11V15ZM11 11H9V5H11V11Z"
                        fill="currentColor"
                    />
                </svg>
            {/if}
        </div>
        <div class="toast-message">{message}</div>
    </button>
    {#if action}
        <button type="button" class="toast-action" onclick={handleAction}>{action.label}</button>
    {/if}
</div>

<style>
    .toast-container {
        display: flex;
        align-items: stretch;
        min-width: 280px;
        max-width: 400px;
        border-radius: var(--radius-level-3);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        box-shadow:
            0 4px 16px rgba(0, 0, 0, 0.3),
            0 0 0 1px rgba(255, 255, 255, 0.1) inset,
            0 1px 2px rgba(0, 0, 0, 0.5);
        transition: all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1);
        color: #ffffff;
    }

    .toast-container:hover {
        transform: translateY(-2px);
        box-shadow:
            0 6px 20px rgba(0, 0, 0, 0.35),
            0 0 0 1px rgba(255, 255, 255, 0.15) inset,
            0 1px 2px rgba(0, 0, 0, 0.5);
    }

    .toast-container:focus-within {
        box-shadow:
            0 6px 20px rgba(0, 0, 0, 0.35),
            0 0 0 2px var(--color-input-accent),
            0 1px 2px rgba(0, 0, 0, 0.5);
    }

    .toast {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        flex: 1;
        min-width: 0;
        border: none;
        border-radius: inherit;
        background: transparent;
        color: inherit;
        cursor: pointer;
        font-family: inherit;
        text-align: left;
    }

    .toast:focus {
        outline: none;
    }

    .toast-action {
        flex-shrink: 0;
        border: none;
        border-left: 1px solid rgba(255, 255, 255, 0.25);
        border-radius: 0 var(--radius-level-3) var(--radius-level-3) 0;
        /* background: rgba(255, 255, 255, 0.12); */
        background: transparent;
        color: inherit;
        cursor: pointer;
        padding: 0 16px;
        font-family: inherit;
        font-size: 14px;
        font-weight: 600;
        letter-spacing: -0.01em;
    }

    .toast-action:hover {
        background: rgba(255, 255, 255, 0.22);
    }

    .toast-action:focus {
        outline: none;
    }

    .toast-success {
        background: linear-gradient(
            135deg,
            rgba(52, 199, 89, 0.85) 0%,
            rgba(48, 176, 79, 0.85) 100%
        );
    }

    .toast-error {
        background: linear-gradient(
            135deg,
            rgba(255, 69, 58, 0.85) 0%,
            rgba(235, 61, 50, 0.85) 100%
        );
    }

    .toast-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }

    .toast-message {
        flex: 1;
        font-size: 14px;
        font-weight: 500;
        line-height: 1.4;
        letter-spacing: -0.01em;
    }
</style>
