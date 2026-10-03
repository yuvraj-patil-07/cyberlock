import React, { createContext, useState, useEffect, useRef, useCallback } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  // Read token directly from localStorage — single source of truth
  const getStoredToken = () => localStorage.getItem('cyberlock_token');

  // Ref to prevent concurrent loadUser calls racing each other
  const loadingRef = useRef(false);

  // -------------------------------------------------------------------
  // loadUser — fetches /auth/me using whatever token is in localStorage.
  // • silent=true  → skips the full-screen spinner (used for background refreshes)
  // • retries      → how many more times to retry on 5xx / network errors
  // IMPORTANT: Only clears the session on a definitive 401.
  //            Network errors, 5xx, or 429 do NOT clear the session.
  // -------------------------------------------------------------------
  const loadUser = useCallback(async (retries = 2, silent = false) => {
    const token = getStoredToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    // Prevent concurrent calls
    if (loadingRef.current && silent) return;
    loadingRef.current = true;

    try {
      if (!silent) setLoading(true);
      const res = await api.get('/auth/me');
      setUser(res.data.user);
      setError(null);
    } catch (err) {
      const status = err.response?.status;

      if (status === 401) {
        // Server explicitly says the token is invalid/expired — clear session
        localStorage.removeItem('cyberlock_token');
        setUser(null);
        setError(null);
      } else if (retries > 0 && (!status || status >= 500 || status === 429)) {
        // Transient error (cold-start, network, rate limit) — retry after delay
        // Do NOT clear the token; user is still valid
        loadingRef.current = false;
        await new Promise(r => setTimeout(r, 1500));
        return loadUser(retries - 1, silent);
      } else {
        // Any other error (400, 403, etc.) — keep existing user state
        console.warn('[Auth] loadUser non-critical error, keeping session:', status, err.message);
      }
    } finally {
      if (!silent) setLoading(false);
      loadingRef.current = false;
    }
  }, []);

  // -------------------------------------------------------------------
  // On mount: if there's a stored token, validate it once.
  // We do this only once (empty dep array) — not on every token change —
  // to avoid the race condition where login sets token + triggers this.
  // -------------------------------------------------------------------
  useEffect(() => {
    const token = getStoredToken();
    if (token) {
      loadUser(2, false);
    } else {
      setLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // -------------------------------------------------------------------
  // login
  // -------------------------------------------------------------------
  const login = async (email, password) => {
    setError(null);
    try {
      setLoading(true);
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('cyberlock_token', res.data.token);
      setUser(res.data.user);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Check your credentials.';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------------------
  // register
  // -------------------------------------------------------------------
  const register = async (username, email, password) => {
    setError(null);
    try {
      setLoading(true);
      const res = await api.post('/auth/register', { username, email, password });
      localStorage.setItem('cyberlock_token', res.data.token);
      setUser(res.data.user);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed.';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------------------
  // logout
  // -------------------------------------------------------------------
  const logout = () => {
    localStorage.removeItem('cyberlock_token');
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      isAuthenticated: !!user,
      token: getStoredToken(),
      login,
      register,
      logout,
      loadUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
