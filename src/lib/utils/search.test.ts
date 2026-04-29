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
        expect(getMatchRanges("test", "")).toEqual([]);
    });

    it("finds single match", () => {
        expect(getMatchRanges("Hello World", "wor")).toEqual([{start: 6, end: 9}]);
    });

    it("finds multiple matches", () => {
        expect(getMatchRanges("test test test", "test")).toEqual([
            {start: 0, end: 4},
            {start: 5, end: 9},
            {start: 10, end: 14}
        ]);
    });

    it("is case-insensitive", () => {
        expect(getMatchRanges("Hello World", "hello")).toEqual([{start: 0, end: 5}]);
    });

    it("returns empty array when no match found", () => {
        expect(getMatchRanges("Hello World", "xyz")).toEqual([]);
    });
});

describe("hasMatch", () => {
    it("returns false for empty query", () => {
        expect(hasMatch("test", "")).toBe(false);
    });

    it("returns true when text contains query", () => {
        expect(hasMatch("Hello World", "world")).toBe(true);
    });

    it("returns false when text does not contain query", () => {
        expect(hasMatch("Hello World", "xyz")).toBe(false);
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
        expect(searchSettings("", mockSettings, mockExternalTabs)).toEqual([]);
    });

    it("matches categories by name", () => {
        const results = searchSettings("colors", mockSettings, []);
        expect(results).toHaveLength(1);
        expect(results[0]?.categoryId).toBe("colors");
        expect(results[0]?.categoryMatchRanges).toEqual([{start: 0, end: 6}]);
    });

    it("matches settings by name", () => {
        const results = searchSettings("font", mockSettings, []);
        expect(results).toHaveLength(1);
        expect(results[0]?.matchedSettings).toHaveLength(2);
        expect(results[0]?.matchedSettings[0]?.id).toBe("setting1");
    });

    it("matches settings by note", () => {
        const results = searchSettings("window", mockSettings, []);
        expect(results).toHaveLength(1);
        expect(results[0]?.matchedSettings).toHaveLength(1);
        expect(results[0]?.matchedSettings[0]?.id).toBe("setting3");
    });

    it("matches external tabs", () => {
        const results = searchSettings("github", mockSettings, mockExternalTabs);
        const externalResult = results.find((r) => r.type === "external");
        expect(externalResult).toBeDefined();
        expect(externalResult?.categoryId).toBe("github");
    });

    it("returns empty array when no matches found", () => {
        expect(searchSettings("nonexistent", mockSettings, [])).toEqual([]);
    });

    it("handles empty settings data", () => {
        expect(searchSettings("test", [], [])).toEqual([]);
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

    it("flattens category and settings in order", () => {
        const flattened = flattenSearchResults(mockResults);
        expect(flattened).toHaveLength(4);
        expect(flattened[0]?.type).toBe("category");
        expect(flattened[1]?.type).toBe("setting");
        expect(flattened[2]?.type).toBe("setting");
        expect(flattened[3]?.type).toBe("external");
    });

    it("handles empty results array", () => {
        expect(flattenSearchResults([])).toEqual([]);
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
        expect(flattened).toHaveLength(1);
        expect(flattened[0]?.type).toBe("category");
    });
});
