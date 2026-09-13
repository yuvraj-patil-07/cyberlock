import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Key, Sparkles, Clock, Trash2, CheckCircle } from 'lucide-react';
import useGameStore from '../../../store/gameStore';

const PIECES = [
  { id: 'p1', type: 'word', value: 'dragon', color: 'bg-blue-500' },
  { id: 'p2', type: 'word', value: 'apple', color: 'bg-blue-500' },
  { id: 'p3', type: 'word', value: 'sword', color: 'bg-blue-500' },
  { id: 'p4', type: 'number', value: '2024', color: 'bg-orange-500' },
  { id: 'p5', type: 'number', value: '99', color: 'bg-orange-500' },
  { id: 'p6', type: 'symbol', value: '!', color: 'bg-purple-500' },
  { id: 'p7', type: 'symbol', value: '@', color: 'bg-purple-500' },
  { id: 'p8', type: 'symbol', value: '#', color: 'bg-purple-500' },
  { id: 'p9', type: 'uppercase', value: 'A', color: 'bg-green-500' },
  { id: 'p10', type: 'uppercase', value: 'Z', color: 'bg-green-500' },
];

const PasswordRoom = ({ onComplete }) => {
  const { addXP, addCoins, loseHeart } = useGameStore();

  const [craftedPassword, setCraftedPassword] = useState([]);
  const [availablePieces, setAvailablePieces] = useState([]);
  const [timeLeft, setTimeLeft] = useState(45);
  const [strength, setStrength] = useState(0);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    // Shuffle pieces for this round
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
    // Calculate strength
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
      // Success
      const points = 100 + (timeLeft * 2);
      addXP(points);
      addCoins(20);
      setFeedback({ type: 'success', text: `STRONG PASSWORD! +${points} XP` });
      setTimeout(() => onComplete && onComplete(points), 1500);
    } else {
      // Fail
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
    <div className="flex flex-col h-full bg-slate-900 rounded-3xl border-4 border-yellow-500/50 shadow-2xl overflow-hidden relative">
      
      {/* Floating Feedback */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1.5 }}
            exit={{ opacity: 0 }}
            className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 font-black text-4xl tracking-wider text-center ${
              feedback.type === 'success' ? 'text-green-400 drop-shadow-[0_0_20px_#4ade80]' : 'text-red-500 drop-shadow-[0_0_20px_#ef4444]'
            }`}
          >
            {feedback.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Bar */}
      <div className="flex justify-between items-center p-4 bg-yellow-900/30 border-b border-yellow-500/30">
        <div className="flex items-center gap-3 bg-slate-900 px-4 py-2 rounded-full border border-yellow-500/50 shadow-[0_0_10px_rgba(234,179,8,0.2)]">
          <Clock className={`w-5 h-5 ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-yellow-400'}`} />
          <span className="text-white font-mono font-bold text-xl">{timeLeft}s</span>
        </div>
        <div className="text-yellow-400 font-bold tracking-widest uppercase">
          Forge Your Password
        </div>
      </div>

      <div className="flex-1 p-6 flex flex-col gap-8">
        
        {/* Strength Meter */}
        <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 shadow-inner">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-400 uppercase tracking-widest font-bold text-sm flex items-center gap-2">
              <Shield className="w-5 h-5" /> Shield Power
            </span>
            <span className={`font-mono font-bold text-2xl ${strength >= 80 ? 'text-green-400' : strength >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
              {strength}%
            </span>
          </div>
          <div className="w-full h-4 bg-slate-900 rounded-full overflow-hidden border border-slate-700">
            <motion.div 
              className={`h-full transition-all duration-300 ${
                strength >= 80 ? 'bg-gradient-to-r from-green-500 to-green-400' : 
                strength >= 50 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' : 
                'bg-gradient-to-r from-red-500 to-red-400'
              }`}
              style={{ width: `${strength}%` }}
              layout
            />
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-gray-500 uppercase font-bold">
            <span>Weak</span>
            <span>Moderate</span>
            <span className="text-green-500">Target (80%)</span>
          </div>
        </div>

        {/* The Anvil (Crafting Area) */}
        <div className="bg-slate-800 border-2 border-dashed border-slate-600 rounded-2xl p-6 min-h-[120px] flex flex-wrap gap-2 items-center justify-center relative">
          {craftedPassword.length === 0 ? (
            <span className="text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
              <Key className="w-5 h-5" /> Select pieces to forge
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
                  className={`${piece.color} text-white px-4 py-2 rounded-lg font-mono font-bold text-lg cursor-pointer hover:opacity-80 transition-opacity shadow-lg flex items-center gap-1 group`}
                >
                  {piece.value}
                  <Trash2 className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button 
            onClick={clearAll}
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl uppercase tracking-widest transition-colors flex-1"
          >
            Clear
          </button>
          <button 
            onClick={handleSubmit}
            className={`px-6 py-3 font-bold rounded-xl uppercase tracking-widest transition-all flex-[2] flex items-center justify-center gap-2 ${
              strength >= 80 
                ? 'bg-green-500 hover:bg-green-400 text-white shadow-[0_0_20px_rgba(34,197,94,0.5)]' 
                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
            }`}
            disabled={strength < 80}
          >
            <Sparkles className="w-5 h-5" /> Ignite Forge
          </button>
        </div>

        {/* Available Pieces */}
        <div className="mt-auto">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">Materials Inventory:</p>
          <div className="flex flex-wrap gap-3">
            <AnimatePresence>
              {availablePieces.map((piece) => (
                <motion.button
                  key={piece.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handlePieceClick(piece)}
                  className={`${piece.color} text-white px-4 py-2 rounded-lg font-mono font-bold text-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all`}
                >
                  {piece.value}
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PasswordRoom;
