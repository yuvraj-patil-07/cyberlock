import React from 'react';
import GlassCard from '../common/GlassCard';
import PropTypes from 'prop-types';
import { ShieldAlert, Info } from 'lucide-react';

const RiskScore = ({ riskLevel = 'MEDIUM', overallScore = 65 }) => {
  const levels = {
    LOW: { color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/50', label: 'LOW RISK' },
    MEDIUM: { color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/50', label: 'MODERATE RISK' },
    HIGH: { color: 'text-orange-400', bg: 'bg-orange-500/20', border: 'border-orange-500/50', label: 'HIGH RISK' },
    CRITICAL: { color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/50', label: 'CRITICAL RISK' },
  };

  const current = levels[riskLevel] || levels.MEDIUM;

  return (
    <GlassCard>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-slate-400" />
            Estimated Cyber Risk
          </h3>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <Info className="h-3 w-3" /> Educational purpose only
          </p>
        </div>
        
        <div className={`px-4 py-2 rounded-lg border-2 ${current.bg} ${current.border}`}>
          <span className={`font-bold tracking-widest ${current.color}`}>
            {current.label}
          </span>
        </div>
      </div>

      <div className="relative pt-8 pb-4">
        <div className="absolute top-0 left-[50%] -translate-x-[50%] -translate-y-[50%] bg-slate-900 px-4">
          <span className="text-4xl font-mono font-bold text-slate-200">{overallScore}</span>
          <span className="text-sm text-slate-500 ml-1">/100</span>
        </div>
        
        <div className="h-4 w-full rounded-full overflow-hidden flex border border-white/10">
          <div className="h-full bg-red-500 w-[25%]" title="Critical (0-25)" />
          <div className="h-full bg-orange-500 w-[25%]" title="High (26-50)" />
          <div className="h-full bg-yellow-500 w-[25%]" title="Medium (51-75)" />
          <div className="h-full bg-green-500 w-[25%]" title="Low (76-100)" />
        </div>
        
        <div className="absolute top-2 w-0.5 h-8 bg-white shadow-[0_0_10px_rgba(255,255,255,1)] transition-all duration-1000 ease-out" 
             style={{ left: `${overallScore}%` }} 
        />
      </div>

      <p className="text-sm text-slate-400 mt-4">
        Your current risk profile suggests you are vulnerable to targeted phishing attacks but have strong password habits.
      </p>
    </GlassCard>
  );
};

RiskScore.propTypes = {
  riskLevel: PropTypes.oneOf(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  overallScore: PropTypes.number,
};

export default RiskScore;
