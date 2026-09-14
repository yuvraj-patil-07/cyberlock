import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center"
         style={{ background: '#1a1a2e' }}>

      {/* Full-screen background image */}
      <div className="absolute inset-0">
        <img src="/assets/landing-bg.jpg" alt=""
             className="w-full h-full object-cover"
             style={{ imageRendering: 'pixelated', opacity: 0.85 }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(26,26,46,0.3) 0%, rgba(26,26,46,0.8) 100%)' }} />
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 flex flex-col items-center gap-3 px-6 max-w-sm w-full"
      >
        {/* Logo / Shield */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', bounce: 0.4 }}
          className="text-center"
        >
          <div className="text-6xl mb-2 cq-float">🛡️</div>
          <h1 className="font-pixel text-2xl text-white leading-relaxed"
              style={{ textShadow: '3px 3px 0 #000, -1px -1px 0 #000' }}>
            CYBER<br />QUEST
          </h1>
          <p className="text-sm mt-3 text-gray-300 italic"
             style={{ fontFamily: "'VT323', monospace", fontSize: '22px' }}>
            A safer internet, a brighter tomorrow
          </p>
        </motion.div>

        {/* Menu Buttons */}
        <div className="flex flex-col gap-3 w-full max-w-[220px]">
          <button onClick={() => navigate('/register')}
                  className="cq-btn cq-btn-primary w-full justify-center">
            ⚔ Start Game
          </button>
          <button onClick={() => navigate('/login')}
                  className="cq-btn cq-btn-secondary w-full justify-center">
            🔑 Login
          </button>
          <button className="cq-btn cq-btn-secondary w-full justify-center opacity-70 cursor-not-allowed">
            📖 About
          </button>
          <button className="cq-btn cq-btn-secondary w-full justify-center opacity-70 cursor-not-allowed">
            ⚙ Settings
          </button>
        </div>
      </motion.div>
    </div>
  );
}
