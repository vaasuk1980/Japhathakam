import { GRAHAS, ASPECT_PATTERNS } from '../contracts/constants';

/**
 * ============================================================
 * Graha Aspect Policy
 * ------------------------------------------------------------
 * Determines the permanent aspect pattern of a Graha according
 * to Tritha Siddhantha.
 *
 * Responsibility:
 *      Graha -> Aspect Pattern
 *
 * This policy is:
 *  - Pure
 *  - Stateless
 *  - Deterministic
 *  - Immutable
 * ============================================================
 */

export default class GrahaAspectPolicy {

    /**
     * Returns the permanent aspect pattern of a Graha.
     *
     * @param {Graha} graha
     * @returns {number[]}
     */
    static getAspectPattern(graha) {

        if (!graha) {
            throw new Error('Graha is required.');
        }

        switch (graha.id) {

            case GRAHAS.KUJA:
                return ASPECT_PATTERNS.KUJA;

            case GRAHAS.GURU:
                return ASPECT_PATTERNS.GURU;

            case GRAHAS.SHANI:
                return ASPECT_PATTERNS.SHANI;

            default:
                return ASPECT_PATTERNS.DEFAULT;
        }
    }

}