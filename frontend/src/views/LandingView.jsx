// LandingView.jsx - Public Portal & Platform Hero
import React from 'react';
import { 
  ShieldAlert, 
  Map, 
  AlertTriangle, 
  Building2, 
  Activity, 
  Users, 
  Truck, 
  Sparkles, 
  Package, 
  CheckCircle2, 
  PhoneCall, 
  ArrowRight,
  ShieldCheck,
  Radio,
  FileCheck
} from 'lucide-react';

export default function LandingView({ onNavigate, onOpenSos, stats = {} }) {
  return (
    <div>
      {/* Hero Section */}
      <section 
        style={{
          background: 'linear-gradient(135deg, #072B53 0%, #0A4D94 65%, #1B68B8 100%)',
          color: '#FFFFFF',
          padding: '48px 32px',
          borderRadius: '16px',
          marginBottom: '32px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 10px 25px -5px rgba(10, 77, 148, 0.3)'
        }}
      >
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '850px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: 'rgba(255,255,255,0.12)', borderRadius: '20px', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '16px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }}></span>
            AICTE SIH 2026 Student Innovation • Problem Statement 26206
          </div>

          <h1 style={{ fontSize: '36px', fontWeight: '800', lineHeight: '1.2', marginBottom: '14px', letterSpacing: '-0.5px' }}>
            One Platform. Every Stage of Disaster Management.
          </h1>

          <p style={{ fontSize: '16px', color: '#BFDBFE', lineHeight: '1.6', marginBottom: '28px' }}>
            A unified national ecosystem connecting <strong>Citizens, Volunteers, Rescue Units, and Emergency Operations Command (EOC)</strong>. Comprehensive lifecycle management from proactive risk mitigation to real-time rescue dispatch and transparent post-disaster recovery.
          </p>

          {/* Action Button Row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            <button 
              className="btn btn-emergency-sos" 
              onClick={onOpenSos}
              style={{ padding: '12px 24px', fontSize: '15px' }}
            >
              <AlertTriangle size={18} /> REPORT EMERGENCY / SOS
            </button>

            <button 
              className="btn btn-secondary" 
              onClick={() => onNavigate('map')}
              style={{ padding: '12px 20px', fontSize: '14px', background: '#FFFFFF', color: 'var(--blue-primary)', fontWeight: '700' }}
            >
              <Map size={18} /> Explore Live Disaster GIS Map
            </button>

            <button 
              className="btn btn-outline" 
              onClick={() => onNavigate('risk')}
              style={{ padding: '12px 20px', fontSize: '14px', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.4)' }}
            >
              <Activity size={18} /> Risk & Early Warnings
            </button>

            <button 
              className="btn btn-outline" 
              onClick={() => onNavigate('shelters')}
              style={{ padding: '12px 20px', fontSize: '14px', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.4)' }}
            >
              <Building2 size={18} /> Find Nearby Shelters
            </button>
          </div>
        </div>
      </section>

      {/* 3-Stage Disaster Lifecycle Banner */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={20} color="var(--blue-primary)" />
          Complete Disaster Management Lifecycle Architecture
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {/* Phase 1: Before */}
          <div className="card" style={{ borderLeft: '4px solid var(--blue-secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <div style={{ background: 'var(--blue-light)', color: 'var(--blue-primary)', padding: '8px', borderRadius: '8px' }}>
                <Activity size={20} />
              </div>
              <div>
                <span className="badge badge-info" style={{ marginBottom: '2px' }}>PHASE 1</span>
                <h3 style={{ fontSize: '15px', fontWeight: '700' }}>BEFORE DISASTER</h3>
              </div>
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '12px' }}>
              Proactive vulnerability mapping, hazard indexing, and pre-positioning relief supplies.
            </p>
            <ul style={{ fontSize: '12px', color: 'var(--text-main)', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li>✓ Hazard × Exposure × Vulnerability Scoring</li>
              <li>✓ 4-Tier Early Warning Broadcasting (Blue, Yellow, Orange, Red)</li>
              <li>✓ Critical Medical & Relief Pre-positioning</li>
            </ul>
          </div>

          {/* Phase 2: During */}
          <div className="card" style={{ borderLeft: '4px solid var(--emergency-red)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <div style={{ background: 'var(--emergency-red-bg)', color: 'var(--emergency-red)', padding: '8px', borderRadius: '8px' }}>
                <Truck size={20} />
              </div>
              <div>
                <span className="badge badge-critical" style={{ marginBottom: '2px' }}>PHASE 2</span>
                <h3 style={{ fontSize: '15px', fontWeight: '700' }}>DURING DISASTER</h3>
              </div>
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '12px' }}>
              Immediate emergency response, AI triage, automated dispatch, and live GIS tracking.
            </p>
            <ul style={{ fontSize: '12px', color: 'var(--text-main)', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li>✓ Instant Priority SOS Telemetry with GPS</li>
              <li>✓ Dijkstra Shortest-Path Route Optimization</li>
              <li>✓ Live Relief Shelter Capacities & NDRF Unit GPS</li>
            </ul>
          </div>

          {/* Phase 3: After */}
          <div className="card" style={{ borderLeft: '4px solid var(--safe-green)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <div style={{ background: 'var(--safe-green-bg)', color: 'var(--safe-green)', padding: '8px', borderRadius: '8px' }}>
                <CheckCircle2 size={20} />
              </div>
              <div>
                <span className="badge badge-safe" style={{ marginBottom: '2px' }}>PHASE 3</span>
                <h3 style={{ fontSize: '15px', fontWeight: '700' }}>AFTER DISASTER</h3>
              </div>
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '12px' }}>
              Transparent recovery monitoring, volunteer proof verification, and citizen audits.
            </p>
            <ul style={{ fontSize: '12px', color: 'var(--text-main)', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li>✓ Closed-Loop Volunteer Proof Photo Auditing</li>
              <li>✓ Infrastructure Restoration Tracking (Power, Water, Roads)</li>
              <li>✓ Citizen Relief Satisfaction & Response Audits</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Real-Time Operational Statistics Bar */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon"><ShieldAlert size={22} /></div>
          <div>
            <div className="stat-value">{stats.activeDisasters || 4}</div>
            <div className="stat-label">Active Monitored Disasters</div>
          </div>
        </div>

        <div className="stat-card critical">
          <div className="stat-icon"><AlertTriangle size={22} /></div>
          <div>
            <div className="stat-value">{stats.activeIncidents || 4}</div>
            <div className="stat-label">Live Distress Incidents</div>
          </div>
        </div>

        <div className="stat-card safe">
          <div className="stat-icon"><Building2 size={22} /></div>
          <div>
            <div className="stat-value">1,190</div>
            <div className="stat-label">Available Shelter Spaces</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon"><Truck size={22} /></div>
          <div>
            <div className="stat-value">{stats.rescueUnits || 5}</div>
            <div className="stat-label">Deployed Rescue Battalions</div>
          </div>
        </div>
      </div>

      {/* Emergency Helplines Direct Dial Section */}
      <div className="card" style={{ background: '#FFFFFF', border: '1px solid var(--blue-border)', padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--blue-navy)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PhoneCall size={18} color="var(--blue-primary)" />
              National Official Emergency Helplines (24x7 Direct Lines)
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-light)', marginTop: '2px' }}>
              Operated under Ministry of Home Affairs & National Disaster Management Authority
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            <a href="tel:112" className="btn btn-secondary" style={{ color: '#DC2626', borderColor: '#FCA5A5', fontWeight: '700' }}>
              🚨 112 National Emergency
            </a>
            <a href="tel:01124363260" className="btn btn-secondary" style={{ color: '#0A4D94', borderColor: '#93C5FD', fontWeight: '700' }}>
              📞 NDRF: 011-24363260
            </a>
            <a href="tel:108" className="btn btn-secondary" style={{ color: '#059669', borderColor: '#86EFAC', fontWeight: '700' }}>
              🚑 108 Emergency Medical
            </a>
            <a href="tel:1077" className="btn btn-secondary" style={{ color: '#D97706', borderColor: '#FCD34D', fontWeight: '700' }}>
              ⚠️ 1077 Disaster Control
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
