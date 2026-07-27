/**
 * ============================================================
 * JAPHATHAKAM
 * Presentation Contract
 * ------------------------------------------------------------
 * Contract    : DashaPeriod
 * Layer       : Presentation
 *
 * Responsibility:
 *   Represents one ruling-Graha period at any Dasha level —
 *   Mahadasha, Antardasha, Pratyantardasha, Sukshmadasha, or
 *   Pranadasha. The same shape is reused at every level (Rule 12:
 *   every subdivision follows the identical rule), with `children`
 *   holding the next level down when it has been computed.
 *
 * Notes:
 *   - Presentation model only.
 *   - Immutable.
 *   - No business logic, no calculations.
 * ============================================================
 */

class DashaPeriod {

    constructor({

        graha,
        displayName,

        start,
        end,

        startEpochMs,
        endEpochMs,

        durationYears,
        durationDisplay,

        children = []

    }) {

        this.graha = graha;
        this.displayName = displayName;

        this.start = start;
        this.end = end;

        this.startEpochMs = startEpochMs;
        this.endEpochMs = endEpochMs;

        this.durationYears = durationYears;
        this.durationDisplay = durationDisplay;

        this.children = Object.freeze([...children]);

        Object.freeze(this);

    }

}

export default DashaPeriod;
