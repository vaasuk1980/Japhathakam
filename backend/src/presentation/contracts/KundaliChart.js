/**
 * ============================================================
 * JAPHATHAKAM
 * Presentation Contract
 * ------------------------------------------------------------
 * Contract    : KundaliChart
 * Layer       : Presentation
 *
 * Responsibility:
 *   Represents one immutable Kundali chart.
 * ============================================================
 */

class KundaliChart {

    constructor({

        cells = []

    }) {

        if (!Array.isArray(cells)) {

            throw new Error(
                "KundaliChart cells must be an array."
            );

        }

        if (cells.length !== 12) {

            throw new Error(
                "KundaliChart must contain exactly 12 cells."
            );

        }

        this.cells =
            Object.freeze([...cells]);

        Object.freeze(this);

    }

}

export default KundaliChart;