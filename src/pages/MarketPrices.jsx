import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Search, 
  Filter, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight, 
  Minus, 
  MapPin, 
  Sparkles,
  ExternalLink,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';

export default function MarketPrices() {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({ states: ['All'], commodities: ['All'], mandis: ['All'] });
  const [selectedState, setSelectedState] = useState('All');
  const [selectedCommodity, setSelectedCommodity] = useState('All');
  const [selectedMandi, setSelectedMandi] = useState('All');
  const [search, setSearch] = useState('');
  const [sourceInfo, setSourceInfo] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchPrices = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedState !== 'All') params.append('state', selectedState);
      if (selectedCommodity !== 'All') params.append('commodity', selectedCommodity);
      if (selectedMandi !== 'All') params.append('mandi', selectedMandi);
      if (search.trim()) params.append('search', search.trim());

      const res = await fetch(`/api/mandi?${params.toString()}`);
      const result = await res.json();
      if (result.success) {
        setData(result.data);
        setSourceInfo(result.source);
        if (result.filters) {
          setFilters(result.filters);
        }
      }
    } catch (err) {
      console.error('Mandi fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, [selectedState, selectedCommodity, selectedMandi]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPrices();
  };

  return (
    <div className="container page-container">
      <Breadcrumbs items={[{ label: 'Mandi APMC Market Prices' }]} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', color: '#14532D', marginBottom: '6px' }}>
            Daily Mandi APMC Market Prices
          </h1>
          <p style={{ color: '#647067', margin: 0, fontSize: '0.96rem' }}>
            Official daily arrival rates, minimum, maximum, and modal benchmark prices across Gujarat (Rajkot, Gondal, Unjha, Surat) and major national agriculture mandis.
          </p>
        </div>

        <button
          onClick={fetchPrices}
          className="btn btn-secondary btn-sm"
          disabled={loading}
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          <span>Refresh Rates</span>
        </button>
      </div>

      {/* Verified Source Banner */}
      <div className="alert-banner info" style={{ marginBottom: '24px' }}>
        <ShieldCheck size={20} />
        <div>
          <strong>Agmarknet Official Attribution:</strong> Sourced directly from daily market arrivals submitted to the Directorate of Marketing & Inspection (Ministry of Agriculture & Farmers Welfare, GoI). All prices expressed in ₹ per Quintal.
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="card" style={{ padding: '20px', marginBottom: '28px' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '220px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Search size={18} color="#166534" />
            <input
              type="text"
              placeholder="Search commodity or mandi (e.g. Cotton, Jeera, Rajkot, Gondal)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input"
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>State:</span>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="form-select"
              style={{ fontSize: '0.85rem', padding: '8px 12px' }}
            >
              {filters.states.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Commodity:</span>
            <select
              value={selectedCommodity}
              onChange={(e) => setSelectedCommodity(e.target.value)}
              className="form-select"
              style={{ fontSize: '0.85rem', padding: '8px 12px' }}
            >
              {filters.commodities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-primary btn-sm">
            Filter Prices
          </button>
        </form>
      </div>

      {/* Mandi Rates Table */}
      <div className="table-wrapper">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Commodity / Variety</th>
              <th>Mandi / APMC Yard</th>
              <th>District & State</th>
              <th>Arrival Volume</th>
              <th>Min Price</th>
              <th>Max Price</th>
              <th>Modal (Benchmark) Price</th>
              <th>Price Trend</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td>
                  <strong style={{ fontSize: '0.98rem', color: '#14532D', display: 'block' }}>
                    {item.commodity}
                  </strong>
                  <span style={{ fontSize: '0.78rem', color: '#647067' }}>
                    {item.variety}
                  </span>
                </td>
                <td>
                  <strong>{item.mandi}</strong>
                  <span style={{ display: 'block', fontSize: '0.76rem', color: '#82A98E' }}>
                    {item.arrivalDate}
                  </span>
                </td>
                <td>
                  {item.district}, {item.state}
                </td>
                <td>
                  <span className="badge badge-green">{item.arrivals}</span>
                </td>
                <td style={{ color: '#4B5563', fontWeight: '600' }}>
                  ₹{item.minPrice.toLocaleString()}
                </td>
                <td style={{ color: '#4B5563', fontWeight: '600' }}>
                  ₹{item.maxPrice.toLocaleString()}
                </td>
                <td>
                  <span style={{ fontSize: '1.15rem', fontWeight: '800', color: '#166534' }}>
                    ₹{item.modalPrice.toLocaleString()}
                  </span>
                  <span style={{ display: 'block', fontSize: '0.74rem', color: '#647067' }}>
                    {item.unit}
                  </span>
                </td>
                <td>
                  {item.trend === 'up' && (
                    <span className="badge badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                      <ArrowUpRight size={14} /> Rising
                    </span>
                  )}
                  {item.trend === 'down' && (
                    <span className="badge badge-red" style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                      <ArrowDownRight size={14} /> Softening
                    </span>
                  )}
                  {item.trend === 'stable' && (
                    <span className="badge badge-amber" style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                      <Minus size={14} /> Steady
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {data.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '48px 20px', color: '#647067' }}>
            No mandi price records found for the selected commodity or market.
          </div>
        )}
      </div>

      <div style={{ marginTop: '20px', fontSize: '0.8rem', color: '#647067', textAlign: 'right' }}>
        Data Feed: {sourceInfo || 'Agmarknet / Ministry of Agriculture'} • Updated Daily at 17:00 IST
      </div>
    </div>
  );
}
