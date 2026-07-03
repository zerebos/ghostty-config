package main

import (
	"embed"
	"io/fs"
	"log"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

// The SvelteKit desktop build (bun run build:desktop) is emitted into frontend/dist and
// embedded here so the shipped binary is fully self-contained and works offline.
//
//go:embed all:frontend/dist
var assets embed.FS

func main() {
	app := NewApp()

	// The embedded FS is rooted at the repository, so serve the dist subtree as the web root.
	dist, err := fs.Sub(assets, "frontend/dist")
	if err != nil {
		log.Fatal(err)
	}

	err = wails.Run(&options.App{
		Title:     "Ghostty Config",
		Width:     760,
		Height:    780,
		MinWidth:  640,
		MinHeight: 640,
		AssetServer: &assetserver.Options{
			Assets: dist,
		},
		OnStartup: app.startup,
		Bind: []any{
			app,
		},
	})
	if err != nil {
		log.Fatal(err)
	}
}
