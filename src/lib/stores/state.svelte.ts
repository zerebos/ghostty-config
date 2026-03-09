interface AppState {
    title: string;
    selectedPresetId: string;
}

const app: AppState = $state({
    title: "Home",
    selectedPresetId: "nord",
});

export default app;