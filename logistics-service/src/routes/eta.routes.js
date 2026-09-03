import express from "express";

import {
    calculateShipmentETA
} from "../controllers/eta.controller.js";

const router = express.Router();

router.post(
    "/calculate",
    calculateShipmentETA
);

export default router;