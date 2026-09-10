import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import { Bug, Skull, AlertTriangle } from 'lucide-react';

const AIAttacker = ({ difficulty = 'Medium', category = 'Phishing', isActive = false }) => {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          className="fixed top-24 right-4 z-40 bg-slate-900 border border-red-500/50 rounded-lg shadow-[0_0_20px_rgba(239,68,68,0.2)] p-3 max-w-xs w-full flex items-center gap-3 overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
          
          <div className="relative">
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 border-2 border-dashed border-red-500/30 rounded-full"
            />
            <div className="bg-red-500/20 p-2 rounded-full relative z-10">
              <Bug className="h-5 w-5 text-red-400" />
            </div>
          </div>
          
          <div className="flex-grow">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20">
                AI Threat
              </span>
              <span className="text-[10px] text-slate-400 font-mono">v2.4.1</span>
            </div>
            <p className="text-sm font-bold text-slate-200 mt-0.5 leading-tight">
              Generating <span className="text-red-400">{category}</span> Vector
            </p>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-[10px] text-slate-500 uppercase">Difficulty:</span>
              <div className="flex gap-0.5">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className={`h-1.5 w-4 rounded-full ${
                    i === 0 || (i === 1 && (difficulty === 'Medium' || difficulty === 'Hard')) || (i === 2 && difficulty === 'Hard')
                      ? 'bg-red-500' 
                      : 'bg-slate-700'
                  }`} />
                ))}
              </div>
            </div>
          </div>

          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

AIAttacker.propTypes = {
  difficulty: PropTypes.oneOf(['Easy', 'Medium', 'Hard']),
  category: PropTypes.string,
  isActive: PropTypes.bool,
};

export default AIAttacker;
