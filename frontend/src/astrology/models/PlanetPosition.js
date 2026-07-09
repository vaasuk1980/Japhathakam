/* ==========================================================
   Japhathakam Enterprise Astrology Engine
   Planet Position Model
-------------------------------------------------------------
   Represents the canonical PlanetPosition domain object.

   Every planetary position in the application must be
   created through this model.

   This model contains NO astronomical calculations.
========================================================== */

import { PlanetPositionTypes } from "../types/PlanetPositionTypes";

export default class PlanetPosition {

    constructor(data = {}) {

        this[PlanetPositionTypes.GRAHA_ID] = data[PlanetPositionTypes.GRAHA_ID] ?? null;

        this[PlanetPositionTypes.LONGITUDE] = data[PlanetPositionTypes.LONGITUDE] ?? null;

        this[PlanetPositionTypes.LATITUDE] = data[PlanetPositionTypes.LATITUDE] ?? null;

        this[PlanetPositionTypes.SPEED] = data[PlanetPositionTypes.SPEED] ?? null;

        this[PlanetPositionTypes.IS_RETROGRADE] =
            data[PlanetPositionTypes.IS_RETROGRADE] ?? false;

        this[PlanetPositionTypes.LAGNA_ID] = data[PlanetPositionTypes.LAGNA_ID] ?? null;

        this[PlanetPositionTypes.RASI_ID] = data[PlanetPositionTypes.RASI_ID] ?? null;

        this[PlanetPositionTypes.DEGREE] = data[PlanetPositionTypes.DEGREE] ?? null;

        this[PlanetPositionTypes.MINUTE] = data[PlanetPositionTypes.MINUTE] ?? null;

        this[PlanetPositionTypes.SECOND] = data[PlanetPositionTypes.SECOND] ?? null;

        this[PlanetPositionTypes.NAKSHATRA_ID] =
            data[PlanetPositionTypes.NAKSHATRA_ID] ?? null;

        this[PlanetPositionTypes.PADA] = data[PlanetPositionTypes.PADA] ?? null;

        this[PlanetPositionTypes.METADATA] =
            data[PlanetPositionTypes.METADATA] ?? {};

        Object.freeze(this);
    }

}