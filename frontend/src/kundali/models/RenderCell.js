/**
 * ============================================================================
 * JAPHATHAKAM
 * RenderCell
 * ============================================================================
 *
 * Frontend Rendering Model
 *
 * Represents a single fixed zodiac-sign position in the Kundali
 * grid. The grid itself never rotates: a given RenderCell always
 * represents the same sign (e.g. Sthana 1 is always Mesha), for
 * every chart.
 *
 * Responsibilities
 * ----------------
 * • Identify the fixed sign position (Sthana)
 * • Hold rendering regions belonging to that sign
 *
 * Non-Responsibilities
 * --------------------
 * • No astrology calculations
 * • No coordinate calculations
 * • No rendering logic
 * ============================================================================
 */

class RenderCell {

    constructor({
        sthana,
        rasi = null,
        lord = null,
        houseNumber = null,
        isJanmaLagna = false,
        regions = []
    }) {

        /**
         * Fixed sign position (1–12). Never changes per chart —
         * Sthana 1 is always Mesha, Sthana 2 always Vrishabha, etc.
         */
        this.sthana = sthana;

        /**
         * The zodiac sign this Sthana always represents (e.g.
         * "మేషం"). Fixed, independent of any chart's Lagna.
         */
        this.rasi = rasi;

        /**
         * The Rashi Adhipathi (sign lord) for this Sthana's
         * fixed sign (e.g. "రవి" for Simha). Fixed, same as rasi.
         */
        this.lord = lord;

        /**
         * The house number to *display* on this cell, counted
         * from the Janma Lagna (1 = Lagna's own sign, 2-12
         * follow in natural zodiac order). Depends on the chart's
         * Lagna, unlike Sthana/rasi which are fixed.
         */
        this.houseNumber = houseNumber;

        /**
         * True when this Sthana's fixed sign is the Janma
         * Lagna's own sign (equivalent to houseNumber === 1).
         */
        this.isJanmaLagna = isJanmaLagna;

        /**
         * Collection of RenderRegion objects.
         */
        this.regions = regions;

    }

}

export default RenderCell;
