import React, { useState, useEffect } from 'react';
import { 
  Landmark, 
  Search, 
  ExternalLink, 
  CheckCircle2, 
  FileText, 
  Phone, 
  ShieldCheck, 
  Calendar, 
  Filter,
  ArrowRight
} from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';

export default function GovernmentSchemes() {
  const [schemes, setSchemes] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [selectedCat, setSelectedCat] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchSchemes = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCat !== 'All') params.append('category', selectedCat);
      if (search.trim()) params.append('search', search.trim());

      const res = await fetch(`/api/schemes?${params.toString()}`);
      const result = await res.json();
      if (result.success) {
        setSchemes(result.data);
        if (result.categories) setCategories(result.categories);
      }
    } catch (err) {
      console.error('Schemes fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, [selectedCat]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchSchemes();
  };

  return (
    <div className="container page-container">
      <Breadcrumbs items={[{ label: 'Government Agricultural Schemes' }]} />

      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2.2rem', color: '#14532D', marginBottom: '8px' }}>
          Government Agricultural Schemes & Subsidies
        </h1>
        <p style={{ color: '#647067', margin: 0, fontSize: '1rem', maxWidth: '820px' }}>
          Verified directory of Central and State Government agricultural welfare schemes, income assistance, crop insurance, solar pumps, and machinery subsidies. Directly linked to official portals.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="card" style={{ padding: '20px', marginBottom: '32px' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '260px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Search size={18} color="#166534" />
            <input
              type="text"
              placeholder="Search scheme by name or benefit (e.g. PM-KISAN, crop insurance, drip subsidy)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input"
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={16} color="#647067" />
            <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Category:</span>
            <select
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
              className="form-select"
              style={{ fontSize: '0.85rem', padding: '8px 12px' }}
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-primary btn-sm">
            Search Schemes
          </button>
        </form>
      </div>

      {/* Schemes List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {schemes.map((scheme) => (
          <div key={scheme.id} className="card" style={{ border: '1px solid #E1EAE2', padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', marginBottom: '16px', borderBottom: '1px solid #E1EAE2', paddingBottom: '14px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span className="badge badge-green">{scheme.category}</span>
                  <span style={{ fontSize: '0.78rem', color: '#647067' }}>
                    Authority: <strong>{scheme.authority}</strong>
                  </span>
                </div>
                <h2 style={{ fontSize: '1.5rem', color: '#14532D', margin: 0 }}>
                  {scheme.name}
                </h2>
              </div>

              <a
                href={scheme.officialPortal}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm"
              >
                <span>Official Government Portal</span>
                <ExternalLink size={14} />
              </a>
            </div>

            {/* Objective & Benefits */}
            <div className="grid-2" style={{ marginBottom: '20px' }}>
              <div>
                <strong style={{ fontSize: '0.9rem', color: '#166534', display: 'block', marginBottom: '6px' }}>
                  Purpose & Objective:
                </strong>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#17251B', lineHeight: 1.6 }}>
                  {scheme.objective}
                </p>
              </div>

              <div style={{ background: '#F0FDF4', padding: '16px', borderRadius: '10px', border: '1px solid #BBF7D0' }}>
                <strong style={{ fontSize: '0.9rem', color: '#15803D', display: 'block', marginBottom: '6px' }}>
                  Financial Assistance & Benefits:
                </strong>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#14532D', lineHeight: 1.6 }}>
                  {scheme.benefits}
                </p>
              </div>
            </div>

            {/* Eligibility & Documents */}
            <div className="grid-2" style={{ marginBottom: '20px' }}>
              <div>
                <strong style={{ fontSize: '0.9rem', color: '#14532D', display: 'block', marginBottom: '6px' }}>
                  Farmer Eligibility Criteria:
                </strong>
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.88rem', color: '#4B5563', lineHeight: 1.6 }}>
                  {scheme.eligibility.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <strong style={{ fontSize: '0.9rem', color: '#14532D', display: 'block', marginBottom: '6px' }}>
                  Mandatory Required Documents:
                </strong>
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.88rem', color: '#4B5563', lineHeight: 1.6 }}>
                  {scheme.documentsRequired.map((doc, idx) => (
                    <li key={idx}>{doc}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Application Procedure */}
            <div style={{ background: '#F8FAF9', padding: '16px', borderRadius: '10px', border: '1px solid #E1EAE2', marginBottom: '16px' }}>
              <strong style={{ fontSize: '0.88rem', color: '#166534', display: 'block', marginBottom: '4px' }}>
                How to Apply:
              </strong>
              <p style={{ margin: 0, fontSize: '0.88rem', color: '#17251B', lineHeight: 1.6 }}>
                {scheme.applicationProcess}
              </p>
            </div>

            {/* Footer with Helpline & Last Verified */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', fontSize: '0.82rem', color: '#647067' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Phone size={14} color="#166534" /> <strong>Toll-Free Helpline:</strong> {scheme.helpline}
              </span>
              <span>Last Verified against Ministry Guidelines: {scheme.lastVerified}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
