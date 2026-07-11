/* ==========================================================
   Japhathakam Enterprise Astrology Engine
   Sidereal Conversion
-------------------------------------------------------------
   Converts tropical longitude into sidereal longitude
   using the configured ayanamsa.

   Responsibility:
   - Pure mathematical conversion only.
   - No Swiss Ephemeris calls.
   - No Tritha Siddhanta logic.
   - No business rules.
========================================================== */

const SiderealConversion = Object.freeze({

    /**
     * Converts tropical longitude to sidereal longitude.
     *
     * @param {number} tropicalLongitude
     * @param {number} ayanamsa
     * @returns {number}
     */
    convert(tropicalLongitude, ayanamsa) {

        if (
            typeof tropicalLongitude !== "number" ||
            typeof ayanamsa !== "number"
        ) {
            throw new TypeError(
                "SiderealConversion expects numeric longitude and ayanamsa."
            );
        }

        let siderealLongitude = tropicalLongitude - ayanamsa;

        siderealLongitude %= 360;

        if (siderealLongitude < 0) {
            siderealLongitude += 360;
        }

        return siderealLongitude;
    }

});

export default SiderealConversion;