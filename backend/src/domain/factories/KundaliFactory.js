import Kundali from "../aggregates/Kundali.js";

class KundaliFactory {

    create({
        birthContext,
        analysisContext = null,
        janmaLagna,
        gocharaLagna = null,
        grahaPlacements = [],
        panchangam = null
    }) {

        return new Kundali({
            birthContext,
            analysisContext,
            janmaLagna,
            gocharaLagna,
            grahaPlacements,
            panchangam
        });

    }

}

export default new KundaliFactory();