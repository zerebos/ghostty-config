export type HexColor = `#${string}`;

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