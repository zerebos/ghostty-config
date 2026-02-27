interface AppState {
    title: string;
    floatingTerminalOpen: boolean;
}

const app: AppState = $state({
    title: "Home",
    floatingTerminalOpen: false,
});

export default app;