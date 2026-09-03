const DEVIATION_THRESHOLD_KM = 2;

const calculateDistance = (pointA, pointB) => {

    const EARTH_RADIUS_KM = 6371;

    const toRadians = (degrees) => {
        return degrees * Math.PI / 180;
    };

    const lat1 = toRadians(pointA.latitude);
    const lat2 = toRadians(pointB.latitude);

    const deltaLat = toRadians(
        pointB.latitude - pointA.latitude
    );

    const deltaLng = toRadians(
        pointB.longitude - pointA.longitude
    );

    const a =
        Math.sin(deltaLat / 2) ** 2 +
        Math.cos(lat1) *
        Math.cos(lat2) *
        Math.sin(deltaLng / 2) ** 2;

    const c =
        2 * Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );

    return EARTH_RADIUS_KM * c;
};

export const isRouteDeviation = (
    currentLocation,
    expectedLocation
) => {

    const distance = calculateDistance(
        currentLocation,
        expectedLocation
    );

    return {
        deviated: distance > DEVIATION_THRESHOLD_KM,

        distanceFromExpectedKm:
            Number(distance.toFixed(2))
    };
};