import { Router } from "express";

import PersonRepository from "../repositories/PersonRepository.js";

const REQUIRED_FIELDS = [
    "firstName",
    "lastName",
    "dateOfBirth",
    "timeOfBirth",
    "placeOfBirth",
    "latitude",
    "longitude",
    "timezone",
];

function validate(body) {

    const missing = REQUIRED_FIELDS.filter(
        (field) => body[field] === undefined || body[field] === ""
    );

    if (missing.length > 0) {
        return `Missing required field(s): ${missing.join(", ")}.`;
    }

    return null;

}

export default function PersonRoute() {

    const router = Router();

    router.get("/", async (req, res, next) => {
        try {
            const persons = await PersonRepository.list();
            return res.status(200).json({ persons });
        } catch (error) {
            next(error);
        }
    });

    router.get("/:id", async (req, res, next) => {
        try {
            const person = await PersonRepository.getById(req.params.id);

            if (!person) {
                return res.status(404).json({ message: "Person not found." });
            }

            return res.status(200).json({ person });
        } catch (error) {
            next(error);
        }
    });

    router.post("/", async (req, res, next) => {
        try {
            const error = validate(req.body || {});

            if (error) {
                return res.status(400).json({ message: error });
            }

            const person = await PersonRepository.create(req.body);

            return res.status(201).json({ person });
        } catch (error) {
            next(error);
        }
    });

    router.put("/:id", async (req, res, next) => {
        try {
            const error = validate(req.body || {});

            if (error) {
                return res.status(400).json({ message: error });
            }

            const person = await PersonRepository.update(req.params.id, req.body);

            if (!person) {
                return res.status(404).json({ message: "Person not found." });
            }

            return res.status(200).json({ person });
        } catch (error) {
            next(error);
        }
    });

    router.delete("/:id", async (req, res, next) => {
        try {
            const removed = await PersonRepository.remove(req.params.id);

            if (!removed) {
                return res.status(404).json({ message: "Person not found." });
            }

            return res.status(204).send();
        } catch (error) {
            next(error);
        }
    });

    return router;

}
