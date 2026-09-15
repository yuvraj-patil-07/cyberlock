import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Smartphone, AlertTriangle, Clock } from 'lucide-react';

const ScamRoom = ({ challenge, onComplete, onFeedback, onWrongAnswer }) => {
  const [timeLeft, setTimeLeft] = useState(30); 
  const [feedbackState, setFeedbackState] = useState(null);

  const diff = challenge?.difficulty || 'beginner';

  useEffect(() => {
    let startingTime = 30;
    if (diff === 'intermediate') startingTime = 40;
    if (diff === 'advanced') startingTime = 50;
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
      if (onFeedback) onFeedback({ isCorrect: false, text: challenge?.explanation || 'Incorrect.' });
      setTimeout(() => {
        if (onWrongAnswer) onWrongAnswer();
      }, 2000);
    }
  };

  const scenario = challenge?.scenario || {};

  return (
    <div className="flex flex-col h-full bg-[#2a452a] relative overflow-hidden">
      {/* Background Village Elements */}
      <div className="absolute inset-0 pointer-events-none flex justify-around items-end opacity-20">
        <div className="text-[120px] drop-shadow-[4px_4px_0_#000]">🏠</div>
        <div className="text-[150px] drop-shadow-[4px_4px_0_#000]">🏪</div>
        <div className="text-[100px] drop-shadow-[4px_4px_0_#000]">🏡</div>
      </div>

      {/* Top Stats */}
      <div className="pixel-panel-wood mx-4 mt-4 p-2 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <Clock className={`w-6 h-6 ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-white'}`} />
          <span className="font-pixel text-xl">{timeLeft}s</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4 z-10 relative">
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

        {/* Smartphone UI */}
        <AnimatePresence mode="popLayout">
          <motion.div 
            key={challenge?._id}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="w-full max-w-sm bg-black rounded-3xl p-3 border-4 border-gray-700 shadow-2xl relative overflow-hidden"
          >
            <div className="bg-white rounded-2xl h-full flex flex-col overflow-hidden min-h-[300px]">
              {/* Phone Header */}
              <div className="bg-gray-100 p-3 border-b flex items-center justify-between">
                <span className="font-pixel text-xs text-gray-500">{scenario.senderAddress || '+1 (555) 000-0000'}</span>
                <Smartphone className="w-4 h-4 text-gray-400" />
              </div>
              
              <div className="p-4 flex-1 flex flex-col justify-end bg-gray-50">
                <div className="bg-blue-500 text-white p-3 rounded-2xl rounded-tl-none font-pixel text-sm leading-relaxed whitespace-pre-wrap max-w-[85%] self-start shadow-sm">
                  {scenario.body || 'No message.'}
                </div>
                <div className="text-[10px] text-gray-400 mt-2 ml-1 font-pixel">{scenario.timestamp || 'Just now'}</div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Buttons */}
      <div className="p-2 flex justify-center gap-2 z-10">
        <button onClick={() => processAnswer('safe')} className="pixel-btn pixel-btn-success text-sm px-2 py-2 w-48">
          <Shield className="w-8 h-8" /> SAFE
        </button>
        <button onClick={() => processAnswer('scam')} className="pixel-btn pixel-btn-danger text-sm px-2 py-2 w-48">
          <AlertTriangle className="w-8 h-8" /> SCAM
        </button>
      </div>
    </div>
  );
};

export default ScamRoom;
