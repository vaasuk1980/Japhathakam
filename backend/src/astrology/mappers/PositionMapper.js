import PlanetPosition from "../models/PlanetPosition.js";

class PositionMapper {

    map(
        planet,
        swissPosition
    ) {

        return new PlanetPosition({

            planet,

            longitude: swissPosition.longitude,
            latitude: swissPosition.latitude,
            distance: swissPosition.distance,

            longitudeSpeed: swissPosition.longitudeSpeed,
            latitudeSpeed: swissPosition.latitudeSpeed,
            distanceSpeed: swissPosition.distanceSpeed,

            nakshatra: swissPosition.nakshatra,
            pada: swissPosition.pada

        });

    }

}

export default new PositionMapper();