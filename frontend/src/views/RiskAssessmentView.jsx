// RiskAssessmentView.jsx - Risk Matrix (Hazard x Exposure x Vulnerability) & Early Warning
import React, { useState } from 'react';
import { 
  Activity, 
  Radio, 
  AlertTriangle, 
  ShieldCheck, 
  Plus, 
  BarChart2, 
  Info,
  CheckCircle2
} from 'lucide-react';
import { api } from '../api';

export default function RiskAssessmentView({
  riskAssessments = [],
  alerts = [],
  onRefreshData
}) {
  const [showCreateAlert, setShowCreateAlert] = useState(false);
  const [newAlert, setNewAlert] = useState({
    title: '',
    level: 'WARNING',
    region: 'Coastal District, Odisha',
    action: 'Move to cyclone shelter immediately.',
    source: 'IMD Coastal Warning Center',
    expectedDuration: '24 Hours'
  });

  const handleBroadcastAlert = async (e) => {
    e.preventDefault();
    try {
      await api.createAlert(newAlert);
      alert('Official Early Warning Alert Broadcasted to Citizen Network!');
      setShowCreateAlert(false);
      if (onRefreshData) onRefreshData();
    } catch (err) {
      alert('Error broadcasting alert: ' + err.message);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--blue-navy)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={22} color="var(--blue-primary)" />
            Proactive Risk Assessment & Multi-Tier Early Warning
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-light)' }}>
            Mathematical Model: Risk = (Hazard × 40%) + (Exposure × 35%) + (Vulnerability × 25%)
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setShowCreateAlert(true)}>
          <Plus size={15} /> Broadcast Early Warning Alert
        </button>
      </div>

      {/* 4-Tier Early Warning Broadcast Ticker */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <Radio size={18} color="var(--warning-orange)" />
            Active Regional Early Warnings ({alerts.length})
          </h3>
          <span className="badge badge-pulse" style={{ background: '#FEE2E2', color: '#DC2626' }}>
            Broadcasting 24x7
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          {alerts.map((alt) => {
            const isCritical = alt.level === 'CRITICAL';
            const isWarning = alt.level === 'WARNING';
            const isAdvisory = alt.level === 'ADVISORY';

            return (
              <div 
                key={alt.id}
                style={{
                  padding: '14px',
                  borderRadius: '8px',
                  background: isCritical ? 'var(--emergency-red-bg)' : (isWarning ? 'var(--warning-orange-bg)' : 'var(--blue-subtle)'),
                  border: `1px solid ${isCritical ? 'var(--emergency-red-border)' : (isWarning ? 'var(--warning-orange-border)' : 'var(--blue-border)')}`
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span className={`badge ${isCritical ? 'badge-critical' : (isWarning ? 'badge-warning' : (isAdvisory ? 'badge-warning' : 'badge-info'))}`}>
                    {alt.level} ALERT
                  </span>
                  <span style={{ fontSize: '10.5px', color: 'var(--text-light)' }}>{alt.startTime}</span>
                </div>

                <h4 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '4px' }}>
                  {alt.title}
                </h4>

                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  📍 {alt.region} • Source: <em>{alt.source}</em>
                </div>

                <div style={{ fontSize: '12px', fontWeight: '600', color: isCritical ? '#991B1B' : 'var(--blue-primary)', padding: '6px 8px', background: 'rgba(255,255,255,0.7)', borderRadius: '4px' }}>
                  ⚡ Instruction: {alt.action}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quantitative District Risk Assessment Cards */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <BarChart2 size={18} color="var(--blue-primary)" />
            Vulnerability & Risk Index by District
          </h3>
          <span className="badge badge-demo">Simulated + Historical CWC Baselines</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {riskAssessments.map((ra, idx) => {
            const isCrit = ra.riskLevel === 'CRITICAL';
            return (
              <div 
                key={idx}
                style={{
                  padding: '16px',
                  borderRadius: '10px',
                  background: 'var(--bg-muted)',
                  border: '1px solid var(--border-light)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <h4 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)' }}>
                      {ra.district}
                    </h4>
                    <span style={{ fontSize: '11px', color: 'var(--text-light)' }}>{ra.state} • {ra.primaryHazard}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '18px', fontWeight: '900', color: isCrit ? 'var(--emergency-red)' : 'var(--blue-primary)' }}>
                      {ra.overallRiskScore}
                    </div>
                    <span className={`badge ${isCrit ? 'badge-critical' : 'badge-warning'}`} style={{ fontSize: '9px' }}>
                      {ra.riskLevel}
                    </span>
                  </div>
                </div>

                {/* Score Breakdown Bars */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px', color: 'var(--text-muted)', margin: '12px 0' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                      <span>Hazard Score (40%):</span>
                      <strong>{ra.hazardScore}/100</strong>
                    </div>
                    <div className="progress-bar-container"><div className="progress-bar-fill critical" style={{ width: `${ra.hazardScore}%` }} /></div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                      <span>Exposure Score (35%):</span>
                      <strong>{ra.exposureScore}/100</strong>
                    </div>
                    <div className="progress-bar-container"><div className="progress-bar-fill warning" style={{ width: `${ra.exposureScore}%` }} /></div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                      <span>Vulnerability Score (25%):</span>
                      <strong>{ra.vulnerabilityScore}/100</strong>
                    </div>
                    <div className="progress-bar-container"><div className="progress-bar-fill safe" style={{ width: `${ra.vulnerabilityScore}%` }} /></div>
                  </div>
                </div>

                <div style={{ fontSize: '11.5px', color: 'var(--text-main)', padding: '8px', background: '#FFFFFF', borderRadius: '6px', border: '1px solid var(--border-light)' }}>
                  <strong>Key Mitigation:</strong> {ra.keyRecommendation}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Broadcast Alert Modal */}
      {showCreateAlert && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '16px', fontWeight: '800' }}>Broadcast Official Early Warning</h3>
              <button onClick={() => setShowCreateAlert(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleBroadcastAlert}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Alert Severity Tier</label>
                  <select 
                    className="form-select"
                    value={newAlert.level}
                    onChange={(e) => setNewAlert({ ...newAlert, level: e.target.value })}
                  >
                    <option value="CRITICAL">🔴 CRITICAL (Red) - Immediate Evacuation</option>
                    <option value="WARNING">🟠 WARNING (Orange) - Severe Hazard</option>
                    <option value="ADVISORY">🟡 ADVISORY (Yellow) - Caution Advised</option>
                    <option value="INFORMATION">🔵 INFORMATION (Blue) - Bulletin</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Alert Title</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    required
                    value={newAlert.title}
                    onChange={(e) => setNewAlert({ ...newAlert, title: e.target.value })}
                    placeholder="e.g. Flash Flood Surge Warning"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Affected Target Region</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    required
                    value={newAlert.region}
                    onChange={(e) => setNewAlert({ ...newAlert, region: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Mandatory Action Guidance</label>
                  <textarea 
                    className="form-textarea" 
                    rows="2"
                    required
                    value={newAlert.action}
                    onChange={(e) => setNewAlert({ ...newAlert, action: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowCreateAlert(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Transmit Broadcast</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
