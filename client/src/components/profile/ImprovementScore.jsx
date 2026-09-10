import React from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../common/GlassCard';
import PropTypes from 'prop-types';
import { TrendingUp, TrendingDown } from 'lucide-react';
import AnimatedCounter from '../common/AnimatedCounter';

const ImprovementScore = ({ firstAttemptScore = 40, currentScore = 85 }) => {
  const improvement = currentScore - firstAttemptScore;
  const isPositive = improvement >= 0;

  return (
    <GlassCard glowColor={isPositive ? 'cyan' : 'red'}>
      <h3 className="text-sm font-bold text-slate-400 tracking-widest uppercase mb-4">Improvement Over Time</h3>
      
      <div className="flex items-center justify-between mb-6">
        <div className="text-center">
          <p className="text-xs text-slate-500 uppercase mb-1">First Attempt</p>
          <p className="text-2xl font-mono font-bold text-slate-300">{firstAttemptScore}</p>
        </div>
        
        <div className="flex-grow px-4 flex flex-col items-center">
          <div className={`flex items-center justify-center h-12 w-12 rounded-full border-2 mb-2 ${
            isPositive ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-red-500/20 border-red-500 text-red-400'
          }`}>
            {isPositive ? <TrendingUp className="h-6 w-6" /> : <TrendingDown className="h-6 w-6" />}
          </div>
          <div className={`text-lg font-bold font-mono ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? '+' : ''}
            <AnimatedCounter value={improvement} />%
          </div>
        </div>

        <div className="text-center">
          <p className="text-xs text-cyan-400 uppercase mb-1 drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]">Current</p>
          <p className="text-3xl font-mono font-bold text-cyan-400"><AnimatedCounter value={currentScore} /></p>
        </div>
      </div>
      
      <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden flex">
        <motion.div 
          initial={{ width: 0 }} 
          animate={{ width: `${firstAttemptScore}%` }} 
          className="h-full bg-slate-600" 
        />
        <motion.div 
          initial={{ width: 0 }} 
          animate={{ width: `${improvement}%` }} 
          className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]" 
        />
      </div>
    </GlassCard>
  );
};

ImprovementScore.propTypes = {
  firstAttemptScore: PropTypes.number,
  currentScore: PropTypes.number,
};

export default ImprovementScore;
