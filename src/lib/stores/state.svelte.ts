interface AppState {
    title: string;
}

const app: AppState = $state({
    title: "Home"
});

export default app;