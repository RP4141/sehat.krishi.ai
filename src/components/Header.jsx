import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { 
  Sprout, 
  Bot, 
  Stethoscope, 
  BookOpen, 
  Bug, 
  FlaskConical, 
  CloudSun, 
  TrendingUp, 
  Landmark, 
  Tractor, 
  Key, 
  Menu, 
  X, 
  User, 
  LogOut,
  ChevronDown,
  ShieldCheck,
  Sparkles,
  Layers,
  PhoneCall,
  Info
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useApiKey } from '../context/ApiKeyContext';

export default function Header() {
  const { language, setLanguage, t } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const { isConfigured, setKeyModalOpen } = useApiKey();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  // Controlled Dropdown States (stays static on hover/click, never vanishes prematurely)
  const [activeDropdown, setActiveDropdown] = useState(null); // 'ai' | 'crops' | 'market' | null
  const [isPinned, setIsPinned] = useState(false);
  const timeoutRef = useRef(null);
  const headerRef = useRef(null);

  const clearCloseTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleMouseEnter = (name) => {
    clearCloseTimeout();
    if (!isPinned || activeDropdown === name) {
      setActiveDropdown(name);
    }
  };

  const handleMouseLeave = () => {
    clearCloseTimeout();
    if (!isPinned) {
      timeoutRef.current = setTimeout(() => {
        setActiveDropdown(null);
      }, 250);
    }
  };

  const handleDropdownClick = (name, e) => {
    e.preventDefault();
    e.stopPropagation();
    clearCloseTimeout();

    if (activeDropdown === name) {
      if (isPinned) {
        // Clicking an already pinned dropdown closes it
        setActiveDropdown(null);
        setIsPinned(false);
      } else {
        // Dropdown was opened on hover, clicking it pins it STATIC so it won't close on mouse leave!
        setIsPinned(true);
      }
    } else {
      // Open and pin clicked dropdown
      setActiveDropdown(name);
      setIsPinned(true);
    }
  };

  const closeDrawerAndDropdowns = () => {
    clearCloseTimeout();
    setActiveDropdown(null);
    setIsPinned(false);
    setMobileMenuOpen(false);
  };

  // Close when clicking outside header or pressing Escape
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        closeDrawerAndDropdowns();
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeDrawerAndDropdowns();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      clearCloseTimeout();
    };
  }, []);

  // Auto-close on page navigation
  useEffect(() => {
    closeDrawerAndDropdowns();
  }, [location.pathname]);

  return (
    <header className="site-header" ref={headerRef}>
      <div className="header-container">
        <div className="header-inner">
          {/* Brand Logo */}
          <Link to="/" className="brand-logo-link" onClick={closeDrawerAndDropdowns}>
            <div className="brand-logo-wrap">
              <img src="/logo-icon.png" alt="SEHAT-KRISHI AI Logo" className="brand-logo-img" />
            </div>
            <div className="brand-text-group">
              <div className="brand-title">
                SEHAT-KRISHI <span>AI</span>
              </div>
              <div className="brand-subtitle">{t.tagline}</div>
            </div>
          </Link>

          {/* Clean Desktop Navigation with Grouped Dropdowns */}
          <nav className="desktop-nav">
            {/* 1. Home */}
            <NavLink to="/" className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`} end onClick={closeDrawerAndDropdowns}>
              {t.nav.home}
            </NavLink>

            {/* 2. AI Tools Dropdown */}
            <div 
              className="nav-dropdown-wrapper"
              onMouseEnter={() => handleMouseEnter('ai')}
              onMouseLeave={handleMouseLeave}
            >
              <button 
                type="button" 
                className={`nav-btn dropdown-toggle ${activeDropdown === 'ai' ? 'open' : ''}`}
                onClick={(e) => handleDropdownClick('ai', e)}
                aria-expanded={activeDropdown === 'ai'}
              >
                <Bot size={16} color="#166534" />
                <span>{t.nav.aiTools}</span>
                <ChevronDown size={14} className="chevron-icon" />
              </button>

              {activeDropdown === 'ai' && (
                <div className="dropdown-menu">
                  <Link to="/crop-diseases" className="dropdown-item" onClick={closeDrawerAndDropdowns}>
                    <div className="dropdown-icon-box" style={{ background: '#DCFCE7', color: '#166534' }}>
                      <Stethoscope size={18} />
                    </div>
                    <div>
                      <div className="dropdown-title">{t.nav.cropDiseases}</div>
                      <div className="dropdown-desc">{t.nav.cropDiseasesDesc}</div>
                    </div>
                  </Link>

                  <Link to="/ai-assistant" className="dropdown-item" onClick={closeDrawerAndDropdowns}>
                    <div className="dropdown-icon-box" style={{ background: '#EFF6FF', color: '#1D4ED8' }}>
                      <Bot size={18} />
                    </div>
                    <div>
                      <div className="dropdown-title">{t.nav.aiAssistant}</div>
                      <div className="dropdown-desc">{t.nav.aiAssistantDesc}</div>
                    </div>
                  </Link>

                  <Link to="/soil-fertilizer" className="dropdown-item" onClick={closeDrawerAndDropdowns}>
                    <div className="dropdown-icon-box" style={{ background: '#FAF5FF', color: '#7E22CE' }}>
                      <FlaskConical size={18} />
                    </div>
                    <div>
                      <div className="dropdown-title">{t.nav.soilFertilizer}</div>
                      <div className="dropdown-desc">{t.nav.soilFertilizerDesc}</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* 3. Crops & Pests Dropdown */}
            <div 
              className="nav-dropdown-wrapper"
              onMouseEnter={() => handleMouseEnter('crops')}
              onMouseLeave={handleMouseLeave}
            >
              <button 
                type="button" 
                className={`nav-btn dropdown-toggle ${activeDropdown === 'crops' ? 'open' : ''}`}
                onClick={(e) => handleDropdownClick('crops', e)}
                aria-expanded={activeDropdown === 'crops'}
              >
                <BookOpen size={16} color="#166534" />
                <span>{t.nav.cropsPests}</span>
                <ChevronDown size={14} className="chevron-icon" />
              </button>

              {activeDropdown === 'crops' && (
                <div className="dropdown-menu">
                  <Link to="/crop-guide" className="dropdown-item" onClick={closeDrawerAndDropdowns}>
                    <div className="dropdown-icon-box" style={{ background: '#FEF3C7', color: '#B45309' }}>
                      <BookOpen size={18} />
                    </div>
                    <div>
                      <div className="dropdown-title">{t.nav.cropGuide}</div>
                      <div className="dropdown-desc">{t.nav.cropGuideDesc}</div>
                    </div>
                  </Link>

                  <Link to="/pest-control" className="dropdown-item" onClick={closeDrawerAndDropdowns}>
                    <div className="dropdown-icon-box" style={{ background: '#FEE2E2', color: '#B91C1C' }}>
                      <Bug size={18} />
                    </div>
                    <div>
                      <div className="dropdown-title">{t.nav.pestControl}</div>
                      <div className="dropdown-desc">{t.nav.pestControlDesc}</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* 4. Mandi, Weather & Schemes Dropdown */}
            <div 
              className="nav-dropdown-wrapper"
              onMouseEnter={() => handleMouseEnter('market')}
              onMouseLeave={handleMouseLeave}
            >
              <button 
                type="button" 
                className={`nav-btn dropdown-toggle ${activeDropdown === 'market' ? 'open' : ''}`}
                onClick={(e) => handleDropdownClick('market', e)}
                aria-expanded={activeDropdown === 'market'}
              >
                <TrendingUp size={16} color="#166534" />
                <span>{t.nav.mandiWeather}</span>
                <ChevronDown size={14} className="chevron-icon" />
              </button>

              {activeDropdown === 'market' && (
                <div className="dropdown-menu">
                  <Link to="/market-prices" className="dropdown-item" onClick={closeDrawerAndDropdowns}>
                    <div className="dropdown-icon-box" style={{ background: '#EFF6FF', color: '#1E40AF' }}>
                      <TrendingUp size={18} />
                    </div>
                    <div>
                      <div className="dropdown-title">{t.nav.marketPrices}</div>
                      <div className="dropdown-desc">{t.nav.marketPricesDesc}</div>
                    </div>
                  </Link>

                  <Link to="/weather" className="dropdown-item" onClick={closeDrawerAndDropdowns}>
                    <div className="dropdown-icon-box" style={{ background: '#FDF2F8', color: '#BE185D' }}>
                      <CloudSun size={18} />
                    </div>
                    <div>
                      <div className="dropdown-title">{t.nav.weather}</div>
                      <div className="dropdown-desc">{t.nav.weatherDesc}</div>
                    </div>
                  </Link>

                  <Link to="/government-schemes" className="dropdown-item" onClick={closeDrawerAndDropdowns}>
                    <div className="dropdown-icon-box" style={{ background: '#DCFCE7', color: '#15803D' }}>
                      <Landmark size={18} />
                    </div>
                    <div>
                      <div className="dropdown-title">{t.nav.governmentSchemes}</div>
                      <div className="dropdown-desc">{t.nav.governmentSchemesDesc}</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* 5. My Farm */}
            <NavLink to="/my-farm" className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`} onClick={closeDrawerAndDropdowns}>
              <Tractor size={16} color="#166534" />
              <span>{t.nav.myFarm}</span>
            </NavLink>

            {/* 6. Admin Console */}
            <NavLink to="/admin" className={({ isActive }) => `nav-btn admin-link ${isActive ? 'active' : ''}`} onClick={closeDrawerAndDropdowns} title="Agricultural Admin Operations">
              <ShieldCheck size={16} color="#15803D" />
              <span>{t.nav.admin}</span>
            </NavLink>
          </nav>

          {/* Action Tools */}
          <div className="header-actions">
            {/* Language Selector */}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="lang-select-compact"
              title="Change Language"
              aria-label="Language"
            >
              <option value="en">English (EN)</option>
              <option value="hi">हिन्दी (HI)</option>
              <option value="gu">ગુજરાતી (GU)</option>
            </select>

            {/* Gemini AI Status Badge */}
            <button
              onClick={() => setKeyModalOpen(true)}
              className={`api-pill ${isConfigured ? 'active' : 'warning'}`}
              title="Click to configure Google Gemini AI Key"
              type="button"
            >
              <Key size={13} />
              <span>{isConfigured ? t.nav.geminiReady : t.nav.setGeminiKey}</span>
            </button>

            {/* Auth / Account */}
            {isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Link to="/my-farm" className="btn btn-soft btn-sm" title={user.name} onClick={closeDrawerAndDropdowns}>
                  <User size={14} />
                  <span>{user.name.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={logout}
                  className="btn btn-secondary btn-sm"
                  title="Logout"
                  type="button"
                >
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary btn-sm" onClick={closeDrawerAndDropdowns}>
                <User size={14} />
                <span>{t.nav.login}</span>
              </Link>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              className="mobile-hamburger-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation"
              type="button"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className={`mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <nav className="mobile-nav-list">
          <NavLink to="/" className="mobile-nav-link" onClick={closeDrawerAndDropdowns} end>
            <Sprout size={18} />
            <span>{t.nav.home}</span>
          </NavLink>
          <NavLink to="/ai-assistant" className="mobile-nav-link" onClick={closeDrawerAndDropdowns}>
            <Bot size={18} />
            <span>{t.nav.aiAssistant}</span>
          </NavLink>
          <NavLink to="/crop-diseases" className="mobile-nav-link" onClick={closeDrawerAndDropdowns}>
            <Stethoscope size={18} />
            <span>{t.nav.cropDiseases}</span>
          </NavLink>
          <NavLink to="/crop-guide" className="mobile-nav-link" onClick={closeDrawerAndDropdowns}>
            <BookOpen size={18} />
            <span>{t.nav.cropGuide}</span>
          </NavLink>
          <NavLink to="/pest-control" className="mobile-nav-link" onClick={closeDrawerAndDropdowns}>
            <Bug size={18} />
            <span>{t.nav.pestControl}</span>
          </NavLink>
          <NavLink to="/soil-fertilizer" className="mobile-nav-link" onClick={closeDrawerAndDropdowns}>
            <FlaskConical size={18} />
            <span>{t.nav.soilFertilizer}</span>
          </NavLink>
          <NavLink to="/weather" className="mobile-nav-link" onClick={closeDrawerAndDropdowns}>
            <CloudSun size={18} />
            <span>{t.nav.weather}</span>
          </NavLink>
          <NavLink to="/market-prices" className="mobile-nav-link" onClick={closeDrawerAndDropdowns}>
            <TrendingUp size={18} />
            <span>{t.nav.marketPrices}</span>
          </NavLink>
          <NavLink to="/government-schemes" className="mobile-nav-link" onClick={closeDrawerAndDropdowns}>
            <Landmark size={18} />
            <span>{t.nav.governmentSchemes}</span>
          </NavLink>
          <NavLink to="/my-farm" className="mobile-nav-link" onClick={closeDrawerAndDropdowns}>
            <Tractor size={18} />
            <span>{t.nav.myFarm}</span>
          </NavLink>
          <NavLink to="/admin" className="mobile-nav-link" onClick={closeDrawerAndDropdowns} style={{ background: '#F0FDF4', color: '#166534', fontWeight: '700' }}>
            <ShieldCheck size={18} color="#166534" />
            <span>Admin Console</span>
          </NavLink>
          <NavLink to="/about" className="mobile-nav-link" onClick={closeDrawerAndDropdowns}>
            <Info size={18} />
            <span>{t.nav.about}</span>
          </NavLink>
          <NavLink to="/contact" className="mobile-nav-link" onClick={closeDrawerAndDropdowns}>
            <PhoneCall size={18} />
            <span>{t.nav.contact}</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
