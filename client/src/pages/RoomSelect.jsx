import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock } from 'lucide-react';
import { gameService } from '../services/gameService';

const ROOM_CONFIG = {
  phishing:    { id: 1, name: 'Phishing Port',       emoji: '📧', desc: 'Learn to identify and avoid phishing emails.',      color: '#4a90d0' },
  passwords:   { id: 2, name: 'Password Vault',      emoji: '🔐', desc: 'Build strong passwords and defend your vault.',     color: '#50c878' },
  'qr-codes':  { id: 3, name: 'QR Temple',           emoji: '📱', desc: 'Scan wisely — not all QR codes are safe.',          color: '#9b59b6' },
  scams:       { id: 4, name: 'Scam Market',         emoji: '🏪', desc: 'Navigate the market and spot the scams.',           color: '#f0a030' },
  firewall:    { id: 5, name: 'Firewall Defense',    emoji: '🛡️', desc: 'BLOCK or ALLOW packets to defend the server!',  color: '#e05040' },
  'ai-threats':{ id: 6, name: 'Deepfake Detective',  emoji: '🧠', desc: 'Classify content as REAL or AI-GENERATED!',    color: '#40c8e0' },
  'dark-web':  { id: 7, name: 'Final Cyber Castle',  emoji: '🏰', desc: 'The ultimate test — apply everything you know.', color: '#8a4af0' },
};

function StarRow({ stars = 0 }) {
  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[1, 2, 3].map(s => (
        <span key={s} style={{ fontSize: '14px', opacity: s <= stars ? 1 : 0.25 }}>⭐</span>
      ))}
    </div>
  );
}

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

  const getRoomStars = (roomId) => {
    const roomStars = progress?.user?.roomStars;
    if (!roomStars) return 0;
    return roomStars[String(roomId)] || 0;
  };

  const isRoomCompleted = (roomId) => {
    const completedRooms = progress?.user?.completedRooms || [];
    return completedRooms.includes(String(roomId));
  };

  const isRoomUnlocked = (roomId) => {
    const completedCount = (progress?.user?.completedRooms || []).length;
    if (roomId <= 4) return true; // First 4 always unlocked
    if (roomId === 5) return completedCount >= 2;
    if (roomId === 6) return completedCount >= 3;
    if (roomId === 7) return completedCount >= 4;
    return false;
  };

  // If a zone is specified, show the room entry/info panel
  if (zone && ROOM_CONFIG[zone]) {
    const room = ROOM_CONFIG[zone];
    const unlocked = isRoomUnlocked(room.id);
    const completed = isRoomCompleted(room.id);
    const stars = getRoomStars(room.id);

    return (
      <div className="h-full flex items-center justify-center p-4"
           style={{ background: `linear-gradient(180deg, ${room.color}20 0%, #0a0d1a 100%)` }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm"
        >
          <button onClick={() => navigate('/rooms')}
                  className="cq-btn cq-btn-secondary mb-4 text-[8px]">
            <ArrowLeft size={14} /> Back
          </button>

          <div className="cq-panel-dark">
            <div className="flex items-center gap-4 mb-4">
              <div className="text-5xl cq-float" style={{ filter: unlocked ? 'none' : 'grayscale(1)' }}>
                {unlocked ? room.emoji : '🔒'}
              </div>
              <div>
                <h2 className="font-pixel text-sm text-white" style={{ textShadow: '2px 2px 0 #000' }}>
                  {room.name}
                </h2>
                <StarRow stars={stars} />
                {completed && <p style={{ color: '#10b981', fontFamily: "'VT323',monospace", fontSize: '16px', marginTop: '2px' }}>✅ COMPLETED</p>}
              </div>
            </div>

            <p className="text-gray-300 mb-4" style={{ fontFamily: "'VT323', monospace", fontSize: '20px' }}>
              {room.desc}
            </p>

            <div className="mb-4">
              <p className="font-pixel text-[8px] text-gray-400 mb-2">Rewards</p>
              <div className="flex gap-3 items-center">
                <span className="cq-hud-stat text-[8px]">🪙 +50</span>
                <span className="cq-hud-stat text-[8px]" style={{ background: '#50c878', borderColor: '#308040' }}>XP +150 XP</span>
              </div>
            </div>

            {unlocked ? (
              <button onClick={() => navigate(`/play/${room.id}`)}
                      className="cq-btn cq-btn-primary w-full justify-center">
                {completed ? '🔄 Replay' : '⚔ Enter'}
              </button>
            ) : (
              <div style={{ textAlign: 'center', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid #3d4f7c' }}>
                <Lock size={16} style={{ margin: '0 auto 0.5rem', color: '#8892a4' }} />
                <p style={{ fontFamily: "'VT323',monospace", fontSize: '18px', color: '#8892a4' }}>
                  Complete more rooms to unlock
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  // Default: show all rooms in a grid
  return (
    <div className="p-3 h-full overflow-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/dashboard')}
                className="cq-btn cq-btn-secondary text-[8px]">
          <ArrowLeft size={14} /> Map
        </button>
        <h1 className="font-pixel text-sm" style={{ color: '#e2e8f0' }}>Select Zone</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(ROOM_CONFIG).map(([key, room], i) => {
          const unlocked = isRoomUnlocked(room.id);
          const completed = isRoomCompleted(room.id);
          const stars = getRoomStars(room.id);
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <button
                onClick={() => navigate(`/rooms?zone=${key}`)}
                disabled={!unlocked}
                className="cq-panel-dark w-full text-left transition-transform"
                style={{
                  opacity: unlocked ? 1 : 0.5,
                  transform: 'none',
                  cursor: unlocked ? 'pointer' : 'not-allowed',
                  borderColor: completed ? room.color : undefined,
                  boxShadow: completed ? `0 0 10px ${room.color}40` : undefined,
                }}
                onMouseEnter={e => { if (unlocked) e.currentTarget.style.transform = 'scale(1.02)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl" style={{ filter: unlocked ? 'none' : 'grayscale(1)' }}>
                    {unlocked ? room.emoji : '🔒'}
                  </span>
                  <div>
                    <div className="font-pixel text-[9px] text-white">{room.name}</div>
                    <StarRow stars={stars} />
                  </div>
                </div>
                <p className="text-gray-400 text-sm" style={{ fontFamily: "'VT323', monospace" }}>
                  {room.desc}
                </p>
                {completed && (
                  <div style={{ marginTop: '0.5rem', color: '#10b981', fontFamily: "'VT323',monospace", fontSize: '14px' }}>
                    ✅ COMPLETED
                  </div>
                )}
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}


