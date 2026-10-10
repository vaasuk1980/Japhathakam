import translateDurationDisplay from "../../utils/dasha/translateDurationDisplay";

/* ==========================================================
   Display helpers for the on-screen Dasacharam overview. The
   Dasha engine reports instants as epoch ms; the person's birth
   timezone offset (hours) is applied by hand and the result is
   formatted in UTC, so the wall-clock shown matches the birth
   place regardless of where the browser is.
========================================================== */

const MS_PER_HOUR = 3600000;
const MS_PER_DAY = 86400000;

const LOCALE_BY_LANGUAGE = { en: "en-IN", te: "te-IN" };

function formatter(language, options) {

    return new Intl.DateTimeFormat(LOCALE_BY_LANGUAGE[language] ?? "en-IN", {
        ...options,
        timeZone: "UTC",
    });

}

// "Jul 2023" — enough for the long Maha/Antar periods.
export function formatMonthYear(epochMs, timezone, language) {

    return formatter(language, { month: "short", year: "numeric" })
        .format(new Date(epochMs + timezone * MS_PER_HOUR));

}

// "03 Jul 2023" — for the short deeper periods, where a month is
// too coarse to tell neighbours apart.
export function formatDay(epochMs, timezone, language) {

    return formatter(language, { day: "2-digit", month: "short", year: "numeric" })
        .format(new Date(epochMs + timezone * MS_PER_HOUR));

}

// Exact "03-07-2023 02:24" for tooltips.
export function formatExact(epochMs, timezone) {

    const d = new Date(epochMs + timezone * MS_PER_HOUR);
    const pad = (n) => String(n).padStart(2, "0");

    return `${pad(d.getUTCDate())}-${pad(d.getUTCMonth() + 1)}-${d.getUTCFullYear()} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;

}

// Compact "2 y 4 m" / "5 m 12 d" / "9 d" built from a day count, then
// run through the same y/m/d -> Telugu mapping the Dasha tree uses.
export function formatRemaining(ms, language) {

    const totalDays = Math.max(0, Math.ceil(ms / MS_PER_DAY));
    const years = Math.floor(totalDays / 365.25);
    const months = Math.floor((totalDays - years * 365.25) / 30.4375);
    const days = Math.max(0, Math.round(totalDays - years * 365.25 - months * 30.4375));

    let text;

    if (years > 0) {
        text = months > 0 ? `${years} y ${months} m` : `${years} y`;
    }
    else if (months > 0) {
        text = days > 0 ? `${months} m ${days} d` : `${months} m`;
    }
    else {
        text = `${days} d`;
    }

    return translateDurationDisplay(text, language);

}

export function progressPercent(period, now) {

    const span = period.endEpochMs - period.startEpochMs;

    if (span <= 0) {
        return 0;
    }

    return Math.min(100, Math.max(0, ((now - period.startEpochMs) / span) * 100));

}
