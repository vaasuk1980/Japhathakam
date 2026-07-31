import { DASHA_YEAR_DAYS } from "../../kundali/constants/DashaConstants";

/* ==========================================================
   Renders a fractional Dasha duration (in years) as "Xy Ym Zd" —
   mirrors the backend's DashaDurationFormatter exactly, using the
   same 365.25 day/year convention, so client-computed levels
   display identically to server-computed ones.
========================================================== */

const DAYS_PER_MONTH = DASHA_YEAR_DAYS / 12;

export default function formatDashaDuration(durationYears) {

    if (durationYears === null || durationYears === undefined) {
        return "";
    }

    const totalDays = durationYears * DASHA_YEAR_DAYS;

    const years = Math.floor(totalDays / DASHA_YEAR_DAYS);
    const remainingAfterYears = totalDays - (years * DASHA_YEAR_DAYS);

    const months = Math.floor(remainingAfterYears / DAYS_PER_MONTH);
    const remainingAfterMonths = remainingAfterYears - (months * DAYS_PER_MONTH);
    const days = Math.round(remainingAfterMonths);

    const parts = [];

    if (years > 0) parts.push(`${years}y`);
    if (months > 0) parts.push(`${months}m`);

    if (days > 0) {
        parts.push(`${days}d`);
    } else if (parts.length === 0) {
        // Sub-day period — typical at the Pranadasha level, where a
        // period can be well under a day long. "0d" would hide how
        // long it actually is, so fall back to hours instead.
        const hours = Math.max(1, Math.round(remainingAfterMonths * 24));
        parts.push(`${hours}h`);
    }

    return parts.join(" ");

}
