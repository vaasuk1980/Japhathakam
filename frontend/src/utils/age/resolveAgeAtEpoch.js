import localDateParts from "../timezone/localDateParts";
import calculateAgeYMD from "./calculateAgeYMD";

/**
 * The person's calendar-accurate age at a given instant (e.g. a
 * Dasha period's start or end), both instants read in the birth
 * timezone's wall-clock — NOT the 365.25-day/year convention the
 * Dasha durations themselves use, since age is meant to match
 * what a calendar would actually show.
 *
 * @param {number} birthEpochMs
 * @param {number} targetEpochMs
 * @param {number} timezoneOffsetHours
 * @returns {{years:number, months:number, days:number}}
 */
export default function resolveAgeAtEpoch(birthEpochMs, targetEpochMs, timezoneOffsetHours) {

    const birthParts = localDateParts(birthEpochMs, timezoneOffsetHours);
    const targetParts = localDateParts(targetEpochMs, timezoneOffsetHours);

    return calculateAgeYMD(birthParts, targetParts);

}
