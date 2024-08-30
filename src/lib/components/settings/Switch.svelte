<script lang="ts">
    // eslint-disable-next-line prefer-const
    let {disabled = false, checked = $bindable(false)}: {disabled?: boolean, checked?: boolean} = $props();

    function change() {
        checked = !checked;
    }
</script>


<div class="switch" class:disabled>
    <input type="checkbox" {disabled} {checked} onchange={change} />
    <div class="switch-body">
        <svg class="switch-slider" viewBox="0 0 16 16" preserveAspectRatio="xMinYMid meet">
            <rect class="switch-handle" fill="white" x="0" y="0" height="16" width="16" rx="8"></rect>
        </svg>
    </div>
</div>


<style>
.switch {
    position: relative;
    transition: 250ms cubic-bezier(0, 0.3, 0.7, 1) filter, 250ms cubic-bezier(0, 0.3, 0.7, 1) opacity;
}

.switch-body {
    border-radius: 14px;
    width: 32px;
    height: 20px;
    background-color: var(--switch-body-color);
    transition: 250ms cubic-bezier(0, 0.3, 0.7, 1) background-color, 250ms cubic-bezier(0, 0.3, 0.7, 1) box-shadow;
    position: relative;
    box-shadow: 0 0 1px transparent inset;
}

.switch input:active + .switch-body {
    background-color: var(--switch-active-body-color);
}

.switch input:checked + .switch-body {
    background-color: var(--switch-checked-color);
    box-shadow: 0 0 1px rgba(255, 255, 255, 0.5) inset;
}

.switch input:checked:active + .switch-body {
    background-color: var(--switch-active-checked-color);
}

.switch input {
    position: absolute;
    z-index: 1;
    opacity: 0;
    margin: 0;
    width: 100%;
    height: 100%;
    border-radius: 100px;
    cursor: pointer;
}

.switch-body .switch-slider {
    display: flex;
    position: absolute;
    left: 2px;
    top: 2px;
    width: 16px;
    height: 16px;
    transition: 250ms cubic-bezier(0, 0.3, 0.7, 1);
}

.switch input:checked + .switch-body .switch-slider {
    left: 14px;
}

.switch-body .switch-slider .switch-handle {
    transition: 250ms cubic-bezier(0, 0.3, 0.7, 1);
    position: relative;
    display: flex;
}

.disabled {
    opacity: 0.5;
    filter: grayscale(1);
}

.disabled input {
    cursor: not-allowed;
}
</style>