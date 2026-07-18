/**
 * Application Use Case Contract
 *
 * Every Application Use Case must implement this contract.
 */
export default class IUseCase {
    execute(request) {
        throw new Error('execute(request) must be implemented.');
    }
}