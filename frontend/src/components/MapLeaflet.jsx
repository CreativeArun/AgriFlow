import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { logisticsService, trackingService } from '../lib/api/services.js';
import { MapPin, Radio } from 'lucide-react';

const STATE_CENTROIDS = {
  'punjab': [30.9010, 75.8573],          // Central Punjab (Ludhiana)
  'haryana': [29.3909, 76.9635],         // Central Haryana (Panipat/Karnal)
  'uttar pradesh': [26.8467, 80.9462],   // Central UP (Lucknow)
  'up': [26.8467, 80.9462],
  'delhi': [28.6139, 77.2090],
  'rajasthan': [26.9124, 75.7873],       // Jaipur
  'madhya pradesh': [23.2599, 77.4126],  // Bhopal
  'mp': [23.2599, 77.4126],
  'maharashtra': [19.9975, 73.7898],     // Nashik
  'karnataka': [12.9716, 77.5946],       // Bengaluru
  'tamil nadu': [13.0827, 80.2707],      // Chennai
  'telangana': [17.3850, 78.4867],       // Hyderabad
  'andhra pradesh': [16.5062, 80.6480],  // Vijayawada
  'ap': [16.5062, 80.6480],
  'gujarat': [23.0225, 72.5714],         // Ahmedabad
  'bihar': [25.5941, 85.1376],           // Patna
  'west bengal': [22.5726, 88.3639],     // Kolkata
  'himachal': [31.1048, 77.1734],        // Shimla
  'himachal pradesh': [31.1048, 77.1734],
  'jammu': [32.7266, 74.8570],
  'kashmir': [34.0837, 74.7973],
  'kerala': [9.9312, 76.2673]
};

