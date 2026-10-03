import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ToastContext = createContext(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
  }, []);

  const toast = {
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error'),
    info: (msg) => addToast(msg, 'info'),
    warning: (msg) => addToast(msg, 'warning'),
  };

  const COLORS = {
    success: { bg: 'rgba(16,185,129,0.15)', border: '#10b981', icon: '✅' },
    error:   { bg: 'rgba(239,68,68,0.15)',  border: '#ef4444', icon: '❌' },
    info:    { bg: 'rgba(6,182,212,0.15)',   border: '#06b6d4', icon: 'ℹ️' },
    warning: { bg: 'rgba(245,158,11,0.15)', border: '#f59e0b', icon: '⚠️' },
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <AnimatePresence>
          {toasts.map(t => {
            const c = COLORS[t.type] || COLORS.info;
            return (
              <motion.div key={t.id}
                initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 60 }}
                style={{
                  background: c.bg, border: `1px solid ${c.border}`, borderRadius: '10px',
                  padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
                  fontFamily: "'Press Start 2P', monospace", fontSize: '0.5rem', color: 'white',
                  maxWidth: '320px', boxShadow: `0 0 20px ${c.border}40`,
                  backdropFilter: 'blur(10px)'
                }}>
                <span>{c.icon}</span>
                <span style={{ lineHeight: '1.6' }}>{t.message}</span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
