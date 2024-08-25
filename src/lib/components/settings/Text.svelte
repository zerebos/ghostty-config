<script lang="ts">
    interface Props {
        value: string;
        blank?: boolean;
        align?: "right" | "left";
        change?: (e: Event) => void;
    }

    let {value = $bindable(), blank = false, align = "right", change}: Props = $props();

    function click(event: MouseEvent) {
        event.stopPropagation();
    }
</script>

<input class:blank class={align} type="text" onclick={click} onchange={change} bind:value />

<style>
input {
    background: #2F2935;
    border: 1px solid #443E4B;
    border-radius: 4px;
    outline: none;
    color: inherit;
    text-align: right;
    max-width: 175px;
}

input:focus, input.blank:focus {
    background: #1F1E1F;
    outline: 3px solid #2656C9;
}

input.blank {
    background: none;
    border: 0;
}

input.left {
    text-align: left;
}
</style>