const KNOWN_COORDINATES = {
  // Disambiguated Multi-Location Names
  'ghazipur uttar pradesh': [25.5840, 83.5770],
  'ghazipur up': [25.5840, 83.5770],
  'ghazipur mandi': [28.6256, 77.3292],
  'ghazipur delhi': [28.6256, 77.3292],
  'ghazipur': [25.5840, 83.5770], // Default Ghazipur district in UP unless mandi specified

  // Punjab (including spelling variations)
  'ludhiana': [30.9010, 75.8573],
  'ludhiyana': [30.9010, 75.8573],
  'ludhianah': [30.9010, 75.8573],
  'chandigarh': [30.7333, 76.7794],
  'amritsar': [31.6340, 74.8723],
  'jalandhar': [31.3260, 75.5762],
  'patiala': [30.3398, 76.3869],
  'bathinda': [30.2110, 74.9455],
  'bhatinda': [30.2110, 74.9455],
  'moga': [30.8230, 75.1734],
  'khanna': [30.7060, 76.2200],
  'hoshiarpur': [31.5300, 75.9100],
  'ferozepur': [30.9237, 74.6033],
  'firozpur': [30.9237, 74.6033],
  'pathankot': [32.2684, 75.6529],
  'sangrur': [30.2450, 75.8420],
  'faridkot': [30.6769, 74.7583],
  'fazilka': [30.4037, 74.0254],
  'mansa': [29.9880, 75.3960],
  'kapurthala': [31.3800, 75.3800],
  'barnala': [30.3819, 75.5460],
  'abohar': [30.1450, 74.1990],

  // Haryana
  'yamunanagar': [30.1290, 77.2674],
  'yamuna nagar': [30.1290, 77.2674],
  'jagadhri': [30.1681, 77.2970],
  'panipat': [29.3909, 76.9635],
  'sonipat': [28.9931, 77.0151],
  'sonepat': [28.9931, 77.0151],
  'karnal': [29.6857, 76.9905],
  'kurukshetra': [29.9695, 76.8783],
  'ambala': [30.3782, 76.7767],
  'rohtak': [28.8955, 76.6066],
  'hisar': [29.1492, 75.7217],
  'hissar': [29.1492, 75.7217],
  'sirsa': [29.5349, 75.0298],
  'fatehabad': [29.5146, 75.4542],
  'gurugram': [28.4595, 77.0266],
  'gurgaon': [28.4595, 77.0266],
  'faridabad': [28.4089, 77.3178],
  'jind': [29.3160, 76.3150],
  'kaithal': [29.8015, 76.3996],
  'rewari': [28.1920, 76.6186],
  'palwal': [28.1447, 77.3256],
  'bhiwani': [28.7932, 76.1390],
  'jhajjar': [28.6063, 76.6565],
  'panchkula': [30.6942, 76.8606],
  'charkhi dadri': [28.5921, 76.2653],
  'nuh': [28.1130, 77.0150],
  'mahendragarh': [28.2810, 76.1520],

  // Delhi NCR
  'delhi': [28.6139, 77.2090],
  'new delhi': [28.6139, 77.2090],
  'azadpur': [28.7159, 77.1706],
  'azadpur mandi': [28.7159, 77.1706],
  'okhla': [28.5434, 77.2848],
  'okhla mandi': [28.5434, 77.2848],
  'keshopur': [28.6472, 77.0932],
  'narela': [28.8527, 77.0932],
  'noida': [28.5355, 77.3910],
  'greater noida': [28.4744, 77.5040],
  'ghaziabad': [28.6692, 77.4538],

  // Uttar Pradesh
  'fatehpur': [25.9286, 80.8130],
  'fatehpur uttar pradesh': [25.9286, 80.8130],
  'fatehpur up': [25.9286, 80.8130],
  'fatehpur sikri': [27.0945, 77.6679],
  'kanpur': [26.4499, 80.3319],
  'lucknow': [26.8467, 80.9462],
  'prayagraj': [25.4358, 81.8463],
  'allahabad': [25.4358, 81.8463],
  'varanasi': [25.3176, 82.9739],
  'banaras': [25.3176, 82.9739],
  'kashi': [25.3176, 82.9739],
  'gorakhpur': [26.7606, 83.3732],
  'agra': [27.1767, 78.0081],
  'aligarh': [27.8974, 78.0880],
  'mathura': [27.4924, 77.6737],
  'meerut': [28.9845, 77.7064],
  'muzaffarnagar': [29.4727, 77.7085],
  'muzaffar nagar': [29.4727, 77.7085],
  'saharanpur': [29.9671, 77.5510],
  'bareilly': [28.3670, 79.4304],
  'moradabad': [28.8386, 78.7733],
  'hapur': [28.7306, 77.7759],
  'ayodhya': [26.7922, 82.1998],
  'faizabad': [26.7730, 82.1460],
  'jhansi': [25.4484, 78.5685],
  'firozabad': [27.1591, 78.3957],
  'etawah': [26.7769, 79.0238],
  'unnao': [26.5393, 80.4878],
  'raebareli': [26.2269, 81.2427],
  'sultanpur': [26.2648, 82.0727],
  'pratapgarh': [25.8970, 81.9442],
  'jaunpur': [25.7464, 82.6837],
  'mirzapur': [25.1337, 82.5644],
  'ballia': [25.7600, 84.1485],
  'deoria': [26.5024, 83.7791],
  'azamgarh': [26.0738, 83.1859],
  'basti': [26.7995, 82.7634],
  'gonda': [27.1306, 81.9619],
  'bahraich': [27.5750, 81.5971],
  'barabanki': [26.9269, 81.1834],
  'sitapur': [27.5684, 80.6798],
  'hardoi': [27.3944, 80.1294],
  'lakhimpur': [27.9482, 80.7788],
  'pilibhit': [28.6310, 79.8044],
  'shahjahanpur': [27.8804, 79.9149],
  'badaun': [28.0300, 79.1200],
  'bulandshahr': [28.4069, 77.8498],
  'baghpat': [28.9450, 77.2200],
  'shamli': [29.4497, 77.3100],
  'farrukhabad': [27.3820, 79.5840],
  'kannauj': [27.0540, 79.9170],
  'mainpuri': [27.2285, 79.0270],
  'banda': [25.4750, 80.3350],
  'orai': [25.9890, 79.4520],
  'jalaun': [25.9890, 79.4520],
  'hamirpur': [25.9520, 80.1510],
  'mahoba': [25.2920, 79.8730],
  'chitrakoot': [25.2040, 80.8520],
  'kaushambi': [25.5340, 81.4280],
  'chandauli': [25.2600, 83.2700],
  'sonbhadra': [24.6850, 83.0650],
  'bhadohi': [25.3900, 82.5700],
  'mau': [25.9420, 83.5600],
  'rampur': [28.8050, 79.0250],
  'bijnor': [29.3730, 78.1360],
  'amroha': [28.9040, 78.4680],

  // Maharashtra
  'nashik': [19.9975, 73.7898],
  'lasalgaon': [20.1478, 74.2253],
  'pune': [18.5204, 73.8567],
  'pune market yard': [18.4900, 73.8650],
  'mumbai': [19.0760, 72.8777],
  'vashi': [19.0771, 72.9986],
  'vashi apmc': [19.0771, 72.9986],
  'navi mumbai': [19.0330, 73.0297],
  'nagpur': [21.1458, 79.0882],
  'solapur': [17.6599, 75.9064],
  'kolhapur': [16.7050, 74.2433],
  'sangli': [16.8524, 74.5815],
  'satara': [17.6805, 74.0183],
  'ahmednagar': [19.0952, 74.7496],
  'jalgaon': [21.0077, 75.5626],
  'aurangabad': [19.8762, 75.3433],
  'sambhajinagar': [19.8762, 75.3433],

  // Karnataka & South
  'bengaluru': [12.9716, 77.5946],
  'bangalore': [12.9716, 77.5946],
  'binny mandi': [12.9663, 77.5684],
  'malur': [13.0044, 77.9405],
  'kolar': [13.1367, 78.1291],
  'mysuru': [12.2958, 76.6394],
  'mysore': [12.2958, 76.6394],
  'hubballi': [15.3647, 75.1240],
  'hubli': [15.3647, 75.1240],
  'belagavi': [15.8497, 74.4977],
  'belgaum': [15.8497, 74.4977],
  'davanagere': [14.4644, 75.9218],
  'shivamogga': [13.9299, 75.5681],
  'shimoga': [13.9299, 75.5681],
  'ballari': [15.1394, 76.9214],
  'bellary': [15.1394, 76.9214],
  'tumakuru': [13.3409, 77.1010],
  'tumkur': [13.3409, 77.1010],

  // Tamil Nadu, AP, Telangana
  'chennai': [13.0827, 80.2707],
  'koyambedu': [13.0694, 80.1948],
  'koyambedu apmc': [13.0694, 80.1948],
  'coimbatore': [11.0168, 76.9558],
  'madurai': [9.9252, 78.1198],
  'salem': [11.6643, 78.1460],
  'erode': [11.3410, 77.7172],
  'tiruchirappalli': [10.7905, 78.7047],
  'trichy': [10.7905, 78.7047],
  'hyderabad': [17.3850, 78.4867],
  'bowenpally': [17.4700, 78.4850],
  'bowenpally mandi': [17.4700, 78.4850],
  'secunderabad': [17.4399, 78.4983],
  'warangal': [17.9689, 79.5941],
  'guntur': [16.3067, 80.4365],
  'vijayawada': [16.5062, 80.6480],
  'visakhapatnam': [17.6868, 83.2185],
  'vizag': [17.6868, 83.2185],
  'anantapur': [14.6819, 77.6006],
  'kurnool': [15.8281, 78.0373],

  // Rajasthan & MP
  'jaipur': [26.9124, 75.7873],
  'jodhpur': [26.2389, 73.0243],
  'kota': [25.2138, 75.8648],
  'bikaner': [28.0229, 73.3119],
  'alwar': [27.5530, 76.6346],
  'sri ganganagar': [29.9094, 73.8799],
  'indore': [22.7196, 75.8577],
  'bhopal': [23.2599, 77.4126],
  'jabalpur': [23.1815, 79.9864],
  'gwalior': [26.2183, 78.1828],
  'ujjain': [23.1765, 75.7885],

  // Gujarat, Eastern & Northern
  'ahmedabad': [23.0225, 72.5714],
  'surat': [21.1702, 72.8311],
  'rajkot': [22.3039, 70.8022],
  'vadodara': [22.3072, 73.1812],
  'kolkata': [22.5726, 88.3639],
  'patna': [25.5941, 85.1376],
  'ranchi': [23.3441, 85.3096],
  'bhubaneswar': [20.2961, 85.8245],
  'guwahati': [26.1445, 91.7362],
  'shimla': [31.1048, 77.1734],
  'solan': [30.9084, 77.0999],
  'dehradun': [30.3165, 78.0322],
  'haridwar': [29.9457, 78.1642],
  'jammu': [32.7266, 74.8570],
  'srinagar': [34.0837, 74.7973],
  'kochi': [9.9312, 76.2673]
};

