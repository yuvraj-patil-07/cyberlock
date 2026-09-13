import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gameService } from '../services/gameService';
import { useAuth } from '../hooks/useAuth';

/* Zone definitions with exact % positions mapped to the 1024x576 image */
const ZONES = [
  { id: 'phishing',    name: 'PHISHING',   emoji: '💀', x: 28,  y: 25,  route: '/play/phishing' },
  { id: 'passwords',   name: 'PASSWORDS',  emoji: '🔑', x: 26,  y: 49,  route: '/play/passwords' },
  { id: 'firewall',    name: 'FIREWALL',   emoji: '🛡️', x: 50,  y: 46,  route: '/play/firewall' },
  { id: 'qr-codes',    name: 'QR TEMPLE',  emoji: '🔳', x: 37,  y: 69,  route: '/play/qr-codes' },
  { id: 'ai-threats',  name: 'AI LAB',     emoji: '🤖', x: 72,  y: 25,  route: '/play/ai-threats' },
  { id: 'scams',       name: 'SCAMS',      emoji: '🎭', x: 73,  y: 49,  route: '/play/scams' },
  { id: 'dark-web',    name: 'DARK WEB',   emoji: '💀', x: 69,  y: 75,  route: '/play/dark-web' },
  { id: 'final',       name: 'CYBER CORE', emoji: '👑', x: 50,  y: 18,  route: '/play/final' },
];

