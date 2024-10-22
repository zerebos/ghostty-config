<script lang="ts">
    import {setColorScheme} from "$lib/stores/config.svelte";
    import Dropdown from "./Dropdown.svelte";

    type Props = {
        value: string;
        options: (string | {name: string, value: string})[]
    };

    // eslint-disable-next-line prefer-const
    let {value = $bindable(), options}: Props = $props();

    async function change() {
        await setColorScheme(value);
    }
</script>

<Dropdown bind:value {options} {change} />