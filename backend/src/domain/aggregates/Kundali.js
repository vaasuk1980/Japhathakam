export default class Kundali {
  constructor({
    birthContext,
    analysisContext,
    janmaLagna,
    gocharaLagna,
    grahaPlacements = []
  }) {
    this.birthContext = birthContext;
    this.analysisContext = analysisContext;

    this.janmaLagna = janmaLagna;
    this.gocharaLagna = gocharaLagna;

    this.grahaPlacements = [...grahaPlacements];
  }
}