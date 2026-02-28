<script lang="ts">
    interface Props {
        text: string;
    }

    const {text}: Props = $props();
</script>

<div class="tooltip" role="tooltip">{text}</div>

<style>
    .tooltip {
        border-radius: var(--radius-level-4);
        border: 1px solid var(--border-level-3);
        background: color-mix(in srgb, var(--bg-level-3) 85%, black);
        color: var(--font-color);
        font-size: 0.72rem;
        line-height: 1.2;
        letter-spacing: 0.01em;
        padding: 5px 8px;
        white-space: nowrap;
        box-shadow:
            0 6px 18px rgba(0, 0, 0, 0.35),
            inset 0 1px 0 rgba(255, 255, 255, 0.08);
        backdrop-filter: blur(8px) saturate(1.2);
        position: relative;
    }

    .tooltip::after {
        content: "";
        position: absolute;
        left: 50%;
        top: calc(100% - 1px);
        transform: translateX(-50%);
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-top: 5px solid color-mix(in srgb, var(--bg-level-3) 85%, black);
    }
</style>