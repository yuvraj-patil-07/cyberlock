import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { gameService } from '../services/gameService';

const ROOM_CONFIG = {
  phishing:    { name: 'Phishing Port',    emoji: '📧', desc: 'Learn to identify and avoid phishing emails.',     color: '#4a90d0' },
  passwords:   { name: 'Password Vault',   emoji: '🔐', desc: 'Build strong passwords and defend your vault.',    color: '#50c878' },
  firewall:    { name: 'Firewall City',    emoji: '🏰', desc: 'Configure firewalls to protect the kingdom.',      color: '#e05040' },
  'qr-codes':  { name: 'QR Temple',        emoji: '📱', desc: 'Scan wisely — not all QR codes are safe.',         color: '#9b59b6' },
  'ai-threats': { name: 'AI Lab',          emoji: '🤖', desc: 'Detect AI-generated threats and deepfakes.',       color: '#40c8e0' },
  scams:       { name: 'Scam Market',      emoji: '🏪', desc: 'Navigate the market and spot the scams.',          color: '#f0a030' },
  'dark-web':  { name: 'Dark Web Depths',  emoji: '🕳️', desc: 'Explore the dark web safely.',                    color: '#8a4af0' },
};

export default function RoomSelect() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const zone = searchParams.get('zone') || null;
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    gameService.getProgress()
      .then(res => setProgress(res.data))
      .catch(() => {});
  }, []);

  // If a zone is specified, show the room entry/info panel
  if (zone && ROOM_CONFIG[zone]) {
    const room = ROOM_CONFIG[zone];
    return (
      <div className="h-full flex items-center justify-center p-8"
           style={{ background: `linear-gradient(180deg, ${room.color}20 0%, #f5e6c8 100%)` }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm"
        >
          {/* Back button */}
          <button onClick={() => navigate('/rooms')}
                  className="cq-btn cq-btn-secondary mb-4 text-[8px]">
            <ArrowLeft size={14} /> Back
          </button>

          <div className="cq-panel-dark">
            {/* Room icon + stars */}
            <div className="flex items-center gap-4 mb-4">
              <div className="text-5xl cq-float">{room.emoji}</div>
              <div>
                <h2 className="font-pixel text-sm text-white"
                    style={{ textShadow: '2px 2px 0 #000' }}>
                  {room.name}
                </h2>
                <div className="cq-stars mt-1">
                  {[1, 2, 3].map(s => (
                    <span key={s} className="cq-star empty">⭐</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-300 mb-4" style={{ fontFamily: "'VT323', monospace", fontSize: '20px' }}>
              {room.desc}
            </p>

            {/* Rewards */}
            <div className="mb-4">
              <p className="font-pixel text-[8px] text-gray-400 mb-2">Rewards</p>
              <div className="flex gap-3 items-center">
                <span className="cq-hud-stat text-[8px]">🪙 +50</span>
                <span className="cq-hud-stat text-[8px]" style={{ background: '#50c878', borderColor: '#308040' }}>XP +30 XP</span>
              </div>
            </div>

            {/* Enter button */}
            <button onClick={() => navigate(`/game/${zone}`)}
                    className="cq-btn cq-btn-primary w-full justify-center">
              ⚔ Enter
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Default: show all rooms in a grid
  return (
    <div className="p-6 h-full overflow-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/dashboard')}
                className="cq-btn cq-btn-secondary text-[8px]">
          <ArrowLeft size={14} /> Map
        </button>
        <h1 className="font-pixel text-sm" style={{ color: '#2a1a0a' }}>Select Zone</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(ROOM_CONFIG).map(([key, room], i) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <button
              onClick={() => navigate(`/rooms?zone=${key}`)}
              className="cq-panel-dark w-full text-left hover:scale-[1.02] transition-transform"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{room.emoji}</span>
                <div>
                  <div className="font-pixel text-[9px] text-white">{room.name}</div>
                  <div className="cq-stars mt-1">
                    {[1, 2, 3].map(s => <span key={s} className="cq-star empty">⭐</span>)}
                  </div>
                </div>
              </div>
              <p className="text-gray-400 text-sm" style={{ fontFamily: "'VT323', monospace" }}>
                {room.desc}
              </p>
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
