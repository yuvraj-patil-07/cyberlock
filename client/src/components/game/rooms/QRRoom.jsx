import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { QrCode, Scan, ExternalLink, ShieldCheck, HelpCircle, AlertTriangle } from 'lucide-react';
import useGameStore from '../../../store/gameStore';

const QRRoom = ({ onComplete }) => {
  const { addXP, addCoins, loseHeart } = useGameStore();
  const [feedback, setFeedback] = useState(null);

  const qrDestination = "https://city-parking-meter-quickpay.online/pay?meterId=4920";
  const isMalicious = true;

  const handleAnswer = (type) => {
    if (type === 'phishing') {
      const points = 50;
      addXP(points);
      addCoins(10);
      setFeedback({ type: 'success', text: `CORRECT! +${points} XP` });
      setTimeout(() => onComplete && onComplete(points), 1500);
    } else {
      loseHeart();
      setFeedback({ type: 'error', text: 'WRONG! The domain is suspicious.' });
      setTimeout(() => setFeedback(null), 1500);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#1e293b] rounded-3xl border-4 border-purple-500/50 shadow-2xl overflow-hidden relative font-pixel text-white">
      
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20"
           style={{
             backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #000 2px, #000 4px)'
           }}
      />

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

      {/* Top Bar */}
      <div className="flex justify-between items-center p-4 bg-purple-900/30 border-b-4 border-purple-900">
        <div className="flex items-center gap-2">
          <Scan className="w-6 h-6 text-purple-400 animate-pulse" />
          <span className="text-purple-400 drop-shadow-[2px_2px_0_#000]">QR_SCANNER_V1</span>
        </div>
        <div className="text-yellow-400 drop-shadow-[2px_2px_0_#000]">
          ANALYZE THE CODE
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-8 z-10 relative">
        
        <div className="pixel-panel-stone p-6 flex flex-col items-center">
          
          <div className="w-64 h-64 border-4 border-purple-500 bg-white relative p-4 flex items-center justify-center overflow-hidden">
            <motion.div
              className="absolute left-0 right-0 h-1 bg-red-500/50 shadow-[0_0_10px_red]"
              animate={{ top: ['0%', '100%', '0%'] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
            />
            <QrCode className="w-full h-full text-black" />
          </div>

          <div className="mt-6 p-4 border-4 border-black bg-blue-900 text-center w-full">
            <p className="text-blue-300 text-xs mb-2">DECODED URL:</p>
            <p className="text-white text-sm break-all">{qrDestination}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 w-full max-w-2xl justify-center">
          <button 
            onClick={() => handleAnswer('safe')}
            className="pixel-btn pixel-btn-success flex-1 py-4 text-sm"
          >
            <ShieldCheck className="w-6 h-6 mr-2" /> SAFE
          </button>
          <button 
            onClick={() => handleAnswer('suspicious')}
            className="pixel-btn pixel-btn-secondary flex-1 py-4 text-sm"
          >
            <HelpCircle className="w-6 h-6 mr-2" /> SUSPICIOUS
          </button>
          <button 
            onClick={() => handleAnswer('phishing')}
            className="pixel-btn pixel-btn-danger flex-1 py-4 text-sm"
          >
            <AlertTriangle className="w-6 h-6 mr-2" /> MALICIOUS
          </button>
        </div>

      </div>
    </div>
  );
};

export default QRRoom;
