import React, { useState } from 'react';
import { 
  FlaskConical, 
  Sprout, 
  Calculator, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle, 
  Droplets, 
  FileText, 
  ShieldCheck, 
  Bot, 
  Sparkles 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import { useLanguage } from '../context/LanguageContext';

export default function SoilFertilizer() {
  const { language, t } = useLanguage();
  const [selectedCrop, setSelectedCrop] = useState('Cotton');
  const [customCropName, setCustomCropName] = useState('');
  const [acres, setAcres] = useState(2);
  const [soilType, setSoilType] = useState('Medium Black Soil');
  const [hasSoilCard, setHasSoilCard] = useState('no');
  const [organicCarbon, setOrganicCarbon] = useState('Medium (0.5 - 0.75%)');

  // Realistic ICAR Recommended Doses of Fertilizer (RDF in kg/acre)
  const CROP_FERTILIZER_RDF = {
    Cotton: { 
      nameEn: 'Cotton',
      nameHi: 'कपास',
      nameGu: 'કપાસ',
      n: 48, p: 24, k: 24, urea: 104, dap: 52, mop: 40, zinc: 10,
      splitsEn: "25% basal (all P & K), 35% at 35 DAS (square formation), 40% at 65 DAS (flowering)",
      splitsHi: "25% बुवाई समय (पूरा P और K), 35% 35 दिन पर, 40% 65 दिन (फूल अवस्था) पर",
      splitsGu: "૨૫% વાવણી વખતે (સમગ્ર P અને K), ૩૫% ૩૫ દિવસે (ચાપવા વખતે), ૪૦% ૬૫ દિવસે (ફૂલ-ઝીંડવા વખતે)"
    },
    Wheat: { 
      nameEn: 'Wheat',
      nameHi: 'गेहूं',
      nameGu: 'ઘઉં',
      n: 48, p: 24, k: 16, urea: 104, dap: 52, mop: 27, zinc: 10,
      splitsEn: "50% N + full P & K as basal; 25% at CRI stage (21 DAS); 25% at Jointing stage (45 DAS)",
      splitsHi: "50% N + पूरा P व K बुवाई समय; 25% CRI अवस्था (21 दिन); 25% गांठे बनते समय (45 दिन)",
      splitsGu: "૫૦% N + સમગ્ર P અને K વાવણી વખતે; ૨૫% CRI મુકુટ મૂળ વખતે (૨૧ દિવસે); ૨૫% ગાંઠો બનતી વખતે (૪૫ દિવસે)"
    },
    Rice: { 
      nameEn: 'Rice / Paddy',
      nameHi: 'धान / चावल',
      nameGu: 'ડાંગર / ચોખા',
      n: 40, p: 20, k: 20, urea: 87, dap: 43, mop: 33, zinc: 10,
      splitsEn: "50% N + full P & K basal at puddling; 25% at tillering; 25% at panicle emergence",
      splitsHi: "50% N + पूरा P व K रोपाई समय; 25% कल्ले फूटते समय; 25% बाली निकलते समय",
      splitsGu: "૫૦% N + સમગ્ર P અને K રોપણી વખતે; ૨૫% ફુટવે વખતે; ૨૫% કંકી નીકળતી વખતે"
    },
    Groundnut: { 
      nameEn: 'Groundnut',
      nameHi: 'मूंगफली',
      nameGu: 'મગફળી',
      n: 8, p: 16, k: 16, urea: 17, dap: 35, mop: 27, gypsum: 150,
      splitsEn: "Full N, P, K as basal; Apply Gypsum 150 kg/acre at 35-40 DAS during peg formation",
      splitsHi: "पूरा N, P, K बुवाई समय; 35-40 दिन पर सुइयां (Pegs) बनते समय 150 किग्रा जिप्सम डालें",
      splitsGu: "સમગ્ર N, P, K વાવણી વખતે પાયામાં; ૩૫-૪૦ દિવસે સોય બેસતી વખતે એકરે ૧૫૦ કિલો જિપ્સમ આપો"
    },
    Chilli: { 
      nameEn: 'Chilli',
      nameHi: 'मिर्च',
      nameGu: 'મરચી',
      n: 48, p: 24, k: 32, urea: 104, dap: 52, mop: 53, micronutrients: "Zinc + Boron",
      splitsEn: "30% basal, 30% vegetative (30 DAT), 40% fruiting splits through fertigation",
      splitsHi: "30% रोपाई समय, 30% 30 दिन बाद, 40% फलन अवस्था में ड्रिप द्वारा",
      splitsGu: "૩૦% રોપણી વખતે, ૩૦% ૩૦ દિવસે વૃદ્ધિ વખતે, ૪૦% ફળ બેસતી વખતે ડ્રિપ ફર્ટિગેશન દ્વારા"
    },
    Tomato: { 
      nameEn: 'Tomato',
      nameHi: 'टमाटर',
      nameGu: 'ટામેટા',
      n: 60, p: 32, k: 40, urea: 130, dap: 70, mop: 67, calciumNitrate: 25,
      splitsEn: "Basal full P, 30% N, 40% K; fertigate balance N and K weekly during harvest",
      splitsHi: "बुवाई समय पूरा P, 30% N, 40% K; शेष खाद तुड़ाई के समय साप्ताहिक ड्रिप से दें",
      splitsGu: "વાવણી વખતે સમગ્ર P, ૩૦% N, ૪૦% K; બાકીનો N અને K વીણી વખતે દર અઠવાડિયે ડ્રિપથી આપો"
    },
    Potato: { 
      nameEn: 'Potato',
      nameHi: 'आलू',
      nameGu: 'બટાટા',
      n: 60, p: 32, k: 40, urea: 130, dap: 70, mop: 67,
      splitsEn: "50% N + full P & K as basal; remaining 50% N at earthing-up (30-35 DAS)",
      splitsHi: "50% N + पूरा P व K बुवाई समय; शेष 50% N मिट्टी चढ़ाते समय (30-35 दिन)",
      splitsGu: "૫૦% N + સમગ્ર P અને K વાવણી વખતે; બાકીનો ૫૦% N પાળા ચડાવતી વખતે (૩૦-૩૫ દિવસે)"
    },
    Cumin: { 
      nameEn: 'Cumin',
      nameHi: 'जीरा',
      nameGu: 'જીરું',
      n: 8, p: 6, k: 0, urea: 17, dap: 13, mop: 0, sulphur: 10,
      splitsEn: "Basal only. Avoid excess nitrogen which increases blight susceptibility. Apply Sulphur.",
      splitsHi: "केवल बुवाई समय। अधिक यूरिया न दें जिससे चरमी रोग बढ़ता है। सल्फर अवश्य डालें।",
      splitsGu: "માત્ર વાવણી વખતે પાયામાં. વધારે યુરિયા ન આપવું જેથી કાળીયા/ચરમી રોગ અટકે. સલ્ફર અવશ્ય આપવું."
    },
    Mustard: { 
      nameEn: 'Mustard',
      nameHi: 'सरसों / राई',
      nameGu: 'રાઇ / સરસવ',
      n: 32, p: 16, k: 16, urea: 70, dap: 35, mop: 27, sulphur: 15,
      splitsEn: "50% N + full P, K, Sulphur basal; 50% N at first irrigation (30 DAS)",
      splitsHi: "50% N + पूरा P, K और सल्फर बुवाई समय; 50% N पहली सिंचाई (30 दिन) पर",
      splitsGu: "૫૦% N + સમગ્ર P, K અને સલ્ફર વાવણી વખતે; ૫૦% N પ્રથમ પિયત વખતે (૩૦ દિવસે)"
    },
    Onion: { 
      nameEn: 'Onion',
      nameHi: 'प्याज',
      nameGu: 'ડુંગળી',
      n: 40, p: 20, k: 25, urea: 85, dap: 43, mop: 42, sulphur: 15,
      splitsEn: "50% N + full P, K, Sulphur basal; 50% N in two top dressings at 30 & 45 DAT",
      splitsHi: "50% N + पूरा P, K और सल्फर रोपाई समय; 50% N 30 व 45 दिन पर दो बार में",
      splitsGu: "૫૦% N + સમગ્ર P, K અને સલ્ફર રોપણી વખતે; ૫૦% N ૩૦ અને ૪૫ દિવસે બે હપ્તામાં"
    },
    Garlic: { 
      nameEn: 'Garlic',
      nameHi: 'लहसुन',
      nameGu: 'લસણ',
      n: 40, p: 20, k: 20, urea: 85, dap: 43, mop: 33, sulphur: 20,
      splitsEn: "50% N + full P, K, Sulphur basal; remaining N at 30 and 45 DAS",
      splitsHi: "50% N + पूरा P, K, सल्फर बुवाई समय; शेष N 30 और 45 दिन पर दें",
      splitsGu: "૫૦% N + સમગ્ર P, K અને સલ્ફર વાવણી વખતે; બાકીનો N ૩૦ અને ૪૫ દિવસે આપો"
    },
    Sesame: { 
      nameEn: 'Sesame',
      nameHi: 'तिल',
      nameGu: 'તલ',
      n: 16, p: 10, k: 10, urea: 35, dap: 22, mop: 17, sulphur: 10,
      splitsEn: "Full P, K & 50% N basal; remaining 50% N at flowering stage",
      splitsHi: "पूरा P, K व 50% N बुवाई समय; शेष 50% N फूल आने पर",
      splitsGu: "સમગ્ર P, K અને ૫૦% N વાવણી વખતે; બાકીનો ૫૦% N ફૂલ આવતી વખતે"
    },
    Soybean: { 
      nameEn: 'Soybean',
      nameHi: 'सोयाबीन',
      nameGu: 'સોયાબીન',
      n: 12, p: 24, k: 16, urea: 26, dap: 52, mop: 27,
      splitsEn: "Full N, P, K as basal application with Rhizobium seed treatment",
      splitsHi: "राइजोबियम कल्चर बीज उपचार के साथ पूरा N, P, K बुवाई समय",
      splitsGu: "રાઈઝોબિયમ કલ્ચર બીજ માવજત સાથે સમગ્ર N, P, K વાવણી વખતે પાયામાં"
    },
    Other: { 
      nameEn: 'Other Crop (Custom)',
      nameHi: 'अन्य फसल (कस्टम)',
      nameGu: 'અન્ય પાક (કસ્ટમ)',
      n: 35, p: 20, k: 20, urea: 76, dap: 43, mop: 33,
      splitsEn: "Standard ICAR general baseline. Please use AI Assistant for exact variety-specific RDF.",
      splitsHi: "आईसीएआर सामान्य मानक। अपनी फसल के अनुसार सटीक मात्रा AI से प्राप्त करें।",
      splitsGu: "સામાન્ય ICAR આધારભૂત માત્રા. તમારા પાક મુજબ સચોટ ગણતરી AI સહાયક પાસેથી મેળવો."
    }
  };

  const activeRdf = CROP_FERTILIZER_RDF[selectedCrop] || CROP_FERTILIZER_RDF.Cotton;
  const totalUreaBags = Math.ceil((activeRdf.urea * acres) / 45); // 45 kg bag
  const totalDapBags = Math.ceil((activeRdf.dap * acres) / 50);   // 50 kg bag
  const totalMopBags = Math.ceil((activeRdf.mop * acres) / 50);   // 50 kg bag

  const getCropDisplayName = (c) => {
    const item = CROP_FERTILIZER_RDF[c];
    if (!item) return c;
    if (language === 'gu') return item.nameGu || item.nameEn;
    if (language === 'hi') return item.nameHi || item.nameEn;
    return item.nameEn;
  };

  const activeSplits = language === 'gu' ? activeRdf.splitsGu : language === 'hi' ? activeRdf.splitsHi : activeRdf.splitsEn;
  const targetCropDisplay = selectedCrop === 'Other' && customCropName ? `${customCropName}` : getCropDisplayName(selectedCrop);

  return (
    <div className="container page-container">
      <Breadcrumbs items={[{ label: t.shortcuts.soil }]} />

      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2.2rem', color: '#14532D', marginBottom: '8px' }}>
          {t.soilPage.title}
        </h1>
        <p style={{ color: '#647067', margin: 0, fontSize: '1rem', maxWidth: '820px' }}>
          {t.soilPage.subtitle}
        </p>
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        {/* Left Column: Farm Parameters Form */}
        <div className="card">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#14532D' }}>
            <Calculator size={20} color="#166534" />
            <span>{t.soilPage.farmParams}</span>
          </h2>

          <div className="form-group">
            <label className="form-label">
              {t.soilPage.selectCrop}
            </label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="form-select"
            >
              {Object.keys(CROP_FERTILIZER_RDF).map((c) => (
                <option key={c} value={c}>
                  {getCropDisplayName(c)}
                </option>
              ))}
            </select>
          </div>

          {selectedCrop === 'Other' && (
            <div className="form-group" style={{ background: '#FFFBEB', padding: '12px', borderRadius: '8px', border: '1px solid #FDE68A' }}>
              <label className="form-label" style={{ color: '#92400E', fontWeight: '700' }}>
                {t.soilPage.customCropLabel}
              </label>
              <input
                type="text"
                className="form-input"
                placeholder={t.soilPage.customCropPlaceholder}
                value={customCropName}
                onChange={(e) => setCustomCropName(e.target.value)}
              />
              <span style={{ fontSize: '0.75rem', color: '#B45309', display: 'block', marginTop: '4px' }}>
                {t.soilPage.customCropTip}
              </span>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">
              {t.soilPage.landArea} {acres} {acres > 1 ? t.soilPage.acresPlural : t.soilPage.acres}
            </label>
            <input
              type="range"
              min="1"
              max="25"
              step="0.5"
              value={acres}
              onChange={(e) => setAcres(parseFloat(e.target.value))}
              style={{ accentColor: '#166534', width: '100%', cursor: 'pointer' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t.soilPage.soilTexture}</label>
            <select
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
              className="form-select"
            >
              <option value="Medium Black Soil">{t.soilPage.soilBlack}</option>
              <option value="Sandy Loam">{t.soilPage.soilSandy}</option>
              <option value="Clayey Loam">{t.soilPage.soilClayey}</option>
              <option value="Red / Laterite Soil">{t.soilPage.soilRed}</option>
              <option value="Saline / Sodic Soil">{t.soilPage.soilSaline}</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">{t.soilPage.soilCardQ}</label>
            <select
              value={hasSoilCard}
              onChange={(e) => setHasSoilCard(e.target.value)}
              className="form-select"
            >
              <option value="no">{t.soilPage.noShc}</option>
              <option value="yes">{t.soilPage.yesShc}</option>
            </select>
          </div>

          {hasSoilCard === 'yes' && (
            <div className="form-group">
              <label className="form-label">{t.soilPage.ocLevel}</label>
              <select
                value={organicCarbon}
                onChange={(e) => setOrganicCarbon(e.target.value)}
                className="form-select"
              >
                <option value="Low (< 0.5%)">{t.soilPage.ocLow}</option>
                <option value="Medium (0.5 - 0.75%)">{t.soilPage.ocMed}</option>
                <option value="High (> 0.75%)">{t.soilPage.ocHigh}</option>
              </select>
            </div>
          )}

          <div style={{ background: '#F0FDF4', padding: '14px', borderRadius: '10px', border: '1px solid #BBF7D0', marginTop: '16px' }}>
            <span style={{ fontSize: '0.82rem', color: '#166534', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <ShieldCheck size={16} /> {t.soilPage.fymMandate}
            </span>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#14532D', lineHeight: 1.5 }}>
              {t.soilPage.fymText}
            </p>
          </div>
        </div>

        {/* Right Column: Fertilizer Calculation & Application Schedule */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card" style={{ border: '2px solid #BBF7D0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid #E1EAE2', paddingBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', color: '#14532D', margin: 0 }}>
                  {t.soilPage.reqTitle} {acres} {acres > 1 ? t.soilPage.acresPlural : t.soilPage.acres}
                </h3>
                <span style={{ fontSize: '0.82rem', color: '#647067' }}>
                  {t.soilPage.targetCropLabel} <strong style={{ color: '#166534' }}>{targetCropDisplay}</strong>
                </span>
              </div>
              <span className="badge badge-green">{t.soilPage.icarBadge}</span>
            </div>

            {/* Bag Count Breakdown */}
            <div className="grid-3" style={{ marginBottom: '20px' }}>
              <div style={{ background: '#F8FAF9', padding: '16px', borderRadius: '12px', border: '1px solid #E1EAE2', textAlign: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: '#647067', fontWeight: '700', textTransform: 'uppercase' }}>{t.soilPage.urea}</span>
                <span style={{ fontSize: '1.8rem', fontWeight: '800', color: '#166534', display: 'block', margin: '4px 0' }}>
                  {totalUreaBags}
                </span>
                <span style={{ fontSize: '0.78rem', color: '#647067' }}>{t.soilPage.bags45}</span>
              </div>

              <div style={{ background: '#F8FAF9', padding: '16px', borderRadius: '12px', border: '1px solid #E1EAE2', textAlign: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: '#647067', fontWeight: '700', textTransform: 'uppercase' }}>{t.soilPage.dap}</span>
                <span style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0284C7', display: 'block', margin: '4px 0' }}>
                  {totalDapBags}
                </span>
                <span style={{ fontSize: '0.78rem', color: '#647067' }}>{t.soilPage.bags50}</span>
              </div>

              <div style={{ background: '#F8FAF9', padding: '16px', borderRadius: '12px', border: '1px solid #E1EAE2', textAlign: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: '#647067', fontWeight: '700', textTransform: 'uppercase' }}>{t.soilPage.mop}</span>
                <span style={{ fontSize: '1.8rem', fontWeight: '800', color: '#D97706', display: 'block', margin: '4px 0' }}>
                  {totalMopBags}
                </span>
                <span style={{ fontSize: '0.78rem', color: '#647067' }}>{t.soilPage.bags50}</span>
              </div>
            </div>

            {/* Application Timing & Splits */}
            <div>
              <strong style={{ fontSize: '0.92rem', color: '#166534', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <Droplets size={16} /> {t.soilPage.splitsTitle}
              </strong>
              <div style={{ background: '#F0FDF4', padding: '14px', borderRadius: '10px', border: '1px solid #BBF7D0', fontSize: '0.88rem', color: '#14532D', lineHeight: 1.6 }}>
                {activeSplits}
              </div>
            </div>

            {/* Micronutrients / Special supplements */}
            <div style={{ marginTop: '16px', fontSize: '0.86rem', color: '#4B5563', lineHeight: 1.5 }}>
              {activeRdf.zinc && (
                <div>• <strong>{language === 'gu' ? 'ઝિંક સલ્ફેટ (૨૧%):' : 'Zinc Sulphate (21% Zn):'}</strong> {language === 'gu' ? `પાયામાં ${activeRdf.zinc * acres} કિલો વાપરો. ઝિંક અને DAP ક્યારેય એક જ થેલીમાં ભેગા ન કરવા.` : `Apply ${activeRdf.zinc * acres} kg in basal dose. Do NOT mix Zinc directly with DAP.`}</div>
              )}
              {activeRdf.sulphur && (
                <div>• <strong>{language === 'gu' ? 'કૃષિ સલ્ફર:' : 'Agricultural Sulphur:'}</strong> {language === 'gu' ? `તેલ અને તીખાશ વધારવા એકરે ${activeRdf.sulphur * acres} કિલો વાપરો.` : `Apply ${activeRdf.sulphur * acres} kg/acre for oil synthesis and pungency.`}</div>
              )}
              {activeRdf.gypsum && (
                <div>• <strong>{language === 'gu' ? 'કૃષિ જિપ્સમ:' : 'Agricultural Gypsum:'}</strong> {language === 'gu' ? `કેલ્શિયમ અને દાણાના વિકાસ માટે એકરે ${activeRdf.gypsum * acres} કિલો વાપરો.` : `Apply ${activeRdf.gypsum * acres} kg/acre for calcium enrichment.`}</div>
              )}
            </div>
          </div>

          {/* Direct Consultation Link */}
          <div className="card card-soft" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px' }}>
            <div>
              <h4 style={{ margin: 0, fontSize: '1.05rem', color: '#14532D' }}>
                {t.soilPage.needAiHelp}
              </h4>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.85rem', color: '#647067' }}>
                {language === 'gu' 
                  ? `${targetCropDisplay} માટે ડ્રિપ અને ખાતરનું વિગતવાર માર્ગદર્શન SEHAT AI પાસેથી મેળવો.`
                  : t.soilPage.needAiDesc}
              </p>
            </div>
            <Link 
              to={`/ai-assistant?crop=${encodeURIComponent(targetCropDisplay)}&q=${encodeURIComponent(
                language === 'gu' 
                  ? `${targetCropDisplay} પાક માટે ${acres} એકરમાં ખાતર, યુરિયા, ડીએપી અને ડ્રિપનું સમયપત્રક આપો.` 
                  : `What is the optimal fertilizer, RDF dose and fertigation schedule for ${targetCropDisplay} for ${acres} acres?`
              )}`} 
              className="btn btn-primary btn-sm"
            >
              <Bot size={16} />
              <span>{t.soilPage.askAiBtn}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
