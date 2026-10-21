/**
 * SEHAT-KRISHI AI — Agricultural Knowledge & RAG Corpus
 * Sourced & aligned with ICAR, KVK, and State Agricultural Universities (AAU, PAU, TNAU)
 */

export const agriculturalKnowledgeBase = [
  {
    id: "kb_cotton_pink_bollworm",
    crop: "Cotton",
    category: "Pest",
    title: "Pink Bollworm (Pectinophora gossypiella) Management in Bt Cotton",
    symptoms: "Rosetted flowers, exit holes with frass in green bolls, premature boll opening with stained lint.",
    cultural_control: "Stall destruction of cotton stalks immediately after harvest; avoid ratoon cropping; observe cotton-free period of at least 3-4 months.",
    mechanical_control: "Install pheromone traps @ 5 traps/acre for pest monitoring; increase to 10-12 traps/acre for mass trapping if catch exceeds 8 moths/trap/day.",
    biological_control: "Release egg parasitoid Trichogramma bactrae @ 60,000/acre at 7-10 days intervals starting at 45 DAS.",
    chemical_advisory: "Apply approved ETL-based spray: Profenofos 50% EC @ 2 ml/L or Chlorantraniliprole 18.5% SC @ 0.3 ml/L. Never spray synthetic pyrethroids repeatedly.",
    safety_notes: "Always spray in evening hours; wear protective PPE mask and gloves; maintain 21-day pre-harvest interval (PHI).",
    source: "ICAR-Central Institute for Cotton Research (CICR), Nagpur / KVK Advisory",
    lastVerified: "2026-08-15"
  },
  {
    id: "kb_cotton_whitefly",
    crop: "Cotton",
    category: "Pest",
    title: "Cotton Whitefly (Bemisia tabaci) and Cotton Leaf Curl Virus (CLCuV)",
    symptoms: "Yellowing, upward curling of leaves, sticky honeydew secretion with black sooty mold growth; vector for CLCuV.",
    cultural_control: "Avoid excessive nitrogenous fertilizers; maintain optimal crop spacing; remove alternate weed hosts like Abutilon indicum.",
    mechanical_control: "Erect yellow sticky traps @ 15-20 traps/acre at crop canopy level.",
    biological_control: "Conserve natural predators Chrysoperla carnea; apply Neem oil 1500 ppm @ 3-5 ml/L during early vegetative stage.",
    chemical_advisory: "At ETL (6-8 adults/leaf): Diafenthiuron 50% WP @ 1.2 g/L or Pyriproxyfen 10% EC @ 2 ml/L. Alternate chemical groups to avoid resistance.",
    safety_notes: "Direct spray nozzle towards undersides of leaves where nymphs harbor.",
    source: "Punjab Agricultural University (PAU) / ICAR-CICR",
    lastVerified: "2026-07-20"
  },
  {
    id: "kb_wheat_rust",
    crop: "Wheat",
    category: "Disease",
    title: "Yellow Rust (Stripe Rust - Puccinia striiformis) & Brown Rust",
    symptoms: "Bright yellow pustules arranged in linear stripes on leaf blades; chlorotic streaks turning orange-brown; severe yield loss in cool humid weather.",
    cultural_control: "Sow resistant varieties (e.g., HD 3086, DBW 187, DBW 222); avoid late sowing; practice balanced fertilization.",
    chemical_advisory: "On first detection of yellow stripes: Spray Propiconazole 25% EC (Tilt) @ 1 ml/L (200 ml in 200 L water/acre). Repeat after 15 days if cloudy weather persists.",
    safety_notes: "Observe 30-day PHI; do not spray during rain; use hollow-cone nozzle for thorough coverage.",
    source: "ICAR-Indian Institute of Wheat & Barley Research (IIWBR), Karnal",
    lastVerified: "2026-09-10"
  },
  {
    id: "kb_rice_blast",
    crop: "Rice",
    category: "Disease",
    title: "Rice Blast (Magnaporthe oryzae / Pyricularia oryzae)",
    symptoms: "Spindle-shaped elliptical lesions with ash-grey centers and brownish margins on leaves; rotting of neck node (neck blast) causing chaffy grains.",
    cultural_control: "Avoid excessive nitrogen application; split urea into 3-4 doses; maintain recommended water level; burn severely infected stubbles.",
    biological_control: "Seed treatment with Pseudomonas fluorescens @ 10 g/kg seed; foliar spray of Trichoderma harzianum @ 5 g/L.",
    chemical_advisory: "Tricyclazole 75% WP @ 0.6 g/L or Isoprothiolane 40% EC @ 1.5 ml/L at tillering and panicle emergence stage.",
    safety_notes: "Avoid water stagnation during peak fungal sporulation.",
    source: "ICAR-National Rice Research Institute (NRRI), Cuttack",
    lastVerified: "2026-08-30"
  },
  {
    id: "kb_groundnut_tikka",
    crop: "Groundnut",
    category: "Disease",
    title: "Early and Late Leaf Spot (Tikka Disease - Cercospora arachidicola / Phaeoisariopsis personata)",
    symptoms: "Dark brown to black spots surrounded by a bright yellow halo on upper leaf surfaces; premature defoliation leading to weak peg formation.",
    cultural_control: "Crop rotation with non-legume crops (cereals/sorghum); deep summer ploughing; remove diseased crop residues.",
    chemical_advisory: "Spray Mancozeb 75% WP @ 2 g/L + Carbendazim 50% WP @ 1 g/L or Tebuconazole 25.9% EC @ 1 ml/L at 35-40 days after sowing.",
    source: "ICAR-Directorate of Groundnut Research (DGR), Junagadh, Gujarat",
    lastVerified: "2026-07-28"
  },
  {
    id: "kb_chilli_leaf_curl",
    crop: "Chilli",
    category: "Disease",
    title: "Chilli Leaf Curl Virus Complex and Thrips / Mite Infestation",
    symptoms: "Upward boat-shaped curling indicates thrips attack; downward curling accompanied by elongated petiole indicates mite attack; yellow mosaic mottling indicates geminivirus transmitted by whitefly.",
    cultural_control: "Erect silver reflective mulch; install barrier crops (sorghum or maize 2-3 border rows); pull out and bury infected virus-reservoir plants.",
    mechanical_control: "Install blue sticky traps @ 15/acre for thrips, yellow traps for whitefly.",
    chemical_advisory: "For thrips: Fipronil 5% SC @ 1.5 ml/L or Spinetoram 11.7% SC @ 1 ml/L. For mites: Spiromesifen 22.9% SC @ 1 ml/L.",
    source: "Indian Institute of Horticultural Research (ICAR-IIHR), Bengaluru",
    lastVerified: "2026-08-12"
  },
  {
    id: "kb_tomato_early_late_blight",
    crop: "Tomato",
    category: "Disease",
    title: "Early Blight (Alternaria solani) and Late Blight (Phytophthora infestans)",
    symptoms: "Early blight shows concentric rings ('target board') on older leaves. Late blight shows water-soaked dark greenish spots rapidly turning necrotic, with white cottony mold under high humidity.",
    cultural_control: "Drip irrigation to avoid leaf wetness; staking plants to prevent ground contact; wide spacing for air circulation.",
    chemical_advisory: "For early blight: Mancozeb 75% WP @ 2.5 g/L or Azoxystrobin 23% SC @ 1 ml/L. For late blight: Cymoxanil 8% + Mancozeb 64% WP @ 2 g/L or Metalaxyl 8% + Mancozeb 64% WP @ 2.5 g/L.",
    source: "ICAR-Indian Institute of Vegetable Research (IIVR), Varanasi",
    lastVerified: "2026-09-02"
  },
  {
    id: "kb_potato_blight",
    crop: "Potato",
    category: "Disease",
    title: "Late Blight of Potato (Phytophthora infestans)",
    symptoms: "Irregular water-soaked spots on leaf tips and margins; lesions enlarge rapidly into brown-black patches during cold, cloudy, foggy days; rotting of tubers with dry brown flesh.",
    cultural_control: "Plant certified disease-free seed tubers; practice high earthing-up to prevent zoospores reaching tubers; dehaulm 10-12 days before harvest.",
    chemical_advisory: "Prophylactic spray with Mancozeb 75% WP @ 2.5 g/L before canopy closure; curatively spray Dimethomorph 50% WP @ 1 g/L or Fenamidone + Mancozeb @ 2.5 g/L upon disease alert.",
    source: "ICAR-Central Potato Research Institute (CPRI), Shimla",
    lastVerified: "2026-09-18"
  },
  {
    id: "kb_cumin_blight_wilt",
    crop: "Cumin",
    category: "Disease",
    title: "Cumin Blight (Alternaria burnsii) and Fusarium Wilt",
    symptoms: "Blight shows tiny dark brown spots on leaves and stems; flowers fail to set seeds; wilt causes drooping of plants from apex downwards during flowering.",
    cultural_control: "Strict crop rotation of 3 years; seed treatment with Trichoderma viride @ 10 g/kg seed; avoid irrigation during cloudy weather.",
    chemical_advisory: "At first appearance of blight: Mancozeb 75% WP @ 2 g/L or Difenoconazole 25% EC @ 0.5 ml/L. For powdery mildew: Wettable Sulphur 80% WP @ 2.5 g/L.",
    source: "Anand Agricultural University (AAU) / ICAR-NRC on Seed Spices, Ajmer",
    lastVerified: "2026-08-25"
  },
  {
    id: "kb_mustard_aphid",
    crop: "Mustard",
    category: "Pest",
    title: "Mustard Aphid (Lipaphis erysimi) & White Rust",
    symptoms: "Large colonies of green/yellow aphids clustering on inflorescence and tender pods; stunted plant growth, honey dew with sooty mold; white blisters on leaves for white rust.",
    cultural_control: "Early sowing by October 15-20 escapes peak aphid infestation; balanced fertilization without excessive nitrogen.",
    chemical_advisory: "When 20% plants show aphid colonies: Dimethoate 30% EC @ 1.7 ml/L or Thiamethoxam 25% WG @ 0.2 g/L. Spray in afternoon when pollinators are less active.",
    source: "ICAR-Directorate of Rapeseed-Mustard Research (DRMR), Bharatpur",
    lastVerified: "2026-09-05"
  },
  {
    id: "kb_soil_fertility_npk",
    crop: "General",
    category: "Soil Health",
    title: "Scientific Soil Health & Balanced Fertilizer Guidelines",
    symptoms: "Nitrogen deficiency causes general yellowing (chlorosis) of older lower leaves; Phosphorus deficiency causes purplish tint on stems/veins; Potassium deficiency causes marginal leaf burn/scorch.",
    cultural_control: "Apply 4-5 tonnes well-decomposed Farm Yard Manure (FYM) or vermicompost per acre; incorporate green manuring crops (Dhaincha or Sunnhemp).",
    advisory: "Base fertilizer application on official Soil Health Card (SHC) recommendations. For most Indian alluvium soils, standard N:P:K ratio target is 4:2:1. Always apply micronutrients like Zinc Sulphate (21% Zn @ 10 kg/acre) in basal dose for zinc-deficient soils.",
    source: "ICAR-Indian Institute of Soil Science (IISS), Bhopal",
    lastVerified: "2026-09-01"
  }
];

/**
 * Semantic keyword RAG retrieval function
 * Scores each knowledge item against query terms, crop filter, and category
 */
export function retrieveAgriculturalContext(query = '', crop = '', category = '') {
  const q = (query + ' ' + crop + ' ' + category).toLowerCase();
  const queryTokens = q
    .split(/[\s,?.!-]+/)
    .filter((w) => w.length > 2);

  const scoredItems = agriculturalKnowledgeBase.map((item) => {
    let score = 0;
    const textCorpus = [
      item.crop,
      item.category,
      item.title,
      item.symptoms,
      item.cultural_control || '',
      item.mechanical_control || '',
      item.chemical_advisory || '',
      item.advisory || '',
    ]
      .join(' ')
      .toLowerCase();

    // Exact crop match bonus
    if (crop && item.crop.toLowerCase().includes(crop.toLowerCase())) {
      score += 15;
    }

    // Token frequency score
    queryTokens.forEach((token) => {
      if (textCorpus.includes(token)) {
        score += 3;
      }
    });

    return { item, score };
  });

  // Filter items with positive score, sort descending, return top 3
  const topMatches = scoredItems
    .filter((entry) => entry.score > 2)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((entry) => entry.item);

  return topMatches;
}
