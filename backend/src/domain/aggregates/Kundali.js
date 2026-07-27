export default class Kundali {

    constructor({

        birthContext,

        analysisContext,

        janmaLagna,

        gocharaLagna,

        grahaPlacements = [],

        gocharaPlacements = [],

        panchangam = null

    }) {

        this.birthContext = birthContext;

        this.analysisContext = analysisContext;

        this.janmaLagna = janmaLagna;

        this.gocharaLagna = gocharaLagna;

        this.panchangam = panchangam;

        this.grahaPlacements =
            Object.freeze([...grahaPlacements]);

        this.gocharaPlacements =
            Object.freeze([...gocharaPlacements]);

        Object.freeze(this);

    }

}