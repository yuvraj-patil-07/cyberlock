import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ShieldAlert, Zap } from 'lucide-react';
import useGameStore from '../../../store/gameStore';

const BOSS_PHASES = [
  {
    id: 1,
    name: "Public Wi-Fi Risk",
    attackText: "You connect to an unsecured public Wi-Fi network at a coffee shop.",
    options: [
      { text: "Use a VPN before accessing sensitive data", isCorrect: true, damage: 20 },
      { text: "Log into your bank account immediately", isCorrect: false, penalty: 15 },
      { text: "Ignore security warnings from your browser", isCorrect: false, penalty: 15 }
    ]
  },
  {
    id: 2,
    name: "Suspicious Attachment",
    attackText: "An unknown sender emails you an urgent invoice as a .exe file.",
    options: [
      { text: "Open the file to check if it belongs to you", isCorrect: false, penalty: 15 },
      { text: "Delete the email and report it as phishing", isCorrect: true, damage: 20 },
      { text: "Reply asking what the file is", isCorrect: false, penalty: 15 }
    ]
  },
  {
    id: 3,
    name: "MFA Bombing",
    attackText: "You receive an unexpected MFA login push notification on your phone.",
    options: [
      { text: "Approve it, assuming it's a delayed request", isCorrect: false, penalty: 15 },
      { text: "Swipe it away and do nothing", isCorrect: false, penalty: 15 },
      { text: "Deny the request and change your password", isCorrect: true, damage: 20 }
    ]
  },
  {
    id: 4,
    name: "Ransomware Attack",
    attackText: "A pop-up claims your files are encrypted and demands a cryptocurrency payment.",
    options: [
      { text: "Pay the ransom immediately to get files back", isCorrect: false, penalty: 15 },
      { text: "Disconnect from the network and report to IT", isCorrect: true, damage: 20 },
      { text: "Restart your computer hoping it goes away", isCorrect: false, penalty: 15 }
    ]
  },
  {
    id: 5,
    name: "Physical Security",
    attackText: "You find a USB drive labeled 'Confidential Salaries' in the parking lot.",
    options: [
      { text: "Plug it into your computer to find the owner", isCorrect: false, penalty: 15 },
      { text: "Hand it over to the IT security team", isCorrect: true, damage: 20 },
      { text: "Plug it into a public computer to check it", isCorrect: false, penalty: 15 }
    ]
  },
  {
    id: 6,
    name: "Smishing Attempt",
    attackText: "You receive a text message claiming your package delivery failed and asking for a fee.",
    options: [
      { text: "Click the link to reschedule the delivery", isCorrect: false, penalty: 15 },
      { text: "Ignore and block the unknown number", isCorrect: true, damage: 20 },
      { text: "Reply asking for proof of the package", isCorrect: false, penalty: 15 }
    ]
  },
  {
    id: 7,
    name: "Password Reuse",
    attackText: "A service you use was breached, but you use the same password everywhere.",
    options: [
      { text: "Wait to see if your accounts get hacked first", isCorrect: false, penalty: 15 },
      { text: "Change the password on the breached site only", isCorrect: false, penalty: 15 },
      { text: "Update all your accounts with unique passwords", isCorrect: true, damage: 20 }
    ]
  },
  {
    id: 8,
    name: "Tech Support Scam",
    attackText: "A pop-up claims your PC has a virus and provides a toll-free number to call.",
    options: [
      { text: "Call the number to get the issue fixed", isCorrect: false, penalty: 15 },
      { text: "Download the recommended antivirus from the pop-up", isCorrect: false, penalty: 15 },
      { text: "Close the browser completely and run a legit scan", isCorrect: true, damage: 20 }
    ]
  },
  {
    id: 9,
    name: "Unsecured IoT Device",
    attackText: "You bought a new smart camera for your home but left the default admin password.",
    options: [
      { text: "Change the default password to a strong, unique one", isCorrect: true, damage: 20 },
      { text: "Assume it's safe since it's inside your house", isCorrect: false, penalty: 15 },
      { text: "Disable the Wi-Fi on your phone instead", isCorrect: false, penalty: 15 }
    ]
  },
  {
    id: 10,
    name: "Spear Phishing",
    attackText: "You get an email from the 'CEO' urgently asking you to buy gift cards.",
    options: [
      { text: "Buy the gift cards to impress the boss", isCorrect: false, penalty: 15 },
      { text: "Verify the request by calling the CEO directly", isCorrect: true, damage: 20 },
      { text: "Forward the email to your friends", isCorrect: false, penalty: 15 }
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
        <h2 className={`text-2xl mb-4 ${bossHealth <= 0 ? 'text-green-400 drop-shadow-[4px_4px_0_#000]' : 'text-red-500 drop-shadow-[4px_4px_0_#000]'}`}>
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
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.2 }}
              transition={{ type: 'spring', bounce: 0.5 }}
              className={`absolute z-50 top-1/2 inset-x-0 transform -translate-y-1/2 text-3xl px-4 pointer-events-none text-center flex justify-center ${
                feedback.type === 'success' ? 'text-blue-400 drop-shadow-[4px_4px_0_#000]' : 'text-red-500 drop-shadow-[4px_4px_0_#000]'
              }`}
            >
              {feedback.text}
            </motion.div>
        )}
      </AnimatePresence>

      {/* Top HUD for Boss Battle */}
      <div className="flex justify-between items-center p-2 pixel-panel-stone m-2 z-10">
        
        {/* Player Health */}
        <div className="flex flex-col gap-1 w-1/3">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-400" />
            <span className="text-blue-400 text-xs">You (Lv {player.level})</span>
          </div>
          <div className="pixel-bar-container h-4 w-full">
            <motion.div 
              className="h-full bg-blue-500 shadow-[inset_0px_2px_0px_0px_#93c5fd]"
              animate={{ width: `${playerHealth}%` }}
              transition={{ type: 'tween' }}
            />
          </div>
        </div>

        <div className="text-center text-lg text-red-600 drop-shadow-[2px_2px_0_#000] animate-pulse">
          VS
        </div>

        {/* Boss Health */}
        <div className="flex flex-col gap-1 w-1/3 items-end">
          <div className="flex items-center gap-2 flex-row-reverse">
            <ShieldAlert className="w-5 h-5 text-red-500" />
            <span className="text-red-500 text-xs">Malware King</span>
          </div>
          <div className="pixel-bar-container h-4 w-full flex justify-end">
            <motion.div 
              className="h-full bg-red-600 shadow-[inset_0px_2px_0px_0px_#fca5a5]"
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
          animate={isAttacking && feedback?.type === 'success' ? { x: [-10, 10, -10, 10, 0], filter: 'brightness(2)' } : { y: [-5, 5, -5] }}
          transition={isAttacking && feedback?.type === 'success' ? { duration: 0.5 } : { repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          className="relative mb-1 mt-1"
        >
          <div className="w-16 h-16 bg-red-950 flex items-center justify-center border-4 border-red-600 relative z-10 shadow-[4px_4px_0_rgba(0,0,0,0.5)]">
            <span className="text-[40px] drop-shadow-[2px_2px_0_#000]">💀</span>
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
              exit={{ opacity: 0, y: -10 }}
              className="text-center max-w-2xl pixel-panel-parchment p-1 px-2 mb-1 shadow-[4px_4px_0_rgba(0,0,0,0.5)]"
            >
              <h3 className="text-red-600 text-sm mb-1 flex items-center justify-center gap-1">
                <Zap className="w-4 h-4" /> Phase {currentPhase + 1}: {phase.name}
              </h3>
              <p className="text-[#451a03] text-sm leading-snug">
                "{phase.attackText}"
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Player Counter Options */}
        <div className="grid grid-cols-1 gap-1 w-full max-w-3xl mt-1">
          <AnimatePresence>
            {!isAttacking && phase.options.map((option, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleChoice(option)}
                className="w-full text-left p-1 px-2 pixel-panel-blue text-[10px] hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
              >
                <div className="w-6 h-6 border-2 border-black bg-blue-700 flex items-center justify-center text-sm pb-1">
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
