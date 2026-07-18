/**
 * Base exception for the Application Layer.
 */
export default class ApplicationException extends Error {
    constructor(message) {
        super(message);

        this.name = 'ApplicationException';
    }
}