interface BaseSettingType {
    id: string;
    name: string;
    note?: string;
}

interface Panel extends BaseSettingType {
    groups: Group[];
}

interface Group extends BaseSettingType {
    settings: (Switch | Text | Number | Dropdown)[];
    // type: "group";
}

type SettingType = "switch" | "number" | "dropdown" | "text" | "group";

interface BaseSettingItem extends BaseSettingType {
    type: SettingType;
    value: unknown;
}

interface Switch extends BaseSettingItem {
    type: "switch";
    value: boolean;
}

interface Text extends BaseSettingItem {
    type: "text";
    value: string;
}

interface Number extends BaseSettingItem {
    type: "number";
    value: number;
    min?: number;
    max?: number;
    step?: number;
    size?: number;
}

interface DropdownOption {
    name: string;
    value: string;
}

interface Dropdown extends BaseSettingItem {
    type: "dropdown";
    value: "string";
    options: (DropdownOption | string)[];
}

export default [
    {
        id: "application",
        name: "Application",
        note: "",
        groups: [
            {
                id: "general",
                name: "General",
                // type: "group",
                settings: [
                    {id: "title", name: "Static title for all windows", type: "text", value: ""},
                    {id: "desktopNotifications", name: "Allow desktop notifications", type: "switch", value: true},
                    {id: "configFile", name: "Additional config file", type: "text", value: ""},
                    {id: "configDefaultFiles", name: "Load default config file", type: "switch", value: true},
                    {id: "linkUrl", name: "Automatically link URLs", note: "Matching occurs while holding the control (Linux) or command (macOS) key.", type: "switch", value: true},
                ]
            },
            {
                id: "startup",
                name: "Startup",
                // type: "group",
                settings: [
                    {id: "command", name: "Command to run on launch", type: "text", value: ""},
                    {id: "fullscreen", name: "Launch in fullscreen mode", type: "switch", value: false},
                    {id: "initialWindow", name: "Show a window on startup", type: "switch", value: true},
                    {id: "workingDirectory", name: "Directory to use after startup", note: "Special values of `home` and `inherit` are also allowed here.", type: "text", value: ""},
                ]
            },
            {
                id: "shutdown",
                name: "Shutdown",
                // type: "group",
                settings: [
                    {id: "waitAfterCommand", name: "Wait for input after command", type: "switch", value: false},
                    {id: "abnormalCommandExitRuntime", name: "Abnormal command exit runtime", type: "number", value: 250, min: 0, size: 5},
                    {id: "confirmCloseSurface", name: "Confirm when closing a surface", type: "switch", value: true},
                    {id: "quitAfterLastWindowClosed", name: "Quit after closing last window", type: "switch", value: false},
                    {id: "quitAfterLastWindowClosedDelay", name: "Delay before auto quitting", type: "text", value: ""},
                ]
            },
            {
                id: "shell",
                name: "Shell Integration",
                // type: "group",
                settings: [
                    {id: "shellIntegration", name: "Shell integration style", type: "dropdown", value: "detect", options: ["none", "detect", "bash", "elvish", "fish", "zsh"]},
                    {id: "shellIntegrationFeatures", name: "Shell integration features", note: "The current available features are cursor, sudo, and title. Including one force enables it, prefixing it with `no-` force disables it, omitting it falls back to default.", type: "text", value: "cursor,no-sudo,title"},
                    {id: "term", name: "TERM environment variable", type: "text", value: "xterm-ghostty"},
                ]
            },
            {
                id: "advanced",
                name: "Advanced",
                note: "You should only touch these settings if you know what you're doing, otherwise you could cause major issues with Ghostty!",
                // type: "group",
                settings: [
                    {id: "scrollbackLimit", name: "Scrollback buffer size (bytes)", note: "This buffer exists completely in memory but is allocated lazily.", type: "number", value: 10000000, min: 0, size: 10},
                    {id: "customShader", name: "Custom shader", note: "This matches the API of Shadertoy.", type: "text", value: ""},
                    {id: "customShaderAnimation", name: "Allow shaders to animate", type: "dropdown", value: "false", options: ["false", "true", "always"]},
                    {id: "enquiryResponse", name: "Reponse to ENQ", type: "text", value: ""},
                    {id: "oscColorReportFormat", name: "OSC color report format", type: "dropdown", value: "16-bit", options: ["none", "8-bit", "16-bit"]},
                    {id: "vtKamAllowed", name: "VT kam mode allowed", note: "If you don't know what this is, don't touch it!", type: "switch", value: false},
                ]
            },
        ]
    }
] as Panel[];