/**
 * ============================================================================
 * JAPHATHAKAM
 * GrahaOrderingPolicy
 * ============================================================================
 *
 * KRS-006 (FROZEN)
 *
 * Orders grahas by ascending longitude within the same
 * Relationship Region and Pada.
 * ============================================================================
 */

class GrahaOrderingPolicy {

    /**
     * Sort grahas by longitude.
     *
     * @param {RenderGraha[]} grahas
     * @returns {RenderGraha[]}
     */
    apply(grahas = []) {

        return [...grahas].sort(
            (a, b) => a.longitude - b.longitude
        );

    }

}

export default new GrahaOrderingPolicy();