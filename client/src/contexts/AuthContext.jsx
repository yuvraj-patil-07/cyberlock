import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('cyberlock_token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const loadUser = async (retries = 2, silent = false) => {
    try {
      // Only show the full-screen loading spinner if not silent
      if (!silent && !user) setLoading(true);
      
      const res = await api.get('/auth/me');
      setUser(res.data.user);
    } catch (err) {
      const status = err.response?.status;
      if (status === 401) {
        // Only clear session on explicit "not authorized" — token truly invalid
        localStorage.removeItem('cyberlock_token');
        setToken(null);
        setUser(null);
      } else if (retries > 0 && (!status || status >= 500 || status === 429)) {
        // Server restart / rate-limit / network blip — retry after a short delay
        // Do NOT wipe the token; the user is still valid
        await new Promise(r => setTimeout(r, 1500));
        return loadUser(retries - 1);
      }
      // For any other error (e.g. 400, 403) just keep existing user state
      console.warn('loadUser failed with status', status, '— keeping existing session');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('cyberlock_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password) => {
    try {
      setLoading(true);
      const res = await api.post('/auth/register', { username, email, password });
      localStorage.setItem('cyberlock_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('cyberlock_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, error, isAuthenticated: !!user, login, register, logout, loadUser }}>
      {children}
    </AuthContext.Provider>
  );
};
