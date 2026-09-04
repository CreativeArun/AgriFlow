const routes = [
    {
        routeId: "ROUTE-001",
        farm: {
            name: "Ramesh Organic Farm, Panipat",
            location: {
                latitude: 29.3909,
                longitude: 76.9635
            }
        },
        collectionCentre: {
            name: "Sonipat Collection Centre",
            location: {
                latitude: 28.9931,
                longitude: 77.0151
            }
        },
        buyer: {
            name: "FreshCart Foods, Azadpur Mandi",
            location: {
                latitude: 28.7159,
                longitude: 77.1706
            }
        },
        status: "ACTIVE",
        optimization: { type: "SHORTEST_TIME" },
        createdAt: new Date().toISOString()
    }
];

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