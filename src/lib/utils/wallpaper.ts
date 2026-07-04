/**
 * Runtime wallpaper sampling.
 *
 * Reads the average color of an image (the web build's wallpaper) so the app's surfaces can be
 * hue-tinted to match it, mirroring how macOS tints its chrome. Canvas-based, so this only runs
 * in the browser; it resolves to `null` when sampling isn't possible.
 */

import {rgbToHsv, type HsvObj} from "$lib/utils/colors";

/**
 * Sample the average color of an image and return it as HSV. `size` controls the resolution the
 * image is downscaled to before averaging (smaller is faster and naturally blurs outliers).
 */
export async function sampleImageHsv(src: string, size = 32): Promise<HsvObj | null> {
    if (typeof document === "undefined") return null;

    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = src;

    try {
        await image.decode();
    }
    catch {
        return null;
    }

    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d", {willReadFrequently: true});
    if (!ctx) return null;

    ctx.drawImage(image, 0, 0, size, size);

    let pixels: Uint8ClampedArray;
    try {
        pixels = ctx.getImageData(0, 0, size, size).data;
    }
    catch {
        // Tainted canvas (cross-origin without CORS) — can't read back.
        return null;
    }

    let r = 0;
    let g = 0;
    let b = 0;
    let count = 0;
    for (let i = 0; i < pixels.length; i += 4) {
        if (pixels[i + 3] === 0) continue; // skip fully transparent pixels
        r += pixels[i];
        g += pixels[i + 1];
        b += pixels[i + 2];
        count++;
    }

    if (!count) return null;
    return rgbToHsv(Math.round(r / count), Math.round(g / count), Math.round(b / count));
}
