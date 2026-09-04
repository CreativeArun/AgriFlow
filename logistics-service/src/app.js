import express from "express";
import cors from "cors";

import logisticsRoutes from "./routes/logistics.routes.js";
import shipmentRoutes from "./routes/shipment.routes.js";
import trackingRoutes from "./routes/tracking.routes.js";
import etaRoutes from "./routes/eta.routes.js";
import recalculationRoutes
    from "./routes/recalculation.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use(
    "/api/eta",
    etaRoutes
);

app.use(
    "/api/logistics",
    recalculationRoutes
);

app.get("/health", (req, res) => {
    res.json({
        success: true,
        service: "logistics-service",
        status: "UP"
    });
});

app.use(
    "/api/logistics",
    logisticsRoutes
);

app.use(
    "/api/shipments",
    shipmentRoutes
);

app.use(
    "/api/tracking",
    trackingRoutes
);

export default app;