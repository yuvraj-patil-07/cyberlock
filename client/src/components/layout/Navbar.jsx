import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Menu, X, LogOut, Crown, Map, Dna, Trophy, Swords, Sparkles } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { sounds } from '../../utils/soundEffects';

/* ── SVG Icons for the HUD ── */
const HeartIcon = ({ filled = true }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? '#ff4757' : 'none'} stroke="#ff4757" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

const XPIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#ffd700">
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
  </svg>
);

const ShieldCrest = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M16 2 L28 7 L28 18 Q28 26 16 30 Q4 26 4 18 L4 7 Z"
          fill="url(#shield-fill)" stroke="#00d4ff" strokeWidth="1.2"/>
    <path d="M16 8 L20 12 L16 24 L12 12 Z" fill="#00d4ff" opacity="0.8"/>
    <circle cx="16" cy="12" r="2" fill="#00d4ff"/>
    <defs>
      <linearGradient id="shield-fill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1e2540"/>
        <stop offset="100%" stopColor="#0f1628"/>
      </linearGradient>
    </defs>
  </svg>
);

const CastleMini = ({ unlocked }) => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <rect x="1" y="5" width="10" height="6" fill={unlocked ? '#00ff88' : '#2a3558'} rx="1"/>
    <rect x="0" y="3" width="3" height="5" fill={unlocked ? '#00cc66' : '#1e2540'} rx="1"/>
    <rect x="4.5" y="3" width="3" height="5" fill={unlocked ? '#00cc66' : '#1e2540'} rx="1"/>
    <rect x="9" y="3" width="3" height="5" fill={unlocked ? '#00cc66' : '#1e2540'} rx="1"/>
  </svg>
);

