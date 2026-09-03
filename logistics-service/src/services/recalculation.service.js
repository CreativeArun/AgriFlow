// ---------------------------------------
// DISTANCE CALCULATION
// ---------------------------------------

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


// ---------------------------------------
// ROAD ROUTE RECALCULATION
// ---------------------------------------

export const recalculateRoute = async ({
    currentLocation,
    destination
}) => {

    // OSRM expects:
    // longitude,latitude

    const coordinates =
        `${currentLocation.longitude},${currentLocation.latitude};` +
        `${destination.longitude},${destination.latitude}`;


    // OSRM routing API

    const url =
        `https://router.project-osrm.org/route/v1/driving/${coordinates}` +
        `?overview=full&geometries=geojson`;


    // Request road route

    const response = await fetch(url);


    if (!response.ok) {

        throw new Error(
            `Routing service failed: ${response.status}`
        );

    }


    const data = await response.json();


    // Validate OSRM response

    if (
        data.code !== "Ok" ||
        !data.routes ||
        data.routes.length === 0
    ) {

        throw new Error(
            "No road route found"
        );

    }


    const osrmRoute = data.routes[0];


    // ---------------------------------------
    // CONVERT OSRM COORDINATES
    // ---------------------------------------

    // OSRM:
    // [longitude, latitude]

    // Leaflet:
    // [latitude, longitude]

    const roadCoordinates =
        osrmRoute.geometry.coordinates.map(
            ([longitude, latitude]) => {

                return [
                    latitude,
                    longitude
                ];

            }
        );


    // ---------------------------------------
    // STRAIGHT-LINE DISTANCE
    // ---------------------------------------

    const straightLineDistance =
        calculateDistance(
            currentLocation,
            destination
        );


    // ---------------------------------------
    // RETURN RECALCULATED ROUTE
    // ---------------------------------------

    return {

        recalculated: true,

        route: roadCoordinates,

        metrics: {

            // Actual road distance

            remainingDistanceKm:
                Number(
                    (
                        osrmRoute.distance / 1000
                    ).toFixed(2)
                ),


            // Straight-line distance

            straightLineDistanceKm:
                Number(
                    straightLineDistance.toFixed(2)
                ),


            // Estimated driving time

            estimatedDurationMinutes:
                Number(
                    (
                        osrmRoute.duration / 60
                    ).toFixed(1)
                )

        },

        updatedAt:
            new Date().toISOString()

    };

};