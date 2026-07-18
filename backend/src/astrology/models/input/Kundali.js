/**
 * ============================================================================
 * JAPHATHAKAM
 * ============================================================================
 * Module      : Astrology Domain Model
 * File        : Kundali.js
 * Description : Immutable Kundali Model
 *
 * Represents a complete Kundali (Horoscope).
 *
 * A Kundali contains exactly 12 immutable Kundali Cells.
 *
 * Sprint      : 8.1 - Kundali Projection
 * Status      : FOUNDATION
 * ============================================================================
 */

class Kundali {

    /**
     * Creates an immutable Kundali.
     *
     * @param {string} chartType
     * @param {KundaliCell[]} cells
     */
    constructor(
        chartType,
        cells
    ) {

        this.chartType = chartType;

        this.cells = Object.freeze([...cells]);

        Object.freeze(this);

    }

}

export default Kundali;