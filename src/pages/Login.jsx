import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, ArrowRight, AlertTriangle, Sprout, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  // Mode: 'farmer' | 'admin'
  const [loginMode, setLoginMode] = useState('farmer');

  // Farmer login fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Admin login fields
  const [adminUsername, setAdminUsername] = useState('admin');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPass, setShowAdminPass] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFarmerSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please provide your email and password.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await login(email.trim(), password);
      navigate('/my-farm');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    if (!adminPassword.trim()) {
      setError('Please enter the administrator password.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: adminUsername.trim(),
          password: adminPassword.trim()
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Access Denied: Invalid admin password.');
      }

      sessionStorage.setItem('sehat_admin_token', data.token);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Admin authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container page-container">
      <Breadcrumbs items={[{ label: loginMode === 'admin' ? 'Admin Login' : 'Farmer Login' }]} />

      <div style={{ maxWidth: '440px', margin: '40px auto' }}>
        <div className="card" style={{ padding: '36px', boxShadow: '0 12px 32px rgba(22, 101, 52, 0.08)' }}>
          {/* Mode Switcher Tabs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', background: '#F0FDF4', padding: '4px', borderRadius: '12px', marginBottom: '24px', border: '1px solid #DCFCE7' }}>
            <button
              type="button"
              onClick={() => { setLoginMode('farmer'); setError(null); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '8px 12px',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.86rem',
                fontWeight: '700',
                cursor: 'pointer',
                background: loginMode === 'farmer' ? '#ffffff' : 'transparent',
                color: loginMode === 'farmer' ? '#166534' : '#647067',
                boxShadow: loginMode === 'farmer' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              <Sprout size={16} />
              <span>Farmer Login</span>
            </button>

            <button
              type="button"
              onClick={() => { setLoginMode('admin'); setError(null); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '8px 12px',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.86rem',
                fontWeight: '700',
                cursor: 'pointer',
                background: loginMode === 'admin' ? '#166534' : 'transparent',
                color: loginMode === 'admin' ? '#ffffff' : '#647067',
                boxShadow: loginMode === 'admin' ? '0 2px 6px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              <ShieldCheck size={16} />
              <span>Admin Portal</span>
            </button>
          </div>

          {/* Heading */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: loginMode === 'admin' ? '#FEF2F2' : '#DCFCE7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: loginMode === 'admin' ? '#DC2626' : '#166534',
              margin: '0 auto 12px',
              boxShadow: loginMode === 'admin' ? '0 4px 12px rgba(220,38,38,0.15)' : '0 4px 12px rgba(34,197,94,0.15)'
            }}>
              {loginMode === 'admin' ? <Lock size={26} /> : <Sprout size={28} />}
            </div>
            <h1 style={{ fontSize: '1.55rem', color: '#14532D', margin: 0, fontWeight: 800 }}>
              {loginMode === 'admin' ? 'Admin Operations Login' : 'Farmer Account Login'}
            </h1>
            <p style={{ fontSize: '0.86rem', color: '#647067', marginTop: '4px' }}>
              {loginMode === 'admin'
                ? 'Only verified administrators can access the console'
                : 'Access your registered farms and saved crop advice'}
            </p>
          </div>

          {error && (
            <div className="alert-banner danger" style={{ padding: '10px 14px', marginBottom: '18px' }}>
              <AlertTriangle size={18} />
              <span style={{ fontSize: '0.88rem' }}>{error}</span>
            </div>
          )}

          {/* FARMER LOGIN FORM */}
          {loginMode === 'farmer' ? (
            <form onSubmit={handleFarmerSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="login-email">Email Address</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="login-email"
                    type="email"
                    required
                    placeholder="farmer@example.com"
                    className="form-input"
                    style={{ width: '100%' }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="login-password">Password</label>
                <input
                  id="login-password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="form-input"
                  style={{ width: '100%' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '10px', padding: '12px' }}
                disabled={loading}
              >
                <span>{loading ? 'Logging in...' : 'Sign In as Farmer'}</span>
                <ArrowRight size={16} />
              </button>

              <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #E1EAE2', fontSize: '0.88rem', color: '#647067' }}>
                New to SEHAT-KRISHI AI?{' '}
                <Link to="/register" style={{ color: '#166534', fontWeight: '700' }}>
                  Create an Account
                </Link>
              </div>
            </form>
          ) : (
            /* ADMIN LOGIN FORM */
            <form onSubmit={handleAdminSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="admin-username">Admin Username</label>
                <input
                  id="admin-username"
                  type="text"
                  required
                  placeholder="admin"
                  className="form-input"
                  style={{ width: '100%' }}
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="admin-pass-input">Admin Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="admin-pass-input"
                    type={showAdminPass ? 'text' : 'password'}
                    required
                    placeholder="Enter admin password"
                    className="form-input"
                    style={{ width: '100%', paddingRight: '40px' }}
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPass(!showAdminPass)}
                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#647067' }}
                  >
                    {showAdminPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div style={{ background: '#F0FDF4', border: '1px solid #DCFCE7', borderRadius: '10px', padding: '10px 12px', fontSize: '0.78rem', color: '#166534', marginBottom: '18px' }}>
                🔒 <strong>Restricted Security Zone:</strong> Sirf authorized administrators login kar sakte hain. Default password: <code>admin@123</code>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '6px', padding: '12px', background: 'linear-gradient(135deg, #166534, #14532D)' }}
                disabled={loading}
              >
                <Lock size={16} />
                <span>{loading ? 'Authenticating Admin...' : 'Enter Admin Console'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
