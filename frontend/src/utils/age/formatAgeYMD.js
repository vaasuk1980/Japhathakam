/* ==========================================================
   Renders a calendar-accurate {years, months, days} age as
   "Xy Ym Zd" — same compact style as formatDashaDuration, so the
   Age column reads consistently with the Duration column next
   to it in the Dasha table.
========================================================== */

export default function formatAgeYMD({ years, months, days }) {

    const parts = [];

    if (years > 0) parts.push(`${years}y`);
    if (months > 0) parts.push(`${months}m`);
    if (days > 0 || parts.length === 0) parts.push(`${days}d`);

    return parts.join(" ");

}
