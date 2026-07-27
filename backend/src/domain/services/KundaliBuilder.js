import BirthContextEngine from "../../astrology/engines/BirthContextEngine.js";
import PlanetPositionEngine from "../../astrology/engines/PlanetPositionEngine.js";
import JanmaLagnaEngine from "../../astrology/engines/JanmaLagnaEngine.js";
import SthanaEngine from "../../astrology/engines/SthanaEngine.js";
import PanchangamEngine from "../../astrology/engines/PanchangamEngine.js";
import DerivedGrahaEngine from "../../astrology/engines/DerivedGrahaEngine.js";
import DashaEngine from "../../astrology/engines/DashaEngine.js";

import GrahaPlacement from "../entities/GrahaPlacement.js";
import KundaliFactory from "../factories/KundaliFactory.js";
import PunyaPapaClassifier from "./PunyaPapaClassifier.js";

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

        // Punya/Papa classification depends only on the Janma
        // Lagna, never on where a graha is placed — computed
        // once here and reused for every placement below
        // (Janma and Gochara alike).
        const { lagnaLord, nativeParty, natureByGraha } =
            PunyaPapaClassifier.classify(
                enrichedBirthContext.janmaLagna.lagna.id
            );

        const grahaPlacements =
            this.buildPlacements(
                planetPositions,
                enrichedBirthContext.janmaLagna,
                natureByGraha
            );

        const moonPosition =
            planetPositions.find(
                (planetPosition) => planetPosition.planet === "MOON"
            );

        const panchangam =
            PanchangamEngine.calculate(
                enrichedBirthContext,
                moonPosition.nakshatra
            );

        const dasha =
            DashaEngine.calculate(
                enrichedBirthContext,
                moonPosition
            );

        // Gochara (transit): current/requested-moment planetary
        // positions, placed against the SAME natal Lagna used
        // above — the reference frame stays fixed to birth, only
        // the grahas placed into it change.
        const gocharaPlacements =
            request.gocharaDetails
                ? this.buildGocharaPlacements(
                    request.gocharaDetails,
                    enrichedBirthContext.janmaLagna,
                    natureByGraha
                )
                : [];

        return KundaliFactory.create({

            birthContext: enrichedBirthContext,

            janmaLagna: enrichedBirthContext.janmaLagna,

            lagnaLord,

            nativeParty,

            grahaPlacements,

            gocharaPlacements,

            panchangam,

            dasha

        });

    }

    buildGocharaPlacements(gocharaDetails, janmaLagna, natureByGraha) {

        const gocharaBirthContext =
            BirthContextEngine.create(gocharaDetails);

        const gocharaPlanetPositions =
            PlanetPositionEngine.calculate(gocharaBirthContext);

        return this.buildPlacements(
            gocharaPlanetPositions,
            janmaLagna,
            natureByGraha
        );

    }

    /**
     * Places the standard 9 grahas plus the 3 Tritha Siddhanta
     * derived grahas (Bhumi, Mitra, Chitra) into Sthanas relative
     * to the given Lagna. Shared by both Janma and Gochara — the
     * only difference between the two is which moment's planet
     * positions are passed in and which Lagna they're placed
     * against (Gochara always uses the natal Lagna). The Punya/
     * Papa nature of each graha is likewise the same regardless
     * of which moment placed it.
     */
    buildPlacements(planetPositions, janmaLagna, natureByGraha) {

        const derivedPositions =
            DerivedGrahaEngine.calculate(planetPositions);

        const allPositions = [
            ...planetPositions,
            ...derivedPositions
        ];

        return allPositions.map((planetPosition) => {

            const sthana =
                SthanaEngine.calculate(
                    planetPosition.lagna,
                    janmaLagna
                );

            return new GrahaPlacement({

                graha: planetPosition.planet,

                sthana,

                longitude: planetPosition.longitude,

                nakshatra: planetPosition.nakshatra,

                pada: planetPosition.pada,

                nature: natureByGraha[planetPosition.planet] ?? null

            });

        });

    }

}

export default new KundaliBuilder();
