export default class Kundali {

    constructor({

        birthContext,

        analysisContext,

        janmaLagna,

        gocharaLagna,

        lagnaLord = null,

        nativeParty = null,

        grahaPlacements = [],

        gocharaPlacements = [],

        panchangam = null,

        dasha = null

    }) {

        this.birthContext = birthContext;

        this.analysisContext = analysisContext;

        this.janmaLagna = janmaLagna;

        this.gocharaLagna = gocharaLagna;

        this.lagnaLord = lagnaLord;

        this.nativeParty = nativeParty;

        this.panchangam = panchangam;

        this.dasha = dasha;

        this.grahaPlacements =
            Object.freeze([...grahaPlacements]);

        this.gocharaPlacements =
            Object.freeze([...gocharaPlacements]);

        Object.freeze(this);

    }

}