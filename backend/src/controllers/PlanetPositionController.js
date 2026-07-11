import BirthContext from "../astrology/models/BirthContext.js";
import PlanetPositionEngine from "../astrology/engines/PlanetPositionEngine.js";

class PlanetPositionController {

    getPlanetPositions(req, res) {

        const birthContext =
            new BirthContext({

                year: 1980,
                month: 6,
                day: 15,

                // 12:30 PM
                hour: 12.5

            });

        const planetPositions =
            PlanetPositionEngine.calculate(
                birthContext
            );

        res.json(
            planetPositions
        );

    }

}

export default new PlanetPositionController();