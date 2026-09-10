import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../common/GlassCard';
import PropTypes from 'prop-types';
import { Lightbulb, Lock } from 'lucide-react';

const HintSystem = ({ hints, currentHintLevel, onRequestHint, xpCost = 10 }) => {
  return (
    <GlassCard glowColor="purple" padding="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-yellow-400" />
          AI Coach Hints
        </h3>
        <span className="text-xs font-mono text-slate-400">
          {currentHintLevel} / {hints.length} Used
        </span>
      </div>

      <div className="space-y-3 mb-4">
        {hints.map((hint, index) => {
          const isRevealed = index < currentHintLevel;
          const isNext = index === currentHintLevel;

          return (
            <div
              key={index}
              className={`p-3 rounded-lg border text-sm transition-all ${
                isRevealed 
                  ? 'bg-purple-500/10 border-purple-500/30 text-slate-200' 
                  : 'bg-slate-800/50 border-white/5 text-slate-500 flex items-center justify-center'
              }`}
            >
              {isRevealed ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {hint}
                </motion.div>
              ) : (
                <Lock className="h-4 w-4 opacity-50" />
              )}
            </div>
          );
        })}
      </div>

      {currentHintLevel < hints.length && (
        <button
          onClick={onRequestHint}
          className="w-full py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-sm font-medium text-slate-300 transition-colors flex items-center justify-center gap-2"
        >
          <Lightbulb className="h-4 w-4" />
          Reveal Hint (-{xpCost} XP)
        </button>
      )}
    </GlassCard>
  );
};

HintSystem.propTypes = {
  hints: PropTypes.arrayOf(PropTypes.string).isRequired,
  currentHintLevel: PropTypes.number.isRequired,
  onRequestHint: PropTypes.func.isRequired,
  xpCost: PropTypes.number,
};

export default HintSystem;
