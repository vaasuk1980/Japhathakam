import BirthContextEngine from "../../astrology/engines/BirthContextEngine.js";
import PlanetPositionEngine from "../../astrology/engines/PlanetPositionEngine.js";
import JanmaLagnaEngine from "../../astrology/engines/JanmaLagnaEngine.js";
import SthanaEngine from "../../astrology/engines/SthanaEngine.js";

import GrahaPlacement from "../entities/GrahaPlacement.js";
import KundaliFactory from "../factories/KundaliFactory.js";

class KundaliBuilder {

    build(request) {

        const birthContext =
            BirthContextEngine.create(
                request.birthDetails
            );

        const enrichedBirthContext =
            JanmaLagnaEngine.calculate(
                birthContext
            );

        const planetPositions =
            PlanetPositionEngine.calculate(
                enrichedBirthContext
            );

        const grahaPlacements =
            planetPositions.map((planetPosition) => {

                const sthana =
                    SthanaEngine.calculate(
                        planetPosition.lagna,
                        enrichedBirthContext.janmaLagna
                    );

                return new GrahaPlacement({

                    graha: planetPosition.planet,

                    sthana,

                    longitude: planetPosition.longitude,

                    nakshatra: planetPosition.nakshatra,

                    pada: planetPosition.pada

                });

            });

        return KundaliFactory.create({

            birthContext: enrichedBirthContext,

            janmaLagna: enrichedBirthContext.janmaLagna,

            grahaPlacements

        });

    }

}

export default new KundaliBuilder();