import {describe, expect, it} from "vitest";
import {
    getMatchRanges,
    hasMatch,
    searchSettings,
    flattenSearchResults,
    type ExternalTab,
    type SearchResult
} from "./search";

describe("getMatchRanges", () => {
    it("returns empty array for empty query", () => {
        const ranges = getMatchRanges("test", "");
        expect(ranges).toEqual([]);
    });

    it("returns empty array for null query", () => {
        const ranges = getMatchRanges("test", null as any);
        expect(ranges).toEqual([]);
    });

    it("finds single match", () => {
        const ranges = getMatchRanges("Hello World", "wor");
        expect(ranges).toEqual([{start: 6, end: 9}]);
    });

    it("finds multiple matches", () => {
        const ranges = getMatchRanges("test test test", "test");
        expect(ranges).toEqual([
            {start: 0, end: 4},
            {start: 5, end: 9},
            {start: 10, end: 14}
        ]);
    });

    it("is case-insensitive", () => {
        const ranges = getMatchRanges("Hello World", "hello");
        expect(ranges).toEqual([{start: 0, end: 5}]);
    });

    it("returns empty array when no match found", () => {
        const ranges = getMatchRanges("Hello World", "xyz");
        expect(ranges).toEqual([]);
    });

    it("handles overlapping matches correctly", () => {
        const ranges = getMatchRanges("aaaa", "aa");
        expect(ranges).toEqual([
            {start: 0, end: 2},
            {start: 2, end: 4}
        ]);
    });

    it("matches special characters", () => {
        const ranges = getMatchRanges("test-case_name", "case");
        expect(ranges).toEqual([{start: 5, end: 9}]);
    });

    it("matches numbers", () => {
        const ranges = getMatchRanges("Option 1", "1");
        expect(ranges).toEqual([{start: 7, end: 8}]);
    });

    it("matches spaces", () => {
        const ranges = getMatchRanges("Hello World", " ");
        expect(ranges).toEqual([{start: 5, end: 6}]);
    });
});

describe("hasMatch", () => {
    it("returns false for empty query", () => {
        expect(hasMatch("test", "")).toBe(false);
    });

    it("returns false for null query", () => {
        expect(hasMatch("test", null as any)).toBe(false);
    });

    it("returns true when text contains query", () => {
        expect(hasMatch("Hello World", "world")).toBe(true);
    });

    it("is case-insensitive", () => {
        expect(hasMatch("Hello World", "HELLO")).toBe(true);
    });

    it("returns false when text does not contain query", () => {
        expect(hasMatch("Hello World", "xyz")).toBe(false);
    });

    it("returns true for partial matches", () => {
        expect(hasMatch("Application", "app")).toBe(true);
    });
});

