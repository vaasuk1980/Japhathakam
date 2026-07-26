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

        gocharaChart = null,

        panchangam = null

    }) {

        this.janmaChart = janmaChart;

        this.gocharaChart = gocharaChart;

        this.panchangam = panchangam;

        Object.freeze(this);

    }

}

export default KundaliDocument;