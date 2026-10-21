import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { 
  Sprout, 
  Droplets, 
  FlaskConical, 
  Bug, 
  ShieldCheck, 
  Calendar, 
  MapPin, 
  ArrowLeft, 
  Bot, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import { CROPS, getCropName, getCropSeason, getCropDuration } from '../data/cropData';
import { useLanguage } from '../context/LanguageContext';

export default function CropDetail() {
  const { id } = useParams();
  const { language, t } = useLanguage();
  const crop = CROPS.find((c) => c.id.toLowerCase() === id?.toLowerCase());

  if (!crop) {
    return <Navigate to="/crop-guide" replace />;
  }

  const localizedCropName = getCropName(crop, language);

  return (
    <div className="container page-container">
      <Breadcrumbs
        items={[
          { label: t.shortcuts.cropGuide, to: '/crop-guide' },
          { label: localizedCropName }
        ]}
      />

      {/* Header Banner */}
      <div className="card card-soft" style={{ padding: '32px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span className="badge badge-green">{getCropSeason(crop, language)}</span>
              <span className="badge badge-blue">{getCropDuration(crop, language)}</span>
            </div>
            <h1 style={{ fontSize: '2.4rem', color: '#14532D', margin: '4px 0' }}>
              {localizedCropName}
            </h1>
            <p style={{ fontSize: '1rem', color: '#647067', fontStyle: 'italic', margin: 0 }}>
              {language === 'gu' ? 'વૈજ્ઞાનિક નામ:' : language === 'hi' ? 'वानस्पतिक नाम:' : 'Botanical Name:'} <strong>{crop.scientificName}</strong>
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <Link 
              to={`/ai-assistant?crop=${encodeURIComponent(localizedCropName)}&q=${encodeURIComponent(
                language === 'gu' 
                  ? `${localizedCropName} પાકના વાવેતર, ખાતર અને રોગ નિયંત્રણ વિશે સંપૂર્ણ માહિતી આપો.` 
                  : `What is the optimal cultivation plan for ${localizedCropName}?`
              )}`} 
              className="btn btn-primary"
            >
              <Bot size={18} />
              <span>{t.cropDetail.askAiAbout}</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        {/* Left Column: Agronomic Requirements */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Soil & Climate */}
          <div className="card">
            <h3 style={{ fontSize: '1.2rem', color: '#14532D', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sprout size={20} color="#166534" />
              <span>{t.cropDetail.climateSoil}</span>
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.92rem' }}>
              <div>
                <strong style={{ color: '#166534' }}>{t.cropDetail.idealTemp}:</strong> {crop.idealTemp}
              </div>
              <div>
                <strong style={{ color: '#166534' }}>{t.cropDetail.soilPref}:</strong> {crop.soil}
              </div>
            </div>
          </div>

          {/* Sowing & Seed Information */}
          <div className="card">
            <h3 style={{ fontSize: '1.2rem', color: '#14532D', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={20} color="#166534" />
              <span>{t.cropDetail.sowingSeed}</span>
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.92rem' }}>
              <div>
                <strong style={{ color: '#166534' }}>{t.cropDetail.sowingWindow}:</strong> {crop.sowingWindow}
              </div>
              <div>
                <strong style={{ color: '#166534' }}>{t.cropDetail.seedRate}:</strong> {crop.seedRate}
              </div>
            </div>
          </div>

          {/* Critical Irrigation Guidance */}
          <div className="card">
            <h3 style={{ fontSize: '1.2rem', color: '#14532D', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Droplets size={20} color="#0284C7" />
              <span>{t.cropDetail.irrigation}</span>
            </h3>
            <p style={{ fontSize: '0.92rem', color: '#17251B', lineHeight: 1.6, margin: 0 }}>
              {crop.irrigation}
            </p>
          </div>

          {/* Nutrient Requirements */}
          <div className="card">
            <h3 style={{ fontSize: '1.2rem', color: '#14532D', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FlaskConical size={20} color="#7C3AED" />
              <span>{t.cropDetail.nutrition}</span>
            </h3>
            <p style={{ fontSize: '0.92rem', color: '#17251B', lineHeight: 1.6, margin: 0 }}>
              {crop.nutrition}
            </p>
          </div>
        </div>

        {/* Right Column: Pests, Diseases & Regional Advice */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Common Pests & Management */}
          <div className="card">
            <h3 style={{ fontSize: '1.2rem', color: '#14532D', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bug size={20} color="#DC2626" />
              <span>{t.cropDetail.pests}</span>
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {crop.pests.map((pest, idx) => (
                <div key={idx} style={{ padding: '12px', background: '#FEF2F2', borderRadius: '10px', border: '1px solid #FECACA' }}>
                  <strong style={{ color: '#991B1B', display: 'block', fontSize: '0.92rem', marginBottom: '4px' }}>
                    {pest.name}
                  </strong>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#4B5563', lineHeight: 1.5 }}>
                    {pest.details}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Common Diseases */}
          <div className="card">
            <h3 style={{ fontSize: '1.2rem', color: '#14532D', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={20} color="#D97706" />
              <span>{t.cropDetail.diseases}</span>
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {crop.diseases.map((dis, idx) => (
                <div key={idx} style={{ padding: '12px', background: '#FFFBEB', borderRadius: '10px', border: '1px solid #FDE68A' }}>
                  <strong style={{ color: '#92400E', display: 'block', fontSize: '0.92rem', marginBottom: '4px' }}>
                    {dis.name}
                  </strong>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#4B5563', lineHeight: 1.5 }}>
                    {dis.details}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Harvesting Guidelines */}
          <div className="card">
            <h3 style={{ fontSize: '1.2rem', color: '#14532D', marginBottom: '14px' }}>
              {t.cropDetail.harvest}
            </h3>
            <p style={{ fontSize: '0.92rem', color: '#17251B', lineHeight: 1.6, margin: 0 }}>
              {crop.harvesting}
            </p>
          </div>

          {/* Regional Considerations (Gujarat / North / Central India) */}
          <div className="card" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#14532D', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={18} color="#166534" />
              <span>{t.cropDetail.regional}</span>
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#166534', lineHeight: 1.6, margin: 0 }}>
              {crop.regionalNotes}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
