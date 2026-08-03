const MAX_NAME_LENGTH = 32;

/**
 * Turns `?studentName=ashley%20jantjies` into "Ashley Jantjies".
 * Strips anything that is not a letter, space, apostrophe or hyphen so the
 * greeting can never be used to inject odd content into the page.
 */
export function formatStudentName(rawValue?: string | string[]): string {
    const value = Array.isArray(rawValue) ? rawValue[0] : rawValue;
    if (!value) return "";

    return value
        .replace(/[^\p{L}\p{M}\s'-]/gu, " ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, MAX_NAME_LENGTH)
        .split(" ")
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}