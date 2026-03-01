import {browser} from "@zerebos/eslint-config";
import ts from "@zerebos/eslint-config-typescript";
import {defineConfig} from "eslint/config";
import {build} from "@zerebos/eslint-config-svelte";
import svelteConfig from "./svelte.config.js";


export default defineConfig(
    defineConfig(
        ...browser,
        ...ts.configs.recommendedWithTypes
    ),
    ...build(svelteConfig),
    {
        languageOptions: {
            globals: {
                __INSTALLER_LICENSE__: "readonly",
            }
        }
    },
    {
        ignores: ["build/", ".svelte-kit/", "dist/", "custom/", "config/", "sverdle/", "notes/"]
    },
);
