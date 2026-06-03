<script lang="ts">
    import {t} from "$lib/i18n.svelte";
    import Page from "$lib/views/Page.svelte";
    import FontPreview from "$lib/views/FontPreview.svelte";
</script>

<Page title={t("Font Playground")}>
    <FontPreview />
</Page>