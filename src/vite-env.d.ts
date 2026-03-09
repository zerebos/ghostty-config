interface ImportMetaEnv {
    /**
     * Set to "true" (string) by `.env.desktop` when building with `--mode desktop`.
     * Vite always exposes env vars as strings; compare with `=== "true"` rather than
     * using a boolean type so there are no surprising `"false"` truthy coercions.
     */
    readonly VITE_DESKTOP: string | undefined;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
