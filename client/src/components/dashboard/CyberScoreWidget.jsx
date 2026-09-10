import React from 'react';
import GlassCard from '../common/GlassCard';
import ProgressRing from '../common/ProgressRing';
import PropTypes from 'prop-types';

const CyberScoreWidget = ({ score = 0 }) => {
  let color = '#06b6d4'; // cyan
  if (score < 40) color = '#ef4444'; // red
  else if (score < 80) color = '#eab308'; // yellow
  else color = '#22c55e'; // green

  return (
    <GlassCard glowColor="cyan" className="flex flex-col items-center justify-center text-center">
      <h3 className="text-sm font-bold text-slate-700 tracking-widest mb-4 uppercase">CYBER SCORE</h3>
      <ProgressRing value={score} size={160} strokeWidth={12} color={color} />
      <p className="mt-4 text-xs text-slate-500 max-w-[200px] font-medium">
        Your overall security posture based on mission performance.
      </p>
    </GlassCard>
  );
};

CyberScoreWidget.propTypes = {
  score: PropTypes.number,
};

export default CyberScoreWidget;
