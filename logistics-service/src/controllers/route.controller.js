import {
    createRoute as createRouteService,
    getRouteById
} from "../services/route.service.js";

import {
    optimizeRoute
} from "../services/optimization.service.js";

export const createRoute = (req, res) => {

    try {

        const {
            farm,
            collectionCentre,
            buyer,
            shipment,
            delivery
        } = req.body;

        if (
            !farm ||
            !collectionCentre ||
            !buyer ||
            !shipment
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "farm, collectionCentre, buyer and shipment are required"
            });
        }

        const optimizedRoute = optimizeRoute({
            farm,
            collectionCentre,
            buyer,
            shipment,
            delivery
        });

        const route = createRouteService({
            farm,
            collectionCentre,
            buyer,

            optimization: optimizedRoute
        });

        return res.status(201).json({
            success: true,
            data: route
        });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const getRoute = (req, res) => {

    const route = getRouteById(req.params.routeId);

    if (!route) {
        return res.status(404).json({
            success: false,
            message: "Route not found"
        });
    }

    return res.json({
        success: true,
        data: route
    });
};