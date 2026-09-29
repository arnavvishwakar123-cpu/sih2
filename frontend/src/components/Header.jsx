// Header.jsx - Official Top Navigation & Command Controls
import React from 'react';
import { 
  ShieldAlert, 
  Smartphone, 
  Monitor, 
  Volume2, 
  Radio, 
  Globe, 
  UserCheck, 
  AlertTriangle,
  Wifi,
  WifiOff
} from 'lucide-react';

export default function Header({
  activeRole,
  setActiveRole,
  isMobileSimulator,
  setIsMobileSimulator,
  language,
  setLanguage,
  onOpenSos,
  onOpenAiChat,
  isOnline = true,
  onNavigateHome
}) {
  return (
    <header className="app-header">
      {/* Brand & Emblem */}
      <div className="header-brand" onClick={onNavigateHome}>
        <div className="header-emblem">
          <ShieldAlert size={22} color="#FFFFFF" />
        </div>
        <div className="header-title-box">
          <h1>Disaster Management & Emergency Response</h1>
          <p>National Emergency Operations & Civic Network • SIH 2026</p>
        </div>
      </div>

      {/* Center Status Indicators */}
      <div className="header-actions desktop-only">
        <span className="badge badge-live">
          <span className="badge-pulse"></span>
          EOC Live Stream
        </span>
        <span className="badge badge-demo">
          Simulation Active
        </span>
        {isOnline ? (
          <span className="badge badge-safe">
            <Wifi size={12} /> Online
          </span>
        ) : (
          <span className="badge badge-critical">
            <WifiOff size={12} /> Offline Cache
          </span>
        )}
      </div>

      {/* Right Controls */}
      <div className="header-actions">
        {/* Language Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.08)', padding: '4px 8px', borderRadius: '6px' }}>
          <Globe size={14} color="#93C5FD" />
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            style={{ background: 'transparent', border: 'none', color: '#FFFFFF', fontSize: '12px', fontWeight: '600', cursor: 'pointer', outline: 'none' }}
          >
            <option value="en" style={{ color: '#000' }}>English</option>
            <option value="hi" style={{ color: '#000' }}>हिंदी (Hindi)</option>
            <option value="mr" style={{ color: '#000' }}>मराठी (Marathi)</option>
          </select>
        </div>

        {/* User Role Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.12)', padding: '4px 8px', borderRadius: '6px' }}>
          <UserCheck size={14} color="#60A5FA" />
          <select 
            value={activeRole} 
            onChange={(e) => setActiveRole(e.target.value)}
            style={{ background: 'transparent', border: 'none', color: '#FFFFFF', fontSize: '12px', fontWeight: '700', cursor: 'pointer', outline: 'none' }}
            title="Switch User Operational Role"
          >
            <option value="CITIZEN" style={{ color: '#000' }}>Citizen Portal</option>
            <option value="VOLUNTEER" style={{ color: '#000' }}>Volunteer Force</option>
            <option value="RESCUE_TEAM" style={{ color: '#000' }}>Rescue Unit (NDRF)</option>
            <option value="ADMIN" style={{ color: '#000' }}>EOC Admin / Lead</option>
          </select>
        </div>

        {/* Device Mode Switcher (Desktop EOC vs. Mobile View Experience) */}
        <button 
          className="btn btn-secondary" 
          onClick={() => setIsMobileSimulator(!isMobileSimulator)}
          title="Toggle Mobile-First Experience vs Desktop Operations Center"
          style={{ fontSize: '12px', padding: '6px 12px' }}
        >
          {isMobileSimulator ? (
            <>
              <Monitor size={14} /> Desktop EOC
            </>
          ) : (
            <>
              <Smartphone size={14} /> Mobile App Mode
            </>
          )}
        </button>

        {/* Multilingual AI Voice Assistant Button */}
        <button 
          className="btn btn-secondary" 
          onClick={onOpenAiChat}
          style={{ fontSize: '12px', padding: '6px 12px', background: '#1E3A8A', color: '#FFFFFF', borderColor: '#3B82F6' }}
        >
          <Volume2 size={14} /> AI Assistant
        </button>

        {/* Instant SOS Action */}
        <button 
          className="btn btn-emergency-sos" 
          onClick={onOpenSos}
          style={{ padding: '6px 16px' }}
        >
          <AlertTriangle size={15} /> SOS
        </button>
      </div>
    </header>
  );
}
