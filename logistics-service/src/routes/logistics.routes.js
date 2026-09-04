import express from "express";

import {
    createRoute,
    getRoute
} from "../controllers/route.controller.js";

const router = express.Router();

router.post("/route", createRoute);

router.get("/route/:routeId", getRoute);

export default router;