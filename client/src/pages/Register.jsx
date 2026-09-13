import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { Loader2, Mail, Lock, User } from 'lucide-react';

const HeroArt = () => (
  <svg viewBox="0 0 360 280" fill="none" className="w-full h-full opacity-70">
    {/* Floating island */}
    <ellipse cx="180" cy="220" rx="120" ry="30" fill="#2d4a1e" stroke="#3d6028" strokeWidth="1.5"/>
    <ellipse cx="180" cy="215" rx="100" ry="20" fill="#3d6028"/>
    {/* Castle tower */}
    <rect x="155" y="120" width="50" height="100" fill="#1e2540" stroke="#3d4f7c" strokeWidth="1.5" rx="2"/>
    <rect x="148" y="110" width="64" height="20" fill="#1a1a2e" stroke="#3d4f7c" strokeWidth="1.5" rx="2"/>
    {/* Battlements */}
    {[148,161,174,187,200].map((x,i) => (
      <rect key={i} x={x} y="100" width="8" height="12" fill="#1a1a2e" stroke="#3d4f7c" strokeWidth="1" rx="1"/>
    ))}
    {/* Tower window */}
    <ellipse cx="180" cy="150" rx="10" ry="14" fill="none" stroke="#00d4ff" strokeWidth="1.5"/>
    <ellipse cx="180" cy="150" rx="6" ry="10" fill="rgba(0,212,255,0.15)"/>
    {/* Flag */}
    <line x1="180" y1="100" x2="180" y2="76" stroke="#8892a4" strokeWidth="1.5"/>
    <polygon points="180,76 200,84 180,92" fill="#00d4ff" opacity="0.8"/>
    {/* Trees */}
    <polygon points="130,215 140,175 150,215" fill="#2d6a1e"/>
    <polygon points="135,210 140,180 145,210" fill="#3d8a28"/>
    <polygon points="210,215 220,175 230,215" fill="#2d6a1e"/>
    <polygon points="215,210 220,180 225,210" fill="#3d8a28"/>
    {/* Stars */}
    {[{x:50,y:30},{x:300,y:50},{x:80,y:90},{x:310,y:100},{x:30,y:160}].map((s,i) => (
      <circle key={i} cx={s.x} cy={s.y} r="1.5" fill="white" opacity="0.7"
              style={{ animation: `star-twinkle ${1.5+i*0.3}s ease-in-out ${i*0.2}s infinite alternate` }}/>
    ))}
    {/* Particle orbs */}
    {[{x:100,y:140,c:'#00d4ff'},{x:260,y:130,c:'#ffd700'},{x:80,y:200,c:'#9b59b6'}].map((p,i) => (
      <circle key={i} cx={p.x} cy={p.y} r="4" fill={p.c} opacity="0.6"
              style={{ animation: `float ${2+i}s ease-in-out ${i*0.5}s infinite` }}/>
    ))}
    {/* Hero silhouette */}
    <ellipse cx="180" cy="200" rx="8" ry="4" fill="rgba(0,0,0,0.5)"/>
    <rect x="174" y="175" width="12" height="25" fill="#1e2540" stroke="#3d4f7c" strokeWidth="1" rx="2"/>
    <circle cx="180" cy="170" r="8" fill="#2a3558" stroke="#3d4f7c" strokeWidth="1"/>
    <line x1="168" y1="185" x2="155" y2="192" stroke="#3d4f7c" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="192" y1="185" x2="205" y2="192" stroke="#3d4f7c" strokeWidth="1.5" strokeLinecap="round"/>
    {/* Raised sword */}
    <line x1="205" y1="192" x2="220" y2="160" stroke="#8892a4" strokeWidth="2" strokeLinecap="round"/>
    <polygon points="220,154 223,163 217,163" fill="#c8d6e5"/>
    {/* Text */}
    <text x="180" y="260" textAnchor="middle" fill="#8892a4" fontSize="9" fontFamily="Cinzel">BEGIN YOUR QUEST</text>
  </svg>
);

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await register(username, email, password);
    if (result.success) navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden"
         style={{ background: 'linear-gradient(180deg, #0a0d1a 0%, #111827 60%, #1a1a2e 100%)' }}>

      <div className="stars-bg" />

      {/* Ambient glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-64 rounded-full pointer-events-none"
           style={{ background: 'radial-gradient(ellipse, rgba(155,89,182,0.15) 0%, transparent 70%)', filter: 'blur(40px)' }} />

      {/* Left: Hero Art */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-12">
        <div className="w-full max-w-sm">
          <HeroArt />
        </div>
      </div>

      {/* Right: Register Form */}
      <div className="flex flex-1 items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }} className="w-full max-w-md">

          <div className="text-center mb-8">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                        transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }}
                        className="w-20 h-20 mx-auto mb-4 flex items-center justify-center rounded-2xl"
                        style={{ background: 'linear-gradient(135deg, #6b28a8, #9b59b6)', border: '1px solid rgba(155,89,182,0.4)', boxShadow: '0 0 30px rgba(155,89,182,0.3)' }}>
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <path d="M18 3 L31 9 L31 22 Q31 30 18 34 Q5 30 5 22 L5 9 Z"
                      fill="rgba(255,255,255,0.1)" stroke="white" strokeWidth="1.5"/>
                <path d="M12 18 L16 22 L24 14" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.div>

            <h1 className="font-fantasy text-3xl font-bold text-white tracking-wider mb-1">
              JOIN THE REALM
            </h1>
            <p className="text-xs tracking-widest font-bold uppercase" style={{ color: '#8892a4' }}>
              CREATE YOUR HERO PROFILE
            </p>
          </div>

          <div className="fantasy-panel p-8 rounded-2xl">

            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="mb-5 p-3 rounded-xl text-center text-xs font-bold tracking-wider"
                style={{ background: 'rgba(255,71,87,0.1)', border: '1px solid rgba(255,71,87,0.3)', color: '#ff6b7a' }}>
                ⚠ {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase mb-2"
                       style={{ color: '#8892a4' }}>Hero Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User size={16} style={{ color: '#9b59b6' }} />
                  </div>
                  <input type="text" value={username} onChange={e => setUsername(e.target.value)}
                    className="stone-input" placeholder="Sir Defender" required />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold tracking-widest uppercase mb-2"
                       style={{ color: '#8892a4' }}>Raven Post (Email)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail size={16} style={{ color: '#9b59b6' }} />
                  </div>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    className="stone-input" placeholder="hero@cyberlock.realm" required />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold tracking-widest uppercase mb-2"
                       style={{ color: '#8892a4' }}>Secret Passphrase</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock size={16} style={{ color: '#9b59b6' }} />
                  </div>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                    className="stone-input" placeholder="••••••••" required />
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="world-btn w-full py-3.5 text-sm mt-2"
                style={{ background: 'linear-gradient(180deg, #6b28a8, #4a1a7a)', border: '1px solid rgba(155,89,182,0.4)', color: 'white', boxShadow: '0 4px 15px rgba(155,89,182,0.3)' }}>
                {loading
                  ? <><Loader2 size={16} className="animate-spin" /> Creating Hero...</>
                  : '✦ BEGIN YOUR QUEST'}
              </button>
            </form>

            <p className="mt-6 text-center text-xs font-bold" style={{ color: '#8892a4' }}>
              Already a Hero?{' '}
              <Link to="/login" className="hover:text-cyan-400 transition-colors" style={{ color: '#00d4ff' }}>
                Return to the Gate →
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
