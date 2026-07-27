/* ==========================================================
   Current date/time formatted to match the DateInput/TimeInput
   controls' expected string values (YYYY-MM-DD, HH:MM).
========================================================== */

export function nowDateString() {
    const now = new Date();
    const pad = (value) => String(value).padStart(2, "0");
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

export function nowTimeString() {
    const now = new Date();
    const pad = (value) => String(value).padStart(2, "0");
    return `${pad(now.getHours())}:${pad(now.getMinutes())}`;
}
