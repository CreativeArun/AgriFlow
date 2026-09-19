import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { logisticsService, trackingService } from '../lib/api/services.js';
import {
  MapPin, Radio, Layers, Maximize2, Minimize2, Compass,
  Thermometer, Droplets, Gauge, Fuel, ShieldCheck, Eye,
  Truck, Warehouse, Building2, Navigation, AlertTriangle,
  CheckCircle2, PhoneCall
} from 'lucide-react';

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

function calculateBearing(p1, p2) {
  if (!p1 || !p2) return 0;
  const lat1 = (p1[0] * Math.PI) / 180;
  const lat2 = (p2[0] * Math.PI) / 180;
  const dLon = ((p2[1] - p1[1]) * Math.PI) / 180;
  const y = Math.sin(dLon) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  const brng = (Math.atan2(y, x) * 180) / Math.PI;
  return Math.round((brng + 360) % 360);
}

const REGIONAL_MANDIS = [
  { name: 'Azadpur APMC Mandi', coords: [28.7159, 77.1706], type: 'National Terminal', volume: '14,200 MT/day', rate: '₹2,650/qtl', state: 'Delhi' },
  { name: 'Ghazipur APMC Terminal', coords: [28.6256, 77.3292], type: 'Fruit & Veg Terminal', volume: '8,400 MT/day', rate: '₹2,580/qtl', state: 'Delhi/UP' },
  { name: 'Okhla Mandi', coords: [28.5434, 77.2848], type: 'South NCR APMC', volume: '5,100 MT/day', rate: '₹2,620/qtl', state: 'Delhi' },
  { name: 'Panipat APMC Mandi', coords: [29.3909, 76.9635], type: 'Haryana State APMC', volume: '3,800 MT/day', rate: '₹2,490/qtl', state: 'Haryana' },
  { name: 'Karnal Grain Mandi', coords: [29.6857, 76.9905], type: 'Basmati & Grain Hub', volume: '6,200 MT/day', rate: '₹3,450/qtl', state: 'Haryana' },
  { name: 'Ludhiana Apex Mandi', coords: [30.9010, 75.8573], type: 'Punjab Apex Mandi', volume: '9,500 MT/day', rate: '₹2,380/qtl', state: 'Punjab' },
  { name: 'Agra Mandi Hub', coords: [27.1767, 78.0081], type: 'Potato & Veg Hub', volume: '7,100 MT/day', rate: '₹1,850/qtl', state: 'Uttar Pradesh' },
  { name: 'Muhana Mandi Jaipur', coords: [26.8200, 75.7600], type: 'Rajasthan APMC Terminal', volume: '8,000 MT/day', rate: '₹2,550/qtl', state: 'Rajasthan' }
];

const COLD_STORAGE_HUBS = [
  { name: 'AgriFlow Multi-Commodity Vault', coords: [29.1500, 77.0500], capacity: '4,500 MT (74% full)', temp: '3.2°C', status: 'Certified APMC' },
  { name: 'Kisan Fresh Cold Logistics', coords: [28.8500, 77.1200], capacity: '3,200 MT (62% full)', temp: '4.0°C', status: 'Reefer Compatible' },
  { name: 'Sonipat Agri Cold Chain Node', coords: [28.9800, 77.0300], capacity: '6,000 MT (85% full)', temp: '2.8°C', status: 'Fastag Enabled' },
  { name: 'NCR Perishable Transit Vault', coords: [28.6500, 77.2200], capacity: '8,000 MT (90% full)', temp: '3.5°C', status: '24/7 Gate In' }
];

const TILE_CONFIG = {
  streets: {
    name: 'Street',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    subdomains: 'abcd',
    attribution: '&copy; CartoDB &copy; OpenStreetMap'
  },
  satellite: {
    name: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    subdomains: 'abcd',
    labelsUrl: 'https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png',
    attribution: '&copy; ESRI World Imagery &copy; OpenStreetMap'
  },
  terrain: {
    name: 'Terrain',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    subdomains: 'abc',
    attribution: '&copy; OpenTopoMap &copy; OpenStreetMap'
  },
  dark: {
    name: 'Night',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    subdomains: 'abcd',
    attribution: '&copy; CartoDB Dark Matter'
  }
};

