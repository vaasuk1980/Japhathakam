/**
 * ============================================================
 * JAPHATHAKAM
 * Presentation Formatter
 * ------------------------------------------------------------
 * Formatter : DateTimeFormatter
 * Layer     : Presentation
 *
 * Responsibility:
 *   Converts a UTC Julian Day into a local-time display string
 *   using the birth's timezone offset.
 * ============================================================
 */

import swisseph from "@swisseph/node";

class DateTimeFormatter {

    static formatLocal(julianDayUtc, timezoneOffsetHours) {

        if (julianDayUtc === null || julianDayUtc === undefined) {
            return "";
        }

        const localJulianDay = julianDayUtc + (timezoneOffsetHours / 24);
        const dateTime = swisseph.julianDayToDate(localJulianDay);

        const pad = (value) => String(value).padStart(2, "0");

        const hour = Math.floor(dateTime.hour);
        const minute = Math.round((dateTime.hour - hour) * 60);

        return `${pad(dateTime.day)}-${pad(dateTime.month)}-${dateTime.year} ${pad(hour)}:${pad(minute)}`;

    }

}

export default DateTimeFormatter;
