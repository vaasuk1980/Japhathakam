export default class Kundali {

    constructor({

        birthContext,

        analysisContext,

        janmaLagna,

        gocharaLagna,

        grahaPlacements = [],

        panchangam = null

    }) {

        this.birthContext = birthContext;

        this.analysisContext = analysisContext;

        this.janmaLagna = janmaLagna;

        this.gocharaLagna = gocharaLagna;

        this.panchangam = panchangam;

        this.grahaPlacements =
            Object.freeze([...grahaPlacements]);

        Object.freeze(this);

    }

}