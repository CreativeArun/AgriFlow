export const farmerNav = ['Dashboard', 'My Lots', 'Add Produce', 'Orders', 'Market Prices', 'AI Insights', 'Shipments', 'Profile']
export const buyerNav = ['Dashboard', 'Find Produce', 'My Tenders', 'Orders', 'Shipments', 'Market Intelligence', 'Profile']

export const lots = [
  { id: 'LOT-1048', crop: 'Onion', quantity: '500 kg', grade: 'Grade A', price: '₹2,780/qtl', status: 'Available', created: 'Today', buyer: '—' },
  { id: 'LOT-1042', crop: 'Potato', quantity: '800 kg', grade: 'Grade A', price: '₹2,150/qtl', status: 'Reserved', created: '24 May', buyer: 'FreshCart Foods' },
  { id: 'LOT-1035', crop: 'Wheat', quantity: '1.2 tonnes', grade: 'Grade B', price: '₹2,420/qtl', status: 'In review', created: '19 May', buyer: '—' },
]

export const produce = [
  { crop: 'Onion', grade: 'Grade A', quantity: '1,000 kg available', location: 'Haryana', price: '₹2,750/qtl', score: 87, harvest: 'Harvested 2 days ago', accent: 'onion' },
  { crop: 'Potato', grade: 'Grade A', quantity: '2,400 kg available', location: 'Ghaziabad', price: '₹2,150/qtl', score: 91, harvest: 'Harvested 4 days ago', accent: 'potato' },
  { crop: 'Tomato', grade: 'Grade B', quantity: '750 kg available', location: 'Noida', price: '₹1,980/qtl', score: 78, harvest: 'Harvested yesterday', accent: 'tomato' },
]

export const notifications = [
  { text: 'Your Onion lot received a Grade A assessment.', time: '12 min ago', type: 'success' },
  { text: 'Buyer B placed an order for 500 kg.', time: '1 hr ago', type: 'info' },
  { text: 'Vehicle has deviated from the planned route.', time: '2 hrs ago', type: 'warning' },
]

export const shipment = { id: 'SHP-001', status: 'On Route', vehicle: 'HR 38 AB 2041', location: 'Collection Centre, Sonipat', eta: 'Today, 4:30 PM', distance: '24.35 km', deviation: true }

export const order = { id: 'ORD-2084', buyer: 'FreshCart Foods', crop: 'Onion', quantity: '500 kg', amount: '₹13,900', status: 'In transit', date: '28 May 2024' }

export const services = {
  authService: { login: async () => null, register: async () => null },
  farmerService: { getDashboard: async () => null, getProfile: async () => null },
  buyerService: { getDashboard: async () => null, getRequirements: async () => null },
  lotService: { list: async () => lots, create: async () => null },
  orderService: { list: async () => [order], get: async () => order },
  dashboardService: { getSummary: async () => null },
  aiService: { assessQuality: async () => null, getPriceForecast: async () => null, getMatches: async () => null },
  logisticsService: { getShipment: async () => shipment, recalculateRoute: async () => null },
  trackingService: { subscribe: () => () => {} },
}

export const mockEvents = ['vehicle:location', 'route:updated', 'shipment:started', 'shipment:status', 'shipment:delivered']

export const pricePoints = [38, 43, 41, 49, 53, 57, 62, 68]
export const demandPoints = [22, 31, 27, 38, 34, 42, 39]
