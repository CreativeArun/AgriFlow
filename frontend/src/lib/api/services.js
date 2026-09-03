import { io } from 'socket.io-client';
import { lots as mockLots, order as mockOrder, shipment as mockShipment, services as mockServices } from '../mock/data.js';

const JAVA_API_URL = 'http://localhost:8080/api';
const LOGISTICS_API_URL = 'http://localhost:5000/api';
const SOCKET_URL = 'http://localhost:5000';

async function fetchJson(url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    throw error;
  }
}

export const authService = {
  login: async (credentials) => {
    // Implement real login when backend supports JWT auth
    // For now, simulate by fetching all users or consumers and returning a dummy token
    try {
      const users = await fetchJson(`${JAVA_API_URL}/users`);
      if (users && users.length > 0) return { token: 'dummy_token', user: users[0] };
    } catch (e) {}
    return { token: 'mock_token', user: { id: 1, name: 'Mock User' } };
  },
  register: async (userData) => {
    return fetchJson(`${JAVA_API_URL}/users`, {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }
};

export const farmerService = {
  getDashboard: async () => mockServices.farmerService.getDashboard(),
  getProfile: async (id) => fetchJson(`${JAVA_API_URL}/farmers/${id}`).catch(() => null)
};

export const buyerService = {
  getDashboard: async () => mockServices.buyerService.getDashboard(),
  getRequirements: async () => mockServices.buyerService.getRequirements()
};

export const lotService = {
  list: async () => {
    try {
      const products = await fetchJson(`${JAVA_API_URL}/products`);
      return products.map(p => ({
        id: `LOT-${p.id}`,
        crop: p.name,
        quantity: `${p.quantity} kg`,
        grade: p.grade,
        price: `₹${p.price}/qtl`,
        status: p.status,
        created: p.createdAt || 'Today',
        buyer: p.buyer || '—'
      }));
    } catch (e) {
      console.warn("Falling back to mock lots:", e);
      return mockLots;
    }
  },
  create: async (data) => {
    return fetchJson(`${JAVA_API_URL}/products`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
};

export const orderService = {
  list: async () => {
    try {
      const orders = await fetchJson(`${JAVA_API_URL}/orders`);
      return orders.map(o => ({
        id: `ORD-${o.id}`,
        buyer: o.consumer?.name || 'Unknown Buyer',
        crop: o.product?.name || 'Unknown Crop',
        quantity: `${o.quantity} kg`,
        amount: `₹${o.totalPrice}`,
        status: o.status,
        date: o.orderDate || 'Today'
      }));
    } catch (e) {
      console.warn("Falling back to mock order:", e);
      return [mockOrder];
    }
  },
  get: async (id) => {
    try {
      const o = await fetchJson(`${JAVA_API_URL}/orders/${id}`);
      return {
        id: `ORD-${o.id}`,
        buyer: o.consumer?.name || 'Unknown Buyer',
        crop: o.product?.name || 'Unknown Crop',
        quantity: `${o.quantity} kg`,
        amount: `₹${o.totalPrice}`,
        status: o.status,
        date: o.orderDate || 'Today'
      };
    } catch (e) {
      return mockOrder;
    }
  },
  create: async (orderData) => {
    const params = new URLSearchParams(orderData);
    return fetchJson(`${JAVA_API_URL}/orders?${params.toString()}`, {
      method: 'POST'
    });
  }
};

export const marketplaceService = {
  getProducts: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.grade) params.append('grade', filters.grade);
      if (filters.location) params.append('location', filters.location);
      if (filters.minScore) params.append('minScore', filters.minScore);
      if (filters.sort) params.append('sort', filters.sort);

      const products = await fetchJson(`${JAVA_API_URL}/marketplace/products?${params.toString()}`);
      return products.map(p => ({
        id: p.id,
        crop: p.name,
        grade: p.grade || 'Standard',
        quantity: `${p.quantity} kg available`,
        location: p.farmer?.location || 'Unknown Location',
        price: `₹${p.price}/qtl`,
        score: p.qualityScore || 85,
        harvest: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'Recently',
        accent: p.name.toLowerCase()
      }));
    } catch (e) {
      console.warn("Falling back to mock produce:", e);
      // Fallback to mock data is handled in the component for now, but we can return mock here too.
      throw e;
    }
  }
};

export const dashboardService = mockServices.dashboardService;

export const aiService = mockServices.aiService;

export const logisticsService = {
  getShipment: async (id) => {
    try {
      const response = await fetchJson(`${LOGISTICS_API_URL}/shipments/${id}`);
      return {
        id: response.id || id,
        status: response.status || 'On Route',
        vehicle: response.vehicleId || 'Unknown Vehicle',
        location: response.currentLocation?.address || 'Unknown Location',
        eta: response.eta || 'Unknown ETA',
        distance: response.distance || 'Unknown',
        deviation: response.deviation || false
      };
    } catch (e) {
      console.warn("Falling back to mock shipment:", e);
      return mockShipment;
    }
  },
  recalculateRoute: async (shipmentId) => {
    return fetchJson(`${LOGISTICS_API_URL}/logistics/recalculate`, {
      method: 'POST',
      body: JSON.stringify({ shipmentId })
    });
  }
};

export const trackingService = {
  subscribe: (shipmentId, callbacks) => {
    const socket = io(SOCKET_URL);
    
    socket.emit('subscribeToShipment', shipmentId);

    if (callbacks.onLocationUpdate) socket.on('vehicle:location', callbacks.onLocationUpdate);
    if (callbacks.onRouteUpdate) socket.on('route:updated', callbacks.onRouteUpdate);
    if (callbacks.onStatusUpdate) socket.on('shipment:status', callbacks.onStatusUpdate);
    if (callbacks.onDeviation) socket.on('route:deviation', callbacks.onDeviation);
    
    return () => {
      socket.disconnect();
    };
  }
};
