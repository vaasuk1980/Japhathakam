/**
 * ============================================================
 * JAPHATHAKAM
 * Presentation Contract
 * ------------------------------------------------------------
 * Contract    : DisplayGraha
 * Layer       : Presentation
 *
 * Responsibility:
 *   Represents one Graha exactly as it should appear in the UI.
 *
 * Notes:
 *   - Presentation model only.
 *   - Immutable.
 *   - No business logic.
 *   - No calculations.
 * ============================================================
 */

class DisplayGraha {

    constructor({

        id,
        code,
        name,
        displayName,

        longitude,
        formattedLongitude,

        nakshatra,
        pada

    }) {

        this.id = id;
        this.code = code;
        this.name = name;
        this.displayName = displayName;

        this.longitude = longitude;
        this.formattedLongitude = formattedLongitude;

        this.nakshatra = nakshatra;
        this.pada = pada;

        Object.freeze(this);

    }

}

export default DisplayGraha;