/* Sidebar nav items */
const SIDEBAR_ITEMS = [
  { label: 'WORLD',       icon: '🗺️', route: '/dashboard' },
  { label: 'QUESTS',      icon: '📜', route: '/rooms' },
  { label: 'INVENTORY',   icon: '🧰', route: null },
  { label: 'BADGES',      icon: '⭐', route: null },
  { label: 'RANKS',       icon: '🏆', route: '/leaderboard' },
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
    <div className="relative w-screen h-screen overflow-hidden bg-[#4592c4]" style={{ fontFamily: "'Press Start 2P', monospace", imageRendering: 'pixelated' }}>
      
      {/* ═══ MATHEMATICAL ASPECT RATIO TRICK FOR BACKGROUND MAP ═══ 
          This scaling container perfectly mimics object-cover behavior for the background image,
          while ensuring all percentage-based coordinates perfectly align to the image's islands
          at ALL screen sizes without letterboxing!
      */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
           style={{
             width: 'max(100vw, 100vh * (1024/576))',
             height: 'max(100vh, 100vw * (576/1024))'
           }}>
        
        <video
          src="/assets/bg-video.mp4"
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        />

        {/* ═══ MAP CONTAINER ═══ */}
        <div className="absolute inset-0 z-10 pointer-events-auto">
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
                  className="bg-[#15213d] border-[4px] border-[#0a1020] px-3 py-2 flex flex-col items-center shadow-[0_4px_0_#0a1020] hover:-translate-y-1 hover:shadow-[0_8px_0_#0a1020] hover:bg-[#1e3a8a] transition-all cursor-pointer relative"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white text-[8px] whitespace-nowrap">{zone.name}</span>
                  </div>
                  <div className="flex gap-[2px]">
                    {[1, 2, 3].map(s => (
                      <span key={s} className={`text-[10px] drop-shadow-[2px_2px_0_#000] ${s <= stars ? 'text-yellow-400' : 'text-[#3b4c6b] grayscale opacity-50'}`}>
                        ⭐
                      </span>
                    ))}
                  </div>
                  <div className="absolute inset-0 border-2 border-white/20 opacity-0 group-hover:opacity-100 pointer-events-none"></div>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ═══ TOP HUD ═══ */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-[#15213d] border-b-[4px] border-[#0a1020] z-30 flex items-center justify-between px-6 shadow-xl min-w-[800px]">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <div className="bg-[#1e3a8a] border-[3px] border-[#3b82f6] px-2 py-1 flex items-center shadow-[inset_0_2px_0_rgba(255,255,255,0.2)]">
            <span className="text-xl">🛡️</span>
          </div>
          <span className="text-white text-lg tracking-wider" style={{ textShadow: '3px 3px 0 #000' }}>CYBER QUEST</span>
        </div>

        {/* Player Profile Section */}
        <div className="flex items-center bg-[#c8d4e4] h-10 pr-4 pl-1 border-[4px] border-[#8ba3c0] shadow-[0_4px_0_#0a1020]">
          <div className="bg-[#15213d] w-7 h-7 flex items-center justify-center border-[3px] border-[#1e3a8a] overflow-hidden mr-3">
            <span className="text-sm">🧑‍💻</span>
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-[#1a2942] text-[10px] uppercase leading-none">{user?.username || 'YUVI'}</span>
              <span className="text-[#3b4c6b] text-[8px] leading-none">LV.{user?.level || 2}</span>
            </div>
            <div className="w-28 h-2 bg-[#a2b5cc] border-[2px] border-[#8ba3c0] relative shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)]">
              <div className="absolute top-0 left-0 h-full bg-[#40aa66] shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]" style={{ width: '52%' }}></div>
              <div className="absolute inset-0 flex items-center justify-center text-[6px] text-white drop-shadow-[1px_1px_0_rgba(0,0,0,0.8)]">
                420/800 XP
              </div>
            </div>
          </div>
        </div>

        {/* Currencies Section */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1">
            <span className="text-sm drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)]">❤️</span>
            <span className="text-sm drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)]">❤️</span>
            <span className="text-sm grayscale opacity-50">❤️</span>
          </div>
          <div className="flex items-center gap-2 bg-[#0a1020]/50 px-2 py-1 border-[3px] border-[#15213d]">
            <span className="text-sm">🪙</span>
            <span className="text-white text-[10px]">{user?.coins || 120}</span>
          </div>
          <div className="flex items-center gap-2 bg-[#0a1020]/50 px-2 py-1 border-[3px] border-[#15213d]">
            <span className="text-sm">💎</span>
            <span className="text-white text-[10px]">25</span>
          </div>
          <div className="flex items-center gap-2 bg-[#0a1020]/50 px-2 py-1 border-[3px] border-[#15213d]">
            <span className="text-sm">🔑</span>
            <span className="text-white text-[10px]">1</span>
          </div>
        </div>
      </div>

      {/* ═══ LEFT SIDEBAR ═══ */}
      <div className="absolute top-24 left-6 w-[200px] bg-[#1d2d4c] border-[4px] border-[#0a1020] z-20 flex flex-col p-2 shadow-[8px_8px_0_rgba(0,0,0,0.3)]">
        {SIDEBAR_ITEMS.map((item) => {
          const isActive = item.label === 'WORLD';
          return (
            <button
              key={item.label}
              onClick={() => item.route && navigate(item.route)}
              className={`w-full flex items-center gap-3 px-3 py-3 mb-2 text-left transition-all ${
                isActive 
                  ? 'bg-[#224271] border-[4px] border-[#3ab4f2] text-white shadow-[inset_0_2px_0_rgba(255,255,255,0.3)]' 
                  : 'bg-transparent border-[4px] border-transparent text-[#8ba3c0] hover:bg-[#253961] hover:text-white hover:border-[#8ba3c0]'
              } ${!item.route ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <span className="text-sm">{item.icon}</span>
              <span className="text-[9px] uppercase tracking-widest leading-none mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* ═══ RIGHT SIDEBARS ═══ */}
      <div className="absolute top-24 right-6 w-[260px] flex flex-col gap-6 z-20">
        
        {/* Current Quest */}
        <div className="bg-[#15213d] border-[4px] border-[#0a1020] p-4 shadow-[8px_8px_0_rgba(0,0,0,0.3)] relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-white/10"></div>
          
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm">📜</span>
            <span className="text-white text-[9px] tracking-widest mt-1">QUEST</span>
          </div>
          <p className="text-[#c8d4e4] text-[8px] leading-loose mb-4 uppercase">
            Identify 5 phishing emails in Phishing Port.
          </p>
          <div className="w-full h-3 bg-[#0a1020] border-[2px] border-[#2a3852] mb-2 shadow-inner">
            <div className="h-full bg-[#40aa66] shadow-[inset_0_2px_0_rgba(255,255,255,0.3)] relative" style={{ width: '40%' }}></div>
          </div>
          <div className="text-right text-[#8ba3c0] text-[8px]">2/5</div>
        </div>

        {/* Daily Missions */}
        <div className="bg-[#15213d] border-[4px] border-[#0a1020] p-4 shadow-[8px_8px_0_rgba(0,0,0,0.3)] relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-white/10"></div>

          <div className="flex items-center gap-2 mb-5">
            <span className="text-sm text-yellow-400">☀️</span>
            <span className="text-white text-[9px] tracking-widest mt-1">MISSIONS</span>
          </div>
          
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#0a1020] border-[2px] border-[#2a3852]"></div>
                <span className="text-[#c8d4e4] text-[7px] uppercase mt-1">COMPLETE A CHAL</span>
              </div>
              <span className="text-[#8ba3c0] text-[7px] mt-1">0/1</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#0a1020] border-[2px] border-[#2a3852]"></div>
                <span className="text-[#c8d4e4] text-[7px] uppercase mt-1">EARN 100 COINS</span>
              </div>
              <span className="text-[#8ba3c0] text-[7px] mt-1">20/100</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#0a1020] border-[2px] border-[#2a3852]"></div>
                <span className="text-[#c8d4e4] text-[7px] uppercase mt-1">VISIT AI LAB</span>
              </div>
              <span className="text-[#8ba3c0] text-[7px] mt-1">0/1</span>
            </div>
          </div>
        </div>

      </div>

      {/* ═══ BOTTOM COMPASS ═══ */}
      <div className="absolute bottom-8 left-8 z-20 opacity-90 drop-shadow-[4px_4px_0_rgba(0,0,0,0.5)]">
        <div className="relative w-20 h-20 bg-[#15213d] border-[4px] border-[#0a1020] shadow-[0_4px_0_#0a1020] flex items-center justify-center">
          <div className="absolute inset-1 border-[2px] border-[#2a3852]"></div>
          <span className="absolute top-2 text-[#c8d4e4] text-[8px]">N</span>
          <span className="absolute bottom-2 text-[#c8d4e4] text-[8px]">S</span>
          <span className="absolute left-2 text-[#c8d4e4] text-[8px]">W</span>
          <span className="absolute right-2 text-[#c8d4e4] text-[8px]">E</span>
          <div className="w-4 h-10 relative">
            <div className="absolute top-0 w-0 h-0 border-l-[4px] border-r-[4px] border-b-[20px] border-l-transparent border-r-transparent border-b-red-500"></div>
            <div className="absolute bottom-0 w-0 h-0 border-l-[4px] border-r-[4px] border-t-[20px] border-l-transparent border-r-transparent border-t-white"></div>
          </div>
        </div>
      </div>

      {/* ═══ CONTINUE BUTTON ═══ */}
      <button
        onClick={() => navigate('/rooms')}
        className="absolute right-8 bottom-8 w-[240px] h-16 bg-[#e6a629] border-[4px] border-[#0a1020] z-20 flex items-center justify-center gap-3 shadow-[0_8px_0_#8b6015] hover:mt-1 hover:mb-[-4px] hover:shadow-[0_4px_0_#8b6015] active:mt-2 active:mb-[-8px] active:shadow-[0_0_0_#8b6015] transition-all group"
      >
        <span className="text-xl drop-shadow-[2px_2px_0_rgba(0,0,0,0.3)] group-hover:scale-110 transition-transform">⚔️</span>
        <span className="text-[#1a1306] text-sm tracking-widest drop-shadow-[1px_1px_0_rgba(255,255,255,0.4)] uppercase mt-1">
          CONTINUE
        </span>
      </button>

    </div>
  );
}
