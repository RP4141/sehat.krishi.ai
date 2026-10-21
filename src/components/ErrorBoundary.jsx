import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('SEHAT-KRISHI Uncaught UI Error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#F8FAF8',
          padding: '24px',
          fontFamily: "'Inter', sans-serif"
        }}>
          <div style={{
            maxWidth: '520px',
            width: '100%',
            background: '#FFFFFF',
            border: '1px solid #E1EAE2',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: '#FEE2E2',
              color: '#DC2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <AlertTriangle size={28} />
            </div>

            <h2 style={{ fontSize: '1.4rem', color: '#17251B', marginBottom: '8px' }}>
              Something went wrong / કંઈક સમસ્યા આવી
            </h2>
            <p style={{ fontSize: '0.92rem', color: '#647067', marginBottom: '24px', lineHeight: 1.6 }}>
              A technical error occurred while displaying this page. Please click below to reload or return to the home screen.
            </p>

            {this.state.error && (
              <pre style={{
                background: '#F1F5F9',
                color: '#334155',
                padding: '12px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                textAlign: 'left',
                overflowX: 'auto',
                marginBottom: '24px',
                maxHeight: '120px'
              }}>
                {this.state.error.toString()}
              </pre>
            )}

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="btn btn-primary"
                style={{ padding: '10px 20px', borderRadius: '10px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <RefreshCw size={16} />
                <span>Reload Page</span>
              </button>
              <button
                type="button"
                onClick={this.handleReset}
                className="btn btn-secondary"
                style={{ padding: '10px 20px', borderRadius: '10px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <Home size={16} />
                <span>Go to Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
