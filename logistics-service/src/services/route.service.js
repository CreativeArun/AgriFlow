const routes = [];

export const createRoute = (routeData) => {

    const route = {
        routeId: `RT-${Date.now()}`,

        farm: {
            name: routeData.farm.name,
            location: {
                latitude: routeData.farm.location.latitude,
                longitude: routeData.farm.location.longitude
            }
        },

        collectionCentre: {
            name: routeData.collectionCentre.name,
            location: {
                latitude: routeData.collectionCentre.location.latitude,
                longitude: routeData.collectionCentre.location.longitude
            }
        },

        buyer: {
            name: routeData.buyer.name,
            location: {
                latitude: routeData.buyer.location.latitude,
                longitude: routeData.buyer.location.longitude
            }
        },

        status: "CREATED",

        optimization: routeData.optimization,

        createdAt: new Date().toISOString()
    };

    routes.push(route);

    return route;
};

export const getRouteById = (routeId) => {

    return routes.find(
        route => route.routeId === routeId
    );
};