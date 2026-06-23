<div align="center">
  <a href="https://ghostty.zerebos.com"><img src="./src/lib/images/icon.webp" height="128" alt="Ghostty Config"></a>
  <h1 align="center" style="border:0;">Ghostty Config</h1>
  <p align="center">A beautiful intuitive configuration generator for <a href="https://ghostty.org/" target="_blank">Ghostty</a> terminal.</p>

[![GitHub Stars](https://www.shieldcn.dev/github/stars/zerebos/ghostty-config.svg?variant=secondary&size=sm)](https://github.com/zerebos/ghostty-config/stargazers)
[![Build](https://www.shieldcn.dev/github/ci/zerebos/ghostty-config.svg?variant=secondary&size=sm)](https://github.com/zerebos/ghostty-config/actions)
[![Framework · Svelte](https://www.shieldcn.dev/badge/Framework-Svelte-FF3E00.svg?logo=svelte&variant=branded&size=sm)](https://svelte.dev)
[![Hosting · Cloudflare Workers](https://www.shieldcn.dev/badge/Hosting-Cloudflare_Workers-F38020.svg?logo=cloudflare&variant=branded&size=sm)](https://ghostty.zerebos.com)

  <img src="https://github.com/user-attachments/assets/b0937e12-d7ef-4bd1-a007-e468da2f7dfc" alt="Preview of the terminal colorizer">
</div>


## Overview

> [!NOTE]
> This tool is still under active development. Features may change and not everything on the roadmap is implemented yet. Feedback, ideas, and bug reports are welcome via the [GitHub issue tracker](https://github.com/zerebos/ghostty-config/issues).

Ghostty Config is a beautiful web-based configuration generator designed to make customizing your [Ghostty](https://ghostty.org/) terminal effortless. Rather than manually editing text files and worrying about formatting and syntax, Ghostty Config allows you to visually adjust settings, preview changes in real time and export a ready-to-use config.

Under the hood, every setting is driven by a typed schema derived directly from Ghostty's own config specification. The tool tracks only the values that differ from Ghostty's defaults, so the exported config stays minimal and easy to read. Settings are organized into categories that derive from Ghostty's config, and each one carries inline documentation, platform restrictions, and version metadata sourced from the schema.

This project is built with [Svelte](https://svelte.dev) + [TypeScript](https://www.typescriptlang.org/) via [Bun](https://bun.sh). It is automatically deployed with Cloudflare Workers so the hosted version is always up to date.

**Try it now:** [ghostty.zerebos.com](https://ghostty.zerebos.com)


## Features

- **Interactive settings editor:** Tweak fonts, colors, cursor styles, transparency, blur, and much more across organized, categorized setting pages.
- **Font playground:** Experiment with JetBrains Mono, Nerd Fonts, or any custom font and see the result live.
- **Live previews:** Instant visual demos for cursors, text selections, app icons, and color palettes as you edit.
- **Keybinding builder:** Build and validate keybindings with an interactive trigger/action editor, including sequence, prefix, and chained-action support.
- **Import & export:** Paste, upload, copy, or download configs; only settings that differ from defaults are included in the output.
- **Config sharing:** Share configs with others via a shareable URL (falls back to clipboard copy for large configs).
- **Help info:** Detailed documentation shown inline for every individual setting.
- **Indicators:** Per-setting badges showing required platform (macOS, Linux, GTK) and minimum Ghostty version.
- **Sidebar search:** Instantly browse and jump to any setting, mirroring macOS native preferences UI.
- **Reset to defaults:** Restore any individual setting to its default value at any time.


## Tech Stack

- [Bun](https://bun.sh/): A modern JavaScript and TypeScript runtime
- [Svelte](https://svelte.dev): UI framework for fast, reactive interfaces
- [TypeScript](https://www.typescriptlang.org/): Strong typing for maintainable code
- [Vite](https://vite.dev/): Lightning‑fast bundler and dev server
- [Cloudflare](https://developers.cloudflare.com/workers/): CI/CD for automated deployment


## Installation (Local Development)

Simply clone the repo and run locally:
```bash
git clone https://github.com/zerebos/ghostty-config.git
cd ghostty-config
bun install
bun run dev
```
Then open `http://localhost:5173` in your browser when prompted.

Other useful commands:
```bash
bun run build    # production build (output under build/)
bun run preview  # serve the production build locally
bun run check    # Svelte + TypeScript type checking
bun run lint     # ESLint
bun run test     # Vitest unit tests
```


## Deployment

The only automated deployment built-in is via Cloudflare Workers which automatically deploys to [ghostty.zerebos.com](https://ghostty.zerebos.com) on every push to the `main` branch. If you want to self-host, the static files will be available under `build/` after following the steps above to build.


## Roadmap

- [x] Custom settings support
- [x] Terminal preview
- [x] Font playground
- [x] Import & export
- [x] Basic keybind settings
- [x] Editable color pickers
- [x] Update for Ghostty 1.1
- [x] Update for Ghostty 1.2
- [x] Update for Ghostty 1.3
- [x] Update for Ghostty 1.4-nightly
- [x] Icon customization
- [x] Keybind builder and validation
- [x] In-app help documentation
- [x] Resetting individual settings
- [x] Sidebar search like native
- [x] Platform indicators
- [x] Version indicators
- [x] Shareable URLs

**Near-term**
- [ ] Command palette builder (guided UI for `command-palette-entry` settings)
- [ ] Multi-entry setting support (settings like `font-feature` that repeat in the config)
- [ ] Full schema-driven custom setting types matching Ghostty's type system
- [ ] Community presets for quick theme/workflow setup
- [ ] Unit tests for import/export flows

**Long-term**
- [ ] Rich interactive terminal playground
- [ ] Desktop version for direct config file integration



## Contributing

See the [CONTRIBUTING](./CONTRIBUTING.md) documentation for more info.


## License

Licensed under the [Apache‑2.0 License](https://github.com/zerebos/ghostty-config/blob/main/LICENSE).


## Star History

If you find Ghostty Config useful, please consider starring the repo to help others discover it!

<p align="center">
  <a href="https://star-history.com/#zerebos/ghostty-config&Date">
   <picture>
     <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=zerebos/ghostty-config&type=Date&theme=dark" />
     <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=zerebos/ghostty-config&type=Date" />
     <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=zerebos/ghostty-config&type=Date" />
   </picture>
  </a>
</p>
