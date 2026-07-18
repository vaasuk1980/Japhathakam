import IResponse from '../contracts/IResponse.js';

/**
 * Application Response
 * Returned to the Presentation Layer.
 */
export default class GenerateKundaliResponse extends IResponse {
    constructor(kundali) {
        super();

        this.kundali = kundali;
    }
}