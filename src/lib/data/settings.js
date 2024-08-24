export default [
    {
        id: "application",
        name: "Application",
        note: "",
        settings: [
            {id: "command", name: "Command to run on launch", type: "text", value: ""},
            {id: "waitAfterCommand", name: "Wait for input after command", type: "switch", value: false},
            {id: "abnormalCommandExitRuntime", name: "Abnormal command exit runtime", type: "number", value: 250, min: 0},
            {id: "scrollbackLimit", name: "Scrollback buffer size (bytes)", note: "This buffer exists completely in memory but is allocated lazily.", type: "number", value: 10000000, min: 0},
            {id: "linkUrl", name: "Automatically link URLs", note: "Matching occurs while holding the control (Linux) or command (macOS) key.", type: "switch", value: true},
            {id: "fullscreen", name: "Launch in fullscreen mode", type: "switch", value: false},
            {id: "title", name: "Static title for all windows", type: "text", value: ""},
            {id: "workingDirectory", name: "Directory to use after startup", note: "Special values of `home` and `inherit` are also allowed here.", type: "text", value: ""},
            {id: "configFile", name: "Additional config file", type: "text", value: ""},
            {id: "configDefaultFiles", name: "Load default config file", type: "switch", value: true},
            {id: "confirmCloseSurface", name: "Confirm when closing a surface", type: "switch", value: true},
            {id: "quitAfterLastWindowClosed", name: "Quit after closing last window", type: "switch", value: false},
            {id: "quitAfterLastWindowClosedDelay", name: "Delay before auto quitting", type: "text", value: ""},
            {id: "initialWindow", name: "Show a window on startup", type: "switch", value: true},
            {id: "shellIntegration", name: "Shell integration style", type: "dropdown", value: "detect", options: ["none", "detect", "bash", "elvish", "fish", "zsh"]},
            {id: "shellIntegrationFeatures", name: "Shell integration features", type: "checkboxes", value: "", options: ["cursor", "sudo", "title"]},
            {id: "oscColorReportFormat", name: "OSC color report format", type: "dropdown", value: "16-bit", options: ["none", "8-bit", "16-bit"]},
            {id: "vtKamAllowed", name: "VT kam mode allowed", note: "If you don't know what this is, don't touch it!", type: "switch", value: false},
            {id: "customShader", name: "Custom shader", note: "This matches the API of Shadertoy.", type: "text", value: ""},
            {id: "customShaderAnimation", name: "Allow shaders to animate", type: "dropdown", value: "false", options: ["false", "true", "always"]},
            {id: "desktopNotifications", name: "Allow desktop notifications", type: "switch", value: true},
            {id: "term", name: "TERM environment variable", type: "text", value: "xterm-ghostty"},
            {id: "enquiryResponse", name: "Reponse to ENQ", type: "text", value: ""},
        ]
    }
];