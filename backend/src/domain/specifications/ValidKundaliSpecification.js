import Specification from './Specification';

export default class ValidKundaliSpecification extends Specification {
  isSatisfiedBy(kundali) {
    if (!kundali) {
      return false;
    }

    return (
      kundali.birthContext != null &&
      kundali.analysisContext != null &&
      kundali.janmaLagna != null &&
      kundali.gocharaLagna != null &&
      Array.isArray(kundali.grahaPlacements)
    );
  }
}