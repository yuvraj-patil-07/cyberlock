import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { gameService } from '../services/gameService';

/* ─── BADGE REGISTRY ─────────────────────────────────────── */
const BADGE_REGISTRY = [
  {
    slug: 'phish-hunter', name: 'PHISH HUNTER', icon: '🎣',
    lore: 'Awarded to operatives who can read a spoofed domain like a native tongue. The hunter sees through typos others miss.',
    unlock: 'Complete the Phishing Room with 3+ correct identifications',
    category: 'room', rarity: 'common', roomId: 1, roomName: 'Phishing Room', xpReward: 200,
    color: '#06b6d4', glowColor: 'rgba(6,182,212,0.5)', borderColor: '#06b6d4', bgColor: 'rgba(6,182,212,0.08)',
  },
  {
    slug: 'vault-keeper', name: 'VAULT KEEPER', icon: '🔐',
    lore: 'The vaults of the digital world hold no secrets from them. Entropy is their weapon, and weak passwords their prey.',
    unlock: 'Complete the Password Vault with 3+ correct decisions',
    category: 'room', rarity: 'common', roomId: 2, roomName: 'Password Vault', xpReward: 200,
    color: '#10b981', glowColor: 'rgba(16,185,129,0.5)', borderColor: '#10b981', bgColor: 'rgba(16,185,129,0.08)',
  },
  {
    slug: 'qr-guardian', name: 'QR GUARDIAN', icon: '🔳',
    lore: 'Where others see a black-and-white square, the Guardian sees a potential trap. Physical overlays, malicious APKs — none escape their scanner.',
    unlock: 'Complete the QR Trap room spotting 3+ malicious codes',
    category: 'room', rarity: 'rare', roomId: 3, roomName: 'QR Trap', xpReward: 350,
    color: '#8b5cf6', glowColor: 'rgba(139,92,246,0.5)', borderColor: '#8b5cf6', bgColor: 'rgba(139,92,246,0.08)',
  },
  {
    slug: 'scam-breaker', name: 'SCAM BREAKER', icon: '🎭',
    lore: 'The mask of deception dissolves under their gaze. They have faced pig butchering, smishing, and fake bail calls — and laughed.',
    unlock: 'Complete the Scam Inbox with 3+ threats neutralized',
    category: 'room', rarity: 'rare', roomId: 4, roomName: 'Scam Inbox', xpReward: 350,
    color: '#f59e0b', glowColor: 'rgba(245,158,11,0.5)', borderColor: '#f59e0b', bgColor: 'rgba(245,158,11,0.08)',
  },
  {
    slug: 'social-engineering-detective', name: 'SOCIAL DETECTIVE', icon: '🕵️',
    lore: 'They once watched a threat actor attempt executive authority impersonation — and replied with a ticket number. Cold. Calculated.',
    unlock: 'Complete Firewall Defense with 3+ blocked infiltrations',
    category: 'room', rarity: 'rare', roomId: 5, roomName: 'Firewall Defense', xpReward: 400,
    color: '#ec4899', glowColor: 'rgba(236,72,153,0.5)', borderColor: '#ec4899', bgColor: 'rgba(236,72,153,0.08)',
  },
  {
    slug: 'ai-skeptic', name: 'AI SKEPTIC', icon: '🤖',
    lore: 'In the age of synthetic media, they are immune. Deepfake voices, AI-generated faces, prompt injection payloads — all detected before detonation.',
    unlock: 'Complete the Deepfake Detective lab with 3+ correct AI classifications',
    category: 'room', rarity: 'epic', roomId: 6, roomName: 'Deepfake Detective', xpReward: 600,
    color: '#6366f1', glowColor: 'rgba(99,102,241,0.6)', borderColor: '#6366f1', bgColor: 'rgba(99,102,241,0.10)',
  },
  {
    slug: 'cyber-sentinel', name: 'CYBER SENTINEL', icon: '👑',
    lore: 'They entered the Final Cyber Lock. The multi-vector assault came from all directions — BEC fraud, deepfake voice, phishing, social engineering — and they dismantled every layer.',
    unlock: 'Successfully complete the Final Cyber Lock (Room 7)',
    category: 'legendary', rarity: 'legendary', roomId: 7, roomName: 'Final Cyber Lock', xpReward: 1500,
    color: '#f59e0b', glowColor: 'rgba(251,191,36,0.8)', borderColor: '#fbbf24', bgColor: 'rgba(251,191,36,0.10)',
  },
  {
    slug: 'perfect-escape', name: 'PERFECT ESCAPE', icon: '✨',
    lore: 'Not a single mistake. Not one point of trust lost. They solved an entire escape with 100% fidelity — a feat most operatives never achieve.',
    unlock: 'Complete any room with 100% Trust Score intact, zero lives lost',
    category: 'legendary', rarity: 'legendary', roomId: null, roomName: 'Any Room', xpReward: 1000,
    color: '#f43f5e', glowColor: 'rgba(244,63,94,0.7)', borderColor: '#f43f5e', bgColor: 'rgba(244,63,94,0.10)',
  },
  {
    slug: 'most-improved', name: 'MOST IMPROVED', icon: '📈',
    lore: 'The system flagged their early scores. Then it watched them improve — 25 points, then 50 — until the algorithm classified them as a top-percentile threat to all threats.',
    unlock: 'Increase your CyberScore by +25% from your first game',
    category: 'mastery', rarity: 'epic', roomId: null, roomName: 'All Rooms', xpReward: 750,
    color: '#34d399', glowColor: 'rgba(52,211,153,0.6)', borderColor: '#34d399', bgColor: 'rgba(52,211,153,0.08)',
  },
];

