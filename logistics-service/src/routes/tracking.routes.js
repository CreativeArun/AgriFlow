import express from "express";
import { updateTrackingLocation, getTrackingLocation
} from "../controllers/tracking.controller.js";

const router = express.Router();

router.post("/location", updateTrackingLocation);

router.get("/location/:shipmentId", getTrackingLocation);

export default router;