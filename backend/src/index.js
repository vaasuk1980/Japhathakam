import express from "express";
import cors from "cors";
import swisseph from "@swisseph/node";

import BirthDetails from "./astrology/models/input/BirthDetails.js";

import BirthContextEngine from "./astrology/engines/BirthContextEngine.js";
import JanmaLagnaEngine from "./astrology/engines/JanmaLagnaEngine.js";
import PlanetPositionEngine from "./astrology/engines/PlanetPositionEngine.js";

import SwissEphemerisProvider from "./astrology/services/SwissEphemerisProvider.js";

const birthDetails = new BirthDetails({

    year: 1980,
    month: 6,
    day: 15,

    localHour: 12.5,

    // Hyderabad (temporary values)
    latitude: 17.383333333,
    longitude: 78.466666667,
    timezone: 5.5

});

const birthContext =
    BirthContextEngine.create(
        birthDetails
    );

const enrichedBirthContext =
    JanmaLagnaEngine.calculate(
        birthContext
    );

const app = express();

app.use(cors());
app.use(express.json());

app.get(
    "/api/planet-positions",
    (
        req,
        res
    ) => {

        try {

            const birthDetails =
                new BirthDetails({

                    year: 1980,
                    month: 6,
                    day: 15,

                    localHour: 12.5,

                    // Hyderabad (temporary values)
                    latitude: 17.3850,
                    longitude: 78.4867,
                    timezone: 5.5

                });

            const birthContext =
                BirthContextEngine.create(
                    birthDetails
                );

            const planetPositions =
                PlanetPositionEngine.calculate(
                    birthContext
                );

            res.json(
                planetPositions
            );

        } catch (error) {

            console.error(error);

            res.status(500).json({

                message: error.message

            });

        }

    }
);

const PORT = 3000;

app.listen(
    PORT,
    () => {

        console.log(
            `Japhathakam Backend started on port ${PORT}`
        );

    }
);