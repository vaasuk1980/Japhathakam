/**
 * ============================================================
 * JAPHATHAKAM
 * Presentation Contract
 * ------------------------------------------------------------
 * Contract    : KundaliDocument
 * Layer       : Presentation
 *
 * Responsibility:
 *   Root presentation document returned to the UI.
 *
 * Notes:
 *   - Immutable.
 *   - Presentation only.
 *   - No business logic.
 * ============================================================
 */

class KundaliDocument {

    constructor({

        janmaChart,

        gocharaChart = null

    }) {

        this.janmaChart = janmaChart;

        this.gocharaChart = gocharaChart;

        Object.freeze(this);

    }

}

export default KundaliDocument;