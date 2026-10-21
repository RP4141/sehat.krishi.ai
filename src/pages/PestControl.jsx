import React, { useState } from 'react';
import { 
  Bug, 
  Search, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink, 
  Leaf, 
  Eye, 
  Filter,
  Layers,
  Bot
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import { PEST_DATABASE } from '../data/pestData';

export default function PestControl() {
  const [search, setSearch] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('All');
  const [activePest, setActivePest] = useState(PEST_DATABASE[0]);

  const cropsList = ['All', 'Cotton', 'Rice', 'Wheat', 'Chilli', 'Tomato', 'Groundnut', 'Maize', 'Pulses'];

  const filteredPests = PEST_DATABASE.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.scientificName.toLowerCase().includes(search.toLowerCase()) ||
      p.symptoms.toLowerCase().includes(search.toLowerCase()) ||
      p.identification.toLowerCase().includes(search.toLowerCase());

    const matchesCrop =
      selectedCrop === 'All' || p.crops.some((c) => c.toLowerCase().includes(selectedCrop.toLowerCase()));

    return matchesSearch && matchesCrop;
  });

  return (
    <div className="container page-container">
      <Breadcrumbs items={[{ label: 'Pest & Insect Management' }]} />

      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2.2rem', color: '#14532D', marginBottom: '8px' }}>
          Integrated Pest Management (IPM) & Insect Doctor
        </h1>
        <p style={{ color: '#647067', margin: 0, fontSize: '1rem', maxWidth: '820px' }}>
          Scientifically verified pest identification, economic threshold levels (ETL), and 4-tier Integrated Pest Management (Cultural, Mechanical, Biological, and Chemical safeguards) compliant with DPPQS and ICAR standards.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '28px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '280px' }}>
            <Search size={18} color="#166534" />
            <input
              type="text"
              placeholder="Search pest by name or damage symptom (e.g. pink bollworm, leaf curl, thrips, borer)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input"
              style={{ flex: 1, border: 'none', padding: '8px 10px' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Filter size={16} color="#647067" />
            <span style={{ fontSize: '0.88rem', fontWeight: '600' }}>Filter by Crop:</span>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="form-select"
              style={{ fontSize: '0.88rem', padding: '6px 12px' }}
            >
              {cropsList.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        {/* Left List of Pests */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filteredPests.map((pest) => {
            const isSelected = activePest?.id === pest.id;
            return (
              <div
                key={pest.id}
                onClick={() => setActivePest(pest)}
                className="card"
                style={{
                  cursor: 'pointer',
                  borderColor: isSelected ? '#22C55E' : '#E1EAE2',
                  background: isSelected ? '#F0FDF4' : '#fff',
                  borderWidth: isSelected ? '2px' : '1px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <h3 style={{ fontSize: '1.15rem', color: isSelected ? '#166534' : '#17251B', margin: 0 }}>
                    {pest.name}
                  </h3>
                  <span className="badge badge-amber">{pest.type}</span>
                </div>
                <p style={{ margin: '0 0 10px 0', fontSize: '0.8rem', color: '#647067', fontStyle: 'italic' }}>
                  {pest.scientificName}
                </p>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                  {pest.crops.map((c, i) => (
                    <span key={i} className="badge badge-green" style={{ fontSize: '0.72rem' }}>
                      {c}
                    </span>
                  ))}
                </div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#4B5563', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {pest.symptoms}
                </p>
              </div>
            );
          })}

          {filteredPests.length === 0 && (
            <div className="card" style={{ textAlign: 'center', padding: '36px' }}>
              <p style={{ color: '#647067' }}>No pest matches found.</p>
            </div>
          )}
        </div>

        {/* Right Active Pest Detail View */}
        {activePest && (
          <div className="card" style={{ position: 'sticky', top: '90px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid #E1EAE2', paddingBottom: '14px' }}>
              <div>
                <span className="badge badge-green" style={{ marginBottom: '6px' }}>Verified ICAR/DPPQS IPM Protocol</span>
                <h2 style={{ fontSize: '1.6rem', color: '#14532D', margin: '4px 0' }}>
                  {activePest.name}
                </h2>
                <span style={{ fontSize: '0.88rem', color: '#647067', fontStyle: 'italic' }}>
                  {activePest.scientificName}
                </span>
              </div>
              <Link to={`/ai-assistant?q=${encodeURIComponent(`How to control ${activePest.name} with IPM?`)}`} className="btn btn-soft btn-sm">
                <Bot size={14} />
                <span>Ask AI</span>
              </Link>
            </div>

            {/* Identification & Symptoms */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              <div>
                <strong style={{ fontSize: '0.9rem', color: '#166534', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <Eye size={16} /> Identifying Characteristics:
                </strong>
                <p style={{ margin: 0, fontSize: '0.88rem', color: '#17251B', lineHeight: 1.6 }}>
                  {activePest.identification}
                </p>
              </div>

              <div>
                <strong style={{ fontSize: '0.9rem', color: '#B45309', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <AlertTriangle size={16} /> Crop Damage Symptoms:
                </strong>
                <p style={{ margin: 0, fontSize: '0.88rem', color: '#17251B', lineHeight: 1.6 }}>
                  {activePest.symptoms}
                </p>
              </div>

              <div style={{ background: '#FEF3C7', padding: '12px', borderRadius: '8px', border: '1px solid #FDE68A' }}>
                <strong style={{ fontSize: '0.86rem', color: '#92400E', display: 'block', marginBottom: '2px' }}>
                  Economic Threshold Level (ETL):
                </strong>
                <span style={{ fontSize: '0.86rem', color: '#78350F' }}>
                  {activePest.etl}
                </span>
              </div>
            </div>

            {/* 4-Tier IPM Plan */}
            <h3 style={{ fontSize: '1.15rem', color: '#14532D', marginBottom: '14px', borderTop: '1px solid #E1EAE2', paddingTop: '16px' }}>
              4-Tier Integrated Pest Management (IPM)
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <div style={{ background: '#F0FDF4', padding: '12px 14px', borderRadius: '10px', border: '1px solid #BBF7D0' }}>
                <strong style={{ color: '#15803D', fontSize: '0.88rem', display: 'block', marginBottom: '2px' }}>
                  1. Cultural Control (Prevention)
                </strong>
                <span style={{ fontSize: '0.85rem', color: '#17251B' }}>{activePest.cultural_control}</span>
              </div>

              <div style={{ background: '#EFF6FF', padding: '12px 14px', borderRadius: '10px', border: '1px solid #BFDBFE' }}>
                <strong style={{ color: '#1E40AF', fontSize: '0.88rem', display: 'block', marginBottom: '2px' }}>
                  2. Mechanical & Physical Traps
                </strong>
                <span style={{ fontSize: '0.85rem', color: '#17251B' }}>{activePest.mechanical_control}</span>
              </div>

              <div style={{ background: '#FAF5FF', padding: '12px 14px', borderRadius: '10px', border: '1px solid #E9D5FF' }}>
                <strong style={{ color: '#7E22CE', fontSize: '0.88rem', display: 'block', marginBottom: '2px' }}>
                  3. Biological Biocontrol Agents
                </strong>
                <span style={{ fontSize: '0.85rem', color: '#17251B' }}>{activePest.biological_control}</span>
              </div>

              <div style={{ background: '#FFF1F2', padding: '12px 14px', borderRadius: '10px', border: '1px solid #FECDD3' }}>
                <strong style={{ color: '#BE123C', fontSize: '0.88rem', display: 'block', marginBottom: '2px' }}>
                  4. Chemical Safeguards (Only at ETL breach)
                </strong>
                <span style={{ fontSize: '0.85rem', color: '#17251B' }}>{activePest.chemical_precaution}</span>
              </div>
            </div>

            <div style={{ fontSize: '0.78rem', color: '#647067', borderTop: '1px solid #E1EAE2', paddingTop: '10px' }}>
              <strong>Authority:</strong> {activePest.source}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
