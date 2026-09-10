import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const TrustScoreBar = ({ score = 100, className = '' }) => {
  const getColor = (val) => {
    if (val >= 80) return 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]';
    if (val >= 60) return 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]';
    if (val >= 40) return 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]';
    return 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]';
  };

  const colorClass = getColor(score);

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-end mb-1">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Trust Score</span>
        <span className="text-sm font-mono font-bold text-slate-800">{score}/100</span>
      </div>
      <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden border border-slate-300/60">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`h-full rounded-full ${colorClass}`}
        />
      </div>
    </div>
  );
};

TrustScoreBar.propTypes = {
  score: PropTypes.number,
  className: PropTypes.string,
};

export default TrustScoreBar;
