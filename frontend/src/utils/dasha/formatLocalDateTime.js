/* ==========================================================
   Formats a Unix epoch millisecond timestamp as a birth-local
   "DD-MM-YYYY HH:MM" string — mirrors the backend's
   DateTimeFormatter.formatLocal(julianDayUtc, timezoneOffsetHours)
   exactly, so client-computed Dasha levels (Pratyantardasha and
   deeper) display identically to the server-computed ones
   (Mahadasha/Antardasha).
========================================================== */

import localDateParts from "../timezone/localDateParts";

export default function formatLocalDateTime(epochMs, timezoneOffsetHours) {

    if (epochMs === null || epochMs === undefined) {
        return "";
    }

    const { year, month, day, hour, minute } = localDateParts(epochMs, timezoneOffsetHours);

    const pad = (value) => String(value).padStart(2, "0");

    return `${pad(day)}-${pad(month)}-${year} ${pad(hour)}:${pad(minute)}`;

}
