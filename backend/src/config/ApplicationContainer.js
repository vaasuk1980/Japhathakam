import GenerateKundaliUseCase from "../application/usecases/GenerateKundaliUseCase.js";

import GenerateKundaliController from "../controllers/GenerateKundaliController.js";

import KundaliBuilder from "../domain/services/KundaliBuilder.js";

import KundaliAssembler from "../presentation/assemblers/KundaliAssembler.js";

class ApplicationContainer {

    build() {

        // Infrastructure
        const kundaliRepository = null;

        // Domain
        const kundaliBuilder = KundaliBuilder;

        // Presentation
        const kundaliAssembler = KundaliAssembler;

        // Application
        const generateKundaliUseCase =
            new GenerateKundaliUseCase({
                kundaliBuilder,
                kundaliAssembler,
                kundaliRepository
            });

        // Presentation
        const generateKundaliController =
            new GenerateKundaliController({
                generateKundaliUseCase
            });

        return {
            generateKundaliController
        };

    }

}

export default new ApplicationContainer();