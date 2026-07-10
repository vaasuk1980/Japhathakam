import express from "express";
import cors from "cors";

import swisseph from "@swisseph/node";

import SwissEphemerisProvider from "./astrology/services/SwissEphemerisProvider.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {

    const julianDay =
        SwissEphemerisProvider.calculateJulianDay(
            1980,
            6,
            15,
            12.5
        );

    const sun =
        SwissEphemerisProvider.calculatePosition(
            julianDay,
            swisseph.Planet.Sun
        );

    res.json({
        julianDay,
        sun
    });

});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(
        `Japhathakam Backend started on port ${PORT}`
    );
});