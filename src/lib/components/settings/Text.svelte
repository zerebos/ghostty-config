<script lang="ts">
    interface Props {
        value: string;
        blank?: boolean;
        align?: "right" | "left";
        change?: (e: Event) => void;
    }

    // eslint-disable-next-line prefer-const
    let {value = $bindable(), blank = false, align = "right", change}: Props = $props();

    function click(event: MouseEvent) {
        event.stopPropagation();
    }
</script>

<input class:blank class:empty={value === ""} class={align} type="text" onclick={click} onchange={change} bind:value />

<style>
input {
    background: var(--bg-level-2);
    border: 1px solid var(--border-input);
    border-radius: var(--radius-level-5);
    outline: none;
    color: inherit;
    text-align: right;
    max-width: 175px;
    padding: 0 4px 2px 0;
}

input:focus, input.blank:focus {
    background:var(--bg-input-focus);
    outline: var(--border-input-focus);
}

input.blank {
    background: none;
    border-width: 0;
}

input.blank.empty {
    border-width: 1px;
}

input.left {
    text-align: left;
}
</style>