const GEOCODE_CACHE = new Map();

// Helper Levenshtein distance for typo-tolerant city matching
function levenshteinDistance(s1, s2) {
  if (s1 === s2) return 0;
  if (!s1.length) return s2.length;
  if (!s2.length) return s1.length;
  const d = [];
  for (let i = 0; i <= s1.length; i++) d[i] = [i];
  for (let j = 0; j <= s2.length; j++) d[0][j] = j;
  for (let i = 1; i <= s1.length; i++) {
    for (let j = 1; j <= s2.length; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
    }
  }
  return d[s1.length][s2.length];
}

// Phonetic / spelling cleaner for Indian city names
function normalizePhonetic(str) {
  return str
    .replace(/iy/g, 'i')
    .replace(/ee/g, 'i')
    .replace(/oo/g, 'u')
    .replace(/dh/g, 'd')
    .replace(/th/g, 't')
    .replace(/bh/g, 'b')
    .replace(/kh/g, 'k')
    .replace(/ph/g, 'f')
    .replace(/gh/g, 'g')
    .replace(/sh/g, 's')
    .replace(/nagar/g, ' nagar')
    .replace(/pur/g, ' pur');
}

// Synchronous smart resolver with phrase, word, phonetic, fuzzy, and state matching
function resolveLocationCoordinates(locationName, role = 'dest') {
  const defaultCoords = role === 'origin' ? [29.3909, 76.9635] : [28.7159, 77.1706];
  if (!locationName || typeof locationName !== 'string') {
    return defaultCoords;
  }

  const clean = locationName.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').trim();
  if (!clean) return defaultCoords;

  if (GEOCODE_CACHE.has(clean)) {
    return GEOCODE_CACHE.get(clean);
  }

  // 1. Direct multi-word key match (sorted by length descending for maximum specificity)
  const keys = Object.keys(KNOWN_COORDINATES).sort((a, b) => b.length - a.length);
  for (const key of keys) {
    if (clean.includes(key)) {
      return [...KNOWN_COORDINATES[key]];
    }
  }

  // 2. Word-by-word match
  const words = clean.split(/\s+/).filter(w => w.length > 2 && !['mandi', 'market', 'apmc', 'junction', 'road', 'city', 'district', 'village', 'near', 'from', 'to'].includes(w));
  for (const word of words) {
    if (KNOWN_COORDINATES[word]) {
      return [...KNOWN_COORDINATES[word]];
    }
    for (const key of keys) {
      if (key.includes(word) || word.includes(key)) {
        return [...KNOWN_COORDINATES[key]];
      }
    }
  }

  // 3. Phonetic normalization match (e.g. 'ludhiyana' -> 'ludiana' -> matches 'ludhiana')
  const normClean = normalizePhonetic(clean);
  for (const key of keys) {
    if (normClean.includes(normalizePhonetic(key))) {
      return [...KNOWN_COORDINATES[key]];
    }
  }

  // 4. Fuzzy Levenshtein match on words (handles typos like 'Ludhiyana', 'Faridkote')
  for (const word of words) {
    if (word.length >= 4) {
      for (const key of keys) {
        if (key.length >= 4 && Math.abs(key.length - word.length) <= 2) {
          if (levenshteinDistance(word, key) <= 2) {
            return [...KNOWN_COORDINATES[key]];
          }
        }
      }
    }
  }

  // 5. State-level regional fallback (places marker inside correct state instead of Delhi)
  for (const [stateKey, coords] of Object.entries(STATE_CENTROIDS)) {
    if (clean.includes(stateKey)) {
      return [...coords];
    }
  }

  return defaultCoords;
}

