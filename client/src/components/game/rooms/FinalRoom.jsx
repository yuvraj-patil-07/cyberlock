import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ShieldAlert, Zap } from 'lucide-react';
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
      setFeedback({ type: 'error', text: `CRITICAL HIT! -${option.penalty} HP` });
      setPlayerHealth(prev => Math.max(0, prev - option.penalty));
      loseHeart();
      
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
      <div className="flex flex-col items-center justify-center h-full font-pixel text-white bg-slate-900 rounded-3xl border-4 border-red-900">
        <h2 className={`text-5xl mb-4 ${bossHealth <= 0 ? 'text-green-400 drop-shadow-[4px_4px_0_#000]' : 'text-red-500 drop-shadow-[4px_4px_0_#000]'}`}>
          {bossHealth <= 0 ? 'VICTORY!' : 'DEFEAT!'}
        </h2>
        <p className="text-xl text-gray-300 drop-shadow-[2px_2px_0_#000]">
          {bossHealth <= 0 ? 'The Malware King has been vanquished.' : 'The Kingdom has fallen.'}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#3f000f] relative overflow-hidden font-pixel">
      
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, scale: 0, y: 50 }}
            animate={{ opacity: 1, scale: 1.5, y: 0 }}
            exit={{ opacity: 0, scale: 2 }}
            transition={{ type: 'spring', bounce: 0.5 }}
            className={`absolute z-50 top-1/3 left-1/2 transform -translate-x-1/2 text-4xl text-center ${
              feedback.type === 'success' ? 'text-blue-400 drop-shadow-[4px_4px_0_#000]' : 'text-red-500 drop-shadow-[4px_4px_0_#000]'
            }`}
          >
            {feedback.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top HUD for Boss Battle */}
      <div className="flex justify-between items-center p-3 pixel-panel-stone m-4 z-10">
        
        {/* Player Health */}
        <div className="flex flex-col gap-2 w-1/3">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-400" />
            <span className="text-blue-400 text-sm">You (Lv {player.level})</span>
          </div>
          <div className="pixel-bar-container h-6">
            <motion.div 
              className="h-full bg-blue-500 shadow-[inset_0px_4px_0px_0px_#93c5fd]"
              animate={{ width: `${playerHealth}%` }}
              transition={{ type: 'tween' }}
            />
          </div>
        </div>

        <div className="text-center text-4xl text-red-600 drop-shadow-[4px_4px_0_#000] animate-pulse">
          VS
        </div>

        {/* Boss Health */}
        <div className="flex flex-col gap-2 w-1/3 items-end">
          <div className="flex items-center gap-2 flex-row-reverse">
            <ShieldAlert className="w-6 h-6 text-red-500" />
            <span className="text-red-500 text-sm">Malware King</span>
          </div>
          <div className="pixel-bar-container h-6 flex justify-end">
            <motion.div 
              className="h-full bg-red-600 shadow-[inset_0px_4px_0px_0px_#fca5a5]"
              animate={{ width: `${bossHealth}%` }}
              transition={{ type: 'tween' }}
            />
          </div>
        </div>
      </div>

      {/* Combat Arena */}
      <div className="flex-1 relative flex flex-col items-center justify-center p-4 z-10">
        
        {/* The Boss Avatar */}
        <motion.div 
          animate={isAttacking && feedback?.type === 'success' ? { x: [-20, 20, -20, 20, 0], filter: 'brightness(2)' } : { y: [-10, 10, -10] }}
          transition={isAttacking && feedback?.type === 'success' ? { duration: 0.5 } : { repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          className="relative mb-8"
        >
          <div className="w-48 h-48 bg-red-950 flex items-center justify-center border-4 border-red-600 relative z-10 shadow-[8px_8px_0_rgba(0,0,0,0.5)]">
            <span className="text-[120px] drop-shadow-[4px_4px_0_#000]">💀</span>
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
              className="text-center max-w-2xl pixel-panel-parchment p-3 mb-8 shadow-[8px_8px_0_rgba(0,0,0,0.5)]"
            >
              <h3 className="text-red-600 text-lg mb-4 flex items-center justify-center gap-2">
                <Zap className="w-5 h-5" /> Phase {currentPhase + 1}: {phase.name}
              </h3>
              <p className="text-[#451a03] text-xl leading-relaxed">
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
                className="w-full text-left p-4 pixel-panel-blue text-sm hover:brightness-110 active:scale-95 transition-all flex items-center gap-4"
              >
                <div className="w-10 h-10 border-4 border-black bg-blue-700 flex items-center justify-center text-xl pb-1">
                  ⚔️
                </div>
                <span className="text-white drop-shadow-[2px_2px_0_#000]">{option.text}</span>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default FinalRoom;
