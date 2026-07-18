import GrahaPartyPolicy from './GrahaPartyPolicy.js';
import { FRIENDSHIP } from '../contracts/constants/index.js';

/**
 * ============================================================
 * Friendship Policy
 * ------------------------------------------------------------
 * Determines the permanent relationship between two Grahas
 * according to Tritha Siddhantha.
 *
 * Responsibility:
 *      Graha + Graha -> Relationship
 *
 * This policy is:
 *  - Pure
 *  - Stateless
 *  - Deterministic
 *  - Immutable
 * ============================================================
 */
export default class FriendshipPolicy {

    /**
     * Returns the relationship between two Grahas.
     *
     * @param {Graha} grahaA
     * @param {Graha} grahaB
     * @returns {string}
     */
    static getRelationship(grahaA, grahaB) {

        if (!grahaA || !grahaB) {
            throw new Error('Both Grahas are required.');
        }

        const partyA = GrahaPartyPolicy.getParty(grahaA);
        const partyB = GrahaPartyPolicy.getParty(grahaB);

        return partyA === partyB
            ? FRIENDSHIP.FRIEND
            : FRIENDSHIP.ENEMY;
    }

}