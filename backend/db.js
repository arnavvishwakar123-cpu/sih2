// db.js - Unified In-Memory & File-Persisted Database Layer
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'data.json');

// Default initial state adhering strictly to NDMA/SDMA standards with realistic Indian context
const initialData = {
  disasters: [
    {
      id: "DIS-001",
      title: "Brahmaputra River Inundation & Flash Flood",
      category: "FLOOD",
      severity: "CRITICAL",
      state: "Assam",
      districts: ["Kamrup Metropolitan", "Morigaon", "Dhemaji"],
      affectedPopulation: 245000,
      status: "ACTIVE",
      lat: 26.1445,
      lng: 91.7362,
      updatedAt: new Date().toISOString(),
      summary: "Severe flooding across low-lying riparian belts due to torrential monsoon rainfall. Over 45 relief camps operational."
    },
    {
      id: "DIS-002",
      title: "Severe Cyclonic Storm 'Dana' - Coastal Impact",
      category: "CYCLONE",
      severity: "WARNING",
      state: "Odisha / West Bengal",
      districts: ["Kendrapara", "Bhadrak", "Puri"],
      affectedPopulation: 180000,
      status: "ACTIVE",
      lat: 20.2961,
      lng: 85.8245,
      updatedAt: new Date().toISOString(),
      summary: "Deep depression intensified into severe cyclonic storm. Gusts up to 115 km/h. Coastal evacuations in progress."
    },
    {
      id: "DIS-003",
      title: "Chamoli High-Altitude Slope & Debris Slide",
      category: "LANDSLIDE",
      severity: "HIGH",
      state: "Uttarakhand",
      districts: ["Chamoli", "Rudraprayag"],
      affectedPopulation: 12500,
      status: "MONITORING",
      lat: 30.4244,
      lng: 79.3308,
      updatedAt: new Date().toISOString(),
      summary: "National Highway 7 blocked due to debris slide near Joshimath bypass. SDRF clearing convoy routes."
    },
    {
      id: "DIS-004",
      title: "Wayanad Slope Saturation Early Warning",
      category: "LANDSLIDE",
      severity: "ADVISORY",
      state: "Kerala",
      districts: ["Wayanad", "Idukki"],
      affectedPopulation: 34000,
      status: "ADVISORY",
      lat: 11.6854,
      lng: 76.1320,
      updatedAt: new Date().toISOString(),
      summary: "Continuous heavy precipitations exceeding 180mm threshold. Soil saturation sensors indicate localized movement risk."
    }
  ],
  alerts: [
    {
      id: "ALT-101",
      level: "CRITICAL", // CRITICAL (Red)
      title: "Mandatory Riverbank Evacuation Order",
      region: "Guwahati Riparian Zones & Morigaon",
      startTime: "Today, 06:00 IST",
      expectedDuration: "48 Hours",
      source: "Central Water Commission (CWC) & SDMA",
      action: "Move immediately to marked elevated school relief shelters. Avoid national highway bypasses.",
      lat: 26.1850,
      lng: 91.7500,
      createdAt: new Date().toISOString()
    },
    {
      id: "ALT-102",
      level: "WARNING", // WARNING (Orange)
      title: "Storm Surge & High-Wind Warning",
      region: "Coastal Odisha (Kendrapara, Dhamra)",
      startTime: "Today, 12:00 IST",
      expectedDuration: "24 Hours",
      source: "India Meteorological Department (IMD)",
      action: "Total suspension of fishing operations. Secure rooftop infrastructure and stay within cyclone shelters.",
      lat: 20.7900,
      lng: 86.8500,
      createdAt: new Date().toISOString()
    },
    {
      id: "ALT-103",
      level: "ADVISORY", // ADVISORY (Yellow)
      title: "Landslide Risk on NH-58",
      region: "Rishikesh-Badrinath Highway Sector",
      startTime: "Yesterday, 18:00 IST",
      expectedDuration: "72 Hours",
      source: "Border Roads Organisation (BRO)",
      action: "Night driving restricted. Heavy cargo vehicles must divert via Dehradun bypass.",
      lat: 30.1500,
      lng: 78.4000,
      createdAt: new Date().toISOString()
    },
    {
      id: "ALT-104",
      level: "INFORMATION", // INFORMATION (Blue)
      title: "Controlled Dam Sluice Gate Water Release",
      region: "Hirakud Reservoir Downstream",
      startTime: "Today, 09:30 IST",
      expectedDuration: "12 Hours",
      source: "Water Resources Department",
      action: "Normal regulated discharge of 8 sluice gates. Local villagers alerted to avoid cattle grazing near banks.",
      lat: 21.5200,
      lng: 83.8700,
      createdAt: new Date().toISOString()
    }
  ],
  incidents: [
    {
      id: "INC-8091",
      title: "Cattle and 18 Villagers Stranded on River Islet",
      type: "FLOOD",
      severity: "CRITICAL",
      locationName: "Uzan Bazar Ghat, Guwahati",
      lat: 26.1950,
      lng: 91.7560,
      peopleAffected: 18,
      injuries: 2,
      description: "Flood water breached mud embankment at 04:30 AM. 18 residents including 4 children cut off on elevated platform with no drinking water.",
      immediateRequirements: "Inflatable motor boat, clean drinking water pouches, life jackets.",
      status: "ASSIGNED", // NEW, VERIFIED, PRIORITY, ASSIGNED, EN_ROUTE, ON_SITE, RESOLVED, CLOSED
      assignedTeamId: "TEAM-01",
      assignedTeamName: "NDRF 1st Battalion - Squad Alpha",
      source: "SOS",
      reportedAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
      aiAnalysis: {
        classification: "Severe Riparian Inundation",
        confidence: 0.96,
        urgencyScore: 94,
        suggestedAction: "Immediate deployment of inflatable deep-draft rescue vessel.",
        isAiGenerated: true
      }
    },
    {
      id: "INC-8092",
      title: "Rockfall and Soil Subsidence near Hospital Access Road",
      type: "LANDSLIDE",
      severity: "PRIORITY",
      locationName: "Joshimath Sub-District Hospital Approach",
      lat: 30.5560,
      lng: 79.5680,
      peopleAffected: 45,
      injuries: 0,
      description: "Debris blocking ambulance artery. Electricity pole tilted over roadway.",
      immediateRequirements: "Earthmover/excavator, power grid safety cutoff team.",
      status: "EN_ROUTE",
      assignedTeamId: "TEAM-03",
      assignedTeamName: "SDRF High-Altitude Quick Response",
      source: "USER_REPORTED",
      reportedAt: new Date(Date.now() - 75 * 60 * 1000).toISOString(),
      aiAnalysis: {
        classification: "Infrastructure Arterial Obstruction",
        confidence: 0.91,
        urgencyScore: 82,
        suggestedAction: "Clear ambulance lane first; divert civilian traffic to Valley Bypass.",
        isAiGenerated: true
      }
    },
    {
      id: "INC-8093",
      title: "Tin Roof Collapse and Waterlogging in Community Primary School",
      type: "CYCLONE",
      severity: "VERIFIED",
      locationName: "Bhadrak Coastal Settlement",
      lat: 21.0580,
      lng: 86.5050,
      peopleAffected: 32,
      injuries: 4,
      description: "Severe wind gust ripped partial tin roof. 32 evacuated citizens moved to inner concrete hallway.",
      immediateRequirements: "Tarpaulins, emergency first-aid kit, battery lanterns.",
      status: "NEW",
      assignedTeamId: null,
      source: "USER_REPORTED",
      reportedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      aiAnalysis: {
        classification: "Storm Structural Compromise",
        confidence: 0.88,
        urgencyScore: 78,
        suggestedAction: "Dispatch local volunteer relief unit with waterproof plastic sheets.",
        isAiGenerated: true
      }
    },
    {
      id: "INC-8094",
      title: "Urban Basement Electrical Sparking under Knee-Deep Inundation",
      type: "FIRE_HAZARD",
      severity: "PRIORITY",
      locationName: "Dispur Capital Complex Area",
      lat: 26.1410,
      lng: 91.7900,
      peopleAffected: 120,
      injuries: 1,
      description: "Transformer sparking with knee deep rainwater outside commercial complex. Panic among residents.",
      immediateRequirements: "Electricity board emergency isolation, fire brigade stand-by.",
      status: "ON_SITE",
      assignedTeamId: "TEAM-04",
      assignedTeamName: "State Fire & Emergency Services Wing",
      source: "USER_REPORTED",
      reportedAt: new Date(Date.now() - 110 * 60 * 1000).toISOString(),
      aiAnalysis: {
        classification: "Electrocution and Hazardous Fire Risk",
        confidence: 0.98,
        urgencyScore: 91,
        suggestedAction: "Immediate remote grid cut-off before wading rescue.",
        isAiGenerated: true
      }
    }
  ],
  rescueTeams: [
    {
      id: "TEAM-01",
      name: "NDRF 1st Battalion - Squad Alpha",
      agency: "NDRF",
      status: "EN_ROUTE", // AVAILABLE, DISPATCHED, EN_ROUTE, ON_SITE, RETURNING, UNAVAILABLE
      teamLead: "Inspector R. K. Bora",
      contact: "+91-94350-11201",
      personnelCount: 22,
      specialization: "Flood Rescue & Deep Water Extraction",
      equipment: ["2 Inflatable Motor Boats (IRB)", "Sonar Depth Scanner", "Underwater Cutters", "Medical First Responder Kit"],
      currentLat: 26.1750,
      lng: 91.7450,
      assignedIncidentId: "INC-8091",
      lastUpdated: new Date().toISOString()
    },
    {
      id: "TEAM-02",
      name: "NDRF 4th Battalion - Coastal Squad",
      agency: "NDRF",
      status: "AVAILABLE",
      teamLead: "Assistant Commandant S. Patra",
      contact: "+91-94370-44202",
      personnelCount: 30,
      specialization: "Cyclone & Structural Collapse Search",
      equipment: ["Heavy Debris Breakers", "Hydraulic Spreader", "Satellite SatPhone", "Emergency Lighting Towers"],
      currentLat: 20.3000,
      lng: 85.8350,
      assignedIncidentId: null,
      lastUpdated: new Date().toISOString()
    },
    {
      id: "TEAM-03",
      name: "SDRF High-Altitude Quick Response",
      agency: "SDRF",
      status: "EN_ROUTE",
      teamLead: "Sub-Inspector Manoj Rawat",
      contact: "+91-94120-33203",
      personnelCount: 16,
      specialization: "Mountain & Landslide Search and Rescue",
      equipment: ["Mountain Rope Traversing Gear", "Thermal Drones", "GPS Locator Beacons", "Portable Stretcher Systems"],
      currentLat: 30.5350,
      lng: 79.5420,
      assignedIncidentId: "INC-8092",
      lastUpdated: new Date().toISOString()
    },
    {
      id: "TEAM-04",
      name: "State Fire & Emergency Services Wing",
      agency: "SFES",
      status: "ON_SITE",
      teamLead: "Station Officer N. Das",
      contact: "+91-94355-66204",
      personnelCount: 14,
      specialization: "Urban Fire & Electrical Hazard Mitigation",
      equipment: ["Foam Tender", "High-Pressure Submersible Pumps", "Chemical Suits", "Insulated Cutting Tools"],
      currentLat: 26.1415,
      lng: 91.7910,
      assignedIncidentId: "INC-8094",
      lastUpdated: new Date().toISOString()
    },
    {
      id: "TEAM-05",
      name: "Indian Coast Guard Air Enclave Squad",
      agency: "Coast Guard",
      status: "AVAILABLE",
      teamLead: "Dy Commandant V. Nair",
      contact: "+91-94440-77205",
      personnelCount: 12,
      specialization: "Maritime & Airdrop Relief Operations",
      equipment: ["Chetak Helicopter Liaison", "Life Raft Cannisters", "Winch Harnesses", "Emergency Food Drops"],
      currentLat: 20.2500,
      lng: 85.8000,
      assignedIncidentId: null,
      lastUpdated: new Date().toISOString()
    }
  ],
  shelters: [
    {
      id: "SHL-01",
      name: "Sarusajai Regional Relief Center",
      location: "Guwahati, Assam",
      lat: 26.1150,
      lng: 91.7650,
      capacity: 800,
      occupied: 540,
      available: 260,
      contact: "+91-361-2299110",
      inCharge: "Dr. P. Goswami",
      medicalSupport: "Full Medical Camp (2 Doctors + 4 Paramedics)",
      foodAvailability: "High (Community Kitchen Active)",
      waterAvailability: "Adequate (RO Tanker Connected)",
      accessibility: "Wheelchair accessible, Generator Backup"
    },
    {
      id: "SHL-02",
      name: "Kalinga Multi-Purpose Cyclone Shelter",
      location: "Cuttack Coastal Sector, Odisha",
      lat: 20.4625,
      lng: 85.8828,
      capacity: 1200,
      occupied: 890,
      available: 310,
      contact: "+91-671-2300445",
      inCharge: "Shri A. Mohanty",
      medicalSupport: "Field Clinic with Trauma Dressing",
      foodAvailability: "High (Ready-to-eat dry rations + warm meals)",
      waterAvailability: "High (Rainwater filtration + 10KL Tank)",
      accessibility: "Multi-level concrete reinforced design"
    },
    {
      id: "SHL-03",
      name: "Joshimath High School Emergency Camp",
      location: "Joshimath Upper Ridge, Uttarakhand",
      lat: 30.5500,
      lng: 79.5600,
      capacity: 450,
      occupied: 210,
      available: 240,
      contact: "+91-1389-222108",
      inCharge: "Smt. Kavita Negi",
      medicalSupport: "First Aid & Hypothermia Treatment Room",
      foodAvailability: "Adequate (Warm Dal-Rice + Tea Station)",
      waterAvailability: "Adequate (Boiled Natural Spring Water)",
      accessibility: "High-ground seismically assessed structure"
    },
    {
      id: "SHL-04",
      name: "Kozhikode Model Relief Shelter",
      location: "Kozhikode, Kerala",
      lat: 11.2588,
      lng: 75.7804,
      capacity: 600,
      occupied: 220,
      available: 380,
      contact: "+91-495-2371900",
      inCharge: "Mr. K. Narayanan",
      medicalSupport: "Pediatric and Geriatric Care Wing",
      foodAvailability: "High (Panchayat Food Council Supply)",
      waterAvailability: "High (Municipal pipeline + Chlorinated reserve)",
      accessibility: "Ramps, tactile guidance paths"
    }
  ],
  resources: [
    {
      id: "RES-01",
      item: "Emergency Meal Rations (Ready to Eat)",
      category: "Food",
      stock: 14200,
      unit: "packets",
      threshold: 5000,
      status: "SAFE",
      location: "Guwahati Central Depot",
      responsibleOrg: "Red Cross & Civil Supplies Dept",
      lastRestocked: "2026-09-28"
    },
    {
      id: "RES-02",
      item: "Potable Chlorinated Water Jerrycans (5L)",
      category: "Water",
      stock: 7800,
      unit: "cans",
      threshold: 3000,
      status: "SAFE",
      location: "Bhubaneswar Regional Godown",
      responsibleOrg: "Public Health Engineering Dept",
      lastRestocked: "2026-09-29"
    },
    {
      id: "RES-03",
      item: "Type-D High-Pressure Medical Oxygen Cylinders",
      category: "Medical",
      stock: 28,
      unit: "cylinders",
      threshold: 50,
      status: "CRITICAL_LOW", // Trigger low-stock warning
      location: "District Civil Hospital Store",
      responsibleOrg: "National Health Mission (NHM)",
      lastRestocked: "2026-09-25"
    },
    {
      id: "RES-04",
      item: "First Aid & Trauma Surgical Kits",
      category: "Medical",
      stock: 460,
      unit: "kits",
      threshold: 200,
      status: "SAFE",
      location: "Dehradun SDRF Supply Base",
      responsibleOrg: "Armed Forces Medical Depot",
      lastRestocked: "2026-09-27"
    },
    {
      id: "RES-05",
      item: "Thermal Windproof Emergency Blankets",
      category: "Relief",
      stock: 3100,
      unit: "units",
      threshold: 1500,
      status: "SAFE",
      location: "Joshimath Sub-Depot",
      responsibleOrg: "Disaster Mitigation Cell",
      lastRestocked: "2026-09-26"
    },
    {
      id: "RES-06",
      item: "Inflatable Motor Rescue Boats (IRB)",
      category: "Equipment",
      stock: 6,
      unit: "boats",
      threshold: 10,
      status: "LOW",
      location: "Guwahati Brahmaputra Pier",
      responsibleOrg: "Inland Waterways Authority",
      lastRestocked: "2026-09-22"
    },
    {
      id: "RES-07",
      item: "Emergency Universal Blood Units (O-, B-)",
      category: "Medical",
      stock: 34,
      unit: "units",
      threshold: 60,
      status: "CRITICAL_LOW",
      location: "Regional Blood Transfusion Center",
      responsibleOrg: "Red Cross Blood Bank",
      lastRestocked: "2026-09-28"
    }
  ],
  volunteers: [
    {
      id: "VOL-501",
      name: "Pooja Sharma",
      email: "pooja.sharma@volunteer.in",
      phone: "+91-98765-43210",
      skills: ["First Aid & CPR", "Elderly Care", "Hindi", "English"],
      availability: "ACTIVE_DUTY",
      location: "Guwahati, Assam",
      tasksCompleted: 14,
      rating: 4.9,
      currentTaskId: "TSK-301"
    },
    {
      id: "VOL-502",
      name: "Tenzing Norbu",
      email: "tenzing.n@volunteer.in",
      phone: "+91-98111-22334",
      skills: ["Search & Mountain Traversing", "Drone Piloting", "Hindi"],
      availability: "ACTIVE_DUTY",
      location: "Joshimath, Uttarakhand",
      tasksCompleted: 21,
      rating: 5.0,
      currentTaskId: "TSK-302"
    },
    {
      id: "VOL-503",
      name: "Debabrata Rout",
      email: "rout.d@volunteer.in",
      phone: "+91-97770-55443",
      skills: ["Food Distribution Logistics", "Odia", "English", "Driving"],
      availability: "AVAILABLE",
      location: "Cuttack, Odisha",
      tasksCompleted: 9,
      rating: 4.8,
      currentTaskId: null
    },
    {
      id: "VOL-504",
      name: "Ananya Iyer",
      email: "ananya.iyer@volunteer.in",
      phone: "+91-99880-12345",
      skills: ["Child Care & Counseling", "Triage Registration", "Marathi", "Hindi"],
      availability: "AVAILABLE",
      location: "Pune / Mumbai",
      tasksCompleted: 17,
      rating: 4.95,
      currentTaskId: null
    }
  ],
  volunteerTasks: [
    {
      id: "TSK-301",
      volunteerId: "VOL-501",
      volunteerName: "Pooja Sharma",
      title: "Deliver 40 Infant Nutrition Packs to Sarusajai Camp Block C",
      locationName: "Sarusajai Camp, Guwahati",
      urgency: "HIGH",
      status: "PROOF_SUBMITTED", // ASSIGNED, ACCEPTED, EN_ROUTE, ON_SITE, PROOF_SUBMITTED, VERIFIED, CLOSED
      assignedAt: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
      proof: {
        photoUrl: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=600&q=80",
        notes: "Delivered all 40 cartons verified with camp head Nurse Deepali. Received signature receipt.",
        timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
        isAiVerified: true,
        aiConfidence: 0.94
      }
    },
    {
      id: "TSK-302",
      volunteerId: "VOL-502",
      volunteerName: "Tenzing Norbu",
      title: "Drone Reconnaissance of Rockfall Sector along NH-7",
      locationName: "Joshimath North Spur",
      urgency: "CRITICAL",
      status: "ON_SITE",
      assignedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      proof: null
    },
    {
      id: "TSK-303",
      volunteerId: "VOL-503",
      volunteerName: "Debabrata Rout",
      title: "Water Purification Tablet Distribution to 120 Coastal Households",
      locationName: "Dhamra Fishing Colony, Odisha",
      urgency: "MEDIUM",
      status: "VERIFIED",
      assignedAt: new Date(Date.now() - 360 * 60 * 1000).toISOString(),
      proof: {
        photoUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80",
        notes: "Distributed 240 strips of chlorine purification tablets. Documented household muster roll.",
        timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
        isAiVerified: true,
        aiConfidence: 0.97
      },
      verifiedBy: "Coordinator S. Mohapatra",
      verifiedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString()
    }
  ],
  riskAssessments: [
    {
      district: "Kamrup Metropolitan (Guwahati)",
      state: "Assam",
      hazardScore: 92,      // River rise + heavy rainfall
      exposureScore: 88,    // Dense urban riverfront population
      vulnerabilityScore: 84,// Slum dwellings & drainage congestion
      overallRiskScore: 88.6,// (0.4 * 92) + (0.35 * 88) + (0.25 * 84)
      riskLevel: "CRITICAL",
      primaryHazard: "Riparian Flooding",
      populationAtRisk: 310000,
      preparednessIndex: "78%",
      keyRecommendation: "Maintain high alert along Bharalu river sluice gate; preposition 4 rescue motor boats."
    },
    {
      district: "Kendrapara",
      state: "Odisha",
      hazardScore: 86,
      exposureScore: 74,
      vulnerabilityScore: 78,
      overallRiskScore: 79.8,
      riskLevel: "HIGH",
      primaryHazard: "Cyclonic Gale & Storm Inundation",
      populationAtRisk: 195000,
      preparednessIndex: "89%",
      keyRecommendation: "Complete mandatory evacuation of thatched dwellings within 5km from high-tide line."
    },
    {
      district: "Chamoli",
      state: "Uttarakhand",
      hazardScore: 82,
      exposureScore: 58,
      vulnerabilityScore: 86,
      overallRiskScore: 74.6,
      riskLevel: "HIGH",
      primaryHazard: "Debris Avalanche & Slope Failure",
      populationAtRisk: 42000,
      preparednessIndex: "72%",
      keyRecommendation: "Keep heavy earthmoving machinery stationed at Joshimath and Pipalkoti choke points."
    },
    {
      district: "Wayanad",
      state: "Kerala",
      hazardScore: 76,
      exposureScore: 62,
      vulnerabilityScore: 72,
      overallRiskScore: 70.1,
      riskLevel: "ELEVATED",
      primaryHazard: "Soil Liquefaction & Landslide",
      populationAtRisk: 68000,
      preparednessIndex: "84%",
      keyRecommendation: "Activate early acoustic sensor monitors on tea estate steep slopes."
    }
  ],
  recoveryProgress: {
    overallPercentage: 71,
    lastAuditDate: "2026-09-29",
    sectors: [
      { name: "Power Grid & Electrical Sub-Stations", progress: 74, status: "IN_PROGRESS", targetDate: "2026-10-04", icon: "Zap" },
      { name: "Potable Drinking Water & Sanitation", progress: 82, status: "GOOD", targetDate: "2026-10-02", icon: "Droplets" },
      { name: "Highways, Arterial Roads & Bridges", progress: 61, status: "NEEDS_ATTENTION", targetDate: "2026-10-08", icon: "GitCommit" },
      { name: "Primary Healthcare Centers & Clinics", progress: 90, status: "EXCELLENT", targetDate: "2026-10-01", icon: "Activity" },
      { name: "Permanent & Transitional Housing", progress: 68, status: "IN_PROGRESS", targetDate: "2026-10-15", icon: "Home" },
      { name: "Schools & Anganwadi Centers", progress: 54, status: "NEEDS_ATTENTION", targetDate: "2026-10-12", icon: "BookOpen" }
    ],
    claims: {
      totalReliefClaims: 18450,
      verifiedClaims: 15320,
      disbursedDbtCr: 42.8, // in Crores INR
      pendingAudit: 3130
    }
  },
  citizenFeedback: [
    {
      id: "FB-01",
      name: "Hemanta Kalita",
      phone: "+91-94350-XXXXX",
      location: "Uzan Bazar, Guwahati",
      incidentId: "INC-8091",
      helpReceived: "YES",
      responseTimeMinutes: 28,
      rating: 5,
      comments: "NDRF rescue boat arrived within 30 minutes of SOS. Transported my elderly mother safely to Sarusajai Camp.",
      missingResources: "More potable drinking water pouches needed in boat.",
      timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString()
    },
    {
      id: "FB-02",
      name: "Bishnu Charan Das",
      phone: "+91-98610-XXXXX",
      location: "Bhadrak, Odisha",
      incidentId: "INC-8093",
      helpReceived: "YES",
      responseTimeMinutes: 45,
      rating: 4,
      comments: "Volunteer team brought tarpaulins and dry food packets. Very respectful and prompt coordination.",
      missingResources: "Need baby formula powder.",
      timestamp: new Date(Date.now() - 240 * 60 * 1000).toISOString()
    }
  ]
};

