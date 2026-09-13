import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, AlertTriangle, ShieldCheck, HelpCircle, Clock, Zap } from 'lucide-react';
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
    { id: 11, sender: 'Bank of America', subject: 'Action Required', type: 'phishing' },
    { id: 12, sender: 'Jane Smith', subject: 'Meeting notes attached', type: 'safe' },
    { id: 13, sender: 'Zoom', subject: 'Missed meeting recording', type: 'suspicious' },
    { id: 14, sender: 'LinkedIn', subject: 'You appeared in 5 searches', type: 'safe' },
    { id: 15, sender: 'Apple Support', subject: 'Receipt for your purchase', type: 'phishing' },
    { id: 16, sender: 'FedEx', subject: 'Delivery exception', type: 'suspicious' },
    { id: 17, sender: 'GitHub', subject: 'Dependabot alert', type: 'safe' },
    { id: 18, sender: 'Microsoft', subject: 'Verify your Office365', type: 'phishing' },
    { id: 19, sender: 'Slack', subject: 'New login from unknown device', type: 'suspicious' },
    { id: 20, sender: 'Team', subject: 'Happy Birthday!', type: 'safe' },
  ];
  // Shuffle emails
  return emails.sort(() => Math.random() - 0.5);
};

const PhishingRoom = ({ onComplete }) => {
  const { addXP, addCoins, loseHeart } = useGameStore();
  
  const [emails, setEmails] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds for the challenge
  const [combo, setCombo] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [score, setScore] = useState(0);
  const [draggedItem, setDraggedItem] = useState(null);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', text: '' }

  useEffect(() => {
    setEmails(generateEmails());
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && currentIndex < emails.length) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    }
    if (timeLeft === 0 || currentIndex >= emails.length) {
      // Game Over / Complete
      setTimeout(() => {
        onComplete && onComplete(score);
      }, 2000);
    }
  }, [timeLeft, currentIndex, emails.length, score, onComplete]);

  const handleDragStart = (e, email) => {
    setDraggedItem(email);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = (e, bucketType) => {
    e.preventDefault();
    if (!draggedItem) return;

    processAnswer(draggedItem, bucketType);
    setDraggedItem(null);
  };

  const handleClickSort = (bucketType) => {
    if (currentIndex < emails.length) {
      processAnswer(emails[currentIndex], bucketType);
    }
  };

  const processAnswer = (email, bucketType) => {
    const isCorrect = email.type === bucketType;

    if (isCorrect) {
      // Correct!
      const points = 10 * multiplier;
      setScore(prev => prev + points);
      setCombo(prev => prev + 1);
      
      // Increase multiplier every 3 combo
      if ((combo + 1) % 3 === 0) {
        setMultiplier(prev => Math.min(prev + 1, 5));
      }

      setFeedback({ type: 'success', text: `+${points} XP` });
      addXP(points);
      addCoins(5 * multiplier);
      
      // Play success sound (if implemented globally)
      
    } else {
      // Wrong!
      setCombo(0);
      setMultiplier(1);
      loseHeart();
      setFeedback({ type: 'error', text: 'WRONG!' });
      
      // Play error sound
    }

    // Move to next email
    setCurrentIndex(prev => prev + 1);

    // Clear feedback after short delay
    setTimeout(() => setFeedback(null), 800);
  };

  if (currentIndex >= emails.length || timeLeft === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-white">
        <h2 className="text-4xl font-bold mb-4 text-green-400">Challenge Complete!</h2>
        <p className="text-2xl">Final Score: {score}</p>
        <p className="text-gray-400 mt-2">Emails sorted: {currentIndex}/{emails.length}</p>
      </div>
    );
  }

  const currentEmail = emails[currentIndex];

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-3xl border border-slate-700 shadow-2xl overflow-hidden relative">
      
      {/* Top Stats Bar */}
      <div className="flex justify-between items-center p-4 bg-slate-800/80 border-b border-slate-700">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-full border border-slate-700">
            <Clock className={`w-5 h-5 ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-blue-400'}`} />
            <span className="text-white font-mono font-bold text-lg">{timeLeft}s</span>
          </div>
          <div className="text-white font-bold">
            Email {currentIndex + 1} / {emails.length}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-gray-400 text-xs uppercase tracking-wider font-bold">Score</span>
            <span className="text-yellow-400 font-mono font-bold text-xl">{score}</span>
          </div>
          
          <AnimatePresence>
            {combo > 1 && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex items-center gap-1 bg-purple-900/50 px-3 py-1 rounded-full border border-purple-500"
              >
                <Zap className="w-4 h-4 text-purple-400" />
                <span className="text-purple-300 font-bold text-sm">{combo}x Combo! (x{multiplier})</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Play Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
        
        {/* Floating Feedback */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 0, scale: 0.5 }}
              animate={{ opacity: 1, y: -100, scale: 1.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className={`absolute z-50 font-black text-4xl tracking-wider ${feedback.type === 'success' ? 'text-green-400 drop-shadow-[0_0_15px_#4ade80]' : 'text-red-500 drop-shadow-[0_0_15px_#ef4444]'}`}
            >
              {feedback.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* The Email Card */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentEmail?.id}
            initial={{ opacity: 0, x: 200, rotate: 10 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            exit={{ opacity: 0, x: -200, rotate: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            draggable
            onDragStart={(e) => handleDragStart(e, currentEmail)}
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing border-4 border-transparent hover:border-blue-400 transition-colors"
          >
            <div className="bg-slate-100 border-b border-slate-200 px-6 py-4 flex items-center gap-3">
              <Mail className="w-6 h-6 text-blue-500" />
              <div>
                <h3 className="font-bold text-slate-800 text-lg">{currentEmail?.sender}</h3>
                <p className="text-slate-500 text-sm font-mono">&lt;sender@domain.com&gt;</p>
              </div>
            </div>
            <div className="p-8 min-h-[200px] flex items-center justify-center">
              <h2 className="text-2xl font-bold text-slate-700 text-center leading-relaxed">
                "{currentEmail?.subject}"
              </h2>
            </div>
            <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-between items-center text-xs text-slate-400 font-mono">
              <span>Drag to sort or click buttons below</span>
              <span>ID: {currentEmail?.id}</span>
            </div>
          </motion.div>
        </AnimatePresence>

      </div>

      {/* Sorting Buckets (Drop Zones) */}
      <div className="grid grid-cols-3 gap-4 p-6 bg-slate-800/50">
        <div 
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'safe')}
          onClick={() => handleClickSort('safe')}
          className="flex flex-col items-center justify-center gap-2 p-6 bg-green-900/20 border-2 border-green-500/50 hover:bg-green-900/40 hover:border-green-400 rounded-2xl cursor-pointer transition-all group"
        >
          <ShieldCheck className="w-10 h-10 text-green-500 group-hover:scale-110 transition-transform" />
          <span className="text-green-400 font-bold tracking-widest uppercase">Safe</span>
        </div>

        <div 
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'suspicious')}
          onClick={() => handleClickSort('suspicious')}
          className="flex flex-col items-center justify-center gap-2 p-6 bg-yellow-900/20 border-2 border-yellow-500/50 hover:bg-yellow-900/40 hover:border-yellow-400 rounded-2xl cursor-pointer transition-all group"
        >
          <HelpCircle className="w-10 h-10 text-yellow-500 group-hover:scale-110 transition-transform" />
          <span className="text-yellow-400 font-bold tracking-widest uppercase">Suspicious</span>
        </div>

        <div 
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'phishing')}
          onClick={() => handleClickSort('phishing')}
          className="flex flex-col items-center justify-center gap-2 p-6 bg-red-900/20 border-2 border-red-500/50 hover:bg-red-900/40 hover:border-red-400 rounded-2xl cursor-pointer transition-all group"
        >
          <AlertTriangle className="w-10 h-10 text-red-500 group-hover:scale-110 transition-transform" />
          <span className="text-red-400 font-bold tracking-widest uppercase">Phishing</span>
        </div>
      </div>

    </div>
  );
};

export default PhishingRoom;
