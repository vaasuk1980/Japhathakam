import "dotenv/config";

import express from "express";
import cors from "cors";

import bootstrap from "./config/bootstrap.js";

const app = express();

app.use(cors());
app.use(express.json());

// Register application routes
bootstrap(app);

/*
|--------------------------------------------------------------------------
| Error Handler
|--------------------------------------------------------------------------
|
| Logs all application errors and returns a JSON response.
|
*/

app.use((error, req, res, next) => {

    console.error("========================================");
    console.error("UNHANDLED APPLICATION ERROR");
    console.error("========================================");
    console.error(error);
    console.error("========================================");

    res.status(500).json({
        message: error.message
    });

});

const PORT = 3000;

app.listen(
    PORT,
    () => {

        console.log(
            `Japhathakam Backend started on port ${PORT}`
        );

    }
);