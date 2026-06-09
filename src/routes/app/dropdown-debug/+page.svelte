<script lang="ts">
    import Group from "$lib/components/settings/Group.svelte";
    import Item from "$lib/components/settings/Item.svelte";
    import Separator from "$lib/components/settings/Separator.svelte";
    import Dropdown from "$lib/components/settings/Dropdown.svelte";
    import Page from "$lib/views/Page.svelte";

    let basicValue = $state("detect");
    let clearableValue = $state("");
    let richValue = $state("nord");
    let searchableValue = $state("setting-31");
    let groupedValue = $state("window:compact");

    const basicOptions = ["none", "detect", "bash", "fish", "zsh", "nushell"];

    const richOptions = [
        {
            name: "Nord",
            value: "nord",
            description: "Cool low-contrast palette for long sessions",
            icon: "N",
            search: ["blue", "arctic"]
        },
        {
            name: "Solarized Dark",
            value: "solarized-dark",
            description: "Balanced contrast with warmer highlights",
            icon: "S"
        },
        {
            name: "Gruvbox",
            value: "gruvbox",
            description: "Earthy tones, popular for coding",
            icon: "G"
        },
        {
            name: "Catppuccin Mocha",
            value: "catppuccin-mocha",
            description: "Soft palette with colorful accents",
            icon: "C"
        }
    ];

    const searchableOptions = Array.from({length: 80}, (_, index) => {
        const number = (index + 1).toString().padStart(2, "0");
        return {
            name: `Generated Option ${number}`,
            value: `setting-${index + 1}`,
            description: `Description includes tokens alpha-${index % 5} and group-${index % 8}`,
            icon: `${(index % 9) + 1}`,
            search: ["generated", "debug", `alpha-${index % 5}`, `group-${index % 8}`]
        };
    });

    const groupedOptions = [
        {
            label: "General",
            options: [
                {
                    name: "Window style: compact",
                    value: "window:compact",
                    description: "Tighter spacing between controls",
                    icon: "W"
                },
                {
                    name: "Window style: relaxed",
                    value: "window:relaxed",
                    description: "Extra spacing for readability",
                    icon: "W"
                }
            ]
        },
        {
            label: "Split behavior",
            separatorBefore: true,
            options: [
                {
                    name: "Resize split",
                    value: "split:resize",
                    description: "Arrow keys resize active split",
                    icon: "R"
                },
                {
                    name: "Focus split",
                    value: "split:focus",
                    description: "Arrow keys move split focus",
                    icon: "F"
                },
                {
                    name: "No split action",
                    value: "split:none",
                    description: "Keep default behavior",
                    icon: "-"
                }
            ]
        },
        {
            label: "Experimental",
            separatorBefore: true,
            options: [
                {
                    name: "Custom accelerator map",
                    value: "exp:accelerator-map",
                    description: "Allows user-provided accelerator mapping",
                    icon: "X"
                },
                {
                    name: "GPU input heuristics",
                    value: "exp:gpu-input",
                    description: "Uses GPU-backed key processing path",
                    icon: "X",
                    disabled: true
                }
            ]
        }
    ];
</script>

<Page title="Dropdown Debug">
    <Group title="Basic">
        <Item name="Default behavior" note="Drop-in replacement for previous string/object options.">
            <Dropdown bind:value={basicValue} options={basicOptions} />
        </Item>
    </Group>

    <Group title="Clearable Empty State">
        <Item name="Allow empty selection" note="Clear returns the field to placeholder state.">
            <Dropdown
                bind:value={clearableValue}
                options={richOptions}
                placeholder="Choose a theme"
                allowEmpty
                emptyLabel="Clear and show placeholder"
            />
        </Item>
    </Group>

    <Group title="Rich Options">
        <Item name="Descriptions + icons" note="Richer option metadata for better discoverability.">
            <Dropdown bind:value={richValue} options={richOptions} placeholder="Theme" />
        </Item>
    </Group>

    <Group title="Searchable">
        <Item name="Large option list" note="Search matches title, value, description, and search keywords.">
            <Dropdown
                bind:value={searchableValue}
                options={searchableOptions}
                searchable
                placeholder="Find generated option"
            />
        </Item>
    </Group>

    <Group title="Grouped + Separated">
        <Item name="Structured options" note="Supports labels and separators between logical sections.">
            <Dropdown
                bind:value={groupedValue}
                groups={groupedOptions}
                searchable
                allowEmpty
                placeholder="Select grouped option"
            />
        </Item>
    </Group>

    <Group title="Live Values" borderless>
        <div class="preview">
            <div><span>basicValue</span><code>{basicValue || "<empty>"}</code></div>
            <Separator />
            <div><span>clearableValue</span><code>{clearableValue || "<empty>"}</code></div>
            <Separator />
            <div><span>richValue</span><code>{richValue || "<empty>"}</code></div>
            <Separator />
            <div><span>searchableValue</span><code>{searchableValue || "<empty>"}</code></div>
            <Separator />
            <div><span>groupedValue</span><code>{groupedValue || "<empty>"}</code></div>
        </div>
    </Group>
</Page>

<style>
    .preview {
        display: flex;
        flex-direction: column;
        gap: 8px;
        width: 100%;
        background: color-mix(in srgb, var(--bg-level-2) 85%, black);
        border-radius: var(--radius-level-3);
        padding: 12px;
        border: 1px solid var(--border-level-2);
    }

    .preview div {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
    }

    .preview span {
        color: var(--font-color-muted);
        font-size: 0.85rem;
    }

    .preview code {
        background: var(--bg-level-3);
        border: 1px solid var(--border-level-3);
        border-radius: var(--radius-level-5);
        padding: 3px 8px;
    }
</style>
