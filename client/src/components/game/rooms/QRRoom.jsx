import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, ShieldCheck, HelpCircle, AlertTriangle, Clock } from 'lucide-react';

const QRRoom = ({ challenge, onComplete, onFeedback, onWrongAnswer }) => {
  const [timeLeft, setTimeLeft] = useState(30);
  const [feedbackState, setFeedbackState] = useState(null);

  const diff = challenge?.difficulty || 'beginner';

  useEffect(() => {
    let time = 30;
    if (diff === 'intermediate') time = 20;
    if (diff === 'advanced') time = 10;
    setTimeLeft(time);
    setFeedbackState(null);
  }, [challenge, diff]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !feedbackState) {
      handleTimeUp();
    }
  }, [timeLeft, feedbackState]);

  const handleTimeUp = () => {
    setFeedbackState({ type: 'error', text: 'TIME UP!' });
    if (onFeedback) onFeedback({ isCorrect: false, text: challenge?.explanation || 'You took too long.' });
    setTimeout(() => {
      if (onWrongAnswer) onWrongAnswer();
    }, 2000);
  };

  const processAnswer = (bucketType) => {
    if (feedbackState) return;
    
    const isCorrect = challenge?.correctAnswer === bucketType;

    if (isCorrect) {
      setFeedbackState({ type: 'success', text: '+20 XP' });
      if (onFeedback) onFeedback({ isCorrect: true, text: challenge?.explanation || 'Correctly identified!' });
      setTimeout(() => {
        if (onComplete) onComplete({ xp: 20, coins: 5 });
      }, 2000);
    } else {
      setFeedbackState({ type: 'error', text: 'WRONG!' });
      if (onFeedback) onFeedback({ isCorrect: false, text: challenge?.explanation || 'Incorrect classification.' });
      setTimeout(() => {
        if (onWrongAnswer) onWrongAnswer();
      }, 2000);
    }
  };

  const scenario = challenge?.scenario || {};

  return (
    <div className="flex flex-col h-full bg-[#1e293b] relative overflow-hidden">
      
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Top Stats Bar */}
      <div className="pixel-panel mx-2 mt-1 p-1 flex justify-between items-center z-10 bg-slate-800 border-slate-600">
        <div className="flex items-center gap-3">
          <Clock className={`w-6 h-6 ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-blue-400'}`} />
          <span className="font-pixel text-xl text-white">{timeLeft}s</span>
        </div>
      </div>

      {/* Main Scanner Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 relative z-10">
        <AnimatePresence>
          {feedbackState && (
            <motion.div
              initial={{ opacity: 0, y: 0, scale: 0.5 }}
              animate={{ opacity: 1, y: -100, scale: 1.5 }}
              exit={{ opacity: 0 }}
              className={`absolute z-50 font-pixel text-4xl tracking-wider ${feedbackState.type === 'success' ? 'text-green-400' : 'text-red-500'} drop-shadow-[4px_4px_0_#000]`}
            >
              {feedbackState.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scenario Image / QR Target Reticle */}
        <div className="relative w-64 h-48 border-4 border-blue-500/50 rounded-xl flex items-center justify-center mb-2 bg-black/40 backdrop-blur-sm overflow-hidden">
          {/* Scanning Animation */}
          <motion.div 
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="absolute left-0 right-0 h-1 bg-cyan-400 shadow-[0_0_10px_#22d3ee] z-20"
          />
          {scenario.image ? (
            <img src={scenario.image} alt="QR Scenario" className="w-full h-full object-cover opacity-80" />
          ) : (
            <QrCode className="w-32 h-32 text-blue-300 opacity-50" />
          )}
        </div>

        {/* Decoded URL Box */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={challenge?._id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="bg-slate-800 p-2 rounded-xl border-2 border-slate-600 text-center w-full max-w-md shadow-2xl"
          >
            <div className="text-xs text-blue-400 font-bold mb-2 uppercase tracking-widest flex items-center justify-center gap-2">
               Target Acquired
            </div>
            <div className="font-mono text-sm text-green-400 break-all bg-black/50 p-3 rounded">
              {scenario.url || 'No URL decoded.'}
            </div>
            
            {scenario.context && (
              <div className="mt-3 text-xs text-slate-400 font-sans">
                Location: {scenario.context}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

      </div>

      {/* Action Buttons */}
      <div className="p-2 flex justify-center gap-2 z-10">
        <button onClick={() => processAnswer('safe')} className="pixel-btn pixel-btn-success text-sm px-2 py-2 w-48">
          <ShieldCheck className="w-8 h-8" /> SAFE
        </button>
        <button onClick={() => processAnswer('suspicious')} className="pixel-btn pixel-btn-secondary text-sm px-2 py-2 w-48">
          <HelpCircle className="w-8 h-8" /> SUSPICIOUS
        </button>
        <button onClick={() => processAnswer('phishing')} className="pixel-btn pixel-btn-danger text-sm px-2 py-2 w-48">
          <AlertTriangle className="w-8 h-8" /> MALICIOUS
        </button>
      </div>

    </div>
  );
};

export default QRRoom;
