/**
 * ============================================================
 * JAPHATHAKAM
 * Presentation Formatter
 * ------------------------------------------------------------
 * Formatter : DashaDurationFormatter
 * Layer     : Presentation
 *
 * Responsibility:
 *   Renders a fractional Dasha duration (in years) as a human
 *   "Xy Ym Zd" string, using the same 365.25 day/year convention
 *   as DashaEngine so the displayed breakdown always matches the
 *   underlying start/end dates exactly.
 * ============================================================
 */

const DAYS_PER_YEAR = 365.25;
const DAYS_PER_MONTH = DAYS_PER_YEAR / 12;

class DashaDurationFormatter {

    static format(durationYears) {

        if (durationYears === null || durationYears === undefined) {
            return "";
        }

        const totalDays = durationYears * DAYS_PER_YEAR;

        const years = Math.floor(totalDays / DAYS_PER_YEAR);
        const remainingAfterYears = totalDays - (years * DAYS_PER_YEAR);

        const months = Math.floor(remainingAfterYears / DAYS_PER_MONTH);
        const remainingAfterMonths = remainingAfterYears - (months * DAYS_PER_MONTH);
        const days = Math.round(remainingAfterMonths);

        const parts = [];

        if (years > 0) parts.push(`${years} y`);
        if (months > 0) parts.push(`${months} m`);

        if (days > 0) {
            parts.push(`${days} d`);
        } else if (parts.length === 0) {
            // Sub-day period — "0d" would hide how long it actually
            // is, so fall back to hours instead.
            const hours = Math.max(1, Math.round(remainingAfterMonths * 24));
            parts.push(`${hours} h`);
        }

        return parts.join(" ");

    }

}

export default DashaDurationFormatter;
