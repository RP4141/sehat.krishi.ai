import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  TrendingUp, 
  Users, 
  Tractor, 
  MessageSquare, 
  Sparkles, 
  Key, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  RefreshCw, 
  ExternalLink,
  Sliders,
  Send,
  Calendar,
  Layers,
  MapPin,
  Check,
  Activity,
  Lock,
  LogOut,
  Eye,
  EyeOff,
  ArrowRight
} from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import { useApiKey } from '../context/ApiKeyContext';

export default function AdminConsole() {
  const { apiKey, saveApiKey } = useApiKey();

  // Admin Auth States
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return Boolean(sessionStorage.getItem('sehat_admin_token'));
  });
  const [adminUsername, setAdminUsername] = useState('admin');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Change Password Modal States
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passChangeError, setPassChangeError] = useState(null);
  const [passChangeSuccess, setPassChangeSuccess] = useState(null);
  const [passChangeLoading, setPassChangeLoading] = useState(false);

  // Dashboard Tabs & Data
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [config, setConfig] = useState({
    geminiApiKey: '',
    defaultModel: 'gemini-2.5-flash',
    temperature: 0.25,
    maxTokens: 2048,
    systemPromptMode: 'Strict ICAR Grounding'
  });
  const [mandiList, setMandiList] = useState([]);
  const [feedbackList, setFeedbackList] = useState([]);
  const [farmerData, setFarmerData] = useState({ users: [], farms: [] });
  const [advisory, setAdvisory] = useState({ title: '', summary: '', status: 'Active' });
  
  const [loading, setLoading] = useState(true);
  const [testResult, setTestResult] = useState(null);
  const [testingAi, setTestingAi] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(null);

  // Admin Fetch Helper
  const adminFetch = async (url, options = {}) => {
    const token = sessionStorage.getItem('sehat_admin_token');
    const headers = {
      ...(options.headers || {}),
      'Authorization': `Bearer ${token}`
    };
    const res = await fetch(url, { ...options, headers });
    if (res.status === 401) {
      sessionStorage.removeItem('sehat_admin_token');
      setIsAdminAuthenticated(false);
      throw new Error('Admin authorization expired. Please log in again.');
    }
    return res;
  };

  // Handle Admin Login
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    if (!adminPassword.trim()) {
      setAuthError('Please enter the administrator password.');
      return;
    }

    setAuthLoading(true);
    setAuthError(null);
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
        throw new Error(data.message || 'Invalid administrator password.');
      }

      sessionStorage.setItem('sehat_admin_token', data.token);
      setIsAdminAuthenticated(true);
      setAdminPassword('');
    } catch (err) {
      setAuthError(err.message || 'Login failed. Please check password.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle Admin Logout
  const handleAdminLogout = async () => {
    const token = sessionStorage.getItem('sehat_admin_token');
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (e) {
      // Ignore network errors on logout
    }
    sessionStorage.removeItem('sehat_admin_token');
    setIsAdminAuthenticated(false);
  };

  // Handle Change Password
  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPass.length < 4) {
      setPassChangeError('New password must be at least 4 characters.');
      return;
    }
    if (newPass !== confirmPass) {
      setPassChangeError('New passwords do not match.');
      return;
    }

    setPassChangeLoading(true);
    setPassChangeError(null);
    setPassChangeSuccess(null);
    try {
      const res = await adminFetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: currentPass.trim(),
          newPassword: newPass.trim()
        })
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to change password.');
      }
      setPassChangeSuccess('Admin password changed successfully!');
      setTimeout(() => {
        setShowPasswordModal(false);
        setCurrentPass('');
        setNewPass('');
        setConfirmPass('');
        setPassChangeSuccess(null);
      }, 1500);
    } catch (err) {
      setPassChangeError(err.message || 'Failed to update password.');
    } finally {
      setPassChangeLoading(false);
    }
  };

  const fetchAdminData = async () => {
    if (!isAdminAuthenticated) return;
    setLoading(true);
    try {
      const [statsRes, configRes, mandiRes, fbRes, farmsRes, advRes] = await Promise.all([
        adminFetch('/api/admin/stats').then((r) => r.json()),
        adminFetch('/api/admin/config').then((r) => r.json()),
        fetch('/api/admin/mandi').then((r) => r.json()),
        adminFetch('/api/admin/feedback').then((r) => r.json()),
        adminFetch('/api/admin/farms').then((r) => r.json()),
        fetch('/api/admin/advisory').then((r) => r.json())
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (configRes.success) setConfig(configRes.data);
      if (mandiRes.success) setMandiList(mandiRes.data);
      if (fbRes.success) setFeedbackList(fbRes.data);
      if (farmsRes.success) setFarmerData(farmsRes.data);
      if (advRes.success) setAdvisory(advRes.data);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdminAuthenticated) {
      fetchAdminData();
    }
  }, [isAdminAuthenticated]);

  const handleTestAi = async () => {
    setTestingAi(true);
    setTestResult(null);
    try {
      const res = await adminFetch('/api/admin/test-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: config.geminiApiKey || apiKey,
          model: config.defaultModel
        })
      });
      const data = await res.json();
      setTestResult(data);
    } catch (err) {
      setTestResult({ success: false, error: err.message || 'Connection error' });
    } finally {
      setTestingAi(false);
    }
  };

  const handleSaveConfig = async (e) => {
    e.preventDefault();
    try {
      const res = await adminFetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      const data = await res.json();
      if (data.success) {
        if (config.geminiApiKey) {
          saveApiKey(config.geminiApiKey);
        }
        setSaveSuccess('Configuration updated successfully!');
        setTimeout(() => setSaveSuccess(null), 2500);
        fetchAdminData();
      }
    } catch (err) {
      console.error('Save config error:', err);
    }
  };

  const handleAddMandi = async (e) => {
    e.preventDefault();
    try {
      const res = await adminFetch('/api/admin/mandi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMandi)
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccess('New APMC Mandi rate added successfully!');
        setTimeout(() => setSaveSuccess(null), 2500);
        fetchAdminData();
      }
    } catch (err) {
      console.error('Add mandi error:', err);
    }
  };

  const handleDeleteCustomMandi = async (id) => {
    if (!confirm('Remove this custom mandi rate entry?')) return;
    try {
      await adminFetch(`/api/admin/mandi/${id}`, { method: 'DELETE' });
      fetchAdminData();
    } catch (err) {
      console.error('Delete mandi error:', err);
    }
  };

  const handleToggleFeedbackStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'Reviewed' ? 'New' : 'Reviewed';
    try {
      await adminFetch(`/api/admin/feedback/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      fetchAdminData();
    } catch (err) {
      console.error('Update status error:', err);
    }
  };

  const handleSaveAdvisory = async (e) => {
    e.preventDefault();
    try {
      const res = await adminFetch('/api/admin/advisory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(advisory)
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccess('Seasonal Advisory broadcast updated!');
        setTimeout(() => setSaveSuccess(null), 2500);
      }
    } catch (err) {
      console.error('Save advisory error:', err);
    }
  };

  // ========================================================
  // RENDER ADMIN AUTHENTICATION GATE IF NOT LOGGED IN
  // ========================================================
  if (!isAdminAuthenticated) {
    return (
      <div className="container page-container">
        <Breadcrumbs items={[{ label: 'Admin Security Verification' }]} />

        <div style={{ maxWidth: '440px', margin: '40px auto' }}>
          <div className="card" style={{ padding: '36px', boxShadow: '0 16px 36px rgba(22, 101, 52, 0.12)', border: '1px solid #BBF7D0' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '18px', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#166534', margin: '0 auto 14px', boxShadow: '0 4px 14px rgba(34, 197, 94, 0.25)' }}>
                <Lock size={30} />
              </div>
              <h1 style={{ fontSize: '1.65rem', color: '#14532D', margin: 0, fontWeight: 800 }}>
                Admin Portal Login
              </h1>
              <p style={{ fontSize: '0.86rem', color: '#647067', marginTop: '6px' }}>
                Restricted access. Only authorized administrators can enter.
              </p>
            </div>

            {authError && (
              <div className="alert-banner danger" style={{ padding: '10px 14px', marginBottom: '18px' }}>
                <AlertTriangle size={18} />
                <span style={{ fontSize: '0.88rem' }}>{authError}</span>
              </div>
            )}

            <form onSubmit={handleAdminLogin}>
              <div className="form-group">
                <label className="form-label" htmlFor="admin-user">Admin Username</label>
                <input
                  id="admin-user"
                  type="text"
                  required
                  className="form-input"
                  style={{ width: '100%' }}
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  placeholder="admin"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="admin-pass">Admin Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="admin-pass"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter admin password"
                    className="form-input"
                    style={{ width: '100%', paddingRight: '40px' }}
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#647067' }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div style={{ background: '#F0FDF4', border: '1px solid #DCFCE7', borderRadius: '10px', padding: '10px 12px', fontSize: '0.8rem', color: '#166534', marginBottom: '18px' }}>
                💡 <strong>Default Admin Password:</strong> <code>admin@123</code><br/>
                <span style={{ fontSize: '0.74rem', color: '#647067' }}>Login karne ke baad aap kabhi bhi password change kar sakte hain.</span>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px', fontSize: '1rem' }}
                disabled={authLoading}
              >
                <Lock size={16} />
                <span>{authLoading ? 'Verifying Credentials...' : 'Unlock Admin Console'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container page-container">
      <Breadcrumbs items={[{ label: 'Admin Console' }]} />

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="modal-backdrop" style={{ zIndex: 10000 }}>
          <div className="modal-box" style={{ maxWidth: '420px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Key size={20} color="#166534" />
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#14532D' }}>Change Admin Password</h3>
              </div>
              <button onClick={() => setShowPasswordModal(false)} className="btn btn-secondary btn-sm" type="button">✕</button>
            </div>

            {passChangeError && (
              <div className="alert-banner danger" style={{ padding: '8px 12px', marginBottom: '14px', fontSize: '0.85rem' }}>
                <AlertTriangle size={16} />
                <span>{passChangeError}</span>
              </div>
            )}

            {passChangeSuccess && (
              <div className="alert-banner success" style={{ padding: '8px 12px', marginBottom: '14px', fontSize: '0.85rem', background: '#DCFCE7', color: '#166534' }}>
                <CheckCircle2 size={16} />
                <span>{passChangeSuccess}</span>
              </div>
            )}

            <form onSubmit={handleChangePasswordSubmit}>
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input
                  type="password"
                  required
                  className="form-input"
                  value={currentPass}
                  onChange={(e) => setCurrentPass(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              <div className="form-group">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  required
                  className="form-input"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="At least 4 characters"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  required
                  className="form-input"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  placeholder="Re-enter new password"
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={passChangeLoading}>
                  {passChangeLoading ? 'Updating...' : 'Save Password'}
                </button>
                <button type="button" onClick={() => setShowPasswordModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
            <span className="badge badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={14} /> System Administrator
            </span>
            <span style={{ fontSize: '0.8rem', color: '#166534', fontWeight: '600' }}>
              SEHAT-KRISHI AI Engine v2.0
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#15803D', background: '#DCFCE7', padding: '2px 8px', borderRadius: '12px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22C55E' }}></span>
              Authenticated
            </span>
          </div>
          <h1 style={{ fontSize: '2.2rem', color: '#14532D', margin: 0 }}>
            Agricultural Operations & AI Console
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button onClick={() => setShowPasswordModal(true)} className="btn btn-secondary btn-sm" title="Change Admin Password">
            <Key size={14} />
            <span>Change Password</span>
          </button>
          <button onClick={handleAdminLogout} className="btn btn-secondary btn-sm" style={{ color: '#DC2626', borderColor: '#FECACA' }} title="Logout from Admin Console">
            <LogOut size={14} />
            <span>Logout</span>
          </button>
          <button onClick={fetchAdminData} className="btn btn-primary btn-sm" disabled={loading}>
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="alert-banner success" style={{ marginBottom: '20px' }}>
          <CheckCircle2 size={18} />
          <span>{saveSuccess}</span>
        </div>
      )}

      {/* KPI Stats Row */}
      {stats && (
        <div className="grid-4" style={{ marginBottom: '32px' }}>
          <div className="card" style={{ padding: '20px', borderLeft: '4px solid #166534' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: '#647067', fontWeight: '700', textTransform: 'uppercase' }}>Registered Farmers</span>
                <span style={{ fontSize: '1.9rem', fontWeight: '800', color: '#14532D', display: 'block', margin: '4px 0' }}>
                  {stats.totalUsers}
                </span>
                <span style={{ fontSize: '0.78rem', color: '#166534' }}>Gujarat & Multi-state</span>
              </div>
              <div style={{ background: '#DCFCE7', padding: '12px', borderRadius: '12px', color: '#166534' }}>
                <Users size={24} />
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '20px', borderLeft: '4px solid #22C55E' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: '#647067', fontWeight: '700', textTransform: 'uppercase' }}>Land Monitored</span>
                <span style={{ fontSize: '1.9rem', fontWeight: '800', color: '#166534', display: 'block', margin: '4px 0' }}>
                  {stats.totalAcres} <span style={{ fontSize: '1.1rem', fontWeight: '600' }}>Acres</span>
                </span>
                <span style={{ fontSize: '0.78rem', color: '#647067' }}>Across {stats.totalFarms} Plots</span>
              </div>
              <div style={{ background: '#F0FDF4', padding: '12px', borderRadius: '12px', color: '#22C55E' }}>
                <Tractor size={24} />
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '20px', borderLeft: '4px solid #0284C7' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: '#647067', fontWeight: '700', textTransform: 'uppercase' }}>Mandi Rates Feed</span>
                <span style={{ fontSize: '1.9rem', fontWeight: '800', color: '#0284C7', display: 'block', margin: '4px 0' }}>
                  {mandiList.length}
                </span>
                <span style={{ fontSize: '0.78rem', color: '#0284C7' }}>APMC Markets Active</span>
              </div>
              <div style={{ background: '#EFF6FF', padding: '12px', borderRadius: '12px', color: '#0284C7' }}>
                <TrendingUp size={24} />
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '20px', borderLeft: '4px solid #D97706' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: '#647067', fontWeight: '700', textTransform: 'uppercase' }}>Farmer Feedback</span>
                <span style={{ fontSize: '1.9rem', fontWeight: '800', color: '#B45309', display: 'block', margin: '4px 0' }}>
                  {stats.totalFeedback}
                </span>
                <span style={{ fontSize: '0.78rem', color: '#B45309' }}>Inquiries & Ratings</span>
              </div>
              <div style={{ background: '#FEF3C7', padding: '12px', borderRadius: '12px', color: '#B45309' }}>
                <MessageSquare size={24} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Tab Controls */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid #E1EAE2', marginBottom: '24px', overflowX: 'auto', paddingBottom: '4px' }}>
        {[
          { id: 'overview', label: 'System Overview', icon: Activity },
          { id: 'ai-config', label: 'Gemini AI Engine', icon: Cpu },
          { id: 'mandi', label: 'APMC Mandi Manager', icon: TrendingUp },
          { id: 'farmers', label: 'Farmer Directory', icon: Users },
          { id: 'feedback', label: 'Inquiries & Feedback', icon: MessageSquare },
          { id: 'advisory', label: 'Seasonal Advisory', icon: Calendar }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                border: 'none',
                background: isActive ? '#F0FDF4' : 'transparent',
                color: isActive ? '#166534' : '#647067',
                fontWeight: isActive ? '700' : '500',
                fontSize: '0.92rem',
                borderRadius: '8px 8px 0 0',
                borderBottom: isActive ? '3px solid #166534' : '3px solid transparent',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s'
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: System Overview */}
      {activeTab === 'overview' && (
        <div className="grid-2" style={{ alignItems: 'start' }}>
          <div className="card">
            <h3 style={{ fontSize: '1.25rem', color: '#14532D', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={20} color="#166534" />
              <span>Operational Health & AI Pipeline</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.92rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#F8FAF9', borderRadius: '8px' }}>
                <span style={{ color: '#647067' }}>Google Gemini Integration:</span>
                <strong style={{ color: stats?.geminiConfigured ? '#15803D' : '#D97706' }}>
                  {stats?.geminiConfigured ? '✓ Configured & Active' : '⚠ API Key Required'}
                </strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#F8FAF9', borderRadius: '8px' }}>
                <span style={{ color: '#647067' }}>Active AI Model:</span>
                <strong>{config.defaultModel || 'gemini-2.5-flash'}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#F8FAF9', borderRadius: '8px' }}>
                <span style={{ color: '#647067' }}>RAG Knowledge Corpus:</span>
                <strong style={{ color: '#166534' }}>ICAR / DPPQS / KVK Verified</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#F8FAF9', borderRadius: '8px' }}>
                <span style={{ color: '#647067' }}>Meteorological Data Feed:</span>
                <strong>Open-Meteo & IMD Seasonal Baseline</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#F8FAF9', borderRadius: '8px' }}>
                <span style={{ color: '#647067' }}>Database Storage:</span>
                <strong style={{ color: '#166534' }}>Atomic JSON Store (server/data/db.json)</strong>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('ai-config')}
              className="btn btn-primary btn-sm"
              style={{ marginTop: '20px', width: '100%' }}
            >
              Configure AI Engine Settings →
            </button>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1.25rem', color: '#14532D', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={20} color="#166534" />
              <span>Current Platform Broadcast</span>
            </h3>

            <div style={{ background: '#F0FDF4', padding: '16px', borderRadius: '12px', border: '1px solid #BBF7D0', marginBottom: '16px' }}>
              <span className="badge badge-green" style={{ marginBottom: '8px' }}>
                Status: {advisory.status}
              </span>
              <h4 style={{ fontSize: '1.1rem', color: '#14532D', margin: '4px 0 8px 0' }}>
                {advisory.title}
              </h4>
              <p style={{ margin: 0, fontSize: '0.88rem', color: '#166534', lineHeight: 1.6 }}>
                {advisory.summary}
              </p>
            </div>

            <button
              onClick={() => setActiveTab('advisory')}
              className="btn btn-secondary btn-sm"
              style={{ width: '100%' }}
            >
              Edit Broadcast Banner →
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Gemini AI Engine Configuration */}
      {activeTab === 'ai-config' && (
        <div className="grid-2" style={{ alignItems: 'start' }}>
          <div className="card">
            <h3 style={{ fontSize: '1.25rem', color: '#14532D', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Cpu size={20} color="#166534" />
              <span>Gemini Model Parameters</span>
            </h3>

            <form onSubmit={handleSaveConfig}>
              <div className="form-group">
                <label className="form-label">Google Gemini API Key</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="AIzaSy... (Leave unchanged to keep current)"
                  value={config.geminiApiKey || ''}
                  onChange={(e) => setConfig({ ...config, geminiApiKey: e.target.value })}
                />
                <span style={{ fontSize: '0.78rem', color: '#647067', marginTop: '4px' }}>
                  Current Status: {config.hasKey ? `Active (${config.apiKeyMasked})` : 'Not Set in Server'}
                </span>
              </div>

              <div className="form-group">
                <label className="form-label">Default LLM Model</label>
                <select
                  className="form-select"
                  value={config.defaultModel}
                  onChange={(e) => setConfig({ ...config, defaultModel: e.target.value })}
                >
                  <option value="gemini-2.5-flash">Gemini 2.5 Flash (Ultra-fast, Multimodal Vision Recommended)</option>
                  <option value="gemini-1.5-flash">Gemini 1.5 Flash (Standard)</option>
                  <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep Agronomic Reasoning)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Sampling Temperature: {config.temperature}
                </label>
                <input
                  type="range"
                  min="0.0"
                  max="0.8"
                  step="0.05"
                  value={config.temperature}
                  onChange={(e) => setConfig({ ...config, temperature: parseFloat(e.target.value) })}
                  style={{ accentColor: '#166534', width: '100%' }}
                />
                <span style={{ fontSize: '0.76rem', color: '#647067' }}>
                  Low values (0.1 - 0.3) enforce precise factual and dosage consistency.
                </span>
              </div>

              <div className="form-group">
                <label className="form-label">Max Output Tokens</label>
                <input
                  type="number"
                  className="form-input"
                  value={config.maxTokens}
                  onChange={(e) => setConfig({ ...config, maxTokens: parseInt(e.target.value, 10) })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">System Guardrail Mode</label>
                <select
                  className="form-select"
                  value={config.systemPromptMode}
                  onChange={(e) => setConfig({ ...config, systemPromptMode: e.target.value })}
                >
                  <option value="Strict ICAR Grounding">Strict ICAR / CIBRC Grounding (Safety First)</option>
                  <option value="Standard Agronomic Counsel">Standard Agronomic Counsel</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                Save AI Configuration
              </button>
            </form>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1.25rem', color: '#14532D', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={20} color="#166534" />
              <span>Live AI Connection Diagnostic</span>
            </h3>

            <p style={{ fontSize: '0.88rem', color: '#647067', lineHeight: 1.6, marginBottom: '20px' }}>
              Ping Google Gemini's REST endpoint directly to verify API key validity, latency, and response generation in real time.
            </p>

            <button
              onClick={handleTestAi}
              className="btn btn-secondary"
              style={{ width: '100%', marginBottom: '20px' }}
              disabled={testingAi}
            >
              <Cpu size={16} />
              <span>{testingAi ? 'Pinging Gemini API...' : 'Run Live Diagnostic Ping'}</span>
            </button>

            {testResult && (
              <div style={{
                padding: '16px',
                borderRadius: '12px',
                background: testResult.success ? '#F0FDF4' : '#FEF2F2',
                border: `1px solid ${testResult.success ? '#BBF7D0' : '#FECACA'}`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  {testResult.success ? (
                    <CheckCircle2 size={18} color="#15803D" />
                  ) : (
                    <AlertTriangle size={18} color="#DC2626" />
                  )}
                  <strong style={{ color: testResult.success ? '#15803D' : '#991B1B' }}>
                    {testResult.success ? 'Diagnostic Passed' : 'Diagnostic Failed'}
                  </strong>
                </div>

                <div style={{ fontSize: '0.85rem', color: '#17251B', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div><strong>Roundtrip Latency:</strong> {testResult.latencyMs} ms</div>
                  {testResult.modelUsed && <div><strong>Tested Model:</strong> {testResult.modelUsed}</div>}
                  {testResult.reply && <div><strong>Model Response:</strong> "{testResult.reply}"</div>}
                  {testResult.error && <div style={{ color: '#DC2626' }}><strong>Error:</strong> {testResult.error}</div>}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: APMC Mandi Rates Manager */}
      {activeTab === 'mandi' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card">
            <h3 style={{ fontSize: '1.25rem', color: '#14532D', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Plus size={20} color="#166534" />
              <span>Publish New APMC Mandi Rate</span>
            </h3>

            <form onSubmit={handleAddMandi}>
              <div className="grid-3">
                <div className="form-group">
                  <label className="form-label">Commodity</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={newMandi.commodity}
                    onChange={(e) => setNewMandi({ ...newMandi, commodity: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Variety</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newMandi.variety}
                    onChange={(e) => setNewMandi({ ...newMandi, variety: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Mandi / APMC Yard</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={newMandi.mandi}
                    onChange={(e) => setNewMandi({ ...newMandi, mandi: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid-4">
                <div className="form-group">
                  <label className="form-label">District</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newMandi.district}
                    onChange={(e) => setNewMandi({ ...newMandi, district: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">State</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newMandi.state}
                    onChange={(e) => setNewMandi({ ...newMandi, state: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Modal Price (₹/Quintal)</label>
                  <input
                    type="number"
                    required
                    className="form-input"
                    value={newMandi.modalPrice}
                    onChange={(e) => setNewMandi({ ...newMandi, modalPrice: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Price Trend</label>
                  <select
                    className="form-select"
                    value={newMandi.trend}
                    onChange={(e) => setNewMandi({ ...newMandi, trend: e.target.value })}
                  >
                    <option value="up">Rising (↑)</option>
                    <option value="stable">Steady (—)</option>
                    <option value="down">Softening (↓)</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-sm">
                Publish Mandi Rate
              </button>
            </form>
          </div>

          {/* Mandi List Table */}
          <div className="table-wrapper">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Commodity / Variety</th>
                  <th>Mandi / Yard</th>
                  <th>District & State</th>
                  <th>Modal Price</th>
                  <th>Trend</th>
                  <th>Type</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {mandiList.map((item) => {
                  const isCustom = item.id.startsWith('mandi_custom_');
                  return (
                    <tr key={item.id}>
                      <td>
                        <strong>{item.commodity}</strong>
                        <span style={{ display: 'block', fontSize: '0.76rem', color: '#647067' }}>{item.variety}</span>
                      </td>
                      <td>{item.mandi}</td>
                      <td>{item.district}, {item.state}</td>
                      <td style={{ fontWeight: '700', color: '#166534' }}>
                        ₹{item.modalPrice?.toLocaleString()} / Quintal
                      </td>
                      <td>
                        <span className={`badge ${item.trend === 'up' ? 'badge-green' : item.trend === 'down' ? 'badge-red' : 'badge-amber'}`}>
                          {item.trend}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${isCustom ? 'badge-amber' : 'badge-green'}`}>
                          {isCustom ? 'Admin Added' : 'Agmarknet'}
                        </span>
                      </td>
                      <td>
                        {isCustom ? (
                          <button
                            onClick={() => handleDeleteCustomMandi(item.id)}
                            style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer' }}
                            title="Delete custom rate"
                          >
                            <Trash2 size={16} />
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>System Feed</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Farmer Directory */}
      {activeTab === 'farmers' && (
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', color: '#14532D', marginBottom: '16px' }}>
            Registered Farmers & Land Holdings ({farmerData.users.length})
          </h3>

          <div className="table-wrapper">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Farmer Name</th>
                  <th>Email & Phone</th>
                  <th>Location</th>
                  <th>Primary Crops</th>
                  <th>Registered Plots</th>
                </tr>
              </thead>
              <tbody>
                {farmerData.users.map((u) => {
                  const userPlots = farmerData.farms.filter((f) => f.userId === u.id);
                  const totalAcres = userPlots.reduce((acc, p) => acc + (parseFloat(p.acres) || 0), 0);
                  return (
                    <tr key={u.id}>
                      <td>
                        <strong>{u.name}</strong>
                      </td>
                      <td>
                        <div>{u.email}</div>
                        <span style={{ fontSize: '0.78rem', color: '#647067' }}>{u.phone || 'N/A'}</span>
                      </td>
                      <td>{u.district}, {u.state}</td>
                      <td>{Array.isArray(u.primaryCrops) ? u.primaryCrops.join(', ') : u.primaryCrops}</td>
                      <td>
                        <span className="badge badge-green">
                          {userPlots.length} Plot{userPlots.length !== 1 ? 's' : ''} ({totalAcres} Acres)
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Inquiries & Feedback Desk */}
      {activeTab === 'feedback' && (
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', color: '#14532D', marginBottom: '16px' }}>
            Farmer Feedback & Technical Messages ({feedbackList.length})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {feedbackList.map((fb) => (
              <div key={fb.id} style={{ padding: '16px', borderRadius: '12px', border: '1px solid #E1EAE2', background: '#F8FAF9' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div>
                    <strong>{fb.name}</strong> ({fb.email} {fb.phone ? `• ${fb.phone}` : ''})
                    <span className="badge badge-amber" style={{ marginLeft: '10px' }}>{fb.category}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.85rem' }}>{'⭐'.repeat(fb.rating || 5)}</span>
                    <button
                      onClick={() => handleToggleFeedbackStatus(fb.id, fb.status)}
                      className={`badge ${fb.status === 'Reviewed' ? 'badge-green' : 'badge-amber'}`}
                      style={{ cursor: 'pointer', border: 'none' }}
                    >
                      {fb.status === 'Reviewed' ? '✓ Reviewed' : 'Mark Reviewed'}
                    </button>
                  </div>
                </div>

                <p style={{ margin: 0, fontSize: '0.9rem', color: '#17251B', lineHeight: 1.5 }}>
                  "{fb.message}"
                </p>
                <span style={{ display: 'block', fontSize: '0.74rem', color: '#82A98E', marginTop: '6px' }}>
                  Submitted: {new Date(fb.submittedAt).toLocaleString()}
                </span>
              </div>
            ))}

            {feedbackList.length === 0 && (
              <p style={{ color: '#647067' }}>No feedback submissions recorded yet.</p>
            )}
          </div>
        </div>
      )}

      {/* Tab 6: Seasonal Advisory Broadcaster */}
      {activeTab === 'advisory' && (
        <div className="card" style={{ maxWidth: '680px' }}>
          <h3 style={{ fontSize: '1.25rem', color: '#14532D', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={20} color="#166534" />
            <span>Manage Platform Seasonal Advisory Banner</span>
          </h3>

          <form onSubmit={handleSaveAdvisory}>
            <div className="form-group">
              <label className="form-label">Advisory Headline</label>
              <input
                type="text"
                required
                className="form-input"
                value={advisory.title}
                onChange={(e) => setAdvisory({ ...advisory, title: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Advisory Broadcast Content</label>
              <textarea
                rows="4"
                required
                className="form-textarea"
                value={advisory.summary}
                onChange={(e) => setAdvisory({ ...advisory, summary: e.target.value })}
              ></textarea>
            </div>

            <div className="form-group">
              <label className="form-label">Broadcast Status</label>
              <select
                className="form-select"
                value={advisory.status}
                onChange={(e) => setAdvisory({ ...advisory, status: e.target.value })}
              >
                <option value="Active">Active (Visible to all farmers on homepage)</option>
                <option value="Paused">Paused</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary">
              Publish Seasonal Broadcast
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
