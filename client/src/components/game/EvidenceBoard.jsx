import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../common/GlassCard';
import PropTypes from 'prop-types';
import { Search, AlertTriangle, CheckCircle, ShieldAlert, Sparkles } from 'lucide-react';

const EvidenceBoard = ({ indicators = [], onEvidenceCollected, maxScore = 100 }) => {
  const currentScore = indicators.reduce((acc, ind) => acc + (ind.found ? (ind.points || 10) : 0), 0);
  
  return (
    <GlassCard glowColor="purple" className="relative h-full flex flex-col bg-white/95 border-slate-200">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
        <Search className="h-5 w-5 text-indigo-600" />
        <h3 className="text-lg font-bold text-slate-900">Evidence Board</h3>
      </div>
      
      <div className="flex-grow overflow-y-auto space-y-2 pr-1 custom-scrollbar">
        {indicators.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4 text-slate-400">
            <Sparkles className="h-8 w-8 text-slate-300 mb-2" />
            <p className="text-xs">Click suspicious elements in the simulation to log digital clues.</p>
          </div>
        ) : (
          <AnimatePresence>
            {indicators.map((ind) => (
              <motion.button
                key={ind.id || ind.label}
                layout
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  ind.found 
                    ? ind.type === 'danger' 
                      ? 'bg-rose-50 border-rose-200 text-rose-950' 
                      : 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
                onClick={() => onEvidenceCollected && onEvidenceCollected(ind.id)}
              >
                <div className="flex justify-between items-start gap-2">
                  <span className="text-xs font-bold">{ind.label}</span>
                  {ind.found && (
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${ind.type === 'danger' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      +{ind.points || 10} pts
                    </span>
                  )}
                </div>
                {ind.analysis && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-1.5 text-[11px] text-slate-600 leading-normal">
                    {ind.analysis}
                  </motion.div>
                )}
              </motion.button>
            ))}
          </AnimatePresence>
        )}
      </div>
      
      <div className="mt-4 pt-3 border-t border-slate-100">
        <div className="flex justify-between items-end mb-1.5">
          <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Threat Confidence</span>
          <span className="text-xs font-mono font-bold text-indigo-600">{currentScore}/{maxScore}</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, (currentScore / maxScore) * 100)}%` }}
          />
        </div>
      </div>
    </GlassCard>
  );
};

EvidenceBoard.propTypes = {
  indicators: PropTypes.array,
  onEvidenceCollected: PropTypes.func,
  maxScore: PropTypes.number,
};

export default EvidenceBoard;

