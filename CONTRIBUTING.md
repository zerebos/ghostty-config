# Contributing to Ghostty Config

Thanks for your interest! A few things to set expectations: this is a solo-maintained project, so reviews may take time. The bar for merging is correctness, consistency with existing patterns, and minimal scope. PRs that expand beyond the stated issue or description will be asked to narrow before review.

## Setup

```bash
git clone https://github.com/zerebos/ghostty-config.git
cd ghostty-config
bun install
bun run dev
```

Requires [Bun](https://bun.sh) ≥ 1.3. Open `http://localhost:5173` when prompted.

## Before opening a PR

All three of these must pass cleanly. PRs that fail any of them will not be reviewed until fixed:

```bash
bun run check   # Svelte + TypeScript type checking
bun run lint    # ESLint
bun run test    # Unit tests
```

For UI changes, include a screenshot or short recording in the PR description showing what you manually verified. The test suite covers logic but not visual or interactive behavior.

## Architecture overview

Understanding how the core files relate to each other will save you significant time.

### The settings system

**`src/lib/settings/types.ts`** defines the discriminated union of all setting types (`SwitchSetting`, `DropdownSetting`, `ColorSetting`, etc.), the `SettingDef` union, `SettingsRegistry`, and the `TypeToValue<T>` mapped type that derives a setting's runtime value type from its `type` string.

**`src/lib/settings/registry.ts`** is the flat, camelCase-keyed record of every setting. It uses:

```ts
export const registry = { ... } satisfies SettingsRegistry;
```

`satisfies` without `as const` is intentional. `as const` makes array fields like `options` readonly, which breaks the initializers that assign to them at runtime. Do not add `as const`. The `SettingsSchema` mapped type at the bottom of this file widens only the `default` field via `TypeToValue`, so initializers can mutate defaults without requiring `@ts-expect-error` everywhere.

**`src/lib/settings/navigation.ts`** is a separate tree that groups registry keys into categories and groups for the sidebar UI. All keys in this tree are camelCase registry identifiers. `validateNavigation()` runs at import time in dev and throws if:
- any key in the nav tree doesn't exist in the registry (typo protection), or
- any registry key isn't referenced anywhere in the nav tree (exhaustiveness check).

This means **adding a setting to `registry.ts` without also placing it in `navigation.ts` will throw immediately at dev startup**. This is intentional, do not add a bypass.

**`src/lib/settings/initializers.ts`** handles runtime population of fields that can't be static, such as theme lists and macOS icon options. Sync initializers run first; async initializers (currently a stub for future font list support) run after. If a new setting needs a dynamic options list, add an initializer here rather than mutating the registry from a component.

### Config state

**`src/lib/stores/config.svelte.ts`** holds the live config as a Svelte 5 `$state` object. Key exports:

- `config` - the live state object, default-export
- `defaults` - the static defaults snapshot, used for diffing
- `diff()` - returns only the keys that differ from defaults; this is the serialization source of truth
- `diffFromDefaults(conf)` - same logic applied to an arbitrary config object (used during import preview)
- `load(conf)` - merges a parsed config into live state
- `setColorScheme(name)` / `resetColorScheme()` - applies or clears a theme without leaking theme-derived colors into the serialized output
- `resetSetting(key)` / `isNonDefault(key)` - per-setting reset and change detection

## Adding a new setting

1. Add the entry to `registry.ts` with the correct `type`, `key` (kebab-case, matching Ghostty's actual config key name exactly), `name`, `description`, and `default`.
2. Add the camelCase key to the appropriate group in `navigation.ts`. `validateNavigation()` will throw at startup if you skip this.
3. If the setting needs runtime-populated options, add a sync initializer in `initializers.ts`.
4. If the setting needs a custom UI component, see below.

The standard components (`Switch`, `Dropdown`, `Range`, `Number`, `Text`, `Color`, `Palette`, `Duration`, `FeatureList`, `DualNumber`, etc.) cover the vast majority of cases. A custom component is justified only when the value in the standard input isn't immediately obvious to the user *and* the setting is used frequently enough to warrant the additional maintenance surface. When in doubt, use a standard component.

## Generated files: do not hand-edit

The following files are produced by scripts and will be overwritten on the next sync:

| File | Generator script |
|------|-----------------|
| `src/lib/data/themes.ts` | `scripts/generate-themes.ts` |
| `src/lib/data/macicons.ts` | `scripts/generate-macicons.ts` |

If the generated output needs to change, change the generator script and not the generated file. PRs that modify generated files directly will be closed.

## Scope

This project generates Ghostty terminal configuration files. It does not modify Ghostty itself. If you've found a bug that is actually Ghostty behavior rather than a config generation issue, it belongs in the [Ghostty issue tracker](https://github.com/ghostty-org/ghostty/issues) instead.

## AI-assisted contributions

AI tools are fine to use. Submitting output with little or no personal review is not.

- **Review the diff yourself.** If you can't explain why each changed line is correct, the PR isn't ready.
- **Run the required checks locally.** Don't rely on CI to catch problems you could catch before pushing.
- **Disclose AI involvement in your PR description.** If an AI wrote a meaningful portion of the code, say so and briefly describe what you reviewed. This isn't meant as a penalty, it's useful context for the reviewer.
- **If you used an autonomous agent with minimal personal review of the output, say that explicitly.** PRs that appear to be unreviewed agent output and don't disclose this will be closed without detailed feedback.