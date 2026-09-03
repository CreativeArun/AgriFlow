import {
    createShipment as createShipmentService,
    getShipmentById,
    updateShipmentStatus,
    getAllShipments
} from "../services/shipment.service.js";

import { getIO } from "../socket/socket.js";

export const createShipment = (req, res) => {

    try {

        const {
            routeId,
            orderId,
            vehicleId,
            quantityKg
        } = req.body;

        if (!routeId) {
            return res.status(400).json({
                success: false,
                message: "routeId is required"
            });
        }

        if (
            quantityKg === undefined ||
            quantityKg <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "quantityKg must be greater than 0"
            });
        }

        const shipment =
            createShipmentService({
                routeId,
                orderId,
                vehicleId,
                quantityKg
            });

        return res.status(201).json({
            success: true,
            data: shipment
        });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const changeShipmentStatus = (req, res) => {

    try {

        const { status } = req.body;

        if (!status) {
            return res.status(400).json({
                success: false,
                message: "status is required"
            });
        }

        const shipment =
            updateShipmentStatus(
                req.params.shipmentId,
                status
            );

        const io = getIO();

io.to(`shipment:${shipment.shipmentId}`).emit(
    "shipment:status",
    {
        shipmentId: shipment.shipmentId,
        status: shipment.status,
        updatedAt: shipment.updatedAt
    }
);

        return res.json({
            success: true,
            data: shipment
        });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const getShipment = (req, res) => {

    const shipment =
        getShipmentById(req.params.shipmentId);

    if (!shipment) {
        return res.status(404).json({
            success: false,
            message: "Shipment not found"
        });
    }

    return res.json({
        success: true,
        data: shipment
    });
};

export const getShipments = (req, res) => {

    return res.json({
        success: true,
        data: getAllShipments()
    });
};