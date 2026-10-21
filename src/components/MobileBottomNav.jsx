import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Stethoscope, Bot, TrendingUp, CloudSun } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function MobileBottomNav() {
  const { t } = useLanguage();

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
      <div className="mobile-bottom-nav-inner">
        <NavLink to="/" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`} end>
          <Home size={20} />
          <span>{t?.nav?.home || 'Home'}</span>
        </NavLink>

        <NavLink to="/crop-diseases" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
          <Stethoscope size={20} />
          <span>{t?.nav?.cropDiseases || 'Doctor'}</span>
        </NavLink>

        <NavLink to="/ai-assistant" className={({ isActive }) => `bottom-nav-item bottom-nav-special ${isActive ? 'active' : ''}`}>
          <div className="bottom-nav-special-icon">
            <Bot size={22} />
          </div>
          <span>{t?.nav?.aiAssistant || 'AI Krishi'}</span>
        </NavLink>

        <NavLink to="/market-prices" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
          <TrendingUp size={20} />
          <span>{t?.nav?.marketPrices || 'Mandi'}</span>
        </NavLink>

        <NavLink to="/weather" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
          <CloudSun size={20} />
          <span>{t?.nav?.weather || 'Mausam'}</span>
        </NavLink>
      </div>
    </nav>
  );
}
