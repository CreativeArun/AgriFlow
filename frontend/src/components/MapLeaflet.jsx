import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { logisticsService, trackingService } from '../lib/api/services.js';
import { MapPin } from 'lucide-react';

const KNOWN_COORDINATES = {
  'ghazipur': [28.6256, 77.3292],
  'ghaziabad': [28.6692, 77.4538],
  'azadpur': [28.7159, 77.1706],
  'panipat': [29.3909, 76.9635],
  'sonipat': [28.9931, 77.0151],
  'noida': [28.5355, 77.3910],
  'okhla': [28.5434, 77.2848],
  'delhi': [28.6139, 77.2090],
  'gurugram': [28.4595, 77.0266],
  'gurgaon': [28.4595, 77.0266],
  'karnal': [29.6857, 76.9905],
  'haryana': [29.1492, 76.8500],
  'meerut': [28.9845, 77.7064]
};

async function resolveLocation(locationName, fallbackCoords) {
  if (!locationName) return fallbackCoords;
  const lower = locationName.toLowerCase();
  for (const [key, coords] of Object.entries(KNOWN_COORDINATES)) {
    if (lower.includes(key)) {
      return coords;
    }
  }

  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName + ', India')}&limit=1`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.length > 0) {
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      }
    }
  } catch (e) {
    console.warn('Geocoding fallback failed, using default coords:', e);
  }
  return fallbackCoords;
}

export default function MapLeaflet({
  shipmentId = 'SHP-001',
  pickupLocation = 'Panipat, Haryana',
  deliveryLocation = 'Azadpur Mandi, Delhi',
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

  const [shipmentData, setShipmentData] = useState(null);
  const [isDeviated, setIsDeviated] = useState(false);
  const [status, setStatus] = useState('On route');

  const createCustomIcon = (color, label) => {
    return L.divIcon({
      className: 'custom-leaflet-marker',
      html: `<div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 13px;
      ">${label}</div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });
  };

  // 1. Initialize Map once
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      zoomControl: true,
      scrollWheelZoom: true
    }).setView([28.75, 77.15], 10);

    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // Initial markers
    farmMarkerRef.current = L.marker([29.3909, 76.9635], { icon: createCustomIcon('#5c915a', '🌾') })
      .addTo(map)
      .bindPopup(`<b>Origin</b><br/>${pickupLocation}`);

    centreMarkerRef.current = L.marker([28.9931, 77.0151], { icon: createCustomIcon('#c58737', '📦') })
      .addTo(map)
      .bindPopup('<b>Collection Centre</b><br/>Transit Hub');

    buyerMarkerRef.current = L.marker([28.7159, 77.1706], { icon: createCustomIcon('#4a7a8a', '🛍️') })
      .addTo(map)
      .bindPopup(`<b>Buyer Destination</b><br/>${deliveryLocation}`);

    routePolylineRef.current = L.polyline([[29.3909, 76.9635], [28.9931, 77.0151], [28.7159, 77.1706]], {
      color: '#498354',
      weight: 4,
      dashArray: '6, 8',
      opacity: 0.8
    }).addTo(map);

    // Vehicle marker
    const vehicleIcon = L.divIcon({
      className: 'vehicle-leaflet-marker',
      html: `<div style="
        background-color: #2f6b45;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 3px 10px rgba(0,0,0,0.35);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 15px;
      ">🚚</div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });

    vehicleMarkerRef.current = L.marker([28.9931, 77.0151], { icon: vehicleIcon })
      .addTo(map)
      .bindPopup('<b>Active Vehicle</b><br/>HR 38 AB 2041');

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Dynamically re-calculate route when pickupLocation or deliveryLocation changes
  useEffect(() => {
    let isMounted = true;

    const updateLocations = async () => {
      const origin = await resolveLocation(pickupLocation, [29.3909, 76.9635]);
      const dest = await resolveLocation(deliveryLocation, [28.6256, 77.3292]);

      if (!isMounted) return;

      const midLat = (origin[0] + dest[0]) / 2 + 0.015;
      const midLng = (origin[1] + dest[1]) / 2 - 0.01;
      const centre = [midLat, midLng];

      const map = mapInstanceRef.current;
      if (!map) return;

      if (farmMarkerRef.current) {
        farmMarkerRef.current.setLatLng(origin);
        farmMarkerRef.current.setPopupContent(`<b>Origin</b><br/>${pickupLocation}`);
      }
      if (centreMarkerRef.current) {
        centreMarkerRef.current.setLatLng(centre);
        centreMarkerRef.current.setPopupContent(`<b>Collection Centre</b><br/>Transit Hub`);
      }
      if (buyerMarkerRef.current) {
        buyerMarkerRef.current.setLatLng(dest);
        buyerMarkerRef.current.setPopupContent(`<b>Buyer Destination</b><br/>${deliveryLocation}`);
      }
      if (vehicleMarkerRef.current) {
        vehicleMarkerRef.current.setLatLng(centre);
      }

      // Fetch road route from OSRM
      try {
        const coords = `${origin[1]},${origin[0]};${centre[1]},${centre[0]};${dest[1]},${dest[0]}`;
        const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`);
        if (res.ok && isMounted) {
          const data = await res.json();
          if (data.routes && data.routes[0]) {
            const roadPoints = data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
            if (routePolylineRef.current) {
              routePolylineRef.current.setLatLngs(roadPoints);
            }
          }
        }
      } catch (err) {
        if (routePolylineRef.current) {
          routePolylineRef.current.setLatLngs([origin, centre, dest]);
        }
      }

      map.fitBounds([origin, dest], { padding: [50, 50] });
    };

    updateLocations();

    return () => {
      isMounted = false;
    };
  }, [pickupLocation, deliveryLocation]);

  // 3. Connect to backend API & Socket.IO
  useEffect(() => {
    logisticsService.getShipment(shipmentId).then((data) => {
      if (data) {
        setShipmentData(data);
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
          if (mapInstanceRef.current) {
            mapInstanceRef.current.panTo(newPos);
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
              opacity: 0.9
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
    <div className="map-panel" style={{ overflow: 'hidden', borderRadius: '10px' }}>
      <div className="map-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', background: '#fff', borderBottom: '1px solid #eef2ed' }}>
        <div>
          <b style={{ fontSize: '14px', marginRight: '8px' }}>Shipment {shipmentId}</b>
          <span className={`badge ${isDeviated ? 'badge-amber' : 'badge-blue'}`}>
            {isDeviated ? 'Route Recalculated' : status}
          </span>
          <span style={{ marginLeft: '12px', fontSize: '12px', color: '#666' }}>
            Route: <b>{pickupLocation}</b> → <b>{deliveryLocation}</b>
          </span>
        </div>
        <button
          className="map-control"
          onClick={() => {
            if (mapInstanceRef.current && vehicleMarkerRef.current) {
              mapInstanceRef.current.setView(vehicleMarkerRef.current.getLatLng(), 11);
            }
          }}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
        >
          <MapPin style={{ width: '14px' }} /> Center Vehicle
        </button>
      </div>

      <div
        ref={mapRef}
        style={{
          height: '380px',
          width: '100%',
          zIndex: 1
        }}
      />
    </div>
  );
}