// Live multi-source geocoding with fast timeout and caching
async function fetchGeocodeCoordinates(locationName, role = 'dest') {
  if (!locationName || typeof locationName !== 'string') {
    return resolveLocationCoordinates(locationName, role);
  }

  const clean = locationName.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').trim();
  if (!clean) return resolveLocationCoordinates(locationName, role);

  if (GEOCODE_CACHE.has(clean)) {
    return GEOCODE_CACHE.get(clean);
  }

  const local = resolveLocationCoordinates(locationName, role);
  const isDefault = (role === 'origin' && local[0] === 29.3909 && local[1] === 76.9635) ||
    (role === 'dest' && local[0] === 28.7159 && local[1] === 77.1706);

  // If local resolution matched a specific location (or state fallback), cache and return
  if (!isDefault) {
    GEOCODE_CACHE.set(clean, local);
  }

  // Concurrently attempt live geocoding via Photon & Nominatim
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    // 1. Photon by Komoot (CORS-friendly, handles Indian addresses)
    const photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(clean + ' India')}&limit=1`;
    const res = await fetch(photonUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].geometry.coordinates;
        if (lat && lng) {
          const coords = [parseFloat(lat.toFixed(4)), parseFloat(lng.toFixed(4))];
          GEOCODE_CACHE.set(clean, coords);
          return coords;
        }
      }
    }
  } catch (e) {
    // If Photon fails/times out, try Nominatim
    try {
      const nomUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(clean + ', India')}&limit=1`;
      const res = await fetch(nomUrl);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0 && data[0].lat && data[0].lon) {
          const coords = [parseFloat(parseFloat(data[0].lat).toFixed(4)), parseFloat(parseFloat(data[0].lon).toFixed(4))];
          GEOCODE_CACHE.set(clean, coords);
          return coords;
        }
      }
    } catch (err) { }
  }

  return local;
}

