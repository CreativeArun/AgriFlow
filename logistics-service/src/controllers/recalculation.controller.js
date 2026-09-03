import {
    recalculateRoute
} from "../services/recalculation.service.js";

import {
    getIO
} from "../socket/socket.js";

export const recalculateShipmentRoute = async (
    req,
    res
) => {

    try {

        const {
            shipmentId,
            currentLocation,
            destination
        } = req.body;

        if (!shipmentId) {
            return res.status(400).json({
                success: false,
                message: "shipmentId is required"
            });
        }

        if (!currentLocation) {
            return res.status(400).json({
                success: false,
                message:
                    "currentLocation is required"
            });
        }

        if (!destination) {
            return res.status(400).json({
                success: false,
                message:
                    "destination is required"
            });
        }

        const route = await recalculateRoute({
            currentLocation,
            destination
        });

        const io = getIO();

        io.to(`shipment:${shipmentId}`).emit(
            "route:updated",
            {
                shipmentId,
                ...route
            }
        );

        return res.status(200).json({
            success: true,
            data: {
                shipmentId,
                ...route
            }
        });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};