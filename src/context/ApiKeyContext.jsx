import React, { createContext, useContext, useState, useEffect } from 'react';

const ApiKeyContext = createContext();

export function ApiKeyProvider({ children }) {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('sehat_gemini_key') || '');
  const [hasServerKey, setHasServerKey] = useState(false);
  const [keyModalOpen, setKeyModalOpen] = useState(false);
  const [checking, setChecking] = useState(true);

  const checkStatus = async () => {
    try {
      const res = await fetch('/api/ai/status');
      if (res.ok) {
        const data = await res.json();
        setHasServerKey(Boolean(data.configured));
      }
    } catch (err) {
      console.warn('Failed to fetch AI status:', err);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const saveApiKey = async (newKey) => {
    const trimmed = newKey.trim();
    setApiKey(trimmed);
    localStorage.setItem('sehat_gemini_key', trimmed);

    // Also persist to server DB runtime config
    if (trimmed) {
      try {
        await fetch('/api/ai/key', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ apiKey: trimmed })
        });
        setHasServerKey(true);
      } catch (err) {
        console.warn('Server key sync error:', err);
      }
    }
  };

  const isConfigured = Boolean(apiKey || hasServerKey);

  return (
    <ApiKeyContext.Provider
      value={{
        apiKey,
        hasServerKey,
        isConfigured,
        keyModalOpen,
        setKeyModalOpen,
        saveApiKey,
        checkStatus,
        checking
      }}
    >
      {children}
    </ApiKeyContext.Provider>
  );
}

export function useApiKey() {
  const context = useContext(ApiKeyContext);
  if (!context) {
    throw new Error('useApiKey must be used within ApiKeyProvider');
  }
  return context;
}
