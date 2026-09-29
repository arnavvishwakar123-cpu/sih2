// App.jsx - Main Application Shell & Role-Based Router
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MobileBottomNav from './components/MobileBottomNav';
import SosModal from './components/SosModal';
import AiAssistantModal from './components/AiAssistantModal';
import DisasterMap from './components/DisasterMap';

// Views
import LandingView from './views/LandingView';
import CitizenDashboardView from './views/CitizenDashboardView';
import IncidentReportView from './views/IncidentReportView';
import RescueCoordinationView from './views/RescueCoordinationView';
import VolunteerHubView from './views/VolunteerHubView';
import ShelterManagementView from './views/ShelterManagementView';
import ResourceInventoryView from './views/ResourceInventoryView';
import RiskAssessmentView from './views/RiskAssessmentView';
import RecoveryView from './views/RecoveryView';
import CitizenFeedbackView from './views/CitizenFeedbackView';

import { api } from './api';

export default function App() {
  const [activeTab, setActiveTab] = useState('landing');
  const [activeRole, setActiveRole] = useState('CITIZEN'); // CITIZEN, VOLUNTEER, RESCUE_TEAM, ADMIN
  const [isMobileSimulator, setIsMobileSimulator] = useState(false);
  const [language, setLanguage] = useState('en');
  const [isSosModalOpen, setIsSosModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // App Data State
  const [disasters, setDisasters] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [rescueTeams, setRescueTeams] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [resources, setResources] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [volunteerTasks, setVolunteerTasks] = useState([]);
  const [riskAssessments, setRiskAssessments] = useState([]);
  const [recoveryData, setRecoveryData] = useState({});
  const [feedbackList, setFeedbackList] = useState([]);

  // Network online/offline listener
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Fetch initial datasets
  const loadAllData = async () => {
    try {
      const [
        dRes, aRes, iRes, rRes, sRes, resRes, vRes, vtRes, raRes, recRes, fbRes
      ] = await Promise.all([
        api.getDisasters(),
        api.getAlerts(),
        api.getIncidents(),
        api.getRescueTeams(),
        api.getShelters(),
        api.getResources(),
        api.getVolunteers(),
        api.getVolunteerTasks(),
        api.getRiskAssessments(),
        api.getRecoveryProgress(),
        api.getFeedback()
      ]);

      if (dRes?.data?.data) setDisasters(dRes.data.data);
      if (aRes?.data?.data) setAlerts(aRes.data.data);
      if (iRes?.data?.data) setIncidents(iRes.data.data);
      if (rRes?.data?.data) setRescueTeams(rRes.data.data);
      if (sRes?.data?.data) setShelters(sRes.data.data);
      if (resRes?.data?.data) setResources(resRes.data.data);
      if (vRes?.data?.data) setVolunteers(vRes.data.data);
      if (vtRes?.data?.data) setVolunteerTasks(vtRes.data.data);
      if (raRes?.data?.data) setRiskAssessments(raRes.data.data);
      if (recRes?.data?.data) setRecoveryData(recRes.data.data);
      if (fbRes?.data?.data) setFeedbackList(fbRes.data.data);
    } catch (err) {
      console.warn('Initial data load warning:', err);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // When user role changes, suggest the best default landing tab
  useEffect(() => {
    if (activeRole === 'RESCUE_TEAM' || activeRole === 'ADMIN') {
      if (activeTab === 'landing') setActiveTab('rescue');
    } else if (activeRole === 'VOLUNTEER') {
      if (activeTab === 'landing') setActiveTab('volunteers');
    }
  }, [activeRole]);

  // Counts for sidebar badges
  const counts = {
    alerts: alerts.length,
    incidents: incidents.length,
    shelters: shelters.length,
    lowStock: resources.filter(r => r.status === 'CRITICAL_LOW' || r.status === 'LOW').length,
    pendingTasks: volunteerTasks.filter(t => t.status === 'PROOF_SUBMITTED').length
  };

  // Render view router
  const renderCurrentView = () => {
    switch (activeTab) {
      case 'landing':
        return (
          <LandingView 
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenSos={() => setIsSosModalOpen(true)}
            stats={{
              activeDisasters: disasters.length,
              activeIncidents: incidents.length,
              rescueUnits: rescueTeams.length
            }}
          />
        );

      case 'dashboard':
        return (
          <CitizenDashboardView 
            alerts={alerts}
            shelters={shelters}
            incidents={incidents}
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenSos={() => setIsSosModalOpen(true)}
          />
        );

      case 'map':
        return (
          <div style={{ height: 'calc(100vh - 120px)' }}>
            <DisasterMap 
              incidents={incidents}
              shelters={shelters}
              rescueTeams={rescueTeams}
            />
          </div>
        );

      case 'report':
        return (
          <IncidentReportView 
            onReportSubmitted={() => {
              loadAllData();
              setActiveTab('map');
            }}
          />
        );

      case 'rescue':
        return (
          <RescueCoordinationView 
            incidents={incidents}
            rescueTeams={rescueTeams}
            onUpdateIncidentStatus={loadAllData}
            onUpdateTeamLocation={loadAllData}
          />
        );

      case 'volunteers':
        return (
          <VolunteerHubView 
            volunteers={volunteers}
            volunteerTasks={volunteerTasks}
            onRefreshData={loadAllData}
          />
        );

      case 'shelters':
        return (
          <ShelterManagementView 
            shelters={shelters}
            onRefreshData={loadAllData}
          />
        );

      case 'resources':
        return (
          <ResourceInventoryView 
            resources={resources}
            onRefreshData={loadAllData}
          />
        );

      case 'risk':
      case 'alerts':
        return (
          <RiskAssessmentView 
            riskAssessments={riskAssessments}
            alerts={alerts}
            onRefreshData={loadAllData}
          />
        );

      case 'recovery':
        return (
          <RecoveryView 
            recoveryData={recoveryData}
          />
        );

      case 'feedback':
        return (
          <CitizenFeedbackView 
            feedbackList={feedbackList}
            onRefreshData={loadAllData}
          />
        );

      case 'ai':
        return (
          <div className="card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '40px 20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '10px' }}>AI Disaster Voice & Triage Assistant</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Multilingual safety guidance in English, Hindi, and Marathi with voice speech synthesis.
            </p>
            <button className="btn btn-primary" onClick={() => setIsAiModalOpen(true)}>
              Launch Interactive AI Voice Modal
            </button>
          </div>
        );

      default:
        return <LandingView onNavigate={(tab) => setActiveTab(tab)} onOpenSos={() => setIsSosModalOpen(true)} />;
    }
  };

  return (
    <div className="app-container">
      {/* Top Application Header */}
      <Header 
        activeRole={activeRole}
        setActiveRole={setActiveRole}
        isMobileSimulator={isMobileSimulator}
        setIsMobileSimulator={setIsMobileSimulator}
        language={language}
        setLanguage={setLanguage}
        onOpenSos={() => setIsSosModalOpen(true)}
        onOpenAiChat={() => setIsAiModalOpen(true)}
        isOnline={isOnline}
        onNavigateHome={() => setActiveTab('landing')}
      />

      {/* Main Layout Area: Desktop EOC vs. Mobile Simulator */}
      {isMobileSimulator ? (
        <div className="mobile-simulator-wrapper">
          <div className="mobile-frame">
            <div className="mobile-notch">
              <div className="mobile-speaker"></div>
            </div>
            <div className="mobile-viewport">
              {renderCurrentView()}
            </div>
            <MobileBottomNav 
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onOpenSos={() => setIsSosModalOpen(true)}
            />
          </div>
        </div>
      ) : (
        <div className="main-layout">
          {/* Desktop Sidebar Navigation */}
          <Sidebar 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            counts={counts}
          />

          {/* Main Dynamic Content Area */}
          <main className="content-area">
            {renderCurrentView()}
          </main>

          {/* Fallback Mobile Bottom Nav on narrow viewports */}
          <MobileBottomNav 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onOpenSos={() => setIsSosModalOpen(true)}
          />
        </div>
      )}

      {/* Critical SOS 2-Step Confirmation Modal */}
      <SosModal 
        isOpen={isSosModalOpen}
        onClose={() => setIsSosModalOpen(false)}
        onSosSuccess={() => {
          loadAllData();
          setActiveTab('map');
        }}
      />

      {/* Multilingual Voice AI Assistant Modal */}
      <AiAssistantModal 
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        defaultLanguage={language}
      />
    </div>
  );
}
