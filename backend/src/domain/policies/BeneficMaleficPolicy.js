import LagnaAdhipatiPolicy from './LagnaAdhipatiPolicy.js';
import GrahaPartyPolicy from './GrahaPartyPolicy.js';
import { GRAHA_NATURE } from '../contracts/constants/index.js';

export default class BeneficMaleficPolicy {

    static getNature(janmaLagna, graha) {

        if (!janmaLagna) {
            throw new Error('Janma Lagna is required.');
        }

        if (!graha) {
            throw new Error('Graha is required.');
        }

        const lagnaAdhipati =
            LagnaAdhipatiPolicy.getAdhipati(janmaLagna);

        const janmaParty =
            GrahaPartyPolicy.getParty({
                id: lagnaAdhipati
            });

        const grahaParty =
            GrahaPartyPolicy.getParty(graha);

        return janmaParty === grahaParty
            ? GRAHA_NATURE.PUNYA
            : GRAHA_NATURE.PAPA;
    }

}