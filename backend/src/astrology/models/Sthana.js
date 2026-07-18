/**
 * ============================================================================
 * JAPHATHAKAM
 * ============================================================================
 * Module      : Astrology Domain Model
 * File        : Sthana.js
 * Description : Immutable Sthana (House) Model
 *
 * Represents one Karma Chakra Sthana.
 * A Sthana is mapped to exactly one Lagna.
 *
 * This model contains no calculation logic.
 *
 * Sprint      : 8.0 - Sthana Engine
 * Status      : FROZEN
 * ============================================================================
 */

export default class Sthana {

    /**
     * Creates an immutable Sthana.
     *
     * @param {string} id
     * @param {number} number
     * @param {string} englishName
     * @param {string} teluguName
     * @param {Lagna} lagna
     */
    constructor(
        id,
        number,
        englishName,
        teluguName,
        lagna
    ) {
        this.id = id;
        this.number = number;
        this.englishName = englishName;
        this.teluguName = teluguName;

        // Lagna occupying this Sthana
        this.lagna = lagna;

        Object.freeze(this);
    }

}