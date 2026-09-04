import {
    updateLocation as updateLocationService,
    getLatestLocation
} from "../services/tracking.service.js";

import { getIO } from "../socket/socket.js";

import {
    getRouteById
} from "../services/route.service.js";

import {
    isRouteDeviation
} from "../services/deviation.service.js";

import {
    recalculateRoute
} from "../services/recalculation.service.js";


export const updateTrackingLocation = async (req, res) => {

    try {

        const {
            shipmentId,
            routeId,
            vehicleId,
            latitude,
            longitude
        } = req.body;


        // -----------------------------
        // VALIDATION
        // -----------------------------

        if (!shipmentId) {
            return res.status(400).json({
                success: false,
                message: "shipmentId is required"
            });
        }

        if (!routeId) {
            return res.status(400).json({
                success: false,
                message: "routeId is required"
            });
        }

        if (!vehicleId) {
            return res.status(400).json({
                success: false,
                message: "vehicleId is required"
            });
        }

        if (
            latitude === undefined ||
            longitude === undefined
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "latitude and longitude are required"
            });
        }

        if (
            latitude < -90 ||
            latitude > 90
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid latitude"
            });
        }

        if (
            longitude < -180 ||
            longitude > 180
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid longitude"
            });
        }


        // -----------------------------
        // GET ROUTE
        // -----------------------------

        const route = getRouteById(routeId);

        if (!route) {
            return res.status(404).json({
                success: false,
                message: "Route not found"
            });
        }


        // -----------------------------
        // SAVE GPS LOCATION
        // -----------------------------

        const location =
            updateLocationService({
                shipmentId,
                routeId,
                vehicleId,
                latitude,
                longitude
            });


        // -----------------------------
        // SOCKET.IO
        // -----------------------------

        const io = getIO();

        io.to(`shipment:${shipmentId}`).emit(
            "vehicle:location",
            location
        );


        // -----------------------------
        // DEVIATION DETECTION
        // -----------------------------

        const expectedLocation =
            route.collectionCentre.location;

        const deviation = isRouteDeviation(
            {
                latitude,
                longitude
            },
            expectedLocation
        );


        console.log(
            "Route deviation:",
            deviation
        );


        // -----------------------------
        // ROUTE RECALCULATION
        // -----------------------------

        if (deviation.deviated) {

            const destination =
                route.buyer.location;

            const newRoute = await recalculateRoute({
    currentLocation: {
        latitude,
        longitude
    },
    destination
});


            // -----------------------------
            // BROADCAST UPDATED ROUTE
            // -----------------------------

            io.to(`shipment:${shipmentId}`).emit(
                "route:updated",
                {
                    shipmentId,
                    routeId,
                    reason: "ROUTE_DEVIATION",
                    deviationDistanceKm:
                        deviation.distanceFromExpectedKm,
                    ...newRoute
                }
            );

        }


        // -----------------------------
        // RESPONSE
        // -----------------------------

        return res.status(200).json({
            success: true,
            data: {
                location,
                deviation
            }
        });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: error.message
        });

    }
};


export const getTrackingLocation = (req, res) => {

    const location =
        getLatestLocation(req.params.shipmentId);

    if (!location) {
        return res.status(404).json({
            success: false,
            message: "Tracking location not found"
        });
    }

    return res.status(200).json({
        success: true,
        data: location
    });
};