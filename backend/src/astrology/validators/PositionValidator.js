class PositionValidator {

    validate(
        planetPosition
    ) {

        if (!planetPosition) {
            throw new Error(
                "PlanetPosition is required."
            );
        }

        if (
            typeof planetPosition.planet !== "string" ||
            planetPosition.planet.trim() === ""
        ) {
            throw new Error(
                "Planet name is required."
            );
        }

        if (
            typeof planetPosition.longitude !== "number" ||
            Number.isNaN(planetPosition.longitude)
        ) {
            throw new Error(
                "Invalid longitude."
            );
        }

        if (
            planetPosition.longitude < 0 ||
            planetPosition.longitude >= 360
        ) {
            throw new Error(
                "Longitude must be between 0 and 360 degrees."
            );
        }

        if (
            typeof planetPosition.latitude !== "number" ||
            Number.isNaN(planetPosition.latitude)
        ) {
            throw new Error(
                "Invalid latitude."
            );
        }

        if (
            typeof planetPosition.distance !== "number" ||
            Number.isNaN(planetPosition.distance)
        ) {
            throw new Error(
                "Invalid distance."
            );
        }

        if (
            typeof planetPosition.longitudeSpeed !== "number" ||
            Number.isNaN(planetPosition.longitudeSpeed)
        ) {
            throw new Error(
                "Invalid longitude speed."
            );
        }

        if (
            typeof planetPosition.latitudeSpeed !== "number" ||
            Number.isNaN(planetPosition.latitudeSpeed)
        ) {
            throw new Error(
                "Invalid latitude speed."
            );
        }

        if (
            typeof planetPosition.distanceSpeed !== "number" ||
            Number.isNaN(planetPosition.distanceSpeed)
        ) {
            throw new Error(
                "Invalid distance speed."
            );
        }

        return true;

    }

}

export default new PositionValidator();