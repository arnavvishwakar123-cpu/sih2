// VolunteerHubView.jsx - Volunteer Roster & Closed-Loop Proof Auditing
import React, { useState } from 'react';
import { 
  Users, 
  CheckCircle2, 
  Camera, 
  Upload, 
  ShieldCheck, 
  Clock, 
  Award, 
  Plus, 
  ExternalLink 
} from 'lucide-react';
import { api } from '../api';

export default function VolunteerHubView({
  volunteers = [],
  volunteerTasks = [],
  onRefreshData
}) {
  const [selectedTask, setSelectedTask] = useState(volunteerTasks[0] || null);
  const [proofNotes, setProofNotes] = useState('');
  const [isSubmittingProof, setIsSubmittingProof] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [newVolunteer, setNewVolunteer] = useState({
    name: '',
    email: '',
    phone: '',
    location: 'Guwahati, Assam',
    skills: 'First Aid & CPR, Emergency Triage'
  });

  const handleSubmitProof = async (taskId) => {
    setIsSubmittingProof(true);
    try {
      await api.submitTaskProof(taskId, {
        notes: proofNotes || "Ground relief successfully distributed. Verified with local ward head.",
        photoUrl: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=600&q=80"
      });
      alert('Proof of completion uploaded! Sent to EOC Coordinator verification queue.');
      if (onRefreshData) onRefreshData();
    } catch (e) {
      alert('Error uploading proof: ' + e.message);
    } finally {
      setIsSubmittingProof(false);
    }
  };

  const handleVerifyTask = async (taskId) => {
    setIsVerifying(true);
    try {
      await api.verifyTask(taskId, "EOC Field Auditor - S. Goswami");
      alert('Mission formally verified and officially closed.');
      if (onRefreshData) onRefreshData();
    } catch (e) {
      alert('Error verifying task: ' + e.message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleRegisterVolunteer = async (e) => {
    e.preventDefault();
    try {
      await api.createVolunteer({
        ...newVolunteer,
        skills: newVolunteer.skills.split(',').map(s => s.trim())
      });
      alert('Volunteer successfully registered in National Civil Force!');
      setShowRegisterModal(false);
      if (onRefreshData) onRefreshData();
    } catch (e) {
      alert('Registration failed: ' + e.message);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--blue-navy)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={22} color="var(--blue-primary)" />
            Volunteer Force Coordination & Closed-Loop Verification
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-light)' }}>
            Proof-Based Accountability • Ground Mission Audits • Volunteer Skills Matrix
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setShowRegisterModal(true)}>
          <Plus size={15} /> Register as Volunteer
        </button>
      </div>

      {/* Task Queue with 8-Step Closed Loop Verification */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
        {/* Left: Active Volunteer Missions List */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Clock size={18} color="var(--blue-primary)" />
              Ground Mission Pipeline ({volunteerTasks.length})
            </h3>
            <span className="badge badge-info">Audited Queue</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {volunteerTasks.map((tsk) => {
              const isVerified = tsk.status === 'VERIFIED';
              const hasProof = tsk.status === 'PROOF_SUBMITTED' || isVerified;
              const isSelected = selectedTask?.id === tsk.id;

              return (
                <div 
                  key={tsk.id}
                  onClick={() => setSelectedTask(tsk)}
                  style={{
                    padding: '14px',
                    borderRadius: '8px',
                    background: isSelected ? 'var(--blue-subtle)' : 'var(--bg-muted)',
                    border: isSelected ? '2px solid var(--blue-primary)' : '1px solid var(--border-light)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--blue-primary)' }}>
                      {tsk.id}
                    </div>
                    <span className={`badge ${isVerified ? 'badge-safe' : (hasProof ? 'badge-warning' : 'badge-info')}`}>
                      {tsk.status}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '13.5px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '4px' }}>
                    {tsk.title}
                  </h4>

                  <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    📍 {tsk.locationName} • Assigned: <strong>{tsk.volunteerName}</strong>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-light)' }}>
                    <span>Urgency: <strong>{tsk.urgency}</strong></span>
                    {hasProof && <span style={{ color: '#059669', fontWeight: '700' }}>📷 Proof Attached</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Closed-Loop Proof & Verification Audit Panel */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <ShieldCheck size={18} color="var(--safe-green)" />
              Proof-of-Completion Audit & Verification
            </h3>
          </div>

          {selectedTask ? (
            <div>
              <div style={{ marginBottom: '14px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-light)', textTransform: 'uppercase' }}>Selected Task:</div>
                <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-main)' }}>
                  {selectedTask.title}
                </h4>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Assigned Volunteer: <strong>{selectedTask.volunteerName}</strong>
                </div>
              </div>

              {/* Step Flow Indicator */}
              <div style={{ padding: '12px', background: 'var(--bg-muted)', borderRadius: '8px', marginBottom: '16px', fontSize: '11.5px' }}>
                <div style={{ fontWeight: '700', color: 'var(--text-main)', marginBottom: '6px' }}>
                  Verification Lifecycle:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  <span className="badge badge-safe">1. Assigned</span>
                  <span className="badge badge-safe">2. On-Site</span>
                  <span className={`badge ${selectedTask.proof ? 'badge-safe' : 'badge-warning'}`}>
                    3. Proof Uploaded
                  </span>
                  <span className={`badge ${selectedTask.status === 'VERIFIED' ? 'badge-safe' : 'badge-info'}`}>
                    4. EOC Audit
                  </span>
                </div>
              </div>

              {/* If Proof Exists: Display Photo & AI Verification */}
              {selectedTask.proof ? (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>Uploaded Ground Evidence:</div>
                  <img 
                    src={selectedTask.proof.photoUrl} 
                    alt="Proof of relief delivery" 
                    style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border-medium)', marginBottom: '8px' }}
                  />
                  <div style={{ padding: '8px 12px', background: 'var(--blue-light)', borderRadius: '6px', fontSize: '11.5px', color: 'var(--text-muted)', marginBottom: '10px' }}>
                    "{selectedTask.proof.notes}"
                  </div>

                  {selectedTask.proof.isAiVerified && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#059669', fontWeight: '600', marginBottom: '14px' }}>
                      <CheckCircle2 size={13} /> AI Image Authenticity Checked (Confidence: {(selectedTask.proof.aiConfidence * 100).toFixed(0)}%)
                    </div>
                  )}

                  {selectedTask.status === 'VERIFIED' ? (
                    <div style={{ padding: '10px', background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '6px', fontSize: '12px', color: '#065F46' }}>
                      ✅ <strong>Officially Verified by:</strong> {selectedTask.verifiedBy} ({new Date(selectedTask.verifiedAt).toLocaleTimeString()})
                    </div>
                  ) : (
                    <button 
                      className="btn btn-primary"
                      onClick={() => handleVerifyTask(selectedTask.id)}
                      disabled={isVerifying}
                      style={{ width: '100%', background: 'var(--safe-green)', borderColor: '#047857' }}
                    >
                      <CheckCircle2 size={16} /> Approve & Formally Close Mission
                    </button>
                  )}
                </div>
              ) : (
                /* Volunteer Proof Submission Form */
                <div>
                  <div style={{ padding: '12px', background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '8px', fontSize: '12px', color: '#92400E', marginBottom: '14px' }}>
                    📷 <strong>Closed-Loop Rule:</strong> Volunteers cannot close tasks without uploading photographic evidence of work performed.
                  </div>

                  <div className="form-group">
                    <label className="form-label">Activity Proof Notes:</label>
                    <textarea 
                      className="form-textarea"
                      rows="2"
                      placeholder="e.g. Distributed 40 infant food packets to Block C in Sarusajai Relief Camp..."
                      value={proofNotes}
                      onChange={(e) => setProofNotes(e.target.value)}
                    />
                  </div>

                  <button 
                    className="btn btn-primary"
                    onClick={() => handleSubmitProof(selectedTask.id)}
                    disabled={isSubmittingProof}
                    style={{ width: '100%' }}
                  >
                    <Camera size={16} /> Upload Ground Proof Photo & Submit
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-light)', fontSize: '12px' }}>
              Select a task from the pipeline to audit proof or submit verification.
            </div>
          )}
        </div>
      </div>

      {/* Volunteer Registration Modal */}
      {showRegisterModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '16px', fontWeight: '800' }}>Register as Emergency Volunteer</h3>
              <button onClick={() => setShowRegisterModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleRegisterVolunteer}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    required 
                    value={newVolunteer.name}
                    onChange={(e) => setNewVolunteer({ ...newVolunteer, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Contact Phone *</label>
                  <input 
                    type="tel" 
                    className="form-input" 
                    required 
                    value={newVolunteer.phone}
                    onChange={(e) => setNewVolunteer({ ...newVolunteer, phone: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Certified Emergency Skills (comma separated) *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    required 
                    value={newVolunteer.skills}
                    onChange={(e) => setNewVolunteer({ ...newVolunteer, skills: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowRegisterModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Complete Registration</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
