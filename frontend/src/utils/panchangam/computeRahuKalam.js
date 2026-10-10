/* ==========================================================
   Rahu Kalam — the 1/8th of the daytime (sunrise → sunset) that
   is inauspicious for starting new work. Which eighth it is
   depends only on the weekday:

     Sun 8th · Mon 2nd · Tue 7th · Wed 5th · Thu 6th · Fri 4th ·
     Sat 3rd

   (Index 0 = Sunday, matching Date#getDay().) Sunrise/sunset come
   in as "HH:MM" strings from the sky snapshot.
========================================================== */

const RAHU_EIGHTH_BY_WEEKDAY = [8, 2, 7, 5, 6, 4, 3];

function toMinutes(hhmm) {

    const [hours, minutes] = String(hhmm).split(":").map(Number);

    if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
        return null;
    }

    return hours * 60 + minutes;

}

function toHHMM(totalMinutes) {

    const rounded = Math.round(totalMinutes);
    const hours = Math.floor(rounded / 60) % 24;
    const minutes = rounded % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;

}

// isoDate: "YYYY-MM-DD". Returns { start: "HH:MM", end: "HH:MM" } or null.
export default function computeRahuKalam(isoDate, sunrise, sunset) {

    const [year, month, day] = String(isoDate).split("-").map(Number);
    const rise = toMinutes(sunrise);
    const set = toMinutes(sunset);

    if (!year || !month || !day || rise === null || set === null || set <= rise) {
        return null;
    }

    const weekday = new Date(year, month - 1, day).getDay();
    const eighth = RAHU_EIGHTH_BY_WEEKDAY[weekday];
    const slice = (set - rise) / 8;

    return {
        start: toHHMM(rise + slice * (eighth - 1)),
        end: toHHMM(rise + slice * eighth),
    };

}
