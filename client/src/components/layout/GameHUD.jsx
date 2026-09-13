import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Map as MapIcon, ScrollText, Backpack, Award, Trophy, User, Key } from 'lucide-react';
import useGameStore from '../../store/gameStore';

const GameHUD = () => {
  const navigate = useNavigate();
  const { player } = useGameStore();

  return (
    <div className="absolute inset-0 pointer-events-none flex z-50">
      
      {/* Sidebar Navigation */}
      <div className="w-64 h-full p-4 flex flex-col gap-4 pointer-events-auto">
        
        {/* LOGO BOX */}
        <div className="pixel-panel-wood p-4 flex items-center gap-3 justify-center mb-2">
          <Shield className="w-10 h-10 text-blue-400 fill-blue-900 drop-shadow-[2px_2px_0_#000]" />
          <div className="flex flex-col leading-none">
            <span className="text-white font-pixel text-xl drop-shadow-[2px_2px_0_#000]">CYBER</span>
            <span className="text-yellow-400 font-pixel text-xl drop-shadow-[2px_2px_0_#000]">QUEST</span>
          </div>
        </div>

        {/* NAVIGATION BOX */}
        <div className="pixel-panel-blue p-4 flex flex-col gap-3 flex-1 overflow-y-auto">
          <button onClick={() => navigate('/dashboard')} className="pixel-panel-stone w-full flex items-center gap-3 p-3 hover:brightness-110 active:translate-y-1 transition-all">
            <MapIcon className="w-6 h-6 text-blue-300" />
            <span className="font-pixel text-sm mt-1">WORLD</span>
          </button>
          <button onClick={() => navigate('/rooms')} className="pixel-panel-wood w-full flex items-center gap-3 p-3 hover:brightness-110 active:translate-y-1 transition-all">
            <ScrollText className="w-6 h-6 text-yellow-200" />
            <span className="font-pixel text-sm mt-1">QUESTS</span>
          </button>
          <button className="pixel-panel-wood w-full flex items-center gap-3 p-3 hover:brightness-110 active:translate-y-1 transition-all opacity-50 cursor-not-allowed">
            <Backpack className="w-6 h-6 text-orange-300" />
            <span className="font-pixel text-sm mt-1">INVENTORY</span>
          </button>
          <button className="pixel-panel-wood w-full flex items-center gap-3 p-3 hover:brightness-110 active:translate-y-1 transition-all opacity-50 cursor-not-allowed">
            <Award className="w-6 h-6 text-yellow-400" />
            <span className="font-pixel text-sm mt-1">BADGES</span>
          </button>
          <button onClick={() => navigate('/leaderboard')} className="pixel-panel-wood w-full flex items-center gap-3 p-3 hover:brightness-110 active:translate-y-1 transition-all">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <span className="font-pixel text-sm mt-1">LEADERBOARD</span>
          </button>
          <button onClick={() => navigate('/cyber-dna')} className="pixel-panel-wood w-full flex items-center gap-3 p-3 hover:brightness-110 active:translate-y-1 transition-all mt-auto">
            <User className="w-6 h-6 text-blue-300" />
            <span className="font-pixel text-sm mt-1">PROFILE</span>
          </button>
        </div>
      </div>

      {/* Main Content Area (Top HUD + Game World) */}
      <div className="flex-1 flex flex-col pt-4 pr-4 pb-4">
        
        {/* TOP HUD */}
        <div className="pixel-panel-wood w-full h-20 flex items-center justify-between px-6 pointer-events-auto">
          
          {/* Player Info Box */}
          <div className="pixel-panel-blue px-4 py-2 flex items-center gap-4 w-96">
            <div className="w-12 h-12 bg-slate-800 border-2 border-black flex items-center justify-center text-3xl overflow-hidden rounded">
              👦
            </div>
            <div className="flex-1">
              <div className="font-pixel text-sm mb-1 drop-shadow-[2px_2px_0_#000]">Yuvraj</div>
              <div className="flex items-center gap-2">
                <span className="font-pixel text-[10px]">Lv. {player.level}</span>
                <div className="pixel-bar-container h-4 flex-1">
                  <div className="pixel-bar-fill-success" style={{ width: `${(player.xp % 100)}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Box */}
          <div className="flex items-center gap-8">
            {/* Hearts */}
            <div className="flex gap-1">
              {Array.from({ length: player.maxHearts }).map((_, i) => (
                <div key={i} className={`text-2xl drop-shadow-[2px_2px_0_#000] ${i < player.hearts ? '' : 'grayscale opacity-50'}`}>
                  ❤️
                </div>
              ))}
            </div>

            {/* Currencies */}
            <div className="flex gap-6 font-pixel text-lg drop-shadow-[2px_2px_0_#000]">
              <div className="flex items-center gap-2">
                <span>🪙</span> {player.coins}
              </div>
              <div className="flex items-center gap-2">
                <span>💎</span> {player.gems}
              </div>
              <div className="flex items-center gap-2">
                <span>🗝️</span> {player.keys || 0}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default GameHUD;
