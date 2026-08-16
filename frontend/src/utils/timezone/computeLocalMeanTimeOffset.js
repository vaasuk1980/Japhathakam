/**
 * Local Mean Time UTC offset (hours) for a given longitude — 15° of
 * longitude per hour, independent of any timezone database. Distinct
 * from resolveUtcOffsetHours.js, which answers a different question
 * (this place's *civil* zone offset at a given instant); this one
 * answers this place's *solar/mean* offset, constant regardless of
 * date — the relevant figure for births before a region had any
 * unified standard time (see PlaceAutocomplete.jsx).
 *
 * @param {number} longitude - degrees, east positive
 * @returns {number|null}
 */
export default function computeLocalMeanTimeOffset(longitude) {

    if (typeof longitude !== "number" || Number.isNaN(longitude)) {
        return null;
    }

    return longitude / 15;

}
