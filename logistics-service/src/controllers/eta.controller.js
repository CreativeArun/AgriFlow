import {
    calculateETA
} from "../services/eta.service.js";

export const calculateShipmentETA = (req, res) => {

    try {

        const {
            currentLocation,
            destination,
            speedKmph
        } = req.body;

        if (!currentLocation) {
            return res.status(400).json({
                success: false,
                message: "currentLocation is required"
            });
        }

        if (!destination) {
            return res.status(400).json({
                success: false,
                message: "destination is required"
            });
        }

        if (
            speedKmph === undefined ||
            speedKmph <= 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "speedKmph must be greater than 0"
            });
        }

        const result = calculateETA({
            currentLocation,
            destination,
            speedKmph
        });

        return res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};