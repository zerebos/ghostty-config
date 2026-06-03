<script lang="ts">
    import {locale, setLocale, t, type Locale} from "$lib/i18n.svelte";

    function changeLanguage(event: Event) {
        setLocale((event.currentTarget as HTMLSelectElement).value as Locale);
    }
</script>

<label class="language-toggle">
    <span>{t("Language")}</span>
    <select value={locale.current} onchange={changeLanguage} aria-label={t("Language")}> 
        <option value="zh-CN">中文</option>
        <option value="en">English</option>
    </select>
</label>

<style>
    .language-toggle {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        margin: 0 10px;
        padding: 8px 10px;
        color: var(--font-color-muted);
        font-size: 0.82rem;
        border-radius: var(--radius-level-4);
        background: rgba(255, 255, 255, 0.04);
    }

    .language-toggle select {
        min-width: 86px;
        color: var(--font-color);
        background: var(--bg-level-3);
        border: 1px solid var(--border-level-3);
        border-radius: var(--radius-level-5);
        padding: 3px 6px;
        font: inherit;
    }
</style>
