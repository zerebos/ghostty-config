<script lang="ts">
    const {expand = false} = $props();
</script>

<div class="tab-gap" style:flex={expand ? 1 : ""}></div>

<style>
    .tab-gap {
        display: flex;
        min-height: 15px;
    }
</style>