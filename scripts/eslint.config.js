import {defineConfig} from "eslint/config";
import base from "../eslint.config.js";


export default defineConfig(
    base,
    {
        rules: {
            "no-console": "off",
        }
    }
);
