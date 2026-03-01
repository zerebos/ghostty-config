<script lang="ts">
    import {scale} from "svelte/transition";

    interface Props {
        text: string;
    }

    const {text}: Props = $props();
</script>

<div class="tooltip" role="tooltip" transition:scale={{duration: 150}}>
    {text}
</div>

<style>
    .tooltip {
        border-radius: var(--radius-level-2);
        background: rgba(from var(--bg-level-1) r g b / 0.7);
        backdrop-filter: blur(20px);
        color: var(--font-color);
        padding: 12px;
        white-space: nowrap;
        border: 1px solid var(--border-level-1);
        box-shadow:
            0 0 20px -1px rgba(0,0,0,0.7),
            0 0 1px white inset;
        position: relative;
        z-index: 1;
        transform-origin: center bottom;
    }

    .tooltip::after,
    .tooltip::before {
        content: "";
        position: absolute;
        left: 50%;
        top: calc(100% - 7px);
        transform: translateX(-50%) rotate(-135deg);
        width: 12px;
        height: 12px;
        z-index: -1;
        background: rgba(from var(--bg-level-1) r g b / 0.7);
        backdrop-filter: blur(20px);
        clip-path: polygon(0 0, 100% 0, 0% 100%);
    }

    .tooltip::after {
        border: 1px solid var(--border-level-1);
        box-shadow:
            0 0 20px -1px rgba(0,0,0,0.7),
            0 0 1px white inset;
    }

    .tooltip::before {
        top: calc(100% - 8px);
        background: var(--bg-level-1);
    }
</style>