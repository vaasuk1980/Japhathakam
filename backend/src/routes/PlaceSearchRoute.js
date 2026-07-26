import { Router } from 'express';

import PlaceSearchService from '../services/PlaceSearchService.js';

export default function PlaceSearchRoute() {
    const router = Router();

    router.get('/', async (req, res, next) => {
        try {
            const query = req.query.q;

            if (!query) {
                return res.status(400).json({
                    message: 'Query parameter q is required.'
                });
            }

            const places = await PlaceSearchService.search(query);

            return res.status(200).json({
                places
            });
        } catch (error) {
            next(error);
        }
    });

    return router;
}
