// RescueCoordinationView.jsx - EOC Incident Dispatch & Dijkstra Routing
import React, { useState } from 'react';
import { 
  Truck, 
  Navigation, 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  Activity, 
  Layers, 
  ShieldAlert,
  Radio,
  UserCheck
} from 'lucide-react';
import { api } from '../api';

export default function RescueCoordinationView({
  incidents = [],
  rescueTeams = [],
  onUpdateIncidentStatus,
  onUpdateTeamLocation
}) {
  const [selectedIncident, setSelectedIncident] = useState(incidents[0] || null);
  const [routeResult, setRouteResult] = useState(null);
  const [isRouting, setIsRouting] = useState(false);
  const [avoidBlocked, setAvoidBlocked] = useState(true);

  // Trigger Dijkstra route computation
  const handleComputeRoute = async () => {
    setIsRouting(true);
    try {
      const res = await api.getOptimizedRoute('BASE_NDRF', 'INC_RIVER', avoidBlocked);
      setRouteResult(res.data);
    } catch (e) {
      console.warn('Routing error:', e);
    } finally {
      setIsRouting(false);
    }
  };

  const handleStatusChange = async (incidentId, newStatus) => {
    try {
      await api.updateIncidentStatus(incidentId, newStatus);
      if (onUpdateIncidentStatus) onUpdateIncidentStatus(incidentId, newStatus);
    } catch (e) {
      alert('Failed to update incident status.');
    }
  };

  const handleAssignTeam = async (incidentId, teamId) => {
    try {
      await api.updateIncidentStatus(incidentId, 'ASSIGNED', teamId);
      if (onUpdateIncidentStatus) onUpdateIncidentStatus(incidentId, 'ASSIGNED', teamId);
    } catch (e) {
      alert('Failed to assign team.');
    }
  };

  const handleSimulateGps = async (teamId) => {
    // Small random delta to simulate vehicle GPS ping
    const team = rescueTeams.find(t => t.id === teamId);
    if (!team) return;
    const newLat = team.currentLat + (Math.random() - 0.5) * 0.005;
    const newLng = team.lng + (Math.random() - 0.5) * 0.005;
    try {
      await api.updateTeamLocation(teamId, newLat, newLng, 'EN_ROUTE');
      if (onUpdateTeamLocation) onUpdateTeamLocation(teamId, newLat, newLng, 'EN_ROUTE');
    } catch (e) {
      console.warn('GPS update error:', e);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* EOC Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--blue-navy)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Truck size={22} color="var(--blue-primary)" />
            Emergency Operations Command (EOC) • Incident Dispatch
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-light)' }}>
            Real-Time Resource Allocation, Dijkstra Routing, & Field Rescue Deployment
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <span className="badge badge-live">Live Telemetry Active</span>
          <span className="badge badge-info">Dijkstra Engine Online</span>
        </div>
      </div>

      {/* Incident Management Operations Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <AlertTriangle size={18} color="var(--emergency-red)" />
            Active Incident Command Queue ({incidents.length})
          </h3>
          <span style={{ fontSize: '11px', color: 'var(--text-light)' }}>
            Ordered by Severity Index
          </span>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Incident ID & Type</th>
                <th>Location & Sector</th>
                <th>Affected / Urgency</th>
                <th>Status Lifecycle</th>
                <th>Assigned Unit</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {incidents.map((inc) => {
                const isCritical = inc.severity === 'CRITICAL' || inc.source === 'SOS';
                return (
                  <tr key={inc.id} style={{ background: selectedIncident?.id === inc.id ? 'var(--blue-subtle)' : 'transparent' }}>
                    <td>
                      <div style={{ fontWeight: '700', color: isCritical ? 'var(--emergency-red)' : 'var(--blue-primary)' }}>
                        {inc.id}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-light)' }}>
                        {inc.type} {inc.source === 'SOS' && '• 🚨 SOS'}
                      </div>
                    </td>

                    <td>
                      <div style={{ fontWeight: '600' }}>{inc.title}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-light)' }}>📍 {inc.locationName}</div>
                    </td>

                    <td>
                      <div style={{ fontWeight: '700' }}>{inc.peopleAffected} People</div>
                      <span className={`badge ${isCritical ? 'badge-critical' : 'badge-warning'}`} style={{ fontSize: '10px' }}>
                        {inc.severity}
                      </span>
                    </td>

                    <td>
                      <select
                        value={inc.status}
                        onChange={(e) => handleStatusChange(inc.id, e.target.value)}
                        className="form-select"
                        style={{ fontSize: '11.5px', padding: '4px 8px', width: 'auto' }}
                      >
                        <option value="NEW">NEW</option>
                        <option value="VERIFIED">VERIFIED</option>
                        <option value="PRIORITY">PRIORITY</option>
                        <option value="ASSIGNED">ASSIGNED</option>
                        <option value="EN_ROUTE">EN_ROUTE</option>
                        <option value="ON_SITE">ON_SITE</option>
                        <option value="RESOLVED">RESOLVED</option>
                        <option value="CLOSED">CLOSED</option>
                      </select>
                    </td>

                    <td>
                      {inc.assignedTeamName ? (
                        <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--blue-primary)' }}>
                          🚒 {inc.assignedTeamName}
                        </div>
                      ) : (
                        <select
                          className="form-select"
                          onChange={(e) => handleAssignTeam(inc.id, e.target.value)}
                          defaultValue=""
                          style={{ fontSize: '11px', padding: '4px 8px', width: 'auto' }}
                        >
                          <option value="" disabled>Assign Unit...</option>
                          {rescueTeams.map(t => (
                            <option key={t.id} value={t.id}>
                              {t.name} ({t.status})
                            </option>
                          ))}
                        </select>
                      )}
                    </td>

                    <td>
                      <button 
                        className="btn btn-secondary"
                        onClick={() => setSelectedIncident(inc)}
                        style={{ fontSize: '11px', padding: '4px 10px' }}
                      >
                        Select & Route
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Two Column Layout: Dijkstra Pathfinding + Rescue Units */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        {/* Dijkstra Route Optimizer Panel */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Navigation size={18} color="var(--blue-primary)" />
              Dijkstra Shortest-Path & Flood Avoidance Engine
            </h3>
            <button 
              className="btn btn-primary" 
              onClick={handleComputeRoute}
              disabled={isRouting}
              style={{ fontSize: '11px', padding: '4px 10px' }}
            >
              {isRouting ? 'Computing...' : 'Recalculate Route'}
            </button>
          </div>

          <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '14px' }}>
            Calculates optimal emergency transit corridor from <strong>NDRF Battalion Base</strong> to active target, automatically detecting and bypassing submerged highways.
          </div>

          <div style={{ marginBottom: '14px', padding: '10px 14px', background: 'var(--bg-muted)', borderRadius: '8px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12.5px', fontWeight: '600' }}>
              <input 
                type="checkbox" 
                checked={avoidBlocked} 
                onChange={(e) => setAvoidBlocked(e.target.checked)} 
              />
              Avoid Blocked / Flooded Corridors (Dijkstra Penalty Weight: ∞)
            </label>
          </div>

          {routeResult ? (
            <div style={{ padding: '14px', background: 'var(--blue-light)', borderRadius: '8px', border: '1px solid var(--blue-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--blue-primary)' }}>
                  Recommended Corridor:
                </span>
                <span className="badge badge-safe">OPTIMIZED</span>
              </div>

              <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '4px' }}>
                Est. Transit Time: {routeResult.estimatedTravelTimeMinutes} Minutes ({routeResult.totalDistanceKm} km)
              </div>

              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                Path: {routeResult.pathNodeIds?.join(' ➔ ')}
              </div>

              <div style={{ fontSize: '11px', color: 'var(--emergency-red)', fontWeight: '600', paddingTop: '6px', borderTop: '1px solid var(--blue-border)' }}>
                ⛔ Blocked Corridor Identified: {routeResult.blockedRoadIdentified}
              </div>
            </div>
          ) : (
            <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-light)', fontSize: '12px', border: '1px dashed var(--border-medium)', borderRadius: '8px' }}>
              Click "Recalculate Route" to execute graph Dijkstra route traversal.
            </div>
          )}
        </div>

        {/* Rescue Team Deployment Roster */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Truck size={18} color="var(--blue-secondary)" />
              Active Rescue Units Roster ({rescueTeams.length})
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '420px', overflowY: 'auto' }}>
            {rescueTeams.map((team) => (
              <div 
                key={team.id}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  background: 'var(--bg-muted)',
                  border: '1px solid var(--border-light)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)' }}>
                    {team.name}
                  </div>
                  <span className={`badge ${team.status === 'AVAILABLE' ? 'badge-safe' : 'badge-warning'}`}>
                    {team.status}
                  </span>
                </div>

                <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Lead: {team.teamLead} • Strength: <strong>{team.personnelCount} Personnel</strong>
                </div>

                <div style={{ fontSize: '11px', color: 'var(--text-light)', marginBottom: '8px' }}>
                  Equip: {team.equipment?.slice(0, 2).join(', ')}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>
                    📍 Lat: {team.currentLat.toFixed(3)}, Lng: {team.lng.toFixed(3)}
                  </span>
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => handleSimulateGps(team.id)}
                    style={{ fontSize: '10.5px', padding: '3px 8px' }}
                    title="Simulate GPS tracking telemetry packet"
                  >
                    Ping Vehicle GPS
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
