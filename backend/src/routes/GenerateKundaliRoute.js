import { Router } from "express";

export default function GenerateKundaliRoute({
    generateKundaliController
}) {

    const router = Router();

    router.post(
        "/",
        generateKundaliController.execute.bind(generateKundaliController)
    );

    return router;
}