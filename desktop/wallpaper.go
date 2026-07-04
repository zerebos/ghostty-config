package main

import (
	"fmt"
	"image"
	// Register the decoders we can average. Anything else (webp, heic, …) yields no color and
	// the frontend falls back to neutral grays.
	_ "image/gif"
	_ "image/jpeg"
	_ "image/png"
	"net/url"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"
)

// GetWallpaperColor returns the average color of the OS desktop wallpaper as a "#RRGGBB"
// string, or an empty string when it can't be determined. It is best-effort and never errors:
// the frontend treats an empty result as "use neutral grays".
func (a *App) GetWallpaperColor() (string, error) {
	path := wallpaperPath()
	if path == "" {
		return "", nil
	}

	hex := averageColor(path)
	return hex, nil
}

// wallpaperPath resolves the current desktop wallpaper file path for the host OS.
func wallpaperPath() string {
	switch runtime.GOOS {
	case "linux":
		return linuxWallpaperPath()
	case "darwin":
		return darwinWallpaperPath()
	case "windows":
		return windowsWallpaperPath()
	default:
		return ""
	}
}

func linuxWallpaperPath() string {
	// GNOME/derivatives expose the wallpaper through gsettings as a file:// URI.
	for _, key := range []string{"picture-uri-dark", "picture-uri"} {
		out, err := exec.Command("gsettings", "get", "org.gnome.desktop.background", key).Output()
		if err != nil {
			continue
		}
		if path := parseFileURI(strings.TrimSpace(string(out))); path != "" {
			return path
		}
	}
	return ""
}

func darwinWallpaperPath() string {
	out, err := exec.Command("osascript", "-e",
		`tell application "System Events" to get picture of current desktop`).Output()
	if err != nil {
		return ""
	}
	return strings.TrimSpace(string(out))
}

func windowsWallpaperPath() string {
	out, err := exec.Command("reg", "query", `HKCU\Control Panel\Desktop`, "/v", "WallPaper").Output()
	if err != nil {
		return ""
	}
	// Output looks like: "    WallPaper    REG_SZ    C:\path\to\wall.jpg"
	if idx := strings.Index(string(out), "REG_SZ"); idx != -1 {
		return strings.TrimSpace(string(out)[idx+len("REG_SZ"):])
	}
	return ""
}

// parseFileURI turns a possibly-quoted file:// URI (or bare path) into a filesystem path.
func parseFileURI(raw string) string {
	raw = strings.Trim(raw, `'"`)
	if raw == "" {
		return ""
	}
	if !strings.HasPrefix(raw, "file://") {
		return raw
	}
	parsed, err := url.Parse(raw)
	if err != nil {
		return ""
	}
	return filepath.FromSlash(parsed.Path)
}

// averageColor decodes an image and returns the average of its pixels as "#RRGGBB". Returns an
// empty string if the file can't be opened or decoded (unsupported format, missing file).
func averageColor(path string) string {
	file, err := os.Open(path)
	if err != nil {
		return ""
	}
	defer file.Close()

	img, _, err := image.Decode(file)
	if err != nil {
		return ""
	}

	bounds := img.Bounds()
	if bounds.Empty() {
		return ""
	}

	// Sample on a coarse grid (~64x64) so huge wallpapers don't cost much.
	stepX := max(1, bounds.Dx()/64)
	stepY := max(1, bounds.Dy()/64)

	var sumR, sumG, sumB, count uint64
	for y := bounds.Min.Y; y < bounds.Max.Y; y += stepY {
		for x := bounds.Min.X; x < bounds.Max.X; x += stepX {
			r, g, b, _ := img.At(x, y).RGBA() // 16-bit per channel
			sumR += uint64(r >> 8)
			sumG += uint64(g >> 8)
			sumB += uint64(b >> 8)
			count++
		}
	}

	if count == 0 {
		return ""
	}
	return fmt.Sprintf("#%02X%02X%02X", sumR/count, sumG/count, sumB/count)
}
