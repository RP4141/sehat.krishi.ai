import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Phone, ShieldCheck, Heart, ExternalLink, HelpCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { language, t } = useLanguage();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Col */}
          <div>
            <div className="footer-brand-title">
              <img src="/logo-icon.png" alt="SEHAT-KRISHI AI" style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1.5px solid #22c55e', background: '#fff', objectFit: 'cover' }} />
              <span>{t.brandName}</span>
            </div>
            <p className="footer-brand-desc">
              {language === 'gu'
                ? 'ભારતીય અને ખાસ કરીને ગુજરાતના ખેડૂતો માટે અદ્યતન ડિજિટલ કૃષિ માર્ગદર્શન. ICAR-પ્રમાણિત વાવેતર પદ્ધતિ, લાઈવ AI રોગ નિદાન અને APMC બજાર ભાવ.'
                : language === 'hi'
                ? 'भारतीय किसानों के लिए अगली पीढ़ी का कृषि मार्गदर्शक। आईसीएआर प्रमाणित फसल सलाह, एआई रोग पहचान और दैनिक मंडी भाव।'
                : 'Next-generation agricultural intelligence designed for Indian farmers. Providing verified ICAR-aligned cultivation advice, real-time AI disease diagnosis, APMC mandi rates, and official government scheme navigation.'}
            </p>
            <div className="footer-emergency-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', fontWeight: '700', color: '#22C55E' }}>
                <Phone size={16} />
                <span>{language === 'gu' ? 'કિસાન કૉલ સેન્ટર (સરકારી હેલ્પલાઇન)' : language === 'hi' ? 'किसान कॉल सेंटर (सरकारी हेल्पलाइन)' : 'Kisan Call Centre (Government Helpline)'}</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.82rem' }}>
                {language === 'gu'
                  ? 'ટોલ-ફ્રી: 1800-180-1551 (તમામ ભારતીય ભાષાઓમાં, સવારે 6 થી રાત્રે 10)'
                  : language === 'hi'
                  ? 'टोल-फ्री: 1800-180-1551 (सभी भारतीय भाषाओं में, सुबह 6 से रात 10 बजे)'
                  : 'Toll-Free: 1800-180-1551 (All Indian Languages, 6:00 AM – 10:00 PM Daily)'}
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-col-title">{t.nav.aiTools}</h4>
            <ul className="footer-links-list">
              <li><Link to="/ai-assistant" className="footer-link">{t.nav.aiAssistant}</Link></li>
              <li><Link to="/crop-diseases" className="footer-link">{t.nav.cropDiseases}</Link></li>
              <li><Link to="/crop-guide" className="footer-link">{t.nav.cropGuide}</Link></li>
              <li><Link to="/pest-control" className="footer-link">{t.nav.pestControl}</Link></li>
              <li><Link to="/soil-fertilizer" className="footer-link">{t.nav.soilFertilizer}</Link></li>
            </ul>
          </div>

          {/* Market & Portals */}
          <div>
            <h4 className="footer-col-title">{t.nav.mandiWeather}</h4>
            <ul className="footer-links-list">
              <li><Link to="/weather" className="footer-link">{t.nav.weather}</Link></li>
              <li><Link to="/market-prices" className="footer-link">{t.nav.marketPrices}</Link></li>
              <li><Link to="/government-schemes" className="footer-link">{t.nav.governmentSchemes}</Link></li>
              <li><Link to="/my-farm" className="footer-link">{t.nav.myFarm}</Link></li>
              <li><Link to="/about" className="footer-link">{t.nav.about}</Link></li>
              <li><Link to="/contact" className="footer-link">{t.nav.contact}</Link></li>
            </ul>
          </div>

          {/* Institutional Trust & Ethics */}
          <div>
            <h4 className="footer-col-title">
              {language === 'gu' ? 'વૈજ્ઞાનિક વિશ્વસનીયતા' : language === 'hi' ? 'वैज्ञानिक प्रामाणिकता' : 'Scientific Integrity'}
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#A3C9AE', lineHeight: 1.6, marginBottom: '14px' }}>
              {language === 'gu'
                ? 'તમામ કૃષિ માહિતી અને દવાની માત્રા ભારતીય કૃષિ અનુસંધાન પરિષદ (ICAR) અને રાજ્ય કૃષિ યુનિવર્સિટીઓના ધોરણો આધારિત છે.'
                : language === 'hi'
                ? 'सभी कृषि आंकड़े, कीट सीमा (ETL) और उर्वरक अनुपात भारतीय कृषि अनुसंधान परिषद (ICAR) मानकों पर आधारित हैं।'
                : 'All agronomic data, pest thresholds (ETL), and fertilizer ratios are grounded in standards from the Indian Council of Agricultural Research (ICAR) and State Agricultural Universities.'}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#82A98E' }}>
                <ShieldCheck size={14} color="#22C55E" /> {language === 'gu' ? 'ખેડૂત સુરક્ષા અને ગોપનીયતા' : language === 'hi' ? 'किसान सुरक्षा एवं गोपनीयता' : 'Server-side security & privacy protection'}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#82A98E' }}>
                <ShieldCheck size={14} color="#22C55E" /> {language === 'gu' ? 'અધિકૃત અને સચોટ દવા ભલામણ' : language === 'hi' ? 'प्रमाणित रासायनिक एवं जैविक सुझाव' : 'No fabricated chemical recommendations'}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} {t.brandName}. {language === 'gu' ? 'ભારતના મહેનતુ ખેડૂતો માટે સમર્પિત.' : language === 'hi' ? 'भारत के अन्नदाता किसानों के लिए समर्पित।' : 'Built for the hardworking farmers of India.'}
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <Link to="/about" className="footer-link">{t.nav.about}</Link>
            <Link to="/admin" className="footer-link" style={{ color: '#22C55E', fontWeight: '600' }}>{t.nav.admin}</Link>
            <Link to="/contact" className="footer-link">{t.nav.contact}</Link>
            <a href="https://icar.org.in" target="_blank" rel="noopener noreferrer" className="footer-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              ICAR Official <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
