const EARTH_RADIUS_KM = 6371;

const toRadians = (degrees) => {
    return degrees * Math.PI / 180;
};

const calculateDistance = (pointA, pointB) => {

    const lat1 = toRadians(pointA.latitude);
    const lat2 = toRadians(pointB.latitude);

    const deltaLat =
        toRadians(pointB.latitude - pointA.latitude);

    const deltaLng =
        toRadians(pointB.longitude - pointA.longitude);

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

export const calculateETA = ({
    currentLocation,
    destination,
    speedKmph
}) => {

    if (speedKmph <= 0) {
        throw new Error(
            "Speed must be greater than 0"
        );
    }

    const distanceKm = calculateDistance(
        currentLocation,
        destination
    );

    const travelHours =
        distanceKm / speedKmph;

    const travelMinutes =
        travelHours * 60;

    const eta = new Date(
        Date.now() + travelMinutes * 60 * 1000
    );

    return {
        distanceRemainingKm:
            Number(distanceKm.toFixed(2)),

        speedKmph,

        estimatedMinutes:
            Math.ceil(travelMinutes),

        eta: eta.toISOString()
    };
};