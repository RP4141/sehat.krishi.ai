/**
 * SEHAT-KRISHI AI — Verified Indian Agricultural Government Schemes
 * Aligned with Ministry of Agriculture & Farmers Welfare, GoI & State Depts
 */

export const GOVERNMENT_SCHEMES = [
  {
    id: "scheme_pm_kisan",
    name: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
    authority: "Central Government (Ministry of Agriculture & Farmers Welfare)",
    category: "Income Support",
    objective: "Direct income support to landholding farmer families across India to supplement their financial needs for agricultural inputs and domestic obligations.",
    benefits: "₹6,000 per year transferred directly into Aadhaar-seeded bank accounts in 3 equal four-monthly installments of ₹2,000 each.",
    eligibility: [
      "All landholding farmer families with cultivable land in their names.",
      "Subject to exclusion criteria: institutional landholders, farmer families holding constitutional posts, serving/retired government officers, income tax payees, and professionals."
    ],
    documentsRequired: [
      "Aadhaar Card (Mandatory)",
      "Landholding ownership documentation (7/12, RoR, Khatauni)",
      "Aadhaar-linked Bank Account Passbook",
      "Active Mobile Number for e-KYC authentication"
    ],
    applicationProcess: "1. Visit official portal (pmkisan.gov.in) -> 'Farmer Corner'. 2. Click 'New Farmer Registration'. 3. Enter Aadhaar and mobile number, verify OTP. 4. Complete biometric or face e-KYC. Can also apply via local CSC (Common Service Centre) or Village Nodal Officer.",
    officialPortal: "https://pmkisan.gov.in",
    helpline: "155261 / 011-24300606",
    lastVerified: "2026-09-15"
  },
  {
    id: "scheme_pmfby",
    name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    authority: "Central & State Governments Joint Implementation",
    category: "Crop Insurance",
    objective: "Comprehensive insurance cover against crop failure due to non-preventable natural risks (drought, flood, pest epidemic, unseasonal hail, post-harvest losses).",
    benefits: "Full sum insured payout against yield losses. Farmers pay heavily subsidized premium: only 2% for Kharif crops, 1.5% for Rabi food/oilseed crops, and 5% for commercial/horticultural crops. Balance premium paid 50:50 by Center & State.",
    eligibility: [
      "All farmers growing notified crops in notified areas (both loanee and non-loanee farmers, tenant farmers, and sharecroppers)."
    ],
    documentsRequired: [
      "Sowing Certificate / Declaration from Talati/Patwari",
      "Land Record (7/12, 8-A, Khatauni)",
      "Bank Account details",
      "Aadhaar Card"
    ],
    applicationProcess: "Apply online at pmfby.gov.in or through nearest bank branch, Primary Agricultural Credit Society (PACS), or CSC before the cutoff deadline for the season.",
    officialPortal: "https://pmfby.gov.in",
    helpline: "14447 (National Crop Insurance Helpline)",
    lastVerified: "2026-09-20"
  },
  {
    id: "scheme_soil_health_card",
    name: "Soil Health Card (SHC) Scheme",
    authority: "Department of Agriculture and Farmers Welfare (DA&FW)",
    category: "Soil Health & Nutrient Management",
    objective: "Assist farmers in knowing the nutrient status of their farm soil and recommend dosage of macro and micronutrients, reducing cost of cultivation.",
    benefits: "Free or nominal testing of 12 critical parameters: N, P, K, S, Zn, Fe, Cu, Mn, Bo, pH, EC, and Organic Carbon (OC). Specific fertilizer dosage recommendations tailored for targeted yields.",
    eligibility: [
      "All farmers across all States and UTs."
    ],
    documentsRequired: [
      "Farmer ID / Aadhaar",
      "Plot survey number / Khata number"
    ],
    applicationProcess: "Soil samples collected from farmer's field by agriculture extension officers/KVK scientists or farmer can deposit sample at nearest District Soil Testing Lab.",
    officialPortal: "https://soilhealth.dac.gov.in",
    helpline: "011-23382012 / Local KVK",
    lastVerified: "2026-08-30"
  },
  {
    id: "scheme_pmksy",
    name: "Pradhan Mantri Krishi Sinchayee Yojana (PMKSY - Per Drop More Crop)",
    authority: "Ministry of Agriculture & Farmers Welfare",
    category: "Micro Irrigation Subsidy",
    objective: "Enhancing water use efficiency at the farm level through micro-irrigation technologies (Drip and Sprinkler systems).",
    benefits: "Financial assistance/subsidy up to 55% for Small & Marginal farmers and 45% for other farmers for installing drip and sprinkler systems.",
    eligibility: [
      "All farmers owning agricultural land with an assured water source (well, borewell, canal, farm pond)."
    ],
    documentsRequired: [
      "Land ownership document (7/12, 8-A)",
      "Electricity bill / Certificate of water source",
      "Aadhaar Card & Bank Passbook",
      "Quotation from authorized micro-irrigation supplier"
    ],
    applicationProcess: "Apply on state agriculture portal (e.g., iKhedut in Gujarat, MahaDBT in Maharashtra) or via District Agriculture Office.",
    officialPortal: "https://pmksy.gov.in",
    helpline: "State Agriculture Department / 1800-180-1551",
    lastVerified: "2026-09-01"
  },
  {
    id: "scheme_kisan_credit_card",
    name: "Kisan Credit Card (KCC) Scheme",
    authority: "Reserve Bank of India & NABARD",
    category: "Agricultural Credit & Finance",
    objective: "Timely and adequate credit support to farmers for crop cultivation, post-harvest expenses, maintenance of farm assets, and allied activities.",
    benefits: "Short-term credit limit up to ₹3,00,000 at concessional interest rate of 7%. Prompt repaying farmers receive 3% Interest Subvention, effectively paying only 4% interest per annum. Collateral-free loan up to ₹1.60 Lakh.",
    eligibility: [
      "All farmers, individual or joint borrowers, tenant farmers, oral lessees, sharecroppers, and SHGs."
    ],
    documentsRequired: [
      "Completed KCC application form",
      "Identity and Address Proof (Aadhaar, Voter ID)",
      "Land Record Documents certified by Revenue Authority",
      "Cropping pattern proof"
    ],
    applicationProcess: "Submit application at any commercial bank, Regional Rural Bank (RRB), or Cooperative Bank branch, or apply via PM-KISAN portal.",
    officialPortal: "https://www.nabard.org",
    helpline: "1800-22-9090",
    lastVerified: "2026-09-10"
  },
  {
    id: "scheme_smam_machinery",
    name: "Sub-Mission on Agricultural Mechanization (SMAM)",
    authority: "Ministry of Agriculture & Farmers Welfare",
    category: "Farm Machinery Subsidy",
    objective: "Increasing farm power availability and promoting modern farm machinery and implements among small and marginal farmers.",
    benefits: "40% to 50% financial subsidy on tractors, power tillers, rotavators, laser land levelers, seed drills, sprayers, and drones.",
    eligibility: [
      "Farmers owning land. Priority given to SC, ST, Small, Marginal, and Women farmers."
    ],
    documentsRequired: [
      "Aadhaar Card",
      "Land documents (7/12 / RoR)",
      "Caste Certificate (if claiming affirmative quota)",
      "Bank Passbook"
    ],
    applicationProcess: "Register on the Agrimachinery portal (agrimachinery.nic.in) or respective State portal, select machinery model from empanelled manufacturers.",
    officialPortal: "https://agrimachinery.nic.in",
    helpline: "011-23381012",
    lastVerified: "2026-08-20"
  },
  {
    id: "scheme_pkvy_organic",
    name: "Paramparagat Krishi Vikas Yojana (PKVY)",
    authority: "National Mission for Sustainable Agriculture (NMSA)",
    category: "Organic Farming",
    objective: "Promoting organic farming through a cluster approach and Participatory Guarantee System (PGS) certification.",
    benefits: "Financial assistance of ₹50,000 per hectare for 3 years, of which ₹31,000/ha is directly transferred for organic inputs (seeds, biofertilizers, biopesticides, vermicompost).",
    eligibility: [
      "Farmers willing to form a cluster of 50 or more acres and adopt PGS-India organic standards."
    ],
    documentsRequired: [
      "Aadhaar Card",
      "Land records",
      "Cluster membership agreement"
    ],
    applicationProcess: "Apply through local Block Agriculture Officer or District Organic Farming Nodal Agency.",
    officialPortal: "https://pgsindia-ncof.gov.in",
    helpline: "0120-2764906",
    lastVerified: "2026-09-05"
  }
];

export function getSchemes({ search = '', category = '' } = {}) {
  let list = [...GOVERNMENT_SCHEMES];

  if (category && category !== 'All') {
    list = list.filter((s) => s.category.toLowerCase().includes(category.toLowerCase()));
  }

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.objective.toLowerCase().includes(q) ||
        s.benefits.toLowerCase().includes(q)
    );
  }

  const categories = ['All', ...new Set(GOVERNMENT_SCHEMES.map((s) => s.category))];

  return {
    success: true,
    count: list.length,
    source: "Verified Government of India Portals (pmkisan.gov.in, pmfby.gov.in, agrimachinery.nic.in)",
    lastVerified: "2026-10-13",
    categories,
    data: list
  };
}
