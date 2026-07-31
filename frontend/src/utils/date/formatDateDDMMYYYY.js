/* ==========================================================
   Formats a Date / epoch-ms / ISO timestamp as "DD-MM-YYYY",
   the date format used throughout this project.
========================================================== */

const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export default function formatDateDDMMYYYY(value) {

    if (!value) {
        return "—";
    }

    // Plain "YYYY-MM-DD" (e.g. a stored dateOfBirth) has no time
    // component, so split it directly rather than going through
    // Date parsing — that would parse it as UTC midnight and risk
    // shifting the displayed day in timezones behind UTC.
    if (typeof value === "string" && DATE_ONLY_PATTERN.test(value)) {

        const [year, month, day] = value.split("-");
        return `${day}-${month}-${year}`;

    }

    const date = value instanceof Date ? value : new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    const pad = (n) => String(n).padStart(2, "0");

    return `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()}`;

}
