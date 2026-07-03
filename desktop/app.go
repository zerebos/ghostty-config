package main

import (
	"context"
	"errors"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
)

// App holds the Wails runtime context and exposes the methods bound into the frontend as
// window.go.main.App.*. Keep the exported method set in sync with the WailsAppBindings
// interface in src/lib/platform/index.ts.
type App struct {
	ctx context.Context
}

// NewApp constructs a fresh App instance.
func NewApp() *App {
	return &App{}
}

// startup captures the Wails runtime context once the app is ready.
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// GetConfigPath returns the absolute path to the Ghostty config file for this platform.
//
// Ghostty follows the XDG base directory spec, so $XDG_CONFIG_HOME/ghostty/config wins when
// set. Otherwise it is ~/Library/Application Support/com.mitchellh.ghostty/config on macOS and
// ~/.config/ghostty/config everywhere else.
func (a *App) GetConfigPath() string {
	if xdg := os.Getenv("XDG_CONFIG_HOME"); xdg != "" {
		return filepath.Join(xdg, "ghostty", "config")
	}

	home, err := os.UserHomeDir()
	if err != nil {
		return ""
	}

	if runtime.GOOS == "darwin" {
		return filepath.Join(home, "Library", "Application Support", "com.mitchellh.ghostty", "config")
	}

	return filepath.Join(home, ".config", "ghostty", "config")
}

// ReadGhosttyConfig returns the contents of the live Ghostty config file. A missing file is
// treated as an empty config rather than an error, so first-run users get a clean slate.
func (a *App) ReadGhosttyConfig() (string, error) {
	path := a.GetConfigPath()
	if path == "" {
		return "", errors.New("could not determine ghostty config path")
	}

	data, err := os.ReadFile(path)
	if err != nil {
		if errors.Is(err, os.ErrNotExist) {
			return "", nil
		}
		return "", err
	}

	return string(data), nil
}

// WriteGhosttyConfig overwrites the live Ghostty config file, creating parent directories as
// needed.
func (a *App) WriteGhosttyConfig(content string) error {
	path := a.GetConfigPath()
	if path == "" {
		return errors.New("could not determine ghostty config path")
	}

	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		return err
	}

	return os.WriteFile(path, []byte(content), 0o644)
}

// LaunchTerminal opens a real Ghostty window. It prefers a `ghostty` binary on PATH and falls
// back to `open -a Ghostty` on macOS where the app may not expose a CLI entry point.
func (a *App) LaunchTerminal() error {
	if path, err := exec.LookPath("ghostty"); err == nil {
		return startDetached(path)
	}

	if runtime.GOOS == "darwin" {
		return startDetached("open", "-a", "Ghostty")
	}

	return fmt.Errorf("ghostty executable not found on PATH")
}

// startDetached launches a command without waiting for it to exit, so the terminal outlives
// this process's request handler.
func startDetached(name string, args ...string) error {
	return exec.Command(name, args...).Start()
}
