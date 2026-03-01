<script lang="ts">
    interface Props {
        disabled?: boolean;
        checked?: boolean;
        onchange?: (checked: boolean) => void;
    }
    // eslint-disable-next-line prefer-const
    let {disabled = false, checked = $bindable(false), onchange}: Props = $props();

    function change() {
        checked = !checked;
        if (onchange) onchange(checked);
    }
</script>


<div class="checkbox" class:disabled>
    <input class="checkbox-input" type="checkbox" bind:checked onchange={change} {disabled} />
    <svg class="checkbox-glyph" viewBox="0 0 24 24">
        <path d="M0.73, 11.91 8.1,19.28 22.79,4.59" fill="none" />
    </svg>
</div>


<style>
.checkbox {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
}

.checkbox-glyph {
    position: absolute;
    width: 12px;
    height: 12px;
    color: #fff;
}

.checkbox-glyph path {
    transform: scale(0.8);
    transform-origin: center;
    stroke: currentColor;
    stroke-width: 2.45;
    stroke-dasharray: 32;
    stroke-dashoffset: 32;
}

.checkbox-input {
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    -webkit-appearance: none;
    appearance: none;
    box-sizing: border-box;
    flex: 0 0 auto;
    margin: 0;
    border-radius: var(--radius-level-5);
    background: linear-gradient(0deg, #615E65, #4E4B53);
    width: 15px;
    height: 15px;
    border: 0;
    box-shadow:
            0px 0px 1px 0px #000000,
            inset 0px 3px 1px -3px rgba(255, 255, 255, 0.65);
}

.checkbox-input:active {
    filter: brightness(1.2);
}

.checkbox-input:checked {
    background: linear-gradient(0deg, #3C6EC9, #437AE2);
}

.checkbox-input:checked + .checkbox-glyph path {
    transition: 250ms cubic-bezier(0.55, 0, 0, 1) stroke-dashoffset;
    stroke-dashoffset: 0;
}

.checkbox-input::marker {
    display: none;
}

.disabled {
    opacity: 0.5;
    filter: grayscale(1);
}

.disabled input {
    cursor: not-allowed;
}
</style>