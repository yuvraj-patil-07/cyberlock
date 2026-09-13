import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, Map as MapIcon, ScrollText, Backpack, Award, Trophy, User } from 'lucide-react';
import useGameStore from '../../store/gameStore';

const NAV_ITEMS = [
  { path: '/dashboard', icon: MapIcon,    label: 'WORLD',       color: '#4a90d0' },
  { path: '/rooms',     icon: ScrollText, label: 'QUESTS',      color: '#aab' },
  { path: null,         icon: Backpack,   label: 'INVENTORY',   color: '#aab', disabled: true },
  { path: null,         icon: Award,      label: 'BADGES',      color: '#aab', disabled: true },
  { path: '/leaderboard', icon: Trophy,   label: 'LEADERBOARD', color: '#aab' },
  { path: '/cyber-dna', icon: User,       label: 'PROFILE',     color: '#aab' },
];

const GameHUD = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { player } = useGameStore();

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2 px-3 py-3 border-b-4 border-black">
        <span className="text-2xl">🛡️</span>
        <div>
          <span className="font-pixel text-[10px] text-white leading-none block"
                style={{ textShadow: '1px 1px 0 #000' }}>
            CYBER
          </span>
          <span className="font-pixel text-[10px] leading-none block"
                style={{ color: '#4a90d0', textShadow: '1px 1px 0 #000' }}>
            QUEST
          </span>
        </div>
      </div>

      {/* Navigation buttons */}
      <nav className="flex flex-col gap-1 p-2 flex-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = item.path && location.pathname === item.path;
          return (
            <button
              key={item.label}
              onClick={() => item.path && !item.disabled && navigate(item.path)}
              disabled={item.disabled}
              className={`cq-sidebar-btn ${isActive ? 'active' : ''} ${item.disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default GameHUD;
