import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gameService } from '../services/gameService';
import { useAuth } from '../hooks/useAuth';

/* Zone definitions with exact % positions matching the image */
const ZONES = [
  { id: 'phishing',    name: 'PHISHING PORT',   emoji: '💀', x: 30,  y: 27,  route: '/play/phishing' },
  { id: 'passwords',   name: 'PASSWORD VAULT',  emoji: '🔑', x: 24,  y: 53,  route: '/play/passwords' },
  { id: 'firewall',    name: 'FIREWALL CITY',   emoji: '🛡️', x: 50,  y: 43,  route: '/play/firewall' },
  { id: 'qr-codes',    name: 'QR TEMPLE',       emoji: '🔳', x: 32,  y: 77,  route: '/play/qr-codes' },
  { id: 'ai-threats',  name: 'AI LAB',          emoji: '🤖', x: 73,  y: 24,  route: '/play/ai-threats' },
  { id: 'scams',       name: 'SCAM MARKET',     emoji: '🎭', x: 76,  y: 54,  route: '/play/scams' },
  { id: 'dark-web',    name: 'DARK WEB DEPTHS', emoji: '💀', x: 72,  y: 76,  route: '/play/dark-web' },
  { id: 'final',       name: 'CYBER CORE',      emoji: '👑', x: 50,  y: 17,  route: '/play/final' },
];

