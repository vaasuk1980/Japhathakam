import Specification from './Specification';

export default class ValidGrahaSpecification extends Specification {
  isSatisfiedBy(graha) {
    if (!graha) {
      return false;
    }

    return (
      graha.id != null &&
      graha.code != null &&
      graha.name != null
    );
  }
}