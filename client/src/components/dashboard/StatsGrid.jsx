import React from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../common/GlassCard';
import AnimatedCounter from '../common/AnimatedCounter';
import PropTypes from 'prop-types';
import { Shield, Star, Heart, TrendingUp, Target, Activity } from 'lucide-react';

const StatsGrid = ({ stats }) => {
  const { level, xp, lives, trustScore, gamesPlayed, accuracy } = stats || {};

  const items = [
    { label: 'Level', value: level || 1, icon: Star, color: 'text-yellow-400' },
    { label: 'XP', value: xp || 0, icon: Activity, color: 'text-cyan-400' },
    { label: 'Lives', value: lives || 3, icon: Heart, color: 'text-red-400' },
    { label: 'Trust Score', value: trustScore || 100, icon: Shield, color: 'text-green-400', suffix: '/100' },
    { label: 'Missions', value: gamesPlayed || 0, icon: Target, color: 'text-purple-400' },
    { label: 'Accuracy', value: accuracy || 0, icon: TrendingUp, color: 'text-blue-400', suffix: '%' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {items.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <GlassCard padding="p-4" className="flex flex-col items-center justify-center text-center h-full hover:bg-cyan-50/50 transition-colors">
            <item.icon className={`h-6 w-6 mb-2 ${item.color}`} />
            <div className="text-2xl font-bold font-mono text-slate-900 flex items-center">
              <AnimatedCounter value={item.value} />
              {item.suffix && <span className="text-sm ml-1 text-slate-500">{item.suffix}</span>}
            </div>
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">{item.label}</div>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
};

StatsGrid.propTypes = {
  stats: PropTypes.shape({
    level: PropTypes.number,
    xp: PropTypes.number,
    lives: PropTypes.number,
    trustScore: PropTypes.number,
    gamesPlayed: PropTypes.number,
    accuracy: PropTypes.number,
  }),
};

export default StatsGrid;
