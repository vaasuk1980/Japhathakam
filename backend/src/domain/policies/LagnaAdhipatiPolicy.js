import { LAGNA_ADHIPATIS } from '../contracts/constants';

/**
 * ============================================================
 * Lagna Adhipati Policy
 * ------------------------------------------------------------
 * Determines the permanent Adhipati (ruling Graha) of a Lagna
 * according to Tritha Siddhantha Kala Chakra.
 *
 * Responsibility:
 *      Lagna -> Adhipati Graha
 *
 * This policy is:
 *  - Pure
 *  - Stateless
 *  - Deterministic
 *  - Immutable
 * ============================================================
 */

export default class LagnaAdhipatiPolicy {

    /**
     * Returns the permanent Adhipati of a Lagna.
     *
     * @param {Lagna} lagna
     * @returns {string}
     */
    static getAdhipati(lagna) {

        if (!lagna) {
            throw new Error('Lagna is required.');
        }

        const adhipati = LAGNA_ADHIPATIS[lagna.id];

        if (!adhipati) {
            throw new Error(`Unknown Lagna: ${lagna.id}`);
        }

        return adhipati;
    }

}