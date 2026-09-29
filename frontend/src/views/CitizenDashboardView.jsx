// CitizenDashboardView.jsx - Personalized Citizen Hub & Risk Monitor
import React from 'react';
import { 
  ShieldAlert, 
  MapPin, 
  AlertTriangle, 
  Building2, 
  PhoneCall, 
  CheckCircle2, 
  ArrowRight,
  Flame,
  Radio,
  FileText
} from 'lucide-react';

export default function CitizenDashboardView({
  alerts = [],
  shelters = [],
  incidents = [],
  onNavigate,
  onOpenSos
}) {
  // Active critical alert if any
  const criticalAlert = alerts.find(a => a.level === 'CRITICAL') || alerts[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Citizen Location & Real-Time Risk Bar */}
      <div 
        style={{
          background: '#FFFFFF',
          border: '1px solid var(--border-light)',
          borderRadius: '12px',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--blue-light)', color: 'var(--blue-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MapPin size={20} />
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-light)', textTransform: 'uppercase', fontWeight: '600' }}>
              Your Detected Geographic Sector
            </div>
            <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-main)' }}>
              Guwahati Riparian Belt, Kamrup Metro (Assam)
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-light)', textAlign: 'right' }}>Local Zone Risk:</div>
            <span className="badge badge-critical" style={{ fontSize: '12px', fontWeight: '800' }}>
              CRITICAL FLOOD ZONE (Score 88.6)
            </span>
          </div>

          <button className="btn btn-emergency-sos" onClick={onOpenSos}>
            <AlertTriangle size={15} /> QUICK SOS
          </button>
        </div>
      </div>

      {/* Critical Early Warning Banner */}
      {criticalAlert && (
        <div 
          style={{
            background: 'var(--emergency-red-bg)',
            border: '2px solid var(--emergency-red-border)',
            borderRadius: '12px',
            padding: '18px 22px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '14px'
          }}
        >
          <div style={{ color: 'var(--emergency-red)', marginTop: '2px' }}>
            <AlertTriangle size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="badge badge-critical">IMMEDIATE ACTION REQUIRED</span>
              <span style={{ fontSize: '11px', color: '#991B1B', fontWeight: '600' }}>{criticalAlert.source}</span>
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#991B1B', margin: '2px 0 6px' }}>
              {criticalAlert.title}
            </h3>
            <p style={{ fontSize: '13px', color: '#7F1D1D', lineHeight: '1.5', marginBottom: '10px' }}>
              {criticalAlert.action}
            </p>
            <div style={{ fontSize: '11px', color: '#991B1B' }}>
              Affected Region: <strong>{criticalAlert.region}</strong> • Duration: {criticalAlert.expectedDuration}
            </div>
          </div>
          <button 
            className="btn btn-primary" 
            onClick={() => onNavigate('shelters')}
            style={{ background: 'var(--emergency-red)', borderColor: '#B91C1C', alignSelf: 'center' }}
          >
            Evacuate to Shelter <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* Main Grid: Nearby Shelters & Active Incidents */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Nearby Shelters */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Building2 size={18} color="var(--blue-primary)" />
              Nearest Designated Shelters
            </h3>
            <button 
              className="btn btn-outline" 
              onClick={() => onNavigate('shelters')}
              style={{ fontSize: '11px', padding: '4px 8px' }}
            >
              View All ({shelters.length})
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {shelters.slice(0, 3).map((shl) => {
              const occupancyPct = Math.round((shl.occupied / shl.capacity) * 100);
              return (
                <div 
                  key={shl.id} 
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    background: 'var(--bg-muted)',
                    border: '1px solid var(--border-light)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <h4 style={{ fontSize: '13.5px', fontWeight: '700', color: 'var(--text-main)' }}>
                      {shl.name}
                    </h4>
                    <span className="badge badge-safe">
                      {shl.available} Available
                    </span>
                  </div>

                  <div style={{ fontSize: '11px', color: 'var(--text-light)', marginBottom: '8px' }}>
                    📍 {shl.location} • {shl.medicalSupport}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className="progress-bar-container" style={{ flex: 1 }}>
                      <div 
                        className={`progress-bar-fill ${occupancyPct > 85 ? 'warning' : 'safe'}`}
                        style={{ width: `${occupancyPct}%` }}
                      />
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)' }}>
                      {shl.occupied}/{shl.capacity} ({occupancyPct}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Report & Safety Actions */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Flame size={18} color="var(--warning-orange)" />
              Immediate Emergency Services
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div 
              style={{
                padding: '14px',
                borderRadius: '8px',
                background: 'var(--blue-subtle)',
                border: '1px solid var(--blue-border)',
                cursor: 'pointer'
              }}
              onClick={() => onNavigate('report')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ background: 'var(--blue-primary)', color: '#FFF', padding: '8px', borderRadius: '6px' }}>
                  <FileText size={18} />
                </div>
                <div>
                  <h4 style={{ fontSize: '13.5px', fontWeight: '700', color: 'var(--blue-primary)' }}>
                    Report a Disaster Incident or Hazard
                  </h4>
                  <p style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                    Submit photos, affected persons, and injuries with instant AI triage.
                  </p>
                </div>
              </div>
            </div>

            <div 
              style={{
                padding: '14px',
                borderRadius: '8px',
                background: '#ECFDF5',
                border: '1px solid #A7F3D0',
                cursor: 'pointer'
              }}
              onClick={() => onNavigate('feedback')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ background: '#059669', color: '#FFF', padding: '8px', borderRadius: '6px' }}>
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <h4 style={{ fontSize: '13.5px', fontWeight: '700', color: '#065F46' }}>
                    Relief Received? Submit Citizen Feedback
                  </h4>
                  <p style={{ fontSize: '11.5px', color: '#047857' }}>
                    Rate rescue response time and report any missing essential supplies.
                  </p>
                </div>
              </div>
            </div>

            {/* Direct Helplines Box */}
            <div style={{ padding: '12px', background: 'var(--bg-muted)', borderRadius: '8px', fontSize: '12px' }}>
              <div style={{ fontWeight: '700', marginBottom: '6px', color: 'var(--text-main)' }}>Emergency Hotlines:</div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Police / National Emergency:</span>
                <strong><a href="tel:112" style={{ color: '#DC2626', textDecoration: 'none' }}>112</a></strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                <span>Ambulance / Paramedic:</span>
                <strong><a href="tel:108" style={{ color: '#0A4D94', textDecoration: 'none' }}>108</a></strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                <span>District Disaster Control:</span>
                <strong><a href="tel:1077" style={{ color: '#D97706', textDecoration: 'none' }}>1077</a></strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
