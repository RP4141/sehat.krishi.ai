import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const defaultData = {
  users: [
    {
      id: "usr_demo_1",
      name: "Ramesh Patel",
      email: "ramesh.patel@gujarat.in",
      phone: "9876543210",
      state: "Gujarat",
      district: "Rajkot",
      primaryCrops: ["Cotton", "Groundnut"],
      createdAt: "2026-10-10T08:00:00.000Z"
    },
    {
      id: "usr_demo_2",
      name: "Suresh Chaudhary",
      email: "suresh.c@khedut.in",
      phone: "9825012345",
      state: "Gujarat",
      district: "Mehsana",
      primaryCrops: ["Cumin", "Mustard", "Wheat"],
      createdAt: "2026-10-12T10:30:00.000Z"
    }
  ],
  farmProfiles: [
    {
      id: "farm_demo_1",
      userId: "usr_demo_1",
      farmName: "Gondal Road Plot 1",
      acres: 7.5,
      soilType: "Medium Black Soil",
      irrigationSource: "Borewell with Drip Irrigation",
      currentCrops: ["Bt Cotton Shankar-6", "Groundnut G-20"],
      state: "Gujarat",
      district: "Rajkot",
      notes: "Installed drip system with PMKSY subsidy in 2025. Drip spacing 1.2m.",
      updatedAt: "2026-10-12T14:00:00.000Z"
    },
    {
      id: "farm_demo_2",
      userId: "usr_demo_2",
      farmName: "Unjha Canal View",
      acres: 4.0,
      soilType: "Sandy Loam",
      irrigationSource: "Canal Irrigation",
      currentCrops: ["Cumin", "Mustard"],
      state: "Gujarat",
      district: "Mehsana",
      notes: "Preparing for Rabi cumin sowing after early October ploughing.",
      updatedAt: "2026-10-13T11:20:00.000Z"
    }
  ],
  savedAdvice: [
    {
      id: "adv_demo_1",
      userId: "usr_demo_1",
      title: "Pink Bollworm ETL & Trap Management in Cotton",
      crop: "Cotton",
      category: "Pest Management",
      question: "How to monitor pink bollworm using pheromone traps?",
      answer: "Install funnel pheromone traps @ 5 traps/acre at crop canopy level. Economic Threshold Level (ETL) is 8 moths/trap/night for 3 consecutive nights. At ETL, spray Profenofos 50% EC @ 2 ml/L with hollow-cone nozzle.",
      sources: [{ title: "ICAR-CICR Nagpur Bt Cotton Advisory", source: "ICAR-CICR" }],
      savedAt: "2026-10-13T09:15:00.000Z"
    }
  ],
  feedback: [
    {
      id: "fb_demo_1",
      name: "Pravinbhai Vora",
      email: "pravin.vora@example.com",
      phone: "9426098765",
      category: "Crop Advice Question",
      message: "Great AI guidance on groundnut leaf spot treatment. The NPK calculator helped me save 2 bags of DAP this season.",
      rating: 5,
      status: "Reviewed",
      submittedAt: "2026-10-13T16:45:00.000Z"
    }
  ],
  customMandiPrices: [],
  apiSettings: {
    geminiApiKey: '',
    defaultModel: 'gemini-2.5-flash',
    temperature: 0.25,
    maxTokens: 2048,
    systemPromptMode: 'Strict ICAR Grounding'
  },
  activeAdvisory: {
    title: "October Transition Advisory (Kharif Harvesting & Rabi Sowing)",
    summary: "Seasonal conditions are optimal for cotton picking in dry afternoon hours. Sundry harvested groundnut below 9% moisture. Initiate pre-sowing irrigation (Palewa) for timely wheat and mustard sowing.",
    broadcastDate: "2026-10-14",
    status: "Active"
  }
};

function readDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), 'utf-8');
      return defaultData;
    }
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(content);
    return { ...defaultData, ...parsed };
  } catch (err) {
    console.error('Error reading db.json:', err);
    return defaultData;
  }
}

function writeDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing to db.json:', err);
    return false;
  }
}