const RARITY_CONFIG = {
  common:    { label: 'COMMON',    textColor: '#9ca3af' },
  rare:      { label: 'RARE',      textColor: '#60a5fa' },
  epic:      { label: 'EPIC',      textColor: '#c084fc' },
  legendary: { label: 'LEGENDARY', textColor: '#fbbf24' },
};

const CATEGORIES = [
  { id: 'all',       label: 'ALL MEDALS',  icon: '🏛️' },
  { id: 'room',      label: 'ROOM CLEARS', icon: '🚪' },
  { id: 'legendary', label: 'LEGENDARY',   icon: '👑' },
  { id: 'mastery',   label: 'MASTERY',     icon: '📈' },
];

/* ─── COMPONENT ─────────────────────────────────────────────────── */
export default function BadgesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [scanLine, setScanLine] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setScanLine(p => (p + 1) % 100), 50);
    return () => clearInterval(id);
  }, []);

  const userBadgeSlugs = (user?.badges || []).map(b =>
    typeof b === 'string' ? b : (b.slug || '')
  );

  const filtered = activeCategory === 'all'
    ? BADGE_REGISTRY
    : BADGE_REGISTRY.filter(b => b.category === activeCategory);

  const earnedCount = BADGE_REGISTRY.filter(b => userBadgeSlugs.includes(b.slug)).length;
  const completionPct = Math.round((earnedCount / BADGE_REGISTRY.length) * 100);

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: i => ({ opacity: 1, y: 0, scale: 1, transition: { delay: i * 0.05, type: 'spring', stiffness: 300, damping: 25 } }),
  };

  return (
    <div
      className="min-h-screen text-white relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #070b14 0%, #0d1421 40%, #070f1e 100%)', fontFamily: "'Press Start 2P', monospace" }}
    >
      {/* GRID BG */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(6,182,212,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.03) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
      }} />

      {/* SCAN LINE */}
      <div className="absolute left-0 right-0 h-px pointer-events-none z-10"
        style={{ top: `${scanLine}%`, background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.14), transparent)' }} />

      {/* CORNER BRACKETS */}
      {[['top-4 left-4', 'border-t-2 border-l-2'], ['top-4 right-4', 'border-t-2 border-r-2'], ['bottom-4 left-4', 'border-b-2 border-l-2'], ['bottom-4 right-4', 'border-b-2 border-r-2']].map(([pos, border], i) => (
        <div key={i} className={`absolute w-8 h-8 border-cyan-500/40 ${pos} ${border} pointer-events-none`} />
      ))}

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 py-6">

        {/* ── HEADER ── */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <motion.button
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-4 py-2 text-[9px] text-cyan-400 border border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-500/10 transition-all"
          >◀ BACK TO HQ</motion.button>

          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="text-[8px] text-cyan-500/60 tracking-widest mb-1">CYBERLOCK OPERATIVE SYSTEM</div>
            <h1 className="text-2xl sm:text-3xl tracking-wider" style={{
              background: 'linear-gradient(135deg, #67e8f9, #a5f3fc, #38bdf8)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 20px rgba(6,182,212,0.5))',
            }}>MEDAL VAULT</h1>
            <div className="text-[8px] text-cyan-500/50 tracking-widest mt-1">ACHIEVEMENT ARCHIVE // CLASSIFIED</div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 px-4 py-2 border border-amber-500/30 bg-amber-500/5"
          >
            <span className="text-amber-400 text-lg">🎖️</span>
            <div>
              <div className="text-[7px] text-amber-500/60">MEDALS</div>
              <div className="text-amber-400 text-[11px]">{earnedCount}/{BADGE_REGISTRY.length}</div>
            </div>
          </motion.div>
        </div>

        {/* ── STATS ROW ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8"
        >
          {[
            { label: 'MEDALS EARNED', value: `${earnedCount}/${BADGE_REGISTRY.length}`, icon: '🎖️', color: '#fbbf24' },
            { label: 'XP FROM MEDALS', value: `+${BADGE_REGISTRY.filter(b => userBadgeSlugs.includes(b.slug)).reduce((a, b) => a + b.xpReward, 0).toLocaleString()}`, icon: '⚡', color: '#6366f1' },
            { label: 'CYBER SCORE', value: `${user?.cyberScore || 0}`, icon: '🛡️', color: '#06b6d4' },
            { label: 'COMPLETION', value: `${completionPct}%`, icon: '📊', color: '#10b981' },
          ].map((stat, i) => (
            <div key={i} className="relative border border-white/5 p-3" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l" style={{ borderColor: stat.color }} />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r" style={{ borderColor: stat.color }} />
              <div className="text-lg mb-1">{stat.icon}</div>
              <div className="text-[14px]" style={{ color: stat.color }}>{stat.value}</div>
              <div className="text-[7px] text-gray-500 mt-1 tracking-wider">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* ── FILTERS ── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
              className="flex items-center gap-2 px-3 py-2 text-[8px] transition-all border"
              style={activeCategory === cat.id
                ? { background: 'rgba(6,182,212,0.15)', borderColor: '#06b6d4', color: '#67e8f9' }
                : { background: 'transparent', borderColor: 'rgba(255,255,255,0.08)', color: '#6b7280' }}
            >
              <span>{cat.icon}</span><span>{cat.label}</span>
              {activeCategory === cat.id && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-2 px-3 py-2 border border-white/5 text-[7px] text-gray-600">
            <span className="w-2 h-2 rounded-full bg-cyan-400/60" /> EARNED
            <span className="w-2 h-2 rounded-full bg-gray-700 ml-1" /> LOCKED
          </div>
        </motion.div>

        {/* ── BADGE GRID ── */}
        <motion.div key={activeCategory} initial="hidden" animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filtered.map((badge, i) => {
            const isEarned = userBadgeSlugs.includes(badge.slug);
            const rarity = RARITY_CONFIG[badge.rarity];
            return (
              <motion.div
                key={badge.slug} custom={i} variants={cardVariants}
                whileHover={{ scale: isEarned ? 1.025 : 1.005, transition: { duration: 0.18 } }}
                onClick={() => setSelectedBadge(badge)}
                className="relative cursor-pointer overflow-hidden"
                style={{
                  background: isEarned ? badge.bgColor : 'rgba(255,255,255,0.015)',
                  border: isEarned ? `1px solid ${badge.borderColor}40` : '1px solid rgba(255,255,255,0.05)',
                  boxShadow: isEarned ? `0 4px 30px ${badge.glowColor}` : 'none',
                }}
              >
                {isEarned && (
                  <div className="absolute top-0 left-0 right-0 h-px"
                    style={{ background: `linear-gradient(90deg, transparent, ${badge.color}, transparent)` }} />
                )}
                <div className="absolute top-2 right-2 text-[6px] px-1.5 py-0.5 tracking-widest"
                  style={{ color: rarity.textColor, border: `1px solid ${rarity.textColor}30`, background: `${rarity.textColor}10` }}>
                  {rarity.label}
                </div>
                {!isEarned && (
                  <div className="absolute inset-0 pointer-events-none" style={{
                    backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 8px, rgba(0,0,0,0.08) 8px, rgba(0,0,0,0.08) 9px)',
                  }} />
                )}
                <div className="p-5">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 flex items-center justify-center flex-shrink-0 relative"
                      style={{
                        background: isEarned ? `${badge.color}15` : 'rgba(0,0,0,0.3)',
                        border: isEarned ? `2px solid ${badge.color}50` : '2px solid rgba(255,255,255,0.05)',
                        boxShadow: isEarned ? `inset 0 0 20px ${badge.glowColor}` : 'none',
                      }}>
                      <span className="text-3xl" style={{ filter: isEarned ? `drop-shadow(0 0 8px ${badge.glowColor})` : 'grayscale(100%) brightness(0.3)' }}>
                        {isEarned ? badge.icon : '🔒'}
                      </span>
                      {isEarned && (
                        <div className="absolute inset-0 animate-pulse"
                          style={{ background: `radial-gradient(circle at center, ${badge.glowColor} 0%, transparent 70%)` }} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 mt-1">
                      <h3 className="text-[10px] mb-1 leading-tight" style={{ color: isEarned ? badge.color : '#374151' }}>
                        {isEarned ? badge.name : '████████'}
                      </h3>
                      <div className="text-[7px] text-gray-600 mb-2">{badge.roomName}{badge.roomId ? ` • ROOM ${badge.roomId}` : ''}</div>
                      <div className="text-[7px] px-1.5 py-0.5 inline-flex items-center gap-1"
                        style={{ color: isEarned ? '#10b981' : '#4b5563', border: `1px solid ${isEarned ? '#10b98130' : '#1f293730'}`, background: isEarned ? 'rgba(16,185,129,0.08)' : 'transparent' }}>
                        {isEarned ? '✓ EARNED' : '🔒 LOCKED'}
                      </div>
                    </div>
                  </div>
                  <p className="text-[7px] leading-relaxed mb-3" style={{ color: isEarned ? 'rgba(156,163,175,0.9)' : 'rgba(75,85,99,0.8)' }}>
                    {isEarned ? badge.lore : badge.unlock}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="text-[7px]" style={{ color: isEarned ? '#818cf8' : '#374151' }}>
                      ⚡ {isEarned ? `+${badge.xpReward} XP EARNED` : `${badge.xpReward} XP REWARD`}
                    </div>
                    <button className="text-[7px] px-2 py-1 transition-colors"
                      style={{ color: isEarned ? badge.color : '#374151', border: `1px solid ${isEarned ? badge.color + '40' : 'rgba(255,255,255,0.05)'}` }}
                      onClick={e => { e.stopPropagation(); setSelectedBadge(badge); }}>
                      DETAILS ▶
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ── PROGRESS FOOTER ── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="mt-10 border border-white/5 p-5" style={{ background: 'rgba(255,255,255,0.015)' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="text-[8px] text-gray-500 tracking-wider">VAULT COMPLETION PROGRESS</div>
            <div className="text-[8px] text-cyan-400">{earnedCount} / {BADGE_REGISTRY.length} MEDALS</div>
          </div>
          <div className="w-full h-2 bg-gray-900 border border-white/5 relative overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${completionPct}%` }}
              transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }} className="h-full relative"
              style={{ background: 'linear-gradient(90deg, #06b6d4, #8b5cf6, #fbbf24)' }}>
              <div className="absolute top-0 right-0 bottom-0 w-6"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3))' }} />
            </motion.div>
          </div>
          <div className="flex justify-between mt-2">
            {['RECRUIT', 'OPERATIVE', 'SPECIALIST', 'EXPERT', 'SENTINEL'].map((rank, i) => (
              <div key={rank} className="flex flex-col items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full"
                  style={{ background: earnedCount >= Math.ceil((i / 4) * BADGE_REGISTRY.length) ? '#06b6d4' : '#1f2937' }} />
                <div className="text-[6px] text-gray-600">{rank}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── BADGE DETAIL MODAL ── */}
      <AnimatePresence>
        {selectedBadge && (() => {
          const badge = selectedBadge;
          const isEarned = userBadgeSlugs.includes(badge.slug);
          const rarity = RARITY_CONFIG[badge.rarity];
          return (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
              onClick={() => setSelectedBadge(null)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 40 }} animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 40 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className="relative max-w-md w-full overflow-hidden"
                style={{
                  background: '#080d18',
                  border: isEarned ? `1px solid ${badge.borderColor}60` : '1px solid rgba(255,255,255,0.08)',
                  boxShadow: isEarned ? `0 0 60px ${badge.glowColor}, 0 0 120px ${badge.glowColor}40` : 'none',
                }}
                onClick={e => e.stopPropagation()}
              >
                {isEarned && (
                  <div className="h-1" style={{ background: `linear-gradient(90deg, transparent, ${badge.color}, transparent)` }} />
                )}
                <div className="p-8">
                  <div className="flex justify-center mb-6">
                    <div className="relative w-28 h-28 flex items-center justify-center"
                      style={{
                        background: isEarned ? `${badge.color}10` : 'rgba(0,0,0,0.4)',
                        border: isEarned ? `2px solid ${badge.borderColor}50` : '2px solid rgba(255,255,255,0.05)',
                        boxShadow: isEarned ? `0 0 40px ${badge.glowColor}, inset 0 0 30px ${badge.glowColor}` : 'none',
                      }}>
                      <span className="text-6xl"
                        style={{ filter: isEarned ? `drop-shadow(0 0 20px ${badge.glowColor})` : 'grayscale(100%) brightness(0.2)' }}>
                        {isEarned ? badge.icon : '🔒'}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-center mb-3">
                    <span className="text-[8px] px-3 py-1 tracking-widest"
                      style={{ color: rarity.textColor, border: `1px solid ${rarity.textColor}40`, background: `${rarity.textColor}10` }}>
                      ◆ {rarity.label} ◆
                    </span>
                  </div>
                  <h2 className="text-center text-lg mb-2" style={{ color: isEarned ? badge.color : '#374151' }}>{badge.name}</h2>
                  <div className="flex justify-center mb-6">
                    <span className="text-[8px] px-3 py-1"
                      style={{ color: isEarned ? '#10b981' : '#6b7280', border: `1px solid ${isEarned ? '#10b98130' : '#1f293730'}`, background: isEarned ? 'rgba(16,185,129,0.08)' : 'rgba(0,0,0,0.2)' }}>
                      {isEarned ? '✓ MEDAL EARNED' : '🔒 NOT YET EARNED'}
                    </span>
                  </div>
                  <div className="h-px mb-6" style={{ background: `linear-gradient(90deg, transparent, ${badge.color}30, transparent)` }} />
                  <div className="mb-4">
                    <div className="text-[7px] text-gray-600 mb-2 tracking-wider">FIELD DOSSIER</div>
                    <p className="text-[8px] text-gray-400 leading-relaxed italic">"{badge.lore}"</p>
                  </div>
                  <div className="mb-6">
                    <div className="text-[7px] text-gray-600 mb-2 tracking-wider">UNLOCK CRITERIA</div>
                    <p className="text-[8px] text-gray-400 leading-relaxed">{badge.unlock}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="p-3 border border-white/5" style={{ background: 'rgba(255,255,255,0.02)' }}>
                      <div className="text-[7px] text-gray-600 mb-1">XP REWARD</div>
                      <div className="text-[11px]" style={{ color: '#818cf8' }}>⚡ +{badge.xpReward}</div>
                    </div>
                    <div className="p-3 border border-white/5" style={{ background: 'rgba(255,255,255,0.02)' }}>
                      <div className="text-[7px] text-gray-600 mb-1">LOCATION</div>
                      <div className="text-[9px] text-gray-400">{badge.roomName}</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setSelectedBadge(null)}
                      className="flex-1 py-3 text-[8px] text-gray-400 border border-gray-700 hover:border-gray-500 transition-colors">
                      CLOSE
                    </button>
                    {!isEarned && badge.roomId && (
                      <button onClick={() => { navigate(`/play/${badge.roomId}`); setSelectedBadge(null); }}
                        className="flex-1 py-3 text-[8px] transition-all"
                        style={{ color: badge.color, border: `1px solid ${badge.color}50`, background: `${badge.color}10` }}>
                        ENTER ROOM ▶
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
