<script lang="ts">
    import {resetColorScheme, setColorScheme} from "$lib/stores/config.svelte";
    import {success, error} from "$lib/stores/toasts.svelte";
    import Dropdown from "./Dropdown.svelte";

    type Props = {
        value: string;
        options: Array<string | {name: string, value: string}>
    };

    // eslint-disable-next-line prefer-const
    let {value = $bindable(), options}: Props = $props();

    function change() {
        if (value === "") {
            resetColorScheme();
            return;
        }

        const result = setColorScheme(value);

        if (result) success("Color scheme applied");
        else error("Failed to apply color scheme");
    }
</script>

<Dropdown bind:value {options} {change} placeholder="Choose a theme" searchable allowEmpty emptyLabel="Reset Theme" />