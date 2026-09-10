import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { Lock, Mail, Loader2, Shield, Sparkles, KeyRound } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  const setDemoUser = () => {
    setEmail('player@cyberlock.example');
    setPassword('Password123!');
  };

  const setAdminUser = () => {
    setEmail('admin@cyberlock.example');
    setPassword('CyberL0ck!Admin2024');
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-50 font-sans p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-100/50 via-purple-50/50 to-slate-50 pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-panel p-8 rounded-3xl border border-slate-200 shadow-xl bg-white/95">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-cyan-100 border border-cyan-300 flex items-center justify-center text-cyan-700 mx-auto mb-3 shadow-sm">
              <Shield size={24} />
            </div>
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 tracking-wider">
              CYBERLOCK
            </h1>
            <p className="text-xs font-mono text-slate-500 mt-1 font-semibold">SECURITY CLEARANCE AUTHENTICATION</p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs text-center font-mono">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-bold text-slate-700 mb-1.5 uppercase">Operator Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-cyan-600" />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600 transition-all font-mono"
                  placeholder="operator@cyberlock.example"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-slate-700 mb-1.5 uppercase">Security Passcode</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-cyan-600" />
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600 transition-all font-mono"
                  placeholder="••••••••••••"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full btn-primary flex justify-center items-center py-3 text-sm font-bold font-mono uppercase tracking-wider"
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'AUTHENTICATE & ENTER'}
            </button>
          </form>

          {/* Quick Demo Credentials Autofill */}
          <div className="mt-6 pt-4 border-t border-slate-200 text-center space-y-2">
            <span className="text-[10px] font-mono text-slate-500 font-semibold uppercase tracking-wider block">One-Click Quick Credential Presets:</span>
            <div className="flex gap-2 justify-center">
              <button
                type="button"
                onClick={setDemoUser}
                className="px-3 py-1 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-300 rounded-lg text-[11px] font-mono font-bold transition-colors"
              >
                Demo Player
              </button>
              <button
                type="button"
                onClick={setAdminUser}
                className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-800 border border-red-300 rounded-lg text-[11px] font-mono font-bold transition-colors"
              >
                Admin Clearance
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-600 font-medium">
            <Link to="/register" className="text-cyan-700 hover:underline">Create New Profile</Link>
            <Link to="/demo" className="text-purple-700 hover:underline">Judge Demo Mode</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
