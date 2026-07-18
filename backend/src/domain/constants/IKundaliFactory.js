import { Kundali } from '../aggregates';

export default class KundaliFactory {
  static create({
    birthContext,
    analysisContext,
    janmaLagna,
    gocharaLagna,
    grahas,
    sthanas
  }) {
    return new Kundali({
      birthContext,
      analysisContext,
      janmaLagna,
      gocharaLagna,
      grahas,
      sthanas
    });
  }
}