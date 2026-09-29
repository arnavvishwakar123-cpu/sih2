// ShelterManagementView.jsx - Shelter Network & Occupancy Tracking
import React from 'react';
import { 
  Building2, 
  Users, 
  Droplets, 
  Utensils, 
  Activity, 
  PhoneCall, 
  Plus, 
  Minus 
} from 'lucide-react';
import { api } from '../api';

export default function ShelterManagementView({ shelters = [], onRefreshData }) {
  const handleOccupancyDelta = async (shelterId, delta) => {
    try {
      await api.updateShelterOccupancy(shelterId, delta);
      if (onRefreshData) onRefreshData();
    } catch (e) {
      alert('Failed to update shelter occupancy.');
    }
  };

  const totalCapacity = shelters.reduce((acc, s) => acc + s.capacity, 0);
  const totalOccupied = shelters.reduce((acc, s) => acc + s.occupied, 0);
  const totalAvailable = totalCapacity - totalOccupied;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--blue-navy)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building2 size={22} color="var(--blue-primary)" />
            Emergency Relief Shelter Network
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-light)' }}>
            Real-Time Occupancy Gauges • Potable Water & Food Rations • On-Site Paramedics
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ padding: '8px 14px', background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '8px', fontSize: '12px' }}>
            Available Beds: <strong style={{ color: '#059669', fontSize: '14px' }}>{totalAvailable}</strong>
          </div>
          <div style={{ padding: '8px 14px', background: 'var(--blue-light)', border: '1px solid var(--blue-border)', borderRadius: '8px', fontSize: '12px' }}>
            Total Network Capacity: <strong style={{ color: 'var(--blue-primary)', fontSize: '14px' }}>{totalCapacity}</strong>
          </div>
        </div>
      </div>

      {/* Grid of Shelters */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {shelters.map((shl) => {
          const occupancyPct = Math.round((shl.occupied / shl.capacity) * 100);
          const isNearlyFull = occupancyPct >= 90;

          return (
            <div key={shl.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="card-header">
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)' }}>
                    {shl.name}
                  </h3>
                  <div style={{ fontSize: '11px', color: 'var(--text-light)' }}>📍 {shl.location}</div>
                </div>
                <span className={`badge ${isNearlyFull ? 'badge-critical' : 'badge-safe'}`}>
                  {shl.available} Available
                </span>
              </div>

              {/* Visual Capacity Meter */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '6px' }}>
                  <span>Occupancy: <strong>{shl.occupied} / {shl.capacity} occupied</strong></span>
                  <strong style={{ color: isNearlyFull ? 'var(--emergency-red)' : 'var(--blue-primary)' }}>{occupancyPct}%</strong>
                </div>

                <div className="progress-bar-container" style={{ height: '10px' }}>
                  <div 
                    className={`progress-bar-fill ${isNearlyFull ? 'critical' : (occupancyPct > 70 ? 'warning' : 'safe')}`}
                    style={{ width: `${occupancyPct}%` }}
                  />
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-light)', marginTop: '4px' }}>
                  {shl.available} spaces currently vacant
                </div>
              </div>

              {/* Amenities & Medical */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', background: 'var(--bg-muted)', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Activity size={14} color="var(--blue-primary)" />
                  <span><strong>Medical Support:</strong> {shl.medicalSupport}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Utensils size={14} color="var(--warning-orange)" />
                  <span><strong>Food Supply:</strong> {shl.foodAvailability}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Droplets size={14} color="#0284C7" />
                  <span><strong>Clean Water:</strong> {shl.waterAvailability}</span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  ♿ {shl.accessibility}
                </div>
              </div>

              {/* Coordinator Check-in/Check-out Controls */}
              <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <a 
                  href={`tel:${shl.contact}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', color: 'var(--blue-primary)', fontSize: '12px', fontWeight: '700' }}
                >
                  <PhoneCall size={13} /> {shl.contact}
                </a>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => handleOccupancyDelta(shl.id, -10)}
                    disabled={shl.occupied <= 0}
                    style={{ padding: '4px 8px', fontSize: '11px' }}
                    title="Check out 10 evacuated citizens"
                  >
                    <Minus size={12} /> -10
                  </button>
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleOccupancyDelta(shl.id, 10)}
                    disabled={shl.available <= 0}
                    style={{ padding: '4px 8px', fontSize: '11px' }}
                    title="Check in 10 evacuated citizens"
                  >
                    <Plus size={12} /> +10
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