describe("searchSettings", () => {
    const mockSettings = [
        {
            id: "application",
            name: "Application",
            groups: [
                {
                    id: "general",
                    name: "General",
                    settings: [
                        {id: "setting1", name: "Font Size", note: "Set the font size in pixels"},
                        {id: "setting2", name: "Font Family", note: "Choose a font family"}
                    ]
                },
                {
                    id: "advanced",
                    name: "Advanced",
                    settings: [
                        {id: "setting3", name: "Window Title", note: "Customize window title"},
                        {id: "setting4", name: "Theme", note: "Select a theme"}
                    ]
                }
            ]
        },
        {
            id: "colors",
            name: "Colors",
            groups: [
                {
                    id: "base",
                    name: "Base Colors",
                    settings: [
                        {id: "setting5", name: "Background", note: "Background color"},
                        {id: "setting6", name: "Foreground", note: "Text color"}
                    ]
                }
            ]
        }
    ];

    const mockExternalTabs: ExternalTab[] = [
        {id: "github", name: "GitHub", route: "https://github.com/zerebos/ghostty-config"},
        {id: "ghostty", name: "Ghostty", route: "https://ghostty.org/"}
    ];

    it("returns empty array for empty query", () => {
        const results = searchSettings("", mockSettings, mockExternalTabs);
        expect(results).toEqual([]);
    });

    it("returns empty array for whitespace-only query", () => {
        const results = searchSettings("   ", mockSettings, mockExternalTabs);
        expect(results).toEqual([]);
    });

    it("trims leading and trailing whitespace from query", () => {
        const results = searchSettings("  font  ", mockSettings, []);
        expect(results.length).toBeGreaterThan(0);
        expect(results[0]?.matchedSettings.length).toBeGreaterThan(0);
    });

    it("matches categories by name", () => {
        const results = searchSettings("colors", mockSettings, []);
        expect(results.length).toBe(1);
        expect(results[0]?.categoryId).toBe("colors");
        expect(results[0]?.categoryMatchRanges).toEqual([{start: 0, end: 6}]);
    });

    it("matches settings by name", () => {
        const results = searchSettings("font", mockSettings, []);
        expect(results.length).toBe(1);
        expect(results[0]?.categoryId).toBe("application");
        expect(results[0]?.matchedSettings.length).toBe(2);
        expect(results[0]?.matchedSettings[0]?.id).toBe("setting1");
        expect(results[0]?.matchedSettings[1]?.id).toBe("setting2");
    });

    it("matches settings by note", () => {
        const results = searchSettings("window", mockSettings, []);
        expect(results.length).toBe(1);
        expect(results[0]?.categoryId).toBe("application");
        expect(results[0]?.matchedSettings.length).toBe(1);
        expect(results[0]?.matchedSettings[0]?.id).toBe("setting3");
    });

    it("matches both category and settings when both match", () => {
        const results = searchSettings("application", mockSettings, []);
        expect(results.length).toBe(1);
        expect(results[0]?.categoryId).toBe("application");
        expect(results[0]?.categoryMatchRanges.length).toBeGreaterThan(0);
        expect(results[0]?.matchedSettings.length).toBe(0);
    });

    it("matches settings across multiple groups", () => {
        const results = searchSettings("color", mockSettings, []);
        expect(results.length).toBe(1);
        expect(results[0]?.categoryId).toBe("colors");
        expect(results[0]?.matchedSettings.length).toBe(2);
    });

    it("is case-insensitive for category matching", () => {
        const results = searchSettings("COLORS", mockSettings, []);
        expect(results.length).toBe(1);
        expect(results[0]?.categoryId).toBe("colors");
    });

    it("is case-insensitive for setting matching", () => {
        const results = searchSettings("FONT", mockSettings, []);
        expect(results.length).toBe(1);
        expect(results[0]?.matchedSettings.length).toBe(2);
    });

    it("returns empty array when no matches found", () => {
        const results = searchSettings("nonexistent", mockSettings, []);
        expect(results).toEqual([]);
    });

    it("matches external tabs", () => {
        const results = searchSettings("github", mockSettings, mockExternalTabs);
        const externalResult = results.find((r) => r.type === "external");
        expect(externalResult).toBeDefined();
        expect(externalResult?.categoryId).toBe("github");
        expect(externalResult?.categoryMatchRanges).toEqual([{start: 0, end: 6}]);
    });

    it("returns both category and external results when both match", () => {
        const externalTabsWithApp = [
            {id: "appstore", name: "App Store", route: "https://apple.com/appstore"},
            ...mockExternalTabs
        ];
        const results = searchSettings("app", mockSettings, externalTabsWithApp);
        const categoryResult = results.find((r) => r.type === "category");
        const externalResult = results.find((r) => r.type === "external");

        expect(categoryResult).toBeDefined();
        expect(externalResult).toBeDefined();
        expect(results.length).toBeGreaterThanOrEqual(2);
    });

    it("handles empty settings data", () => {
        const results = searchSettings("test", [], []);
        expect(results).toEqual([]);
    });

    it("handles empty external tabs", () => {
        const results = searchSettings("github", mockSettings, []);
        const externalResult = results.find((r) => r.type === "external");
        expect(externalResult).toBeUndefined();
    });

    it("generates correct match ranges for category names", () => {
        const results = searchSettings("app", mockSettings, []);
        expect(results[0]?.categoryMatchRanges).toEqual([{start: 0, end: 3}]);
    });

    it("generates correct match ranges for setting names", () => {
        const results = searchSettings("size", mockSettings, []);
        expect(results[0]?.matchedSettings[0]?.matchRanges).toEqual([{start: 5, end: 9}]);
    });

    it("generates multiple match ranges for repeated terms", () => {
        const results = searchSettings("font", mockSettings, []);
        const settingMatches = results[0]?.matchedSettings;
        expect(settingMatches?.length).toBeGreaterThan(1);
        expect(settingMatches[0]?.matchRanges.length).toBeGreaterThan(0);
        expect(settingMatches[1]?.matchRanges.length).toBeGreaterThan(0);
    });

    it("does not match if note is undefined", () => {
        const settingsWithoutNote = [
            {
                id: "test",
                name: "Test Category",
                groups: [
                    {
                        id: "group1",
                        name: "Group 1",
                        settings: [{id: "setting1", name: "Test Setting"}]
                    }
                ]
            }
        ];
        const results = searchSettings("test", settingsWithoutNote, []);
        expect(results.length).toBe(1);
        expect(results[0]?.matchedSettings.length).toBe(1);
    });
});

