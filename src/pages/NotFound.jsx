import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Home, Bot, ArrowLeft } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';

export default function NotFound() {
  return (
    <div className="container page-container" style={{ textAlign: 'center', padding: '80px 20px' }}>
      <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#F0FDF4', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', border: '2px solid #BBF7D0' }}>
        <Sprout size={42} />
      </div>

      <span className="badge badge-amber" style={{ marginBottom: '14px' }}>404 Error</span>
      <h1 style={{ fontSize: '2.5rem', color: '#14532D', marginBottom: '12px' }}>
        Agricultural Page Not Found
      </h1>
      <p style={{ color: '#647067', fontSize: '1rem', maxWidth: '520px', margin: '0 auto 32px', lineHeight: 1.6 }}>
        The agricultural page, crop guide, or advisory tool you are looking for has moved or does not exist. Use the shortcuts below to return safely to active field guidance.
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <Link to="/" className="btn btn-primary">
          <Home size={18} />
          <span>Back to Homepage</span>
        </Link>
        <Link to="/ai-assistant" className="btn btn-secondary">
          <Bot size={18} />
          <span>Ask AI Assistant</span>
        </Link>
      </div>
    </div>
  );
}
