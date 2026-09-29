// CitizenFeedbackView.jsx - Citizen Feedback Loop & Response Time Audits
import React, { useState } from 'react';
import { 
  MessageSquare, 
  Star, 
  CheckCircle2, 
  Clock, 
  Send, 
  AlertCircle 
} from 'lucide-react';
import { api } from '../api';

export default function CitizenFeedbackView({ feedbackList = [], onRefreshData }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: 'Guwahati, Assam',
    incidentId: 'INC-8091',
    helpReceived: 'YES',
    responseTimeMinutes: 30,
    rating: 5,
    comments: '',
    missingResources: 'Clean bottled water pouches'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.submitFeedback(formData);
      setSubmitted(true);
      if (onRefreshData) onRefreshData();
    } catch (e) {
      alert('Error submitting feedback: ' + e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--blue-navy)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MessageSquare size={22} color="var(--blue-primary)" />
          Citizen Relief Experience & Accountability Feedback
        </h2>
        <p style={{ fontSize: '12px', color: 'var(--text-light)' }}>
          Transparent Quality Audit • Response Speed Tracking • Resource Supply Gap Reporting
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        {/* Left: Feedback Form */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              Submit Your Relief Evaluation
            </h3>
          </div>

          {submitted ? (
            <div style={{ padding: '30px 16px', textAlign: 'center' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <CheckCircle2 size={30} />
              </div>
              <h4 style={{ fontSize: '16px', fontWeight: '700' }}>Thank You for Your Feedback</h4>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '6px 0 16px' }}>
                Your response helps National Disaster Operations Command evaluate rescue unit speed and supply logistics.
              </p>
              <button className="btn btn-secondary" onClick={() => setSubmitted(false)}>
                Submit Another Feedback
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Citizen Name / Representative *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  required
                  placeholder="e.g. Hemanta Kalita"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Contact Phone</label>
                  <input 
                    type="tel" 
                    className="form-input" 
                    placeholder="+91-94350-XXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Was Emergency Help Received?</label>
                  <select 
                    className="form-select"
                    value={formData.helpReceived}
                    onChange={(e) => setFormData({ ...formData, helpReceived: e.target.value })}
                  >
                    <option value="YES">YES - Timely Relief Received</option>
                    <option value="PARTIAL">PARTIAL - Needed More Support</option>
                    <option value="NO">NO - Still Awaiting Assistance</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Approx Response Time (Minutes)</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    value={formData.responseTimeMinutes}
                    onChange={(e) => setFormData({ ...formData, responseTimeMinutes: parseInt(e.target.value || 0) })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Overall Rating (1 - 5 Stars)</label>
                  <select 
                    className="form-select"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                  >
                    <option value="5">⭐⭐⭐⭐⭐ 5 Stars (Outstanding)</option>
                    <option value="4">⭐⭐⭐⭐ 4 Stars (Good)</option>
                    <option value="3">⭐⭐⭐ 3 Stars (Satisfactory)</option>
                    <option value="2">⭐⭐ 2 Stars (Delayed)</option>
                    <option value="1">⭐ 1 Star (Unsatisfactory)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Missing Essential Resources (if any)</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Baby formula, insulin, drinking water"
                  value={formData.missingResources}
                  onChange={(e) => setFormData({ ...formData, missingResources: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Ground Experience Comments</label>
                <textarea 
                  className="form-textarea" 
                  rows="2"
                  placeholder="Share details on responder behavior, shelter conditions, or convoy access..."
                  value={formData.comments}
                  onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ width: '100%' }}>
                <Send size={15} /> Submit Accountability Audit
              </button>
            </form>
          )}
        </div>

        {/* Right: Public Community Audit Feed */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              Recorded Citizen Feedback Logs ({feedbackList.length})
            </h3>
            <span className="badge badge-safe">Verified Submissions</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '480px', overflowY: 'auto' }}>
            {feedbackList.map((fb) => (
              <div 
                key={fb.id}
                style={{
                  padding: '14px',
                  borderRadius: '8px',
                  background: 'var(--bg-muted)',
                  border: '1px solid var(--border-light)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <div style={{ fontWeight: '700', fontSize: '13.5px', color: 'var(--text-main)' }}>
                    {fb.name}
                  </div>
                  <div style={{ color: '#D97706', fontSize: '12px' }}>
                    {'★'.repeat(fb.rating)}{'☆'.repeat(5 - fb.rating)}
                  </div>
                </div>

                <div style={{ fontSize: '11px', color: 'var(--text-light)', marginBottom: '8px' }}>
                  📍 {fb.location} • Response Time: <strong>{fb.responseTimeMinutes} mins</strong>
                </div>

                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  "{fb.comments}"
                </div>

                {fb.missingResources && (
                  <div style={{ fontSize: '11px', color: '#B45309', background: '#FEF3C7', padding: '4px 8px', borderRadius: '4px' }}>
                    ⚠️ Highlighted Supply Need: <strong>{fb.missingResources}</strong>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
