# 🚨 DISASTER MANAGEMENT & EMERGENCY RESPONSE PLATFORM
### Smart India Hackathon (SIH) 2026 — Problem Statement ID: 26206
**Theme:** Student Innovation – Disaster Management | **Department:** AICTE, MIC

---

## 🌐 Platform Overview

The **Disaster Management & Emergency Response Platform** is an enterprise-grade civic technology and emergency operations ecosystem designed to unite **Citizens, Volunteers, Rescue Teams (NDRF/SDRF), and Emergency Operations Center (EOC) Coordinators** into one unified, real-time command network.

Unlike basic SOS prototypes, this platform covers the complete disaster lifecycle:
$$\textbf{BEFORE DISASTER} \longrightarrow \textbf{DURING DISASTER} \longrightarrow \textbf{AFTER DISASTER}$$

---

## 🏛️ Architecture & System Blueprint

```text
               DISASTER MANAGEMENT & EMERGENCY RESPONSE PLATFORM
                                     │
         ┌───────────────────────────┼───────────────────────────┐
         │                           │                           │
  BEFORE DISASTER             DURING DISASTER              AFTER DISASTER
  (Risk & Preparedness)       (Response & Triage)         (Recovery & Audit)
         │                           │                           │
  • Quantitative Risk         • Instant Priority SOS      • Closed-Loop Proof
    (H × E × V Engine)        • Live GIS Incident Map       Photo Verification
  • 4-Tier Early Warnings     • Dijkstra Safe Routing     • Infrastructure %
    (Blue, Yellow, Orange, Red) (Bypasses Submerged Roads)  Sector Restoration
  • Pre-positioned Rations    • Automated Unit Dispatch   • Direct Benefit Transfer
  • Shelter Preparation       • Multi-Tier Shelter Meter    (DBT) Relief Claims
  • Volunteer Readiness       • Multilingual Voice AI     • Citizen Response Audits
         │                           │                           │
         └───────────────────────────┼───────────────────────────┘
                                     │
                         CENTRALIZED DATA PLATFORM
                                     │
       ┌─────────────────┬───────────┴───────────┬─────────────────┐
       │                 │                       │                 │
 Citizens        Volunteer Force          Rescue Units        EOC Command
 (Web & Mobile)  (Proof Submission)       (Live GPS)          (Full Audit)
```

---

## ✨ Key Features Across the 3 Disaster Lifecycle Stages

### 1. 🛡️ BEFORE DISASTER (Preparedness & Risk Mitigation)
* **Quantitative Risk Engine:** Calculates real district risk ratings using:
  $$\text{Risk Score} = (40\% \times \text{Hazard}) + (35\% \times \text{Exposure}) + (25\% \times \text{Vulnerability})$$
* **4-Tier Early Warning Broadcast:**
  * 🔵 **Information (Blue):** Dam discharge bulletins and maritime advisories.
  * 🟡 **Advisory (Yellow):** Localized rainfall and precautionary slope warnings.
  * 🟠 **Warning (Orange):** Storm surge and wind damage warnings.
  * 🔴 **Critical (Red):** Mandatory riverbank and coastal evacuation orders.
* **Pre-Positioned Inventory Depot:** Monitors critical threshold buffers for food rations, potable water cans, Type-D oxygen cylinders, and inflatable rescue boats.

### 2. ⚡ DURING DISASTER (Response, SOS & Triage)
* **Instant Priority SOS Dispatch:** 2-step confirmation modal with GPS coordinate capture, automatic dispatch to the nearest available NDRF unit, and immediate display of closest shelter beds.
* **Interactive GIS Leaflet Map:** Full-screen spatial map displaying active disaster pins, shelters, hospitals, rescue units, and blocked road segments.
* **Dijkstra Safe Corridor Route Optimization:** Real-time graph routing that detects flooded arterial corridors (e.g. Guwahati Paltan Bazar corridor) and routes convoys via safe elevated bypasses with accurate travel time estimates.
* **Multilingual AI Assistant with Voice:** Dual-mode voice interaction (**🎙 Speak & 🔊 Listen**) supporting English, Hindi (हिंदी), and Marathi (मराठी) with verified NDMA protocols.

### 3. 🔄 AFTER DISASTER (Recovery & Accountability)
* **Closed-Loop Volunteer Proof Verification:** Volunteers cannot simply mark tasks "complete"—they must upload photographic evidence from the ground. Coordinators audit and formally close missions.
* **Civic Infrastructure Recovery Meters:** Tracks % restoration across power grids, drinking water sanitation, highway bridges, hospitals, and schools.
* **Direct Benefit Transfer (DBT) Relief Audit:** Tracks verified compensation claims and disbursed relief capital.
* **Citizen Feedback & Response Audits:** Post-relief ratings on response times and missing supply logs (e.g. baby formula, potable water).

---

## 📱 Mobile-First Experience vs. Desktop EOC

The platform includes a dedicated **Mobile App Simulator toggle** in the top navigation bar:
* **Desktop EOC Mode:** High-density command operations center with multi-column tables, Dijkstra controls, and GIS monitoring.
* **Mobile-First App Experience:** Phone frame with notch, thumb-friendly **bottom navigation (`Home`, `Map`, `Report`, `SOS`, `Operations`)**, large touch targets, one-hand operation, and quick SOS access.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | React 19 + Vite |
| **Design System** | Custom Clean Civic CSS (Emergency Blue `#0A4D94` + Pure White `#FFFFFF` + Critical Red `#DC2626`) |
| **GIS & Mapping** | Leaflet.js + OpenStreetMap |
| **Icons & Visuals** | Lucide React |
| **Backend Framework** | Node.js + Express (ES Modules) |
| **Routing Algorithm** | Dijkstra Graph Shortest-Path Engine |
| **Voice & Speech** | Web Speech API (Recognition + SpeechSynthesis) |
| **Database & Persistence** | Dual-tier Memory + JSON persistence with Indian disaster datasets |

---

## 🚀 How to Run the Platform

### Option 1: One-Click Windows Launcher
Double-click [`START_PLATFORM.bat`](./START_PLATFORM.bat) or run in PowerShell:
```powershell
.\START_PLATFORM.ps1
```

### Option 2: Manual Terminal Startup

#### 1. Start the Backend API (Port 5000)
```bash
cd backend
npm install
npm start
```
*Backend runs at: `http://localhost:5000`*

#### 2. Start the Frontend (Port 5173)
In a second terminal:
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs at: `http://localhost:5173`*

---

## 📞 National Emergency Contacts Configured

* 🚨 **National Emergency Helpline:** `112`
* 🚒 **NDRF Control Room:** `011-24363260`
* 🚑 **Medical / Paramedic:** `108`
* ⚠️ **District Disaster Helpline:** `1077`
