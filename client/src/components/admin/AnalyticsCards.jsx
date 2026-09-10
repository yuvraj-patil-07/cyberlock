import React from 'react';
import GlassCard from '../common/GlassCard';
import PropTypes from 'prop-types';
import { Users, Target, ShieldAlert, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const AnalyticsCards = ({ data }) => {
  const defaultData = {
    totalPlayers: { value: 12450, trend: 12, isUp: true },
    avgScore: { value: 68, trend: 5, isUp: true },
    completionRate: { value: 42, trend: 2, isUp: false },
    mostCommonWeakness: { value: 'QR Safety', trend: null, isUp: null },
  };

  const stats = data || defaultData;

  const cards = [
    { title: 'Total Players', value: stats.totalPlayers.value.toLocaleString(), icon: Users, color: 'text-cyan-400', trend: stats.totalPlayers.trend, isUp: stats.totalPlayers.isUp, suffix: '' },
    { title: 'Avg Cyber Score', value: stats.avgScore.value, icon: Activity, color: 'text-green-400', trend: stats.avgScore.trend, isUp: stats.avgScore.isUp, suffix: '%' },
    { title: 'Completion Rate', value: stats.completionRate.value, icon: Target, color: 'text-purple-400', trend: stats.completionRate.trend, isUp: stats.completionRate.isUp, suffix: '%' },
    { title: 'Common Weakness', value: stats.mostCommonWeakness.value, icon: ShieldAlert, color: 'text-red-400', trend: null, isUp: null, suffix: '' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <GlassCard key={card.title} padding="p-5">
          <div className="flex justify-between items-start mb-4">
            <div className={`p-2 rounded-lg bg-slate-800 border border-slate-700`}>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </div>
            {card.trend !== null && (
              <div className={`flex items-center text-xs font-bold ${card.isUp ? 'text-green-400' : 'text-red-400'}`}>
                {card.isUp ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                {card.trend}%
              </div>
            )}
          </div>
          <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-1">{card.title}</h4>
          <div className="text-2xl font-bold text-slate-100 font-mono">
            {card.value}{card.suffix}
          </div>
        </GlassCard>
      ))}
    </div>
  );
};

AnalyticsCards.propTypes = {
  data: PropTypes.object,
};

export default AnalyticsCards;
