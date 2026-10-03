import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';

const ITEM_CATALOG = [
  { id: 'shield-charge', name: 'SHIELD CHARGE', icon: '🛡️', type: 'defense', color: '#06b6d4', glowColor: 'rgba(6,182,212,0.5)', desc: 'Absorbs one wrong answer without losing Trust Score. Activates automatically on next incorrect response.', effect: 'Prevents -10 Trust on next incorrect answer', howToGet: 'Earned by completing any room with 90%+ Trust Score intact', stackable: true, maxStack: 5 },
  { id: 'hint-token', name: 'HINT TOKEN', icon: '💡', type: 'utility', color: '#f59e0b', glowColor: 'rgba(245,158,11,0.5)', desc: 'Reveals one AI-generated indicator clue in any active challenge. Single use per challenge.', effect: 'Reveals 1 hidden threat indicator in the current challenge', howToGet: 'Awarded when you earn 3-star completion on any room', stackable: true, maxStack: 10 },
  { id: 'xp-surge', name: 'XP SURGE', icon: '⚡', type: 'boost', color: '#8b5cf6', glowColor: 'rgba(139,92,246,0.5)', desc: 'Doubles XP earned from your next completed challenge. Does not stack with other surges.', effect: '2x XP multiplier for next 1 challenge', howToGet: 'Dropped by completing Daily Mission objectives', stackable: false, maxStack: 1 },
  { id: 'extra-life', name: 'EXTRA LIFE', icon: '❤️', type: 'survival', color: '#ef4444', glowColor: 'rgba(239,68,68,0.5)', desc: 'Restores one lost life immediately. Cannot exceed the maximum of 5 lives.', effect: '+1 Life restored (up to cap of 5)', howToGet: 'Purchased with 200 Coins from the Coin Exchange', stackable: true, maxStack: 3 },
  { id: 'time-freeze', name: 'TIME FREEZE', icon: '⏸️', type: 'utility', color: '#10b981', glowColor: 'rgba(16,185,129,0.5)', desc: 'Pauses the countdown timer for 30 seconds during any timed challenge. Single use per challenge.', effect: 'Freezes timed challenge countdown for 30 seconds', howToGet: 'Reward for completing a room without using any hints', stackable: true, maxStack: 3 },
  { id: 'threat-scanner', name: 'THREAT SCANNER', icon: '🔍', type: 'intel', color: '#6366f1', glowColor: 'rgba(99,102,241,0.5)', desc: 'Highlights all red-flag indicator words in any email or message challenge automatically.', effect: 'Marks suspicious keywords in the scenario text', howToGet: 'Unlocked after completing the Phishing Room (Room 1)', stackable: true, maxStack: 5 },
  { id: 'decoy-click', name: 'DECOY CLICK', icon: '🎯', type: 'intel', color: '#ec4899', glowColor: 'rgba(236,72,153,0.5)', desc: 'Safely inspects any suspicious link URL within a challenge without triggering failure consequences.', effect: 'Preview link destination without risk penalty', howToGet: 'Earned by completing the QR Trap room', stackable: true, maxStack: 5 },
  { id: 'second-chance', name: 'SECOND CHANCE', icon: '🔄', type: 'survival', color: '#f97316', glowColor: 'rgba(249,115,22,0.5)', desc: 'Allows you to change your answer once after seeing the result reveal, before it permanently locks in.', effect: 'Retry answer once after reveal (before lock)', howToGet: 'Exclusively unlocked after achieving the Perfect Escape badge', stackable: false, maxStack: 1 },
  { id: 'coin-magnet', name: 'COIN MAGNET', icon: '🪙', type: 'boost', color: '#fbbf24', glowColor: 'rgba(251,191,36,0.5)', desc: 'Doubles all Coin rewards from challenges for the next 5 correct answers in a session.', effect: '2x Coin rewards for next 5 correct answers', howToGet: 'Achievable by maintaining a 7-consecutive-day login streak', stackable: false, maxStack: 1 },
];

const TYPE_CONFIG = {
  defense:  { label: 'DEFENSE',  color: '#06b6d4', icon: '🛡️' },
  utility:  { label: 'UTILITY',  color: '#f59e0b', icon: '🔧' },
  boost:    { label: 'BOOST',    color: '#8b5cf6', icon: '⚡' },
  survival: { label: 'SURVIVAL', color: '#ef4444', icon: '❤️' },
  intel:    { label: 'INTEL',    color: '#10b981', icon: '🔍' },
};

