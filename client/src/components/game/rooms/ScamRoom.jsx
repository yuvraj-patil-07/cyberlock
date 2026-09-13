import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Heart, Smartphone } from 'lucide-react';
import useGameStore from '../../../store/gameStore';

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
  { id: 'npc1', name: 'Bob', avatar: '🧔‍♂️', position: { top: '30%', left: '20%' } },
  { id: 'npc2', name: 'Alice', avatar: '👱‍♀️', position: { top: '70%', left: '30%' } },
  { id: 'npc3', name: 'Charlie', avatar: '👦', position: { top: '40%', left: '70%' } },
  { id: 'npc4', name: 'Diana', avatar: '👩‍🦰', position: { top: '75%', left: '75%' } },
];

const ScamRoom = ({ onComplete }) => {
  const { addXP, addCoins, loseHeart } = useGameStore();

  const [activeMessages, setActiveMessages] = useState([]);
  const [villageHealth, setVillageHealth] = useState(100);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30); 
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (timeLeft <= 0 || villageHealth <= 0) return;

    const spawnInterval = setInterval(() => {
      const npc = NPCS[Math.floor(Math.random() * NPCS.length)];
      const msgData = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
      
      const newMessage = {
        uniqueId: Math.random().toString(36).substring(7),
        npcId: npc.id,
        ...msgData,
        createdAt: Date.now(),
        progress: 0 
      };

      setActiveMessages(prev => [...prev, newMessage]);
    }, 2000);

    return () => clearInterval(spawnInterval);
  }, [timeLeft, villageHealth]);

  useEffect(() => {
    if (timeLeft <= 0 || villageHealth <= 0) return;

    const progressInterval = setInterval(() => {
      setActiveMessages(prev => {
        const updated = prev.map(msg => ({
          ...msg,
          progress: msg.progress + (msg.isScam ? 2 : 1.5)
        }));

        updated.forEach(msg => {
          if (msg.progress >= 100) {
            handleNPCClick(msg);
          }
        });

        return updated.filter(msg => msg.progress < 100);
      });
    }, 100);

    return () => clearInterval(progressInterval);
  }, [timeLeft, villageHealth]);

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
      setVillageHealth(prev => Math.max(0, prev - 20));
      loseHeart();
      setFeedback({ type: 'error', text: 'SCAMMED! -20 HP' });
    } else {
      setScore(prev => prev + 10);
    }
    setTimeout(() => setFeedback(null), 1000);
  };

  const handlePlayerIntercept = (e, msg) => {
    e.stopPropagation();

    setActiveMessages(prev => prev.filter(m => m.uniqueId !== msg.uniqueId));

    if (msg.isScam) {
      const points = 20;
      setScore(prev => prev + points);
      addXP(points);
      addCoins(2);
      setFeedback({ type: 'success', text: `INTERCEPTED! +${points} XP` });
    } else {
      setVillageHealth(prev => Math.max(0, prev - 5));
      setFeedback({ type: 'error', text: 'FALSE ALARM! -5 HP' });
    }
    setTimeout(() => setFeedback(null), 800);
  };

  const handleGameOver = () => {
    if (villageHealth > 0) {
      addXP(score);
      addCoins(10);
      setTimeout(() => onComplete && onComplete(score), 2000);
    } else {
      setTimeout(() => onComplete && onComplete(0), 2000);
    }
  };

  if (timeLeft <= 0 || villageHealth <= 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-white bg-amber-900 border-4 border-amber-950 font-pixel">
        <h2 className={`text-4xl mb-4 drop-shadow-[4px_4px_0_#000] ${villageHealth > 0 ? 'text-green-400' : 'text-red-500'}`}>
          {villageHealth > 0 ? 'Village Saved!' : 'Village Corrupted!'}
        </h2>
        <p className="text-2xl drop-shadow-[4px_4px_0_#000]">Final Score: {score}</p>
        <button onClick={() => onComplete(score)} className="mt-8 pixel-btn pixel-btn-primary">Return to Map</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#f97316] relative overflow-hidden">
      
      {/* Background Village Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute bottom-20 left-10 text-[100px] drop-shadow-[4px_4px_0_#000]">🛖</div>
        <div className="absolute top-20 right-20 text-[80px] drop-shadow-[4px_4px_0_#000]">🛖</div>
        <div className="absolute bottom-10 right-32 text-[120px] drop-shadow-[4px_4px_0_#000]">🛖</div>
        
        {/* Dirt path */}
        <div className="absolute bottom-0 w-full h-1/3 bg-[#a16207] border-t-8 border-[#854d0e]" />
      </div>
      
      {/* Floating Feedback */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 0, scale: 0.5 }}
            animate={{ opacity: 1, y: -50, scale: 1.5 }}
            exit={{ opacity: 0 }}
            className={`absolute z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-pixel text-4xl tracking-wider ${
              feedback.type === 'success' ? 'text-green-400 drop-shadow-[4px_4px_0_#000]' : 'text-red-500 drop-shadow-[4px_4px_0_#000]'
            }`}
          >
            {feedback.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Bar */}
      <div className="pixel-panel-wood mx-4 mt-4 p-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 font-pixel text-xl">
            <Shield className="w-6 h-6 text-orange-400" />
            <span>{timeLeft}s</span>
          </div>
          <div className="flex items-center gap-2">
            <Heart className={`w-6 h-6 ${villageHealth > 50 ? 'text-green-500 fill-green-500' : 'text-red-500 fill-red-500 animate-pulse'}`} />
            <div className="pixel-bar-container w-32 h-6">
              <div 
                className={`h-full transition-all ${villageHealth > 50 ? 'bg-green-500 shadow-[inset_0px_4px_0px_0px_#86efac]' : 'bg-red-500 shadow-[inset_0px_4px_0px_0px_#fca5a5]'}`}
                style={{ width: `${villageHealth}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 font-pixel text-xl">
          <span className="text-gray-300">SCORE:</span>
          <span className="text-orange-400 drop-shadow-[2px_2px_0_#000]">{score}</span>
        </div>
      </div>

      {/* Game Area */}
      <div className="flex-1 relative cursor-crosshair overflow-hidden">
        
        {/* NPCs */}
        {NPCS.map(npc => (
          <div 
            key={npc.id}
            className="absolute flex flex-col items-center justify-center transform -translate-x-1/2 -translate-y-1/2"
            style={npc.position}
          >
            <div className="text-6xl drop-shadow-[4px_4px_0_#000]">{npc.avatar}</div>
            <div className="pixel-tag mt-2 bg-black text-white">{npc.name}</div>
          </div>
        ))}

        {/* Messages */}
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
                  top: `calc(${npc.position.top} - 80px)` 
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <div className="pixel-panel-parchment p-3 w-56 relative text-sm font-pixel flex flex-col gap-2 shadow-2xl">
                  {/* Tail */}
                  <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[10px] border-r-[10px] border-t-[10px] border-l-transparent border-r-transparent border-t-[#d97706]" />
                  
                  <div className="flex items-center gap-2 text-[#78350f]">
                    <Smartphone className="w-4 h-4" />
                    <span>{msg.type}</span>
                  </div>
                  <p className="text-black leading-tight">{msg.text}</p>
                  
                  <div className="pixel-bar-container h-4 mt-2 border-2 border-black">
                    <div 
                      className={`h-full ${msg.progress > 75 ? 'bg-red-500 shadow-[inset_0px_4px_0px_0px_#fca5a5]' : 'bg-blue-500 shadow-[inset_0px_4px_0px_0px_#93c5fd]'}`}
                      style={{ width: `${msg.progress}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {/* Instructions */}
        <motion.div 
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 3, duration: 1 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
        >
          <div className="pixel-panel-wood p-6 text-center shadow-[8px_8px_0_rgba(0,0,0,0.5)]">
            <h2 className="font-pixel text-2xl text-orange-400 mb-2 drop-shadow-[2px_2px_0_#000]">Protect the Village!</h2>
            <p className="font-pixel text-sm text-white">Click on SCAM messages to intercept them.</p>
            <p className="font-pixel text-sm text-white mt-1">Let SAFE messages pass.</p>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default ScamRoom;
