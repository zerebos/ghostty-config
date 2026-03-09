<script lang="ts">
    import type {Snippet} from "svelte";

    interface Props {
        primary?: boolean;
        onclick?: (e: MouseEvent) => void | Promise<void>;
        disabled?: boolean;
        type?: "button" | "submit" | "reset";
        title?: string;
        children: Snippet;
    }

    const {
        primary = false,
        onclick,
        disabled = false,
        type = "button",
        title,
        children
    }: Props = $props();
</script>

<button
    class:primary
    {onclick}
    {disabled}
    {type}
    {title}
>
    {@render children()}
</button>

<style>
    button {
        padding: 4px 12px;
        border-radius: var(--radius-level-4);
        border: 0;
        font-weight: 500;
        box-shadow:
            0px 0px 1px 0px #000000,
            inset 0px 3px 1px -3px rgba(255, 255, 255, 0.65);
        background: #59575C;
        color: var(--font-color);
        cursor: pointer;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    button.primary {
        background: linear-gradient(0deg, #3C6EC9, #437AE2);
        padding: 4px 20px;
    }

    button:disabled {
        cursor: not-allowed;
        filter: brightness(0.6);
        opacity: 0.8;
    }

    button:not(:disabled):active {
        filter: brightness(1.2);
    }
</style>
