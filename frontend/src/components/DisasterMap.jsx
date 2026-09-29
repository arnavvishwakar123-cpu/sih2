// DisasterMap.jsx - Full Interactive GIS Disaster Map with Dijkstra Path & Filters
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Layers, 
  Filter, 
  MapPin, 
  AlertTriangle, 
  Building2, 
  Truck, 
  Navigation, 
  Maximize2 
} from 'lucide-react';
import { api } from '../api';

// Custom Map Marker Helper
function createCustomIcon(color, label, iconSvg) {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        border: 2px solid #FFFFFF;
      ">
        <div style="transform: rotate(45deg); color: #FFF; font-size: 13px; font-weight: bold; display: flex; align-items: center; justify-content: center;">
          ${iconSvg || '📍'}
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
}

export default function DisasterMap({
  incidents = [],
  shelters = [],
  rescueTeams = [],
  selectedIncident = null,
  onSelectIncident = () => {}
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const routeLayerRef = useRef(null);

  const [activeFilter, setActiveFilter] = useState('ALL');
  const [showShelters, setShowShelters] = useState(true);
  const [showRescueTeams, setShowRescueTeams] = useState(true);
  const [showRoute, setShowRoute] = useState(true);
  const [routeData, setRouteData] = useState(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Centered over North-East / Eastern India disaster zone
    const map = L.map(mapContainerRef.current, {
      center: [26.1850, 91.7500],
      zoom: 11,
      zoomControl: false
    });

    L.control.zoom({ position: 'topright' }).addTo(map);

    // Clean OpenStreetMap Humanitarian tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© OpenStreetMap contributors | NDMP GIS Platform'
    }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    routeLayerRef.current = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;

    // Fetch initial Dijkstra pathfinding
    api.getOptimizedRoute('BASE_NDRF', 'INC_RIVER', true)
      .then(res => setRouteData(res.data))
      .catch(err => console.warn('Route API error:', err));

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers when filters or data change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    // 1. Plot Incidents
    incidents.forEach(inc => {
      if (activeFilter !== 'ALL' && inc.type !== activeFilter) return;

      const isCritical = inc.severity === 'CRITICAL' || inc.source === 'SOS';
      const color = isCritical ? '#DC2626' : (inc.severity === 'PRIORITY' ? '#D97706' : '#2563EB');
      const icon = inc.type === 'FLOOD' ? '🌊' : (inc.type === 'LANDSLIDE' ? '⛰️' : '🚨');

      const marker = L.marker([inc.lat, inc.lng], {
        icon: createCustomIcon(color, inc.title, icon)
      });

      marker.bindPopup(`
        <div style="font-family: 'Inter', sans-serif; font-size: 13px; max-width: 240px;">
          <div style="font-weight: 800; color: ${color}; font-size: 11px; text-transform: uppercase;">
            ${inc.severity} • ${inc.type}
          </div>
          <div style="font-weight: 700; color: #0F172A; margin: 4px 0 6px;">
            ${inc.title}
          </div>
          <div style="font-size: 11px; color: #475569; margin-bottom: 6px;">
            📍 ${inc.locationName}
          </div>
          <div style="font-size: 11px; color: #475569; margin-bottom: 8px;">
            Affected: <strong>${inc.peopleAffected} persons</strong>
          </div>
          <div style="display: flex; gap: 6px;">
            <span style="background: #E2E8F0; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 600;">
              Status: ${inc.status}
            </span>
          </div>
        </div>
      `);

      marker.on('click', () => onSelectIncident(inc));
      markersLayerRef.current.addLayer(marker);
    });

    // 2. Plot Shelters
    if (showShelters) {
      shelters.forEach(shl => {
        const marker = L.marker([shl.lat, shl.lng], {
          icon: createCustomIcon('#059669', shl.name, '🏠')
        });

        marker.bindPopup(`
          <div style="font-family: 'Inter', sans-serif; font-size: 13px; max-width: 240px;">
            <div style="font-weight: 800; color: #059669; font-size: 11px;">
              EMERGENCY RELIEF SHELTER
            </div>
            <div style="font-weight: 700; color: #0F172A; margin: 4px 0;">
              ${shl.name}
            </div>
            <div style="font-size: 12px; margin: 6px 0;">
              Occupancy: <strong>${shl.occupied} / ${shl.capacity}</strong>
              <div style="height: 6px; background: #E2E8F0; border-radius: 3px; overflow: hidden; margin-top: 4px;">
                <div style="height: 100%; width: ${(shl.occupied / shl.capacity) * 100}%; background: #059669;"></div>
              </div>
            </div>
            <div style="font-size: 11px; color: #475569;">
              ✅ ${shl.available} beds available
            </div>
          </div>
        `);
        markersLayerRef.current.addLayer(marker);
      });
    }

    // 3. Plot Rescue Teams
    if (showRescueTeams) {
      rescueTeams.forEach(tm => {
        const marker = L.marker([tm.currentLat, tm.lng], {
          icon: createCustomIcon('#0A4D94', tm.name, '🚒')
        });

        marker.bindPopup(`
          <div style="font-family: 'Inter', sans-serif; font-size: 13px; max-width: 240px;">
            <div style="font-weight: 800; color: #0A4D94; font-size: 11px;">
              ${tm.agency} RESCUE SQUAD
            </div>
            <div style="font-weight: 700; color: #0F172A; margin: 4px 0;">
              ${tm.name}
            </div>
            <div style="font-size: 11px; color: #475569;">
              Status: <strong>${tm.status}</strong> • Team Size: ${tm.personnelCount}
            </div>
            <div style="font-size: 11px; color: #475569; margin-top: 4px;">
              Specialization: ${tm.specialization}
            </div>
          </div>
        `);
        markersLayerRef.current.addLayer(marker);
      });
    }

  }, [incidents, shelters, rescueTeams, activeFilter, showShelters, showRescueTeams]);

  // Render Dijkstra Route Line
  useEffect(() => {
    if (!mapInstanceRef.current || !routeLayerRef.current) return;
    routeLayerRef.current.clearLayers();

    if (showRoute && routeData && routeData.routeCoordinates) {
      const latlngs = routeData.routeCoordinates.map(c => [c.lat, c.lng]);

      // Primary optimized route (Blue line)
      const polyline = L.polyline(latlngs, {
        color: '#0A4D94',
        weight: 5,
        opacity: 0.85,
        dashArray: null
      });

      polyline.bindPopup(`
        <div style="font-family: 'Inter', sans-serif; font-size: 12px;">
          <strong>Dijkstra Recommended Corridor</strong><br/>
          Est. Travel Time: <strong>${routeData.estimatedTravelTimeMinutes} mins</strong> (${routeData.totalDistanceKm} km)<br/>
          Avoided: <em>${routeData.blockedRoadIdentified}</em>
        </div>
      `);
      routeLayerRef.current.addLayer(polyline);

      // Plot Blocked Road segment (Red dashed line)
      const blockedSegment = [
        [26.1820, 91.7510], // Paltan Bazar
        [26.1890, 91.7580]  // Guwahati Club
      ];
      const blockedLine = L.polyline(blockedSegment, {
        color: '#DC2626',
        weight: 5,
        opacity: 0.9,
        dashArray: '8, 8'
      });
      blockedLine.bindPopup(`<strong>⛔ BLOCKED ARTERY:</strong> Inundated by flood water (Submerged under 1.2m water).`);
      routeLayerRef.current.addLayer(blockedLine);
    }
  }, [showRoute, routeData]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '520px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
      {/* Map Container */}
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%', minHeight: '520px' }} />

      {/* Floating Map Legend & Layer Controls */}
      <div 
        style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          zIndex: 1000,
          background: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(6px)',
          borderRadius: '8px',
          padding: '12px 14px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          border: '1px solid var(--border-light)',
          maxWidth: '280px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '8px' }}>
          <Layers size={14} color="var(--blue-primary)" /> GIS Map Layers & Filters
        </div>

        {/* Disaster Type Filter Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '10px' }}>
          {['ALL', 'FLOOD', 'LANDSLIDE', 'CYCLONE'].map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                fontSize: '10px',
                padding: '3px 8px',
                borderRadius: '12px',
                border: activeFilter === f ? '1px solid var(--blue-primary)' : '1px solid var(--border-medium)',
                background: activeFilter === f ? 'var(--blue-primary)' : '#FFF',
                color: activeFilter === f ? '#FFF' : 'var(--text-muted)',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Toggles */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <input type="checkbox" checked={showShelters} onChange={(e) => setShowShelters(e.target.checked)} />
            <span>🏠 Relief Shelters ({shelters.length})</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <input type="checkbox" checked={showRescueTeams} onChange={(e) => setShowRescueTeams(e.target.checked)} />
            <span>🚒 Rescue Units ({rescueTeams.length})</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <input type="checkbox" checked={showRoute} onChange={(e) => setShowRoute(e.target.checked)} />
            <span>🛣️ Dijkstra Safe Route & Blockages</span>
          </label>
        </div>
      </div>

      {/* Floating Route Info Box */}
      {showRoute && routeData && (
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            right: '20px',
            zIndex: 1000,
            background: '#FFFFFF',
            padding: '10px 14px',
            borderRadius: '8px',
            boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
            border: '1px solid var(--blue-border)',
            fontSize: '11px',
            maxWidth: '300px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--blue-primary)', fontWeight: '700', marginBottom: '4px' }}>
            <Navigation size={13} /> Dijkstra Route Optimizer
          </div>
          <div>Optimal Rescue Travel Time: <strong>{routeData.estimatedTravelTimeMinutes} mins</strong> ({routeData.totalDistanceKm} km)</div>
          <div style={{ color: 'var(--emergency-red)', marginTop: '4px' }}>
            ⛔ Avoided submerged road: Paltan Bazar Corridor
          </div>
        </div>
      )}
    </div>
  );
}