const FILTERS = [
  { id: 'all', label: 'ALL ITEMS', icon: '📦' },
  { id: 'defense', label: 'DEFENSE', icon: '🛡️' },
  { id: 'utility', label: 'UTILITY', icon: '🔧' },
  { id: 'boost', label: 'BOOST', icon: '⚡' },
  { id: 'survival', label: 'SURVIVAL', icon: '❤️' },
  { id: 'intel', label: 'INTEL', icon: '🔍' },
];

const MOCK_INVENTORY = {
  'shield-charge': 2, 'hint-token': 5, 'xp-surge': 0, 'extra-life': 0,
  'time-freeze': 1, 'threat-scanner': 3, 'decoy-click': 1, 'second-chance': 0, 'coin-magnet': 0,
};

export default function InventoryPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [blink, setBlink] = useState(true);

  const inventory = MOCK_INVENTORY;
  const totalItems = Object.values(inventory).reduce((a, b) => a + b, 0);
  const uniqueItems = Object.entries(inventory).filter(([, q]) => q > 0).length;

  useEffect(() => {
    const id = setInterval(() => setBlink(p => !p), 1200);
    return () => clearInterval(id);
  }, []);

  const filtered = activeFilter === 'all' ? ITEM_CATALOG : ITEM_CATALOG.filter(item => item.type === activeFilter);

  return (
    <div className="min-h-screen text-white relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #060d06 0%, #0a160a 40%, #060d06 100%)', fontFamily: "'Press Start 2P', monospace" }}>
      {/* GRID */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(16,185,129,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.025) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />
      {/* AMBIENT */}
      <div className="absolute top-16 left-1/4 w-96 h-96 pointer-events-none rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.04) 0%, transparent 70%)' }} />
      <div className="absolute bottom-16 right-1/4 w-64 h-64 pointer-events-none rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.04) 0%, transparent 70%)' }} />
      {/* CORNERS */}
      <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-emerald-500/30 pointer-events-none" />
      <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-emerald-500/30 pointer-events-none" />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-emerald-500/30 pointer-events-none" />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-emerald-500/30 pointer-events-none" />

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <motion.button initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-4 py-2 text-[9px] text-emerald-400 border border-emerald-500/30 hover:border-emerald-400 hover:bg-emerald-500/10 transition-all">
            ◀ BACK TO HQ
          </motion.button>

          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="text-[8px] text-emerald-500/60 tracking-widest mb-1">OPERATIVE EQUIPMENT MANIFEST</div>
            <h1 className="text-2xl sm:text-3xl tracking-wider" style={{
              background: 'linear-gradient(135deg, #6ee7b7, #a7f3d0, #34d399)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 20px rgba(16,185,129,0.5))',
            }}>FIELD KIT</h1>
            <div className="text-[8px] text-emerald-500/50 tracking-widest mt-1">TACTICAL INVENTORY // OPERATIVE USE ONLY</div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-2 border border-yellow-500/30 bg-yellow-500/5">
              <span className="text-lg">🪙</span>
              <div><div className="text-[7px] text-yellow-500/60">COINS</div><div className="text-yellow-400 text-[11px]">{user?.coins || 0}</div></div>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 border border-red-500/30 bg-red-500/5">
              <span className="text-lg">❤️</span>
              <div><div className="text-[7px] text-red-500/60">LIVES</div><div className="text-red-400 text-[11px]">{user?.lives ?? 5}/5</div></div>
            </div>
          </motion.div>
        </div>

        {/* STATUS BANNER */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="mb-6 p-4 border border-emerald-500/20 relative overflow-hidden"
          style={{ background: 'rgba(16,185,129,0.03)' }}>
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, #10b981, transparent)' }} />
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" style={{ opacity: blink ? 1 : 0.3, transition: 'opacity 0.5s ease' }} />
              <span className="text-[9px] text-emerald-400 tracking-widest">FIELD KIT ONLINE</span>
            </div>
            <div className="h-4 w-px bg-emerald-500/20" />
            <div className="text-[8px] text-gray-500"><span className="text-emerald-400">{uniqueItems}</span> ITEM TYPES STASHED</div>
            <div className="h-4 w-px bg-emerald-500/20" />
            <div className="text-[8px] text-gray-500"><span className="text-emerald-400">{totalItems}</span> TOTAL UNITS IN STOCK</div>
            <div className="h-4 w-px bg-emerald-500/20" />
            <div className="text-[8px] text-gray-500">OPERATIVE: <span className="text-white">{user?.username || 'AGENT'}</span> // LV.{user?.level || 1}</div>
          </div>
        </motion.div>

        {/* RESOURCE GAUGES */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'CYBER SCORE', value: user?.cyberScore || 0, max: 100, icon: '🧠', color: '#06b6d4', unit: 'pts' },
            { label: 'TRUST SCORE', value: user?.trustScore || 100, max: 100, icon: '🛡️', color: '#10b981', unit: '%' },
            { label: 'TOTAL XP', value: user?.xp || 0, max: 10000, icon: '⚡', color: '#8b5cf6', unit: 'xp' },
            { label: 'COINS', value: user?.coins || 0, max: 1000, icon: '🪙', color: '#f59e0b', unit: '' },
          ].map((stat, i) => (
            <div key={i} className="relative border border-white/5 p-3" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l" style={{ borderColor: stat.color }} />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r" style={{ borderColor: stat.color }} />
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">{stat.icon}</span>
                <span className="text-[9px]" style={{ color: stat.color }}>{stat.value}{stat.unit}</span>
              </div>
              <div className="w-full h-1.5 bg-gray-900 mb-2">
                <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min((stat.value / stat.max) * 100, 100)}%` }}
                  transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }} className="h-full"
                  style={{ background: stat.color + 'cc' }} />
              </div>
              <div className="text-[7px] text-gray-600 tracking-wider">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* FILTER TABS */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-8">
          {FILTERS.map(f => (
            <button key={f.id} onClick={() => setActiveFilter(f.id)}
              className="flex items-center gap-2 px-3 py-2 text-[8px] transition-all border"
              style={activeFilter === f.id
                ? { background: 'rgba(16,185,129,0.15)', borderColor: '#10b981', color: '#6ee7b7' }
                : { background: 'transparent', borderColor: 'rgba(255,255,255,0.08)', color: '#6b7280' }}>
              <span>{f.icon}</span><span>{f.label}</span>
              {activeFilter === f.id && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
            </button>
          ))}
        </motion.div>

        {/* ITEM GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item, i) => {
            const qty = inventory[item.id] || 0;
            const hasItem = qty > 0;
            const typeConf = TYPE_CONFIG[item.type];
            return (
              <motion.div key={item.id}
                initial={{ opacity: 0, y: 20, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: i * 0.05, type: 'spring', stiffness: 300, damping: 25 }}
                whileHover={{ scale: hasItem ? 1.025 : 1.005, transition: { duration: 0.18 } }}
                onClick={() => setSelectedItem(item)}
                className="relative cursor-pointer overflow-hidden"
                style={{
                  background: hasItem ? 'rgba(16,185,129,0.04)' : 'rgba(255,255,255,0.015)',
                  border: hasItem ? '1px solid rgba(16,185,129,0.22)' : '1px solid rgba(255,255,255,0.05)',
                  boxShadow: hasItem ? '0 4px 30px rgba(16,185,129,0.08)' : 'none',
                }}>
                {hasItem && <div className="absolute top-0 left-0 right-0 h-px"
                  style={{ background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }} />}
                {/* Qty badge */}
                <div className="absolute top-3 right-3">
                  <div className="w-8 h-8 flex items-center justify-center text-[11px] font-bold"
                    style={{ background: hasItem ? item.color + '20' : 'rgba(0,0,0,0.4)', border: '1px solid ' + (hasItem ? item.color + '60' : 'rgba(255,255,255,0.05)'), color: hasItem ? item.color : '#374151' }}>
                    {qty}
                  </div>
                </div>
                {/* Type tag */}
                <div className="absolute top-3 left-3">
                  <span className="text-[6px] px-1.5 py-0.5 tracking-widest"
                    style={{ color: typeConf.color, border: '1px solid ' + typeConf.color + '30', background: typeConf.color + '10' }}>
                    {typeConf.label}
                  </span>
                </div>
                {!hasItem && <div className="absolute inset-0 pointer-events-none" style={{
                  backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 8px, rgba(0,0,0,0.06) 8px, rgba(0,0,0,0.06) 9px)',
                }} />}
                <div className="p-5 pt-10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 flex items-center justify-center flex-shrink-0"
                      style={{ background: hasItem ? item.color + '15' : 'rgba(0,0,0,0.3)', border: '2px solid ' + (hasItem ? item.color + '50' : 'rgba(255,255,255,0.05)'), boxShadow: hasItem ? 'inset 0 0 20px ' + item.glowColor : 'none' }}>
                      <span className="text-2xl" style={{ filter: hasItem ? 'drop-shadow(0 0 6px ' + item.glowColor + ')' : 'grayscale(100%) brightness(0.3)' }}>{item.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[9px] mb-1 leading-tight" style={{ color: hasItem ? item.color : '#374151' }}>{item.name}</h3>
                      <div className="text-[7px] px-1.5 py-0.5 inline-block"
                        style={{ color: hasItem ? '#10b981' : '#4b5563', border: '1px solid ' + (hasItem ? '#10b98130' : '#1f293730'), background: hasItem ? 'rgba(16,185,129,0.08)' : 'transparent' }}>
                        {hasItem ? `${qty} IN STOCK` : 'OUT OF STOCK'}
                      </div>
                    </div>
                  </div>
                  <p className="text-[7px] leading-relaxed mb-3"
                    style={{ color: hasItem ? 'rgba(156,163,175,0.85)' : 'rgba(75,85,99,0.7)' }}>{item.desc}</p>
                  <div className="h-px mb-3" style={{ background: 'rgba(255,255,255,0.04)' }} />
                  <div className="flex items-center justify-between">
                    <div className="text-[7px] truncate mr-2" style={{ color: hasItem ? item.color + 'cc' : '#374151' }}>
                      ► {item.effect.substring(0, 28)}{item.effect.length > 28 ? '…' : ''}
                    </div>
                    <button className="text-[7px] px-2 py-1 transition-colors flex-shrink-0"
                      style={{ color: hasItem ? item.color : '#374151', border: '1px solid ' + (hasItem ? item.color + '40' : 'rgba(255,255,255,0.05)') }}
                      onClick={e => { e.stopPropagation(); setSelectedItem(item); }}>INFO ▶</button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ACQUISITION GUIDE */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="mt-10 border border-white/5 p-5 relative" style={{ background: 'rgba(255,255,255,0.015)' }}>
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(16,185,129,0.3), transparent)' }} />
          <div className="text-[8px] text-emerald-400 mb-5 tracking-wider">HOW TO EARN ITEMS</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { method: 'COMPLETE ROOMS', detail: 'Each room rewards unique items on completion', icon: '🚪' },
              { method: '3-STAR ROOMS', detail: 'Achieve 3-star rating to earn Hint Tokens', icon: '⭐' },
              { method: 'DAILY MISSIONS', detail: 'Finish daily objectives for XP Surges and boosts', icon: '☀️' },
              { method: 'COIN EXCHANGE', detail: 'Spend coins on Extra Lives and consumables', icon: '🪙' },
              { method: 'BADGE UNLOCKS', detail: 'Earning specific medals unlocks permanent items', icon: '🎖️' },
              { method: 'LOGIN STREAK', detail: 'Maintain a 7-day streak for bonus Coin Magnets', icon: '🔥' },
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-3 p-3 border border-white/5" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <span className="text-lg flex-shrink-0">{tip.icon}</span>
                <div>
                  <div className="text-[8px] text-emerald-400 mb-1">{tip.method}</div>
                  <div className="text-[7px] text-gray-500 leading-relaxed">{tip.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ITEM DETAIL MODAL */}
      <AnimatePresence>
        {selectedItem && (() => {
          const item = selectedItem;
          const qty = inventory[item.id] || 0;
          const hasItem = qty > 0;
          const typeConf = TYPE_CONFIG[item.type];
          return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
              onClick={() => setSelectedItem(null)}>
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 40 }} animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 40 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className="relative max-w-md w-full overflow-hidden"
                style={{
                  background: '#060d06',
                  border: hasItem ? '1px solid rgba(16,185,129,0.4)' : '1px solid rgba(255,255,255,0.08)',
                  boxShadow: hasItem ? '0 0 60px rgba(16,185,129,0.2), 0 0 120px rgba(16,185,129,0.07)' : 'none',
                }}
                onClick={e => e.stopPropagation()}>
                {hasItem && <div className="h-1" style={{ background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }} />}
                <div className="p-8">
                  <div className="flex items-center gap-5 mb-6">
                    <div className="w-24 h-24 flex items-center justify-center flex-shrink-0"
                      style={{ background: hasItem ? item.color + '10' : 'rgba(0,0,0,0.4)', border: '2px solid ' + (hasItem ? item.color + '50' : 'rgba(255,255,255,0.05)'), boxShadow: hasItem ? '0 0 30px ' + item.glowColor + ', inset 0 0 20px ' + item.glowColor : 'none' }}>
                      <span className="text-5xl" style={{ filter: hasItem ? 'drop-shadow(0 0 12px ' + item.glowColor + ')' : 'grayscale(100%) brightness(0.2)' }}>{item.icon}</span>
                    </div>
                    <div>
                      <div className="text-[7px] mb-2 px-2 py-0.5 inline-block tracking-widest"
                        style={{ color: typeConf.color, border: '1px solid ' + typeConf.color + '40', background: typeConf.color + '10' }}>
                        {typeConf.icon} {typeConf.label}
                      </div>
                      <h2 className="text-base mb-2" style={{ color: hasItem ? item.color : '#374151' }}>{item.name}</h2>
                      <div className="text-[9px]" style={{ color: hasItem ? '#10b981' : '#6b7280' }}>
                        {hasItem ? `${qty} UNITS IN STASH` : '0 UNITS — UNACQUIRED'}
                      </div>
                    </div>
                  </div>
                  <div className="h-px mb-5" style={{ background: 'linear-gradient(90deg, transparent, ' + item.color + '30, transparent)' }} />
                  <div className="mb-4">
                    <div className="text-[7px] text-gray-600 mb-2 tracking-wider">FIELD DESCRIPTION</div>
                    <p className="text-[8px] text-gray-400 leading-relaxed">{item.desc}</p>
                  </div>
                  <div className="mb-4 p-3 border border-white/5" style={{ background: 'rgba(255,255,255,0.02)' }}>
                    <div className="text-[7px] text-gray-600 mb-2 tracking-wider">ACTIVE EFFECT</div>
                    <p className="text-[8px] leading-relaxed" style={{ color: item.color }}>► {item.effect}</p>
                  </div>
                  <div className="mb-6">
                    <div className="text-[7px] text-gray-600 mb-2 tracking-wider">HOW TO ACQUIRE</div>
                    <p className="text-[8px] text-gray-400 leading-relaxed">{item.howToGet}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="p-3 border border-white/5" style={{ background: 'rgba(255,255,255,0.02)' }}>
                      <div className="text-[7px] text-gray-600 mb-1">STACKABLE</div>
                      <div className="text-[9px]" style={{ color: item.stackable ? '#10b981' : '#f59e0b' }}>
                        {item.stackable ? `YES (max ${item.maxStack})` : 'NO (1 only)'}
                      </div>
                    </div>
                    <div className="p-3 border border-white/5" style={{ background: 'rgba(255,255,255,0.02)' }}>
                      <div className="text-[7px] text-gray-600 mb-1">IN STASH</div>
                      <div className="text-[9px]" style={{ color: hasItem ? item.color : '#6b7280' }}>{qty} / {item.maxStack} UNITS</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setSelectedItem(null)}
                      className="flex-1 py-3 text-[8px] text-gray-400 border border-gray-700 hover:border-gray-500 transition-colors">CLOSE</button>
                    {!hasItem ? (
                      <button onClick={() => { navigate('/rooms'); setSelectedItem(null); }}
                        className="flex-1 py-3 text-[8px] transition-all"
                        style={{ color: '#10b981', border: '1px solid rgba(16,185,129,0.4)', background: 'rgba(16,185,129,0.08)' }}>GO EARN IT ▶</button>
                    ) : (
                      <button className="flex-1 py-3 text-[8px] opacity-60 cursor-not-allowed" disabled
                        style={{ color: item.color, border: '1px solid ' + item.color + '40', background: item.color + '08' }}>AUTO-ACTIVATES ✓</button>
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