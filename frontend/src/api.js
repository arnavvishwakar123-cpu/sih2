// api.js - Centralized API Service with Offline Fallback Caching

const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Helper to cache and retrieve data locally for offline resiliency
 */
function cacheLocally(key, data) {
  try {
    localStorage.setItem(`ndrp_cache_${key}`, JSON.stringify(data));
  } catch (e) {
    console.warn('Local storage cache failed:', e);
  }
}

function getLocalCache(key) {
  try {
    const cached = localStorage.getItem(`ndrp_cache_${key}`);
    return cached ? JSON.parse(cached) : null;
  } catch (e) {
    return null;
  }
}

async function fetchWithFallback(endpoint, cacheKey) {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const json = await res.json();
    cacheLocally(cacheKey, json);
    return { data: json, isOffline: false };
  } catch (err) {
    console.warn(`API call ${endpoint} failed, checking local offline cache:`, err.message);
    const cached = getLocalCache(cacheKey);
    if (cached) {
      return { data: cached, isOffline: true, offlineMessage: 'Serving cached offline data' };
    }
    throw err;
  }
}

export const api = {
  // System Health
  async getStatus() {
    try {
      const res = await fetch(`${API_BASE_URL}/status`);
      return await res.json();
    } catch (e) {
      return { status: 'OFFLINE_MODE', system: 'Disaster Management Platform (Local Cache)' };
    }
  },

  // Disasters & Alerts
  async getDisasters() {
    return fetchWithFallback('/disasters', 'disasters');
  },

  async getAlerts() {
    return fetchWithFallback('/alerts', 'alerts');
  },

  async createAlert(alertData) {
    const res = await fetch(`${API_BASE_URL}/alerts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(alertData)
    });
    return res.json();
  },

  // Incidents & SOS
  async getIncidents() {
    return fetchWithFallback('/incidents', 'incidents');
  },

  async reportIncident(incidentData) {
    try {
      const res = await fetch(`${API_BASE_URL}/incidents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(incidentData)
      });
      return await res.json();
    } catch (err) {
      // Offline queueing
      const queue = JSON.parse(localStorage.getItem('ndrp_offline_queue') || '[]');
      queue.push({ type: 'INCIDENT', data: incidentData, timestamp: new Date().toISOString() });
      localStorage.setItem('ndrp_offline_queue', JSON.stringify(queue));
      return {
        success: true,
        isQueuedOffline: true,
        message: 'Network offline. Incident report queued locally and will sync when connected.'
      };
    }
  },

  async triggerSos(sosData) {
    const res = await fetch(`${API_BASE_URL}/sos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sosData)
    });
    return res.json();
  },

  async updateIncidentStatus(id, status, assignedTeamId) {
    const res = await fetch(`${API_BASE_URL}/incidents/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, assignedTeamId })
    });
    return res.json();
  },

  // Rescue Teams
  async getRescueTeams() {
    return fetchWithFallback('/rescue-teams', 'rescue_teams');
  },

  async updateTeamLocation(id, lat, lng, status) {
    const res = await fetch(`${API_BASE_URL}/rescue-teams/${id}/location`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lat, lng, status })
    });
    return res.json();
  },

  // Shelters
  async getShelters() {
    return fetchWithFallback('/shelters', 'shelters');
  },

  async updateShelterOccupancy(id, delta) {
    const res = await fetch(`${API_BASE_URL}/shelters/${id}/occupancy`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ delta })
    });
    return res.json();
  },

  // Resources
  async getResources() {
    return fetchWithFallback('/resources', 'resources');
  },

  async updateResourceStock(id, stock) {
    const res = await fetch(`${API_BASE_URL}/resources/${id}/stock`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stock })
    });
    return res.json();
  },

  // Volunteers & Verification
  async getVolunteers() {
    return fetchWithFallback('/volunteers', 'volunteers');
  },

  async createVolunteer(volData) {
    const res = await fetch(`${API_BASE_URL}/volunteers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(volData)
    });
    return res.json();
  },

  async getVolunteerTasks() {
    return fetchWithFallback('/volunteer-tasks', 'volunteer_tasks');
  },

  async submitTaskProof(taskId, proofData) {
    const res = await fetch(`${API_BASE_URL}/volunteer-tasks/${taskId}/proof`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(proofData)
    });
    return res.json();
  },

  async verifyTask(taskId, coordinatorName) {
    const res = await fetch(`${API_BASE_URL}/volunteer-tasks/${taskId}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ coordinatorName })
    });
    return res.json();
  },

  // Risk & Recovery
  async getRiskAssessments() {
    return fetchWithFallback('/risk-assessments', 'risk_assessments');
  },

  async getRecoveryProgress() {
    return fetchWithFallback('/recovery', 'recovery');
  },

  // Feedback
  async getFeedback() {
    return fetchWithFallback('/feedback', 'feedback');
  },

  async submitFeedback(feedbackData) {
    const res = await fetch(`${API_BASE_URL}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(feedbackData)
    });
    return res.json();
  },

  // Route Optimization (Dijkstra)
  async getOptimizedRoute(startNode = 'BASE_NDRF', endNode = 'INC_RIVER', avoidBlocked = true) {
    const res = await fetch(`${API_BASE_URL}/routing/optimize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ startNode, endNode, avoidBlocked })
    });
    return res.json();
  },

  // AI Assistant Chat
  async queryAi(query, language = 'en') {
    const res = await fetch(`${API_BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, language })
    });
    return res.json();
  }
};
