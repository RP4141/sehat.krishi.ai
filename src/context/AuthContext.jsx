import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('sehat_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('sehat_token') || '');

  useEffect(() => {
    if (user) {
      localStorage.setItem('sehat_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('sehat_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('sehat_token', token);
    } else {
      localStorage.removeItem('sehat_token');
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Login failed.');
    }
    setUser(data.user);
    setToken(data.token);
    return data.user;
  };

  const register = async (userData) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Registration failed.');
    }
    setUser(data.user);
    setToken(data.token);
    return data.user;
  };

  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('sehat_user');
    localStorage.removeItem('sehat_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: Boolean(user), login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
