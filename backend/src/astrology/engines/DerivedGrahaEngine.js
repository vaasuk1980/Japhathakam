/**
 * ============================================================================
 * JAPHATHAKAM
 * DerivedGrahaEngine
 * ============================================================================
 *
 * Tritha Siddhanta derived grahas — Bhumi, Mitra, Chitra.
 *
 * These three grahas are NOT physical bodies and are never fetched
 * from Swiss Ephemeris, JPL, or any external astronomy source. Each
 * is calculated purely from the already-computed standard 9 grahas,
 * per Tritha Siddhanta rules:
 *
 *   Bhumi  = Ravi + 180°       (always exactly opposite the Sun)
 *   Mitra  = Ketu + 1 Pada     (3°20' ahead of Ketu)
 *   Chitra = Rahu + 1 Pada     (3°20' ahead of Rahu)
 *
 * This mirrors how Ketu itself is already derived from Rahu elsewhere
 * in this codebase (PlanetPositionEngine), rather than queried
 * directly — latitude/latitudeSpeed are 0 (these are calculated
 * points, not bodies with their own ecliptic latitude), and
 * distance/distanceSpeed/longitudeSpeed are carried over from the
 * graha each is derived from.
 *
 * Nakshatra/Pada/Lagna transitions at boundaries are handled for
 * free by reusing the same calculation classes PlanetPositionEngine
 * already uses — no special-casing needed.
 * ============================================================================
 */

import LagnaCalculation from "../calculations/LagnaCalculation.js";
import NakshatraCalculation from "../calculations/NakshatraCalculation.js";
import PadaCalculation from "../calculations/PadaCalculation.js";

import PositionMapper from "../mappers/PositionMapper.js";
import PositionValidator from "../validators/PositionValidator.js";

const lagnaCalculation = new LagnaCalculation();
const nakshatraCalculation = new NakshatraCalculation();
const padaCalculation = new PadaCalculation();

const HALF_CIRCLE = 180;
const ONE_PADA = 10 / 3; // 3°20'

class DerivedGrahaEngine {

    /**
     * @param {import("../models/PlanetPosition.js").default[]} planetPositions
     *   The already-calculated standard 9 grahas.
     * @returns {import("../models/PlanetPosition.js").default[]}
     *   Bhumi, Mitra, Chitra — same PlanetPosition shape, ready to
     *   flow through SthanaEngine exactly like any other graha.
     */
    calculate(planetPositions) {

        const ravi = this.findPosition(planetPositions, "SUN");
        const rahu = this.findPosition(planetPositions, "RAHU");
        const ketu = this.findPosition(planetPositions, "KETU");

        const bhumi = this.derive("BHUMI", ravi, HALF_CIRCLE);
        const mitra = this.derive("MITRA", ketu, ONE_PADA);
        const chitra = this.derive("CHITRA", rahu, ONE_PADA);

        return [bhumi, mitra, chitra];

    }

    findPosition(planetPositions, code) {

        const position = planetPositions.find(
            (planetPosition) => planetPosition.planet === code
        );

        if (!position) {
            throw new Error(
                `DerivedGrahaEngine: ${code} position is required to derive Tritha Siddhanta grahas.`
            );
        }

        return position;

    }

    derive(code, basePosition, offsetDegrees) {

        const longitude =
            ((basePosition.longitude + offsetDegrees) % 360 + 360) % 360;

        const lagna = lagnaCalculation.calculate(longitude);
        const nakshatra = nakshatraCalculation.calculate(longitude);
        const pada = padaCalculation.calculate(longitude, nakshatra);

        const position = PositionMapper.map(code, {

            longitude,

            latitude: 0,
            distance: basePosition.distance,

            longitudeSpeed: basePosition.longitudeSpeed,
            latitudeSpeed: 0,
            distanceSpeed: basePosition.distanceSpeed,

            lagna,
            nakshatra,
            pada

        });

        PositionValidator.validate(position);

        return position;

    }

}

export default new DerivedGrahaEngine();
