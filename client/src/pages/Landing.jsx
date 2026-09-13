import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, LogIn, Info, Settings } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden bg-sky-200">
      
      {/* ── PIXEL ENVIRONMENT BACKGROUND ── */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-end">
        {/* Sky / Clouds */}
        <div className="absolute top-10 left-10 text-6xl opacity-80">☁️</div>
        <div className="absolute top-24 right-32 text-6xl opacity-60">☁️</div>
        
        {/* Castle in background */}
        <div className="absolute bottom-32 right-10 text-[150px] opacity-80 drop-shadow-[4px_4px_0_#000]">
          🏰
        </div>

        {/* Trees & Grass */}
        <div className="absolute bottom-20 left-10 text-[100px] drop-shadow-[4px_4px_0_#000]">
          🌲
        </div>
        <div className="absolute bottom-16 left-32 text-[80px] drop-shadow-[4px_4px_0_#000]">
          🌲
        </div>
        
        {/* Ground */}
        <div className="h-32 bg-green-500 border-t-8 border-green-600 w-full relative">
          <div className="absolute inset-0 opacity-20" 
               style={{ backgroundImage: 'radial-gradient(#000 20%, transparent 20%)', backgroundSize: '20px 20px' }}>
          </div>
        </div>
      </div>

      {/* ── FOREGROUND CHARACTER & SIGN ── */}
      <div className="absolute bottom-24 left-10 flex items-end gap-4 z-10">
        <div className="pixel-panel-wood p-4 text-center transform -rotate-3 text-xs w-32 shadow-2xl">
          A SAFER INTERNET, A BRIGHTER TOMORROW
        </div>
        <div className="text-8xl drop-shadow-[4px_4px_0_#000] z-20">
          👦
        </div>
        <div className="text-6xl drop-shadow-[4px_4px_0_#000] -ml-6 z-10">
          🐈
        </div>
      </div>

      {/* ── MAIN UI (CENTERED) ── */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen pt-10">
        
        {/* LOGO */}
        <div className="flex flex-col items-center mb-16">
          <div className="flex items-center justify-center bg-blue-500 border-4 border-blue-900 w-24 h-28 rounded-b-full mb-4 shadow-[4px_4px_0_#000]">
            <div className="text-white text-6xl">🛡️</div>
          </div>
          <h1 className="font-pixel text-[80px] leading-none text-white drop-shadow-[6px_6px_0_#1e3a8a] text-center">
            <span className="text-white">CYBER</span><br/>
            <span className="text-yellow-400">QUEST</span>
          </h1>
        </div>

        {/* BUTTONS */}
        <div className="flex flex-col gap-4 w-72">
          <button 
            onClick={() => navigate('/register')}
            className="pixel-btn pixel-btn-primary w-full text-lg py-4 flex items-center justify-center gap-3"
          >
            <Play className="w-6 h-6 fill-black" />
            START GAME
          </button>
          
          <button 
            onClick={() => navigate('/login')}
            className="pixel-panel-stone pixel-btn w-full text-sm py-4 flex items-center justify-center gap-3"
          >
            <LogIn className="w-5 h-5 text-white" />
            LOGIN
          </button>
          
          <button 
            className="pixel-panel-stone pixel-btn w-full text-sm py-4 flex items-center justify-center gap-3"
          >
            <Info className="w-5 h-5 text-white" />
            ABOUT
          </button>
          
          <button 
            className="pixel-panel-stone pixel-btn w-full text-sm py-4 flex items-center justify-center gap-3"
          >
            <Settings className="w-5 h-5 text-white" />
            SETTINGS
          </button>
        </div>

      </div>
    </div>
  );
}
