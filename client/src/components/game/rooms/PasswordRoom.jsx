import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, Sparkles, Clock, Trash2, Shield } from 'lucide-react';
import useGameStore from '../../../store/gameStore';

const PIECES = [
  { id: 'p1', type: 'word', value: 'dragon', color: 'pixel-panel-blue' },
  { id: 'p2', type: 'word', value: 'apple', color: 'pixel-panel-blue' },
  { id: 'p3', type: 'word', value: 'sword', color: 'pixel-panel-blue' },
  { id: 'p4', type: 'number', value: '2024', color: 'pixel-panel-parchment' },
  { id: 'p5', type: 'number', value: '99', color: 'pixel-panel-parchment' },
  { id: 'p6', type: 'symbol', value: '!', color: 'pixel-panel-stone' },
  { id: 'p7', type: 'symbol', value: '@', color: 'pixel-panel-stone' },
  { id: 'p8', type: 'symbol', value: '#', color: 'pixel-panel-stone' },
  { id: 'p9', type: 'uppercase', value: 'A', color: 'pixel-btn-success' },
  { id: 'p10', type: 'uppercase', value: 'Z', color: 'pixel-btn-success' },
];

const PasswordRoom = ({ onComplete }) => {
  const { addXP, addCoins, loseHeart } = useGameStore();

  const [craftedPassword, setCraftedPassword] = useState([]);
  const [availablePieces, setAvailablePieces] = useState([]);
  const [timeLeft, setTimeLeft] = useState(45);
  const [strength, setStrength] = useState(0);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    setAvailablePieces([...PIECES].sort(() => Math.random() - 0.5));
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else {
      handleTimeUp();
    }
  }, [timeLeft]);

  useEffect(() => {
    let newStrength = 0;
    const hasWord = craftedPassword.some(p => p.type === 'word');
    const hasNumber = craftedPassword.some(p => p.type === 'number');
    const hasSymbol = craftedPassword.some(p => p.type === 'symbol');
    const hasUpper = craftedPassword.some(p => p.type === 'uppercase');
    const length = craftedPassword.reduce((acc, curr) => acc + curr.value.length, 0);

    if (length >= 8) newStrength += 20;
    if (length >= 12) newStrength += 20;
    if (hasWord) newStrength += 10;
    if (hasNumber) newStrength += 15;
    if (hasSymbol) newStrength += 20;
    if (hasUpper) newStrength += 15;

    setStrength(Math.min(100, newStrength));
  }, [craftedPassword]);

  const handlePieceClick = (piece) => {
    setCraftedPassword([...craftedPassword, piece]);
    setAvailablePieces(availablePieces.filter(p => p.id !== piece.id));
  };

  const handleRemovePiece = (indexToRemove) => {
    const piece = craftedPassword[indexToRemove];
    const newCrafted = [...craftedPassword];
    newCrafted.splice(indexToRemove, 1);
    setCraftedPassword(newCrafted);
    setAvailablePieces([...availablePieces, piece]);
  };

  const clearAll = () => {
    setAvailablePieces([...availablePieces, ...craftedPassword]);
    setCraftedPassword([]);
  };

  const handleSubmit = () => {
    if (strength >= 80) {
      const points = 100 + (timeLeft * 2);
      addXP(points);
      addCoins(20);
      setFeedback({ type: 'success', text: `STRONG PASSWORD! +${points} XP` });
      setTimeout(() => onComplete && onComplete(points), 1500);
    } else {
      loseHeart();
      setFeedback({ type: 'error', text: 'TOO WEAK! Need 80+ Strength.' });
      setTimeout(() => setFeedback(null), 1500);
    }
  };

  const handleTimeUp = () => {
    loseHeart();
    setFeedback({ type: 'error', text: 'TIME IS UP!' });
    setTimeout(() => onComplete && onComplete(0), 1500);
  };

  return (
    <div className="flex flex-col h-full bg-[#1e293b] relative overflow-hidden">
      
      <div className="absolute inset-0 pointer-events-none opacity-20"
           style={{
             backgroundImage: 'linear-gradient(45deg, #0f172a 25%, transparent 25%, transparent 75%, #0f172a 75%, #0f172a), linear-gradient(45deg, #0f172a 25%, transparent 25%, transparent 75%, #0f172a 75%, #0f172a)',
             backgroundSize: '40px 40px',
             backgroundPosition: '0 0, 20px 20px'
           }}
      />
      <div className="absolute bottom-10 left-10 text-[100px] drop-shadow-[4px_4px_0_#000] opacity-30">
        🏰
      </div>

      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1.5 }}
            exit={{ opacity: 0 }}
            className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 font-pixel text-3xl tracking-wider text-center ${
              feedback.type === 'success' ? 'text-green-400 drop-shadow-[4px_4px_0_#000]' : 'text-red-500 drop-shadow-[4px_4px_0_#000]'
            }`}
          >
            {feedback.text}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pixel-panel-wood mx-4 mt-4 p-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <Clock className={`w-6 h-6 ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-white'}`} />
          <span className="font-pixel text-xl">{timeLeft}s</span>
        </div>
        <div className="font-pixel text-yellow-400 text-xl drop-shadow-[2px_2px_0_#000]">
          FORGE YOUR PASSWORD
        </div>
      </div>

      <div className="flex-1 p-3 flex flex-col gap-3 z-10 relative">
        
        {/* Strength Meter */}
        <div className="pixel-panel-stone p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-pixel text-sm flex items-center gap-2">
              <Shield className="w-4 h-4" /> SHIELD POWER
            </span>
            <span className={`font-pixel text-xl ${strength >= 80 ? 'text-green-400' : strength >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
              {strength}%
            </span>
          </div>
          <div className="pixel-bar-container h-6">
            <motion.div 
              className={`h-full transition-all duration-300 ${
                strength >= 80 ? 'bg-[#4ade80] shadow-[inset_0px_4px_0px_0px_#86efac]' : 
                strength >= 50 ? 'bg-[#facc15] shadow-[inset_0px_4px_0px_0px_#fef08a]' : 
                'bg-[#ef4444] shadow-[inset_0px_4px_0px_0px_#fca5a5]'
              }`}
              style={{ width: `${strength}%` }}
              layout
            />
          </div>
        </div>

        {/* The Anvil (Crafting Area) */}
        <div className="pixel-panel-blue p-3 min-h-[80px] flex flex-wrap gap-4 items-center justify-center relative">
          {craftedPassword.length === 0 ? (
            <span className="font-pixel text-sm flex items-center gap-2 text-white/70">
              <Key className="w-5 h-5" /> Select blocks to build
            </span>
          ) : (
            <AnimatePresence>
              {craftedPassword.map((piece, index) => (
                <motion.div
                  key={`${piece.id}-${index}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  onClick={() => handleRemovePiece(index)}
                  className={`${piece.color} px-4 py-3 font-pixel text-lg cursor-pointer hover:scale-105 active:scale-95 transition-transform flex items-center gap-2 group`}
                >
                  {piece.value}
                  <Trash2 className="w-4 h-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Available Pieces */}
        <div className="flex-1 pixel-panel-parchment p-3">
          <p className="font-pixel text-xs text-[#78350f] mb-4">INVENTORY (CLICK TO ADD):</p>
          <div className="flex flex-wrap gap-4">
            <AnimatePresence>
              {availablePieces.map((piece) => (
                <motion.button
                  key={piece.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePieceClick(piece)}
                  className={`${piece.color} px-4 py-3 font-pixel text-lg`}
                >
                  {piece.value}
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button 
            onClick={clearAll}
            className="pixel-btn pixel-btn-danger flex-1 text-sm py-4"
          >
            CLEAR
          </button>
          <button 
            onClick={handleSubmit}
            className={`pixel-btn flex-[2] text-sm py-4 flex items-center justify-center gap-2 ${
              strength >= 80 
                ? 'pixel-btn-success' 
                : 'pixel-btn-secondary grayscale cursor-not-allowed'
            }`}
            disabled={strength < 80}
          >
            <Sparkles className="w-5 h-5" /> {strength >= 80 ? 'UNLOCK GATE' : 'NEED MORE POWER'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default PasswordRoom;
