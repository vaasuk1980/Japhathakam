/**
 * ============================================================================
 * JAPHATHAKAM
 * ============================================================================
 * Module      : Astrology Mapper
 * File        : SthanaMapper.js
 * Description : Maps Kala Chakra Lagnas to Karma Chakra Sthanas.
 *
 * Responsibility:
 * ----------------
 * Creates the 12 Karma Chakra Sthanas by aligning the Janma Lagna
 * with the Supported Lagnas.
 *
 * This mapper performs NO astronomical calculations.
 *
 * Sprint      : 8.0 - Sthana Engine
 * Status      : IMPLEMENTATION
 * ============================================================================
 */

import SupportedLagnas from "../constants/SupportedLagnas.js";
import SupportedSthanas from "../constants/Sthanas.js";

import Sthana from "../models/Sthana.js";

class SthanaMapper {

    /**
     * Creates the 12 Sthanas from the supplied Janma Lagna.
     *
     * @param {JanmaLagna} janmaLagna
     * @returns {Sthana[]}
     */
    static map(janmaLagna) {

        if (!janmaLagna) {
            throw new Error("JanmaLagna is required.");
        }

        if (!janmaLagna.lagna) {
            throw new Error("JanmaLagna.lagna is required.");
        }

        // ------------------------------------------------------------
        // Janma Lagna becomes the First Sthana.
        // Sequence is already validated (1-12).
        // ------------------------------------------------------------

        const startIndex = janmaLagna.lagna.sequence - 1;

        const sthanas = [];

        for (let i = 0; i < 12; i++) {

            const lagnaIndex = (startIndex + i) % 12;

            const lagna = SupportedLagnas[lagnaIndex];

            const sthanaDefinition = SupportedSthanas[i];

            sthanas.push(

                new Sthana(

                    sthanaDefinition.id,

                    sthanaDefinition.number,

                    sthanaDefinition.englishName,

                    sthanaDefinition.teluguName,

                    lagna

                )

            );

        }

        return Object.freeze(sthanas);

    }

}

export default SthanaMapper;