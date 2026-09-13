import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useGameStore from '../store/gameStore';
import { useAuth } from '../hooks/useAuth';

const MapNode = ({ id, x, y, name, status, onClick, isBoss, active }) => {
  const isLocked = status === 'locked';
  const isCompleted = status === 'completed';
  
  return (
    <div 
      className="absolute flex flex-col items-center justify-center transform -translate-x-1/2 -translate-y-1/2 z-10"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      {/* Name tag */}
      <div className={`mb-2 font-pixel text-[10px] px-2 py-1 ${isLocked ? 'text-gray-500 bg-gray-800' : 'text-white bg-black'} border-2 ${isLocked ? 'border-gray-600' : 'border-white'}`}>
        {name}
      </div>

      {/* Node button */}
      <button 
        onClick={() => !isLocked && onClick(id)}
        className={`w-16 h-16 border-4 relative transition-transform ${!isLocked && 'hover:scale-110 cursor-pointer active:scale-95'} ${
          isLocked ? 'bg-gray-700 border-gray-900 grayscale' :
          isBoss ? 'bg-red-600 border-red-900' :
          'bg-blue-500 border-blue-900'
        } ${isCompleted && !isBoss ? 'bg-green-500 border-green-900' : ''}`}
        style={{
          boxShadow: !isLocked ? 'inset 4px 4px 0px 0px rgba(255,255,255,0.3), 4px 4px 0px 0px rgba(0,0,0,0.5)' : 'none'
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center text-3xl drop-shadow-[2px_2px_0_#000]">
          {isLocked ? '🔒' : isBoss ? '💀' : isCompleted ? '✅' : '⚔️'}
        </div>
      </button>

      {/* Player marker if active */}
      {active && (
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="absolute -top-12 text-4xl drop-shadow-[2px_2px_0_#000] z-20"
        >
          👦
        </motion.div>
      )}
    </div>
  );
};

const DottedPath = ({ start, end, isUnlocked }) => {
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
        height: '4px',
        transform: `rotate(${angle}deg)`,
        zIndex: 0
      }}
    >
      <div 
        className="w-full h-full"
        style={{
          backgroundImage: `repeating-linear-gradient(90deg, ${isUnlocked ? '#facc15' : '#4b5563'} 0, ${isUnlocked ? '#facc15' : '#4b5563'} 8px, transparent 8px, transparent 16px)`
        }}
      />
    </div>
  );
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Use user.completedRooms length or default to 0. 
  const completedCount = user?.completedRooms?.length || 0;

  const nodes = [
    { id: 1, name: 'Phishing',   x: 20, y: 80, isBoss: false },
    { id: 2, name: 'Passwords',  x: 40, y: 50, isBoss: false },
    { id: 3, name: 'Scam',       x: 70, y: 70, isBoss: false },
    { id: 4, name: 'QR Code',    x: 80, y: 30, isBoss: false },
    { id: 5, name: 'Boss',       x: 50, y: 15, isBoss: true  },
  ];

  const getStatus = (id) => {
    if (id <= completedCount) return 'completed';
    if (id === completedCount + 1) return 'active';
    return 'locked';
  };

  const handleNodeClick = (id) => {
    navigate(`/play/${id}`);
  };

  return (
    <div className="w-full h-full relative pixel-panel-wood overflow-hidden">
      
      {/* Background Terrain */}
      <div className="absolute inset-0 bg-[#22c55e] opacity-80"
           style={{
             backgroundImage: 'linear-gradient(#16a34a 2px, transparent 2px), linear-gradient(90deg, #16a34a 2px, transparent 2px)',
             backgroundSize: '32px 32px'
           }}
      />

      {/* Decorative environment elements */}
      <div className="absolute top-10 left-10 text-6xl drop-shadow-[4px_4px_0_#000]">🌲</div>
      <div className="absolute top-32 left-20 text-6xl drop-shadow-[4px_4px_0_#000]">🌲</div>
      <div className="absolute bottom-20 right-20 text-6xl drop-shadow-[4px_4px_0_#000]">🌲</div>
      <div className="absolute top-40 right-10 text-6xl drop-shadow-[4px_4px_0_#000]">🗻</div>
      <div className="absolute top-10 right-40 text-6xl drop-shadow-[4px_4px_0_#000]">☁️</div>

      {/* Paths */}
      {nodes.map((node, i) => {
        if (i === nodes.length - 1) return null;
        const nextNode = nodes[i + 1];
        const isUnlocked = getStatus(nextNode.id) !== 'locked';
        return (
          <DottedPath 
            key={`path-${node.id}`} 
            start={node} 
            end={nextNode} 
            isUnlocked={isUnlocked} 
          />
        );
      })}

      {/* Nodes */}
      {nodes.map((node) => {
        const status = getStatus(node.id);
        return (
          <MapNode 
            key={node.id} 
            {...node} 
            status={status} 
            active={status === 'active' || (status === 'completed' && completedCount === nodes.length && node.id === nodes.length)}
            onClick={handleNodeClick} 
          />
        );
      })}

    </div>
  );
}
