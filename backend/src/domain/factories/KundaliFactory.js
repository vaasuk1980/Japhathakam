import Kundali from "../aggregates/Kundali.js";

class KundaliFactory {

    create({
        birthContext,
        analysisContext = null,
        janmaLagna,
        gocharaLagna = null,
        grahaPlacements = []
    }) {

        return new Kundali({
            birthContext,
            analysisContext,
            janmaLagna,
            gocharaLagna,
            grahaPlacements
        });

    }

}

export default new KundaliFactory();