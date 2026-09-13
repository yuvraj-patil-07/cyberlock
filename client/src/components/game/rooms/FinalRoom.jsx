import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ShieldAlert, Swords, Heart, Zap } from 'lucide-react';
import useGameStore from '../../../store/gameStore';

const BOSS_PHASES = [
  {
    id: 1,
    name: "Phishing Swarm",
    attackText: "The Malware King unleashes a barrage of deceptive links!",
    options: [
      { text: "Verify the sender domain", isCorrect: true, damage: 25 },
      { text: "Click the link quickly to see what it is", isCorrect: false, penalty: 10 },
      { text: "Forward the email to everyone", isCorrect: false, penalty: 10 }
    ]
  },
  {
    id: 2,
    name: "Brute Force Barrage",
    attackText: "The Boss attempts to crack the kingdom's gates with millions of passwords!",
    options: [
      { text: "Deploy 'Password123' as defense", isCorrect: false, penalty: 15 },
      { text: "Enable Multi-Factor Authentication (MFA)", isCorrect: true, damage: 35 },
      { text: "Use the same password everywhere", isCorrect: false, penalty: 15 }
    ]
  },
  {
    id: 3,
    name: "Social Engineering Illusion",
    attackText: "The Boss disguises as the King and demands immediate access to the treasury!",
    options: [
      { text: "Obey the King immediately", isCorrect: false, penalty: 20 },
      { text: "Verify the request through a secondary channel", isCorrect: true, damage: 40 },
      { text: "Transfer the funds just in case", isCorrect: false, penalty: 20 }
    ]
  }
];

