import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, HelpCircle, AlertTriangle, Clock, Zap } from 'lucide-react';
import useGameStore from '../../../store/gameStore';

// Mock list of 20 emails for the sorting challenge
const generateEmails = () => {
  const emails = [
    { id: 1, sender: 'HR Dept', subject: 'Updated Q3 Policies', type: 'safe' },
    { id: 2, sender: 'PayPal Support', subject: 'URGENT: Account Locked', type: 'phishing' },
    { id: 3, sender: 'IT Admin', subject: 'Password Expiry Notice', type: 'suspicious' },
    { id: 4, sender: 'Netflix', subject: 'Update your payment details', type: 'phishing' },
    { id: 5, sender: 'John Doe', subject: 'Lunch at 1?', type: 'safe' },
    { id: 6, sender: 'Amazon', subject: 'Your order has shipped', type: 'safe' },
    { id: 7, sender: 'Security Alert', subject: 'Unusual login detected', type: 'phishing' },
    { id: 8, sender: 'CEO', subject: 'Need gift cards ASAP', type: 'phishing' },
    { id: 9, sender: 'Marketing', subject: 'New Campaign Assets', type: 'safe' },
    { id: 10, sender: 'Dropbox', subject: 'Document shared with you', type: 'suspicious' },
  ];
  return emails.sort(() => Math.random() - 0.5);
};

const PhishingRoom = ({ onComplete }) => {
  const { addXP, addCoins, loseHeart } = useGameStore();
  
  const [emails, setEmails] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60); 
  const [combo, setCombo] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null); 

  useEffect(() => {
    setEmails(generateEmails());
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && currentIndex < emails.length) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    }
    if (timeLeft === 0 || currentIndex >= emails.length) {
      setTimeout(() => {
        onComplete && onComplete(score);
      }, 2000);
    }
  }, [timeLeft, currentIndex, emails.length, score, onComplete]);

  const processAnswer = (email, bucketType) => {
    const isCorrect = email.type === bucketType;

    if (isCorrect) {
      const points = 10 * multiplier;
      setScore(prev => prev + points);
      setCombo(prev => prev + 1);
      
      if ((combo + 1) % 3 === 0) {
        setMultiplier(prev => Math.min(prev + 1, 5));
      }

      setFeedback({ type: 'success', text: `+${points} XP` });
      addXP(points);
      addCoins(5 * multiplier);
    } else {
      setCombo(0);
      setMultiplier(1);
      loseHeart();
      setFeedback({ type: 'error', text: 'WRONG!' });
    }

    setCurrentIndex(prev => prev + 1);
    setTimeout(() => setFeedback(null), 800);
  };

  if (currentIndex >= emails.length || timeLeft === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-white pixel-panel-wood bg-[#1a2f1a]">
        <h2 className="text-4xl font-pixel mb-4 text-green-400 drop-shadow-[2px_2px_0_#000]">Challenge Complete!</h2>
        <p className="text-2xl font-pixel drop-shadow-[2px_2px_0_#000]">Final Score: {score}</p>
        <p className="mt-8 pixel-btn pixel-btn-primary" onClick={() => onComplete(score)}>Return to Map</p>
      </div>
    );
  }

  const currentEmail = emails[currentIndex];

  return (
    <div className="flex flex-col h-full bg-[#1a2f1a] relative overflow-hidden">
      
      {/* Background Trees */}
      <div className="absolute inset-0 pointer-events-none opacity-40 flex justify-around items-end pb-32">
        <div className="text-[150px] drop-shadow-[4px_4px_0_#000]">🌲</div>
        <div className="text-[200px] drop-shadow-[4px_4px_0_#000] -mb-10">🌲</div>
        <div className="text-[150px] drop-shadow-[4px_4px_0_#000]">🌲</div>
      </div>

      {/* Top Stats Bar */}
      <div className="pixel-panel-wood mx-4 mt-4 p-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Clock className={`w-6 h-6 ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-white'}`} />
            <span className="font-pixel text-xl">{timeLeft}s</span>
          </div>
          <div className="font-pixel text-lg text-yellow-400">
            Email {currentIndex + 1} / {emails.length}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-pixel text-xl">
            <span className="text-gray-300">SCORE:</span>
            <span className="text-yellow-400">{score}</span>
          </div>
          
          <AnimatePresence>
            {combo > 1 && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex items-center gap-2 pixel-tag pixel-tag-suspicious"
              >
                <Zap className="w-4 h-4" />
                <span>{combo}x (x{multiplier})</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Play Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 relative z-10">
        
        {/* Floating Feedback */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 0, scale: 0.5 }}
              animate={{ opacity: 1, y: -100, scale: 1.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className={`absolute z-50 font-pixel text-4xl tracking-wider ${feedback.type === 'success' ? 'text-green-400 drop-shadow-[4px_4px_0_#000]' : 'text-red-500 drop-shadow-[4px_4px_0_#000]'}`}
            >
              {feedback.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* The Email Dialogue Box */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentEmail?.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-2xl pixel-panel-parchment p-4 flex flex-col gap-3"
          >
            <div className="flex flex-col gap-2 border-b-4 border-[#d97706] pb-4">
              <div className="flex items-center gap-3">
                <span className="font-pixel text-sm text-[#78350f]">FROM:</span>
                <span className="font-pixel text-lg text-black">{currentEmail?.sender} &lt;sender@domain.com&gt;</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-pixel text-sm text-[#78350f]">SUBJ:</span>
                <span className="font-pixel text-lg text-black">{currentEmail?.subject}</span>
              </div>
            </div>
            
            <div className="min-h-[80px] font-pixel text-xl leading-relaxed text-[#451a03]">
              Dear User, <br/><br/>
              Please review the following information regarding "{currentEmail?.subject}". 
              Clicking links in untrusted emails can lead to severe consequences.
              <br/><br/>
              Analyze this threat carefully!
            </div>
          </motion.div>
        </AnimatePresence>

      </div>

      {/* Buttons */}
      <div className="p-3 flex justify-center gap-4 z-10">
        <button 
          onClick={() => processAnswer(currentEmail, 'safe')}
          className="pixel-btn pixel-btn-success text-xl px-4 py-3 w-64"
        >
          <ShieldCheck className="w-8 h-8" />
          SAFE
        </button>

        <button 
          onClick={() => processAnswer(currentEmail, 'suspicious')}
          className="pixel-btn pixel-btn-secondary text-xl px-4 py-3 w-64"
        >
          <HelpCircle className="w-8 h-8" />
          SUSPICIOUS
        </button>

        <button 
          onClick={() => processAnswer(currentEmail, 'phishing')}
          className="pixel-btn pixel-btn-danger text-xl px-4 py-3 w-64"
        >
          <AlertTriangle className="w-8 h-8" />
          PHISHING
        </button>
      </div>

    </div>
  );
};

export default PhishingRoom;
