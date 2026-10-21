import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';

import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { ApiKeyProvider } from './context/ApiKeyContext';
import ErrorBoundary from './components/ErrorBoundary';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <HashRouter>
        <LanguageProvider>
          <AuthProvider>
            <ApiKeyProvider>
              <App />
            </ApiKeyProvider>
          </AuthProvider>
        </LanguageProvider>
      </HashRouter>
    </ErrorBoundary>
  </StrictMode>
);
