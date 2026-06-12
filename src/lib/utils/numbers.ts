export function countDecimalPlaces(value: string | number | null | undefined): number {
    // Convert to string safely handling undefined or null
    const str = Number(value).toString();

    // Check if the number is in scientific notation (e.g., 1e-7)
    // https://en.wikipedia.org/wiki/Significand#Floating-point_mantissa
    if (str.includes("e")) {
        const [mantissa, exponentStr] = str.split("e");
        const exponent = Number(exponentStr);
        if (!Number.isFinite(exponent) || exponent >= 0) return 0;
        const mantissaDecimals = mantissa.includes(".") ? mantissa.split(".")[1].length : 0;
        return Math.abs(exponent) + mantissaDecimals;
    }

    // Check if there is a decimal point
    if (str.includes(".")) {
        return str.split(".")[1].length;
    }

    // It is a whole number
    return 0;
}