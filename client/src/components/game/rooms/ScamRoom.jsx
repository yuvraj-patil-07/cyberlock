import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Smartphone, Heart, AlertTriangle } from 'lucide-react';
import useGameStore from '../../../store/gameStore';

// Mock messages
const MESSAGES = [
  { id: 1, type: 'whatsapp', text: 'Hey! Are we still on for lunch?', isScam: false },
  { id: 2, type: 'sms', text: 'URGENT: Your package is delayed. Click here to reschedule: bit.ly/1234', isScam: true },
  { id: 3, type: 'instagram', text: 'You won a $1000 gift card! Claim now!', isScam: true },
  { id: 4, type: 'telegram', text: 'Crypto investment opportunity. 500% returns guaranteed!', isScam: true },
  { id: 5, type: 'sms', text: 'Mom, I lost my phone. This is my new number. Can you send $50?', isScam: true },
  { id: 6, type: 'whatsapp', text: 'Can you send me the presentation notes?', isScam: false },
  { id: 7, type: 'email', text: 'Meeting moved to 3 PM', isScam: false },
  { id: 8, type: 'sms', text: 'Your bank account has been locked. Verify here: secure-bank-login.com', isScam: true },
];

const NPCS = [
  { id: 'npc1', name: 'Bob', avatar: '🧔‍♂️', position: { top: '20%', left: '15%' } },
  { id: 'npc2', name: 'Alice', avatar: '👱‍♀️', position: { top: '60%', left: '25%' } },
  { id: 'npc3', name: 'Charlie', avatar: '👦', position: { top: '30%', left: '70%' } },
  { id: 'npc4', name: 'Diana', avatar: '👩‍🦰', position: { top: '70%', left: '80%' } },
];

