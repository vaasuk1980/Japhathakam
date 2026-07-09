import express from "express";
import cors from "cors";

import SwissEphemerisProvider from "./astrology/services/SwissEphemerisProvider.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {

    const jd = SwissEphemerisProvider.calculateJulianDay(
        1980,
        6,
        15,
        12.5
    );

    res.json({
        success: true,
        julianDay: jd
    });

});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(
        `Japhathakam Backend started on port ${PORT}`
    );
});