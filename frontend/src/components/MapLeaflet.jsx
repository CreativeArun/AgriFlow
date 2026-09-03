import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { logisticsService, trackingService } from '../lib/api/services.js';
import { MapPin, Truck, Wheat, Package, ShoppingBag } from 'lucide-react';

// Default default coordinates for Farm, Collection Centre, and Buyer
const DEFAULT_LOCATIONS = {
  farm: [29.3909, 76.9635], // Panipat, Haryana
  centre: [28.9931, 77.0151], // Sonipat, Haryana
  buyer: [28.7159, 77.1706] // Azadpur Mandi, Delhi
};

const DEFAULT_ROUTE = [
  DEFAULT_LOCATIONS.farm,
  DEFAULT_LOCATIONS.centre,
  DEFAULT_LOCATIONS.buyer
];

export default function MapLeaflet({ shipmentId = 'SHP-001', onDeviationDetected }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const vehicleMarkerRef = useRef(null);
  const routePolylineRef = useRef(null);
  const recalculatedPolylineRef = useRef(null);

  const [shipmentData, setShipmentData] = useState(null);
  const [vehiclePos, setVehiclePos] = useState(DEFAULT_LOCATIONS.centre);
  const [isDeviated, setIsDeviated] = useState(false);
  const [status, setStatus] = useState('On route');

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Create map instance
    const map = L.map(mapRef.current, {
      zoomControl: true,
      scrollWheelZoom: true
    }).setView([29.0, 77.05], 9);

    mapInstanceRef.current = map;

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // Custom Icon Creator
    const createCustomIcon = (color, label) => {
      return L.divIcon({
        className: 'custom-leaflet-marker',
        html: `<div style="
          background-color: ${color};
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 12px;
        ">${label}</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });
    };

    // Add Markers
    L.marker(DEFAULT_LOCATIONS.farm, { icon: createCustomIcon('#5c915a', '🌾') })
      .addTo(map)
      .bindPopup('<b>Farm</b><br/>Panipat, Haryana');

    L.marker(DEFAULT_LOCATIONS.centre, { icon: createCustomIcon('#c58737', '📦') })
      .addTo(map)
      .bindPopup('<b>Collection Centre</b><br/>Sonipat, Haryana');

    L.marker(DEFAULT_LOCATIONS.buyer, { icon: createCustomIcon('#4a7a8a', '🛍️') })
      .addTo(map)
      .bindPopup('<b>Buyer</b><br/>Azadpur Mandi, Delhi');

    // Add Original Route Polyline (fetch real OSRM road geometry)
    const fetchOriginalRoadRoute = async () => {
      try {
        const coords = `${DEFAULT_LOCATIONS.farm[1]},${DEFAULT_LOCATIONS.farm[0]};${DEFAULT_LOCATIONS.centre[1]},${DEFAULT_LOCATIONS.centre[0]};${DEFAULT_LOCATIONS.buyer[1]},${DEFAULT_LOCATIONS.buyer[0]}`;
        const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`);
        if (res.ok) {
          const data = await res.json();
          if (data.routes && data.routes[0]) {
            const roadPoints = data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
            if (routePolylineRef.current) {
              routePolylineRef.current.setLatLngs(roadPoints);
              return;
            }
          }
        }
      } catch (err) {
        console.warn('Could not fetch OSRM road route, fallback to direct lines', err);
      }
    };

    routePolylineRef.current = L.polyline(DEFAULT_ROUTE, {
      color: '#498354',
      weight: 4,
      dashArray: '6, 8',
      opacity: 0.8
    }).addTo(map);

    fetchOriginalRoadRoute();

    // Add Vehicle Marker
    const vehicleIcon = L.divIcon({
      className: 'vehicle-leaflet-marker',
      html: `<div style="
        background-color: #2f6b45;
        width: 34px;
        height: 34px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 3px 10px rgba(0,0,0,0.35);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
      ">🚚</div>`,
      iconSize: [34, 34],
      iconAnchor: [17, 17]
    });

    vehicleMarkerRef.current = L.marker(DEFAULT_LOCATIONS.centre, { icon: vehicleIcon })
      .addTo(map)
      .bindPopup('<b>Active Vehicle</b><br/>HR 38 AB 2041');

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Connect to Backend API and Socket.IO
  useEffect(() => {
    // 1. Fetch initial shipment details from backend
    logisticsService.getShipment(shipmentId).then((data) => {
      if (data) {
        setShipmentData(data);
        if (data.status) setStatus(data.status);
      }
    });

    // 2. Subscribe to real-time events via Socket.IO
    const unsubscribe = trackingService.subscribe(shipmentId, {
      onLocationUpdate: (loc) => {
        if (loc && loc.latitude && loc.longitude) {
          const newPos = [loc.latitude, loc.longitude];
          setVehiclePos(newPos);

          if (vehicleMarkerRef.current) {
            vehicleMarkerRef.current.setLatLng(newPos);
          }
          if (mapInstanceRef.current) {
            mapInstanceRef.current.panTo(newPos);
          }
        }
      },
      onRouteUpdate: (routeData) => {
        console.log('Recalculated route received from OSRM:', routeData);
        setIsDeviated(true);
        if (onDeviationDetected) onDeviationDetected(routeData);

        // Handle both routeData.route (OSRM [lat, lng] array) and routeData.waypoints
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
      <div className="map-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', background: '#fff' }}>
        <div>
          <b style={{ fontSize: '14px', marginRight: '8px' }}>Shipment {shipmentId}</b>
          <span className={`badge ${isDeviated ? 'badge-amber' : 'badge-blue'}`}>
            {isDeviated ? 'Route Recalculated' : status}
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

      {/* Real Interactive Leaflet Container */}
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

