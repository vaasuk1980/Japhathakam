import express from "express";
import cors from "cors";

import BirthContext from "./astrology/models/BirthContext.js";
import PlanetPositionEngine from "./astrology/engines/PlanetPositionEngine.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {

    const birthContext =
        new BirthContext({

            year: 1980,
            month: 6,
            day: 15,

            // 12:30 PM
            hour: 12.5

        });

    const planetPositions =
        PlanetPositionEngine.calculate(
            birthContext
        );

    console.log(
        JSON.stringify(
            planetPositions,
            null,
            4
        )
    );

    res.json(
        planetPositions
    );

});

const PORT = 3000;

app.listen(PORT, () => {

    console.log(
        `Japhathakam Backend started on port ${PORT}`
    );

});