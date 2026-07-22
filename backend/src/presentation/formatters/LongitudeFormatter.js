/**
 * ============================================================
 * JAPHATHAKAM
 * Presentation Formatter
 * ------------------------------------------------------------
 * Formatter : LongitudeFormatter
 * Layer     : Presentation
 *
 * Responsibility:
 *   Converts decimal longitude into UI display format.
 *
 * Example:
 *   153.8041417
 *      ↓
 *   3°48'14"
 *
 * Notes:
 *   - Presentation only.
 *   - No business logic.
 * ============================================================
 */

class LongitudeFormatter {

    static format(longitude) {

        if (longitude === null || longitude === undefined) {
            return "";
        }

        const degrees = Math.floor(longitude % 30);

        const minutesDecimal = (longitude % 30 - degrees) * 60;
        const minutes = Math.floor(minutesDecimal);

        const seconds = Math.floor((minutesDecimal - minutes) * 60);

        return `${degrees}°${minutes}'${seconds}"`;

    }

}

export default LongitudeFormatter;