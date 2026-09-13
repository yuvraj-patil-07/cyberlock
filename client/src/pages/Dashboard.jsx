import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useGameStore from '../store/gameStore';
import { useAuth } from '../hooks/useAuth';

// Floating Island Component
const FloatingIsland = ({ id, name, x, y, status, onClick, emoji, color }) => {
  const isLocked = status === 'locked';
  const isCompleted = status === 'completed';
  const isActive = status === 'active';

  return (
    <motion.div 
      className="absolute flex flex-col items-center justify-center cursor-pointer group"
      style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
      initial={{ y: 0 }}
      animate={{ y: [-10, 10, -10] }}
      transition={{ 
        repeat: Infinity, 
        duration: 4 + Math.random() * 2, 
        ease: "easeInOut" 
      }}
      onClick={() => !isLocked && onClick(id)}
    >
      {/* Island base shadow */}
      <div 
        className="absolute -bottom-8 w-32 h-10 rounded-[100%] blur-md bg-black/50 transition-opacity duration-500" 
        style={{ opacity: isLocked ? 0.3 : 0.6 }}
      />
      
      {/* Island visual */}
      <motion.div 
        whileHover={!isLocked ? { scale: 1.1 } : {}}
        whileTap={!isLocked ? { scale: 0.95 } : {}}
        className={`relative w-40 h-40 rounded-full border-4 flex flex-col items-center justify-center shadow-2xl transition-all duration-300 ${
          isLocked ? 'bg-gray-800 border-gray-600 grayscale opacity-80' : 
          isActive ? `bg-gray-900 border-[${color}] shadow-[0_0_30px_${color}50]` : 
          `bg-gray-800 border-green-500`
        }`}
        style={{
          borderColor: isLocked ? '#4b5563' : isActive ? color : '#22c55e',
          boxShadow: isActive ? `0 0 40px ${color}80, inset 0 0 20px ${color}40` : 
                     isCompleted ? '0 0 20px #22c55e80' : 'none'
        }}
      >
        {/* Terrain/Surface (simple representation) */}
        <div className="absolute inset-2 rounded-full overflow-hidden opacity-50">
           <div className="w-full h-1/2 bg-green-900/30 rounded-b-[100%]" />
        </div>

        <span className="text-5xl z-10 filter drop-shadow-lg mb-2">
          {isLocked ? '🔒' : emoji}
        </span>
        
        {isActive && (
          <motion.div 
            className="absolute -top-2 right-4 text-2xl"
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            ⚔️
          </motion.div>
        )}
      </motion.div>

      {/* Name Tag */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`mt-4 px-4 py-1 rounded-full text-sm font-bold tracking-widest uppercase border ${
          isLocked ? 'bg-gray-800/80 border-gray-600 text-gray-400' :
          `bg-black/80 border-[${color}] text-white`
        } backdrop-blur-sm`}
        style={{ borderColor: isLocked ? '#4b5563' : color }}
      >
        {name}
      </motion.div>
    </motion.div>
  );
};

// Bridge Component
const Bridge = ({ start, end, isRepaired }) => {
  // Simple straight line bridge for now
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * 180 / Math.PI;

  return (
    <div 
      className="absolute top-0 left-0 origin-top-left flex items-center"
      style={{
        left: `${start.x}%`,
        top: `${start.y}%`,
        width: `${length}%`,
        height: '2px',
        transform: `rotate(${angle}deg)`,
        zIndex: -1
      }}
    >
      {/* Broken state */}
      {!isRepaired && (
        <div className="w-full flex justify-around">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-4 h-2 bg-yellow-900/40 rounded-sm transform rotate-45" />
          ))}
        </div>
      )}

      {/* Repaired state (Animated line) */}
      {isRepaired && (
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="h-full bg-gradient-to-r from-yellow-700 via-yellow-500 to-yellow-700 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.5)]"
        />
      )}
    </div>
  );
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { world, addXP, unlockIsland } = useGameStore();

  const completedCount = user?.completedRooms?.length || 0;

  // Define the islands and their positions in the 2D space
  const islands = [
    { id: 1, name: 'Phishing Forest',  emoji: '🎣', x: 20, y: 30, color: '#ef4444' },
    { id: 2, name: 'Password Fortress', emoji: '🏰', x: 50, y: 20, color: '#eab308' },
    { id: 3, name: 'QR Temple',        emoji: '⛩️', x: 80, y: 40, color: '#a855f7' },
    { id: 4, name: 'Scam Village',     emoji: '🛖', x: 70, y: 75, color: '#f97316' },
    { id: 5, name: 'Final Cyber Castle',emoji: '💀', x: 30, y: 80, color: '#3b82f6' },
  ];

  // Determine status based on completed rooms (for now mock it based on id)
  const getIslandStatus = (id) => {
    if (id <= completedCount) return 'completed';
    if (id === completedCount + 1) return 'active';
    return 'locked';
  };

  const handleIslandClick = (id) => {
    // Transition effect before navigating
    navigate(`/play/${id}`);
  };

  return (
    <div className="w-full h-full relative overflow-hidden bg-gradient-to-br from-[#0a0d1a] to-[#1a233a]">
      {/* Background Environment Elements */}
      <div className="absolute inset-0 z-[-2]">
        {/* Grid/Stars/Clouds */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 animate-pulse" />
        
        {/* Floating background clouds */}
        {[...Array(5)].map((_, i) => (
          <motion.div 
            key={`cloud-${i}`}
            className="absolute rounded-full bg-blue-900/20 blur-3xl"
            style={{
              width: Math.random() * 400 + 200,
              height: Math.random() * 200 + 100,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, 100, 0],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 20 + i * 5, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </div>

      {/* Render Bridges connecting sequential islands */}
      {islands.map((island, index) => {
        if (index === islands.length - 1) return null;
        const nextIsland = islands[index + 1];
        const isRepaired = getIslandStatus(nextIsland.id) !== 'locked';
        
        return (
          <Bridge 
            key={`bridge-${island.id}-${nextIsland.id}`}
            start={{ x: island.x, y: island.y }}
            end={{ x: nextIsland.x, y: nextIsland.y }}
            isRepaired={isRepaired}
          />
        );
      })}

      {/* Render Islands */}
      {islands.map((island) => (
        <FloatingIsland 
          key={island.id}
          {...island}
          status={getIslandStatus(island.id)}
          onClick={handleIslandClick}
        />
      ))}
      
    </div>
  );
}
