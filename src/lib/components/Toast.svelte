<script lang="ts">
    import {dismissToast} from "$lib/stores/toasts.svelte";
    import {sequoiaEase} from "$lib/utils/animations";
    import {fly} from "svelte/transition";

    interface Props {
        id: string;
        type: "success" | "error";
        message: string;
    }

    const {id, type, message}: Props = $props();

    function handleDismiss() {
        dismissToast(id);
    }

</script>

<div class="toast-container" role="status" aria-live="polite">
    <!-- eslint-disable-next-line svelte/no-unused-class-name -->
    <button type="button" class="toast toast-{type}" onclick={handleDismiss} transition:fly={{y: -44, duration: 300, easing: sequoiaEase}}>
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
</div>

<style>
    .toast-container {
        display: contents;
    }

    .toast {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        min-width: 280px;
        max-width: 400px;
        width: 100%;
        border: none;
        border-radius: var(--radius-level-3);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        box-shadow:
            0 4px 16px rgba(0, 0, 0, 0.3),
            0 0 0 1px rgba(255, 255, 255, 0.1) inset,
            0 1px 2px rgba(0, 0, 0, 0.5);
        cursor: pointer;
        transition: all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1);
        /* animation: slideIn 0.3s cubic-bezier(0.4, 0.0, 0.2, 1); */
        font-family: inherit;
        text-align: left;
    }

    .toast:hover {
        transform: translateY(-2px);
        box-shadow:
            0 6px 20px rgba(0, 0, 0, 0.35),
            0 0 0 1px rgba(255, 255, 255, 0.15) inset,
            0 1px 2px rgba(0, 0, 0, 0.5);
    }

    .toast:focus {
        outline: none;
        transform: translateY(-2px);
        box-shadow:
            0 6px 20px rgba(0, 0, 0, 0.35),
            0 0 0 2px var(--color-input-accent),
            0 1px 2px rgba(0, 0, 0, 0.5);
    }

    .toast-success {
        background: linear-gradient(
            135deg,
            rgba(52, 199, 89, 0.85) 0%,
            rgba(48, 176, 79, 0.85) 100%
        );
        color: #ffffff;
    }

    .toast-error {
        background: linear-gradient(
            135deg,
            rgba(255, 69, 58, 0.85) 0%,
            rgba(235, 61, 50, 0.85) 100%
        );
        color: #ffffff;
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

    /* @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-100%);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .toast {
            animation: fadeIn 0.2s ease;
        }

        .toast:hover {
            transform: none;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }
    } */
</style>
