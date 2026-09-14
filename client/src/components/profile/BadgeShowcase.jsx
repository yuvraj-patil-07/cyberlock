import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../common/GlassCard';
import Modal from '../common/Modal';
import PropTypes from 'prop-types';
import { Eye, Key, Shield, Lock, Zap, CheckCircle2 } from 'lucide-react';

const BadgeShowcase = ({ earnedBadges, allBadges }) => {
  const [selected, setSelected] = useState(null);

  const defaultAll = [
    { id: '1', name: 'Phish Finder', icon: Eye, description: 'Correctly identified 5 phishing emails.', rarity: 'common', color: 'text-cyan-400', earned: true, date: '2023-10-15' },
    { id: '2', name: 'Password Pro', icon: Key, description: 'Created a password with maximum entropy.', rarity: 'rare', color: 'text-green-400', earned: true, date: '2023-10-20' },
    { id: '3', name: 'Zero Trust', icon: Shield, description: 'Maintained a 100% trust score for 3 missions.', rarity: 'epic', color: 'text-purple-400', earned: true, date: '2023-11-01' },
    { id: '4', name: 'Vault Keeper', icon: Lock, description: 'Complete the Password Room on Hard difficulty.', rarity: 'rare', color: 'text-slate-500', earned: false },
    { id: '5', name: 'Quick Thinker', icon: Zap, description: 'Complete any room in under 2 minutes.', rarity: 'legendary', color: 'text-yellow-400', earned: false },
  ];

  const badges = allBadges || defaultAll;
  const earnedCount = badges.filter(b => b.earned).length;

  const rarityColors = {
    common: 'border-slate-500 text-slate-400',
    rare: 'border-blue-500 text-blue-400',
    epic: 'border-purple-500 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.3)]',
    legendary: 'border-yellow-500 text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.5)]',
  };

  return (
    <GlassCard>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-slate-100">Badge Showcase</h3>
        <span className="text-sm font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
          {earnedCount} / {badges.length} Unlocked
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {badges.map((badge, idx) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => setSelected(badge)}
            className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center p-4 cursor-pointer transition-all ${
              badge.earned 
                ? `bg-slate-800 border-2 ${rarityColors[badge.rarity]} hover:scale-105` 
                : 'bg-slate-900/50 border border-slate-800 grayscale opacity-50 hover:opacity-75'
            }`}
          >
            <badge.icon className={`h-10 w-10 mb-2 ${badge.earned ? badge.color : 'text-slate-500'}`} />
            <span className="text-xs font-bold text-center leading-tight truncate w-full text-slate-300">
              {badge.name}
            </span>
            {badge.earned && <CheckCircle2 className="absolute top-2 right-2 h-4 w-4 text-green-400" />}
          </motion.div>
        ))}
      </div>

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Badge Detail">
        {selected && (
          <div className="flex flex-col items-center text-center">
            <div className={`p-4 rounded-2xl bg-slate-800 border-2 mb-6 relative overflow-hidden ${
              selected.earned ? rarityColors[selected.rarity] : 'border-slate-700'
            }`}>
              {selected.earned && <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />}
              <selected.icon className={`h-20 w-20 relative z-10 ${selected.earned ? selected.color : 'text-slate-500'}`} />
            </div>
            
            <h3 className="text-2xl font-bold text-slate-100 mb-1">{selected.name}</h3>
            
            <div className="flex gap-2 mb-4">
              <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                selected.earned ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}>
                {selected.earned ? 'Unlocked' : 'Locked'}
              </span>
              <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${rarityColors[selected.rarity]} bg-slate-900`}>
                {selected.rarity}
              </span>
            </div>
            
            <p className="text-slate-300 mb-4">{selected.description}</p>
            
            {selected.earned && selected.date && (
              <p className="text-xs text-slate-500 font-mono">Earned on {new Date(selected.date).toLocaleDateString()}</p>
            )}
          </div>
        )}
      </Modal>
    </GlassCard>
  );
};

BadgeShowcase.propTypes = {
  earnedBadges: PropTypes.array,
  allBadges: PropTypes.array,
};

export default BadgeShowcase;
