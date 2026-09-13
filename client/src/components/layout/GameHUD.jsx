import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Coins, Gem, Target, Map as MapIcon, Settings, Backpack } from 'lucide-react';
import useGameStore from '../../store/gameStore';

const GameHUD = () => {
  const { player, currentMission } = useGameStore();

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between z-50">
      
      {/* Top HUD */}
      <div className="p-4 flex justify-between items-start">
        {/* Left Stats */}
        <div className="flex flex-col gap-2">
          {/* Level & XP */}
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-black/60 backdrop-blur-md rounded-full px-4 py-2 border border-blue-500/30 flex items-center gap-3 shadow-lg pointer-events-auto"
          >
            <div className="bg-blue-600 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center border-2 border-blue-400">
              {player.level}
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-blue-200 uppercase tracking-wider font-bold">Level</span>
              <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden mt-1">
                <div 
                  className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500"
                  style={{ width: `${(player.xp % 100)}%` }}
                />
              </div>
            </div>
          </motion.div>

          {/* Hearts */}
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex gap-1"
          >
            {Array.from({ length: player.maxHearts }).map((_, i) => (
              <Heart 
                key={i}
                className={`w-6 h-6 ${i < player.hearts ? 'fill-red-500 text-red-500' : 'fill-gray-800 text-gray-700'}`}
              />
            ))}
          </motion.div>
        </div>

        {/* Right Currency */}
        <div className="flex flex-col gap-2 items-end">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-black/60 backdrop-blur-md rounded-full px-4 py-2 border border-yellow-500/30 flex items-center gap-2 pointer-events-auto"
          >
            <Coins className="text-yellow-400 w-5 h-5 fill-yellow-400/50" />
            <span className="text-white font-bold font-mono">{player.coins}</span>
          </motion.div>
          
          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-black/60 backdrop-blur-md rounded-full px-4 py-2 border border-purple-500/30 flex items-center gap-2 pointer-events-auto"
          >
            <Gem className="text-purple-400 w-5 h-5 fill-purple-400/50" />
            <span className="text-white font-bold font-mono">{player.gems}</span>
          </motion.div>
        </div>
      </div>

      {/* Current Quest (Right Middle) */}
      <div className="absolute right-4 top-1/3 max-w-xs">
        <motion.div 
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-black/70 backdrop-blur-md rounded-xl p-4 border border-green-500/30 pointer-events-auto"
        >
          <div className="flex items-center gap-2 mb-2">
            <Target className="text-green-400 w-5 h-5" />
            <span className="text-green-400 font-bold uppercase text-sm tracking-wider">Active Quest</span>
          </div>
          <h3 className="text-white font-bold mb-1">{currentMission.title}</h3>
          <p className="text-gray-400 text-xs">{currentMission.description}</p>
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <div className="p-4 flex justify-center w-full">
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-black/80 backdrop-blur-lg rounded-2xl p-2 border border-gray-700 flex gap-2 pointer-events-auto shadow-2xl"
        >
          <button className="flex flex-col items-center gap-1 p-3 rounded-xl hover:bg-white/10 transition-colors group">
            <MapIcon className="w-6 h-6 text-gray-400 group-hover:text-blue-400 transition-colors" />
            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Map</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-3 rounded-xl hover:bg-white/10 transition-colors group">
            <Backpack className="w-6 h-6 text-gray-400 group-hover:text-yellow-400 transition-colors" />
            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Loot</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-3 rounded-xl hover:bg-white/10 transition-colors group">
            <Settings className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Menu</span>
          </button>
        </motion.div>
      </div>

    </div>
  );
};

export default GameHUD;
