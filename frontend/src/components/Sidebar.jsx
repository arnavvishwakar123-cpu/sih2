// Sidebar.jsx - Desktop Navigation Grouped by Disaster Lifecycle
import React from 'react';
import { 
  Home, 
  Map, 
  AlertOctagon, 
  Radio, 
  Flame, 
  Truck, 
  Users, 
  Building2, 
  Package, 
  Activity, 
  MessageSquare, 
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, counts = {} }) {
  const navSections = [
    {
      title: "Core Platform",
      items: [
        { id: "landing", label: "Public Portal", icon: Home },
        { id: "dashboard", label: "Citizen Dashboard", icon: ShieldCheck }
      ]
    },
    {
      title: "Before Disaster (Mitigation)",
      items: [
        { id: "risk", label: "Risk Assessment", icon: Activity },
        { id: "alerts", label: "Early Warnings", icon: Radio, count: counts.alerts || 4 }
      ]
    },
    {
      title: "During Disaster (Response)",
      items: [
        { id: "map", label: "Disaster GIS Map", icon: Map },
        { id: "rescue", label: "Rescue Operations", icon: Truck, count: counts.incidents || 4 },
        { id: "report", label: "Report Incident", icon: Flame },
        { id: "shelters", label: "Shelter Network", icon: Building2, count: counts.shelters || 4 },
        { id: "resources", label: "Relief Inventory", icon: Package, count: counts.lowStock || 2 }
      ]
    },
    {
      title: "After Disaster (Recovery)",
      items: [
        { id: "volunteers", label: "Volunteer Verification", icon: Users, count: counts.pendingTasks || 1 },
        { id: "recovery", label: "Recovery Tracking", icon: CheckCircle2 },
        { id: "feedback", label: "Citizen Feedback", icon: MessageSquare }
      ]
    },
    {
      title: "Intelligence & AI",
      items: [
        { id: "ai", label: "AI Safety Assistant", icon: Sparkles }
      ]
    }
  ];

  return (
    <aside className="desktop-sidebar">
      {navSections.map((section, sIdx) => (
        <div key={sIdx}>
          <div className="sidebar-section-title">{section.title}</div>
          {section.items.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <div 
                key={item.id}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <Icon size={17} />
                <span>{item.label}</span>
                {item.count !== undefined && (
                  <span className="count-pill">{item.count}</span>
                )}
              </div>
            );
          })}
        </div>
      ))}
      
      {/* Bottom Footer Note */}
      <div style={{ padding: '20px', marginTop: 'auto', borderTop: '1px solid var(--border-light)', fontSize: '11px', color: 'var(--text-light)' }}>
        <p style={{ fontWeight: '600', color: 'var(--text-main)', marginBottom: '4px' }}>National Emergency Grid</p>
        <p>AICTE SIH 2026 Innovation PS-26206</p>
      </div>
    </aside>
  );
}