/* Sidebar nav items with exact positions matching the image */
const SIDEBAR_ITEMS = [
  { label: 'WORLD',       icon: '🗺️', route: '/dashboard',   y: 27 },
  { label: 'QUESTS',      icon: '📜', route: '/rooms',       y: 36 },
  { label: 'INVENTORY',   icon: '🧰', route: null,           y: 45 },
  { label: 'BADGES',      icon: '⭐', route: null,           y: 54 },
  { label: 'LEADERBOARD', icon: '🏆', route: '/leaderboard', y: 63 },
  { label: 'PROFILE',     icon: '🧑‍💻', route: '/cyber-dna',   y: 72 },
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

  return (
    <div className="w-screen h-screen bg-[#0f172a] flex items-center justify-center overflow-hidden">
      {/* 
        Fixed 16:9 Aspect Ratio Container
        This guarantees our CSS overlays will perfectly match the background image 
        regardless of the window size, completely eliminating layout shifting.
      */}
      <div 
        className="relative w-full shadow-2xl overflow-hidden" 
        style={{ 
          aspectRatio: '1536 / 1024',
          maxHeight: '100vh',
          maxWidth: '150vh', /* Maintain ratio bounded by height */
          fontFamily: "'Nunito', 'Inter', sans-serif"
        }}
      >
        {/* ═══ THE EXACT IMAGE AS FULL BACKGROUND ═══ */}
        <img
          src="/assets/world-map-bg.png"
          alt="Cyber Quest World Map"
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />

        {/* ═══ TOP HUD OVERLAY ═══ */}
        {/* We cover the baked-in HUD with an exact matching solid color panel to render dynamic text */}
        <div className="absolute top-0 left-0 right-0 h-[8.5%] bg-[#15213d] border-b-[3px] border-[#0a1020] z-30 flex items-center justify-between px-[2%]">
          {/* Logo Section */}
          <div className="flex items-center gap-2 h-full py-[1%]">
            <div className="bg-[#1e3a8a] border-2 border-[#3b82f6] rounded px-2 py-1 flex items-center gap-2 shadow-[inset_0_2px_4px_rgba(255,255,255,0.2)]">
              <span className="text-[1.2vw]">🛡️</span>
            </div>
            <span className="text-white font-black italic tracking-wider text-[1.4vw]" style={{ textShadow: '2px 2px 0 #000' }}>CYBER QUEST</span>
          </div>

          {/* Player Profile Section */}
          <div className="flex items-center bg-[#c8d4e4] rounded-full h-[65%] pr-4 pl-1 border-[3px] border-[#8ba3c0] shadow-[0_4px_0_#0a1020]">
            <div className="bg-[#15213d] rounded-full w-[2.2vw] h-[2.2vw] flex items-center justify-center border-[3px] border-[#1e3a8a] overflow-hidden mr-3">
              <span className="text-[1vw]">🧑‍💻</span>
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-baseline gap-2">
                <span className="text-[#1a2942] font-extrabold text-[0.8vw] leading-none">{user?.username || 'Yuvraj'}</span>
                <span className="text-[#3b4c6b] font-bold text-[0.6vw] leading-none">Lv. {user?.level || 4}</span>
              </div>
              <div className="w-[8vw] h-[0.7vw] bg-[#a2b5cc] rounded-full mt-1 border border-[#8ba3c0] overflow-hidden relative shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)]">
                <div className="absolute top-0 left-0 h-full bg-[#40aa66] rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.5)]" style={{ width: '52%' }}></div>
                <div className="absolute inset-0 flex items-center justify-center text-[0.5vw] font-bold text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                  420 / 800 XP
                </div>
              </div>
            </div>
          </div>

          {/* Currencies Section */}
          <div className="flex items-center gap-[2vw] h-full">
            <div className="flex items-center gap-1">
              <span className="text-[1.2vw] drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">❤️</span>
              <span className="text-[1.2vw] drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">❤️</span>
              <span className="text-[1.2vw] grayscale opacity-50">❤️</span>
            </div>
            <div className="flex items-center gap-2 bg-[#0a1020]/50 rounded-full px-3 py-1 border border-[#ffffff10]">
              <span className="text-[1vw]">🪙</span>
              <span className="text-white font-bold text-[0.9vw]">{user?.coins || 120}</span>
            </div>
            <div className="flex items-center gap-2 bg-[#0a1020]/50 rounded-full px-3 py-1 border border-[#ffffff10]">
              <span className="text-[1vw]">💎</span>
              <span className="text-white font-bold text-[0.9vw]">25</span>
            </div>
            <div className="flex items-center gap-2 bg-[#0a1020]/50 rounded-full px-3 py-1 border border-[#ffffff10]">
              <span className="text-[1vw]">🔑</span>
              <span className="text-white font-bold text-[0.9vw]">1</span>
            </div>
          </div>

          {/* Settings */}
          <div className="bg-[#2a3852] p-2 rounded-lg border-2 border-[#151c2a] shadow-[0_4px_0_#0a1020] cursor-pointer hover:bg-[#344563] transition-colors">
            <span className="text-[1.2vw] text-[#8ba3c0]">⚙️</span>
          </div>
        </div>

        {/* ═══ LEFT SIDEBAR OVERLAY ═══ */}
        <div className="absolute top-[12%] left-[1.5%] w-[13%] bg-[#1d2d4c] rounded-xl border-4 border-[#0a1020] z-20 flex flex-col p-2 shadow-[4px_4px_0_rgba(0,0,0,0.3)]">
          {SIDEBAR_ITEMS.map((item, idx) => {
            const isActive = item.label === 'WORLD';
            return (
              <button
                key={item.label}
                onClick={() => item.route && navigate(item.route)}
                className={`w-full flex items-center gap-3 px-[1vw] py-[0.8vw] mb-[0.2vw] rounded-lg text-left transition-all ${
                  isActive 
                    ? 'bg-[#224271] border-2 border-[#3ab4f2] text-white shadow-[0_0_10px_rgba(58,180,242,0.3)]' 
                    : 'bg-transparent border-2 border-transparent text-[#8ba3c0] hover:bg-[#253961] hover:text-white'
                } ${!item.route ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <span className="text-[1.2vw]">{item.icon}</span>
                <span className="font-bold text-[0.85vw] tracking-wide">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* ═══ RIGHT SIDEBAR OVERLAYS ═══ */}
        <div className="absolute top-[12%] right-[1.5%] w-[18%] flex flex-col gap-4 z-20">
          
          {/* Current Quest */}
          <div className="bg-[#15213d] rounded-xl border-4 border-[#0a1020] p-[1vw] shadow-[4px_4px_0_rgba(0,0,0,0.3)]">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[1.2vw]">📜</span>
              <span className="text-white font-bold text-[0.8vw] tracking-wider">CURRENT QUEST</span>
            </div>
            <p className="text-[#c8d4e4] text-[0.8vw] leading-tight mb-3 font-semibold">
              Identify 5 phishing emails in Phishing Port.
            </p>
            <div className="w-full h-[0.8vw] bg-[#0a1020] rounded-full overflow-hidden border border-[#2a3852] mb-1">
              <div className="h-full bg-[#40aa66] rounded-full shadow-[inset_0_2px_2px_rgba(255,255,255,0.3)]" style={{ width: '40%' }}></div>
            </div>
            <div className="text-right text-[#8ba3c0] font-bold text-[0.7vw]">2 / 5</div>
          </div>

          {/* Daily Missions */}
          <div className="bg-[#15213d] rounded-xl border-4 border-[#0a1020] p-[1vw] shadow-[4px_4px_0_rgba(0,0,0,0.3)]">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[1.2vw] text-yellow-400">☀️</span>
              <span className="text-white font-bold text-[0.8vw] tracking-wider">DAILY MISSIONS</span>
            </div>
            
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-[1vw] h-[1vw] rounded bg-[#0a1020] border border-[#2a3852]"></div>
                  <span className="text-[#c8d4e4] text-[0.75vw] font-semibold">Complete a challenge</span>
                </div>
                <span className="text-[#8ba3c0] text-[0.7vw] font-bold">0/1</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-[1vw] h-[1vw] rounded bg-[#0a1020] border border-[#2a3852]"></div>
                  <span className="text-[#c8d4e4] text-[0.75vw] font-semibold">Earn 100 coins</span>
                </div>
                <span className="text-[#8ba3c0] text-[0.7vw] font-bold">20/100</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-[1vw] h-[1vw] rounded bg-[#0a1020] border border-[#2a3852]"></div>
                  <span className="text-[#c8d4e4] text-[0.75vw] font-semibold">Visit the AI Lab</span>
                </div>
                <span className="text-[#8ba3c0] text-[0.7vw] font-bold">0/1</span>
              </div>
            </div>
          </div>

        </div>

        {/* ═══ CLICKABLE ZONE HOTSPOTS & LABEL OVERLAYS ═══ */}
        {ZONES.map((zone) => {
          const stars = getZoneStars(zone.id);
          return (
            <div
              key={zone.id}
              className="absolute flex flex-col items-center justify-center z-10 group"
              style={{
                left: `${zone.x}%`,
                top: `${zone.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {/* Overlaid Label to hide baked-in one completely and allow dynamic stars */}
              <button
                onClick={() => navigate(zone.route)}
                className="bg-[#15213d] border-[3px] border-[#0a1020] rounded-xl px-3 py-1.5 flex flex-col items-center shadow-[0_6px_0_#0a1020] group-hover:-translate-y-1 group-hover:shadow-[0_10px_0_#0a1020] transition-all cursor-pointer relative"
                style={{ minWidth: '9vw' }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="bg-[#0a1020] rounded text-[1vw] p-0.5">{zone.emoji}</div>
                  <span className="text-white font-extrabold text-[0.75vw] tracking-wider whitespace-nowrap">{zone.name}</span>
                </div>
                
                {/* Dynamic Stars */}
                <div className="flex gap-1">
                  {[1, 2, 3].map(s => (
                    <span key={s} className={`text-[0.8vw] drop-shadow-[0_2px_0_#000] ${s <= stars ? 'text-yellow-400' : 'text-[#3b4c6b] grayscale opacity-50'}`}>
                      ⭐
                    </span>
                  ))}
                </div>
                
                {/* Highlight Effect */}
                <div className="absolute inset-0 rounded-lg border-2 border-white/10 opacity-0 group-hover:opacity-100 pointer-events-none"></div>
              </button>
            </div>
          );
        })}

        {/* ═══ CONTINUE BUTTON OVERLAY ═══ */}
        <button
          onClick={() => navigate('/rooms')}
          className="absolute right-[1.5%] bottom-[3%] w-[13%] h-[7%] bg-[#e6a629] rounded-xl border-[4px] border-[#0a1020] z-20 flex items-center justify-center gap-2 shadow-[0_6px_0_#8b6015] hover:-translate-y-1 hover:shadow-[0_8px_0_#8b6015] active:translate-y-[4px] active:shadow-[0_0_0_#8b6015] transition-all"
        >
          <span className="text-[1.5vw] drop-shadow-[0_2px_0_rgba(0,0,0,0.3)]">⚔️</span>
          <span className="text-[#1a1306] font-black text-[1.2vw] tracking-wider drop-shadow-[0_1px_0_rgba(255,255,255,0.3)]">CONTINUE {'>'}</span>
        </button>

      </div>
    </div>
  );
}
