/**
 * ============================================================================
 * JAPHATHAKAM
 * Dasha Nakshatra Ownership — Trāitha Siddhānta Dasha System v1.0
 * ----------------------------------------------------------------------------
 * Rule 4 (authoritative). Determines the birth Mahadasha from the
 * Moon's Nakshatra Pada. Transcribed literally from the frozen
 * ownership table — each entry is [nakshatraSequence, fromPada, toPada].
 *
 * Nakshatra sequence numbers match NakshatraRegistry.js (1=Ashwini
 * ... 27=Revati). NOTE: the 14th nakshatra ("Chitta"/Chitra in this
 * table) shares its name with the Graha CHITRA — they are unrelated
 * identities. This file only ever indexes nakshatras by numeric
 * `sequence`, never by name, to keep the two unambiguous.
 *
 * Every Graha owns exactly 9 quarter-Padas (2.25 Nakshatras), and the
 * 12 Grahas together own all 27 x 4 = 108 quarter-Padas exactly once —
 * this is verified in DashaEngine's self-check at module load.
 * ============================================================================
 */

const OWNERSHIP_BY_GRAHA = Object.freeze([

    { graha: "SUN", spans: [[1, 1, 4], [2, 1, 4], [3, 1, 1]] },
    { graha: "MOON", spans: [[3, 2, 4], [4, 1, 4], [5, 1, 2]] },
    { graha: "MARS", spans: [[5, 3, 4], [6, 1, 4], [7, 1, 3]] },
    { graha: "RAHU", spans: [[7, 4, 4], [8, 1, 4], [9, 1, 4]] },
    { graha: "JUPITER", spans: [[10, 1, 4], [11, 1, 4], [12, 1, 1]] },
    { graha: "BHUMI", spans: [[12, 2, 4], [13, 1, 4], [14, 1, 2]] },
    { graha: "SATURN", spans: [[14, 3, 4], [15, 1, 4], [16, 1, 3]] },
    { graha: "MERCURY", spans: [[16, 4, 4], [17, 1, 4], [18, 1, 4]] },
    { graha: "KETU", spans: [[19, 1, 4], [20, 1, 4], [21, 1, 1]] },
    { graha: "VENUS", spans: [[21, 2, 4], [22, 1, 4], [23, 1, 2]] },
    { graha: "MITRA", spans: [[23, 3, 4], [24, 1, 4], [25, 1, 3]] },
    { graha: "CHITRA", spans: [[25, 4, 4], [26, 1, 4], [27, 1, 4]] }

]);

/**
 * @param {number} nakshatraSequence - 1-27 (see NakshatraRegistry.js)
 * @param {number} pada - 1-4
 * @returns {string} owning Graha code
 */
function getOwnerGraha(nakshatraSequence, pada) {

    const owner = OWNERSHIP_BY_GRAHA.find(({ spans }) =>
        spans.some(([sequence, fromPada, toPada]) =>
            sequence === nakshatraSequence &&
            pada >= fromPada &&
            pada <= toPada
        )
    );

    if (!owner) {
        throw new Error(
            `DashaNakshatraOwnership: no owner found for Nakshatra #${nakshatraSequence} Pada ${pada}.`
        );
    }

    return owner.graha;

}

export {
    OWNERSHIP_BY_GRAHA,
    getOwnerGraha
};
