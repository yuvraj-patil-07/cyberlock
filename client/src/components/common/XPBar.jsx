import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import { Shield } from 'lucide-react';

const XPBar = ({ currentXP = 0, nextLevelXP = 1000, level = 1, className = '', showLevelBadge = true }) => {
  const progress = Math.min(100, Math.max(0, (currentXP / nextLevelXP) * 100));

  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      {showLevelBadge && (
        <div className="flex-shrink-0 relative">
          <Shield className="w-10 h-10 text-cyan-600 opacity-25" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-cyan-700 font-bold text-sm">L{level}</span>
          </div>
        </div>
      )}
      <div className="flex-grow">
        <div className="flex justify-between items-end mb-1">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Experience</span>
          <span className="text-xs font-mono font-bold text-cyan-700">{currentXP} / {nextLevelXP} XP</span>
        </div>
        <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden border border-slate-300/60 relative">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-600 to-indigo-600 rounded-full shadow-sm"
          />
        </div>
      </div>
    </div>
  );
};

XPBar.propTypes = {
  currentXP: PropTypes.number,
  nextLevelXP: PropTypes.number,
  level: PropTypes.number,
  className: PropTypes.string,
  showLevelBadge: PropTypes.bool,
};

export default XPBar;
