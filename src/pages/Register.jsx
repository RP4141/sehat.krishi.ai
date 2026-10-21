import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, ArrowRight, AlertTriangle, Sprout, MapPin, Phone } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [state, setState] = useState('Gujarat');
  const [district, setDistrict] = useState('Rajkot');
  const [primaryCrops, setPrimaryCrops] = useState('Cotton, Groundnut');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) {
      setError('Please fill in all mandatory fields.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
        state,
        district,
        primaryCrops: primaryCrops.split(',').map((c) => c.trim()).filter(Boolean)
      });
      navigate('/my-farm');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container page-container">
      <Breadcrumbs items={[{ label: 'Farmer Registration' }]} />

      <div style={{ maxWidth: '520px', margin: '30px auto' }}>
        <div className="card" style={{ padding: '36px' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#166534', margin: '0 auto 12px' }}>
              <Sprout size={28} />
            </div>
            <h1 style={{ fontSize: '1.6rem', color: '#14532D', margin: 0 }}>
              Create Farmer Profile
            </h1>
            <p style={{ fontSize: '0.86rem', color: '#647067', marginTop: '4px' }}>
              Sync your farm plots, receive localized weather alerts, and save AI advice
            </p>
          </div>

          {error && (
            <div className="alert-banner danger" style={{ padding: '10px 14px', marginBottom: '18px' }}>
              <AlertTriangle size={18} />
              <span style={{ fontSize: '0.88rem' }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="reg-name">Farmer Full Name *</label>
              <input
                id="reg-name"
                type="text"
                required
                placeholder="E.g., Bharatbhai Patel"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="reg-email">Email Address *</label>
                <input
                  id="reg-email"
                  type="email"
                  required
                  placeholder="farmer@example.com"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reg-phone">Mobile / WhatsApp</label>
                <input
                  id="reg-phone"
                  type="tel"
                  placeholder="9876543210"
                  className="form-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="reg-state">State</label>
                <input
                  id="reg-state"
                  type="text"
                  required
                  className="form-input"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reg-district">District</label>
                <input
                  id="reg-district"
                  type="text"
                  required
                  placeholder="E.g., Rajkot, Junagadh"
                  className="form-input"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-crops">Primary Crops Grown (comma separated)</label>
              <input
                id="reg-crops"
                type="text"
                placeholder="Cotton, Groundnut, Cumin, Wheat"
                className="form-input"
                value={primaryCrops}
                onChange={(e) => setPrimaryCrops(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-password">Create Secure Password *</label>
              <input
                id="reg-password"
                type="password"
                required
                placeholder="••••••••"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '10px' }}
              disabled={loading}
            >
              <span>{loading ? 'Creating Account...' : 'Register Profile'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #E1EAE2', fontSize: '0.88rem', color: '#647067' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#166534', fontWeight: '700' }}>
              Sign In Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
