import SthanaCalculation from "../calculations/SthanaCalculation.js";

class SthanaEngine {

    constructor() {

        this.sthanaCalculation =
            new SthanaCalculation();

    }

    calculate(
        planetLagna,
        janmaLagna
    ) {

        if (!planetLagna) {
            throw new Error(
                "Planet lagna is required."
            );
        }

        if (!janmaLagna) {
            throw new Error(
                "Janma lagna is required."
            );
        }

        return this.sthanaCalculation.calculate(
            planetLagna.sequence,
            janmaLagna.sequence
        );

    }

}

export default new SthanaEngine();