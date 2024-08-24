<script lang="ts">
    // import config from "$lib/stores/config";
    // import {writable} from "svelte/store";

    export let disabled: boolean = false;
    export let checked: boolean = false;
    // export let id: string = "";

    // console.log($config[id]);

    // const checked = writable($config[id]);

    function change() {
        checked = !checked;
        // checked.update(current => !current);
        // config.update(conf => {
        //     conf[id] = $checked;
        //     console.log($checked);
        //     return conf;
        // });
    }
</script>


<div class="switch" class:checked class:disabled>
    <input type="checkbox" disabled={disabled} checked={checked} on:change={change} />
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
    --switch-color: #453F4C;
    --symbol1path: path('M5.13231 6.72963L6.7233 5.13864L14.855 13.2704L13.264 14.8614L5.13231 6.72963Z');
    --symbol2path: path('M13.2704 5.13864L14.8614 6.72963L6.72963 14.8614L5.13864 13.2704L13.2704 5.13864Z');

    border-radius: 14px;
    width: 32px;
    height: 20px;
    background-color: var(--switch-color);
    transition: 250ms cubic-bezier(0, 0.3, 0.7, 1) background-color;
    position: relative;
}

.switch input:active + .switch-body {
    --switch-color: #514b5a;
}

.switch input:checked + .switch-body {
    --switch-color: #3973D3;
    --symbol1path: path('M7.89561 14.8538L6.30462 13.2629L14.3099 5.25755L15.9009 6.84854L7.89561 14.8538Z');
    --symbol2path: path('M4.08643 11.0903L5.67742 9.49929L9.4485 13.2704L7.85751 14.8614L4.08643 11.0903Z');
}

.switch input:checked:active + .switch-body {
    --switch-color: #4181e9;
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