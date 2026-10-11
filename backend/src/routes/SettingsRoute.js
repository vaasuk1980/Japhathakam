import { Router } from "express";

import SettingsRepository from "../repositories/SettingsRepository.js";

export default function SettingsRoute() {

    const router = Router();

    router.get("/", async (req, res, next) => {
        try {
            return res.status(200).json({ settings: await SettingsRepository.get() });
        } catch (error) {
            next(error);
        }
    });

    // Partial update: only the keys present are changed.
    router.put("/", async (req, res, next) => {
        try {
            const settings = await SettingsRepository.update(req.body || {});
            return res.status(200).json({ settings });
        } catch (error) {
            next(error);
        }
    });

    // Back to the shipped defaults.
    router.delete("/", async (req, res, next) => {
        try {
            const settings = await SettingsRepository.update(SettingsRepository.defaults());
            return res.status(200).json({ settings });
        } catch (error) {
            next(error);
        }
    });

    return router;

}
