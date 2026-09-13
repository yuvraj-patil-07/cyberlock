import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { Loader2, Mail, Lock } from 'lucide-react';

/* ── Gate Portcullis SVG ── */
const GateArt = () => (
  <svg viewBox="0 0 400 320" fill="none" className="w-full h-full opacity-60">
    {/* Stone arch */}
    <path d="M60 320 L60 120 Q60 40 200 40 Q340 40 340 120 L340 320"
          fill="none" stroke="#2a3558" strokeWidth="20" strokeLinecap="round"/>
    <path d="M70 320 L70 125 Q70 55 200 55 Q330 55 330 125 L330 320"
          fill="#1e2540" stroke="#3d4f7c" strokeWidth="2"/>
    {/* Portcullis bars vertical */}
    {[90,116,142,168,194,220,246,272,298,324].map(x => (
      <rect key={x} x={x-2} y="55" width="4" height="265"
            fill="#2a3558" stroke="#3d4f7c" strokeWidth="0.5" rx="1"/>
    ))}
    {/* Portcullis bars horizontal */}
    {[100,145,190,235,280].map(y => (
      <rect key={y} x="68" y={y-2} width="264" height="4"
            fill="#2a3558" stroke="#3d4f7c" strokeWidth="0.5" rx="1"/>
    ))}
    {/* Spikes at bottom */}
    {[85,115,145,175,205,235,265,295,325].map((x,i) => (
      <polygon key={i} points={`${x-8},320 ${x},290 ${x+8},320`}
               fill="#1a2140" stroke="#3d4f7c" strokeWidth="0.5"/>
    ))}
    {/* Keystone */}
    <ellipse cx="200" cy="40" rx="30" ry="20" fill="#1e2540" stroke="#00d4ff" strokeWidth="1.5"/>
    <text x="200" y="46" textAnchor="middle" fill="#00d4ff" fontSize="12" fontFamily="Cinzel" fontWeight="bold">⚔</text>
    {/* Torches */}
    <rect x="42" y="140" width="8" height="20" fill="#5a3010" rx="1"/>
    <ellipse cx="46" cy="136" rx="6" ry="10" fill="#ff8c00" opacity="0.9"/>
    <ellipse cx="46" cy="134" rx="3" ry="6" fill="#ffcc00"/>
    <rect x="350" y="140" width="8" height="20" fill="#5a3010" rx="1"/>
    <ellipse cx="354" cy="136" rx="6" ry="10" fill="#ff8c00" opacity="0.9"/>
    <ellipse cx="354" cy="134" rx="3" ry="6" fill="#ffcc00"/>
    {/* Glowing runes on stone */}
    {[{x:130,y:200,t:'ᚠ'},{x:200,y:210,t:'ᚨ'},{x:270,y:200,t:'ᚱ'}].map((r,i) => (
      <text key={i} x={r.x} y={r.y} textAnchor="middle" fill="#00d4ff" fontSize="14"
            opacity="0.5" fontFamily="serif">{r.t}</text>
    ))}
  </svg>
);

export default function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) navigate('/dashboard');
  };

  const setDemoUser  = () => { setEmail('player@cyberlock.example');  setPassword('Password123!'); };
  const setAdminUser = () => { setEmail('admin@cyberlock.example'); setPassword('CyberL0ck!Admin2024'); };

  return (
    <div className="min-h-screen flex relative overflow-hidden"
         style={{ background: 'linear-gradient(180deg, #0a0d1a 0%, #111827 60%, #1a1a2e 100%)' }}>

      {/* Stars */}
      <div className="stars-bg" />

      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-64 rounded-full opacity-20"
             style={{ background: 'radial-gradient(ellipse, #00d4ff 0%, transparent 70%)', filter: 'blur(40px)' }} />
      </div>

      {/* Left: Gate Illustration */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-12 relative">
        <div className="w-full max-w-sm">
          <GateArt />
        </div>
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-center">
          <p className="font-fantasy text-xs text-cyan-500/60 tracking-widest uppercase">The Gate of Knowledge Awaits</p>
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="flex flex-1 items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md">

          {/* Header */}
          <div className="text-center mb-8">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                        transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }}
                        className="w-20 h-20 mx-auto mb-4 flex items-center justify-center rounded-2xl relative"
                        style={{ background: 'linear-gradient(135deg, #1e2540, #242b4d)', border: '1px solid rgba(0,212,255,0.3)', boxShadow: '0 0 30px rgba(0,212,255,0.2)' }}>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <path d="M20 3 L34 10 L34 24 Q34 33 20 37 Q6 33 6 24 L6 10 Z"
                      fill="rgba(0,212,255,0.1)" stroke="#00d4ff" strokeWidth="1.5"/>
                <path d="M20 12 L23 17 L20 28 L17 17 Z" fill="#00d4ff"/>
              </svg>
              <div className="absolute -inset-1 rounded-2xl animate-pulse opacity-30"
                   style={{ background: 'conic-gradient(from 0deg, #00d4ff, transparent, #00d4ff)' }} />
            </motion.div>

            <h1 className="font-fantasy text-3xl font-bold text-white tracking-wider mb-1">
              CYBER<span style={{ color: '#00d4ff' }}>LOCK</span>
            </h1>
            <p className="text-xs tracking-widest font-bold uppercase"
               style={{ color: '#8892a4' }}>SECURITY CLEARANCE GATE</p>
          </div>

          {/* Form Card */}
          <div className="fantasy-panel p-8 rounded-2xl">

            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="mb-5 p-3 rounded-xl text-center text-xs font-bold tracking-wider"
                style={{ background: 'rgba(255,71,87,0.1)', border: '1px solid rgba(255,71,87,0.3)', color: '#ff6b7a' }}>
                ⚠ {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase mb-2"
                       style={{ color: '#8892a4' }}>Operative Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail size={16} style={{ color: '#00d4ff' }} />
                  </div>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    className="stone-input" placeholder="operative@cyberlock.realm" required />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold tracking-widest uppercase mb-2"
                       style={{ color: '#8892a4' }}>Secret Passphrase</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock size={16} style={{ color: '#00d4ff' }} />
                  </div>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                    className="stone-input" placeholder="••••••••••••" required />
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="world-btn world-btn-primary w-full py-3.5 text-sm mt-2">
                {loading
                  ? <><Loader2 size={16} className="animate-spin" /> Authenticating...</>
                  : '⚔ OPEN THE GATE'}
              </button>
            </form>

            {/* Quick Credential Presets */}
            <div className="mt-6 pt-5 border-t border-white/5">
              <p className="text-center text-xs tracking-widest uppercase mb-3"
                 style={{ color: '#8892a4' }}>Quick Presets</p>
              <div className="flex gap-2">
                <button onClick={setDemoUser} type="button"
                  className="flex-1 py-2 rounded-lg text-xs font-bold tracking-wider transition-all hover:scale-105"
                  style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.25)', color: '#00d4ff' }}>
                  🧙 Demo Player
                </button>
                <button onClick={setAdminUser} type="button"
                  className="flex-1 py-2 rounded-lg text-xs font-bold tracking-wider transition-all hover:scale-105"
                  style={{ background: 'rgba(255,71,87,0.08)', border: '1px solid rgba(255,71,87,0.25)', color: '#ff6b7a' }}>
                  👑 Admin
                </button>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between text-xs font-bold" style={{ color: '#8892a4' }}>
              <Link to="/register" className="hover:text-cyan-400 transition-colors">
                ✦ Create New Hero
              </Link>
              <Link to="/demo" className="hover:text-purple-400 transition-colors">
                ✦ Demo Mode
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
