import IRequest from "../contracts/IRequest.js";

import BirthDetailsRequestMapper
    from "../mappers/BirthDetailsRequestMapper.js";

export default class GenerateKundaliRequest extends IRequest {

    constructor({
        birthDetails,
        gocharaDetails = null
    }) {

        super();

        this.birthDetails =
            BirthDetailsRequestMapper.map(
                birthDetails
            );

        this.gocharaDetails =
            gocharaDetails
                ? BirthDetailsRequestMapper.map(gocharaDetails)
                : null;

    }

}