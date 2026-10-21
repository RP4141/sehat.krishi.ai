/**
 * SEHAT-KRISHI AI — Comprehensive Indian Agronomic Crop Guides
 * Sourced & aligned with ICAR, KVK, and State Agricultural Universities
 */

export function getCropName(crop, lang = 'en') {
  if (!crop) return '';
  if (lang === 'gu') return crop.nameGu || crop.name;
  if (lang === 'hi') return crop.nameHi || crop.name;
  return crop.nameEn || crop.name?.split('(')[0]?.trim() || crop.name;
}

export function getCropSeason(crop, lang = 'en') {
  if (!crop) return '';
  if (lang === 'gu') return crop.seasonGu || crop.season;
  if (lang === 'hi') return crop.seasonHi || crop.season;
  return crop.seasonEn || crop.season;
}

export function getCropDuration(crop, lang = 'en') {
  if (!crop) return '';
  if (lang === 'gu') return crop.durationGu || crop.duration;
  if (lang === 'hi') return crop.durationHi || crop.duration;
  return crop.durationEn || crop.duration;
}

export const CROPS = [
  {
    id: "cotton",
    name: "Cotton",
    nameEn: "Cotton",
    nameHi: "कपास",
    nameGu: "કપાસ",
    scientificName: "Gossypium hirsutum / Gossypium arboreum",
    season: "Kharif",
    seasonEn: "Kharif",
    seasonHi: "खरीफ",
    seasonGu: "ખરીફ",
    duration: "150 - 180 Days",
    durationEn: "150 - 180 Days",
    durationHi: "150 - 180 दिन",
    durationGu: "150 - 180 દિવસ",
    idealTemp: "21°C - 35°C",
    soil: "Deep Black Cotton Soils (Regur) or fertile alluvial soils with good drainage; pH 6.0 - 8.0",
    sowingWindow: "May - June (Irrigated) / Late June - July (Rainfed with monsoon onset)",
    seedRate: "Bt Hybrid: 1.5 - 2.0 kg/acre (spacing: 120 cm x 45 cm or 90 cm x 60 cm)",
    irrigation: "Critical stages: Square formation (35-45 DAS), Peak flowering (65-75 DAS), and Boll development (90-110 DAS). Avoid waterlogging at all stages.",
    nutrition: "Recommended N:P:K 120:60:60 kg/ha. Apply 25% N + full P & K as basal; remaining N in 2-3 split top-dressings at square and flowering stages.",
    pests: [
      { name: "Pink Bollworm", details: "Attacks green bolls, larvae feed on seeds inside. Install pheromone traps @ 5/acre for ETL monitoring." },
      { name: "Whitefly", details: "Sucks sap from leaf undersides, secretes sticky honeydew; vector for Cotton Leaf Curl Virus." },
      { name: "Thrips & Aphids", details: "Cause leaf curling and crinkling during first 30-45 DAS." }
    ],
    diseases: [
      { name: "Bacterial Blight (Angular Leaf Spot)", details: "Angular water-soaked lesions on leaves turning black. Treat with Copper Oxychloride 50% WP @ 2.5 g/L." },
      { name: "Root Rot & Wilt (Fusarium)", details: "Drooping and yellowing of foliage with vascular browning. Use Trichoderma viride seed treatment." }
    ],
    harvesting: "Pick cotton in dry sunny weather when bolls burst open fully. Pick free from dry bracts and trash in 3-4 pickings. Store at <8% moisture.",
    regionalNotes: "In Gujarat (Saurashtra & Central Gujarat), Bt Cotton Shankar-6 and hybrid varieties dominate. Micro-drip irrigation increases yield by up to 35%."
  },
  {
    id: "wheat",
    name: "Wheat",
    nameEn: "Wheat",
    nameHi: "गेहूं",
    nameGu: "ઘઉં",
    scientificName: "Triticum aestivum",
    season: "Rabi",
    seasonEn: "Rabi",
    seasonHi: "रबी",
    seasonGu: "રવિ",
    duration: "115 - 135 Days",
    durationEn: "115 - 135 Days",
    durationHi: "115 - 135 दिन",
    durationGu: "115 - 135 દિવસ",
    idealTemp: "15°C - 25°C (Cool nights and bright sunny days)",
    soil: "Well-drained medium to heavy textured fertile loams or clay loams; pH 6.5 - 7.5",
    sowingWindow: "November 1 - November 25 (Timely sown) / December 1 - 15 (Late sown)",
    seedRate: "40 - 50 kg/acre (100 - 125 kg/ha). Spacing: 20-22.5 cm between rows.",
    irrigation: "Crown Root Initiation (CRI) at 21 DAS is the MOST critical irrigation. Subsequent irrigations at Tillering (40-45 DAS), Jointing (60-65 DAS), Flowering (80-85 DAS), and Milking (100-105 DAS).",
    nutrition: "Recommended N:P:K 120:60:40 kg/ha + 25 kg Zinc Sulphate (21%) per hectare in basal application.",
    pests: [
      { name: "Termites (Dimak)", details: "Attack roots in sandy soils under dry spells. Treat seed with Chlorpyrifos 20% EC." },
      { name: "Wheat Aphid", details: "Clusters on earheads during grain filling in cloudy weather." }
    ],
    diseases: [
      { name: "Yellow (Stripe) Rust", details: "Yellow linear pustules on leaves. Spray Propiconazole 25% EC (Tilt) @ 1 ml/L upon first detection." },
      { name: "Karnal Bunt", details: "Black fishy-smelling powder in damaged grains. Avoid excessive post-heading irrigation." }
    ],
    harvesting: "Harvest when grains become hard, straw turns golden yellow and moisture drops below 12-14%.",
    regionalNotes: "Popular high-yielding varieties: HD-3086, DBW-187, GW-496 (Gujarat), HI-8759 (Central India)."
  },
  {
    id: "rice",
    name: "Rice / Paddy",
    nameEn: "Rice / Paddy",
    nameHi: "धान / चावल",
    nameGu: "ડાંગર / ચોખા",
    scientificName: "Oryza sativa",
    season: "Kharif",
    seasonEn: "Kharif",
    seasonHi: "खरीफ",
    seasonGu: "ખરીફ",
    duration: "120 - 145 Days",
    durationEn: "120 - 145 Days",
    durationHi: "120 - 145 दिन",
    durationGu: "120 - 145 દિવસ",
    idealTemp: "22°C - 32°C",
    soil: "Clayey loam, heavy soils with high water-retention capacity; pH 5.5 - 7.0",
    sowingWindow: "Nursery: May - June; Transplanting: June - July (21-25 day old seedlings)",
    seedRate: "Transplanted: 15-20 kg/acre; DSR (Direct Seeded Rice): 8-10 kg/acre",
    irrigation: "Maintain 2-5 cm standing water during transplanting to tillering; alternate wetting and drying (AWD) saves water; drain water 10 days before harvest.",
    nutrition: "N:P:K 100:50:50 kg/ha. Apply 50% N as basal, 25% at tillering, 25% at panicle initiation. Top-dress Zinc Sulphate if deficient.",
    pests: [
      { name: "Yellow Stem Borer", details: "Causes 'Dead Heart' in vegetative stage and 'White Earhead' at reproductive stage." },
      { name: "Brown Plant Hopper (BPH)", details: "Causes 'Hopper Burn' in circular patches. Drain water and create alleyways." }
    ],
    diseases: [
      { name: "Rice Blast", details: "Spindle-shaped elliptical lesions. Spray Tricyclazole 75% WP @ 0.6 g/L." },
      { name: "Bacterial Leaf Blight (BLB)", details: "Wavy yellow-to-white margins along leaves. Avoid excess nitrogen." }
    ],
    harvesting: "Harvest when 80-85% of grains in panicles turn golden straw color.",
    regionalNotes: "Leading varieties: Pusa Basmati 1121/1509 (North), Gurjari/Mahisugandha (Gujarat), MTU-1010 (South)."
  },
  {
    id: "groundnut",
    name: "Groundnut",
    nameEn: "Groundnut",
    nameHi: "मूंगफली",
    nameGu: "મગફળી",
    scientificName: "Arachis hypogaea",
    season: "Kharif & Summer",
    seasonEn: "Kharif & Summer",
    seasonHi: "खरीफ व जायद",
    seasonGu: "ખરીફ અને ઉનાળુ",
    duration: "105 - 125 Days",
    durationEn: "105 - 125 Days",
    durationHi: "105 - 125 दिन",
    durationGu: "105 - 125 દિવસ",
    idealTemp: "25°C - 30°C",
    soil: "Well-drained light sandy loam with adequate calcium; pH 6.0 - 7.5 (heavy clay hampers pegging)",
    sowingWindow: "Kharif: June - July; Summer: January - February",
    seedRate: "Bold seeded: 40-50 kg kernels/acre; Bunch type: 35-40 kg/acre",
    irrigation: "Critical at flowering (25-30 DAS), pegging (40-50 DAS), and pod development (65-80 DAS). Avoid water stress during peg entry.",
    nutrition: "N:P:K 20:40:40 kg/ha + Gypsum @ 200 kg/acre at 35-40 DAS during peg formation for shell filling and calcium supply.",
    pests: [
      { name: "White Grub", details: "Larvae cut off tap root in soil. Soil application of Metarhizium anisopliae or Fipronil." },
      { name: "Spodoptera / Leaf Miner", details: "Mines in leaves and defoliates canopy." }
    ],
    diseases: [
      { name: "Tikka Leaf Spot", details: "Dark circular spots with yellow halo. Spray Mancozeb + Carbendazim @ 2 g/L." },
      { name: "Collar Rot", details: "Rotting at soil collar region. Seed treatment with Trichoderma @ 10 g/kg." }
    ],
    harvesting: "Pull out vines when inner shell shows dark brown netting and leaves turn yellowish.",
    regionalNotes: "Saurashtra (Rajkot, Junagadh, Amreli, Jamnagar) is the groundnut bowl of India. GG-20, GJG-9, and TG-37A are key varieties."
  },
  {
    id: "chilli",
    name: "Chilli",
    nameEn: "Chilli",
    nameHi: "मिर्च",
    nameGu: "મરચી",
    scientificName: "Capsicum annuum",
    season: "Kharif & Rabi",
    seasonEn: "Kharif & Rabi",
    seasonHi: "खरीफ व रबी",
    seasonGu: "ખરીફ અને રવિ",
    duration: "150 - 180 Days",
    durationEn: "150 - 180 Days",
    durationHi: "150 - 180 दिन",
    durationGu: "150 - 180 દિવસ",
    idealTemp: "20°C - 30°C",
    soil: "Well-drained sandy loam or clay loam rich in organic matter; pH 6.0 - 7.0",
    sowingWindow: "Nursery: May - June (Kharif) / September - October (Rabi)",
    seedRate: "Hybrid: 100 - 150 grams/acre; Open-pollinated: 400 - 500 grams/acre",
    irrigation: "Regular light irrigations via drip; sensitive to waterlogging which triggers sudden wilt and blossom drop.",
    nutrition: "N:P:K 120:60:80 kg/ha with fertigation in splits; micronutrient sprays (Boron + Calcium) to prevent flower drop.",
    pests: [
      { name: "Thrips (Scirtothrips dorsalis)", details: "Causes upward boat-shaped leaf curling and scabs on fruits." },
      { name: "Yellow Mites", details: "Downward leaf curling with inverted spoon shape." },
      { name: "Fruit Borer", details: "Larvae bore holes in ripening pods." }
    ],
    diseases: [
      { name: "Chilli Leaf Curl Virus", details: "Transmitted by whitefly; severe leaf crinkling and stunting." },
      { name: "Anthracnose / Die Back", details: "Sunken circular dark spots on fruits; dying back of twigs from tip downwards." }
    ],
    harvesting: "Pick green chillies at 10-15 day intervals; for dry red chillies, harvest fully ripe red pods and sun dry on clean tarpaulins.",
    regionalNotes: "Major production hubs: Guntur (AP), Saurashtra & Anand (Gujarat), Byadagi (Karnataka)."
  },
  {
    id: "tomato",
    name: "Tomato",
    nameEn: "Tomato",
    nameHi: "टमाटर",
    nameGu: "ટામેટા",
    scientificName: "Solanum lycopersicum",
    season: "Year-Round",
    seasonEn: "Year-Round (Kharif, Rabi, Summer)",
    seasonHi: "वर्षभर (खरीफ, रबी, जायद)",
    seasonGu: "વર્ષભર (ખરીફ, રવિ, ઉનાળુ)",
    duration: "110 - 140 Days",
    durationEn: "110 - 140 Days",
    durationHi: "110 - 140 दिन",
    durationGu: "110 - 140 દિવસ",
    idealTemp: "18°C - 27°C (Temperatures >38°C trigger blossom drop)",
    soil: "Well-drained rich loam soil with high humus content; pH 6.0 - 7.0",
    sowingWindow: "Kharif: June - July; Rabi: October - November; Summer: January - February",
    seedRate: "Hybrid: 60 - 80 grams/acre; Spacing: 90 cm x 60 cm on raised beds with staking",
    irrigation: "Drip irrigation at 2-3 day intervals; keep soil uniformly moist to prevent blossom end rot and fruit cracking.",
    nutrition: "N:P:K 150:80:100 kg/ha. Top-dress Calcium Nitrate and Boron at flowering and fruit set.",
    pests: [
      { name: "Tomato Leafminer (Tuta absoluta)", details: "Blotch-like serpentine mines on leaves; bores into fruit calyx." },
      { name: "Fruit Borer (Helicoverpa)", details: "Caterpillars bore circular holes in green and ripening tomatoes." }
    ],
    diseases: [
      { name: "Early Blight", details: "Concentric 'target board' lesions on older leaves." },
      { name: "Bacterial Wilt", details: "Sudden wilting of green plant during sunny afternoon without prior yellowing." }
    ],
    harvesting: "Harvest at breaker or turning stage for distant transport; harvest red-ripe for local consumption.",
    regionalNotes: "Staking with trellising increases fruit quality and reduces soil-borne rot by over 40%."
  },
  {
    id: "potato",
    name: "Potato",
    nameEn: "Potato",
    nameHi: "आलू",
    nameGu: "બટાટા",
    scientificName: "Solanum tuberosum",
    season: "Rabi",
    seasonEn: "Rabi",
    seasonHi: "रबी",
    seasonGu: "રવિ",
    duration: "90 - 110 Days",
    durationEn: "90 - 110 Days",
    durationHi: "90 - 110 दिन",
    durationGu: "90 - 110 દિવસ",
    idealTemp: "16°C - 22°C (Tuberization optimal at night temp 15°C - 20°C)",
    soil: "Loose, well-aerated, sandy loam rich in organic matter; pH 5.2 - 6.5",
    sowingWindow: "October 15 - November 10 (Deesa/North Gujarat and Gangetic Plains)",
    seedRate: "12 - 15 Quintals (medium tubers 35-45 mm diameter) per acre",
    irrigation: "Light irrigation immediately after planting (Palewa); maintain 65-75% available soil moisture; stop irrigation 10-12 days before digging.",
    nutrition: "N:P:K 150:80:100 kg/ha. Apply 50% N + full P & K as basal; top-dress remaining 50% N at earthing-up (30-35 DAS).",
    pests: [
      { name: "Aphids (Myzus persicae)", details: "Vectors for viral degeneration; monitor from December onwards." },
      { name: "Potato Tuber Moth", details: "Larvae tunnel into tubers during field storage." }
    ],
    diseases: [
      { name: "Late Blight", details: "Rapidly spreading water-soaked dark lesions during foggy cloudy weather. Spray Metalaxyl + Mancozeb @ 2.5 g/L." },
      { name: "Common Scab", details: "Rough corky lesions on tuber skin. Avoid excessive liming." }
    ],
    harvesting: "Cut haulms (dehaulm) 10-12 days before harvesting to allow skin curing in soil.",
    regionalNotes: "Deesa (Banaskantha, Gujarat) is one of India's foremost potato hubs, producing top processing-grade potatoes (Kufri Chipsona, Lady Rosetta)."
  },
  {
    id: "maize",
    name: "Maize",
    nameEn: "Maize / Corn",
    nameHi: "मक्का",
    nameGu: "મકાઈ",
    scientificName: "Zea mays",
    season: "Kharif & Rabi",
    seasonEn: "Kharif & Rabi",
    seasonHi: "खरीफ व रबी",
    seasonGu: "ખરીફ અને રવિ",
    duration: "95 - 115 Days",
    durationEn: "95 - 115 Days",
    durationHi: "95 - 115 दिन",
    durationGu: "95 - 115 દિવસ",
    idealTemp: "20°C - 32°C",
    soil: "Deep, well-drained fertile loam to silt loam with neutral pH (6.5 - 7.5)",
    sowingWindow: "Kharif: June - July; Rabi: October - November",
    seedRate: "7 - 8 kg/acre (spacing: 60 cm x 20 cm)",
    irrigation: "Critical at knee-high stage (30 DAS), tasseling (50-55 DAS), and silking/grain filling (65-75 DAS). Highly sensitive to standing water.",
    nutrition: "N:P:K 120:60:40 kg/ha with 25 kg Zinc Sulphate basal. Apply N in 3 equal splits: basal, knee-high, and tasseling.",
    pests: [
      { name: "Fall Armyworm (Spodoptera frugiperda)", details: "Caterpillars feed in leaf whorls leaving ragged holes and sawdust-like frass." },
      { name: "Stem Borer (Chilo partellus)", details: "Causes pin holes in leaves and dead heart." }
    ],
    diseases: [
      { name: "Maydis Leaf Blight", details: "Elongated diamond-shaped lesions between leaf veins." },
      { name: "Bacterial Stalk Rot", details: "Soft, slimy, foul-smelling rot of lower internodes." }
    ],
    harvesting: "Harvest when husk leaves turn paper-white and black layer appears at seed tip base.",
    regionalNotes: "Widely grown for grain, silage, sweet corn, and baby corn in Karnataka, Telangana, Bihar, and Gujarat."
  },
  {
    id: "cumin",
    name: "Cumin",
    nameEn: "Cumin / Jeera",
    nameHi: "जीरा",
    nameGu: "જીરું",
    scientificName: "Cuminum cyminum",
    season: "Rabi",
    seasonEn: "Rabi",
    seasonHi: "रबी",
    seasonGu: "રવિ",
    duration: "100 - 115 Days",
    durationEn: "100 - 115 Days",
    durationHi: "100 - 115 दिन",
    durationGu: "100 - 115 દિવસ",
    idealTemp: "15°C - 25°C (Requires dry, sunny climate; very sensitive to cloudy weather)",
    soil: "Well-drained sandy loam or medium loam soil with good fertility; pH 6.8 - 7.8",
    sowingWindow: "November 1 - November 20 (Optimal germination at soil temp 20°C - 24°C)",
    seedRate: "5 - 6 kg/acre. Soak seed in water for 8 hours before sowing to hasten germination.",
    irrigation: "First light irrigation immediately after sowing; second light irrigation at 8-10 DAS. Total 4-5 light irrigations. NEVER irrigate during cloudy weather as it triggers blight epidemic.",
    nutrition: "Apply 15-20 kg N and 10 kg P2O5 per acre. Avoid excess nitrogen which increases disease susceptibility.",
    pests: [
      { name: "Aphids", details: "Severe during flowering in cloudy weather. Spray Thiamethoxam 25% WG @ 0.25 g/L." },
      { name: "Thrips", details: "Suck sap from tender flowers and young umbels." }
    ],
    diseases: [
      { name: "Cumin Blight (Alternaria burnsii)", details: "Dark brown necrotic spots on leaves and umbels; seeds turn shriveled and black. Spray Mancozeb @ 2 g/L at first sign." },
      { name: "Fusarium Wilt", details: "Drooping and drying of plants from top downwards. Practice 3-year crop rotation." },
      { name: "Powdery Mildew", details: "White powdery growth on leaves and umbels. Spray Wettable Sulphur 80% WP @ 2.5 g/L." }
    ],
    harvesting: "Harvest when plants turn yellowish-brown and seeds are mature. Cut early in the morning to avoid seed shattering.",
    regionalNotes: "Gujarat (Unjha, Mehsana, Surendranagar, Banaskantha) and Western Rajasthan produce over 85% of India's cumin."
  },
  {
    id: "mustard",
    name: "Mustard",
    nameEn: "Mustard",
    nameHi: "सरसों / राई",
    nameGu: "રાઇ / સરસવ",
    scientificName: "Brassica juncea",
    season: "Rabi",
    seasonEn: "Rabi",
    seasonHi: "रबी",
    seasonGu: "રવિ",
    duration: "110 - 125 Days",
    durationEn: "110 - 125 Days",
    durationHi: "110 - 125 दिन",
    durationGu: "110 - 125 દિવસ",
    idealTemp: "15°C - 25°C",
    soil: "Sandy loam to clay loam; tolerates light salinity; pH 6.0 - 7.5",
    sowingWindow: "October 1 - October 20 (Early sowing escapes peak aphid attack)",
    seedRate: "1.5 - 2.0 kg/acre (spacing: 30 cm x 10 cm)",
    irrigation: "First irrigation at rosette/flowering stage (30-35 DAS), second at siliqua (pod) development (60-65 DAS).",
    nutrition: "N:P:K 80:40:40 kg/ha + 30 kg/ha Sulphur (Essential for oil content synthesis).",
    pests: [
      { name: "Mustard Aphid (Lipaphis erysimi)", details: "Clusters on tender twigs and pods. ETL: 20% infested plants. Spray Dimethoate or Thiamethoxam." },
      { name: "Painted Bug", details: "Nymphs suck sap from young seedlings." }
    ],
    diseases: [
      { name: "White Rust (Albugo candida)", details: "White blisters on leaf undersides and swollen 'staghead' inflorescence." },
      { name: "Alternaria Blight", details: "Circular brown concentric spots on leaves and siliquae." }
    ],
    harvesting: "Harvest when 75% of siliquae turn golden yellow. Harvest in morning hours to prevent pod shattering.",
    regionalNotes: "Varieties: Pusa Bold, Giriraj, Gujarat Mustard-3 (GM-3), Bio-902."
  },
  {
    id: "sugarcane",
    name: "Sugarcane",
    nameEn: "Sugarcane",
    nameHi: "गन्ना",
    nameGu: "શેરડી",
    scientificName: "Saccharum officinarum",
    season: "Annual",
    seasonEn: "Annual (Spring / Autumn / Adsali)",
    seasonHi: "वार्षिक (वसंत / शरद / अदसाली)",
    seasonGu: "વાર્ષિક (વસંત / શરદ / અડસાલી)",
    duration: "300 - 365 Days",
    durationEn: "300 - 365 Days",
    durationHi: "300 - 365 दिन",
    durationGu: "300 - 365 દિવસ",
    idealTemp: "24°C - 35°C",
    soil: "Deep, well-drained, rich alluvial or heavy black soils with good water-holding capacity; pH 6.5 - 7.8",
    sowingWindow: "Autumn: October - November; Spring: February - March; Adsali (MH/GJ): July - August",
    seedRate: "12,000 - 15,000 two-budded setts per acre (spacing: 120-150 cm wide row planting)",
    irrigation: "High water requirement (1500-2000 mm). Drip fertigation saves 45% water and increases cane diameter.",
    nutrition: "N:P:K 250:100:125 kg/ha with split fertigation throughout tillering and formative stages.",
    pests: [
      { name: "Early Shoot Borer", details: "Dead heart formation in young tillers." },
      { name: "Pyrilla / Whitefly", details: "Sap sucking and sooty mold coverage on leaf blades." }
    ],
    diseases: [
      { name: "Red Rot (Colletotrichum falcatum)", details: "Internal pith turns blood red with white cross patches and alcoholic odor. Use certified setts." },
      { name: "Smut", details: "Long whip-like black dusty structure emerges from shoot apex." }
    ],
    harvesting: "Cut flush with ground level when brix reading reaches 18-20% and lower leaves dry.",
    regionalNotes: "Major belts in Gujarat: Surat, Navsari, Bharuch co-operative sugar mills; Western Maharashtra (Kolhapur, Pune, Ahmednagar)."
  },
  {
    id: "pulses",
    name: "Pulses / Gram & Tur",
    nameEn: "Pulses / Gram & Tur",
    nameHi: "दालें (चना व तुअर)",
    nameGu: "કઠોળ (ચણા અને તુવેર)",
    scientificName: "Cicer arietinum / Cajanus cajan",
    season: "Rabi & Kharif",
    seasonEn: "Rabi (Gram) / Kharif (Tur)",
    seasonHi: "रबी (चना) व खरीफ (तुअर)",
    seasonGu: "રવિ (ચણા) અને ખરીફ (તુવેર)",
    duration: "Gram: 90-110 Days; Tur: 150-180 Days",
    durationEn: "Gram: 90-110 Days; Tur: 150-180 Days",
    durationHi: "चना: 90-110 दिन; तुअर: 150-180 दिन",
    durationGu: "ચણા: 90-110 દિવસ; તુવેર: 150-180 દિવસ",
    idealTemp: "18°C - 28°C",
    soil: "Well-drained medium to heavy soils; avoid waterlogged soils; pH 6.5 - 7.8",
    sowingWindow: "Gram: October 15 - November 15; Tur: June - July",
    seedRate: "Desi Gram: 25-30 kg/acre; Kabuli: 40 kg/acre; Tur: 4-5 kg/acre",
    irrigation: "Light irrigation at pre-flowering and pod development. NEVER irrigate at peak flowering as it triggers vegetative flush and blossom drop.",
    nutrition: "N:P:K 20:50:20 kg/ha. Inoculate seeds with Rhizobium culture and Phosphorus Solubilizing Bacteria (PSB) @ 250 g/10 kg seed.",
    pests: [
      { name: "Pod Borer (Helicoverpa armigera)", details: "Caterpillars feed on leaves and bore into developing green pods. Install pheromone traps @ 5/acre and bird perches @ 20/acre." },
      { name: "Maruca Pod Borer (Tur)", details: "Webs flowers and tender pods together." }
    ],
    diseases: [
      { name: "Fusarium Wilt", details: "Brown internal vascular discoloration with drooping of whole plant." },
      { name: "Ascochyta Blight", details: "Circular spots on leaves and pods with tiny black pycnidia." }
    ],
    harvesting: "Harvest when plants dry up, pods rattle when shaken, and seeds are hard with <10% moisture.",
    regionalNotes: "Key varieties: Gujarat Gram-1 (GG-1), JG-16, BDN-711, Vaishali (Tur)."
  }
];
