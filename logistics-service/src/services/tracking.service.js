const trackingData = new Map();

export const updateLocation = (locationData) => {

    const {
        shipmentId,
        routeId,
        vehicleId,
        latitude,
        longitude
    } = locationData;

    const location = {
        shipmentId,
        routeId,
        vehicleId,
        latitude,
        longitude,
        updatedAt: new Date().toISOString()
    };

    trackingData.set(shipmentId, location);

    return location;
};

export const getLatestLocation = (shipmentId) => {

    return trackingData.get(shipmentId);
};