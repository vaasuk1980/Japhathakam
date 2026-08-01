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
        pada,

        nature = null,
        isRetrograde = false

    }) {

        this.id = id;
        this.code = code;
        this.name = name;
        this.displayName = displayName;

        this.longitude = longitude;
        this.formattedLongitude = formattedLongitude;

        this.nakshatra = nakshatra;
        this.pada = pada;

        // Punya/Papa classification (Tritha Siddhantha) — null
        // for the Lagna itself, which is not a graha and is
        // never classified.
        this.nature = nature;

        // Only ever true for Mercury/Venus/Mars/Jupiter/Saturn (see
        // GrahasWithVariableDirection) — false for the Lagna itself
        // (not a physical body) and for every other graha.
        this.isRetrograde = isRetrograde;

        Object.freeze(this);

    }

}

export default DisplayGraha;