const navLinks = [
  { name: 'Village',     path: '/dashboard',  icon: Crown,    label: 'Home' },
  { name: 'Realm Map',   path: '/rooms',       icon: Map,      label: 'Zones' },
  { name: 'Cyber DNA',   path: '/cyber-dna',   icon: Dna,      label: 'Skills' },
  { name: 'Hall',        path: '/leaderboard', icon: Trophy,   label: 'Rankings' },
  { name: 'Demo',        path: '/demo',        icon: Sparkles, label: 'Demo' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(sounds.isMuted());
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const links = [...navLinks];
  if (user?.role === 'admin') links.push({ name: 'Admin', path: '/admin', icon: Swords, label: 'Admin' });

  const toggleAudio = () => {
    const nextMuted = sounds.toggleMute();
    setIsMuted(nextMuted);
    if (!nextMuted) sounds.playEvidenceFound();
  };

  const handleLogout = () => { logout(); navigate('/'); };

  const lives = user?.lives ?? 5;
  const level = user?.level ?? 1;
  const xp    = user?.xp ?? 0;
  const maxXP = level * 1000;
  const xpPct = Math.min(100, (xp / maxXP) * 100);
  const completedRooms = user?.completedRooms?.length ?? 0;

  return (
    <nav className="fixed top-0 z-50 w-full hud-panel">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* ── BRAND ── */}
          <NavLink to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="group-hover:animate-castle-glow transition-all">
              <ShieldCrest />
            </div>
            <div className="hidden sm:block">
              <span className="font-fantasy text-lg font-bold tracking-widest text-white">
                CYBER<span style={{ color: '#00d4ff' }}>LOCK</span>
              </span>
              <div className="flex gap-0.5 mt-0.5">
                {[...Array(5)].map((_, i) => (
                  <CastleMini key={i} unlocked={i < completedRooms} />
                ))}
              </div>
            </div>
          </NavLink>

          {/* ── CENTER NAV LINKS ── */}
          <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink key={link.name} to={link.path}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold tracking-wider transition-all duration-200 uppercase ${
                      isActive
                        ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-[0_0_10px_rgba(0,212,255,0.2)]'
                        : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10'
                    }`
                  }
                >
                  <Icon size={13} />
                  {link.name}
                </NavLink>
              );
            })}
          </div>

          {/* ── RIGHT: HUD STATS ── */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {user && (
              <>
                {/* Hearts */}
                <div className="hidden sm:flex items-center gap-1 stat-pill">
                  {[...Array(Math.max(0, lives))].map((_, i) => (
                    <div key={i} className="animate-heart-beat" style={{ animationDelay: `${i * 0.1}s` }}>
                      <HeartIcon />
                    </div>
                  ))}
                  {lives === 0 && <span className="text-red-400 font-bold text-xs">KO</span>}
                </div>

                {/* XP + Level */}
                <div className="hidden md:flex flex-col items-end gap-0.5 px-2">
                  <div className="flex items-center gap-1">
                    <XPIcon />
                    <span className="text-yellow-300 font-bold text-xs font-mono">{xp.toLocaleString()}</span>
                  </div>
                  <div className="xp-bar-track w-20">
                    <div className="xp-bar-fill" style={{ width: `${xpPct}%` }} />
                  </div>
                </div>

                {/* Level Badge */}
                <div className="flex items-center justify-center px-2.5 py-1 rounded-lg font-fantasy text-xs font-bold"
                     style={{ background: 'linear-gradient(135deg, #c8922a, #7d5713)', border: '1px solid rgba(255,215,0,0.4)', color: '#fff9e6', boxShadow: '0 0 10px rgba(200,150,0,0.3)' }}>
                  Lv {level}
                </div>

                {/* Player Name */}
                <div className="hidden sm:block pl-2 border-l border-white/10">
                  <div className="text-xs font-bold text-white leading-none">{user.username}</div>
                  <div className="text-[10px] text-cyan-400 font-mono mt-0.5">{user.cyberScore || 50}% Score</div>
                </div>

                {/* Audio Toggle */}
                <button onClick={toggleAudio} title={isMuted ? 'Unmute' : 'Mute'}
                  className="p-2 rounded-lg border border-white/10 hover:border-cyan-500/30 text-gray-400 hover:text-cyan-300 transition-all">
                  {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </button>

                {/* Logout */}
                <button onClick={handleLogout} title="Leave the Realm"
                  className="p-2 rounded-lg border border-white/10 hover:border-red-500/40 text-gray-400 hover:text-red-400 transition-all">
                  <LogOut size={14} />
                </button>
              </>
            )}

            {!user && (
              <div className="flex items-center gap-2">
                <button onClick={toggleAudio}
                  className="p-2 rounded-lg border border-white/10 text-gray-400 hover:text-cyan-300 transition-all">
                  {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </button>
                <NavLink to="/login"
                  className="px-4 py-2 rounded-lg text-xs font-bold tracking-wider text-gray-300 hover:text-white border border-white/10 hover:border-white/20 transition-all uppercase font-fantasy">
                  Enter
                </NavLink>
                <NavLink to="/register"
                  className="world-btn world-btn-primary px-4 py-2 text-xs">
                  Join Realm
                </NavLink>
              </div>
            )}

            {/* Mobile Menu */}
            <button onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg border border-white/10 text-gray-400 hover:text-white transition-all">
              {isOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── MOBILE DRAWER ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
            className="lg:hidden overflow-hidden border-t border-white/10"
            style={{ background: '#151b30' }}>
            <div className="px-4 py-4 space-y-1">
              {links.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink key={link.name} to={link.path} onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold tracking-wider uppercase transition-all ${
                        isActive
                          ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`
                    }>
                    <Icon size={16} /> {link.name}
                  </NavLink>
                );
              })}

              {/* Mobile HUD stats */}
              {user && (
                <div className="pt-3 border-t border-white/10 space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <div className="flex gap-1">
                      {[...Array(Math.max(0, lives))].map((_, i) => <HeartIcon key={i} />)}
                    </div>
                    <div className="rune-badge rune-badge-gold">Lv {level} · {xp} XP</div>
                  </div>
                  <button onClick={() => { handleLogout(); setIsOpen(false); }}
                    className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-red-400 hover:bg-red-500/10 transition-all">
                    <LogOut size={16} /> Leave the Realm
                  </button>
                </div>
              )}

              {!user && (
                <div className="pt-3 border-t border-white/10 flex gap-2">
                  <NavLink to="/login" onClick={() => setIsOpen(false)}
                    className="flex-1 text-center py-3 rounded-xl font-bold text-sm text-gray-300 bg-white/5 border border-white/10">
                    Enter
                  </NavLink>
                  <NavLink to="/register" onClick={() => setIsOpen(false)}
                    className="flex-1 text-center py-3 rounded-xl font-bold text-sm text-white world-btn-primary world-btn">
                    Join Realm
                  </NavLink>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
