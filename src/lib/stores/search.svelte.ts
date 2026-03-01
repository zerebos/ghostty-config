interface SearchState {
    query: string;
    selectedIndex: number;
    highlightedSettingId: string | null;
}

const search: SearchState = $state({
    query: "",
    selectedIndex: 0,
    highlightedSettingId: null
});

export function clearSearch() {
    search.query = "";
    search.selectedIndex = 0;
}

export function setHighlightedSetting(id: string | null) {
    search.highlightedSettingId = id;
}

export function clearHighlightedSetting() {
    search.highlightedSettingId = null;
}

export default search;
