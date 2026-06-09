package main

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
)

// App holds the application context and exposes methods to the Wails frontend.
type App struct {
	ctx context.Context
}

// NewApp creates a new App instance.
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved so runtime methods can be called.
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// GetGhosttyConfigPath returns the platform-appropriate path to the Ghostty config file.
// Ghostty follows XDG conventions on all platforms (including macOS).
func (a *App) GetGhosttyConfigPath() (string, error) {
	configDir := os.Getenv("XDG_CONFIG_HOME")
	if configDir == "" {
		home, err := os.UserHomeDir()
		if err != nil {
			return "", fmt.Errorf("cannot determine home directory: %w", err)
		}
		configDir = filepath.Join(home, ".config")
	}
	return filepath.Join(configDir, "ghostty", "config"), nil
}

// ReadGhosttyConfig reads the user's Ghostty config file and returns its contents.
// Returns an empty string (and no error) when the config file does not exist yet.
func (a *App) ReadGhosttyConfig() (string, error) {
	path, err := a.GetGhosttyConfigPath()
	if err != nil {
		return "", err
	}

	data, err := os.ReadFile(path)
	if err != nil {
		if os.IsNotExist(err) {
			return "", nil
		}
		return "", fmt.Errorf("failed to read config: %w", err)
	}

	return string(data), nil
}

// WriteGhosttyConfig writes the provided content to the user's Ghostty config file,
// creating the config directory if it does not already exist.
func (a *App) WriteGhosttyConfig(content string) error {
	path, err := a.GetGhosttyConfigPath()
	if err != nil {
		return err
	}

	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		return fmt.Errorf("failed to create config directory: %w", err)
	}

	if err := os.WriteFile(path, []byte(content), 0o644); err != nil {
		return fmt.Errorf("failed to write config: %w", err)
	}

	return nil
}
