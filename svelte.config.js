import adapter from "@sveltejs/adapter-static";
import {vitePreprocess} from "@sveltejs/vite-plugin-svelte";

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
        adapter: adapter({
            fallback: "404.html"
        }),
        paths: {
            // The commented out part below is if I serve it under zerebos.github.io/<repo>
            // then the BASE_PATH would be set in the workflow to /<repo>
            // but for this project it is being aliased/served at a subdomain root
            base: "" // process.argv.includes("dev") ? "" : process.env.BASE_PATH
        }
    }
};

export default config;
