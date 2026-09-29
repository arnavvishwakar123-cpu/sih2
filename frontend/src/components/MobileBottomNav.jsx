// MobileBottomNav.jsx - Bottom Navigation for Mobile Devices & Simulator
import React from 'react';
import { Home, Map, PlusCircle, AlertTriangle, UserCheck, Layers } from 'lucide-react';

export default function MobileBottomNav({ activeTab, setActiveTab, onOpenSos }) {
  return (
    <nav className="mobile-bottom-nav">
      <button 
        className={`mobile-nav-button ${activeTab === 'dashboard' || activeTab === 'landing' ? 'active' : ''}`}
        onClick={() => setActiveTab('dashboard')}
      >
        <Home size={20} />
        <span>Home</span>
      </button>

      <button 
        className={`mobile-nav-button ${activeTab === 'map' ? 'active' : ''}`}
        onClick={() => setActiveTab('map')}
      >
        <Map size={20} />
        <span>Live Map</span>
      </button>

      {/* Center Thumb SOS Floating Trigger */}
      <button 
        className="mobile-nav-sos"
        onClick={onOpenSos}
        title="Emergency SOS Quick Trigger"
      >
        SOS
      </button>

      <button 
        className={`mobile-nav-button ${activeTab === 'report' ? 'active' : ''}`}
        onClick={() => setActiveTab('report')}
      >
        <PlusCircle size={20} />
        <span>Report</span>
      </button>

      <button 
        className={`mobile-nav-button ${['rescue', 'volunteers', 'shelters', 'resources', 'recovery'].includes(activeTab) ? 'active' : ''}`}
        onClick={() => setActiveTab('rescue')}
      >
        <Layers size={20} />
        <span>Operations</span>
      </button>
    </nav>
  );
}
