/**
 * Domain Contract
 *
 * Defines the persistence capabilities required by the Domain.
 *
 * Implementations belong to the Infrastructure layer.
 */
export default class IKundaliRepository {
  save(/* kundali */) {
    throw new Error('Not implemented.');
  }

  findById(/* id */) {
    throw new Error('Not implemented.');
  }

  findAll() {
    throw new Error('Not implemented.');
  }

  delete(/* id */) {
    throw new Error('Not implemented.');
  }
}