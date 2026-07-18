import ApplicationException from './ApplicationException.js';

/**
 * Thrown when a use case cannot complete successfully.
 */
export default class UseCaseException extends ApplicationException {
    constructor(message) {
        super(message);

        this.name = 'UseCaseException';
    }
}