import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Search, ArrowRight, Calendar, Droplets, Sparkles, Filter } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import { CROPS, getCropName, getCropSeason, getCropDuration } from '../data/cropData';
import { useLanguage } from '../context/LanguageContext';

export default function CropGuide() {
  const { language, t } = useLanguage();
  const [search, setSearch] = useState('');
  const [seasonFilter, setSeasonFilter] = useState('All');

  const filteredCrops = CROPS.filter((c) => {
    const cropName = getCropName(c, language).toLowerCase();
    const searchLower = search.toLowerCase();
    const matchesSearch =
      cropName.includes(searchLower) ||
      c.name.toLowerCase().includes(searchLower) ||
      c.scientificName.toLowerCase().includes(searchLower) ||
      c.soil.toLowerCase().includes(searchLower);

    const matchesSeason =
      seasonFilter === 'All' || c.season.toLowerCase().includes(seasonFilter.toLowerCase());

    return matchesSearch && matchesSeason;
  });

  return (
    <div className="container page-container">
      <Breadcrumbs items={[{ label: t.shortcuts.cropGuide }]} />

      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.2rem', color: '#14532D', marginBottom: '8px' }}>
          {t.cropGuide.title}
        </h1>
        <p style={{ color: '#647067', margin: 0, fontSize: '1rem', maxWidth: '800px' }}>
          {t.cropGuide.subtitle}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '260px' }}>
            <Search size={18} color="#166534" />
            <input
              type="text"
              placeholder={t.cropGuide.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input"
              style={{ flex: 1, border: 'none', padding: '8px 10px' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Filter size={16} color="#647067" />
            <span style={{ fontSize: '0.88rem', fontWeight: '600', color: '#17251B' }}>
              {language === 'gu' ? 'ઋતુ:' : language === 'hi' ? 'मौसम:' : 'Season:'}
            </span>
            <select
              value={seasonFilter}
              onChange={(e) => setSeasonFilter(e.target.value)}
              className="form-select"
              style={{ fontSize: '0.88rem', padding: '6px 12px' }}
            >
              <option value="All">{t.cropGuide.allSeasons}</option>
              <option value="Kharif">{t.cropGuide.kharif}</option>
              <option value="Rabi">{t.cropGuide.rabi}</option>
              <option value="Summer">{t.cropGuide.summer}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Crops Grid */}
      <div className="grid-3">
        {filteredCrops.map((crop) => (
          <div key={crop.id} className="card card-interactive" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div>
                <h2 style={{ fontSize: '1.3rem', margin: 0, color: '#14532D' }}>{getCropName(crop, language)}</h2>
                <span style={{ fontSize: '0.82rem', color: '#647067', fontStyle: 'italic' }}>
                  {crop.scientificName}
                </span>
              </div>
              <span className="badge badge-green">{getCropSeason(crop, language)}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.86rem', color: '#17251B', margin: '16px 0', flex: 1 }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <strong style={{ minWidth: '85px', color: '#647067' }}>{t.cropGuide.duration}:</strong>
                <span>{getCropDuration(crop, language)}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <strong style={{ minWidth: '85px', color: '#647067' }}>{t.cropDetail.idealTemp}:</strong>
                <span>{crop.idealTemp}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <strong style={{ minWidth: '85px', color: '#647067' }}>{t.cropGuide.soil}:</strong>
                <span>{crop.soil.split(';')[0]}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <strong style={{ minWidth: '85px', color: '#647067' }}>{t.cropGuide.sowing}:</strong>
                <span>{crop.sowingWindow.split('(')[0]}</span>
              </div>
            </div>

            <Link
              to={`/crop-guide/${crop.id}`}
              className="btn btn-soft"
              style={{ width: '100%', marginTop: 'auto' }}
            >
              <span>{t.cropGuide.viewDetails}</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        ))}
      </div>

      {filteredCrops.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '48px 20px' }}>
          <p style={{ color: '#647067', fontSize: '1rem' }}>
            {language === 'gu' 
              ? `શોધ "${search}" મુજબ કોઈ પાક મળ્યો નથી.` 
              : `No crop found matching your search "${search}".`}
          </p>
          <button
            onClick={() => { setSearch(''); setSeasonFilter('All'); }}
            className="btn btn-secondary btn-sm"
            style={{ marginTop: '12px' }}
          >
            {t.common.clear}
          </button>
        </div>
      )}
    </div>
  );
}
