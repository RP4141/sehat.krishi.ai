import React, { useState, useEffect } from 'react';
import { 
  CloudSun, 
  Wind, 
  Droplets, 
  Thermometer, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  RefreshCw, 
  ShieldAlert,
  Info
} from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';

export default function Weather() {
  const [district, setDistrict] = useState('Rajkot, Gujarat');
  const [districtsList, setDistrictsList] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch supported districts on mount
  useEffect(() => {
    fetch('/api/weather/districts')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.districts) {
          setDistrictsList(data.districts);
        }
      })
      .catch((err) => console.warn('Could not load districts:', err));
  }, []);

  // Fetch weather data for selected district
  const fetchWeather = async (targetDistrict = district) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/weather?district=${encodeURIComponent(targetDistrict)}`);
      const data = await res.json();
      if (!res.ok && !data.success) {
        setError(data.message || 'Unable to retrieve meteorological data.');
      } else {
        setWeatherData(data);
      }
    } catch (err) {
      console.error('Weather error:', err);
      setError('Network communication failed while fetching weather data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(district);
  }, [district]);

  return (
    <div className="container page-container">
      <Breadcrumbs items={[{ label: 'Weather & Farming Alerts' }]} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', color: '#14532D', marginBottom: '6px' }}>
            Agricultural Weather & Risk Advisories
          </h1>
          <p style={{ color: '#647067', margin: 0, fontSize: '0.96rem' }}>
            Live meteorological parameters evaluated for pesticide spray safety, heat stress, evapotranspiration, and disease microclimates.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fff', border: '1px solid #E1EAE2', borderRadius: '10px', padding: '6px 14px' }}>
            <MapPin size={16} color="#166534" />
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="form-select"
              style={{ border: 'none', padding: '4px 6px', fontSize: '0.9rem', fontWeight: '600', color: '#17251B', outline: 'none' }}
            >
              {districtsList.map((d) => (
                <option key={d.name} value={d.name}>{d.name}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => fetchWeather(district)}
            className="btn btn-secondary btn-sm"
            title="Refresh weather"
            disabled={loading}
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Fallback Notice Banner if running in offline IMD seasonal normal mode */}
      {weatherData?.isFallback && (
        <div className="alert-banner warning">
          <Info size={20} />
          <div style={{ flex: 1 }}>
            <strong style={{ display: 'block', marginBottom: '2px' }}>Truthful Data Transparency Notice</strong>
            <span>
              {weatherData.fallbackNotice || 'Displaying official IMD Seasonal Agronomic Baseline for October.'}
            </span>
          </div>
        </div>
      )}

      {error && (
        <div className="alert-banner danger">
          <AlertTriangle size={20} />
          <div>
            <strong>Weather Data Unavailable</strong>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.88rem' }}>{error}</p>
          </div>
        </div>
      )}

      {loading && !weatherData && (
        <div className="card">
          <div className="skeleton" style={{ height: '32px', width: '40%', marginBottom: '16px' }}></div>
          <div className="skeleton" style={{ height: '140px', width: '100%', marginBottom: '16px' }}></div>
          <div className="skeleton" style={{ height: '80px', width: '100%' }}></div>
        </div>
      )}

      {weatherData && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Main Current Conditions Hero Card */}
          <div className="card card-soft" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
              <div>
                <span className="badge badge-green" style={{ marginBottom: '8px' }}>
                  {weatherData.location.state} • {weatherData.location.primaryCrops}
                </span>
                <h2 style={{ fontSize: '2rem', color: '#14532D', margin: '4px 0' }}>
                  {weatherData.location.district}
                </h2>
                <span style={{ fontSize: '0.82rem', color: '#647067' }}>
                  Source: <strong>{weatherData.source}</strong> • Verified at {new Date(weatherData.lastUpdated).toLocaleTimeString()}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '3.4rem', fontWeight: '800', color: '#14532D', lineHeight: 1 }}>
                    {weatherData.current.temp}°C
                  </span>
                  <span style={{ display: 'block', fontSize: '0.85rem', color: '#647067' }}>
                    Feels like {weatherData.current.apparentTemp}°C
                  </span>
                </div>
                <CloudSun size={56} color="#166534" />
              </div>
            </div>

            {/* Weather Metrics Grid */}
            <div className="grid-4" style={{ marginTop: '16px' }}>
              <div style={{ background: '#fff', padding: '16px', borderRadius: '12px', border: '1px solid #E1EAE2', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: '#EFF6FF', padding: '10px', borderRadius: '10px', color: '#1E40AF' }}>
                  <Droplets size={20} />
                </div>
                <div>
                  <span style={{ fontSize: '0.78rem', color: '#647067', fontWeight: '600' }}>Relative Humidity</span>
                  <strong style={{ display: 'block', fontSize: '1.2rem', color: '#17251B' }}>
                    {weatherData.current.humidity}%
                  </strong>
                </div>
              </div>

              <div style={{ background: '#fff', padding: '16px', borderRadius: '12px', border: '1px solid #E1EAE2', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: '#ECFDF5', padding: '10px', borderRadius: '10px', color: '#047857' }}>
                  <Wind size={20} />
                </div>
                <div>
                  <span style={{ fontSize: '0.78rem', color: '#647067', fontWeight: '600' }}>Wind Speed</span>
                  <strong style={{ display: 'block', fontSize: '1.2rem', color: '#17251B' }}>
                    {weatherData.current.windSpeed} km/h
                  </strong>
                </div>
              </div>

              <div style={{ background: '#fff', padding: '16px', borderRadius: '12px', border: '1px solid #E1EAE2', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: '#FEF3C7', padding: '10px', borderRadius: '10px', color: '#B45309' }}>
                  <Thermometer size={20} />
                </div>
                <div>
                  <span style={{ fontSize: '0.78rem', color: '#647067', fontWeight: '600' }}>Surface Pressure</span>
                  <strong style={{ display: 'block', fontSize: '1.2rem', color: '#17251B' }}>
                    {weatherData.current.surfacePressure} hPa
                  </strong>
                </div>
              </div>

              <div style={{ background: '#fff', padding: '16px', borderRadius: '12px', border: '1px solid #E1EAE2', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: '#FCE7F3', padding: '10px', borderRadius: '10px', color: '#BE185D' }}>
                  <CloudSun size={20} />
                </div>
                <div>
                  <span style={{ fontSize: '0.78rem', color: '#647067', fontWeight: '600' }}>Precipitation</span>
                  <strong style={{ display: 'block', fontSize: '1.2rem', color: '#17251B' }}>
                    {weatherData.current.precipitation} mm
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Agricultural Action Advisories */}
          <div>
            <h3 style={{ fontSize: '1.4rem', color: '#14532D', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert size={22} color="#166534" />
              <span>Real-Time Agricultural Decision Advisories</span>
            </h3>

            <div className="grid-3">
              {weatherData.advisories.map((adv, idx) => {
                const isWarning = adv.type === 'warning' || adv.type === 'alert';
                return (
                  <div
                    key={idx}
                    className="card"
                    style={{
                      background: isWarning ? '#FFFBEB' : '#F0FDF4',
                      borderColor: isWarning ? '#FDE68A' : '#BBF7D0'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                      {isWarning ? (
                        <AlertTriangle size={18} color="#D97706" />
                      ) : (
                        <CheckCircle2 size={18} color="#15803D" />
                      )}
                      <h4 style={{ margin: 0, fontSize: '1rem', color: isWarning ? '#92400E' : '#14532D' }}>
                        {adv.title}
                      </h4>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.88rem', color: isWarning ? '#78350F' : '#166534', lineHeight: 1.6 }}>
                      {adv.detail}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 7-Day Agricultural Forecast Table */}
          <div className="card">
            <h3 style={{ fontSize: '1.3rem', color: '#14532D', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={20} color="#166534" />
              <span>7-Day Agricultural Forecast</span>
            </h3>

            <div className="table-wrapper">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Day / Date</th>
                    <th>Max Temp</th>
                    <th>Min Temp</th>
                    <th>Rain Probability</th>
                    <th>Expected Rainfall</th>
                    <th>Max Wind</th>
                  </tr>
                </thead>
                <tbody>
                  {weatherData.forecast.map((f, i) => (
                    <tr key={i}>
                      <td><strong>{f.date}</strong></td>
                      <td style={{ color: '#DC2626', fontWeight: '600' }}>{f.maxTemp}°C</td>
                      <td style={{ color: '#0284C7', fontWeight: '600' }}>{f.minTemp}°C</td>
                      <td>
                        <span className={`badge ${f.rainProb > 40 ? 'badge-amber' : 'badge-green'}`}>
                          {f.rainProb}%
                        </span>
                      </td>
                      <td>{f.precipSum} mm</td>
                      <td>{f.maxWind} km/h</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
