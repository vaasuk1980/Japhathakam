import IRequest from '../contracts/IRequest.js';

/**
 * Application Request
 * Used by Presentation to request Kundali generation.
 */
export default class GenerateKundaliRequest extends IRequest {
    constructor(birthContext) {
        super();

        this.birthContext = birthContext;
    }
}