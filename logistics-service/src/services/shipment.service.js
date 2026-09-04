const shipments = [
    {
        shipmentId: "SHP-001",
        routeId: "ROUTE-001",
        orderId: "ORD-2084",
        vehicleId: "HR 38 AB 2041",
        quantityKg: 500,
        status: "TRANSIT",
        statusHistory: [
            { status: "CREATED", timestamp: new Date().toISOString() },
            { status: "PICKUP", timestamp: new Date().toISOString() },
            { status: "TRANSIT", timestamp: new Date().toISOString() }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
];

const SHIPMENT_STATES = {
    CREATED: "CREATED",
    PICKUP: "PICKUP",
    TRANSIT: "TRANSIT",
    DELIVERED: "DELIVERED"
};

const VALID_TRANSITIONS = {
    CREATED: ["PICKUP"],
    PICKUP: ["TRANSIT"],
    TRANSIT: ["DELIVERED"],
    DELIVERED: []
};

export const createShipment = (shipmentData) => {

    const shipment = {
        shipmentId: `SHP-${Date.now()}`,

        routeId: shipmentData.routeId,

        orderId: shipmentData.orderId || null,

        vehicleId: shipmentData.vehicleId || null,

        quantityKg: shipmentData.quantityKg,

        status: SHIPMENT_STATES.CREATED,

        statusHistory: [
            {
                status: SHIPMENT_STATES.CREATED,
                timestamp: new Date().toISOString()
            }
        ],

        createdAt: new Date().toISOString(),

        updatedAt: new Date().toISOString()
    };

    shipments.push(shipment);

    return shipment;
};

export const getShipmentById = (shipmentId) => {

    return shipments.find(
        shipment => shipment.shipmentId === shipmentId
    );
};

export const updateShipmentStatus = (
    shipmentId,
    newStatus
) => {

    const shipment = getShipmentById(shipmentId);

    if (!shipment) {
        throw new Error("Shipment not found");
    }

    if (!Object.values(SHIPMENT_STATES).includes(newStatus)) {
        throw new Error(`Invalid shipment status: ${newStatus}`);
    }

    const currentStatus = shipment.status;

    const allowedStatuses =
        VALID_TRANSITIONS[currentStatus];

    if (!allowedStatuses.includes(newStatus)) {

        throw new Error(
            `Invalid transition: ${currentStatus} → ${newStatus}`
        );
    }

    shipment.status = newStatus;

    shipment.statusHistory.push({
        status: newStatus,
        timestamp: new Date().toISOString()
    });

    shipment.updatedAt = new Date().toISOString();

    return shipment;
};

export const getAllShipments = () => {
    return shipments;
};