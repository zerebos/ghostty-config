export function countDecimalPlaces(value: string | number | null | undefined): number {
    // Convert to string safely handling undefined or null
    const str = Number(value).toString();

    // Check if the number is in scientific notation (e.g., 1e-7)
    if (str.includes("e")) {
        const [, exponent] = str.split("e");
        return Math.abs(Number(exponent));
    }

    // Check if there is a decimal point
    if (str.includes(".")) {
        return str.split(".")[1].length;
    }

    // It is a whole number
    return 0;
}