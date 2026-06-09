<div align="center">
  <a href="https://zerebos.github.io/ghostty-config"><img src="./src/lib/images/icon.webp" height="128" alt="Ghostty Config"></a>
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
> This tool and the list of features and future improvements is not complete--even the name is up for debate! Please give your feedback, ideas, and report bugs via the [github issue tracker](https://github.com/zerebos/ghostty-config/issues).

Ghostty Config is a beautiful web-based configuration generator designed to make customizing your [Ghostty](https://ghostty.org/) terminal effortless. Rather than manually editing text files and worrying about formatting and syntax, Ghostty Config allows you to visually adjust settings, preview changes in real time and export a ready-to-use config.

This project is built with [Svelte](https://svelte.dev) + [TypeScript](https://www.typescriptlang.org/) via [Bun](https://bun.sh). It is automatically deployed with Cloudflare Workers so the hosted version is always up to date.

**Try it now:** [ghostty.zerebos.com](https://ghostty.zerebos.com)


## Features

- **Interactive settings editor:** Easily tweak fonts, colors, cursor styles, transparency, blur, and more.
- **Font playground:** Experiment with JetBrains Mono, Nerd Fonts, or any custom font.
- **Live previews:** See instant demos of cursors, selections, app icons, and color palettes.
- **Keybinding builder:** Build and validate keybindings with a custom interface.
- **One‑click export:** Generate a clean Ghostty configuration file to drop into your setup.
- **Config sharing:** Share and import configs with others via url.
- **Help info:** Get detailed information on every setting.
- **Indicators:** See which platform and Ghostty version is needed for each setting.
- **Sidebar search:** Quickly browse and go to any setting.
- **Automatic deployment:** Every push to main updates the hosted tool via Cloudflare Workers.


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


## Deployment

The only automated deployment built-in is via Cloudflare Workers which automatically deploys to [ghostty.zerebos.com](https://ghostty.zerebos.com) on every push to the `main` branch. If you want to self-host the files for a static website will be available under `build/` after following the steps above to build.


## Roadmap

- [x] Custom settings support
- [x] Terminal preview
- [x] Font playground
- [x] Import & export
- [x] Update for Ghostty 1.1
- [x] Basic keybind settings
- [x] Editable color pickers
- [x] Update for Ghostty 1.2
- [x] Update for Ghostty 1.3 (nightly)
- [x] Icon customization
- [x] Keybinding validation
- [x] In-app help documentation
- [x] Resetting individual settings
- [x] Sidebar search like native
- [x] Platform indicators
- [x] Version indicators
- [ ] Detailed terminal playground
- [ ] Command palette builder
- [ ] Desktop version via Wails
- [ ] Community presets for quick setup
- [ ] "Repeating" settings types
- [ ] Advanced custom settings types



## Contributing

Feedback, ideas, and bug reports are welcome!
- Open an issue in the [GitHub tracker](https://github.com/zerebos/ghostty-config/issues)
- Submit a pull request with improvements


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
