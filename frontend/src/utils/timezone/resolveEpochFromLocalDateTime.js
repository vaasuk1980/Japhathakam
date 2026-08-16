const MILLISECONDS_PER_HOUR = 3600000;

/**
 * Inverse of localDateParts.js: converts a local wall-clock date/time
 * at a given UTC offset into a Unix epoch millisecond instant.
 * Reads the date/time strings as if they were already UTC, then
 * shifts back by the offset — the mirror image of localDateParts'
 * own "shift forward, then read as UTC" technique.
 *
 * @param {string} dateStr - "YYYY-MM-DD"
 * @param {string} timeStr - "HH:MM"
 * @param {number} timezoneOffsetHours
 * @returns {number|null}
 */
export default function resolveEpochFromLocalDateTime(dateStr, timeStr, timezoneOffsetHours) {

    if (!dateStr || !timeStr || timezoneOffsetHours === null || timezoneOffsetHours === undefined) {
        return null;
    }

    const [year, month, day] = dateStr.split("-").map(Number);
    const [hour, minute] = timeStr.split(":").map(Number);

    if ([year, month, day, hour, minute].some((value) => Number.isNaN(value))) {
        return null;
    }

    const asIfUtc = Date.UTC(year, month - 1, day, hour, minute);

    return asIfUtc - Number(timezoneOffsetHours) * MILLISECONDS_PER_HOUR;

}