const FinalRoom = ({ onComplete }) => {
  const { addXP, addCoins, player, loseHeart } = useGameStore();

  const [bossHealth, setBossHealth] = useState(100);
  const [playerHealth, setPlayerHealth] = useState(100);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [isAttacking, setIsAttacking] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  const phase = BOSS_PHASES[currentPhase];

  const handleChoice = (option) => {
    if (isAttacking || isGameOver) return;
    setIsAttacking(true);

    if (option.isCorrect) {
      // Player attacks Boss
      setFeedback({ type: 'success', text: `COUNTER-ATTACK! -${option.damage} HP` });
      setBossHealth(prev => Math.max(0, prev - option.damage));
      
      setTimeout(() => {
        if (bossHealth - option.damage <= 0) {
          endGame(true);
        } else {
          nextPhase();
        }
      }, 2000);
    } else {
      // Boss attacks Player
      setFeedback({ type: 'error', text: `CRITICAL HIT! -${option.penalty} HP` });
      setPlayerHealth(prev => Math.max(0, prev - option.penalty));
      loseHeart();
      
      // Boss heals slightly on wrong answers
      setBossHealth(prev => Math.min(100, prev + 10));

      setTimeout(() => {
        if (playerHealth - option.penalty <= 0) {
          endGame(false);
        } else {
          nextPhase();
        }
      }, 2000);
    }
  };

  const nextPhase = () => {
    setFeedback(null);
    setIsAttacking(false);
    setCurrentPhase(prev => (prev + 1) % BOSS_PHASES.length);
  };

  const endGame = (won) => {
    setIsGameOver(true);
    setFeedback(null);
    if (won) {
      addXP(500);
      addCoins(100);
      setTimeout(() => onComplete && onComplete(500), 3000);
    } else {
      setTimeout(() => onComplete && onComplete(0), 3000);
    }
  };

  if (isGameOver) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-white bg-slate-900 rounded-3xl border-4 border-slate-700">
        <h2 className={`text-5xl font-black mb-4 ${bossHealth <= 0 ? 'text-green-400 drop-shadow-[0_0_20px_rgba(74,222,128,0.5)]' : 'text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.5)]'}`}>
          {bossHealth <= 0 ? 'VICTORY!' : 'DEFEAT!'}
        </h2>
        <p className="text-xl text-gray-300">
          {bossHealth <= 0 ? 'The Malware King has been vanquished.' : 'The Kingdom has fallen.'}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-3xl border-4 border-red-900/50 shadow-2xl overflow-hidden relative">
      
      {/* Floating Combat Feedback */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, scale: 0, y: 50 }}
            animate={{ opacity: 1, scale: 1.5, y: 0 }}
            exit={{ opacity: 0, scale: 2 }}
            transition={{ type: 'spring', bounce: 0.5 }}
            className={`absolute z-50 top-1/3 left-1/2 transform -translate-x-1/2 font-black text-4xl tracking-wider uppercase text-center ${
              feedback.type === 'success' ? 'text-blue-400 drop-shadow-[0_0_20px_#60a5fa]' : 'text-red-500 drop-shadow-[0_0_20px_#ef4444]'
            }`}
          >
            {feedback.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top HUD for Boss Battle */}
      <div className="flex justify-between items-start p-6 bg-red-950/40 border-b border-red-900/50">
        
        {/* Player Health */}
        <div className="flex flex-col gap-2 w-1/3">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-400" />
            <span className="text-blue-400 font-bold uppercase tracking-widest">You (Lv {player.level})</span>
          </div>
          <div className="w-full h-4 bg-slate-900 rounded-full border border-slate-700 overflow-hidden">
            <motion.div 
              className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"
              animate={{ width: `${playerHealth}%` }}
              transition={{ type: 'tween' }}
            />
          </div>
        </div>

        <div className="text-center font-black text-3xl text-red-600 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)] animate-pulse">
          VS
        </div>

        {/* Boss Health */}
        <div className="flex flex-col gap-2 w-1/3 items-end">
          <div className="flex items-center gap-2 flex-row-reverse">
            <ShieldAlert className="w-6 h-6 text-red-500" />
            <span className="text-red-500 font-bold uppercase tracking-widest">Malware King</span>
          </div>
          <div className="w-full h-6 bg-slate-900 rounded-full border border-red-900 overflow-hidden flex justify-end">
            <motion.div 
              className="h-full bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.8)]"
              animate={{ width: `${bossHealth}%` }}
              transition={{ type: 'tween' }}
            />
          </div>
        </div>

      </div>

      {/* Combat Arena */}
      <div className="flex-1 relative bg-gradient-to-b from-red-950/20 to-slate-900 flex flex-col items-center justify-center p-8">
        
        {/* The Boss Avatar */}
        <motion.div 
          animate={isAttacking && feedback?.type === 'success' ? { x: [-20, 20, -20, 20, 0], filter: 'brightness(2) drop-shadow(0 0 30px red)' } : { y: [-10, 10, -10] }}
          transition={isAttacking && feedback?.type === 'success' ? { duration: 0.5 } : { repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          className="relative mb-8"
        >
          <div className="w-48 h-48 bg-red-950 rounded-full flex items-center justify-center border-4 border-red-600 shadow-[0_0_50px_rgba(220,38,38,0.4)] relative z-10">
            <span className="text-8xl filter drop-shadow-2xl">💀</span>
          </div>
          <div className="absolute inset-0 bg-red-600 blur-3xl opacity-20 animate-pulse z-0" />
        </motion.div>

        {/* Boss Attack Announcement */}
        <AnimatePresence mode="wait">
          {!isAttacking && (
            <motion.div 
              key={phase.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center max-w-2xl bg-black/60 backdrop-blur-sm border border-red-500/30 p-6 rounded-2xl mb-8"
            >
              <h3 className="text-red-400 font-bold uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
                <Zap className="w-5 h-5" /> Phase {currentPhase + 1}: {phase.name}
              </h3>
              <p className="text-white text-xl font-medium leading-relaxed">
                "{phase.attackText}"
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Player Counter Options */}
        <div className="grid grid-cols-1 gap-4 w-full max-w-3xl">
          <AnimatePresence>
            {!isAttacking && phase.options.map((option, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleChoice(option)}
                className="w-full text-left p-4 bg-slate-800 border-2 border-slate-700 hover:border-blue-500 hover:bg-slate-700 rounded-xl transition-all group flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-600 flex items-center justify-center group-hover:border-blue-400 transition-colors">
                  <Swords className="w-5 h-5 text-gray-400 group-hover:text-blue-400" />
                </div>
                <span className="text-white font-medium text-lg">{option.text}</span>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default FinalRoom;
