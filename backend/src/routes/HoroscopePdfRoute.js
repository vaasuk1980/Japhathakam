import { Router } from "express";

import HoroscopePdfService from "../services/HoroscopePdfService.js";

export default function HoroscopePdfRoute() {

    const router = Router();

    router.get("/:id/pdf", async (req, res, next) => {
        try {

            const pdfBuffer = await HoroscopePdfService.generate(req.params.id);

            if (!pdfBuffer) {
                return res.status(404).json({ message: "Person not found." });
            }

            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", `attachment; filename="horoscope-${req.params.id}.pdf"`);

            return res.status(200).send(pdfBuffer);

        } catch (error) {
            next(error);
        }
    });

    return router;

}
