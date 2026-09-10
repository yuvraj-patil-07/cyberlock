import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, User, LogOut, Menu, X, Trophy, Activity, 
  Target, Sparkles, Volume2, VolumeX 
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { sounds } from '../../utils/soundEffects';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(sounds.isMuted());
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleAudio = () => {
    const nextMuted = sounds.toggleMute();
    setIsMuted(nextMuted);
    if (!nextMuted) {
      sounds.playEvidenceFound();
    }
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Escape Rooms', path: '/rooms' },
    { name: 'Cyber DNA', path: '/cyber-dna' },
    { name: 'Leaderboard', path: '/leaderboard' },
    { name: 'Demo Mode', path: '/demo' },
  ];

  if (user?.role === 'admin') {
    navLinks.push({ name: 'Admin', path: '/admin' });
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 z-50 w-full bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600 group-hover:shadow-md transition-all">
                <Shield className="h-5 w-5 text-cyan-600" />
              </div>
              <span className="font-black text-xl tracking-wider text-slate-900">
                CYBER<span className="text-cyan-600">LOCK</span>
              </span>
            </NavLink>
          </div>
          
          {/* Desktop Nav Links */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-3.5 py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
                      isActive 
                        ? 'bg-cyan-50 text-cyan-700 border border-cyan-200 shadow-sm' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
          </div>

          {/* User Profile & Audio Controls */}
          <div className="hidden md:flex items-center gap-3">
            {/* Audio FX Toggle */}
            <button
              onClick={toggleAudio}
              title={isMuted ? "Unmute Sound FX" : "Mute Sound FX"}
              className="p-2 text-slate-500 hover:text-cyan-600 hover:bg-cyan-50 rounded-xl transition-colors border border-slate-200 hover:border-cyan-300"
            >
              {isMuted ? <VolumeX className="h-4 w-4 text-slate-400" /> : <Volume2 className="h-4 w-4 text-cyan-600" />}
            </button>

            {user ? (
              <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-900">{user.username}</div>
                  <div className="text-[10px] text-cyan-600 font-mono font-semibold">
                    Lvl {user.level || 1} • {user.cyberScore || 50}% Cyber Score
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  title="Disconnect"
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-transparent hover:border-rose-200"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
                <NavLink to="/login" className="px-4 py-2 text-xs font-mono font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors">
                  LOGIN
                </NavLink>
                <NavLink to="/register" className="btn-primary text-xs px-4 py-2">
                  START ESCAPE
                </NavLink>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleAudio}
              className="p-2 text-slate-600 hover:text-cyan-600"
            >
              {isMuted ? <VolumeX className="h-5 w-5 text-slate-400" /> : <Volume2 className="h-5 w-5 text-cyan-600" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-white border-b border-slate-200 px-4 py-4 space-y-2 shadow-lg"
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `block px-4 py-2.5 rounded-xl text-sm font-mono font-semibold ${
                    isActive ? 'bg-cyan-50 text-cyan-700 font-bold border border-cyan-200' : 'text-slate-600 hover:bg-slate-50'
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </NavLink>
            ))}

            {user ? (
              <button
                onClick={() => { handleLogout(); setIsOpen(false); }}
                className="block w-full text-left px-4 py-2.5 rounded-xl text-sm font-mono font-semibold text-rose-600 hover:bg-rose-50"
              >
                Disconnect ({user.username})
              </button>
            ) : (
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <NavLink to="/login" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-center text-sm font-mono font-semibold text-slate-700 bg-slate-100 rounded-xl">
                  Login
                </NavLink>
                <NavLink to="/register" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-center text-sm font-mono font-semibold text-white bg-cyan-600 rounded-xl">
                  Register
                </NavLink>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

