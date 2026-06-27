# AGENTS.md: Ghostty Config

Operating guide for automated agents working in this repository. Read this before making any changes.

## Quick orientation

- **Runtime**: Bun ≥ 1.3 required. All commands run from the repo root.
- **Module system**: `"type": "module"` ES imports only, no `require`.
- **Framework**: Svelte 5 with runes. This is **not** Svelte 3/4. Do not use `writable`, `derived`, `readable`, or any legacy store primitives. See the Svelte 5 section below.

## Required checks: run before marking anything ready

```bash
bun run check   # svelte-kit sync + svelte-check (type errors)
bun run lint    # ESLint strict flat config
bun run test    # unit tests via Bun
```

All three must pass cleanly. Do not open or mark a PR ready if any fail.

## Architecture: read before touching settings

Three files form the core of the settings system with strict relationships between them.

### `src/lib/settings/types.ts`

Defines all setting type shapes as a discriminated union (`SwitchSetting | TextSetting | DropdownSetting | ...`), the `SettingDef` union, `SettingsRegistry`, and the `TypeToValue<T>` mapped type that maps a `type` string literal to its runtime value type.

### `src/lib/settings/registry.ts`

The flat camelCase-keyed record of every setting. The export pattern is:

```ts
export const registry = { ... } satisfies SettingsRegistry;
```

**`satisfies` without `as const` is intentional and must be preserved.** `as const` makes array fields (like `options`) readonly, breaking the initializers that assign to them at runtime. The `SettingsSchema` mapped type at the bottom of this file widens only the `default` field via `TypeToValue`, allowing initializers to mutate defaults without `@ts-expect-error`.

### `src/lib/settings/navigation.ts`

A typed tree of panels → groups → setting keys that drives the sidebar UI. All keys are camelCase registry identifiers. `validateNavigation()` runs at import time in dev and throws if:

- any key in the nav tree doesn't exist in the registry (typo protection)
- any registry key isn't referenced anywhere in the nav tree (exhaustiveness)

**Adding a setting to `registry.ts` without placing it in `navigation.ts` will throw at dev startup.** Do not add a bypass or suppress this validation.

### `src/lib/settings/initializers.ts`

Populates fields that require runtime data: theme option lists, macOS icon option lists, etc. Sync initializers run first via `runSyncInitializers()`; async ones after. Add new runtime-populated options here, do not mutate the registry from a component.

### `src/lib/stores/config.svelte.ts`

Live config state as a Svelte 5 `$state` object. Key exports:

- `config` - the live state object
- `defaults` - static defaults snapshot used for diffing
- `diff()` - returns only keys differing from defaults; the serialization source of truth
- `diffFromDefaults(conf)` - same logic applied to an arbitrary config object (import preview)
- `load(conf)` - merges a parsed config into live state
- `setColorScheme(name)` / `resetColorScheme()` - applies/clears a theme without leaking theme colors into serialized output
- `resetSetting(key)` / `isNonDefault(key)` - per-setting utilities

## Generated files: never hand-edit

| File | Generator |
|------|-----------|
| `src/lib/data/themes.ts` | `scripts/generate-themes.ts` |
| `src/lib/data/macicons.ts` | `scripts/generate-macicons.ts` |

These are overwritten on the next CI sync. If the output needs to change, edit the generator script, not the generated file.

## Svelte 5: patterns in use

| Purpose | Use | Do not use |
|---------|-----|------------|
| Reactive state | `$state(value)` | `writable(value)` |
| Derived values | `$derived(expr)` / `$derived.by(() => ...)` | `derived(store, fn)` |
| Side effects | `$effect(() => ...)` | `$: statement` |
| Component props | `let { prop } = $props()` | `export let prop` |
| Two-way bindable props | `$bindable()` in props destructure | - |
| Store-like modules | `.svelte.ts` files exporting `$state` values and mutation functions | Writable store exports |

The ESLint config does not catch all legacy store usage, be deliberate.

## Other conventions

**Async handlers**: use `withPendingGuard(fn)` from `$lib/utils/debounce` for anything that must not fire concurrently. Use `debounce(fn, ms)` (leading-edge by default in this codebase) for rate-limiting sync actions.

**User feedback**: use the toast system (`success()` / `error()` from `$lib/stores/toasts.svelte`) for all success/failure feedback. Do not introduce inline button label swapping or other ad-hoc feedback patterns.

**Serialization**: only values differing from defaults appear in the generated config output. `diff()` handles this, do not add serialization logic elsewhere.

**Setting keys**: Ghostty config keys are `kebab-case` (e.g. `font-size`). Registry keys are `camelCase` (e.g. `fontSize`). The `key` field on each registry entry is the Ghostty string; the JS property name is the camelCase identifier. These must remain in sync with Ghostty's actual config schema.

**Code style quick reference**:
- Double quotes for strings, semicolons everywhere
- `brace-style: stroustrup` (braces on multi-line blocks, allowed to omit for single-line)
- `import type` when only types are needed
- Grouped imports: external → `$lib` → relative, alphabetical within each group
- `class:foo={condition}` not manual class string concatenation

## AI self-disclosure

If you are an autonomous agent submitting a PR where the human operator did not personally review the output before submission, say so explicitly in the PR description. For example:

> This PR was generated by [agent/tool]. The human operator [reviewed the diff and ran the checks locally / did not review the output before submission].

This is a transparency expectation, not a penalty against AI-assisted work. It helps calibrate review effort. PRs that appear to be unreviewed agent output without this disclosure will be closed without detailed feedback.