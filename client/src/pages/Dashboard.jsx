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

/* Sidebar nav items */
const SIDEBAR_ITEMS = [
  { label: 'WORLD',       icon: '🗺️', route: '/dashboard' },
  { label: 'QUESTS',      icon: '📜', route: '/rooms' },
  { label: 'INVENTORY',   icon: '🧰', route: null },
  { label: 'BADGES',      icon: '⭐', route: null },
  { label: 'LEADERBOARD', icon: '🏆', route: '/leaderboard' },
  { label: 'PROFILE',     icon: '🧑‍💻', route: '/cyber-dna' },
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
    <div className="relative w-screen h-screen overflow-hidden bg-[#0f172a]" style={{ fontFamily: "'Nunito', 'Inter', sans-serif" }}>
      
      {/* ═══ CLEAN BACKGROUND MAP (NO UI BAKED IN) ═══ */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/clean-map.jpg"
          alt="Cyber Quest World Map"
          className="w-full h-full object-cover"
          draggable={false}
        />
      </div>

      {/* ═══ TOP HUD ═══ */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-[#15213d] border-b-[3px] border-[#0a1020] z-30 flex items-center justify-between px-6 shadow-xl min-w-[800px]">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <div className="bg-[#1e3a8a] border-2 border-[#3b82f6] rounded px-2 py-1 flex items-center shadow-[inset_0_2px_4px_rgba(255,255,255,0.2)]">
            <span className="text-xl">🛡️</span>
          </div>
          <span className="text-white font-black italic tracking-wider text-xl" style={{ textShadow: '2px 2px 0 #000' }}>CYBER QUEST</span>
        </div>

        {/* Player Profile Section */}
        <div className="flex items-center bg-[#c8d4e4] rounded-full h-10 pr-4 pl-1 border-2 border-[#8ba3c0] shadow-[0_4px_0_#0a1020]">
          <div className="bg-[#15213d] rounded-full w-8 h-8 flex items-center justify-center border-2 border-[#1e3a8a] overflow-hidden mr-3">
            <span className="text-sm">🧑‍💻</span>
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-baseline gap-2">
              <span className="text-[#1a2942] font-extrabold text-xs leading-none uppercase">{user?.username || 'YUVI'}</span>
              <span className="text-[#3b4c6b] font-bold text-[9px] leading-none">LV. {user?.level || 2}</span>
            </div>
            <div className="w-28 h-2 bg-[#a2b5cc] rounded-full mt-1 border border-[#8ba3c0] overflow-hidden relative shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)]">
              <div className="absolute top-0 left-0 h-full bg-[#40aa66] rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.5)]" style={{ width: '52%' }}></div>
              <div className="absolute inset-0 flex items-center justify-center text-[7px] font-bold text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                420 / 800 XP
              </div>
            </div>
          </div>
        </div>

        {/* Currencies Section */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1">
            <span className="text-lg drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">❤️</span>
            <span className="text-lg drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">❤️</span>
            <span className="text-lg grayscale opacity-50">❤️</span>
          </div>
          <div className="flex items-center gap-2 bg-[#0a1020]/50 rounded-full px-3 py-1 border border-[#ffffff10]">
            <span className="text-base">🪙</span>
            <span className="text-white font-bold text-sm">{user?.coins || 120}</span>
          </div>
          <div className="flex items-center gap-2 bg-[#0a1020]/50 rounded-full px-3 py-1 border border-[#ffffff10]">
            <span className="text-base">💎</span>
            <span className="text-white font-bold text-sm">25</span>
          </div>
          <div className="flex items-center gap-2 bg-[#0a1020]/50 rounded-full px-3 py-1 border border-[#ffffff10]">
            <span className="text-base">🔑</span>
            <span className="text-white font-bold text-sm">1</span>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-[#2a3852] p-2 rounded-lg border-2 border-[#151c2a] shadow-[0_4px_0_#0a1020] cursor-pointer hover:bg-[#344563] transition-colors">
          <span className="text-lg text-[#8ba3c0]">⚙️</span>
        </div>
      </div>

      {/* ═══ MAP CONTAINER ═══ 
          This forces the map nodes to stay correctly proportioned to the background image's center
          without letterboxing. */}
      <div className="absolute inset-0 z-10">
        {ZONES.map((zone) => {
          const stars = getZoneStars(zone.id);
          return (
            <div
              key={zone.id}
              className="absolute flex flex-col items-center justify-center group"
              style={{
                left: `${zone.x}%`,
                top: `${zone.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <button
                onClick={() => navigate(zone.route)}
                className="bg-[#15213d] border-[3px] border-[#0a1020] rounded-xl px-4 py-2 flex flex-col items-center shadow-[0_6px_0_#0a1020] group-hover:-translate-y-1 group-hover:shadow-[0_10px_0_#0a1020] transition-all cursor-pointer relative min-w-[140px]"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="bg-[#0a1020] rounded text-base p-1">{zone.emoji}</div>
                  <span className="text-white font-extrabold text-[10px] tracking-wider whitespace-nowrap">{zone.name}</span>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3].map(s => (
                    <span key={s} className={`text-sm drop-shadow-[0_2px_0_#000] ${s <= stars ? 'text-yellow-400' : 'text-[#3b4c6b] grayscale opacity-50'}`}>
                      ⭐
                    </span>
                  ))}
                </div>
                <div className="absolute inset-0 rounded-lg border-2 border-white/10 opacity-0 group-hover:opacity-100 pointer-events-none"></div>
              </button>
            </div>
          );
        })}
      </div>

      {/* ═══ LEFT SIDEBAR ═══ */}
      <div className="absolute top-24 left-6 w-[220px] bg-[#1d2d4c] rounded-xl border-[3px] border-[#0a1020] z-20 flex flex-col p-2 shadow-2xl">
        {SIDEBAR_ITEMS.map((item) => {
          const isActive = item.label === 'WORLD';
          return (
            <button
              key={item.label}
              onClick={() => item.route && navigate(item.route)}
              className={`w-full flex items-center gap-4 px-4 py-3 mb-2 rounded-lg text-left transition-all ${
                isActive 
                  ? 'bg-[#224271] border-2 border-[#3ab4f2] text-white shadow-[0_0_15px_rgba(58,180,242,0.4)]' 
                  : 'bg-transparent border-2 border-transparent text-[#8ba3c0] hover:bg-[#253961] hover:text-white'
              } ${!item.route ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-bold text-xs tracking-wider">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* ═══ RIGHT SIDEBARS ═══ */}
      <div className="absolute top-24 right-6 w-[280px] flex flex-col gap-6 z-20">
        
        {/* Current Quest */}
        <div className="bg-[#15213d] rounded-xl border-[3px] border-[#0a1020] p-5 shadow-2xl relative">
          {/* Top highlight line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-white/5 rounded-t-lg"></div>
          
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">📜</span>
            <span className="text-white font-extrabold text-[11px] tracking-wider">CURRENT QUEST</span>
          </div>
          <p className="text-[#c8d4e4] text-[11px] leading-relaxed mb-4 font-bold uppercase">
            IDENTIFY 5 PHISHING EMAILS IN PHISHING PORT.
          </p>
          <div className="w-full h-3 bg-[#0a1020] rounded-full overflow-hidden border border-[#2a3852] mb-2 shadow-inner">
            <div className="h-full bg-[#40aa66] rounded-full shadow-[inset_0_2px_2px_rgba(255,255,255,0.3)] relative" style={{ width: '40%' }}>
              <div className="absolute top-0 right-0 bottom-0 w-4 bg-white/20 skew-x-[-20deg]"></div>
            </div>
          </div>
          <div className="text-right text-[#8ba3c0] font-bold text-[10px]">2/5</div>
        </div>

        {/* Daily Missions */}
        <div className="bg-[#15213d] rounded-xl border-[3px] border-[#0a1020] p-5 shadow-2xl relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-white/5 rounded-t-lg"></div>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl text-yellow-400">☀️</span>
            <span className="text-white font-extrabold text-[11px] tracking-wider">DAILY MISSIONS</span>
          </div>
          
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded bg-[#0a1020] border border-[#2a3852] shadow-inner"></div>
                <span className="text-[#c8d4e4] text-[10px] font-bold uppercase tracking-wide">COMPLETE A CHALLENGE</span>
              </div>
              <span className="text-[#8ba3c0] text-[9px] font-bold">0/1</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded bg-[#0a1020] border border-[#2a3852] shadow-inner"></div>
                <span className="text-[#c8d4e4] text-[10px] font-bold uppercase tracking-wide">EARN 100 COINS</span>
              </div>
              <span className="text-[#8ba3c0] text-[9px] font-bold">20/100</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded bg-[#0a1020] border border-[#2a3852] shadow-inner"></div>
                <span className="text-[#c8d4e4] text-[10px] font-bold uppercase tracking-wide">VISIT THE AI LAB</span>
              </div>
              <span className="text-[#8ba3c0] text-[9px] font-bold">0/1</span>
            </div>
          </div>
        </div>

      </div>

      {/* ═══ BOTTOM COMPASS ═══ */}
      <div className="absolute bottom-8 left-8 z-20 opacity-90 drop-shadow-2xl">
        <div className="relative w-24 h-24 rounded-full bg-[#15213d] border-[3px] border-[#0a1020] shadow-[0_4px_0_#0a1020] flex items-center justify-center">
          <div className="absolute inset-2 border border-[#2a3852] rounded-full"></div>
          <span className="absolute top-2 text-[#c8d4e4] font-bold text-xs">N</span>
          <span className="absolute bottom-2 text-[#c8d4e4] font-bold text-xs">S</span>
          <span className="absolute left-3 text-[#c8d4e4] font-bold text-xs">W</span>
          <span className="absolute right-3 text-[#c8d4e4] font-bold text-xs">E</span>
          <div className="w-6 h-12 relative">
            <div className="absolute top-0 w-0 h-0 border-l-[6px] border-r-[6px] border-b-[24px] border-l-transparent border-r-transparent border-b-red-500"></div>
            <div className="absolute bottom-0 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[24px] border-l-transparent border-r-transparent border-t-white"></div>
          </div>
        </div>
      </div>

      {/* ═══ CONTINUE BUTTON ═══ */}
      <button
        onClick={() => navigate('/rooms')}
        className="absolute right-8 bottom-8 w-[240px] h-16 bg-[#e6a629] rounded-xl border-[3px] border-[#0a1020] z-20 flex items-center justify-center gap-3 shadow-[0_8px_0_#8b6015] hover:mt-1 hover:mb-[-4px] hover:shadow-[0_4px_0_#8b6015] active:mt-2 active:mb-[-8px] active:shadow-[0_0_0_#8b6015] transition-all group"
      >
        <span className="text-3xl drop-shadow-[0_2px_0_rgba(0,0,0,0.3)] group-hover:scale-110 transition-transform">⚔️</span>
        <span className="text-[#1a1306] font-black text-xl tracking-widest drop-shadow-[0_1px_0_rgba(255,255,255,0.4)] uppercase">
          CONTINUE {'>'}
        </span>
      </button>

    </div>
  );
}
