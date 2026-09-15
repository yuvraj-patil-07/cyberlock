import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, HelpCircle, AlertTriangle, Clock, Zap } from 'lucide-react';

const PhishingRoom = ({ challenge, onComplete, onFeedback, onWrongAnswer }) => {
  const [timeLeft, setTimeLeft] = useState(60);
  const [feedbackState, setFeedbackState] = useState(null); 
  
  const diff = challenge?.difficulty || 'beginner';
  
  useEffect(() => {
    let startingTime = 60;
    if (diff === 'intermediate') startingTime = 45;
    if (diff === 'advanced') startingTime = 30;
    setTimeLeft(startingTime);
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
    if (onFeedback) onFeedback({ isCorrect: false, text: challenge?.explanation || 'You failed to analyze the email in time.' });
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
    <div className="flex flex-col h-full bg-[#1a2f1a] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-40 flex justify-around items-end pb-32">
        <div className="text-[150px] drop-shadow-[4px_4px_0_#000]">🌲</div>
        <div className="text-[200px] drop-shadow-[4px_4px_0_#000] -mb-10">🌲</div>
        <div className="text-[150px] drop-shadow-[4px_4px_0_#000]">🌲</div>
      </div>

      <div className="pixel-panel-wood mx-4 mt-4 p-2 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Clock className={`w-6 h-6 ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-white'}`} />
            <span className="font-pixel text-xl">{timeLeft}s</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4 relative z-10">
        <AnimatePresence>
          {feedbackState && (
            <motion.div
              initial={{ opacity: 0, y: 0, scale: 0.5 }}
              animate={{ opacity: 1, y: -100, scale: 1.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className={`absolute z-50 font-pixel text-4xl tracking-wider ${feedbackState.type === 'success' ? 'text-green-400 drop-shadow-[4px_4px_0_#000]' : 'text-red-500 drop-shadow-[4px_4px_0_#000]'}`}
            >
              {feedbackState.text}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="popLayout">
          <motion.div
            key={challenge?._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-2xl pixel-panel-parchment p-3 flex flex-col gap-2"
          >
            <div className="flex flex-col gap-2 border-b-4 border-[#d97706] pb-2">
              <div className="flex items-center gap-3">
                <span className="font-pixel text-xs text-[#78350f]">FROM:</span>
                <span className="font-pixel text-sm text-black">{scenario.sender || 'Unknown'} &lt;{scenario.senderAddress || 'sender@domain.com'}&gt;</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-pixel text-xs text-[#78350f]">SUBJ:</span>
                <span className="font-pixel text-sm text-black">{scenario.subject || 'No Subject'}</span>
              </div>
            </div>
            
            <div className="min-h-[60px] font-pixel text-sm leading-relaxed text-[#451a03] whitespace-pre-wrap">
              {scenario.body || 'No content provided.'}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="p-2 flex justify-center gap-2 z-10">
        <button onClick={() => processAnswer('safe')} className="pixel-btn pixel-btn-success text-sm px-2 py-2 w-48">
          <ShieldCheck className="w-8 h-8" /> SAFE
        </button>
        <button onClick={() => processAnswer('suspicious')} className="pixel-btn pixel-btn-secondary text-sm px-2 py-2 w-48">
          <HelpCircle className="w-8 h-8" /> SUSPICIOUS
        </button>
        <button onClick={() => processAnswer('phishing')} className="pixel-btn pixel-btn-danger text-sm px-2 py-2 w-48">
          <AlertTriangle className="w-8 h-8" /> PHISHING
        </button>
      </div>
    </div>
  );
};

export default PhishingRoom;
