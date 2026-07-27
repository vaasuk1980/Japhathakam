const MILLISECONDS_PER_HOUR = 3600000;

/**
 * Extracts the local (birth-timezone) wall-clock Y/M/D/H/M for a
 * Unix epoch millisecond instant — shift by the offset, then read
 * the shifted instant's UTC fields (the offset has already been
 * applied, so "UTC fields" of the shifted timestamp ARE the
 * correct local wall-clock values). Same technique used by
 * formatLocalDateTime, extracted here so age calculations can
 * share it instead of re-parsing a formatted string.
 *
 * @param {number} epochMs
 * @param {number} timezoneOffsetHours
 * @returns {{year:number, month:number, day:number, hour:number, minute:number}}
 *   month is 1-based (1=January).
 */
export default function localDateParts(epochMs, timezoneOffsetHours) {

    const shifted = new Date(epochMs + Number(timezoneOffsetHours) * MILLISECONDS_PER_HOUR);

    return {
        year: shifted.getUTCFullYear(),
        month: shifted.getUTCMonth() + 1,
        day: shifted.getUTCDate(),
        hour: shifted.getUTCHours(),
        minute: shifted.getUTCMinutes(),
    };

}
