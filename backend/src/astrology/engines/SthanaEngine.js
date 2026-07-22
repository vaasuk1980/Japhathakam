import SthanaCalculation from "../calculations/SthanaCalculation.js";

import LagnaRegistry from "../constants/LagnaRegistry.js";

import Sthana from "../../domain/entities/Sthana.js";

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

        const sthanaNumber =
            this.sthanaCalculation.calculate(
                planetLagna.sequence,
                janmaLagna.lagna.sequence
            );

        const lagna =
            LagnaRegistry[
                (janmaLagna.lagna.sequence + sthanaNumber - 2) % 12
            ];

        return new Sthana({

            number: sthanaNumber,

            lagna

        });

    }

}

export default new SthanaEngine();