const EARTH_RADIUS_KM = 6371;

const toRadians = (degrees) => {
    return degrees * Math.PI / 180;
};

const calculateDistance = (pointA, pointB) => {

    const lat1 = toRadians(pointA.lat);
    const lat2 = toRadians(pointB.lat);

    const deltaLat = toRadians(pointB.lat - pointA.lat);
    const deltaLng = toRadians(pointB.lng - pointA.lng);

    const a =
        Math.sin(deltaLat / 2) ** 2 +
        Math.cos(lat1) *
        Math.cos(lat2) *
        Math.sin(deltaLng / 2) ** 2;

    const c = 2 * Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
    );

    return EARTH_RADIUS_KM * c;
};

const optimizeRoute = (data) => {

    const {
        farm,
        collectionCentre,
        buyer,
        shipment
    } = data;

    const farmToHub = calculateDistance(
        farm.location,
        collectionCentre.location
    );

    const hubToBuyer = calculateDistance(
        collectionCentre.location,
        buyer.location
    );

    const totalDistance = farmToHub + hubToBuyer;

    const quantity = shipment.quantityKg;
    const capacity = shipment.vehicleCapacityKg;

    if (quantity > capacity) {
        throw new Error(
            `Shipment quantity ${quantity}kg exceeds vehicle capacity ${capacity}kg`
        );
    }

    const estimatedCost =
        totalDistance * shipment.vehicleCostPerKm;

    return {
        optimized: true,

        route: [
            {
                sequence: 1,
                type: "FARM",
                id: farm.id,
                name: farm.name
            },
            {
                sequence: 2,
                type: "COLLECTION_CENTRE",
                id: collectionCentre.id,
                name: collectionCentre.name
            },
            {
                sequence: 3,
                type: "BUYER",
                id: buyer.id,
                name: buyer.name
            }
        ],

        metrics: {
            farmToHubDistanceKm: Number(farmToHub.toFixed(2)),
            hubToBuyerDistanceKm: Number(hubToBuyer.toFixed(2)),
            totalDistanceKm: Number(totalDistance.toFixed(2)),
            quantityKg: quantity,
            vehicleCapacityKg: capacity,
            estimatedCost: Number(estimatedCost.toFixed(2))
        }
    };
};

export {
    optimizeRoute
};