import ApplicationException from './ApplicationException.js';

/**
 * Thrown when an application request is invalid.
 */
export default class ValidationException extends ApplicationException {
    constructor(message) {
        super(message);

        this.name = 'ValidationException';
    }
}