import IRequest from "../contracts/IRequest.js";

import BirthDetailsRequestMapper
    from "../mappers/BirthDetailsRequestMapper.js";

export default class GenerateKundaliRequest extends IRequest {

    constructor({
        birthDetails
    }) {

        super();

        this.birthDetails =
            BirthDetailsRequestMapper.map(
                birthDetails
            );

    }

}