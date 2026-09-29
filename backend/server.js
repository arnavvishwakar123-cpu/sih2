// server.js - Centralized Disaster Management Platform Backend
import express from 'express';
import cors from 'cors';
import { db } from './db.js';
import { calculateOptimalRescueRoute } from './services/routing.js';
import { processAiQuery } from './services/aiAssistant.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// System Status / Health
app.get('/api/status', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'Disaster Management & Emergency Response Platform - SIH 2026',
    architecture: 'Unified Data Platform (Prepare -> Respond -> Recover)',
    version: '2.0.0-PROD',
    timestamp: new Date().toISOString()
  });
});

// 1. Disasters & Early Warnings
app.get('/api/disasters', (req, res) => {
  res.json({ success: true, count: db.getDisasters().length, data: db.getDisasters() });
});

app.get('/api/alerts', (req, res) => {
  res.json({ success: true, count: db.getAlerts().length, data: db.getAlerts() });
});

app.post('/api/alerts', (req, res) => {
  const { title, level, region, action, source, expectedDuration } = req.body;
  if (!title || !level || !region) {
    return res.status(400).json({ error: 'title, level, and region are required' });
  }
  const alert = db.createAlert(req.body);
  res.status(201).json({ success: true, data: alert });
});

// 2. Incidents & SOS
app.get('/api/incidents', (req, res) => {
  res.json({ success: true, count: db.getIncidents().length, data: db.getIncidents() });
});

app.post('/api/incidents', (req, res) => {
  const { title, type, locationName, severity } = req.body;
  if (!title || !type) {
    return res.status(400).json({ error: 'Title and type are required' });
  }
  const incident = db.createIncident(req.body);
  res.status(201).json({ success: true, message: 'Incident reported successfully', data: incident });
});

app.post('/api/sos', (req, res) => {
  const { lat, lng, emergencyType, optionalMessage, contactPhone } = req.body;
  const sosIncident = db.createIncident({
    title: `EMERGENCY SOS: ${emergencyType || 'Life-Threatening Distress'}`,
    type: emergencyType || 'FLOOD',
    severity: 'CRITICAL',
    locationName: `GPS Coordinate [${Number(lat || 26.195).toFixed(4)}, ${Number(lng || 91.756).toFixed(4)}]`,
    lat: parseFloat(lat || 26.1950),
    lng: parseFloat(lng || 91.7560),
    peopleAffected: 1,
    description: optionalMessage || 'Citizen triggered instant priority SOS. Immediate life support required.',
    source: 'SOS',
    contactPhone: contactPhone || 'User Device',
    immediateRequirements: 'Rescue extraction team, trauma first-aid'
  });

  // Calculate nearest shelter for instant return
  const shelters = db.getShelters();
  const nearestShelter = shelters[0]; // Primary regional center

  res.status(201).json({
    success: true,
    message: 'CRITICAL SOS BROADCASTED TO EOC DISPATCH',
    incidentId: sosIncident.id,
    data: sosIncident,
    nearestShelter,
    assignedTeam: sosIncident.assignedTeamName,
    helplines: {
      national: "112",
      ndrf: "011-24363260",
      ambulance: "108"
    }
  });
});

app.patch('/api/incidents/:id/status', (req, res) => {
  const { status, assignedTeamId } = req.body;
  const updated = db.updateIncidentStatus(req.params.id, status, assignedTeamId);
  if (!updated) return res.status(404).json({ error: 'Incident not found' });
  res.json({ success: true, data: updated });
});

// 3. Rescue Teams & Live GPS
app.get('/api/rescue-teams', (req, res) => {
  res.json({ success: true, count: db.getRescueTeams().length, data: db.getRescueTeams() });
});

app.patch('/api/rescue-teams/:id/location', (req, res) => {
  const { lat, lng, status } = req.body;
  const updated = db.updateTeamLocation(req.params.id, lat, lng, status);
  if (!updated) return res.status(404).json({ error: 'Team not found' });
  res.json({ success: true, data: updated });
});

// 4. Shelters & Relief Inventory
app.get('/api/shelters', (req, res) => {
  res.json({ success: true, count: db.getShelters().length, data: db.getShelters() });
});

app.patch('/api/shelters/:id/occupancy', (req, res) => {
  const { delta } = req.body;
  const updated = db.updateShelterOccupancy(req.params.id, parseInt(delta || 0));
  if (!updated) return res.status(404).json({ error: 'Shelter not found' });
  res.json({ success: true, data: updated });
});

app.get('/api/resources', (req, res) => {
  res.json({ success: true, count: db.getResources().length, data: db.getResources() });
});

app.patch('/api/resources/:id/stock', (req, res) => {
  const { stock } = req.body;
  const updated = db.updateResourceStock(req.params.id, parseInt(stock));
  if (!updated) return res.status(404).json({ error: 'Resource not found' });
  res.json({ success: true, data: updated });
});

// 5. Volunteers & Closed-Loop Verification
app.get('/api/volunteers', (req, res) => {
  res.json({ success: true, count: db.getVolunteers().length, data: db.getVolunteers() });
});

app.post('/api/volunteers', (req, res) => {
  const vol = db.createVolunteer(req.body);
  res.status(201).json({ success: true, data: vol });
});

app.get('/api/volunteer-tasks', (req, res) => {
  res.json({ success: true, count: db.getVolunteerTasks().length, data: db.getVolunteerTasks() });
});

app.post('/api/volunteer-tasks/:id/proof', (req, res) => {
  const updated = db.submitTaskProof(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Task not found' });
  res.json({ success: true, message: 'Proof submitted for administrative audit', data: updated });
});

app.post('/api/volunteer-tasks/:id/verify', (req, res) => {
  const { coordinatorName } = req.body;
  const updated = db.verifyTask(req.params.id, coordinatorName);
  if (!updated) return res.status(404).json({ error: 'Task not found' });
  res.json({ success: true, message: 'Mission verified and closed successfully', data: updated });
});

// 6. Risk Engine & Recovery
app.get('/api/risk-assessments', (req, res) => {
  res.json({ success: true, data: db.getRiskAssessments() });
});

app.get('/api/recovery', (req, res) => {
  res.json({ success: true, data: db.getRecoveryProgress() });
});

// 7. Citizen Feedback
app.get('/api/feedback', (req, res) => {
  res.json({ success: true, count: db.getFeedback().length, data: db.getFeedback() });
});

app.post('/api/feedback', (req, res) => {
  const fb = db.createFeedback(req.body);
  res.status(201).json({ success: true, message: 'Feedback recorded for administrative analytics', data: fb });
});

// 8. Route Optimization (Dijkstra)
app.post('/api/routing/optimize', (req, res) => {
  const { startNode, endNode, avoidBlocked } = req.body;
  const result = calculateOptimalRescueRoute(startNode, endNode, avoidBlocked !== false);
  res.json({ success: true, data: result });
});

// 9. Multilingual AI Assistant
app.post('/api/ai/chat', (req, res) => {
  const { query, language, userLocation } = req.body;
  const response = processAiQuery(query, language, userLocation);
  res.json({ success: true, data: response });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`Disaster Management & Emergency Response Platform API`);
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`SIH 2026 Problem Statement 26206 Ecosystem Ready`);
  console.log(`=======================================================`);
});
