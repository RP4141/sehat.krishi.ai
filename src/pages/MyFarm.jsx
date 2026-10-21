import React, { useState, useEffect } from 'react';
import { 
  Tractor, 
  Plus, 
  Trash2, 
  Edit3, 
  Bookmark, 
  Sprout, 
  MapPin, 
  Droplets, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Calendar,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import { useAuth } from '../context/AuthContext';

export default function MyFarm() {
  const { user, isAuthenticated } = useAuth();
  const userId = user?.id || 'guest';

  const [farms, setFarms] = useState([]);
  const [savedAdvice, setSavedAdvice] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Farm Form state
  const [farmName, setFarmName] = useState('');
  const [acres, setAcres] = useState('5');
  const [soilType, setSoilType] = useState('Medium Black Soil');
  const [irrigationSource, setIrrigationSource] = useState('Borewell with Drip Irrigation');
  const [currentCrops, setCurrentCrops] = useState('Cotton, Groundnut');
  const [state, setState] = useState(user?.state || 'Gujarat');
  const [district, setDistrict] = useState(user?.district || 'Rajkot');
  const [notes, setNotes] = useState('');

  const fetchFarmData = async () => {
    setLoading(true);
    try {
      const [farmRes, adviceRes] = await Promise.all([
        fetch(`/api/farm?userId=${userId}`),
        fetch(`/api/farm/saved-advice?userId=${userId}`)
      ]);
      const farmData = await farmRes.json();
      const adviceData = await adviceRes.json();

      if (farmData.success) setFarms(farmData.data);
      if (adviceData.success) setSavedAdvice(adviceData.data);
    } catch (err) {
      console.error('My farm fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarmData();
  }, [userId]);

  const handleCreateFarm = async (e) => {
    e.preventDefault();
    if (!farmName.trim()) return;

    try {
      const res = await fetch('/api/farm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          farmName: farmName.trim(),
          acres: parseFloat(acres) || 0,
          soilType,
          irrigationSource,
          currentCrops: currentCrops.split(',').map((c) => c.trim()).filter(Boolean),
          state,
          district,
          notes
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        setFarmName('');
        fetchFarmData();
      }
    } catch (err) {
      console.error('Save farm error:', err);
    }
  };

  const handleDeleteFarm = async (id) => {
    if (!confirm('Are you sure you want to remove this farm profile?')) return;
    try {
      await fetch(`/api/farm/${id}?userId=${userId}`, { method: 'DELETE' });
      fetchFarmData();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleDeleteAdvice = async (id) => {
    try {
      await fetch(`/api/farm/saved-advice/${id}?userId=${userId}`, { method: 'DELETE' });
      fetchFarmData();
    } catch (err) {
      console.error('Delete advice error:', err);
    }
  };

  return (
    <div className="container page-container">
      <Breadcrumbs items={[{ label: 'My Farm & Saved Advice' }]} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', color: '#14532D', marginBottom: '6px' }}>
            My Farm & Saved Agronomic Counsel
          </h1>
          <p style={{ color: '#647067', margin: 0, fontSize: '0.96rem' }}>
            Manage registered farm plots, soil records, active cropping patterns, and bookmarks of AI consultation advice.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary"
        >
          <Plus size={16} />
          <span>Add Farm Plot</span>
        </button>
      </div>

      {!isAuthenticated && (
        <div className="alert-banner info" style={{ marginBottom: '24px' }}>
          <AlertCircle size={20} />
          <div style={{ flex: 1 }}>
            <strong>Guest Mode Active:</strong> Your farm records are temporarily stored on this local machine. To sync and preserve your profiles across multiple devices, consider <Link to="/register" style={{ textDecoration: 'underline', fontWeight: '700' }}>creating a free farmer account</Link>.
          </div>
        </div>
      )}

      {/* Farm Plots Section */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.35rem', color: '#14532D', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Tractor size={20} color="#166534" />
          <span>Registered Farm Plots ({farms.length})</span>
        </h2>

        <div className="grid-3">
          {farms.map((farm) => (
            <div key={farm.id} className="card" style={{ border: '1px solid #E1EAE2', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', color: '#14532D', margin: 0 }}>
                    {farm.farmName}
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: '#647067', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                    <MapPin size={12} /> {farm.district}, {farm.state}
                  </span>
                </div>
                <button
                  onClick={() => handleDeleteFarm(farm.id)}
                  style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: '4px' }}
                  title="Delete plot"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.86rem', color: '#17251B', margin: '14px 0', flex: 1 }}>
                <div><strong>Area:</strong> {farm.acres} Acres</div>
                <div><strong>Soil Texture:</strong> {farm.soilType}</div>
                <div><strong>Irrigation:</strong> {farm.irrigationSource}</div>
                <div>
                  <strong>Active Crops:</strong>{' '}
                  {farm.currentCrops && farm.currentCrops.length > 0
                    ? farm.currentCrops.join(', ')
                    : 'None specified'}
                </div>
                {farm.notes && (
                  <div style={{ fontStyle: 'italic', color: '#647067', background: '#F8FAF9', padding: '8px', borderRadius: '6px' }}>
                    "{farm.notes}"
                  </div>
                )}
              </div>

              <div style={{ borderTop: '1px solid #E1EAE2', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link
                  to={`/weather?district=${encodeURIComponent(`${farm.district}, ${farm.state}`)}`}
                  style={{ fontSize: '0.82rem', color: '#166534', fontWeight: '600' }}
                >
                  View Plot Weather →
                </Link>
                <Link
                  to={`/ai-assistant?q=${encodeURIComponent(`Give me a crop protection plan for ${farm.acres} acres of ${farm.currentCrops?.join(' and ')} in ${farm.district}`)}`}
                  className="btn btn-soft btn-sm"
                >
                  Ask Advice
                </Link>
              </div>
            </div>
          ))}

          {farms.length === 0 && !loading && (
            <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
              <Tractor size={40} color="#166534" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '1.2rem', color: '#14532D', marginBottom: '6px' }}>No Farm Plots Registered Yet</h3>
              <p style={{ color: '#647067', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto 16px' }}>
                Save your land acreage, soil type, and current crops to receive customized fertilizer dosages and weather alerts.
              </p>
              <button onClick={() => setShowAddModal(true)} className="btn btn-primary btn-sm">
                <Plus size={16} /> Add Your First Plot
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Saved AI Advice Section */}
      <div>
        <h2 style={{ fontSize: '1.35rem', color: '#14532D', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bookmark size={20} color="#166534" />
          <span>Saved AI Advice & Diagnoses ({savedAdvice.length})</span>
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {savedAdvice.map((item) => (
            <div key={item.id} className="card" style={{ border: '1px solid #E1EAE2', padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span className="badge badge-green">{item.crop}</span>
                    <span className="badge badge-amber">{item.category}</span>
                    <span style={{ fontSize: '0.78rem', color: '#82A98E' }}>
                      {new Date(item.savedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.15rem', color: '#14532D', margin: 0 }}>
                    {item.title}
                  </h3>
                </div>

                <button
                  onClick={() => handleDeleteAdvice(item.id)}
                  style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: '4px' }}
                  title="Remove saved item"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div style={{ fontSize: '0.9rem', color: '#17251B', lineHeight: 1.6, whiteSpace: 'pre-wrap', background: '#F8FAF9', padding: '14px', borderRadius: '10px', border: '1px solid #E1EAE2', maxHeight: '180px', overflowY: 'auto' }}>
                {item.answer}
              </div>
            </div>
          ))}

          {savedAdvice.length === 0 && !loading && (
            <div className="card" style={{ textAlign: 'center', padding: '36px' }}>
              <Bookmark size={32} color="#647067" style={{ margin: '0 auto 10px' }} />
              <p style={{ color: '#647067', margin: 0, fontSize: '0.9rem' }}>
                You have not bookmarked any AI answers yet. Use the "Save" icon in the AI Assistant or Crop Doctor to store consultations here.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add Farm Modal Dialog */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#14532D' }}>Register New Farm Plot</h3>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#647067' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateFarm}>
              <div className="form-group">
                <label className="form-label">Farm Plot Name</label>
                <input
                  type="text"
                  required
                  placeholder="E.g., North Well Field, Gondal Plot"
                  className="form-input"
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Area (Acres)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    className="form-input"
                    value={acres}
                    onChange={(e) => setAcres(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">State</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">District</label>
                <input
                  type="text"
                  required
                  placeholder="E.g., Rajkot, Junagadh, Mehsana"
                  className="form-input"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Soil Type</label>
                <select
                  className="form-select"
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value)}
                >
                  <option value="Medium Black Soil">Medium Black Soil</option>
                  <option value="Sandy Loam">Sandy Loam</option>
                  <option value="Clayey Loam">Clayey Loam</option>
                  <option value="Red Soil">Red Soil</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Irrigation Facility</label>
                <select
                  className="form-select"
                  value={irrigationSource}
                  onChange={(e) => setIrrigationSource(e.target.value)}
                >
                  <option value="Borewell with Drip Irrigation">Borewell with Drip Irrigation</option>
                  <option value="Canal Irrigation">Canal Irrigation</option>
                  <option value="Rainfed (Monsoon Dependent)">Rainfed (Monsoon Dependent)</option>
                  <option value="Open Well with Sprinkler">Open Well with Sprinkler</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Current Crops (comma separated)</label>
                <input
                  type="text"
                  placeholder="Cotton, Groundnut, Wheat"
                  className="form-input"
                  value={currentCrops}
                  onChange={(e) => setCurrentCrops(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Optional Notes</label>
                <textarea
                  rows="2"
                  placeholder="Survey number, fertilizer history, or special soil conditions..."
                  className="form-textarea"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                ></textarea>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-secondary btn-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                >
                  Save Farm Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
