import {resolve} from "$app/paths";
import navigation from "$lib/settings/navigation";
import registry from "$lib/settings/registry";
import type {SettingsRegistry} from "$lib/settings/types";


// FIXME: this is a bit of a mess, now that we separated this logic from the UI,
// consider refactoring this to be more maintainable and testable. Also consider
// implementing a more robust search algorithm, such as fuzzy search, to improve
// search results.

export const searchState = $state({
    query: "",
    selectedIndex: -1,
    activeIndex: -1,
    selectedId: "",
});

export function setQuery(query: string) {
    searchState.query = query.trim().toLocaleLowerCase(); // Normalize on setting query to avoid doing it repeatedly in derived stores
    searchState.selectedIndex = searchState.query ? 0 : -1;
    searchState.activeIndex = -1;
    searchState.selectedId = "";
}

const searchTokens = $derived.by(() => searchState.query.split(/\s+/).filter(Boolean));
const searchResults = $derived.by(() => {
    if (!searchTokens.length) return [];
    return searchableSettings.filter(result => searchTokens.every(token => result.searchableText.includes(token)));
});

export function getResults() {
    return searchResults;
}

export function hasResults() {
    return searchResults.length > 0;
}

// TODO: this is a bit of a weird place for this, consider moving to a more appropriate utility file
// also consider precomputing the grouped results instead of doing it on every search, though it is
// unlikely that there will be enough settings to cause performance issues
const groupedSearchResults = $derived.by(() => {
    const grouped: Array<{
        categoryId: string;
        categoryName: string;
        categoryIcon: string;
        categoryRoute: string;
        results: Array<SearchResult & {index: number;}>;
    }> = [];

    searchResults.forEach((result, index) => {
        const existing = grouped.find(group => group.categoryId === result.categoryId);
        if (existing) {
            existing.results.push({...result, index});
            return;
        }

        grouped.push({
            categoryId: result.categoryId,
            categoryName: result.categoryName,
            categoryIcon: result.categoryIcon,
            categoryRoute: resolve("/settings/[category]", {category: result.categoryId}),
            results: [{...result, index}],
        });
    });

    return grouped;
});

export function getGroupedResults() {
    return groupedSearchResults;
}

export function hasGroupedResults() {
    return groupedSearchResults.length > 0;
}



export interface SearchResult {
    categoryId: string;
    categoryName: string;
    categoryIcon: string;
    groupName: string;
    note: string;
    routeKey: string;
    settingId: string;
    settingName: string;
    searchableText: string;
    description: string;
}

// This doesn't belong here
const stripHtmlRegex = (html: string) => html.replace(/<[^>]*>/g, "");

export function stripMarkdownRegex(md: string): string {
    return md
        // Remove inline code markers
        .replace(/`([^`]+)`/g, "$1")
        // Remove list markers (-, *, +, 1.)
        .replace(/^\s*([-*+]|\d+\.)\s+/gm, "")
        .trim();
}


// TODO: this is pretty inefficient, we should probably build an index for this instead
// of doing a linear search through all settings every time. However, it is unlikely that
// there will be enough settings to cause performance issues, so this is good enough for now.
const searchableSettings = (() => {
    const results: SearchResult[] = [];
    for (const category of navigation) {
        if (!category.groups) continue;
        for (const group of category.groups) {
            for (const id of group.settings) {
                const setting = registry[id] as SettingsRegistry[keyof SettingsRegistry];
                const cleanedNote = setting.note ? stripHtmlRegex(setting.note) : "";
                const cleanedDescription = setting.description ? stripMarkdownRegex(setting.description) : "";
                const searchableText = [category.name, group.name, setting.name, cleanedNote, cleanedDescription];

                results.push({
                    categoryId: category.id,
                    categoryName: category.name,
                    categoryIcon: category.icon,
                    groupName: group.name,
                    note: cleanedNote,
                    description: cleanedDescription,
                    routeKey: `${category.id}:${id}`,
                    settingId: id,
                    settingName: setting.name,
                    searchableText: searchableText.join(" ").toLocaleLowerCase(),
                });
            }
        }
    }
    return results;
})();


export interface HighlightPart {
    matched: boolean;
    text: string;
}

// TODO: this is a bit janky, consider a more robust solution for keeping track of active/selected
// search results and their corresponding DOM elements
export function getHighlightParts(value: string,): HighlightPart[] {
    if (!value) return [];

    const tokens = searchTokens;

    if (!tokens.length) {
        return [{matched: false, text: value}];
    }

    const lowerValue = value.toLocaleLowerCase();
    const ranges: Array<[number, number]> = [];
    for (const token of tokens) {
        if (!token) continue;
        let fromIndex = 0;
        while (fromIndex < lowerValue.length) {
            const index = lowerValue.indexOf(token, fromIndex);
            if (index < 0) break;

            ranges.push([index, index + token.length]);
            fromIndex = index + token.length;
        }
    }

    if (!ranges.length) {
        return [{matched: false, text: value}];
    }

    ranges.sort((a, b) => a[0] - b[0]);

    const merged: Array<[number, number]> = [ranges[0]];
    for (let i = 1; i < ranges.length; i++) {
        const range = ranges[i];
        const last = merged[merged.length - 1];
        if (range[0] <= last[1]) {
            last[1] = Math.max(last[1], range[1]);
        }
        else {
            merged.push(range);
        }
    }

    const parts: HighlightPart[] = [];
    let cursor = 0;
    for (const [start, end] of merged) {
        if (start > cursor) {
            parts.push({matched: false, text: value.slice(cursor, start)});
        }
        parts.push({matched: true, text: value.slice(start, end)});
        cursor = end;
    }

    if (cursor < value.length) {
        parts.push({matched: false, text: value.slice(cursor)});
    }

    return parts;
}