export default function MapLeaflet({
  shipmentId = 'SHP-001',
  pickupLocation = 'Panipat, Haryana',
  deliveryLocation = 'Azadpur Mandi, Delhi',
  crop = 'Produce',
  quantity = '500 kg',
  onDeviationDetected
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const labelLayerRef = useRef(null);

  const farmMarkerRef = useRef(null);
  const centreMarkerRef = useRef(null);
  const weighbridgeMarkerRef = useRef(null);
  const buyerMarkerRef = useRef(null);
  const vehicleMarkerRef = useRef(null);
  const geofenceCircleRef = useRef(null);
  const routePolylineRef = useRef(null);
  const recalculatedPolylineRef = useRef(null);
  const mandiLayerGroupRef = useRef(null);
  const coldLayerGroupRef = useRef(null);
  const animFrameRef = useRef(null);

  const [activeBaseLayer, setActiveBaseLayer] = useState('satellite'); // 'streets' | 'satellite' | 'terrain' | 'dark'
  const [showMandis, setShowMandis] = useState(true);
  const [showColdStorage, setShowColdStorage] = useState(true);
  const [showGeofence, setShowGeofence] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [routeStats, setRouteStats] = useState({ distance: '64 km', eta: '1h 45m', speed: '46 km/h' });
  const [isDeviated, setIsDeviated] = useState(false);
  const [status, setStatus] = useState('In transit (On route)');
  const [progressPct, setProgressPct] = useState(45);
  const [telematics, setTelematics] = useState({
    temp: 3.8,
    humidity: 86,
    speed: 46,
    fuel: 78,
    bearing: 165,
    battery: 98,
    geofenceStatus: 'Approaching 12km Zone'
  });

  const createCustomIcon = (color, label, subtext = '') => {
    return L.divIcon({
      className: 'custom-leaflet-marker',
      html: `
        <div style="display: flex; flex-direction: column; align-items: center;">
          <div style="
            background: ${color};
            width: 36px;
            height: 36px;
            border-radius: 50%;
            border: 2.5px solid white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 16px;
          ">${label}</div>
          ${subtext ? `<span style="
            background: rgba(15, 23, 42, 0.85);
            backdrop-filter: blur(4px);
            color: #ffffff;
            font-size: 10px;
            font-weight: 700;
            padding: 1px 6px;
            border-radius: 4px;
            margin-top: 2px;
            white-space: nowrap;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          ">${subtext}</span>` : ''}
        </div>
      `,
      iconSize: [36, subtext ? 52 : 36],
      iconAnchor: [18, 18]
    });
  };

  const createVehicleIcon = (bearing = 0) => {
    return L.divIcon({
      className: 'vehicle-leaflet-marker',
      html: `
        <div class="vehicle-marker-inner" style="transform: rotate(${bearing}deg); width: 44px; height: 44px;">
          <div style="
            background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
            width: 44px;
            height: 44px;
            border-radius: 50%;
            border: 3px solid #ffffff;
            box-shadow: 0 4px 14px rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 22px;
            position: relative;
          ">
            🚚
            <div style="
              position: absolute;
              top: -3px;
              width: 9px;
              height: 9px;
              background: #4ade80;
              border-radius: 50%;
              box-shadow: 0 0 10px #4ade80;
            "></div>
          </div>
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 22]
    });
  };

  // Helper to switch base tile layers
  const setBaseTileLayer = (layerKey) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
      tileLayerRef.current = null;
    }
    if (labelLayerRef.current) {
      map.removeLayer(labelLayerRef.current);
      labelLayerRef.current = null;
    }

    const cfg = TILE_CONFIG[layerKey] || TILE_CONFIG.streets;
    tileLayerRef.current = L.tileLayer(cfg.url, {
      subdomains: cfg.subdomains || 'abc',
      attribution: cfg.attribution,
      maxZoom: 19
    }).addTo(map);

    if (cfg.labelsUrl) {
      labelLayerRef.current = L.tileLayer(cfg.labelsUrl, {
        subdomains: cfg.subdomains || 'abc',
        maxZoom: 19
      }).addTo(map);
    }

    setActiveBaseLayer(layerKey);
  };

  // 1. Initialize Map once
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const rawOrigin = resolveLocationCoordinates(pickupLocation, 'origin');
    const rawDest = resolveLocationCoordinates(deliveryLocation, 'dest');
    const { origin, dest } = adjustCollocatedCoordinates(rawOrigin, rawDest);
    const center = [(origin[0] + dest[0]) / 2, (origin[1] + dest[1]) / 2];

    const map = L.map(mapRef.current, {
      zoomControl: false,
      scrollWheelZoom: true
    }).setView(center, 9);

    mapInstanceRef.current = map;

    // Zoom control at bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Initial base layer (Satellite default)
    setBaseTileLayer('satellite');

    // Layer groups for toggleable overlays
    mandiLayerGroupRef.current = L.layerGroup().addTo(map);
    coldLayerGroupRef.current = L.layerGroup().addTo(map);

    // Origin Farm Marker
    farmMarkerRef.current = L.marker(origin, { icon: createCustomIcon('#16a34a', '🌾', 'Origin Farm') })
      .addTo(map)
      .bindPopup(`
        <div style="padding: 14px; font-family: sans-serif; min-width: 220px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <span style="background: #dcfce7; padding: 3px 8px; border-radius: 6px; font-weight: 700; color: #166534; font-size: 11px;">ORIGIN FARM</span>
            <span style="font-size: 11px; color: #16a34a; font-weight: 600;">✓ Verified Lot</span>
          </div>
          <b style="font-size: 14px; color: #0f172a; display: block; margin-bottom: 4px;">${pickupLocation}</b>
          <p style="margin: 0 0 8px; font-size: 12px; color: #475569;">Carrying: <b>${crop}</b> (${quantity})</p>
          <div style="background: #f8fafc; padding: 6px 10px; border-radius: 6px; font-size: 11px; color: #334155; border: 1px solid #e2e8f0;">
            📦 Inspected &amp; Dispatched via Reefer Truck
          </div>
        </div>
      `);

    // AGMARK Inspection Hub Marker
    const mid = [(origin[0] + dest[0]) / 2 + 0.02, (origin[1] + dest[1]) / 2 - 0.01];
    centreMarkerRef.current = L.marker(mid, { icon: createCustomIcon('#0284c7', '🛡️', 'AGMARK Hub') })
      .addTo(map)
      .bindPopup(`
        <div style="padding: 14px; font-family: sans-serif; min-width: 220px;">
          <span style="background: #e0f2fe; padding: 3px 8px; border-radius: 6px; font-weight: 700; color: #0369a1; font-size: 11px;">AGMARK INSPECTION HUB</span>
          <b style="font-size: 13px; color: #0f172a; display: block; margin: 6px 0 4px;">AgriFlow Regional Transit Node</b>
          <p style="margin: 0 0 6px; font-size: 12px; color: #475569;">Grade A Certified · Moisture 11.4%</p>
          <div style="color: #0284c7; font-size: 11px; font-weight: 600;">✓ Cold-Chain Reefer Seal Intact</div>
        </div>
      `);

    // Highway Weighbridge Checkpoint
    const weighPos = [origin[0] * 0.75 + dest[0] * 0.25, origin[1] * 0.75 + dest[1] * 0.25];
    weighbridgeMarkerRef.current = L.marker(weighPos, { icon: createCustomIcon('#d97706', '⚖️', 'Weighbridge') })
      .addTo(map)
      .bindPopup(`
        <div style="padding: 14px; font-family: sans-serif; min-width: 220px;">
          <span style="background: #fef3c7; padding: 3px 8px; border-radius: 6px; font-weight: 700; color: #92400e; font-size: 11px;">HIGHWAY WEIGHBRIDGE</span>
          <b style="font-size: 13px; color: #0f172a; display: block; margin: 6px 0 4px;">NH-44 Automated Weigh Station</b>
          <p style="margin: 0 0 4px; font-size: 12px; color: #475569;">Gross: 3,450 kg · Tare: 2,950 kg</p>
          <div style="color: #16a34a; font-size: 11px; font-weight: 600;">✓ Electronic E-Way Bill Cleared</div>
        </div>
      `);

    // Buyer Mandi Destination Marker
    buyerMarkerRef.current = L.marker(dest, { icon: createCustomIcon('#2563eb', '🏬', 'Destination Mandi') })
      .addTo(map)
      .bindPopup(`
        <div style="padding: 14px; font-family: sans-serif; min-width: 220px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <span style="background: #dbeafe; padding: 3px 8px; border-radius: 6px; font-weight: 700; color: #1e40af; font-size: 11px;">BUYER MANDI TERMINAL</span>
            <span style="font-size: 11px; color: #2563eb; font-weight: 600;">Gate-In Platform</span>
          </div>
          <b style="font-size: 14px; color: #0f172a; display: block; margin-bottom: 4px;">${deliveryLocation}</b>
          <p style="margin: 0 0 6px; font-size: 12px; color: #475569;">Receiving Lot: <b>${crop}</b> (${quantity})</p>
          <div style="background: #eff6ff; padding: 6px 10px; border-radius: 6px; font-size: 11px; color: #1d4ed8; font-weight: 600;">
            📍 Unloading Dock #3 Assigned
          </div>
        </div>
      `);

    // Geofence Delivery Ring (12km radius around destination)
    geofenceCircleRef.current = L.circle(dest, {
      radius: 12000,
      color: '#3b82f6',
      weight: 2,
      fillColor: '#60a5fa',
      fillOpacity: 0.12,
      dashArray: '6, 8'
    }).addTo(map);

    const initialPoints = generateCurvedRoutePoints(origin, dest, 24);
    routePolylineRef.current = L.polyline(initialPoints, {
      color: '#22c55e',
      weight: 6,
      opacity: 0.9,
      className: 'leaflet-route-flow',
      dashArray: '10, 14'
    }).addTo(map);

    // Initial vehicle marker
    const startPos = initialPoints[Math.floor(initialPoints.length * 0.45)];
    vehicleMarkerRef.current = L.marker(startPos, { icon: createVehicleIcon(165) })
      .addTo(map)
      .bindPopup(`
        <div style="padding: 14px; font-family: sans-serif; min-width: 230px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <span style="background: #16a34a; color: white; padding: 3px 8px; border-radius: 6px; font-weight: 700; font-size: 11px;">COLD-CHAIN REEFER</span>
            <span style="font-size: 11px; color: #16a34a; font-weight: 700;">● Live GPS</span>
          </div>
          <b style="font-size: 14px; color: #0f172a; display: block; margin-bottom: 2px;">Tata 407 (HR 38 AB 2041)</b>
          <p style="margin: 0 0 6px; font-size: 12px; color: #475569;">Consignment: <b>${crop}</b> (${quantity})</p>
          <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e2e8f0; display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 11px;">
            <span>Reefer: <b style="color: #0284c7;">3.8°C</b></span>
            <span>Speed: <b style="color: #16a34a;">46 km/h</b></span>
            <span>Humidity: <b style="color: #0f172a;">86%</b></span>
            <span>Fuel: <b style="color: #d97706;">78%</b></span>
          </div>
        </div>
      `);

    // Populate Regional Mandis Overlay
    REGIONAL_MANDIS.forEach(m => {
      const mandiMarker = L.marker(m.coords, {
        icon: L.divIcon({
          className: 'mandi-pin',
          html: `<div style="
            background: #ffffff;
            border: 2px solid #2563eb;
            color: #1e40af;
            padding: 3px 8px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 700;
            white-space: nowrap;
            box-shadow: 0 3px 8px rgba(0,0,0,0.25);
            display: flex;
            align-items: center;
            gap: 4px;
          ">🏬 ${m.name.split(' ')[0]}</div>`,
          iconAnchor: [30, 15]
        })
      }).bindPopup(`
        <div style="padding: 12px; font-family: sans-serif; min-width: 200px;">
          <span style="background: #dbeafe; color: #1e40af; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 700;">APMC MANDI</span>
          <b style="display: block; font-size: 13px; margin: 4px 0 2px;">${m.name}</b>
          <div style="font-size: 11px; color: #64748b;">Daily Volume: <b>${m.volume}</b></div>
          <div style="font-size: 11px; color: #16a34a; font-weight: 600; margin-top: 4px;">Benchmark: ${m.rate}</div>
        </div>
      `);
      mandiLayerGroupRef.current.addLayer(mandiMarker);
    });

    // Populate Cold Storage Hubs Overlay
    COLD_STORAGE_HUBS.forEach(c => {
      const coldMarker = L.marker(c.coords, {
        icon: L.divIcon({
          className: 'cold-storage-pin',
          html: `<div style="
            background: #0284c7;
            border: 2px solid #ffffff;
            color: #ffffff;
            padding: 3px 8px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 700;
            white-space: nowrap;
            box-shadow: 0 3px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            gap: 4px;
          ">❄️ ${c.name.split(' ')[0]} (${c.temp})</div>`,
          iconAnchor: [35, 15]
        })
      }).bindPopup(`
        <div style="padding: 12px; font-family: sans-serif; min-width: 200px;">
          <span style="background: #e0f2fe; color: #0369a1; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 700;">COLD STORAGE VAULT</span>
          <b style="display: block; font-size: 13px; margin: 4px 0 2px;">${c.name}</b>
          <div style="font-size: 11px; color: #64748b;">Capacity: <b>${c.capacity}</b></div>
          <div style="font-size: 11px; color: #0284c7; font-weight: 600; margin-top: 4px;">Temperature: ${c.temp} · ${c.status}</div>
        </div>
      `);
      coldLayerGroupRef.current.addLayer(coldMarker);
    });

    setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
        mapInstanceRef.current.fitBounds([origin, dest], { padding: [70, 70], maxZoom: 12 });
      }
    }, 250);

    // Listen for fullscreen change
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
      setTimeout(() => {
        if (mapInstanceRef.current) mapInstanceRef.current.invalidateSize();
      }, 100);
    };
    document.addEventListener('fullscreenchange', onFsChange);

    return () => {
      document.removeEventListener('fullscreenchange', onFsChange);
      if (animFrameRef.current) clearTimeout(animFrameRef.current);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Toggle Overlays dynamically
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (mandiLayerGroupRef.current) {
      if (showMandis) map.addLayer(mandiLayerGroupRef.current);
      else map.removeLayer(mandiLayerGroupRef.current);
    }

    if (coldLayerGroupRef.current) {
      if (showColdStorage) map.addLayer(coldLayerGroupRef.current);
      else map.removeLayer(coldLayerGroupRef.current);
    }

    if (geofenceCircleRef.current) {
      if (showGeofence) map.addLayer(geofenceCircleRef.current);
      else map.removeLayer(geofenceCircleRef.current);
    }
  }, [showMandis, showColdStorage, showGeofence]);

  // 3. Dynamically re-calculate route with live Nominatim geocoding & OSRM routing
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    let isMounted = true;

    const updateLocationsAndRoute = async () => {
      try {
        // Step 1: Live Geocode both locations concurrently
        const [resolvedOrigin, resolvedDest] = await Promise.all([
          fetchGeocodeCoordinates(pickupLocation, 'origin'),
          fetchGeocodeCoordinates(deliveryLocation, 'dest')
        ]);

        if (!isMounted || !mapInstanceRef.current) return;

        const { origin, dest } = adjustCollocatedCoordinates(resolvedOrigin, resolvedDest);

        const distKm = Math.max(12, calculateDistanceKm(origin, dest));
        const hours = Math.floor(distKm / 46);
        const mins = Math.round(((distKm % 46) / 46) * 60);
        const etaStr = hours > 0 ? `${hours}h ${mins}m` : `${mins || 28}m`;
        setRouteStats({
          distance: `${distKm} km`,
          eta: etaStr,
          speed: '46 km/h'
        });

        const midLat = (origin[0] + dest[0]) / 2 + 0.02;
        const midLng = (origin[1] + dest[1]) / 2 - 0.01;
        const centre = [midLat, midLng];
        const weighPos = [origin[0] * 0.75 + dest[0] * 0.25, origin[1] * 0.75 + dest[1] * 0.25];

        if (farmMarkerRef.current) farmMarkerRef.current.setLatLng(origin);
        if (centreMarkerRef.current) centreMarkerRef.current.setLatLng(centre);
        if (weighbridgeMarkerRef.current) weighbridgeMarkerRef.current.setLatLng(weighPos);
        if (buyerMarkerRef.current) buyerMarkerRef.current.setLatLng(dest);
        if (geofenceCircleRef.current) geofenceCircleRef.current.setLatLng(dest);

        let activeWaypoints = generateCurvedRoutePoints(origin, dest, 24);

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

        // Adjust map view to fit route bounds
        setTimeout(() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize();
            mapInstanceRef.current.fitBounds([origin, dest], { padding: [70, 70], maxZoom: 12 });
          }
        }, 200);

        // Vehicle movement & rotation simulation
        let step = 0;
        const totalSteps = 450;
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

            const bearing = calculateBearing(p1, p2);
            vehicleMarkerRef.current.setLatLng(currentPos);
            vehicleMarkerRef.current.setIcon(createVehicleIcon(bearing));

            const currentDistRemaining = Math.max(2, Math.round(distKm * (1 - progress)));
            const inGeofence = currentDistRemaining <= 12;

            setProgressPct(Math.round(progress * 100));
            setTelematics(prev => ({
              ...prev,
              bearing,
              temp: parseFloat((3.8 + Math.sin(step * 0.1) * 0.3).toFixed(1)),
              speed: Math.round(44 + Math.sin(step * 0.05) * 5),
              geofenceStatus: inGeofence ? 'Inside 12km Mandi Geofence Zone' : `Approaching Zone (${currentDistRemaining} km away)`
            }));
          }

          animFrameRef.current = setTimeout(animateVehicle, 85);
        };

        if (animFrameRef.current) clearTimeout(animFrameRef.current);
        animFrameRef.current = setTimeout(animateVehicle, 250);
      } catch (err) {
        console.warn('Route update error:', err);
      }
    };

    updateLocationsAndRoute();

    return () => {
      isMounted = false;
      if (animFrameRef.current) clearTimeout(animFrameRef.current);
    };
  }, [pickupLocation, deliveryLocation, shipmentId, crop, quantity]);

  // 4. Connect to backend API & Socket.IO
  useEffect(() => {
    logisticsService.getShipment(shipmentId).then((data) => {
      if (data && data.status) setStatus(data.status);
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
              color: '#f59e0b',
              weight: 6,
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

  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => console.warn(err));
    } else {
      document.exitFullscreen().catch(err => console.warn(err));
    }
  };

  const handleCenterVehicle = () => {
    if (mapInstanceRef.current && vehicleMarkerRef.current) {
      mapInstanceRef.current.setView(vehicleMarkerRef.current.getLatLng(), 13, { animate: true });
    }
  };

  const handleFitRouteOverview = () => {
    if (mapInstanceRef.current && farmMarkerRef.current && buyerMarkerRef.current) {
      mapInstanceRef.current.fitBounds(
        [farmMarkerRef.current.getLatLng(), buyerMarkerRef.current.getLatLng()],
        { padding: [80, 80], maxZoom: 12, animate: true }
      );
    }
  };

  return (
    <div
      ref={containerRef}
      className="map-panel"
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        borderRadius: isFullscreen ? '0' : '14px',
        border: isFullscreen ? 'none' : '1px solid #cbd5e1',
        background: '#0f172a',
        position: 'relative',
        boxShadow: isFullscreen ? 'none' : '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
        height: isFullscreen ? '100vh' : 'auto'
      }}
    >
      {/* Top Command Toolbar */}
      <div
        className="map-toolbar"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 18px',
          background: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          flexWrap: 'wrap',
          gap: '10px',
          minHeight: '52px',
          height: 'auto',
          flexShrink: 0,
          position: 'relative',
          zIndex: 20
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Radio style={{ width: '16px', color: '#16a34a' }} className="animate-pulse" />
            <b style={{ fontSize: '14px', color: '#0f172a' }}>Shipment {shipmentId}</b>
          </div>
          <span
            style={{
              fontSize: '12px',
              fontWeight: 700,
              padding: '3px 10px',
              borderRadius: '12px',
              background: isDeviated ? '#fef3c7' : '#dcfce7',
              color: isDeviated ? '#92400e' : '#166534',
              border: isDeviated ? '1px solid #fcd34d' : '1px solid #86efac'
            }}
          >
            {isDeviated ? 'Route Recalculated' : status}
          </span>
          <span style={{ fontSize: '13px', color: '#475569' }}>
            <b>{crop}</b> ({quantity}) · <b>{pickupLocation}</b> → <b>{deliveryLocation}</b>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>
            Est. Distance: <b>{routeStats.distance}</b> · ETA: <b>{routeStats.eta}</b>
          </span>

          {/* Right Tools: Layers, Center, Fullscreen */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {/* Base Layer Switcher */}
            <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '8px', padding: '2px', border: '1px solid #e2e8f0' }}>
              {Object.entries(TILE_CONFIG).map(([key, cfg]) => (
                <button
                  key={key}
                  onClick={() => setBaseTileLayer(key)}
                  style={{
                    padding: '4px 10px',
                    fontSize: '11px',
                    fontWeight: 600,
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    background: activeBaseLayer === key ? '#166534' : 'transparent',
                    color: activeBaseLayer === key ? '#ffffff' : '#475569',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {cfg.name}
                </button>
              ))}
            </div>

            {/* Overlay Toggles */}
            <button
              onClick={() => setShowMandis(prev => !prev)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
                padding: '5px 10px',
                borderRadius: '7px',
                background: showMandis ? '#e0f2fe' : '#ffffff',
                border: showMandis ? '1px solid #38bdf8' : '1px solid #cbd5e1',
                color: showMandis ? '#0369a1' : '#64748b',
                fontSize: '11px',
                fontWeight: 600
              }}
              title="Toggle APMC Mandis"
            >
              <Building2 style={{ width: '13px' }} /> Mandis
            </button>

            <button
              onClick={() => setShowColdStorage(prev => !prev)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
                padding: '5px 10px',
                borderRadius: '7px',
                background: showColdStorage ? '#f0fdf4' : '#ffffff',
                border: showColdStorage ? '1px solid #86efac' : '1px solid #cbd5e1',
                color: showColdStorage ? '#166534' : '#64748b',
                fontSize: '11px',
                fontWeight: 600
              }}
              title="Toggle Cold Storage Hubs"
            >
              <Warehouse style={{ width: '13px' }} /> Cold Hubs
            </button>

            {/* Quick Navigation Buttons */}
            <button
              onClick={handleCenterVehicle}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                cursor: 'pointer',
                padding: '5px 10px',
                borderRadius: '7px',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                fontSize: '11px',
                fontWeight: 600,
                color: '#334155'
              }}
              title="Follow Active Truck"
            >
              <Truck style={{ width: '13px', color: '#16a34a' }} /> Track Truck
            </button>

            <button
              onClick={handleFitRouteOverview}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                cursor: 'pointer',
                padding: '5px 10px',
                borderRadius: '7px',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                fontSize: '11px',
                fontWeight: 600,
                color: '#334155'
              }}
              title="Overview of Complete Route"
            >
              <Navigation style={{ width: '13px' }} /> Fit Route
            </button>

            <button
              onClick={handleToggleFullscreen}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
                padding: '5px 8px',
                borderRadius: '7px',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                fontSize: '11px',
                fontWeight: 600,
                color: '#334155'
              }}
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Command View'}
            >
              {isFullscreen ? <Minimize2 style={{ width: '14px' }} /> : <Maximize2 style={{ width: '14px' }} />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Leaflet Map Container */}
      <div
        ref={mapRef}
        style={{
          height: isFullscreen ? 'auto' : '500px',
          flex: isFullscreen ? '1 1 auto' : 'none',
          minHeight: isFullscreen ? '0' : '500px',
          width: '100%',
          zIndex: 1,
          background: '#0f172a',
          position: 'relative'
        }}
      />

      {/* Floating Cold-Chain Telematics HUD Bar */}
      <div
        className="map-telematics-hud"
        style={{
          position: 'absolute',
          bottom: '50px',
          left: '20px',
          right: '20px',
          zIndex: 10,
          padding: '8px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="map-hud-stat">
            <span style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Reefer Temp</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Thermometer style={{ width: '14px', color: '#38bdf8' }} />
              <b style={{ fontSize: '13px', color: '#38bdf8' }}>{telematics.temp}°C</b>
              <span style={{ fontSize: '10px', color: '#4ade80', marginLeft: '2px' }}>● Safe</span>
            </div>
          </div>

          <div className="map-hud-stat">
            <span style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Humidity</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Droplets style={{ width: '14px', color: '#60a5fa' }} />
              <b style={{ fontSize: '13px', color: '#f8fafc' }}>{telematics.humidity}% RH</b>
            </div>
          </div>

          <div className="map-hud-stat">
            <span style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>GPS Speed</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Gauge style={{ width: '14px', color: '#4ade80' }} />
              <b style={{ fontSize: '13px', color: '#f8fafc' }}>{telematics.speed} km/h</b>
            </div>
          </div>

          <div className="map-hud-stat">
            <span style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Bearing</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Compass style={{ width: '14px', color: '#fbbf24' }} />
              <b style={{ fontSize: '13px', color: '#f8fafc' }}>{telematics.bearing}° SSE</b>
            </div>
          </div>

          <div className="map-hud-stat">
            <span style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Fuel Tank</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Fuel style={{ width: '14px', color: '#f97316' }} />
              <b style={{ fontSize: '13px', color: '#f8fafc' }}>{telematics.fuel}%</b>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <div style={{ fontSize: '11px', color: '#cbd5e1' }}>
            Distance: <b style={{ color: '#ffffff' }}>{routeStats.distance}</b> · ETA: <b style={{ color: '#4ade80' }}>{routeStats.eta}</b>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>Geofence:</span>
            <span style={{
              background: 'rgba(59, 130, 246, 0.25)',
              border: '1px solid #3b82f6',
              color: '#93c5fd',
              padding: '2px 8px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 600
            }}>
              {telematics.geofenceStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Route Progression Bar */}
      <div
        style={{
          padding: '10px 18px',
          background: '#ffffff',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '12px',
          color: '#64748b',
          flexWrap: 'wrap',
          gap: '8px',
          flexShrink: 0,
          position: 'relative',
          zIndex: 20
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <span>🌾 <b>Origin:</b> {pickupLocation}</span>
          <span>📦 <b>Hub:</b> Transit Hub</span>
          <span>⚖️ <b>NH-44 Toll Weighbridge</b></span>
          <span>🛡️ <b>AGMARK Checkpoint</b></span>
          <span>🏬 <b>Destination:</b> {deliveryLocation}</span>
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>Transit Progress:</span>
            <div style={{ width: '120px', height: '7px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${progressPct}%`, height: '100%', background: 'linear-gradient(90deg, #16a34a, #22c55e)', borderRadius: '4px', transition: 'width 0.3s ease' }} />
            </div>
            <b style={{ color: '#166534', minWidth: '32px' }}>{progressPct}%</b>
          </div>
        </div>
      </div>
    </div>
  );
}

