/**
 * SEHAT-KRISHI AI — Pest, Insect & Disease IPM Knowledge Base
 * Sourced & verified according to DPPQS and ICAR guidelines
 */

export const PEST_DATABASE = [
  {
    id: "pest_pink_bollworm",
    name: "Pink Bollworm (गुलाबी सुंडी / ગુલાબી ઇયળ)",
    scientificName: "Pectinophora gossypiella",
    type: "Insect Pest",
    crops: ["Cotton"],
    identification: "Adult moth is small, greyish-brown with dark spots on forewings. Full-grown larva is salmon pink with dark brown head, ~12-15 mm long.",
    symptoms: "Rosetted flowers that fail to open ('rosette flower'); double seeds inside green bolls; circular exit holes on boll rind; premature opening of damaged bolls with lint staining and rotten seeds.",
    etl: "8 moths per pheromone trap per night for 3 consecutive nights OR 10% damaged green bolls (with pink larva present).",
    cultural_control: "Strictly observe 4-month cotton-free closed season; destroy cotton crop residues and stalk immediately after harvest; avoid ratoon crops.",
    mechanical_control: "Install funnel pheromone traps with gossyplure lures @ 5 traps/acre for monitoring; 10-12 traps/acre for mass male disorientation.",
    biological_control: "Release egg parasitoid Trichogramma bactrae @ 60,000 to 1,00,000 per acre at weekly intervals starting 45 days after sowing.",
    chemical_precaution: "When ETL is breached: Profenofos 50% EC @ 2 ml/L or Chlorantraniliprole 18.5% SC @ 0.3 ml/L. Never spray repeatedly; observe 21-day PHI.",
    source: "ICAR-CICR Nagpur / DPPQS"
  },
  {
    id: "pest_whitefly",
    name: "Whitefly (सफेद मक्खी / સફેદ માખી)",
    scientificName: "Bemisia tabaci",
    type: "Sucking Insect Pest / Virus Vector",
    crops: ["Cotton", "Chilli", "Tomato", "Brinjal", "Pulses", "Soybean"],
    identification: "Tiny yellowish body (1.0 mm) with two pairs of powdery white wings. Nymphs are scale-like, oval, translucent greenish-yellow residing on leaf undersides.",
    symptoms: "Nymphs and adults suck cell sap leading to chlorotic spotting, upward leaf curling, and stunted growth. Sticky honeydew excretion produces black sooty mold (Capnodium) which inhibits photosynthesis. Acts as potent vector for Cotton Leaf Curl Virus (CLCuV) and Chilli/Tomato Leaf Curl Virus.",
    etl: "6 to 8 adults or nymphs per leaf on upper canopy leaves.",
    cultural_control: "Avoid excessive nitrogen application; maintain wider spacing; eradicate weed hosts like Parthenium and Abutilon along bunds.",
    mechanical_control: "Erect yellow sticky traps smeared with castor oil or grease @ 15-20 traps/acre at canopy height.",
    biological_control: "Conserve natural predators Chrysoperla zastrowi (green lacewing) and ladybird beetles. Spray Neem seed kernel extract (NSKE 5%) or Neem oil 1500 ppm @ 3-5 ml/L.",
    chemical_precaution: "At ETL: Diafenthiuron 50% WP @ 1.2 g/L or Pyriproxyfen 10% EC @ 2 ml/L or Flonicamid 50% WG @ 0.3 g/L. Spray directed at lower leaf surfaces.",
    source: "Punjab Agricultural University / ICAR"
  },
  {
    id: "pest_fall_armyworm",
    name: "Fall Armyworm - FAW (फॉल आर्मीवर्म / ફોલ આર્મીવોર્મ)",
    scientificName: "Spodoptera frugiperda",
    type: "Invasive Lepidopteran Pest",
    crops: ["Maize", "Sorghum", "Sugarcane", "Millets"],
    identification: "Larvae have inverted 'Y' shaped suture on head and 4 dark spots arranged in a square on the 8th abdominal segment.",
    symptoms: "Pinholes on emerging leaves; large ragged irregular holes and skeletonization in whorls; heavy accumulation of sawdust-like frass inside the central funnel.",
    etl: "5% damaged seedlings or 10% damaged plants during whorl stage.",
    cultural_control: "Deep summer ploughing; intercrop maize with pulses (Cowpea/Pigeonpea 2:1 ratio) or Desmodium; avoid staggered plantings.",
    mechanical_control: "Hand collection and destruction of egg masses and young larvae; install FAW pheromone traps @ 5/acre.",
    biological_control: "Release Telenomus remus @ 50,000/ha or spray entomopathogenic fungus Metarhizium rileyi @ 5 g/L.",
    chemical_precaution: "If whorl damage >10%: Direct application of Chlorantraniliprole 18.5% SC @ 0.4 ml/L or Emamectin Benzoate 5% SG @ 0.4 g/L into the whorl using knapsack sprayer with nozzle removed.",
    source: "ICAR-Indian Institute of Maize Research (IIMR) / FAO"
  },
  {
    id: "pest_thrips",
    name: "Chilli & Onion Thrips (थ्रिप्स / થ્રિપ્સ)",
    scientificName: "Scirtothrips dorsalis / Thrips tabaci",
    type: "Sucking Pest",
    crops: ["Chilli", "Onion", "Garlic", "Cotton", "Groundnut"],
    identification: "Slender, minute insects (<1.2 mm) with fringed feathery wings. Pale yellow to dark brown in color, active on buds and flowers.",
    symptoms: "Rasping of plant tissue and sucking exudates; leaf margins curl upward in boat shape; leaves become brittle, bronzed, and crinkled ('murda' disease); silver patches on onion foliage with black fecal specks.",
    etl: "5 to 10 thrips per plant / leaf.",
    cultural_control: "Grow 2-3 barrier border rows of maize or pearl millet around chilli fields; sprinkle water using overhead sprinklers to knock down thrips.",
    mechanical_control: "Install blue sticky traps @ 15-20 traps/acre (blue color attracts thrips significantly more than yellow).",
    biological_control: "Spray Verticillium lecanii (biopesticide) @ 5 g/L during humid evenings.",
    chemical_precaution: "Fipronil 5% SC @ 1.5 ml/L or Spinetoram 11.7% SC @ 1 ml/L. Always rotate chemical classes to avoid rapid resistance buildup.",
    source: "ICAR-IIHR Bengaluru"
  },
  {
    id: "pest_pod_borer",
    name: "Gram Pod Borer / Fruit Borer (चना फली छेदक / કાબરી ઇયળ)",
    scientificName: "Helicoverpa armigera",
    type: "Lepidopteran Borer",
    crops: ["Pulses (Gram, Tur)", "Tomato", "Chilli", "Cotton", "Maize"],
    identification: "Stout caterpillar, variable greenish to brownish with prominent lateral striped bands along body.",
    symptoms: "Larva feeds with head thrust inside the pod/fruit while remaining body hangs outside; circular entrance holes with hollowed-out seeds; drooping leaves and damaged floral buds.",
    etl: "1 larva per meter row length in gram OR 1 damaged fruit per plant in tomato.",
    cultural_control: "Install 'T' shaped wooden bird perches @ 20-25 per acre for insectivorous birds (e.g. drongo, king crow); plant marigold as trap crop (1:16 ratio).",
    mechanical_control: "Install Helicoverpa pheromone traps (Helilure) @ 5 traps/acre.",
    biological_control: "Spray HaNPV (Helicoverpa Nuclear Polyhedrosis Virus) @ 250 LE/acre with 0.1% jaggery in evening hours; apply Bacillus thuringiensis (Bt) @ 2 g/L.",
    chemical_precaution: "Chlorantraniliprole 18.5% SC @ 0.3 ml/L or Indoxacarb 14.5% SC @ 1 ml/L. Ensure spray reaches the developing pods and lower canopy.",
    source: "ICAR-IIPR Kanpur / DPPQS"
  },
  {
    id: "pest_yellow_stem_borer",
    name: "Rice Yellow Stem Borer (धान का तना छेदक / ડાંગરનો ગાભમારાની ઇયળ)",
    scientificName: "Scirpophaga incertulas",
    type: "Lepidopteran Borer",
    crops: ["Rice / Paddy"],
    identification: "Female moth has bright yellowish-brown forewings with a distinct black spot in the center and an anal tuft of yellowish-buff hairs. Larva is pale yellow.",
    symptoms: "'Dead Heart' during vegetative phase (central shoot dries and pulls out easily with chewed base); 'White Earhead' (chaffy, empty, bleached white panicles) during flowering phase.",
    etl: "2 egg masses/m² or 1 adult moth/m² or 5% dead hearts.",
    cultural_control: "Clip seedling leaf tips before transplanting to eliminate egg masses; raise water level for 24 hours to submerge borer entry holes; avoid excess nitrogen.",
    mechanical_control: "Install yellow stem borer pheromone traps @ 5 traps/acre.",
    biological_control: "Release Trichogramma japonicum egg parasitoid @ 40,000/acre at weekly intervals 3 times.",
    chemical_precaution: "Cartap Hydrochloride 4% G @ 10 kg/acre or Chlorantraniliprole 0.4% G @ 4 kg/acre broadcasted with standing 2-3 cm water.",
    source: "ICAR-NRRI Cuttack"
  }
];
