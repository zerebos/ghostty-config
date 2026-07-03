import adapter from "@sveltejs/adapter-static";
import {vitePreprocess} from "@sveltejs/vite-plugin-svelte";

// The desktop (Wails) build reuses the exact same SvelteKit app but embeds the output inside
// a native shell. It writes to a separate directory (so the web `build/` — served by
// Cloudflare and Wrangler — is never touched) and uses an SPA `index.html` fallback so
// client-side routing works when the assets are served from the embedded filesystem.
const desktopBuild = process.env.DESKTOP_BUILD === "1";

/** @type {import('@sveltejs/kit').Config} */
const config = {
    // Consult https://kit.svelte.dev/docs/integrations#preprocessors
    // for more information about preprocessors
    preprocess: vitePreprocess(),
    compilerOptions: {
        runes: true
    },
    kit: {
        // adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
        // If your environment is not supported, or you settled on a specific environment, switch out the adapter.
        // See https://kit.svelte.dev/docs/adapters for more information about adapters.
        adapter: adapter(desktopBuild
            ? {pages: "desktop/frontend/dist", assets: "desktop/frontend/dist", fallback: "index.html"}
            : {fallback: "404.html"}),
        paths: {
            // The commented out part below is if I serve it under zerebos.github.io/<repo>
            // then the BASE_PATH would be set in the workflow to /<repo>
            // but for this project it is being aliased/served at a subdomain root
            base: "" // process.argv.includes("dev") ? "" : process.env.BASE_PATH
        }
    }
};

export default config;
