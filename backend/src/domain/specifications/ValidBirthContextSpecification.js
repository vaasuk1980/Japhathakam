import Specification from './Specification';

export default class ValidBirthContextSpecification extends Specification {
  isSatisfiedBy(birthContext) {
    if (!birthContext) {
      return false;
    }

    return (
      birthContext.date != null &&
      birthContext.time != null &&
      birthContext.timezone != null &&
      birthContext.latitude != null &&
      birthContext.longitude != null &&
      birthContext.place != null
    );
  }
}