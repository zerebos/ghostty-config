export interface MatchRange {
    start: number;
    end: number;
}

export interface MatchedSetting {
    id: string;
    name: string;
    matchRanges: MatchRange[];
}

export interface SearchResult {
    type: "category" | "external";
    categoryId: string;
    categoryName: string;
    categoryRoute: string;
    categoryMatchRanges: MatchRange[];
    matchedSettings: MatchedSetting[];
}

export interface ExternalTab {
    id: string;
    name: string;
    route: string;
}

interface SettingsPanel {
    id: string;
    name: string;
    groups: SettingsGroup[];
}

interface SettingsGroup {
    id: string;
    name: string;
    settings: SettingsItem[];
}

interface SettingsItem {
    id: string;
    name: string;
    note?: string;
}

export interface FlattenedItem {
    type: "category" | "setting" | "external";
    result: SearchResult;
    setting?: MatchedSetting;
}

export function getMatchRanges(text: string, query: string): MatchRange[] {
    if (!query) return [];

    const ranges: MatchRange[] = [];
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    let startIndex = 0;

    while (startIndex < lowerText.length) {
        const index = lowerText.indexOf(lowerQuery, startIndex);
        if (index === -1) break;
        ranges.push({start: index, end: index + query.length});
        startIndex = index + query.length;
    }

    return ranges;
}

export function hasMatch(text: string, query: string): boolean {
    if (!query) return false;
    return text.toLowerCase().includes(query.toLowerCase());
}

export function searchSettings(
    query: string,
    settingsData: SettingsPanel[],
    externalTabs: ExternalTab[] = []
): SearchResult[] {
    const q = query.trim();
    if (!q) return [];

    const results: SearchResult[] = [];

    for (const panel of settingsData) {
        const categoryMatchRanges = getMatchRanges(panel.name, q);
        const matchedSettings: MatchedSetting[] = [];

        for (const group of panel.groups) {
            for (const setting of group.settings) {
                if (hasMatch(setting.name, q) || (setting.note && hasMatch(setting.note, q))) {
                    matchedSettings.push({
                        id: setting.id,
                        name: setting.name,
                        matchRanges: getMatchRanges(setting.name, q)
                    });
                }
            }
        }

        if (categoryMatchRanges.length > 0 || matchedSettings.length > 0) {
            results.push({
                type: "category",
                categoryId: panel.id,
                categoryName: panel.name,
                categoryRoute: `/settings/${panel.id}`,
                categoryMatchRanges,
                matchedSettings
            });
        }
    }

    for (const tab of externalTabs) {
        const matchRanges = getMatchRanges(tab.name, q);
        if (matchRanges.length > 0) {
            results.push({
                type: "external",
                categoryId: tab.id,
                categoryName: tab.name,
                categoryRoute: tab.route,
                categoryMatchRanges: matchRanges,
                matchedSettings: []
            });
        }
    }

    return results;
}

export function flattenSearchResults(results: SearchResult[]): FlattenedItem[] {
    const flattened: FlattenedItem[] = [];

    for (const result of results) {
        if (result.type === "external") {
            flattened.push({type: "external", result});
        } else {
            flattened.push({type: "category", result});
            for (const setting of result.matchedSettings) {
                flattened.push({type: "setting", result, setting});
            }
        }
    }

    return flattened;
}
