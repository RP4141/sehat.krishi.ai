import React, { useState } from 'react';
import { X, Key, ExternalLink, CheckCircle2, AlertTriangle, Shield } from 'lucide-react';
import { useApiKey } from '../context/ApiKeyContext';

export default function ApiKeyModal() {
  const { apiKey, hasServerKey, isConfigured, keyModalOpen, setKeyModalOpen, saveApiKey } = useApiKey();
  const [inputVal, setInputVal] = useState(apiKey || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!keyModalOpen) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    await saveApiKey(inputVal);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setKeyModalOpen(false);
    }, 1200);
  };

  const handleClear = async () => {
    setInputVal('');
    await saveApiKey('');
  };

  return (
    <div className="modal-backdrop" onClick={() => setKeyModalOpen(false)}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: '#DCFCE7', padding: '8px', borderRadius: '10px', color: '#166534' }}>
              <Key size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#14532D' }}>Gemini AI Configuration</h3>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#647067' }}>
                Activate real Google Gemini 2.5/1.5 & Vision models
              </p>
            </div>
          </div>
          <button
            onClick={() => setKeyModalOpen(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#647067' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Current Status Pill */}
        <div style={{
          padding: '12px 16px',
          borderRadius: '10px',
          background: isConfigured ? '#DCFCE7' : '#FEF3C7',
          color: isConfigured ? '#15803D' : '#B45309',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.88rem',
          fontWeight: '600',
          marginBottom: '20px'
        }}>
          {isConfigured ? (
            <>
              <CheckCircle2 size={18} />
              <span>AI Integration Active: Real Gemini inference enabled</span>
            </>
          ) : (
            <>
              <AlertTriangle size={18} />
              <span>No API Key Detected: Enter key below or set in .env</span>
            </>
          )}
        </div>

        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label" htmlFor="gemini-key-input">
              Google Gemini API Key
            </label>
            <input
              id="gemini-key-input"
              type="password"
              className="form-input"
              placeholder="AIzaSy..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              autoComplete="off"
            />
            <span style={{ fontSize: '0.78rem', color: '#647067', marginTop: '4px' }}>
              Stored securely on the server and local session. Never bundled in public browser code.
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '20px' }}>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: '0.85rem',
                color: '#166534',
                fontWeight: '600',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              Get Free Key from Google AI Studio <ExternalLink size={13} />
            </a>

            <div style={{ display: 'flex', gap: '8px' }}>
              {isConfigured && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="btn btn-secondary btn-sm"
                >
                  Clear
                </button>
              )}
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                disabled={!inputVal.trim()}
              >
                {savedSuccess ? 'Saved!' : 'Save Key'}
              </button>
            </div>
          </div>
        </form>

        <div style={{
          marginTop: '22px',
          paddingTop: '16px',
          borderTop: '1px solid #E1EAE2',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.78rem',
          color: '#82A98E'
        }}>
          <Shield size={14} color="#166534" />
          <span>You can also set <code>GEMINI_API_KEY=your_key</code> in the server <code>.env</code> file.</span>
        </div>
      </div>
    </div>
  );
}
