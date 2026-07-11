import express from "express";
import cors from "cors";

import BirthContext from "./astrology/models/BirthContext.js";
import PlanetPositionEngine from "./astrology/engines/PlanetPositionEngine.js";

import NakshatraCalculation from "./astrology/calculations/NakshatraCalculation.js";

const calculation = new NakshatraCalculation();

console.log(calculation.calculate(0));
console.log(calculation.calculate(15));
console.log(calculation.calculate(40));
console.log(calculation.calculate(180));
console.log(calculation.calculate(359.999999));
console.log(calculation.calculate(360));



const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/planet-positions", (req, res) => {

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