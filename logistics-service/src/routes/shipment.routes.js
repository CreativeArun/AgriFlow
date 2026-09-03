import express from "express";

import {
    createShipment,
    getShipment,
    changeShipmentStatus,
    getShipments
} from "../controllers/shipment.controller.js";

const router = express.Router();

router.post("/", createShipment);

router.get("/", getShipments);

router.get("/:shipmentId", getShipment);

router.patch(
    "/:shipmentId/status",
    changeShipmentStatus
);

export default router;