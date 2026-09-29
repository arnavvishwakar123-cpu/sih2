// RecoveryView.jsx - Post-Disaster Reconstruction & Relief Auditing
import React from 'react';
import { 
  CheckCircle2, 
  Zap, 
  Droplets, 
  Activity, 
  Home, 
  BookOpen, 
  GitCommit, 
  DollarSign, 
  FileCheck 
} from 'lucide-react';

export default function RecoveryView({ recoveryData = {} }) {
  const sectors = recoveryData.sectors || [];
  const claims = recoveryData.claims || {
    totalReliefClaims: 18450,
    verifiedClaims: 15320,
    disbursedDbtCr: 42.8,
    pendingAudit: 3130
  };

  const getIcon = (name) => {
    switch (name) {
      case 'Zap': return <Zap size={18} color="#D97706" />;
      case 'Droplets': return <Droplets size={18} color="#0284C7" />;
      case 'Activity': return <Activity size={18} color="#059669" />;
      case 'Home': return <Home size={18} color="var(--blue-primary)" />;
      case 'BookOpen': return <BookOpen size={18} color="#7C3AED" />;
      default: return <GitCommit size={18} color="var(--blue-navy)" />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--blue-navy)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={22} color="var(--safe-green)" />
          Post-Disaster Recovery & Reconstruction Tracking
        </h2>
        <p style={{ fontSize: '12px', color: 'var(--text-light)' }}>
          Critical Infrastructure Rehabilitation • Direct Benefit Transfer (DBT) Relief Disbursal
        </p>
      </div>

      {/* High-Level Overview Cards */}
      <div className="stat-grid">
        <div className="stat-card safe">
          <div className="stat-icon"><CheckCircle2 size={22} /></div>
          <div>
            <div className="stat-value">{recoveryData.overallPercentage || 71}%</div>
            <div className="stat-label">Total Infrastructure Restored</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon"><DollarSign size={22} /></div>
          <div>
            <div className="stat-value">₹{claims.disbursedDbtCr} Cr</div>
            <div className="stat-label">DBT Compensation Disbursed</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon"><FileCheck size={22} /></div>
          <div>
            <div className="stat-value">{claims.verifiedClaims.toLocaleString()}</div>
            <div className="stat-label">Verified Citizen Relief Claims</div>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon"><Activity size={22} /></div>
          <div>
            <div className="stat-value">{claims.pendingAudit.toLocaleString()}</div>
            <div className="stat-label">Pending Claim Audits</div>
          </div>
        </div>
      </div>

      {/* Sector Rehabilitation Progress Bars */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            Essential Civic Infrastructure Sector Restoration
          </h3>
          <span className="badge badge-safe">Audit Benchmark: 2026</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {sectors.map((sec, idx) => (
            <div 
              key={idx}
              style={{
                padding: '16px',
                borderRadius: '8px',
                background: 'var(--bg-muted)',
                border: '1px solid var(--border-light)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {getIcon(sec.icon)}
                  <div style={{ fontSize: '13.5px', fontWeight: '700', color: 'var(--text-main)' }}>
                    {sec.name}
                  </div>
                </div>
                <strong style={{ fontSize: '15px', color: 'var(--blue-primary)' }}>
                  {sec.progress}%
                </strong>
              </div>

              {/* Progress Bar */}
              <div className="progress-bar-container" style={{ height: '10px', marginBottom: '8px' }}>
                <div 
                  className={`progress-bar-fill ${sec.progress >= 85 ? 'safe' : (sec.progress > 60 ? 'warning' : 'critical')}`}
                  style={{ width: `${sec.progress}%` }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-light)' }}>
                <span>Status: <strong>{sec.status}</strong></span>
                <span>Target Completion: <strong>{sec.targetDate}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
