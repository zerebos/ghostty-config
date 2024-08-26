export type HexColor = `#${string}`;
export type RgbArray = [number, number, number];
export type HsvArray = [number, number, number];
export type HsvObj = {hue: number, saturation: number, value: number};

export function luminosity(color: HexColor) {
    const int = parseInt(color.substring(1), 16);
    const red = int >> 16 & 0xFF;
    const green = int >> 8 & 0xFF;
    const blue = int >> 0 & 0xFF;

    return (0.2126 * red) + (0.7152 * green) + (0.0722 * blue);
}


export function isDark(color: HexColor) {
    return luminosity(color) < 128;
}

/**
 * Converts an HSV color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes h, s, and v are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 */
export function hsvToRgb(hue: number, saturation: number, value: number): RgbArray {
    const i = Math.floor(hue * 6);
    const f = hue * 6 - i;
    const p = value * (1 - saturation);
    const q = value * (1 - f * saturation);
    const t = value * (1 - (1 - f) * saturation);

    let r, g, b;
    switch (i % 6) {
        /* eslint-disable no-sequences, @typescript-eslint/no-unused-expressions */
        case 0: r = value, g = t, b = p; break;
        case 1: r = q, g = value, b = p; break;
        case 2: r = p, g = value, b = t; break;
        case 3: r = p, g = q, b = value; break;
        case 4: r = t, g = p, b = value; break;
        default:
        case 5: r = value, g = p, b = q; break;
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

export function rgbToHsv(red: number, green: number, blue: number): HsvObj {
    const percentRed = red / 255;
    const percentGreen = green / 255;
    const percentBlue = blue / 255;
    const cMax = Math.max(percentRed, percentGreen, percentBlue);
    const cMin = Math.min(percentRed, percentGreen, percentBlue);
    const delta = cMax - cMin;

    let newHue = 0;
    if (percentRed === cMax) newHue = 60 * (((percentGreen - percentBlue) / delta) % 6) / 360;
    else if (percentGreen === cMax) newHue = 60 * (((percentBlue - percentRed) / delta) + 2) / 360;
    else if (percentBlue === cMax) newHue = 60 * (((percentRed - percentGreen) / delta) + 4) / 360;
    if (newHue < 0) newHue += 6;

    const hue = delta === 0 ? 0 : newHue;
    const saturation = cMax === 0 ? 0 : delta / cMax;
    const value = cMax;
    return {hue, saturation, value};
}


export function rgbToHex(red: number, green: number, blue: number): HexColor {
    const get = (color: number) => color.toString(16).padStart(2, "0").toUpperCase();
    return `#${get(red)}${get(green)}${get(blue)}`;
}

export function hexToRgb(string: HexColor): RgbArray {
    const hex = string.slice(1);
    const get = (s: number, e: number) => parseInt(hex.substring(s, e), 16);
    return [get(0, 2), get(2, 4), get(4,6)];
}