describe("flattenSearchResults", () => {
    const mockResults: SearchResult[] = [
        {
            type: "category",
            categoryId: "application",
            categoryName: "Application",
            categoryRoute: "/settings/application",
            categoryMatchRanges: [],
            matchedSettings: [
                {id: "setting1", name: "Font Size", matchRanges: []},
                {id: "setting2", name: "Font Family", matchRanges: []}
            ]
        },
        {
            type: "external",
            categoryId: "github",
            categoryName: "GitHub",
            categoryRoute: "https://github.com/test",
            categoryMatchRanges: [],
            matchedSettings: []
        }
    ];

    it("flattens category results correctly", () => {
        const flattened = flattenSearchResults(mockResults);

        expect(flattened[0]?.type).toBe("category");
        expect(flattened[0]?.result.categoryId).toBe("application");
    });

    it("flattens setting sub-items correctly", () => {
        const flattened = flattenSearchResults(mockResults);

        expect(flattened[1]?.type).toBe("setting");
        expect(flattened[1]?.setting?.id).toBe("setting1");
        expect(flattened[2]?.type).toBe("setting");
        expect(flattened[2]?.setting?.id).toBe("setting2");
    });

    it("flattens external results correctly", () => {
        const flattened = flattenSearchResults(mockResults);

        const externalItem = flattened.find((item) => item.type === "external");
        expect(externalItem).toBeDefined();
        expect(externalItem?.result.categoryId).toBe("github");
    });

    it("maintains correct order: category, settings, then external", () => {
        const flattened = flattenSearchResults(mockResults);

        expect(flattened[0]?.type).toBe("category");
        expect(flattened[1]?.type).toBe("setting");
        expect(flattened[2]?.type).toBe("setting");
        expect(flattened[3]?.type).toBe("external");
    });

    it("preserves result reference in all flattened items", () => {
        const flattened = flattenSearchResults(mockResults);

        const categoryItem = flattened[0];
        const settingItem = flattened[1];
        const externalItem = flattened[3];

        expect(categoryItem?.result).toBe(mockResults[0]);
        expect(settingItem?.result).toBe(mockResults[0]);
        expect(externalItem?.result).toBe(mockResults[1]);
    });

    it("handles empty results array", () => {
        const flattened = flattenSearchResults([]);
        expect(flattened).toEqual([]);
    });

    it("handles category with no matched settings", () => {
        const results: SearchResult[] = [
            {
                type: "category",
                categoryId: "test",
                categoryName: "Test",
                categoryRoute: "/settings/test",
                categoryMatchRanges: [],
                matchedSettings: []
            }
        ];

        const flattened = flattenSearchResults(results);

        expect(flattened.length).toBe(1);
        expect(flattened[0]?.type).toBe("category");
    });

    it("handles multiple categories with settings", () => {
        const results: SearchResult[] = [
            {
                type: "category",
                categoryId: "app",
                categoryName: "Application",
                categoryRoute: "/settings/app",
                categoryMatchRanges: [],
                matchedSettings: [{id: "s1", name: "Setting 1", matchRanges: []}]
            },
            {
                type: "category",
                categoryId: "colors",
                categoryName: "Colors",
                categoryRoute: "/settings/colors",
                categoryMatchRanges: [],
                matchedSettings: [{id: "s2", name: "Setting 2", matchRanges: []}]
            }
        ];

        const flattened = flattenSearchResults(results);

        expect(flattened.length).toBe(4);
        expect(flattened[0]?.type).toBe("category");
        expect(flattened[1]?.type).toBe("setting");
        expect(flattened[2]?.type).toBe("category");
        expect(flattened[3]?.type).toBe("setting");
    });

    it("handles external-only results", () => {
        const results: SearchResult[] = [
            {
                type: "external",
                categoryId: "github",
                categoryName: "GitHub",
                categoryRoute: "https://github.com",
                categoryMatchRanges: [],
                matchedSettings: []
            }
        ];

        const flattened = flattenSearchResults(results);

        expect(flattened.length).toBe(1);
        expect(flattened[0]?.type).toBe("external");
    });

    it("handles mixed category and external results", () => {
        const results: SearchResult[] = [
            {
                type: "external",
                categoryId: "github",
                categoryName: "GitHub",
                categoryRoute: "https://github.com",
                categoryMatchRanges: [],
                matchedSettings: []
            },
            {
                type: "category",
                categoryId: "app",
                categoryName: "Application",
                categoryRoute: "/settings/app",
                categoryMatchRanges: [],
                matchedSettings: [{id: "s1", name: "Setting 1", matchRanges: []}]
            }
        ];

        const flattened = flattenSearchResults(results);

        expect(flattened.length).toBe(3);
        expect(flattened[0]?.type).toBe("external");
        expect(flattened[1]?.type).toBe("category");
        expect(flattened[2]?.type).toBe("setting");
    });
});
