import Kundali from "../aggregates/Kundali.js";

class KundaliFactory {

    create({
        birthContext,
        analysisContext = null,
        janmaLagna,
        gocharaLagna = null,
        lagnaLord = null,
        nativeParty = null,
        grahaPlacements = [],
        gocharaPlacements = [],
        panchangam = null
    }) {

        return new Kundali({
            birthContext,
            analysisContext,
            janmaLagna,
            gocharaLagna,
            lagnaLord,
            nativeParty,
            grahaPlacements,
            gocharaPlacements,
            panchangam
        });

    }

}

export default new KundaliFactory();