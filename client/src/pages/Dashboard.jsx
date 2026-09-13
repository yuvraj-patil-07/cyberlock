import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { gameService } from '../services/gameService';

/* ── Zone definitions with positions on the map ── */
const ZONES = [
  { id: 'phishing',    name: 'PHISHING PORT',    emoji: '📧', x: '18%', y: '58%', stars: 2 },
  { id: 'passwords',   name: 'PASSWORD VAULT',   emoji: '🔐', x: '25%', y: '42%', stars: 1 },
  { id: 'firewall',    name: 'FIREWALL CITY',    emoji: '🏰', x: '42%', y: '28%', stars: 0 },
  { id: 'qr-codes',    name: 'QR TEMPLE',        emoji: '📱', x: '30%', y: '78%', stars: 0 },
  { id: 'ai-threats',  name: 'AI LAB',           emoji: '🤖', x: '72%', y: '25%', stars: 0 },
  { id: 'scams',       name: 'SCAM MARKET',      emoji: '🏪', x: '65%', y: '55%', stars: 0 },
  { id: 'dark-web',    name: 'DARK WEB DEPTHS',  emoji: '🕳️', x: '75%', y: '75%', stars: 0 },
  { id: 'final',       name: 'CYBER CORE',       emoji: '👑', x: '50%', y: '12%', stars: 0 },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    gameService.getProgress()
      .then(res => setProgress(res.data))
      .catch(() => {});
  }, []);

  const getZoneStars = (zoneId) => {
    if (!progress?.completedRooms) return 0;
    const room = progress.completedRooms.find(r => r.category === zoneId);
    if (!room) return 0;
    const pct = (room.correct / Math.max(room.total, 1)) * 100;
    if (pct >= 90) return 3;
    if (pct >= 60) return 2;
    if (pct > 0) return 1;
    return 0;
  };

  const isZoneUnlocked = (zoneId) => {
    // For now, all zones are unlocked
    return true;
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* ═══ WORLD MAP BACKGROUND ═══ */}
      <div className="absolute inset-0">
        <img src="/assets/world-map-bg.jpg" alt="World Map"
             className="w-full h-full object-cover"
             style={{ imageRendering: 'pixelated' }} />
      </div>

      {/* ═══ MAP NODE LABELS ═══ */}
      {ZONES.map((zone, i) => {
        const stars = getZoneStars(zone.id);
        const unlocked = isZoneUnlocked(zone.id);

        return (
          <motion.div
            key={zone.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="absolute"
            style={{ left: zone.x, top: zone.y, transform: 'translate(-50%, -50%)' }}
          >
            <button
              onClick={() => unlocked && navigate(`/rooms?zone=${zone.id}`)}
              className={`cq-map-label ${!unlocked ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span className="text-base">{zone.emoji}</span>
              <span>{zone.name}</span>
            </button>

            {/* Stars below the label */}
            <div className="cq-stars justify-center mt-1">
              {[1, 2, 3].map(s => (
                <span key={s} className={`cq-star ${s <= stars ? '' : 'empty'}`}>⭐</span>
              ))}
            </div>
          </motion.div>
        );
      })}

      {/* ═══ RIGHT SIDEBAR: Current Quest + Daily Missions ═══ */}
      <div className="absolute top-4 right-4 w-56 flex flex-col gap-3 z-10">
        {/* Current Quest */}
        <div className="cq-panel-dark">
          <div className="font-pixel text-[9px] text-white mb-2 flex items-center gap-2">
            <span>📜</span>
            <span>CURRENT QUEST</span>
          </div>
          <p className="text-sm text-gray-300 mb-2" style={{ fontFamily: "'VT323', monospace" }}>
            Identify 5 phishing emails in Phishing Port.
          </p>
          <div className="cq-bar cq-bar-xp" style={{ height: '14px' }}>
            <div className="cq-bar-fill" style={{ width: '40%' }} />
          </div>
          <div className="text-right mt-1">
            <span className="font-pixel text-[7px] text-gray-400">2 / 5</span>
          </div>
        </div>

        {/* Daily Missions */}
        <div className="cq-panel-dark">
          <div className="font-pixel text-[9px] text-white mb-2 flex items-center gap-2">
            <span>⚔️</span>
            <span>DAILY MISSIONS</span>
          </div>
          <div className="flex flex-col gap-2 text-sm" style={{ fontFamily: "'VT323', monospace" }}>
            <label className="flex items-center gap-2 text-gray-300">
              <input type="checkbox" className="w-3 h-3" readOnly />
              Complete a challenge
              <span className="ml-auto text-gray-500">0/1</span>
            </label>
            <label className="flex items-center gap-2 text-gray-300">
              <input type="checkbox" className="w-3 h-3" readOnly />
              Earn 100 coins
              <span className="ml-auto text-gray-500">20/100</span>
            </label>
            <label className="flex items-center gap-2 text-gray-300">
              <input type="checkbox" className="w-3 h-3" readOnly />
              Visit the AI Lab
              <span className="ml-auto text-gray-500">0/1</span>
            </label>
          </div>
        </div>
      </div>

      {/* ═══ BOTTOM BAR: Compass + Continue ═══ */}
      <div className="absolute bottom-4 left-4 z-10">
        <div className="cq-panel-dark p-2 text-center" style={{ width: '60px' }}>
          <div className="font-pixel text-[7px] text-gray-400">N</div>
          <div className="flex justify-between">
            <span className="font-pixel text-[7px] text-gray-400">W</span>
            <span className="font-pixel text-[7px] text-gray-400">E</span>
          </div>
          <div className="font-pixel text-[7px] text-gray-400">S</div>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 z-10">
        <button onClick={() => navigate('/rooms')}
                className="cq-btn cq-btn-primary">
          ⚔ CONTINUE ▸
        </button>
      </div>
    </div>
  );
}