export const db = {
  // Users
  getUsers: () => readDb().users || [],
  findUserByEmail: (email) => {
    const users = readDb().users || [];
    return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  },
  findUserById: (id) => {
    const users = readDb().users || [];
    return users.find((u) => u.id === id);
  },
  saveUser: (user) => {
    const data = readDb();
    if (!data.users) data.users = [];
    const existingIndex = data.users.findIndex((u) => u.id === user.id);
    if (existingIndex >= 0) {
      data.users[existingIndex] = { ...data.users[existingIndex], ...user, updatedAt: new Date().toISOString() };
    } else {
      data.users.push({ ...user, createdAt: new Date().toISOString() });
    }
    writeDb(data);
    return user;
  },

  // Farm Profiles
  getFarmProfiles: (userId) => {
    const profiles = readDb().farmProfiles || [];
    if (!userId) return profiles;
    return profiles.filter((p) => p.userId === userId);
  },
  saveFarmProfile: (profile) => {
    const data = readDb();
    if (!data.farmProfiles) data.farmProfiles = [];
    const id = profile.id || `farm_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const existingIndex = data.farmProfiles.findIndex((p) => p.id === id);
    const updated = {
      ...profile,
      id,
      updatedAt: new Date().toISOString(),
    };
    if (existingIndex >= 0) {
      data.farmProfiles[existingIndex] = updated;
    } else {
      data.farmProfiles.push(updated);
    }
    writeDb(data);
    return updated;
  },
  deleteFarmProfile: (id, userId) => {
    const data = readDb();
    if (!data.farmProfiles) return false;
    const beforeCount = data.farmProfiles.length;
    data.farmProfiles = data.farmProfiles.filter((p) => !(p.id === id && (userId ? p.userId === userId : true)));
    writeDb(data);
    return data.farmProfiles.length < beforeCount;
  },

  // Saved Advice
  getSavedAdvice: (userId) => {
    const advice = readDb().savedAdvice || [];
    if (!userId) return advice;
    return advice.filter((a) => a.userId === userId);
  },
  saveAdvice: (advice) => {
    const data = readDb();
    if (!data.savedAdvice) data.savedAdvice = [];
    const id = advice.id || `adv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const item = {
      ...advice,
      id,
      savedAt: new Date().toISOString(),
    };
    data.savedAdvice.unshift(item);
    writeDb(data);
    return item;
  },
  deleteSavedAdvice: (id, userId) => {
    const data = readDb();
    if (!data.savedAdvice) return false;
    const beforeCount = data.savedAdvice.length;
    data.savedAdvice = data.savedAdvice.filter((a) => !(a.id === id && (userId ? a.userId === userId : true)));
    writeDb(data);
    return data.savedAdvice.length < beforeCount;
  },

  // Feedback & Contact
  saveFeedback: (feedback) => {
    const data = readDb();
    if (!data.feedback) data.feedback = [];
    const id = `fb_${Date.now()}`;
    const item = { ...feedback, id, status: 'New', submittedAt: new Date().toISOString() };
    data.feedback.unshift(item);
    writeDb(data);
    return item;
  },
  getFeedback: () => readDb().feedback || [],
  updateFeedbackStatus: (id, status) => {
    const data = readDb();
    const item = (data.feedback || []).find((f) => f.id === id);
    if (item) {
      item.status = status;
      writeDb(data);
      return item;
    }
    return null;
  },

  // Custom Mandi Prices (Admin Management)
  getCustomMandiPrices: () => readDb().customMandiPrices || [],
  addCustomMandiPrice: (priceEntry) => {
    const data = readDb();
    if (!data.customMandiPrices) data.customMandiPrices = [];
    const id = `mandi_custom_${Date.now()}`;
    const newEntry = {
      id,
      ...priceEntry,
      minPrice: parseFloat(priceEntry.minPrice) || 0,
      maxPrice: parseFloat(priceEntry.maxPrice) || 0,
      modalPrice: parseFloat(priceEntry.modalPrice) || 0,
      unit: priceEntry.unit || "₹ / Quintal",
      trend: priceEntry.trend || "stable",
      source: priceEntry.source || "APMC Market Intelligence / Admin Verified",
      lastVerified: new Date().toISOString().split('T')[0]
    };
    data.customMandiPrices.unshift(newEntry);
    writeDb(data);
    return newEntry;
  },
  deleteCustomMandiPrice: (id) => {
    const data = readDb();
    if (!data.customMandiPrices) return false;
    const before = data.customMandiPrices.length;
    data.customMandiPrices = data.customMandiPrices.filter((m) => m.id !== id);
    writeDb(data);
    return data.customMandiPrices.length < before;
  },

  // Active Seasonal Advisory
  getActiveAdvisory: () => readDb().activeAdvisory || defaultData.activeAdvisory,
  setActiveAdvisory: (advisory) => {
    const data = readDb();
    data.activeAdvisory = { ...data.activeAdvisory, ...advisory, updatedAt: new Date().toISOString() };
    writeDb(data);
    return data.activeAdvisory;
  },

  // Runtime API Settings (for configuring Gemini API Key in UI)
  getApiConfig: () => readDb().apiSettings || defaultData.apiSettings,
  setApiConfig: (settings) => {
    const data = readDb();
    data.apiSettings = { ...defaultData.apiSettings, ...data.apiSettings, ...settings };
    writeDb(data);
    return data.apiSettings;
  },

  // Overall Statistics for Admin Dashboard
  getStats: () => {
    const data = readDb();
    const users = data.users || [];
    const farmProfiles = data.farmProfiles || [];
    const savedAdvice = data.savedAdvice || [];
    const feedback = data.feedback || [];
    const customMandi = data.customMandiPrices || [];

    const totalAcres = farmProfiles.reduce((acc, f) => acc + (parseFloat(f.acres) || 0), 0);

    return {
      totalUsers: users.length,
      totalFarms: farmProfiles.length,
      totalAcres: Math.round(totalAcres * 10) / 10,
      totalSavedAdvice: savedAdvice.length,
      totalFeedback: feedback.length,
      customMandiEntries: customMandi.length,
      activeAdvisory: data.activeAdvisory?.title || 'Seasonal Advisory',
      geminiConfigured: Boolean(data.apiSettings?.geminiApiKey || process.env.GEMINI_API_KEY)
    };
  },

  // Admin Credentials Authentication
  getAdminCredentials: () => {
    const data = readDb();
    if (!data.adminCredentials) {
      data.adminCredentials = {
        username: "admin",
        password: process.env.ADMIN_PASSWORD || "admin@123",
        updatedAt: new Date().toISOString()
      };
      writeDb(data);
    }
    return data.adminCredentials;
  },
  setAdminPassword: (newPassword) => {
    const data = readDb();
    if (!data.adminCredentials) {
      data.adminCredentials = { username: "admin" };
    }
    data.adminCredentials.password = newPassword;
    data.adminCredentials.updatedAt = new Date().toISOString();
    writeDb(data);
    return true;
  }
};
