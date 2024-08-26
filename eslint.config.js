import js from "@eslint/js";
import ts from "typescript-eslint";
import svelte from "eslint-plugin-svelte";
import prettier from "eslint-config-prettier";
import globals from "globals";

/** @type {import('eslint').Linter.Config[]} */
export default [
    js.configs.recommended,
    ...ts.configs.recommended,
    ...svelte.configs["flat/recommended"],
    prettier,
    ...svelte.configs["flat/prettier"],
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node
            }
        }
    },
    {
        files: ["**/*.svelte"],
        languageOptions: {
            parserOptions: {
                parser: ts.parser
            }
        }
    },
    {
        ignores: ["build/", ".svelte-kit/", "dist/", "custom/", "config/", "sverdle/"]
    },
    {
        rules: {
            "accessor-pairs": "error",
            "block-spacing": ["error", "never"],
            "brace-style": ["error", "stroustrup", {allowSingleLine: true}],
            "curly": ["error", "multi-line", "consistent"],
            "dot-location": ["error", "property"],
            "dot-notation": "error",
            "func-call-spacing": "error",
            "handle-callback-err": "error",
            "key-spacing": "error",
            "keyword-spacing": "error",
            "new-cap": ["error", {newIsCap: true}],
            "no-array-constructor": "error",
            "no-caller": "error",
            "no-console": "error",
            "no-duplicate-imports": "error",
            "no-else-return": "error",
            "no-eval": "error",
            "no-floating-decimal": "error",
            "no-implied-eval": "error",
            "no-iterator": "error",
            "no-label-var": "error",
            "no-labels": "error",
            "no-lone-blocks": "error",
            "no-mixed-spaces-and-tabs": "error",
            "no-multi-spaces": "error",
            "no-multi-str": "error",
            "no-new": "error",
            "no-new-func": "error",
            "no-new-object": "error",
            "no-new-wrappers": "error",
            "no-octal-escape": "error",
            "no-path-concat": "error",
            "no-proto": "error",
            "no-prototype-builtins": "off",
            "no-redeclare": ["error", {builtinGlobals: true}],
            "no-self-compare": "error",
            "no-sequences": "error",
            "no-shadow": ["warn", {builtinGlobals: false, hoist: "functions"}],
            "no-tabs": "error",
            "no-template-curly-in-string": "error",
            "no-throw-literal": "error",
            "no-undef": "error",
            "no-undef-init": "error",
            "no-unmodified-loop-condition": "error",
            "no-unneeded-ternary": "error",
            "no-useless-call": "error",
            "no-useless-computed-key": "error",
            "no-useless-constructor": "error",
            "no-useless-rename": "error",
            "no-var": "error",
            "no-whitespace-before-property": "error",
            "object-curly-spacing": ["error", "never", {objectsInObjects: false}],
            "object-property-newline": ["error", {allowAllPropertiesOnSameLine: true}],
            "operator-linebreak": [
                "error",
                "none",
                {overrides: {"?": "before", ":": "before", "&&": "before"}}
            ],
            "prefer-const": "error",
            "quote-props": ["error", "consistent-as-needed", {keywords: true}],
            "quotes": ["error", "double", {allowTemplateLiterals: true}],
            "rest-spread-spacing": "error",
            "semi": "error",
            "semi-spacing": "error",
            "space-before-blocks": "error",
            "space-in-parens": "error",
            "space-infix-ops": "error",
            "space-unary-ops": [
                "error",
                {words: true, nonwords: false, overrides: {"typeof": false}}
            ],
            "spaced-comment": ["error", "always", {exceptions: ["-", "*"]}],
            "template-curly-spacing": "error",
            "wrap-iife": ["error", "inside"],
            "yield-star-spacing": "error",
            "yoda": "error"
        },
    },
    {
        rules: {
            "@typescript-eslint/no-unused-vars": ["error", {argsIgnorePattern: "^_", varsIgnorePattern: "^_"}]
        }
    },
    {
        rules: {
            // Errors
            "svelte/infinite-reactive-loop": "error",
            "svelte/no-dom-manipulating": "off",
            "svelte/no-dupe-else-if-blocks": "error",
            "svelte/no-dupe-on-directives": "error",
            "svelte/no-dupe-style-properties": "error",
            "svelte/no-dupe-use-directives": "error",
            "svelte/no-dynamic-slot-name": "error",
            "svelte/no-export-load-in-svelte-module-in-kit-pages": "error",
            "svelte/no-not-function-handler": "error",
            "svelte/no-object-in-text-mustaches": "error",
            "svelte/no-reactive-reassign": "error",
            "svelte/no-shorthand-style-property-overrides": "error",
            "svelte/no-store-async": "error",
            "svelte/no-unknown-style-directive-property": "error",
            "svelte/require-store-callbacks-use-set-param": "error",
            "svelte/require-store-reactive-access": "error",
            "svelte/valid-compile": "error",
            "svelte/valid-prop-names-in-kit-pages": "error",

            // Security
            "svelte/no-at-html-tags": "error",
            "svelte/no-target-blank": "error",

            // Best Practices
            "svelte/block-lang": ["error", {script: "ts"}],
            "svelte/button-has-type": "error",
            "svelte/no-at-debug-tags": "error",
            "svelte/no-ignored-unsubscribe": "error",
            "svelte/no-immutable-reactive-statements": "error",
            "svelte/no-inline-styles": "off",
            "svelte/no-reactive-functions": "error",
            "svelte/no-reactive-literals": "error",
            "svelte/no-svelte-internal": "error",
            "svelte/no-unused-class-name": "error",
            "svelte/no-unused-svelte-ignore": "error",
            "svelte/no-useless-mustaches": "error",
            "svelte/prefer-destructured-store-props": "error",
            "svelte/require-each-key": "error",
            "svelte/require-event-dispatcher-types": "error",
            "svelte/require-optimized-style-attribute": "error",
            "svelte/require-stores-init": "error",
            "svelte/valid-each-key": "error",

            // Stylistic Issues
            "svelte/derived-has-same-inputs-outputs": "error",
            "svelte/first-attribute-linebreak": ["error", {multiline: "below", singleline: "beside"}],
            "svelte/html-closing-bracket-spacing": "error",
            "svelte/html-quotes": ["error", {prefer: "double"}],
            "svelte/html-self-closing": ["error", {"void": "always", "component": "always", "svelte": "always", "normal": "ignore"}],
            "svelte/indent": "off",
            "svelte/max-attributes-per-line": "off",
            "svelte/mustache-spacing": "error",
            "svelte/no-extra-reactive-curlies": "error",
            // "svelte/no-restricted-html-elements": "error",
            "svelte/no-spaces-around-equal-signs-in-attribute": "error",
            "svelte/prefer-class-directive": ["error", {prefer: "always"}],
            "svelte/prefer-style-directive": "error",
            "svelte/shorthand-attribute": "error",
            "svelte/shorthand-directive": "error",
            "svelte/sort-attributes": "off",
            "svelte/spaced-html-comment": "error",

            // Extension Rules
            "svelte/no-inner-declarations": "error",
            "svelte/no-trailing-spaces": "error",

            // SvelteKit
            "svelte/no-goto-without-base": "error",

            // System
            "svelte/comment-directive": ["error", {reportUnusedDisableDirectives: true}],
            "svelte/system": "error",
        },
        languageOptions: {
            globals: {
                $state: false
            }
        }
    }
];
