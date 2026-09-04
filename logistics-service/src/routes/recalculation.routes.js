import express from "express";

import {
    recalculateShipmentRoute
} from "../controllers/recalculation.controller.js";

const router = express.Router();

router.post(
    "/recalculate",
    recalculateShipmentRoute
);

export default router;