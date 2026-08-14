const MAX_NAME_LENGTH = 32;

/**
 * Capitalises one word, respecting the punctuation inside names.
 *
 * The whole word is lower-cased first so that a surname typed in caps
 * ("ABRAHAMS") comes back as "Abrahams" - a script face renders full caps as a
 * wall of swashes that is close to unreadable. Splitting on hyphens and
 * apostrophes keeps "Le-Bronn" and "O'Brien" correct rather than "Le-bronn".
 */
function capitaliseNameWord(word: string): string {
    return word
        .toLowerCase()
        .split(/([-'])/)
        .map((part) =>
            part === "-" || part === "'"
                ? part
                : part.charAt(0).toUpperCase() + part.slice(1),
        )
        .join("");
}

/**
 * Turns `?studentName=LE-BRONN%20ABRAHAMS` into "Le-Bronn Abrahams".
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
        .map(capitaliseNameWord)
        .join(" ");
}