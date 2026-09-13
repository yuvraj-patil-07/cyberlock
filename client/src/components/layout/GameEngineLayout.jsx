import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import GameHUD from './GameHUD';
import { Settings } from 'lucide-react';

const GameEngineLayout = ({ children }) => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: '#f5e6c8' }}>
      {/* ═══ TOP HUD BAR ═══ */}
      <div className="cq-hud-bar flex-shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-2 mr-4">
          <span className="text-xl">🛡️</span>
          <span className="font-pixel text-[9px] text-white" style={{ textShadow: '1px 1px 0 #000' }}>
            CYBER QUEST
          </span>
        </div>

        {/* Player info */}
        <div className="cq-hud-stat">
          <span className="text-lg">🧑‍💻</span>
          <div className="flex flex-col leading-none">
            <span className="text-[9px]">{user?.username || 'Player'}</span>
            <span className="text-[7px] text-gray-400">Lv. {user?.level || 1}</span>
          </div>
        </div>

        {/* XP Bar */}
        <div className="flex items-center gap-2">
          <div className="cq-bar cq-bar-xp" style={{ width: '120px', height: '16px' }}>
            <div className="cq-bar-fill" style={{ width: `${Math.min(100, ((user?.xp || 0) / (user?.xpToNext || 800)) * 100)}%` }} />
          </div>
          <span className="text-[8px] font-pixel text-gray-300">{user?.xp || 0} / {user?.xpToNext || 800} XP</span>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Stats */}
        <div className="flex items-center gap-2">
          {/* Hearts */}
          <div className="cq-hud-stat">
            <span>❤️</span><span>❤️</span><span>❤️</span>
          </div>

          {/* Coins */}
          <div className="cq-hud-stat">
            <span>🪙</span>
            <span>{user?.coins || 120}</span>
          </div>

          {/* Gems */}
          <div className="cq-hud-stat">
            <span>💎</span>
            <span>{user?.gems || 25}</span>
          </div>

          {/* Keys */}
          <div className="cq-hud-stat">
            <span>🔑</span>
            <span>{user?.keys || 1}</span>
          </div>

          {/* Settings */}
          <button className="p-2 text-gray-400 hover:text-white transition-colors">
            <Settings size={18} />
          </button>
        </div>
      </div>

      {/* ═══ MAIN CONTENT AREA ═══ */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="cq-sidebar flex-shrink-0 hidden md:flex">
          <GameHUD />
        </div>

        {/* Main viewport */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default GameEngineLayout;