const ScamRoom = ({ onComplete }) => {
  const { addXP, addCoins, loseHeart } = useGameStore();

  const [activeMessages, setActiveMessages] = useState([]);
  const [villageHealth, setVillageHealth] = useState(100);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30); // 30 second survival mode
  const [feedback, setFeedback] = useState(null);

  // Spawn messages randomly
  useEffect(() => {
    if (timeLeft <= 0 || villageHealth <= 0) return;

    const spawnInterval = setInterval(() => {
      // Random NPC
      const npc = NPCS[Math.floor(Math.random() * NPCS.length)];
      // Random Message
      const msgData = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
      
      const newMessage = {
        uniqueId: Math.random().toString(36).substring(7),
        npcId: npc.id,
        ...msgData,
        createdAt: Date.now(),
        progress: 0 // Will go from 0 to 100 before NPC clicks it
      };

      setActiveMessages(prev => [...prev, newMessage]);
    }, 2000); // New message every 2 seconds

    return () => clearInterval(spawnInterval);
  }, [timeLeft, villageHealth]);

  // Update progress for active messages (simulate NPC reading/clicking)
  useEffect(() => {
    if (timeLeft <= 0 || villageHealth <= 0) return;

    const progressInterval = setInterval(() => {
      setActiveMessages(prev => {
        const updated = prev.map(msg => ({
          ...msg,
          progress: msg.progress + (msg.isScam ? 2 : 1.5) // Scams fill faster
        }));

        // Check if any message reached 100%
        updated.forEach(msg => {
          if (msg.progress >= 100) {
            handleNPCClick(msg);
          }
        });

        // Filter out completed messages
        return updated.filter(msg => msg.progress < 100);
      });
    }, 100); // 10 times a second

    return () => clearInterval(progressInterval);
  }, [timeLeft, villageHealth]);

  // Game timer
  useEffect(() => {
    if (timeLeft > 0 && villageHealth > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft <= 0 || villageHealth <= 0) {
      handleGameOver();
    }
  }, [timeLeft, villageHealth]);

  const handleNPCClick = (msg) => {
    if (msg.isScam) {
      // NPC clicked a scam! Village takes damage
      setVillageHealth(prev => Math.max(0, prev - 20));
      loseHeart();
      setFeedback({ type: 'error', text: 'SCAMMED! -20 HP' });
    } else {
      // NPC clicked a safe message, good!
      setScore(prev => prev + 10);
    }
    setTimeout(() => setFeedback(null), 1000);
  };

  const handlePlayerIntercept = (e, msg) => {
    e.stopPropagation(); // Prevent clicking on the village

    // Remove the message
    setActiveMessages(prev => prev.filter(m => m.uniqueId !== msg.uniqueId));

    if (msg.isScam) {
      // Player correctly intercepted a scam
      const points = 20;
      setScore(prev => prev + points);
      addXP(points);
      addCoins(2);
      setFeedback({ type: 'success', text: `INTERCEPTED! +${points} XP` });
    } else {
      // Player blocked a safe message!
      setVillageHealth(prev => Math.max(0, prev - 5));
      setFeedback({ type: 'error', text: 'FALSE ALARM! -5 HP' });
    }
    setTimeout(() => setFeedback(null), 800);
  };

  const handleGameOver = () => {
    if (villageHealth > 0) {
      // Won
      addXP(score);
      addCoins(10);
      setTimeout(() => onComplete && onComplete(score), 2000);
    } else {
      // Lost
      setTimeout(() => onComplete && onComplete(0), 2000);
    }
  };

  if (timeLeft <= 0 || villageHealth <= 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-white bg-slate-900 rounded-3xl">
        <h2 className={`text-4xl font-bold mb-4 ${villageHealth > 0 ? 'text-green-400' : 'text-red-500'}`}>
          {villageHealth > 0 ? 'Village Saved!' : 'Village Corrupted!'}
        </h2>
        <p className="text-2xl">Final Score: {score}</p>
        <p className="text-gray-400 mt-2">Health Remaining: {villageHealth}%</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-3xl border-4 border-orange-500/50 shadow-2xl overflow-hidden relative">
      
      {/* Floating Feedback */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 0, scale: 0.5 }}
            animate={{ opacity: 1, y: -50, scale: 1.5 }}
            exit={{ opacity: 0 }}
            className={`absolute z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-black text-3xl tracking-wider ${
              feedback.type === 'success' ? 'text-green-400 drop-shadow-[0_0_15px_#4ade80]' : 'text-red-500 drop-shadow-[0_0_15px_#ef4444]'
            }`}
          >
            {feedback.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Bar */}
      <div className="flex justify-between items-center p-4 bg-orange-900/30 border-b border-orange-500/30 z-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-full border border-orange-500/50">
            <Shield className="w-5 h-5 text-orange-400" />
            <span className="text-white font-mono font-bold text-lg">{timeLeft}s</span>
          </div>
          <div className="flex items-center gap-2">
            <Heart className={`w-5 h-5 ${villageHealth > 50 ? 'text-green-500 fill-green-500' : 'text-red-500 fill-red-500 animate-pulse'}`} />
            <div className="w-32 h-3 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all ${villageHealth > 50 ? 'bg-green-500' : 'bg-red-500'}`}
                style={{ width: `${villageHealth}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-gray-400 text-xs uppercase tracking-wider font-bold">Score</span>
          <span className="text-orange-400 font-mono font-bold text-xl">{score}</span>
        </div>
      </div>

      {/* Game Area (The Village) */}
      <div className="flex-1 relative bg-gradient-to-b from-blue-900/40 to-green-900/40 cursor-crosshair overflow-hidden">
        
        {/* Simple Village Background Elements */}
        <div className="absolute bottom-0 w-full h-1/3 bg-green-900/50 rounded-t-[100%]" />
        
        {/* Render NPCs */}
        {NPCS.map(npc => (
          <div 
            key={npc.id}
            className="absolute flex flex-col items-center justify-center transform -translate-x-1/2 -translate-y-1/2"
            style={npc.position}
          >
            <div className="text-5xl drop-shadow-xl filter">{npc.avatar}</div>
            <div className="bg-black/60 px-2 py-0.5 rounded-full text-[10px] text-white mt-1 font-bold">{npc.name}</div>
          </div>
        ))}

        {/* Render Active Messages above NPCs */}
        <AnimatePresence>
          {activeMessages.map(msg => {
            const npc = NPCS.find(n => n.id === msg.npcId);
            if (!npc) return null;

            return (
              <motion.div
                key={msg.uniqueId}
                initial={{ opacity: 0, scale: 0, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0 }}
                onClick={(e) => handlePlayerIntercept(e, msg)}
                className="absolute transform -translate-x-1/2 -translate-y-full z-20 cursor-pointer"
                style={{ 
                  left: npc.position.left, 
                  top: `calc(${npc.position.top} - 60px)` 
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <div className="bg-white rounded-xl shadow-2xl p-3 border-2 border-slate-200 w-48 relative">
                  {/* Tail for speech bubble */}
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-b-2 border-r-2 border-slate-200 rotate-45" />
                  
                  <div className="flex items-center gap-2 mb-1">
                    <Smartphone className="w-4 h-4 text-blue-500" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase">{msg.type}</span>
                  </div>
                  <p className="text-xs text-slate-800 font-medium leading-tight">{msg.text}</p>
                  
                  {/* Progress bar indicating when the NPC will click */}
                  <div className="mt-2 h-1 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${msg.progress > 75 ? 'bg-red-500' : 'bg-blue-500'}`}
                      style={{ width: `${msg.progress}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {/* Instructions overlay briefly */}
        <motion.div 
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 3, duration: 1 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 bg-black/50"
        >
          <div className="bg-slate-900 border border-orange-500 text-white p-6 rounded-2xl text-center">
            <h2 className="text-2xl font-bold text-orange-400 mb-2">Protect the Village!</h2>
            <p className="text-sm text-gray-300">Click on SCAM messages to intercept them.</p>
            <p className="text-sm text-gray-300">Let SAFE messages pass.</p>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default ScamRoom;
