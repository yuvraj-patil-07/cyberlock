import React from 'react';
import GameHUD from './GameHUD';

const GameEngineLayout = ({ children }) => {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-900 font-sans">
      {/* 
        This is the main viewport for the game.
        All game world components (WorldMap, MiniGames) will be rendered here.
        They can use z-index 0 to 40.
      */}
      <div className="absolute inset-0 z-0">
        {children}
      </div>

      {/* 
        The Persistent HUD sits on top of the game world.
        It uses pointer-events-none to let clicks pass through to the game world,
        but enables pointer-events for its own buttons.
        It has z-index 50.
      */}
      <GameHUD />
    </div>
  );
};

export default GameEngineLayout;
