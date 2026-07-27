import GenerateKundaliRequest from "../application/requests/GenerateKundaliRequest.js";

export default class GenerateKundaliController {

    constructor({
        generateKundaliUseCase
    }) {

        this.generateKundaliUseCase = generateKundaliUseCase;

    }

    async execute(req, res, next) {

        try {

            if (!req.body) {

                throw new Error(
                    "Request body is required."
                );

            }

            const request =
                new GenerateKundaliRequest({
                    birthDetails: req.body,
                    gocharaDetails: req.body.gochara ?? null
                });

            const response =
                await this.generateKundaliUseCase.execute(request);

            return res
                .status(200)
                .json(response);

        } catch (error) {

            next(error);

        }

    }

}