class Database {
  constructor() {
    this.data = initialData;
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
        this.data = { ...initialData, ...JSON.parse(fileContent) };
      } else {
        this.save();
      }
    } catch (err) {
      console.warn('Could not load data.json, using in-memory defaults:', err.message);
      this.data = initialData;
    }
  }

  save() {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write data.json:', err.message);
    }
  }

  // --- Disasters & Alerts ---
  getDisasters() { return this.data.disasters; }
  getAlerts() { return this.data.alerts; }
  
  createAlert(alert) {
    const newAlert = {
      id: `ALT-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
      ...alert
    };
    this.data.alerts.unshift(newAlert);
    this.save();
    return newAlert;
  }

  // --- Incidents & SOS ---
  getIncidents() { return this.data.incidents; }
  
  createIncident(incident) {
    const newIncident = {
      id: `INC-${Math.floor(1000 + Math.random() * 9000)}`,
      status: incident.severity === 'CRITICAL' ? 'PRIORITY' : 'NEW',
      reportedAt: new Date().toISOString(),
      assignedTeamId: null,
      assignedTeamName: null,
      source: incident.source || 'USER_REPORTED',
      ...incident
    };
    
    // Automatic AI triage simulation
    if (!newIncident.aiAnalysis) {
      newIncident.aiAnalysis = {
        classification: `${newIncident.type || 'General'} Emergency Triage`,
        confidence: 0.92,
        urgencyScore: newIncident.severity === 'CRITICAL' ? 95 : 75,
        suggestedAction: newIncident.severity === 'CRITICAL' 
          ? "Immediate dispatch of nearest QRT & notify Medical Superintendent"
          : "Verify with local district emergency control room (DEOC)",
        isAiGenerated: true
      };
    }

    // Auto-dispatch logic if critical SOS
    if (newIncident.source === 'SOS' || newIncident.severity === 'CRITICAL') {
      const availableTeam = this.data.rescueTeams.find(t => t.status === 'AVAILABLE');
      if (availableTeam) {
        newIncident.status = 'ASSIGNED';
        newIncident.assignedTeamId = availableTeam.id;
        newIncident.assignedTeamName = availableTeam.name;
        availableTeam.status = 'DISPATCHED';
        availableTeam.assignedIncidentId = newIncident.id;
      }
    }

    this.data.incidents.unshift(newIncident);
    this.save();
    return newIncident;
  }

  updateIncidentStatus(id, status, assignedTeamId) {
    const inc = this.data.incidents.find(i => i.id === id);
    if (!inc) return null;
    inc.status = status;
    if (assignedTeamId) {
      inc.assignedTeamId = assignedTeamId;
      const team = this.data.rescueTeams.find(t => t.id === assignedTeamId);
      if (team) {
        inc.assignedTeamName = team.name;
        team.assignedIncidentId = inc.id;
        team.status = status === 'RESOLVED' || status === 'CLOSED' ? 'AVAILABLE' : 'DISPATCHED';
      }
    }
    this.save();
    return inc;
  }

  // --- Rescue Teams ---
  getRescueTeams() { return this.data.rescueTeams; }
  
  updateTeamLocation(id, lat, lng, status) {
    const team = this.data.rescueTeams.find(t => t.id === id);
    if (!team) return null;
    if (lat && lng) {
      team.currentLat = parseFloat(lat);
      team.lng = parseFloat(lng);
    }
    if (status) team.status = status;
    team.lastUpdated = new Date().toISOString();
    this.save();
    return team;
  }

  // --- Shelters & Supplies ---
  getShelters() { return this.data.shelters; }
  
  updateShelterOccupancy(id, delta) {
    const shelter = this.data.shelters.find(s => s.id === id);
    if (!shelter) return null;
    const newOccupied = Math.max(0, Math.min(shelter.capacity, shelter.occupied + delta));
    shelter.occupied = newOccupied;
    shelter.available = shelter.capacity - newOccupied;
    this.save();
    return shelter;
  }

  getResources() { return this.data.resources; }
  
  updateResourceStock(id, newStock) {
    const res = this.data.resources.find(r => r.id === id);
    if (!res) return null;
    res.stock = newStock;
    res.status = newStock <= res.threshold ? (newStock <= res.threshold * 0.5 ? 'CRITICAL_LOW' : 'LOW') : 'SAFE';
    this.save();
    return res;
  }

  // --- Volunteers & Tasks ---
  getVolunteers() { return this.data.volunteers; }
  getVolunteerTasks() { return this.data.volunteerTasks; }
  
  createVolunteer(volunteer) {
    const newVol = {
      id: `VOL-${Math.floor(500 + Math.random() * 500)}`,
      tasksCompleted: 0,
      rating: 5.0,
      availability: "AVAILABLE",
      currentTaskId: null,
      ...volunteer
    };
    this.data.volunteers.push(newVol);
    this.save();
    return newVol;
  }

  submitTaskProof(taskId, proofData) {
    const task = this.data.volunteerTasks.find(t => t.id === taskId);
    if (!task) return null;
    task.status = "PROOF_SUBMITTED";
    task.proof = {
      photoUrl: proofData.photoUrl || "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=600&q=80",
      notes: proofData.notes || "Ground task executed as per protocols.",
      timestamp: new Date().toISOString(),
      isAiVerified: true,
      aiConfidence: 0.95
    };
    this.save();
    return task;
  }

  verifyTask(taskId, coordinatorName) {
    const task = this.data.volunteerTasks.find(t => t.id === taskId);
    if (!task) return null;
    task.status = "VERIFIED";
    task.verifiedBy = coordinatorName || "EOC Admin Coordinator";
    task.verifiedAt = new Date().toISOString();
    
    // Update volunteer stats
    const vol = this.data.volunteers.find(v => v.id === task.volunteerId);
    if (vol) {
      vol.tasksCompleted += 1;
      vol.availability = "AVAILABLE";
      vol.currentTaskId = null;
    }
    this.save();
    return task;
  }

  // --- Risk & Recovery ---
  getRiskAssessments() { return this.data.riskAssessments; }
  getRecoveryProgress() { return this.data.recoveryProgress; }

  // --- Feedback ---
  getFeedback() { return this.data.citizenFeedback; }
  
  createFeedback(feedback) {
    const newFb = {
      id: `FB-${Math.floor(10 + Math.random() * 90)}`,
      timestamp: new Date().toISOString(),
      ...feedback
    };
    this.data.citizenFeedback.unshift(newFb);
    this.save();
    return newFb;
  }
}

export const db = new Database();
