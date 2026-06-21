import type {HexColor} from "$lib/utils/colors";


export interface ThemeResponse {
    type: string;
    encoding: string;
    size: number;
    name: string;
    path: string;
    content: string;
    sha: string;
    url: string;
    git_url: string;
    html_url: string;
    download_url: string;
    _links: {
        git: string;
        self: string;
        html: string;
    };
}

// TODO: unify config typing across repo
export interface ColorScheme {
    palette: HexColor[];
    background?: HexColor;
    foreground?: HexColor;
    cursorColor?: HexColor;
    cursorText?: HexColor;
    selectionBackground?: HexColor;
    selectionForeground?: HexColor;
}

export const fetchThemeFiles = async () => {
    const response = await fetch("https://api.github.com/repos/mbadolato/iTerm2-Color-Schemes/contents/ghostty");
    if (!response.ok) throw new Error(`Error fetching data: ${response.statusText}`);
    return await response.json() as ThemeResponse[];
};

export const parseThemeFiles = (files: ThemeResponse[]): string[] => {
    return files.map((file: ThemeResponse) => file.name).sort((a, b) => a.localeCompare(b, undefined, {sensitivity: "base", numeric: true}));
};

export const fetchColorScheme = async (theme: string) => {
    const response = await fetch(`https://raw.githubusercontent.com/mbadolato/iTerm2-Color-Schemes/master/ghostty/${theme}`);
    if (!response.ok) throw new Error(`Error fetching data: ${response.statusText}`);
    return await response.text();
};
