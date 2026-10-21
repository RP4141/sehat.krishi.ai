import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Bot, 
  Stethoscope, 
  BookOpen, 
  TrendingUp, 
  CloudSun, 
  Landmark, 
  FlaskConical, 
  Bug, 
  ArrowRight, 
  Sparkles, 
  CheckCircle, 
  ShieldCheck, 
  Camera, 
  Search,
  PhoneCall,
  Calendar,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { CROPS, getCropName, getCropSeason, getCropDuration } from '../data/cropData';

export default function Home() {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');

  const handleAskSubmit = (e) => {
    e.preventDefault();
    if (question.trim()) {
      navigate(`/ai-assistant?q=${encodeURIComponent(question.trim())}`);
    }
  };

  const handleExampleClick = (exampleText) => {
    setQuestion(exampleText);
    navigate(`/ai-assistant?q=${encodeURIComponent(exampleText)}`);
  };

  const featuredCrops = CROPS.slice(0, 6);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-grid">
            {/* Left Content */}
            <div>
              <div className="hero-badge-wrap">
                <span className="badge badge-green">
                  <Sparkles size={13} /> {t.hero.badge}
                </span>
              </div>
              <h1 className="hero-title">
                {t.hero.title}
              </h1>
              <p className="hero-subtitle">
                {t.hero.subtitle}
              </p>

              {/* AI Question Box */}
              <form onSubmit={handleAskSubmit} className="hero-search-box">
                <div className="hero-search-input-group">
                  <Bot size={22} color="#166534" />
                  <input
                    type="text"
                    className="hero-search-input"
                    placeholder={t.hero.askPlaceholder}
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                  />
                  <button type="submit" className="btn btn-primary">
                    <span>{t.hero.askButton}</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </form>

              {/* Example Question Chips */}
              <div className="example-questions-wrap">
                <span className="example-label">{t.hero.exampleTitle}</span>
                <div className="example-chips">
                  {t.hero.examples.map((ex, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="chip-btn"
                      onClick={() => handleExampleClick(ex)}
                    >
                      <Search size={12} color="#166534" />
                      <span>{ex}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Card / Visual */}
            <div>
              <div className="hero-feature-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#166534' }}>
                      <Stethoscope size={22} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{t.hero.cropDoctorTitle}</h3>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: '#647067' }}>{t.hero.cropDoctorSubtitle}</p>
                    </div>
                  </div>
                  <span className="badge badge-green">{t.hero.liveVision}</span>
                </div>

                <p style={{ fontSize: '0.9rem', color: '#647067', lineHeight: 1.6, marginBottom: '20px' }}>
                  {t.hero.cropDoctorDesc}
                </p>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <Link to="/crop-diseases" className="btn btn-primary" style={{ flex: 1 }}>
                    <Camera size={16} />
                    <span>{t.hero.uploadPhoto}</span>
                  </Link>
                  <Link to="/crop-guide" className="btn btn-secondary">
                    <span>{t.hero.browseCrops}</span>
                  </Link>
                </div>

                <div className="feature-stats-row">
                  <div className="stat-item">
                    <span className="stat-num">12+</span>
                    <span className="stat-lbl">{t.hero.statCrops}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-num">100%</span>
                    <span className="stat-lbl">{t.hero.statIcar}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-num">3</span>
                    <span className="stat-lbl">{t.hero.statLangs}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Shortcuts / Features */}
      <section style={{ padding: '72px 0', background: '#FFFFFF' }}>
        <div className="container">
          <div className="section-head center">
            <span className="section-eyebrow">Comprehensive Toolkit</span>
            <h2 className="section-title">Built for Practical Agricultural Decisions</h2>
            <p className="section-subtitle">
              From soil testing and sowing schedules to real-time market rates and pest management, access scientifically validated agricultural tools.
            </p>
          </div>

          <div className="grid-3">
            {/* Shortcut 1 */}
            <Link to="/crop-diseases" className="card card-interactive">
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#166534', marginBottom: '16px' }}>
                <Stethoscope size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>{t.shortcuts.diseaseDoctor}</h3>
              <p style={{ fontSize: '0.9rem', color: '#647067', marginBottom: '16px', lineHeight: 1.6 }}>
                {t.shortcuts.diseaseDoctorDesc}
              </p>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', fontWeight: '600', color: '#166534' }}>
                <span>Diagnose Crop</span> <ChevronRight size={16} />
              </div>
            </Link>

            {/* Shortcut 2 */}
            <Link to="/crop-guide" className="card card-interactive">
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B45309', marginBottom: '16px' }}>
                <BookOpen size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>{t.shortcuts.cropGuide}</h3>
              <p style={{ fontSize: '0.9rem', color: '#647067', marginBottom: '16px', lineHeight: 1.6 }}>
                {t.shortcuts.cropGuideDesc}
              </p>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', fontWeight: '600', color: '#166534' }}>
                <span>Explore Guides</span> <ChevronRight size={16} />
              </div>
            </Link>

            {/* Shortcut 3 */}
            <Link to="/market-prices" className="card card-interactive">
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1E40AF', marginBottom: '16px' }}>
                <TrendingUp size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>{t.shortcuts.mandi}</h3>
              <p style={{ fontSize: '0.9rem', color: '#647067', marginBottom: '16px', lineHeight: 1.6 }}>
                {t.shortcuts.mandiDesc}
              </p>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', fontWeight: '600', color: '#166534' }}>
                <span>Check Mandi Rates</span> <ChevronRight size={16} />
              </div>
            </Link>

            {/* Shortcut 4 */}
            <Link to="/weather" className="card card-interactive">
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#FCE7F3', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#BE185D', marginBottom: '16px' }}>
                <CloudSun size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>{t.shortcuts.weather}</h3>
              <p style={{ fontSize: '0.9rem', color: '#647067', marginBottom: '16px', lineHeight: 1.6 }}>
                {t.shortcuts.weatherDesc}
              </p>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', fontWeight: '600', color: '#166534' }}>
                <span>View Weather Alerts</span> <ChevronRight size={16} />
              </div>
            </Link>

            {/* Shortcut 5 */}
            <Link to="/soil-fertilizer" className="card card-interactive">
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#EDE9FE', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6D28D9', marginBottom: '16px' }}>
                <FlaskConical size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>{t.shortcuts.soil}</h3>
              <p style={{ fontSize: '0.9rem', color: '#647067', marginBottom: '16px', lineHeight: 1.6 }}>
                {t.shortcuts.soilDesc}
              </p>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', fontWeight: '600', color: '#166534' }}>
                <span>Calculate Fertilizer</span> <ChevronRight size={16} />
              </div>
            </Link>

            {/* Shortcut 6 */}
            <Link to="/government-schemes" className="card card-interactive">
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#15803D', marginBottom: '16px' }}>
                <Landmark size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>{t.shortcuts.schemes}</h3>
              <p style={{ fontSize: '0.9rem', color: '#647067', marginBottom: '16px', lineHeight: 1.6 }}>
                {t.shortcuts.schemesDesc}
              </p>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', fontWeight: '600', color: '#166534' }}>
                <span>Explore Schemes</span> <ChevronRight size={16} />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Crops of Indian Agriculture */}
      <section style={{ padding: '64px 0', background: 'var(--bg-soft-green)', borderTop: '1px solid var(--border-light)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '32px' }}>
            <div>
              <span className="section-eyebrow">Agronomic Excellence</span>
              <h2 className="section-title">Major Indian Crops Guide</h2>
            </div>
            <Link to="/crop-guide" className="btn btn-secondary btn-sm">
              <span>View All 12 Crops</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid-3">
            {featuredCrops.map((crop) => (
              <div key={crop.id} className="card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '1.15rem' }}>{getCropName(crop, language)}</h3>
                  <span className="badge badge-green">{getCropSeason(crop, language)}</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#647067', fontStyle: 'italic', marginBottom: '12px' }}>
                  {crop.scientificName}
                </p>
                <div style={{ fontSize: '0.86rem', color: '#17251B', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
                  <div><strong>{t.cropGuide.duration}:</strong> {getCropDuration(crop, language)}</div>
                  <div><strong>{t.cropGuide.soil}:</strong> {crop.soil.split(';')[0]}</div>
                  <div><strong>{t.cropGuide.sowing}:</strong> {crop.sowingWindow.split('/')[0]}</div>
                </div>
                <Link to={`/crop-guide/${crop.id}`} className="btn btn-soft btn-sm" style={{ width: '100%' }}>
                  <span>{t.cropGuide.viewDetails}</span>
                  <ChevronRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Verified Seasonal Agronomic Advisory Banner */}
      <section style={{ padding: '60px 0', background: '#FFFFFF' }}>
        <div className="container">
          <div className="card card-soft" style={{ padding: '36px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ background: '#DCFCE7', padding: '8px', borderRadius: '10px', color: '#166534' }}>
                <Calendar size={22} />
              </div>
              <div>
                <span className="badge badge-green">Seasonal Advisory</span>
                <h3 style={{ fontSize: '1.4rem', margin: '4px 0 0 0', color: '#14532D' }}>
                  October Transition Advisory (Kharif Harvesting & Rabi Sowing)
                </h3>
              </div>
            </div>

            <div className="grid-3" style={{ marginTop: '20px' }}>
              <div style={{ background: '#fff', padding: '18px', borderRadius: '12px', border: '1px solid #E1EAE2' }}>
                <h4 style={{ fontSize: '1rem', color: '#166534', marginBottom: '8px' }}>Cotton & Groundnut Harvest</h4>
                <p style={{ fontSize: '0.88rem', color: '#647067', margin: 0, lineHeight: 1.6 }}>
                  Pick cotton bolls during dry afternoon hours. Sundry harvested groundnut pods to below 9% moisture content before storage to prevent aflatoxin contamination.
                </p>
              </div>
              <div style={{ background: '#fff', padding: '18px', borderRadius: '12px', border: '1px solid #E1EAE2' }}>
                <h4 style={{ fontSize: '1rem', color: '#166534', marginBottom: '8px' }}>Rabi Field Prep (Wheat & Mustard)</h4>
                <p style={{ fontSize: '0.88rem', color: '#647067', margin: 0, lineHeight: 1.6 }}>
                  Complete early sowing of Mustard by October 20 to escape peak aphid attacks. Perform pre-sowing irrigation (Palewa) for timely wheat sowing in November.
                </p>
              </div>
              <div style={{ background: '#fff', padding: '18px', borderRadius: '12px', border: '1px solid #E1EAE2' }}>
                <h4 style={{ fontSize: '1rem', color: '#166534', marginBottom: '8px' }}>Cumin & Potato Sowing Window</h4>
                <p style={{ fontSize: '0.88rem', color: '#647067', margin: 0, lineHeight: 1.6 }}>
                  In North Gujarat and Rajasthan, prepare disease-free seed tubers for potato planting. Cumin seed treatment with Trichoderma viride is strongly recommended.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How the AI Engine Works */}
      <section style={{ padding: '72px 0', background: 'var(--bg-soft-green)' }}>
        <div className="container">
          <div className="section-head center">
            <span className="section-eyebrow">Trust & Transparency</span>
            <h2 className="section-title">How SEHAT-KRISHI AI Operates</h2>
            <p className="section-subtitle">
              Unlike generic chatbots that hallucinate recommendations, our engine enforces rigorous agricultural grounding and safety checks.
            </p>
          </div>

          <div className="grid-4">
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#DCFCE7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontWeight: '800' }}>
                1
              </div>
              <h4 style={{ fontSize: '1.05rem', marginBottom: '8px' }}>Question Analysis</h4>
              <p style={{ fontSize: '0.85rem', color: '#647067', lineHeight: 1.5 }}>
                Detects crop, growth stage, symptoms, and regional context in Hindi, Gujarati, or English.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#DCFCE7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontWeight: '800' }}>
                2
              </div>
              <h4 style={{ fontSize: '1.05rem', marginBottom: '8px' }}>Evidence Retrieval</h4>
              <p style={{ fontSize: '0.85rem', color: '#647067', lineHeight: 1.5 }}>
                Retrieves verified knowledge from ICAR, KVK, and State University pest advisories.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#DCFCE7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontWeight: '800' }}>
                3
              </div>
              <h4 style={{ fontSize: '1.05rem', marginBottom: '8px' }}>Safety Guardrails</h4>
              <p style={{ fontSize: '0.85rem', color: '#647067', lineHeight: 1.5 }}>
                Enforces IPM hierarchy (Cultural & Biological before synthetic chemicals) and dosage safety.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#DCFCE7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontWeight: '800' }}>
                4
              </div>
              <h4 style={{ fontSize: '1.05rem', marginBottom: '8px' }}>Actionable Guidance</h4>
              <p style={{ fontSize: '0.85rem', color: '#647067', lineHeight: 1.5 }}>
                Returns clear step-by-step advice with follow-up recommendations and KVK citations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section style={{ padding: '64px 0', background: 'linear-gradient(135deg, #14532D, #166534)', color: '#fff' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#fff', fontSize: '2.4rem', marginBottom: '16px' }}>
            Empower Your Farm with Intelligent Guidance Today
          </h2>
          <p style={{ color: '#DCFCE7', fontSize: '1.05rem', maxWidth: '640px', margin: '0 auto 32px', lineHeight: 1.6 }}>
            Ask questions, upload crop photos, monitor your district's weather alerts, and track daily mandi market rates.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <Link to="/ai-assistant" className="btn btn-primary btn-lg" style={{ background: '#22C55E' }}>
              <Bot size={20} />
              <span>Start Free AI Consultation</span>
            </Link>
            <Link to="/crop-diseases" className="btn btn-secondary btn-lg" style={{ background: 'transparent', color: '#fff', borderColor: '#BBF7D0' }}>
              <Camera size={20} />
              <span>Scan Crop Photo</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
