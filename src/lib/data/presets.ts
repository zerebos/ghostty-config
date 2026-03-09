import type {HexColor} from "$lib/utils/colors";

export interface Preset {
    id: string;
    name: string;
    description: string;
    background: HexColor;
    foreground: HexColor;
    selectionBackground: HexColor;
    selectionForeground: HexColor;
    cursorColor: HexColor;
    palette: HexColor[];
}

const presets: Preset[] = [
    {
        id: "nord",
        name: "Nord",
        description: "Arctic-inspired cool blues from the frozen north.",
        background: "#2E3440",
        foreground: "#D8DEE9",
        selectionBackground: "#4C566A",
        selectionForeground: "#ECEFF4",
        cursorColor: "#D8DEE9",
        palette: [
            "#3B4252", "#BF616A", "#A3BE8C", "#EBCB8B", "#81A1C1", "#B48EAD", "#88C0D0", "#E5E9F0",
            "#4C566A", "#BF616A", "#A3BE8C", "#EBCB8B", "#81A1C1", "#B48EAD", "#8FBCBB", "#ECEFF4",
        ],
    },
    {
        id: "dracula",
        name: "Dracula",
        description: "Moody purple and pink tones for late-night coding.",
        background: "#282A36",
        foreground: "#F8F8F2",
        selectionBackground: "#44475A",
        selectionForeground: "#F8F8F2",
        cursorColor: "#F8F8F2",
        palette: [
            "#21222C", "#FF5555", "#50FA7B", "#F1FA8C", "#BD93F9", "#FF79C6", "#8BE9FD", "#F8F8F2",
            "#6272A4", "#FF6E6E", "#69FF94", "#FFFFA5", "#D6ACFF", "#FF92DF", "#A4FFFF", "#FFFFFF",
        ],
    },
    {
        id: "tokyo-night",
        name: "Tokyo Night",
        description: "Deep night blues with vivid neon accents.",
        background: "#1A1B26",
        foreground: "#A9B1D6",
        selectionBackground: "#283457",
        selectionForeground: "#C0CAF5",
        cursorColor: "#C0CAF5",
        palette: [
            "#15161E", "#F7768E", "#9ECE6A", "#E0AF68", "#7AA2F7", "#BB9AF7", "#7DCFFF", "#A9B1D6",
            "#414868", "#F7768E", "#9ECE6A", "#E0AF68", "#7AA2F7", "#BB9AF7", "#7DCFFF", "#C0CAF5",
        ],
    },
    {
        id: "catppuccin-mocha",
        name: "Catppuccin Mocha",
        description: "Warm dark pastels that are easy on the eyes.",
        background: "#1E1E2E",
        foreground: "#CDD6F4",
        selectionBackground: "#585B70",
        selectionForeground: "#CDD6F4",
        cursorColor: "#F5E0DC",
        palette: [
            "#45475A", "#F38BA8", "#A6E3A1", "#F9E2AF", "#89B4FA", "#F5C2E7", "#94E2D5", "#BAC2DE",
            "#585B70", "#F38BA8", "#A6E3A1", "#F9E2AF", "#89B4FA", "#F5C2E7", "#94E2D5", "#A6ADC8",
        ],
    },
    {
        id: "gruvbox-dark",
        name: "Gruvbox Dark",
        description: "Retro warm earthy tones with a nostalgic feel.",
        background: "#282828",
        foreground: "#EBDBB2",
        selectionBackground: "#504945",
        selectionForeground: "#EBDBB2",
        cursorColor: "#EBDBB2",
        palette: [
            "#282828", "#CC241D", "#98971A", "#D79921", "#458588", "#B16286", "#689D6A", "#A89984",
            "#928374", "#FB4934", "#B8BB26", "#FABD2F", "#83A598", "#D3869B", "#8EC07C", "#EBDBB2",
        ],
    },
    {
        id: "one-dark-pro",
        name: "One Dark Pro",
        description: "The classic Atom editor theme, refined for terminals.",
        background: "#282C34",
        foreground: "#ABB2BF",
        selectionBackground: "#3E4451",
        selectionForeground: "#ABB2BF",
        cursorColor: "#528BFF",
        palette: [
            "#282C34", "#E06C75", "#98C379", "#E5C07B", "#61AFEF", "#C678DD", "#56B6C2", "#ABB2BF",
            "#5C6370", "#E06C75", "#98C379", "#E5C07B", "#61AFEF", "#C678DD", "#56B6C2", "#FFFFFF",
        ],
    },
    {
        id: "midnight-ember",
        name: "Midnight Ember",
        description: "Dark charcoal with fiery orange glows and warm highlights.",
        background: "#1C1917",
        foreground: "#E7E0D5",
        selectionBackground: "#44312A",
        selectionForeground: "#F5E6D3",
        cursorColor: "#FF6B2B",
        palette: [
            "#292524", "#EF4444", "#84CC16", "#F59E0B", "#3B82F6", "#A855F7", "#06B6D4", "#D6D3D1",
            "#57534E", "#FB7185", "#BEF264", "#FCD34D", "#93C5FD", "#D8B4FE", "#67E8F9", "#FAFAF9",
        ],
    },
    {
        id: "aqua-depths",
        name: "Aqua Depths",
        description: "Deep ocean teal and cyan inspired by the abyss.",
        background: "#0D1F2D",
        foreground: "#C8E6E8",
        selectionBackground: "#1A3A4A",
        selectionForeground: "#E0F4F5",
        cursorColor: "#00BCD4",
        palette: [
            "#0D2030", "#E53935", "#26A69A", "#FFCA28", "#1565C0", "#7B1FA2", "#00ACC1", "#B0BEC5",
            "#37474F", "#EF5350", "#4DB6AC", "#FFD54F", "#42A5F5", "#AB47BC", "#26C6DA", "#ECEFF1",
        ],
    },
    {
        id: "cherry-blossom",
        name: "Cherry Blossom",
        description: "Soft sakura pinks on deep indigo for a dreamy aesthetic.",
        background: "#1E1E2E",
        foreground: "#F5C2E7",
        selectionBackground: "#3D2B4A",
        selectionForeground: "#FDDDE6",
        cursorColor: "#FF79C6",
        palette: [
            "#2A1F35", "#FF5370", "#FF99CC", "#FFD700", "#C792EA", "#FF79C6", "#89DDFF", "#FDDDE6",
            "#4A3555", "#FF5370", "#FFAED4", "#FFE57F", "#D9A4FF", "#FFAAE4", "#B3ECFF", "#FFFFFF",
        ],
    },
    {
        id: "forest-canopy",
        name: "Forest Canopy",
        description: "Deep earthy greens with moss accents from the woodland floor.",
        background: "#1A2012",
        foreground: "#C8D8B0",
        selectionBackground: "#2D3E1E",
        selectionForeground: "#E0EAC8",
        cursorColor: "#8BC34A",
        palette: [
            "#1E2614", "#EF5350", "#66BB6A", "#FFA726", "#42A5F5", "#AB47BC", "#26A69A", "#A5D6A7",
            "#37471F", "#FF7043", "#81C784", "#FFCC02", "#64B5F6", "#CE93D8", "#4DB6AC", "#DCEDC8",
        ],
    },
];

export default presets;
