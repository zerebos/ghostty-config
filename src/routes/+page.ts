// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
// export const prerender = true;

export const load = async () => {
    const apiUrl = "https://api.github.com/repos/mbadolato/iTerm2-Color-Schemes/contents/ghostty";

    const response = await fetch(apiUrl);

    if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
    }

    const themeFiles = await response.json();

    return {themeFiles};
};
