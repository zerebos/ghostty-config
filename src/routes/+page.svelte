<script lang="ts">
    import Page from "$lib/views/Page.svelte";
    import logo from "$lib/images/icon.webp";
    import Admonition from "$lib/components/Admonition.svelte";
    import Group from "$lib/components/settings/Group.svelte";
    import {resolve} from "$app/paths";
    import Checkbox from "$lib/components/settings/Checkbox.svelte";
    import {appName, msg, t} from "$lib/i18n.svelte";
</script>

<Page title={appName()}>
    <section>
        <div class="user">
            <div class="user-avatar">
                <img src={logo} alt={t("Ghostty Config Logo")} />
            </div>
            <div class="user-label">
                <div class="user-name">{appName()}</div>
                <div class="user-subtext">{t("by")} <a href="https://zerebos.com" target="_blank" rel="noopener noreferrer">@zerebos</a></div>
            </div>
        </div>
        <Admonition>
            {msg("This tool ", "这个工具")}<em>{msg("will", "可能")}</em>{msg(" have bugs! If you run into any, or have suggestions, please submit them ", "仍有 bug！如果你遇到问题或有建议，欢迎在")}
            <a href="https://github.com/zerebos/ghostty-config/issues" target="_blank" rel="noopener noreferrer">GitHub</a>{msg(".", " 提交反馈。")}
        </Admonition>
        <Group title={t("Recent Changes")}>
            <ul>
                <li><Checkbox checked />{msg("New keybind builder with sequence support", "新增支持序列的快捷键构建器")}</li>
                <li><Checkbox checked />{msg("Updated settings to match Ghostty 1.2 (and 1.3-nightly)", "更新设置以匹配 Ghostty 1.2（以及 1.3-nightly）")}</li>
                <li><Checkbox checked /><span>{msg("Designed a brand new logo by hand using ", "使用 ")}<a href="https://www.photopea.com/" target="_blank" rel="noopener noreferrer">Photopea</a>{msg("", " 手工设计全新 Logo")}</span></li>
                <li><Checkbox checked /><span>{msg("Added new custom app icon preview on the ", "在 ")}<a href={resolve("/settings/macos")}>{msg("macOS page", "macOS 页面")}</a>{msg("", "新增自定义应用图标预览")}</span></li>
                <li><Checkbox checked />{msg("New script for easier updates to future Ghostty versions", "新增脚本，便于适配未来 Ghostty 版本")}</li>
                <li><Checkbox checked />{msg("Fixed old settings that had outdated options", "修复带有过期选项的旧设置")}</li>
                <li><Checkbox checked /><span>{msg("Fix extra line breaks exporting to clipboard by ", "修复导出到剪贴板时多余换行，贡献者 ")}<a href="https://github.com/reussio" target="_blank" rel="noopener noreferrer">@reussio</a></span></li>
                <li><Checkbox checked /><span>{msg("Better theme sorting by ", "改进主题排序，贡献者 ")}<a href="https://github.com/adamalston" target="_blank" rel="noopener noreferrer">@adamalston</a></span></li>
            </ul>
        </Group>
        <Group title={t("Roadmap")}>
            <ul>
                <li><Checkbox />{msg("Command palette builder", "命令面板构建器")}</li>
                <li><Checkbox />{msg("Help documentation", "帮助文档")}</li>
                <li><Checkbox />{msg("Unit testing import/export", "导入/导出单元测试")}</li>
                <li><Checkbox />{msg("Unify color scheme", "统一配色方案")}</li>
                <li><Checkbox />{msg("Refactor & cleanup code", "重构并清理代码")}</li>
                <li><Checkbox />{msg("Custom setting types to more closely match Ghostty's config", "自定义设置类型以更贴近 Ghostty 配置")}</li>
                <li><Checkbox />{msg("Add a way to reset individual settings", "支持单独重置某个设置")}</li>
                <li><Checkbox />{msg("Change color picker from modal to popout", "将颜色选择器从弹窗改为浮出面板")}</li>
                <li><Checkbox />{msg("A ghostty-web terminal preview and playground", "ghostty-web 终端预览与 Playground")}</li>
            </ul>
        </Group>
    </section>
</Page>

<style>
    section {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        flex: 0.6;
    }

    .user {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 8px;
        margin: 20px 0;
    }

    .user-avatar img {
        height: 100%;
        width: 100%;
    }

    .user-avatar {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        background: linear-gradient(#03028f, #09043a);
        height: 100px;
        width: 100px;
        border-radius: 50%;
        /* border: 2px solid black; */
        /* box-shadow: 0 0 0 2px white; */
    }

    .user-label {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 5px;
    }

    .user-name {
        position: relative;
        display: flex;
        justify-content: center;
        font-size: 1.3rem;
        color: var(--font-color);
        font-weight: 600;
    }

    .user-subtext {
        display: flex;
        justify-content: center;
        font-size: 1.1rem;
        gap: 3px;
    }

    ul {
        /* list-style: "↪ "; */
        /* list-style: "🠶 "; */
        list-style: none;
        padding-left: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        height: 100%;
        justify-content: space-evenly;
    }

    ul li {
        margin-bottom: 5px;
        display: flex;
        align-items: center;
        gap: 8px;
    }
</style>
