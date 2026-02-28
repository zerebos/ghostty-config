interface AppState {
    title: string;
    floatingTerminalRunning: boolean;
    floatingTerminalVisible: boolean;
    floatingTerminalMinimized: boolean;
    floatingTerminalRestoreRequested: boolean;
}

const app: AppState = $state({
    title: "Home",
    floatingTerminalRunning: false,
    floatingTerminalVisible: false,
    floatingTerminalMinimized: false,
    floatingTerminalRestoreRequested: false,
});

export default app;