/**
 * Calendar-accurate Y/M/D difference between two dates — same
 * borrow logic as the birth-details form's live Age field
 * (AgeDisplay), generalized to take explicit {year, month, day}
 * triples instead of only "now" vs. birth. Accounts for actual
 * month lengths (not a fixed 30/31-day assumption), matching how
 * a person would count their own age in years/months/days.
 *
 * @param {{year:number, month:number, day:number}} from - month is 1-based
 * @param {{year:number, month:number, day:number}} to - month is 1-based
 * @returns {{years:number, months:number, days:number}}
 */
export default function calculateAgeYMD(from, to) {

    let years = to.year - from.year;
    let months = to.month - from.month;
    let days = to.day - from.day;

    if (days < 0) {

        months -= 1;

        // Days in the month immediately before the target month —
        // new Date(y, m, 0) gives the last day of month (m - 1).
        const daysInPreviousMonth = new Date(to.year, to.month - 1, 0).getDate();

        days += daysInPreviousMonth;

    }

    if (months < 0) {
        years -= 1;
        months += 12;
    }

    return { years, months, days };

}
