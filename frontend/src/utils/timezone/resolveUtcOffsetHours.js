const MILLISECONDS_PER_HOUR = 3600000;

function offsetHoursAtInstant(timezoneId, instant) {

    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: timezoneId,
        timeZoneName: "longOffset",
    }).formatToParts(instant);

    const offsetPart =
        parts.find((part) => part.type === "timeZoneName")?.value ?? "GMT";

    return parseGmtOffset(offsetPart);

}

function parseGmtOffset(gmtString) {

    const match = /GMT([+-])(\d{1,2})(?::(\d{2}))?/.exec(gmtString);

    if (!match) {
        return 0;
    }

    const sign = match[1] === "-" ? -1 : 1;
    const hours = Number(match[2]);
    const minutes = Number(match[3] || 0);

    return sign * (hours + minutes / 60);

}

function todayIsoDate() {

    const now = new Date();
    const pad = (value) => String(value).padStart(2, "0");

    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

}

/**
 * Resolves the exact numeric UTC offset (hours, e.g. 5.5) for an
 * IANA timezone id AT a specific local date/time. Deliberately NOT
 * a fixed per-place constant — many places observe DST (and DST
 * rules have themselves changed historically), so the same place
 * can have a different offset depending on the birth date.
 *
 * Two-pass: pass 1 treats the local wall-clock time as if it were
 * UTC just to get a first-guess offset for that calendar date;
 * pass 2 re-derives the offset at the refined UTC instant, which
 * corrects the rare case where pass 1 landed on the wrong side of
 * a DST transition.
 *
 * @param {string} timezoneId - IANA timezone, e.g. "Asia/Kolkata"
 * @param {string} [dateOfBirth] - "YYYY-MM-DD", defaults to today
 * @param {string} [timeOfBirth] - "HH:MM", defaults to noon
 * @returns {number|null}
 */
export default function resolveUtcOffsetHours(timezoneId, dateOfBirth, timeOfBirth) {

    if (!timezoneId) {
        return null;
    }

    const [year, month, day] = (dateOfBirth || todayIsoDate()).split("-").map(Number);
    const [hour, minute] = (timeOfBirth || "12:00").split(":").map(Number);

    if ([year, month, day].some((value) => Number.isNaN(value))) {
        return null;
    }

    const approxInstant = new Date(Date.UTC(year, month - 1, day, hour || 0, minute || 0));
    const guessOffset = offsetHoursAtInstant(timezoneId, approxInstant);

    const refinedInstant = new Date(approxInstant.getTime() - guessOffset * MILLISECONDS_PER_HOUR);

    return offsetHoursAtInstant(timezoneId, refinedInstant);

}
