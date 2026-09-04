export const farmerNav = ['Dashboard', 'My Lots', 'Add Produce', 'Orders', 'Market Prices', 'AI Insights', 'Shipments', 'Agri Capital', 'Profile']
export const buyerNav = ['Dashboard', 'Find Produce', 'My Tenders', 'Orders', 'Shipments', 'Market Intelligence', 'Agri Capital', 'Profile']

export const lots = [
  { id: 'LOT-1048', crop: 'Onion', quantity: '500 kg', grade: 'Grade A', price: '₹2,780/qtl', status: 'Available', created: 'Today', buyer: '—', qualityScore: 88, imageUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80' },
  { id: 'LOT-1045', crop: 'Watermelon', quantity: '1,500 kg', grade: 'Grade A', price: '₹1,250/qtl', status: 'Available', created: 'Today', buyer: '—', qualityScore: 92, imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80' },
  { id: 'LOT-1042', crop: 'Potato', quantity: '800 kg', grade: 'Grade A', price: '₹2,150/qtl', status: 'Reserved', created: '24 May', buyer: 'FreshCart Foods', qualityScore: 91, imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80' },
  { id: 'LOT-1035', crop: 'Wheat', quantity: '1.2 tonnes', grade: 'Grade B', price: '₹2,420/qtl', status: 'In review', created: '19 May', buyer: '—', qualityScore: 78, imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80' },
]

export const produce = [
  { id: 1, crop: 'Onion', grade: 'Grade A', quantity: '1,000 kg available', location: 'Panipat, Haryana', price: '₹2,750/qtl', score: 87, harvest: 'Harvested 2 days ago', accent: 'onion', imageUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80' },
  { id: 2, crop: 'Watermelon', grade: 'Grade A', quantity: '3,000 kg available', location: 'Malur, Karnataka', price: '₹1,250/qtl', score: 94, harvest: 'Harvested yesterday', accent: 'watermelon', imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80' },
  { id: 3, crop: 'Potato', grade: 'Grade A', quantity: '2,400 kg available', location: 'Ghaziabad, UP', price: '₹2,150/qtl', score: 91, harvest: 'Harvested 4 days ago', accent: 'potato', imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80' },
  { id: 4, crop: 'Tomato', grade: 'Grade B', quantity: '750 kg available', location: 'Noida, UP', price: '₹1,980/qtl', score: 78, harvest: 'Harvested yesterday', accent: 'tomato', imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80' },
  { id: 5, crop: 'Papaya', grade: 'Grade A', quantity: '1,200 kg available', location: 'Ahmednagar, MH', price: '₹1,850/qtl', score: 89, harvest: 'Harvested today', accent: 'papaya', imageUrl: 'https://images.unsplash.com/photo-1617112848923-cc2234396a8d?auto=format&fit=crop&w=600&q=80' },
  { id: 6, crop: 'Basmati Rice', grade: 'Grade A', quantity: '5,000 kg available', location: 'Karnal, Haryana', price: '₹3,850/qtl', score: 95, harvest: 'Harvested 3 days ago', accent: 'wheat', imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80' },
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
  trackingService: { subscribe: () => () => { } },
}

export const mockEvents = ['vehicle:location', 'route:updated', 'shipment:started', 'shipment:status', 'shipment:delivered']

export const pricePoints = [38, 43, 41, 49, 53, 57, 62, 68]
export const demandPoints = [22, 31, 27, 38, 34, 42, 39]