function calculateDistanceKm(c1, c2) {
  const R = 6371;
  const dLat = ((c2[0] - c1[0]) * Math.PI) / 180;
  const dLon = ((c2[1] - c1[1]) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((c1[0] * Math.PI) / 180) *
    Math.cos((c2[0] * Math.PI) / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.max(12, Math.round(R * c));
}

function adjustCollocatedCoordinates(origin, dest) {
  const dist = calculateDistanceKm(origin, dest);
  if (dist >= 5) return { origin, dest };

  // If origin and destination are too close (< 5km), separate destination to represent intra-city mandi transfer
  const offsetDest = [dest[0] + 0.09, dest[1] - 0.12];
  return { origin, dest: offsetDest };
}

function generateCurvedRoutePoints(start, end, numPoints = 16) {
  const points = [];
  const midLat = (start[0] + end[0]) / 2 + 0.035;
  const midLon = (start[1] + end[1]) / 2 - 0.025;

  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    const lat = (1 - t) * (1 - t) * start[0] + 2 * (1 - t) * t * midLat + t * t * end[0];
    const lon = (1 - t) * (1 - t) * start[1] + 2 * (1 - t) * t * midLon + t * t * end[1];
    points.push([lat, lon]);
  }
  return points;
}

export default function MapLeaflet({
  shipmentId = 'SHP-001',
  pickupLocation = 'Panipat, Haryana',
  deliveryLocation = 'Azadpur Mandi, Delhi',
  crop = 'Produce',
  quantity = '500 kg',
  onDeviationDetected
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const farmMarkerRef = useRef(null);
  const centreMarkerRef = useRef(null);
  const buyerMarkerRef = useRef(null);
  const vehicleMarkerRef = useRef(null);
  const routePolylineRef = useRef(null);
  const recalculatedPolylineRef = useRef(null);
  const animFrameRef = useRef(null);

  const [routeStats, setRouteStats] = useState({ distance: '64 km', eta: '1h 45m', speed: '42 km/h' });
  const [isDeviated, setIsDeviated] = useState(false);
  const [status, setStatus] = useState('In transit (On route)');
  const [progressPct, setProgressPct] = useState(45);

  const createCustomIcon = (color, label) => {
    return L.divIcon({
      className: 'custom-leaflet-marker',
      html: `<div style="
background-color: ${color};
width: 32px;
height: 32px;
border-radius: 50%;
border: 2px solid white;
box-shadow: 0 3px 8px rgba(0,0,0,0.35);
display: flex;
align-items: center;
justify-content: center;
color: white;
font-weight: bold;
font-size: 14px;
">${label}</div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });
  };

  // 1. Initialize Map once
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const rawOrigin = resolveLocationCoordinates(pickupLocation, 'origin');
    const rawDest = resolveLocationCoordinates(deliveryLocation, 'dest');
    const { origin, dest } = adjustCollocatedCoordinates(rawOrigin, rawDest);
    const center = [(origin[0] + dest[0]) / 2, (origin[1] + dest[1]) / 2];

    const map = L.map(mapRef.current, {
      zoomControl: true,
      scrollWheelZoom: true
    }).setView(center, 8);

    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // Initial markers
    farmMarkerRef.current = L.marker(origin, { icon: createCustomIcon('#2e7d32', '🌾') })
      .addTo(map)
      .bindPopup(`<b>Origin (Farm)</b><br/>${pickupLocation}`);

    const mid = [(origin[0] + dest[0]) / 2 + 0.02, (origin[1] + dest[1]) / 2 - 0.01];
    centreMarkerRef.current = L.marker(mid, { icon: createCustomIcon('#d97706', '📦') })
      .addTo(map)
      .bindPopup('<b>AgriFlow Transit Hub</b><br/>Quality Checked &amp; Dispatched');

    buyerMarkerRef.current = L.marker(dest, { icon: createCustomIcon('#2563eb', '🏬') })
      .addTo(map)
      .bindPopup(`<b>Buyer Destination</b><br/>${deliveryLocation}`);

    const initialPoints = generateCurvedRoutePoints(origin, dest, 16);
    routePolylineRef.current = L.polyline(initialPoints, {
      color: '#16a34a',
      weight: 5,
      dashArray: '8, 10',
      opacity: 0.85
    }).addTo(map);

    // Vehicle marker
    const vehicleIcon = L.divIcon({
      className: 'vehicle-leaflet-marker',
      html: `<div style="
background-color: #15803d;
width: 38px;
height: 38px;
border-radius: 50%;
border: 3px solid white;
box-shadow: 0 4px 12px rgba(0,0,0,0.4);
display: flex;
align-items: center;
justify-content: center;
color: white;
font-size: 17px;
">🚚</div>`,
      iconSize: [38, 38],
      iconAnchor: [19, 19]
    });

    vehicleMarkerRef.current = L.marker(initialPoints[Math.floor(initialPoints.length * 0.45)], { icon: vehicleIcon })
      .addTo(map)
      .bindPopup(`<b>Active Vehicle</b><br/>Carrying: ${crop} (${quantity})<br/>Route: ${pickupLocation} → ${deliveryLocation}`);

    setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
        mapInstanceRef.current.fitBounds([origin, dest], { padding: [60, 60], maxZoom: 12 });
      }
    }, 200);

    return () => {
      if (animFrameRef.current) clearTimeout(animFrameRef.current);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Dynamically re-calculate route with live Nominatim geocoding & OSRM routing
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    let isMounted = true;

    const updateLocationsAndRoute = async () => {
      // Step 1: Live Geocode both locations concurrently
      const [resolvedOrigin, resolvedDest] = await Promise.all([
        fetchGeocodeCoordinates(pickupLocation, 'origin'),
        fetchGeocodeCoordinates(deliveryLocation, 'dest')
      ]);

      if (!isMounted || !mapInstanceRef.current) return;

      const { origin, dest } = adjustCollocatedCoordinates(resolvedOrigin, resolvedDest);

      const distKm = Math.max(12, calculateDistanceKm(origin, dest));
      const hours = Math.floor(distKm / 45);
      const mins = Math.round(((distKm % 45) / 45) * 60);
      const etaStr = hours > 0 ? `${hours}h ${mins}m` : `${mins || 30}m`;
      setRouteStats({
        distance: `${distKm} km`,
        eta: etaStr,
        speed: `${Math.floor(40 + (distKm % 15))} km/h`
      });

      const midLat = (origin[0] + dest[0]) / 2 + 0.02;
      const midLng = (origin[1] + dest[1]) / 2 - 0.01;
      const centre = [midLat, midLng];

      if (farmMarkerRef.current) {
        farmMarkerRef.current.setLatLng(origin);
        farmMarkerRef.current.setPopupContent(`<b>Origin (Farm)</b><br/>${pickupLocation}`);
      }
      if (centreMarkerRef.current) {
        centreMarkerRef.current.setLatLng(centre);
        centreMarkerRef.current.setPopupContent(`<b>AgriFlow Transit Hub</b><br/>Inspection &amp; Dispatch Hub`);
      }
      if (buyerMarkerRef.current) {
        buyerMarkerRef.current.setLatLng(dest);
        buyerMarkerRef.current.setPopupContent(`<b>Buyer Destination</b><br/>${deliveryLocation}`);
      }

      let activeWaypoints = generateCurvedRoutePoints(origin, dest, 20);

      if (routePolylineRef.current) {
        routePolylineRef.current.setLatLngs(activeWaypoints);
      }

      // Attempt OSRM real highway routing
      try {
        const coords = `${origin[1]},${origin[0]};${centre[1]},${centre[0]};${dest[1]},${dest[0]}`;
        const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`);
        if (res.ok && isMounted) {
          const data = await res.json();
          if (data.routes && data.routes[0] && data.routes[0].geometry?.coordinates?.length > 0) {
            const roadPoints = data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
            activeWaypoints = roadPoints;
            if (routePolylineRef.current) {
              routePolylineRef.current.setLatLngs(roadPoints);
            }
          }
        }
      } catch (err) {
        // Fallback already in place with activeWaypoints
      }

      // Adjust map view to fit new accurate bounds
      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
          mapInstanceRef.current.fitBounds([origin, dest], { padding: [60, 60], maxZoom: 12 });
        }
      }, 150);

      // Vehicle movement simulation
      let step = 0;
      const totalSteps = 400;
      const animateVehicle = () => {
        if (!isMounted || !mapInstanceRef.current || !vehicleMarkerRef.current) return;

        step = (step + 1) % totalSteps;
        const progress = step / totalSteps;
        const indexFloat = progress * (activeWaypoints.length - 1);
        const baseIndex = Math.floor(indexFloat);
        const nextIndex = Math.min(baseIndex + 1, activeWaypoints.length - 1);
        const subT = indexFloat - baseIndex;

        const p1 = activeWaypoints[baseIndex];
        const p2 = activeWaypoints[nextIndex];
        if (p1 && p2) {
          const currentPos = [
            p1[0] + (p2[0] - p1[0]) * subT,
            p1[1] + (p2[1] - p1[1]) * subT
          ];
          vehicleMarkerRef.current.setLatLng(currentPos);
          setProgressPct(Math.round(progress * 100));
        }

        animFrameRef.current = setTimeout(animateVehicle, 80);
      };

      if (animFrameRef.current) clearTimeout(animFrameRef.current);
      animFrameRef.current = setTimeout(animateVehicle, 200);
    };

    updateLocationsAndRoute();

    return () => {
      isMounted = false;
      if (animFrameRef.current) clearTimeout(animFrameRef.current);
    };
  }, [pickupLocation, deliveryLocation, shipmentId, crop, quantity]);

  // 3. Connect to backend API & Socket.IO if active
  useEffect(() => {
    logisticsService.getShipment(shipmentId).then((data) => {
      if (data) {
        if (data.status) setStatus(data.status);
      }
    });

    const unsubscribe = trackingService.subscribe(shipmentId, {
      onLocationUpdate: (loc) => {
        if (loc && loc.latitude && loc.longitude) {
          const newPos = [loc.latitude, loc.longitude];
          if (vehicleMarkerRef.current) {
            vehicleMarkerRef.current.setLatLng(newPos);
          }
        }
      },
      onRouteUpdate: (routeData) => {
        setIsDeviated(true);
        if (onDeviationDetected) onDeviationDetected(routeData);

        let points = null;
        if (Array.isArray(routeData.route)) {
          points = routeData.route;
        } else if (Array.isArray(routeData.waypoints)) {
          points = routeData.waypoints.map((w) => [w.latitude, w.longitude]);
        }

        if (points && mapInstanceRef.current) {
          if (recalculatedPolylineRef.current) {
            recalculatedPolylineRef.current.setLatLngs(points);
          } else {
            recalculatedPolylineRef.current = L.polyline(points, {
              color: '#d97706',
              weight: 5,
              opacity: 0.95
            }).addTo(mapInstanceRef.current);
          }
        }
      },
      onStatusUpdate: (st) => {
        setStatus(st);
      },
      onDeviation: (dev) => {
        setIsDeviated(dev.deviated);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [shipmentId, onDeviationDetected]);

  return (
    <div className="map-panel" style={{ overflow: 'hidden', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#fff' }}>
      <div className="map-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Radio style={{ width: '16px', color: '#16a34a' }} />
            <b style={{ fontSize: '14px', color: '#0f172a' }}>Shipment {shipmentId}</b>
          </div>
          <span className={`badge ${isDeviated ? 'badge-amber' : 'badge-blue'}`} style={{ fontWeight: 600 }}>
            {isDeviated ? 'Route Recalculated' : status}
          </span>
          <span style={{ fontSize: '13px', color: '#475569' }}>
            <b>{crop}</b> ({quantity}) · <b>{pickupLocation}</b> → <b>{deliveryLocation}</b>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>
            Est. Distance: <b>{routeStats.distance}</b> · ETA: <b>{routeStats.eta}</b>
          </span>
          <button
            className="map-control"
            onClick={() => {
              if (mapInstanceRef.current && vehicleMarkerRef.current) {
                mapInstanceRef.current.setView(vehicleMarkerRef.current.getLatLng(), 11);
              }
            }}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', padding: '6px 12px', borderRadius: '6px', background: '#fff', border: '1px solid #cbd5e1', fontSize: '12px', fontWeight: 600, color: '#334155' }}
          >
            <MapPin style={{ width: '14px' }} /> Center Vehicle
          </button>
        </div>
      </div>

      <div
        ref={mapRef}
        style={{
          height: '420px',
          width: '100%',
          zIndex: 1
        }}
      />

      <div style={{ padding: '10px 20px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', color: '#64748b', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <span>🌾 <b>Origin:</b> {pickupLocation}</span>
          <span>📦 <b>Hub:</b> Transit Hub</span>
          <span>🏬 <b>Destination:</b> {deliveryLocation}</span>
        </div>
        <div>
          <span>Live Transit Progress: <b>{progressPct}%</b></span>
        </div>
      </div>
    </div>
  );
}

