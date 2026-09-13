import React from 'react';
import GameHUD from './GameHUD';

const GameEngineLayout = ({ children }) => {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#1e1e2e] font-pixel text-white">
      {/* 
        This is the main viewport for the game.
        We offset it by the sidebar width (16rem = 256px) and some padding to sit next to the sidebar
        and below the top HUD. 
      */}
      <div className="absolute inset-0 z-0 pl-[272px] pr-4 pt-[112px] pb-4">
        {/* Render the inner game room/map here */}
        <div className="w-full h-full relative rounded border-4 border-transparent">
           {children}
        </div>
      </div>

      {/* 
        The Persistent HUD sits on top.
        It uses pointer-events-none to let clicks pass through to the game world,
        but enables pointer-events for its own buttons.
      */}
      <GameHUD />
    </div>
  );
};

export default GameEngineLayout;
