package main

import (
	"embed"
	"io/fs"
	"log"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/options/linux"
	"github.com/wailsapp/wails/v2/pkg/options/mac"
	"github.com/wailsapp/wails/v2/pkg/options/windows"
)

// The SvelteKit desktop build (bun run build:desktop) is emitted into frontend/dist and
// embedded here so the shipped binary is fully self-contained and works offline.
//
//go:embed all:frontend/dist
var assets embed.FS

//go:embed build/appicon.png
var icon []byte

func main() {
	app := NewApp()

	// The embedded FS is rooted at the repository, so serve the dist subtree as the web root.
	dist, err := fs.Sub(assets, "frontend/dist")
	if err != nil {
		log.Fatal(err)
	}

	err = wails.Run(&options.App{
		Title: "Ghostty Config",
		// Default size matches the web build's .app-window (--app-width x --app-height).
		Width:  715,
		Height: 740,
		// Lock the width (min == max) so the window only resizes vertically, mirroring the
		// fixed-width web layout; leave the height unbounded.
		MinWidth:  715,
		MaxWidth:  715,
		MinHeight: 480,
		MaxHeight: 0,
		// Frameless: the app draws its own macOS-style window controls and drag region. The
		// transparent background lets the app window's rounded corners become the window's.
		Frameless:        true,
		BackgroundColour: &options.RGBA{R: 0, G: 0, B: 0, A: 0},
		AssetServer:      &assetserver.Options{Assets: dist},
		OnStartup:        app.startup,
		Bind:             []any{app},
		Mac: &mac.Options{
			WebviewIsTransparent: true,
			WindowIsTranslucent:  true,
		},
		Windows: &windows.Options{
			WebviewIsTransparent: true,
			BackdropType:         windows.Acrylic,
		},
		Linux: &linux.Options{
			Icon:                icon,
			WindowIsTranslucent: true,
			ProgramName:         "Ghostty Config",
		},
	})
	if err != nil {
		log.Fatal(err)
	}
}
